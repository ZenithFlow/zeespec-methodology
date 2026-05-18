---
doc: workflow/12-agentic-role-replacement/00-START-HERE
type: workflow-entry
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: solo developers, small teams (1-5), or any team augmenting human roles with AI agents
addresses: Reviewer C v3.0 P0 #3 (roles don't exist in small teams); extends one-man-army (workflow/10/08)
---

# Agentic Role Replacement — Хүн ролуудыг agent-аар орлуулах

> **Хамгийн чухал гол санаа:** "AI agent ашигла" гэдэг хэт ерөнхий зөвлөмж. Энэхүү folder нь **role бүрийг хэрхэн dispatch хийх, ямар input хүлээх, output-ыг яаж integrate хийх, аль үед хүнд escalate хийх**-ийн системтэй гарын авлага.
>
> One-Man Army (workflow/10/08) нь "яагаад" хэрэгтэйг тайлбарласан. Энэ folder нь "яаж" хийхийг тайлбарлана.

## Тулгуур асуудал

Methodology нь 5-20 хүний team-д зориулагдсан гэж үздэг:

| Role | Үүрэг |
|------|-------|
| **Tech lead** | PR review, sprint planning, technical direction |
| **Compliance officer** | R2, STR/CTR filing, audit response |
| **Architect** | ADR sign-off, cross-module design review |
| **Reviewer** (independent) | R1/R3 deep review, peer review |
| **Domain expert / PM** | Business rule validation, user flow |
| **QA / tester** | Test case generation, edge case coverage |

Solo dev эсвэл 1-3 хүний team-д эдгээр role-уудаас 3-5 нь дутуу. **AI agent-аар орлуулж бодит болгох арга**.

## Гол зарчим

### 1. Agent != hire-r орлуулагч

AI agent нь **бодит хүний орлуулагч биш** — augmentation tool. Material decision-уудыг бодит хүн (та өөрөө + lawyer quarterly) баталгаажуулах ёстой.

### 2. Каждый агент = специфик role + specific input/output

"Run an AI agent" гэж ерөнхий зөвлөмж бус — **role-specific prompt + structured input + verified output**. Файл бүр нэг role-д зориулсан prompt template + dispatch checklist.

### 3. Multi-agent panel = consensus disciplint

Нэг material decision-ийг 1 agent биш, **3-5 agent параллель dispatch + consensus / disagreement resolution**. Хэрвээ agent-уудаас disagreement гарвал — escalate to human.

### 4. Honest limitation

Agent ямар нэг role-ыг 100%-ын хэмжээнд орлуулж чадахгүй. **Per-role: ямар %-аар орлуулж байгаа + escalation trigger** documented.

## 6 role + agent coverage

| Human role | Agent equivalent | Coverage % | Cost / dispatch | Detailed file |
|------------|------------------|:----------:|:---------------:|---------------|
| **Reviewer** (R1/R3) | R3 deep verifier + R1 algorithm | 75-85% | $1-3 | `01-reviewer-agents.md` |
| **Compliance officer** (R2) | R2 compliance reviewer + R4 research | 60-70% | $2-5 | `02-compliance-officer-agent.md` |
| **Architect** | R6 ADR curator + design review agent | 65-75% | $1-3 | `03-architect-agent.md` |
| **Tech lead** | PR triage + sprint planner agent | 50-60% | $1-2 | `04-tech-lead-agent.md` |
| **Domain expert / PM** | Business-rule validator + user-flow checker | 40-55% | $1-3 | `05-domain-expert-agent.md` |
| **QA / tester** | Test case generator + edge case explorer | 70-80% | $2-5 | `06-qa-tester-agent.md` |
| **Total monthly** (active solo) | All 6 active | — | **~$50-150** | — |

Hint per coverage rating:
- **70-85%**: routine tasks fully agent-doable; specialized cases need human
- **50-70%**: agent does first-pass; human review required
- **40-55%**: agent ассистант role; human stays decision-maker

## Read order

For first-time setup (~45 min):

1. **This file** (orientation; 5 min)
2. Choose ONE role to start (most-critical for your gap):
   - Reviewer most common gap → `01-reviewer-agents.md`
   - Compliance most-risky → `02-compliance-officer-agent.md`
   - Architectural change pending → `03-architect-agent.md`
