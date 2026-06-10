---
doc: examples/overlays/finance-accounting/research-examples/04-mongolia-lending-research
type: research-worked-example
overlay: finance-accounting
example_topic: Mongolia lending regulation (NBFI + interest cap + NPL classification + IFRS 9 ECL)
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Worked Example 4 — Mongolia Lending Regulation R4 Research

> Full worked example: a spec author needs to author the `lending` ZeeSpec module for a Mongolian NBFI (non-bank financial institution). Applies the 6-phase R4 workflow → discovers 5 primary sources, 20+ INV/HW citation blocks, and outputs the `modules/lending/MODULE-OVERVIEW.md` content. End-to-end: ~3 hours of research.

## Context

- **Project:** Mongolia NBFI (non-bank financial institution) offering consumer + business loans
- **Module being authored:** Lending (loan origination + servicing + NPL + provisioning)
- **Spec author:** [name], engineer
- **Reviewer:** [name], compliance officer
- **Date:** 2026-05-18

## Phase 1 — Scope (30 min)

### Research questions

1. Q1: What's the legal framework for NBFI lending in Mongolia?
2. Q2: What's the difference between NBFI (FRC) vs Bank (Mongolbank) regulation?
3. Q3: What's the maximum interest rate cap?
4. Q4: What's the DTI (debt-to-income) limit?
5. Q5: What are the NPL (non-performing loan) classification categories + days-overdue thresholds?
6. Q6: What are the regulatory provisioning percentages per classification?
7. Q7: Is IFRS 9 ECL mandatory for NBFIs OR only for banks?
8. Q8: What's the credit bureau reporting obligation? To which authority?
9. Q9: What's the cooling-off period for consumer loans?
10. Q10: What's the write-off threshold + process?
11. Q11: What restrictions on collateral types?
12. Q12: What disclosure obligations to borrowers (APR, total cost, etc.)?
13. Q13: How does Money Lending Regulation Law (2022) affect existing NBFIs?
14. Q14: SCC (Savings and Loan Cooperative) — separate license?
15. Q15: What records to retain, for how long?

### Mapping to module

- Q1, Q2 → ADR-LOAN-001 (license classification)
- Q3, Q4 → INV-LOAN-02, INV-LOAN-03 (interest cap + DTI)
- Q5 → INV-LOAN-04 + ALG-LOAN-NPL-CLASSIFY-01
- Q6 → ALG-LOAN-PROVISION-MN-01
- Q7 → ADR-LOAN-003 (dual provisioning approach)
- Q8 → INV-LOAN-07 + integration spec
- Q9 → INV-LOAN-11
- Q10 → INV-LOAN-08
- Q12 → INV-LOAN-18
- Q13 → affects compliance roadmap
- Q14 → noted in `who.md` if SCC product offered
- Q15 → INV-LOAN-17

## Phase 2 — Source map (45 min)

### Identified sources

| Q# | Source | URL | Tier |
|----|--------|-----|------|
| Q1 | Банк бус санхүүгийн үйл ажиллагааны тухай хууль (NBFI Law 2002+) | https://legalinfo.mn/mn/detail?lawId=100262 | 1 |
| Q1, Q13 | Мөнгөн зээлийн үйл ажиллагааг зохицуулах тухай хууль (Money Lending Reg Law 2022) | https://legalinfo.mn/mn/detail?lawId=16532149634331 | 1 |
| Q2 | Mongolbank Law (Банкны тухай хууль) | https://legalinfo.mn/mn/detail/483 | 1 |
| Q3, Q4 | FRC Money Loan Activities Policy Council Decision 2024-03 | https://www.frc.mn (search "Мөнгөн зээлийн бодлогын зөвлөл") | 1 |
| Q5, Q6 | Mongolbank Активыг ангилах, эрсдэлийн сан байгуулах журам | https://legalinfo.mn/mn/detail?lawId=14601 | 1 |
| Q5, Q6 (NBFI variant) | FRC Банк бус санхүүгийн байгууллагын активыг ангилах журам | https://legalinfo.mn/mn/detail/15794 | 1 |
| Q7 | IFRS 9 Financial Instruments | https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/ | 1 (international standard) |
| Q8 | Зээлийн мэдээллийн тухай хууль (Credit Information Law) | https://legalinfo.mn/mn/detail/9175 | 1 |
| Q8 | Mongolbank Credit Information Bureau page | https://www.mongolbank.mn/mn/p/credit-information-unit | 1 (regulator publication) |
| Q12 | Money Lending Reg Law (transparency requirements) | (same as Q1) | 1 |
| Triangulation | Kilde.sg NBFI/Mongolia primer | https://www.kilde.sg/post/non-bank-financial-institutions-and-private-credit-investment-in-mongolia | 3 |
| Triangulation | MDS&KhanLex NBFI establishment guide | https://mdsa.mn/2024/02/27/establishment-of-non-banking-financial-institutions-in-mongolia/ | 3 |
| Triangulation | Mongolbank NPL resolution study | https://www.mongolbank.mn/file/files/documents/sudalgaa/NPL_jud_proceed.pdf | 2 (regulator publication) |
| Triangulation | World Bank FSAP Mongolia Development Module | https://documents1.worldbank.org/curated/en/282261468275063059/pdf/731000WP0Mongo0C0disclosed010050120.pdf | 2 |

