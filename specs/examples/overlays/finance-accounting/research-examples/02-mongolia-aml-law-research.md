---
doc: examples/overlays/finance-accounting/research-examples/02-mongolia-aml-law-research
type: research-worked-example
overlay: finance-accounting
example_topic: Mongolia AML/CFT Law research (KYC + threshold + deadlines)
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Worked Example 2 — Mongolia AML/CFT Law Research

> Full worked example: a spec author researches Mongolia's AML/CFT statute to determine exact CTR threshold, STR deadline, KYC tier requirements, and sanctions-list expectations for the `kyc-aml` module. End-to-end: ~2.5 hours of research → 8 INV/HW citation blocks ready to paste.

## Context

- **Project:** Mongolian mutual fund management platform
- **Module being authored:** KYC / AML
- **Spec author:** [name], engineer
- **Reviewer:** [name], compliance officer (mandatory sign-off given criminal-liability nature)
- **Date:** 2026-05-18

## Phase 1 — Scope (30 min)

### Questions specific to AML/CFT

1. Q1: What's the legal definition of "cash transaction" for CTR purposes?
2. Q2: What's the CTR threshold (single transaction)?
3. Q3: Is the CTR threshold per single transaction, or aggregate same-day (smurfing detection mandated)?
4. Q4: What's the STR (suspicious transaction report) filing deadline?
5. Q5: What's the legal definition of "suspicious transaction"?
6. Q6: Who is the FIU? What format does FIU expect submissions in?
7. Q7: What's the KYC retention window (customer ID records)?
8. Q8: What's the transaction record retention window?
9. Q9: Is there a defined KYC tier model in the statute, or is it left to the regulator?
10. Q10: What sanctions lists must be screened against (UN; national designated; OFAC if relevant)?
11. Q11: What's the legal definition of "beneficial owner" + percentage threshold?
12. Q12: Are there specific PEP screening requirements?
13. Q13: Cross-border CTR/STR — when does a foreign transaction get filed in Mongolia FIU?
14. Q14: Penalties for non-compliance (helps calibrate INV severity)?
15. Q15: When was the law most recently amended?

### Mapping to INV/HW

- Q2, Q3 → INV-KYC-04 (CTR auto-flag threshold + aggregation rule)
- Q4 → INV-KYC-05 (STR filing deadline; SLA)
- Q6 → INV-KYC-XX (FIU submission format + endpoint)
- Q7, Q8 → HW-KYC-09 (retention)
- Q10 → INV-KYC-06 (sanctions screening)
- Q11 → INV-KYC-07 (UBO threshold)
- Q12 → INV-KYC-11 (PEP)
- Q14 → drives severity calibration (P0 if criminal-liability)

## Phase 2 — Source map (15 min)

### Primary source

**Title (orig):** Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль
**Title (EN):** Anti-Money Laundering / Counter-Financing of Terrorism Law (AML/CFT Law)
**Authority:** State Great Khural (Parliament) of Mongolia
**Original enactment:** 2013-05-31
**Most-recent amendment:** 2017-10-26 (search amendment chain on legalinfo.mn)
**URL:** https://legalinfo.mn/law/details/11103
**Version:** Consolidated as of 2017-10-26 amendment

### Implementing regulations

- FRC AML implementing rules: search FRC Resolutions for AML/CFT
- FIU operational rules: under FIU within FRC

### Triangulation source

- FATF Mongolia Mutual Evaluation Report 2017 (provides English translation of key provisions)
  URL: https://www.fatf-gafi.org/en/publications/mutualevaluations/documents/mer-mongolia-2017.html

## Phase 3 — Primary read (75 min)

### Q2 + Q3: CTR threshold

**Source:** AML/CFT Law Art. 11 (Cash transaction reporting)
**Version:** 2017-10-26 consolidated

