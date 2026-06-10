---
description: Run the ZeeSpec review pipeline (R3 deep-verify → R1+R2 parallel) on a module, or the dogfood drift-scan on the methodology repo itself.
---

Review a ZeeSpec module (or the methodology repo). Pipeline per `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/03-r3-deep-review.md` + `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/04-r1-r2-parallel-review.md`:

1. **R3 deep verify** (same session) — every claim vs production code: `file:line` accuracy, status-tag truth, AccountStatus false-positive pattern, phantom methods/fields, **and the spec-internal normalization lint** (no fact restated across files; `gravity.md` pointer-only; no dimension leakage).
2. **R1 + R2 in parallel** — dispatch two reviewers (or the `zeespec-r5-drift` agent): R1 = algorithm + race conditions + invariant correctness; R2 = compliance + audit + cross-module + bidirectional cross-links.
3. **Apply findings** per `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/05-apply-findings.md` — fold spec drift back; spawn task chips for real production bugs (`${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/06-spawn-task-chips.md`). **Never auto-fix without review.**

To review the **methodology repo itself**, run `${CLAUDE_PLUGIN_ROOT}/scripts/dogfood-drift-scan.sh` (mechanical: gravity restatement, core-trio version, hardcoded paths) and dispatch `zeespec-r5-drift` for semantic normalization.

`$ARGUMENTS` = module path / dimension to review.
