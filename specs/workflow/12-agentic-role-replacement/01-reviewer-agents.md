---
doc: workflow/12-agentic-role-replacement/01-reviewer-agents
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
human_role_replaced: Independent Reviewer (R1 + R2 + R3)
coverage_estimate: 75-85%
---

# Reviewer Agents — Independent reviewer-ийг agent-аар орлуулах

> **Хүний "Independent reviewer" role нь team-д хамгийн ердийн dependency.** Solo dev-д "өөрийн кодоо өөрөө review хийдэг" нь useless. AI agent independent perspective өгдөг — фрагшилгүй, эмоциональд оршигдоогүй, codebase-ийг шинэ нүдээр уншдаг.

## Human role нь юу хийдэг вэ?

Independent reviewer (тек team member, code reviewer):

1. **R3 deep review** — line-by-line spec vs code (4-8h per Tier 1 module)
2. **R1 algorithm review** — алгоритм + race condition + invariant correctness (1-2h)
3. **R2 compliance review** — audit gap + regulatory adherence (1-2h)
4. **PR review** — daily code changes (varies; ~30 min per PR)
5. **Pair programming** — real-time second opinion (occasional)

Total time: **6-14h per module + ongoing PR**.

## Agent coverage by sub-role

| Sub-role | Agent coverage | Dispatch frequency | Cost / dispatch |
|----------|:--------------:|--------------------|:----------------:|
| R3 deep review | 85% | Per Tier 1 promotion + quarterly re-validation | $2-4 |
| R1 algorithm review | 80% | Same as R3 | $1-3 |
| R2 compliance review | 65% | Same as R3 + after R4 amendment | $2-4 |
| PR code review | 70% | Per PR (CI-integrated) | $0.50-1 |
| Pair programming | 30% (rubber-duck only) | Ad-hoc | n/a |

**What humans still required for:**
- Material compliance decisions (lawyer hours)
- Architectural pivots (fresh outside perspective)
- New domain unfamiliarity
- Politically sensitive decisions
- Disagreement resolution between agents

## R3 Agent — Deep verifier (line-by-line spec vs code)

### Дэлгэрэнгүй prompt

Located at: `workflow/03-r3-deep-review.md` (existing methodology phase).

### Solo dev dispatch pattern

```javascript
Agent({
  subagent_type: "general-purpose",
  description: "R3 deep review — [module] Tier 0 → Tier 1 promotion",
  prompt: `You are R3, deep verifier for the [module] ZeeSpec at
docs/specs/zeespec/[module]/. Verify EVERY production claim against actual
production code at backend/src/[module]/.

[paste full R3 prompt from workflow/03-r3-deep-review.md]

Focus areas (solo dev priority):
1. Phantom methods — spec cites X.method() but code has no such method
2. Phantom fields — spec describes field X but entity has no such column
3. Status tag accuracy — ✅ IMPL claims actually verified in code?
4. Line ref drift — spec citation file:265 actually at line 397?
5. AccountStatus pattern — spec says enforced; code accepts bypass?

Output format:
- Group findings by severity (P0/P1/P2/P3)
- Cite file:line for each
- Recommend resolution path (spec edit / spawn chip / ADR)
- Keep under 2000 words

Expected dispatch time: 30-60 min agent runtime.`,
  run_in_background: false
})
```

### Solo dev cool-off integration

```
Day 1: Dispatch R3 (afternoon; let it run)
Day 1 evening: Receive output; quick scan; commit to disk
Day 2 morning: Re-read with fresh eyes
Day 2: Apply findings per workflow/05-apply-findings.md
```

24h gap prevents hot-typing reactions to agent output.

### Limitations

R3 cannot:
- Read git history beyond Bash tool allows
- Talk to PR authors about intent
- Access closed Slack discussions
- Know about pending feature changes
- Make judgment calls on "is this a bug or feature?"

**Escalation triggers:**
- Finding count > 20 (module may need full re-author)
- "Unclear if bug or design" findings > 3
- Cross-module impact detected
- Compliance-touching invariant flagged

## R1 Agent — Algorithm + race condition

Located at: `workflow/04-r1-r2-parallel-review.md` § "R1 prompt".

### Dispatch pattern

```javascript
Agent({
  subagent_type: "general-purpose",
  description: "R1 algorithm review — [module]",
  prompt: `You are R1, algorithm + race condition reviewer for [module].
R3 was completed [date] with findings: [paste R3 summary].

Per workflow/04-r1-r2-parallel-review.md R1 prompt template.

Solo dev focus:
1. ALG-MOD-NN entries: trace each algorithm end-to-end; pseudocode match?
2. Race conditions: check-then-act patterns without locks?
3. Service-layer integration: partial-failure windows in 3-5 critical chains?
4. Dead code: documented methods unused in production?
5. State machine consistency: do transitions actually fire?
6. Cross-module ordering: enforced or assumed?
7. Numeric precision: never float for money?
8. Pseudocode validation: 3 ALG entries verified against code?

