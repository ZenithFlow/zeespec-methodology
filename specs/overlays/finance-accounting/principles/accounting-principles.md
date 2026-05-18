---
doc: overlays/finance-accounting/principles/accounting-principles
type: principles-spec
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Accounting Principles — Double-Entry + IFRS-Aware

> **Reference example** of how to codify domain principles in a ZeeSpec overlay. Specific to financial-services accounting; the structure (status-tagged invariants + citation blocks) is reusable for other domains.
>
> Foundational invariants every finance module SHOULD honor. Copy the relevant `INV-ACC-*` and `HW-ACC-*` entries into your module's `what.md` § 2 and `gravity.md` § 1.
>
> For NON-finance domains: adapt the structure (invariants + citations + cross-refs) but research your domain's own foundational principles (e.g., healthcare: HIPAA PHI minimums; government: NIST baseline; privacy: GDPR Art. 5 principles).

## 1. Double-entry foundations

Double-entry bookkeeping: every transaction is recorded as **at least two equal and opposite entries** in different accounts. This is the bedrock of accounting integrity.

### Core equation

```
Assets = Liabilities + Equity
        (rearranged: Assets - Liabilities = Equity / Net Worth)
```

Every journal entry preserves this equation. If it doesn't, the books are broken.

### The 5 fundamental account types

| Type | Normal balance | Increases with | Decreases with | Example accounts |
|------|----------------|----------------|----------------|------------------|
| **Asset** | Debit | Debit | Credit | Cash, Bank, Receivables, Investments, Fixed Assets |
| **Liability** | Credit | Credit | Debit | Payables, Loans, Deferred Revenue, Accrued Expenses |
| **Equity** | Credit | Credit | Debit | Capital, Retained Earnings, Owner's Equity |
| **Revenue** | Credit | Credit | Debit | Sales, Fee Income, Interest Income, Realized Gain |
| **Expense** | Debit | Debit | Credit | Cost of Goods, Salaries, Interest Expense, Realized Loss |

**Mnemonic:** **DEAD-CLER** — *Debits* increase **D**rawings, **E**xpenses, **A**ssets; *Credits* increase **D**ividends-payable, **L**iabilities, **E**quity, **R**evenue.

### Universal accounting invariants

These appear in every double-entry system. Copy verbatim into your module's `what.md` (adjust IDs to your module prefix):

```markdown
### INV-ACC-01 — Debit = Credit per journal entry
Status: ✅ IMPL (DB constraint: sum(debit) - sum(credit) = 0 per journal_id)

For every journal entry, the sum of all debit lines MUST equal the sum of all
credit lines. No partial / imbalanced journals.

Enforcement layers:
- DB: CHECK constraint OR trigger on journal_line table
- App: Service-layer assertion before INSERT
- Test: Property-based test — random journals MUST always balance
```

```markdown
### INV-ACC-02 — Journal immutability (write-once, never UPDATE/DELETE)
Status: ✅ IMPL (no UPDATE/DELETE statements in service layer; reversing-entry pattern)

Posted journal entries MUST NEVER be modified or deleted. Corrections are
made by posting a **reversing journal entry** that negates the original,
followed by a corrected entry.

Enforcement layers:
- DB: REVOKE UPDATE, DELETE on journal_line FROM application_user
- App: Service interface has no updateJournal() / deleteJournal() — only
       postJournal() and postReversingJournal()
- Audit: All modifications captured as new INSERT rows with reference to
         original journal_id
```

```markdown
### INV-ACC-03 — Account balances derived, never stored as truth
Status: ⚠️ See note — store with caution

The authoritative balance of any account is `SUM(debit) - SUM(credit)` over
its journal lines (respecting account type's normal balance direction).

If balances ARE materialized in a balances table for performance, they MUST
be reconciled against the journal at least daily (period-end recalc job)
and a divergence triggers a 🚨 P0 alert.
```

```markdown
### INV-ACC-04 — No negative balance on asset accounts (without explicit allow flag)
Status: 🟡 PARTIAL (app-layer check; not DB-enforced)

Cash, bank, receivables accounts MUST NOT go negative without explicit
overdraft authorization. Use account.allow_overdraft flag for exceptions.

Enforcement layers:
- App: Service checks projected balance BEFORE posting journal
- DB: Optional CHECK constraint (often deferred for performance)
```

```markdown
### INV-ACC-05 — Period close immutability
Status: ✅ IMPL (period_status enum + service guard)

Once a fiscal period is CLOSED, no new journal entries may be posted with
posting_date within the period. Only the controller role can REOPEN a
closed period (audit-logged).

Enforcement layers:
- DB: period_status enum on fiscal_period table
- App: Service rejects postJournal() if period.status = CLOSED
- Audit: REOPEN action logged with operator + reason
```

