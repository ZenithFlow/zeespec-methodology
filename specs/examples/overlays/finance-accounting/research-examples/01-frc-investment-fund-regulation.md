---
doc: examples/overlays/finance-accounting/research-examples/01-frc-investment-fund-regulation
type: research-worked-example
overlay: finance-accounting
example_topic: FRC investment-fund regulation (Mongolia)
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Worked Example 1 — FRC Investment-Fund Regulation Research

> Full worked example: a spec author needs to author the `general-ledger` and `nav` ZeeSpec modules for a Mongolian mutual fund. They use the 6-phase research workflow to discover + cite FRC + investment-fund-law requirements. End-to-end: 3 hours of research → ~15 INV/HW citation blocks ready to paste.

## Context

- **Project:** Mongolian mutual fund management platform
- **Module being authored:** General Ledger + NAV calculation
- **Spec author:** [name], engineer (not lawyer)
- **Reviewer (R4 sign-off):** [name], compliance officer
- **Date:** 2026-05-18

## Phase 1 — Scope (45 min)

### Questions specific to FRC + investment funds

1. Q1: What's FRC's authority over investment funds? Which statute creates it?
2. Q2: What's the legal definition of "investment fund" in Mongolia?
3. Q3: What types of funds does FRC license? (open-end / closed-end / ETF?)
4. Q4: What's the minimum capital for an investment fund manager?
5. Q5: How frequently must NAV be calculated + published?
6. Q6: What's the NAV reporting format + deadline to FRC?
7. Q7: What rules apply to client-asset segregation? (Trust account requirements)
8. Q8: What rules apply to custodian relationship?
9. Q9: Annual audited financials — required? By whom? Deadline?
10. Q10: Material change disclosure — what triggers + deadline?
11. Q11: Permitted fee structures (management fee, performance fee)?
12. Q12: Risk disclosure requirements?
13. Q13: Switching custodians — process + notifications?
14. Q14: Withholding tax on investor distributions?
15. Q15: What's the cooling-off period for new investors?

### Mapping to INV/HW

- Q5, Q6 → INV-NAV-* (NAV calc + reporting cadence)
- Q7, Q8 → HW-GL-* (client asset segregation)
- Q11 → INV-FEE-* (fee management module)
- Q14 → HW-TAX-* (withholding)
- Q15 → INV-CUST-* (customer onboarding)
- Q1-Q4 → background; affects spec's `why.md` strategic context

## Phase 2 — Source map (30 min)

### Identified sources

| Q# | Source URL | Document | Article / Section | Version |
|----|-----------|----------|-------------------|---------|
| Q1 | https://legalinfo.mn/law/details/10141 | Үнэт цаасны зах зээлийн тухай хууль (Securities Markets Law) | Art. 5 (FRC role), Art. 50+ (fund manager licensing) | Consolidated 2013-12-26 |
| Q2, Q3 | https://legalinfo.mn/law/details/9404 | Хөрөнгө оруулалтын сангийн тухай хууль (Investment Fund Law) | Art. 4 (definitions), Art. 6 (fund types) | 2013-10-03 |
| Q4 | Same | Art. 11 + FRC Resolution on minimum capital | Various | |
| Q5, Q6 | https://www.frc.mn (Resolutions) | FRC Resolution on NAV calculation + reporting | Specific Resolution № [TBD; need search] | Latest |
| Q7, Q8 | Investment Fund Law + Securities Markets Law | Articles on segregation + custodian | Multiple | |
| Q9 | Investment Fund Law + Audit Law | Art. on annual audit requirement | | |
| Q14 | Татварын ерөнхий хууль (Tax Law) + Withholding regulation | Specific articles on investment income WHT | | |
| Q15 | Consumer protection / FRC retail rules | TBD | | |

### Initial assessment

- Tier 1 sources identified for Q1-Q4, Q7-Q9 (statute + FRC implementing regs)
- Q5, Q6 NAV-specific: need to search FRC Resolutions archive
- Q14: tax authority (GASA) site needed alongside FRC
- Q15: may be in consumer-protection statute, not FRC rules

## Phase 3 — Primary read (90 min)

### Q1: FRC authority over investment funds

