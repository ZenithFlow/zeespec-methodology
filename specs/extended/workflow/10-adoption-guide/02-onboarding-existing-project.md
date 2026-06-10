---
doc: extended/workflow/10-adoption-guide/02-onboarding-existing-project
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: brownfield projects (retrofit ZeeSpec onto existing codebase)
---

# Onboarding ZeeSpec to Existing Project (Brownfield)

> **For brownfield projects.** Code already exists; you need to retrofit ZeeSpec without disrupting active development. Harder than greenfield. Time: 4-8 weeks to first Tier 1 module + ongoing rhythm.

## The brownfield challenge

Unlike greenfield, you face:
- Code exists but has no spec (or stale spec)
- Existing patterns may conflict with ZeeSpec assumptions
- Engineers used to "code-first" workflow may resist
- Existing documentation may be in different format (Confluence / Notion / wiki)
- 4-file ZeeSpec convention may already exist (decisions.md / implementation.md / etc.)

Brownfield adoption is **documentation archaeology + methodology grafting**, not greenfield authoring.

## Pre-conditions

- ✅ Decision to adopt confirmed
- ✅ Tier selected (typically Tier A or B for first attempt)
- ✅ 1 engineer with deep code knowledge designated as ZeeSpec champion
- ✅ Tech lead / engineering manager buy-in (rollout will touch sprint planning)
- ✅ Optional: compliance officer engaged
- ✅ Audit of existing documentation (what's there already?)

## Phase 0 — Pre-work (Week 0)

### Audit existing documentation

Catalog what exists:

```bash
# What documentation conventions does the project use?
find . -type d -name 'docs' -o -name 'documentation' -o -name 'spec*' 2>/dev/null
find . -name 'CLAUDE.md' -o -name 'README.md' -o -name 'ARCHITECTURE.md' 2>/dev/null
find . -name 'decisions.md' -o -name 'implementation.md' -o -name 'prompts.md' 2>/dev/null
```

For each found:
- Is it current (last 6 months)?
- Is it complete (covers all major modules)?
- Is it trusted (engineers actually consult it)?

### Decision: replace OR supplement existing docs?

If existing docs are good (current + complete + trusted):
- **Supplement** with ZeeSpec — ZeeSpec adds dimensions existing docs miss (cross-cutting HW; verified status tags; drift management)
- Existing docs remain canonical for what they cover

If existing docs are stale / partial / untrusted:
- **Replace** with ZeeSpec — ZeeSpec becomes the new spec foundation
- Existing docs archived

If unclear: start with supplement; revisit after 3 months.

### Identify the highest-risk module

Unlike greenfield, brownfield should target the **highest-risk module first** — typically the module:
- With the most production incidents in last 12 months
- That handles money / PII / regulated data
- That no one understands fully ("only Bob knows how this works")
- That blocks team velocity (changes always break)

Methodology delivers most value here.

## Phase 1 — Install + first module (Weeks 1-4)

### Week 1 — Install + scope

Days 1-2: Install ZeeSpec per `01-adopting-zeespec-from-scratch.md` § "Day 1-2".

Day 3-5: Deep-read the chosen module's code + existing docs. Write notes on:
- Entity list (extract from ORM models / DB schema)
- Algorithm list (extract from service / controller classes)
- Cross-module deps (extract from imports / API calls)
- Known invariants (from existing docs + engineer interviews)
- Known gaps (where existing docs are silent)
- Unknowns (where code is unclear; flag for `gaps.md`)

### Week 2 — Author module ZeeSpec (extraction-heavy)

Authoring brownfield is different from greenfield:

| Dimension | Greenfield | Brownfield |
|-----------|------------|------------|
| `what.md` entities | Design what entities should be | Extract from existing entity files; document what IS |
| `how.md` algorithms | Design new algorithms | Trace existing service methods; document what code DOES |
| `where.md` § 5 | Choose tech stack | Document existing stack as-is |
| `gravity.md` HW | Design constraints | Audit code for implicit constraints; surface explicit |
| `gaps.md` | Open questions about future | Audit for code that doesn't match docs; for code with unclear intent |

Use B1 verification techniques (`core/workflow/02-b1-verification.md`) as your PRIMARY authoring tool — count entities, enums, methods from production code.

### Week 3 — R3 deep review + R1+R2 parallel

Same as greenfield (per `01-adopting-zeespec-from-scratch.md` Week 3) but expect **more findings**. Brownfield typically surfaces:

- 5-15 Type 1 (citation) drift items (you wrote spec to match current code; refactor before/after authoring shifts line refs)
- 3-10 Type 3 (behavioral) findings (code does something nobody documented; spec needs to capture)
- 1-3 Type 4 (architectural) findings (module is bigger / smaller / differently shaped than expected; spec needs structural decision)
- Possibly 5+ ADRs needed (retroactive — decisions made over years; document now)

### Week 4 — Apply findings + retroactive ADR pass

Per `core/workflow/05-apply-findings.md`. Plus:

For each undocumented design decision uncovered, write retroactive ADR per `extended/workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`. Goal: 5-10 retroactive ADRs in first module.

Promote to Tier 1.

## Phase 2 — Expand without disrupting active dev (Months 2-6)

### Coordination with sprint planning

ZeeSpec authoring takes engineering time. Coordinate:

1. **Per-sprint allocation:** 1 engineer × 1 day/week dedicated to ZeeSpec (Tier A) OR 2 days/week (Tier B)
2. **PR-time discipline:** every PR includes spec update if module is ZeeSpec-codified (block merge if spec impact not addressed)
3. **Sprint cadence:** plan ZeeSpec work in sprint planning; treat as feature work, not "extra"
4. **Definition of Done:** modify team's DoD to include "spec updated" for ZeeSpec modules

### Avoid "spec freeze" trap

Active dev continues during brownfield authoring. By the time you finish a module's spec, the code has changed. Mitigate:

- Time-box authoring (max 2 weeks per module)
- Author the SPEC at HEAD-OF-MAIN; don't try to author "future state"
- B1 re-verify immediately after authoring; capture any drift introduced during authoring

### Schedule retroactive ADR pass

In month 2 or 3: dedicate 1 week to write retroactive ADRs for major decisions in the codebase. Use git blame + PR archaeology + engineer interviews. Goal: 20-30 retroactive ADRs across project covering the major architectural choices.

Per `extended/workflow/09-adr-lifecycle/00-START-HERE.md`.

## Phase 3 — Multi-module coverage (Months 6-12)

Same as greenfield (`01-adopting-zeespec-from-scratch.md` Months 2-6) but pace tends to be slower due to brownfield friction.

By month 12:
- 5+ Tier 1 modules
- Continuous CI drift detection active
- Monthly Layer 2 drift sweeps running
- Quarterly R4 (if regulated)
- Annual R6 ADR review

## Common brownfield pitfalls

### Pitfall 1: "Document everything from day 1"

**Symptom:** Try to spec all 20 modules in 2 months.

**Why bad:** Spec drifts before code; methodology becomes a millstone; team gives up.

**Fix:** 1 module/month max for first 6 months. Methodology adoption is marathon not sprint.

### Pitfall 2: Spec authoring blocks code changes

**Symptom:** Team can't ship features because spec author hasn't finished docs.

**Why bad:** Engineering resents methodology; rollout dies.

**Fix:** Spec authoring runs in parallel with active dev, not blocking. PR-time discipline catches drift; allow some drift between scheduled reviews.

### Pitfall 3: Existing docs ignored

**Symptom:** "ZeeSpec replaces our wiki" — but wiki has 5 years of accumulated knowledge.

**Why bad:** Wasted institutional memory; new spec is poorer than old wiki.

**Fix:** Source from existing docs DURING authoring; cite them in spec ("see wiki/X for historical context"). Migrate, don't replace.

### Pitfall 4: 4-file convention friction

**Symptom:** Project already has CLAUDE.md / decisions.md / implementation.md / prompts.md per module. Engineers confused by ZeeSpec's 10 files.

**Why bad:** Two competing conventions; neither maintained well.

**Fix:** Pick ONE convention. Either:
- Keep 4-file: ZeeSpec runs alongside as enhanced format for Tier-1-promoted modules only
- Migrate 4-file → ZeeSpec: read each 4-file content, redistribute into 10-file structure

Mark transition in project root CLAUDE.md.

### Pitfall 5: Retroactive ADRs perceived as busywork

**Symptom:** "Why are we documenting decisions we already made?"

**Why bad:** Without retroactive ADRs, the WHY is lost when original engineers leave.

**Fix:** Demonstrate value early — when first new engineer joins, have them onboard via ADRs vs without; show productivity difference.

### Pitfall 6: Engineers resist "we already have docs"

**Symptom:** "We don't need another doc format."

**Why bad:** Methodology requires team buy-in; resistance kills rollout.

**Fix:** Don't sell ZeeSpec as "more docs." Sell as:
- "AI-readable so Claude/Copilot generates better code"
- "Compliance audit trail when regulator asks"
- "Drift detection so docs stop lying"

Demonstrate ROI in first 2 months; don't lecture about methodology.

## Existing-docs migration strategies

If project has existing 4-file convention (CLAUDE.md + decisions.md + implementation.md + prompts.md):

### Strategy A — Run in parallel

Keep 4-file. Add ZeeSpec for Tier-1-promoted modules as supplement.

- Pros: no disruption; gradual migration
- Cons: two conventions to maintain; drift between them

### Strategy B — Hybrid

For each module:
- CLAUDE.md → ZeeSpec CLAUDE.md (re-author)
- decisions.md → ZeeSpec CLAUDE.md "ADR table" + adr/ folder per `extended/workflow/09-adr-lifecycle/00-START-HERE.md` "Option B"
- implementation.md → ZeeSpec what.md + how.md + where.md
- prompts.md → ZeeSpec who.md + when.md

- Pros: preserves existing content; cleaner end state
- Cons: high upfront migration effort

### Strategy C — Greenfield-style for new modules; legacy untouched

New modules get full ZeeSpec. Legacy modules keep 4-file.

- Pros: lowest friction
- Cons: inconsistent methodology across modules

Recommended: Strategy A initially; migrate to B for high-value modules; Strategy C for legacy modules that are stable.

## Brownfield time/cost estimate

For Tier B adoption (5 modules; 6 months):

| Investment | Cost |
|------------|------|
| Pre-work + first module (Weeks 1-4) | 1 engineer × 4 weeks = 160h |
| Modules 2-3 (Months 2-3) | 1 engineer × 2 days/week × 8 weeks = 128h |
| Retroactive ADR pass (Month 3) | 1 engineer × 1 week = 40h |
| Modules 4-5 (Months 4-6) | 1 engineer × 1.5 days/week × 12 weeks = 144h |
| Ongoing maintenance (after Month 6) | 1 engineer × 1 day/week = 0.2 FTE |
| **Total first 6 months** | ~470h ≈ 0.3 FTE |

Higher than greenfield (~250h) because of extraction overhead.

## Onboarding metrics — how to know it's working

| Metric | Target by Month 3 | Target by Month 6 |
|--------|--------------------|--------------------|
| Tier 1 modules | 1 | 3-5 |
| Retroactive ADRs written | 5+ | 20-30 |
| Engineers fluent in methodology | 1-2 | 3-5 |
| CI drift detection active | 1 module | 3-5 modules |
| Drift findings open > 30 days | < 3 | < 5 |
| Engineers consulting spec before code | Sometimes | Often |
| New-hire onboarding via spec | (untested) | First 1-2 hires onboarded via spec |

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `01-adopting-zeespec-from-scratch.md` — greenfield comparison
- `03-team-rollout-strategy.md` — team coordination
- `06-common-pitfalls.md` — issues to watch for

## Next

→ `03-team-rollout-strategy.md` — multi-developer rollout
→ `04-tooling-integration.md` — CI / IDE / Slack
