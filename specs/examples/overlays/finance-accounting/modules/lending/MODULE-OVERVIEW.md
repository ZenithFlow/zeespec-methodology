---
module: lending
type: module-overview
overlay: finance-accounting
version: 0.2.0
status: experimental (R4-researched 2026-05-18; condensed 2026-06-10)
last_updated: 2026-06-10
based_on_research:
  - SRC-NBFI-MN-2002 (Банк бус санхүүгийн үйл ажиллагааны тухай хууль)
  - SRC-MONEYLOAN-MN-2022 (Мөнгөн зээлийн үйл ажиллагааг зохицуулах тухай хууль)
  - SRC-MONGOLBANK-ASSETCLASS (Активыг ангилах журам)
  - SRC-FRC-MLPC-2024 (Money Loan Policy Council interest cap)
  - IFRS 9 (Expected Credit Loss)
---

# Lending — Module Overview

> Condensed reference for a lending / loan-management module: origination, repayment scheduling, interest accrual, NPL classification, ECL provisioning, collection workflow. Researched for **Mongolia NBFI** licensing context (FRC + Mongolbank) and cross-mapped to **IFRS 9 ECL** so the same module shape applies internationally with per-jurisdiction NPL threshold adjustments. Full R4 research session, source quotes, and regulatory background: `../../research-examples/04-mongolia-lending-research.md`.

## Module purpose

The **Lending** module manages: loan product catalog; application + underwriting + approval; disbursement (atomic with GL posting); repayment schedule generation + tracking; daily interest + late-fee accrual; auto NPL classification per days-overdue; ECL provisioning (IFRS 9 stages AND Mongolbank percentages); collection workflow (overdue → notice → restructure → write-off); write-off + recovery accounting; credit bureau reporting (Mongolbank ZEM / equivalent).

Module prefix: `LOAN`

## R4 Research basis (jurisdictional sources)

Full citation blocks with quotes + retrieval dates: `../../research-examples/04-mongolia-lending-research.md`.

| Source ID | What | Authority | URL |
|-----------|------|-----------|-----|
| SRC-NBFI-MN-2002 | Non-Bank Financial Activities Law | State Great Khural | legalinfo.mn/mn/detail?lawId=100262 |
| SRC-MONEYLOAN-MN-2022 | Money Lending Regulation Law (eff. 2023-03-01) | State Great Khural | legalinfo.mn/mn/detail?lawId=16532149634331 |
| SRC-MONGOLBANK-ASSETCLASS | Asset Classification + Loan Loss Provision Procedure | Монголбанк | legalinfo.mn/mn/detail?lawId=14601 |
| SRC-FRC-NBFIASSETCLASS | NBFI Asset Classification + Provision Procedure | FRC | legalinfo.mn/mn/detail/15794 |
| SRC-FRC-MLPC-2024 | Interest cap 4.5%/mo consumer+pawnshop; DTI ≤70% | FRC Money Loan Policy Council (2024-03) | frc.mn |
| SRC-IFRS9 | IFRS 9 Financial Instruments (ECL model) | IFRS Foundation | ifrs.org |

## CLAUDE.md — Entry point

Production code: `<your-source>/Lending/*`

ADRs:
- **ADR-LOAN-001** — License classification: NBFI (FRC) vs Bank (Mongolbank). This template focuses on NBFI; bank extensions noted where they differ.
- **ADR-LOAN-002** — NPL classification: auto per days-overdue, Mongolbank scheme for NBFI; adapt thresholds per jurisdiction.
- **ADR-LOAN-003** — ECL: IFRS 9 3-stage model for accounting + Mongolbank-percentage method for regulatory reporting. Both run; reconciled month-end; book MAX of both.
- **ADR-LOAN-004** — Interest accrual: DAILY (simple or amortized-cost per product); GL posting via outbox to AccountingService.
- **ADR-LOAN-005** — Interest cap enforced at loan-product config (4.5%/mo MN consumer+pawnshop; per-jurisdiction config).
- **ADR-LOAN-006** — DTI check at underwriting (70% MN; per-jurisdiction config).
- **ADR-LOAN-007** — Credit bureau integration (Mongolbank ZEM): loan registration + repayment + classification changes.
- **ADR-LOAN-008** — Write-off: controller-role + ≥360 days overdue + collateral recovery exhausted; audit-trailed.

