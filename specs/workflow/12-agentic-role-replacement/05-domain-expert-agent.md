---
doc: workflow/12-agentic-role-replacement/05-domain-expert-agent
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
human_role_replaced: Domain Expert / Product Manager
coverage_estimate: 40-55%
---

# Domain Expert / Product Manager Agent

> Domain expert / PM нь user flow + business rules + product strategy-ийг хариуцдаг. Solo dev-д энэ role нь хамгийн хэцүү орлуулагдах — domain expertise + customer empathy нь human-specific. Гэхдээ **business rule validation, user-flow consistency check, product critique** agent хэсэгчлэн хийж чадна.

## Human role хийдэг

| Үүрэг | Frequency | Time |
|-------|-----------|------|
| User research / interview | Ongoing | 5-15h/week |
| Business rule definition | Per feature | 2-5h |
| User flow design | Per feature | 3-8h |
| Acceptance criteria | Per ticket | 30 min - 2h |
| Customer support escalation | Daily | 1-3h |
| Roadmap / prioritization | Quarterly | 8-20h |
| Competitive analysis | Monthly | 4-8h |
| Stakeholder communication | Weekly | 5-10h |

Total: ~20-40h/week.

## Agent coverage by sub-role

| Sub-role | Coverage | Notes |
|----------|:--------:|-------|
| User research | 0% | N/A — needs real users |
| Business rule validation | 60% | Cross-check against spec INV / BR |
| User flow consistency | 55% | Detect inconsistencies vs documented flows |
| Acceptance criteria draft | 65% | Generate; human approves |
| Customer support escalation | 30% | Triage; not resolve |
| Roadmap critique | 40% | Strategic perspective limited |
| Competitive analysis | 70% | Per anthropic plugin (market-researcher) |
| Stakeholder comm | 0% | N/A — relational |

Domain expert agent: **40-55% useful for solo dev**; supplements own product thinking.

## Pattern A: Business rule validation

When designing new feature touching ZeeSpec module:

```javascript
Agent({
  description: "Domain expert BR validation — [feature]",
  prompt: `You are domain expert agent validating business rules.

Feature: [describe]
Module: [touches which ZeeSpec module(s)]