## Phase 3 — Primary read (90 min)

### Q1 + Q13: Legal framework

**Source 1: NBFI Law (2002+)**

> The Financial Regulatory Commission regulates relationships related to non-banking financial activities conducted by legal entities that have obtained special permission from it.
> Non-banking financial activities are classified into different categories, including capital management, lending, and factoring activities.

**Interpretation:**
- FRC = licensing authority for NBFI lending
- "Лизинг" (leasing), "Факторинг" (factoring), "Зээл" (lending) — all listed as NBFI activities
- NBFIs cannot take public deposits (separate point confirmed via World Bank FSAP)

**Source 2: Money Lending Reg Law (2022; effective 2023-03-01)**

> The law aims to regulate the registration and supervision of legal entities engaged in collateral-based lending, individuals regularly engaged in money lending for profit, and establishing maximum interest rates on loans, as well as protecting consumer rights and legal interests in money lending activities.

**Interpretation:**
- Broader scope than NBFI Law — catches pawnshops + individual money lenders
- Establishes Money Lending Activities Policy Council (under FRC) that sets interest rate caps
- Consumer protection provisions
- Both laws apply to NBFIs offering lending: NBFI license + Money Lending Reg Law compliance

### Q3 + Q4: Interest cap + DTI

**Source: FRC Money Loan Activities Policy Council Decision (2024-03)**

(Confirmed via multiple triangulation sources; primary FRC Resolution № TBD needs separate retrieval.)

> As of March 2024, the FRC's Money Loan Activities Policy Council set a maximum interest rate of 4.5% per month on consumer and pawnshop loans. Mongolia also implemented a Debt-to-Income (DTI) limit for borrowers: new rules restrict borrowers from taking on loans if their total debt service exceeds 70% of their income.

**Interpretation:**
- **Interest cap: 4.5%/month** on consumer + pawnshop loans
- **DTI cap: 70%** of total debt service / income
- Both enforced at loan-creation; violations = FRC license risk
- Engineering: LoanProduct config validates interest cap; underwriting service validates DTI

**Critical engineering implication for interest cap:**
- 4.5%/month = ~54%/year nominal OR ~71%/year effective (compound monthly)
- APR disclosure must match real effective rate
- Spec should distinguish nominal vs effective; cap is on monthly nominal

**Follow-up Q3a:** Does the 4.5% cap include late fees? Or is late fee separate? Need separate research session.

### Q5 + Q6: NPL classification + provisioning

**Source 1: Mongolbank Активыг ангилах журам**

> Mongolbank classifies borrowers' loans and debt obligations as follows: loan and interest repayment within 15 days is classified as "Normal," up to 90 days is "Attention Required/Overdue," and loans classified as "Non-performing" have overdue periods exceeding 121 days.

**Source 2: NBFI variant (FRC regulation)**

Title: Банк бус санхүүгийн байгууллагын активыг ангилах, активын эрсдэлийн сан байгуулж, зарцуулах журам
URL: https://legalinfo.mn/mn/detail/15794

(Same scheme; NBFI-tailored provisioning percentages may differ from bank percentages.)