```markdown
### INV-ACC-06 — Posting-date in current OR open prior period only
Status: ✅ IMPL

Cannot post a journal entry to a future fiscal period or to a CLOSED prior
period. Date must be ≤ today AND within an OPEN period.
```

```markdown
### INV-ACC-07 — Operator identity captured on every journal
Status: 🚧 NOT-ENFORCED (createdBy:0 anti-pattern found in pilot — see
                          spawn chip #XYZ)

Every journal entry MUST capture: createdBy (user_id), createdAt (timestamp),
postedBy (if separate from creator), postedAt. NO sentinel values like 0,
NULL, or 'system' (use a dedicated system actor like 'system.eod' if
posting from background jobs).

Enforcement layers:
- DB: NOT NULL on createdBy, FK to users; CHECK createdBy > 0
- App: Inject security context; reject postJournal() without authenticated user
- Test: Integration test rejects sentinel values
```

```markdown
### INV-ACC-08 — Reversing entry must reference original
Status: ✅ IMPL

A reversing journal entry MUST set reverses_journal_id = original_id. The
service must verify the original exists and has NOT been reversed before.

Enforcement layers:
- DB: FK reverses_journal_id → journal.id; UNIQUE on reverses_journal_id
       (so an original can be reversed at most once)
- App: Service rejects double-reverse
```

```markdown
### INV-ACC-09 — Multi-currency journals use a single base currency for the equation
Status: ✅ IMPL (with FX gain/loss accounts)

If a journal involves multiple currencies, each line MUST also carry a
`base_currency_amount` computed at the spot rate on posting_date. The
debit=credit invariant (INV-ACC-01) applies to base_currency_amount, not
transaction_amount.

Any FX differences flow to a dedicated FX gain/loss account.
```

```markdown
### INV-ACC-10 — Trial balance must balance after every batch
Status: ✅ IMPL (assertion job runs after each batch posting)

After each EOD / batch posting cycle:
SUM(all debits across all accounts) = SUM(all credits across all accounts)
A divergence = 🚨 P0 immediate halt + investigate.
```

## 2. IFRS-aware framework

> ZeeSpec overlay does NOT prescribe a specific accounting standard, but recognizes IFRS terminology since most non-US regulated entities use IFRS. US GAAP analogues noted where they differ materially.

### Recognition principles

| IFRS principle | What it means for code |
|----------------|------------------------|
| **Accrual basis** (IAS 1) | Record economic events when they occur, not when cash changes hands. Code must distinguish "accrued" vs "received" timestamps. |
| **Going concern** (IAS 1) | Default assumption — code shouldn't conditionally halt accruals based on entity viability (a separate workflow). |
| **Materiality** (IAS 1) | Below-threshold events MAY be aggregated. Threshold is configurable per organization. |
| **Substance over form** (Conceptual Framework) | Record based on economic reality, not legal label. E.g., a "lease" that's economically a finance purchase records as an asset + liability. |
| **Prudence / Conservatism** (Conceptual Framework) | Don't overstate assets/revenue; don't understate liabilities/expenses. Bias toward earlier expense recognition + later revenue recognition when ambiguous. |
| **Consistency** (IAS 8) | Policy changes require disclosure + retrospective application (with limited exceptions). |
| **Cut-off** (audit principle) | Transactions must be recorded in the correct period. Period close enforces this. |

### Common IFRS line types in code

- **IFRS 9** — Financial Instruments (impairment, classification, hedge accounting). Affects: receivables, loans, investments
- **IFRS 15** — Revenue from Contracts with Customers (5-step model: identify contract → identify performance obligations → determine price → allocate to obligations → recognize as obligations satisfied)
- **IFRS 16** — Leases (right-of-use asset + lease liability for lessees; most operating leases now on balance sheet)
- **IAS 21** — FX (functional currency, presentation currency, translation differences)
- **IAS 37** — Provisions, contingent liabilities, contingent assets

### Revenue recognition (IFRS 15) invariants

```markdown
### INV-ACC-11 — Revenue recognized when performance obligation satisfied
Status: project-dependent

Don't recognize revenue at order time. Recognize when:
- Goods: customer obtains control (typically delivery/title transfer)
- Service: as the customer simultaneously receives + consumes the benefit
- Investment management: typically over time as services rendered (daily accrual common)

Enforcement: Service layer must check `performance_obligation_status` before
posting revenue journal.
```

```markdown
### INV-ACC-12 — Deferred revenue for prepayments
Status: project-dependent

Cash received before performance obligation satisfied → CREDIT deferred
revenue (liability), NOT revenue. Recognize as revenue when earned.
```

