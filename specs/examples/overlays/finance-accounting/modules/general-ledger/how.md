---
module: general-ledger
dimension: how
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — HOW (Algorithms + Processes)

## 1. Top-level service surface

```
AccountingService:
  postJournal(input: PostJournalInput) → Journal           // ALG-GL-POST-01
  reverseJournal(input: ReverseInput) → Journal            // ALG-GL-REVERSE-01
  getAccountBalance(account_id, at_date) → Money           // ALG-GL-BALANCE-01
  getTrialBalance(period_id) → TrialBalance                // ALG-GL-TRIAL-01

PeriodCloseService:
  initiateClose(period_id, actor) → PeriodCloseSession      // ALG-GL-PERIOD-CLOSE-01
  completeClose(session_id, actor) → FiscalPeriod
  reopenPeriod(period_id, actor, reason) → FiscalPeriod    // controller-only

ReconciliationService:
  reconcileSubledger(subledger_id, control_account_id) → ReconciliationReport  // ALG-GL-RECON-01
  assertTrialBalance(period_id) → BoolOrThrow              // ALG-GL-TRIAL-ASSERT-01
```

## 2. Algorithm — ALG-GL-POST-01 (post journal)

**Production:** `[path]/Service/AccountingService.{ext}` `postJournal()` line NN-MM.

```
postJournal(input: PostJournalInput) → Journal:
  # Pre-conditions
  ASSERT input.lines.length >= 2                         # INV-GL-01 implicit
  ASSERT actor.id > 0                                    # INV-GL-07
  ASSERT input.posting_date <= today                     # INV-GL-06
  period := findPeriodForDate(input.posting_date)
  ASSERT period.status IN (OPEN, SOFT_CLOSED_with_controller_role)  # INV-GL-05

  # Compute base-currency amounts
  base_currency := organization.base_currency
  fx_rates := fxRateProvider.getRatesForDate(input.posting_date)
  lines_with_base := input.lines.map(line ->
    if line.transaction_currency == base_currency:
      line.base_amount = line.transaction_amount
      line.fx_rate = 1.0
    else:
      rate := fx_rates.getRate(line.transaction_currency, base_currency)
      line.base_amount = line.transaction_amount * rate
      line.fx_rate = rate
      line.fx_rate_source = fx_rates.source
    return line
  )

  # INV-GL-01: assert debit = credit in base currency
  debit_sum := lines_with_base.filter(side == DEBIT).sum(base_amount)
  credit_sum := lines_with_base.filter(side == CREDIT).sum(base_amount)
  ASSERT debit_sum == credit_sum                         # else THROW JournalImbalanced

  # INV-GL-16: assert all account_ids are leaf
  FOR line IN lines_with_base:
    account := accountRepo.find(line.account_id)
    ASSERT account.is_leaf                               # else THROW NonLeafAccount
    ASSERT account.is_active                             # else THROW AccountInactive

  # INV-GL-04 (if applicable): no-negative pre-check
  FOR line IN lines_with_base:
    account := ...
    if account.account_type == ASSET AND NOT account.allow_overdraft:
      projected_balance := getAccountBalance(account.id, today) + delta(line)
      ASSERT projected_balance >= 0                      # else THROW WouldOverdraw

  # Persistence in single DB transaction (HW-GL-16 atomicity)
  BEGIN TRANSACTION
    journal := journalRepo.insert(
      journal_type = input.journal_type,
      posting_date = input.posting_date,
      period_id = period.id,
      description = input.description,
      created_by = actor.id,
      posted_by = actor.id,
      correlation_id = input.correlation_id,
      status = POSTED,
      ...
    )

    FOR seq, line IN enumerate(lines_with_base, start=1):
      journalLineRepo.insert(journal_id = journal.id, line_seq = seq, ...line)

    auditLog.append(
      entity_type = 'journal',
      entity_id = journal.id,
      action = POST,
      actor_id = actor.id,
      acted_at = NOW(),
      reason = input.reason,
      after_state = serialize(journal),
      correlation_id = input.correlation_id
    )
  COMMIT

  # Optional: outbox event for downstream (subledger sync, reporting)
  outbox.publish(JournalPostedEvent(journal.id, ...))

  return journal
```

**Edge cases:**
- Currency mismatch in single account (account has currency_code; line.transaction_currency differs) → THROW CurrencyMismatch
- Reversing journal: special-case via reverseJournal() — not via postJournal()
- Posting near period boundary (e.g., date = 2026-01-01 at 23:00 UTC, but local time is 2026-01-02): use organization's local timezone for date determination, store as posting_date.

