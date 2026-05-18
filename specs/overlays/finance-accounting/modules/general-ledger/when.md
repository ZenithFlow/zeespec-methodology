---
module: general-ledger
dimension: when
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — WHEN (Timing + Triggers + Schedule)

## 1. Time zone & calendar

| Item | Value |
|------|-------|
| Default timezone | `[your local tz — e.g., Asia/Ulaanbaatar for FRC]` |
| Storage timezone | `UTC` (always) |
| Business day source | [system / calendar table] |
| Holiday source | [your jurisdiction's official holiday calendar] |
| Fiscal year start | [your project's FY start — often Jan 1; FRC fiscal year for entities can vary] |

## 2. Posting cutoffs

| Action | Cutoff | Behaviour after cutoff |
|--------|--------|------------------------|
| Customer-initiated journals (via wallet, etc.) | 16:00 local | Queued for next business day |
| Operator-posted REGULAR journals | 18:00 local | Allowed by exception (with reason) |
| ADJUSTING journals | 21:00 local on period-close day | Controller exception only |
| OPENING / CLOSING (system.eod) | EOD batch window 22:00-02:00 | Scheduled |
| FX revaluation (system.fx) | Period-end day 23:00 | Mandatory before period close |

## 3. Period schedule

| Period type | Start | End | Soft-close | Hard-close |
|-------------|-------|-----|------------|------------|
| Daily (informal) | 00:00 | 23:59 | EOD | EOD + reconciliation pass |
| Monthly | 1st 00:00 | last 23:59 | M+5 working days | M+10 working days |
| Quarterly | Q-start | Q-end | Q+5 working days | Q+10 working days |
| Annual | FY start | FY end | Y+30 calendar days | Y+90 calendar days (audited) |

## 4. Triggers (T-GL-*)

### T-GL-01 — Journal posted
- Source: `AccountingService.postJournal()` success
- Emits: `JournalPostedEvent` to outbox
- Subscribers: subledger sync, reporting, fee accrual, notification

### T-GL-02 — Journal reversed
- Source: `AccountingService.reverseJournal()` success
- Emits: `JournalReversedEvent` + the new REVERSING journal event
- Subscribers: downstream + compliance alert if reversal of CLOSED-period journal

### T-GL-03 — Period soft-closed
- Source: `PeriodCloseService.initiateClose()` success
- Emits: `PeriodSoftClosedEvent`
- Subscribers: blocks new customer-initiated postings; controller dashboard refresh

### T-GL-04 — Period hard-closed
- Source: `PeriodCloseService.completeClose()` success
- Emits: `PeriodClosedEvent`
- Subscribers: regulatory reporting (kicks off FRC submission build)

### T-GL-05 — Period reopened
- Source: `PeriodCloseService.reopenPeriod()` success
- Emits: `PeriodReopenedEvent` + ALERT to compliance + executive
- Subscribers: regulatory disclosure workflow (some jurisdictions require notification)

### T-GL-06 — Trial balance assertion failure
- Source: `ReconciliationService.assertTrialBalance()` returns false
- Emits: `TrialBalanceBreakEvent` + 🚨 P0 alert
- Subscribers: halt period close; notify controller

### T-GL-07 — Subledger reconciliation break
- Source: `ReconciliationService.reconcileSubledger()` finds diff > materiality
- Emits: `ReconciliationBreakEvent` + alert (severity depends on aging)
- Subscribers: compliance dashboard; break queue

### T-GL-08 — Cached balance drift detected
- Source: Daily reconciliation job comparing materialized balances vs SUM(journal_line)
- Emits: `BalanceDriftEvent` + 🚨 P0 if drift > 0
- Subscribers: halt downstream until resolved

## 5. Schedules

| Job | Schedule | Actor | Purpose |
|-----|----------|-------|---------|
| EOD batch | Daily 22:00 | system.eod | Trial balance assertion, snapshot, retention archive |
| FX rate refresh | Business days 09:30 (after market open) | system.fx | Provider fetch + cache update |
| FX revaluation | Period-end day 23:00 | system.fx | Per IAS 21; posts revaluation journals |
| Subledger reconciliation | Daily 23:30 | system.recon | Per INV-GL-18; for each subledger ↔ control account |
| Cached balance reconciliation | Daily 02:00 | system.recon | If using cached balances |
| Period-end snapshot | EOD on period close | system.eod | Trial balance, BS, P&L |
| Retention archive | Weekly Sunday 03:00 | system.eod | Move rows beyond hot window to archive table |
| Audit log integrity check | Daily 04:00 | system.eod | Hash chain verification |

## 6. SLAs

| ID | Target | Description |
|----|--------|-------------|
| SLA-GL-POST-2s | < 2 seconds | postJournal latency at p99 |
| SLA-GL-RECON-30min | < 30 minutes | Daily subledger reconciliation completion |
| SLA-GL-EOD-4h | < 4 hours | Full EOD batch (recon + snapshots + archive) |
| SLA-GL-FX-15min | < 15 minutes | FX rate refresh completion (post-market-open) |
| SLA-GL-PERIODCLOSE-1d | < 1 working day | initiateClose to completeClose for monthly |
| SLA-GL-BREAK-RESOLVE-3d | < 3 days | Reconciliation break aged before P0 escalation |

## 7. Retry + failure handling

| Failure | Retry policy | Escalation |
|---------|--------------|------------|
| FX provider unavailable | 3 retries, 60s backoff | Fallback to secondary provider; if both fail → alert |
| DB transient (connection drop) | 3 retries, exponential | After retries → fail the job; alert |
| Reconciliation break | NO retry (re-run is OK; break is a finding not a failure) | Aging triggers escalation per HW-FIN-27 |
| Period close blocked by checklist | NO automatic retry | Controller manually resolves blocking item, re-runs |

## 8. Cross-references

- `how.md` ALG-GL-PERIOD-CLOSE-01 — period close mechanics
- `who.md` § 1 system actors — A-GL-06/07/08
- `where.md` § 5 — async transport for outbox events
- `gravity.md` HW-GL-* — timing-related hardwiring