**Provisioning percentages (from triangulation):**

> For asset classification, loan loss provisions are established based on percentages of each asset's remaining balance. The specific provision rates are:
> - Normal classification: 0%
> - Watch list classification: 5%
> - Non-performing/impaired classification: 25%

**Interpretation:**
- 5-category scheme: Normal / Watch / Substandard / Doubtful / Loss
- Days-overdue thresholds:
  - **Normal (Хэвийн): 0-15 days**
  - **Watch (Хяналтын): 16-90 days**
  - **Substandard (Чанаргүйд бичигдсэн): 91-180 days** (typical; verify exact threshold)
  - **Doubtful (Эргэлзээт): 181-360 days**
  - **Loss (Алдагдал): >360 days**
- Provisioning percentages (illustrative; verify against current Mongolbank/FRC source):
  - Normal: 0%
  - Watch: 5%
  - Substandard: 25%
  - Doubtful: 50%
  - Loss: 100%
- Collateral coverage reduces provision base (provision = (outstanding - collateral_value) × pct)

**CRITICAL gap:** Search results gave only 3 brackets (Normal/Watch/NPL); the 4-stage NPL sub-categorization (Substandard/Doubtful/Bad/Loss) and their specific provision % needs direct read of Mongolbank Resolution. Flagged as Gap-LOAN-R4-01.

### Q7: IFRS 9 ECL applicability

**Source: IFRS 9 + Mongolia adoption status**

Mongolia adopted IFRS for financial statement preparation by reporting entities. IFRS 9 ECL is **mandatory for financial reporting** by all entities preparing IFRS financial statements.

**For NBFIs specifically:**
- FRC requires audited financial statements; auditors apply IFRS 9 ECL
- Regulatory provisioning (Mongolia method) used for **regulatory reporting**
- IFRS 9 ECL used for **accounting financial statements**
- Both apply; conservative principle = book MAX

**Engineering implication:**
- Two parallel provisioning systems run in production
- Reconciled monthly
- Financial statements use IFRS 9 (or MAX if regulatory is stricter)
- Regulatory reports use Mongolia method
- Note discrepancies for management

### Q8: Credit bureau reporting

**Source: Зээлийн мэдээллийн тухай хууль (Credit Information Law)**
URL: https://legalinfo.mn/mn/detail/9175

**Authority:** Mongolbank Зээлийн мэдээллийн алба (ZEM)

**Obligation:**
- All licensed lenders (banks + NBFIs) MUST report loan data to ZEM
- Events to report: new loan, repayment, classification change (NPL reclassify), write-off, full repayment
- Reporting frequency: typically within 5 business days of event (verify exact SLA in implementing regulation)

**Recent (2024-04) policy change:**

> In April 2024, Mongolbank decided to exclude from its credit information system the loan information of borrowers and guarantors whose loans in the attention required, doubtful, bad, and poor loan classifications categories are fully repaid.

**Interpretation:**
- ZEM cleansed historical NPL data when fully repaid (>155,000 records)
- Engineering implication: when a loan moves from NPL → fully paid, ZEM removes the negative history
- This affects DTI calculations + future-borrower scoring

### Q12: Disclosure

**Source: Money Lending Reg Law (2022)**

> Protecting consumer rights and legal interests in money lending activities.

(Specific disclosure requirements need direct law read — typically include: total cost of loan, effective annual rate, all fees, schedule, prepayment penalty, cancellation right.)

**Interpretation:**
- Customer-facing disclosure document required at signing
- APR (annual percentage rate) must be displayed clearly
- All fees disclosed (no hidden charges)
- Engineering: standardized disclosure PDF generated + retained per HW-LOAN-07

### Q14: SCC (Savings and Loan Cooperative)

**Source: NBFI Law + FRC separate SCC regulation**

> There are 170 SCCs that serve about 27,000 customers, many low-income and rural households. SCCs provide mostly savings and loan services to low-income and rural households.

**Interpretation:**
- Separate license type (SCC)
- Smaller scale; cooperative ownership
- Out of scope for this pilot (commercial NBFI focus) but architecture should not preclude

## Phase 4 — Triangulate (30 min)

### Q3 + Q4 vs international

