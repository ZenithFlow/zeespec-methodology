---
doc: workflow/07-r4-regulatory-research/01-regulatory-research-workflow
type: workflow-research-method
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain (finance / healthcare / government / privacy / tax / labor / telecoms / energy / etc.)
---

# The 6-Phase Regulatory Research Workflow

> **Domain-agnostic.** Time: 1-4 hours per topic depending on scope + domain/jurisdiction familiarity. Run when authoring a new module spec with external-authority dependencies, when porting to a new jurisdiction, or during annual re-validation.
>
> Worked examples per domain in the relevant overlay's `research-examples/` folder (finance examples available; healthcare/government/privacy planned).

## Overview

```
Phase 1: Scope        → What facts do I need? (1 hour list of questions)
Phase 2: Source map   → Where do these facts live? (authority URL + statute URL)
Phase 3: Primary read → Read the actual law / regulation / standard
Phase 4: Triangulate  → Cross-check against international standard / sibling source
Phase 5: Interpret    → Convert authoritative text into engineering invariants
Phase 6: Capture      → Cite + log + schedule re-check
```

> **Note on examples below:** the detailed Phase 3-5 examples use a **finance research scenario** (Mongolia AML/CFT Law Art. 11.1.1, CTR threshold 20M MNT) because it's the most fully-validated worked example to date. The **method itself is domain-agnostic**. To adapt for another domain:
>
> - Healthcare: replace "AML Law Art. 11" with "HIPAA § 164.312" or "GDPR Art. 9"; replace "FIU" with "OCR (Office for Civil Rights)" or "national data-protection authority"
> - Government / cybersecurity: replace with "NIST SP 800-53 Rev. 5" or "FedRAMP control catalog"; replace authority with "FedRAMP PMO" / "GSA"
> - Privacy: replace with "GDPR Art. 17 + Recital 65"; replace authority with "ICO / CNIL / EDPB"
> - Tax: replace with "US IRC § 6109" or "Mongolia Tax Code Art. X"; replace authority with "IRS / HMRC / GASA"
>
> The 6-phase shape + outputs (question list → source map → primary read → triangulation → interpretation → capture) is the same.

## Phase 1 — Scope your research questions (30-45 min)

Before opening any browser, write a numbered list of questions your spec needs to answer.

### Question categories

- **Identity:** Who is the regulator? Who is the FIU? Who issues licenses?
- **Definitions:** What counts as a "fund manager" / "broker-dealer" / "payment institution" under our jurisdiction's law?
- **Thresholds:** CTR threshold? STR deadline? Capital adequacy minimum? Reporting frequency?
- **Retention:** How long must we retain customer records? Transaction records? Audit logs?
- **Filing format:** What format does the FIU expect (XML, PDF, web portal)? What's the deadline?
- **Sanctions:** Which lists must we screen against? How is "designated person" defined?
- **Customer protection:** Disclosure requirements? Cooling-off periods? Suitability tests?
- **Audit + supervision:** What records must we provide on regulator inspection? What's the inspection frequency?

### Output of Phase 1

A markdown file `research/in-progress/<topic>-questions.md`:

```markdown
# Research questions — <topic>

## Identity
- Q1: Who is the primary securities regulator?
- Q2: Who is the FIU for AML?
- Q3: What's the licensing authority for asset managers?

## Definitions
- Q4: Definition of "investment fund" in our jurisdiction?
- Q5: Definition of "professional client" vs "retail client"?
- Q6: Definition of "PEP"?

## Thresholds (cite source + version!)
- Q7: CTR threshold for cash transactions?
- Q8: STR filing deadline?
- Q9: Retention window for customer records?
- Q10: Retention window for transaction records?
- Q11: Capital adequacy minimum for our license type?
[...]

## Per-INV mapping
- Q7 → drives INV-REG-05 (CTR auto-flag threshold)
- Q8 → drives INV-REG-04 / INV-KYC-05 (STR deadline)
- Q9, Q10 → drives HW-REG-09 (retention)
[...]
```

This list is your TODO for phases 2-5.

## Phase 2 — Map sources (15-30 min)

For each question, identify ONE Tier 1 source. Don't read yet; just locate.

### Source mapping template

