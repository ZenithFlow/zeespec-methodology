---
doc: examples/overlays/finance-accounting/research-examples/03-retention-research-cross-jurisdiction
type: research-worked-example
overlay: finance-accounting
example_topic: Retention research across 5 jurisdictions (Mongolia, EU, US, UK, Singapore)
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Worked Example 3 — Cross-Jurisdiction Retention Research

> Full worked example: a fintech is planning to operate across 5 jurisdictions (Mongolia HQ, EU subsidiary, US subsidiary, UK subsidiary, Singapore subsidiary). They need ONE retention policy that satisfies ALL jurisdictions, OR per-jurisdiction policies. The spec author runs comparative R4 research across all 5. End-to-end: ~4 hours of research → multi-jurisdiction retention HW table + per-region INV variants.

## Context

- **Project:** Multi-region investment platform; HQ Mongolia; subsidiaries in EU (Frankfurt), US (NYC), UK (London), Singapore
- **Module being authored:** Data retention policy module (cuts across all finance modules)
- **Spec author:** [name], engineer
- **Reviewer:** [name], compliance officer (multi-jurisdiction qualified)
- **Date:** 2026-05-18

## Phase 1 — Scope (45 min)

### Cross-jurisdiction research questions

1. Q1: KYC/CDD record retention — minimum window per jurisdiction
2. Q2: Transaction record retention — minimum window per jurisdiction
3. Q3: Audit log retention — minimum window per jurisdiction
4. Q4: Anchor date — when does the clock start? (relationship end / transaction date / customer last touch / etc.)
5. Q5: After retention window, can / must data be deleted? (privacy law)
6. Q6: Are there sector-specific retention extensions? (tax, accounting, securities)
7. Q7: Cross-border data transfer mechanisms — what's needed for our cross-jurisdiction backup / DR?
8. Q8: If multiple jurisdictions overlap (e.g., EU customer of Mongolia HQ entity), which retention wins?

### Mapping to spec

- Q1-Q4 → HW-RET-* (retention windows + anchor dates per jurisdiction)
- Q5 → HW-RET-* + INV-PRIV-* (post-retention deletion obligation)
- Q6 → adds to base retention via MAX rule
- Q7 → HW-DATA-* (transfer mechanism: SCC / BCR / adequacy)
- Q8 → governance rule + per-customer retention computation

## Phase 2 — Source map (60 min)

| Q# | Jurisdiction | Source | URL | Article |
|----|--------------|--------|-----|---------|
| Q1 | Mongolia | AML/CFT Law | https://legalinfo.mn/law/details/11103 | Art. 14.1 |
| Q1 | EU | AMLD6 (Directive 2024/1640) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024L1640 | Art. 26 (retention) |
| Q1 | US | BSA + 31 CFR 1010.430 | https://www.govinfo.gov/app/details/CFR-2023-title31-vol3/CFR-2023-title31-vol3-sec1010-430 | § 1010.430(a) |
| Q1 | UK | MLR 2017 (SI 2017/692) | https://www.legislation.gov.uk/uksi/2017/692/regulation/40 | Reg. 40 |
| Q1 | Singapore | MAS Notice on AML/CFT for fund managers (SFA04-N02) | https://www.mas.gov.sg | § 7 (record-keeping) |
| Q2-Q3 | (same sources as Q1; usually adjacent provisions) | | | |
| Q5 | Mongolia | (no specific privacy statute as of 2026; AML wins) | n/a | |
| Q5 | EU | GDPR Art. 17 + Art. 6(1)(c) (legal-obligation basis) | https://eur-lex.europa.eu/eli/reg/2016/679/oj | Art. 17, Art. 6 |
| Q5 | US | (no federal privacy law; state-by-state) | various | |
| Q5 | UK | UK GDPR Art. 17 + DPA 2018 | https://www.legislation.gov.uk/ukpga/2018/12 | Art. 17, ss. various |
| Q5 | Singapore | PDPA s. 25 (retention limitation) | https://sso.agc.gov.sg/Act/PDPA2012 | § 25 |
| Q6 (tax/accounting) | (per jurisdiction tax authority + company law) | | | |
| Q7 | EU | GDPR Ch. V (transfers) | | Ch. V |
| Q7 | US | Privacy Shield invalidated; current SCC route via EU adequacy | | |
| Q7 | UK | UK adequacy with EU (interim) + own SCCs | | |
| Q7 | Singapore | PDPA Cross-Border Transfer Rules | | |

## Phase 3 — Primary read (90 min)

### Q1: KYC record retention by jurisdiction