Cross-module deps:
- Upstream: `auth`, `customer`, `kyc-aml` (no lending without KYC TIER_FULL), `wallet-settlement` (disburse/repay via wallet), `accounting` (GL post for every accrual + cash movement)
- Downstream: `regulatory-reporting` (credit bureau + FRC NPL report), `notification` (overdue notices), `risk-modeling` (PD/LGD/EAD for IFRS 9 ECL)

Critical invariants: INV-LOAN-01..08 (see what.md below).

## why.md

Goals:
- G-LOAN-01 — Compliant origination per FRC NBFI license (or jurisdiction equivalent)
- G-LOAN-02 — Accurate interest + fee accrual (no float drift; daily basis)
- G-LOAN-03 — Auto NPL classification per regulatory threshold (transparent + auditable)
- G-LOAN-04 — IFRS 9 ECL for accounting; Mongolia regulatory provisioning for FRC report
- G-LOAN-05 — Borrower protection (interest cap, DTI limit, disclosure, dispute resolution)

Business rules:
- BR-LOAN-01 — Min loan amount: per product config (e.g., 100,000 MNT)
- BR-LOAN-02 — Max loan amount: per KYC tier + DTI capacity + collateral coverage
- BR-LOAN-03 — Interest accrual: DAILY (simple OR amortized cost)
- BR-LOAN-04 — Grace period: 0 days for initial classification "Normal"
- BR-LOAN-05 — Cooling-off: ≥3 calendar days for consumer loans
- BR-LOAN-06 — Default: 15+ days overdue (Mongolbank Хяналтын threshold)
- BR-LOAN-07 — NPL: 121+ days overdue (Mongolbank Чанаргүй threshold)
- BR-LOAN-08 — Write-off: ≥360 days overdue + collection exhausted + controller approval

Compliance drivers: Mongolia NBFI Law + Money Lending Reg Law + Mongolbank/FRC asset classification procedures + FRC MLPC; IFRS 9 internationally; AML/KYC inherits HW-KYC-*; Basel III out of scope for NBFI overlay. Universal pillars: `../../principles/regulatory-compliance.md`.

Risks (one line each): R-LOAN-01 interest-cap violation → license risk; R-LOAN-02 DTI bypass for "VIP" → consumer-protection violation; R-LOAN-03 stale NPL classification → mis-stated provision; R-LOAN-04 outdated PD/LGD/EAD → wrong financial statements; R-LOAN-05 credit bureau under-reporting → regulator inquiry; R-LOAN-06 write-off without audit trail → tax + regulatory issue; R-LOAN-07 stale collateral revaluation → over/under-provisioning.

## what.md (entities + invariants)

### Entities

| Entity | Role | Key fields / constraints |
|--------|------|--------------------------|
| Loan | Core contract | loan_number UNIQUE; principal_amount/outstanding NUMERIC(18,4); interest_rate_pct_monthly ≤ cap (INV-LOAN-02); interest_type ENUM(SIMPLE, AMORTIZED, REDUCING_BALANCE); status ENUM(APPLICATION, UNDERWRITING, APPROVED, DISBURSED, ACTIVE, COMPLETED, NPL, WRITTEN_OFF); npl_classification ENUM(NORMAL, WATCH, SUBSTANDARD, DOUBTFUL, BAD, LOSS); dti_at_origination ≤ 0.70 (INV-LOAN-03); created_by/approved_by/disbursed_by FK >0 with SoD |
| LoanProduct | Per-product + per-jurisdiction config | loan_purpose ENUM(CONSUMER, BUSINESS, PAWNSHOP, AUTO, MORTGAGE, GROUP_LOAN); max_interest_rate_monthly; min/max amount + term; requires_collateral; jurisdiction |
| RepaymentSchedule | Installment plan | seq, due_date, principal/interest/late_fee due+paid; status ENUM(SCHEDULED, PAID, PARTIALLY_PAID, OVERDUE, WRITTEN_OFF); paid_via_wallet_tx_id |
| LoanTransaction | Every money movement | tx_type ENUM(DISBURSEMENT, REPAYMENT_*, INTEREST_ACCRUAL, LATE_FEE_ACCRUAL, ECL_PROVISION, WRITE_OFF, RECOVERY, RESTRUCTURE); journal_id FK to GL — atomic per INV-LOAN-06; correlation_id |
| NPLClassificationHistory | Classification audit trail | from/to, days_overdue_at_change, classified_by (system or controller), reason |
| ECLCalculation | IFRS 9 monthly result | stage ENUM(1,2,3); pd_12month, pd_lifetime, lgd, ead, ecl_amount, forward_looking_adjustment; source ENUM(IFRS9_AUTOMATED, REGULATORY_AUTOMATED, MANUAL_OVERRIDE) |
| RegulatoryProvision | Mongolia daily provision | classification, provision_pct, provision_minus_collateral; source ENUM(MONGOLBANK_NBFI, MONGOLBANK_BANK, FRC_NBFI, CUSTOM) |
| CreditBureauReport | ZEM submission queue | event_type ENUM(NEW_LOAN, REPAYMENT, RESTRUCTURE, NPL_RECLASSIFY, WRITE_OFF, FULLY_PAID); status ENUM(PENDING, SUBMITTED, ACK, REJECTED) — SLA per INV-LOAN-07 |

