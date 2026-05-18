---
doc: overlays/finance-accounting/research/source-evaluation
type: research-method
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Source Evaluation — Trust + Currency + Authoritativeness

> Not all regulator-adjacent sources are equal. This file defines a 4-tier hierarchy + checklist questions to assess whether a source belongs in your spec citation.

## The 4-tier hierarchy (recap from 00-START-HERE.md)

| Tier | Examples | Use in spec? |
|------|----------|--------------|
| **Tier 1 — Authoritative** | Primary statute (legalinfo.mn / eur-lex / govinfo.gov); regulator implementing regulations; regulator guidance notes | ✅ CITE DIRECTLY |
| **Tier 2 — Corroborating** | FATF Recommendations; IOSCO Principles; Basel framework; sibling-jurisdiction equivalents; standard-setter publications (IFRS Foundation) | ✅ CITE FOR CONTEXT; not as primary basis |
| **Tier 3 — With caution** | Industry summaries (Linklaters Mongolia briefing); Wikipedia; news; translation services; AI chatbot output (use to find sources, never cite output directly) | ⚠️ CITE ALONGSIDE Tier 1; never alone |
| **Tier 4 — Never cite** | Forum posts; lawyer blogs > 2y old; informal regulator conversations; "someone told me" | ❌ DO NOT CITE |

## The 7 evaluation questions

For any source you're considering citing, answer these in order. Any "no" pushes you down a tier or out entirely.

### Q1: Is the publisher the issuing authority itself?

- ✅ "Posted on frc.mn under Resolutions, signed by FRC chairman" → Tier 1
- ✅ "Posted on legalinfo.mn, official statute database" → Tier 1
- ⚠️ "Quoted in a Linklaters legal briefing" → Tier 3 (find original on regulator site → upgrade to Tier 1)
- ⚠️ "Translated by an industry association" → Tier 3 (find original + your own translation)
- ❌ "From a forum post claiming to be the regulator" → Tier 4

### Q2: Is the document current?

- ✅ "Consolidated version dated 2024-XX-XX, marked 'in force'" → Tier 1
- ✅ "Issued 2023-XX-XX with effective date 2024-01-01" → Tier 1
- ⚠️ "Issued 2018, no amendment history shown" → Tier 1 IF you also verify no amendments. Search for "amendments to <law>"
- ⚠️ "Dated 2010, no status indicator" → Tier 3 until you confirm currency. Often you'll find the law was amended multiple times since.
- ❌ "Marked 'repealed'" or "marked 'superseded by X'" → Tier 4 for current research; you may still cite for historical context

### Q3: Is the document version-tracked?

A good Tier 1 source shows: (original-enactment-date, list-of-amendments, current-consolidated-version). If a source shows only one date with no amendment history, you cannot know if it's current — push to Tier 2 until verified.

### Q4: Is the document machine-readable (or at minimum, copy-pasteable text)?

- ✅ HTML page with selectable text + URL anchors for each article → easy to cite specific provisions
- ✅ PDF with text layer (not image-scan) → can extract exact wording
- ⚠️ PDF image scan only → can read but cannot copy-paste; risk of transcription error. Manually transcribe AND save the PDF
- ❌ Audio recording of a regulator briefing → not citable (no provision-level reference)

### Q5: Is the document on the regulator's permanent record (or has a stable URL)?

- ✅ URL pattern like `regulator.gov/resolutions/2024-Q3-R047/` (year + ID) → stable
- ✅ Statute database with permanent law ID (`legalinfo.mn/law/details/11103`) → stable
- ⚠️ URL with query string (`?docid=xxx`) → may break on site redesign; capture web.archive.org snapshot
- ⚠️ News-style URL (`regulator.gov/news/2024-03-15-amendment-announcement`) → news archive may rotate; PDF the page
- ❌ URL behind login or paid wall → not citable in public spec (cite the formal name + ID; provide separate access if reviewer needs to verify)

### Q6: Is the document in a language you (or your reviewer) can verify?

