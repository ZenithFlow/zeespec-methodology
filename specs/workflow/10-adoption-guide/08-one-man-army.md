---
doc: workflow/10-adoption-guide/08-one-man-army
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: solo developers (1 person; no team; no compliance officer; no separate reviewer)
addresses: Reviewer C feedback on team-size assumptions; gap between Tier 0 Lite trial and Tier 1 promotion
---

# One-Man Army — Solo Developer Playbook

> **1 хүн ZeeSpec-ийг бүгдийг хийх workflow.** Methodology нь 5-20 хүний team-д зориулагдсан гэж үздэг (compliance officer + tech lead + controller + reviewer + champion). Solo dev-д эдгээр role-ыг **AI agent + хатуу discipline + tooling-ээр орлуулна**.
>
> Realistic-ийг хадгалъя: solo dev бүх файлыг бичих хэрэгтэйгүй. **AI agent + 1-2 critical модуль + хатуу review discipline** хангалттай.

## Solo dev-ийн challenge

| Methodology хүлээдэг | Solo дев-д байхгүй | Хэрхэн орлуулах |
|----------------------|---------------------|-------------------|
| Compliance officer (R2) | Lawyer / compliance тал байхгүй | R4 agent + outside counsel quarterly + Tier 1 source rigor |
| Independent reviewer (R1/R3) | 2 дахь engineer байхгүй | AI agent dispatch (Claude Code) — independent eye |
| Tech lead (ADR sign-off) | Шийдвэрийг хэн approve хийх вэ? | Self-approval + 24h "cool-off" rule + AI-сanity-check |
| Backup champion | Bus factor = 1 | Spec нь self-documenting тул future-you эсвэл future-team аль хэдийн өвөрбий |
| Sprint planning (allocation) | Sprint цаг байхгүй | "ZeeSpec Friday" эсвэл "1 цаг / өдөр" routine |
| SoD (4-eyes / 6-eyes) | Approver ≠ initiator боломжгүй | "24h cool-off + AI second-opinion" pattern |
| Drift sweep (monthly) | Хүн нь хийх боломжгүй | CI auto-scan + AI agent quarterly |
| Annual ADR review | Жил тутам тогтмол review хийгчгүй | Calendar reminder + AI Mode B бүх ADR scan |

## The 4-rule solo discipline

1. **AI agent = your second pair of eyes.** R3 deep review, R5 drift scan, R6 ADR conflict check бүгдийг AI хийх. Solo гэдэг "alone" биш — Claude/Cursor нь "co-pilot".

2. **24-hour cool-off на material decisions.** ADR draft хийсэн өдөртөө шууд "Accepted" болгохгүй. Маргааш цэвэр оюун ухаанаар дахин уншиад accept. Hot-typing decisions нь регулатор risk үүсгэдэг.

3. **Source-of-truth дисциплин.** Spec нь lying боловсон даруй stop-and-fix. Drift > 7 days-аас илүү хадгалж байж болохгүй. Source-of-truth-ын тогтвортой байдал нь team биш methodology-аас гарна.

4. **Tier 0 Lite-ээс өсөх.** Бүх module-уудыг Tier 1-д шууд promote хийхгүй. Зөвхөн critical-уудыг (money-handling, customer data, compliance-relevant). Бусдыг Tier 0 Lite хэвээр.

## Solo workflow (per-module)

Этгий чанартай 10-step workflow. Total ~10-15h per critical module.

### Day 1 — Scope + R4 (3-4h)

#### Step 1: Scope (30 мин)
- Module-ы entity / algorithm / dependency-уудыг товч list
- Compliance touchpoint-ыг хэвэл (KYC, AML, retention, PHI зэрэг)
- "Yes / No"-аар: regulator-related юу? Yes → R4 хэрэгтэй

#### Step 2: R4 research dispatch (2-3h)
```
Хэрэв regulated юм бол:

Agent({
  subagent_type: "general-purpose",
  description: "R4 research for [module]",
  prompt: "Use prompt from workflow/07-r4-regulatory-research/04-R4-agent-prompt.md.
           Jurisdiction: [your jurisdiction].
           Topic: [module-specific regulatory questions].
           Output: citation blocks ready to paste."
})
```