**Interest cap practice:**
- EU MCD (Mortgage Credit Directive): caps via national variation; Germany ~ 12% APR consumer; France usury rate
- US: state-by-state; no federal cap on most loans; some states cap consumer at 36% APR
- UK: no statutory rate cap (cap on cost-of-credit since 2015 only for high-cost short-term; 0.8%/day cap = ~24% effective/month)
- India RBI: no fixed cap for NBFCs; transparent disclosure required
- Singapore: licensed moneylenders capped at 4%/month (similar to Mongolia 4.5%)

Mongolia 4.5%/month sits in middle range of comparable jurisdictions; aligns with FATF + IOSCO consumer-protection principles.

**DTI:**
- US: CFPB QM rule had 43% DTI cap (revised 2021)
- UK: BoE LTI limits (4.5x for high-LTV); affordability assessment standard
- Singapore TDSR: 55%
- Hong Kong: 50% (mortgage)
- Mongolia 70% = relatively high (Singapore/HK stricter); reflects newer regulation + Mongolian income-volatility realities

### Q5 vs international (NPL definition)

**Days-overdue thresholds vary:**
- EBA (EU): 90 days = NPL (default definition)
- US (Federal Reserve): 90 days = nonaccrual
- IFRS 9 default: 90 days = rebuttable presumption of default
- Mongolia: 121 days for "Чанаргүй" (slightly more lenient than EBA 90d)

**Note:** Mongolia at 121 days is more lenient than EU/US 90-day standard. Engineering should ALSO compute a "90-day flag" for IFRS 9 SICR (Significant Credit Risk Increase) trigger, even if Mongolia regulatory NPL only kicks in at 121.

### Q7 vs international

IFRS 9 is THE international standard since 2018-01-01. Mongolia adopted IFRS-aligned national standards; IFRS 9 ECL applies via auditor requirement.

**Implementation maturity:**
- EU banks: ECL operational since 2018
- US (GAAP): equivalent CECL (Current Expected Credit Loss) since 2020 for large banks
- Mongolia banks: adoption in progress; NBFIs lagging

## Phase 5 — Convert to spec INV/HW (45 min)

### Citation blocks (paste-ready)

```markdown
### INV-LOAN-02 — Interest rate ≤ 4.5%/month (consumer + pawnshop, Mongolia)
Status: ⚠️ MUST be ✅ IMPL — FRC license risk

Per FRC Money Loan Activities Policy Council Decision (March 2024): maximum
interest rate on consumer + pawnshop loans is 4.5%/month.

> **Source (SRC-FRC-MLPC-2024):** FRC Money Loan Activities Policy Council
> Resolution № [TBD; need direct URL]
> Authority: Санхүүгийн зохицуулах хороо — Мөнгөн зээлийн бодлогын зөвлөл
> URL: https://www.frc.mn (search "Мөнгөн зээлийн бодлогын зөвлөл")
> Retrieved: 2026-05-18 (via news + secondary sources;
>             primary URL verification follow-up)

Engineering:
- LoanProduct.max_interest_rate_monthly: NUMERIC(5,4); for Mongolia consumer
  + pawnshop products: enforce <= 0.0450
- Validation at LoanProduct creation: reject if exceeds cap
- Migration on cap change: all existing products auditor-reviewed
- Effective vs nominal: 4.5% monthly nominal; engineering must also compute
  APR for disclosure (INV-LOAN-18)

Multi-jurisdiction: cap is per-jurisdiction config (see HW-LOAN-01)
- EU/UK: no fixed cap (variable per product type)
- US: state-by-state
- Singapore: 4%/month moneylender cap
- India: no fixed cap; transparency required

Re-check schedule: 6 months (recently set; could revise)

Cross-ref: HW-LOAN-01 (configurable cap)
```

```markdown
### INV-LOAN-03 — DTI ≤ 70% at origination (Mongolia)
Status: ⚠️ MUST be ✅ IMPL

Per FRC Money Loan Activities Policy Council (March 2024): total debt
service / total income ≤ 70% at loan origination.

> **Source (SRC-FRC-MLPC-2024):** as above

Engineering:
- Underwriting service calls Mongolbank ZEM API to fetch customer's
  outstanding loans across all lenders
- Computes total_monthly_debt_service = sum(monthly_payment for each existing
  loan) + estimated_payment_for_this_loan
- Computes ratio = total_monthly_debt_service / declared_monthly_income
- Reject application if ratio > 0.70

Multi-jurisdiction: threshold per-jurisdiction
- Singapore TDSR: 55%
- HK mortgage: 50%
- US QM rule: 43% (varies)

Cross-ref: HW-LOAN-02; INV-LOAN-19 (Mongolbank ZEM integration)
```

