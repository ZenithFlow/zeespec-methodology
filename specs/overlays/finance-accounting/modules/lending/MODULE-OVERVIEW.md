---
module: lending
type: module-overview
overlay: finance-accounting
version: 0.1.0
status: experimental (R4-researched 2026-05-18)
last_updated: 2026-05-18
based_on_research:
  - SRC-NBFI-MN-2002 (Банк бус санхүүгийн үйл ажиллагааны тухай хууль)
  - SRC-MONEYLOAN-MN-2022 (Мөнгөн зээлийн үйл ажиллагааг зохицуулах тухай хууль)
  - SRC-MONGOLBANK-ASSETCLASS (Активыг ангилах журам)
  - SRC-FRC-MLPC-2024 (Money Loan Policy Council interest cap)
  - IFRS 9 (Expected Credit Loss)
---

# Lending — Module Overview

> Условный reference for a lending / loan-management module. Cover loan origination, repayment scheduling, interest accrual, NPL classification, ECL provisioning, collection workflow. Researched specifically for **Mongolia NBFI** licensing context (FRC + Mongolbank regulations) + cross-mapped to **IFRS 9 ECL international standard** so the same module shape applies to EU/US/UK/etc. with per-jurisdiction NPL threshold adjustments.

## Module purpose

The **Lending** module manages:
- Loan product catalog (term, interest type, collateral type)
- Loan application + underwriting + approval workflow
- Loan disbursement (atomic with GL posting)
- Repayment schedule generation + tracking
- Interest accrual (daily) + late-fee accrual
- NPL classification per regulator's days-overdue threshold (auto-classification)
- ECL provisioning per IFRS 9 stages OR Mongolbank provisioning percentages
- Collection workflow (overdue → notice → restructure → write-off)
- Loan write-off + recovery accounting
- Credit bureau reporting (Mongolbank Зээлийн мэдээллийн сан / equivalent)

Module prefix: `LOAN`

## R4 Research basis (jurisdictional sources)

### Mongolia primary statutes

> **Source (SRC-NBFI-MN-2002):**
> Банк бус санхүүгийн үйл ажиллагааны тухай хууль
> (Non-Bank Financial Activities Law)
> State Great Khural of Mongolia, primary statute
> URL: https://legalinfo.mn/mn/detail?lawId=100262
> Retrieved: 2026-05-18

> **Source (SRC-MONEYLOAN-MN-2022):**
> Мөнгөн зээлийн үйл ажиллагааг зохицуулах тухай хууль
> (Law on Regulating Money Lending Activities)
> State Great Khural of Mongolia, primary statute
> Adopted: 2022-11-04; Effective: 2023-03-01
> URL: https://legalinfo.mn/mn/detail?lawId=16532149634331
> Retrieved: 2026-05-18

### Implementing regulations

> **Source (SRC-MONGOLBANK-ASSETCLASS):**
> Активыг ангилах, активын эрсдэлийн сан байгуулж, зарцуулах журам
> (Asset Classification and Loan Loss Provision Procedure)
> Issuing authority: Монголбанк (Mongolbank)
> Type: Implementing regulation (Resolution; latest amendment 2023-XX-XX — verify)
> URL: https://legalinfo.mn/mn/detail?lawId=14601
> Retrieved: 2026-05-18

> **Source (SRC-FRC-NBFIASSETCLASS):**
> Банк бус санхүүгийн байгууллагын активыг ангилах,
> активын эрсдэлийн сан байгуулж, зарцуулах журам
> (NBFI Asset Classification + Loan Loss Provision Procedure)
> Issuing authority: Санхүүгийн зохицуулах хороо (FRC)
> URL: https://legalinfo.mn/mn/detail/15794
> Retrieved: 2026-05-18

> **Source (SRC-FRC-MLPC-2024):**
> FRC Money Loan Activities Policy Council Decision
> (Interest cap 4.5%/month on consumer + pawnshop loans;
>  DTI limit 70% total debt service / income)
> Issuing authority: FRC Money Loan Activities Policy Council
> Date: 2024-03 (specific Resolution № TBD)
> URL: https://www.frc.mn (search "Мөнгөн зээлийн бодлогын зөвлөл")
> Retrieved: 2026-05-18

### International standard

> **Source (SRC-IFRS9):**
> IFRS 9 — Financial Instruments (Expected Credit Loss model)
> Issuing authority: IFRS Foundation
> Effective: 2018-01-01 (current version with amendments)
> URL: https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/
> Retrieved: 2026-05-18

## CLAUDE.md — Entry point

Production code: `<your-source>/Lending/*`

ADRs:
- **ADR-LOAN-001** — License classification: NBFI (FRC) vs Bank (Mongolbank). Different capital, prudential, and provisioning rules. This template focuses on NBFI; bank-specific extensions noted where they differ.
- **ADR-LOAN-002** — NPL classification: auto-classified per days-overdue using Mongolbank scheme (Хэвийн/Хяналтын/Чанаргүй) for NBFI scope. International deployment: adapt to local regulator's NPL definitions.
- **ADR-LOAN-003** — ECL provisioning: IFRS 9 3-stage model for accounting; Mongolbank-percentage method (0%/5%/25%+) for regulatory reporting. Both run; reconciled at month-end (IFRS 9 is more conservative; book MAX of both).
- **ADR-LOAN-004** — Interest accrual: DAILY using simple interest formula or amortized-cost (per loan product type); GL posting via outbox event to AccountingService.
- **ADR-LOAN-005** — Interest cap: enforced at loan-product configuration (max 4.5%/month for consumer + pawnshop per Mongolia FRC; configurable per jurisdiction).
- **ADR-LOAN-006** — DTI check: enforced at underwriting (max 70% per Mongolia FRC; configurable per jurisdiction).
- **ADR-LOAN-007** — Credit bureau reporting: integrated with Mongolbank Зээлийн мэдээллийн сан for loan registration + repayment events + classification changes.
- **ADR-LOAN-008** — Write-off: requires controller-role + ≥360 days overdue + collateral recovery exhausted; audit-trailed.

