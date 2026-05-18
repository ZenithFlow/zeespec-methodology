---
doc: workflow/12-agentic-role-replacement/07-orchestration-matrix
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# Multi-Role Orchestration Matrix

> Нэг feature эсвэл change нь олон role-той хүйслэн ажилладаг (architect → reviewer → QA → compliance → tech lead). Solo dev-д энэ orchestration нь bottleneck — "хэн нь, хэзээ, ямар input/output-той" гэдгийг тодорхойлох хэрэгтэй. Энэ матриц нь **6 role-ийн handoff + multi-agent panel + parallel/sequential dispatch pattern**-ийг тодорхойлно.

## Why orchestration matters

Solo dev "agent-ы массаар ажиллуулна" гэж бодоход 3 problem үүсдэг:

1. **Output overload** — 6 agent paralelly dispatch хийвэл 6 урт report; solo dev synthesize хийж чадахгүй
2. **Context loss** — Agent бүр өөрийн context-той; нэг нь нөгөөгийн finding-ыг мэдэхгүй
3. **Cost spiral** — Coordination ачаалал → over-dispatch → $200+/month

Solo dev needs: **clear handoff chain** + **deduplication** + **single synthesis point** (themselves).

## Stage-based orchestration model

Зургаан role-ыг **development lifecycle**-ын stage-аар байрлуулна:

```
PLANNING                  DESIGN                IMPLEMENTATION         REVIEW              SHIP
─────────                 ──────                ──────────────         ──────              ────
Tech Lead     →   Architect       →    [Solo dev codes]    →    Reviewer (R3) →    Compliance
Domain Expert            (Architect + R6 ADR)                     QA (test plan)
                          Compliance                                Architect (re-check)
                          (early signal)
```

| Stage | Primary roles | Secondary | Output |
|-------|---------------|-----------|--------|
| Planning | Tech Lead | Domain Expert | Sprint goals, prioritized backlog |
| Design | Architect, Compliance | Domain Expert | ADR Proposed, INV updates |
| Implementation | (Solo dev) | QA scaffold | Code + initial tests |
| Review | Reviewer (R3), QA | Architect | Findings + test execution |
| Ship | Compliance | Tech Lead | Sign-off + post-deploy monitoring |

## Pattern A: Sequential handoff (the default)

For most features, **sequential** is safer than parallel — each role builds on prior output.

### Standard feature flow

```
1. Tech Lead agent      → "Should we build this?"          (15 min)
2. Domain Expert agent  → "What are BR + AC?"              (20 min)
3. Architect agent      → "How should it fit?"             (30 min)
4. Compliance agent     → "Any regulatory touchpoint?"     (15 min)
5. [Solo dev codes]                                        (2-8h)
6. Reviewer (R3) agent  → "Did code match spec?"           (20 min)
7. QA agent             → "Test plan + edge cases"         (25 min)
8. Compliance re-check  → "Final compliance pass"          (10 min)
9. [Ship]
```

Total agent dispatch time: ~2-2.5h
Total solo dev synthesis time: ~1.5-2h
Plus actual coding: variable

**Handoff convention:** Each agent's output saved as a markdown artifact in `docs/specs/<module>/orchestration/`:
- `01-tech-lead.md`
- `02-domain-expert.md`
- `03-architect.md`
- `04-compliance-early.md`
- `06-reviewer.md`
- `07-qa-plan.md`
- `08-compliance-final.md`

Next agent gets prior artifacts as input context.

## Pattern B: Parallel dispatch (for time-sensitive)

For URGENT changes (security fix; production incident; hotfix), parallelize:

```javascript
// Dispatch in parallel — single message, multiple Agent calls
[
  Agent({
    description: "Reviewer R3 — hotfix review",
    prompt: `Review hotfix [PR diff]. Focus: did the fix introduce regression?
    Cross-check against INV-MOD-NN for [module]. Single-pass deep review.`,
  }),
  Agent({
    description: "Compliance — hotfix compliance check",
    prompt: `Hotfix [PR diff]. Check: does this break any regulatory invariant?
    Touch points with HW-FIN, HW-DATA?`,
  }),
  Agent({
    description: "QA — hotfix regression matrix",
    prompt: `Hotfix [PR diff]. What modules might break? Regression test priority?`,
  }),
]
```

All three return in ~10-20 min. Synthesize: 15 min. Ship: 30-45 min total.

**Caveat:** Parallel = no agent sees the others' findings. Solo dev MUST manually reconcile conflicts.

## Pattern C: Multi-agent panel (consensus)

For HIGH-STAKES decision (architecture change, ADR Accept, compliance interpretation), dispatch **5 agents with different perspectives**:

```javascript
// Multi-agent panel: 5 perspectives on same question
[
  Agent({
    description: "Architect panel — solution perspective",
    prompt: `[Decision]. Evaluate from solution architecture lens: scalability, maintainability, cost.`,
  }),
  Agent({
    description: "Architect panel — security perspective",
    prompt: `[Decision]. Evaluate from security lens: attack surface, data exposure, auth model.`,
  }),
  Agent({
    description: "Architect panel — data perspective",
    prompt: `[Decision]. Evaluate from data lens: schema impact, migration cost, data integrity.`,
  }),
  Agent({
    description: "Architect panel — pragmatic perspective",
    prompt: `[Decision]. Evaluate pragmatically: simplest thing that works; ship-cost; rollback.`,
  }),
  Agent({
    description: "Architect panel — skeptic perspective",
    prompt: `[Decision]. Argue AGAINST this decision. What's the strongest case for NOT doing this?`,
  }),
]
```

### Consensus rules

After 5 panels return, count agreement:

| Score | Interpretation | Action |
|-------|----------------|--------|
| 5/5 agree | High confidence | Proceed |
| 4/5 agree | Proceed with documented dissent | ADR notes the 1 disagreement |
| 3/5 agree | Genuine uncertainty | Sleep on it; revisit in 24h |
| 2/5 agree | Likely wrong direction | Escalate to human / consultant |
| 1/5 agree | Almost certainly wrong | Reject; reframe question |

5 agents × $0.50-1 each = **$2.50-5 per major decision**. Compares well to $500-2000 architect consultation.

## Pattern D: Cross-role handoff specifics

Specific handoff protocols between role pairs:

### Architect → Reviewer (R3)

Architect produces ADR Proposed. Reviewer evaluates **whether code matches ADR**.

Handoff artifact: `docs/specs/<module>/decisions/ADR-NN-<title>.md` (Proposed status)

Reviewer prompt includes: "Given ADR-NN [paste], verify code [paste] implements decision correctly. Flag deviations."

### Domain Expert → QA

Domain expert produces AC. QA produces test cases per AC.

Handoff artifact: `docs/specs/<module>/acceptance_criteria.md`

QA prompt: "Per AC [paste], generate test cases covering each AC + edge cases."

### Compliance → Architect

Compliance flags regulatory touchpoint. Architect designs technical solution.

Handoff: compliance agent output includes "INV updates needed: INV-MOD-04 should require audit log". Architect picks up: "Designing audit log implementation per INV-MOD-04 requirement."

### Reviewer (R3) → Tech Lead

R3 surfaces findings. Tech Lead prioritizes which to fix this cycle.

Handoff: R3 produces findings markdown. Tech Lead agent prompt: "Given findings [paste], prioritize into this cycle (capacity Xh) vs deferred. Per severity matrix."

### QA → Architect (for systemic findings)

QA surfaces "this bug class appears in 3 modules". Architect addresses systemically.

Handoff: QA's regression matrix → architect agent: "Same bug type in 3 modules. Refactor opportunity? Design system-level fix?"

## Pattern E: Drift detection orchestration (R5 + others)

Drift orchestration is recurring (per `workflow/03-r-series-agents/05-r5-drift-scanner.md`):

```
Weekly (Friday afternoon):
1. R5 drift scanner agent → scan all modules
2. Synthesis (15 min solo dev):
   - P0/P1 findings → immediate
   - P2/P3 → next cycle backlog
3. Per P0/P1 finding:
   - If spec issue → Reviewer agent (re-validate spec)
   - If code issue → Tech Lead agent (cycle fit)
   - If ADR gap → Architect agent (R6 ADR draft)
