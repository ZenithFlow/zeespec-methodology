---
module: wallet-settlement
type: module-overview
overlay: finance-accounting
version: 0.1.0
status: draft (condensed reference; expand into 10 files when authoring)
last_updated: 2026-05-18
---

# Wallet & Settlement — Module Overview

> Condensed reference for the wallet/payment/settlement module. When you author this module in your project, expand each numbered section below into the corresponding ZeeSpec file (CLAUDE.md, why.md, what.md, etc.) per core ZeeSpec core/workflow/01-authoring-checklist.md.

## Module purpose

The **Wallet & Settlement** module manages customer balances and money movement (deposit, withdraw, transfer, payout). It is a **subledger** that reconciles to the GL daily.

Module prefix: `WAL` (example: INV-WAL-04, HW-WAL-08, ADR-WAL-012)

## CLAUDE.md — Entry point

Production code: `<your-source>/Wallet/*`

ADRs:
- **ADR-WAL-001** — Wallet is a subledger; control account is GL `1110-XX` "Customer Funds Operating"
- **ADR-WAL-002** — Customer-initiated deposits trigger CTR check (per INV-FRC-05)
- **ADR-WAL-003** — Withdrawals require KYC tier ≥ FULL + bank-account verified (see INV-WAL-18)
- **ADR-WAL-004** — Outbox event on every state change; downstream: notification, accounting, reporting
- **ADR-WAL-005** — Bank-statement reconciliation T+1 (see INV-FIN-25)
- **ADR-WAL-006** — Auto-invest feature: deposits flagged auto-invest become BUY orders (see ADR in investment module)

Cross-module deps:
- Upstream: `auth`, `customer`, `kyc-aml` (verification check), `bank-integration`
- Downstream: `accounting` (posts journals via GL service), `notification`, `regulatory-reporting`

Critical invariants:
- **INV-WAL-01** — Wallet balance = SUM(wallet_transaction) for that wallet
- **INV-WAL-02** — Customer cannot withdraw before KYC tier FULL (HW-WAL inherits INV-FRC-04)
- **INV-WAL-03** — Bank account must be verified before becoming withdrawal target
- **INV-WAL-18** — Subledger reconciliation passes daily (inherits INV-GL-18)

## why.md — Strategic

Goals:
- G-WAL-01 — Single source of customer balance truth
- G-WAL-02 — Audit-grade money movement; every cent traceable
- G-WAL-03 — AML/CTR compliance on cash flows (FRC + Mongolia AML law)
- G-WAL-04 — T+0 to T+1 settlement for typical operations

Business rules (BR):
- BR-WAL-01 — Minimum deposit: 100,000 MNT
- BR-WAL-02 — Maximum daily limit: 5,000,000 MNT
- BR-WAL-03 — Cash transaction ≥ 20M MNT auto-CTR
- BR-WAL-04 — Withdrawals only to customer's verified bank account
- BR-WAL-05 — Processing hours 09:00-17:00 (after-hours queued)

Compliance drivers:
- Mongolia AML law — 7-year retention, CTR/STR
- FRC — segregation of client funds (CLIENT_TRUST account class)
- IFRS — accrual basis for fee/interest accruals

Risks:
- R-WAL-01 — Bank reconciliation break aged > 3 days → 🚨 P0 (inherits HW-FIN-27)
- R-WAL-02 — Withdrawal to unverified account (KYC bypass) → AML violation
- R-WAL-03 — Auto-invest race condition: deposit + simultaneous withdrawal

## what.md — Entities + Invariants

### Wallet
| Field | Type | Notes |
|-------|------|-------|
| id, customer_id (FK), balance NUMERIC(18,4), currency CHAR(3), status ENUM(ACTIVE, FROZEN, CLOSED) | | Per customer/currency |

### WalletTransaction
| Field | Type | Notes |
|-------|------|-------|
| id, wallet_id (FK), tx_type ENUM(DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT, FEE, INTEREST, REVERSAL, ADJUSTMENT), amount NUMERIC(18,4), currency CHAR(3), counterparty (json), bank_account_id (FK nullable), reference (text), status ENUM(PENDING, COMPLETED, FAILED, REVERSED), correlation_id, created_by FK CHECK>0, created_at, completed_at, fx_rate, base_amount, journal_id (FK to GL once posted) | | INV-WAL-01 |

