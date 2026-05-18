---
module: general-ledger
dimension: where
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — WHERE (Storage + Tech Stack)

## 1. Storage roles

| ID | Role | Storage | Notes |
|----|------|---------|-------|
| S-GL-01 | Journal header | RDBMS table `journal` | Append-only after POST; archive after 1y inactive |
| S-GL-02 | Journal lines | RDBMS table `journal_line` | Heavy; partitioned by posting_date typically |
| S-GL-03 | Chart of Accounts | RDBMS table `account` | Small (hundreds of rows); read-heavy; cache OK |
| S-GL-04 | Fiscal periods | RDBMS table `fiscal_period` | Small; pre-populated by setup script |
| S-GL-05 | Audit log | RDBMS table `audit_log` OR dedicated audit DB | Append-only; 7-year retention |
| S-GL-06 | Period snapshots | Object storage (S3/GCS) + RDBMS index | Trial balance, BS, P&L; PDF + JSON |
| S-GL-07 | Reconciliation breaks | RDBMS table `reconciliation_break` | Queue table; visible on compliance dashboard |
| S-GL-08 | Outbox events | RDBMS table `outbox_event` | Atomic with journal posting; separate worker drains |
| S-GL-09 | Cached balances (if used) | RDBMS table `account_balance_cache` | Daily reconciled vs SUM(journal_line) |
| S-GL-10 | FX rates | RDBMS table `fx_rate` | History; partitioned by date |

## 2. Read/write semantics

| Operation | Storage | Consistency |
|-----------|---------|-------------|
| postJournal | journal + journal_line + audit_log + outbox | Single DB transaction (atomicity per HW-GL-16) |
| reverseJournal | new journal + journal_line + UPDATE original.status + audit_log + outbox | Single DB transaction |
| getAccountBalance | journal_line read (or cache + reconciliation) | Read-after-write within transaction; eventually consistent across replicas |
| Period close | period UPDATE + audit_log + snapshot artifact + outbox | DB transaction for period+audit; snapshot uploaded outside TX (idempotent) |
| Reconciliation | journal_line scan + subledger sum + INSERT to break table if diff | Read snapshot; break-INSERT is atomic |

## 3. Failure modes for writes (F-GL-W-*)

| ID | Failure | Behaviour |
|----|---------|-----------|
| F-GL-W-01 | DB transaction abort mid-postJournal | All inserts roll back; client retries with same correlation_id |
| F-GL-W-02 | Outbox publish fails after DB commit | Worker picks up unsent outbox rows; idempotent re-publish |
| F-GL-W-03 | Snapshot upload fails after period soft-close | Period stays SOFT_CLOSED; retry; completeClose blocked until snapshot succeeds |
| F-GL-W-04 | Audit log write fails | Service throws; whole operation rolls back (audit is mandatory) |

## 4. Indexes (recommended)

| Index | Purpose |
|-------|---------|
| `journal_line(account_id, posting_date)` | getAccountBalance |
| `journal_line(journal_id)` | journal hydration |
| `journal(posting_date, status)` | period reports |
| `journal(reverses_journal_id)` UNIQUE | INV-GL-08 |
| `journal(correlation_id)` | idempotency check |
| `audit_log(entity_type, entity_id, acted_at)` | audit retrieval |
| `audit_log(correlation_id)` | trace assembly |
| `fiscal_period(start_date, end_date)` | date-to-period lookup |
| `outbox_event(published_at)` WHERE published_at IS NULL | outbox worker scan |

## 5. Tech Stack Binding

> The ONLY stack-specific section. Replace placeholders with your stack's specifics.

### 5.1 Backend runtime
- [your language + framework + version]
- [validation library — e.g., Bean Validation, Pydantic, Zod, Joi]

### 5.2 Persistence layer
- [DB engine + version — RDBMS recommended; PostgreSQL 15+, MySQL 8+, Oracle 19c+]
- Tables: `journal` (~15 fields), `journal_line` (~12 fields), `account` (~12 fields), `fiscal_period` (~8 fields), `audit_log` (~12 fields), `reconciliation_break` (~10 fields), `outbox_event` (~6 fields), `account_balance_cache` (~5 fields), `fx_rate` (~6 fields)
- Money type: NUMERIC(18,4) — adjust precision/scale per your needs
- TRIGGERS used: journal_line INSERT (sum debit/credit check); account UPDATE (account_type immutability after first txn)

