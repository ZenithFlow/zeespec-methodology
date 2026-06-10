---
doc: extended/workflow/12-agentic-role-replacement/00-START-HERE
type: workflow-entry
phase: agentic-role-replacement
version: 2.0.0
status: stable
last_updated: 2026-06-10
applies_to: solo developers, small teams (1-5), or any team augmenting human roles with AI agents
addresses: Reviewer C v3.0 P0 #3 (roles don't exist in small teams); extends one-man-army (workflow/10/08)
---

# Agentic Role Replacement — Хүн ролуудыг agent-аар орлуулах

> **Хамгийн чухал гол санаа:** "AI agent ашигла" гэдэг хэт ерөнхий зөвлөмж. Энэ chapter нь **role бүрийг хэрхэн dispatch хийх, ямар input хүлээх, output-ыг яаж integrate хийх, аль үед хүнд escalate хийх**-ийн системтэй гарын авлага.
>
> One-Man Army (workflow/10/08) нь "яагаад" хэрэгтэйг тайлбарласан. Энэ chapter нь "яаж" хийхийг тайлбарлана.

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

1. **Agent != hire-r орлуулагч.** AI agent нь бодит хүний орлуулагч биш — augmentation tool. Material decision-уудыг бодит хүн (та өөрөө + lawyer quarterly) баталгаажуулах ёстой.
2. **Каждый agent = специфик role + specific input/output.** "Run an AI agent" гэж ерөнхий зөвлөмж бус — role-specific prompt + structured input + verified output.
3. **Multi-agent panel = consensus discipline.** Нэг material decision-ийг 1 agent биш, 3-5 agent параллель dispatch + consensus / disagreement resolution. Disagreement гарвал — escalate to human.
4. **Honest limitation.** Agent ямар нэг role-ыг бүрэн орлуулж чадахгүй. Per-role: coverage band + escalation trigger documented.

## 6 role + agent coverage

> **Coverage bands are unvalidated working hypotheses from a single pilot (N=1), not measurements.**

| Human role | Agent equivalent | Coverage band | Cost / dispatch |
|------------|------------------|:-------------:|:---------------:|
| **Reviewer** (R1/R3) | R3 deep verifier + R1 algorithm | High | $1-3 |
| **Compliance officer** (R2) | R2 compliance reviewer + R4 research | Medium | $2-5 |
| **Architect** | R6 ADR curator + design review agent | Medium | $1-3 |
| **Tech lead** | PR triage + sprint planner agent | Medium | $1-2 |
| **Domain expert / PM** | Business-rule validator + user-flow checker | Low | $1-3 |
| **QA / tester** | Test case generator + edge case explorer | High | $2-5 |
| **Total monthly** (active solo) | All 6 active | — | **~$50-150** |

Band definitions:

- **High** — routine tasks fully agent-doable; specialized cases need human
- **Medium** — agent does first-pass; human review required
- **Low** — agent assistant role; human stays decision-maker

## When to use this chapter

| Scenario | Use this chapter? |
|----------|-------------------|
| Solo dev with no reviewer | ✅ Reviewer section + orchestration |
| Pre-launch compliance pressure | ✅ Compliance section + `01-limitations-and-escalation.md` |
| Major refactor pending; no architect | ✅ Architect section + orchestration |
| Need to ship MVP; no QA | ✅ QA section + `01-limitations-and-escalation.md` |
| Have a full team | ⚠️ Useful only for spec-time agent augmentation |
| Hobby project; no compliance | ❌ Overhead too high |

Don't try to set up all 6 at once. Start with most-painful gap.

## Budget + ROI assumption

Tools needed: Claude Code (or any agent-dispatch-capable IDE), GitHub/GitLab CI, optional external lawyer / domain expert quarterly.

Cost expectations (solo dev, all 6 agents on schedule): daily R3-on-PR $20-40/mo + weekly R1+R2 + drift R5 $10-20/mo + monthly R6 ADR / R4 re-check $5-10/mo + amortized quarterly panels $5-15/mo ≈ **$50-100/month** (~$600-1,200/yr — under half of one independent contractor reviewer).