Cross-module deps:
- Upstream: `auth`, `customer`, `kyc-aml` (cannot lend without KYC TIER_FULL), `wallet-settlement` (disbursement + repayment via wallet), `accounting` (GL posting for every accrual + cash movement)
- Downstream: `regulatory-reporting` (Mongolbank credit bureau + FRC NPL report), `notification` (overdue notices, restructure offers), `risk-modeling` (PD/LGD/EAD estimation for IFRS 9 ECL)

Critical invariants:
- **INV-LOAN-01** — KYC tier ≥ FULL required before loan application accepted
- **INV-LOAN-02** — Interest rate ≤ regulatory cap (4.5%/month MN consumer; configurable)
- **INV-LOAN-03** — DTI ≤ 70% (Mongolia FRC; configurable per jurisdiction)
- **INV-LOAN-04** — NPL classification auto-updated daily based on days-overdue
- **INV-LOAN-05** — ECL recomputed monthly (IFRS 9) + regulatory provision recomputed daily (Mongolia)
- **INV-LOAN-06** — Loan disbursement atomic with GL journal posting
- **INV-LOAN-07** — Credit bureau reported within 5 business days of material event (per Mongolbank credit info regulation)
- **INV-LOAN-08** — Write-off requires controller-role + audit trail

## why.md

Goals:
- G-LOAN-01 — Compliant loan origination per FRC NBFI license (or equivalent in jurisdiction)
- G-LOAN-02 — Accurate interest + fee accrual (no float drift; daily basis)
- G-LOAN-03 — Auto NPL classification per days-overdue regulatory threshold (transparent + auditable)
- G-LOAN-04 — IFRS 9 ECL provisioning for accounting; Mongolia regulatory provisioning for FRC report
- G-LOAN-05 — Borrower protection (interest cap, DTI limit, disclosure, dispute resolution)

Business rules:
- BR-LOAN-01 — Minimum loan amount: per product config (e.g., 100,000 MNT)
- BR-LOAN-02 — Maximum loan amount: per KYC tier + DTI capacity + collateral coverage
- BR-LOAN-03 — Interest accrual: DAILY (simple OR amortized cost)
- BR-LOAN-04 — Repayment grace period: 0 days for initial classification "Normal"
- BR-LOAN-05 — Cooling-off: ≥3 calendar days for consumer loans (configurable per consumer protection rule)
- BR-LOAN-06 — Default: 15+ days overdue (per Mongolbank Хяналтын threshold)
- BR-LOAN-07 — NPL: 121+ days overdue (per Mongolbank Чанаргүй threshold)
- BR-LOAN-08 — Write-off: ≥360 days overdue + collection efforts exhausted + controller approval

Compliance drivers:
- Mongolia: NBFI Law (2002+) + Money Lending Regulation Law (2022) + Mongolbank Asset Classification Procedure + FRC NBFI Asset Classification Procedure + FRC Money Loan Policy Council
- International (IFRS-adopting jurisdictions): IFRS 9 ECL standard
- AML/KYC: inherits HW-KYC-* (cannot lend without verified customer)
- Banking jurisdictions: Basel III capital adequacy (out of scope for NBFI overlay)
- Consumer protection: per jurisdiction (Mongolia: built into Money Lending Reg Law)

Risks:
- R-LOAN-01 — Interest cap violation → FRC license risk; criminal liability for management
- R-LOAN-02 — DTI bypass for "VIP" customers → consumer-protection violation
- R-LOAN-03 — NPL classification stale → mis-stated regulatory provision → audit failure
- R-LOAN-04 — IFRS 9 ECL parameters (PD/LGD/EAD) outdated → financial statements wrong
- R-LOAN-05 — Credit bureau under-reporting → information asymmetry; regulator inquiry
- R-LOAN-06 — Write-off without proper audit trail → tax + regulatory issue
- R-LOAN-07 — Collateral revaluation stale → over- or under-provisioning

## what.md (entities + invariants)

