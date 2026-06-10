---
description: Bring ZeeSpec into the current project — add the methodology reference + CLAUDE.md pointer, and optionally scaffold the first module (Tier 0 Lite by default).
---

Install ZeeSpec into THIS project (`${CLAUDE_PROJECT_DIR}`). Steps:

1. **Reference the methodology.** Either copy `${CLAUDE_PLUGIN_ROOT}/specs/` → `docs/specs/zeespec/` (frozen snapshot), OR keep it in the plugin and just point at it (stays in sync with plugin updates). Ask the user which they prefer; default = reference-in-place (no copy), since the plugin already bundles it.

2. **Add the CLAUDE.md pointer.** Append to the project's `CLAUDE.md` (create if absent):
   > ## Spec methodology
   > This project uses **ZeeSpec**. Before generating code that touches a ZeeSpec-codified module, read the methodology entry point: `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/00-START-HERE.md` (or `docs/specs/zeespec/core/workflow/00-START-HERE.md` if copied).

3. **Scaffold the first module (only if the user names one).** Copy `${CLAUDE_PLUGIN_ROOT}/specs/core/templates/_template` into `docs/specs/zeespec/<module>/`, replacing `MODULE_NAME` / `MOD_PREFIX` / `YYYY-MM-DD`. **Default = Tier 0 Lite** (3 files: `CLAUDE.md` + `what.md` + `gaps.md`) per `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/10-adoption-guide/07-zeespec-lite-tier-0-fasttrack.md`.

**Honor the Tier 0 guardrail:** do NOT author all 10 files up front for every module — start Lite, promote deliberately only for modules that earn it (money / compliance / high-churn). Non-regulated projects rarely need full Tier 1.

`$ARGUMENTS` = optional module name to scaffold.