Output: severity-grouped findings; cite file:line; under 2000 words.`,
  run_in_background: true
})
```

### Solo dev pattern: parallel with R2

```javascript
// Dispatch BOTH simultaneously (different conversations / threads)
Agent({ description: "R1 algorithm", ... }) // backgrounded
Agent({ description: "R2 compliance", ... }) // backgrounded

// Wait for both to complete
// Compare R1 + R2 findings
// Look for overlap (same finding from different angles = high confidence)
// Look for conflict (R1 says safe; R2 says risky = ESCALATE)
```

Parallel dispatch avoids R1 biasing R2 (and vice versa).

### Limitations + escalation

R1 cannot:
- Run production code (only reads + analyzes)
- Test race conditions empirically
- Profile actual performance
- Detect issues only visible at runtime

**Escalation triggers:**
- Suspected race condition with money impact
- Recommended algorithm change spanning > 1 module
- "Service-layer assumption" findings (need verification with tests)

## R2 Agent — Compliance + audit + cross-module

Located at: `workflow/04-r1-r2-parallel-review.md` § "R2 prompt".

For finance modules: use specialized R2 at `overlays/finance-accounting/prompts/R2-financial-reviewer.md`.

### Dispatch pattern (finance example)

```javascript
Agent({
  subagent_type: "general-purpose",
  description: "R2 compliance review — wallet (finance overlay)",
  prompt: `You are R2 compliance reviewer for wallet module using
finance-accounting overlay. Per
overlays/finance-accounting/prompts/R2-financial-reviewer.md.

Pilot jurisdiction: Mongolia
- FRC AML/CFT law 2013 (am. 2017+): 20M MNT CTR threshold, 24h STR, 7y retention
- IFRS 9 ECL for accounting
- See overlays/finance-accounting/principles/regulatory-compliance.md

10 sections to cover (per prompt template):
A. Audit trail completeness (createdBy:0 check)
B. Double-entry + ledger integrity
C. AML/CFT (KYC at every path; CTR; STR; sanctions; UBO; PEP; no bypass)
D. SoD enforcement
E. Retention + segregation
F. Reconciliation
G. Money + precision
H. Periodic reporting
I. Cross-module integrity
J. 10 inspector questions

Output format per template.`,
  run_in_background: true
})
```

### Solo dev integration

After R2 output:

1. **24h cool-off** before applying
2. **Cross-check with R4 sources** — does R2 cite Tier 1 sources for compliance claims?
3. **If material compliance gap → escalate to lawyer** (don't trust agent alone)
4. **Document agent dispatch + decision** per Rule 3

### Limitations + escalation

R2 cannot:
- Provide legal advice (Anthropic-disclaimer)
- Know about pending regulator inspections
- Read internal compliance reports
- Replace actual compliance officer judgment on edge cases

**Escalation triggers:**
- Any 🚨 P0 compliance finding
- Aged drift on compliance-relevant invariant
- Disagreement with R3 / R1 findings on same item
- New jurisdiction not covered by current R4

## PR-time code reviewer (continuous)

Daily PRs need lightweight reviewer.

### Pattern: CI dispatch on every PR

```yaml
# .github/workflows/pr-reviewer.yml
name: AI Code Reviewer

on:
  pull_request:
    paths:
      - 'backend/src/**'
      - 'docs/specs/zeespec/**'

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Dispatch AI reviewer
        run: |
          # Pseudo-code; adapt to your AI dispatch infrastructure
          # E.g., via claude-dispatch CLI or anthropic API
          claude-agent dispatch \
            --prompt-file .github/agent-prompts/pr-reviewer.md \
            --context "$(git diff origin/main...HEAD)" \
            --output review-comment.md
      
      - name: Post as PR comment
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: review-comment.md
          header: ai-reviewer
```

### Agent prompt for PR review

```markdown
# .github/agent-prompts/pr-reviewer.md

You are an AI code reviewer for this PR. Context: ZeeSpec-codified project.

For each changed file:
1. Identify which ZeeSpec module it touches
2. Check spec impact: does this change affect INV/HW/ADR entries?
3. Check status tags: any code change that downgrades a ✅ IMPL to 🟡 PARTIAL?
4. Check for sentinel values: createdBy:0 or similar?
5. Check for hard DELETE on retention tables
6. Check for new fields without invariant analysis (Type 2 drift)
7. Check for behavioral changes (Type 3 drift)

Output format (PR comment):

## AI Code Review

### Spec impact
- Modules affected: [list]
- INV/HW/ADR potentially affected: [list]
- Spec updates needed: [yes/no + what]

### Risk findings (P0/P1)
[list]

### Suggestions (P2/P3)
[list]

### Approve? 
- ✅ AUTO-APPROVE (low risk; no spec impact)
- ⚠️ HUMAN REVIEW (spec impact OR risk findings)
- 🚨 BLOCK (P0 finding)
```

### Cost-aware

PR-time review: ~$0.50-1 per PR. For solo dev with 10-20 PRs/month: ~$10-20/month.

## "Pair programming" agent (rubber-duck)

Real human pair programming has dual value: spotting bugs + thinking aloud. Agent only does the second (rubber-duck).

### Pattern: ad-hoc consultation

```
Engineer (you): "I'm about to refactor PaymentService to split into
Initiation + Execution + Reconciliation. Plan:
1. ...
2. ...
3. ..."

Agent({
  description: "Pair programming consultation",
  prompt: "Review this proposed refactor plan for PaymentService:
           [paste]
           Consider:
           - Affected ZeeSpec modules
           - Cross-module HW constraints (per gravity.md)
           - Sequence risks
           - Rollback plan needed?
           - Database migration coordination
           Don't approve; just critique + suggest."
})
```

### Limitations

Pair programming agent CANNOT replace:
- Actual second engineer who knows the codebase
- Domain expert who knows business context
- Architect who's seen the system evolve

It's **rubber-duck on steroids** — useful for organizing your own thoughts.

## Multi-reviewer panel (consensus discipline)

For material changes, dispatch 3-5 reviewers in parallel + check consensus.

### Pattern: panel dispatch

```javascript
// All 5 in parallel (single message, multiple Agent calls)
Agent({ description: "R3 deep code review", prompt: "..." })
Agent({ description: "R1 algorithm review", prompt: "..." })
Agent({ description: "R2 compliance review", prompt: "..." })
Agent({ description: "Architect-perspective: cross-module impact", prompt: "..." })
Agent({ description: "Senior eng perspective: code quality + maintainability", prompt: "..." })
```

### Consensus rules

| Agreement | Action |
|-----------|--------|
| 5/5 agree | Proceed with high confidence |
| 4/5 agree | Proceed; document dissent in ADR / commit message |
| 3/5 agree | Pause; investigate dissent; possibly re-dispatch |
| 2/5 agree | ESCALATE to human; multi-agent disagreement = ambiguity |
| 1/5 agree | Probably wrong; revert plan; consult human |

This **prevents single-agent confidence bias**.

### Cost

5-agent panel: ~$5-15 per dispatch. Reserve for material decisions only (1-2 per month for solo dev).

## Output integration into ZeeSpec workflow

```
Reviewer agent dispatched
        ↓
Output saved to agent-outputs/[date]-[agent].md
        ↓
24h cool-off
        ↓
Read with fresh eyes
        ↓
Apply per workflow/05-apply-findings.md:
  - Type 1/2 drift → spec edit
  - Type 3-bug → spawn chip per workflow/06
  - Type 3-design / Type 4 → ADR per workflow/09
        ↓
Update CLAUDE.md "Active Issues" + drift items
        ↓
Commit with agent dispatch log entry
```

## Cost / time summary

| Pattern | Cost | Time saved vs human reviewer |
|---------|------|------------------------------|
| Single R3 (per module) | $2-4 | 4-8h |
| Single R1 (per module) | $1-3 | 1-2h |
| Single R2 (per module) | $2-4 | 1-2h |
| PR-time review | $0.50-1 per PR | 15-30 min per PR |
| 5-agent panel | $5-15 | 8-15h equivalent |
| **Monthly (solo dev, 3-5 Tier 1)** | **~$30-60** | **15-25h equivalent saved** |

ROI: extremely positive. Cost = ~half hour of senior engineer time.

## Anti-patterns specific to reviewer agents

### Anti-pattern 1 — Rubber-stamp R3

**Symptom:** R3 output read; instantly applied; no critique.

**Fix:** 24h cool-off + read with fresh eyes + cross-check vs code yourself.

### Anti-pattern 2 — Skip R1 because "R3 is enough"

**Symptom:** Only R3 dispatched; R1 race-condition issues missed.

**Fix:** R1 + R2 in parallel after R3. Each catches different errors.

### Anti-pattern 3 — Multi-agent panel for trivial changes

**Symptom:** 5 agents dispatched for every PR.

**Fix:** Panel = material decisions only. Most PRs need just R3 OR PR-reviewer.

### Anti-pattern 4 — Treat agent disagreement as noise

**Symptom:** 2/5 panel say risky; ignore + proceed.

**Fix:** Disagreement = signal. Investigate why; possibly escalate human.

### Anti-pattern 5 — No dispatch log

**Symptom:** Agent output deleted after applying findings.

**Fix:** Rule 3 — log every dispatch + decision. Audit trail matters.

## Cross-references

- `00-START-HERE.md` — overall agentic replacement
- `02-compliance-officer-agent.md` — R2 deep dive
- `03-architect-agent.md` — architectural review
- `07-orchestration-matrix.md` — multi-agent handoff
- `08-limitations-and-escalation.md` — when to escalate human
- `workflow/03-r3-deep-review.md` — R3 phase
- `workflow/04-r1-r2-parallel-review.md` — R1+R2 phase

## Next

→ `02-compliance-officer-agent.md` — Compliance-specific agent
→ `07-orchestration-matrix.md` — Multi-role coordination
