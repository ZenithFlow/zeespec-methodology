---
description: Fast local pre-commit verification for a ZeeSpec module — the deterministic Type 1/2 drift gate + a B1 quantitative spot-check. Cheap mechanical gate, not the full review.
---

Run the **fast deterministic gate** on `$ARGUMENTS` before committing. This is the cheap mechanical check (grep/awk/sed; NO AI) — deep semantic verification is `/zeespec:promote`, not this. It is the explicit on-demand run of what the `zeespec-drift-guard` skill triggers on after edits.

1. **CI drift gate** — run `${CLAUDE_PLUGIN_ROOT}/scripts/ci-drift-gate.sh --spec-dir <module spec dir> --code-dir .`. This deterministically re-derives Type 1 (every `file:line` citation resolves to a real file + line) and Type 2 (counts carrying a `zeespec:count` marker re-grep from code). A broken trace is a broken build — report any DRIFT line verbatim with its `file:line`.

2. **B1 quantitative spot-check** (`${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/02-b1-verification.md`) — grep production for the touched scope only: entity field counts, enum case counts, public-method count / signatures vs the spec's claim. Quantitative drift only; use the stack-specific patterns in that doc.

3. **Methodology repo?** If `$ARGUMENTS` is this repo (not an adopter project), also run `${CLAUDE_PLUGIN_ROOT}/scripts/dogfood-drift-scan.sh` — gravity restatement, core-doc version skew, hardcoded paths.

Report **PASS / FAIL** with each finding's specific `file:line`. On FAIL, fix the citation/count (or annotate an intentional case) before committing. This gate covers only the mechanical surface — Type 3 behavioral + Type 4 architectural drift (R3 / R1+R2, the `zeespec-r5-drift` agent) is `/zeespec:promote`.

`$ARGUMENTS` = module / scope to check.