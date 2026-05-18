---
doc: workflow/10-adoption-guide/03-team-rollout-strategy
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: teams of 3+ engineers rolling out ZeeSpec
---

# Team Rollout Strategy

> **For teams of 3+ engineers.** Solo adoption is easy; team adoption is hard. This file defines how to spread ZeeSpec across multiple engineers without it becoming "Bob's thing" that dies when Bob leaves.

## The team-rollout problem

Methodology rollout fails when:
- Only 1 person knows how to use it (bus factor 1)
- Engineers feel methodology imposed rather than chosen
- Sprint planning doesn't account for methodology overhead
- No incentive structure connects methodology adherence to performance
- Documentation work is invisible; engineers prioritize visible work

## Rollout phases by team size

### 1-2 engineers: Skip this file

You're effectively solo. Read `01-adopting-zeespec-from-scratch.md` or `02-onboarding-existing-project.md`. Team rollout doesn't apply yet.

### 3-5 engineers: Champion + buddy

**Pattern:** 1 champion + 1 backup; rest of team uses methodology passively (reads spec; doesn't author).

**Rollout:**
- Champion authors modules 1-3 alone
- Backup pairs on module 4 (champion mentors)
- Backup authors module 5 (champion reviews)
- By month 6: both can author independently
- Team consults specs but doesn't author

**Why this works:** Small team can't afford 5 spec authors. 2 is sufficient for resilience.

### 6-15 engineers: Champion + team training

**Pattern:** 1 champion + everyone trained; modules owned by feature teams.

**Rollout:**
- Champion authors first 2 modules + writes lessons-learned doc
- Lunch-and-learn series (4 sessions over 4 weeks) for all engineers
- Each feature team picks 1 module + authors it (pair with champion if needed)
- By month 6: every team has authored 1 module
- By month 12: every engineer can read + edit specs; ~half can author from scratch

**Why this works:** Distributed ownership prevents single-point-of-failure.

### 16+ engineers: Center of Excellence

**Pattern:** Dedicated ZeeSpec team (1-2 FTE) + module ownership by feature teams.

**Rollout:**
- ZeeSpec team owns methodology evolution + tooling
- Feature teams own per-module specs (with mentoring)
- Dedicated #zeespec Slack channel
- Quarterly methodology retrospective
- Annual ZeeSpec all-hands

**Why this works:** Scale requires institutional commitment.

## Roles to identify

For Tier B/C adoption, designate these roles (full names; not just "TBD"):

| Role | Who | What they do |
|------|-----|--------------|
| **Champion** | 1 engineer with deep code knowledge | Owns methodology adoption; authors first modules; mentors others |
| **Backup** | 2nd engineer | Pairs with champion; redundancy |
| **Reviewer** | Senior engineer / tech lead | Does R1/R2/R3 reviews; signs off on Tier 1 promotion |
| **Compliance liaison** (if regulated) | Compliance officer | R2 reviews; R4 sign-off on material findings |
| **Domain expert** | Product manager / domain SME | Helps with why.md + business rules + invariant capture |
| **Tooling owner** | DevOps / platform engineer | Maintains CI drift detection; agent dispatch infrastructure |

If team is small, one person fills multiple roles. But every role must be filled (or explicitly skipped with rationale).

## Phased rollout timeline

### Phase 1 — Pilot (Months 1-3)

Goal: Prove ZeeSpec delivers value in 1-2 modules.

Activities:
- Champion authors 1-2 modules
- Reviews completed (R3 + R1+R2)
- 1-2 Tier 1 promotions
- Document lessons learned
- Demo to wider team

Gate to Phase 2: Champion + 1 other engineer can articulate ZeeSpec value to skeptical senior engineer.

### Phase 2 — Expansion (Months 4-6)

Goal: Spread methodology to 3-5 engineers; 5+ Tier 1 modules.

Activities:
- Lunch-and-learn or formal training sessions
- Each feature team picks one module
- Champion pairs with each team for their first module
- CI drift detection rolled out for promoted modules
- Sprint planning starts accounting for spec work

Gate to Phase 3: 3+ engineers can author modules independently.

### Phase 3 — Embedded (Months 7-12)

Goal: Methodology is part of how the team works; not "extra."

Activities:
- Definition of Done updated to include spec impact
- PR template requires spec impact assessment
- Quarterly methodology retrospective
- Annual ADR review per workflow/09
- Roadmap covers next 5+ modules

Gate to Phase 4: Methodology persists when champion takes 4-week vacation.

### Phase 4 — Maturity (Year 2+)

Goal: Methodology continuously improves; no longer "new."

Activities:
- Methodology evolution (contribute back; propose changes)
- New domain overlays (if expanding beyond initial domain)
- Multi-jurisdiction expansion (if applicable)
- Onboarding new hires via spec (not via code-reading)

## Onboarding new engineers

When a new engineer joins:

### Week 1 — Read

- README.md + METHODOLOGY.md (1 hour)
- workflow/00-START-HERE.md + workflow/01-authoring-checklist.md (30 min)
- 1 Tier 1 module's full ZeeSpec (2-3 hours)
- Existing CLAUDE.md ADR table for that module (30 min)

### Week 2 — Observe

- Shadow an R3 deep review (1-2 hours)
- Read an R5 drift report; understand findings (1 hour)
- Sit in on annual R6 ADR review (if timing aligns)

### Week 3-4 — Practice

- Pair on authoring a module with champion (one full module)
- Submit first PR with spec impact section
- Review spec drift findings on own PR

### Month 2 — Independent

- Author one module solo with mentoring
- R3 review another engineer's module
- Submit retroactive ADR for one design decision

By end of month 2: new hire is methodology-fluent.

## PR workflow integration

Modify PR template:

```markdown
## Description
[what this PR changes]

## ZeeSpec impact

- [ ] **Affected modules:** [list]
- [ ] **Spec updated:** [yes / no — if no, why?]
- [ ] **INV/HW affected:** [list IDs that change]
- [ ] **ADR needed:** [no / yes — link to ADR draft]
- [ ] **Drift findings created:** [link to drift report rows]
- [ ] **Cross-module impact:** [other modules affected; coordination done]
```

Reviewers expected to read spec impact section. If unaddressed → request changes.

## Definition of Done

For ZeeSpec modules, "done" includes:

- [ ] Code changes match spec OR spec updated to reflect new design
- [ ] If design change: ADR drafted (per workflow/09)
- [ ] If new invariant: INV-MOD-NN added with status tag + source
- [ ] If breaks existing invariant: status tag downgraded + spawn chip filed
- [ ] If cross-module: sibling module specs notified
- [ ] CI drift detection passes (no new P0/P1 drift)
- [ ] Tests added that pin new invariants

## Communication channels

### #zeespec Slack channel

For:
- Methodology questions
- Drift report announcements
- ADR notifications
- "Anyone done X before?" questions

### Weekly office hours

1-hour slot per week where champion is available for:
- Authoring help
- Review feedback
- Methodology clarifications
- "I'm stuck on..." questions

### Monthly methodology retrospective

15 min in team retrospective:
- What worked
- What didn't
- Process improvements
- Tooling gaps

## Incentive alignment

Methodology adoption requires that engineers feel it serves them, not the other way around.

### Carrots

- "ZeeSpec-fluent" is a recognized skill on internal career ladder
- Methodology champions get visible recognition (all-hands shoutout; performance review highlight)
- Engineers who write high-quality specs cited as examples
- New-hire feedback ("the spec helped me ramp faster") shared with author

### Sticks (use sparingly)

- PR can't merge if ZeeSpec module touched without spec update
- Compliance audit findings traced back to undocumented invariants → root cause review
- Drift items > 30 days old → reviewed in sprint retro

### Anti-incentives to avoid

- ❌ Penalize engineers for "low spec quality" — methodology adoption is collective; blaming individuals kills culture
- ❌ Use methodology as performance review weapon — engineers will write minimal specs to satisfy form
- ❌ Tie methodology to deadlines — pressure makes engineers skip docs

## Handling resistance

Common objections + responses:

### "We don't have time for more docs."

**Response:** Show ROI early. Track:
- Time saved on new-hire onboarding (week 1 productivity vs without spec)
- Production bugs prevented (drift detection caught X before launch)
- Compliance audit findings averted (auditor cited spec; no findings)

After 6 months, present hard numbers. Methodology should save more time than it costs by month 12.

### "Our existing docs are good enough."

**Response:** Run an audit. Pick 3 questions an auditor or new hire might ask. Can existing docs answer? Specifically:
- "What invariants does module X enforce?"
- "Who can approve a withdrawal > $1M?"
- "What's the retention policy for KYC documents?"

If existing docs don't answer cleanly → ZeeSpec value clear.

### "AI agents (Claude/Copilot) generate good enough code without methodology."

**Response:** True for simple cases. For regulated systems, AI hallucinates compliance details. ZeeSpec gives AI the structured context to generate correct code (citations, invariants, status tags). Demo: same prompt with vs without ZeeSpec context; show quality difference.

### "Methodology X is better."

**Response:** Methodology comparison is fine. Evaluate ZeeSpec on:
- Domain fit (regulated systems)
- AI compatibility (10-file Zachman structure is LLM-friendly)
- Lifecycle coverage (R4 research + R5 drift + R6 ADR is unusual completeness)

If alternative wins on relevant axes → use it. Don't adopt ZeeSpec for its own sake.

### "Compliance officer doesn't care about engineering specs."

**Response:** Compliance officer cares about audit trails + ability to answer regulator questions. ZeeSpec's regulator-research methodology + status-tagged invariants directly support audit. Invite compliance officer to one R2 review; let them see value.

## Sustaining rollout

After Phase 4 (maturity), keep methodology alive via:

### Annual methodology retrospective

1-day all-hands focused on:
- What worked over the year
- What didn't
- Methodology evolution proposals (contribute back upstream?)
- Tooling improvements
- Domain expansions

### Continuous improvement

- Watch for ZeeSpec methodology updates (new versions, new patterns)
- Periodic re-read of methodology files (every 6 months); apply new techniques
- Cross-pollinate with other teams using ZeeSpec

### Avoiding entropy

Year 3+ risk: methodology becomes ceremony rather than tool. Mitigate:
- Periodic "is this still worth it?" reviews
- Drop ceremonies that don't deliver value
- Refresh examples / templates as they age

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `01-adopting-zeespec-from-scratch.md` — greenfield path
- `02-onboarding-existing-project.md` — brownfield path
- `04-tooling-integration.md` — CI/IDE setup
- `06-common-pitfalls.md` — failure modes
- `workflow/08-code-drift-management/` — continuous discipline
- `workflow/09-adr-lifecycle/` — decision capture

## Next

→ `04-tooling-integration.md` — CI / IDE / Slack
→ `05-cross-domain-adaptation.md` — non-finance domains
