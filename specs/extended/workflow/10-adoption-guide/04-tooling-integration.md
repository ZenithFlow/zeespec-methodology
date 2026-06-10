---
doc: extended/workflow/10-adoption-guide/04-tooling-integration
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any team adopting ZeeSpec
---

# Tooling Integration — CI / IDE / Slack / Dashboards

> **How to wire ZeeSpec into your development environment.** Methodology delivers value when integrated into existing workflows; "another doc to maintain" doesn't fly.

## Integration tiers

| Tier | Investment | What you get |
|------|------------|--------------|
| **Tier 0 (Minimal)** | 0 hours | Spec files in git; engineers consult manually |
| **Tier 1 (Basic)** | 4-8 hours | + CI drift detection (WARN mode); PR comments |
| **Tier 2 (Standard)** | 1-2 days | + IDE quick-jump; Slack notifications; weekly dashboards |
| **Tier 3 (Full)** | 1 week | + agent dispatch automation; cost tracking; multi-jurisdiction R4 cron |

Pick what's appropriate for your team. Most teams stop at Tier 2.

## CI integration (Tier 1)

### GitHub Actions (recommended)

Drop into `.github/workflows/zeespec-drift.yml` (full template per `extended/workflow/08-code-drift-management/03-auto-drift-detection.md`).

Reference action — wraps the drift-scan script + posts PR comment:

```yaml
name: ZeeSpec Drift Detection

on:
  pull_request:
    paths:
      - '<your-source-root>/**'
      - 'docs/specs/zeespec/**'

jobs:
  drift-scan:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install tools
        run: |
          sudo apt-get update
          sudo apt-get install -y ripgrep jq

      - name: Run drift scan
        run: bash docs/specs/zeespec/scripts/zeespec-drift-scan.sh > drift-report.md
        continue-on-error: true

      - name: Post PR comment
        if: always()
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: drift-report.md
          header: zeespec-drift
```

### GitLab CI

Pattern same — per `extended/workflow/08-code-drift-management/03-auto-drift-detection.md` § "GitLab CI workflow".

### Cost: ~5 min CI runtime per PR; ~$0 marginal cost.

### Maturity progression

```
Week 1-2: WARN mode for ONE module
Week 3-4: WARN mode for all P0/P1 modules
Month 2:  BLOCK mode for HIGH-severity drift on P0 modules
Month 3+: BLOCK mode for all material drift
```

Per `08/03` § "Maturity progression".

### Reference GitHub Action (not yet packaged)

⚠️ **Gap (per Reviewer C P1):** ZeeSpec doesn't yet ship a packaged GitHub Action. Teams adapt the reference shell script. Plan: future v3.x to ship `zeespec/drift-scan-action` Marketplace action.

Workaround until then: copy the reference script to your `scripts/` folder; reference in your CI.

## IDE integration (Tier 2)

### VS Code / Cursor / Codium

Recommended extensions:

```json
{
  "recommendations": [
    "yzhang.markdown-all-in-one",
    "DavidAnson.vscode-markdownlint",
    "bierner.markdown-mermaid"
  ]
}
```

Workspace settings (`.vscode/settings.json`):

```json
{
  "search.exclude": {
    "docs/specs/zeespec/templates/**": false
  },
  "files.associations": {
    "*.md": "markdown"
  }
}
```

### Quick-jump from code to spec

Add commit-msg hook or git alias to jump from a method to its ZeeSpec INV/HW:

```bash
# git alias: git zeespec WAL INV-WAL-04
git config --global alias.zeespec '!f() { rg "$2" docs/specs/zeespec/$1/ --type md; }; f'
```

Usage:

```bash
git zeespec wallet INV-WAL-04
# → finds the INV-WAL-04 entry across the wallet module's spec files
```

### Claude Code / Cursor agent context

Add to project `CLAUDE.md`:

```markdown
## Spec methodology

This project uses ZeeSpec. Before writing or modifying code in a ZeeSpec-codified module:
1. Read `docs/specs/zeespec/core/workflow/00-START-HERE.md`
2. Read the module's `CLAUDE.md`
3. Read the relevant dimension file (what.md / how.md / etc.)
4. Cite INV-MOD-NN / HW-MOD-NN / ADR-MOD-NNN in code comments
5. If 🔴 OPEN gap blocks you → STOP, ask user

Status tags:
- ✅ IMPL = production-verified; rely
- 🟡 PARTIAL = app-layer only; add defense-in-depth
- 🚧 DESIGN = NOT in production; do NOT rely
```

