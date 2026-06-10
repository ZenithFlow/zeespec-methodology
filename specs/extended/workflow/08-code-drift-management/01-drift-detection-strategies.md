---
doc: extended/workflow/08-code-drift-management/01-drift-detection-strategies
type: workflow-method
phase: code-drift-management
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# Drift Detection Strategies — Continuous + Scheduled + Triggered

> Three layers of drift detection, each catching different drift types at different cadences. Use ALL THREE — none alone is sufficient.

## The 3-layer detection model

```
┌────────────────────────────────────────────────────────────────┐
│ LAYER 1: CONTINUOUS (auto; PR-time)                           │
│   - CI workflow runs on every PR                              │
│   - Detects Type 1 (citation) + Type 2 (field/enum) drift     │
│   - Output: PR comment with drift candidates                  │
│   - Cost: ~30 sec per PR; ~$0 marginal                        │
├────────────────────────────────────────────────────────────────┤
│ LAYER 2: SCHEDULED (manual; monthly/quarterly)                │
│   - Compliance officer / spec author dedicated time           │
│   - Detects Type 3 (behavioral) drift                         │
│   - Output: drift report → spec updates + chips               │
│   - Cost: 2-4h per module per quarter                         │
├────────────────────────────────────────────────────────────────┤
│ LAYER 3: TRIGGERED (manual; event-driven)                     │
│   - Refactor planned / new feature / production bug fix       │
│   - Detects Type 3 + Type 4 (architectural) drift             │
│   - Output: pre-flight drift report → spec updates pre-PR     │
│   - Cost: 1-2h per trigger event                              │
└────────────────────────────────────────────────────────────────┘
```

## Layer 1 — Continuous (CI/PR-time)

### What it catches

- File renamed / moved → spec citation broken
- New entity field added → spec field count out of date
- New enum case added → spec enum count out of date
- Method renamed → spec citation broken
- Method moved to different file → spec citation broken
- Line ref drifted > 50 lines

### What it does NOT catch

- Behavioral changes (Type 3) — code still works; spec semantics may now be wrong
- Architectural changes (Type 4) — humans see; automation doesn't

### How to implement

See `03-auto-drift-detection.md` for full CI / git-hook examples. Quick form:

```yaml
# .github/workflows/zeespec-drift.yml (GitHub Actions example)
name: ZeeSpec Drift Detection

on:
  pull_request:
    paths:
      - 'backend/src/**'
      - 'docs/specs/zeespec/**'

jobs:
  drift-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # full history for diff comparison

      - name: Scan for citation drift
        run: |
          # For each module with a ZeeSpec, check all file:line citations
          # in spec files; verify cited symbols still exist + at cited line
          ./scripts/zeespec-drift-scan.sh \
            --spec-dir docs/specs/zeespec \
            --code-dir backend/src \
            --output drift-report.md

      - name: Comment on PR with drift findings
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            if (fs.existsSync('drift-report.md')) {
              const report = fs.readFileSync('drift-report.md', 'utf8');
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: report
              });
            }
```

### Output format

PR comment should look like:

```markdown
## 🔍 ZeeSpec Drift Scan Results

### Module: `wallet`

#### ✅ No citation drift

#### ⚠️ Field/enum drift detected (2)

| Spec claim | Production | Spec file:line |
|------------|------------|----------------|
| `Wallet` entity has 12 columns | **14** columns (+2: `freeze_reason`, `frozen_until`) | `docs/specs/zeespec/wallet/what.md:23` |
| `WalletStatus` enum has 4 cases | **5** cases (+`SUSPENDED`) | `docs/specs/zeespec/wallet/what.md:48` |

**Recommended action:**
- Update `what.md` § 1.1 Wallet entity table with 2 new fields
- Update `what.md` § 1.X WalletStatus enum (add SUSPENDED + describe semantics)
- If new fields introduce invariants → add INV-WAL-NN entries
- File as drift items in CLAUDE.md (B1 verification YYYY-MM-DD section)

### Module: `accounting`

#### ✅ No drift detected.

---

ℹ️ This is automated drift detection. False positives possible. Reviewer
discretion required. See `extended/workflow/08-code-drift-management/02-drift-categorization.md`
for severity calibration.
```

