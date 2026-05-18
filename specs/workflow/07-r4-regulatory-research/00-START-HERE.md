---
doc: workflow/07-r4-regulatory-research/00-START-HERE
type: workflow-research-entry
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any project where spec claims depend on external authority (regulator, standard-setter, statute, government agency)
---

# R4 Regulatory Research — Entry Point

> **Domain-agnostic methodology** for discovering, citing, and re-verifying claims in your ZeeSpec that depend on EXTERNAL authority (laws, regulations, standards, government agency rules, court decisions).
>
> Applies equally to:
> - **Financial services** (regulator: SEC/ESMA/FCA/MAS/FRC; statutes: securities law, AML law)
> - **Healthcare** (regulator: FDA/HHS/MHRA/EMA; statutes: HIPAA, GDPR Article 9, MDR)
> - **Government / public-sector** (regulator: GSA/FedRAMP authority; statutes: FISMA, ISO 27001)
> - **Privacy / data protection** (regulator: ICO/CNIL/EDPB/CPPA; statutes: GDPR/CCPA/DPDPA)
> - **Tax** (authority: IRS/HMRC/local tax authority; tax codes)
> - **Labor / employment** (authority: DOL/HSE; labor codes)
> - **Telecommunications** (regulator: FCC/Ofcom/MCRA; spectrum allocations)
> - **Insurance** (regulator: NAIC/EIOPA; solvency frameworks)
> - **Energy** (regulator: FERC/Ofgem; grid codes)
> - **Any other regulated domain** with statutes + implementing regulations + supervisory authority

## Why this exists

A ZeeSpec that says **"X threshold is N"** without citing the source + date is **incomplete** — the law changes, the threshold may change, and the next reviewer cannot verify. Examples across domains:

- Finance: "CTR threshold = 20M MNT" → needs source citation to AML statute Art. X
- Healthcare: "Patient data retention = 7 years" → needs source citation to HIPAA § XXX OR national health-records law
- Government: "Encryption-at-rest required for FedRAMP Moderate" → needs source citation to NIST SP 800-XX OR FedRAMP control catalog
- Privacy: "Right-to-erasure response within 30 days" → needs source citation to GDPR Art. 12
- Tax: "Withholding rate 10% on dividend payments to non-residents" → needs source citation to tax code + applicable treaty

