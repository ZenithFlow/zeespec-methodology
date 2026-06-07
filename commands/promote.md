---
description: Run the full ZeeSpec Tier-1 promotion pipeline (B1 verify → R3 deep → R1+R2 parallel → apply) on a module.
---

Promote `$ARGUMENTS` to **Tier 1 (production-validated)** via the **4-phase core review pipeline** (B1 → R3 → R1+R2 → Apply) — optionally preceded by Phase 0 (R4 research) for external-authority modules. Run the phases in order; do not skip.

**Phase 0 (conditional) — R4 first.** If the module has external-authority claims (regulator / statute / threshold / retention / deadline), dispatch the `zeespec-r4-regulatory` agent BEFORE verifying, so R2 has a fresh baseline. Skip for pure internal-logic modules.

**Phase 1 — B1 quantitative verify** (`${CLAUDE_PLUGIN_ROOT}/specs/workflow/02-b1-verification.md`). Grep production: entity field counts, enum cases, method signatures, `file:line` accuracy. Fast (~30 min). Quantitative drift only.

**Phase 2 — R3 deep verify** (`${CLAUDE_PLUGIN_ROOT}/specs/workflow/03-r3-deep-review.md`). Same session, every claim vs production code: status-tag truth, the AccountStatus false-positive pattern, phantom methods/fields, **and the spec-internal normalization lint** (`gravity.md` pointer-only; no fact restated across files; no dimension leakage).

**Phase 3 — R1 + R2 in parallel** (`${CLAUDE_PLUGIN_ROOT}/specs/workflow/04-r1-r2-parallel-review.md`). Dispatch two reviewers in ONE message (independent perspectives): R1 = algorithm + race conditions + invariant correctness; R2 = compliance + audit + cross-module + bidirectional cross-links. (Dispatch `zeespec-r5-drift` for the drift dimension if useful.)

**Phase 4 — Apply** (`${CLAUDE_PLUGIN_ROOT}/specs/workflow/05-apply-findings.md`). Fold spec drift back into the files; for real production bugs **spawn task chips** (`${CLAUDE_PLUGIN_ROOT}/specs/workflow/06-spawn-task-chips.md`) — never auto-fix production inline. **STOP** on any 🚨 P0 / 🟠 P1 OPEN gap without a ticket and ask the user.

On completion: set the module `CLAUDE.md` frontmatter to `tier: 1`, append the run to `_meta/metrics-loop.md`, and report findings grouped by severity (P0/P1/P2) each with a `file:line` citation.

`$ARGUMENTS` = module name / path to promote.