### Tuning signal-to-noise

CI drift detection can produce noise. Tune by:

1. **Allowlist known-OK drift** — some spec lines describe pseudocode, not real refs; mark with `<!-- drift-ignore -->` comment
2. **Threshold tuning** — only alert if drift > N lines (e.g., 50 lines) or count diff > M (e.g., 2 fields)
3. **Block vs warn** — start with "warn only"; escalate to "block PR" once team trusts the signal
4. **Module-level enablement** — turn on per-module gradually (Tier 1 modules first; greenfield exempt)

## Layer 2 — Scheduled (monthly/quarterly)

### What it catches

- Type 3 (behavioral) drift that automation can't see:
  - Algorithm changed inside a method (method still exists at same line; behavior different)
  - New code paths added (e.g., new conditional branch that bypasses an invariant)
  - Removed validation (validation removed; method signature unchanged)
  - Cross-module call changed (caller behavior changed; callee unchanged)

### Cadence

| Module risk profile | Cadence |
|--------------------|---------|
| 🚨 P0-critical (money, compliance) | Monthly |
| 🟠 P1 (audit/regulatory adjacent) | Quarterly |
| 🟡 P2 (internal logic) | Semi-annually |
| 🟢 P3 (utilities / non-critical) | Annually |

### Workflow

For each scheduled review:

```
1. Pre-work (30 min):
   □ Pull latest spec + latest code
   □ Review last drift report — what was open?
   □ Review commit log for the module since last review
   □ Scan PRs merged since last review

2. Per-module deep scan (1-2 hours):
   □ Read spec dimension files (what.md, how.md, who.md)
   □ Open the corresponding production files
   □ For each ALG-MOD-NN: trace the algorithm in code; verify match
   □ For each INV-MOD-NN: search code for enforcement; verify status
   □ For each HW-MOD-NN: verify constraint is still honored
   □ For each SOD-MOD-NN: verify enforcement path exists

3. Findings capture (30 min):
   □ List findings with severity per `severity-matrix.md`
   □ For Type 3 drift: categorize → bug or design change?
   □ For each finding: spec update OR spawn chip OR ADR

4. Apply (1 hour):
   □ Spec edits for documented drift
   □ Spawn chips for production bugs
   □ Note in CLAUDE.md "Drift items (drift scan YYYY-MM-DD)" table
```

### Output template

```markdown
## Drift Scan Report — `<module>` YYYY-MM-DD

**Scope:** Module `<module>` ZeeSpec vs production code
**Scanner:** [name] OR R5 agent
**Time spent:** N hours
**Commits scanned:** <commit-range>

### Summary

- Type 1 (citation): N findings
- Type 2 (field/enum): M findings
- Type 3 (behavioral): K findings ← typically most important
- Type 4 (architectural): J findings

### Type 1 findings

[file:line citation diffs; usually mass find+replace]

### Type 2 findings

[field/enum count tables]

### Type 3 findings

#### Gap-MOD-DRIFT-01 — [behavior description]
- **Severity:** [🟠 P1 / 🚨 P0]
- **Spec says:** [what spec claims]
- **Code does:** [actual behavior + file:line]
- **Diagnosis:** [bug / intentional change / regression]
- **Resolution:** [spec edit / spawn chip / ADR]

[...]

### Type 4 findings

[architectural changes warranting full ADR + re-author]

### Actions taken

- [N] Type 1 spec edits committed
- [M] Type 2 spec edits committed
- [K] Type 3 spawn chips created OR ADRs written
- [J] Type 4 escalations to architect review

### Re-scan due

Next scheduled review: YYYY-MM-DD
```

## Layer 3 — Triggered (event-driven)

### Trigger events

Drift scan triggered BEFORE these events:

| Event | Why pre-scan? |
|-------|--------------|
| Major refactor planned | Verify current spec describes reality before changes; without baseline, drift compounds |
| New feature touching ZeeSpec module | New code may add invariants; existing spec may have gaps |
| Production incident | Incident may reveal undocumented behavior or bug |
| Module ownership transfer | Outgoing engineer documents current state; incoming engineer inherits accurate spec |
| Compliance audit prep | Surface drift before auditor finds it |
| Major dependency upgrade (framework, ORM, runtime) | Behavior may change subtly |