### Loan
| Field | Type | Notes |
|-------|------|-------|
| id | BIGINT | PK |
| loan_number | VARCHAR(20) | Human readable; UNIQUE |
| customer_id | FK | INV-LOAN-01: KYC tier FULL required |
| product_id | FK | links to LoanProduct (terms + interest type) |
| principal_amount | NUMERIC(18,4) | original loan amount |
| principal_outstanding | NUMERIC(18,4) | current outstanding (derived OR cached + recon'd) |
| interest_rate_pct_monthly | NUMERIC(5,4) | per Mongolia FRC: ≤ 0.045 for consumer (INV-LOAN-02) |
| interest_type | ENUM(SIMPLE, AMORTIZED, REDUCING_BALANCE) | drives accrual algorithm |
| disbursement_date | DATE | day funds released |
| maturity_date | DATE | scheduled end |
| repayment_frequency | ENUM(WEEKLY, BIWEEKLY, MONTHLY, BULLET) | |
| status | ENUM(APPLICATION, UNDERWRITING, APPROVED, DISBURSED, ACTIVE, COMPLETED, NPL, WRITTEN_OFF) | |
| npl_classification | ENUM(NORMAL, WATCH, SUBSTANDARD, DOUBTFUL, BAD, LOSS) | auto-updated daily |
| npl_classified_at | TIMESTAMPTZ | last classification change |
| collateral_id | FK | optional |
| dti_at_origination | NUMERIC(5,4) | ≤ 0.70 per Mongolia FRC (INV-LOAN-03); historical snapshot |
| collateral_value_at_origination | NUMERIC(18,4) | historical snapshot |
| risk_grade_at_origination | VARCHAR(10) | A/B/C/D/E (for PD lookup) |
| created_by | FK > 0 | INV-LOAN-XX (no sentinels) |
| approved_by | FK | SoD: ≠ created_by per SOD-LOAN-01 |
| disbursed_by | FK | optional 6-eyes: ≠ approved_by |

### LoanProduct (configuration)
| Field | Type | Notes |
|-------|------|-------|
| id, name, loan_purpose ENUM(CONSUMER, BUSINESS, PAWNSHOP, AUTO, MORTGAGE, GROUP_LOAN), interest_type, max_interest_rate_monthly NUMERIC(5,4), min_amount, max_amount, min_term_days, max_term_days, requires_collateral BOOL, jurisdiction CHAR(3), is_active BOOL | | per-jurisdiction interest caps stored here |

### RepaymentSchedule
| Field | Type | Notes |
|-------|------|-------|
| id, loan_id (FK), seq INT, due_date DATE, principal_due NUMERIC(18,4), interest_due NUMERIC(18,4), late_fee_due NUMERIC(18,4), total_due NUMERIC(18,4), principal_paid, interest_paid, late_fee_paid, status ENUM(SCHEDULED, PAID, PARTIALLY_PAID, OVERDUE, WRITTEN_OFF), paid_at, paid_via_wallet_tx_id | | |

### LoanTransaction (every money movement on the loan)
| Field | Type | Notes |
|-------|------|-------|
| id, loan_id (FK), tx_type ENUM(DISBURSEMENT, REPAYMENT_PRINCIPAL, REPAYMENT_INTEREST, REPAYMENT_FEE, INTEREST_ACCRUAL, LATE_FEE_ACCRUAL, ECL_PROVISION, WRITE_OFF, RECOVERY, RESTRUCTURE), amount NUMERIC(18,4), journal_id (FK to GL), wallet_tx_id (FK optional), created_by FK CHECK>0, created_at, correlation_id | | atomic with GL post per INV-LOAN-06 |

### NPLClassificationHistory
| Field | Type | Notes |
|-------|------|-------|
| id, loan_id (FK), classification_from ENUM, classification_to ENUM, days_overdue_at_change INT, classified_at TIMESTAMPTZ, classified_by FK (system.npl-classifier OR controller), reason TEXT | | audit-trail |

### ECLCalculation (IFRS 9)
| Field | Type | Notes |
|-------|------|-------|
| id, loan_id (FK), calculation_date DATE, stage ENUM(1, 2, 3), pd_12month NUMERIC(7,6), pd_lifetime NUMERIC(7,6), lgd NUMERIC(5,4), ead NUMERIC(18,4), ecl_amount NUMERIC(18,4), forward_looking_adjustment NUMERIC(7,6), source ENUM(IFRS9_AUTOMATED, REGULATORY_AUTOMATED, MANUAL_OVERRIDE), source_reason TEXT, calculated_by FK | | monthly per INV-LOAN-05 |

### RegulatoryProvision (Mongolia Mongolbank/FRC method)
| Field | Type | Notes |
|-------|------|-------|
| id, loan_id (FK), calculation_date DATE, classification ENUM(NORMAL/WATCH/SUBSTANDARD/DOUBTFUL/BAD/LOSS), provision_pct NUMERIC(5,4), outstanding_at_calc NUMERIC(18,4), provision_amount NUMERIC(18,4), provision_minus_collateral NUMERIC(18,4), source ENUM(MONGOLBANK_NBFI, MONGOLBANK_BANK, FRC_NBFI, CUSTOM), calculated_at, calculated_by FK | | daily per INV-LOAN-05 |

### CreditBureauReport (Mongolbank Зээлийн мэдээллийн сан)
| Field | Type | Notes |
|-------|------|-------|
| id, loan_id (FK), event_type ENUM(NEW_LOAN, REPAYMENT, RESTRUCTURE, NPL_RECLASSIFY, WRITE_OFF, FULLY_PAID), payload JSONB, submitted_at TIMESTAMPTZ, ack_at TIMESTAMPTZ, bureau_reference VARCHAR, status ENUM(PENDING, SUBMITTED, ACK, REJECTED) | | INV-LOAN-07: within 5 business days |

### Key INVs (~20):

- **INV-LOAN-01** — KYC tier ≥ TIER_FULL required for loan application (inherits INV-KYC-01)
  Per Mongolia AML/CFT Law (KYC obligation) + NBFI Law general customer-identification req

- **INV-LOAN-02** — Interest rate ≤ regulatory cap
  > Per FRC Money Loan Policy Council 2024-03: max 4.5%/month on consumer + pawnshop loans (Mongolia)
  > Engineering: enforced at LoanProduct.max_interest_rate_monthly config; checked at loan-creation
  > Multi-jurisdiction: cap is per-jurisdiction config

- **INV-LOAN-03** — DTI ≤ 70% at origination
  > Per FRC Money Loan Policy Council 2024-03: total debt service / income ≤ 70% (Mongolia)
  > Engineering: underwriting service computes DTI from customer's other-loans + income; rejects if > 70%
  > Multi-jurisdiction: threshold per-jurisdiction

- **INV-LOAN-04** — NPL classification auto-updated DAILY based on days-overdue
  > Per Mongolbank Активыг ангилах журам:
  >   0-15 days  → Normal (Хэвийн)
  >   16-90 days → Watch (Хяналтын)
  >   91-180 days → Substandard
  >   181-360 days → Doubtful
  >   >360 days → Loss
  > (Note: 91-120 days bracket is sometimes "Watch-late"; verify current threshold)
  > Engineering: cron job daily 00:30 local; updates loan.npl_classification + NPLClassificationHistory
  > Auto-reclassify on repayment (e.g., NPL → Normal if fully cured)

- **INV-LOAN-05** — Provisioning recomputed: IFRS 9 ECL monthly + regulatory daily
  > IFRS 9: Stage 1 → 12-month ECL; Stage 2 (significant credit risk increase) → Lifetime ECL;
  >          Stage 3 (credit-impaired) → Lifetime ECL + interest on net carrying amount
  > Mongolia regulatory: Normal 0% / Watch 5% / NPL classifications 25%+ on outstanding minus collateral coverage
  > Engineering: separate jobs; reconciled at month-end; book MAX (IFRS more conservative usually)

- **INV-LOAN-06** — Loan disbursement atomic with GL journal posting
  > Per HW-GL-04 (atomic posting): single TX writes LoanTransaction + journal + outbox
  > GL pattern: DR Loan-Receivable / CR Cash-at-Bank

- **INV-LOAN-07** — Credit bureau reported within 5 business days of material event
  > Per Зээлийн мэдээллийн тухай хууль (Credit Information Law)
  > URL: https://legalinfo.mn/mn/detail/9175
  > Engineering: outbox event on new-loan / repayment / NPL-reclassify / write-off / fully-paid;
  >              CreditBureauReport row created; worker submits to Mongolbank ZEM within SLA

- **INV-LOAN-08** — Write-off requires controller role + ≥ 360 days overdue + collection exhausted
  > Engineering: writeOffLoan() service rejects if actor.role ≠ controller; checks days_overdue ≥ 360;
  >              requires CollectionEffortHistory with ≥ N attempts documented;
  >              audit-trailed with reason

- **INV-LOAN-09** — Daily interest accrual posted via GL outbox
  > Engineering: cron daily 01:00; for each ACTIVE loan: compute daily interest = principal_outstanding × rate / 365 (or per product day-count convention);
  > GL pattern: DR Interest-Receivable / CR Interest-Income

- **INV-LOAN-10** — Late fee accrual on overdue installments (per product config)
  > Engineering: cron daily 01:30; for each OVERDUE schedule: late_fee = overdue_amount × late_fee_rate × days_overdue;
  > GL pattern: DR Late-Fee-Receivable / CR Late-Fee-Income;
  > NOTE: Mongolia FRC interest cap may also cover late fee — verify (often counted toward 4.5% total cost)

- **INV-LOAN-11** — Cooling-off period: ≥ 3 calendar days for consumer loans (cancellation right)
  > Per consumer protection rule (built into Mongolia Money Lending Reg Law)
  > Engineering: loan.status = APPROVED until cooling_off_until + customer-confirm; can cancel without penalty

- **INV-LOAN-12** — Restructure changes NEVER alter original loan record; new RestructureEvent linked
  > Per audit-trail principle: original schedule immutable; restructured schedule replaces forward-looking

- **INV-LOAN-13** — Collateral revaluation at material events + periodic
  > Engineering: collateral.market_value updated quarterly OR on customer request OR on NPL classification change

- **INV-LOAN-14** — Sanctions screening on every loan disbursement
  > Inherits INV-KYC-06: even with verified customer, re-screen at disbursement time (sanctions can be added between KYC + disbursement)

- **INV-LOAN-15** — Operator identity captured (no sentinels)
  > Inherits INV-GL-07

- **INV-LOAN-16** — Audit log append-only on loan state changes
  > Inherits HW-GL-19

- **INV-LOAN-17** — Loan-related transactions retained 7y from loan closure
  > Per Mongolia AML Law Art. 14.2 + accounting record-keeping
  > Engineering: loan_transaction.retention_until = loan.closed_at + 7y (computed at closure)

- **INV-LOAN-18** — Disclosure of effective annual rate (APR) at loan signing
  > Per consumer protection: customer must see total cost in standardized format
  > Engineering: loan.apr_at_signing stored; customer-facing disclosure PDF generated + retained

- **INV-LOAN-19** — Inter-bank credit bureau check at underwriting (Mongolbank ZEM)
  > Engineering: underwriting service calls Mongolbank ZEM API for customer's outstanding loans across all lenders;
  > input to DTI calculation (INV-LOAN-03);
  > stale data > 24h → re-fetch

- **INV-LOAN-20** — NPL classification cannot improve except via cure (full repayment of arrears)
  > Engineering: classification can WORSEN (more days overdue); only IMPROVES via measurable cure event;
  > controller manual override allowed with audit-trail + reason

## how.md (algorithms)

### ALG-LOAN-APPLICATION-01 — Loan application
```
applyForLoan(customer_id, product_id, amount, term_days, collateral):
  ASSERT customer.kyc_tier >= TIER_FULL                    # INV-LOAN-01
  
  product := productRepo.find(product_id)
  ASSERT amount >= product.min_amount AND amount <= product.max_amount
  ASSERT term_days >= product.min_term_days AND term_days <= product.max_term_days
  
  # Interest cap check (INV-LOAN-02)
  ASSERT product.max_interest_rate_monthly <= jurisdiction_cap (e.g., 0.045 MN consumer)
  
  # DTI check (INV-LOAN-03)
  existing_debt := mongolbankZEMClient.getCustomerOutstandingLoans(customer_id)
  income := customerRepo.find(customer_id).declared_income
  total_debt_service := existing_debt.monthly_payments + estimated_payment_for_this_loan
  ASSERT total_debt_service / income <= 0.70   # Mongolia FRC threshold
  
  # Sanctions re-screening (INV-LOAN-14)
  sanctionsResult := sanctionsService.screen(customer.full_name, customer.dob)
  if sanctionsResult.HIT: THROW SanctionsHit
  
  # Generate repayment schedule
  schedule := generateRepaymentSchedule(amount, term_days, interest_rate, product.interest_type, product.repayment_frequency)
  
  loan := loanRepo.insert(
    status = APPLICATION,
    customer_id, product_id, principal_amount = amount, ...
    created_by = actor.id
  )
  
  scheduleRepo.bulkInsert(loan.id, schedule)
  
  auditLog.append(action = LOAN_APPLICATION, actor_id, ...)
  outbox.publish(LoanAppliedEvent(loan.id))
  
  return loan
```

### ALG-LOAN-DISBURSE-01 — Atomic disbursement + GL post
```
disburseLoan(loan_id, actor):
  loan := loanRepo.find(loan_id)
  ASSERT loan.status == APPROVED
  ASSERT actor.role IN (operator, controller)
  
  # SoD: disburser ≠ approver (SOD-LOAN-02)
  ASSERT actor.id != loan.approved_by
  
  # Cooling-off check (INV-LOAN-11)
  if loan.product.loan_purpose == CONSUMER:
    ASSERT NOW() >= loan.approved_at + 3 days
  
  # Sanctions re-screening at disbursement time
  sanctionsResult := sanctionsService.screen(...)
  if sanctionsResult.HIT: 
    customerFreezeService.freeze(loan.customer_id, reason="sanctions hit at disbursement")
    THROW
  
  # Atomic: LoanTransaction + GL journal + wallet credit (INV-LOAN-06)
  BEGIN TRANSACTION
    loanTx := loanTransactionRepo.insert(
      loan_id = loan.id,
      tx_type = DISBURSEMENT,
      amount = loan.principal_amount,
      created_by = actor.id,
      correlation_id
    )
    
    # GL: DR Loan-Receivable / CR Cash-at-Bank
    journal := accountingService.postJournal(
      type = REGULAR,
      lines = [
        Line(account = LOAN_RECEIVABLE_BY_PRODUCT, side = DEBIT, amount = loan.principal_amount),
        Line(account = CASH_AT_BANK, side = CREDIT, amount = loan.principal_amount)
      ],
      correlation_id
    )
    
    loanTx.journal_id = journal.id
    loan.status = DISBURSED
    loan.disbursement_date = TODAY()
    loan.disbursed_by = actor.id
    loanRepo.update(loan)
    
    # Credit wallet if disbursement to customer wallet
    if loan.disbursement_channel == WALLET:
      walletTx := walletService.creditWallet(
        customer.wallet_id, 
        amount = loan.principal_amount, 
        type = LOAN_DISBURSEMENT,
        correlation_id
      )
      loanTx.wallet_tx_id = walletTx.id
    
    auditLog.append(action = DISBURSE, ...)
    
    # Credit bureau report (within 5 business days per INV-LOAN-07)
    creditBureauReport.insert(
      loan_id = loan.id,
      event_type = NEW_LOAN,
      payload = serialize(loan),
      status = PENDING
    )
  COMMIT
  
  outbox.publish(LoanDisbursedEvent(loan.id))
  
  return loan
```

### ALG-LOAN-INTEREST-ACCRUAL-01 — Daily interest accrual
```
runDailyInterestAccrual(date):  # called by cron daily 01:00 local
  active_loans := loanRepo.findByStatus(ACTIVE)
  
  FOR loan IN active_loans:
    if loan.principal_outstanding <= 0: SKIP  # fully paid
    
    # Compute daily interest per product's interest_type + day-count convention
    if loan.product.interest_type == SIMPLE:
      daily_interest = loan.principal_outstanding * loan.interest_rate_pct_monthly * 12 / 365
    elif loan.product.interest_type == AMORTIZED:
      daily_interest = computeAmortizedInterestForDay(loan, date)
    elif loan.product.interest_type == REDUCING_BALANCE:
      daily_interest = loan.principal_outstanding * loan.interest_rate_pct_monthly * 12 / 360  # depends on day-count
    
    BEGIN TRANSACTION
      loanTx := loanTransactionRepo.insert(
        loan_id = loan.id,
        tx_type = INTEREST_ACCRUAL,
        amount = daily_interest,
        created_by = system.eod.id,
        correlation_id = batch_correlation_id
      )
      
      # GL: DR Interest-Receivable / CR Interest-Income
      journal := accountingService.postJournal(
        type = REGULAR,
        lines = [
          Line(INTEREST_RECEIVABLE_BY_PRODUCT, DEBIT, daily_interest),
          Line(INTEREST_INCOME_BY_PRODUCT, CREDIT, daily_interest)
        ],
        correlation_id
      )
      loanTx.journal_id = journal.id
    COMMIT
```

### ALG-LOAN-NPL-CLASSIFY-01 — Daily NPL auto-classification
```
runDailyNPLClassification(date):  # called by cron daily 00:30 local
  loans_with_overdue := loanRepo.findWithOverdueSchedule()
  
  FOR loan IN loans_with_overdue:
    days_overdue := computeMaxDaysOverdue(loan, as_of = date)
    new_class := classifyByDaysOverdue(days_overdue)
    
    # classifyByDaysOverdue (Mongolia Mongolbank scheme):
    #   0-15 → NORMAL
    #   16-90 → WATCH
    #   91-180 → SUBSTANDARD
    #   181-360 → DOUBTFUL
    #   >360 → LOSS
    # NOTE: per-jurisdiction config; this is the default for Mongolia
    
    if new_class != loan.npl_classification:
      # Per INV-LOAN-20: can only worsen, never improve except via cure
      if isWorseThan(new_class, loan.npl_classification):
        # Auto worsening
        BEGIN TRANSACTION
          NPLClassificationHistory.insert(
            loan_id = loan.id,
            classification_from = loan.npl_classification,
            classification_to = new_class,
            days_overdue_at_change = days_overdue,
            classified_at = NOW(),
            classified_by = system.npl-classifier.id,
            reason = "Auto-classification: " + days_overdue + " days overdue"
          )
          loan.npl_classification = new_class
          loan.npl_classified_at = NOW()
          if new_class IN (SUBSTANDARD, DOUBTFUL, BAD, LOSS):
            loan.status = NPL
          loanRepo.update(loan)
        COMMIT
        
        # Credit bureau report (within 5 business days)
        creditBureauReport.insert(loan_id, event_type = NPL_RECLASSIFY, ...)
        outbox.publish(LoanNPLReclassifiedEvent(loan.id, old_class, new_class))
      else:
        # New class is better — only via cure path (handled separately on repayment)
        SKIP  # don't auto-improve
```

### ALG-LOAN-CURE-01 — NPL → improved class on cure (full arrears repayment)
```
handleRepayment(loan_id, amount, actor):  # called by repayment workflow
  loan := loanRepo.find(loan_id)
  
  # Apply repayment (waterfall: late fee → interest → principal)
  remaining := amount
  for fee_overdue IN loan.overdue_late_fees:
    paid := min(remaining, fee_overdue)
    fee_overdue.amount -= paid; remaining -= paid; ...
  for int_overdue IN loan.overdue_interest:
    paid := min(remaining, int_overdue); ...
  for prin_overdue IN loan.overdue_principal:
    paid := min(remaining, prin_overdue); ...
  # ... etc.
  
  # GL posting (atomic; INV-LOAN-06)
  journal := accountingService.postJournal(
    type = REGULAR,
    lines = [
      Line(CASH_AT_BANK, DEBIT, amount),
      Line(LOAN_RECEIVABLE_BY_PRODUCT, CREDIT, principal_paid),
      Line(INTEREST_RECEIVABLE_BY_PRODUCT, CREDIT, interest_paid),
      Line(LATE_FEE_RECEIVABLE, CREDIT, late_fee_paid)
    ],
    correlation_id
  )
  
  # Cure check (INV-LOAN-20)
  days_overdue_after := computeMaxDaysOverdue(loan, after_repayment = true)
  if days_overdue_after == 0 AND loan.npl_classification != NORMAL:
    # Full cure → classify back to NORMAL
    NPLClassificationHistory.insert(
      from = loan.npl_classification, to = NORMAL,
      days_overdue_at_change = 0,
      classified_by = system.cure-detector.id,
      reason = "Cure: all overdue cleared by repayment"
    )
    loan.npl_classification = NORMAL
    loan.status = ACTIVE
    loanRepo.update(loan)
    creditBureauReport.insert(event_type = NPL_RECLASSIFY, ...)
```

### ALG-LOAN-ECL-IFRS9-01 — Monthly IFRS 9 ECL calculation
```
runMonthlyIFRS9ECL(month_end):  # called by cron month-end
  loans := loanRepo.findAllNotWrittenOff()
  
  FOR loan IN loans:
    # Stage determination
    if loan.npl_classification == NORMAL:
      stage := 1  # 12-month ECL
    elif loan.npl_classification == WATCH OR significantCreditRiskIncrease(loan):
      stage := 2  # Lifetime ECL
    elif loan.npl_classification IN (SUBSTANDARD, DOUBTFUL, BAD, LOSS):
      stage := 3  # Lifetime ECL + interest on net carrying
    
    # Fetch PD/LGD/EAD from risk-modeling module
    pd_12m := riskModel.getPD12Month(loan, loan.risk_grade_at_origination, current_macro)
    pd_lifetime := riskModel.getPDLifetime(loan, ...)
    lgd := riskModel.getLGD(loan, loan.collateral_value, recovery_rate)
    ead := loan.principal_outstanding + accrued_interest + undrawn_commitment
    
    # Forward-looking macro adjustment
    fla := riskModel.getForwardLookingAdjustment(current_macro_forecast)
    
    if stage == 1:
      ecl := pd_12m * lgd * ead * (1 + fla)
    else:  # stages 2 + 3
      ecl := pd_lifetime * lgd * ead * (1 + fla)
    
    ECLCalculation.insert(
      loan_id = loan.id,
      calculation_date = month_end,
      stage, pd_12month = pd_12m, pd_lifetime, lgd, ead, ecl_amount = ecl,
      forward_looking_adjustment = fla,
      source = IFRS9_AUTOMATED,
      calculated_by = system.ecl-engine.id
    )
    
    # Compare to current booked provision
    current_provision := loan.current_provision_amount
    delta := ecl - current_provision
    
    if abs(delta) > materiality:
      # Post GL adjustment
      if delta > 0:
        # Increase provision: DR ECL Expense / CR ECL Allowance
        journal = accountingService.postJournal(
          lines = [
            Line(ECL_EXPENSE_BY_PRODUCT, DEBIT, delta),
            Line(ECL_ALLOWANCE_BY_PRODUCT, CREDIT, delta)
          ],
          type = ADJUSTING
        )
      else:
        # Release provision (reversal)
        journal = accountingService.postJournal(
          lines = [
            Line(ECL_ALLOWANCE_BY_PRODUCT, DEBIT, -delta),
            Line(ECL_EXPENSE_BY_PRODUCT, CREDIT, -delta)
          ],
          type = ADJUSTING
        )
```

### ALG-LOAN-PROVISION-MN-01 — Daily Mongolia regulatory provisioning
```
runDailyMongoliaRegulatoryProvision(date):  # called daily 02:00
  loans := loanRepo.findAllNotWrittenOff()
  
  # Mongolia provisioning percentages (per Mongolbank Активыг ангилах журам;
  # NBFI equivalent per FRC regulation; verify current values):
  PROVISION_PCT = {
    NORMAL: 0.00,         # 0%
    WATCH: 0.05,          # 5%
    SUBSTANDARD: 0.25,    # 25%
    DOUBTFUL: 0.50,       # 50% (typical)
    BAD: 0.75,            # 75% (typical)
    LOSS: 1.00            # 100%
  }
  # WARNING: these percentages are illustrative — verify against current
  # Mongolbank journal AND FRC NBFI procedure. Banks vs NBFIs may differ.
  
  FOR loan IN loans:
    provision_pct := PROVISION_PCT[loan.npl_classification]
    
    # Collateral coverage reduces provision base
    coverage := computeCollateralCoverage(loan)
    provision_base := max(0, loan.principal_outstanding + accrued_interest - coverage)
    provision := provision_base * provision_pct
    
    RegulatoryProvision.insert(
      loan_id = loan.id,
      calculation_date = date,
      classification = loan.npl_classification,
      provision_pct,
      outstanding_at_calc = loan.principal_outstanding,
      provision_amount = provision,
      provision_minus_collateral = provision_base,
      source = MONGOLBANK_NBFI (or whichever applies),
      calculated_at = NOW(),
      calculated_by = system.reg-provision-calculator.id
    )
    
    # Note: regulatory provision used for FRC reporting; IFRS 9 ECL used for accounting
    # Book MAX in financial statements (conservatism principle)
```

### ALG-LOAN-WRITEOFF-01 — Write-off with controller approval
```
writeOffLoan(loan_id, actor, reason):
  loan := loanRepo.find(loan_id)
  
  # INV-LOAN-08 checks
  ASSERT actor.role == controller
  days_overdue := computeMaxDaysOverdue(loan)
  ASSERT days_overdue >= 360
  collection_attempts := collectionHistory.countForLoan(loan.id)
  ASSERT collection_attempts >= 3  # configurable
  ASSERT reason IS NOT NULL AND length(reason) >= 20
  
  BEGIN TRANSACTION
    # Remove from balance sheet; recognize loss
    write_off_amount := loan.principal_outstanding + accrued_interest
    
    journal := accountingService.postJournal(
      type = ADJUSTING,
      lines = [
        Line(ECL_ALLOWANCE, DEBIT, write_off_amount),  # use up allowance
        Line(LOAN_RECEIVABLE, CREDIT, principal_outstanding),
        Line(INTEREST_RECEIVABLE, CREDIT, accrued_interest)
      ]
    )
    
    loanTx := loanTransactionRepo.insert(
      loan_id, tx_type = WRITE_OFF, amount = write_off_amount,
      journal_id = journal.id, created_by = actor.id
    )
    
    loan.status = WRITTEN_OFF
    loan.written_off_at = NOW()
    loan.written_off_by = actor.id
    loan.write_off_reason = reason
    loanRepo.update(loan)
    
    auditLog.append(action = WRITE_OFF, actor_id, reason, ...)
    
    # Credit bureau report
    creditBureauReport.insert(loan_id, event_type = WRITE_OFF, ...)
  COMMIT
  
  # Note: written-off loans still tracked for potential RECOVERY (separate journal: DR Cash / CR Recovery-Income)
```

## who.md (actors + SoD)

| Actor | Can do |
|-------|--------|
| Customer | Apply for loan; view own; request restructure |
| Loan Officer (operator) | Underwrite + approve up to threshold |
| Senior Approver | Approve above threshold; cannot approve own |
| Disburser (operator) | Disburse approved loans; ≠ approver (SoD) |
| Collections (operator) | Manage overdue + collection attempts; cannot write off |
| Controller | Write-off; manual NPL override (with audit); restructure approval |
| Compliance Officer | View all loans; freeze loan; AML/sanctions oversight |
| Auditor (RO) | Read all loan + GL data; zero write |
| System: `system.npl-classifier`, `system.eod`, `system.ecl-engine`, `system.cure-detector`, `system.reg-provision-calculator` | Automated jobs |

SoD:
- SOD-LOAN-01 — Loan approver ≠ application creator (4-eyes underwriting)
- SOD-LOAN-02 — Disburser ≠ approver (4-eyes)
- SOD-LOAN-03 — Write-off actor ≠ original approver (independent verification)
- SOD-LOAN-04 — Restructure approver ≠ collections officer who proposed (avoids forbearance abuse)
- SOD-LOAN-05 — NPL manual override: actor ≠ loan_officer who originated

## when.md (timing)

- Application response: ≤ 24h for standard products; up to 7d for collateral-backed
- Cooling-off (consumer): ≥ 3 calendar days (BR-LOAN-05)
- Daily NPL classification job: 00:30 local
- Daily interest accrual job: 01:00 local
- Daily late-fee accrual job: 01:30 local
- Daily regulatory provision: 02:00 local
- Monthly IFRS 9 ECL: month-end + 1 business day
- Credit bureau report SLA: 5 business days from material event (INV-LOAN-07)
- Sanctions re-screen at disbursement: synchronous in flow
- Holiday calendar honored for all SLAs

## where.md § 5 — Tech Stack

(See ../general-ledger/where.md § 5 for shape; module-specific additions:)

- Mongolbank ZEM credit bureau API integration (Зээлийн мэдээллийн сан)
- Risk-model service (PD/LGD/EAD estimation) — typically separate ML service
- Document storage for: loan agreement, disclosure PDF, collateral docs (encrypted)
- Late-fee + interest calculation precise to NUMERIC(18,4); never float

## gravity.md (HW-LOAN-*)

- HW-LOAN-01 — Interest cap configurable per jurisdiction; enforced at LoanProduct creation
- HW-LOAN-02 — DTI threshold configurable per jurisdiction; enforced at underwriting
- HW-LOAN-03 — NPL classification algorithm configurable per jurisdiction (Mongolia thresholds default)
- HW-LOAN-04 — Disbursement atomic with GL + wallet (inherits HW-GL-04)
- HW-LOAN-05 — Audit log append-only (inherits HW-GL-19)
- HW-LOAN-06 — Operator identity no sentinels (inherits HW-GL-06)
- HW-LOAN-07 — Retention 7y on loan + transaction records (inherits HW-FIN-22)
- HW-LOAN-08 — Credit bureau reporting within SLA (INV-LOAN-07)
- HW-LOAN-09 — Cure path is ONLY way classification improves (INV-LOAN-20)
- HW-LOAN-10 — Both IFRS 9 + regulatory provision run; financial statements book MAX

## gaps.md (pre-seeded R4 follow-ups)

- Gap-LOAN-R4-01 — Verify current Mongolbank провенсион percentages (5 categories, 91-180/181-360/>360 day brackets); pilot used illustrative values
- Gap-LOAN-R4-02 — Verify exact FRC interest cap currency (consumer vs business loans different?)
- Gap-LOAN-R4-03 — Late fee cap: is it included in 4.5%/month total cost limit?
- Gap-LOAN-R4-04 — Mongolbank ZEM API spec needs confirmation
- Gap-LOAN-R4-05 — IFRS 9 SICR (significant credit risk increase) criteria need formal documentation
- Gap-LOAN-R4-06 — Cooling-off period: 3 days assumed; verify against Money Lending Reg Law
- Gap-LOAN-R4-07 — Recovery accounting: written-off loans recovered after how long? Tax-recognized recovery rules

## glossary.md — Module-specific terms

**APR** — Annual Percentage Rate. Effective annual cost of loan including all fees + compounding.

**Чанаргүй зээл (NPL)** — Non-Performing Loan. Mongolbank Чанаргүй classification: >121 days overdue.

**Cooling-off period** — Consumer's right to cancel a loan without penalty within N days of signing.

**DTI** — Debt-to-Income ratio. Total monthly debt service / monthly gross income. Mongolia FRC: ≤ 70%.

**ECL** — Expected Credit Loss (IFRS 9). Forward-looking loss estimate; replaces incurred-loss model.

**Forward-looking adjustment (FLA)** — Macro-economic adjustment to PD/LGD in IFRS 9 ECL.

**Хяналтын зээл (Watch)** — Mongolbank Хяналтын classification: 16-90 days overdue.

**Хэвийн зээл (Normal)** — Mongolbank Хэвийн classification: 0-15 days overdue.

**Loan-to-Value (LTV)** — Loan amount / collateral value. Used in collateral coverage calculation.

**LGD** — Loss Given Default. Fraction of EAD not recovered when borrower defaults (after collateral realization + recovery).

**Money Lending Reg Law** — Mongolia Мөнгөн зээлийн үйл ажиллагааг зохицуулах тухай хууль (2022; effective 2023-03-01).

**NBFI** — Non-Bank Financial Institution. Mongolia: FRC-licensed; cannot take public deposits.

**PD** — Probability of Default. Likelihood borrower defaults within time horizon (12-month or lifetime).

**Provisioning** — Setting aside expected loss; reduces reported net income + balance-sheet asset.

**Restructure** — Modification of loan terms (rate, term, schedule); creates audit-trailed event; original record immutable.

**SCC** — Savings and Loan Cooperative. Mongolia: 170 in country; serve low-income + rural; separate FRC license.

**SICR** — Significant Credit Risk Increase (IFRS 9 trigger from Stage 1 → Stage 2).

**Stage 1 / 2 / 3** — IFRS 9 ECL stages. Stage 1: 12-month ECL on performing. Stage 2: Lifetime ECL on credit-risk-increased. Stage 3: Lifetime ECL + net carrying interest on credit-impaired.

**Underwriting** — Process of assessing credit risk + deciding to approve/reject loan.

**Write-off** — Accounting recognition that loan is uncollectible; removed from balance sheet (still tracked for recovery).

**Зээлийн мэдээллийн сан (ZEM)** — Mongolia credit bureau under Mongolbank.

## Cross-references

- `../general-ledger/MODULE-OVERVIEW.md` — GL postings backing every loan transaction
- `../wallet-settlement/MODULE-OVERVIEW.md` — disbursement + repayment via wallet
- `../kyc-aml/MODULE-OVERVIEW.md` — KYC TIER_FULL + sanctions screening prerequisite
- `../../principles/accounting-principles.md` — double-entry framework
- `../../principles/regulatory-compliance.md` — 7 universal compliance pillars
- `../../principles/financial-invariants-catalog.md` — INV-FIN-* base patterns
- `../../research/examples/04-mongolia-lending-research.md` — full R4 research session that produced this module
