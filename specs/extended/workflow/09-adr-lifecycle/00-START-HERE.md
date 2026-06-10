---
doc: extended/workflow/09-adr-lifecycle/00-START-HERE
type: workflow-entry
phase: adr-lifecycle
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any ZeeSpec module
---

# ADR Lifecycle Management — Entry Point

> **Domain-agnostic.** Architecture Decision Records (ADRs) capture WHY the system is shaped the way it is. Without active ADR lifecycle management, ADRs accumulate without structure, become contradictory, and stop being useful. This phase defines the **format + lifecycle + relationships + drift-driven ADR pattern + agent prompt**.

## What is an ADR?

**ADR** = Architecture Decision Record. A short document capturing:
- The decision (what was decided)
- The context (why a decision was needed)
- The alternatives (what other options were considered)
- The consequences (what results from this decision)
- The status (proposed / accepted / superseded / deprecated)

ADRs answer the question: **"Why is the system designed this way?"**

The intent is: a new team member, 2 years from now, can read the ADRs and understand the design rationale without having to ask the original team.

## ADRs vs other artifacts

| Artifact | Captures | Owner | Update frequency |
|----------|---------|-------|-------------------|
| **ADR** | Why a decision was made | Architect / tech lead | Once per decision (immutable after acceptance) |
| **what.md** | What the entities are now | Spec author | Continuous |
| **how.md** | How algorithms work now | Spec author | Continuous |
| **PR description** | What this PR changes | PR author | One-time |
| **Wiki / Confluence** | Living documentation | Whoever | Often stale |
| **Slack discussion** | Real-time decision-making conversation | Participants | Lost over time |

ADRs are uniquely positioned: **immutable historical record of accepted design decisions**.

## Why "lifecycle"?

A single ADR has phases:

```
PROPOSED → ACCEPTED → (eventually) SUPERSEDED OR DEPRECATED OR REJECTED
```

