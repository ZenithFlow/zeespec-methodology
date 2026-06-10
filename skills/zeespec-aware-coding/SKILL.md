---
name: ZeeSpec-Aware Coding
description: Steer the AI on every code task in a project that has ZeeSpec-codified modules. Use BEFORE writing or modifying code — implementing a feature, fixing a bug, or refactoring — in any module that has a docs/specs/zeespec/<module>/ directory, so the change relies only on what production actually enforces, stops on blocking gaps, and cites the rules it touches.
when_to_use: Trigger when about to edit/add code and a docs/specs/zeespec/ spec exists for the module you're touching; when changing entities, an algorithm/state machine, permissions, timing, or storage in a codified module; or any time you'd otherwise generate code from the spec's prose without checking what's IMPL vs DESIGN.
allowed-tools: Read, Grep, Glob
---

# ZeeSpec-Aware Coding — read the spec, trust only what production enforces

Before generating ANY code in a module that has a `docs/specs/zeespec/<module>/` directory, run the four steps below. They stop the AI from coding against intent that was never built, and from silently inventing a decision the spec deliberately left OPEN. Full detail: `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/00-START-HERE.md` and `${CLAUDE_PLUGIN_ROOT}/specs/core/METHODOLOGY.md` §§ 4–5. Load the dimension file only when the step needs it (progressive disclosure — do NOT eager-read all 10).

## The four steps

1. **Load just what the task touches.** Always read the module `CLAUDE.md` + `gaps.md`. Then read ONLY the dimension file your change touches — `what.md` (entities/data), `how.md` (algorithm/state machine), `who.md` (permissions), `when.md` (timing/SLA), `where.md` (storage/stack) — not all six. Reading every file wastes context and degrades recall. → `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/00-START-HERE.md` § The Read Order.

2. **Obey the status tag — never code against intent.** Per METHODOLOGY § 4: **✅ IMPL** (has `file:line`) → cite and rely on it. **🟡 PARTIAL** (app-layer only, no DB constraint) → cite and add a defense-in-depth note. **🚧 DESIGN / NOT-ENFORCED / BROKEN** → production does NOT enforce this; **do NOT rely on it** — treat it as a gap, and if your code would receive a value the tag promised was filtered, guard it yourself. Untagged "IMPL" with no `file:line` is not IMPL — downgrade it.

3. **STOP on a blocking gap — do not invent.** If `gaps.md` has an OPEN gap your work touches at **🚨 P0** or **🟠 P1 without a ticket** → STOP and ASK THE USER; do not write a TODO and pick a default. P0/P1 *with* a ticket → refer to it, don't implement. P2 obvious / P3 → implement + cite the gap. → METHODOLOGY § 5 severity matrix.

4. **Cite the rule in a code comment.** Every change cites the ID it enforces — `// INV-<MOD>-NN`, `// HW-<MOD>-NN`, `// FU-<MOD>-NAME` — in your language's comment syntax. The citation is the bridge back to the spec when code drifts. → `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/00-START-HERE.md` § Citing IDs.

## Verify before you trust (the false-positive trap)

A status tag is a claim, not proof. If an enforcement claim is load-bearing for your change, re-check it against production (Grep the cited `file:line`) — the **AccountStatus pattern** is a spec that says "enforced" while production has a bypass (e.g. checks `kycLevel` but not `status`). If the spec is wrong, downgrade the tag and file a gap; don't build on the false positive. Re-verify stale line refs at session start. → METHODOLOGY § 11.

## When the change is bigger than coding

Authoring or extending the spec itself → run `/zeespec:author`. Verifying a module after changes → `/zeespec:review` (R3 → R1+R2). Found a real production bug while coding → don't fix inline; document it in `gaps.md` and spawn a task chip (`${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/06-spawn-task-chips.md`). Drift, regulatory, and ADR concerns belong to the `zeespec-r5-drift`, `zeespec-r4-regulatory`, and `zeespec-r6-adr` agents — dispatch them rather than guessing.