Agent runtime ~30-60 min. Та script-р run хийгээд хүлээн, дараа нь findings уншина.

#### Step 3: R4 output review (30 мин)
- AI-ийн findings уншиад citation-уудыг шалга
- Бүх stale URLs / broken citations засаж
- `_meta/regulatory-source-registry.md`-руу copy

### Day 2 — Author + Tier 0 Lite (3-4h)

#### Step 4: Tier 0 Lite scaffold (15 мин)
```bash
MODULE=wallet
MOD_PREFIX=WAL
cp -r docs/specs/zeespec/templates/_template docs/specs/zeespec/$MODULE
cd docs/specs/zeespec/$MODULE
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/$MOD_PREFIX/g"
find . -name '*.bak' -delete
```

#### Step 5: Author 3 files (CLAUDE + what + gaps) (2-3h)
- Per `workflow/10-adoption-guide/07-zeespec-lite-tier-0-fasttrack.md`
- Critical invariants (3-5 max), R4 citations included
- gaps.md-д open questions

Commit: "Tier 0 Lite WAL module"

### Day 3 — AI-driven review (24h cool-off + 2-3h)

#### Step 6: 24h cool-off
- Spec дээр шууд биш үлдээ
- Маргааш үлдсэн зүйлсээ сэргээж уншина

#### Step 7: R3 deep review (AI agent) (1h)
```
Agent({
  description: "R3 deep review of [module] Tier 0 spec",
  prompt: "Per workflow/03-r3-deep-review.md, review docs/specs/zeespec/wallet/.
           Verify every claim in CLAUDE.md + what.md + gaps.md against
           production code at backend/src/Wallet/.
           Focus: phantom methods, phantom fields, status tag accuracy,
           false-positive enforcement, AccountStatus pattern."
})
```

#### Step 8: R1+R2 parallel review (AI agents) (1h)
```javascript
// Dispatch both in parallel
Agent({ description: "R1 algorithm review", prompt: "<from workflow/04>" })
Agent({ description: "R2 compliance review", prompt: "<from workflow/04 + overlays/finance-accounting/prompts/R2-financial-reviewer.md if finance>" })
```

#### Step 9: Apply findings + spawn chips (1h)
- Per `workflow/05-apply-findings.md`
- P0 findings → either fix or spawn chip
- Spec updates committed

Commit: "Apply R1/R2/R3 findings to WAL spec; Tier 0 → Tier 1 candidate"

### Day 4 — Tier 1 promotion + ongoing setup (1-2h)

#### Step 10: Tier 1 promote + CI setup
- Update CLAUDE.md frontmatter: `tier: 1`
- Add `workflow/08-code-drift-management/03-auto-drift-detection.md` CI script
- Start in WARN mode для PR-time drift
- Calendar reminder: monthly drift sweep + quarterly R4 re-validation

Commit: "WAL module promoted to Tier 1"

### Total time per critical module: ~10-15h spread over 4 days

## Role replacement patterns

### Replacement 1: SoD (Segregation of Duties) → "24h + AI second opinion"

Finance overlay says approver ≠ initiator. Solo dev-д:

```
Initiator: You (today)
24h cool-off
Approver: Future-you (tomorrow) + AI second-opinion

Implementation:
1. Draft decision in PR or ADR
2. Commit as "PROPOSED — pending 24h cool-off"
3. Next day: re-read with fresh eyes
4. Dispatch AI agent for independent review:

Agent({
  description: "Independent review of yesterday's ADR draft",
  prompt: "Read ADR-WAL-XXX (status: Proposed). Independent of original author.
           Critique: are alternatives genuinely considered? Are consequences
           realistic? Any obvious flaws? Recommendation: Accept / Reject / Modify."
})

5. If AI flags concerns: pause + investigate
6. If both you-tomorrow and AI agree: change status to Accepted
```

This isn't perfect SoD but **significantly better than instant self-approval**.

