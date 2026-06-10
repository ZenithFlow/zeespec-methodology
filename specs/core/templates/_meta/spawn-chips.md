---
doc: core/templates/_meta/spawn-chips
type: meta-template
version: 4.0.0
status: stable
last_updated: 2026-06-10
---

# Spawn Task Chips — Project-Wide Tracking

> Dashboard of all spawn task chips dispatched from ZeeSpec reviews. Replaces ad-hoc tracking.

## How to use

After each `06-spawn-task-chips.md` workflow, append a row to the appropriate table below.

## OPEN chips

| Date | Module | Title | Severity | Gaps closed | Owner |
|------|--------|-------|:--------:|-------------|-------|
| YYYY-MM-DD | [module] | [chip title] | 🚨 P0 | Gap-MOD-XXX | [team] |

## RESOLVED chips (PRs merged)

| Date filed | Date landed | Module | Title | Severity | PR |
|------------|-------------|--------|-------|:--------:|-----|
| YYYY-MM-DD | YYYY-MM-DD | [module] | [chip title] | 🚨 P0 | #NNN |

## DEFERRED chips (postponed)

| Date | Module | Title | Severity | Reason | Revisit by |
|------|--------|-------|:--------:|--------|-----------|
| YYYY-MM-DD | [module] | [chip title] | 🟠 P1 | [reason] | YYYY-MM-DD |

## Statistics (update manually during pilot retrospective)

- Total chips dispatched: N
- 🟢 RESOLVED: X (X% closure rate)
- 🔴 OPEN: Y (average age: Z days)
- ⚪️ DEFERRED: W