Time savings per Tier 1 module: manual ~14-27h → with agents ~3-6h (~11-21h saved). ROI breakeven: ~1 Tier 1 module per quarter.

## Gold rules

### Rule 1 — Agent is starting point, not final word

Every agent output requires **human review** before commit. Critical for: compliance decisions, material ADRs, production fixes (chips), cross-module impact.

### Rule 2 — Parallel > sequential for critical decisions

For material decisions, dispatch 3+ agents in parallel + check for consensus:

```javascript
// Material decision: should we change KYC tier threshold?
Agent({ description: "R2 compliance perspective", prompt: "..." })
Agent({ description: "R6 ADR conflict check", prompt: "..." })
Agent({ description: "R3 production code review", prompt: "..." })
// 3/3 agree → proceed; 2/3 → proceed with documented dissent; 1/3 → ESCALATE
```

### Rule 3 — Document agent input + output

Per Pattern 1 in `extended/workflow/11-anthropics-plugin-integration/00-START-HERE.md`. Every material agent dispatch logged:

```markdown
- Date: 2026-05-18T14:30Z
- Agent role: R2 Compliance reviewer / Module: wallet
- Input: [paste prompt summary]
- Output file: agent-outputs/r2-wallet-2026-05-18.md
- Decision affected: INV-WAL-04
- Captured as: ADR-WAL-014 (if material) OR drift item D-WAL-12
- Human reviewer: [self-name] (cool-off 24h)
```

Audit trail: "AI was used; here's what it said; here's what human decided."

### Rule 4 — Escalate proactively

Don't wait for failure. Escalate to human when:

- Agent expresses low confidence in its own output
- Material money/compliance impact
- Cross-module ramifications
- First-of-kind decision (no precedent)
- Multi-agent disagreement > 1/3

Better to over-escalate than miss a material risk.

## Anti-patterns

| Anti-pattern | Symptom | Fix |
|--------------|---------|-----|
| "Agent does it all" | Every decision dispatched to AI; output rubber-stamped | Rule 1 + Rule 4: agent = starting point; escalate material |
| Single-agent confidence | "R2 agent said it's OK; we're good" | Rule 2: multi-agent panel for material decisions |
| Output undocumented | Output read; deleted from chat history | Rule 3: log every material dispatch |
| Cost ignored | Dozens of dispatches/day; bill shock | Monthly cost review per `extended/workflow/10-adoption-guide/04-tooling-integration.md` |
| Skip human escalation | "I don't need a lawyer; agent confirmed" | Rule 4 + budget for quarterly lawyer review |

---

# Role 1 — Reviewer agents (R3 / R1 / R2)

> Independent reviewer нь team-д хамгийн ердийн dependency. Solo dev-д "өөрийн кодоо өөрөө review хийх" нь useless. AI agent independent perspective өгдөг.

Human role: R3 deep review (4-8h per Tier 1 module), R1 algorithm + race condition review (1-2h), R2 compliance review (1-2h), PR review (~30 min per PR), pair programming.

| Sub-role | Coverage band | Dispatch frequency | Cost |
|----------|:-------------:|--------------------|:----:|
| R3 deep review | High | Per Tier 1 promotion + quarterly | $2-4 |
| R1 algorithm review | High | Same as R3 | $1-3 |
| R2 compliance review | Medium | Same as R3 + after R4 amendment | $2-4 |
| PR code review | High | Per PR (CI-integrated) | $0.50-1 |
| Pair programming | Low (rubber-duck only) | Ad-hoc | n/a |

Humans still required for: material compliance decisions, architectural pivots, new domain unfamiliarity, politically sensitive decisions, disagreement resolution between agents.

### Essential dispatch — R3 deep verifier

Full prompt at `core/workflow/03-r3-deep-review.md`. Solo dev skeleton:

```javascript
Agent({
  description: "R3 deep review — [module] Tier 0 → Tier 1 promotion",
  prompt: `You are R3, deep verifier for the [module] ZeeSpec at
docs/specs/zeespec/[module]/. Verify EVERY production claim against actual
production code at backend/src/[module]/.

[paste full R3 prompt from core/workflow/03-r3-deep-review.md]

