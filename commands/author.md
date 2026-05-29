---
description: Author or extend a ZeeSpec module following the dependency DAG, status-tag discipline, and pointer-only gravity convention.
---

Author a ZeeSpec module in this project. Follow the checklist at `${CLAUDE_PLUGIN_ROOT}/specs/workflow/01-authoring-checklist.md`.

**Authoring order (dependency DAG):** `WHY → WHAT → HOW → {WHO, WHEN} → WHERE`, then the cross-cutting helpers `gravity` / `gaps` / `glossary` / `CLAUDE` (CLAUDE last — it summarizes).

**Non-negotiable conventions:**
- Every invariant (`INV-<MOD>-NN`) carries a Status tag — ✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN — **and** a `file:line` source. No citation → downgrade to 🚧 DESIGN.
- `gravity.md` is **pointer-only** (one fact, one cell): each HW entry = `Crosses:` (the primitive cells) + `Why it's gravity:` (failure mode). Never restate the rule, a Status tag, or a `file:line` — those live in the primitive. See `${CLAUDE_PLUGIN_ROOT}/specs/METHODOLOGY.md` §9.
- `gaps.md` OPEN gaps with 🚨 P0 / 🟠 P1 (no ticket) → STOP and ask the user.
- Default to **Tier 0 Lite** (3 files); promote to full 10-file only deliberately.

For external-authority claims (regulator / statute / threshold / retention), dispatch the `zeespec-r4-regulatory` agent FIRST.

`$ARGUMENTS` = module name and/or dimension to work on.
