---
doc: extended/workflow/10-adoption-guide/06-common-pitfalls
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: teams adopting OR running ZeeSpec
---

# Common Adoption Pitfalls — Diagnosis + Interventions

> **15 ways adoption fails + how to fix.** Based on pilot project + Reviewer C external assessment.

## Pitfall categorization

| Category | Pitfalls |
|----------|----------|
| **Scope** | #1-3 — wrong scope / wrong starting module / over-investment |
| **People** | #4-7 — solo champion / role mismatch / training gap / sustaining |
| **Process** | #8-11 — sprint integration / drift maintenance / annual reviews / ADR discipline |
| **Tooling** | #12-13 — CI noise / agent cost |
| **Cultural** | #14-15 — "more docs" framing / methodology fatigue |

## Scope pitfalls

### Pitfall #1 — Starting with too big a module

**Symptom:** Picked the most important module first. 6 weeks in; still haven't reached Tier 1.

**Why:** Methodology overhead is fixed-cost-per-module; first module also has learning curve. Big module → long learning curve.

**Intervention:**
- Stop authoring big module
- Pick a SMALLER module (5-15 entities, well-bounded)
- Author + promote to Tier 1 in 2-3 weeks
- Return to big module armed with experience

**Prevention:** Per `01-adopting-zeespec-from-scratch.md` § "Day 3: Pick your first module" — explicit "don't pick the biggest" rule.

### Pitfall #2 — Authoring all 10 files at once

**Symptom:** Tries to fill 10 files simultaneously. Each file 50% done. Methodology paralysis.

**Why:** Dimensional thinking is unfamiliar; engineers used to single-doc-per-feature.

**Intervention:**
- Use checklist order strictly (`01-authoring-checklist.md`)
- Author one file at a time; complete each before next
- For modules where some dimensions clearly N/A: skip them with a 1-line note (e.g., "who.md not authored — module has no actors beyond system")

**Prevention:** Strict per-file workflow.

### Pitfall #3 — Tier 1 promotion treated as one-shot

**Symptom:** Promoted to Tier 1. Spec never updated again. 6 months later, spec is lying.

**Why:** Tier 1 misunderstood as "done." Actually it's "ready for continuous maintenance."

**Intervention:**
- Re-read `METHODOLOGY.md` § 3a (continuous post-Tier-1 phases)
- Set up CI drift detection (Layer 1) per `extended/workflow/08-code-drift-management/03`
- Schedule monthly Layer 2 review
- Update CLAUDE.md frontmatter: never mark a module "done" — only "tier-1 + continuously-validated"

**Prevention:** Define "Tier 1" clearly in onboarding training. Tier 1 ≠ done.

## People pitfalls

### Pitfall #4 — Single bus-factor (Bob's methodology)

**Symptom:** Only one engineer knows ZeeSpec. Bob takes vacation; methodology adherence collapses. Bob leaves; methodology dies.

**Why:** Knowledge concentration; no incentive for others to learn.

**Intervention:**
- Pair second engineer on a module immediately
- Backup must be authoring (not just observing) by month 2
- Cross-team mentorship via lunch-and-learn

**Prevention:** Per `03-team-rollout-strategy.md` § "Roles to identify" — designate Backup from day 1.

### Pitfall #5 — Roles don't exist in your team (Reviewer C P0)

**Symptom:** 3-person startup; methodology requires compliance officer + controller + approver + tech lead. Engineers ignore role assignments.

**Why:** Methodology was pioneered in 10+ person regulated finance team; assumes role structure.

**Intervention:**

For each missing role, explicitly map fallback:

| Role | If absent | Fallback |
|------|-----------|----------|
| Compliance officer | Small team / pre-PMF | Pick most-detail-oriented engineer; have them shadow legal counsel quarterly |
| Controller | No CFO/CTO | Co-founder or tech lead; document conflicts of interest |
| Approver (SoD) | 2-person team | "Whoever didn't initiate" rule; documented exceptions if absolutely necessary |
| Tech lead | Flat structure | Rotating lead per module |
| Domain expert | Engineering-only team | Hire freelance domain expert for periodic consultation; or use external SME |

Document the fallback in your project's `_meta/adoption-decisions.md`:

```markdown
## Role mapping (small team)

| Role | Assigned to | Rationale |
|------|-------------|-----------|
| Champion | Alice | Most ZeeSpec-fluent |
| Backup | Bob | Pair-programs with Alice |
| Compliance officer | Bob | Shadows external counsel quarterly |
| Controller | (no role) | All controller-tier actions require Alice+Bob both |
| Tech lead | Alice (default) | Rotates per module |
| Domain expert | Carol (CEO) | Knows the business deeply |
```

