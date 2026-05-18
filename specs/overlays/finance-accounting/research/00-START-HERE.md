---
doc: overlays/finance-accounting/research/00-START-HERE
type: research-workflow-entry
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Research Methodology — Entry Point

> **Why this exists.** ZeeSpec finance modules require concrete jurisdictional facts: regulator names, statute citations, thresholds (CTR/STR), retention windows, filing deadlines, KYC tier requirements, capital adequacy ratios. These are NOT in code. They live in:
>
> 1. **Regulator websites** (frc.mn, sec.gov, esma.europa.eu, fca.org.uk, ...)
> 2. **Statute databases** (legalinfo.mn, eur-lex.europa.eu, legislation.gov.uk, ...)
> 3. **Implementing regulations** (FRC журам, SEC Rules, FCA Handbook, ESMA Guidelines)
> 4. **International guidance** (FATF Recommendations, IOSCO Principles, Basel framework)
> 5. **Tax authority sites** (gasa.gov.mn, irs.gov, hmrc.gov.uk)
> 6. **Court decisions / enforcement actions** (for interpretation of edge cases)
>
> A spec that says "CTR threshold = 20M MNT" without citing the law section + date is **incomplete** — the law changes, the threshold may change, and the next reviewer cannot verify.
>
> This methodology gives you a **repeatable workflow** to discover, cite, and re-verify regulator + statute facts so your spec stays grounded.

## When to use this methodology

| Scenario | Use research? |
|----------|---------------|
| Authoring a new finance module ZeeSpec | ✅ YES — research before writing INV/HW entries |
| Re-authoring (Tier 0 → Tier 1) | ✅ YES — verify all jurisdictional claims still current |
| Annual / quarterly spec re-validation | ✅ YES — laws change; re-check |
| Porting overlay to new jurisdiction | ✅ YES — research = main work of porting |
| Implementing a code feature | ⚠️ Use the already-researched spec; don't re-research from scratch |
| Reviewing someone else's spec (R1/R2) | ✅ YES — verify their citations are current |
| Production bug investigation | ⚠️ Only if hypothesis involves jurisdictional misunderstanding |

## The methodology in one paragraph

For every jurisdiction-specific fact in your spec:
1. **Locate** the authoritative source (regulator website OR statute database OR implementing regulation)
2. **Evaluate** the source (is it current, official, machine-readable, dated)
3. **Capture** the citation (URL + retrieved-on date + law article + threshold value + your translation if non-English)
4. **Cross-check** against ≥1 secondary source (international standard OR comparative jurisdiction OR previous version)
5. **Document** in the spec with a citation that the next reviewer can follow
6. **Schedule re-check** at appropriate interval (laws change; thresholds change; URLs rot)

## Read order

For first-time setup:

1. **This file** (orientation)
2. `regulator-research-workflow.md` — the 6-phase method in detail
3. `source-evaluation.md` — how to assess whether a source is trustworthy + current
4. `citation-conventions.md` — how to format citations so they're durable
5. `other-jurisdictions-cheatsheet.md` — starting URLs for 9 jurisdictions
6. `examples/01-frc-investment-fund-regulation.md` — full worked example: researched FRC fund regulations + how they ended up in the spec
7. `examples/02-mongolia-aml-law-research.md` — full worked example: researched Mongolia AML law + how thresholds + deadlines were captured
8. `examples/03-retention-research-cross-jurisdiction.md` — comparative worked example: researched retention windows across 5 jurisdictions for a multi-region product

For AI agents asked to do regulatory research:

1. `R4-regulatory-research-agent.md` — copy-paste agent prompt template
2. The relevant example for the jurisdiction/topic
3. `source-evaluation.md` — to know which sources to trust
4. `citation-conventions.md` — to produce well-formatted output

## Why a separate R4 phase?

ZeeSpec core has B1 + R3 + R1 + R2:

| Phase | Focus |
|-------|-------|
| B1 | Quantitative drift (entity counts, LOC) |
| R3 | Production code line-by-line |
| R1 | Algorithm + race conditions |
| R2 | Compliance + cross-module |

R2 verifies the spec's compliance claims against EXISTING knowledge (regulator + law). **R4 verifies the regulator + law itself** — is the spec author's claim about FRC журам actually correct? Is the threshold they cited the current one? Has the law been amended since?

R4 is **independent of code**. It looks outward (regulator website, statute) rather than inward (production code).

