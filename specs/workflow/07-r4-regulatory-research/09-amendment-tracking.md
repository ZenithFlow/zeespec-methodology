---
doc: workflow/07-r4-regulatory-research/09-amendment-tracking
type: workflow-research-method
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain
---

# Amendment Tracking — Proactive Monitoring of Authority Changes

> **Domain-agnostic.** Annual re-validation (`06-re-validation-strategy.md`) is the SCHEDULED catch. Amendment tracking is the PROACTIVE catch — monitor authority sources continuously so material changes are detected when published, not 12 months later. This file defines the tracking strategy.

## Why proactive tracking matters

Annual re-validation is the floor. But:

- **Some amendments take effect with short notice** (30-90 days). Missing them = compliance failure.
- **Some amendments require code changes** (e.g., threshold lowered = config + UI + tests). Need lead time.
- **Some amendments are politically signaled** (consultation papers) months before adoption. You can prepare.
- **Enforcement actions reveal regulator priorities** even without formal amendment.

Cost of proactive tracking: ~1-2 hours/month per jurisdiction (with the right tools).
Cost of missing an amendment: from days of remediation (low-risk) to license suspension (high-risk).

## What to track

For each Tier 1 source in your `_meta/regulatory-source-registry.md`:

### Track per source

- **Amendment / revision** — formal change to the document
- **Newer version published** — consolidated text updated
- **Status change** — repealed, superseded, paused
- **Effective date approaching** — pre-announced amendment goes into force

### Track per regulator

- **New guidance / Q&A** — interpretive aids on existing rules
- **Consultation papers** — proposed amendments out for industry comment
- **Enforcement actions** — what is the regulator actually investigating?
- **Annual reports / supervisory disclosures** — regulator's stated priorities
- **Speeches / blog posts by senior officials** — early signals

### Track per international standard body

- **Standard revision** (e.g., NIST SP 800-53 Rev 5 → Rev 6; IFRS amendment)
- **Mutual evaluation reports** (e.g., FATF MERs change country status)
- **Working group outputs** (e.g., Basel Committee consultative documents)

### Track ecosystem

- **Legal news services** — major law firms publish daily updates
- **Industry associations** — sector-specific newsletters
- **Government gazette** — every jurisdiction has an official gazette for new laws
- **Court decisions** — cases interpreting cited statutes

## How to track (tooling spectrum)

### Tier 0 — Manual (smallest scope)

Best for: 1-3 jurisdictions, slow-moving domain, small team.

- Calendar event: monthly 30-min review of each regulator's "Latest" page
- Browser bookmarks for each Tier 1 source + regulator landing page
- Diff notes in research log when changes detected

**Pro:** No infrastructure.
**Con:** Manual; easy to skip.

### Tier 1 — RSS / email subscriptions

Most regulators publish RSS feeds OR offer email subscriptions for updates.

- Subscribe to each regulator's "What's new" / "News" feed
- Subscribe to government gazette for your jurisdictions
- Subscribe to standard-setter newsletters (IFRS, NIST, FATF, IOSCO)

Channel for routing:
- Personal email folder per jurisdiction
- Shared compliance inbox (better for team continuity)
- Slack channel via RSS integration

**Pro:** Push notifications; team-visible.
**Con:** Noisy; signal-to-noise tuning needed.

### Tier 2 — Compliance / RegTech services

Paid services that monitor + summarize regulatory changes:

- **Thomson Reuters Practical Law**
- **Bloomberg Compliance**
- **Wolters Kluwer CCH**
- **LexisNexis**
- **NICE Actimize / RegTech vendors** (specific to AML / financial)
- **Vialto Partners / KPMG / Big-4 firms** (regulatory monitoring services)

**Pro:** Pre-digested; usually with impact analysis.
**Con:** Cost (subscription); not always current; sometimes biased toward specific jurisdictions.

### Tier 3 — Custom monitoring pipeline

For mature compliance functions:

- Web-scraping or API integration with regulator sites
- Diff detection on key pages (statute database, regulator news)
- Alerts routed to compliance officer + engineering tech lead
- Versioned snapshots stored for evidence (web.archive.org or local)

Example pipeline:

```
Cron daily:
  for each watched URL:
    fetch current content
    compute hash
    if hash != last_seen_hash:
      create AlertEvent(url, old_hash, new_hash, fetched_at)
      slack.post(compliance-channel, AlertEvent)
      write current content to versioned-storage
```

Open-source tools: `changedetection.io`, `urlwatch`, custom Python/Node scripts.

**Pro:** Automatic; no missed signals; auditable history.
**Con:** Engineering effort to build + maintain; false positives from cosmetic changes.

## What triggers immediate action

Not every signal needs same urgency. Triage:

### Urgent (act within 24-72 hours)

- Amendment to a cited statute that takes effect < 60 days
- Court decision invalidating a regulator interpretation you rely on
- Enforcement action against a peer that reveals interpretation different from yours
- New sanctions designation matching your customer profile
- Regulator emergency advisory / directive

**Action:** Compliance officer immediate review + engineering ticket + spec update within 7 days.

### Moderate (act within 2-4 weeks)

- Amendment with > 60 day effective date
- Final guidance issued (binding interpretation)
- Standard body publishes revision in your domain
- Mutual evaluation report changes your jurisdiction's status

**Action:** R4 re-research the affected provisions; update spec; engineering ticket if code change needed.

### Watch (track but don't act yet)

- Consultation paper published (proposed amendment, not final)
- Speech by regulator official signaling future direction
- Court case pending (decision not yet issued)
- New government taking office (unclear priorities)
- Standard body working group output (draft)

**Action:** Note in research log; set re-check reminder; monitor for next phase.

### Routine (handle in next monthly review)

- Minor agency website updates
- Translations / language updates of existing rules
- Statistical reports / dashboards from regulator

**Action:** Note in research log if relevant; no spec change.

## Watch list template

Maintain in `_meta/amendment-watch-list.md`:

```markdown
# Amendment Watch List

> Active monitoring of authority sources for material changes.
> Update weekly during scheduled review.

## Currently watching (pending amendments / signals)

### Mongolia AML/CFT Law amendment proposal
- **Source:** Parliament forum (lawforum.parliament.mn/draft/XXX)
- **Status:** First reading 2026-04; expected adoption 2026-Q3
- **Key changes (per draft):** CTR threshold review; beneficial-owner expansion
- **Impact:** May require spec update; affects INV-KYC-04, INV-KYC-07
- **Next check:** 2026-06-15
- **Owner:** [name]

### EU AMLD6 transposition deadline approaching
- **Source:** EUR-Lex CELEX 32024L1640
- **Deadline:** 2027-07-10 (Member States must transpose by then)
- **Impact:** EU subsidiary specs need update; per-Member-State variation
- **Next check:** 2027-01-15 (start tracking national draft laws)
- **Owner:** [EU compliance lead]

### NIST SP 800-53 Rev 6 consultation
- **Source:** csrc.nist.gov
- **Status:** Public comment 2026-Q2
- **Impact:** Government-overlay future; not yet affecting current spec
- **Next check:** 2026-08-01
- **Owner:** [name]

## Triggered (action in progress)

### FRC Money Loan Activities Policy Council decision 2025-XX
- **Detected:** 2025-12-15 via regulator news feed
- **Action:** R4 re-research → INV-LOAN-02 (interest cap) updated 0.045 → 0.040
- **Engineering ticket:** LEND-345 (config + UI updated 2026-01-15)
- **Status:** ✅ Closed 2026-01-30

## Closed (handled; archived for reference)

[move triggered items here after closure]
```

## Source-of-truth — gazette + change log

Most jurisdictions publish official changes in a gazette (or equivalent):

