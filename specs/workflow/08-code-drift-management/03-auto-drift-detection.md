---
doc: workflow/08-code-drift-management/03-auto-drift-detection
type: workflow-method
phase: code-drift-management
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# Automated Drift Detection — CI Integration + Git Hooks

> Implementation guidance for **continuous (Layer 1) drift detection**. Catches Type 1 (citation) + Type 2 (field/enum) drift automatically on every PR. Layer 2 (scheduled) + Layer 3 (triggered) still needed for Type 3 (behavioral) + Type 4 (architectural).

## Architecture

```
[git push to branch X]
        ↓
[PR opened → triggers CI]
        ↓
[CI runs zeespec-drift-scan]
        ├── Parse all spec files in docs/specs/zeespec/
        ├── Extract: file:line citations, entity field counts, enum case counts
        ├── For each: grep production code for current state
        ├── Compare spec claim vs current state
        ├── Generate report with severity per `02-drift-categorization.md`
        ↓
[CI posts comment on PR with findings]
        ↓
[PR reviewer reads + decides:
  - Drift is acceptable → merge, file as B1 finding
  - Drift indicates undocumented change → spec update required pre-merge
  - Drift indicates bug → spawn chip pre-merge]
```

## Drift scan script (reference implementation)

A drift-scan script is a small program (bash / python / node) that:

1. Reads all `.md` files in `docs/specs/zeespec/<module>/`
2. Extracts citations + counts
3. Queries production code
4. Outputs report

Reference implementation in shell (adapt to your stack):

```bash
#!/usr/bin/env bash
# zeespec-drift-scan.sh
# Usage: zeespec-drift-scan.sh --spec-dir docs/specs/zeespec --code-dir backend/src

set -euo pipefail

SPEC_DIR="docs/specs/zeespec"
CODE_DIR="backend/src"
OUTPUT="drift-report.md"

while [[ $# -gt 0 ]]; do
  case $1 in
    --spec-dir) SPEC_DIR="$2"; shift 2 ;;
    --code-dir) CODE_DIR="$2"; shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

echo "# 🔍 ZeeSpec Drift Scan Results" > "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Scan date: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUTPUT"
echo "Spec dir: $SPEC_DIR" >> "$OUTPUT"
echo "Code dir: $CODE_DIR" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Iterate every module
for module_dir in "$SPEC_DIR"/*/; do
  module=$(basename "$module_dir")
  
  # Skip non-module dirs (e.g., _meta, templates)
  if [[ "$module" == "_"* || "$module" == "templates" || "$module" == "overlays" ]]; then
    continue
  fi
  
  echo "## Module: \`$module\`" >> "$OUTPUT"
  echo "" >> "$OUTPUT"

  # === Type 1: Citation drift ===
  
  citation_count=0
  drift_count=0
  
  # Match patterns like `file/path.ext:NNN` in spec markdown
  while IFS= read -r citation; do
    citation_count=$((citation_count + 1))
    
    # Parse "path/to/file.ext:NN[-NN]"
    file_path=$(echo "$citation" | cut -d':' -f1)
    line_spec=$(echo "$citation" | cut -d':' -f2 | tr -d '-')
    line_num=$(echo "$line_spec" | head -c 5 | sed 's/[^0-9]//g')
    
    full_path="$CODE_DIR/$file_path"
    
    if [[ ! -f "$full_path" ]]; then
      drift_count=$((drift_count + 1))
      echo "- ⚠️ **File not found:** \`$file_path\` (cited in $(grep -l "$citation" "$module_dir"*.md | head -1))" >> "$OUTPUT"
    fi
  done < <(grep -rohE '[a-zA-Z_][a-zA-Z0-9_/.-]+\.[a-z]+:[0-9]+' "$module_dir" || true)
  
  if [[ $drift_count -eq 0 ]]; then
    echo "### ✅ Type 1 (citation): no drift (${citation_count} citations checked)" >> "$OUTPUT"
  else
    echo "### ⚠️ Type 1 (citation): ${drift_count} drift items / ${citation_count} citations" >> "$OUTPUT"
  fi
  echo "" >> "$OUTPUT"

  # === Type 2: Field/enum count drift ===
  
  # Per-stack: this section requires adaptation. Below is PHP+Doctrine example;
  # see workflow/02-b1-verification.md § "Stack-specific grep patterns" for
  # equivalents in Java/Python/TS/Go/Rust/C#/Ruby
  
  # Example: for each entity mentioned in what.md, count fields in spec vs code
  if [[ -f "$module_dir/what.md" ]]; then
    # Extract entity names from what.md "Entities" tables
    # ... (per-stack parsing logic)
    echo "### Type 2 (field/enum): stack-specific scan (configure per-project)" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi
  
  echo "" >> "$OUTPUT"
done

echo "---" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "ℹ️ Automated drift detection. False positives possible." >> "$OUTPUT"
echo "Categorize findings per \`workflow/08-code-drift-management/02-drift-categorization.md\`." >> "$OUTPUT"
```