### BankAccount (customer-linked)
| Field | Type | Notes |
|-------|------|-------|
| id, customer_id (FK), bank_code, account_number_encrypted, account_holder_name, is_verified BOOL, verified_at, verified_by FK, verification_method ENUM(MICRO_DEPOSIT, OFFICIAL_REGISTRY, MANUAL_DOC) | | INV-WAL-03 |

### CTRFiling, STRFiling
(See kyc-aml module for full schema; wallet creates these.)

### ReconciliationBreak (per HW-FIN-27)
| Field | Type |
|-------|------|
| id, statement_line_id (FK), wallet_tx_id (FK nullable), expected_amount, actual_amount, diff, status ENUM(OPEN, RESOLVED, ESCALATED), detected_at, resolved_at, resolved_by |

### Key INVs (~15-20):
- INV-WAL-01 wallet.balance derived = SUM(wallet_transaction)
- INV-WAL-02 cannot withdraw before KYC FULL (inherits INV-FRC-04)
- INV-WAL-03 cannot withdraw to unverified bank account
- INV-WAL-04 cash deposits ≥ 20M MNT auto-CTR (inherits INV-FRC-05)
- INV-WAL-05 transfer between wallets is two-leg (TRANSFER_OUT + TRANSFER_IN, same correlation_id, atomic)
- INV-WAL-06 amount > 0 always; reversals are separate REVERSAL rows (not negative amount)
- INV-WAL-07 currency match: tx.currency == wallet.currency (no cross-currency in single wallet)
- INV-WAL-08 status transitions: PENDING → COMPLETED | FAILED; COMPLETED → REVERSED (via reversal tx, not UPDATE)
- INV-WAL-09 GL journal posted atomically with wallet_transaction (outbox or inline TX)
- INV-WAL-10 idempotency: same correlation_id from client → reuse existing tx (no double-create)
- INV-WAL-11 sanctions screening on counterparty before COMPLETED (inherits INV-FRC-06)
- INV-WAL-12 bank account encryption at rest (PCI/PII)
- INV-WAL-13 wallet.status = FROZEN → block all tx (compliance hold)
- INV-WAL-14 daily limit enforced per customer per currency (BR-WAL-02)
- INV-WAL-15 KYC tier ceiling on transaction size (inherits INV-FIN-18)
- INV-WAL-16 audit log on every status mutation (HW-WAL-19 inherits HW-GL-19)
- INV-WAL-17 operator identity captured on every action (inherits INV-GL-07)
- INV-WAL-18 daily subledger ↔ GL reconciliation (inherits INV-GL-18)
- INV-WAL-19 bank statement reconciliation T+1 (inherits INV-FIN-25)
- INV-WAL-20 retention: wallet_transaction + CTRFiling + STRFiling kept 7y (inherits HW-FIN-22)

## how.md — Algorithms

### ALG-WAL-DEPOSIT-01 — Process customer deposit
```
processDeposit(input):
  ASSERT customer.kyc_tier >= TIER_BASIC                     # INV-FIN-18
  ASSERT NOT customer.wallet.status == FROZEN                # INV-WAL-13
  ASSERT input.amount >= 100000 MNT                          # BR-WAL-01
  ASSERT customer.daily_total + input.amount <= limit_for_tier  # BR-WAL-02 + INV-WAL-14

  # CTR check
  if input.amount >= 20000000 MNT AND input.payment_method == CASH:
    ctrFlag := TRUE

  # Sanctions screening
  if input.counterparty:
    sanctionsHit := sanctionsService.screen(input.counterparty)
    if sanctionsHit:
      blockAndFile(STR)
      THROW SanctionsHit
  
  # Atomic deposit + GL post + outbox
  BEGIN TRANSACTION
    tx := walletTransaction.insert(
      wallet_id, tx_type=DEPOSIT, amount, currency, status=PENDING,
      created_by=actor.id, correlation_id, ...
    )
    
    # Post to GL (atomic)
    journal := accountingService.postJournal(
      type=REGULAR,
      lines=[
        Line(account=bank_clearing, side=DEBIT, amount, currency),
        Line(account=customer_wallet_control, side=CREDIT, amount, currency)
      ],
      correlation_id
    )
    
    tx.journal_id := journal.id
    tx.status := COMPLETED
    walletTransaction.update(tx)
    
    auditLog.append(action=DEPOSIT, actor_id=actor.id, ...)
    
    if ctrFlag:
      ctrFiling.insert(wallet_tx_id=tx.id, amount, status=PENDING_FILE)
      outbox.publish(CTRFileRequiredEvent(tx.id))
  COMMIT
  
  outbox.publish(DepositCompletedEvent(tx.id))
  
  return tx
```