### FX revaluation (IAS 21) invariants

```markdown
### INV-ACC-13 — Monetary items revalued at each reporting date
Status: project-dependent

Foreign-currency monetary items (cash, receivables, payables denominated
in non-base currency) MUST be revalued at the spot rate on each period-end
reporting date. FX differences flow to P&L (FX gain/loss).

Non-monetary items (fixed assets, inventory) carried at historical rate.
```

## 3. Period close mechanics

Period close (month-end, quarter-end, year-end) is a critical accounting workflow with strong invariants.

### Period states

```
DRAFT → OPEN → SOFT_CLOSED → CLOSED → ARCHIVED
                    ↑              ↓
                    └── REOPENED ──┘
                       (controller role only;
                        audit-logged)
```

| State | What's allowed |
|-------|----------------|
| **DRAFT** | Period not yet started; rare in practice |
| **OPEN** | All operations allowed: post, adjust, reverse |
| **SOFT_CLOSED** | New transactions blocked for users; controller can still post adjustments |
| **CLOSED** | All posting blocked; only REOPEN possible (controller role + reason) |
| **ARCHIVED** | Read-only; cannot be reopened |

```markdown
### HW-ACC-14 — Period state transitions are forward-only (except REOPEN)
Status: ✅ IMPL

Service must reject any transition that moves the period backward in the
flow above, EXCEPT the explicit REOPEN action.
```

### Period close checklist (codify as workflow)

Before transitioning OPEN → SOFT_CLOSED:

1. ✅ All bank reconciliations done
2. ✅ All AR/AP reconciliations done
3. ✅ Accruals posted (interest, fees, salaries)
4. ✅ Deferred revenue / prepayments amortized
5. ✅ FX revaluation done (per INV-ACC-13)
6. ✅ Depreciation / amortization run
7. ✅ Inventory valuation done (if applicable)
8. ✅ Provisions reviewed (IAS 37)
9. ✅ Intercompany reconciliations (if applicable)
10. ✅ Trial balance reconciled (INV-ACC-10)
11. ✅ Subledger-to-GL reconciliations passed

Before transitioning SOFT_CLOSED → CLOSED:

12. ✅ Management review sign-off
13. ✅ Audit-trail completeness check (every journal has createdBy + reason)
14. ✅ Period-end snapshots taken (trial balance, balance sheet, P&L)
15. ✅ Regulatory submission prep (FRC NAV report, AML CTR/STR submissions)

## 4. Chart of Accounts (CoA) principles

```markdown
### INV-ACC-15 — Account codes follow a hierarchical naming scheme
Status: project-dependent (recommended: 4-6 digit numeric or alphanumeric)

Account codes encode the hierarchy:
1xxxxx = Assets
  11xxxx = Current Assets
    1100xx = Cash and equivalents
    1110xx = Bank accounts
    1200xx = Receivables
  12xxxx = Non-current Assets
2xxxxx = Liabilities
  21xxxx = Current Liabilities
3xxxxx = Equity
4xxxxx = Revenue
5xxxxx = Expenses
```

```markdown
### INV-ACC-16 — Leaf accounts only post; intermediate accounts roll up
Status: ✅ IMPL

Journal entries may only reference LEAF accounts (no children). Intermediate
account totals are computed by aggregation.

Enforcement: Service rejects postJournal() if account.is_leaf = false.
```

```markdown
### INV-ACC-17 — Account type immutable after first transaction
Status: ✅ IMPL

Once an account has any journal lines, its `account_type` (asset / liability
/ equity / revenue / expense) MUST NOT change. Otherwise debits/credits
flip meaning.

Enforcement: DB trigger blocks UPDATE on account_type if EXISTS journal_line
referencing the account.
```

## 5. Subledger ↔ General Ledger reconciliation

In modular systems, subledgers (wallets, receivables, payments) often summarize into a smaller number of GL accounts. The reconciliation invariant is critical.

```markdown
### INV-ACC-18 — Subledger balances sum to GL control account
Status: ✅ IMPL (reconciliation job runs daily; divergence = 🚨 P0)

For every subledger (e.g., customer wallets), the sum of all subledger
balances at point T MUST equal the GL control account balance at point T.

Example: SUM(customer_wallet.balance for all customers) = GL account 1110-01
        "Customer Funds — Operating Account" balance.

Reconciliation runs:
- After each batch
- At EOD
- Period-end (mandatory; period cannot close if divergence > materiality
  threshold)
```

## 6. Audit trail invariants