**Original text:**
> 11.1. Мэдээллийн нэгжид мэдээлэх ёстой бэлэн мөнгөний гүйлгээ:
> 11.1.1. 20,000,000 (хорин сая) төгрөгтэй тэнцэх буюу түүнээс дээш дүнтэй
>         бэлэн мөнгөний гүйлгээ;
> 11.1.2. Гадаад валютаар бол түүний албан ёсны ханшаар тооцсон 20,000,000
>         төгрөгтэй тэнцэх дүнтэй бэлэн мөнгөний гүйлгээ;
>
> 11.2. Дараах гүйлгээг нэг гүйлгээ гэж үзнэ:
> 11.2.1. Нэг өдрийн дотор нэг харилцагчийн нэрээр хийгдсэн салангид бэлэн
>         мөнгөний гүйлгээний нийт дүн.

**Translation (informal):**
> 11.1. Cash transactions that must be reported to the [Financial Intelligence
> Unit (FIU)]:
> 11.1.1. Cash transactions of 20,000,000 (twenty million) MNT or equivalent
>         or higher;
> 11.1.2. For foreign currency, cash transactions of equivalent value to
>         20,000,000 MNT computed at the official exchange rate.
>
> 11.2. The following shall be considered as one transaction:
> 11.2.1. Separate cash transactions made in one day under the same customer's
>         name shall be aggregated to one total.

**Interpretation — CRITICAL FINDING:**

The law explicitly requires AGGREGATION (per Art. 11.2.1). So:
- Customer makes 3 cash deposits of 7M MNT each on the same day = 21M MNT aggregate → CTR REQUIRED
- This is NOT optional smurfing detection; it's the statutory definition of "transaction"

**Engineering implication:** CTR check operates on `SUM(cash_amount) per customer per day`, NOT per individual transaction. Many engineering teams get this WRONG and only check per-transaction — direct AML violation.

### Q4: STR filing deadline

**Source:** AML/CFT Law Art. 13

**Original text (abbreviated):**
> 13.1. Сэжигтэй гүйлгээний талаарх мэдээллийг мэдээллийн нэгжид нэн даруй,
> хамгийн оройдоо 24 цагийн дотор мэдэгдэх үүрэгтэй.
>
> 13.2. "Сэжигтэй гүйлгээ" гэж аливаа гүйлгээ нь:
> 13.2.1. Хууль бус үйл ажиллагаатай холбоотой байж болзошгүй;
> 13.2.2. Мөнгө угаах, терроризмыг санхүүжүүлэх зорилготой байж болзошгүй;
> 13.2.3. Хууль бус эх үүсвэртэй байж болзошгүй;
> 13.2.4. Хэрэглэгчийн хэвийн санхүүгийн зан үйлд тохирохгүй;
> [...]

**Translation:**
> 13.1. Information about suspicious transactions shall be reported to the
> FIU IMMEDIATELY, at the latest within 24 hours.
>
> 13.2. A "suspicious transaction" is any transaction that:
> 13.2.1. May be related to illegal activity;
> 13.2.2. May have the purpose of money laundering or financing terrorism;
> 13.2.3. May come from an illegal source;
> 13.2.4. Does not fit the customer's normal financial behavior;
> [...]

**Interpretation:**
- HARD 24-hour deadline from time of suspicion (not detection — important nuance)
- "Suspicion" is defined broadly; even pattern anomalies trigger
- Engineering must capture the EXACT timestamp of suspicion drafting + filing → audit-trail showing < 24h
- Late filing = potential criminal liability under Art. 16 (penalties)

### Q7: KYC retention

**Source:** AML/CFT Law Art. 14

**Original text:**
> 14.1. Тайлагнах үүрэгтэй этгээд харилцагчтай байгуулсан гэрээ, түүний
> танилт болон бусад баримтыг харилцаа дууссан өдрөөс хойш 7 (долоо) жилийн
> хугацаанд хадгална.
>
> 14.2. Бэлэн мөнгөний гүйлгээний бичиг баримтыг гүйлгээ хийгдсэн өдрөөс
> хойш 7 (долоо) жилийн хугацаанд хадгална.

