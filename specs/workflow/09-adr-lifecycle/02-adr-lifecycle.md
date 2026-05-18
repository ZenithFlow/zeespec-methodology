---
doc: workflow/09-adr-lifecycle/02-adr-lifecycle
type: workflow-method
phase: adr-lifecycle
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# ADR Lifecycle — State Transitions

> An ADR moves through states: Proposed → Accepted → Superseded / Deprecated / Rejected. Each transition has specific triggers + protocol. Without explicit state management, ADRs accumulate without structure.

## State diagram

```
                ┌─────────────┐
                │  PROPOSED   │
                └──────┬──────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
       ┌─────────┐ ┌────────┐ ┌──────────┐
       │ACCEPTED │ │REJECTED│ │WITHDRAWN │
       └────┬────┘ └────────┘ └──────────┘
            │
       ┌────┼────┐
       ▼         ▼
  ┌─────────┐ ┌────────────┐
  │SUPERSED-│ │ DEPRECATED │
  │   ED    │ └────────────┘
  └─────────┘
```

## State definitions

### PROPOSED

**Meaning:** ADR has been drafted; team has not yet decided.

**Engineering implication:** Do NOT implement based on Proposed ADR.

**How to mark:**
- File frontmatter: `status: Proposed`
- Date: when proposal was filed

**Required content:** Full ADR text (context + decision + alternatives + consequences). It's not "proposed" if it's incomplete.

**Time-limit:** SHOULD move to Accepted / Rejected / Withdrawn within 30 days. If 60+ days as Proposed, escalate.

### ACCEPTED

**Meaning:** Decision is binding; engineering implements; spec embodies.

**Engineering implication:** YES, implement. INV/HW entries enforce.

**How to mark:**
- File frontmatter: `status: Accepted`
- Date: when accepted
- Decision-maker(s) listed

**Required content:** Full ADR + sign-off info.