## 3. Algorithm — ALG-GL-REVERSE-01 (reverse journal)

```
reverseJournal(input: ReverseInput) → Journal:
  original := journalRepo.find(input.original_journal_id)
  ASSERT original.status == POSTED                       # not already REVERSED
  ASSERT NOT EXISTS journal WHERE reverses_journal_id = original.id  # INV-GL-08 uniqueness
  ASSERT actor.role IN (controller, approver)            # SoD: reversal is sensitive
  ASSERT input.reason IS NOT NULL AND length(input.reason) >= 10  # reason mandatory

  # Build reversed lines (flip side)
  reversed_lines := original.lines.map(line ->
    Line(
      account_id = line.account_id,
      side = if line.side == DEBIT then CREDIT else DEBIT,
      transaction_amount = line.transaction_amount,
      transaction_currency = line.transaction_currency,
      memo = "Reversal of journal " + original.journal_number
    )
  )

  # Determine reversal posting date
  if today's period is OPEN AND original.period_id != today's period:
    reversal_posting_date := today                       # reverse in current period
  else:
    reversal_posting_date := input.requested_date OR today

  # Post as new journal of type REVERSING
  reversing_journal := postJournal(PostJournalInput(
    journal_type = REVERSING,
    posting_date = reversal_posting_date,
    description = "Reversal of " + original.journal_number + ": " + input.reason,
    lines = reversed_lines,
    correlation_id = newCorrelationId(),
    reason = input.reason
  ))

  # Link
  reversing_journal.reverses_journal_id = original.id
  original.status = REVERSED
  journalRepo.update(reversing_journal)
  journalRepo.update(original)

  auditLog.append(
    action = REVERSE,
    entity_id = original.id,
    actor_id = actor.id,
    reason = input.reason,
    after_state = serialize({original_status: REVERSED, reversing_journal_id: reversing_journal.id})
  )

  return reversing_journal
```

## 4. Algorithm — ALG-GL-BALANCE-01 (get account balance)

```
getAccountBalance(account_id, at_date) → Money:
  # Sum journal lines up to and including at_date
  rows := journal_line
    JOIN journal ON journal_line.journal_id = journal.id
    WHERE journal_line.account_id = account_id
      AND journal.posting_date <= at_date
      AND journal.status IN (POSTED)  # excludes DRAFT; includes REVERSED (the lines themselves count)
    SELECT side, SUM(base_amount) as total
    GROUP BY side

  debit_total := rows.find(side == DEBIT)?.total OR 0
  credit_total := rows.find(side == CREDIT)?.total OR 0

  account := accountRepo.find(account_id)
  # Apply normal-balance direction
  if account.account_type IN (ASSET, EXPENSE):
    balance := debit_total - credit_total
  else: # LIABILITY, EQUITY, REVENUE
    balance := credit_total - debit_total

  return Money(balance, organization.base_currency)
```

**Performance:** This naive implementation does a table scan per account. For production:
- Add covering index on (account_id, posting_date)
- Cache opening-balance at period boundaries (period_account_balance materialization)
- getBalance(account_id, at_date) = getOpeningBalance(account_id, period_start_of(at_date)) + sumOverPeriod(account_id, period_start, at_date)

If cached: per INV-GL-03/18, reconcile daily.

## 5. Algorithm — ALG-GL-PERIOD-CLOSE-01