**Translation:**
> 14.1. Reporting entities shall retain customer-relationship contracts,
> identification, and other documents for 7 (seven) years from the date the
> relationship ended.
>
> 14.2. Cash transaction records shall be retained for 7 (seven) years from
> the date the transaction occurred.

**Interpretation:**
- KYC docs: 7y from RELATIONSHIP END (not 7y absolute)
- Transaction records: 7y from TRANSACTION DATE
- Two different "anchor dates"
- Engineering: `kyc_documents.retention_until = customer.relationship_ended_at + 7y` (computed at end-of-relationship time)
- Engineering: `wallet_transaction.retention_until = wallet_transaction.transaction_date + 7y` (computed at insert time)
- Hard DELETE prior to retention_until = direct violation; engineering MUST prevent

### Q11: Beneficial owner threshold

**Source:** AML/CFT Law Art. 4 (definitions) + Art. 9 (CDD obligations)

**Art. 4 definition (abbreviated):**
> 4.1.6. "Үнэн ашиг хүртэгч" гэж хуулийн этгээдийн 25 (хорин таван) хувь буюу
> түүнээс дээш хувьцаа эзэмшсэн эсхүл түүний шийдвэр гаргалтад нөлөөлөх
> чадвартай хувь хүнийг ойлгоно.

**Translation:**
> 4.1.6. "Ultimate Beneficial Owner (UBO)" means a natural person owning
> 25 (twenty-five) percent or more of equity in a legal entity, OR a person
> capable of influencing its decisions.

**Interpretation:**
- 25% threshold (FATF-aligned)
- ALSO captures "control" not just equity (this is broader than equity threshold)
- Engineering: BeneficialOwner.ownership_pct >= 25 OR is_control == TRUE
- Chain traversal: continue until natural persons reached

### Q12: PEP

**Source:** AML/CFT Law Art. 4 + Art. 10 (EDD requirements)

**Art. 4.1.X definition (abbreviated):**
> "Улс төрд нөлөөтэй этгээд (PEP)" гэж дотоодын болон гадаадын төрийн өндөр
> албан тушаалд ажиллаж буй, эсхүл сүүлийн 3 жилийн дотор ажилласан этгээд...

**Translation:**
> "Politically Exposed Person (PEP)" means a person currently holding or
> within the last 3 years has held a high-level public office, domestic or
> foreign...

**Interpretation:**
- 3-year lookback for PEP status (some jurisdictions use 1y or none)
- Engineering: pep_screening must include PEP status with effective_until = max(current_term_end, last_held + 3y)
- EDD required for PEP customers (per Art. 10)

### Q14: Penalties

**Source:** AML/CFT Law Art. 16

**Translation (summary):**
> Failure to file CTR/STR within deadline: administrative penalty up to
> [amount]; willful or repeat violation: criminal liability up to [years]
> imprisonment for responsible officer.

**Interpretation:**
- Criminal liability for willful non-filing
- This calibrates severity: all CTR/STR enforcement = 🚨 P0 (criminal-liability risk)
- Spec must surface this in severity-matrix-finance.md cross-reference

## Phase 4 — Triangulate (30 min)

### Q2 + Q3 vs FATF

**FATF Recommendation 16:** national CTR thresholds should be "appropriate" — typically $10K-15K equivalent. Mongolia at ~$7K is LOWER (more conservative), aligning with FATF risk-based approach for higher-risk countries.

**FATF Mongolia MER 2017 (English translation):**
- Confirmed Mongolia threshold at 20M MNT
- Confirmed 24h STR deadline
- Confirmed 7y retention
- Noted Mongolia is on the "increased monitoring" list — explains stricter-than-FATF thresholds

### Aggregation requirement (Q3)

**FATF Rec 10 (CDD)** mentions ongoing monitoring incl. transaction patterns; aggregation is a national-implementation choice.