```markdown
### INV-LOAN-04 — NPL classification auto-updated daily per Mongolbank scheme
Status: ⚠️ MUST be ✅ IMPL

Per Mongolbank Активыг ангилах журам + FRC NBFI equivalent:

| Classification | Days overdue | Provision % | Mongolian |
|----------------|--------------|-------------|-----------|
| Normal | 0-15 | 0% | Хэвийн |
| Watch | 16-90 | 5% | Хяналтын |
| Substandard | 91-180 | 25% | Чанаргүйд бичигдсэн |
| Doubtful | 181-360 | 50% | Эргэлзээт |
| Loss | >360 | 100% | Алдагдал |

> **Source (SRC-MONGOLBANK-ASSETCLASS):**
> Активыг ангилах, активын эрсдэлийн сан байгуулж, зарцуулах журам
> Authority: Монголбанк
> URL: https://legalinfo.mn/mn/detail?lawId=14601
> Retrieved: 2026-05-18

> **Source (SRC-FRC-NBFIASSETCLASS):**
> Банк бус санхүүгийн байгууллагын активыг ангилах журам
> Authority: FRC
> URL: https://legalinfo.mn/mn/detail/15794
> Retrieved: 2026-05-18

WARNING: provisioning percentages above are ILLUSTRATIVE. Exact Doubtful +
Loss thresholds + Loss vs Bad sub-categorization need direct read of current
Mongolbank Resolution. Filed as Gap-LOAN-R4-01 — verify before production.

Engineering:
- See ALG-LOAN-NPL-CLASSIFY-01 (daily cron)
- See ALG-LOAN-PROVISION-MN-01 (daily provisioning)
- NPLClassificationHistory audit trail (INV-LOAN-20: classification only
  worsens automatically; improves via documented cure)
```

```markdown
### INV-LOAN-07 — Credit bureau (ZEM) reporting within 5 business days
Status: ⚠️ MUST be ✅ IMPL

Per Зээлийн мэдээллийн тухай хууль (Credit Information Law):
- All licensed lenders MUST report to Mongolbank ZEM
- Events: new loan, repayment, NPL reclassification, write-off, full repayment
- SLA: within 5 business days of material event (verify exact deadline in
       implementing regulation)

> **Source (SRC-CREDITINFO-MN):**
> Зээлийн мэдээллийн тухай хууль
> Authority: State Great Khural of Mongolia
> URL: https://legalinfo.mn/mn/detail/9175
> Retrieved: 2026-05-18

> **Source (Mongolbank ZEM):**
> URL: https://www.mongolbank.mn/mn/p/credit-information-unit
> Retrieved: 2026-05-18

Engineering:
- See ALG-LOAN-DISBURSE-01: CreditBureauReport row created on disbursement
- See ALG-LOAN-NPL-CLASSIFY-01: CreditBureauReport on classification change
- Worker (hourly): submit PENDING reports to ZEM API; track ack_at
- Worker (daily): alert any report PENDING > 4 business days (1-day buffer
  before SLA breach)

Recent policy: Apr-2024 ZEM cleansed historical NPL records when fully paid
(>155K records). Engineering must handle: when loan moves NPL → fully paid,
ZEM removes negative history (affects future DTI calc by other lenders).
```

## Phase 6 — Capture (15 min)

### Source registry entries (paste to `_meta/regulatory-source-registry.md`)