All money NUMERIC(18,4); never float. Identity/audit columns per `../../principles/financial-invariants-catalog.md`.

### Critical invariants (P0/P1)

- **INV-LOAN-01** — KYC tier ≥ TIER_FULL required for loan application (inherits INV-KYC-01). Per Mongolia AML/CFT Law + NBFI Law customer-identification.
- **INV-LOAN-02** — Interest rate ≤ regulatory cap. Per SRC-FRC-MLPC-2024: max 4.5%/month consumer + pawnshop (Mongolia). Enforced at LoanProduct config + checked at loan creation; cap is per-jurisdiction config.
- **INV-LOAN-03** — DTI ≤ 70% at origination. Per SRC-FRC-MLPC-2024. Underwriting computes DTI from other-loans (via ZEM, INV-LOAN-19) + income; rejects above threshold; per-jurisdiction config.
- **INV-LOAN-04** — NPL classification auto-updated DAILY based on days-overdue (Mongolbank scheme; table below). Cron daily 00:30; writes NPLClassificationHistory; auto-reclassify on cure.
- **INV-LOAN-05** — Provisioning recomputed: IFRS 9 ECL monthly + Mongolia regulatory daily. Separate jobs; reconciled month-end; book MAX (per ADR-LOAN-003).
- **INV-LOAN-06** — Loan disbursement atomic with GL journal posting (inherits HW-GL-04). GL: DR Loan-Receivable / CR Cash-at-Bank.
- **INV-LOAN-07** — Credit bureau reported within 5 business days of material event. Per Зээлийн мэдээллийн тухай хууль (legalinfo.mn/mn/detail/9175). Outbox event → CreditBureauReport row → worker submits to ZEM within SLA.
- **INV-LOAN-08** — Write-off requires controller role + ≥360 days overdue + documented collection attempts; audit-trailed with reason.

NPL classification state table (Mongolbank default; per-jurisdiction config; verify brackets — Gap-LOAN-R4-01):

| Days overdue | Classification |
|--------------|----------------|
| 0–15 | NORMAL (Хэвийн) |
| 16–90 | WATCH (Хяналтын) |
| 91–180 | SUBSTANDARD |
| 181–360 | DOUBTFUL |
| >360 | LOSS |

### Supporting invariants

| ID | Rule | Source / inherits |
|----|------|-------------------|
| INV-LOAN-09 | Daily interest accrual posted via GL outbox (DR Interest-Receivable / CR Interest-Income); rate/365 or per day-count convention | ADR-LOAN-004 |
| INV-LOAN-10 | Late-fee accrual on overdue installments per product config; may count toward 4.5% total-cost cap — verify | Gap-LOAN-R4-03 |
| INV-LOAN-11 | Cooling-off ≥3 calendar days for consumer loans; cancel without penalty | Money Lending Reg Law; Gap-LOAN-R4-06 |
| INV-LOAN-12 | Restructure never alters original loan record; new RestructureEvent linked; original schedule immutable | audit-trail principle |
| INV-LOAN-13 | Collateral revaluation quarterly + on material events (e.g., NPL change) | R-LOAN-07 |
| INV-LOAN-14 | Sanctions re-screening on every disbursement | inherits INV-KYC-06 |
| INV-LOAN-15 | Operator identity captured, no sentinels | inherits INV-GL-07 |
| INV-LOAN-16 | Audit log append-only on loan state changes | inherits HW-GL-19 |
| INV-LOAN-17 | Loan transactions retained 7y from loan closure | Mongolia AML Law Art. 14.2 |
| INV-LOAN-18 | APR disclosure at signing; disclosure PDF generated + retained | consumer protection |
| INV-LOAN-19 | Credit bureau (ZEM) check at underwriting; stale >24h → re-fetch; feeds INV-LOAN-03 | Gap-LOAN-R4-04 |
| INV-LOAN-20 | NPL classification can only worsen automatically; improves ONLY via cure (full arrears repayment) or controller override with audit trail | HW-LOAN-09 |