#### Mongolia
**Source:** AML/CFT Law Art. 14.1 (already researched in Example 2)
**Window:** 7 years
**Anchor:** Customer relationship end date

#### EU AMLD6
**Source:** Directive (EU) 2024/1640 Art. 26
**Text (Art. 26.1):**
> Obliged entities shall retain the following documents and information
> for a period of 5 years after the end of the business relationship with
> the customer or after the date of an occasional transaction:
> (a) all documents and information obtained to fulfil customer due
> diligence requirements [...]

**Window:** 5 years
**Anchor:** End of business relationship OR date of occasional transaction
**Extension (Art. 26.2):** Member States may extend up to 10 years.

#### US BSA / 31 CFR 1010.430
**Source:** 31 CFR § 1010.430(a) + § 1010.410 (specific to AML records)
**Text:**
> All records that are required to be retained by this chapter shall be
> retained for a period of five (5) years.

**Window:** 5 years
**Anchor:** Date of the document (varies by record type; for CDD typically from relationship end)
**Note:** SOX adds 7-year requirement for public companies' accounting records (separate from AML); see Q6.

#### UK MLR 2017
**Source:** Regulation 40 of SI 2017/692
**Text:**
> 40(1) Subject to paragraph (3), a relevant person must keep the records
> specified in paragraph (2) for at least 5 years beginning on the date on
> which... (a) the business relationship ends; or (b) the occasional
> transaction is completed.

**Window:** 5 years
**Anchor:** Business relationship end OR occasional transaction completion

#### Singapore MAS SFA04-N02 § 7
**Source:** MAS Notice SFA04-N02 (specific to fund managers)
**Window:** 5 years
**Anchor:** From the date of the document or end of business relationship (whichever is later)

### Summary table

| Jurisdiction | KYC retention | Anchor |
|--------------|---------------|--------|
| Mongolia | **7 years** | Relationship end |
| EU AMLD6 | 5 years (extensible to 10) | Relationship end OR occasional tx |
| US BSA | 5 years | Document date / relationship end |
| US SOX (public co) | 7 years | Accounting period end |
| UK MLR 2017 | 5 years | Relationship end / tx completion |
| Singapore MAS | 5 years | Document date / relationship end |

### Q5: Post-retention deletion obligation

| Jurisdiction | Post-retention deletion? |
|--------------|--------------------------|
| Mongolia | Not statutorily required to delete (no privacy law as of 2026) but recommended best practice |
| EU GDPR | **REQUIRED** (Art. 17 + Art. 5(1)(e) — storage limitation). Legal basis to retain expires; must delete |
| US (federal) | No federal requirement; state laws (CCPA) require honoring deletion requests subject to legal-retention exceptions |
| UK GDPR | **REQUIRED** (same as EU GDPR mechanism) |
| Singapore PDPA | **REQUIRED** under s. 25 retention limitation (must cease retention when no longer necessary) |

**Critical insight:** EU + UK + Singapore have AFFIRMATIVE deletion obligation after retention period. Mongolia does NOT. If you operate across all 5:
- For EU/UK/SG customers: MUST delete after retention window
- For Mongolia customers: MAY keep longer
- For data subjects in both (e.g., EU citizen with Mongolia entity): apply stricter rule (delete per EU)

### Q6: Sector-specific extensions

#### Tax / accounting (per jurisdiction)

| Jurisdiction | Tax retention | Accounting retention | Source |
|--------------|---------------|----------------------|--------|
| Mongolia | 7 years (tax law) | 7 years (company law) | Mongolia Tax Code |
| EU | Varies; typically 7-10 years (German HGB: 10y; French CCom: 10y) | Per company law | National variation |
| US | 7 years (IRS books) | SOX: 7 years for public co's | IRC + SOX |
| UK | 6 years (HMRC) | Companies Act: 6 years | HMRC + CA 2006 |
| Singapore | 5 years (IRAS) | Companies Act: 5 years | IRAS + CA |

#### Securities/sector-specific

- US Investment Advisers Act: 5 years per Rule 204-2
- EU MiFID II: 5 years (extensible to 7)
- UK FCA SYSC: 5 years (specific records 7 years)
- Singapore MAS SFA: 5 years

### Q7: Cross-border transfer mechanisms

For backup / DR replication across jurisdictions:

| From → To | Mechanism required |
|-----------|---------------------|
| EU → Mongolia | SCCs (Mongolia not adequacy-listed) + Transfer Impact Assessment |
| EU → US | EU-US Data Privacy Framework (Schrems II compliant since 2023) + DPF certification by US recipient |
| EU → UK | Adequacy decision (UK adequate post-Brexit) |
| EU → Singapore | Adequacy not granted; SCCs + TIA |
| UK → others | UK IDTA (International Data Transfer Agreement) + UK SCCs |
| US → others | No US-side restrictions; receiving-jurisdiction rules apply |
| Mongolia → others | No Mongolia-side restrictions; receiving-jurisdiction rules apply |
| Singapore → others | PDPA Cross-Border Transfer rules |

## Phase 4 — Triangulate (30 min)

### FATF perspective

FATF Recommendation 11: minimum 5-year record-keeping. All 5 jurisdictions meet or exceed; Mongolia's 7-year is most conservative.

### Convergence

Universal 5-year MINIMUM emerges across all jurisdictions. 7-year covers all jurisdictions' direct AML requirements PLUS Mongolia + US SOX + tax in some.

### Multi-jurisdiction rule

**MAX rule:** for any data subject potentially subject to multiple jurisdictions, retain for the MAX applicable retention window. Then delete per the strictest deletion obligation.

Example: EU citizen who's a customer of Mongolia HQ entity making transactions in 2026:
- Mongolia AML: 7 years from relationship end
- EU GDPR: 5 years AML + must delete after (storage limitation)
- → Result: retain 7 years (Mongolia satisfaction), delete at year 7 (EU obligation kicks in once Mongolia obligation expires)

## Phase 5 — Convert to spec INV/HW (45 min)

### Multi-jurisdiction retention HW

```markdown
### HW-RET-01 — Per-jurisdiction retention policy with MAX rule
Status: ⚠️ MUST be ✅ IMPL

For every retainable record (KYC document, transaction, audit log), compute
retention_until as MAX(applicable_jurisdictions_retention_window) where
applicable jurisdictions include:
- Customer's primary jurisdiction (per customer.legal_residence)
- Entity-of-record's home jurisdiction (per entity_of_record.licensed_in)
- Any jurisdiction where transaction occurred (per transaction.jurisdiction)

Default mapping (verified 2026-05-18 — see source registry entries
SRC-AML-MN-2017, SRC-AMLD6-EU-2024, SRC-BSA-US-1970, SRC-MLR-UK-2017,
SRC-MAS-SFA04-N02-SG):

| Jurisdiction | KYC retention | Tx retention | Anchor |
|--------------|---------------|--------------|--------|
| Mongolia | 7 years | 7 years | Relationship end (KYC) / Tx date (Tx) |
| EU | 5 years (10 max) | 5 years | Relationship end / Tx date |
| US BSA | 5 years (7y SOX if applic.) | 5 years (7y SOX) | Doc date / Tx date |
| UK | 5 years | 5 years | Relationship end / Tx date |
| Singapore | 5 years | 5 years | Doc date / Tx date |

Engineering:
- Customer record carries applicable_jurisdictions[] (multi-select)
- At write time: compute retention_until = max(per-jurisdiction window
  applied to per-jurisdiction anchor)
- At relationship-end event: re-compute retention_until for KYC docs
- DB: retention_until column on every retainable record
```

```markdown
### HW-RET-02 — Post-retention deletion obligation honored
Status: ⚠️ MUST be ✅ IMPL for EU / UK / Singapore customers

For customers subject to EU GDPR / UK GDPR / Singapore PDPA: data MUST be
deleted after retention_until passes. This is an affirmative obligation
(not merely "may delete").

Engineering:
- After retention_until: customer record + all retainable docs/txs
  marked for deletion
- Privacy-deletion-worker (cron weekly): processes deletion queue;
  cascades to backup systems; emits PrivacyDeletionEvent for audit
- Edge case: if customer subject to BOTH Mongolia (no deletion req) AND
  EU (deletion req): EU obligation wins — delete
- Audit: PrivacyDeletionEvent stored separately (audit log retained
  beyond customer data; per IRS / SOX longer retention may apply
  for accounting-relevant audits)
```

```markdown
### HW-RET-03 — Cross-border transfer mechanism in place
Status: ⚠️ MUST be ✅ IMPL for all backup / DR replication

For any data flow that crosses jurisdictions (e.g., production-DB → backup-DB
in another region):

| Flow direction | Required mechanism |
|----------------|---------------------|
| EU → non-EU (incl. Mongolia, Singapore, US-non-DPF) | EU SCCs + TIA |
| EU → US (DPF participant) | EU-US Data Privacy Framework certification by recipient |
| EU → UK | Adequacy decision (UK adequate) |
| UK → non-UK | UK IDTA + UK SCCs (or adequacy where granted) |
| Singapore → non-SG | PDPA Cross-Border Transfer rules; recipient binding obligations |

Engineering:
- Document SCCs in place for every cross-region replication
- TIA (Transfer Impact Assessment) for each non-adequacy destination
- Annual review of transfer mechanisms (regulators add/remove adequacy)
- DR test must respect: backup region recipients honor SCC obligations
```