Focus areas (solo dev priority):
1. Phantom methods — spec cites X.method() but code has no such method
2. Phantom fields — spec describes field X but entity has no such column
3. Status tag accuracy — ✅ IMPL claims actually verified in code?
4. Line ref drift — spec citation file:265 actually at line 397?
5. AccountStatus pattern — spec says enforced; code accepts bypass?

Output: severity-grouped findings (P0-P3); cite file:line; recommend
resolution path (spec edit / spawn chip / ADR); under 2000 words.`,
})
```

Cool-off: dispatch Day 1 afternoon → quick scan evening → re-read Day 2 morning with fresh eyes → apply per `core/workflow/05-apply-findings.md`. 24h gap prevents hot-typing reactions.

R1 + R2 follow the same skeleton with prompts from `core/workflow/04-r1-r2-parallel-review.md` (finance modules: `examples/overlays/finance-accounting/prompts/R2-financial-reviewer.md`). Dispatch R1 and R2 **in parallel** (avoids cross-biasing); overlap between findings = high confidence, conflict = escalate. PR-time lightweight review can run from CI (~$0.50-1 per PR); output ends with AUTO-APPROVE / HUMAN REVIEW / BLOCK verdict.

R3/R1 cannot: run production code, test race conditions empirically, talk to PR authors about intent, judge "bug or feature?". R2 cannot: provide legal advice, know about pending inspections.

**Escalation triggers:** finding count > 20 (re-author candidate); "unclear if bug or design" findings > 3; suspected race condition with money impact; any 🚨 P0 compliance finding; R1/R2/R3 disagreement on same item.

Output integration: save to `agent-outputs/` → 24h cool-off → apply per `core/workflow/05-apply-findings.md` (Type 1/2 → spec edit; Type 3-bug → chip per workflow/06; Type 3-design / Type 4 → ADR per workflow/09) → log dispatch per Rule 3.

---

# Role 2 — Compliance officer agent

> Solo dev-д compliance officer байхгүй ердийн. AI agent **first-line filter** + ongoing compliance monitoring role-ыг гүйцэтгэх боломжтой. Lawyer quarterly + material decision-д заавал.

Human role: AML/CFT monitoring (daily), STR/CTR queue triage, KYC tier approval, audit response prep, sanctions screening QA, material decision sign-off, jurisdiction expansion review. ~10-20h/week for active officer.

| Sub-role | Coverage band | Pattern |
|----------|:-------------:|---------|
| AML monitoring (alerts) | High | R5-style continuous scan |
| Filing queue triage | High | Automated category + priority |
| KYC tier upgrade review | Medium | Doc check; human approves final |
| Audit response prep | Medium | First-draft; lawyer review |
| Sanctions screening QA | High | Match validation; false-positive filter |
| Material decision sign-off | Low | Agent advisory; human + lawyer decide |
| Jurisdiction expansion | Medium | R4 research; lawyer for final |

### Essential dispatch — daily compliance monitoring (CI / cron)

```markdown
# .github/agent-prompts/compliance-daily.md

You are a compliance officer agent doing daily monitoring. Project uses ZeeSpec
with finance-accounting overlay.

Today's checks:
1. CTR filing queue: PENDING_REVIEW rows > 4 business days old
2. STR filing queue: DRAFT rows > 12h old (warning before 24h SLA breach)
3. Sanctions list freshness: alert if any source (UN, OFAC, EU, MN) > 36h stale
4. Aged reconciliation breaks: OPEN rows > 3 days, by subledger + amount
5. Customer freeze cascade: sanctions FROZEN customer → wallet.status=FROZEN?
6. Daily CTR aggregation: customer crossed CTR threshold but no ctr_filing?

Output format:
🚨 CRITICAL (action today) / ⚠️ WARNING (this week) / ✅ NORMAL
Keep under 500 words.
```

Dispatch via scheduled CI; Slack/email on 🚨. Solo dev integration: 5 min daily check; urgent items addressed same day. If you can't act daily, switch to weekly.