### Replacement 2: Compliance officer (R2) → "R4 agent + lawyer quarterly"

Solo dev can't have full-time compliance officer. Pattern:

- **R4 agent every research session** (per `workflow/07-r4-regulatory-research/`)
- **Lawyer quarterly** consultation (1-2 hours) for material decisions
- **Strict citation discipline** — every threshold/deadline cites Tier 1 source
- **Annual mutual evaluation tracking** — FATF / regulator inspections affect your jurisdiction

Solo dev гэдэг "compliance ignorance" биш — "compliance via discipline + outside expertise on demand."

### Replacement 3: Tech lead (architectural decisions) → "ADR + AI second opinion + delayed acceptance"

For architectural ADRs (workflow/09):

```
1. Write ADR draft (Status: Proposed)
2. Wait 24-48h
3. Dispatch R6 conflict check (Mode C):

Agent({
  description: "R6 conflict check for proposed ADR-X",
  prompt: "Per workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md Mode C.
           Proposed ADR text: [paste]
           Check for: conflicts with existing ADRs, missing relationships,
           cross-module impact."
})

4. Address R6 findings
5. If material (P0 / cross-module / compliance) → consult external (lawyer / peer)
6. Otherwise: self-accept with documented rationale
```

### Replacement 4: Backup (bus factor) → "Spec IS the backup"

ZeeSpec's value for solo dev: **spec is the backup**. If you disappear, next person reads the spec + understands.

But you have to actually maintain it. Solo dispatch:

- Drift scan monthly (R5 agent, not human)
- ADR annual review (R6 Mode B)
- README updates after structural changes
- This means: even one engineer following the methodology produces a "team-readable" artifact.

## Solo cadence (weekly / monthly / quarterly / annual)

### Daily
- Code: ZeeSpec-aware (cite INV IDs in comments)
- PR: include spec impact section
- AI agent dispatch when complex feature

### Weekly (1h)
- "ZeeSpec Friday" routine: 1 hour for spec maintenance
- Review CI drift findings from week
- Apply Type 1 fixes (citation drift)
- Note Type 3+ for monthly review

### Monthly (2-4h)
- R5 drift agent sweep on 1-2 critical modules
- Resolve P0 + P1 drift findings
- Quick ADR review (new decisions made this month?)
- Tooling cost check

### Quarterly (4-8h)
- R4 re-validation for regulator-related modules
- Full R5 drift scan on all Tier 1 modules
- ADR cleanup (Mode B annual review subset)
- Outside lawyer consult если material decisions

### Annual (1 week dedicated)
- Full R4 across all sources (per `workflow/07/06-re-validation-strategy.md`)
- Full R6 ADR curation
- Methodology retrospective (workflow/10/06-common-pitfalls.md)
- Cost review
- Roadmap planning

Total ongoing: **~10-20 hours/month** for 3-5 Tier 1 modules.

## Solo tool stack (cost-aware)

| Tool | Solo cost | Purpose |
|------|-----------|---------|
| Claude Code | $20-100/month subscription | Primary AI agent dispatch |
| GitHub | $0 (free) или $4/month | Repo + CI Actions free for personal |
| GitHub Actions | $0 free quota | CI drift detection (Layer 1) |
| 1 lawyer hour | $200-500/quarter | Material compliance decisions |
| **Total** | **~$60-200/month** | Sustainable for solo |

Annual: ~$700-2,400. **Lower than half a junior engineer's hourly rate for compliance gaps prevented.**

## What solo dev SHOULD skip

The methodology is large. Solo dev can't use all of it. Skip these:

| Skip | Reason |
|------|--------|
| Most module overviews in finance overlay | Use as reference; don't author all |
| Multi-jurisdiction R4 (workflow/07/08) | Only if you serve multiple jurisdictions |
| Cross-module bidirectionality detail | Critical modules only; relax for stable |
| 6-eyes principle | Use 24h-cool-off pattern instead |
| Multi-team rollout (workflow/10/03) | N/A for solo |
| Compliance dashboard | Personal trello / notion fine |
| Annual all-hands ZeeSpec retro | Self-retrospective in journal |
| Enterprise ADR governance committee | Self-governance |

