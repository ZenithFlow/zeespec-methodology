---
doc: workflow/12-agentic-role-replacement/03-architect-agent
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
human_role_replaced: Software Architect
coverage_estimate: 65-75%
---

# Architect Agent

> Architectural decisions are the highest-stakes engineering decisions: they propagate across modules + years. Solo dev faces architectural choices alone. Architect agent provides **structured second opinion + cross-module impact analysis + ADR draft assistance**.

## Human role хийдэг

| Үүрэг | Frequency | Time |
|-------|-----------|------|
| ADR drafting / sign-off | 5-15 per quarter | 2-4h each |
| Cross-module design review | Per major feature | 2-6h |
| Tech stack selection | Annual + per-component | 4-20h |
| Refactoring planning | Per major refactor | 8-40h |
| Migration strategy | Per migration | 16-80h |
| Performance / scalability review | Quarterly | 4-8h |
| Security architecture review | Quarterly | 4-8h |
| Technical debt prioritization | Quarterly | 2-4h |

## Agent coverage by sub-role

| Sub-role | Coverage | Pattern |
|----------|:--------:|---------|
| ADR drafting | 80% | R6 Mode A retroactive + Mode C new ADR conflict check |
| Cross-module impact | 75% | R6 Mode D cross-module check |
| Tech stack evaluation | 60% | Research + comparison; final decision human |
| Refactoring plan critique | 70% | Plan review + risk identification |
| Migration strategy | 65% | Step-by-step plan validation |
| Performance review | 55% | Profiling output analysis |
| Security review | 50% | Threat model first-draft |
| Technical debt | 70% | Prioritization matrix + R5 drift integration |

## Pattern A: ADR drafting (R6 Mode A extended)

Per `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` Mode A.

### Solo dev architect-mode dispatch

```javascript
Agent({
  description: "R6 architect ADR draft — [decision]",
  prompt: `You are R6 in ARCHITECT mode for proposed material design decision.
Per workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md.

Proposed decision context:
[describe situation; what alternatives are on the table]

Module: [target]
Module prefix: [MOD]

