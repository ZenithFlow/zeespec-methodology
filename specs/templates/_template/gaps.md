---
module: MODULE_NAME
dimension: gaps
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — OPEN GAPS

> **DO NOT GUESS.** Severity-based blocking:
>
> | Severity | Ticket | AI behaviour |
> |----------|:------:|--------------|
> | 🚨 Critical | No | **STOP** |
> | 🚨 Critical | Yes (MOD-IMPL-XXX) | Refer; do NOT implement |
> | 🟠 High | No | **STOP** |
> | 🟠 High | Yes | Cite; proceed if explicitly invoked |
> | 🟡 Medium | No | Implement if obvious + cite |
> | 🟢 Low | Either | Implement + cite |

## Status legend

| Status | Meaning |
|--------|---------|
| 🔴 OPEN | Blocking — no decision yet |
| 🟡 PROPOSED | Solution drafted, awaiting approval |
| 🟢 RESOLVED | Decision recorded |
| ⚪️ DEFERRED | Postponed |
| 📌 BY-DESIGN | Documented intentional gap |

## Summary table

### Drift items (B1 verification YYYY-MM-DD)

| ID | Title | Status | Severity |
|----|-------|:------:|----------|
| **D1** | [drift description] | 🔴 OPEN | 🟡 P2 |

### Operational follow-ups

| ID | Title | Status | Severity | Notes |
|----|-------|:------:|----------|-------|
| **FU-MOD_PREFIX-FIRST** | [follow-up] | 🔴 OPEN | 🟠 P1 | [notes] |

### Research questions (open, not blocking)

| ID | Title | Status | Notes |
|----|-------|:------:|-------|
| **RES-MOD_PREFIX-Q1** | [open question] | 🟢 P3 OPEN | [notes] |

## Gap details

### D1 — [Drift title]

**Problem:** [Description]

**R3 / R1 verification target:** [What needs verification]

**Resolution:** [Plan or "TBD"]

### FU-MOD_PREFIX-FIRST — [Follow-up title]

**Problem:** [Description]

**Compliance concern:** [Regulatory angle if any]

**Proposed fix:**
1. [Step 1]
2. [Step 2]

**Owner:** [Team / person]

## Severity matrix application

| Gap | Severity | AI behaviour |
|-----|----------|--------------|
| D1 | 🟡 P2 | Cite + proceed |
| FU-MOD_PREFIX-FIRST | 🟠 P1 | STOP if user asks "implement Y" |

## R1 + R2 reviewer findings (applied YYYY-MM-DD)

[Fill after Tier 1 promotion. Group by R1 P0/P1/P2 + R2 P0/P1/P2.]

| Finding | Severity | Source | Resolution |
|---------|:--------:|--------|------------|
| **R1-C1** | 🔴 Critical | [file:line] | [fix or filed gap] |

## Migration / cleanup tasks for next session

1. **[Task name]** — [description]
2. **[Task name]** — [description]

## Cross-references

- 4-file canonical: `docs/specs/MODULE_NAME/CLAUDE.md` (if exists)
- Sibling cross-links: see cross-references in each dimension file
- Related dimensions: what (entity drift), how (algorithm gaps), where (storage gaps), gravity (HW gaps)