| Jurisdiction | Gazette / official publication |
|--------------|--------------------------------|
| Mongolia | Засгийн газрын мэдээллийн нэгдсэн сайт / legalinfo.mn amendment chains |
| EU | Official Journal of the European Union (eur-lex.europa.eu) |
| US | Federal Register (federalregister.gov) + state registers |
| UK | The London Gazette + UK Legislation amendments |
| Singapore | Government Gazette (Singapore Statutes Online) |
| India | Gazette of India |
| Japan | Kanpō (官報) |
| Hong Kong | HK Government Gazette |
| Australia | Federal Register of Legislation amendment history |

For each watched jurisdiction:
- Subscribe to gazette updates (most have RSS / email)
- Filter to your sector/topics
- Triage per "What triggers immediate action" above

## Working with consultation papers

When a regulator publishes a consultation paper (proposed amendment out for industry comment):

1. **Read the consultation** (typically 30-60 page PDF)
2. **Identify which of YOUR INV/HW it would affect**
3. **Note the comment deadline** (usually 30-90 days)
4. **Optionally: submit a comment** (industry voice can shape final rule)
5. **Track the final-rule publication** (often 3-12 months after consultation closes)
6. **Re-research at final-rule publication** (final may differ from consultation)

Document in watch list:

```markdown
### MAS consultation on payment-services reform
- **Document:** MAS Consultation Paper P012-2026
- **URL:** https://www.mas.gov.sg/publications/consultations/2026/...
- **Comment deadline:** 2026-08-15
- **Affects:** wallet-settlement spec (INV-WAL-XX)
- **Status:** comment under review by our compliance team
- **Final rule expected:** 2027-Q1
- **Next check:** 2026-08-20 (post-deadline summary)
```

## Capturing amendment metadata

When an amendment lands, capture:

```markdown
### Amendment record: <statute name> <amendment date>

**Source URLs:**
- Final amendment text: <URL>
- Amendment summary (regulator): <URL>
- Industry analysis: <URL> (Tier 3)

**Effective dates:**
- Date adopted: YYYY-MM-DD
- Date published: YYYY-MM-DD
- Date effective: YYYY-MM-DD (key for compliance!)
- Transition period: [length, conditions]

**Changes (provision-by-provision):**
| Provision | Old | New | Impact on spec |
|-----------|-----|-----|----------------|
| Art. 11.1.1 | 20M MNT | 30M MNT | INV-KYC-04 update |
| Art. 13.4 | 24h | 12h | INV-KYC-05 update + SLA |

**Engineering impact:**
- Config changes: [list]
- Code changes: [list]
- Migration: [yes/no + plan]
- Customer notice: [yes/no + plan]

**Compliance review:**
- Reviewed by: [name]
- Date: YYYY-MM-DD
- Sign-off: ✅
```

## R4 amendment-tracking mode

Modify R4 agent to act as amendment scanner:

```markdown
You are R4 in AMENDMENT-TRACKING mode.

**Task:** Scan for amendments / new guidance / enforcement actions /
consultation papers since [last scan date YYYY-MM-DD] for the
following authorities + topics:

| Authority | URL | Topics |
|-----------|-----|--------|
| FRC Mongolia | https://www.frc.mn | AML, NBFI lending, fund regulation |
| Mongolbank | https://www.mongolbank.mn | Asset classification, banking |
| EU ESMA | https://www.esma.europa.eu | UCITS, MiFID II |
[...]

**For each authority:**

1. Visit "What's new" / "News" / "Press releases" page
2. List every new item since [last scan date]
3. For each item, classify:
   - 🚨 Urgent (amendment with < 60d effective)
   - 🟠 Moderate (amendment > 60d OR final guidance)
   - 🟡 Watch (consultation OR signal)
   - 🟢 Routine (cosmetic OR off-topic)
4. For urgent + moderate items: produce a summary with:
   - What changed
   - When effective
   - Which spec INV/HW would be affected
   - **Which existing ADR may be superseded by the amendment** (per § "Amendment → ADR cascade" below)
   - Recommended action

**Output:** Markdown report to be appended to
`_meta/amendment-watch-list.md`.

Time budget: ~30-60 min total across all authorities.

## Amendment → ADR cascade (R4 → R6 handoff)

When R4 detects an amendment that materially changes an existing INV/HW backed by an ADR, the cascade is:

```
R4 detects amendment
  (e.g., Mongolia AML threshold raised 20M → 30M MNT)
        ↓