### ALG-WAL-WITHDRAW-01 — Process customer withdrawal
```
processWithdrawal(input):
  ASSERT customer.kyc_tier >= TIER_FULL                      # INV-WAL-02 (stricter than deposit)
  ASSERT input.bank_account.customer_id == customer.id       # ownership
  ASSERT input.bank_account.is_verified == TRUE              # INV-WAL-03
  ASSERT NOT customer.wallet.status == FROZEN
  ASSERT customer.wallet.balance >= input.amount             # balance check
  ASSERT input.amount + customer.daily_withdraw_total <= limit_for_tier
  
  # Sanctions screening on beneficiary
  beneficiaryName := input.bank_account.account_holder_name
  sanctionsHit := sanctionsService.screen(beneficiaryName)
  if sanctionsHit: blockAndFile(STR); THROW
  
  # Approval check (SoD)
  if input.amount > approval_threshold:
    ASSERT input.approver_id IS NOT NULL
    ASSERT input.approver_id != input.initiator_id           # SoD
  
  BEGIN TRANSACTION
    tx := walletTransaction.insert(... tx_type=WITHDRAWAL, status=PENDING ...)
    
    # GL post: customer wallet DEBIT (decreasing liability), bank clearing CREDIT
    journal := accountingService.postJournal(
      lines=[
        Line(account=customer_wallet_control, side=DEBIT, amount),
        Line(account=bank_clearing, side=CREDIT, amount)
      ]
    )
    
    tx.journal_id := journal.id
    walletTransaction.update(tx)
    
    auditLog.append(...)
  COMMIT
  
  # Async: send to bank payment processor
  outbox.publish(WithdrawalReadyEvent(tx.id))
  
  return tx
```

### ALG-WAL-TRANSFER-01 — Wallet-to-wallet transfer (2-leg)
Atomic: TRANSFER_OUT + TRANSFER_IN with same correlation_id. GL: DR sender_control, CR receiver_control (within same control account = self-cancelling at control-account level but tracked per-wallet).

### ALG-WAL-RECON-BANK-01 — Bank statement reconciliation (per INV-FIN-25)
```
reconcileBankStatement(date):
  statement_lines := bankProvider.fetchStatement(date)
  internal_txs := walletTransaction.findByDate(date, type IN (DEPOSIT, WITHDRAWAL))
  
  matched := []
  unmatched_statement := []
  unmatched_internal := internal_txs.copy()
  
  FOR stmt_line IN statement_lines:
    candidate := unmatched_internal.find(matches(stmt_line))
    if candidate:
      matched.append((stmt_line, candidate))
      unmatched_internal.remove(candidate)
    else:
      unmatched_statement.append(stmt_line)
  
  FOR stmt_line IN unmatched_statement:
    reconciliationBreak.insert(statement_line=stmt_line, status=OPEN)
  
  FOR tx IN unmatched_internal:
    reconciliationBreak.insert(wallet_tx=tx, expected_in_statement=tx, status=OPEN)
  
  if reconciliationBreak.count(date) > 0:
    alert.send(severity=if any aged>3d: P0 else: P1)
```

## who.md — Actors + RBAC

| Actor | Can do | Cannot |
|-------|--------|--------|
| Customer | Initiate own deposit / withdrawal / transfer | Anything on others' wallets |
| Operator | Process pending tx (mark COMPLETED after bank ACK), run recon | Approve large withdrawals; SoD ops |
| Approver | Approve large withdrawals; cannot approve own initiated tx (SoD) | Process own |
| Compliance Officer | Freeze/unfreeze wallets (compliance hold); file STR/CTR | Process operational tx |
| Controller | Reverse historical tx (with reason); GL adjustments | Day-to-day ops |
| Auditor | Read all wallet + tx + audit + recon data | Any write |
| System actors: `system.eod`, `system.recon`, `system.bank-sync` | Automated tasks | Interactive actions |

SoD:
- SOD-WAL-01 — Withdrawal approver ≠ initiator (4-eyes for amounts > threshold)
- SOD-WAL-02 — Compliance freeze approver ≠ requester (4-eyes)
- SOD-WAL-03 — Reversal: actor ≠ original creator

## when.md — Timing