4. Update plan
```

### Drift orchestration cost

| Frequency | Cost | Time |
|-----------|------|------|
| Weekly drift scan | $1-2 | 30 min |
| Per finding follow-up | $0.50-2 | 15-60 min |
| **Monthly** | **~$5-15** | **2-4h** |

## Pattern F: Solo dev as orchestrator (anti-burnout)

CRITICAL: Solo dev is the SYNTHESIS LAYER. Agents produce reports; solo dev synthesizes.

### Synthesis discipline rules

1. **Single agent at a time per stage** — don't dispatch reviewer + QA + compliance in parallel for same change without need
2. **Save outputs to disk** — paste into `orchestration/` folder; don't keep in mental working memory
3. **Synthesize at end of stage** — don't move to next agent without 5-min sit-down with prior output
4. **Max 3 agents per day for solo dev** — beyond that → output fatigue → quality drops
5. **Weekly orchestration retro** — 30 min Friday: did handoffs work? cost vs value?

### Anti-pattern: agent over-dispatch

**Symptom:** Solo dev dispatches 8 agents in morning; afternoon spent reading 8 reports; no actual coding.

**Fix:** Agent dispatch budget. Cap: 3 dispatches per dev-day for non-emergency.

## Pattern G: ADR lifecycle orchestration (R6 specific)

ADR creation involves 3 roles:

```
1. Architect agent       → ADR Proposed draft         (Mode A in R6 — drafting)
2. Multi-architect panel → Consensus review (5 perspectives) (Mode B)
3. R6 curator agent      → Lifecycle status (Proposed → Accepted)  (Mode C in R6 — curation)
4. Reviewer agent (R3)   → ADR follow-up validation  (post-implementation)
```

Per `workflow/03-r-series-agents/06-r6-adr-curator.md`.

ADR end-to-end cost: $3-7 per ADR. Beats $0 (no ADR → drift later) by orders of magnitude in 6 months.

## Pattern H: Bug → fix → release orchestration

Customer-reported bug, full flow:

```
1. Domain Expert agent  → Triage (severity, customer impact)   ($0.30, 10 min)
2. QA agent             → Bug repro + failing test             ($0.30, 15 min)
3. [Solo dev fixes]                                            (30-120 min)
4. Reviewer (R3) agent  → Verify fix matches spec              ($0.50, 15 min)
5. QA agent             → Regression matrix (other modules?)   ($0.50, 15 min)
6. Compliance (if relevant) → Compliance check                 ($0.30, 10 min)
7. Tech Lead agent      → Release decision (now / batch?)      ($0.30, 10 min)
8. [Ship]
9. (Post-release) Reviewer → Spec update if INV changed        ($0.30, 10 min)
```

Total: $2-3 + 1.5-3h orchestration + actual fix time.

## Orchestration anti-patterns

### Anti-pattern 1 — Sequential when parallel safe

**Symptom:** Spent 4h waiting for sequential dispatch when 3 of the agents had no inter-dependency.

**Fix:** Identify parallelizable agents per stage. Dispatch them in single message.

### Anti-pattern 2 — Parallel when sequential needed

**Symptom:** Dispatched architect + compliance + QA in parallel; each had different assumption about decision; outputs contradicted.

**Fix:** When decision affects all 3, sequential. Architect first, then others.

### Anti-pattern 3 — No synthesis layer

**Symptom:** 5 agent outputs sitting unread; solo dev forgot what each said by Friday.

**Fix:** Synthesize within 30 min of agent return. Write 1-line summary per agent.

### Anti-pattern 4 — Skip handoff artifacts

**Symptom:** Verbal handoff between agent runs ("the architect agent said X, so QA agent will know"); next agent doesn't know.

**Fix:** Always save to `orchestration/NN-role.md`. Pass file path to next agent.

### Anti-pattern 5 — Multi-agent panel for trivial decision

**Symptom:** 5 architects dispatched for "what color should the button be?"

**Fix:** Multi-agent panel reserved for ADR-worthy decisions. Trivial → 1 agent + own judgment.

## Cost / time summary (multi-role orchestration)

| Pattern | Cost | Time saved |
|---------|------|-----------|
| Sequential standard feature | $3-7 | 4-8h vs all-solo |
| Parallel hotfix | $1.50-3 | 1-2h vs sequential |
| Multi-agent panel | $2.50-5 | $500-2000 vs human panel |
| Weekly drift orchestration | $5-15/mo | 2-4h/mo synthesis |
| Per-bug full flow | $2-3 | 1-2h vs no orchestration |
| **Monthly (active solo dev)** | **~$40-80** | **20-40h orchestration savings** |

## Orchestration calendar (solo dev recommended)

Daily:
- 1 dispatch max for ad-hoc (compliance question, architecture sanity check)

Per feature:
- Standard sequential flow (Pattern A) for any feature > 4h work

Weekly (Friday):
- Drift scan orchestration (Pattern E)
- Orchestration retro (15 min)

Bi-weekly (cycle):
- Tech Lead sprint planning (start of cycle)
- Cycle retrospective (end of cycle)

Quarterly:
- Architect direction advisory
- Multi-agent panel on top 3 strategic decisions
- Cost / ROI review

## Cross-references

- `00-START-HERE.md` — overall agentic overview
- `01-reviewer-agents.md` through `06-qa-tester-agent.md` — individual role patterns
- `08-limitations-and-escalation.md` — when agents stop being enough
- `workflow/03-r-series-agents/00-START-HERE.md` — R-series specialized agents
- `workflow/10-adoption-guide/08-one-man-army.md` — solo dev integration

## Next

→ `08-limitations-and-escalation.md` — Honest limits + when to escalate to humans