```markdown
| Q# | Question | Source URL | Document title | Article/Section | Version date |
|----|----------|-----------|----------------|-----------------|--------------|
| Q7 | CTR threshold | https://legalinfo.mn/law/details/11103 | Мөнгө угаах... тухай хууль (2013/05/31, last am. 2017/10/26) | Art. 11.1 | 2017-10-26 |
| Q8 | STR deadline  | Same as Q7 | Same | Art. 13.4 | 2017-10-26 |
| Q9 | KYC retention | Same as Q7 | Same | Art. 14.3 | 2017-10-26 |
| Q10 | Transaction retention | Same + Company Law | Same | Art. 14.3 + Company Law Art. 38 | 2017-10-26 + 2011 |
[...]
```

### How to find Tier 1 sources

- **Statute database first.** For Mongolia: https://legalinfo.mn (Cyrillic search). For EU: https://eur-lex.europa.eu. For US: https://www.govinfo.gov/app/collection/uscode. For UK: https://www.legislation.gov.uk. For Singapore: https://sso.agc.gov.sg.
- **Then regulator's "Laws + Regulations" page.** Most regulators have a dedicated page listing applicable laws + their own implementing regulations. Bookmark this.
- **Search by topic word.** "anti-money laundering" / "мөнгө угаах эсрэг" — find the parent statute.
- **Trace the version chain.** Original law year → list of amendment years → current consolidated text. Many statute databases have "consolidated text" tabs; prefer those.
- **Save URLs in the source-map table**, NOT in your spec yet.

### Watch for these traps

- Regulator's homepage URL changes ≠ specific page URL change. Direct page URLs are more durable.
- Some jurisdictions only publish in local language. Plan time for translation in Phase 3.
- "Consolidated" version vs "as enacted" version — for live spec, use consolidated.
- Some implementing regulations live in regulator's "Resolutions" / "Тогтоол" archive, not on the main rules page.

## Phase 3 — Primary read (60-120 min)

Now read each source. Take notes IN PARALLEL with reading, not after.

### Read strategy

For each Tier 1 source:

1. **Read the TOC / Article index first.** Map the document's structure.
2. **Read the article(s) relevant to your question.** Often a question spans 2-3 articles (definition + obligation + penalty).
3. **Note the EXACT wording.** Translate if needed; preserve the original-language quote.
4. **Note cross-references within the source.** "Per Art. 5 of this Law" → also read Art. 5.
5. **Note the version + amendment history.** Statute databases usually show this; capture.

### Output of Phase 3

A markdown file `research/in-progress/<topic>-findings.md`:

```markdown
# Research findings — <topic>

## Q7: CTR threshold

**Source:** Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль (Mongolia AML/CFT Law)
**URL:** https://legalinfo.mn/law/details/11103
**Version:** Consolidated as of 2017-10-26 amendment
**Retrieved:** 2026-05-18

**Original text (Mongolian):**
> 11.1. Мэдээллийн нэгжид мэдээлэх ёстой бэлэн мөнгөний гүйлгээ:
> 11.1.1. 20,000,000 (хорин сая) төгрөгтэй тэнцэх буюу түүнээс дээш дүнтэй
> бэлэн мөнгөний гүйлгээ;

**My translation:**
> 11.1. Cash transactions that MUST be reported to the [Financial Intelligence
> Unit]:
> 11.1.1. Cash transactions of 20,000,000 (twenty million) MNT or equivalent
> or higher;

**Interpretation for spec:**
- Threshold: 20,000,000 MNT (single transaction)
- Currency: MNT exact; foreign-currency equivalent at official rate
- Trigger: cash transaction (physical currency; some near-cash equivalents
  per implementing regulation — see Q7a)
- Direction: both deposit + withdrawal? Per Art. 11.1 statute: any cash tx.
  Per FRC implementing rule (need separate research): probably yes both.

**Cross-references in statute:**
- Art. 4 defines "cash transaction"
- Art. 12 covers STR (separate threshold = any amount on suspicion)
- Art. 14 covers retention

**Follow-up:**
- Q7a: What does FRC implementing regulation say about aggregation?
       (multiple sub-threshold same day → CTR or no?)
- Need to research: FRC Resolution № X (link TBD)
```

### What to capture for EACH source

- Source title (in original language)
- URL (specific page, not homepage)
- Version + date
- Retrieved date
- Exact original-language text of the relevant provision
- Your translation (if non-English)
- Your interpretation (how it maps to engineering)
- Cross-references within the document
- Open follow-up questions