## What solo dev SHOULD NOT skip

Critical hardcoded:

| Don't skip | Why |
|------------|-----|
| Status tagging (✅/🟡/🚧) | AI behaviour depends on this |
| Gaps.md OPEN rules | AI STOPs on blocking gaps |
| ADR for material decisions | Future-you needs to remember WHY |
| Citation discipline (Tier 1 sources) | Audit-resistance |
| 24h cool-off for material ADRs | SoD replacement |
| AI second-opinion for high-impact | Bus factor reduction |
| Monthly drift review | Spec rotting prevention |
| Annual R4 re-validation | Regulator changes catch |

## Common solo dev anti-patterns

### Anti-pattern 1 — "Hero workflow"

**Symptom:** Solo dev tries to be both author and reviewer simultaneously. No cool-off.

**Why bad:** Hot-typing decisions miss obvious issues. Self-review while emotionally invested = useless.

**Fix:** 24h cool-off на ВСЕ material ADRs. Calendar reminder.

### Anti-pattern 2 — "AI is rubber stamp"

**Symptom:** Dispatch AI agent; instantly accept its output without scrutiny.

**Why bad:** AI hallucinates; AI flatters; AI misses context. Independent review only works if you actually critique.

**Fix:** AI output is starting point. Always read + critique + sometimes reject.

### Anti-pattern 3 — "Skipping R4 because lazy"

**Symptom:** "I'll guess the threshold; it's probably right."

**Why bad:** Solo dev = single point of compliance failure. Wrong threshold = enforcement risk.

**Fix:** R4 is non-negotiable for regulated modules. Even if 30 min agent dispatch + 30 min review.

### Anti-pattern 4 — "Methodology fatigue"

**Symptom:** 3 months in, drift accumulates, monthly reviews skipped, spec rots.

**Why bad:** Methodology becomes liability instead of asset (lying spec is worse than no spec).

**Fix:** Schedule reviews as recurring calendar events. Treat as non-negotiable. Or downgrade module to Tier 0 Lite.

### Anti-pattern 5 — "Tier 1 everything"

**Symptom:** Solo dev promotes every module to Tier 1, drowns in maintenance.

**Why bad:** Capacity exceeded; quality degrades.

**Fix:** Maximum 3-5 Tier 1 modules for solo. Rest Tier 0 Lite or no spec.

### Anti-pattern 6 — "Solo == alone"

**Symptom:** Never consult anyone. Never get outside review.

**Why bad:** Compliance / architecture / domain expertise needed periodically.

**Fix:** Quarterly outside consult (lawyer / domain expert / peer review). $200-500 hour = excellent ROI vs compliance disaster.

## Solo success patterns

### Pattern 1 — "ZeeSpec Friday"

Block 1-3 hours every Friday for spec work:
- Drift review
- ADR backlog
- R4 re-check if quarterly due
- Module promotion (Tier 0 → Tier 1)
- Documentation polish

Routine = sustainability.

### Pattern 2 — "AI agent batch"

Don't dispatch agents one at a time. Batch them:

```javascript
// Friday morning batch
Agent({ description: "R5 drift — wallet", ... })
Agent({ description: "R5 drift — payments", ... })
Agent({ description: "R6 ADR conflict check — recent 5", ... })
// All run in parallel; you process when they complete
```

Cost ~$5-10 per batch; saves 4-8 hours of manual work.

### Pattern 3 — "Lawyer on retainer"

Find one lawyer specializing in your domain. Engage quarterly (~$500-1000 quarterly). They review your ZeeSpec citation accuracy + compliance assumptions.

Cheaper than full-time compliance officer. Catches material risks.

### Pattern 4 — "Public spec"

If your project is open-source, publish spec publicly. Then:
- Drive-by contributors review (free)
- Recruiting tool ("see how we work")
- Force-function discipline (public = more rigor)

Even private spec sometimes worth sharing key sections with peers for feedback.

### Pattern 5 — "Skip-then-promote"

