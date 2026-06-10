---
module: general-ledger
dimension: what
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — WHAT (Entities + Invariants)

## 1. Entities

### 1.1 Journal (header)

| Field | Type | NOT NULL | Notes |
|-------|------|:--------:|-------|
| id | BIGINT | ✓ | PK |
| journal_number | VARCHAR(20) | ✓ | Human-readable (e.g., `JR-2026-000123`); UNIQUE |
| journal_type | ENUM(REGULAR, OPENING, CLOSING, REVERSING, ADJUSTING) | ✓ | |
| posting_date | DATE | ✓ | Date within fiscal period |
| period_id | FK fiscal_period | ✓ | Must be OPEN at posting time |
| description | TEXT | ✓ | |
| reverses_journal_id | FK journal | | NULL if not a reversal; UNIQUE (one reversal per journal) |
| created_by | FK users | ✓ | CHECK > 0 — NO sentinels (see INV-GL-07) |
| created_at | TIMESTAMPTZ | ✓ | UTC |
| posted_by | FK users | ✓ | May = created_by if SoD threshold not exceeded |
| posted_at | TIMESTAMPTZ | ✓ | UTC |
| correlation_id | UUID | ✓ | Request/batch trace |
| status | ENUM(DRAFT, POSTED, REVERSED) | ✓ | |
| reason | TEXT | | Required for ADJUSTING and REVERSING |

**Source:** [path]/Entity/Journal.{ext}

### 1.2 JournalLine

| Field | Type | NOT NULL | Notes |
|-------|------|:--------:|-------|
| id | BIGINT | ✓ | PK |
| journal_id | FK journal | ✓ | INDEX |
| line_seq | INT | ✓ | 1..N within journal |
| account_id | FK account | ✓ | MUST be leaf account (see INV-GL-16) |
| side | ENUM(DEBIT, CREDIT) | ✓ | |
| transaction_amount | NUMERIC(18,4) | ✓ | In transaction_currency |
| transaction_currency | CHAR(3) | ✓ | ISO 4217 |
| base_amount | NUMERIC(18,4) | ✓ | In organization's base currency |
| base_currency | CHAR(3) | ✓ | ISO 4217; same value for all lines of a journal |
| fx_rate | NUMERIC(18,8) | ✓ | 1.0 if same currency |
| fx_rate_date | DATE | ✓ | Date the FX rate was taken |
| fx_rate_source | VARCHAR(50) | ✓ | Provider name |
| memo | TEXT | | Optional per-line note |

Constraints:
- UNIQUE(journal_id, line_seq)
- CHECK(transaction_amount > 0)
- CHECK(base_amount > 0)
- CHECK(side IN ('DEBIT', 'CREDIT'))

### 1.3 Account (Chart of Accounts node)

| Field | Type | NOT NULL | Notes |
|-------|------|:--------:|-------|
| id | BIGINT | ✓ | PK |
| account_code | VARCHAR(20) | ✓ | UNIQUE; hierarchical (e.g., `1110-01-001`) |
| account_name | VARCHAR(200) | ✓ | |
| account_type | ENUM(ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE) | ✓ | IMMUTABLE after first transaction (see INV-GL-17) |
| account_class | ENUM(OPERATING, CLIENT_TRUST, FEE, TAX) | ✓ | Distinguishes own vs client funds |
| parent_id | FK account | | NULL for root; otherwise FK |
| is_leaf | BOOLEAN | ✓ | True if no children; only leaf can be posted to (INV-GL-16) |
| allow_overdraft | BOOLEAN | ✓ | Default FALSE; per INV-GL-04 |
| currency_code | CHAR(3) | | NULL = multi-currency; else single-currency account |
| is_active | BOOLEAN | ✓ | False = deactivated (no new postings); existing balances still computed |
| created_by | FK users | ✓ | |
| created_at | TIMESTAMPTZ | ✓ | |

### 1.4 FiscalPeriod

| Field | Type | NOT NULL | Notes |
|-------|------|:--------:|-------|
| id | BIGINT | ✓ | PK |
| period_code | VARCHAR(10) | ✓ | e.g., `2026-M05`, `2026-Q2`, `2026-FY` |
| period_type | ENUM(MONTH, QUARTER, YEAR) | ✓ | |
| start_date | DATE | ✓ | |
| end_date | DATE | ✓ | |
| status | ENUM(DRAFT, OPEN, SOFT_CLOSED, CLOSED, ARCHIVED) | ✓ | State machine per ADR-GL-004 |
| closed_by | FK users | | NULL until SOFT_CLOSED |
| closed_at | TIMESTAMPTZ | | |
| reopened_count | INT | ✓ | DEFAULT 0; incremented each REOPEN |

Constraints:
- UNIQUE(period_code)
- CHECK(start_date <= end_date)
- No overlapping periods of same period_type

### 1.5 AuditLog (per HW-GL-19)