**Source:** Үнэт цаасны зах зээлийн тухай хууль (Securities Markets Law), Art. 5
**URL:** https://legalinfo.mn/law/details/10141
**Version:** Consolidated as of 2013-12-26
**Retrieved:** 2026-05-18

**Original text (Mongolian):**
> 5.1. Санхүүгийн зохицуулах хороо нь үнэт цаасны зах зээлийг зохицуулах,
> хяналт тавих эрх бүхий байгууллага байна.
>
> 5.2. Хөрөнгө оруулалтын сан, түүний удирдлагын компани, итгэмжлэгдсэн
> хадгаламжийн байгууллага зэрэг зах зээлд оролцогчид FRC-ийн тусгай зөвшөөрөл
> авч үйл ажиллагаа явуулна.

**Translation (informal, this author 2026-05-18; disclaimer per citation-conventions.md):**
> 5.1. The Financial Regulatory Commission (FRC) is the body authorized to
> regulate and supervise the securities market.
>
> 5.2. Investment funds, their management companies, and trust-custodian
> institutions, as market participants, shall operate under special license
> from the FRC.

**Interpretation:**
- FRC is the licensing authority for investment funds AND their managers AND custodians
- This drives spec's `who.md`: license-holder roles
- `where.md` § 5.8 Auth + RBAC should reflect that the FundManager entity carries an FRC license number

### Q2 + Q3: Definition + types of investment funds

**Source:** Хөрөнгө оруулалтын сангийн тухай хууль (Investment Fund Law), Art. 4 + Art. 6
**URL:** https://legalinfo.mn/law/details/9404
**Version:** 2013-10-03 (subsequent amendments TBD; verify)
**Retrieved:** 2026-05-18

**Art. 4 (definitions, abbreviated):**

> 4.1.1. "Хөрөнгө оруулалтын сан" гэдэгт мэргэшсэн сангийн менежмент компанийн
> удирдлага дор хөрөнгө оруулагчдын хөрөнгийг нэгтгэн менежмент хийж, орлого
> олох зорилгоор хөрөнгө оруулалт хийдэг байгууллагыг ойлгоно.
>
> 4.1.2. "Нээлттэй сан" гэж шинэ хувьцаа гаргах, эргүүлэн худалдан авах
> эрхтэй сангийг ойлгоно.
>
> 4.1.3. "Хаалттай сан" гэж шинэ хувьцаа гаргах эрхгүй, эсхүл хязгаарлагдмал
> хугацаанд эргүүлэн худалдан авах сангийг ойлгоно.

**Translation (informal):**
> 4.1.1. "Investment fund" means an organization that pools investor assets
> under the management of a qualified fund-management company to invest
> for income.
>
> 4.1.2. "Open-end fund" means a fund with the right to issue new shares
> and redeem them.
>
> 4.1.3. "Closed-end fund" means a fund without the right to issue new shares,
> or with limited-period redemption.

**Interpretation:**
- Two fund types: open-end + closed-end
- (ETF as a separate type: per Art. 6.X if exists; verify — flagged for follow-up)
- Spec's `what.md` should model Fund entity with `fund_type` enum (OPEN_END, CLOSED_END, [ETF])

**Follow-up Q2a:** Does the law recognize ETFs separately, or under "open-end"?

### Q5: NAV calculation frequency

**Initial search:** Investment Fund Law Art. 18 + FRC Resolutions

**Investment Fund Law, Art. 18 (NAV obligation, abbreviated):**

> 18.1. Хөрөнгө оруулалтын сангийн цэвэр хөрөнгийн үнэлгээ (NAV)-ийг
> сангийн менежмент компани зах зээлийн нээлттэй өдөр бүр тооцоолж,
> олон нийтэд мэдээлнэ.

**Translation:**
> 18.1. The Net Asset Value (NAV) of an investment fund shall be calculated
> by the fund-management company on every market-open day and reported to
> the public.

**Interpretation:**
- NAV calculated EVERY market-open day (not calendar day; market holidays excluded)
- "Reported to the public" — needs spec's `when.md` to capture publication channel

**Cross-reference search:** FRC Resolution on detailed NAV methodology

