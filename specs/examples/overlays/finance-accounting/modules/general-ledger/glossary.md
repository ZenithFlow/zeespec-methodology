---
module: general-ledger
dimension: glossary
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — GLOSSARY

> Module-specific terms. For overlay-wide finance terms see `../../glossary/finance-glossary.md`.

## Accounting terms

**Account** — A bucket in the Chart of Accounts holding a balance (e.g., "Cash at Bank", "Customer Liability"). Has a type (asset/liability/equity/revenue/expense) that determines normal balance direction.

**Account class** — Module-specific extension distinguishing OPERATING (firm's own) vs CLIENT_TRUST (held for customers) vs FEE vs TAX accounts. Drives RBAC + segregation.

**Account hierarchy** — Tree structure of accounts via `parent_id`. Posting is allowed only to LEAF accounts; intermediates aggregate.

**Adjusting entry** — A journal posted by controller role to correct or accrue at period-end (e.g., depreciation, accrued interest).

**Audit log** — Append-only record of every mutation to journal, account, or period. Captures actor, timestamp, before/after state, reason, correlation_id.

**Base currency** — The organization's reporting currency. All journals balance in base currency (per INV-GL-09).

**Closing entry** — A journal posted at period-end to transfer P&L balances (revenue, expense) to Retained Earnings.

**Correlation ID** — UUID propagated through every layer of a request so all related logs/audits/events can be retrieved by one query.

**Credit** — One side of a journal entry. Increases liability/equity/revenue; decreases asset/expense.

**Debit** — One side of a journal entry. Increases asset/expense; decreases liability/equity/revenue.

**Double-entry** — The accounting model where every transaction has at least two equal+opposite entries. Per INV-GL-01.

**Fiscal period** — A defined time range (month, quarter, year) over which accounts are summarized for reporting.

**Journal** — A record of a financial transaction. Header (`journal`) + lines (`journal_line`). Posted atomically. Immutable per INV-GL-02.

**Journal line** — One DEBIT or CREDIT entry within a journal. Each journal has 2+ lines.

**Journal number** — Human-readable identifier (e.g., JR-2026-000123). UNIQUE.

**Journal type** — REGULAR / OPENING / CLOSING / REVERSING / ADJUSTING. Determines who can post (see who.md).

**Leaf account** — An account with no children. Only leaf accounts can be referenced by journal lines (INV-GL-16).

**Materiality** — Configurable threshold above which a discrepancy demands attention. Below: aggregated / ignored. Above: 🚨 P0.

**Opening entry** — A journal posted at period-start to carry forward balances (or to record initial capital).

**Period close** — Workflow that transitions a period from OPEN → SOFT_CLOSED → CLOSED. Blocks new postings; takes snapshots.

**Posting** — The act of committing a journal to the GL (status transitions DRAFT → POSTED, or directly inserts as POSTED).

**Reopen** — Controller action to transition CLOSED → OPEN. Audit-logged with reason; often triggers regulator disclosure.

**Reversing entry** — A journal that exactly negates a prior journal. References the original via `reverses_journal_id`. The original keeps its lines but its status moves to REVERSED.

**Soft close** — Intermediate period state (SOFT_CLOSED) where users cannot post but controllers can post ADJUSTING entries.

**Subledger** — A specialized ledger maintained separately (e.g., wallet, accounts receivable) that summarizes into a small number of GL control accounts.

**System actor** — A non-user account used by automated jobs as the audit "createdBy" value. Examples: `system.eod`, `system.fx`, `system.recon`. Required to satisfy INV-GL-07 without sentinels.

**Trial balance** — A list of all account balances showing debits and credits, asserted to be equal (per INV-GL-10).

## Money + FX terms

**Base amount** — A journal line's amount expressed in the organization's base currency. Used for INV-GL-01 balance check.

**Day-count convention** — How fractional days are counted (Actual/Actual, Actual/360, Actual/365, 30/360). Must match downstream (custodian, regulator) to avoid drift.

**FX gain/loss** — P&L account where currency-translation differences flow. Realized at settlement; unrealized at revaluation.

**FX rate source** — The provider used (e.g., XE, Reuters, central bank rate). Logged on every journal line for traceability.

**FX revaluation** — Period-end re-pricing of foreign-currency monetary items at the spot rate (per IAS 21). Difference posted to FX gain/loss.

**Money type** — Application-level representation that pairs a Decimal amount with an ISO 4217 currency code. Prevents float arithmetic on money.

**Transaction amount** — A journal line's amount in its native currency (transaction_currency). Stored alongside base_amount.

## Compliance + retention terms

**7-year retention** — Mongolia AML law requirement that customer ID + transaction + audit records be retained for at least 7 years from event date. Drives HW-GL-09 (no hard DELETE on retained tables).

**Hard DELETE** — A SQL `DELETE FROM ...` that physically removes rows. Prohibited on retained tables per HW-GL-09.

**Soft DELETE** — A `deleted_at` timestamp column marking rows as logically deleted but physically retained.

**Archive** — Moving rows beyond hot retention window to a separate (often cold-storage) table; still retrievable for the full retention period.

## Workflow terms

**4-eyes principle** — Two independent users must be involved (initiator + approver). Enforced by SOD-GL-01.

**6-eyes principle** — Three independent users (initiator + approver + poster). Used for very high-value or sensitive actions.

**Cutoff time** — Daily deadline after which new postings move to the next business day.

**EOD (End-of-Day)** — Daily batch window for reconciliation, snapshots, retention archival. Runs ~22:00 local in pilot.

**Idempotency key** — Client-supplied identifier (often correlation_id) that allows retrying a failed request without duplicating the result.

**Outbox pattern** — Atomic write of an event row alongside the main DB write, followed by an async worker that reads + publishes. Avoids 2PC; guarantees at-least-once delivery.

**SoD (Segregation of Duties)** — Control requiring different users for different sensitive actions in a workflow. See `who.md` § 3.

## Cross-references

- Module-wide overlay glossary: `../../glossary/finance-glossary.md` (broader terms: AML, KYC, NAV, etc.)
- Core ZeeSpec template glossary: included by reference in your project glossary
