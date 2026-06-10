---
doc: extended/workflow/09-adr-lifecycle/01-adr-format-template
type: workflow-template
phase: adr-lifecycle
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# ADR Format Template

> Two formats: **inline (CLAUDE.md ADR table row)** for short ADRs; **file (adr/<id>.md)** for longer ADRs. Use the same fields in either; the storage choice is project-level.

## Required fields

Every ADR (inline or file) MUST have:

1. **ID** — `ADR-<MOD>-NNN` per `core/checklists/invariant-numbering.md`
2. **Title** — short noun phrase summarizing the decision
3. **Status** — Proposed / Accepted / Superseded / Deprecated / Rejected
4. **Date** — when last status changed (YYYY-MM-DD)
5. **Context** — why a decision was needed
6. **Decision** — what was decided
7. **Consequences** — what results from this decision (positive + negative)

## Recommended fields

8. **Alternatives considered** — what other options were on the table; why rejected
9. **Decision-maker(s)** — who approved (name + role)
10. **Cited sources** — supporting research / authority (links to R4 sources, papers, RFCs)
11. **Related ADRs** — supersedes / supersedded-by / extends / conflicts-with (see `03-adr-relationships.md`)
12. **Related INV/HW** — invariants in the spec that embody this decision
13. **Re-review date** — when to re-evaluate (optional; for time-bounded decisions)

## Inline format (CLAUDE.md table)

For short ADRs (< 200 words; simple decisions):

```markdown
## Key architectural decisions

### Foundational ADRs

| ADR | Decision | Status | Source |
|-----|----------|--------|--------|
| **ADR-MOD-001** | Use double-entry as foundation; debit=credit per journal | ✅ ACCEPTED (2026-05-18) | see `gravity.md` HW-GL-01 + inline text below |
| **ADR-MOD-002** | Journal immutability; corrections via reversing entries only | ✅ ACCEPTED (2026-05-18) | see `what.md` INV-GL-02 |
| **ADR-MOD-003** | Period close: forward-only state machine; REOPEN requires controller + reason | ✅ ACCEPTED (2026-05-18) | see `how.md` ALG-GL-PERIOD-CLOSE |
| **ADR-MOD-004** | Multi-currency: per-line transaction amount + base-currency amount; base sums balance | ✅ ACCEPTED (2026-05-18) | see `what.md` INV-GL-09 |
| **ADR-MOD-005** | (HISTORICAL) Use Doctrine ORM for entity layer | 🗄️ SUPERSEDED by ADR-MOD-027 (2028-03-15) | (kept for historical reference) |
| **ADR-MOD-018** | Allow TIER_BASIC for read-only wallet creation; TIER_FULL still required for money movement | ✅ ACCEPTED (2026-04-15) | retroactive ADR per drift-driven pattern; see PR #1432 |

### Full ADR text (for inline ADRs)

#### ADR-MOD-001 — Double-entry as foundation

**Status:** ✅ ACCEPTED (2026-05-18)
**Decision-maker:** [tech lead name] + [compliance officer name]

**Context:**
The module records financial transactions. International accounting practice
(IFRS-aligned) requires double-entry bookkeeping for auditability. Without
double-entry: reconciliation impossible, regulator scrutiny inevitable.

**Decision:**
Adopt double-entry bookkeeping. Every journal entry has 2+ lines summing
debit = credit in base currency. Enforced at DB (trigger) + service (assertion)
+ test (property-based).

**Consequences:**
- (+) Reconcilable to external sources (bank statements, custodian)
- (+) Regulator-friendly (auditor expectation)
- (+) Catches imbalanced inputs at write time
- (-) Slightly more storage (2+ rows per transaction)
- (-) Requires careful handling of multi-currency (see ADR-MOD-004)

**Alternatives considered:**
- Single-entry (rejected: not auditable; non-IFRS)
- Triple-entry (cryptographic): rejected — over-engineering for current scale; revisit if blockchain becomes required

**Cited sources:**
- IFRS Foundation Conceptual Framework para. X
- (research log YYYY-MM-DD per R4)

**Related INV/HW:**
- INV-GL-01 (debit = credit per journal)
- HW-GL-01 (cross-cutting hardwiring)

**Re-review:** Not scheduled (foundational; expected to remain)
```