Without lifecycle management:
- Stale ADRs sit forever marked "ACCEPTED" even though they've been superseded
- New ADRs contradict old ones without explicit "supersedes" relationship
- ADR table in CLAUDE.md grows unbounded; readers don't know which apply NOW
- Decisions made informally never become ADRs (so spec author can't trace WHY)

ADR lifecycle management addresses these via:
1. **Format** — durable, complete, searchable
2. **Lifecycle states** — explicit transitions
3. **Relationships** — supersedes / extends / conflicts-with
4. **Drift-driven pattern** — undocumented decisions become retroactive ADRs
5. **Curator agent (R6)** — AI-assisted ADR drafting + linking

## Position in workflow

```
Author phase (01)        → spec written; foundational ADRs captured
        ↓
B1 + R3 (02-03)          → find gaps; some gaps trigger ADR
        ↓
R1+R2 (04)               → reviewers may discover undocumented decisions → retroactive ADR
        ↓
Apply (05)               → ADRs committed; CLAUDE.md ADR table updated
        ↓
   Tier 1 STATUS
        ↓
[CONTINUOUS]
  Code drift (08) → Type 3-design + Type 4 → ADR (09)
  R4 research (07) → external authority change → ADR
  PR-time → design decisions in PR → ADR
        ↓
[ANNUAL] ADR review (this folder) → mark stale ADRs SUPERSEDED
```

ADRs are **continuously created** (during design + drift response) and **periodically curated** (annually for staleness).

## When to write an ADR

Write an ADR when:

| Trigger | Example |
|---------|---------|
| Choosing between architectural alternatives | "Should we use sync or async event flow?" |
| Adopting a constraint | "All money values are NUMERIC(18,4) — no float" |
| Selecting a technology / framework | "Use Redis Streams instead of Kafka for outbox" |
| Naming a pattern | "Use outbox pattern for all GL postings" |
| Defining a workflow | "Period close requires controller role with reason" |
| Establishing a non-rule (NHW) | "GL is NOT real-time consistent across replicas" |
| Drift-driven (after the fact) | "PaymentService split into 4 sub-services per CQRS" |
| External-authority change | "CTR threshold raised from 20M to 30M MNT per 2028 amendment" |

Don't write an ADR for:
- Trivial code organization (folder naming, file structure)
- Reversible UI / UX choices
- Per-feature tactical choices that don't constrain other modules
- Bug fixes (write spawn chip + INV update; bug fix is not a "decision")

## Read order

For first-time setup (~45 min):

1. **This file** (orientation; ~10 min)
2. `01-adr-format-template.md` — what an ADR looks like; what fields to include (~10 min)
3. `02-adr-lifecycle.md` — Proposed → Accepted → Superseded → Deprecated transitions (~10 min)
4. `03-adr-relationships.md` — supersedes / extends / conflicts-with linkages (~10 min)
5. `04-drift-driven-adr-pattern.md` — when drift detection produces ADRs (~10 min)
6. `05-R6-adr-curator-agent.md` — agent prompt for ADR drafting + curation (~5 min)

For AI agents asked to draft an ADR:

1. `05-R6-adr-curator-agent.md` — copy-paste agent prompt
2. `01-adr-format-template.md` — format to follow
3. `03-adr-relationships.md` — how to link to existing ADRs

## ADR storage

Two valid options per module:

### Option A — ADR table in CLAUDE.md (lightweight; ZeeSpec default)

Each ZeeSpec module's `CLAUDE.md` has an "ADR table" section. Each ADR is one row. Full ADR text inline (short) or in a dedicated section below the table.

**Pros:** No new files; reader sees ADRs alongside read order.
**Cons:** CLAUDE.md grows over time; full ADR text awkward in table.

### Option B — Separate adr/ folder (heavier; standard ADR convention)

`docs/specs/zeespec/<module>/adr/` contains one file per ADR:
- `ADR-MOD-001-double-entry-foundation.md`
- `ADR-MOD-002-period-close-state-machine.md`
- ...

CLAUDE.md still has summary table (one-line per ADR + status) but full text is in the file.

**Pros:** Each ADR has its own commit history; easier to write long ADRs; tooling-friendly.
**Cons:** More files to maintain.

**Recommendation:** Option A for modules with < 20 ADRs; Option B for modules with > 20 ADRs OR when ADRs are written by multiple contributors.

The 4-file canonical convention (CLAUDE.md / decisions.md / implementation.md / prompts.md) some projects use is essentially Option B but with all ADRs in one `decisions.md` file. ZeeSpec is compatible with either.

## The "ADR backlog" anti-pattern

Common failure mode: ADRs written enthusiastically at module start; never updated.

```
Year 1: 12 ADRs written. All "ACCEPTED."
Year 2: 3 more ADRs. 2 of those contradict ADR-001 + ADR-005. No "supersedes" link.
Year 3: Spec author realizes ADR-001 is no longer true. Marks it "SUPERSEDED"
        but forgets to link the superseder. CLAUDE.md table shows 15 ADRs;
        which 7 actually apply NOW?
Year 5: New team member reads ADR table. Confused. Asks original team.
        Original team has left.
```

Lifecycle management (this folder) prevents this:
- Every new ADR explicitly cites any ADR it supersedes
- Annual ADR review marks stale ADRs SUPERSEDED with links
- R6 agent helps curators identify stale ADRs

## ADR vs invariant — overlap + distinction

ADRs and INV-MOD-NN can describe the same constraint, viewed from different angles:

| ADR | Invariant |
|-----|-----------|
| WHY the rule exists | WHAT the rule is |
| Captures decision context, alternatives, rationale | Captures the rule's statement + enforcement |
| Immutable after acceptance | Can be updated (status tag changes) |
| Lives in CLAUDE.md ADR table OR adr/ folder | Lives in what.md § 2 OR gravity.md |

**Example pair:**

- **ADR-WAL-005**: "Use 4-eyes principle (approver ≠ initiator) for withdrawals > 1M MNT. Rationale: ... Alternatives: 6-eyes (rejected; too slow), no SoD (rejected; audit risk)."
- **INV-WAL-08**: "Approver ID must differ from initiator ID for withdrawals > 1M MNT. Enforced at WithdrawalService.approve() line NN. Status: ✅ IMPL."

Both refer to the same constraint. ADR captures decision; INV captures the enforcement.

When you write an INV that embodies a decision (not just a fact about the system), also write the ADR. Future readers thank you.

## Anti-patterns

1. **ADR for every minor change** — diminishes signal; reserve ADRs for material decisions
2. **No ADR for material change** — undocumented decisions = future confusion
3. **Stale ADR table** — never reviewed; full of contradictions
4. **No supersedes link** — readers can't tell which ADRs apply NOW
5. **ADR after the fact, no rationale** — retroactive ADR that just says "we did this" without WHY
6. **ADR in PR description only** — not committed as durable artifact
7. **ADR as design doc** — too long; ADRs are concise (1-2 pages typically)
8. **No status discipline** — every ADR forever "ACCEPTED" even when superseded

## Cross-references

- `extended/workflow/08-code-drift-management/04-drift-resolution-playbook.md` — Recipe T3-design + T4 produce ADRs
- `core/workflow/01-authoring-checklist.md` Phase 12 — CLAUDE.md ADR table
- `core/checklists/invariant-numbering.md` — ADR numbering conventions (`ADR-<MOD>-NNN`)
- `core/templates/_template/CLAUDE.md` — ADR table template

## Next

→ `01-adr-format-template.md` — what to put in an ADR
→ `02-adr-lifecycle.md` — state transitions
