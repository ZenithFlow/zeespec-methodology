---
description: Capture the per-version multi-factor ZeeSpec metrics row and compare it to the prior version to confirm the shipped change helped without a hidden regression.
---

Capture metrics for `$ARGUMENTS` (version label / scope) and **append one row** to `_meta/metrics-loop.md`. Follow the sheet at `${CLAUDE_PLUGIN_ROOT}/specs/core/templates/_meta/metrics-loop.md`; pull raw numbers from `_meta/pilot-retrospective.md` (`${CLAUDE_PLUGIN_ROOT}/specs/core/templates/_meta/pilot-retrospective.md`), `spawn-chips.md`, and the R5 drift-scan logs.

**Collect every factor — read them together, never one in isolation:**
- Avg authoring time / module; findings / module split by **P0 / P1 / P2**.
- **Drift-catch rate** (real drift caught ÷ total real drift later confirmed — higher is better) **AND false-positive rate** (false flags ÷ total flags — lower is better). These two are a pair: a rising catch rate only counts if false positives are not rising with it.
- Reviewer wall-time / module.
- Module counts at each weight tier: **Lite / Standard / Full** (a drift toward Lite = the methodology is getting cheaper to apply).
- Qualitative factors (1–5 or prose): **developer cognitive load**, **peer-review ease**, **ownership clarity** — these catch costs the time/count columns miss.

Append both the quantitative row and the qualitative row. If a factor was not instrumented this version, write `not tracked` — never fabricate a number.

**Then compare to the prior version's row** and state plainly: did the change shipped this version move the factors in the intended direction **without a hidden regression** (e.g. faster authoring bought with a higher false-positive rate, or a lighter tier mix that quietly raised cognitive load)? Record the verdict in the Notes column so the decision is auditable; if a change did not help, flag it as a candidate for pruning.

**No single headline number** — productivity is multi-dimensional and one metric is gameable. This command is the explicit, on-demand close of the self-improving loop that the `zeespec-drift-guard` skill watches passively; `/zeespec:promote` appends a run automatically, but this is the per-version roll-up you run by hand when you cut a version.

`$ARGUMENTS` = version label / scope being measured.