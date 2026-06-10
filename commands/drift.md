---
description: Run the explicit on-demand ZeeSpec spec↔code drift scan on a module — deterministic Type 1/2 gate + R5 semantic Type 3/4 sweep, classified and routed to the right resolution.
---

Run a deliberate drift scan on `$ARGUMENTS`. (The `zeespec-drift-guard` skill triggers after edits; this command is the scheduled / triggered full run.) Framework: `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/08-code-drift-management/00-START-HERE.md`.

1. **Deterministic gate (Type 1 + 2).** Run `${CLAUDE_PLUGIN_ROOT}/scripts/ci-drift-gate.sh` (grep/awk; NO AI) — every `file:line` citation must resolve, every `zeespec:count` marker must re-derive. **A broken trace is a broken build.**
2. **Semantic sweep (Type 3 + 4).** Dispatch the `zeespec-r5-drift` agent for behavioral + architectural drift the gate can't see (validation removed, sync→async, module split) — plus the spec-internal normalization lint.
3. **Classify** each finding by the 4-type framework + severity per `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/08-code-drift-management/02-drift-categorization.md` (Type 1/2 = 🟡 P2; Type 3 = 🟠 P1→🚨 P0; Type 4 = 🚨 P0). If in doubt, escalate to the higher type.
4. **Resolve** per `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/08-code-drift-management/04-drift-resolution-playbook.md` — pick **exactly one** path per finding, never auto-apply:
   - **Spec is stale** → spec edit (fold the new reality back; update the CLAUDE.md drift table).
   - **Code is the bug** → spawn a task chip (spec stays the source of truth for intent; do NOT edit the spec to match the bug).
   - **Intentional design change** → write an ADR (legitimize the drift), then update the spec + bump status tags.
   - Authority-suspected values (threshold / deadline / retention) → defer to `zeespec-r4-regulatory`, not a chip.

**STOP** on any 🚨 P0 / 🟠 P1 OPEN drift without a ticket and ask the user.

To scan the **methodology repo itself**, run `${CLAUDE_PLUGIN_ROOT}/scripts/dogfood-drift-scan.sh` instead (mechanical self-rot checks), then dispatch `zeespec-r5-drift` for the semantic pass.

`$ARGUMENTS` = module path / scope to scan.