```markdown
### SRC-NBFI-MN-2002
**Title (orig):** Банк бус санхүүгийн үйл ажиллагааны тухай хууль
**Title (EN):** Law on Non-Bank Financial Activities
**Authority:** State Great Khural of Mongolia
**Type:** Primary statute
**Original enactment:** 2002 (initial); multiple amendments since
**URL:** https://legalinfo.mn/mn/detail?lawId=100262
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

### SRC-MONEYLOAN-MN-2022
**Title (orig):** Мөнгөн зээлийн үйл ажиллагааг зохицуулах тухай хууль
**Title (EN):** Law on Regulating Money Lending Activities
**Authority:** State Great Khural of Mongolia
**Type:** Primary statute
**Adopted:** 2022-11-04
**Effective:** 2023-03-01
**URL:** https://legalinfo.mn/mn/detail?lawId=16532149634331
**Retrieved:** 2026-05-18
**Re-check due:** 2026-08-18 (recently effective; high amendment risk)

### SRC-MONGOLBANK-ASSETCLASS
**Title (orig):** Активыг ангилах, активын эрсдэлийн сан байгуулж, зарцуулах журам
**Title (EN):** Asset Classification + Loan Loss Provisioning Procedure
**Authority:** Монголбанк (Mongolbank)
**Type:** Implementing regulation
**URL:** https://legalinfo.mn/mn/detail?lawId=14601
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

### SRC-FRC-NBFIASSETCLASS
**Title (orig):** Банк бус санхүүгийн байгууллагын активыг ангилах, активын эрсдэлийн сан байгуулж, зарцуулах журам
**Title (EN):** NBFI Asset Classification + Loan Loss Provisioning Procedure
**Authority:** Санхүүгийн зохицуулах хороо (FRC)
**Type:** Implementing regulation
**URL:** https://legalinfo.mn/mn/detail/15794
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

### SRC-FRC-MLPC-2024
**Title:** FRC Money Loan Activities Policy Council Decision (interest cap + DTI limit)
**Authority:** FRC Мөнгөн зээлийн бодлогын зөвлөл
**Type:** Policy Council Resolution
**Date:** 2024-03
**URL:** https://www.frc.mn (specific URL to be confirmed)
**Retrieved:** 2026-05-18 (via secondary sources; primary verification follow-up)
**Re-check due:** 2026-08-18

### SRC-CREDITINFO-MN
**Title (orig):** Зээлийн мэдээллийн тухай хууль
**Title (EN):** Credit Information Law
**Authority:** State Great Khural of Mongolia
**URL:** https://legalinfo.mn/mn/detail/9175
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

### SRC-IFRS9
**Title:** IFRS 9 — Financial Instruments
**Authority:** IFRS Foundation
**Type:** International standard
**Effective:** 2018-01-01 (current version with amendments)
**URL:** https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/
**Retrieved:** 2026-05-18
**Re-check due:** 2027-05-18 (annual)
```

### Research log entry

