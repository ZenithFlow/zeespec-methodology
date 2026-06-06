---
doc: overlays/finance-accounting/principles/financial-anti-patterns
type: principles-spec
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Financial Anti-Patterns — 15 Finance-Specific Traps

> Extends the core ZeeSpec anti-patterns (`checklists/anti-patterns.md`). Catalogued from the pilot project. Many of these are caused by NOT having a strong accounting model up front.

## 1. Float for money

**Symptom:** Amount stored or computed as `float` / `double` / JavaScript `Number`.

**Example:**
```
// PHP pilot
$balance = $deposit - $withdrawal;  // both floats → 99.99000000000001
```

**Impact:** Drift over millions of transactions; reconciliation fails; regulator finds "money missing."

**Fix:** Use Money/Decimal type EVERYWHERE. See `accounting-principles.md` § 8.

**Caught by:** R3 grep `rg "float\|double\|Number" --include='*.{ext}'` on monetary code paths.

---

## 2. Rounding before sum

**Symptom:** Each line rounded then summed; total ≠ sum of rounded lines.

**Example:**
```
0.333... + 0.333... + 0.333... = 1.0
   round(0.33) + round(0.33) + round(0.33) = 0.99   ← bug
```

**Impact:** Pennies leak over volume; balance sheet shows divergence; audit fails.

**Fix:** Sum in full precision; round ONCE at presentation. Or use "smallest unit" integer arithmetic (cents).

---

## 3. Caching balance without reconciliation

**Symptom:** `account.balance` stored as a column; updated on every transaction; never reconciled to sum of journal lines.

**Example:**
```
Update account SET balance = balance + amount WHERE id = X
... over time, balance drifts from SUM(journal_line) due to:
- race conditions
- failed-mid-transaction updates
- manual SQL fixes
```

**Impact:** "Source of truth" diverges from underlying ledger. Customer balances wrong.

**Fix:**
- Daily reconciliation job: assert `account.balance = SUM(journal_line) for that account`
- Divergence > materiality = 🚨 P0
- OR: don't cache — compute on read (with index)

**See:** INV-ACC-03 in `accounting-principles.md`.

---

## 4. Single-row "journal" (debit and credit on one row)

**Symptom:** Table has both `debit_amount` and `credit_amount` columns on the same row.

**Example:**
```
journal_line: (account_id, debit_amt, credit_amt, ...)
              (1100,       100,       0)            ← debit row
              (4100,       0,         100)          ← credit row
```

**Looks ok but actually fine.** The anti-pattern is when a *single* row carries both:
```
journal_line: (id, debit_account, credit_account, amount)  ← bad
              (1,  1100,          4100,           100)
```