Per docs/business/business_rules.md OR overlays/finance-accounting/principles/
(adapt to your project's business rule catalog).

Tasks:
1. List existing BRs that affect this feature
2. Identify NEW BRs implied by this feature
3. Check for BR conflicts (new feature breaks old BR?)
4. Customer impact analysis (who's affected; how)
5. Compliance touchpoint check (any BR mapping to INV/HW?)
6. Edge case enumeration (what BRs might fail?)

Output:
- Affected BRs list
- New BRs needed (with proposed text)
- Conflicts flagged
- Customer impact summary
- Edge cases
- Recommended INV-MOD-NN updates`,
})
```

### Solo dev integration

Before building feature:
1. Dispatch domain expert agent (15-30 min)
2. Review BR list + new BR proposals
3. Update business rules catalog
4. Update affected ZeeSpec module specs
5. Build feature

Saves 1-3h vs from-scratch + reduces "I forgot about BR-X" production bugs.

## Pattern B: User flow consistency check

When designing user-facing flow:

```javascript
Agent({
  description: "Domain expert user flow check — [flow]",
  prompt: `You are domain expert agent reviewing user flow.

Proposed flow: [describe step-by-step]
User persona: [target customer]

Cross-check vs existing user flows (per docs/business/user_flows.md OR
similar):

1. Consistency with existing flows (similar actions = similar UX?)
2. Error handling (what if step X fails?)
3. Recovery path (user makes mistake; how to fix?)
4. Accessibility (a11y considerations)
5. Mobile vs desktop behavior
6. Empty states / first-time UX
7. Notification triggers (does the user get notified?)
8. Audit trail (per HW-FIN-03 if regulated)

Output:
- Inconsistencies vs existing flows
- Missing error handling
- Recovery gap warnings
- Accessibility recommendations
- Audit log requirement reminders`,
})
```

### Limitation

Agent doesn't replace **actual user testing**. It catches obvious flow inconsistencies, not nuanced UX issues. Solo dev should still:
- Eat own dog food
- Get 3-5 real users to test
- Watch session recordings

## Pattern C: Acceptance criteria draft

When writing user story / ticket:

```javascript
Agent({
  description: "Domain expert AC draft — [feature]",
  prompt: `You are domain expert agent drafting acceptance criteria.

Feature / user story: [describe]

Draft AC in Given/When/Then format covering:
1. Happy path
2. 2-3 alternative paths
3. Error scenarios (validation; permission; rate limit)
4. Edge cases (empty; max; boundary)
5. Performance criteria (if applicable)
6. Compliance criteria (if regulated; per ZeeSpec INV)
7. Accessibility criteria
8. Notification / audit log expectations

Output: 5-15 AC entries in G/W/T format.`,
})
```

Saves 30-90 min per ticket; produces more thorough AC than rushed solo drafting.

## Pattern D: Customer support escalation triage

When customer report comes in:

```javascript
Agent({
  description: "Domain expert support triage — [report]",
  prompt: `You are domain expert agent triaging customer support escalation.

Customer report: [paste]
Customer ID / context: [info]
Affected feature: [identify]

Triage:
1. Severity (impacts 1 user / many / critical compliance)
2. Likely cause (bug / mis-use / spec gap / regulatory)
3. Affected module (which ZeeSpec module?)
4. Reproducibility (can engineer reproduce?)
5. Workaround for customer (immediate)
6. Recommended response template
7. Internal action (engineering ticket; spec update; ADR; chip?)

Output:
- Severity assessment
- Root cause hypothesis
- Customer response draft
- Internal action items`,
})
```

## Pattern E: Roadmap critique

Quarterly:

```javascript
Agent({
  description: "Domain expert roadmap critique — Q[N]",
  prompt: `You are domain expert agent critiquing roadmap.

Current roadmap: [paste]
Customer feedback themes: [list]
Competitive landscape: [snapshot]
Business goals: [list]

Critique:
1. Customer value of each item (1-10)
2. Strategic alignment with business goals
3. Missing items (what customers asked for, but not on roadmap?)
4. Over-investments (items disproportionate to value)
5. Sequencing risk (depending on X first)
6. Compliance roadmap (per R4 amendment-tracking)

Output:
- Critique per roadmap item
- Recommended additions
- Recommended removals/deferrals
- Sequencing suggestions`,
})
```

### Limitation

Agent lacks **direct customer voice**. Strategic value of items requires customer development you do yourself.

## Pattern F: Competitive analysis (via market-researcher plugin)

Per `workflow/11-anthropics-plugin-integration/02-dispatching-from-zeespec.md`:

```javascript
Agent({
  description: "Dispatch market-researcher for [domain]",
  prompt: `Use anthropics/financial-services market-researcher plugin.

Topic: competitive landscape for [your product area]
Focus:
- Top 5 competitors
- Their pricing model
- Their unique differentiators
- Market trends
- Customer pain points addressed

Output: research brief.`,
})
```

Then analyze output with domain expert agent perspective:

```javascript
Agent({
  description: "Domain expert competitive analysis",
  prompt: `Given market-researcher output (paste): [output]

Analyze:
1. Where we're differentiated (defend)
2. Where we're vulnerable (improve)
3. Where market is moving (anticipate)
4. Strategic recommendations

Output: positioning brief.`,
})
```

## Limitations + escalation

Domain expert agent CANNOT:

- ❌ Interview real customers
- ❌ Build relationships with stakeholders
- ❌ Have intuition from years in domain
- ❌ Read between business-context lines
- ❌ Negotiate with partners
- ❌ Make truly strategic product bets

### Mandatory escalation triggers

| Trigger | Escalate to |
|---------|-------------|
| Strategic product pivot | Real product strategist / advisory |
| Major customer churn | Customer research (real interviews) |
| New market expansion | Local market expert |
| Pricing change | Pricing consultant / advisor |
| Brand / positioning | Marketing professional |

## Cost / time summary (solo dev)

| Pattern | Cost | Time saved |
|---------|------|-----------|
| BR validation per feature | $0.50-1 | 1-3h |
| User flow check | $0.50-1 | 0.5-2h |
| AC drafting | $0.30-0.50 | 0.5-1.5h per ticket |
| Support triage | $0.30-0.50 | 15-30 min per ticket |
| Roadmap critique (quarterly) | $1-3 | 2-6h |
| Competitive analysis | $5-10 (plugin) | 4-8h |
| **Monthly (solo dev active)** | **~$10-25** | **5-15h** |

Domain expert agent ROI for solo dev: moderate. **Real customer development still required** — agent supplements, doesn't replace.

## Anti-patterns

### Anti-pattern 1 — Agent as user research substitute

**Symptom:** "Agent thinks customers will want X."

**Fix:** Talk to actual customers. Agent ≠ customer voice.

### Anti-pattern 2 — Skip user testing because "AC was thorough"

**Symptom:** Build feature against agent-drafted AC; no user testing.

**Fix:** AC is foundation. User testing validates.

### Anti-pattern 3 — Roadmap by agent

**Symptom:** Quarterly roadmap accepted from agent without customer/strategy input.

**Fix:** Agent critiques YOUR roadmap. You drive direction.

### Anti-pattern 4 — Competitive paralysis

**Symptom:** Constantly studying competitors via agent; never shipping.

**Fix:** Competitive analysis quarterly max. Build > research.

## Cross-references

- `00-START-HERE.md` — agentic overview
- `02-compliance-officer-agent.md` — compliance angle
- `06-qa-tester-agent.md` — QA / test angle
- `workflow/11-anthropics-plugin-integration/02-dispatching-from-zeespec.md` — market-researcher plugin

## Next

→ `06-qa-tester-agent.md` — Test case generation
