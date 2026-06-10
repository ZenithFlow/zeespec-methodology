---
name: ZeeSpec Authoring
description: Scaffold and write ZeeSpec spec modules the right way — default to Tier 0 Lite, follow the authoring DAG, and keep every claim cited. Use whenever creating or editing spec files under docs/specs/zeespec/ (a new module, a dimension file like what.md/how.md/why.md, or a gravity/gaps/invariant entry) so the spec stays normalized: each invariant carries a Status tag + file:line, gravity.md stays pointer-only, and OPEN P0/P1 gaps stop the work.
when_to_use: Trigger when the user asks to scaffold, author, draft, or extend a ZeeSpec module; when writing or editing any file under docs/specs/zeespec/ (CLAUDE.md, why/what/how/who/when/where.md, gravity.md, gaps.md, glossary.md); or when adding an INV-/HW-/ADR-/ALG- entry. The /zeespec:author command is the explicit run; this skill is the auto-guidance that fires while you author.
allowed-tools: Read, Grep, Glob
---

# ZeeSpec Authoring — Lite by default, cited, normalized

Before scaffolding or writing ANY spec file, apply the rules below. They prevent the three classic failures of an AI authoring specs: **over-engineering** (10 files for a trivial module), **uncited claims** (✅ IMPL with no proof), and **drift** (the same rule copied into gravity.md, then diverging). Full detail lives in `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/01-authoring-checklist.md` and `${CLAUDE_PLUGIN_ROOT}/specs/core/METHODOLOGY.md` §§ 2a / 6 / 8 / 9 — load the section you need (progressive disclosure; do not inline it).

## The rules

1. **Start Lite — promote deliberately.** Every new module defaults to **Tier 0 Lite = 3 files** (`CLAUDE.md` · `what.md` · `gaps.md`). Promote to Standard (6-7: + `why`/`how`/`gravity`) or Full (10) only when a module *earns* it — money, compliance, long-lived, or high-churn. Authoring all 10 up front is the #1 over-engineering trap. → METHODOLOGY § 2a decision matrix.

2. **Author along the DAG.** Order is `WHY → WHAT → HOW → {WHO, WHEN} → WHERE`, then the helpers `gravity` / `gaps` / `glossary` / `CLAUDE` — **CLAUDE last** (it summarizes). Each dimension needs the previous; `where.md` § 5 is the ONLY stack-specific section (everything else is language-agnostic).

3. **Cite every claim — no citation → DESIGN.** Every invariant (`INV-<MOD>-NN`) carries a Status tag (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN) **and** a `file:line` source. No `file:line` → downgrade to 🚧 DESIGN; a tag without proof is the anti-pattern R3 strips. → METHODOLOGY § 4.

4. **Apply the 5 authoring reflexes** as you write (METHODOLOGY § 8): (a) entity-field — type+nullable+default; (b) service-method — line ref + signature; (c) invariant — Status + source; (d) cross-link — sibling spec exists + acknowledged **bidirectionally**; (e) logging-handler — audit log uses a level that survives buffering.

5. **gravity.md is pointer-only** — "one fact, one cell." Each `HW-<MOD>-NN` entry holds ONLY **Crosses:** (the primitive cells it spans) + **Why it's gravity:** (the failure mode if they disagree), with an optional **Codified by:** ADR. Never restate the rule, a Status tag, or a `file:line` — those live in the primitive (`what.md/INV-…`, `how.md/ALG-…`, `who.md/SOD-…`). A duplicate HW becomes an alias pointer, never a restatement. → METHODOLOGY § 9.

## STOP rules + IDs

- **gaps.md OPEN with 🚨 P0 / 🟠 P1 and no ticket → STOP and ask the user.** Do not implement around an open critical/high gap. → METHODOLOGY § 5.
- **ID prefixes** (METHODOLOGY § 6): `INV-` (what) · `HW-` (gravity) · `ADR-` (CLAUDE) · `ALG-`/`P-`/`V-` (how) · `R-` (why) · `A-`/`SOD-` (who) · `T-` (when) · `S-` (where). ALL-CAPS module prefix, zero-padded NN.

## Author / verify

To scaffold or extend explicitly, run the **`/zeespec:author`** command. For external-authority claims (regulator / statute / threshold / retention), dispatch the `zeespec-r4-regulatory` agent FIRST. When the module is authored, hand off to `/zeespec:review` (R3 deep-verify → R1+R2) per `${CLAUDE_PLUGIN_ROOT}/specs/core/workflow/03-r3-deep-review.md`.