```markdown
## 2026-05-18 — Research session: Mongolia NBFI lending

**Author:** [name]
**Duration:** ~3 hours (search + read + interpretation + spec drafting)
**Scope:** 15 questions (Q1-Q15) covering NBFI legal framework, interest
          cap, DTI, NPL classification, provisioning, IFRS 9 ECL, credit
          bureau, cooling-off, write-off, disclosure
**Sources consulted:**
- SRC-NBFI-MN-2002 (NBFI Law)
- SRC-MONEYLOAN-MN-2022 (Money Lending Reg Law)
- SRC-MONGOLBANK-ASSETCLASS (Asset Classification Procedure)
- SRC-FRC-NBFIASSETCLASS (NBFI variant)
- SRC-FRC-MLPC-2024 (Interest cap + DTI)
- SRC-CREDITINFO-MN (Credit Information Law)
- SRC-IFRS9 (international standard)
- Triangulation: Mongolbank NPL study, World Bank FSAP Mongolia,
  KhanLex NBFI primer, Kilde.sg overview

**Outcomes:**
- Authored MODULE-OVERVIEW.md for new `lending` module
- 20+ INV-LOAN-* invariants with citation blocks
- 10 HW-LOAN-* hardwiring constraints
- 7 algorithms (ALG-LOAN-*) including dual provisioning approach (IFRS 9 +
  Mongolia regulatory)
- 5 SoD constraints
- Schedule + cron entries for daily/monthly batch jobs
- Glossary terms (APR, NPL, ECL, SICR, Stage 1/2/3, etc.)

**Critical findings:**
1. TWO laws apply to NBFI lending: NBFI Law (2002) + Money Lending Reg Law
   (2022). Both must be honored.
2. Interest cap 4.5%/month + DTI 70% (recent FRC Policy Council decision).
3. NPL classification scheme is 5-stage (Mongolbank); provisioning
   percentages illustrative — Gap-LOAN-R4-01 to verify exact current values.
4. DUAL provisioning: IFRS 9 ECL (monthly, for accounting) + Mongolia
   regulatory (daily, for FRC report). Reconciled monthly; conservative
   principle = book MAX.
5. Credit bureau (Mongolbank ZEM) reporting within 5 business days; ZEM
   cleanses historical NPL records when fully paid (2024-04 policy).
6. Mongolia 121-day NPL threshold is more lenient than EBA 90-day; for
   IFRS 9 SICR trigger, ALSO compute 90-day flag.

**Open follow-ups (gap entries filed):**
- Gap-LOAN-R4-01 — verify exact Mongolbank/FRC NBFI provisioning percentages
- Gap-LOAN-R4-02 — confirm interest cap applies equally to business loans
  (only consumer + pawnshop confirmed)
- Gap-LOAN-R4-03 — late fee treatment within 4.5%/month cap
- Gap-LOAN-R4-04 — Mongolbank ZEM API spec + exact SLA (5d assumed)
- Gap-LOAN-R4-05 — IFRS 9 SICR criteria (currently using days-overdue
  proxy; should formalize)
- Gap-LOAN-R4-06 — Cooling-off period exact duration (3d assumed; verify
  against Money Lending Reg Law)
- Gap-LOAN-R4-07 — Recovery accounting rules + tax treatment

**Sign-off:** [compliance officer name] to confirm INV-LOAN-02 (interest cap)
              + INV-LOAN-03 (DTI) before production, as these have license
              risk if mis-configured

**Re-check schedule:** 2026-08-18 (3 months; recent Money Lending Reg Law +
                       FRC MLPC decisions warrant frequent re-check)
```

## Lessons learned

1. **Two laws apply, not one:** NBFI Law (2002) + Money Lending Reg Law (2022). The 2022 law was the missing piece for consumer protection + interest cap. Spec author would have missed if they only consulted FRC NBFI rules.

2. **Recent regulatory action (2024-03) sets concrete numbers** that didn't exist before. Re-check schedule should be aggressive for recently-set rules.

3. **Dual provisioning is THE structural design decision:** IFRS 9 ECL for accounting + Mongolia regulatory for FRC = two parallel calculation systems. Many implementations only do one; this is a 🚨 P0 design gap that R4 surfaced before R3 ever ran.

4. **NPL threshold mismatch (Mongolia 121d vs EU 90d):** for IFRS 9 SICR trigger, you may need a 90-day flag even though Mongolia regulatory NPL kicks in at 121d. Engineering should compute BOTH.

5. **Provisioning % illustrative — verify before production:** R4 surfaced 7 open gaps requiring follow-up research. This is normal; the methodology helps you SEE what you don't know, not pretend you know everything.

6. **Triangulation revealed Mongolia consumer protection is mid-range:** 4.5%/month cap is in line with Singapore moneylenders; DTI 70% is more lenient than HK/SG mortgage rules. Helpful context for product calibration.

7. **3 hours for 15 questions producing 20+ INV/HW + 7 algorithms + 5 SoD:** efficient because the 6-phase method has clear deliverables per phase. Without method: easily 6-10 hours of unstructured reading.

## Re-validation reminder

- 2026-08-18 (3-month check; Money Lending Reg Law amendments tracking)
- 2026-11-18 (6-month check; asset classification + provisioning regs)
- 2027-05-18 (annual full re-research)
- AD HOC: any FRC Policy Council decision change; any Mongolbank Resolution amendment; Mongolia FATF assessment update

## Cross-references

- `/specs/extended/workflow/07-r4-regulatory-research/00-START-HERE.md` — research methodology overview
- `/specs/extended/workflow/07-r4-regulatory-research/01-regulatory-research-workflow.md` — 6-phase method
- `/specs/extended/workflow/07-r4-regulatory-research/04-R4-agent-prompt.md` — agent prompt
- `02-mongolia-aml-law-research.md` — related (AML/KYC dependency)
- `../modules/lending/MODULE-OVERVIEW.md` — module spec produced from this research session
