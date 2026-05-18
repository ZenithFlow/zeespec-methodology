---
module: general-ledger
dimension: gravity
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — GRAVITY (Hardwiring)

> Cross-cutting constraints that span dimensions. Code MUST honor these regardless of what other dimension files say.

## §1. Core hardwiring (HW-GL-*)

### HW-GL-01 — Debit = Credit per journal (base currency)
**Status:** ✅ IMPL
**Source:** TRIGGER `tg_journal_line_balance_check` on journal_line; AccountingService.postJournal pre-check.
**Test:** Random-journal property test rejects imbalanced inputs.
**Dimension links:** what.md INV-GL-01 + INV-GL-09; how.md ALG-GL-POST-01.

### HW-GL-02 — Journal immutability (no UPDATE, no DELETE)
**Status:** ✅ IMPL
**Source:** GRANT statements REVOKE UPDATE, DELETE on journal + journal_line from application_user; service interface has no update/delete methods.
**Test:** Direct SQL `UPDATE journal SET status = 'foo' WHERE ...` fails with permission denied.
**Dimension links:** what.md INV-GL-02; how.md (ALG-GL-REVERSE-01 as the corrective pattern).

### HW-GL-03 — Period state machine forward-only (except REOPEN)
**Status:** ✅ IMPL
**Source:** PeriodCloseService guards transitions; DB CHECK trigger on fiscal_period.status.
**Dimension links:** what.md INV-GL-05; how.md ALG-GL-PERIOD-CLOSE-01; who.md SOD-GL-03.

### HW-GL-04 — Atomic posting (all-lines-or-none)
**Status:** ✅ IMPL
**Source:** AccountingService.postJournal wraps all INSERTs + audit_log + outbox in single DB transaction.
**Test:** Force INSERT failure on line 3 of 5; verify lines 1-2 not present after rollback.
**Dimension links:** how.md ALG-GL-POST-01; where.md F-GL-W-01.

### HW-GL-05 — Outbox pattern for async events
**Status:** ✅ IMPL
**Source:** outbox_event table written in same TX as journal; separate worker drains.
**Reason:** Guarantees at-least-once delivery without distributed transactions.
**Dimension links:** where.md S-GL-08; when.md T-GL-01.

### HW-GL-06 — Operator identity captured (no sentinels)
**Status:** ⚠️ HISTORICAL: 🚧 NOT-ENFORCED in pilot (createdBy:0 anti-pattern across 20+ sites). MUST be ✅ IMPL after spawn-chip remediation.
**Source:** DB CHECK(created_by > 0); FK to users; service injects authenticated session.
**Test:** INSERT with created_by = 0 fails with CHECK violation.
**Dimension links:** what.md INV-GL-07; who.md § 6.

### HW-GL-07 — All money math via Money type
**Status:** ✅ IMPL (verify via codebase grep)
**Source:** No `float` / `double` / `Number` in monetary code paths; all amounts go through Money / Decimal / BigDecimal.
**Test:** Grep audit on production code.
**Dimension links:** what.md (NUMERIC(18,4) columns); accounting-principles.md HW-ACC-20.

### HW-GL-08 — FX rate captured at posting time
**Status:** ✅ IMPL
**Source:** journal_line.fx_rate + fx_rate_date + fx_rate_source columns filled by postJournal.
**Dimension links:** what.md INV-GL-09; how.md ALG-GL-POST-01.

### HW-GL-09 — Retention enforcement: no hard DELETE on retained tables
**Status:** ⚠️ HISTORICAL: 🚧 BROKEN in pilot (BackfillGeneralLedgerCommand executed raw DELETE in dev). MUST be ✅ IMPL.
**Source:** REVOKE DELETE on journal_line, audit_log, account_balance_snapshot from application_user; archive pattern for cold data.
**Test:** DELETE FROM journal_line fails with permission denied.
**Dimension links:** why.md R-GL-01; regulatory-compliance.md HW-FRC-09; financial-anti-patterns.md #14.

### HW-GL-10 — Segregation of Duties enforced at service layer
**Status:** ✅ IMPL
**Source:** AccountingService.postJournal (above threshold) checks approver_id != initiator_id; reverseJournal checks actor_id != original.posted_by; PeriodCloseService.reopenPeriod checks actor != closer.
**Test:** Same-actor approval call returns SoDViolation error.
**Dimension links:** who.md SOD-GL-01/02/03; financial-anti-patterns.md (relevant).

### HW-GL-11 — Leaf-account posting only
**Status:** ✅ IMPL
**Source:** AccountingService.postJournal pre-check + DB CHECK constraint on journal_line.account_id FK.
**Dimension links:** what.md INV-GL-13/16.

### HW-GL-12 — Multi-currency: base sums balance
**Status:** ✅ IMPL
**Source:** Trigger on journal_line aggregates base_amount; same INV-GL-01 logic.
**Dimension links:** what.md INV-GL-09; how.md ALG-GL-POST-01.

