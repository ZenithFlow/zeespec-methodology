---
doc: overlays/finance-accounting/principles/financial-invariants-catalog
type: principles-spec
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Financial Invariants Catalog — 30 Reusable INV/HW Entries

> Battle-tested invariants from the pilot project (mutual fund management system). Copy the relevant ones into your module's `what.md` (INV) or `gravity.md` (HW). Adjust IDs to your module prefix.

## Legend

- **INV** = data-integrity invariant (lives in `what.md`)
- **HW** = hardwiring cross-cutting constraint (lives in `gravity.md`)
- Status tag conventions per core ZeeSpec `checklists/status-tags.md`

## Section A — Identity + Audit (5)

### INV-FIN-01 — Every monetary mutation captures real operator identity
**Status guidance:** Must be ✅ IMPL or 🚧 BROKEN — there is no acceptable PARTIAL state.

Required fields on EVERY table that records money movement (journal_line, wallet_transaction, payment, etc.):
- `created_by` (FK to users, NOT NULL, CHECK > 0)
- `created_at` (TIMESTAMP UTC, NOT NULL)
- `correlation_id` (request_id or batch_id, NOT NULL)

For system-initiated actions (EOD jobs), use a dedicated system user (e.g., `system.eod`, `system.fee-accrual`) — NEVER user_id = 0 or NULL or string 'system'.

**Test:** `INSERT ... VALUES (..., created_by = 0)` MUST fail (DB CHECK constraint).

### INV-FIN-02 — Approval action audit-logged with reason
For any approve/reject action on customer requests (deposit, withdrawal, KYC tier upgrade, account closure):
- `approver_id` (FK, NOT NULL)
- `approved_at` (UTC)
- `decision` (APPROVED / REJECTED)
- `reason` (TEXT, REQUIRED for REJECTED; OPTIONAL for APPROVED if threshold low)
- `decision_artifact_url` (S3/GCS link to supporting docs, optional)

### HW-FIN-03 — Audit log is append-only
- DB: REVOKE UPDATE, DELETE on audit_log FROM application_user
- App: No service method updates or deletes audit log entries; corrections via new entries with `corrects_audit_id` reference
- Backup: Separate retention (audit log retained ≥ business records)

### HW-FIN-04 — Correlation ID propagated end-to-end
Every request entering the system gets a `correlation_id`. It propagates through:
- HTTP request headers (X-Correlation-Id)
- All service-layer calls
- All DB writes
- All async messages
- All external API calls (logged)
- All log lines

Enables one query to assemble the entire causal chain of an action.

### INV-FIN-05 — `system` users are never end-user-facing
The `system.*` user accounts (e.g., `system.eod`, `system.reconcile`) must:
- NOT be present in customer-facing user search
- NOT receive notifications
- NOT have a real password (use service-account credential)
- Be flagged `is_system = TRUE` for filtering

## Section B — Money + Currency (7)

### HW-FIN-06 — Money type used consistently — never float
See `accounting-principles.md` HW-ACC-20. Grep audit: `rg "float\|double\|Number" --type=ext` for suspect monetary usage.

### INV-FIN-07 — Amount + currency always paired
Any column or DTO field holding a monetary amount MUST be accompanied by a currency field. NEVER an "amount" alone.
- Schema: `(amount NUMERIC(18,4), currency_code CHAR(3))`
- Wire: `{ "amount": "1000.0000", "currency": "USD" }`

### INV-FIN-08 — ISO 4217 currency codes only
Currency codes are uppercase 3-letter ISO 4217 (`USD`, `EUR`, `MNT`, `JPY`, `CNY`, etc.). Enforce via:
- DB: CHECK (currency_code ~ '^[A-Z]{3}$') OR FK to currencies dimension table
- App: Validate at API boundary

### INV-FIN-09 — FX rate captured at transaction time AND posting time
For any multi-currency transaction, store:
- `transaction_amount` + `transaction_currency` (original)
- `base_currency_amount` + `base_currency_code` (your reporting currency)
- `fx_rate_used` (NUMERIC(18,8))
- `fx_rate_date` (DATE of the rate)
- `fx_rate_source` (provider: e.g., XE, Reuters, central bank)

FX differences between transaction-time and posting-time flow to FX gain/loss accounts.