```markdown
### HW-ACC-19 — Every state mutation captured with who + when + why
Status: ⚠️ Critical for any regulated jurisdiction

Audit log MUST capture for every: journal post, journal reverse, period
close/reopen, account creation/deactivation, balance materialization:
- actor (user_id, NOT NULL, NOT 0)
- timestamp (UTC, microsecond)
- action (enum)
- before_state (JSON or null for INSERT)
- after_state (JSON)
- reason (free text for high-impact actions)
- correlation_id (request_id, batch_id)

Retention: per FRC = 7 years minimum (see regulatory-compliance.md).
```

## 7. Common pitfalls in code

Cross-link to `financial-anti-patterns.md` for full catalog. Brief preview:

- **Float for money** — never. Use Decimal/BigDecimal/Money type.
- **Rounding before sum** — sum first, round once at presentation.
- **Storing balance as cache without reconciliation** — drift accumulates silently.
- **Single-row journal** — debit and credit must be separate journal_line rows; never one row with two amounts.
- **Cross-period posting** — see INV-ACC-05/06; reject silently is worse than throwing.
- **createdBy: 0 sentinel** — see INV-ACC-07; breaks audit trail.

## 8. Money representation

| Concept | Recommendation |
|---------|----------------|
| **In-memory** | Use a Money type (Decimal + ISO currency code). Java: BigDecimal + Currency; Python: `decimal.Decimal` + ISO code; Go: `shopspring/decimal` + string; Rust: `rust_decimal` + ISO code; TS: `dinero.js` or `currency.js`. |
| **DB storage** | NUMERIC(precision, scale) — e.g., NUMERIC(18,4) for amounts up to 10^14 with 0.0001 granularity. Separate column for currency code. |
| **Wire format** | String with currency code (`"1000.0000"` + `"USD"`) or integer minor units (`100000` cents) + currency code. NEVER `1000.0` as JSON number. |
| **Display** | Locale-aware formatting at presentation layer ONLY. Storage is canonical. |

```markdown
### HW-ACC-20 — Money type used consistently across all amount fields
Status: project-dependent (audit via grep)

NO float / double / Number type for any monetary value at any layer.
Audit your codebase: `grep -rn "float\|double" --include='*.{ext}'` for
suspect usage. Acceptable only for ratios (yields, percentages) where
precision loss is documented.
```

## 9. Performance + fee accrual

```markdown
### INV-ACC-21 — Daily accrual for management/performance fees
Status: project-dependent

Management fees (e.g., 1.5% annually) accrue DAILY:
  daily_accrual = (AUM × annual_rate) / 365 (or 360 — pick + document)

Performance fees with high-water mark:
- Track high-water mark per investor cohort
- Accrue only on positive excess return above HWM
- Crystallize at specified intervals (typically quarterly or annually)
```

```markdown
### INV-ACC-22 — Fee accrual posts as DR Fee Expense / CR Fee Payable
Status: project-dependent

Daily accrual entry:
  DR  Fee Expense (P&L)           daily_amount
    CR  Fee Payable (Liability)            daily_amount

Settlement entry (when crystallized + paid):
  DR  Fee Payable                 accumulated_amount
    CR  Cash / Bank                        accumulated_amount
```

## 10. Tax accounting touchpoints

Tax is jurisdiction-specific; this overlay does NOT codify tax rules. But these invariants are universal:

```markdown
### HW-ACC-23 — Withholding tax recorded separately from gross revenue
Status: project-dependent

If withholding tax applies (e.g., 10% on investment income paid to
individuals), the gross + withheld amounts must be visible:

  DR  Cash                       net_paid (90%)
  DR  Withholding Tax Receivable tax_withheld (10%)
    CR  Revenue                          gross (100%)

NOT collapsed as "Cash 90 / Revenue 90" (loses withholding visibility).
```

## 11. Apply this file to your module

When authoring an `accounting/` module (or any module that posts to GL):

1. Read this file
2. Copy invariants INV-ACC-01 through INV-ACC-22 (as relevant) into your `what.md` § 2
3. Adjust IDs to your module prefix (e.g., `INV-GL-01` if your module is `general-ledger`)
4. Verify each invariant against production code (R3 deep review)
5. Tag status (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN / 🚧 NOT-ENFORCED)
6. Add module-specific extensions

## 12. References

- IFRS Foundation: https://www.ifrs.org
- FASB ASC: https://asc.fasb.org
- Ron Lewis, "Financial Accounting" (standard textbook for double-entry foundations)
- Mongolia FRC accounting guidelines (Монгол улсын СЗХ-ны нягтлан бодох бүртгэлийн журам)

## Next

→ `regulatory-compliance.md` — FRC + AML + KYC framework