### HW-GL-13 — Account type immutable after first transaction
**Status:** ✅ IMPL
**Source:** TRIGGER `tg_account_type_immutable` on account UPDATE.
**Test:** UPDATE account SET account_type = 'X' WHERE id IN (accounts with journal_line) fails.
**Dimension links:** what.md INV-GL-17.

### HW-GL-14 — Period state transitions forward-only
**Status:** ✅ IMPL (same as HW-GL-03)
**Dimension links:** accounting-principles.md HW-ACC-14.

### HW-GL-15 — Reversing entry uniqueness
**Status:** ✅ IMPL
**Source:** DB UNIQUE(reverses_journal_id) on journal.
**Dimension links:** what.md INV-GL-08/15.

### HW-GL-16 — Atomic posting (see HW-GL-04)
(Duplicate of HW-GL-04; kept for cross-reference numbering compatibility with financial-invariants-catalog.md.)

### HW-GL-17 — Account hierarchy integrity
**Status:** ✅ IMPL
**Source:** FK account.parent_id → account.id; no cycles enforced via WITH RECURSIVE check or app-layer.

### HW-GL-18 — Subledger ↔ GL reconciliation daily
**Status:** ✅ IMPL
**Source:** ReconciliationService.reconcileSubledger called by EOD job for each (subledger, control_account) pair; breaks → reconciliation_break table + alert.
**Dimension links:** what.md INV-GL-18; when.md schedule; financial-invariants-catalog.md INV-FIN-24.

### HW-GL-19 — Audit log append-only + complete
**Status:** ✅ IMPL
**Source:** REVOKE UPDATE, DELETE on audit_log; every service mutation appends an audit_log row inside the same TX; entity changes captured with before/after JSON.
**Dimension links:** what.md § 1.5; financial-invariants-catalog.md HW-FIN-03.

### HW-GL-20 — Correlation ID end-to-end
**Status:** ✅ IMPL (verify via tracing)
**Source:** Middleware extracts/generates correlation_id; service layer propagates; every audit + outbox + log carries it.
**Dimension links:** financial-invariants-catalog.md HW-FIN-04.

## §2. Inherited hardwiring (from upstream modules)

### From `auth`
- Identity model: every actor is a real user (or a designated system actor with is_system flag)
- Session: JWT (or your project's session mechanism)
- Inheritance impact: HW-GL-06 depends on auth providing valid actor.id

### From `market-data`
- FX rate freshness: rates updated daily by 09:30 local
- Inheritance impact: ALG-GL-POST-01 relies; HW-GL-08 captures the snapshot

## §3. Downstream-inherited (modules depending on GL)

### `wallet` inherits
- HW-GL-18 (subledger reconciliation)
- HW-GL-04 (atomic posting via postJournal)

### `settlement` inherits
- HW-GL-04 (atomic posting)
- HW-GL-19 (audit log)

### `fee-management` inherits
- HW-GL-04 (atomic posting for daily accrual)
- HW-GL-06 (system.fee-accrual actor identity)
- HW-GL-09 (retention)

### `nav` inherits
- INV-GL-10 (trial balance reconciliation as input requirement)
- INV-GL-18 (subledger sync)

### `regulatory-reporting` inherits
- HW-GL-19 (audit completeness)
- INV-GL-05 (period close as snapshot anchor)

## §4. Non-rules — what is NOT hardwired (NHW-GL-*)

### NHW-GL-01: GL is NOT real-time consistent across replicas
Reads may lag writes by up to N seconds (replica lag). Use master for read-after-write; replica for reporting / dashboards.

### NHW-GL-02: GL does NOT enforce business-level approval rules
e.g., "withdrawals > 1M MNT need manager approval" is wallet-level / settlement-level business logic; GL just records the resulting journal. GL enforces SoD on the POSTING action, not the underlying business approval.

### NHW-GL-03: Currency conversion is NOT free-form
FX rates come from designated providers per ALG-GL-POST-01. Code does NOT allow operator-entered FX rates (except as ADJUSTING with controller role + reason).

## §5. Cross-cutting patterns

### Outbox pattern (HW-GL-05)
Adopted across all finance modules in this overlay for at-least-once event delivery without 2PC.

### Append-only audit (HW-GL-19)
Shared with all overlay modules: wallet-settlement, kyc-aml.

### Service-layer SoD (HW-GL-10)
Pattern reusable in wallet, settlement, KYC modules.

## §6. Status summary

**Section overview (YYYY-MM-DD):** ✅ N IMPL · 🟡 M PARTIAL · 🚧 K BROKEN · 🚧 J NOT-ENFORCED out of 20 HW constraints — fill after R3.

Note: HW-GL-06 + HW-GL-09 are flagged HISTORICAL in this template because the pilot revealed them BROKEN. Your project may have a clean slate.