This is a **starting point** — projects adapt per stack + per their drift signal definition.

## GitHub Actions CI workflow

```yaml
# .github/workflows/zeespec-drift.yml
name: ZeeSpec Drift Detection

on:
  pull_request:
    paths:
      - 'backend/src/**'         # adapt to your code paths
      - 'docs/specs/zeespec/**'
      - 'database/migrations/**'

jobs:
  drift-scan:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write       # to comment on PR
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # full history for diff comparison

      - name: Set up tools
        run: |
          # Install any tools needed by drift-scan script
          # (e.g., ripgrep, jq, language-specific parsers)
          sudo apt-get install -y ripgrep jq

      - name: Run ZeeSpec drift scan
        run: |
          bash scripts/zeespec-drift-scan.sh \
            --spec-dir docs/specs/zeespec \
            --code-dir backend/src \
            --output drift-report.md
        continue-on-error: true   # don't fail PR; let reviewer decide

      - name: Comment on PR with drift findings
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            if (!fs.existsSync('drift-report.md')) return;
            const report = fs.readFileSync('drift-report.md', 'utf8');
            
            // Replace any previous drift-bot comment to avoid noise
            const comments = await github.rest.issues.listComments({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo
            });
            const previous = comments.data.find(c => 
              c.user.login === 'github-actions[bot]' && 
              c.body.startsWith('# 🔍 ZeeSpec Drift Scan')
            );
            
            if (previous) {
              await github.rest.issues.updateComment({
                comment_id: previous.id,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: report
              });
            } else {
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: report
              });
            }

      - name: Upload drift report as artifact
        uses: actions/upload-artifact@v4
        with:
          name: zeespec-drift-report
          path: drift-report.md
          retention-days: 30
```

## GitLab CI workflow

```yaml
# .gitlab-ci.yml fragment
zeespec-drift:
  stage: validate
  image: ubuntu:22.04
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        - backend/src/**/*
        - docs/specs/zeespec/**/*
        - database/migrations/**/*
  before_script:
    - apt-get update && apt-get install -y ripgrep jq curl
  script:
    - bash scripts/zeespec-drift-scan.sh \
        --spec-dir docs/specs/zeespec \
        --code-dir backend/src \
        --output drift-report.md
    - |
      # Post comment via GitLab API
      curl --request POST \
        --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
        --form "body=$(cat drift-report.md)" \
        "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes"
  artifacts:
    paths:
      - drift-report.md
    expire_in: 30 days
```

## Bitbucket Pipelines

