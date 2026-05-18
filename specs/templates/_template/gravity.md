---
module: MODULE_NAME
dimension: gravity
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — GRAVITY (Cross-dimension Hardwiring)

> Constraints that arise from the **intersection** of two or more dimensions. AI hallucinates the most when these are unspecified.
>
> **Each constraint MUST be enforced** by code citing its ID — only for ✅ IMPL items. 🚧 DESIGN items require implementation FIRST (see related Gap-MOD_PREFIX-XX).

## §0. Status overview

| HW-MOD_PREFIX ID | Title | Status | Reliability | Notes |
|------------------|-------|:------:|:-----------:|-------|
| HW-MOD_PREFIX-01 | [title] | ✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN | High / Medium / Low | [evidence file:line] |

**Summary:** ✅ X IMPL · 🟡 Y PARTIAL · 🚧 Z DESIGN out of N hardwiring constraints.

## §1. 6×6 dimension matrix

```
         WHAT  HOW   WHERE  WHO   WHEN  WHY
WHAT      ●    ●●●   ●●●    ●●●   ●●    ●●
HOW       ●●●  ●     ●●●    ●●●   ●●●   ●●●
WHERE     ●●●  ●●●   ●      ●●    ●●    ●●
WHO       ●●●  ●●●   ●●     ●     ●●●   ●●●
WHEN      ●●   ●●●   ●●     ●●●   ●     ●●●
WHY       ●●   ●●●   ●●     ●●●   ●●●   ●
```
●●● critical · ●● important · ● related

**Hot intersections** (●●● critical):
- [List the 3-5 critical pairs for this module]

## §2. Own hardwiring (HW-MOD_PREFIX)

### HW-MOD_PREFIX-01: [Constraint name]

- **Dimensions:** WHAT × HOW × WHO (or whichever applies)
- **Rule:** [one-line enforceable statement]
- **Implementation status:** ✅ IMPL · Reliability: High
- **Reality:** [what production actually does]
- **Failure mode if violated:** [what breaks]
- **Codification:** [ADR-MOD_PREFIX-NNN] + verified at `path/file.ext:NN-MM`

### HW-MOD_PREFIX-02: [Next constraint]

[Same pattern]

## §3. Downstream inheritance — modules that inherit FROM us

| Inheriting module | What it inherits | Sibling spec status |
|-------------------|------------------|---------------------|
| `<other-module>` | HW-MOD_PREFIX-NN | `<other-module>/gravity.md` § "From MODULE_NAME" — [ratified / PROPOSED] |

> ⚠️ **Bidirectional cross-link rule:** Every entry here MUST be acknowledged in the consumer module's `gravity.md` § "From MODULE_NAME". Unilateral declaration is an anti-pattern.

## §4. Upstream inheritance — we inherit FROM these

### From `<upstream-module>` (HW-X inheritance, ratified YYYY-MM-DD)

| Inherited HW | Why this module inherits | How it manifests |
|--------------|--------------------------|------------------|
| **HW-X-NN** | [reason] | [code path that respects it] |

## §5. Anti-gravity — what is NOT hardwired

### NHW-1: [Non-rule name]

[Statement of what is intentionally NOT a constraint. Helps prevent over-engineering.]

## §6. Cross-cutting patterns

[Any patterns shared with sibling modules, e.g., "savepoints config + nested transactions"]

## §7. Critical intersections checklist

| Pair | Question | Answer |
|------|----------|--------|
| WHAT × WHERE | Where is each entity stored? | [answer] |
| WHAT × WHO | Who reads/writes each entity? | [answer] |
| HOW × WHO | Who triggers each process? | [answer] |
| HOW × WHEN | When does each process run? | [answer] |
| WHERE × WHO | Who authenticates at each boundary? | [answer] |

## §8. Cross-references

### ADR cross-refs
- [ADR-MOD_PREFIX-NNN] — [name]

### Related dimensions
- `what.md` — INV-MOD_PREFIX-NN that each HW enforces
- `how.md` — algorithms + processes affected
- `who.md` — actor permissions
- `when.md` — timing constraints
- `where.md` — storage + tech stack
- `gaps.md` — OPEN gaps blocking HW promotion
- `glossary.md` — term definitions

### Downstream gravity references (these ZeeSpecs inherit FROM us)
- [list sibling specs]