Architect responsibilities:
1. Find next ADR number
2. Draft ADR-MOD-NNN per workflow/09/01-adr-format-template.md
3. Generate 3-5 alternatives + analysis (don't just rubber-stamp proposed)
4. Identify cross-module impact (which sibling modules affected?)
5. List engineering consequences (effort estimate; migration; risks)
6. List rollback path (if decision turns wrong)
7. Identify which existing ADRs supersede/extend/conflict
8. Flag compliance/regulatory considerations
9. Recommend re-review trigger conditions

Output: full ADR draft + acceptance checklist + dispatch log.`,
})
```

### Solo dev process

```
Day 1 — Identify decision needed
        ↓
Day 1 — Dispatch architect agent (1-2h dispatch + 30 min input prep)
        ↓
Day 1 evening — Receive ADR draft
        ↓
Day 2 morning — 24h cool-off applied; re-read with fresh eyes
        ↓
Day 2 — Critique: are alternatives genuine? Are consequences realistic?
        ↓
Day 2 — Optionally dispatch panel (architect + R3 + R2 in parallel)
        ↓
Day 2-3 — Material? → Lawyer/peer external review
        ↓
Day 3 — Accept ADR; update INV/HW; commit
        ↓
Future — R6 Mode B annual review catches if drifts
```

## Pattern B: Cross-module impact analysis

When change spans multiple modules:

```javascript
Agent({
  description: "Architect cross-module impact — [change]",
  prompt: `You are architect agent analyzing cross-module impact.

Proposed change: [describe; module + nature]

Per workflow/09-adr-lifecycle/03-adr-relationships.md (cross-module inheritance)
+ checklists/cross-link-bidirectionality.md.

Analysis tasks:
1. Identify which sibling modules inherit from changing module
2. For each sibling: which inherited HW/ADR/INV would be affected?
3. Which sibling specs would need updating?
4. Are bidirectional cross-links maintained?
5. Effort estimate per sibling module
6. Coordination required (notification; spec-update sequencing)
7. Risk: silent breakage (sibling assumes old contract)
8. Migration window required?

Output:
- Sibling impact table
- Recommended notification list
- Coordination checklist
- Risk findings
- Estimated total effort (hours across all modules)`,
})
```

### Solo dev pattern

Solo dev can't talk to "other team owners" — they're all you. But sibling specs are READable + verifiable. Agent's cross-module impact analysis helps you remember what to update.

## Pattern C: Tech stack evaluation

When choosing tech for new component:

```javascript
Agent({
  description: "Architect tech stack eval — [component]",
  prompt: `You are architect agent evaluating tech for [component].

Requirements:
- [list functional]
- [list non-functional: scale, latency, etc.]
- [list constraints: language, hosting, etc.]

Existing stack: [what you use now]

Candidates: [list 3-5 alternatives OR ask agent to suggest]

For each candidate:
1. Fit to requirements (1-10)
2. Ecosystem maturity
3. Team familiarity (you're solo; account for learning curve)
4. Operational complexity
5. License / cost
6. Migration burden (if changing existing)
7. Vendor lock-in
8. 5-year viability

Output:
- Recommendation table
- Top 2 choices with detailed comparison
- Recommended next step (POC; further research; consultation)`,
})
```

Architecture agent suggests; solo dev decides. POC the top 2 if material.

## Pattern D: Refactoring plan critique

Before major refactor:

```javascript
Agent({
  description: "Architect refactoring critique — [refactor]",
  prompt: `You are architect agent reviewing refactor plan.

Current state: [describe]
Proposed refactor: [describe + steps]
Modules touched: [list]

Critique:
1. Step sequencing — any risky orderings?
2. Rollback feasibility at each step
3. Backwards compatibility (downstream consumers)
4. Data migration coordination
5. Test coverage adequacy
6. ZeeSpec impact (which dimension files need re-author?)
7. ADRs needed (Type 3-design + Type 4 drift)
8. Estimated time + risks

Output:
- Plan critique
- Recommended changes
- Risk matrix (probability x impact)
- Suggested step adjustments
- New ADR list to draft`,
})
```

### Anti-pattern guard

Solo dev tendency: dive into refactor without plan. Architect agent **forces planning step**.

## Pattern E: Migration strategy

Big data / framework migration:

```javascript
Agent({
  description: "Architect migration strategy — [migration]",
  prompt: `You are architect agent designing migration strategy.

From: [old]
To: [new]
Scope: [data / framework / etc.]
Constraints: [downtime tolerance; budget; deadline]

Design strategy:
1. Migration approach: big bang / blue-green / strangler-fig / dual-write
2. Step-by-step plan (numbered phases)
3. Rollback plan per phase
4. Data validation at each phase
5. Performance impact during migration
6. Risk catalog
7. Estimated effort + downtime
8. Communication plan (if affects users)

Output:
- Strategy recommendation
- Phased plan
- Risk matrix
- Pre-migration checklist
- Cutover checklist
- Post-migration checklist`,
})
```

For solo dev, this is **the most valuable architect agent role** — migration plans are time-consuming + risky alone.

## Pattern F: Performance / scalability review

Quarterly review or after profiling:

```javascript
Agent({
  description: "Architect performance review — [scope]",
  prompt: `You are architect agent reviewing performance.

Scope: [modules / queries / endpoints]
Profiling data: [paste if available]
Current baseline: [metrics]
Target: [SLA / desired metrics]

Analysis:
1. Bottleneck identification (CPU / IO / network / DB)
2. Quick wins (low-effort, high-impact)
3. Strategic improvements (medium-effort)
4. Architectural changes (high-effort)
5. Cost / benefit per improvement
6. Risk per improvement
7. Recommended prioritization

Output: ranked improvement list with effort + impact + risk per item.`,
})
```

## Pattern G: Security architecture review

Quarterly:

```javascript
Agent({
  description: "Architect security review — [module/system]",
  prompt: `You are architect agent doing security architecture review.

Scope: [describe]

Apply threat modeling:
1. STRIDE per critical entry point
2. Trust boundaries identified
3. Authentication / authorization flows reviewed
4. Data sensitivity classification
5. Encryption at rest + in transit
6. Audit log completeness (per HW-FIN-03)
7. Secrets management
8. Dependency vulnerability check
9. Compliance touchpoints (GDPR / HIPAA / PCI-DSS / etc.)

Output: threat matrix + recommended mitigations + priority + ZeeSpec
INV updates needed.`,
})
```

For solo dev: replace expensive security firm engagement (~$10K-50K) with periodic agent review + lightweight follow-up.

## Pattern H: Technical debt prioritization

Quarterly:

```javascript
Agent({
  description: "Architect technical debt review",
  prompt: `You are architect agent prioritizing technical debt.

Inputs:
- Open drift items (workflow/08 — paste R5 output)
- Open ADR conflicts (workflow/09 — paste R6 output)
- Open spawn chips (paste current chip backlog)
- Production incidents last quarter
- Performance metrics trends

For each debt item:
1. Impact rating (1-10)
2. Effort estimate (hours)
3. Risk if untouched (escalation potential)
4. Quick win vs strategic
5. Dependencies (other debt blocked by this?)

Output: prioritized backlog with rationale. Solo dev capacity: ~10h/month
for debt; recommend top 1-3 items.`,
})
```

## Multi-architect panel for material decisions

For very-high-stakes decisions (major rewrite, framework swap, etc.):

```javascript
// Dispatch 5 architect perspectives in parallel
Agent({ description: "Architect: solution architect view", ... })
Agent({ description: "Architect: security architect view", ... })
Agent({ description: "Architect: data architect view", ... })
Agent({ description: "Architect: senior eng pragmatic view", ... })
Agent({ description: "Architect: skeptic / contrarian view", ... })
```

Look for consensus + disagreement. If 4/5 agree on direction → likely OK. If 2-3/5 split → escalate to actual senior architect (paid consultation).

## Limitations + escalation

Architect agent CANNOT:

- ❌ Truly understand institutional history
- ❌ Read between PR lines (politics, team dynamics)
- ❌ Predict business pivots
- ❌ Replace real architect's domain experience
- ❌ Make career-defining decisions for solo dev

### Mandatory escalation triggers

| Trigger | Escalate to |
|---------|-------------|
| Major framework change (Spring → Express; PostgreSQL → DynamoDB) | Independent architect consultation (~$500-2000) |
| Multi-month refactor plan | Architect peer review |
| Compliance-touching architecture | Compliance lawyer + architect |
| Multi-module structural change | Senior architect review |
| Performance disaster (10x degradation) | Performance specialist |
| Security incident response | Security firm |
| Greenfield major product | Architect + product strategist |

## Cost / time summary

| Pattern | Cost | Time saved |
|---------|------|-----------|
| ADR drafting | $1-3 | 1.5-3.5h |
| Cross-module impact | $1-2 | 2-5h |
| Tech stack eval | $2-5 | 4-15h |
| Refactor plan critique | $1-3 | 3-8h |
| Migration strategy | $3-8 | 16-60h |
| Performance review | $2-4 | 3-7h |
| Security review | $2-5 | 3-7h |
| Tech debt prioritization | $1-2 | 1.5-3.5h |
| 5-agent architect panel | $10-25 | varies; reserve for material |
| **Monthly (solo dev active)** | **~$20-50** | **15-40h equivalent saved** |

Architect agent ROI: extremely high; 1 prevented bad architectural decision saves months.

## Anti-patterns

### Anti-pattern 1 — Skip 24h cool-off on architect ADR

**Symptom:** Architect agent drafts ADR; solo dev accepts immediately.

**Fix:** Material architectural decisions = mandatory 24-48h cool-off.

### Anti-pattern 2 — Single-architect agent for major decision

**Symptom:** Big refactor; one architect agent dispatch; proceed.

**Fix:** Multi-architect panel (5 perspectives) for material decisions.

### Anti-pattern 3 — Trust agent on "novel" tech choice

**Symptom:** Agent recommends bleeding-edge stack solo dev doesn't know.

**Fix:** Agent recommendation needs POC + own learning curve verification.

### Anti-pattern 4 — Skip cross-module impact

**Symptom:** Change shipped; sibling spec drifts silently.

**Fix:** Cross-module agent dispatch BEFORE shipping.

### Anti-pattern 5 — Ignore migration plan

**Symptom:** Big migration; no plan; "we'll figure it out as we go."

**Fix:** Architect agent migration plan = non-optional for material migrations.

## Cross-references

- `00-START-HERE.md` — agentic overview
- `01-reviewer-agents.md` — R3/R1/R2 reviewers
- `02-compliance-officer-agent.md` — compliance side
- `04-tech-lead-agent.md` — tactical decisions
- `07-orchestration-matrix.md` — multi-role coordination
- `workflow/09-adr-lifecycle/` — ADR process

## Next

→ `04-tech-lead-agent.md` — Tech lead role
→ `07-orchestration-matrix.md` — Multi-agent handoff