### 5.3 Async transports
- [your message bus — Kafka, RabbitMQ, SQS, Redis Streams, BullMQ, Symfony Messenger]
- Routing:
  - `JournalPostedEvent` → `gl.journal-posted` topic/queue
  - `PeriodClosedEvent` → `gl.period-closed` topic/queue
  - `ReconciliationBreakEvent` → `gl.recon-break` topic/queue (often → alerting system)

### 5.4 Service classes
- `<namespace>/Accounting/AccountingService` — postJournal, reverseJournal, getAccountBalance, getTrialBalance
- `<namespace>/Accounting/PeriodCloseService` — initiateClose, completeClose, reopenPeriod
- `<namespace>/Accounting/ReconciliationService` — reconcileSubledger, assertTrialBalance, balanceReconciliation
- `<namespace>/Accounting/AccountService` — createAccount, deactivateAccount, getHierarchy
- `<namespace>/Accounting/AuditLogService` — append, query

### 5.5 Message + handler classes
- `<namespace>/Accounting/Message/PostJournalAsyncMessage` + `PostJournalAsyncHandler` (for async / outbox)
- `<namespace>/Accounting/Message/ReconcileSubledgerMessage` + handler
- `<namespace>/Accounting/Message/SnapshotPeriodMessage` + handler

### 5.6 Enums / typed constants
- `<namespace>/Accounting/JournalType` — REGULAR / OPENING / CLOSING / REVERSING / ADJUSTING
- `<namespace>/Accounting/JournalStatus` — DRAFT / POSTED / REVERSED
- `<namespace>/Accounting/AccountType` — ASSET / LIABILITY / EQUITY / REVENUE / EXPENSE
- `<namespace>/Accounting/AccountClass` — OPERATING / CLIENT_TRUST / FEE / TAX
- `<namespace>/Accounting/JournalSide` — DEBIT / CREDIT
- `<namespace>/Accounting/PeriodStatus` — DRAFT / OPEN / SOFT_CLOSED / CLOSED / ARCHIVED
- `<namespace>/Accounting/AuditAction` — CREATE / UPDATE / POST / REVERSE / CLOSE / REOPEN / etc.

### 5.7 External provider integration
**FX rate provider:**
- Env vars: `FX_PROVIDER_URL`, `FX_PROVIDER_API_KEY`, `FX_PROVIDER_SECONDARY_URL`
- SDK: [provider's library]
- Failure modes: timeout, rate-limit, unavailable currency pair → fallback to secondary; alert if both fail

**Object storage (snapshots):**
- Env vars: `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_KEY`, `OBJECT_STORAGE_SECRET`
- SDK: [provider's library — AWS S3, GCS, Azure Blob]

### 5.8 Auth + RBAC
- [Auth library + version]
- Role hierarchy: customer < operator < approver < controller; compliance/auditor are orthogonal (read-only specialized)
- Service-account credentials for system actors (separate from user passwords)

### 5.9 CLI commands
- `<namespace>/Accounting/Command/RunEodCommand` — daily EOD batch
- `<namespace>/Accounting/Command/InitiatePeriodCloseCommand`
- `<namespace>/Accounting/Command/ReconcileSubledgerCommand`
- `<namespace>/Accounting/Command/AssertTrialBalanceCommand`
- `<namespace>/Accounting/Command/RefreshFxRatesCommand`
- `<namespace>/Accounting/Command/SeedSystemUsersCommand` (one-time setup: creates system.eod, system.recon, system.fx)

### 5.10 Configuration sources
- [config file path — config/accounting.yaml / settings.py / application.yml]
- `.env` (or your stack's env mechanism):
  - `BASE_CURRENCY` (ISO 4217)
  - `MATERIALITY_THRESHOLD_BASE` (NUMERIC)
  - `SOD_THRESHOLD_BASE` (NUMERIC; journals above this need approval)
  - `RETENTION_HOT_DAYS` (default 365)
  - `RETENTION_TOTAL_YEARS` (default 7 per Mongolia AML)
  - `FX_PROVIDER_URL`, `FX_PROVIDER_API_KEY`
  - `OUTBOX_DRAIN_INTERVAL_MS`
  - `EOD_BATCH_WINDOW` (cron)

## 6. Cross-references

### Source documents
- Production code per `CLAUDE.md` § Source documents
- `[migrations directory]` — journal/account/period migrations

### Related dimensions
- `what.md` — entity schemas (field-level)
- `how.md` — algorithms operating on this storage
- `who.md` — actor permissions on tables (DB roles)
