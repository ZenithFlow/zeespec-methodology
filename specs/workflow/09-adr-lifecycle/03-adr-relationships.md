---
doc: workflow/09-adr-lifecycle/03-adr-relationships
type: workflow-method
phase: adr-lifecycle
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# ADR Relationships — Linking ADRs Together

> ADRs do not exist in isolation. Each ADR may relate to other ADRs via: supersedes, extends, conflicts-with, related, inherits. Explicit relationships make the ADR set navigable + curate-able.

## The 5 relationship types

| Relationship | Direction | Meaning |
|--------------|:---------:|---------|
| **supersedes** | A → B | A replaces B (B becomes Superseded) |
| **superseded-by** | A ← B | A is replaced by B (inverse of above) |
| **extends** | A → B | A builds on B without replacing |
| **conflicts-with** | A ↔ B | A and B make contradictory claims (must be resolved) |
| **related** | A — B | A and B touch the same topic; no strict dependency |
| **inherits** | A → B (cross-module) | A's module inherits decision from B's module |

## Relationship 1 — supersedes / superseded-by

**Use when:** A new ADR makes a different decision on the same topic.

### Bidirectional linking (mandatory)

```yaml
# In the new ADR (the superseder):
adr_id: ADR-MOD-027
supersedes: [ADR-MOD-005]   # list of ADR IDs being superseded

# In the old ADR (the superseded):
adr_id: ADR-MOD-005
status: Superseded
superseded_by: ADR-MOD-027
superseded_date: 2028-03-15
```

### Example pair

**Old (ADR-MOD-005 — initial choice):**
```markdown
# ADR-MOD-005 — Use Doctrine ORM for entity layer

**Status:** Superseded by ADR-MOD-027 (2028-03-15)

[Original ADR text preserved as historical record]

> **SUPERSEDED:** This ADR has been superseded by ADR-MOD-027 on 2028-03-15
> due to performance limitations + maintenance burden. See ADR-MOD-027 for
> the current approach (raw SQL + sqlc).
```

**New (ADR-MOD-027 — replacement):**
```markdown
# ADR-MOD-027 — Migrate from Doctrine to raw SQL + sqlc

**Status:** Accepted (2028-03-15)
**Supersedes:** ADR-MOD-005

## Context

ADR-MOD-005 chose Doctrine ORM in 2026. After 2 years in production:
- Query performance issues at high transaction volume
- Hibernate-style N+1 problems hard to debug
- Team has accumulated SQL-tuning expertise

This ADR replaces ADR-MOD-005.

## Decision

Migrate the entity layer from Doctrine to raw SQL + sqlc code generation.

[rest of ADR]
```

### What to keep vs delete