## Phase 4 — Triangulate (30-60 min)

Cross-check your Phase 3 findings against:

### Option A — International standard

Does FATF Recommendation X say the same thing? If FATF says "national law should set CTR threshold appropriate to risk," and your statute sets 20M MNT, the structure aligns. If FATF says "X must be reported within 30 days" and your statute says "24 hours," your statute is stricter (fine; jurisdictions can exceed FATF).

### Option B — Sibling jurisdiction

If you're researching for Mongolia FRC, check what EU AMLD or US BSA does for the same question. If they're aligned (e.g., all set CTR at "around $10K equivalent"), high confidence. If wildly different (your jurisdiction at 20M MNT = ~$7K vs US $10K), still fine — but flag for the spec author.

### Option C — Prior version of same statute

If the law was amended, what was the threshold BEFORE the amendment? If 20M MNT was raised from 10M MNT in 2017, your spec needs to note "as of 2017 amendment."

### Output of Phase 4

Append to `<topic>-findings.md`:

```markdown
## Triangulation for Q7

**FATF Rec 16** (Recommendation 16 on CTR equivalent): Yes, FATF requires
national CTR thresholds; ours at 20M MNT is within reasonable range.

**Comparable jurisdictions:**
- EU AMLD: €10,000 (~30M MNT at 2026 rates)
- US BSA: $10,000 (~30M MNT)
- Singapore: S$20,000 (~50M MNT)
- Our Mongolia: 20M MNT (~$7,000)

Mongolia's threshold is LOWER than EU/US/SG in USD terms, meaning more
transactions will trigger CTR. Operational impact: higher CTR volume than
US/EU analogues.

**Prior version:** Original 2013 statute set threshold at 10M MNT.
Amendment 2017-10-26 raised to 20M MNT. Source:
https://legalinfo.mn/amendment/2017/268
```

## Phase 5 — Interpret + convert to engineering invariants (30-60 min)

Now translate findings into ZeeSpec invariant / HW format ready to paste into your module.

### Conversion patterns

**Statutory threshold** → INV with status + citation:

```markdown
### INV-KYC-04 — CTR auto-flag for cash transactions ≥ 20,000,000 MNT
Status: ⚠️ MUST be ✅ IMPL

Per Mongolia AML/CFT Law Art. 11.1.1 (consolidated 2017-10-26 amendment;
source legalinfo.mn/law/details/11103, retrieved 2026-05-18): cash
transactions of 20,000,000 MNT or equivalent or higher MUST be reported
to the FIU within 5 business days (per Art. 11.3).

Engineering:
- Service: walletTransactionService.processDeposit() checks
           if amount >= 20_000_000 AND payment_method == CASH → flag
- DB: ctr_filing.threshold_mnt = 20_000_000 (configurable, defaulted)
- Retest: amendment to threshold value → spec re-validation

Re-check schedule: 6 months OR on any amendment to AML law.
```

**Statutory deadline** → INV + SLA + alert:

```markdown
### INV-KYC-05 — STR filed within 24 hours of suspicion
Status: ⚠️ MUST be ✅ IMPL — HARD deadline

Per Mongolia AML/CFT Law Art. 13.4 (consolidated 2017-10-26 amendment):
suspicious transaction reports MUST be filed within 24 hours from the
time of suspicion.

Engineering:
- Service: strFilingService.draft() captures suspicion_drafted_at
- Worker: every hour, check str_filings WHERE status=DRAFT AND
          drafted_at < NOW() - 12h → alert compliance officer (12h warning)
- Worker: every hour, check WHERE drafted_at < NOW() - 24h AND status!=FILED
          → 🚨 P0 escalation
- DB: str_filing.filed_within_24h BOOL — computed post-fact for KPI
- Tag: SLA-KYC-STR-24h
```

**Retention window** → HW + DB role permissions:

```markdown
### HW-KYC-09 — KYC document retention 7 years from relationship end
Status: ⚠️ MUST be ✅ IMPL

Per Mongolia AML/CFT Law Art. 14.3: customer due-diligence records
(KYC documents) must be retained for at least 7 years from the date the
customer relationship ends.

Engineering:
- DB: kyc_documents.retention_until = customer.relationship_ended_at + 7 years
- DB: REVOKE DELETE on kyc_documents FROM application_user
- Service: documentRetentionService.archive(): moves rows from hot
           kyc_documents → cold kyc_documents_archive when relationship
           ended_at > 1 year ago
- Service: documentRetentionService.purge(): deletes from cold archive
           when retention_until < NOW() (privacy law requires actual
           deletion after retention)
- Alert: any DELETE attempt on hot table → 🚨 P0
- Alert: any document past retention_until still present > 30 days → P1
        (privacy violation)
```

