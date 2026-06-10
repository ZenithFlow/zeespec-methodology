---
doc: extended/workflow/07-r4-regulatory-research/10-translation-pitfalls
type: workflow-research-method
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain (especially multi-jurisdiction or non-English-native research)
---

# Translation Pitfalls — When Authority Sources Are Not in English

> **Domain-agnostic.** Most ZeeSpec teams have English as their working language. Many authoritative sources are NOT in English (Mongolian, Russian, Chinese, Japanese, German, French, Spanish, Arabic, etc.). Translation introduces drift. This file defines the **terminology discipline** that keeps translated citations trustworthy.

## The translation problem

A regulator publishes a rule in language X. You translate to English for your spec. Risks:

1. **Modal verb drift** — "shall" / "must" / "should" / "may" carry different binding force; mistranslation changes obligation
2. **False friends** — words that look similar in two languages but mean different things
3. **Legal terms with no direct equivalent** — must choose nearest match; explain disparities
4. **Acronyms that mean different things in different jurisdictions** — e.g., "CTR" = Currency Transaction Report (US) or Counter Transaction Reporting (some)
5. **Ambiguity that's clear in source language but lost in translation** — context disappears
6. **Translator bias** — translator might smooth over edges; legal meaning often lives in the edges
7. **Versioning of translations** — official translation may lag amendment by months/years
8. **Cultural / regulatory tradition embedded** — e.g., "shall in good faith" assumes legal-system context

Failure to manage these → spec says X; statute requires Y; production code does X → audit failure.

## The core discipline

For every non-English authority source:

```
1. CITE the original-language source
2. CAPTURE the exact original-language text (quote)
3. PROVIDE your English translation
4. DOCUMENT translator identity + date
5. NOTE terminology decisions explicitly
6. FLAG ambiguities for native-speaker review
7. SEPARATE legal-binding terms from interpretive language
```

The original is the LEGAL source. The translation is for READER convenience.

## Citation block for translated sources

Use this structure (per `03-citation-conventions.md`):

```markdown
> **Source (SRC-XXXX):**
> [Original title in source language] / [English title]
> [Authority + jurisdiction]
> [Article / Section]
> [Version date]
> URL: <stable URL>
> Retrieved: YYYY-MM-DD
>
> **Original text (Mongolian):**
> > [exact quote]
>
> **English translation (informal):**
> > [translation]
>
> **Translator:** [name OR "Google Translate" OR "machine + human review"]
> **Translation date:** YYYY-MM-DD
> **Terminology decisions:**
> - "X term" → translated as "Y" per [reference, e.g., FATF Mongolia MER 2017]
> - "Z term" left untranslated (proper noun)
>
> **Disclaimer:** Original [language] text is authoritative. For legal
> reliance, consult a sworn translator OR commission official
> translation from the regulator.
```

## Sourcing reliable translations

In descending preference:

### Tier 1A — Official translation by the issuing authority