## File format (adr/<id>.md)

For longer ADRs (> 200 words; complex decisions; multiple alternatives evaluated):

```markdown
---
adr_id: ADR-MOD-NNN
title: <short decision title>
module: <module name>
status: Proposed | Accepted | Superseded | Deprecated | Rejected
status_date: YYYY-MM-DD
decision_makers:
  - name: <person 1>
    role: <role>
  - name: <person 2>
    role: <role>
supersedes: [ADR-MOD-OOO, ADR-MOD-PPP]   # if applicable
superseded_by: ADR-MOD-NNN+1               # if applicable
related_inv:
  - INV-MOD-NN
  - HW-MOD-MM
re_review_date: YYYY-MM-DD                # if time-bounded
---

# ADR-MOD-NNN — <Title>

## Status

[Proposed | Accepted | Superseded | Deprecated | Rejected] (YYYY-MM-DD)

If status changed: link to the change record (ADR-MOD-NNN+1 supersedes; PR# that closed; etc.)

## Context

[2-5 paragraphs describing the situation that required a decision.
What problem are we solving? What constraints exist? What was the prior
state of the system? What changed to require revisiting?]

## Decision

[1-3 paragraphs stating the decision clearly. Imperative voice ("We will
use X."). Specific enough that engineering can implement without further
guidance. Reference INV/HW IDs that embody this decision.]

## Alternatives considered

### Alternative 1: <name>
**Description:** [what this alternative would look like]
**Pros:** [list]
**Cons:** [list]
**Why rejected:** [specific reason]

### Alternative 2: <name>
[same structure]

### Alternative 3: <name>
[same structure]

## Consequences

### Positive
- [what we gain]
- [downstream benefits]

### Negative
- [what we give up]
- [risks introduced]
- [costs incurred]

### Neutral / informational
- [things to know but not pro/con]

## Compliance + regulatory considerations

[If decision touches regulated topic: cite the regulation; reference
research log per R4 methodology]

## Engineering impact

- **Affected modules:** [list]
- **Migration required:** [yes/no + plan]
- **Engineering effort:** [t-shirt size or hours]
- **Testing approach:** [unit / integration / load]

## Related ADRs

- **Supersedes:** [list IDs; see `03-adr-relationships.md`]
- **Extends:** [list IDs]
- **Conflicts with:** [list IDs + how resolved]
- **Related (no formal relationship):** [list IDs]

## Related ZeeSpec entries

- **Invariants:** INV-MOD-NN, ...
- **Hardwiring:** HW-MOD-NN, ...
- **Algorithms:** ALG-MOD-NN, ...

## Cited sources

### Production code
- `path/to/file:line` — [what this proves]

### External authorities (per R4)
- SRC-XXX-YYY (per `_meta/regulatory-source-registry.md`)
- [URL] — [title]

### Industry / standards
- [reference]

## Re-review

**Re-review date:** YYYY-MM-DD (or "Not scheduled — foundational")
**Trigger conditions:** [what would prompt re-review]

## History

| Date | Status | Author | Note |
|------|--------|--------|------|
| 2026-05-18 | Proposed | [name] | Initial draft |
| 2026-05-25 | Accepted | [name] | After R1+R2 review |
| 2028-03-15 | Superseded | [name] | By ADR-MOD-027 — see that ADR for new approach |
```

## Status definitions

| Status | Meaning | Can be implemented? | In CLAUDE.md table? |
|--------|---------|---------------------|---------------------|
| **Proposed** | Drafted; under review; not yet decided | NO | Yes (marked Proposed) |
| **Accepted** | Decision made; binding; engineering implements | YES | Yes (default) |
| **Superseded** | Replaced by a newer ADR | (historical reference only) | Yes (with link to superseder) |
| **Deprecated** | No longer applies; not replaced | NO | Yes (with rationale) |
| **Rejected** | Considered but not accepted | NO | Sometimes (if rejection is itself informative) |