**Comparison:**
- Mongolia: explicit statutory aggregation (Art. 11.2)
- EU AMLD: aggregation per "operations linked to each other"
- US BSA: aggregation per single business day (CFR 1010.313)
- Singapore: aggregation per "set of related transactions"

All major jurisdictions require aggregation; Mongolia is explicit + per-day. Engineering pattern is identical across jurisdictions.

### Q4 STR deadline vs international

| Jurisdiction | STR deadline |
|--------------|-------------|
| Mongolia | 24 hours (HARD; Art. 13.1) |
| EU AMLD | "Promptly" (typically interpreted as 24h) |
| US BSA | 30 days post-detection (more lenient) + immediate for terrorism |
| UK MLR | "As soon as practicable" |
| Singapore | 15 business days |
| India PMLA | 7 days |

Mongolia at 24h is STRICTER than most. Reflects FATF "increased monitoring" status.

## Phase 5 — Convert to spec INV/HW (45 min)

```markdown
### INV-KYC-04 — CTR auto-flag for cash transactions ≥ 20,000,000 MNT (aggregated per customer per day)
Status: ⚠️ MUST be ✅ IMPL — criminal-liability risk if missed

Per Mongolia AML/CFT Law Art. 11.1.1 + 11.2.1 (consolidated 2017-10-26):
cash transactions of 20,000,000 MNT or equivalent or higher MUST be reported
to the FIU. The threshold applies to AGGREGATED cash transactions per
customer per day (Art. 11.2.1) — multiple sub-threshold transactions that
sum to ≥ 20M MNT trigger CTR.

> **Source (SRC-AML-MN-2017):** Art. 11.1.1 + 11.2.1
> URL: https://legalinfo.mn/law/details/11103
> Retrieved: 2026-05-18

Engineering:
- Trigger: every COMPLETED cash deposit OR withdrawal
- Check: SUM(cash_amount) per customer over rolling business day
        (00:00-23:59 local) >= 20_000_000 MNT
- If newly crossing threshold (sum was < 20M, now ≥ 20M): create CTR filing
  with status=PENDING_REVIEW, link all aggregated transactions
- Foreign-currency cash transactions converted at FRC official rate as of
  transaction date
- DB: ctr_filing table; threshold_value stored as config (default 20_000_000),
  amendment-aware (if law changes, update config + flag historical filings)
- Filing deadline: 5 business days from triggering event (per Art. 11.3 —
  separate; verify)

**Common anti-pattern:** Many implementations check per-transaction only,
NOT aggregated. This is a 🚨 P0 violation. Test:
- Insert 3 cash deposits 7M MNT each same day under same customer
- Verify CTR filing created (not 0 filings)

Re-check schedule: 6 months (recent amendment activity in AML space).
```

```markdown
### INV-KYC-05 — STR filed within 24 hours of suspicion drafting
Status: ⚠️ MUST be ✅ IMPL — HARD deadline; criminal-liability risk

Per Mongolia AML/CFT Law Art. 13.1 (consolidated 2017-10-26): suspicious
transaction reports MUST be filed with the FIU IMMEDIATELY, at the latest
within 24 hours.

> **Source (SRC-AML-MN-2017):** Art. 13.1
> URL: https://legalinfo.mn/law/details/11103
> Retrieved: 2026-05-18

Engineering:
- str_filing.drafted_at: timestamp when suspicion was first identified
  (typology engine OR compliance officer manual flag)
- str_filing.filed_at: timestamp when FIU submission acknowledged
- Worker (cron 1h): WHERE drafted_at < NOW() - 12h AND status=DRAFT
  → alert compliance officer (12h warning)
- Worker (cron 1h): WHERE drafted_at < NOW() - 22h AND status NOT IN (FILED)
  → 🚨 P0 escalation to head of compliance + ops on-call
- KPI: % STRs filed within 24h target = 100% (any miss = audit-reportable)

Cross-ref: severity-matrix-finance.md — late STR is P0 because criminal
liability (Art. 16) attaches to willful or repeated non-filing.

Tag: SLA-KYC-STR-24h
```