```
initiateClose(period_id, actor) → PeriodCloseSession:
  ASSERT actor.role IN (controller)
  period := periodRepo.find(period_id)
  ASSERT period.status == OPEN

  # Run pre-close checklist (per accounting-principles.md § 3)
  checklist := PeriodCloseChecklist(
    bank_reconciliations_complete: check(),
    ar_ap_reconciliations_complete: check(),
    accruals_posted: check(),
    deferred_revenue_amortized: check(),
    fx_revaluation_done: check(),
    depreciation_run: check(),
    inventory_valuation_done: check(),
    provisions_reviewed: check(),
    intercompany_reconciled: check(),
    trial_balance_reconciled: check(),
    subledger_to_gl_reconciled: check()
  )

  if NOT checklist.all_passed:
    return PeriodCloseSession(
      status = BLOCKED,
      failed_items = checklist.failures
    )

  # Move to SOFT_CLOSED
  BEGIN TRANSACTION
    period.status = SOFT_CLOSED
    period.closed_by = actor.id
    period.closed_at = NOW()
    periodRepo.update(period)
    auditLog.append(action = CLOSE_INITIATED, ...)
  COMMIT

  return PeriodCloseSession(period_id = period.id, status = SOFT_CLOSED, checklist)


completeClose(session_id, actor) → FiscalPeriod:
  session := sessionRepo.find(session_id)
  period := periodRepo.find(session.period_id)
  ASSERT actor.role IN (controller)
  ASSERT period.status == SOFT_CLOSED

  # Take period-end snapshots
  snapshotService.takeSnapshot(period.id, snapshot_type = TRIAL_BALANCE)
  snapshotService.takeSnapshot(period.id, snapshot_type = BALANCE_SHEET)
  snapshotService.takeSnapshot(period.id, snapshot_type = PROFIT_AND_LOSS)

  # Final state
  BEGIN TRANSACTION
    period.status = CLOSED
    periodRepo.update(period)
    auditLog.append(action = CLOSE_COMPLETED, ...)
  COMMIT

  # Notify downstream (regulatory reporting, etc.)
  outbox.publish(PeriodClosedEvent(period.id))

  return period


reopenPeriod(period_id, actor, reason) → FiscalPeriod:
  ASSERT actor.role == controller
  period := periodRepo.find(period_id)
  ASSERT period.status == CLOSED            # cannot reopen ARCHIVED
  ASSERT reason IS NOT NULL AND length(reason) >= 20  # reason mandatory + meaningful

  BEGIN TRANSACTION
    period.status = OPEN
    period.reopened_count += 1
    periodRepo.update(period)
    auditLog.append(action = REOPEN, reason = reason, actor_id = actor.id, ...)
  COMMIT

  # Notify (often triggers regulator-disclosure workflow)
  outbox.publish(PeriodReopenedEvent(period.id, reason))

  return period
```

## 6. Algorithm — ALG-GL-RECON-01 (reconcile subledger to GL)

```
reconcileSubledger(subledger_id, control_account_id) → ReconciliationReport:
  subledger_sum := subledgerRepo.sumBalances(subledger_id, as_of = today)
  gl_balance := getAccountBalance(control_account_id, today)

  diff := subledger_sum - gl_balance

  if abs(diff) <= materiality_threshold:
    return ReconciliationReport(status = PASSED, diff = diff)
  else:
    break := reconciliationBreakRepo.insert(
      subledger_id = subledger_id,
      control_account_id = control_account_id,
      subledger_sum = subledger_sum,
      gl_balance = gl_balance,
      diff = diff,
      detected_at = NOW(),
      status = UNRESOLVED
    )
    alert.send(severity = if diff > P0_threshold then 'P0' else 'P1',
               channel = 'compliance-dashboard',
               break_id = break.id)
    return ReconciliationReport(status = FAILED, diff = diff, break_id = break.id)
```

## 7. Validation tables

### V-GL-01 — postJournal input validation

| Field | Rule | Error |
|-------|------|-------|
| lines | length >= 2 | NotEnoughLines |
| lines[i].account_id | EXISTS + is_leaf + is_active | NonLeafOrInactiveAccount |
| lines[i].transaction_amount | > 0 | InvalidAmount |
| lines[i].transaction_currency | matches ISO 4217 regex AND (account.currency_code IS NULL OR equal) | CurrencyMismatch |
| posting_date | <= today | FutureDateNotAllowed |
| posting_date | within OPEN period | PeriodNotOpen |
| actor.id | > 0 | NoOperator |
| sum(DEBIT base_amount) | == sum(CREDIT base_amount) | JournalImbalanced |

## 8. Edge cases + failure modes

| Scenario | Behaviour |
|----------|-----------|
| FX rate unavailable | THROW FxRateUnavailable; do NOT default to 1.0 silently |
| Account deactivated mid-journal authoring | postJournal() rejects at validation; user re-selects |
| Network failure mid-transaction | DB transaction rolls back; client retries with same correlation_id (idempotency key) |
| Two simultaneous posts to same control account | DB row-level locking on account + INV-GL-04 re-check after lock |
| Period closes between authoring and posting | postJournal() rejects with PeriodClosed; user may file as ADJUSTING (controller workflow) |
| Reversing a journal whose original was in a CLOSED period | reverseJournal() posts the reversal in CURRENT period (different posting_date) — see ALG-GL-REVERSE-01 |

## 9. Cross-references

- `who.md` — actor + RBAC model + SoD constraints
- `when.md` — period schedule + cutoff times
- `where.md` — storage + indexes
- `gravity.md` — HW-GL-* cross-cutting constraints
- `../../principles/accounting-principles.md` — algorithmic correctness foundations
