---
description: Triage dashboard over every module's gaps.md — rank by severity/status and surface OPEN P0/P1 blockers that STOP the AI.
---

Read-only triage of `gaps.md` across ZeeSpec modules in `$ARGUMENTS` (default: every module under `docs/specs/zeespec/`). **Do not resolve, fix, or edit anything** — this is a dashboard. (The `zeespec-drift-guard` skill auto-fires on edits; this command is the explicit on-demand sweep.)

Anatomy + calibration: `${CLAUDE_PLUGIN_ROOT}/specs/checklists/gaps-anatomy.md` + `${CLAUDE_PLUGIN_ROOT}/specs/checklists/severity-matrix.md`.

1. **Scan** each module's `gaps.md`. Parse the Summary table + Drift / Operational-follow-up / Research-question sections into rows: **module · gap ID · severity (🚨 P0 / 🟠 P1 / 🟡 P2 / 🟢 P3) · status (🔴 OPEN / 🟡 PROPOSED / 🟢 RESOLVED / ⚪️ DEFERRED / 📌 BY-DESIGN) · ticket/chip · file:line**.

2. **BLOCKERS first.** Any 🔴 OPEN 🚨 P0 / 🟠 P1 **without a ticket/chip** is a STOP-the-AI blocker (per `severity-matrix.md` → AI-behaviour matrix) — list these in their own table at the very top. OPEN P0/P1 *with* a chip → "refer to ticket" row, not a blocker.

3. **Rank** the remaining rows: P0 → P1 → P2 → P3, OPEN before PROPOSED before the rest.

4. **Spawn-chip status** — read `${CLAUDE_PLUGIN_ROOT}` is the methodology; read the *project's* `docs/specs/zeespec/_meta/spawn-chips.md` and summarize OPEN vs LANDED/RESOLVED vs DEFERRED counts so each P0/P1 gap's chip can be cross-checked as open or landed.

5. **Separate** 📌 BY-DESIGN (acknowledged, won't-fix) into their own section — never count them as real OPEN work.

Flag red-flags from `gaps-anatomy.md`: a Tier 1 module with **0 gaps** (suspect), or **100+ OPEN** (triage backlog). Report only — recommend `zeespec:review` or a triage sprint; never change a status.

`$ARGUMENTS` = module name / scope to triage (optional; default = all modules).