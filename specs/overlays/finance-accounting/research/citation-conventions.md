---
doc: overlays/finance-accounting/research/citation-conventions
type: research-method
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Citation Conventions for Regulator + Statute References

> A citation in your ZeeSpec must be **durable** (next reviewer can verify in 5 years), **specific** (down to article/paragraph), and **dated** (version-pinned). This file defines the format.

## The minimum citation block

For every jurisdictional fact in your spec (threshold, deadline, retention, definition), include this block adjacent to the fact:

```
> **Source:** <Document title (original language) + English title if different>
> <Issuing authority> (<jurisdiction>), <document type>
> <Article / Section / Rule number>
> <Version / amendment date>
> URL: <stable URL>
> Retrieved: <YYYY-MM-DD>
> [Optional] Web-archive snapshot: <URL>
> [Optional] Local archive: <file path>
```

### Filled example

```
> **Source:** Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль
> (Anti-Money Laundering / Counter-Financing of Terrorism Law)
> State Great Khural (Parliament) of Mongolia, primary statute
> Art. 11.1.1 (Cash transaction reporting threshold)
> Consolidated version as of 2017-10-26 amendment
> URL: https://legalinfo.mn/law/details/11103
> Retrieved: 2026-05-18
> Web-archive snapshot: https://web.archive.org/web/20260518/legalinfo.mn/law/details/11103
> Local archive: compliance-source-archive/2026-05-18-mn-aml-art-11.pdf
```

## Inline-citation short form (within INV/HW text)

When the full block is in a separate section, inline citations can be brief:

```
INV-KYC-04 — CTR auto-flag for cash transactions ≥ 20,000,000 MNT.
Per Mongolia AML/CFT Law Art. 11.1.1 (2017-10-26 consolidated).
[See Source block: SRC-AML-MN-2017]
```

A `SRC-AML-MN-2017` is a short ID you assign per source; details collected in a separate "Sources" section at end of file OR in a project-wide `_meta/regulatory-source-registry.md`.

## Source registry pattern

For a multi-module project, maintain a single source registry that all specs reference:

`_meta/regulatory-source-registry.md`:

```markdown
# Regulatory Source Registry

> Single source of truth for regulator + statute citations used across all
> ZeeSpec finance modules. Update when sources change; modules cite via
> `SRC-XXX-YYY-VVVV` short IDs.

## Mongolia

### SRC-AML-MN-2017
**Title (orig):** Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль
**Title (EN):** Anti-Money Laundering / Counter-Financing of Terrorism Law
**Authority:** State Great Khural (Parliament) of Mongolia
**Type:** Primary statute
**Original enactment:** 2013-05-31
**Last amendment in our citation:** 2017-10-26
**URL:** https://legalinfo.mn/law/details/11103
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18 (6 months)
**Owner:** [compliance officer name]

### SRC-SEC-MN-2005
**Title (orig):** Үнэт цаасны зах зээлийн тухай хууль
**Title (EN):** Securities Markets Law
**Authority:** State Great Khural (Parliament) of Mongolia
**Type:** Primary statute
**Original enactment:** 2005-12-29
**Last amendment in our citation:** 2013-12-26
**URL:** https://legalinfo.mn/law/details/10141
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

### SRC-INVFUND-MN-2013
**Title (orig):** Хөрөнгө оруулалтын сангийн тухай хууль
**Title (EN):** Investment Fund Law
**Authority:** State Great Khural (Parliament) of Mongolia
**Type:** Primary statute
**Original enactment:** 2013-10-03
**URL:** https://legalinfo.mn/law/details/9404
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

### SRC-FRC-NAVRULE-2021
**Title:** ЗГТ-ийн NAV тооцоолох журам / FRC NAV Calculation Resolution
**Authority:** Санхүүгийн зохицуулах хороо (FRC)
**Type:** Implementing regulation (Resolution № 47 of 2021)
**Issued:** 2021-XX-XX
**URL:** https://frc.mn/resolutions/2021-47/
**Retrieved:** 2026-05-18
**Re-check due:** 2026-11-18

## EU

### SRC-AMLD6-EU-2024
**Title:** Directive (EU) 2024/1640 on the mechanisms to be put in place by Member States for the prevention of money laundering and terrorist financing (AMLD6)
**Authority:** European Parliament + Council
**Type:** Directive
**Adopted:** 2024-05-31
**Transposition deadline:** 2027-07-10
**URL:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024L1640
**Retrieved:** 2026-05-18

## US

### SRC-BSA-US-1970
**Title:** Bank Secrecy Act (31 U.S.C. §§ 5311-5332)
**Authority:** US Congress
**Type:** Primary statute
**URL:** https://www.govinfo.gov/app/details/USCODE-2023-title31/USCODE-2023-title31-subtitleIV-chap53-subchapII
**Retrieved:** 2026-05-18

[... more sources ...]
```

