---
doc: workflow/00-START-HERE
type: ai-agent-entry-point
version: 2.3.0
status: stable
last_updated: 2026-05-18
applies_to: any project using ZeeSpec
---

# ZeeSpec Workflow — AI Agent Entry Point

> Read this BEFORE generating ANY code that touches a ZeeSpec-codified module.

## TL;DR

1. Identify which module(s) your task touches → find their `docs/specs/zeespec/<module>/` directory
2. Read in this order: `CLAUDE.md` → `gaps.md` → relevant dimension files
3. If you find a 🔴 OPEN gap that blocks your task → STOP, ASK USER
4. Cite invariant IDs in code comments (`// INV-X-04`, `// HW-X-08`)
5. Status tags: ✅ IMPL = production-verified; 🟡 PARTIAL = app-layer only; 🚧 DESIGN = NOT in production

## When to use this workflow

| Task | Action |
|------|--------|
| Writing new code in a module with a ZeeSpec | Read all 10 files; cite IDs |
| Modifying existing code | Read the relevant dimension files (e.g., what.md if changing entities, how.md if changing algorithms) |
| Authoring a NEW ZeeSpec module | Follow `01-authoring-checklist.md` |
| **Authoring a module with external-authority claims** (regulator, statute, standard) | Run R4 research FIRST → `07-r4-regulatory-research/00-START-HERE.md` |
| Reviewing an existing ZeeSpec | Follow `02-b1-verification.md` through `04-r1-r2-parallel-review.md` |
| Annual re-validation of jurisdictional claims | Re-run R4 → `07-r4-regulatory-research/06-re-validation-strategy.md` |
| Found a real production bug | Follow `06-spawn-task-chips.md` |
| **Continuous drift monitoring** (CI / scheduled / triggered) | Follow `08-code-drift-management/` |
| **Made a material design decision** | Write ADR → `09-adr-lifecycle/00-START-HERE.md` |
| **Drift detection found undocumented design change** | Retroactive ADR → `09-adr-lifecycle/04-drift-driven-adr-pattern.md` |
| **Annual ADR review** | Curator scan → `09-adr-lifecycle/05-R6-adr-curator-agent.md` (Mode B) |

## The Read Order (per module)

When picking up work on a module:

1. **`CLAUDE.md`** — entry point. Lists active issues, ADR table, read order, source documents.
2. **`gaps.md`** — STOP if your task is blocked by an OPEN gap.
3. **`why.md`** — understand the strategic context + risks before writing code.
4. **Dimension you're modifying:**
   - Changing entities/data shape? → `what.md`
   - Changing algorithm/state machine? → `how.md`
   - Changing permissions? → `who.md`
   - Changing timing/SLA? → `when.md`
   - Changing storage/tech stack? → `where.md`
5. **`gravity.md`** — verify your change doesn't violate any cross-dimension HW constraint.
6. **`glossary.md`** — when in doubt about a term, check here.

## Status Tag Behaviour

When reading any invariant claim:

| Tag | Meaning | What you should do |
|-----|---------|-------------------|
| ✅ **IMPL** | Verified in production code with file:line | Cite + rely on it |
| 🟡 **PARTIAL** | App-layer enforcement only; no DB constraint | Cite + add defense-in-depth |
| 🚧 **DESIGN** | Documented intent; NOT in production | **DO NOT rely on it.** Treat as gap |
| 🚧 **NOT-ENFORCED** | Production accepts violating inputs | File as gap; spawn task chip |
| 🚧 **BROKEN** | Production tries but fails | P0 production bug; spawn task chip |

## Severity-Based Blocking

When you encounter an OPEN gap:

```
🚨 Critical (P0) without ticket → STOP, ASK USER
🚨 Critical (P0) with ticket    → Refer to ticket; do NOT implement
🟠 High (P1) without ticket     → STOP, ASK USER
🟠 High (P1) with ticket        → Cite gap; proceed only if explicitly invoked
🟡 Medium (P2)                  → Implement if obvious + cite gap
🟢 Low (P3)                     → Implement + cite gap
```

## Citing IDs in Code

Every change to a module with a ZeeSpec MUST cite the rule it enforces or relates to.

**Good** (example shown in pseudocode — use your language's comment syntax: `//`, `#`, `--`, `;`):
```
// HW-<MOD>-01 + INV-<MOD>-13: write one row per channel
notification = create_notification(customer, type, channel, ...)

// FU-<MOD>-STALE-TOKEN-CLEANUP: clear dead token immediately
device_token.push_token = null
```

**Bad:**
```
// Send notification
notification = create_notification(...)
```

The cited IDs let reviewers (and future you) trace WHY this code exists. Specs evolve; comments lose context. Citations are the bridge.

## Common Mistakes

### Mistake 1: Treating 🚧 DESIGN as ✅ IMPL

Spec says "security_alerts cannot be disabled (INV-NOTIF-18 🚧 DESIGN)". You write a check assuming it's enforced upstream. Production accepts `securityAlerts=false`. Your code passes a value that the spec promised would never arrive.

**Fix:** Always check the Status tag before relying on an invariant.

### Mistake 2: Inventing decisions when a gap blocks you

Spec says "FU-X: SMS toggle missing — STOP, ASK USER". You write a TODO comment and proceed with a default. Now there's no record of the unresolved question.

**Fix:** Genuinely STOP. Ask in the chat. Wait for the user's decision before proceeding.

### Mistake 3: Citing line refs without verifying

You read in spec: "AccountingService::createJournal at line 253". You write code that calls a sister method. Spec was written 14 days ago; method is now at line 312. Your code works but your comment is wrong.

**Fix:** Re-verify cited line refs at the start of your session. If drift > 50 lines, file a B1 finding.

### Mistake 4: Bypassing the bidirectional cross-link

Module A's spec says "inherits HW-B-04 from module B". You write code accordingly. But module B's spec doesn't mention A as a consumer → when module B refactors, A breaks silently.

**Fix:** When you implement an inherited constraint, verify module B's gravity.md has "Downstream inheritance" entry for A. If not, file it.

### Mistake 5: AccountStatus pattern false-positive

Spec says "canWithdraw enforces kycLevel=FULL AND status=ACTIVE". Production canWithdraw checks ONLY kycLevel. You write code assuming both gates exist. Suspended customers can still withdraw.

**Fix:** Verify enforcement claims against actual production code. If spec is wrong, downgrade the Status tag + file as gap.

## Next: depending on your task

| Task | Next file |
|------|-----------|
| Authoring a new ZeeSpec module | `01-authoring-checklist.md` |
| Promoting existing draft to Tier 1 | `02-b1-verification.md` |
| Found production bug while reviewing | `06-spawn-task-chips.md` |
| Just writing code in an existing module | (you have enough — start with the module's CLAUDE.md) |