See `02-adr-lifecycle.md` for transition rules.

## ID conventions

Per `core/checklists/invariant-numbering.md`:

- Format: `ADR-<MOD>-NNN` (3-digit zero-padded; ADRs accumulate)
- Module prefix per module
- Sequence within module (never reused after deprecation)
- Cross-module reference: full prefix (`ADR-WAL-005` not just `ADR-005`)

## Length guidance

| ADR type | Word count | Location |
|----------|-----------|----------|
| Trivial decision | 50-100 | CLAUDE.md table only (1 row) |
| Simple decision | 100-300 | CLAUDE.md table + inline text |
| Standard decision | 300-700 | adr/<id>.md file |
| Complex decision (architectural) | 700-2000 | adr/<id>.md file (full template) |
| Mega-decision (cross-module refactor) | 2000+ | adr/<id>.md + possibly RFC-style appendices |

If your ADR is > 3000 words: consider splitting into multiple ADRs OR moving long appendices to design-doc form.

## What NOT to put in an ADR

- **Implementation code** (belongs in how.md or actual code; cite from ADR)
- **Stale interpretations** (mark ADR superseded; don't bury in long text)
- **Multiple decisions** (split into separate ADRs)
- **Speculation about future** ("we might want X eventually") — write that ADR when "eventually" arrives
- **Vague language** ("we should probably consider") — ADRs decide; if undecided, don't write ADR yet
- **Marketing language** — ADRs are technical decision records, not pitches

## Common mistakes

### Mistake 1: ADR captures decision but not WHY

Bad:
> "We will use Redis Streams."

Good:
> "We will use Redis Streams instead of Kafka. Context: our throughput is 100 events/sec — Kafka is over-provisioned. Redis is already in our stack for caching, so no new operational burden. Alternative considered: RabbitMQ (rejected: new dependency). Trade-off: less mature ecosystem for streams than Kafka; acceptable at our scale."

### Mistake 2: ADR + INV inconsistent

Bad:
- ADR-MOD-005 says "Use HMAC-SHA256 for tokens"
- INV-MOD-12 says "Use SHA-1 hashes"

Good: when ADR is accepted, update related INV; cross-reference.

### Mistake 3: ADR text is the design doc

Bad: ADR is 50 pages with detailed architecture diagrams.

Good: ADR is 2 pages with decision + rationale; design doc lives separately and is linked from ADR.

### Mistake 4: ADR mentions tech but not why

Bad:
> "We will use PostgreSQL for storage."

Good:
> "We will use PostgreSQL for storage. Rationale: ACID required (per ADR-MOD-001 double-entry); existing team expertise; supports row-level locking (per ADR-MOD-007 concurrent posting); supports JSONB for audit_log.before_state column."

### Mistake 5: ADR list grows without curation

After 50 ADRs, your CLAUDE.md ADR table is unreadable. Curate:
- Mark SUPERSEDED ADRs with clear "superseded by" link
- Group by theme in the table (foundational / operational / supersedeed)
- Consider Option B (adr/ folder) at scale

## Template files (project-level)

When using Option B (adr/ folder), seed your project with:

`docs/specs/zeespec/_meta/adr-template.md`:

```markdown
# ADR-MOD-NNN — <title>

## Status

Proposed (YYYY-MM-DD)

## Context

[describe situation requiring decision]

## Decision

[state the decision]

## Alternatives considered

### Alternative 1
...

## Consequences

### Positive
...

### Negative
...

## Related ADRs

...

## Related ZeeSpec entries

- INV-MOD-NN
- HW-MOD-MM
```

## Cross-references

- `00-START-HERE.md` — when to write ADRs
- `02-adr-lifecycle.md` — state transitions
- `03-adr-relationships.md` — supersedes / extends / conflicts
- `core/checklists/invariant-numbering.md` — ID format
- `core/templates/_template/CLAUDE.md` — ADR table template

## Next

→ `02-adr-lifecycle.md` — state transitions
→ `03-adr-relationships.md` — linking ADRs together
