---
module: MODULE_NAME
dimension: gravity
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — GRAVITY (Cross-dimension Hardwiring)

> Constraints that arise from the **intersection** of two or more dimensions. AI hallucinates the most when these are unspecified.

> 🧭 **NORMALIZATION RULE (ZeeSpec v3 · Zachman 3.0 "one fact, one cell"):**
> `gravity.md` is a **composite** — it *points to* primitive cells, it does **not restate** them.
> The rule's *substance, Status tag (✅/🟡/🚧), and `file:line`* live in the primitive cell
> (`what.md` INV-, `how.md` ALG-/P-, `who.md` SOD-, `when.md` T-, `where.md` S-). A gravity entry
> holds only **composite-only** content: which cells it crosses + the **failure mode if those cells
> disagree**. If you catch yourself copying an invariant's text or its Status here — stop, move it to
> the primitive and link instead. Restated facts drift independently; pointers don't.
> (Rationale + tiers: `specs/ZACHMAN-ALIGNMENT.md` Tier 1·1A.)

## §0. Hardwiring index (pointers — status NOT stored here)

> Status is **owned by the primitive cells** and read from there. It is intentionally NOT a column in
> this table — duplicating it would denormalize and drift. This index only maps each HW → the cells it
> crosses. For a status roll-up, read the primitives (or generate it; never hand-maintain it here).

| HW-MOD_PREFIX ID | Title | Crosses (primitive cells own substance + status) |
|------------------|-------|---------------------------------------------------|
| HW-MOD_PREFIX-01 | [title] | `what.md/INV-MOD_PREFIX-NN` · `how.md/ALG-MOD_PREFIX-NAME` · `who.md/…` |

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

## §2. Own hardwiring (HW-MOD_PREFIX) — pointer entries

> **Format:** each entry = **pointers + composite-only failure mode**. No restated rule text, no Status
> tag, no `file:line` — those live in the primitive cells named under **Crosses**.

### HW-MOD_PREFIX-01: [Constraint name]

- **Crosses:** `what.md/INV-MOD_PREFIX-NN` · `how.md/ALG-MOD_PREFIX-NAME` · `who.md/A-MOD_PREFIX-NN`
- **Why it's gravity (failure mode if the crossed cells disagree):** [the system-wide consequence when WHAT is satisfied but HOW/WHO is not — this is the ONLY substance unique to gravity]
- **Codified by:** [ADR-MOD_PREFIX-NNN] *(pointer only; the ADR + code proof live with the primitive)*

### HW-MOD_PREFIX-02: [Next constraint]

[Same pointer pattern]

> ❌ **Anti-pattern (denormalization):** an entry that restates the rule ("Debit must equal Credit…"),
> carries its own `Status: ✅ IMPL`, or cites `service.ext:NN`. All three belong to the primitive.
> A gravity entry that duplicates another HW (e.g. "same as HW-X") is not a constraint —
> make it an explicit **alias pointer**, not a restatement.

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

### NHW-MOD_PREFIX-01: [Non-rule name]

[Statement of what is intentionally NOT a constraint. Directly fights over-engineering — it tells the
AI/engineer NOT to add a guard that the design deliberately omits.]

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

### Related dimensions (these OWN the substance gravity points to)
- `what.md` — INV-MOD_PREFIX-NN (each HW's data-integrity substance + Status)
- `how.md` — ALG-/P- algorithms + processes
- `who.md` — actor permissions + SOD-
- `when.md` — timing constraints (T-)
- `where.md` — storage + tech stack (S-)
- `gaps.md` — OPEN gaps blocking HW promotion
- `glossary.md` — term definitions

### Downstream gravity references (these ZeeSpecs inherit FROM us)
- [list sibling specs]