**Prevention:** Add "role mapping" exercise in pre-adoption checklist.

### Pitfall #6 — Training gap

**Symptom:** Champion fluent; rest of team confused. PRs missing spec impact section.

**Why:** No formal onboarding; learn-by-watching is too slow.

**Intervention:**
- 4-session lunch-and-learn over 4 weeks
- Session 1: Why ZeeSpec? (value pitch)
- Session 2: 10-file structure + reading a spec
- Session 3: Authoring + B1 verification
- Session 4: Drift management + ADR lifecycle

Plus: pair-programming sessions for each engineer's first authoring attempt.

**Prevention:** Schedule training in Phase 2 (Months 4-6 per `03-team-rollout-strategy.md`).

### Pitfall #7 — Sustaining beyond Year 1

**Symptom:** Initial enthusiasm fades by Year 2. Drift accumulates. Annual reviews skipped.

**Why:** Novelty effect wears off; methodology becomes "the way we do things" then "the way we used to do things."

**Intervention:**
- Annual methodology retrospective (Year-2 onward)
- Refresh examples / templates as they age (e.g., update Mongolia AML law version)
- Track methodology ROI metrics quarterly; celebrate wins
- Refresh training for new hires (don't just expect spec to teach itself)

**Prevention:** Year-2 retrospective on calendar from Year-1 month 12.

## Process pitfalls

### Pitfall #8 — Sprint planning doesn't account for spec work

**Symptom:** Engineers expected to spec on top of full feature workload. Spec quality degrades.

**Why:** Spec work is invisible to product/leadership; not counted in velocity.

**Intervention:**
- Treat spec authoring as feature work in sprint planning (story points / hours)
- Spec maintenance is a recurring sprint commitment (per `03-team-rollout-strategy.md` § "PR workflow integration")
- Definition of Done includes spec update for ZeeSpec modules

**Prevention:** Tech lead + EM enforce sprint planning discipline.

### Pitfall #9 — Drift maintenance dies after 3 months

**Symptom:** Layer 1 CI drift detection running; nobody reads PR comments. Layer 2 monthly review scheduled; calendar invites declined.

**Why:** Drift findings feel non-urgent; always something more pressing.

**Intervention:**
- Designate single owner for monthly drift review (rotate quarterly)
- Drift KPIs on team dashboard (visible in standup)
- Tie drift resolution to sprint goal (e.g., "resolve all P0/P1 drift before sprint close")
- For systemic drift: bulk cleanup sprint (per `extended/workflow/08-code-drift-management/04` § "Bulk drift cleanup")

**Prevention:** Define drift KPIs upfront; review weekly in team metrics meeting.

### Pitfall #10 — Annual reviews never happen

**Symptom:** R4 re-validation, R6 ADR review on calendar; perpetually slip.

**Why:** Annual events feel optional; nobody enforces.

**Intervention:**
- Block 1 week per year on calendar (e.g., always first week of fiscal year)
- Assign owner who reports out at year-end all-hands
- Make annual review part of compliance officer's job description

**Prevention:** Calendar block + JD assignment from Year 1.

### Pitfall #11 — ADRs written enthusiastically then never updated

**Symptom:** Year 1: 25 ADRs written. Year 2: 2 ADRs. Year 3: 0 ADRs. CLAUDE.md ADR table shows everything ACCEPTED but half are stale.

**Why:** ADR writing is up-front cost with long-term benefit; people prioritize present.

**Intervention:**
- PR template requires ADR check ("does this PR need an ADR?")
- R6 annual review per `extended/workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` Mode B
- Retroactive ADR sprint when 5+ undocumented decisions found

**Prevention:** PR template enforcement + annual R6 review.

## Tooling pitfalls

### Pitfall #12 — CI drift noise

**Symptom:** PR drift scanner posts 20+ "findings" per PR. Engineers learn to ignore the bot.

**Why:** Drift scanner not tuned; false positives dominate.

**Intervention:**
- Add allowlist comments (`<!-- drift-ignore -->`) for known-OK patterns
- Tune thresholds (only alert if drift > 50 lines or count diff > 2)
- Skip pseudocode files (mark with frontmatter `drift_scan: false`)
- Iterate until SNR > 80%

**Prevention:** Per `extended/workflow/08-code-drift-management/03-auto-drift-detection.md` § "Tuning signal-to-noise" — explicit tuning step in rollout.

### Pitfall #13 — Agent dispatch costs unexpected (Reviewer C P1)

**Symptom:** End-of-month bill shock from Claude API. Team disables agents.

**Why:** No upfront cost estimation. Agents dispatched without budget tracking.

**Intervention:**
- Publish cost table per `04-tooling-integration.md` § "Cost tracking"
- Budget per quarter; alert on overspend
- Use Sonnet (cheaper) for R5 + simple R6 tasks; Opus for R4 + complex R6
- Cache R4 source registry to avoid re-fetching same URLs

**Prevention:** Cost estimate documented; budget tracking integrated with FinOps.

## Cultural pitfalls

### Pitfall #14 — "More docs" framing

**Symptom:** Engineers see ZeeSpec as documentation burden. Talk about it negatively.

**Why:** Methodology positioned as documentation; documentation has negative engineering associations.

**Intervention:**
- Reframe value pitches:
  - "AI-readable spec → Claude/Copilot generates better code"
  - "Drift detection → spec stops lying"
  - "ADR lifecycle → understand decisions years later"
  - "Compliance audit trail → less stressful regulator visit"
- Avoid framing as "documentation" — frame as "engineering tool"
- Show concrete wins (production bug prevented; new hire faster ramp)

**Prevention:** Value-first pitch in initial training.

### Pitfall #15 — Methodology fatigue (Year 2+)

**Symptom:** Methodology ceremonies (drift reviews, ADR reviews, R4 sessions) become rote. Quality of execution declines.

**Why:** Novelty wore off; ceremonies persist after delivering initial value.

**Intervention:**
- Annual "is this still worth it?" review per workflow phase
- Drop ceremonies that don't deliver value (e.g., if R4 finds nothing for 4 quarters in a row, reduce to annual)
- Refresh content (new examples; updated templates)
- Celebrate ROI publicly (e.g., "ZeeSpec caught 8 production bugs this year; saved $X")

**Prevention:** Built-in retrospective every 6 months.

## Diagnosis flowchart

If you're seeing adoption issues:

```
Drift accumulates / specs lying?
  └── #3 Tier 1 misunderstood OR #9 drift maintenance dying

Only 1 person knows methodology?
  └── #4 Bob's methodology

Engineers ignoring drift bot?
  └── #12 CI noise

New PRs don't update specs?
  └── #8 Sprint planning OR #14 culture framing

ADR table stale?
  └── #11 ADR discipline OR #10 annual review skipped

Methodology bill too high?
  └── #13 agent cost

3-person team feels overwhelmed?
  └── #5 role mismatch OR #1 wrong scope

6 months in, no Tier 1 yet?
  └── #1 too-big first module OR #2 authoring paralysis

Team fluency stalled at 1-2 people?
  └── #6 training gap

Year 2+ enthusiasm gone?
  └── #7 sustaining OR #15 fatigue
```

## When to abandon ZeeSpec

Sometimes adoption isn't worth it. Signs:

- 6+ months in; first module still incomplete
- Methodology actively slowing team velocity (not just transition cost)
- Compliance + audit pressure absent (no domain-fit)
- Team < 3 people sustainable (methodology overhead exceeds value)
- AI tooling environment hostile (no agent dispatch; no parallel execution)

If 3+ of above: stop. Use ADR alone or lightweight alternatives.

Document the decision in `_meta/adoption-retrospective.md` so future revisitors understand why.

## Recovery patterns

If adoption stalled but valuable:

### Recovery pattern 1 — Restart with smaller scope

- Pick 1 module at Tier 1
- Drop everything else for 1 month
- Re-establish weekly rhythm
- Then expand

### Recovery pattern 2 — Refresh champion

- Original champion no longer engaged
- Find new champion + fund 25% time
- Restart from Phase 2 (per `03-team-rollout-strategy.md`)

### Recovery pattern 3 — Methodology audit + simplification

- Drop ceremonies that don't deliver value
- Replace heavy patterns with lighter ones
- Keep only what the team actually uses

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `01-adopting-zeespec-from-scratch.md` — greenfield path
- `02-onboarding-existing-project.md` — brownfield path
- `03-team-rollout-strategy.md` — team coordination
- `04-tooling-integration.md` — automation
- `05-cross-domain-adaptation.md` — non-finance domains
- `07-zeespec-lite-tier-0-fasttrack.md` — when full methodology too heavy

## Next

→ `07-zeespec-lite-tier-0-fasttrack.md` — quick-start option for cost-sensitive teams