```yaml
# bitbucket-pipelines.yml fragment
pipelines:
  pull-requests:
    '**':
      - step:
          name: ZeeSpec Drift Scan
          image: ubuntu:22.04
          condition:
            changesets:
              includePaths:
                - "backend/src/**"
                - "docs/specs/zeespec/**"
          script:
            - apt-get update && apt-get install -y ripgrep jq curl
            - bash scripts/zeespec-drift-scan.sh \
                --spec-dir docs/specs/zeespec \
                --code-dir backend/src \
                --output drift-report.md
            # Comment via Bitbucket API
            - |
              curl --request POST \
                --user "$BB_USER:$BB_APP_PASSWORD" \
                --header "Content-Type: application/json" \
                --data "{\"content\":{\"raw\":\"$(cat drift-report.md | sed 's/"/\\"/g')\"}}" \
                "https://api.bitbucket.org/2.0/repositories/$BITBUCKET_WORKSPACE/$BITBUCKET_REPO_SLUG/pullrequests/$BITBUCKET_PR_ID/comments"
          artifacts:
            - drift-report.md
```

## Git pre-commit hook (developer-side)

For tighter feedback loop (drift catch BEFORE PR opens):

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit (or via husky / pre-commit framework)
# Scans staged changes for drift; warns if drift detected; doesn't block commit

# Get list of staged files
staged_code=$(git diff --cached --name-only --diff-filter=ACM -- 'backend/src/*' || true)
staged_spec=$(git diff --cached --name-only --diff-filter=ACM -- 'docs/specs/zeespec/*' || true)

# Skip if no relevant changes
if [[ -z "$staged_code" && -z "$staged_spec" ]]; then
  exit 0
fi

# Run drift scan against staged state
# (use git stash + scan + restore pattern OR scan against working tree)
echo "🔍 Running ZeeSpec drift scan on staged changes..."
bash scripts/zeespec-drift-scan.sh \
  --spec-dir docs/specs/zeespec \
  --code-dir backend/src \
  --output /tmp/zeespec-precommit-drift.md

# Check for drift findings
if grep -q "⚠️\|🚨" /tmp/zeespec-precommit-drift.md; then
  echo ""
  echo "⚠️ Drift detected in staged changes:"
  echo ""
  cat /tmp/zeespec-precommit-drift.md
  echo ""
  echo "Consider updating spec before committing."
  echo "Continue anyway? [y/N]"
  read -r reply
  if [[ ! "$reply" =~ ^[Yy] ]]; then
    echo "Commit aborted. Update spec or run with --no-verify to bypass."
    exit 1
  fi
fi

exit 0
```

Install via `pre-commit` framework (`https://pre-commit.com`):

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: zeespec-drift-scan
        name: ZeeSpec Drift Detection
        entry: bash scripts/zeespec-drift-scan-staged.sh
        language: system
        pass_filenames: false
        files: '^(backend/src/|docs/specs/zeespec/)'
        stages: [commit]
```

## Husky (JS/TS projects)

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bash scripts/zeespec-drift-scan-staged.sh
```

## Stack-specific drift detectors

The script above does Type 1 (citation) drift generically. Type 2 (field/enum) requires per-stack parsing.

### Java + JPA / Spring

```bash
# Count @Column annotations in entity file
count_columns_java() {
  local entity_file=$1
  rg -c '@Column\b' "$entity_file" || echo 0
}

# Count enum cases
count_enum_cases_java() {
  local enum_file=$1
  rg -c '^\s+[A-Z_]+(,|\()' "$enum_file" || echo 0
}
```

### Python + SQLAlchemy

```bash
count_columns_python_sa() {
  local model_file=$1
  rg -c '= Column\(' "$model_file" || echo 0
}

count_enum_cases_python() {
  local enum_file=$1
  rg -c '^\s+[A-Z_]+\s*=' "$enum_file" || echo 0
}
```

### TypeScript + Prisma

```bash
count_columns_prisma() {
  local schema=$1
  local model_name=$2
  # Extract fields between "model X {" and "}"
  rg -A 100 "^model $model_name \{" "$schema" \
    | rg -m 1 '^\}' -B 100 \
    | rg -c '^\s+\w+\s+\w+'
}
```

### Go + GORM

```bash
count_columns_gorm() {
  local model_file=$1
  rg -c 'gorm:' "$model_file" || echo 0
}
```