### Watch for these interpretation traps

- **Definition of "transaction"** — a single counter deposit vs an aggregate of 3 deposits same day. Statute often silent; implementing regulation specifies. Research the implementing regulation.
- **"Equivalent" for foreign currency** — at spot rate? At what time of day? Per FX rate provider? Usually defined in implementing regulation.
- **"From suspicion"** — what's the trigger event? Detection by typology engine? Manual flag by operator? Manager confirmation? Define clearly in spec.
- **"Business day" vs "calendar day"** — for deadlines. Statute should specify; if silent, assume business day per local custom.
- **Force majeure** — what happens if FIU portal is down? Most regulations require best-effort + immediate filing once available. Document the recovery procedure.

## Phase 6 — Capture + cite + schedule re-check (15-30 min)

### Capture into spec

For each INV/HW you authored in Phase 5:
1. Paste into the module's `what.md` (INV) / `gravity.md` (HW)
2. Include the FULL citation block (URL, version, retrieved date)
3. Note the source in the module's `CLAUDE.md` § Source documents
4. Add the open follow-up questions to `gaps.md`

### Log the research

Append to your project's `_meta/regulatory-research-log.md`:

```markdown
## YYYY-MM-DD — Research session: <topic>

**Author:** [your name]
**Duration:** N hours
**Scope:** [Phase 1 questions]
**Sources consulted:**
- Source A: URL, version
- Source B: URL, version

**Outcomes:**
- New invariants added: INV-X-NN, INV-X-NN+1, ...
- Updated invariants: INV-X-MM
- Open follow-ups: Q7a, Q12, Q14
- Gap entries filed: Gap-X-R4-NN

**Re-check schedule:** YYYY-MM-DD (6 months from today)

**Sign-off:** confirmed by [compliance officer / controller] on YYYY-MM-DD
              (for material findings)
```

### Schedule re-check

For each INV/HW with a citation:
- Default re-check: 12 months
- If law was recently amended (< 2 years ago) suggesting active legislative attention: 6 months
- If FATF / regulator has signaled upcoming change: 3 months OR until change announced
- If material to license / criminal risk: 6 months + compliance officer review

Add to your project's calendar / ticket system. Annual research re-validation should be a recurring event.

## Re-validation workflow (annual)

Once per year (or when triggered by news of law amendment):

1. Read the original research log entry
2. Re-visit each Tier 1 source URL
3. Check: has the page been updated? Different version date?
4. If yes → re-do Phase 3 for affected articles
5. If amendment changed a threshold / deadline / definition → update spec INV/HW + file as Gap-X-R4-NN
6. If no change → update "Retrieved" date on existing citations
7. Log the re-validation in `_meta/regulatory-research-log.md`

## What to do when the regulator's website changes

URL rot is common. Strategies:

1. **Capture web archive snapshot** of the original page at research time (web.archive.org). Save the snapshot URL alongside the original.
2. **Save PDFs locally** in a `compliance-source-archive/` folder (encrypted; this is regulator content, not customer data).
3. **Use DOI / official document IDs** where available (statute databases often have permanent IDs).
4. **Track via the statute database** (e.g., legalinfo.mn law/details/<ID>) rather than regulator's redirect-prone URLs.

## What to do when there's ambiguity

If after Phase 3+4, you're STILL unsure what the law requires (e.g., implementing regulation contradicts statute, or two articles seem to overlap):

1. File as `Gap-X-R4-NN` 🟠 P1 (research outstanding)
2. Set spec INV status to 🚧 DESIGN (don't rely)
3. Escalate: ask a real compliance officer or lawyer
4. Document in research log: "Q7 ambiguity → resolved by [lawyer] on YYYY-MM-DD with email/letter on file"

## Next

→ `source-evaluation.md` — how to assess whether a source is trustworthy
→ `citation-conventions.md` — citation format details
→ `examples/01-frc-investment-fund-regulation.md` — full worked example
