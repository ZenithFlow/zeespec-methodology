---
name: ZeeSpec Drift Guard
description: Keep ZeeSpec specs and production code in sync after a code change. Use immediately after editing code that a codified ZeeSpec module cites — a refactor, a moved/renamed method, a renamed/added/removed field or column, a new/removed enum case, a DB migration, or any change touching a file under a module's file:line citations — to detect spec↔code drift, classify it with the 4-type framework, and resolve it the right way (spec edit vs task chip vs ADR) instead of letting the spec quietly start lying.
when_to_use: Trigger after a refactor, a moved/renamed method, an added/removed field or enum case, a migration, or any edit to a file cited by a ZeeSpec module; when a PR touches a codified module; or when the user asks to re-sync, drift-check, or verify a spec still matches the code.
allowed-tools: Read, Grep, Glob, Bash
---

# ZeeSpec Drift Guard — catch drift the moment code moves

You just changed code a ZeeSpec module cites. **A broken trace is a broken build.** Classify the drift, then resolve it on the correct path — never silently edit the spec to match buggy code. Full framework: `${CLAUDE_PLUGIN_ROOT}/specs/workflow/08-code-drift-management/00-START-HERE.md`. Load the referenced files when you need depth (progressive disclosure; do not inline).

## The 4-type framework (classify first)

Every finding is exactly one type — categorization sets severity + resolution path. Detail + the mis-categorization table: `${CLAUDE_PLUGIN_ROOT}/specs/workflow/08-code-drift-management/02-drift-categorization.md`.

- **Type 1 — citation** (`file:line` / path / method moved) → 🟡 P2, deterministic.
- **Type 2 — field/enum count** (entity columns, enum cases, params changed) → 🟡 P2 → 🟠 P1.
- **Type 3 — behavioral** (code DOES something different from the spec claim) → 🟠 P1 → 🚨 P0, semantic.
- **Type 4 — architectural** (module split, sync→async, boundary/storage change) → 🚨 P0, semantic.

When in doubt, escalate to the higher type. A rename that also changes behavior is Type 3, not Type 1.

## Detect by type — cheap first, agent for the rest

1. **Types 1 + 2 are deterministic** — run the gate, no AI: `${CLAUDE_PLUGIN_ROOT}/scripts/ci-drift-gate.sh` (every cited `file:line` must resolve; every `<!-- zeespec:count -->` marker must re-derive from code). A broken trace fails the build.
2. **Types 3 + 4 are semantic** — the gate can't see them. Dispatch the **`zeespec-r5-drift`** agent for a severity-ranked findings report.

## Resolve — exactly one path per finding

Per the playbook (`${CLAUDE_PLUGIN_ROOT}/specs/workflow/08-code-drift-management/04-drift-resolution-playbook.md`):

- **Spec edit** — drift is real and the spec is stale (Type 1/2; fix citations/counts, re-check status tags + `file:line`).
- **Spawn a task chip** — the spec is right and the **code is the bug** (regression). Never update the spec to match buggy code; spec stays source-of-truth for intent. → `06-spawn-task-chips.md`.
- **ADR** — the change was **intentional design**. Write it (dispatch `zeespec-r6-adr`), then update the spec + bump status tags; drift is legitimized. → `09-adr-lifecycle/`.

Never both, never auto-apply. For authority-suspected values (thresholds / deadlines / retention), defer to `zeespec-r4-regulatory` instead of filing a chip.

## STOP rules

Type 3/4 that touches a compliance invariant (HW), money, security, or an audit gap → 🚨 P0. File `Gap-MOD-DRIFT-NN` / `Gap-MOD-ARCH-NN` in `gaps.md`; if any **P0/P1 OPEN gap** results, STOP and ask the user before proceeding.
