---
module: MODULE_NAME
dimension: glossary
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — GLOSSARY

> **Purpose:** Disambiguate technical + domain terms used across the MODULE_NAME ZeeSpec.

## A

### [Term A]
[Definition. Cite source if relevant: `path/file.ext:NN`]

## C

### [Term C]
[Definition]

### [Cross-cutting concept]
Pattern (ADR-MOD_PREFIX-NNN + INV-MOD_PREFIX-NN) where [explanation]. See `gravity.md` HW-MOD_PREFIX-XX.

## D

### Dead code
A method, field, or enum case that exists in production source but is NEVER invoked / set / used. Common ZeeSpec finding (filed as FU-MOD_PREFIX-X-DEAD-Y).

### DESIGN intent
Tag for an invariant or constraint that is documented but NOT enforced in production. AI MUST NOT rely on DESIGN-tagged claims.

## E

### Enum case (DEAD)
An enum value that exists but is never set/produced by any production code path. See FU-MOD_PREFIX-X-DEAD-CASE.

## F

### Foreign key (polymorphic)
A reference like `entity_type` (string) + `entity_id` (int) WITHOUT a database FK constraint. Integrity depends on application code + soft-delete patterns. See HW-MOD_PREFIX-XX.

## I

### Invariant
A rule that MUST always hold. Each invariant has a Status tag (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN). See `what.md` § Invariants.

### IMPL (status tag)
Verified in production code with file:line citation. AI may rely on it.

## P

### PARTIAL (status tag)
App-layer enforcement only OR partial coverage. AI cites + adds defense-in-depth comment.

## R

### Race condition
[If applicable: describe race windows specific to this module]

## S

### Status tag
One of: ✅ IMPL, 🟡 PARTIAL, 🚧 DESIGN, 🚧 NOT-ENFORCED, 🚧 BROKEN. See `CLAUDE.md` § Status Tag Behavior.

## T

### Tier 1 promotion
The B1 + R3 + R1+R2 + apply workflow that promotes a draft ZeeSpec to design-intent + production-validated status.

## Cross-references

- Production code per `CLAUDE.md` § Source documents
- Related dimensions: what (entities), how (algorithms), who (actors), when (timing), where (storage)