This registry sits alongside the rest of `_meta/` and gets updated by each research session.

## Pinning the version

A law evolves through:
1. Original enactment
2. Amendment 1
3. Amendment 2
4. ... etc.
5. Most-recent consolidated text

Citations should specify WHICH version you mean. Patterns:

| Pattern | When to use |
|---------|-------------|
| `Law X (as enacted 2013-05-31)` | Historical reference; rarely needed in live spec |
| `Law X (as amended 2017-10-26)` | Pin to specific amendment |
| `Law X (consolidated as of 2017-10-26)` | Latest version including amendments up to that date |
| `Law X (current version)` | ⚠️ Ambiguous; avoid in formal citations |
| `Law X (in force YYYY-MM-DD)` | Pin to point-in-time effective date |

When in doubt: **"consolidated as of <latest amendment date>"** is the most useful for live spec.

## URL stability strategies

URLs rot. Mitigations:

### Strategy 1 — Statute database permalink

Use the official database's permanent identifier rather than UI URL:

- ✅ `https://legalinfo.mn/law/details/11103` (permanent law ID 11103)
- ⚠️ `https://legalinfo.mn/?action=law&details=11103&print=true` (UI URL; may break)

### Strategy 2 — Web Archive snapshot

Save https://web.archive.org snapshot of the page on the date you retrieved:

```bash
# Trigger archive on demand:
curl -s "https://web.archive.org/save/https://legalinfo.mn/law/details/11103" | grep "X-Cache-Lookup"
```

Then cite both the original URL + the snapshot URL.

### Strategy 3 — Local archive

Save a PDF of the page locally:

```bash
# Chrome headless example:
google-chrome --headless --disable-gpu --print-to-pdf=mn-aml-2026-05-18.pdf \
  "https://legalinfo.mn/law/details/11103"
```

Store in `compliance-source-archive/<jurisdiction>/<date>-<topic>.pdf`. Encrypted at rest if your org policy requires.

### Strategy 4 — Cite the formal document name + ID even if URL changes

Even if your URL rots, the citation `Mongolia AML/CFT Law Art. 11.1.1 (consolidated 2017-10-26)` is unambiguous; the next reviewer can search for the law by name + version + article.

## Translation conventions

When the original source is non-English:

```
> **Original (Mongolian):**
> 11.1. Мэдээллийн нэгжид мэдээлэх ёстой бэлэн мөнгөний гүйлгээ:
> 11.1.1. 20,000,000 (хорин сая) төгрөгтэй тэнцэх буюу түүнээс дээш дүнтэй
>         бэлэн мөнгөний гүйлгээ;
>
> **English translation (informal):**
> 11.1. Cash transactions that MUST be reported to the [Financial Intelligence
>       Unit]:
> 11.1.1. Cash transactions of 20,000,000 (twenty million) MNT or equivalent
>         or higher;
>
> **Translator:** [your name], informal translation 2026-05-18.
> Disclaimer: original Mongolian text is authoritative. For legal use,
> consult a sworn translator OR commission an official translation from
> the regulator.
```