```markdown
### HW-KYC-09 — KYC document retention 7 years from relationship end
Status: ⚠️ MUST be ✅ IMPL

Per Mongolia AML/CFT Law Art. 14.1 (consolidated 2017-10-26): customer
identification documents and CDD records MUST be retained for 7 years from
the date the customer relationship ends.

> **Source (SRC-AML-MN-2017):** Art. 14.1
> URL: https://legalinfo.mn/law/details/11103
> Retrieved: 2026-05-18

Engineering:
- DB: kyc_document.retention_until = customer.relationship_ended_at + 7 years
  (computed at relationship-end event)
- DB: REVOKE DELETE on kyc_document FROM application_user
- Hot/cold archive: documents > 1 year inactive moved to cold storage
  (kyc_document_archive); still retained
- Privacy cascade: documents PAST retention_until must actually delete
  (GDPR-style obligation; document the legal basis per INV-REG-10)
- Audit: any attempted DELETE on hot table = 🚨 P0
- Audit: any document past retention_until still present > 30 days = P1
  (privacy violation)
```

```markdown
### HW-KYC-10 — Transaction record retention 7 years from transaction date
Status: ⚠️ MUST be ✅ IMPL

Per Mongolia AML/CFT Law Art. 14.2 (consolidated 2017-10-26): cash transaction
records MUST be retained for 7 years from the transaction date.

> **Source (SRC-AML-MN-2017):** Art. 14.2

Engineering (mirror of HW-KYC-09 but anchor date is different):
- DB: wallet_transaction.retention_until = transaction_date + 7 years
  (computed at insert time; never updated)
- DB: REVOKE DELETE on wallet_transaction, ctr_filing, str_filing,
      sanctions_screening_hit FROM application_user
```

```markdown
### INV-KYC-07 — Beneficial owner identification (≥25% equity OR control)
Status: ⚠️ MUST be ✅ IMPL for legal-entity customers

Per Mongolia AML/CFT Law Art. 4.1.6 + Art. 9 (CDD obligations): for legal-
entity customers, identify natural persons owning ≥ 25% equity OR having
control over decision-making.

> **Source (SRC-AML-MN-2017):** Art. 4.1.6 + Art. 9
> URL: https://legalinfo.mn/law/details/11103
> Retrieved: 2026-05-18

Engineering:
- BeneficialOwner entity with ownership_pct + is_control_path BOOL
- onboardLegalEntity workflow: traverse ownership chain until ≥ 25% natural
  persons OR control paths reached
- If traversal halts (e.g., obscured trust structure abroad), document why
  + escalate to compliance officer + may require EDD
- Annual re-verification on relationship anniversary
- Material-change re-verification on customer notice (or detected change)
```

```markdown
### INV-KYC-11 — PEP screening with 3-year lookback
Status: ⚠️ MUST be ✅ IMPL

Per Mongolia AML/CFT Law Art. 4.1.X (PEP definition): PEP status includes
persons currently holding OR within the last 3 years has held a high-level
public office (domestic or foreign).

Engineering:
- Customer.pep_status_effective_until = max(current_term_end, last_held + 3y)
- Re-screening: monthly check against latest PEP data source
- EDD required when pep_status = TRUE (per Art. 10)
- PEP transaction above threshold → automatic STR review queue
```

## Phase 6 — Capture (15 min)

### Source registry updates