Some regulators publish official translations. These are quasi-binding (still cite original, but the regulator's translation is highly trustworthy).

Examples:
- Some Mongolia regulators publish official English summaries of major laws
- EU regulations published officially in all 24 EU languages — all equally authoritative
- Singapore Statutes Online publishes some English versions of multi-language acts
- IFRS Foundation publishes standards in multiple languages — translations are governed

### Tier 1B — Official translation by an international body referencing the law

Examples:
- FATF Mutual Evaluation Reports include translated excerpts of national AML laws
- IMF country financial-sector assessments include translated regulatory snippets
- World Bank publications often include translations
- OECD country reviews often include translated tax law snippets

### Tier 2 — Translation by major law firm or industry body

Examples:
- Major international law firms (DLA Piper, Linklaters, etc.) translate national laws into English for industry clients
- Bar association publications
- Industry-association translations (sector-specific)

Quality varies; verify against Tier 1B where possible.

### Tier 3 — Machine translation + human review

Workflow:
1. Run machine translation (Google Translate, DeepL, Anthropic Claude, etc.) on the original
2. Have a native speaker on your team review for accuracy
3. Document the review in research log

For critical compliance items, MACHINE TRANSLATION ALONE IS NOT SUFFICIENT.

### Tier 4 — Solo machine translation (avoid for material items)

Acceptable for:
- Quick orientation reads
- Non-compliance-critical context

NOT acceptable for:
- INV/HW citation blocks for material compliance items
- Customer-facing disclosures
- Anything that creates legal obligation

## Common false friends + cross-language pitfalls

### English → Mongolian common pitfalls

| English | Naive Mongolian | Actual legal usage |
|---------|-----------------|---------------------|
| "shall" | "болно" (will be) | "ёстой" (must) for legal-obligation usage |
| "may" | "болно" | "болно" / "эрхтэй" — discretionary |
| "must" | "ёстой" | matches OK |
| "should" | "ёстой" | "ёстой" is too strong; "хийх нь зүйтэй" softer |
| "deemed" | "тооцох" (count as) | "хэмээн тооцох" — legal fiction |
| "officer" | "ажилтан" (worker) | "албан тушаалтан" — official |
| "subsidiary" | "охин компани" | "охин компани" matches |
| "good faith" | "сайн санаатай" | legal term-of-art; "шударга" or "сайн санаатай" depending on context |

### Mongolian → English common pitfalls

| Mongolian | Naive English | Better English |
|-----------|---------------|----------------|
| Үнэн ашиг хүртэгч | True benefit receiver | Beneficial owner |
| Сэжигтэй гүйлгээ | Suspicious transaction | Suspicious Transaction (STR/SAR) |
| Зээлийн мэдээллийн алба | Credit Information Office | Credit Bureau (ZEM) |
| Санхүүгийн зохицуулах хороо | Financial Regulatory Committee | Financial Regulatory Commission (FRC) — official name in English |
| Хяналт шалгалт | Inspection check | Supervisory examination (regulatory inspection) |
| Журам | Procedure / regulation | Regulation / Resolution (depending on issuing authority) |

### German → English common pitfalls

| German | Naive English | Actual legal usage |
|--------|---------------|---------------------|
| "soll" | "shall" | actually "should" (recommendation; weaker than "shall") |
| "muss" / "hat zu" | "must" | binding |
| "darf" | "may" | permissive |
| "Verordnung" | Regulation | matches |
| "Gesetz" | Law / Act | primary statute |
| "Verwaltungsakt" | Administrative act | individual agency decision (NOT general rule) |

### French → English common pitfalls

| French | Naive English | Actual legal usage |
|--------|---------------|---------------------|
| "peut" | may | permissive |
| "doit" | must | binding |
| "veille à" | watches over | shall ensure / oversee |
| "à charge de" | at charge of | responsibility falls on |

### Japanese → English common pitfalls

| Japanese | Naive English | Actual legal usage |
|----------|---------------|---------------------|
| ねばならない | must | binding |
| なければならない | must | binding (slightly different nuance) |
| とする | "set as" | legal fiction; deems X to be Y |
| 努める | endeavor | best-effort (NOT binding) — easy to mistranslate as "shall" |
| ものとする | "shall be" | technically permissive in some contexts |

### Chinese → English common pitfalls

| Chinese | Naive English | Actual legal usage |
|---------|---------------|---------------------|
| 应当 (yīngdāng) | should | mandatory in legal context |
| 可以 (kěyǐ) | may | permissive |
| 必须 (bìxū) | must | binding |
| 不得 (bùdé) | shall not | prohibition |

### Arabic → English common pitfalls

Arabic has subtle grammatical mood changes that affect binding force. Always have a legal Arabic translator (not general translator) review for compliance.

## Modal-verb framework

Build a modal-verb mapping table for each source language. Sample (Mongolian-English for AML domain):

```markdown
# Mongolian → English Modal Mapping (AML/compliance)

| Mongolian | English | Force | Examples |
|-----------|---------|-------|----------|
| ...ёстой | shall / must | BINDING | Art. 11.1.1 "...мэдээлэх ёстой" → "shall report" |
| ...үүрэгтэй | shall (obligation noun form) | BINDING | Art. 13.1 "...мэдэгдэх үүрэгтэй" → "shall notify" |
| ...болно | will be / shall | BINDING in legal context | Art. X "...тооцох болно" → "shall be deemed" |
| ...эрхтэй | may / has the right | PERMISSIVE | Art. Y "...татан буулгах эрхтэй" → "may revoke" |
| ...хориглоно | shall not / is prohibited | PROHIBITION | Art. Z "...үндэслэлгүйгээр... хориглоно" → "shall not... without basis" |
| ...болзошгүй | may / could possibly | INTERPRETIVE | Art. 13.2 "...мөнгө угаах зорилготой байж болзошгүй" → "may have the purpose of money laundering" (typology marker, not binding direct rule) |
```

Maintain per source language in `_meta/translation-glossary.md`.

## Terminology decision log

When you make a terminology decision (chose translation X for source term Y), DOCUMENT it. Future you + future reviewers need to follow your choices for consistency:

```markdown
# Terminology Decision Log (Mongolian AML/CFT)

| Source term | Chosen translation | Rationale | Decision date |
|-------------|---------------------|-----------|---------------|
| Мэдээллийн нэгж | Financial Intelligence Unit (FIU) | FATF Mongolia MER 2017 uses FIU; standard internationally | 2026-05-18 |
| Үнэн ашиг хүртэгч | Ultimate Beneficial Owner (UBO) | FATF Recommendation 24 terminology | 2026-05-18 |
| Журам | Resolution (when issued by FRC) / Procedure (general) | FRC's English self-translation uses "Resolution" | 2026-05-18 |
| Сэжигтэй гүйлгээ | Suspicious Transaction | FATF Rec 20 terminology; international STR/SAR | 2026-05-18 |
| Хяналт шалгалт | Supervisory examination | International banking-regulator standard | 2026-05-18 |
| Зээлийн мэдээллийн алба | Credit Bureau | "Credit Information Office" too literal; "Credit Bureau" is the industry term | 2026-05-18 |
```

This log lives in `_meta/translation-glossary.md`. Future R4 sessions REFERENCE the log; don't re-decide.

## Handling translation versioning

Translation drift can come from:

### Drift 1 — Source language amendment NOT yet translated

You translated 2017 version. Source amended 2022. The official English translation (if any) may not exist yet.

**Action:**
- ALWAYS verify against source language
- If only old translation available, your re-research must include the new source-language text

### Drift 2 — Multiple official translations exist with differences

E.g., EU regulations published in all 24 EU languages. All are equally authoritative. Sometimes they differ in nuance.

**Action:**
- Cite the language version most relevant to your jurisdiction (e.g., German version for German operations)
- For multi-jurisdiction operations, use English as primary; flag any discrepancies with national-language versions in research log

### Drift 3 — Translation provider changes (machine translation models update)

DeepL / Google Translate models update over time; same input may translate differently in 2026 vs 2024.

**Action:**
- Date your translations
- Re-translate during annual re-validation; compare to last translation
- If material drift detected, escalate to human translator

### Drift 4 — Industry terminology evolves

What was "anti-money laundering" 10 years ago may be called something else now in the field.

**Action:**
- Match to current FATF / IOSCO / standard-body terminology
- Update terminology log when consensus evolves

## Working with bilingual / multilingual sources

Some authorities publish bilingual official texts (Mongolia FRC sometimes publishes English summaries; Singapore is bilingual; Switzerland is multilingual).

When you find a bilingual official text:
- ALWAYS use the official English (Tier 1A) over your own translation
- Still cite the local-language version (legal authority)
- Note in research log that official English exists

If the English text says something different from the local-language text, the LOCAL-LANGUAGE text typically wins legally (some jurisdictions formally state this; some don't). Note discrepancies.

## R4 agent + non-English sources

When dispatching R4 for non-English sources:

```markdown
You are R4 — regulatory research specialist.

**Source language(s):** [specify]
**Your language proficiency:** [agent self-disclosure]

**Translation guidance:**
- ALWAYS include exact original-language quote in citation block
- For your English translation, note source (machine / your interpretation)
- Flag ambiguous modal verbs (e.g., "Mongolian 'болно' could be 'shall' or 'will be'; recommend native-speaker review")
- Reference existing terminology log at `_meta/translation-glossary.md` for prior decisions
- Add NEW terminology decisions to the log if you face one
- For critical legal items (criminal liability, mandatory deadlines), flag for human translator review
```

## Quality-control checklist for translated citations

Before pasting a translated citation into spec:

```
□ Original-language quote included verbatim
□ English translation provided
□ Translator identified (name OR machine OR machine+human)
□ Translation date captured
□ Modal verbs reviewed (matches binding force of original)
□ False friends checked (vs terminology log)
□ Acronyms reviewed (vs international-standard usage)
□ Disclaimer present ("original is authoritative")
□ Critical-compliance items: human translator reviewed if not already
□ Terminology decisions added to log if new
```

## Worked example — translation pitfall caught

**Original (Mongolian):** "...сэжигтэй гүйлгээний талаарх мэдээллийг мэдээллийн нэгжид нэн даруй, хамгийн оройдоо 24 цагийн дотор мэдэгдэх үүрэгтэй."

**First-draft machine translation:** "Information about suspicious transactions should be reported to the information unit immediately, at the latest within 24 hours."

**Pitfalls in first draft:**
1. "should" — too soft. Original "үүрэгтэй" = obligation noun, binding. Correct: "shall" or "MUST"
2. "information unit" — too literal. International standard: "Financial Intelligence Unit (FIU)"
3. "immediately, at the latest within 24 hours" — preserves dual constraint correctly

**Corrected translation:**
"Information about suspicious transactions shall be reported to the Financial Intelligence Unit (FIU) immediately, at the latest within 24 hours."

**Terminology log entry added:**
- "мэдээллийн нэгж" → "Financial Intelligence Unit (FIU)" per FATF MER 2017 terminology

**Spec INV impact:**
INV-KYC-05 "STR filed within 24 hours of suspicion" — HARD deadline (was potentially mis-classified as "should" / best-effort if first translation accepted).

## Anti-patterns

1. **Translating in isolation** — never consult terminology log → inconsistency across spec
2. **Using machine translation as final** for compliance-critical items
3. **Smoothing edges** — translator paraphrases for readability, loses legal precision
4. **Translating only the THE article you cite** — context from surrounding articles often essential
5. **Not capturing original text** — future reviewers can't verify your translation
6. **Treating English summary as authoritative** when the binding source is local-language original
7. **One-time translation, never re-checked** — translation drift accumulates
8. **No translator identification** — accountability impossible

## Cross-references

- `03-citation-conventions.md` — citation format requiring translation block for non-English sources
- `02-source-evaluation.md` — language is one of the 7 evaluation questions (Q6)
- `01-regulatory-research-workflow.md` Phase 3 — translation happens during primary read
- `_meta/translation-glossary.md` (your project) — terminology decision log

## Next

→ Back to `00-START-HERE.md` for navigation
→ Apply learnings via `01-regulatory-research-workflow.md`
