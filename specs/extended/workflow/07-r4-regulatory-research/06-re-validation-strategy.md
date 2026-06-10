---
doc: extended/workflow/07-r4-regulatory-research/06-re-validation-strategy
type: workflow-research-method
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain
---

# Re-Validation Strategy — Keeping Citations Current

> **Domain-agnostic.** Laws change. Agencies issue new rules. URLs rot. A citation that was correct 2 years ago may now be stale or wrong. This file defines the **re-validation workflow** that keeps your spec citations current.

## Why re-validation matters

A typical regulated-domain spec contains 20-50 INV/HW entries with external-authority citations. Without re-validation:

- **Year 1:** All citations valid. Spec compliant.
- **Year 2:** ~5% of citations stale (laws amended, URLs changed). Risk: 1-3 P1 gaps not detected.
- **Year 3:** ~15% stale. Risk: P0-level compliance violation possible (e.g., threshold raised, deadline shortened, retention extended).
- **Year 5:** ~30%+ stale. Spec becomes liability rather than asset.

The cost of re-validation is small compared to the cost of being caught with stale compliance.

## The re-validation rhythm

### Annual re-validation (mandatory for live specs)

Once per year, for every external-authority citation:
1. Re-visit the source URL
2. Check version date — is it still the version you cited?
3. If amended: re-do R4 Phase 3 for the affected provision
4. Update spec INV/HW + citation block
5. Update source registry "Retrieved" date

**Cadence:** annually, anchored to a fixed date (e.g., first business day of fiscal year start, or anniversary of spec authoring). Make it a calendar event.

### Quarterly re-validation (for high-risk domains)

For domains with **active regulatory attention** (e.g., recently amended law, agency consultation period, international standard under revision):
- Quarterly URL + version check (15-30 min per source)
- Full Phase 3+ re-read only if version date changed
- Flag any pending amendment as 🟡 RES-MOD-R4-NN (research question)

### Trigger-based re-validation (event-driven)

