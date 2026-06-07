---
name: ZeeSpec Citation
description: Enforce durable, verifiable citations for every external-authority claim in a ZeeSpec — a regulator rule, statute, reporting threshold (e.g. a cash-transaction amount), retention period, filing deadline, jurisdiction definition, or any compliance value. Use whenever a spec asserts a number, date, or rule that comes from OUTSIDE the code (a law / regulator / standard) so the value carries a dated, article-level source and becomes a deterministic test — never model recall, never "per the regulator."
when_to_use: Trigger when writing or editing an INV/HW/glossary entry that names a threshold, deadline, retention window, filing requirement, jurisdiction definition, penalty, or any value sourced from a regulator, statute, or standard; when a citation says "per the regulator / per AI / per a meeting"; or when turning a pinned regulatory value into a BDD/test assertion.
allowed-tools: Read, Grep, Glob
---

# ZeeSpec Citation — pin the value, prove it with a test

Any spec claim that depends on an **external authority** (a law, regulator, or standard — not the code) must be grounded, not recalled. A model invents thresholds and deadlines; this skill stops that. Full detail lives in `${CLAUDE_PLUGIN_ROOT}/specs/workflow/07-r4-regulatory-research/03-citation-conventions.md` and `${CLAUDE_PLUGIN_ROOT}/specs/METHODOLOGY.md` § 3c — load them when you need the format or the rationale (progressive disclosure; do not inline).

## The four rules

1. **Research first.** For any new regulator / statute / threshold, dispatch the `zeespec-r4-regulatory` agent **before** writing the INV/HW — it reaches Tier-1 primary sources and returns paste-ready citation blocks. Never author the value from memory. → `${CLAUDE_PLUGIN_ROOT}/specs/workflow/07-r4-regulatory-research/00-START-HERE.md`.

2. **Every value carries a durable citation.** Each threshold / deadline / retention / definition gets the citation block adjacent to it — **source title + issuing authority (jurisdiction) + article/section + version/amendment date + stable URL + retrieved date** — or an inline `SRC-XXX` short ID into the source registry (`_meta/regulatory-source-registry.md`). Durable = the next reviewer verifies it in 5 years. → `03-citation-conventions.md` (block format, registry, version-pinning, URL-stability).

3. **Cite a dated source, nothing else.** ❌ "per the regulator" · "per AI/ChatGPT" · "per a meeting with an official" · "standard industry practice" · "per legal counsel" with no memo on file. ✅ a named document, down to the article, version-pinned, with a retrieved date. No dated article-level source → the claim is not citable; downgrade to 🚧 DESIGN and file a gap.

4. **Turn the pinned value into a deterministic assertion.** A citation pins a value; an assertion makes it **enforceable**. Per METHODOLOGY § 3c, regulatory values are exactly what an AI reviewer cannot reliably recall — so encode each pinned value once as a BDD / unit check (keep the boundary cases: at · just-below · just-above), name its `SRC-XXX` in a comment, and let a test (not a reviewer) fail when production drifts. → `03-citation-conventions.md` § "From citation to executable assertion".

## Division of labor (don't ask the AI to remember the number)

A regulatory threshold is a **value** assertion → a **test** in CI. The `scripts/ci-drift-gate.sh` checks that citations *resolve*; R1/R2 review the architectural residual ("is the rule honored cross-module?"). Encode `20,000,000` once; the build, not model recall, enforces it. This is also what makes annual re-validation cheap: one statute amends → one assertion edits → one red build.

## Out of scope (do not fake)

Legal interpretation, conflict resolution between authorities, and "is this the *right* rule" — those need a human expert; track open questions as `Gap-MOD-R4-NN`, never behind the citation block. The skill enforces only the verifiable: a dated source exists, it pins to article level, and a test encodes the value.
