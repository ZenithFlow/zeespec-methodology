---
module: MODULE_NAME
dimension: what
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — WHAT (Data)

> **Stack-agnostic:** Entity shape, invariants. Stack-specific bindings (ORM annotations, framework classes) live in `where.md` § 5.
>
> **Source documents:**
> - Production code (highest authority) — see `CLAUDE.md` § Source documents
> - All entity schemas MUST be verified directly against production source

## 1. Entities

| Entity | Table | Role |
|--------|-------|------|
| `MainEntity` | `main_entities` | [purpose] |
| `RelatedEntity` | `related_entities` | [purpose] |

## 2. Attributes — `MainEntity`

Production: `[path/to/Entity.ext]` (NN lines, **N fields** = X Column + Y ManyToOne + Z OneToOne). Verified YYYY-MM-DD.

| Field | Type | Domain | Constraint |
|-------|------|--------|-----------|
| `id` | integer | > 0 | PK auto-increment |
| `field_name` | type | [domain] | [constraint] |

**Indexes:**
- `idx_name` on (`field`) — purpose
- `uniq_name` on (`field_a`, `field_b`) — UNIQUE constraint

## 3. Attributes — `RelatedEntity`

[Same pattern as § 2]

## 4. Enums

### EnumName (N cases)

| Case | Value | Use |
|------|-------|-----|
| `CASE_A` | `'case_a'` | [where used] |

## 5. Invariants

> 🚨 **Status legend:**
> - ✅ **IMPL**: enforced by code (cite file:line)
> - 🟡 **PARTIAL**: app-layer only or partial coverage
> - 🚧 **DESIGN**: not enforced anywhere
> - 🚧 **NOT-ENFORCED**: production accepts violating inputs
> - 🚧 **BROKEN**: production tries to enforce but fails

| ID | Status | Rule | Source | Test |
|----|:------:|------|--------|------|
| **INV-MOD_PREFIX-01** | ✅ IMPL | [rule] | [file:line] | [test file:line] |
| **INV-MOD_PREFIX-02** | 🟡 PARTIAL | [rule] | [why partial] | — (Gap-MOD_PREFIX-NN) |

> **Test-pointer rule (v4.0):** every invariant whose violation would be 🚨 P0 / 🟠 P1 (`core/checklists/severity-matrix.md`) carries a `Test` pointer — a test `file:line` or executable assertion (`core/METHODOLOGY.md` § 3c). `—` is allowed only with a tracking gap; B1 § 6 counts the misses.

### §5 status overview

**Summary:** ✅ X IMPL · 🟡 Y PARTIAL · 🚧 Z DESIGN out of N invariants.

## 6. Relationships

| From | To | Cardinality | Constraint |
|------|----|:-:|------------|
| `MainEntity` | `RelatedEntity` | M : 1 | `related_id` FK NOT NULL |

## 7. Domain rules summary

- [Rule 1]
- [Rule 2]

## 8. What this dimension does NOT cover

- HOW algorithms work → see `how.md`
- WHO can access → see `who.md`
- WHEN events fire → see `when.md`
- WHERE data lives → see `where.md`
- WHY constraints → see `why.md`
- GRAVITY cross-cutting → see `gravity.md`

## 9. Cross-references

- Related dimensions: how (algorithms), who (permissions), when (timing), where (storage), gravity (HW), gaps (open questions)