### Rules for translations in spec

1. **Always include the original text.** Translation is for reader convenience; the original is what binds.
2. **Note who translated + when.** Translations age + improve.
3. **Add a disclaimer.** ZeeSpec is engineering documentation; legal nuance may require a sworn translator.
4. **Prefer official translations** when available (FATF reports, IMF country assessments, OECD reviews often translate national laws).
5. **Flag terminology decisions** — e.g., "Translated 'Мэдээллийн нэгж' as 'Financial Intelligence Unit' per FATF Mongolia evaluation 2017 (paragraph X)."

## Date formats

Use ISO 8601 throughout: `YYYY-MM-DD`. Avoid jurisdictional formats (DD/MM/YYYY vs MM/DD/YYYY) in spec citations.

Exception: when quoting the original document, use its native format alongside ISO. E.g., "2013/05/31" (Mongolian convention) → `2013-05-31` (ISO for spec).

## Cross-referencing within a spec

When INV-X-04 depends on a fact established in HW-X-09:

```markdown
INV-X-04 — Foo invariant
[...]
Cross-ref: depends on HW-X-09 retention policy (which cites SRC-AML-MN-2017 Art. 14.3)
```

This way readers can trace from any invariant back to its statutory source via the source registry.

## "Re-validated YYYY-MM-DD" markers

After your annual re-validation:

```markdown
### INV-KYC-04 — CTR auto-flag for cash transactions ≥ 20,000,000 MNT
Status: ✅ IMPL
Source: SRC-AML-MN-2017 Art. 11.1.1

**Re-validated 2027-05-18:** Source URL still resolves; version still
2017-10-26 consolidated; threshold value 20,000,000 MNT unchanged.

**Re-validated 2028-05-18:** Source URL resolves; consolidated version
updated to 2027-XX-XX amendment; threshold value UNCHANGED.

**Re-validated 2029-05-18:** Threshold AMENDED to 30,000,000 MNT per
amendment 2028-09-15. INV updated; see Gap-KYC-R4-03 for migration plan.
```

This audit trail lets the next reviewer see the validation history.

## Bad citation examples (do not do these)

❌ "Per AML law" — which law? which jurisdiction? which version?

❌ "Per the regulator's rules" — which rule? which regulator?

❌ "I read on frc.mn that CTR is 20M" — URL? page? date? article?

❌ "Standard practice in industry is 7-year retention" — not a citation; industry practice ≠ law

❌ "Per ChatGPT" — AI is a research aid, not a source

❌ "Per a meeting with FRC official on 2024-XX-XX" — informal conversations are not citable; if material, request a formal written response or guidance note

❌ "Per legal counsel" without document on file — ask counsel to put it in writing; file the memo

❌ "Per Wikipedia" — Wikipedia is starting point, not citation

## Good citation examples (do these)

✅ "Per Mongolia AML/CFT Law (Мөнгө угаах... тухай хууль) Art. 11.1.1, consolidated version as of 2017-10-26 amendment, URL legalinfo.mn/law/details/11103, retrieved 2026-05-18."

✅ "Per FRC Resolution № 47 of 2021 on NAV calculation, URL frc.mn/resolutions/2021-47/, retrieved 2026-05-18, local archive compliance-source-archive/mn-frc-nav-2021.pdf."

✅ "Per US BSA 31 USC § 5313(a) (Currency Transaction Reports), URL govinfo.gov/app/details/USCODE-2023-title31..., retrieved 2026-05-18."

✅ "Per EU AMLD6 (Directive 2024/1640) Art. 32 (CDD measures), adopted 2024-05-31, transposition deadline 2027-07-10, URL eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024L1640, retrieved 2026-05-18."

## Next

→ `R4-regulatory-research-agent.md` — agent prompt for automated research
→ `examples/` — full worked examples using these citation conventions
