---
doc: extended/workflow/08-code-drift-management/00-START-HERE
type: workflow-entry
phase: code-drift-management
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any ZeeSpec module (especially mature ones > 6 months old)
---

# Code Drift Management — Entry Point

> **Domain-agnostic.** Specs drift from code. Code drifts from specs. Without active management, every spec becomes stale within 6-12 months. This phase defines the **detection + categorization + resolution** workflow for code drift.

## What is "drift"?

**Drift** = the gap between what the spec says and what the production code does. Drift accumulates because:

1. Code changes faster than specs (engineers ship features without updating spec)
2. Specs describe intent; code embodies pragmatic compromises
3. Refactoring renames classes, moves methods, splits files — line refs go stale
4. Business rules evolve through code patches that aren't fed back into spec
5. New requirements arrive; engineers add code; spec author isn't notified
6. Production bug fixes encode new invariants that aren't documented
7. ADRs are made informally (in PRs / Slack) without ADR file

Drift is **not failure**. It's expected. The methodology defines how to detect + categorize + respond to drift continuously rather than letting it accumulate.

## Position in workflow

```
R4 research (07)        → external authority baseline
        ↓
Author phase (01)       → write spec from canonical sources + code
        ↓
B1 verify (02)          → catch drift at moment of authoring (quantitative)
        ↓
R3 deep review (03)     → catch drift at line-by-line level
        ↓
R1+R2 parallel (04)     → catch drift via independent perspectives
        ↓
Apply (05)              → fix drift in spec; chip drift in production
        ↓
   Tier 1 STATUS
        ↓
[CONTINUOUS: Code drift management (08)]  ← this phase
                                            runs FOREVER after Tier 1
        ↓
[ANNUAL: R4 re-validation (07/06)]
        ↓
[AS NEEDED: ADR lifecycle (09)]
```

**Code drift management is NOT a one-time phase.** It runs continuously after Tier 1 promotion via:
- Automated drift scans (CI / git hooks) — catches drift at PR time
- Scheduled reviews (monthly / quarterly) — catches drift that automation missed
- Trigger-based reviews (refactoring, new feature, bug fix) — proactive

## When to use this phase

| Scenario | Use code drift management? |
|----------|---------------------------|
| Module just reached Tier 1 | ✅ Set up continuous monitoring |
| 1+ month after Tier 1 | ✅ Scheduled review (monthly) |
| Major refactor in progress | ✅ Pre-PR + post-merge scan |
| New feature touching ZeeSpec module | ✅ PR-time drift scan |
| Production bug fix | ✅ Check if fix exposes invariant gap |
| Spec author hasn't touched module in 3 months | ✅ URGENT — likely significant drift |
| Reviewing someone else's PR | ✅ Apply drift checklist |
| Module marked Tier 0 (greenfield) | ⚠️ Premature; first reach Tier 1 |

## The 4 types of drift

Drift comes in 4 categories. Each has different urgency + resolution path.

### Type 1 — Citation drift (most common; least urgent)

Line refs, file paths, method names changed in code; spec still cites old.

**Examples:**
- Spec says `OrderService.php:265` for `createOrder()`; method now at line 287
- Spec cites `app/Repository/UserRepo.cs`; file renamed to `Repositories/UserRepository.cs`
- Method renamed: `getCustomer()` → `findCustomer()` for clarity

**Impact:** Confusing for future readers; doesn't break compliance.
**Severity:** 🟡 P2 typically.
**Detection:** Automated grep diff (CI-friendly).
**Resolution:** Find-and-replace in spec; commit + 30-day re-check.

### Type 2 — Field/enum drift (quantitative; moderate urgency)

Entity field counts, enum case counts, table column counts have changed.

**Examples:**
- Spec says `User` entity has 18 columns; production has 22
- Spec says `OrderStatus` enum has 5 cases; production has 7
- Spec says `payments` table has 4 indexes; production has 6

**Impact:** Spec underrepresents reality; new fields may have undocumented invariants.
**Severity:** 🟡 P2 → 🟠 P1 if drift > 30% OR new field touches critical path.
**Detection:** B1 verification quantitative grep (per `core/workflow/02-b1-verification.md`).
**Resolution:** Update spec entity tables; investigate WHAT each new field does (may add INV-MOD-NN).

### Type 3 — Behavioral drift (qualitative; high urgency)

Code does something materially different from spec's claim.

**Examples:**
- Spec INV-X-04 says "validation rejects empty input"; production now accepts empty input (bug OR intentional change?)
- Spec algorithm says "sequential processing"; production parallelized
- Spec says "soft delete only"; production has hard DELETE in cleanup command (regression of HW)
- Spec says "approver ≠ initiator (SoD)"; production bypass discovered

**Impact:** Real compliance / invariant gap. May indicate production bug OR undocumented design change.
**Severity:** 🟠 P1 → 🚨 P0 depending on what's at stake.
**Detection:** R3 deep review; R1 algorithm review; sometimes production incident.
**Resolution:**
- If production bug: spawn task chip (per `06-spawn-task-chips.md`); fix in code; restore alignment with spec
- If intentional design change: write ADR (per `extended/workflow/09-adr-lifecycle/`) documenting the change; update spec to reflect new reality; bump status tags