| Field | Type | NOT NULL | Notes |
|-------|------|:--------:|-------|
| id | BIGINT | ✓ | PK |
| entity_type | VARCHAR(50) | ✓ | journal, account, period, etc. |
| entity_id | BIGINT | ✓ | |
| action | ENUM(CREATE, UPDATE, DELETE, POST, REVERSE, CLOSE, REOPEN, etc.) | ✓ | |
| actor_id | FK users | ✓ | CHECK > 0 |
| actor_role | VARCHAR(50) | ✓ | role at time of action |
| acted_at | TIMESTAMPTZ | ✓ | |
| reason | TEXT | | Required for high-impact actions (REVERSE, REOPEN) |
| before_state | JSONB | | NULL for CREATE |
| after_state | JSONB | ✓ | |
| correlation_id | UUID | ✓ | |
| ip_address | INET | | Optional for forensic |
| user_agent | TEXT | | Optional |

Constraint: REVOKE UPDATE, DELETE on this table from application_user.

## 2. Invariants (INV-GL-*)

> Most of these are copied from `../../principles/financial-invariants-catalog.md` and `accounting-principles.md`. See those for full context.

### Double-entry foundations

**INV-GL-01** — Debit = Credit per journal entry
- Status: ✅ IMPL (DB constraint via TRIGGER on journal_line)
- Source: trigger on journal_line + service-layer assertion in AccountingService.postJournal()
- Test: random-journal property test

**INV-GL-02** — Journal immutability (no UPDATE, no DELETE)
- Status: ✅ IMPL (DB role permissions + service interface has no update/delete methods)
- Source: GRANT statements in migration; AccountingService API

**INV-GL-03** — Account balances derived from journal lines
- Status: [project-dependent] — if cached, daily reconciliation required (see INV-GL-18)

**INV-GL-04** — No negative balance on asset accounts (unless `allow_overdraft = TRUE`)
- Status: 🟡 PARTIAL typical — app-layer check in service
- Source: AccountingService.postJournal() pre-check

**INV-GL-05** — Period close immutability
- Status: ✅ IMPL (period.status check in postJournal)
- Source: AccountingService.postJournal() rejects if period.status NOT IN (OPEN, SOFT_CLOSED + controller role)

**INV-GL-06** — Posting date in current or open prior period
- Status: ✅ IMPL
- Source: Same check as INV-GL-05

**INV-GL-07** — Operator identity captured (no sentinels)
- Status: ⚠️ HISTORICAL: 🚧 NOT-ENFORCED in pilot (createdBy:0 anti-pattern); MUST be ✅ IMPL after spawn-chip remediation
- Source: Audit table CHECK(created_by > 0); service injects authenticated user

**INV-GL-08** — Reversing entry references original; UNIQUE constraint
- Status: ✅ IMPL
- Source: DB UNIQUE(reverses_journal_id); service rejects double-reverse

**INV-GL-09** — Multi-currency journals: base-currency sums balance
- Status: ✅ IMPL
- Source: Trigger on journal_line aggregates base_amount; INV-GL-01 applies to base_amount

**INV-GL-10** — Trial balance reconciles after every batch
- Status: ✅ IMPL (assertion job)
- Source: ReconciliationService.assertTrialBalance() runs post-batch

### Account governance

**INV-GL-13** — Journal lines reference leaf accounts only
- Status: ✅ IMPL
- Source: DB CHECK(is_leaf = TRUE) on journal_line.account_id FK; service pre-check

**INV-GL-14** — Posting date within open period
- Status: ✅ IMPL (covered by INV-GL-05)

**INV-GL-15** — Reversing reference + uniqueness
- Status: ✅ IMPL (covered by INV-GL-08)

**INV-GL-16** — Leaf accounts only post; intermediates roll up
- Status: ✅ IMPL
- Source: account.is_leaf flag + service guard

**INV-GL-17** — Account type immutable after first transaction
- Status: ✅ IMPL
- Source: TRIGGER on account UPDATE checks for existing journal lines

### Reconciliation

**INV-GL-18** — Subledger sums = GL control account
- Status: ✅ IMPL (daily reconciliation; > materiality = 🚨 P0)
- Source: ReconciliationService.reconcileSubledger() called by EOD job

### Audit + identity

**INV-GL-19** — Audit log append-only (covered by HW-GL-19)

### Section overview

**Summary (YYYY-MM-DD):** ✅ N IMPL · 🟡 M PARTIAL · 🚧 K NOT-ENFORCED · 🚧 J DESIGN out of T invariants — fill after R3.

## 3. Relationships

```
Journal ──< JournalLine >── Account
   │                            │
   │                            ▼
   ▼                       (hierarchy via parent_id;
FiscalPeriod                only leaf can be referenced)
   ▲
   │
   └── (validates posting_date)
```

## 4. State machines

### Journal
```
DRAFT (rare; usually posted directly) → POSTED → REVERSED
                                            └────→ (still POSTED; reversing entry posted as separate journal)
```

### FiscalPeriod (per ADR-GL-004)
```
DRAFT → OPEN → SOFT_CLOSED → CLOSED → ARCHIVED
                  ↑              ↓
                  └─── REOPENED ──┘
                  (controller role; audit-logged)
```

## 5. Cross-references

- `how.md` — algorithms (posting, reversing, closing)
- `gravity.md` — HW-GL-* cross-cutting constraints
- `gaps.md` — OPEN questions
- `../../principles/accounting-principles.md` — double-entry framework
- `../../principles/financial-invariants-catalog.md` — source for many INV-GL-* entries