**Impact:** Multi-leg transactions (3+ accounts) impossible. Reporting groups by account become wrong (can't sum debits from one column without filtering by which account).

**Fix:** One row per debit/credit leg. `(journal_id, account_id, side ENUM(DEBIT, CREDIT), amount)`. Per INV-ACC-01 sum of DEBIT side = sum of CREDIT side per journal_id.

---

## 5. Backdating allowed (no posting-date guard)

**Symptom:** Operator can post a journal entry with `posting_date = '2025-12-15'` even though we're in January 2026 and the period is CLOSED.

**Impact:** Closed-period mutation invalidates already-filed regulatory reports. Auditor finds journals dated in periods that were "audited and signed."

**Fix:** Service rejects post() if posting_date NOT in OPEN period. See INV-ACC-05/06.

**Caught by:** R1 tracing post() call chain; R2 inspector question "Show me journals posted to closed periods in the last 90 days" returning rows.

---

## 6. Per-channel CTR check (net vs gross confusion)

**Symptom:** CTR threshold checked per-payment-channel, not per-customer-cash-total. A customer making 3 cash deposits of 7M MNT each at different counters doesn't trigger 20M MNT CTR — even though aggregate is 21M.

**Impact:** "Structuring" / "smurfing" attack passes unnoticed; AML violation.

**Fix:** CTR rule operates on `SUM(cash_amount) per customer per day` (or per rolling window). Filing triggered when sum crosses threshold even if no single transaction did.

Plus: STR typology rule for "multiple sub-threshold same day" — file STR even if total below CTR.

---

## 7. Sanctions list cached forever

**Symptom:** OFAC SDN list fetched once at integration; cached in memory; never refreshed.

**Impact:** New designation = missed sanction hit = potential criminal liability.

**Fix:**
- Daily refresh job
- Alert on refresh failure (no silent fallback to stale list)
- Last-refresh timestamp visible on compliance dashboard
- Versioned list — log which list version produced the hit

---

## 8. KYC-bypass via business-logic shortcut

**Symptom:** A "preferred customer" flag bypasses KYC check for "VIP onboarding speed."

**Example:**
```
function canTransact(customer):
  if customer.is_vip:
    return true              // ← bypass!
  return customer.kyc_tier >= TIER_BASIC
```

**Impact:** AML regulator: zero-tolerance. Even one "VIP" with non-verified identity is a violation.

**Fix:** NO bypasses. VIP customers go through KYC fast-track (same checks, dedicated reviewer), not bypass.

---

## 9. NAV calculated from stale prices

**Symptom:** NAV uses last-known security prices; if a price provider hasn't updated for hours/days, NAV is wrong.

**Impact:** Investor subscriptions/redemptions at wrong NAV. Realized loss for the fund OR for investors. Regulator action if pattern detected.

**Fix:**
- Stale-price detection (price age > N hours = halt NAV)
- Multi-provider redundancy (primary + secondary feed)
- Manual-price-override audit trail (controller-signed)
- Reprice on price-correction (T+1 NAV restate process)

---

## 10. Fee accrual off-by-one (day-count basis confusion)

**Symptom:** Management fee = 1.5% annually. Daily accrual = `AUM × 0.015 / 365`. But what's "365"? Calendar days? Business days? Actual/360? Actual/365? 30/360?

**Example:**
```
Pilot used Calendar days (365) but custodian reports Actual/360.
After 1 year: fee_per_internal_calc vs fee_per_custodian = 1.39% drift.
Drift accumulates.
```

**Impact:** Fee dispute with custodian; restate prior NAVs; customer refunds.

**Fix:**
- Day-count convention DOCUMENTED in spec + tested
- Match the custodian's convention exactly (or document the difference explicitly)
- Annual reconciliation: internal accrual sum vs custodian-billed amount

---

## 11. Settlement date computed without holiday calendar

**Symptom:** "T+2 settlement" computed as `transaction_date + 2 calendar days`. Doesn't account for weekends or holidays.

**Example:**
```
Buy Friday Dec 26 (after Christmas holiday); naive T+2 = Sunday Dec 28 (markets closed)
```

**Impact:** Settlement fails; trade aged; counterparty risk; regulator inquiry.

**Fix:**
- Holiday calendar table (per market / jurisdiction)
- `addBusinessDays(date, N)` function that skips non-business days
- Test: settlement date for a Friday-before-Monday-holiday = Wednesday

---

## 12. Multi-currency portfolio reported in mixed currencies

**Symptom:** Portfolio total = `sum(security.market_value)` where market values are in their native currencies.

**Example:**
```
US stock value $1000 + Japanese stock value ¥150000 + Mongolian bond ₮5000000
= 1000 + 150000 + 5000000 = 5151000 ← garbage
```

**Impact:** Customer sees nonsense total. NAV wrong. Regulator inquiry.

**Fix:** Convert ALL securities to base currency at calculation time. Report in base currency. Optionally show breakdown.

---

## 13. Approval workflow says "approved" but transaction never executes

**Symptom:** Approver clicks approve; UI shows "approved"; but downstream job that actually executes the transaction is broken / unsubscribed / failing silently.

**Example from pilot:**
```
JournalApprovalService::post requires status=APPROVED
AccountingService::postJournal only allows status=DRAFT
→ Every "approved" journal throws InvalidArgumentException downstream
   but UI shows "approved" successfully
```

**Impact:** Operators believe transactions completed; books actually have no entry; customer balances frozen; mass restate event.

**Fix:**
- End-to-end test: approve → post → verify journal exists
- Alert on stuck-in-APPROVED-status > N minutes
- UI surfaces actual journal_id when journal posted (not just "approved")

---

## 14. Hard DELETE on retention-required tables

**Symptom:** Periodic cleanup job runs `DELETE FROM journal_line WHERE created_at < NOW() - INTERVAL '1 year'`.

**Impact:** Direct violation of 7-year retention (Mongolia AML, US BSA, etc.). License risk.

**Fix:**
- REVOKE DELETE permission on retention tables
- Move-to-archive pattern (cold storage table, still retrievable for 7y)
- Code review checklist: any new DELETE statement on a retention table → 🚨 P0 review

---

## 15. Reconciliation break silently swallowed

**Symptom:** Daily reconciliation job runs; finds 5M MNT discrepancy between bank statement and internal records; logs the discrepancy; finishes "successfully" (exit 0).

**Impact:** Operator never sees the issue; days/weeks pass; discrepancy grows; finally a customer complains and reconciliation reveals 50M MNT gap.

**Fix:**
- Reconciliation jobs that find breaks MUST:
  - Write to break_queue table (visible on compliance dashboard)
  - Emit alert (Slack, PagerDuty, email — based on materiality)
  - Block dependent jobs (e.g., if subledger-to-GL break > materiality, halt period close)
- "Reconciled successfully with 0 breaks" is the only success state.

---

## Cross-link: combine with core anti-patterns

The core ZeeSpec anti-patterns in `checklists/anti-patterns.md` ALL still apply to finance modules. The 15 here are additive.

Finance-relevant core anti-patterns to watch most closely:

- Core #1/2 (false-positive / false-negative enforcement) — applies heavily to KYC, AML, SoD claims
- Core #7 (createdBy:0 sentinel) — see INV-FIN-01
- Core #9 (sync/async lie) — fee accrual / NAV / reconciliation are often "we'll do it nightly" but actually never run
- Core #11 (state machine fiction) — settlement / KYC state machines often have DEAD states (e.g., "REJECTED" exists in enum but no path sets it)
- Core #12 (approval boundary mismatch) — combined with finance trap #13 above
- Core #13 (hard DELETE retention) — combined with finance trap #14 above

## Detection commands

```bash
# Float on money (your-language-specific)
rg "float\|double\|number" --type=ext path/to/finance/code

# Sentinel createdBy
rg "createdBy:\s*0\|userId:\s*0\|created_by\s*=\s*0" path/to/finance/code

# Hard DELETE on audit-ish tables
rg "DELETE FROM (audit_log|journal_line|kyc_documents|transaction|account_balance)" path/to/migrations

# Stale sanctions data check
psql -c "SELECT MAX(refreshed_at) FROM sanctions_list_version;" → if > 48h ago: 🚨

# Backdating check
psql -c "SELECT COUNT(*) FROM journal WHERE posting_date NOT IN (SELECT period_date FROM fiscal_period WHERE status = 'OPEN');" → if > 0: 🚨

# Single-day cash sum vs CTR threshold
psql -c "SELECT customer_id, SUM(cash_amount) FROM transaction WHERE type='CASH' AND date=CURRENT_DATE GROUP BY customer_id HAVING SUM(cash_amount) >= 20000000;" → vs filed_ctr table

# Reconciliation breaks aged
psql -c "SELECT * FROM reconciliation_break WHERE resolved_at IS NULL AND created_at < NOW() - INTERVAL '3 days';"
```

## Severity defaults (calibrated to financial-services impact)

| Anti-pattern | Default severity |
|--------------|------------------|
| 1. Float for money | 🚨 P0 (silent drift) |
| 2. Rounding before sum | 🚨 P0 (silent drift) |
| 3. Cached balance without reconciliation | 🚨 P0 (potential customer impact) |
| 4. Single-row journal | 🚨 P0 (multi-leg blocked) |
| 5. Backdating allowed | 🚨 P0 (closed-period violation) |
| 6. Per-channel CTR check | 🚨 P0 (AML violation) |
| 7. Sanctions list stale | 🚨 P0 (regulatory) |
| 8. KYC bypass | 🚨 P0 (zero-tolerance) |
| 9. NAV with stale prices | 🚨 P0 (customer impact) |
| 10. Fee accrual off-by-one | 🟠 P1 (drift, eventual restatement) |
| 11. Settlement w/o holiday calendar | 🟠 P1 (occasional fail) |
| 12. Multi-currency mixed totals | 🚨 P0 (UI/NAV wrong) |
| 13. Approved-but-not-executed | 🚨 P0 (silent failure) |
| 14. Hard DELETE on retention tables | 🚨 P0 (regulatory) |
| 15. Reconciliation break swallowed | 🟠 P1 → 🚨 P0 if aged > 7 days |

## Next

→ `severity-matrix-finance.md` — FRC-tuned severity calibration