### Type 4 — Architectural drift (structural; highest urgency)

Module structure / boundaries / dependencies have changed since spec was written.

**Examples:**
- Spec says "PaymentService is monolithic"; production refactored to PaymentService + SettlementService split
- Spec says "wallet directly calls bank-integration"; production now goes through event bus
- Spec says "single DB"; production split to read-replica + write-master
- Spec says "synchronous flow"; production introduces async + outbox

**Impact:** Major spec rewrite needed; cross-module contracts (gravity.md HW) may be invalidated.
**Severity:** 🚨 P0 typically (spec is now significantly misleading).
**Detection:** Manual review (architectural changes are obvious to humans, hard to automate).
**Resolution:**
- Write architectural ADR (per `extended/workflow/09-adr-lifecycle/`) for the change
- Re-author affected dimensions (typically how.md + where.md + gravity.md)
- Re-do B1 + R3 against the new structure
- Possibly split spec into multiple modules

## Read order

For first-time setup (~1 hour total):

1. **This file** (orientation; ~15 min)
2. `01-drift-detection-strategies.md` — continuous + scheduled detection workflows (~15 min)
3. `02-drift-categorization.md` — 4-type framework in depth + severity calibration (~10 min)
4. `03-auto-drift-detection.md` — CI integration + git pre-commit hooks (~15 min)
5. `04-drift-resolution-playbook.md` — per-type resolution recipes (~10 min)
6. `05-R5-drift-scanner-agent.md` — agent prompt for automated drift scans (~10 min)

For AI agents asked to detect drift:

1. `05-R5-drift-scanner-agent.md` — copy-paste agent prompt
2. `02-drift-categorization.md` — to classify findings correctly
3. `04-drift-resolution-playbook.md` — to recommend resolution path

## The continuous-drift principle

Code drift is unavoidable. The discipline:

> **Detect early. Categorize correctly. Resolve via the appropriate path.**

NOT:
- "Periodic massive re-audit when drift becomes unbearable" (too late; expensive)
- "Strict gates that block all code changes until spec updates" (drives engineers around the methodology)
- "Manual scheduled reviews only" (misses drift between schedules)

The right cadence:
- **CI/PR-time:** auto-scan for Types 1+2 drift; surface to PR reviewer
- **Monthly:** scheduled review for Type 3 (behavioral)
- **Per refactor:** trigger review for Type 4 (architectural)
- **Annually:** full re-validation per `core/workflow/02-b1-verification.md`

## How drift relates to ADR

Drift detection often reveals **undocumented design decisions**. If engineering made a deliberate change (Type 3 or 4) that wasn't captured as ADR:

```
Drift detected → Investigate intent
              ├── Bug? → spawn task chip (06)
              └── Deliberate change? → write retroactive ADR (09)
                                       → update spec
                                       → drift legitimized
```

This is the **drift-driven ADR pattern** (see `extended/workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`). Every architectural drift should trigger an ADR. Without it, the spec keeps lying about reality.

## Drift in the gap-tracking system

Drift findings flow into existing ZeeSpec tracking:

- **Citation drift (Type 1):** noted in CLAUDE.md "Drift items (B1 verification YYYY-MM-DD)" table; resolved by spec edit
- **Field/enum drift (Type 2):** same; may add INV-MOD-NN if new field has invariant
- **Behavioral drift (Type 3):** filed as `Gap-MOD-DRIFT-NN` in gaps.md; severity per `severity-matrix.md`; spawn chip if production fix
- **Architectural drift (Type 4):** filed as `Gap-MOD-ARCH-NN` 🚨 P0; ADR mandatory; module re-author

## Anti-patterns

1. **Treating drift detection as someone else's job** — every engineer touching a ZeeSpec module is responsible
2. **Suppressing drift findings to "ship faster"** — drift compounds; technical debt + compliance debt
3. **Massive once-a-year re-audit** — too late; spec was lying for 11 months
4. **Auto-applying drift fixes without review** — sometimes drift indicates a bug, not a doc issue
5. **No ADR for material drift** — the spec lies about WHY the design is what it is
6. **Drift scan in CI but no human reads the output** — automation without process is noise

## Cross-references

- `core/workflow/02-b1-verification.md` — initial quantitative drift detection
- `core/workflow/03-r3-deep-review.md` — line-by-line drift in deep review
- `core/workflow/05-apply-findings.md` — folding drift findings back
- `core/workflow/06-spawn-task-chips.md` — when drift = production bug
- `extended/workflow/09-adr-lifecycle/` — drift that reveals undocumented design decisions
- `core/checklists/severity-matrix.md` — severity calibration for drift findings
- `core/checklists/anti-patterns.md` — drift-related anti-patterns

## Next

→ `01-drift-detection-strategies.md` — continuous + scheduled detection
→ `02-drift-categorization.md` — 4-type framework
