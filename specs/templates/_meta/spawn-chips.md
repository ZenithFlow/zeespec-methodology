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

## Statistics (auto-update during pilot retrospective)

- Total chips dispatched: N
- 🟢 RESOLVED: X (X% closure rate)
- 🔴 OPEN: Y (average age: Z days)
- ⚪️ DEFERRED: W

## Top chip sources by review type

| Review phase | Chips dispatched |
|--------------|-----------------:|
| R3 deep verifier | N |
| R1 algorithm reviewer | N |
| R2 compliance reviewer | N |
| User-initiated | N |
