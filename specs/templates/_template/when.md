---
module: MODULE_NAME
dimension: when
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — WHEN (Triggers, Schedules, SLAs)

> **Stack-agnostic:** Timing semantics. Concrete cron config + scheduler bindings live in `where.md` § 5.

## 1. Time zone & calendar

| Item | Value |
|------|-------|
| Default timezone | `[your local tz, e.g., Asia/Ulaanbaatar]` |
| Storage timezone | `UTC` (always) |
| Business day source | [system] |
| Holiday source | [calendar / manual table] |

## 2. Triggers

| ID | Event | Source |
|----|-------|--------|
| **T-MOD_PREFIX-01** | [event] | [originator] |

### T-MOD_PREFIX-01: [Event name]

[When does this fire? What's the timing window?]

## 3. Retry intervals + budgets

| Transport | max_retries | initial delay | multiplier | max_delay |
|-----------|------------:|--------------:|:----------:|----------:|
| [transport_name] | N | XXX ms | M | YYY ms |

## 4. Scheduled jobs (cron)

| Job | Schedule (UTC) | Console command | Purpose |
|-----|----------------|----------------|---------|
| [job_name] | `0 17 * * *` | `app:command:name` | [purpose] |

## 5. SLA targets

| ID | Action | Target | On miss |
|----|--------|--------|---------|
| **SLA-MOD_PREFIX-01** | [action] | [target time] | [escalation] |

## 6. Channel-specific timing

[Per-channel SLA breakdown if applicable]

## 7. State machine timing

[When state transitions fire]

## 8. Master switch + race windows

[Document any pre-queue / post-queue check semantics + race conditions]

## 9. Versioning / temporality

| Type | Description |
|------|-------------|
| Latest | [most recent version semantics] |
| As-of | [point-in-time queries] |
| History | [retention] |

## 10. Retention

| Data | Retention | Reason |
|------|-----------|--------|
| [data class] | [period] | [regulation / business need] |

## 11. What this dimension does NOT cover

- WHAT changes → see `what.md`
- HOW algorithms work → see `how.md`
- WHO triggers → see `who.md`
- WHERE state persists → see `where.md`
- WHY this schedule → see `why.md`

## 12. Cross-references

- Related dimensions: how (algorithms), where (cron infrastructure), why (BR timing)