## how.md (algorithms — summaries)

Full pseudocode lives in the authored module's how.md; key checks and GL patterns:

| Algorithm | Trigger | Key checks / GL pattern |
|-----------|---------|-------------------------|
| ALG-LOAN-APPLICATION-01 | Customer applies | INV-LOAN-01 KYC; product min/max; INV-LOAN-02 cap; INV-LOAN-03 DTI (ZEM fetch per INV-LOAN-19); INV-LOAN-14 sanctions; generate schedule; outbox LoanAppliedEvent |
| ALG-LOAN-DISBURSE-01 | Operator disburses APPROVED loan | SOD-LOAN-02 disburser ≠ approver; INV-LOAN-11 cooling-off elapsed; sanctions re-screen (hit → freeze); single TX: LoanTransaction + journal (DR Loan-Receivable / CR Cash-at-Bank) + optional wallet credit + CreditBureauReport(NEW_LOAN) |
| ALG-LOAN-INTEREST-ACCRUAL-01 | Cron daily 01:00 | Per ACTIVE loan: daily interest per interest_type + day-count; DR Interest-Receivable / CR Interest-Income |
| ALG-LOAN-NPL-CLASSIFY-01 | Cron daily 00:30 | classifyByDaysOverdue per state table above; worsen-only (INV-LOAN-20); history row + CreditBureauReport(NPL_RECLASSIFY) on change; SUBSTANDARD+ → loan.status = NPL |
| ALG-LOAN-CURE-01 | On repayment | Waterfall: late fee → interest → principal; GL: DR Cash / CR receivables by type; if arrears fully cleared → reclassify to NORMAL via cure path + bureau report |
| ALG-LOAN-ECL-IFRS9-01 | Cron month-end | Stage: NORMAL→1 (12-mo ECL); WATCH or SICR→2; SUBSTANDARD+→3 (lifetime ECL); ECL = PD × LGD × EAD × (1+FLA) from risk-modeling; delta > materiality → DR ECL-Expense / CR ECL-Allowance (or reversal) |
| ALG-LOAN-PROVISION-MN-01 | Cron daily 02:00 | provision = (outstanding + accrued interest − collateral coverage) × pct per classification (table below); used for FRC reporting; statements book MAX vs IFRS 9 |
| ALG-LOAN-WRITEOFF-01 | Controller action | INV-LOAN-08 checks (role, ≥360d, ≥3 documented attempts, reason ≥20 chars); GL: DR ECL-Allowance / CR Loan- + Interest-Receivable; bureau report; recovery later: DR Cash / CR Recovery-Income |

Mongolia regulatory provision percentages (illustrative — verify current Mongolbank + FRC NBFI values, Gap-LOAN-R4-01):

| Classification | Provision % |
|----------------|-------------|
| NORMAL | 0% |
| WATCH | 5% |
| SUBSTANDARD | 25% |
| DOUBTFUL | 50% (typical) |
| BAD | 75% (typical) |
| LOSS | 100% |

## who.md (actors + SoD)

| Actor | Can do |
|-------|--------|
| Customer | Apply; view own; request restructure |
| Loan Officer (operator) | Underwrite + approve up to threshold |
| Senior Approver | Approve above threshold; cannot approve own |
| Disburser (operator) | Disburse approved loans; ≠ approver |
| Collections (operator) | Manage overdue + collection attempts; cannot write off |
| Controller | Write-off; manual NPL override (audited); restructure approval |
| Compliance Officer | View all; freeze loan; AML/sanctions oversight |
| Auditor (RO) | Read all loan + GL data; zero write |
| System actors | `system.npl-classifier`, `system.eod`, `system.ecl-engine`, `system.cure-detector`, `system.reg-provision-calculator` |

SoD:
- SOD-LOAN-01 — Approver ≠ application creator (4-eyes underwriting)
- SOD-LOAN-02 — Disburser ≠ approver
- SOD-LOAN-03 — Write-off actor ≠ original approver
- SOD-LOAN-04 — Restructure approver ≠ proposing collections officer
- SOD-LOAN-05 — NPL manual override actor ≠ originating loan officer

## when.md (timing)