### HW-FIN-10 — Rounding centralized in a Money type, not ad-hoc
- Application uses ONE rounding policy (typically HALF_EVEN / banker's rounding)
- Scale set per currency (USD/EUR = 2 decimals; JPY = 0; some crypto = 8+)
- Rounded ONLY at output / settlement boundaries — internal arithmetic preserves precision

### INV-FIN-11 — Multi-leg journals sum equal in BASE currency
For multi-currency journals (per HW-ACC-09): sum of base-currency-amount debits = sum of base-currency-amount credits. Transaction-currency sums may differ; that's OK.

### HW-FIN-12 — FX revaluation runs at every period close
Per IAS 21: monetary items (cash, AR, AP in foreign currency) revalued at period-end spot rate. Difference posted to FX gain/loss.

## Section C — Journal + Ledger (5)

### INV-FIN-13 — Journal lines reference leaf accounts only
See INV-ACC-16. Enforced at service layer + DB trigger.

### INV-FIN-14 — Posting date within open period
See INV-ACC-05/06. Service rejects post() if period status ≠ OPEN.

### INV-FIN-15 — Reversing entry references original; uniqueness enforced
See INV-ACC-08. `UNIQUE(reverses_journal_id)` so an original can be reversed at most once.

### HW-FIN-16 — Journal entry posting is atomic
The entire journal (all lines) commits OR rolls back. NEVER partial:
- All lines INSERT in one DB transaction
- Failure rolls back ALL lines (DB transaction)
- If using async dispatch: outbox pattern (single TX writes outbox + lines; separate worker dispatches event)

### INV-FIN-17 — Account state changes audit-logged separately
Account creation, deactivation, account-type change (where allowed before first transaction), name change — all audit-logged with before+after state.

## Section D — KYC + AML (6)

### INV-FIN-18 — Customer cannot transact above KYC tier ceiling
Per tier:
- TIER_0 → cannot deposit; cannot transact
- TIER_BASIC → max single deposit / withdrawal (e.g., 1M MNT); max monthly volume
- TIER_FULL → standard limits
- TIER_EDD → high-value transactions enabled

Service enforces ceiling at every customer-initiated action.

### INV-FIN-19 — CTR auto-flagged for cash transactions ≥ threshold
See INV-FRC-05. Threshold per jurisdiction (Mongolia: 20M MNT).

### INV-FIN-20 — STR triggered by typology rules + manual flag
Suspicious patterns auto-flagged:
- Smurfing (multiple sub-threshold transactions same day)
- Round-trip (deposit + immediate withdrawal of nearly same amount)
- Geographic risk (high-risk jurisdiction counterparty)
- Velocity (sudden volume spike vs customer baseline)
- PEP transaction above threshold

Compliance officer can also manual-flag any transaction.

### INV-FIN-21 — Sanctions screening on every customer + every counterparty
At customer onboarding, KYC tier change, and EVERY transaction with a non-customer counterparty:
- Customer name screened
- Counterparty name + bank screened
- Hit blocks the transaction + queues for compliance review

### HW-FIN-22 — KYC documents retained per regulatory window
Pilot: 7 years (Mongolia AML).
- Documents in cold storage after 1 year if customer inactive
- soft_delete only after retention window expires
- Hash + signature stored for tamper-evidence

### INV-FIN-23 — Beneficial owner identified for legal-entity customers
Identify natural persons owning/controlling ≥ 25%. Persist chain of ownership.
- For nested structures: traverse until reaching natural persons (or document why traversal halted)
- Re-verify periodically (annually) or on material change

## Section E — Reconciliation (4)

### INV-FIN-24 — Subledger sums = GL control account
See INV-ACC-18. Daily reconciliation; divergence > materiality = 🚨 P0.

### INV-FIN-25 — Bank statement vs internal record reconciled daily
For every bank account integration:
- Fetch daily statement (T+0 or T+1)
- Match each statement line to internal records (deposit, withdrawal, fee)
- Unmatched items → exception queue for operator review
- After N days unmatched (configurable) → escalate to compliance

### INV-FIN-26 — Custodian statement vs portfolio reconciled daily
For investment fund:
- Custodian sends end-of-day holdings + cash report
- Reconcile against internal portfolio model
- Divergence > materiality → halt NAV calc + alert

### HW-FIN-27 — Reconciliation breaks aged > N days = 🚨 P0
Aging thresholds (typical):
- 0-3 days: 🟡 normal
- 4-7 days: 🟠 P1 alert
- 8+ days: 🚨 P0 (regulatory inspector will ask about these)

## Section F — Settlement + Timing (3)

### INV-FIN-28 — Settlement cycle honored (T+N)
- Cash deposits: T+0 or T+1 (per bank cutoffs)
- Investment buys: T+2 or T+3 per market
- Investment sells: T+2 or T+3 per market
- Service must NOT make funds available before settlement date

### HW-FIN-29 — Cutoff times enforced (no end-of-day backdoor)
After daily cutoff (e.g., 16:00 local), new orders go to NEXT trading day. NO ability to backdate orders.

### INV-FIN-30 — Holiday calendar honored
Settlement / processing skips weekends + holidays (per jurisdiction's calendar). Calendar source documented + auditable.

## How to use this catalog

When authoring a finance module:

1. Read this catalog top-to-bottom (45 min)
2. Pick the invariants applicable to your module — typically 8-15 from this list + 5-10 module-specific
3. Copy the relevant entries into your module's `what.md` (INV) / `gravity.md` (HW)
4. Adjust IDs:
   - `INV-FIN-01` → `INV-<YOUR-MOD>-01` (e.g., `INV-GL-01`, `INV-WAL-01`, `INV-KYC-01`)
   - Renumber consistently within your module
5. Tag status (✅ / 🟡 / 🚧)
6. Cite production code (file:line) for each ✅ IMPL
7. File gaps for 🚧 DESIGN / 🚧 NOT-ENFORCED entries

## Coverage matrix — which invariants apply per module type

| Invariant | GL | Wallet | Payment | KYC | NAV | Reporting |
|-----------|:--:|:------:|:-------:|:---:|:---:|:---------:|
| INV-FIN-01 audit identity | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| INV-FIN-02 approval audit | ✓ | ✓ | ✓ | ✓ | | |
| HW-FIN-03 append-only audit | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| HW-FIN-04 correlation ID | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| INV-FIN-05 system users | ✓ | ✓ | ✓ | | ✓ | |
| HW-FIN-06..12 money + FX | ✓ | ✓ | ✓ | | ✓ | ✓ |
| INV-FIN-13..17 journal/ledger | ✓ | partial | partial | | partial | |
| INV-FIN-18..23 KYC/AML | | ✓ | ✓ | ✓ | | partial |
| INV-FIN-24..27 reconciliation | ✓ | ✓ | ✓ | | ✓ | |
| INV-FIN-28..30 settlement/timing | | ✓ | ✓ | | | |

Legend: ✓ = applies; partial = applies in some scenarios; blank = not typically applicable.

## Adapting to new module types

If your module type isn't covered above (e.g., insurance claims, lending originations, derivatives), use these as a starting set and add module-specific invariants. Most finance modules need ≥ 70% of Section A (identity + audit) + Section B (money + currency).

## Next

→ `financial-anti-patterns.md` — what to avoid
