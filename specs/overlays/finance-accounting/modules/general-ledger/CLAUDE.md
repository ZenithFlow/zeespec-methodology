---
module: general-ledger
type: entry-point
overlay: finance-accounting
version: 0.1.0
status: draft (initial author YYYY-MM-DD)
last_updated: YYYY-MM-DD
owner: TBD
purpose: pre-filled ZeeSpec template for General Ledger / Chart of Accounts module
---

# General Ledger — AI Spec Entry Point

This module is specified using **ZeeSpec** core (10-file Zachman-derived framework, language-agnostic v2.3) **plus the finance-accounting overlay** (v0.1.0).

The General Ledger module is the **system of record** for all financial transactions. It implements double-entry accounting with the Chart of Accounts as backbone.

> ⚠️ **Authoring scope statement:**
>
> This ZeeSpec captures the General Ledger module's **specification**. Production code is the highest authority. Where doc and code disagree, **code is canonical**; spec author should flag the drift as a Gap-GL-XX entry rather than silently choosing.
>
> **Canonical sources (in priority order):**
> 1. Production code (`<your-source-root>/general-ledger/*` — e.g., `backend/src/Accounting/...`, `src/accounting/...`, `internal/ledger/...`) — highest authority
> 2. Existing 4-file canonical (`docs/specs/general-ledger/{CLAUDE,decisions,implementation}.md`) if exists
> 3. Feature documentation (`docs/features/accounting/*.md`) if exists
> 4. This ZeeSpec

## ⚠️ ACTIVE ISSUES

[Fill after B1 + R3 + R1+R2 review]

### Drift items (B1 verification YYYY-MM-DD)

| ID | Title | Severity | Status |
|----|-------|:--------:|--------|
| D1 | [description] | [P0/P1/P2/P3] | 🔴 OPEN |

### R3 production-code verification YYYY-MM-DD

[fill after R3 deep review]

## Read order

1. `why.md`     — strategic goals (audit-grade ledger, IFRS-compliant, FRC-reportable)
2. `what.md`    — entities (Journal, JournalLine, Account, FiscalPeriod) + INV-GL-* invariants
3. `how.md`     — algorithms (post journal, reverse journal, period close, trial balance)
4. `who.md`     — actors (operator, approver, controller) + SoD constraints
5. `when.md`    — timing (posting cutoffs, period schedule, daily EOD)
6. `where.md`   — storage (which tables, indexes) + § 5 Tech Stack Binding
7. `gravity.md` — hardwiring (HW-GL-*) — CRITICAL invariants like debit=credit
8. `gaps.md`    — OPEN QUESTIONS — DO NOT GUESS, ASK USER
9. `glossary.md` — terms (debit, credit, journal, ledger, period close, FX revaluation, ...)

## Key architectural decisions

### Foundational ADRs

| ADR | Decision | Status | Source |
|-----|----------|:------:|--------|
| **ADR-GL-001** | Double-entry as foundation; debit=credit per journal | ACCEPTED | see `gravity.md` HW-GL-01 |
| **ADR-GL-002** | Journal immutability (no UPDATE, no DELETE; reversing entries only) | ACCEPTED | see `what.md` INV-GL-02 |
| **ADR-GL-003** | Hierarchical Chart of Accounts; posting allowed to leaf accounts only | ACCEPTED | see `what.md` INV-GL-16 |
| **ADR-GL-004** | Period state machine: DRAFT → OPEN → SOFT_CLOSED → CLOSED → ARCHIVED | ACCEPTED | see `how.md` ALG-GL-PERIOD-CLOSE |
| **ADR-GL-005** | Multi-currency: per-line transaction amount + base-currency amount; base sums balance | ACCEPTED | see `what.md` INV-GL-09 |
| **ADR-GL-006** | Audit log captures every mutation: actor, timestamp, reason, before/after | ACCEPTED | see `gravity.md` HW-GL-19 |
| **ADR-GL-007** | Subledger-to-GL daily reconciliation (subledger sum = GL control account) | ACCEPTED | see `what.md` INV-GL-18 |
| **ADR-GL-008** | Operator identity from authenticated session; system jobs use dedicated system user | ACCEPTED | see `what.md` INV-GL-07 |