### Per-stack table — see `workflow/02-b1-verification.md` § "Stack-specific grep patterns"

## Drift baseline + delta detection

Advanced: instead of scanning from scratch every PR, store a baseline + diff:

```
1. Initial baseline (one-time):
   bash zeespec-drift-scan.sh --output zeespec-baseline.json

2. Every PR:
   bash zeespec-drift-scan.sh --output current-scan.json
   diff zeespec-baseline.json current-scan.json > pr-drift-delta.txt
   
   Report ONLY the delta (new drift) to PR comment.

3. After PR merge:
   mv current-scan.json zeespec-baseline.json
```

This avoids re-reporting drift that's been triaged-as-acceptable.

## Allowlist for false positives

Some "drift" is intentional (pseudocode in spec; not real refs). Mark with comments:

```markdown
<!-- drift-ignore:type-1 -->
Example: a fictional `FakeService.process()` method used in spec illustration
<!-- /drift-ignore -->
```

Drift scanner respects these markers.

## Notification routing

PR comments are fine for active reviewers. But for systemic drift visibility:

- **Slack channel** — daily summary of drift trends across all modules
- **Compliance dashboard** — drift metrics over time (e.g., "wallet module has accumulated 15 unresolved drift items in last quarter")
- **Email digest** — weekly to spec authors

## Performance considerations

For large codebases (>100K LOC):

- Cache parsed spec structure (don't re-parse spec markdown on every PR)
- Incremental scan (only re-check modules whose code/spec changed)
- Parallelize per-module scans
- Pre-compute production stats nightly; PR scan compares against cache

Target: drift scan < 60 seconds per PR for fast feedback.

## Maturity progression

Don't roll out CI drift detection all at once. Progression:

```
Week 1-2: WARN mode for ONE module (highest-risk module)
  ↳ Team reads output, tunes false positives, adds allowlist comments

Week 3-4: WARN mode for all P0/P1 modules
  ↳ Team gets used to seeing drift comments

Month 2: BLOCK mode for HIGH-severity drift (Type 3/4) on P0 modules
  ↳ PR can't merge without addressing P0/P1 drift

Month 3+: BLOCK mode for all material drift
  ↳ Spec stays current; drift is treated as bug
```

Skip "WARN mode" altogether → engineers learn to ignore the noise. Skip "BLOCK mode" altogether → drift accumulates without consequence.

## Anti-patterns

1. **Block-on-day-1** → engineers route around via `--no-verify` flag
2. **Warn-only forever** → no enforcement; signal becomes noise
3. **False-positive tolerance > 20%** → team distrusts the scanner
4. **Drift-scan output not actionable** → must say WHAT to update, not just "drift detected"
5. **No allowlist mechanism** → false positives can't be quieted
6. **CI runs on every push (not just PR)** → wasted compute; PR is enough
7. **Drift detection without resolution playbook** → finding without fixing

## Build-time gate — a broken trace is a broken build

Everything above is a **warn-only** scanner: it comments on the PR and lets the
reviewer decide (`continue-on-error: true`). That is the right first step, but a
spec whose citations no longer resolve is, mechanically, a *broken trace* — and a
broken trace should be able to *break the build* (cf. ReqToCode 2026,
`https://arxiv.org/html/2603.13999` — directional preprint). The enforcing half is
`scripts/ci-drift-gate.sh`: a generic, project-agnostic, **AI-free** gate (grep /
awk / sed only) that an adopting project runs in CI against its own
`docs/specs/zeespec/<module>/` and that **exits nonzero** on violation.

> **Two scripts, two jobs — don't confuse them.** `scripts/ci-drift-gate.sh` is
> the gate ADOPTERS run against THEIR specs+code. `scripts/dogfood-drift-scan.sh`
> is the methodology's OWN self-check against THIS repo (gravity-restatement,
> core-trio version skew, hardcoded paths) — a different target and different
> checks. Adopters do not run the dogfood scan.