**Immutability:** After acceptance, the ADR text is IMMUTABLE (don't edit). Changes require new ADR that supersedes.

### SUPERSEDED

**Meaning:** A newer ADR has replaced this one. Decision is no longer in effect; ADR kept for historical reference.

**Engineering implication:** Don't implement; the superseder is the current decision.

**How to mark:**
- File frontmatter: `status: Superseded`, `superseded_by: ADR-MOD-NNN`, `superseded_date: YYYY-MM-DD`
- CLAUDE.md table: visible with strikethrough or "🗄️ SUPERSEDED" marker + link
- DO NOT delete the file — historical record matters

**Required content:** Original ADR text + sup section noting "superseded by ADR-X on YYYY-MM-DD; see that ADR for current approach."

**Transitions:** Once SUPERSEDED, no further state changes. The new ADR has its own lifecycle.

### DEPRECATED

**Meaning:** Decision no longer applies but no successor decision was made. Often because the topic is no longer relevant (feature removed, module retired).

**Engineering implication:** Don't implement. Old code that implemented this should be reviewed for removal.

**How to mark:**
- File frontmatter: `status: Deprecated`, `deprecated_date: YYYY-MM-DD`, `deprecation_reason: <text>`
- CLAUDE.md table: visible with "🚫 DEPRECATED" marker

**Required content:** Original + deprecation note explaining why no successor.

**Different from Superseded:** Superseded = replaced by new ADR; Deprecated = no longer relevant + not replaced.

### REJECTED

**Meaning:** ADR was proposed but not accepted; the alternative path was chosen.

**Engineering implication:** This decision was considered + declined.

**How to mark:**
- File frontmatter: `status: Rejected`, `rejected_date: YYYY-MM-DD`, `rejected_reason: <text>`
- Sometimes kept in CLAUDE.md table; sometimes archived

**When to keep:** Rejected ADRs are useful if they document a non-obvious path that future re-discoverers should NOT re-propose (saves re-evaluation effort).

### WITHDRAWN

**Meaning:** Proposer withdrew the ADR before decision (e.g., realized it was wrong; superseded by new info).

**Engineering implication:** None (ADR was never accepted).

**How to mark:**
- File frontmatter: `status: Withdrawn`, `withdrawn_date: YYYY-MM-DD`, `withdrawn_reason: <text>`
- Usually archived (not in main CLAUDE.md table)

**Different from Rejected:** Withdrawn = author pulled it; Rejected = team voted no.

## State transitions

### Proposed → Accepted

**Trigger:** Decision-maker(s) sign off after review.

**Protocol:**
1. Reviewer(s) read full ADR
2. Discuss alternatives + consequences
3. Decision-maker signs off (specific named person)
4. Update file frontmatter: `status: Accepted`, `status_date: YYYY-MM-DD`
5. Add sign-off names + roles
6. Commit with message "ADR-MOD-NNN ACCEPTED: <title>"
7. Update CLAUDE.md table if not already

**Required artifacts:**
- Updated ADR file with sign-off
- Commit referencing ADR
- (For material ADRs) compliance officer sign-off captured

### Proposed → Rejected

**Trigger:** Decision-maker(s) decide against the proposed decision.

**Protocol:**
1. Reviewers document rejection rationale
2. Update file frontmatter: `status: Rejected`, `rejected_date`, `rejected_reason`
3. Note the alternative path chosen (often: continue current state)
4. Commit with message "ADR-MOD-NNN REJECTED: <title>"

**Useful for:** capturing the reasoning so future re-proposers can see why.

### Proposed → Withdrawn

**Trigger:** Author withdraws (often because of new information).

**Protocol:**
1. Author updates frontmatter: `status: Withdrawn`, `withdrawn_date`, `withdrawn_reason`
2. Commit
3. Often: archive the file (move to `adr/_archive/`)

### Accepted → Superseded

**Trigger:** A NEW ADR has been Accepted that supersedes the old one.

**Protocol:**
1. New ADR is written + accepted FIRST (with `supersedes: ADR-OLD` field)
2. Then update OLD ADR:
   - Frontmatter: `status: Superseded`, `superseded_by: ADR-NEW`, `superseded_date: YYYY-MM-DD`
   - Add prominent note at TOP of ADR text: "**This ADR has been SUPERSEDED by ADR-NEW on YYYY-MM-DD. See ADR-NEW for current approach.**"
3. Update CLAUDE.md table:
   - Old ADR row: status changes; add link to superseder
   - New ADR row: add (with `supersedes: ADR-OLD` link back)
4. Commit with message "ADR-OLD superseded by ADR-NEW"

**Bidirectional linking:** Always link in both directions.

### Accepted → Deprecated

**Trigger:** Decision no longer relevant; no successor decision needed.

**Examples:**
- Feature removed; ADR was about that feature
- Module retired
- Technology stack changed; old framework ADR no longer applies (but no new ADR needed about the framework choice — see ADR for the new stack instead)

**Protocol:**
1. Update frontmatter: `status: Deprecated`, `deprecated_date`, `deprecation_reason: <2-3 sentences>`
2. Add note at top: "**This ADR has been DEPRECATED on YYYY-MM-DD because: <reason>. The decision no longer applies. No successor ADR.**"
3. Update CLAUDE.md table

### Anything → Withdrawn (NOT VALID for Accepted)

Accepted ADRs CANNOT be Withdrawn. Once accepted, the ADR is a historical record. To "undo" an accepted ADR, write a new ADR that supersedes it.

## Annual ADR review

Per `00-START-HERE.md`, ADRs need lifecycle curation. Annual review:

```
1. Pre-work (15 min):
   □ Open `_meta/adr-curation-log.md` (create if missing)
   □ Sort all ADRs by date + status
   □ Filter to Accepted ADRs > 12 months old (review candidates)

2. Per ADR review (10-15 min each):
   □ Read ADR
   □ Verify decision still in effect (code reflects it?)
   □ Check if ADR has been superseded informally (without explicit ADR)
     - If yes: write retroactive superseder ADR
   □ Check if ADR is now obsolete (feature removed; tech stack changed)
     - If yes: mark Deprecated
   □ Check for stale "Re-review date" if set
   □ Verify status tag matches reality

3. Output (30 min):
   □ List of ADRs reviewed
   □ List of state changes made
   □ List of new ADRs needed (drift-driven; per `04-drift-driven-adr-pattern.md`)
   □ List of cross-link issues found

4. Apply changes:
   □ Update each ADR's frontmatter + body
   □ Update CLAUDE.md ADR table
   □ Commit with message "ADR annual review YYYY: <module>"

5. Update _meta/adr-curation-log.md with review summary
```

**Cadence:** Annual minimum. Quarterly for high-volume modules (> 30 ADRs).

## ADR review for new authors

When you join a project, review the module's ADRs to understand WHY decisions were made:

```
1. Sort ADRs by date (oldest first)
2. Read in order — see how the decision-chain evolved
3. For Superseded ADRs: read the superseder right after
4. Note any ADR where rationale doesn't match current code
   (potential drift → file as drift item per workflow 08)
```

## ADR "rot" — patterns to watch

Aging ADRs accumulate problems. Watch for:

### Rot pattern 1 — "All ACCEPTED forever"

Symptom: 20 ADRs in CLAUDE.md, all marked ACCEPTED, oldest from 3 years ago.

Likely cause: no lifecycle discipline; superseders never explicitly linked.

Fix: annual review; explicitly mark superseded.

### Rot pattern 2 — "Cycle of contradictions"

Symptom: ADR-005 says "Use sync"; ADR-018 says "Use async"; ADR-031 says "Use sync" again. No supersedes links.

Likely cause: team forgot prior ADRs; each ADR ignored predecessors.

Fix: when writing new ADR, R6 agent (or human) MUST search for related prior ADRs + explicitly link.

### Rot pattern 3 — "Vague decisions"

Symptom: ADR text reads "we might consider X" or "X is preferable in some cases."

Likely cause: ADR was actually a discussion, not a decision.

Fix: re-author the ADR with binary clarity. If decision is contextual, capture the conditions explicitly.

### Rot pattern 4 — "ADRs about implementation details"

Symptom: 50 ADRs in a 6-month-old module; most are minor coding choices.

Likely cause: team over-uses ADRs for non-decisions.

Fix: re-categorize most as code comments or design-doc sections; keep only material decisions as ADRs.

### Rot pattern 5 — "Phantom ADRs"

Symptom: CLAUDE.md table cites ADR-MOD-027; no ADR-MOD-027 file exists.

Likely cause: copy-paste error OR file deletion.

Fix: either find the original (git history) OR remove the citation.

## ADR for cross-module decisions

When an ADR's decision affects multiple modules:

```
1. Decide module ownership: which module "owns" the decision?
   - Often the module most centrally affected
   - Or a parent / orchestrator module

2. Write ADR in owner module:
   ADR-<OWNER-MOD>-NNN

3. In affected modules:
   - Cross-reference the ADR in CLAUDE.md ADR table
     "Inherited: ADR-OWNER-MOD-NNN" (note in their gravity.md too)
   - DO NOT duplicate the ADR text
   - Optional: write a thin ADR in the affected module:
     "ADR-AFFECTED-MOD-NNN — Honor ADR-OWNER-MOD-NNN. Implementation per ..."
```

Per `checklists/cross-link-bidirectionality.md`.

## Versioning of ADRs

ADRs are NOT versioned in the SemVer sense. They're immutable after acceptance. Changes are via new ADRs (supersedes pattern).

The numbered sequence (`ADR-MOD-001`, `-002`, etc.) is permanent. Never reuse numbers (even for deleted ADRs).

## Cross-references

- `00-START-HERE.md` — when to write ADRs
- `01-adr-format-template.md` — what ADR contains
- `03-adr-relationships.md` — supersedes / extends / conflicts
- `04-drift-driven-adr-pattern.md` — drift detection produces ADRs
- `05-R6-adr-curator-agent.md` — AI agent for ADR curation
- `checklists/invariant-numbering.md` — `ADR-<MOD>-NNN` format

## Next

→ `03-adr-relationships.md` — linking ADRs
→ `04-drift-driven-adr-pattern.md` — drift → ADR pipeline