Drift scan triggered AFTER these events:

| Event | Why post-scan? |
|-------|----------------|
| Major PR merged | Confirm spec was updated alongside code |
| Refactor completed | Confirm all spec references updated |
| Production hotfix | Capture new invariant if fix added defense-in-depth |
| Quarterly release | Comprehensive sweep |

### Pre-flight drift scan workflow

Before a major refactor:

```
1. Identify scope (30 min):
   □ Which ZeeSpec modules will the refactor touch?
   □ For each: which dimensions (what / how / where / etc.)?
   □ List affected INV-MOD-NN + HW-MOD-NN that may be impacted

2. Snapshot current state (15 min):
   □ Git tag the pre-refactor commit: `git tag drift-baseline-YYYY-MM-DD`
   □ Run drift scan; save report as baseline

3. Plan spec updates ALONGSIDE code changes (1-2 hours):
   □ For each code change, list spec edit required
   □ For each HW constraint change, draft ADR
   □ Reviewers should refuse to merge code change without spec update

4. Post-refactor verification (1 hour):
   □ Re-run drift scan
   □ Compare to pre-refactor baseline
   □ Verify net drift = 0 (or only known-acceptable drift)
```

### Post-hotfix workflow

Production bug hotfix:

```
1. Stabilize production (immediate; not a spec concern)

2. Diagnose: was the bug a violation of an existing invariant
   OR a missing invariant?
   - Existing invariant violated → invariant was 🟡 PARTIAL not ✅ IMPL
     → upgrade enforcement; update status tag
   - Missing invariant → add new INV-MOD-NN
     → ADR if design decision involved

3. Drift scan: did the hotfix introduce drift elsewhere?
   - Hotfixes are often surgical; sometimes touch other modules

4. Update spec to reflect new state (within 1 week of hotfix)
```

## Combining the 3 layers

A mature ZeeSpec module has all 3 layers active:

```
Every PR → CI runs Layer 1 (5 sec) → comment on PR

Monthly  → spec author runs Layer 2 (2-4h) → drift report

Per event → triggered Layer 3 → pre/post-flight scan
```

Annual rollup: comprehensive review per `02-b1-verification.md` (deeper version of Layer 2; resets baseline).

## Calibrating effort

| Module age | Layers needed |
|------------|---------------|
| 0-3 months (Tier 0 → Tier 1) | Author/B1/R3/R1+R2 cover initial state; drift management not yet needed |
| 3-6 months post-Tier 1 | Layer 1 (CI) active; monthly Layer 2 for high-risk modules only |
| 6-12 months | All 3 layers active |
| 1-2 years | Full layers + quarterly architectural review |
| 2+ years | Consider Tier 0 re-author cycle (drift may exceed value of incremental updates) |

## Anti-patterns

1. **Skipping Layer 1 (CI)** because "we'll catch it in code review" — code reviewers focus on logic, not spec drift; automation is consistent
2. **Layer 1 only (no Layer 2)** — automation misses Type 3 behavioral drift; over time, behavioral drift dominates
3. **Layer 2 once a year** — drift compounds; quarterly minimum for P0/P1 modules
4. **No Layer 3 for refactors** — major refactors create most drift; pre-flight prevents compounding
5. **Drift reports without ownership** — findings sit forever; assign owner + deadline
6. **Treating CI drift output as binding** — false positives possible; reviewer judgment needed

## Cross-references

- `02-drift-categorization.md` — 4-type framework details
- `03-auto-drift-detection.md` — CI + git-hook examples
- `04-drift-resolution-playbook.md` — per-type resolution
- `05-R5-drift-scanner-agent.md` — agent prompt
- `core/workflow/02-b1-verification.md` — initial baseline (foundational for Layer 1/2)
- `core/workflow/06-spawn-task-chips.md` — when Type 3/4 drift = production bug

## Next

→ `02-drift-categorization.md` — 4-type framework details
→ `03-auto-drift-detection.md` — automation implementation