AI agent will read this on session start.

## Slack integration (Tier 2)

### `#zeespec` channel notifications

Set up webhooks for:

1. **CI drift findings** — when PR drift scan finds P0/P1 items:
   ```
   🔍 Drift detected in PR #1234 (wallet module)
   - 🚨 P0: 1 finding (KYC enforcement removed)
   - 🟠 P1: 2 findings
   - PR: <link>
   ```

2. **R4 amendment alerts** — when R4 agent finds law amendment:
   ```
   📜 Regulatory amendment detected
   - Jurisdiction: Mongolia
   - Source: AML/CFT Law Art. 11.1.1
   - Change: CTR threshold raised 20M → 30M MNT
   - Effective: 2028-09-01
   - Affected: INV-KYC-04 (wallet, kyc-aml modules)
   - Action: re-research session needed
   ```

3. **ADR status changes** — when ADR superseded / deprecated:
   ```
   📋 ADR-WAL-005 superseded by ADR-WAL-027
   - Decision: switch from Doctrine to raw SQL + sqlc
   - Effective: 2028-03-15
   - Affected modules: wallet, accounting, settlement
   ```

4. **Weekly drift digest**:
   ```
   📊 ZeeSpec Weekly — Week of YYYY-MM-DD
   - 12 drift findings detected
   - 8 resolved (T1 spec edits)
   - 2 chips filed (production bugs)
   - 2 retroactive ADRs proposed
   - Open drift > 30 days: 1 (Gap-WAL-DRIFT-04)
   ```

Implementation: cron job runs every Monday; queries CI artifact storage; posts to Slack via webhook.

## Dashboard integration (Tier 2-3)

### Compliance dashboard

Suggested metrics (display via Grafana / DataDog / internal dashboard):

| Metric | Goal | Alert threshold |
|--------|------|-----------------|
| Tier 1 modules | Trending up | n/a |
| Open drift items (P0) | 0 | > 0 for > 7 days |
| Open drift items (P1) | < 5 | > 10 for > 30 days |
| Open ADR (Proposed) | < 5 | > 10 for > 30 days |
| R4 sources past re-check date | 0 | > 0 |
| Spawn chips open | < 10 | > 20 |
| CI drift scan SNR | > 80% | < 60% (too noisy) |

Pull metrics from:
- Git: count Tier 1 modules (CLAUDE.md frontmatter `status: tier-1`)
- CI artifacts: drift report aggregation
- `_meta/regulatory-source-registry.md`: parse re-check dates
- `_meta/spawn-chips.md`: open chip count
- ADR files: status counts

### Source registry dashboard

For R4 maintenance — display:

```
Regulatory sources at a glance:
- Mongolia AML/CFT Law (SRC-AML-MN-2017)
  Retrieved: 2026-05-18 | Next check: 2026-11-18 | Status: ✅
- Mongolia Investment Fund Law (SRC-INVFUND-MN-2013)
  Retrieved: 2026-05-18 | Next check: 2026-11-18 | Status: ✅
- FRC Money Loan Policy Decision (SRC-FRC-MLPC-2024)
  Retrieved: 2026-05-18 | Next check: 2026-08-18 | Status: ⚠️ DUE SOON
- ...
```

Auto-alert when any source crosses "next check" date.

## Agent dispatch automation (Tier 3)

For enterprise teams running R4/R5/R6 agents on schedule:

### Cron-style agent dispatch (Claude Code)

`.github/workflows/zeespec-cron.yml`:

```yaml
name: ZeeSpec Scheduled Agents

on:
  schedule:
    - cron: '0 6 * * 1'   # Monday 6am UTC — weekly R5 drift sweep
    - cron: '0 6 1 * *'    # 1st of month 6am UTC — monthly R5 deep scan
    - cron: '0 6 1 */3 *'  # Quarterly — R4 re-validation
    - cron: '0 6 15 5 *'   # Annual May 15 — R6 ADR review

jobs:
  weekly-drift-sweep:
    if: github.event.schedule == '0 6 * * 1'
    runs-on: ubuntu-latest
    steps:
      - name: Dispatch R5 quick-scan agent
        run: |
          # Pseudo-code; adapt to your AI dispatch infrastructure
          claude-agent dispatch \
            --prompt-file docs/specs/zeespec/extended/workflow/08-code-drift-management/05-R5-drift-scanner-agent.md \
            --mode quick-scan \
            --output drift-weekly.md
          # Post drift findings to PR comment / Slack
```