3. `07-orchestration-matrix.md` — how roles handoff (when you're ready for multi-agent)
4. `08-limitations-and-escalation.md` — when to STOP and call a human

Don't try to set up all 6 at once. Start with most-painful gap.

## When to use this folder

| Scenario | Use this folder? |
|----------|------------------|
| Solo dev with no reviewer | ✅ Read 01 + 07 |
| Pre-launch compliance pressure | ✅ Read 02 + 08 |
| Major refactor pending; no architect | ✅ Read 03 + 07 |
| Need to ship MVP; no QA | ✅ Read 06 + 08 |
| Have a full team | ⚠️ Useful only for spec-time agent augmentation |
| Hobby project; no compliance | ❌ Overhead too high |

## Hardware + budget assumption

### Tools needed

- Claude Code (or Cursor, или any agent dispatch capable IDE)
- GitHub / GitLab (CI for orchestrated dispatch)
- Optional: external lawyer / domain expert quarterly

### Cost expectations

Solo dev running all 6 agents on schedule:

| Frequency | Cost / month |
|-----------|--------------|
| Daily (R3 on PR) | $20-40 |
| Weekly (R1+R2 + drift R5) | $10-20 |
| Monthly (R6 ADR + R4 re-check) | $5-10 |
| Quarterly (full panel reviews) | $5-15 (amortized) |
| **TOTAL** | **~$50-100/month** |

Annual: ~$600-1,200. Lower than half of one independent contractor reviewer.

### Time savings

| Role | Without agent (manual) | With agent | Net saved |
|------|------------------------|-----------|-----------|
| Reviewer (per module) | 4-8h | 1-2h | 3-6h |
| Compliance officer (per session) | 2-4h | 30 min review | 1.5-3.5h |
| Architect (ADR per decision) | 1-2h | 15 min review | 0.75-1.75h |
| Tech lead (sprint triage) | 2-3h | 30 min review | 1.5-2.5h |
| Domain expert (BR validation) | 1-2h | 15 min review | 0.75-1.75h |
| QA (test case generation) | 4-8h | 1-2h | 3-6h |
| **Per Tier 1 module** | **14-27h** | **3-6h** | **11-21h saved** |

ROI breakeven: ~1 Tier 1 module per quarter = positive return.

## Gold rules

### Rule 1 — Agent is starting point, not final word

Every agent output requires **human review** before commit. Even if you trust the agent. Critical for:
- Compliance decisions
- Material ADRs
- Production fixes (chips)
- Cross-module impact

### Rule 2 — Parallel > Sequential for critical decisions

For material decisions, dispatch 3+ agents in parallel + check for consensus:

```javascript
// Material decision: should we change KYC tier threshold?
Agent({ description: "R2 compliance perspective", prompt: "..." })
Agent({ description: "R6 ADR conflict check", prompt: "..." })
Agent({ description: "R3 production code review", prompt: "..." })

// If all 3 agree → safer to proceed
// If 2/3 agree → proceed with caution + documented dissent
// If 1/3 agree → ESCALATE to human
```

### Rule 3 — Document agent input + output

Per Pattern 1 in `workflow/11-anthropics-plugin-integration/01-plugin-output-as-adr.md`:

Every material agent dispatch logged:

```markdown
## Agent dispatch log entry

- Date: 2026-05-18T14:30Z
- Agent role: R2 Compliance reviewer
- Module: wallet
- Input: [paste prompt summary]
- Output file: agent-outputs/r2-wallet-2026-05-18.md
- Decision affected: INV-WAL-04
- Captured as: ADR-WAL-014 (if material) OR drift item D-WAL-12
- Human reviewer: [self-name] (cool-off 24h)
```

This creates audit trail "AI was used; here's what it said; here's what human decided."

### Rule 4 — Escalate proactively

Don't wait for failure. Escalate to human when:

- Agent confidence < 80% on its output
- Material money/compliance impact
- Cross-module ramifications
- First-of-kind decision (no precedent)
- Multi-agent disagreement > 1/3

Better to over-escalate than miss a material risk.

## Anti-patterns

### Anti-pattern 1 — "Agent does it all"

**Symptom:** Solo dev dispatch every decision to AI; rubber-stamps output.

**Why bad:** Compliance disaster. Human judgment needed for material risks.

**Fix:** Rule 1 + Rule 4. Agent = starting point, escalate when material.

### Anti-pattern 2 — "Single-agent confidence"

**Symptom:** "R2 agent said it's OK; we're good."

**Why bad:** Agent might be wrong; second perspective needed.

**Fix:** Rule 2 — multi-agent panel for material decisions.

### Anti-pattern 3 — "Output undocumented"

**Symptom:** Agent dispatched; output read; deleted from chat history.

**Why bad:** No audit trail; can't reproduce reasoning; future-you confused.

**Fix:** Rule 3 — log every material dispatch.

### Anti-pattern 4 — "Cost ignored"

**Symptom:** Dispatch dozens of agents per day; end-of-month bill shock.

**Why bad:** Sustainable only if cost tracked.

**Fix:** Monthly cost review per `workflow/10-adoption-guide/04-tooling-integration.md`.

### Anti-pattern 5 — "Skip human escalation"

**Symptom:** "I don't need a lawyer; agent confirmed."

**Why bad:** Agent can hallucinate compliance details. Material decisions need actual human expertise.

**Fix:** Rule 4 + budget for quarterly lawyer review.

## Cross-references

- `workflow/10-adoption-guide/08-one-man-army.md` — solo dev overall playbook
- `workflow/03-r3-deep-review.md` — R3 agent (already documented)
- `workflow/04-r1-r2-parallel-review.md` — R1+R2 agents
- `workflow/07-r4-regulatory-research/04-R4-agent-prompt.md` — R4 agent
- `workflow/08-code-drift-management/05-R5-drift-scanner-agent.md` — R5 agent
- `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` — R6 agent

## Next

→ Choose your most-painful gap:
- Reviewer gap → `01-reviewer-agents.md`
- Compliance gap → `02-compliance-officer-agent.md`
- Architect gap → `03-architect-agent.md`
- Tech lead gap → `04-tech-lead-agent.md`
- Domain expert gap → `05-domain-expert-agent.md`
- QA gap → `06-qa-tester-agent.md`

Or read the orchestration matrix: `07-orchestration-matrix.md`