- Application response: ≤24h standard; up to 7d collateral-backed
- Cooling-off (consumer): ≥3 calendar days (BR-LOAN-05)
- Daily jobs: NPL classification 00:30 → interest accrual 01:00 → late fees 01:30 → regulatory provision 02:00 (local)
- Monthly IFRS 9 ECL: month-end + 1 business day
- Credit bureau SLA: 5 business days from material event (INV-LOAN-07)
- Sanctions re-screen at disbursement: synchronous
- Holiday calendar honored for all SLAs

## where.md § 5 — Tech Stack

See `../general-ledger/where.md § 5` for shape. Module-specific: Mongolbank ZEM credit bureau API; risk-model service (PD/LGD/EAD, typically separate ML service); encrypted document storage (loan agreement, disclosure PDF, collateral docs); all money math NUMERIC(18,4), never float.

## gravity.md (HW-LOAN-*)

- HW-LOAN-01 — Interest cap per-jurisdiction config; enforced at LoanProduct creation
- HW-LOAN-02 — DTI threshold per-jurisdiction config; enforced at underwriting
- HW-LOAN-03 — NPL classification algorithm per-jurisdiction config (Mongolia default)
- HW-LOAN-04 — Disbursement atomic with GL + wallet (inherits HW-GL-04)
- HW-LOAN-05 — Audit log append-only (inherits HW-GL-19)
- HW-LOAN-06 — Operator identity no sentinels (inherits HW-GL-06)
- HW-LOAN-07 — Retention 7y on loan + transaction records (inherits HW-FIN-22)
- HW-LOAN-08 — Credit bureau reporting within SLA (INV-LOAN-07)
- HW-LOAN-09 — Cure path is ONLY way classification improves (INV-LOAN-20)
- HW-LOAN-10 — Both IFRS 9 + regulatory provision run; statements book MAX

## gaps.md (pre-seeded R4 follow-ups)

- Gap-LOAN-R4-01 — Verify current Mongolbank provision percentages + day brackets; pilot used illustrative values
- Gap-LOAN-R4-02 — Verify exact FRC interest cap scope (consumer vs business loans different?)
- Gap-LOAN-R4-03 — Late fee cap: included in 4.5%/month total cost limit?
- Gap-LOAN-R4-04 — Mongolbank ZEM API spec needs confirmation
- Gap-LOAN-R4-05 — IFRS 9 SICR criteria need formal documentation
- Gap-LOAN-R4-06 — Cooling-off 3 days assumed; verify against Money Lending Reg Law
- Gap-LOAN-R4-07 — Recovery accounting: timing + tax-recognized recovery rules

## glossary.md — Module-specific terms

General finance terms: `../../glossary/finance-glossary.md`. Module-specific:

| Term | Meaning |
|------|---------|
| DTI | Total monthly debt service / gross income; Mongolia FRC ≤70% |
| ECL / PD / LGD / EAD | IFRS 9 Expected Credit Loss = PD × LGD × EAD (+ forward-looking adjustment, FLA) |
| SICR | Significant Credit Risk Increase — IFRS 9 Stage 1 → 2 trigger |
| Stage 1/2/3 | IFRS 9: 12-mo ECL performing / lifetime ECL risk-increased / lifetime ECL credit-impaired |
| Хэвийн / Хяналтын / Чанаргүй | Mongolbank Normal (0–15d) / Watch (16–90d) / NPL (>121d) classifications |
| ZEM (Зээлийн мэдээллийн сан) | Mongolia credit bureau under Mongolbank |
| NBFI | Non-Bank Financial Institution; FRC-licensed; no public deposits |
| Cooling-off | Consumer right to cancel without penalty within N days of signing |
| Restructure | Term modification via audit-trailed event; original record immutable |
| Write-off | Loan recognized uncollectible; off balance sheet; still tracked for recovery |
| APR | Effective annual cost incl. all fees + compounding; disclosed per INV-LOAN-18 |

## Cross-references

- `../general-ledger/CLAUDE.md` — GL postings backing every loan transaction (full 10-file spec)
- `../wallet-settlement/MODULE-OVERVIEW.md` — disbursement + repayment via wallet
- `../kyc-aml/MODULE-OVERVIEW.md` — KYC TIER_FULL + sanctions screening prerequisite
- `../../principles/accounting-principles.md` — double-entry framework
- `../../principles/regulatory-compliance.md` — 7 universal compliance pillars
- `../../principles/financial-invariants-catalog.md` — INV-FIN-* base patterns
- `../../research-examples/04-mongolia-lending-research.md` — full R4 research session that produced this module