R4 typically runs:
- BEFORE R1+R2 when authoring a new module (so R1+R2 have a verified baseline)
- ANNUALLY for existing modules (catch law amendments)
- ON DEMAND when a reviewer suspects a jurisdictional claim is stale

## Sources you'll consult

### Tier 1 (authoritative — always cite these)

- **Primary statute** — the actual law text (e.g., AML/CFT law, Securities Markets Law). Source: jurisdiction's official legal database (e.g., legalinfo.mn for Mongolia, eur-lex.europa.eu for EU, legislation.gov.uk for UK)
- **Regulator's implementing regulations** — sub-statutory rules issued under the law (FRC журам, SEC Rules, FCA Handbook). Source: regulator's official website
- **Regulator guidance notes** — non-binding but persuasive interpretation (FRC зөвлөгөө, ESMA Guidelines). Source: regulator website

### Tier 2 (corroborating — cite for context)

- **International standards** — FATF Recommendations, IOSCO Principles, Basel III. These shape national law.
- **Comparative jurisdiction** — what EU/US do for the same topic (useful when your jurisdiction's specifics are unclear)
- **Standard-setter publications** — IFRS Foundation, FASB, ISA standards
- **Tax authority guidance** — for retention windows + withholding rules

### Tier 3 (use with caution — cite alongside Tier 1)

- **Industry summaries** (Linklaters Mongolia briefing, Norton Rose financial-services overviews)
- **Wikipedia + general news** — useful for context; verify against Tier 1 before citing in spec
- **Translation services** (Google Translate, DeepL) — useful for first read; cite the original-language source + provide your translation

### Tier 4 (NEVER cite as authoritative)

- Forum posts
- Lawyer blog posts older than 2 years
- AI chatbot output (use AI to find sources, then verify the sources)
- "I asked the regulator informally" (always have the formal answer or guidance note)

## Output of research

Every research task produces:

1. **Research log entry** (per `regulator-research-workflow.md` Phase 6) — what you looked for, where you looked, what you found
2. **Citation pack** for each fact (per `citation-conventions.md`) — URL + retrieved-on + law section + your interpretation
3. **Spec edits** — INV/HW/glossary entries updated with citations
4. **Re-check schedule** — when to verify this fact again (typically 6-12 months)
5. **(If significant change) gap entry** — file as Gap-MOD-R4-NN

## Common research questions

These come up repeatedly when authoring finance specs:

| Question | Where to look first |
|----------|--------------------|
| What's the CTR threshold in jurisdiction X? | Primary AML statute → implementing regulation (most-recent amendment) |
| What's the STR filing deadline? | Same source as CTR — usually adjacent provisions |
| What's the record retention window? | AML statute + tax law + sector statute (often differ; take the MAX) |
| What KYC tiers does our regulator recognize? | Regulator's implementing regulation OR guidance note |
| Who is the FIU? | AML statute § "competent authority" / implementing decree |
| What's the sanctions list source for our jurisdiction? | UN list (always) + regulator's designated-persons list |
| What's the NAV reporting deadline? | Investment fund law + regulator's fund-reporting regulation |
| What's the minimum capital for license type X? | Securities/banking law + regulator's licensing regulation |
| What languages must we provide customer communications in? | Consumer-protection statute + sectoral consumer-disclosure rules |
| When was the AML law last amended? | Official statute database (track amendment history) |

## Mistakes to avoid

1. **Citing a regulator's homepage** (https://www.frc.mn/) for a specific rule — link to the specific document/page
2. **Skipping the date** — "Per FRC AML guidance" is not a citation; "Per FRC AML guidance dated 2024-03-15, retrieved 2026-05-18" is
3. **Translating without preserving original** — always cite the original-language source even if you translate
4. **Assuming international standard = national law** — FATF Recommendations are not directly binding; your jurisdiction's transposition is
5. **Treating regulator FAQ as binding** — FAQs are convenience; primary statute + implementing regulation are binding
6. **Not capturing the date of the document** — laws have versions; your citation should pin the version
7. **Ignoring repealed law** — your spec may be referring to an old law section that has been repealed; check current status
8. **Solo research on critical compliance items** — for material decisions, get a real lawyer or compliance officer to confirm. ZeeSpec helps you document; it does not replace legal advice.

## Next

→ `regulator-research-workflow.md` — the 6-phase method