R4 identifies affected ADR(s)
  (e.g., ADR-KYC-007 captured the 20M threshold decision)
        ↓
R4 recommends ADR action:
  - If amendment merely tightens a parameter → "amendment-driven ADR update":
    - Mark ADR-KYC-007 as Superseded
    - Dispatch R6 Mode A (per `09/05-R6-adr-curator-agent.md`) to draft new ADR-KYC-NNN+1
    - Cite the amendment as source
  - If amendment changes the structural decision → "authority-driven ADR superseder":
    - Full ADR re-author via R6
    - Cross-module impact check via R6 Mode D
        ↓
Human reviewer accepts ADR draft
  (validates that engineering team agrees with the codification)
        ↓
Spec update applied
  (INV/HW updated; engineering ticket if code change needed)
        ↓
Drift item marked RESOLVED with link to new ADR
```

This is the **authority-driven retroactive ADR pattern** — symmetric to the code-drift-driven retroactive ADR pattern in `workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`.

Without this cascade documentation, R4 would detect amendments but the ADRs they invalidate would silently remain marked Accepted.

## Conflict resolution: R4 detects amendment + R5 detects code already follows new value

Common scenario after amendment:
- R4 detects: law amended on 2028-03-15 (threshold raised 20M → 30M MNT)
- R5 separately detects: code uses 30M MNT (matches new law); spec still says 20M MNT
- R5 categorization confusion: is this Type 3-bug (code wrong) or Type 3-design (spec stale)?

Resolution: R4 finding wins. Code is correct (matches amended law); spec is stale (still references pre-amendment value). Drift is authority-driven, not code-bug. Recipe:

1. R4 writes amendment ADR (per cascade above)
2. R5 drift finding linked to the amendment ADR
3. Spec INV/HW updated to new value
4. No spawn chip (code is right)
5. Drift item resolved by spec edit

See `07-conflict-resolution.md` § "Type 5 — International standard vs national transposition" for related conflict resolution patterns.
```

## Anti-patterns

1. **Annual re-validation as only safety net** — too slow for urgent amendments
2. **Subscribing to noise** — too many feeds → developers stop reading; tune SNR
3. **Tracking without action** — alerts ignored; no escalation protocol
4. **Solo monitoring** — single point of failure; if owner leaves, tracking stops
5. **No version control on watch list** — can't see what was tracked vs missed historically
6. **Confusing consultation with final rule** — drafts change; never implement based on consultation alone
7. **Treating ALL urgency as same** — boy-who-cried-wolf; calibrate triage carefully
8. **Forgetting transition periods** — amendment "in force" 2027-07-10 doesn't mean you must implement on day 0; check whether transition period exists

## Annual amendment-tracking retrospective

Once per year, review the year's amendment-tracking effectiveness:

- How many amendments did we detect? Via what channel?
- How many did we MISS (discovered later than ideal)?
- How many escalated correctly? Incorrectly?
- What signals were noise (false positives)?
- What tooling improvements would help?

Adjust tooling + cadence based on retrospective.

## Cross-references

- `06-re-validation-strategy.md` — annual scheduled catch (complementary to proactive tracking)
- `07-conflict-resolution.md` — when amendments create conflicts with sibling rules
- `_meta/regulatory-source-registry.md` (your project) — sources that drive watch list
- `_meta/amendment-watch-list.md` (your project) — active tracking

## Next

→ `10-translation-pitfalls.md` — when monitoring non-English authority sources