- Processing hours: 09:00-17:00 local (BR-WAL-05); after-hours → PENDING queue, processed next business day
- CTR filing deadline: 5 business days from trigger event (per Mongolia AML)
- STR filing deadline: 24 hours from suspicion (per Mongolia AML, Art. 13)
- Bank reconciliation: T+1 by 11:00 local
- Subledger ↔ GL reconciliation: daily by 23:30 (per HW-GL-18)
- Settlement: T+0 for internal transfers; T+1 for deposits (after bank confirmation); T+1 for withdrawals (after bank disbursement)
- SLAs:
  - SLA-WAL-DEPOSIT-30s — Customer deposit API response p99 < 30s
  - SLA-WAL-WITHDRAW-2min — Withdrawal initiation < 2 min (bank submission)
  - SLA-WAL-RECON-1h — Daily bank recon completion < 1 hour
  - SLA-WAL-CTR-5d — CTR filed within 5 business days

Schedules:
- `system.bank-sync` — every 30 min during business hours: pull bank statement deltas
- `system.recon` — daily 23:30: bank vs internal reconciliation
- `system.eod` — daily 22:00: subledger ↔ GL recon + snapshots
- `system.compliance` — daily 06:00: scan for sanctions list refresh, AML typology checks

## where.md § 5 — Tech Stack

(See ../general-ledger/where.md § 5 — same shape. Module-specific additions:)

- Bank integration: provider SDK (e.g., Golomt OpenBanking; or your country's open-banking API)
- Encryption: bank_account.account_number encrypted at rest (KMS / customer-managed key)
- Sanctions screening: provider (e.g., World-Check, ComplyAdvantage, FATF lists; or internal Mongolia-designated-persons list)

## gravity.md — HW-WAL-*

- HW-WAL-01 — Wallet tx atomic with GL journal posting (outbox or inline TX)
- HW-WAL-02 — KYC check before tx (inherits HW-FIN-18-related path)
- HW-WAL-03 — Sanctions screening before tx COMPLETED
- HW-WAL-04 — Audit log append-only (inherits HW-GL-19)
- HW-WAL-05 — Bank account encrypted at rest
- HW-WAL-06 — Subledger reconciliation daily; aged break → P0 (inherits HW-FIN-27)
- HW-WAL-07 — Compliance freeze blocks ALL tx (no override path except controller-by-design with audit)
- HW-WAL-08 — Operator identity (no sentinels) (inherits HW-GL-06)
- HW-WAL-09 — Retention 7y on wallet_transaction + CTR + STR (inherits HW-FIN-22)
- HW-WAL-10 — Idempotency via correlation_id (inherits HW-FIN-04)

## gaps.md — Common pilot findings

- Gap-WAL-01: Withdrawal "bypasses" KYC because some legacy path uses different service entry point — verify ALL withdrawal paths enforce KYC
- Gap-WAL-02: Sanctions list cache TTL too long (24h sometimes) — should refresh daily + alarm on stale
- Gap-WAL-03: Bank reconciliation breaks resolved manually with no audit of who/why — add resolver_id + reason fields
- Gap-WAL-04: Wallet freeze is enforced in UI but back-end has rare bypass via direct service call — close all paths

## glossary.md — Module-specific terms

**CTR (Cash Transaction Report)** — Required filing for cash transactions ≥ threshold (Mongolia: 20M MNT). See `../../principles/regulatory-compliance.md`.

**STR / SAR (Suspicious Transaction Report)** — Filing triggered by typology or manual flag. Filed within 24 hours of suspicion.

**KYC tier** — Customer verification level (TIER_0 / BASIC / FULL / EDD). See `../kyc-aml/MODULE-OVERVIEW.md`.

**Compliance freeze** — Wallet status FROZEN; blocks all transactions. Imposed by compliance officer; removed only by compliance with audit reason.

**Verified bank account** — Customer-linked bank account that has passed verification (micro-deposit, official registry, or manual document review).

**Settlement cycle (T+N)** — Time from initiation to final cash availability. Mongolia retail banking typically T+0 to T+1.

**Auto-invest** — Customer pref: deposits automatically convert to investment buy orders. Handled by separate `investment` module triggered via outbox event.

**Wallet control account** — GL account that holds the aggregate balance of all customer wallets. INV-WAL-18 reconciliation target.

## Next when authoring this module

1. Copy this overview into a real `wallet/` module directory
2. Expand each section into its own ZeeSpec file (CLAUDE.md, why.md, what.md, how.md, who.md, when.md, where.md, gravity.md, gaps.md, glossary.md)
3. Cite production code at every claim (R3 verification)
4. Fill the YAML frontmatter + status tags
5. Run B1 + R3 + R1+R2 reviews per core ZeeSpec workflow