### Cross-module dependencies (we depend on these)

| Module | Constraint inherited | Reason |
|--------|---------------------|--------|
| `auth` | User identity model | createdBy fields |
| `customer` | Customer entity model | Many journals reference customers (e.g., wallet journals) |
| `market-data` | Closing prices, FX rates | FX revaluation, NAV |

### Cross-module dependencies (we are depended on by these)

| Module | What they inherit | Status |
|--------|-------------------|--------|
| `wallet` | HW-GL-18 (subledger reconciliation) | TBD until ratified in sibling spec |
| `settlement` | HW-GL-04 (atomic posting) | TBD |
| `fee-management` | HW-GL-06 (operator capture) | TBD |
| `tax-reporting` | INV-GL-13 (multi-currency split) | TBD |
| `regulatory-reporting` | INV-GL-10 (trial balance closure) | TBD |

## When you write code (language-agnostic)

- **Cite rule IDs in comments** (e.g., `// INV-GL-01`, `// HW-GL-04`, `// ADR-GL-002`)
- If a 🔴 OPEN gap blocks you → STOP, ask user
- All `gravity.md` constraints (HW-GL-*) MUST be enforced when status is ✅ IMPL
- **Status tag behavior:**
  - ✅ IMPL — verified in production; cite + rely
  - 🟡 PARTIAL — app-layer only; add defense-in-depth
  - 🚧 DESIGN / NOT-ENFORCED — DO NOT rely; treat as gap

## Critical invariants (preview — see what.md for full list)

- **INV-GL-01** — Debit = Credit per journal entry (double-entry foundation)
- **INV-GL-02** — Journal immutability (no UPDATE / DELETE; reversing entries only)
- **INV-GL-05** — Period close immutability (cannot post to CLOSED period without REOPEN)
- **INV-GL-07** — Operator identity captured on every journal (no `createdBy: 0`)
- **INV-GL-10** — Trial balance reconciles after every batch
- **INV-GL-18** — Subledger sums = GL control account

## Tech stack

> ✅ **Language-agnostic:** This spec describes General Ledger **regardless of programming language**. Concrete stack bindings live ONLY in `where.md` § 5 "Tech Stack Binding".

**Production binding (your platform, YYYY-MM-DD):**
- Backend runtime: [your language + framework + version]
- Persistence: [your DB + version + ORM] — must support TRANSACTIONS, NUMERIC(p,s), and TRIGGER / CHECK constraints
- Money type: [your decimal type — BigDecimal / Decimal / Money lib]
- Async transports: [message bus] for outbox pattern in async posting
- See `where.md` § 5 for full details.

## Source documents

### Production code (highest authority)
- `[path]/Entity/Journal.{ext}` — journal header entity
- `[path]/Entity/JournalLine.{ext}` — journal lines (per debit/credit)
- `[path]/Entity/Account.{ext}` — Chart of Accounts node
- `[path]/Entity/FiscalPeriod.{ext}` — period dimension
- `[path]/Service/AccountingService.{ext}` — primary service (postJournal, reverseJournal)
- `[path]/Service/PeriodCloseService.{ext}` — period workflow
- `[path]/Service/ReconciliationService.{ext}` — subledger ↔ GL reconciliation
- `[path]/Command/RunPeriodCloseCommand.{ext}` — CLI

### Existing canonical specs (if your project has them)
- `docs/specs/accounting/*` — older 4-file format (if any)
- `docs/features/accounting/*` — product/business documentation

### Cross-module ZeeSpec references
- `docs/specs/zeespec/wallet/` — subledger consumer
- `docs/specs/zeespec/settlement/`
- `docs/specs/zeespec/fee-management/`

### Business rules
- `docs/business/business_rules.md` — BR-ACC-XX (or your project's BR catalog)

### Compliance references
- `docs/specs/zeespec-finance/principles/accounting-principles.md` — double-entry + IFRS framework
- `docs/specs/zeespec-finance/principles/frc-compliance.md` — FRC + retention requirements