When superseding:
- KEEP the old ADR file (don't delete)
- KEEP all its original content (don't edit content)
- ADD the "Superseded" status + link to superseder
- ADD a prominent "SUPERSEDED" notice at top
- The history is the value

### Multi-supersede

One new ADR can supersede multiple old ADRs:

```yaml
adr_id: ADR-MOD-040
supersedes: [ADR-MOD-005, ADR-MOD-018, ADR-MOD-022]
```

All three old ADRs get updated with `superseded_by: ADR-MOD-040`.

### Chained supersedes

ADRs can form chains:

```
ADR-MOD-005 (2026) ← superseded by ADR-MOD-027 (2028) ← superseded by ADR-MOD-051 (2030)
```

Each link is explicit. Don't skip:
- ADR-MOD-051 supersedes ADR-MOD-027 (not directly ADR-MOD-005)
- ADR-MOD-027 was the active decision between 2028 and 2030
- The chain captures evolution

Modern ADR (ADR-MOD-051) MAY cite the entire chain in context section ("evolved from ADR-005 → ADR-027 → this") for narrative clarity.

## Relationship 2 — extends

**Use when:** A new ADR builds ON TOP OF an existing decision without replacing it.

### Example

**Base (ADR-MOD-001 — foundational double-entry):**
```markdown
# ADR-MOD-001 — Use double-entry as foundation
```

**Extension (ADR-MOD-009 — multi-currency support, building on 001):**
```markdown
# ADR-MOD-009 — Multi-currency journals via base-currency normalization

**Status:** Accepted
**Extends:** ADR-MOD-001

ADR-MOD-001 established double-entry as the foundation. This ADR extends
that by adding the multi-currency requirement: each journal line carries
both transaction-currency amount AND base-currency amount; the
debit=credit invariant (from ADR-MOD-001) applies to base-currency amounts.

ADR-MOD-001 remains in effect; this ADR adds to it.
```

### When to use extends vs supersedes

- **Extends** if the original decision is still valid; you're adding more
- **Supersedes** if the original decision is no longer the way; you're replacing

Confusion test: "After this new ADR, is the old one still binding?" Yes → extends. No → supersedes.

### Marking extends

In new ADR:
```yaml
extends: [ADR-MOD-001, ADR-MOD-007]   # build on these
```

In old ADRs:
```yaml
# Optional: list extenders (for navigability)
extended_by: [ADR-MOD-009, ADR-MOD-015]
```

The extended_by field is bookkeeping; don't enforce strict bidirectionality (some teams skip it; supersedes bidirectional is more critical).

## Relationship 3 — conflicts-with

**Use when:** Two ADRs make contradictory claims that haven't been resolved.

This is a TEMPORARY state. Conflicts MUST be resolved by either:
1. Superseding one of them with a new unified decision
2. Withdrawing one
3. Recognizing they apply to different scopes (and updating both ADRs to clarify)

### Example

```markdown
# ADR-MOD-013 — Use synchronous flow for wallet → accounting

**Status:** Accepted
**Conflicts with:** ADR-MOD-024 (introduces async outbox; contradicts sync choice here)

[original text]

> **CONFLICT NOTICE:** This ADR is in conflict with ADR-MOD-024 (2028-Q1)
> which adopts outbox + async. As of YYYY-MM-DD, resolution is pending:
> see issue #1789. Engineering currently follows ADR-MOD-024 in practice.
> A unifying ADR will be drafted in YYYY-Q3.
```

### Resolution paths

After detecting conflict:

**Path A — Supersede the older one:**
- New ADR-MOD-031 supersedes ADR-MOD-013 (and explains the async choice)
- ADR-MOD-024 stands (or itself gets superseded by ADR-MOD-031 as part of unification)

**Path B — Scope clarification:**
- ADR-MOD-013 amended to clarify: "applies to wallet-to-accounting only when transaction < N MNT"
- ADR-MOD-024 amended to clarify: "applies to wallet-to-accounting when transaction ≥ N MNT"
- Both now scoped; no longer in conflict

**Path C — Unifying meta-ADR:**
- New ADR-MOD-031: "When to use sync vs async for wallet-to-accounting"
- ADR-MOD-013 and ADR-MOD-024 marked Superseded
- ADR-MOD-031 captures both contexts

**Don't leave conflicts unresolved.** Engineering reading two contradictory ADRs gets confused; spec loses authority.

### Detecting conflicts

R6 ADR Curator Agent (per `05-R6-adr-curator-agent.md`) actively scans for conflicts during annual review.

## Relationship 4 — related

**Use when:** Two ADRs touch the same topic but don't strictly depend.

**Example:**
- ADR-MOD-001 — Double-entry as foundation
- ADR-MOD-007 — Currency representation as Decimal not float

Related (both about financial accuracy) but neither extends nor supersedes the other.

Marking:
```yaml
related: [ADR-MOD-001, ADR-MOD-007]   # informational
```

Useful for navigability. Don't over-use (everything is "related" to everything; reserve for clear topical adjacency).

## Relationship 5 — inherits (cross-module)

**Use when:** Module A's spec inherits a decision made in module B's spec.

### Example

`wallet` module inherits from `accounting`:

```markdown
# wallet/CLAUDE.md

## Key architectural decisions

### Inherited ADRs (from other modules)

| ADR | Source module | Decision | Status |
|-----|---------------|----------|--------|
| ADR-ACC-001 | accounting | Double-entry as foundation | ✅ ACCEPTED |
| ADR-ACC-009 | accounting | Multi-currency normalization | ✅ ACCEPTED |
| ADR-GL-022 | accounting | Outbox pattern for async events | ✅ ACCEPTED |
```

Wallet doesn't re-write the decision; it acknowledges the inheritance.

In wallet's gravity.md "From accounting" section:

```markdown
## §2. From accounting (inherited HW + ADR)

This module inherits the following decisions from `accounting`:

| Inherited from | Decision | Where it manifests in wallet |
|----------------|----------|------------------------------|
| ADR-ACC-001 | Double-entry foundation | wallet posts journals via accountingService.postJournal(); cannot bypass |
| ADR-ACC-022 | Outbox pattern | WalletTransaction emit via outbox table, not direct call |
```

Per `checklists/cross-link-bidirectionality.md`:

- The `accounting` module's CLAUDE.md "Downstream inheritance" section MUST list `wallet` as a consumer
- The `wallet` module's gravity.md MUST list the inheritance

## ADR-to-INV/HW relationships

ADRs also link to spec entries (INV / HW / ALG):

```yaml
# in ADR file
related_inv:
  - INV-MOD-04
  - INV-MOD-09
related_hw:
  - HW-MOD-03
related_alg:
  - ALG-MOD-POST-01
```

And in spec entries, reference the ADR:

```markdown
### INV-MOD-04 — [statement]
Status: ✅ IMPL
Source: ServiceFile.ext:NN
ADR: ADR-MOD-001 (foundational decision)
```

This bidirectional link helps reviewers see WHY the invariant exists.

## Relationship cardinality summary

| Relationship | One-to-many? | Bidirectional required? |
|--------------|:------------:|:------------------------:|
| supersedes | Yes (one new can supersede many old) | YES (always mark both sides) |
| extends | Yes (one new can extend many old) | Optional |
| conflicts-with | Yes (multi-way conflicts possible) | YES (all parties marked) |
| related | Yes | Optional |
| inherits (cross-module) | Yes (one ADR inherited by many modules) | YES per cross-link-bidirectionality.md |

## Visualizing relationships

For modules with > 20 ADRs, a relationship graph helps:

```
[ADR-001]──extends──→[ADR-009]──supersedes──→[ADR-027]
   │                    │
   │                    related
   │                    ↓
   └─related─→[ADR-005] (Deprecated)
              │
              superseded-by
              ↓
              [ADR-018]
```

Generate via Graphviz / Mermaid from the frontmatter fields. Optional tooling; not required by methodology.

## Cross-module relationship example

`wallet` depends on `accounting`. When accounting's ADR changes, wallet must respond:

```
1. accounting writes ADR-ACC-027 (supersedes ADR-ACC-005)
2. accounting updates its CLAUDE.md "Downstream inheritance" section
3. accounting NOTIFIES wallet team (via Slack / ticket / etc.)
4. wallet reviews: does the change break our assumptions?
   - If yes: wallet writes its own ADR responding (extends or new)
   - If no: wallet updates its CLAUDE.md inherited-ADR table to cite ADR-ACC-027
5. Bidirectional link maintained
```

If accounting doesn't notify wallet → wallet's spec silently drifts from accounting's reality. Drift detection (workflow 08) eventually catches; better to notify proactively.

## Lifecycle interactions

Status changes can trigger relationship updates:

| ADR status change | Required relationship updates |
|-------------------|-------------------------------|
| Accepted → Superseded (by ADR-X) | superseded_by field; ADR-X gets `supersedes` |
| Accepted → Deprecated | If ADR was inherited cross-module: NOTIFY consumers |
| Conflict detected | Add `conflicts-with` to both ADRs; resolution issue filed |
| Conflict resolved (one wins) | Loser → Superseded by winner |
| Conflict resolved (scoping) | Both Amended (note in history) |

## R6 agent role

R6 ADR Curator Agent (per `05-R6-adr-curator-agent.md`) scans for:
- Missing bidirectional links (supersedes without superseded_by; or vice versa)
- Conflicts (detected via NLP comparison of decisions on same topic)
- Stale `extends` chains (extended ADR was superseded; extension still references old)
- Cross-module link gaps

Run during annual ADR review.

## Anti-patterns

1. **Silent supersedes** (new ADR makes old one obsolete; no link) — fragments the historical record
2. **Stale superseded markers** (ADR marked Superseded but no link to superseder) — leaves readers stranded
3. **Over-using "related"** (everything related to everything) — dilutes meaning
4. **Inheritance not declared** (downstream module relies on upstream ADR without acknowledging) — cross-module drift
5. **Conflict left unresolved > 30 days** — engineering doesn't know which ADR to follow
6. **Multi-supersedes without explanation** — new ADR supersedes 5 old without justifying why each
7. **Cross-module ADR duplication** (re-writing same ADR in each module) — diverging copies inevitable; inherit instead

## Cross-references

- `00-START-HERE.md` — ADR overview
- `01-adr-format-template.md` — frontmatter fields
- `02-adr-lifecycle.md` — state changes
- `04-drift-driven-adr-pattern.md` — drift → ADR generation
- `05-R6-adr-curator-agent.md` — agent for relationship management
- `checklists/cross-link-bidirectionality.md` — cross-module rules

## Next

→ `04-drift-driven-adr-pattern.md` — drift → ADR pipeline
→ `05-R6-adr-curator-agent.md` — AI agent for ADR curation