### What it enforces deterministically

| Drift type | Gate-enforceable? | How |
|------------|:-----------------:|-----|
| **Type 1** citation | ✅ yes | every `file.ext:NN` cited in a spec must resolve to a real file, and line `NN` must exist in it |
| **Type 2** field/enum count | ✅ yes (opt-in) | counts carrying a `zeespec:count` marker are re-derived from code; mismatch fails |
| **Type 3** behavioral | ❌ no — semantic | needs the R5 agent (`05-R5-drift-scanner-agent.md`) / Layer 2 review |
| **Type 4** architectural | ❌ no — semantic | needs the R5 agent / quarterly architecture review |

The gate refuses to fake Type 3/4: it guards only the mechanical surface. Intent
stays the source of truth, verified by humans + R5 — the gate just stops a
provably-broken trace from merging.

### Type 2 annotation convention

Type 2 needs a code-side anchor, so it is **opt-in**: annotate the count in the
spec, next to the number, with a machine-readable marker. The gate re-derives the
count with `grep -cE pattern file` and fails on mismatch:

```markdown
The `WalletStatus` enum has 4 cases.
<!-- zeespec:count expect=4 file=src/Domain/WalletStatus.php pattern='^\s+case [A-Z]' -->
```

Unmarked numbers are treated as prose (or as a Type 3/4 semantic claim for R5),
not gated. Mark illustrative / pseudo-citations with `<!-- drift-ignore:all -->`
to exempt a whole spec file.

### WARN → FAIL rollout (env-toggled)

Gate mode is set by `ZEESPEC_DRIFT_MODE` so teams roll out without a flag day —
the same progression discipline as *Maturity progression* and *Anti-patterns*
above (block-on-day-1 gets routed around; warn-only-forever becomes noise):

```
ZEESPEC_DRIFT_MODE=warn   # default: print findings, exit 0 (never blocks)
ZEESPEC_DRIFT_MODE=fail   # print findings, exit nonzero on any Type 1/2 drift
```

Start `warn` on one module, tune false positives with `drift-ignore` / count
markers, then flip to `fail` once the signal is trusted.

### GitHub Actions — enforcing gate

This runs *alongside* (not instead of) the warn-comment job above; this one has
no `continue-on-error`, so a broken trace fails the check:

```yaml
# .github/workflows/zeespec-drift-gate.yml
name: ZeeSpec Drift Gate
on:
  pull_request:
    paths:
      - 'docs/specs/zeespec/**'
      - '**/*'                 # also re-gate when cited code moves
jobs:
  drift-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: ZeeSpec drift gate (Type 1/2)
        env:
          ZEESPEC_DRIFT_MODE: warn   # flip to fail once trusted
        run: bash scripts/ci-drift-gate.sh --spec-dir docs/specs/zeespec --code-dir .
```

**GitLab CI:** add a `script:` step running
`ZEESPEC_DRIFT_MODE=fail bash scripts/ci-drift-gate.sh` in a `merge_request_event`
rule. **Bitbucket Pipelines:** the same one-liner as a `pull-requests` step. Both
fail the pipeline on a nonzero exit — no extra wiring needed.

## Cross-references

- `01-drift-detection-strategies.md` — 3-layer model
- `02-drift-categorization.md` — how to triage findings
- `04-drift-resolution-playbook.md` — what to do with findings
- `05-R5-drift-scanner-agent.md` — agent prompt for Type 3/4 (semantic; not gate-able)
- `scripts/ci-drift-gate.sh` — the enforcing adopter gate (Type 1/2; exits nonzero)
- `scripts/dogfood-drift-scan.sh` — the methodology's OWN repo self-check (not for adopters)
- `workflow/02-b1-verification.md` — stack-specific count recipes (Type 2)

## Next

→ `04-drift-resolution-playbook.md` — per-type resolution recipes
→ `05-R5-drift-scanner-agent.md` — AI agent for drift scanning