## Phase 6 — Capture (30 min)

### Source registry updates (5 entries)

[Per `citation-conventions.md` format for each of the 5 jurisdictions.]

### Research log entry

```markdown
## 2026-05-18 — Research session: Cross-jurisdiction retention

**Author:** [name]
**Duration:** ~4 hours
**Scope:** Q1-Q8 retention + deletion + transfer for 5 jurisdictions
**Sources consulted:** 5 primary statutes + 5 implementing regulations + GDPR + privacy laws

**Outcomes:**
- HW-RET-01: per-jurisdiction MAX rule
- HW-RET-02: deletion obligation honored where applicable
- HW-RET-03: cross-border transfer mechanism
- Per-jurisdiction summary table for spec
- Cross-jurisdiction MAX-rule algorithm in `how.md`

**Critical findings:**
1. Mongolia 7y is the longest of the 5; using it as default satisfies all
2. EU/UK/SG require POST-retention deletion (Mongolia does not) — multi-
   jurisdiction customers need deletion logic
3. EU→non-EU transfers require SCCs + TIA — DR + backup architecture
   must accommodate
4. US has no federal privacy-deletion obligation but CCPA + other states
   require honoring deletion requests subject to legal-retention exception

**Open follow-ups:**
- Q6 deeper: sector-specific (securities + insurance) retention for each
  jurisdiction; need full review for completeness
- US state privacy: 14 states have privacy laws as of 2026; per-state
  deletion may apply
- Adequacy decision changes: monitor EU Commission adequacy list quarterly

**Gap entries filed:**
- Gap-RET-R4-01 — US state privacy patchwork (🟠 P1; affects deletion logic)
- Gap-RET-R4-02 — Sector-specific extensions per jurisdiction (🟡 P2)

**Sign-off:** [compliance officer with multi-jurisdiction qualification]
              confirmed multi-jurisdiction rule + EU SCCs requirement,
              2026-05-18

**Re-check schedule:** 2026-08-18 (3 months; high regulatory activity in
                       privacy + AMLD6 transposition timeline)
```

## Lessons learned

1. **The MAX rule was non-obvious:** without comparative research, an engineer might apply only the home-jurisdiction (Mongolia 7y) or only the most-strict (EU deletion-after-5y), either of which is wrong.

2. **Mongolia 7y as default simplifies storage** but mismatches EU deletion obligation. Per-customer retention_until must consider applicable jurisdictions.

3. **EU-US DPF replaced Privacy Shield as of 2023** — older spec authors might still cite Privacy Shield. Always check current adequacy status.

4. **UK GDPR diverged from EU GDPR after Brexit** — but in practice still very similar. Watch for divergence as UK regulatory drift accelerates.

5. **AMLD6 transposition deadline is 2027-07-10** — Member States may transpose with national variations. Re-research per Member State once transposition lands.

6. **Cross-jurisdiction is the area where ChatGPT / generic AI is most misleading** — outdated guidance, mixed jurisdictions, simplifications. Always Tier-1 primary sources.

## Re-validation reminder

- 2026-08-18 (3-month check; AMLD6 transposition tracking)
- 2027-05-18 (annual; major laws + privacy decisions)
- AD HOC: any new privacy adequacy decision; AMLD6 Member State transposition; UK divergence event

## End of worked examples

These 3 examples (FRC investment-fund regulation; Mongolia AML law; cross-jurisdiction retention) cover the most-common R4 research patterns. For other jurisdictional facts, use the same 6-phase method.

## Cross-references

- `/specs/extended/workflow/07-r4-regulatory-research/00-START-HERE.md` — research methodology overview
- `/specs/extended/workflow/07-r4-regulatory-research/01-regulatory-research-workflow.md` — 6-phase method
- `extended/workflow/07-r4-regulatory-research/02-source-evaluation.md` — Tier 1-4 hierarchy
- `extended/workflow/07-r4-regulatory-research/03-citation-conventions.md` — citation format
- `/specs/extended/workflow/07-r4-regulatory-research/04-R4-agent-prompt.md` — agent prompt
- `extended/workflow/07-r4-regulatory-research/05-source-cheatsheet.md` — source URL map