### Cost tracking

Per Reviewer C P1: methodology should publish cost expectations. Approximate per quarter for Tier B (5 modules):

| Agent | Frequency | Tokens / dispatch | Cost / dispatch (Sonnet 4) | Quarterly cost |
|-------|-----------|---------------------|-----------------------------|-----------------|
| R5 drift scan (quick) | Weekly | ~30K | ~$0.50 | $6.50 |
| R5 drift scan (deep) | Monthly | ~80K | ~$1.30 | $4 |
| R6 ADR draft | Per finding (~5/quarter) | ~50K | ~$0.80 | $4 |
| R6 ADR annual review | Annual | ~150K | ~$2.50 | $0.60 (amortized) |
| R4 research session | Per topic | ~100K | ~$1.70 | $5 (1-2 topics) |
| R4 re-validation | Annual per source | ~30K | ~$0.50 | $4 (8 sources / year) |
| **Quarterly total per 5 modules** | | | | **~$25** |

Annual cost per 5 modules: ~$100. Negligible relative to engineer time saved.

Larger teams / Opus-class models: 3-5× cost. Still under $500/year for most projects.

## Common integration mistakes

### Mistake 1: CI drift scan posts noise nobody reads

**Symptom:** PR comments accumulate; engineers ignore.

**Fix:**
- Use `sticky-pull-request-comment` action to UPDATE not APPEND
- Suppress comment when no drift detected (empty report = no comment)
- Tune SNR aggressively in first 2 weeks; add allowlist for false positives

### Mistake 2: Slack notifications too frequent

**Symptom:** #zeespec channel becomes spam; team mutes.

**Fix:**
- Per-event notifications ONLY for P0/P1 findings
- Weekly digest for everything else
- Use threaded replies (notification stays in 1 channel)

### Mistake 3: Dashboard never looked at

**Symptom:** Dashboard built but no one references in meetings.

**Fix:**
- Tie dashboard to existing meetings (sprint retro, monthly compliance review)
- Add KPI(s) to team performance review
- Make dashboard accessible (don't bury behind 5 clicks)

### Mistake 4: Cron-dispatched agents fail silently

**Symptom:** Weekly R5 agent stopped running 3 months ago; nobody noticed.

**Fix:**
- Monitor agent dispatch success (alert if no run in 2x expected interval)
- Cost report monthly (zero cost = something broken)

## Tooling for non-Claude-Code environments

If your team uses Copilot CLI / Cursor / other:

| ZeeSpec dependency | Claude Code | Cursor | Copilot CLI | GitHub Copilot |
|--------------------|:-----------:|:------:|:-----------:|:--------------:|
| Agent dispatch | ✅ native | ✅ via composer | ✅ via skill | ⚠️ via API |
| WebFetch (R4) | ✅ | ⚠️ via MCP | ⚠️ varies | ❌ manual |
| Bash tool | ✅ | ✅ | ✅ | ❌ |
| Multi-agent parallel | ✅ native | ⚠️ sequential | ⚠️ sequential | ❌ |
| Background agents | ✅ | ⚠️ limited | ⚠️ limited | ❌ |

Adaptation: in Copilot CLI / Cursor, run R4/R5/R6 sequentially instead of parallel. Slower but functional.

For environments without WebFetch (Q3 P1 finding): R4 becomes manual research; agent prompt is checklist guide rather than executor.

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `01-adopting-zeespec-from-scratch.md` / `02-onboarding-existing-project.md` — when to add tooling
- `extended/workflow/08-code-drift-management/03-auto-drift-detection.md` — CI script reference
- `extended/workflow/07-r4-regulatory-research/09-amendment-tracking.md` — source monitoring patterns

## Next

→ `05-cross-domain-adaptation.md` — applying to non-finance domains
→ `06-common-pitfalls.md` — what kills adoption
