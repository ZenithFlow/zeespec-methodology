---
doc: workflow/12-agentic-role-replacement/04-tech-lead-agent
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
human_role_replaced: Tech Lead
coverage_estimate: 50-60%
---

# Tech Lead Agent

> Tech lead role нь team-relational + technical hybrid (PR review + sprint planning + mentoring + technical direction). Solo dev-д team-relational хэсэг хамаагүй ч **PR triage + sprint planning + roadmap + decision-quality** хэрэгтэй. Agent эдгээрийг хэсэгчлэн орлуулна.

## Human role хийдэг

| Үүрэг | Frequency | Time |
|-------|-----------|------|
| PR review (daily) | Daily | 1-3h |
| Sprint planning | Bi-weekly | 2-4h |
| 1:1 with engineers | Weekly | 4-8h |
| Technical direction | Weekly | 2-4h |
| Cross-team coordination | Weekly | 2-4h |
| Mentoring junior devs | Ongoing | 5-10h/week |
| Tech debt management | Quarterly | 4-8h |
| Hiring / interviewing | Ad-hoc | 5-20h/cycle |

Total: ~15-30h/week.

## Agent coverage by sub-role

| Sub-role | Coverage | Notes |
|----------|:--------:|-------|
| PR review (technical) | 70% | Per `01-reviewer-agents.md` PR pattern |
| Sprint planning | 60% | Backlog prioritization; capacity advice |
| Technical direction | 45% | Advisory; final call human |
| 1:1 mentoring | 0% | N/A for solo |
| Cross-team coordination | 0% | N/A for solo |
| Tech debt management | 70% | Per `03-architect-agent.md` debt prioritization |
| Hiring | 10% | Maybe interview prep; not interviewing |

For solo dev, tech lead coverage = ~50% (relevant sub-roles only).

## Pattern A: Sprint / cycle planning

Bi-weekly:

```javascript
Agent({
  description: "Tech lead sprint planning — [cycle Y/W]",
  prompt: `You are tech lead agent for cycle planning. Project context:
[paste current state: open issues, recent commits, upcoming deadlines].

Inputs:
- Backlog: [paste GitHub issues or items list]
- Last cycle velocity: [items shipped]
- Capacity this cycle: [hours available — solo dev typically 30-50h]
- Upcoming deadlines: [dates + commitments]
- Tech debt budget: ~20% (10h)
- ZeeSpec drift backlog: [count P0/P1 from R5]
- ADR backlog: [count Proposed]

Tasks:
1. Prioritize backlog items (rank by impact / effort / dependency)
2. Allocate cycle capacity (features / debt / spec maintenance)
3. Identify cycle risk (overcommit / blocking dependencies)
4. Recommend top 3 cycle goals (focused; achievable)
5. Identify items to DEFER (with rationale)
6. ZeeSpec impact: which items need spec update? ADR?

Output:
- Cycle goals (top 3)
- Backlog ranked
- Capacity allocation
- Risk findings
- Deferred items with rationale
- Spec/ADR work mixed into cycle`,
})
```

### Solo dev pattern

Bi-weekly Friday 30 min:
1. Update issue list
2. Dispatch tech-lead agent (10 min runtime)
3. Read planning recommendation (10 min)
4. Adjust based on real priorities
5. Document cycle goals + commit

Replaces 2-4h of solo "what should I work on?" deliberation.

## Pattern B: PR triage + priority

Daily mass PR sorting (more common for teams; solo dev has own PRs):

```javascript
Agent({
  description: "Tech lead PR triage",
  prompt: `You are tech lead agent triaging PRs.

Open PRs: [paste list with title + author + age]

For each:
1. Priority (urgent / normal / low)
2. Reviewability (small / medium / large / megapr)
3. Risk level (none / low / medium / high)
4. Spec impact (yes / no / unsure)
5. Recommended review order
6. Stale PR warning (> 7 days)

Output: prioritized PR list + recommended action per PR.`,
})
```

For solo dev: usually own PRs only. Less valuable.

## Pattern C: Technical direction (advisory)

Quarterly:

```javascript
Agent({
  description: "Tech lead direction advisory — Q[N]",
  prompt: `You are tech lead agent advising on technical direction for Q[N].

Inputs:
- Current architecture: [summary or link]
- Pain points: [top 5]
- Business context: [product direction; constraints]
- Last quarter retros: [issues raised]
- Industry trends: [relevant emerging tech]

Advise:
1. Top 3 technical bets for Q[N]
2. What to deprecate / retire
3. Tech stack evaluation needed?
4. Team skills gap (if team) OR own skills gap (if solo)
5. Strategic investment recommendations
6. Risk catalog

Output: direction memo (1-2 pages).`,
})
```

For solo dev: replaces quarterly senior architect $1000 consultation with $5 agent dispatch + own deliberation.

## Pattern D: Tech debt vs features balance

Per cycle, helping with allocation:

```javascript
Agent({
  description: "Tech lead debt-feature balance",
  prompt: `You are tech lead agent balancing tech debt + feature work.

Cycle capacity: [hours]
Open debt items: [list with severity]
Feature backlog: [list with urgency]
Current debt-to-velocity ratio: [recent trend]

Recommend allocation:
- % features
- % bug fixes
- % tech debt
- % spec maintenance (ZeeSpec)
- % infrastructure

Rationale per allocation.

Output: cycle budget recommendation + rationale.`,
})
```

## Pattern E: Decision quality check

When facing tactical technical decision (not architectural):

```javascript
Agent({
  description: "Tech lead decision check — [decision]",
  prompt: `You are tech lead agent reviewing tactical decision.

Decision: [describe]
Options on table: [list]
Constraints: [time / budget / team]

Sanity check:
1. Have you considered obvious alternatives?
2. Is there a simpler solution?
3. What's the simplest thing that could possibly work?
4. What would future-you regret?
5. What's the rollback cost?
6. Does this align with architectural direction?

Output: critique + recommended choice + rationale.`,
})
```

## Limitations + escalation

Tech lead agent CANNOT:

- ❌ Mentor real junior devs
- ❌ Have 1:1 conversations
- ❌ Read team dynamics
- ❌ Navigate organizational politics
- ❌ Recruit / interview real candidates
- ❌ Build trust with stakeholders

For solo dev, these limitations matter less (solo). For small team, tech lead agent **augments** human tech lead, doesn't replace.

### Escalation triggers

| Trigger | Escalate to |
|---------|-------------|
| Hiring decision | Real human (panel interview) |
| Team interpersonal issue | Real human (peer / manager) |
| Strategic pivot | Founder / executive |
| Vendor selection (material $$$) | Independent consultant |
| Public technical communication | PR / marketing involvement |

## Cost / time summary (solo dev)

| Pattern | Cost | Time saved |
|---------|------|-----------|
| Sprint planning | $0.50-1 | 1.5-3.5h |
| PR triage | $0.30-0.50 | N/A solo |
| Direction advisory (quarterly) | $2-5 | 4-15h |
| Debt-feature balance | $0.50-1 | 1-2h |
| Decision quality check | $0.50-1 | 30-60 min |
| **Monthly (solo dev active)** | **~$5-15** | **5-10h** |

Tech lead agent ROI moderate for solo. More valuable for small teams (2-5 engineers).

## Anti-patterns

### Anti-pattern 1 — Skip planning because "agent will recommend"

**Symptom:** Solo dev waits for agent to tell them what to work on.

**Fix:** Agent suggests; YOU decide. Don't outsource autonomy.

### Anti-pattern 2 — Direction agent without grounding

**Symptom:** Direction agent recommends without understanding actual constraints.

**Fix:** Provide rich context (pain points, business direction, retros) when dispatching.

### Anti-pattern 3 — Quarterly direction skipped

**Symptom:** Heads down coding; never look up; drift toward obsolete tech.

**Fix:** Quarterly direction review = calendar event. Even if 30 min only.

## Cross-references

- `00-START-HERE.md` — agentic overview
- `01-reviewer-agents.md` — PR review side
- `03-architect-agent.md` — architectural decisions
- `07-orchestration-matrix.md` — multi-role coordination

## Next

→ `05-domain-expert-agent.md` — Business / product perspective