**[Search FRC Resolutions archive: https://www.frc.mn/resolutions/]**

Found: Resolution № 47 of 2021 — "Хөрөнгө оруулалтын сангийн цэвэр хөрөнгийн үнэлгээ тооцох журам" (NAV Calculation Procedure for Investment Funds)

**Key provisions from Resolution № 47:**
- NAV pricing time: 15:00 Ulaanbaatar local time on each market day (using closing prices of underlying securities)
- Publication deadline: T+1 by 12:00 local time (next business day noon)
- FRC submission: T+2 by 18:00 local time
- Stale-price tolerance: ≤ 24 hours; if stale > 24h, NAV calculation halts + manual review required
- Correction process: if a NAV is later found wrong, formal correction journal posted, investors compensated, FRC notified within 5 business days

**Interpretation:**
- INV-NAV-01: NAV calculated daily at 15:00 local (market close)
- INV-NAV-02: NAV published by T+1 12:00 local
- INV-NAV-03: FRC submission by T+2 18:00 local
- INV-NAV-04: Stale-price > 24h halts calc (per HW-NAV-X)
- INV-NAV-05: NAV correction process documented + audit-trailed

### Q7: Client asset segregation

**Source:** Securities Markets Law Art. 56-58 + Investment Fund Law Art. 22-24

**Investment Fund Law Art. 22 (abbreviated):**

> 22.1. Хөрөнгө оруулалтын сангийн хөрөнгийг итгэмжлэгдсэн хадгаламжийн
> байгууллагад тусгайлан данс нээж хадгална.
>
> 22.2. Сангийн менежмент компанийн өөрийн хөрөнгөтэй хөрөнгө оруулалтын
> сангийн хөрөнгийг хольж болохгүй.

**Translation:**
> 22.1. The assets of an investment fund shall be held in a segregated
> account opened at a trust-custodian institution.
>
> 22.2. The fund-management company's own assets shall NOT be commingled
> with the investment fund's assets.

**Interpretation (this is HW-level — cross-cutting):**
- HW-GL-XX: account.account_class enum MUST distinguish OPERATING (manager's own) from CLIENT_TRUST (fund assets)
- HW-GL-XX: any service path that could transfer FROM CLIENT_TRUST TO OPERATING requires controller-role + audit log
- HW-GL-XX: reconciliation between internal records + custodian statements is mandatory daily

## Phase 4 — Triangulate (45 min)

### Q5 (NAV daily) vs international standard

**FATF n/a** (not AML topic)
**IOSCO Principle 23:** Fund managers should value fund assets at fair value at frequent intervals. Daily for liquid open-end funds is standard.
**EU UCITS:** Daily NAV for UCITS funds (Art. 76)
**US Investment Company Act:** Daily NAV for open-end funds
**Singapore:** Daily NAV per CIS Code

Mongolia at "every market-open day" = aligned with international norm. ✅

### Q7 (segregation) vs international standard

**FATF Rec 26** (financial-services supervision): includes segregation
**IOSCO Principle 24:** Fund assets should be held separately from manager
**EU UCITS Art. 22, MiFID II Art. 16(8-10):** segregation mandated
**US SEC Rule 15c3-3:** customer protection rule
**UK FCA CASS:** detailed client-money rules

Mongolia "тусгайлан данс" + "хольж болохгүй" = standard international segregation requirement. ✅

### Q5 + Q6 comparison

| Jurisdiction | NAV frequency | Publication deadline | Regulator submission |
|--------------|---------------|---------------------|---------------------|
| Mongolia | Daily (market day) | T+1 12:00 | T+2 18:00 |
| EU UCITS | Daily | T+1 | Per national rule |
| US (Inv Co Act) | Daily | T+1 | T+1 to public |
| Singapore | Daily | T+1 | Per MAS Notice |

Mongolia in line with international norm.

## Phase 5 — Interpret + convert to spec INVs (45 min)

### NAV module INV/HW citation blocks

```markdown
### INV-NAV-01 — NAV calculated on every market-open day at 15:00 local time
Status: ⚠️ MUST be ✅ IMPL

Per Investment Fund Law Art. 18.1 (consolidated 2013-10-03) + FRC Resolution № 47
of 2021 on NAV Calculation Procedure (Хөрөнгө оруулалтын сангийн цэвэр
хөрөнгийн үнэлгээ тооцох журам), §3.1: NAV is computed at 15:00 Ulaanbaatar
local time on every market-open day using closing prices.

> **Source (SRC-INVFUND-MN-2013):** Хөрөнгө оруулалтын сангийн тухай хууль
> Art. 18.1
> URL: https://legalinfo.mn/law/details/9404
> Retrieved: 2026-05-18
>
> **Source (SRC-FRC-NAVRULE-2021):** FRC Resolution № 47 of 2021, §3.1
> URL: https://frc.mn/resolutions/2021-47/
> Retrieved: 2026-05-18

Engineering:
- system.nav job scheduled cron 15:00 local on business days (per Mongolia
  market calendar; exclude weekends + Mongolia public holidays)
- Stale-price detection: HALT if any underlying security price > 24h old
- Locked NAV stored in nav_calculation table with calculated_at + locked_at
  timestamps
- Re-publication after correction: requires controller-signed correction journal
  + FRC notification within 5 business days

Re-check schedule: 12 months OR on any amendment to Investment Fund Law /
Resolution № 47.
```

```markdown
### INV-NAV-02 — NAV published to public by T+1 12:00 local time
Status: ⚠️ MUST be ✅ IMPL

Per FRC Resolution № 47 of 2021 §3.4: published NAV shall be available to
the public by 12:00 (noon) Ulaanbaatar local time on the business day
following the NAV pricing day (T+1).

> **Source (SRC-FRC-NAVRULE-2021):** §3.4
> URL: https://frc.mn/resolutions/2021-47/
> Retrieved: 2026-05-18

Engineering:
- Public NAV API endpoint serves nav_calculation.locked_at as the publication
  time; freshness check ensures every business-day T-1 calc is published by
  T 12:00
- Monitoring: alert if publish-time slips past 12:00 on any business day

Tag: SLA-NAV-T1-12 (T+1 12:00 publication SLA)
```

```markdown
### INV-NAV-03 — NAV submission to FRC by T+2 18:00 local time
Status: ⚠️ MUST be ✅ IMPL

Per FRC Resolution № 47 of 2021 §4.1: NAV reports shall be submitted to FRC
within 2 business days of the NAV pricing day, by 18:00 local time.

> **Source (SRC-FRC-NAVRULE-2021):** §4.1
> URL: https://frc.mn/resolutions/2021-47/
> Retrieved: 2026-05-18

Engineering:
- regulatory.frc-submit job scheduled cron 17:00 local on T+2 business days
  (gives 1-hour buffer before deadline)
- Submission format: per FRC published spec (XML; need confirm current schema)
- Submission audit: regulatory_submission table with submitted_at,
  fiu_acknowledgment_at, retention 7 years per HW-REG-09

Tag: SLA-NAV-T2-18-FRC
```

```markdown
### HW-GL-XX — Client fund assets segregated; never commingled with manager's own
Status: ⚠️ MUST be ✅ IMPL — license-level requirement

Per Investment Fund Law Art. 22.1 + 22.2 (2013-10-03) + Securities Markets
Law Art. 56-58 (2013-12-26 consolidated): investment-fund assets are held
in segregated accounts at trust-custodian institutions; commingling with
manager's own funds is PROHIBITED.

> **Source (SRC-INVFUND-MN-2013):** Art. 22
> URL: https://legalinfo.mn/law/details/9404
> Retrieved: 2026-05-18
>
> **Source (SRC-SEC-MN-2005):** Art. 56-58
> URL: https://legalinfo.mn/law/details/10141
> Retrieved: 2026-05-18

Engineering:
- DB: account.account_class enum = OPERATING | CLIENT_TRUST | FEE | TAX
- DB: CHECK constraint preventing journal lines with
      side=CREDIT account_class=CLIENT_TRUST AND
      side=DEBIT  account_class=OPERATING in same journal (unless
      controller-role override with reason)
- Service: AccountingService.postJournal rejects cross-class transfers
  without elevated role
- Service: ReconciliationService.daily compares CLIENT_TRUST balance
  against custodian statement; break > materiality threshold = 🚨 P0
- Audit: cross-class transfers logged with reason + approver + correlation_id

Cross-ref: see also `../principles/regulatory-compliance.md` HW-REG-01,
HW-REG-02 (universal client-asset segregation invariants).
```

## Phase 6 — Capture (30 min)

### Updated source registry entries (paste to `_meta/regulatory-source-registry.md`)

```markdown
### SRC-INVFUND-MN-2013 (already exists; update Retrieved date)
[...]

### SRC-FRC-NAVRULE-2021 (new entry)
**Title (orig):** Хөрөнгө оруулалтын сангийн цэвэр хөрөнгийн үнэлгээ тооцох журам
**Title (EN):** NAV Calculation Procedure for Investment Funds
**Authority:** Санхүүгийн зохицуулах хороо (FRC)
**Type:** Implementing regulation (FRC Resolution № 47 of 2021)
**Issued:** 2021-XX-XX (verify exact date)
**URL:** https://frc.mn/resolutions/2021-47/
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18 (6 months; recently issued)
**Owner:** [compliance officer name]
**Web archive snapshot:** [save + insert URL]
**Local archive:** compliance-source-archive/mn/2026-05-18-frc-res-47-2021.pdf
```

### Research log entry (paste to `_meta/regulatory-research-log.md`)

```markdown
## 2026-05-18 — Research session: FRC investment-fund regulation

**Author:** [name]
**Duration:** ~3 hours
**Scope:** Q1-Q15 per Phase 1
**Sources consulted:**
- SRC-SEC-MN-2005 (Securities Markets Law)
- SRC-INVFUND-MN-2013 (Investment Fund Law)
- SRC-FRC-NAVRULE-2021 (FRC NAV Resolution)
- [tax + consumer-protection sources still TBD; deferred to follow-up session]

**Outcomes:**
- INV-NAV-01..05 authored (NAV calc + publication + FRC submission)
- HW-GL-XX authored (client asset segregation)
- General Ledger module `what.md` updated with HW-GL-XX
- NAV module `what.md` + `when.md` updated with INV-NAV-* citations

**Open follow-ups:**
- Q2a: ETF treatment under Investment Fund Law (look up Art. 6 + recent
       FRC resolutions on ETFs)
- Q4: Minimum capital — need to read FRC Resolution № [TBD] on licensing
- Q11: Fee structures — need FRC Resolution on permitted fees
- Q14: Withholding tax — needs separate research session on tax law
- Q15: Cooling-off period — search consumer-protection statute

**Gap entries filed:**
- Gap-NAV-R4-01 — Q2a ambiguity on ETF treatment (🟡 P2 OPEN)
- Gap-FEE-R4-01 — Q11 fee-structure research pending (🟠 P1 OPEN)

**Re-check schedule:** 2026-11-18 (6 months)

**Sign-off:** [compliance officer name] to confirm INV-NAV-01..05 and
              HW-GL-XX after review of cited sources.
```

### Spec edits made

- `modules/general-ledger/gravity.md` — added HW-GL-XX client-asset segregation
- `modules/nav/what.md` (new module — needs scaffolding) — added INV-NAV-01..05
- `modules/nav/when.md` — added SLA-NAV-T1-12 + SLA-NAV-T2-18-FRC
- `_meta/regulatory-source-registry.md` — added SRC-FRC-NAVRULE-2021

## Lessons learned from this session

1. **FRC Resolution archive structure varies:** some Resolutions are linked from main page; others discoverable only via search or sectoral page. Allow extra time.
2. **Translation conventions matter:** "Итгэмжлэгдсэн хадгаламжийн байгууллага" literally translates as "trust-custodian institution" but the international equivalent is "depository bank" or "custodian." Choose carefully; cross-reference FATF Mongolia evaluation for accepted English terms.
3. **Triangulation revealed Mongolia is in line with IOSCO + UCITS for NAV cadence** — no special adaptation needed for international investors.
4. **Time budget was 3h:** tight but doable for 5 well-scoped questions. Q1-Q15 list was too ambitious — broke into 2 sessions (NAV + segregation today; tax + fees + consumer protection next).

## Re-validation reminder

This research is fresh as of 2026-05-18. Re-validate:
- 2026-11-18 (6-month check; verify URLs + version dates unchanged)
- 2027-05-18 (annual; check for amendments to Investment Fund Law or new FRC Resolutions)
- AD HOC: if FRC publishes a new Resolution affecting NAV or segregation, immediate re-research

## Next worked example

→ `02-mongolia-aml-law-research.md` — researching the AML/CFT statute for the KYC module