Other patterns (same advisory framing, event-driven dispatch): STR/CTR first-draft (agent drafts; you review + sign + file), KYC tier upgrade review (APPROVE / NEED INFO / REJECT / ESCALATE verdict + rationale), audit response prep (draft + evidence package + gap analysis → lawyer reviews before submission), sanctions hit validation (FALSE POSITIVE / TRUE HIT / AMBIGUOUS), jurisdiction expansion assessment (R4 6-phase methodology, Tier 1 sources only), material decision advisory (explicitly NOT decision-maker; PROCEED / PAUSE / SEEK LAWYER / REJECT recommendation → 24h cool-off → lawyer if material → ADR).

Compliance agent CANNOT: provide legal advice, sign documents, negotiate with regulator, make criminal-liability decisions, replace bar-licensed lawyer for material compliance.

**Mandatory escalation:** any P0 compliance finding → lawyer same week; suspected criminal liability → lawyer immediately; regulator written inquiry → lawyer within 24h; cross-jurisdiction conflict → specialist; aged sanctions hit unresolved > 24h → lawyer + human compliance. **ANY regulator response = lawyer review. No exceptions.**

Budget: ~$20-50/month agent + quarterly lawyer ($500-1000) ≈ $2,500-4,000/year vs full-time officer $80-150K/year. But coverage is Medium — for the rest you still need lawyer + your own judgment.

---

# Role 3 — Architect agent

> Architectural decisions are the highest-stakes engineering decisions: they propagate across modules + years. Architect agent provides **structured second opinion + cross-module impact analysis + ADR draft assistance**.

Human role: ADR drafting/sign-off, cross-module design review, tech stack selection, refactoring planning, migration strategy, performance/scalability review, security architecture review, tech debt prioritization.

| Sub-role | Coverage band | Pattern |
|----------|:-------------:|---------|
| ADR drafting | High | R6 Mode A retroactive + Mode C conflict check |
| Cross-module impact | High | R6 Mode D cross-module check |
| Tech stack evaluation | Medium | Research + comparison; final decision human |
| Refactoring plan critique | High | Plan review + risk identification |
| Migration strategy | Medium | Step-by-step plan validation |
| Performance review | Medium | Profiling output analysis |
| Security review | Medium | Threat model first-draft |
| Technical debt | High | Prioritization matrix + R5 drift integration |

### Essential dispatch — ADR drafting (R6 architect mode)

Per `extended/workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` Mode A:

```javascript
Agent({
  description: "R6 architect ADR draft — [decision]",
  prompt: `You are R6 in ARCHITECT mode for proposed material design decision.
Per extended/workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md.

Proposed decision context: [situation; alternatives on the table]
Module: [target]   Module prefix: [MOD]