Re-validate IMMEDIATELY (don't wait for schedule) when ANY of these happen:

| Trigger | Action |
|---------|--------|
| Regulator announces consultation on the topic | Re-validate; subscribe to consultation outcome |
| Regulator publishes new guidance / Q&A | Re-validate; assess whether spec needs updating |
| Court decision interpreting the cited statute | Re-validate; may need to add interpretive citation |
| Law amendment published | Mandatory re-validate; spec MUST be updated within 30 days |
| Enforcement action against another firm cites your topic | Re-validate; learn from enforcement priorities |
| Internal incident triggers compliance review | Re-validate the relevant citations |
| Annual mutual evaluation / peer review (FATF / IOSCO / ICH) results | Re-validate; jurisdiction may have changed status |
| New government takes office (post-election) | Re-validate within 6 months; new agency priorities |

## The annual re-validation checklist

Print this. Use it.

```
□ Pre-work (15 min):
  □ Open `_meta/regulatory-source-registry.md`
  □ Sort sources by "Re-check due" date (oldest first)
  □ Group by jurisdiction for efficient browser sessions
  □ Block 4-8 hours of focused time per jurisdiction

□ For EACH source (15-45 min each):
  □ Open the stable URL — does it resolve?
    □ If URL broken:
      □ Search "<jurisdiction> <document title>" to find new URL
      □ Update registry with new URL + note rot date
      □ If document still exists: re-cite with new URL
      □ If document repealed/superseded: see § "Handling repealed law"
  □ Check version date on page header
    □ Same as cited: minor update — refresh "Retrieved" date in registry
    □ Different version: see § "When version changes"
  □ Check "in force" status (if shown)
    □ Still in force: continue
    □ Repealed / superseded: see § "Handling repealed law"
  □ Open the specific article you cited
    □ Same text: refresh date only
    □ Text changed (even if version date same — rare): see § "When text changes"
  □ Check for new related guidance / amendments since last visit
    □ Read regulator's "What's new" / "Latest" page
    □ Read regulator's enforcement actions for the topic
    □ Note any pending consultation or proposed amendment

□ After ALL sources reviewed:
  □ Append re-validation summary to `_meta/regulatory-research-log.md`
  □ Update each citation block in spec with "Re-validated YYYY-MM-DD" marker
  □ File new gap entries for any changes detected
  □ Schedule next re-validation date

□ Optional (recommended):
  □ Compliance officer sign-off on changed citations
  □ Update package version (bump patch version after re-validation)
```

## When version changes

If the source document has a newer version than what you cited:

### Step 1: Compare versions

Most statute databases show amendment history (date + section changed + summary). Read this. If your cited section is NOT in the changed list, the substantive provision is unchanged — just update the "Retrieved" date + add a "Re-validated" marker.

### Step 2: If your section IS in the changed list

Re-do R4 Phase 3 for the affected section:
1. Read the new text
2. Compare to your previous interpretation
3. If substantive change: update INV/HW + file gap entry (Gap-MOD-R4-NN)
4. If editorial change only (typo fix, cross-reference renumber): note in research log; minor update

### Step 3: Categorize the change

| Change type | Action |
|-------------|--------|
| **Threshold raised** (e.g., CTR 20M → 30M MNT) | Update INV; update config; alert engineering; assess transition period for in-flight transactions |
| **Threshold lowered** (e.g., 20M → 10M MNT) | URGENT update; existing process may now violate; spawn task chip for code change |
| **Deadline shortened** (e.g., 24h STR → 12h STR) | URGENT; SLA / monitoring must update; spawn task chip |
| **Deadline extended** (e.g., 5d → 7d filing) | Update; relax monitoring; usually no urgency |
| **Retention extended** (e.g., 5y → 7y) | URGENT; deletion processes must update; data lifecycle review |
| **Retention shortened** (e.g., 7y → 5y) | Less urgent; can comply by NOT deleting early; review privacy obligations |
| **New requirement added** (e.g., new beneficial-owner field) | URGENT; data model + UI may need extension; spawn task chip |
| **Requirement removed** (deprecated rule) | Update; may simplify code (clean up dead checks) |
| **Definition changed** (e.g., what counts as "cash transaction") | URGENT; algorithms must update; spawn task chip |
| **Penalty changed** | Update severity-matrix calibration if material |

### Step 4: Update spec + capture audit trail

```markdown
### INV-KYC-04 — CTR auto-flag for cash transactions ≥ X MNT
Status: ⚠️ MUST be ✅ IMPL
Source: SRC-AML-MN-2017

**2026-05-18 (original research):** Threshold = 20,000,000 MNT per
Art. 11.1.1 (consolidated 2017-10-26 amendment).

**Re-validated 2027-05-18:** Source URL still resolves; version still
2017-10-26 consolidated; threshold value 20,000,000 MNT unchanged. No
action needed.

**Re-validated 2028-05-18:** AMENDMENT detected. Mongolia AML/CFT Law
amended 2028-03-15; Art. 11.1.1 threshold raised to 30,000,000 MNT,
effective 2028-09-01. INV updated. Engineering ticket WAL-1234 created
for config change with phased rollout 2028-08-15.

**Re-validated 2029-05-18:** Source URL still resolves; threshold now
30,000,000 MNT per 2028 amendment. No further changes. Engineering
config matches: threshold_mnt = 30_000_000.
```

This audit trail lets the next reviewer understand the evolution.

## When text changes (without version date change)

Sometimes regulator's published consolidated text changes WITHOUT a new "version date" marker — typically an editorial/typo fix that doesn't warrant a new amendment number. Detect via:

- Word-for-word comparison against your locally-archived PDF
- Hash check if you stored the original PDF with a hash

If text changed:
1. Read the change
2. Determine if substantive (usually no, but verify)
3. Update local archive + note in research log

## Handling repealed law

When your cited source has been REPEALED or SUPERSEDED:

### Phase 1 — Identify the successor

The statute database usually links to the successor. Otherwise:
- Search "<old law name> repealed superseded"
- Check regulator's "What replaced X" announcements
- Consult industry summary (Tier 3) to find successor faster

### Phase 2 — Map your old citation to the new source

The new law's structure may differ. Read the new law's TOC. Find the equivalent provision. Compare to old text. If they match substantively, update citation. If they don't, see § "When text changes."

### Phase 3 — Transition period

Often, the new law has a transition period (e.g., effective 6 months after publication). During this:
- Your spec should cite BOTH the old (still in force) and the new (coming into force)
- Engineering may need to prepare for the transition
- File transition as Gap-MOD-R4-NN with the cutover date

### Phase 4 — Post-transition

After the cutover date:
- Old citation marked SUPERSEDED in source registry (kept for historical reference)
- New citation primary

## What changes between re-validations (the watch list)

These categories of change are most common:

### Finance / AML
- CTR / STR thresholds adjusted for inflation
- Sanctions lists updated (handled by daily sync, not annual re-validation)
- Capital adequacy ratios revised (Basel committee)
- New regulatory technology requirements (e.g., RTGS upgrades)
- Cross-border reporting (FATCA, CRS) schema updates

### Healthcare
- HIPAA enforcement guidance updates
- Privacy rule revisions (HHS OCR enforcement priorities)
- MDR/IVDR transition deadlines (EU 2024-2027 window)
- ICH guideline revisions

### Government / cybersecurity
- NIST SP 800-53 control catalog revisions (Rev 5 → Rev 6 etc.)
- FedRAMP baseline updates
- CMMC level changes (DoD)
- New executive orders affecting agency requirements

### Privacy
- New state privacy laws in US (~3-5 per year as of 2026)
- GDPR DPA adequacy decisions (added/removed)
- AMLD6 transposition by EU Member States (2027 deadline)
- Cross-border transfer mechanism updates (DPF, IDTA, SCC)

### Tax
- Annual tax rate changes (most jurisdictions)
- BEPS implementation updates
- Pillar 1 + Pillar 2 (global tax) rollout
- Withholding rate treaty updates

## Re-validation cadence per source type

| Source type | Default cadence | High-risk cadence |
|-------------|-----------------|-------------------|
| Primary statute (stable) | Annual | Semi-annual |
| Implementing regulation (less stable) | Annual | Quarterly |
| Agency guidance / Q&A | Semi-annual | Quarterly |
| International standard (FATF / IOSCO / NIST) | Annual | After major revision announced |
| Sanctions list | Daily (automated, not manual R4) | Daily |
| Court decision archive | Annual | Quarterly |
| Authority enforcement archive | Semi-annual | Quarterly |
| Industry interpretation (Tier 3) | Re-validate underlying Tier 1 instead | n/a |

## Tracking re-validation in source registry

Each entry in `_meta/regulatory-source-registry.md` should have:

```markdown
### SRC-XXXX-YYY-ZZZZ
**Title:** ...
**URL:** ...
**Retrieved:** YYYY-MM-DD          ← most recent retrieval
**Re-check due:** YYYY-MM-DD       ← next scheduled re-validation
**Re-validation history:**
  - 2026-05-18 initial research [author]
  - 2027-05-18 re-validated [author] — no change
  - 2028-05-18 re-validated [author] — AMENDMENT detected → INV updated
  - 2029-05-18 re-validated [author] — no change
**Local archive:** compliance-source-archive/<path>
**Web archive:** https://web.archive.org/...
```

## Re-validation by an agent

R4 agent can also do re-validation (in addition to initial research). Modified prompt for re-validation:

```markdown
You are R4 in RE-VALIDATION mode for the <module> ZeeSpec.

**Task:** Visit each source URL in `_meta/regulatory-source-registry.md`
(filter by "Re-check due" <= today). For each:

1. Resolve the URL — if broken, search for the current location
2. Check version date — same or different from cited?
3. If different version:
   - Read the changed provisions
   - Compare to spec's INV/HW citation blocks
   - Identify any substantive change
4. If text changed without version change:
   - Note in re-validation log
5. Output: re-validation report listing sources with status:
   - ✅ No change (just refresh "Retrieved" date)
   - 🟡 Editorial change (no spec update needed)
   - 🟠 Substantive change (spec update required + change category per § "When version changes")
   - 🔴 Repealed/superseded (transition workflow per § "Handling repealed law")

For substantive changes (🟠 or 🔴), propose:
- Updated INV/HW citation block
- Engineering ticket title (e.g., "Update CTR threshold from 20M to 30M MNT")
- Severity (calibrated to anti-pattern impact)
- Spawn-task-chip if engineering work needed

Output as markdown — append to research log.
```

## Failure modes (don't do these)

1. **Skip re-validation because "the spec is stable"** — stable specs accumulate hidden drift. Annual minimum, no exceptions.
2. **Treat re-validation as a chore** — actually train your team that this is critical compliance hygiene. Make it visible (re-validation status on a dashboard).
3. **Re-validate one source at a time over the year** — front-load it. Block one full week per year for the entire stack. Saves context-switching.
4. **Forget to update the "Retrieved" date** — without this, you can't tell when the last verification happened. Always update.
5. **Re-validate without cross-checking against engineering** — if law changed but engineering didn't, that's the gap. Compare to production config + code.
6. **Skip the audit trail** — the "Re-validated YYYY-MM-DD" markers are how the next compliance officer trusts your work. Add them.

## Cross-references

- `01-regulatory-research-workflow.md` — initial research (Phase 6 schedules first re-check)
- `03-citation-conventions.md` — citation format that supports re-validation tracking
- `09-amendment-tracking.md` — proactive monitoring (catch amendments BEFORE scheduled re-validation)
- `_meta/regulatory-source-registry.md` (in your project) — source-of-truth for what to re-validate

## Next

→ `07-conflict-resolution.md` — what to do when authorities conflict
→ `09-amendment-tracking.md` — proactive monitoring for amendments