Don't try to author all modules upfront:
- Module 1: full Tier 1 (3-4 weeks)
- Module 2-3: Tier 0 Lite (2 hours each)
- After 3 months: promote Module 2 if it's getting drift complaints
- After 6 months: maybe Tier 1 for Module 3

Iterative. Reduce upfront commitment.

## Solo dev cost breakdown (real example)

```
Project: Personal fintech side project
Modules: 2 Tier 1 (wallet, kyc) + 3 Tier 0 Lite
Time per month: 8-12 hours

Annual investment:
- Claude Code subscription: $1,200
- Lawyer quarterly: $2,000
- GitHub Pro: $48
- AI agent token cost: ~$300
TOTAL: ~$3,500/year

Annual return (estimated):
- Production bugs prevented: 2-3 × ~30h savings = 60-90 hours saved
- Compliance gaps avoided: 1-2 instances of $5K-50K potential fines
- Faster feature delivery via clean spec: ~50h saved
TOTAL: 110-140 hours engineering time + $5K-100K compliance risk avoided

ROI: Very positive even for solo
```

## When solo can use ZeeSpec

Solo dev is good fit if:

- ✅ Building regulated system (finance / health / privacy)
- ✅ Plan to scale to team eventually (spec ready)
- ✅ Care about long-term durability (5+ years)
- ✅ Use AI agents already (Claude Code subscription)
- ✅ Can dedicate 8-15 hours/month

Solo dev is NOT good fit if:

- ❌ Pure hobby project (overhead too high)
- ❌ Pre-PMF iteration (spec churn too high)
- ❌ Plan to shut down in < 1 year
- ❌ No regulator / compliance / audit need

## Decision matrix for solo

```
Is this regulated / compliance-relevant?
├── NO → Tier 0 Lite (3 files, 2 hours) OR skip ZeeSpec
└── YES
    │
    Will this run > 2 years?
    ├── NO → Tier 0 Lite + brief gaps
    └── YES
        │
        Can you commit 8-15 hours / month?
        ├── NO → Tier 0 Lite all modules
        └── YES
            │
            Use one-man-army workflow:
            - 2-3 Tier 1 modules
            - R4/R5/R6 agents on schedule
            - 24h cool-off pattern
            - Lawyer quarterly
            - Annual review
```

## What you DO get as solo dev with ZeeSpec

- ✅ AI agents generate better code (status-tagged context)
- ✅ Drift detection prevents spec rot
- ✅ ADR remembers why decisions made
- ✅ Audit-ready citations (if regulator ever asks)
- ✅ "Team-readable" artifact when collaborators join
- ✅ Faster onboarding of future hires
- ✅ Compliance posture without compliance officer

## What you DON'T get as solo

- ❌ True 4-eyes / 6-eyes principle (mitigated by 24h + AI)
- ❌ Compliance officer perspective continuously
- ❌ Multi-perspective review (mitigated by AI agents)
- ❌ Bus factor > 1 (mitigated by self-documenting spec)
- ❌ Real-time compliance updates (mitigated by quarterly R4)

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `01-adopting-zeespec-from-scratch.md` — greenfield (team-oriented)
- `06-common-pitfalls.md` — Pitfall #4 + #5 (Bob's methodology; role mismatch)
- `07-zeespec-lite-tier-0-fasttrack.md` — 2-hour trial path
- `workflow/07-r4-regulatory-research/` — R4 agent (compliance research)
- `workflow/08-code-drift-management/05-R5-drift-scanner-agent.md` — R5 agent
- `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` — R6 agent
- `workflow/12-agentic-role-replacement/` — 🆕 deep-dive on agentic replacement
  of 6 human team roles (Reviewer / Compliance / Architect / Tech Lead /
  Domain Expert / QA). This file (`08-one-man-army.md`) gives the playbook;
  `workflow/12-*` gives the per-role mechanics.

## Next

→ Try the workflow on YOUR project
→ `07-zeespec-lite-tier-0-fasttrack.md` for 2-hour starter
→ `workflow/12-agentic-role-replacement/00-START-HERE.md` for per-role agent dispatch patterns