Architect responsibilities:
1. Find next ADR number
2. Draft ADR-MOD-NNN per workflow/09/01-adr-format-template.md
3. Generate 3-5 alternatives + analysis (don't rubber-stamp proposed)
4. Identify cross-module impact (which sibling modules affected?)
5. List engineering consequences (effort; migration; risks)
6. List rollback path
7. Identify which existing ADRs supersede/extend/conflict
8. Flag compliance/regulatory considerations
9. Recommend re-review trigger conditions

Output: full ADR draft + acceptance checklist + dispatch log.`,
})
```

Solo dev process: dispatch Day 1 → 24h cool-off → Day 2 critique (are alternatives genuine? consequences realistic?) → optionally panel (architect + R3 + R2 parallel) → material? external review → accept ADR; update INV/HW; commit. R6 Mode B annual review catches later drift.

Other patterns (same skeleton, different focus): cross-module impact analysis (sibling impact table + coordination checklist; per `extended/workflow/09-adr-lifecycle/03-adr-relationships.md` + `core/checklists/cross-link-bidirectionality.md`), tech stack evaluation (candidate comparison; POC the top 2 if material), refactoring plan critique (forces the planning step solo devs skip), migration strategy (the most valuable architect pattern for solo dev — phased plan + rollback per phase + cutover checklists), performance review (ranked improvements: effort + impact + risk), security architecture review (STRIDE threat model first-draft; replaces part of an expensive security firm engagement), tech debt prioritization (quarterly; inputs = R5 drift + R6 conflicts + chip backlog + incidents).

For very-high-stakes decisions: 5-perspective architect panel (solution / security / data / pragmatic / contrarian) — see orchestration Pattern C below.

Architect agent CANNOT: understand institutional history, read team politics, predict business pivots, replace real architect's domain experience.

**Mandatory escalation:** major framework/DB swap → independent architect consultation (~$500-2000); multi-month refactor plan → peer review; compliance-touching architecture → lawyer + architect; performance disaster → specialist; security incident → security firm.

---

# Role 4 — Tech lead agent

> Tech lead нь team-relational + technical hybrid. Solo dev-д team-relational хэсэг хамаагүй ч **PR triage + sprint planning + direction + decision-quality** хэрэгтэй.

| Sub-role | Coverage band | Notes |
|----------|:-------------:|-------|
| PR review (technical) | High | Per Reviewer section PR pattern |
| Sprint planning | Medium | Backlog prioritization; capacity advice |
| Technical direction | Low | Advisory; final call human |
| 1:1 mentoring | None | N/A for solo |
| Cross-team coordination | None | N/A for solo |
| Tech debt management | High | Per Architect section debt prioritization |
| Hiring | Low | Maybe interview prep; not interviewing |

### Essential dispatch — sprint / cycle planning (bi-weekly)

```javascript
Agent({
  description: "Tech lead sprint planning — [cycle Y/W]",
  prompt: `You are tech lead agent for cycle planning.

Inputs:
- Backlog: [paste issues]
- Last cycle velocity: [items shipped]
- Capacity this cycle: [hours — solo dev typically 30-50h]
- Upcoming deadlines: [dates]
- Tech debt budget: [hours reserved]
- ZeeSpec drift backlog: [P0/P1 count from R5]
- ADR backlog: [count Proposed]

Tasks:
1. Prioritize backlog (impact / effort / dependency)
2. Allocate cycle capacity (features / debt / spec maintenance)
3. Identify cycle risk (overcommit / blocking dependencies)
4. Recommend top 3 cycle goals (focused; achievable)
5. Identify items to DEFER (with rationale)
6. ZeeSpec impact: which items need spec update? ADR?

Output: cycle goals (top 3) + ranked backlog + capacity allocation +
risks + deferred items.`,
})
```

Bi-weekly Friday 30 min: update issues → dispatch → read recommendation → adjust to real priorities → document cycle goals. Replaces 2-4h of solo "what should I work on?" deliberation. **Agent suggests; YOU decide. Don't outsource autonomy.**

Other patterns: PR triage (priority / risk / spec-impact per PR — less valuable solo), quarterly direction advisory (top 3 technical bets; what to deprecate; skill gaps — give rich context or output is generic; calendar it even if 30 min), debt-vs-feature balance per cycle, tactical decision quality check ("simplest thing that could work? rollback cost? what would future-you regret?").

Tech lead agent CANNOT: mentor real devs, hold 1:1s, read team dynamics, navigate politics, interview candidates, build stakeholder trust. For solo dev these matter less; for small team the agent **augments** the human tech lead, doesn't replace.

**Escalation:** hiring decision → real panel; team interpersonal issue → human manager/peer; strategic pivot → founder; material vendor selection → independent consultant; public technical communication → PR involvement.

ROI moderate for solo (~$5-15/month, ~5-10h saved); more valuable for small teams.

---

# Role 5 — Domain expert / PM agent

> Хамгийн хэцүү орлуулагдах role — domain expertise + customer empathy нь human-specific. Гэхдээ **business rule validation, user-flow consistency, product critique** agent хэсэгчлэн хийж чадна.

| Sub-role | Coverage band | Notes |
|----------|:-------------:|-------|
| User research | None | Needs real users |
| Business rule validation | Medium | Cross-check against spec INV / BR |
| User flow consistency | Medium | Detect inconsistencies vs documented flows |
| Acceptance criteria draft | Medium | Generate; human approves |
| Customer support escalation | Low | Triage; not resolve |
| Roadmap critique | Low | Strategic perspective limited |
| Competitive analysis | High | Per anthropic plugin (market-researcher) |
| Stakeholder communication | None | Relational |

### Essential dispatch — business rule validation

```javascript
Agent({
  description: "Domain expert BR validation — [feature]",
  prompt: `You are domain expert agent validating business rules.

Feature: [describe]
Module: [touches which ZeeSpec module(s)]

Per docs/business/business_rules.md OR examples/overlays/finance-accounting/principles/
(adapt to your project's business rule catalog).

Tasks:
1. List existing BRs that affect this feature
2. Identify NEW BRs implied by this feature
3. Check for BR conflicts (new feature breaks old BR?)
4. Customer impact analysis (who's affected; how)
5. Compliance touchpoint check (any BR mapping to INV/HW?)
6. Edge case enumeration (what BRs might fail?)

Output: affected BRs + new BRs (proposed text) + conflicts + customer
impact + edge cases + recommended INV-MOD-NN updates.`,
})
```

Dispatch before building → review BR list → update catalog + affected specs → build. Saves 1-3h per feature + reduces "I forgot about BR-X" production bugs.

Other patterns: user flow consistency check (error handling, recovery paths, a11y, audit trail per HW-FIN-03 — catches obvious inconsistencies, NOT nuanced UX; still eat own dog food + test with 3-5 real users), acceptance criteria draft (Given/When/Then: happy + alternative + error + edge + compliance + a11y; AC is foundation, user testing validates), support escalation triage (severity + root-cause hypothesis + response draft + internal action), quarterly roadmap critique (agent critiques YOUR roadmap; you drive direction — it lacks direct customer voice), competitive analysis via market-researcher plugin per `extended/workflow/11-anthropics-plugin-integration/00-START-HERE.md`, then positioning analysis on the output.

Domain expert agent CANNOT: interview real customers, build stakeholder relationships, carry years of domain intuition, negotiate with partners, make truly strategic product bets. **Agent ≠ customer voice — talk to actual customers.**

**Mandatory escalation:** strategic product pivot → real strategist; major churn → real customer research; new market → local expert; pricing change → pricing consultant; brand/positioning → marketing professional.

ROI moderate (~$10-25/month, ~5-15h saved). Real customer development still required — agent supplements, doesn't replace. Competitive analysis quarterly max: build > research.

---

# Role 6 — QA engineer / tester agent

> Solo dev-д "өөрөө тест бичээд өөрөө review хийх" дутагдалтай — fresh eyes хэрэгтэй. QA agent нь test case generation + edge case enumeration + regression matrix-д **6 role-оос хамгийн өндөр coverage** үзүүлдэг.

| Sub-role | Coverage band | Notes |
|----------|:-------------:|-------|
| Test plan creation | High | From ZeeSpec INV / user stories |
| Test case generation | High | G/W/T + edge cases — strong |
| Edge case enumeration | High | Agent excels here; highest-ROI QA pattern |
| Bug reproduction script | High | Repro steps + minimal failing test |
| Regression matrix | High | Cross-module impact map |
| Test automation code | High | Playwright / Vitest / PHPUnit boilerplate |
| Manual exploratory | Low | Agent can suggest; cannot perform |
| Performance test scripts | Medium | k6 / Artillery scaffold only |
| Accessibility audit | Medium | Static checks; not full a11y review |
| Test data fixtures | High | Generate realistic test data |

### Essential dispatch — test plan generation from ZeeSpec INV

```javascript
Agent({
  description: "QA test plan generation — [module]",
  prompt: `You are QA engineer agent generating test plan for [module].

Inputs:
- INV entries: [paste invariants INV-MOD-01 .. INV-MOD-NN]
- BR entries: [paste business rules]
- User flows: [paste from why.md]
- Critical risks: [paste from gravity.md]

Generate test plan:
1. Test scope (in / out)
2. Test layers (unit / integration / E2E / manual)
3. Critical paths (top 5 must-pass flows)
4. Edge cases (boundary, empty, max, malformed)
5. Negative tests (auth fail, validation fail, rate limit)
6. Compliance test mapping (INV → test case mapping)
7. Regression coverage requirement
8. Performance criteria (if applicable)
9. Accessibility checks (if user-facing)
10. Test data needs

Output: structured test plan, ready to execute.`,
})
```

Before Tier 1 promotion: dispatch → review → adjust → save as `docs/specs/<module>/test_plan.md` → use as guide. Saves 2-4h + more thorough than ad-hoc.

Other patterns: test case generation (15-30 G/W/T cases with TC-MOD-NN ids, priority, INV/BR/AC mapping; two-pass — second QA agent audits completeness and catches meaningfully more gaps), edge case enumeration deep dive (input boundaries / state / system / temporal / permission / scale / recovery categories; typically finds 10-20 cases a solo dev would miss — highest ROI of any QA pattern), bug repro + minimal failing test (repro steps + failing test code + suspected location → fix → test goes green → regression suite), regression matrix before cross-cutting merges (module × flow × risk × test), test automation scaffolding per new module, a11y static check (static analysis only — real screen-reader test required for shipping), perf test scaffold (first run = baseline; without comparison a perf test is decoration).

Cadence: per feature → test plan before coding; per bug → repro pattern; weekly → regression matrix for cross-cutting changes; per release → manual smoke (30 min minimum, eat own dog food) + a11y static + real keyboard nav; quarterly → perf test on top 3 endpoints + real user session (3-5 users).

QA agent CANNOT: perform real manual exploratory testing, use real assistive tech, test cross-device touch nuance, catch UX issues from emotional/aesthetic perspective, test under real-world conditions.

**Mandatory escalation:** P0 critical flow → real manual test; a11y for release → a11y expert / real user with disability; performance under real load → production-like env; security-critical (auth/payment) → real pentest; regulated workflow → real compliance officer + audit.

Tests = artifact only if run — schedule execution; CI enforces. Prioritize P0/P1 for CI; P2/P3 nightly (quality > quantity).

---

# Orchestration essentials (multi-role coordination)

> Нэг feature нь олон role-оор дамждаг (architect → reviewer → QA → compliance → tech lead). Solo dev-д orchestration нь bottleneck.

Why orchestration matters — mass-dispatch creates 3 problems:

1. **Output overload** — 6 parallel agents = 6 long reports; solo dev can't synthesize
2. **Context loss** — each agent has its own context; doesn't see others' findings
3. **Cost spiral** — coordination overhead → over-dispatch → $200+/month

Solo dev needs: clear handoff chain + deduplication + single synthesis point (themselves).

## Stage-based model

| Stage | Primary roles | Secondary | Output |
|-------|---------------|-----------|--------|
| Planning | Tech Lead | Domain Expert | Sprint goals, prioritized backlog |
| Design | Architect, Compliance | Domain Expert | ADR Proposed, INV updates |
| Implementation | (Solo dev) | QA scaffold | Code + initial tests |
| Review | Reviewer (R3), QA | Architect | Findings + test execution |
| Ship | Compliance | Tech Lead | Sign-off + post-deploy monitoring |

## Pattern A — Sequential handoff (the default)

Each role builds on prior output. Standard feature flow:

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

**Handoff convention:** each agent's output saved as markdown in `docs/specs/<module>/orchestration/NN-role.md`. Next agent gets prior artifacts as input context. Never hand off verbally between dispatches.

## Pattern B — Parallel dispatch (time-sensitive)

For URGENT changes (security fix; production incident), dispatch reviewer + compliance + QA in one message; all return in ~10-20 min; synthesize 15 min; ship in 30-45 min total.

**Caveat:** parallel = no agent sees the others' findings. Solo dev MUST manually reconcile conflicts. When the decision affects all roles, go sequential (architect first).

## Pattern C — Multi-agent panel (consensus)

For HIGH-STAKES decisions (architecture change, ADR Accept, compliance interpretation), dispatch 5 perspectives on the same question: solution / security / data / pragmatic / **skeptic (argues AGAINST)**.

| Score | Interpretation | Action |
|-------|----------------|--------|
| 5/5 agree | High confidence | Proceed |
| 4/5 agree | Proceed with documented dissent | ADR notes the 1 disagreement |
| 3/5 agree | Genuine uncertainty | Sleep on it; revisit in 24h |
| 2/5 agree | Likely wrong direction | Escalate to human / consultant |
| 1/5 agree | Almost certainly wrong | Reject; reframe question |

Panel cost ~$2.50-5 per major decision vs $500-2000 human consultation. Reserve for ADR-worthy decisions only — trivial → 1 agent + own judgment.

## Pattern D — Cross-role handoffs

| From → To | Handoff artifact | Receiving prompt gist |
|-----------|------------------|----------------------|
| Architect → Reviewer (R3) | ADR Proposed in `decisions/` | "Verify code implements ADR-NN; flag deviations" |
| Domain Expert → QA | `acceptance_criteria.md` | "Generate test cases covering each AC + edge cases" |
| Compliance → Architect | "INV updates needed" list | "Design implementation per INV-MOD-NN requirement" |
| Reviewer (R3) → Tech Lead | Findings markdown | "Prioritize into this cycle (capacity Xh) vs deferred" |
| QA → Architect | Regression matrix | "Same bug class in 3 modules — design system-level fix?" |

## Recurring orchestrations

- **Weekly drift** (Friday): R5 scan all modules → 15 min synthesis → P0/P1 immediate (spec issue → Reviewer; code issue → Tech Lead; ADR gap → Architect); P2/P3 → backlog. ~$5-15/month.
- **ADR lifecycle:** architect draft → panel review → R6 curation (Proposed → Accepted) → R3 post-implementation validation. ~$3-7 per ADR; beats "no ADR → drift later" by orders of magnitude.
- **Bug → fix → release:** Domain Expert triage → QA repro + failing test → [fix] → R3 verify → QA regression matrix → Compliance (if relevant) → Tech Lead release decision → ship → spec update if INV changed. ~$2-3 per bug.

## Synthesis discipline (anti-burnout)

Solo dev is the SYNTHESIS LAYER. Agents produce reports; solo dev synthesizes.

1. Single agent at a time per stage — don't parallel-dispatch without need
2. Save outputs to disk (`orchestration/` folder) — not mental working memory
3. Synthesize at end of stage — 5-min sit-down before next dispatch; 1-line summary per agent within 30 min of return
4. Max 3 agents per day for non-emergency — beyond that → output fatigue → quality drops
5. Weekly orchestration retro — 30 min Friday: did handoffs work? cost vs value?

## Orchestration calendar (solo dev)

| Cadence | Activity |
|---------|----------|
| Daily | 1 ad-hoc dispatch max (compliance question; architecture sanity check) |
| Per feature > 4h | Standard sequential flow (Pattern A) |
| Weekly (Friday) | Drift scan orchestration + retro (15 min) |
| Bi-weekly | Tech Lead sprint planning + cycle retro |
| Quarterly | Architect direction advisory; panel on top 3 strategic decisions; cost/ROI review |

## Cost summary (all roles + orchestration)

| Pattern | Cost | Time saved |
|---------|------|-----------|
| Sequential standard feature | $3-7 | 4-8h vs all-solo |
| Parallel hotfix | $1.50-3 | 1-2h vs sequential |
| Multi-agent panel | $2.50-5 | vs $500-2000 human panel |
| Weekly drift orchestration | $5-15/mo | 2-4h/mo synthesis |
| Per-bug full flow | $2-3 | 1-2h |
| **Monthly (active solo dev)** | **~$40-80** | **20-40h equivalent** |

## Cross-references

- `01-limitations-and-escalation.md` — honest limits per role + when to escalate to humans
- `extended/workflow/10-adoption-guide/08-one-man-army.md` — solo dev overall playbook
- `core/workflow/03-r3-deep-review.md` — R3 agent
- `core/workflow/04-r1-r2-parallel-review.md` — R1+R2 agents
- `extended/workflow/07-r4-regulatory-research/04-R4-agent-prompt.md` — R4 agent
- `extended/workflow/08-code-drift-management/05-R5-drift-scanner-agent.md` — R5 agent
- `extended/workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` — R6 agent

## Next

→ `01-limitations-and-escalation.md` — Honest limits + when to escalate to humans