- ✅ Document in English (or your team's working language) → directly readable
- ✅ Document in local language + you have native-speaker on team → readable, capture exact text
- ⚠️ Document in language requiring machine translation → cite original + your translation + flag for native-speaker review
- ❌ Document in language unreadable to your team + reviewer pool → do not cite as primary; find a translated authoritative version OR commission translation OR find a sibling jurisdiction's equivalent

### Q7: Does the document distinguish "in force" vs "consolidated unofficial" vs "draft"?

Statute databases sometimes serve multiple versions:
- **In-force consolidated** = authoritative current version → ✅ cite
- **Pending amendment (draft)** = not yet in force → ⚠️ cite ONLY for prospective planning, never as current obligation
- **Historical version** = was in force at past date → cite for historical analysis, mark clearly

If the document doesn't say which, find another source that does.

## Source-trust matrix

After answering Q1-7, place the source on this matrix:

| Q1 issuer | Q2 current | Q3 versioned | Q4 readable | Q5 stable URL | Q6 language | Q7 in-force | Final tier |
|:---------:|:----------:|:------------:|:-----------:|:-------------:|:-----------:|:-----------:|:----------:|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **Tier 1 (ideal)** |
| ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | Tier 1 (with caveat: verify no amendments) |
| ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | Tier 1 (with caveat: PDF scan; transcribe carefully) |
| ⚠️ (industry summary citing Tier 1) | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | Tier 3 (use to FIND the Tier 1 original, then cite that) |
| ✅ | ❌ (old, no amendment trace) | ❌ | ✅ | ✅ | ✅ | ❌ | Tier 4 (not citable as current; may cite for history) |
| ❌ (forum post) | — | — | — | — | — | — | **Tier 4 (never cite)** |

## Common source classes per jurisdiction

### Mongolia (pilot)

| Source | Typical tier |
|--------|--------------|
| legalinfo.mn (Mongolian Official Legal Information Database) | Tier 1 |
| frc.mn (FRC official site) | Tier 1 for FRC own publications |
| Specific FRC resolutions (Тогтоол) | Tier 1 |
| FRC announcements / press releases | Tier 2 (corroborating; cite alongside the formal resolution) |
| frc.mn FAQ page | Tier 2 (helpful interpretation; not binding) |
| Translated by Asian Development Bank / IMF | Tier 2 |
| Translated by domestic law firms (Lehman Law, Anderson & Anderson Mongolia) | Tier 3 |
| Wikipedia "Financial Regulatory Commission of Mongolia" | Tier 3 (for context only) |
| News (montsame.mn) | Tier 3 |

### EU

| Source | Tier |
|--------|------|
| eur-lex.europa.eu (EU Official Journal + consolidated texts) | Tier 1 |
| esma.europa.eu (ESMA Guidelines + Q&As) | Tier 1 for ESMA publications |
| National regulator (BaFin, AMF, etc.) websites | Tier 1 for that regulator's rules |
| EBA Reports + Guidelines | Tier 1 |
| Trade associations (EFAMA, ALFI) | Tier 2-3 (industry interpretation) |

### US

| Source | Tier |
|--------|------|
| govinfo.gov (US Code + CFR) | Tier 1 |
| sec.gov (SEC Rules + Final Releases) | Tier 1 |
| FINRA Rulebook | Tier 1 |
| FinCEN Advisories | Tier 1 (binding guidance) |
| Federal Register | Tier 1 (rulemaking + comments) |
| Law firm summaries (Davis Polk, Sullivan & Cromwell) | Tier 2-3 |
| Bloomberg / S&P regulatory feeds | Tier 2 |

### UK

| Source | Tier |
|--------|------|
| legislation.gov.uk | Tier 1 |
| fca.org.uk (FCA Handbook) | Tier 1 |
| Bank of England (PRA Rulebook) | Tier 1 |
| HMT / Treasury consultations | Tier 1 for binding outcomes |

(Full per-jurisdiction source URL list in `other-jurisdictions-cheatsheet.md`.)

## Specific evaluation traps to avoid

### Trap 1: Confusing "draft amendment" with "in force"

EU directives go through proposal → trilogue → adoption → transposition deadline. A "proposed AMLD7" is not law until adopted + transposed by member states. Always check status.

### Trap 2: Old guidance superseded by new

ESMA may issue Guidelines in 2018, then a Q&A in 2020 that effectively supersedes the 2018 Guidelines for a specific question. Always check the regulator's published list of "currently applicable" guidance.

### Trap 3: Treating regulator-website FAQ as binding

FAQs are interpretive aids. The binding source is the underlying rule. If FAQ contradicts the rule, the rule wins (and you should ask the regulator to clarify).

### Trap 4: Citing the law's NUMBER without the date

"Per Securities Markets Law" is incomplete. "Per Securities Markets Law (2005, last amended 2013-12-26)" is complete. Numbers/names get reused; dates pin the version.

### Trap 5: Citing only the consolidated text without checking the amendment chain

A consolidated text reflects the latest version. But if you need to know "when did this provision take this form?" you need the amendment that added/modified it. Capture both.

### Trap 6: Translation drift

Machine translation of "shall" vs "must" vs "should" often loses precision in either direction. For critical compliance provisions, get a human translator OR find an official translation by an international body (IMF, World Bank country reports, OECD reviews often include translations).

### Trap 7: PDFs that look authoritative but aren't

A PDF "circulated by the regulator" via email is not necessarily the published version. Always trace back to the regulator's official publication URL. If the only available source is "PDF in email from someone at the regulator," push to Tier 3 and request the regulator publish it formally.

## Verifying a citation in 60 seconds

Before pasting a citation into your spec:

1. **Open the URL** — does it load?
2. **Check the date** — is the version date visible? Does it match what you cited?
3. **Search for the threshold value** — e.g., "20,000,000" — does the page contain it? At the article you cited?
4. **Check "in force" status** — green / "current" / "consolidated" indicator?

If all 4 pass, cite. If any fail, re-research.

## Output

Source evaluation is mostly INTERNAL discipline; not all of it needs to be documented in the spec. But for material citations (anything driving a HW-REG-* constraint or a P0 invariant):

Add a `Source-Evaluation` block to your research log:

```markdown
### Source-Evaluation: Mongolia AML/CFT Law Art. 11.1.1

- Q1 issuer: ✅ legalinfo.mn (Government of Mongolia official)
- Q2 current: ✅ consolidated as of 2017-10-26 amendment
- Q3 versioned: ✅ amendment history visible
- Q4 readable: ✅ HTML with selectable Cyrillic text
- Q5 stable URL: ✅ permanent law-detail ID 11103
- Q6 language: ✅ Cyrillic + we have native-speaker on team
- Q7 in-force: ✅ "Хүчинтэй" status indicator
- Result: Tier 1 (ideal); cite directly

- Web archive snapshot saved: web.archive.org/web/2026XXXX/legalinfo.mn/law/details/11103
- PDF saved locally: compliance-source-archive/2026-05-18-aml-law-art-11.pdf
```

## Next

→ `citation-conventions.md` — how to format the citation in your spec
→ `regulator-research-workflow.md` Phase 4 — triangulation