```markdown
### SRC-AML-MN-2017 (update Retrieved date; confirm version)
**Title (orig):** Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль
**Title (EN):** Anti-Money Laundering / Counter-Financing of Terrorism Law
**Authority:** State Great Khural (Parliament) of Mongolia
**Type:** Primary statute
**Original enactment:** 2013-05-31
**Last amendment in our citation:** 2017-10-26
**URL:** https://legalinfo.mn/law/details/11103
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18 (6 months; high regulatory attention)
**Web archive snapshot:** https://web.archive.org/web/2026XXXX/legalinfo.mn/law/details/11103
**Local archive:** compliance-source-archive/mn/2026-05-18-aml-law-2017-consolidated.pdf
**Supplementary translation source:** FATF Mongolia MER 2017 (English excerpts for cross-check)
```

### Research log entry

```markdown
## 2026-05-18 — Research session: Mongolia AML/CFT Law

**Author:** [name]
**Duration:** ~2.5 hours (incl. lawyer sign-off coordination)
**Scope:** Q1-Q15 per Phase 1 (focused on CTR + STR + retention + UBO + PEP)
**Sources consulted:**
- SRC-AML-MN-2017 (primary statute)
- FATF Mongolia MER 2017 (English-language cross-check)

**Outcomes:**
- INV-KYC-04 (CTR threshold + AGGREGATION) — finding: many engineering
  implementations get aggregation wrong; flagged for code review
- INV-KYC-05 (STR 24h deadline) — finding: HARD criminal-liability deadline
- HW-KYC-09 (KYC retention 7y from relationship end)
- HW-KYC-10 (Transaction retention 7y from transaction date)
- INV-KYC-07 (UBO 25% or control)
- INV-KYC-11 (PEP 3-year lookback)

**Open follow-ups:**
- Q5 deeper: "Suspicious transaction" definition Art. 13.2 has 4 sub-criteria;
  pilot's typology engine may not cover all 4 — gap to file
- Q6 deeper: FIU submission format spec — need separate research on FIU portal
  API; pilot uses PDF upload but XML may be required soon
- Q10 deeper: sanctions list — Mongolia's national designated-persons list
  source TBD (likely under FRC or GIA — General Intelligence Agency)
- Q14 deeper: penalty amounts — affects severity-matrix calibration

**Gap entries filed:**
- Gap-KYC-R4-01 — typology engine coverage of Art. 13.2 sub-criteria (🟠 P1)
- Gap-KYC-R4-02 — FIU submission format (🟠 P1)
- Gap-KYC-R4-03 — Mongolia sanctions list source (🟡 P2)

**Sign-off:** [compliance officer name] confirmed INV-KYC-04 (aggregation)
              critical for AML posture, 2026-05-18

**Re-check schedule:** 2026-11-18 (6 months)
```

## Lessons learned

1. **Aggregation rule (Art. 11.2.1) was the most-impactful finding:** without research, the engineer would likely have implemented per-transaction CTR check only. The statute's explicit aggregation requirement maps directly to a 🚨 P0 production-bug pattern (financial-anti-patterns.md #6).

2. **24h STR deadline = HARD:** criminal liability under Art. 16 means even a single missed STR is regulator-reportable. SLA + auto-escalation are mandatory.

3. **Two retention anchors are easy to miss:** KYC docs anchor on RELATIONSHIP END; transactions anchor on TRANSACTION DATE. Engineering needs both columns.

4. **FATF MER as translation source:** the FATF Mongolia 2017 evaluation report provided English-language confirmation of key thresholds + deadlines, useful for non-Mongolian-speaking reviewers.

5. **2.5 hours was tight for 15 questions:** focused on the 8 most-impactful (CTR + STR + retention + UBO + PEP). Deferred typology + FIU format + sanctions sources to follow-up.

6. **Compliance officer sign-off required:** for criminal-liability provisions, do NOT ship INV/HW without compliance review. Engineering documentation alone is insufficient.

## Re-validation reminder

- 2026-11-18 (6-month check)
- 2027-05-18 (annual full re-research)
- AD HOC: if Mongolia is removed from FATF "increased monitoring" list (would trigger threshold review); if any AML amendment published

## Next worked example

→ `03-retention-research-cross-jurisdiction.md` — researching retention across 5 jurisdictions for a multi-region product