Without R4 research:
- AI agents hallucinate thresholds + deadlines
- Spec drifts from current law (laws change; spec doesn't)
- Reviewer cannot verify the claim ("where did you get that?")
- Compliance audit fails when inspector asks for the underlying authority

R4 gives you a **repeatable workflow** to ground every external-authority claim in a verifiable, dated, version-pinned citation.

## Position in the ZeeSpec workflow chain

```
R4 (regulatory research) → produces baseline of jurisdictional facts
                ↓
B1 (quantitative drift)  → verify entity counts + LOC against production code
                ↓
R3 (deep verification)   → line-by-line verify every spec claim against code
                ↓
R1 (algorithm review)    → catch race conditions + invariant gaps
R2 (compliance review)   → verify against R4 baseline + check anti-patterns
                ↓
Apply findings → spawn task chips for production fixes
```

R4 differs from R2:
- **R2** verifies the spec's compliance claims against EXISTING knowledge
- **R4** verifies the underlying authority itself (laws change; R4 catches it)

R4 typically runs:
- **BEFORE R1+R2** when authoring a new module (provides verified baseline)
- **ANNUALLY** for existing modules (catch law amendments)
- **ON DEMAND** when a reviewer suspects a claim is stale
- **WHEN PORTING** to a new jurisdiction (research = main work of porting)

## When to use R4

| Scenario | Use R4? |
|----------|---------|
| Authoring a new ZeeSpec module with external-authority dependencies | ✅ YES — research before writing INV/HW entries |
| Re-authoring (Tier 0 → Tier 1) | ✅ YES — verify all external claims still current |
| Annual / quarterly spec re-validation | ✅ YES — authorities change; re-check |
| Porting overlay to new jurisdiction | ✅ YES — research = main work of porting |
| Implementing a code feature using already-researched spec | ⚠️ Use existing research; don't re-research |
| Reviewing someone else's spec (R1/R2) | ✅ YES — verify their citations are current |
| Production bug investigation | ⚠️ Only if hypothesis involves jurisdictional/authority misunderstanding |
| Spec that has NO external authority dependencies | ❌ No — R4 is overhead for pure-internal logic |

## The methodology in one paragraph

For every external-authority claim in your spec:
1. **Locate** the authoritative source (regulator website OR statute database OR standard-setter publication OR implementing regulation)
2. **Evaluate** the source (current, official, machine-readable, dated, version-tracked)
3. **Capture** the citation (URL + retrieved-on date + article/section + threshold/rule + your translation if non-English)
4. **Cross-check** against ≥1 corroborating source (international standard OR comparative jurisdiction OR previous version)
5. **Document** in the spec with a citation block the next reviewer can follow
6. **Schedule re-check** at appropriate interval (laws change; thresholds change; URLs rot)

## Read order

For first-time setup (~3 hours total):

**Foundation (read first):**

1. **This file** (orientation; ~15 min)
2. `01-regulatory-research-workflow.md` — the 6-phase method in detail (~30 min)
3. `02-source-evaluation.md` — assess whether a source is trustworthy + current (~20 min)
4. `03-citation-conventions.md` — format citations so they're durable (~20 min)
5. `04-R4-agent-prompt.md` — agent prompt template (domain-agnostic, parametrized; ~15 min)
6. `05-source-cheatsheet.md` — starting URLs per jurisdiction (~30 min skim; reference later)

**Advanced strategy (read once methodology basics are clear):**

7. `06-re-validation-strategy.md` — keeping citations current; annual re-check workflow (~25 min)
8. `07-conflict-resolution.md` — when authorities disagree; 8 types of conflict + decision protocol (~25 min)
9. `08-multi-jurisdiction-strategy.md` — MAX rule + per-customer profile + cross-border transfer (~30 min)
10. `09-amendment-tracking.md` — proactive monitoring; watch list pattern; consultation papers (~25 min)
11. `10-translation-pitfalls.md` — modal-verb drift; false friends; terminology log (~20 min)

**Then apply via worked examples (overlay-specific):**

- `overlays/finance-accounting/research-examples/` — 4 finance research sessions:
  - `01-frc-investment-fund-regulation.md`
  - `02-mongolia-aml-law-research.md`
  - `03-retention-research-cross-jurisdiction.md` (multi-jurisdiction worked)
  - `04-mongolia-lending-research.md` (most recent; R4 producing a module spec)
- (future) `overlays/healthcare/research-examples/`
- (future) `overlays/government/research-examples/`
- (future) `overlays/privacy/research-examples/`

For AI agents asked to do regulatory research:

1. `04-R4-agent-prompt.md` — copy-paste agent prompt; parameterize for your domain + jurisdiction
2. Domain-relevant worked example from the appropriate overlay's `research-examples/`
3. `02-source-evaluation.md` — to know which sources to trust
4. `03-citation-conventions.md` — to produce well-formatted output
5. For re-validation tasks specifically: `06-re-validation-strategy.md` § "R4 agent re-validation mode"
6. For amendment scanning: `09-amendment-tracking.md` § "R4 amendment-tracking mode"

## Sources you'll consult (universal hierarchy)

### Tier 1 (authoritative — always cite these)

- **Primary statute** — actual law text (consolidated current version)
  - Source: jurisdiction's official statute database
  - Examples: legalinfo.mn (Mongolia), eur-lex.europa.eu (EU), govinfo.gov (US), legislation.gov.uk (UK), sso.agc.gov.sg (Singapore)
- **Regulator's implementing regulations** — sub-statutory rules issued under the law
  - Examples (finance): SEC Rules, FCA Handbook, ESMA Guidelines, FRC Resolutions
  - Examples (healthcare): HHS regulations, FDA CFR Title 21, EMA Guidelines
  - Examples (privacy): EDPB Guidelines, ICO Codes of Practice
- **Standard-setter publications** — when the standard is referenced by statute
  - Examples: IFRS (finance accounting), NIST SP 800-XX (US government cybersecurity), ISO 27001 (infosec)
- **Regulator guidance notes** — non-binding but persuasive interpretation
- **Court decisions / enforcement actions** — interpretation of edge cases

### Tier 2 (corroborating — cite for context)

- **International standards** that shape national law
  - Finance: FATF Recommendations, IOSCO Principles, Basel III
  - Healthcare: WHO standards, ICH guidelines
  - Privacy: APEC Privacy Framework, OECD Privacy Guidelines
- **Comparative jurisdiction** — what EU/US/UK do for the same topic
- **Standard-setter publications referenced by regulator** (when ancillary)
- **Authority's annual reports / supervisory disclosures** — for trend / interpretation

### Tier 3 (with caution — cite alongside Tier 1)

- **Industry / law-firm summaries** (DLA Piper, Linklaters, Davis Polk legal briefings)
- **Wikipedia + general news** — useful for context; verify against Tier 1 before citing
- **Translation services** (Google Translate, DeepL) — first read; always cite the original-language source + provide your translation
- **Authority's FAQ pages** — convenience interpretation; cite alongside the underlying rule

### Tier 4 (NEVER cite as authoritative)

- Forum posts (StackOverflow, Reddit)
- Lawyer blog posts > 2 years old without verification
- AI chatbot output (use AI to find sources, then verify the sources)
- "I asked the regulator informally" — informal conversations are not citable; if material, request a formal written response or guidance note
- Internal Slack/email exchanges asserting "X is the rule"

## Output of R4 research

Every R4 task produces:

1. **Research log entry** (per `01-regulatory-research-workflow.md` Phase 6) — what you looked for, where, what you found
2. **Citation pack** for each fact (per `03-citation-conventions.md`) — URL + retrieved-on + section + your interpretation
3. **Spec edits** — INV/HW/glossary entries updated with citations
4. **Re-check schedule** — when to verify this fact again (typically 6-12 months)
5. **(If significant change) gap entry** — file as Gap-MOD-R4-NN

## Common R4 questions across domains

These come up repeatedly across regulated domains:

| Question | Where to look first |
|----------|--------------------|
| What's the threshold for X in jurisdiction Y? | Primary statute → implementing regulation (most-recent amendment) |
| What's the filing/notification deadline? | Same source as threshold — usually adjacent provisions |
| What's the retention/recordkeeping window? | Primary statute + sectoral law + tax law (take MAX) |
| Who is the supervising authority? | Statute § "competent authority" / implementing decree |
| What's the penalty for non-compliance? | Penalty/sanctions chapter of the statute |
| What's the formal definition of [concept]? | Statute § "Definitions" |
| When was the law most recently amended? | Official statute database (track amendment history) |
| What does the international standard say? | Standard-setter publication (FATF/IOSCO/ISO/IFRS/WHO/NIST) |
| What does a comparable jurisdiction do? | Sibling-regulator website + statute database |
| Has there been recent enforcement action interpreting this? | Regulator's enforcement-action archive |

## Mistakes to avoid (universal)

1. **Citing a regulator's homepage** for a specific rule — link to the specific page/document
2. **Skipping the date** — "Per regulator guidance" is not a citation; include guidance date + retrieved date
3. **Translating without preserving original** — always cite the original-language source even if you translate
4. **Assuming international standard = national law** — international standards are not directly binding; your jurisdiction's transposition is
5. **Treating regulator FAQ as binding** — FAQs are convenience; primary statute + implementing regulation are binding
6. **Not capturing the document date** — authorities have versions; pin the version
7. **Ignoring repealed law** — your spec may refer to a section that's been repealed; check current status
8. **Solo research on critical compliance items** — for material decisions, get a real lawyer / compliance officer / domain expert to confirm. ZeeSpec helps you document; it does not replace expert advice.

## Cross-domain examples — same R4 method, different sources

The 6-phase R4 workflow is the SAME regardless of domain. Only the source URLs + authority names change. Worked examples per domain:

| Domain | Worked examples |
|--------|-----------------|
| **Financial services** | `overlays/finance-accounting/research-examples/01-frc-investment-fund-regulation.md`, `02-mongolia-aml-law-research.md`, `03-retention-research-cross-jurisdiction.md`, `04-mongolia-lending-research.md` |
| Healthcare | (future) `overlays/healthcare/research-examples/01-hipaa-phi-research.md`, etc. |
| Government / FedRAMP | (future) `overlays/government/research-examples/01-fedramp-controls.md`, etc. |
| Privacy / GDPR | (future) `overlays/privacy/research-examples/01-gdpr-art-17-erasure.md`, etc. |

The finance examples can serve as **structural templates** even for non-finance domains — same 6-phase method; substitute the Tier 1 source URLs.

## Next

→ `01-regulatory-research-workflow.md` — the 6-phase method
→ `04-R4-agent-prompt.md` — parametrized agent prompt
