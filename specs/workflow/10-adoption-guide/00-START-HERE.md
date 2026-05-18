---
doc: workflow/10-adoption-guide/00-START-HERE
type: workflow-entry
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: teams considering OR adopting ZeeSpec for the first time
---

# Adoption Guide — Entry Point

> **For teams adopting ZeeSpec.** Not for AI agents (they have core workflow 00). This folder helps a human team — solo dev, startup, mid-size team, enterprise — plan rollout, choose scope, integrate tooling, avoid common pitfalls.
>
> Different from `PORTING-GUIDE.md` (which is about adapting to your stack) and from `workflow/01-authoring-checklist.md` (which is per-module authoring). This is **organizational adoption strategy**.

## When to use this folder

| Scenario | Use this guide? |
|----------|-----------------|
| Considering ZeeSpec; haven't adopted yet | ✅ Read all files |
| Starting first ZeeSpec module | ✅ Read 01 + 03 |
| Existing project; want to retrofit ZeeSpec | ✅ Read 02 + 03 |
| Rolling out to multi-team org | ✅ Read 03 + 06 |
| Setting up CI / IDE / Slack integration | ✅ Read 04 |
| Applying to non-finance domain | ✅ Read 05 |
| Already adopted; running into issues | ✅ Read 06 |
| AI agent doing per-module work | ❌ Use `workflow/00-START-HERE.md` instead |

## Read order

1. **This file** (orientation)
2. Pick ONE of:
   - `01-adopting-zeespec-from-scratch.md` (greenfield project; you control the codebase)
   - `02-onboarding-existing-project.md` (brownfield project; retrofit ZeeSpec onto existing code)
3. `03-team-rollout-strategy.md` (multi-developer rollout; phasing; ownership)
4. `04-tooling-integration.md` (CI / IDE / Slack / dashboards)
5. `05-cross-domain-adaptation.md` (healthcare / government / privacy / SaaS — NON-finance)
6. `06-common-pitfalls.md` (what kills adoption; how to avoid)
7. `07-zeespec-lite-tier-0-fasttrack.md` (3-file Lite path; ~2-hour trial)
8. `08-one-man-army.md` (solo developer playbook — 1 хүн full methodology)
9. `../12-agentic-role-replacement/` (🆕 per-role agentic replacement — 6 human roles; orchestration matrix; limitations)

## Adoption decision matrix

Before you adopt ZeeSpec, decide whether it's actually appropriate for your project:

### Strongly recommended

- ✅ Regulated domain (finance / healthcare / government / aerospace / critical infrastructure)
- ✅ Compliance audit risk > $100K
- ✅ Team size 5+ engineers
- ✅ Multi-year project lifespan expected
- ✅ AI-assisted development (Claude Code / Copilot) — methodology shines here
- ✅ Cross-functional team (engineers + compliance + product)

### Moderate fit

- ⚠️ Pre-PMF startup; methodology is overhead vs. iteration speed
- ⚠️ Single-developer hobby project; 10-file format too heavy
- ⚠️ Pure SaaS without regulatory complexity; lighter spec format may suffice

### Don't adopt

- ❌ Throwaway prototypes
- ❌ Pure data-pipeline tools with no human-facing or compliance touchpoint
- ❌ Strict 1-developer projects where the methodology overhead exceeds value

## Adoption depth tiers

ZeeSpec can be adopted at three depths. Pick what's appropriate for your team:

### Tier A — Lite (1-2 modules; quick start)

Use the 10-file format for 1-2 high-risk modules. Run B1 + R3 manually. Skip R4/R5/R6 agents. Skip overlays. No CI integration.

- Cost: 1 engineer × 1 week initial + 2 hours/month per module ongoing
- Best for: pilot to evaluate ZeeSpec; small team with 1-2 critical modules

### Tier B — Standard (5-10 modules; team adoption)

Full 10-file format. R3 + R1+R2 reviews. Quarterly R5 drift scan. Annual R4 + R6 review. Optional finance overlay for finance teams. Basic CI drift detection.

- Cost: 1 engineer × 1 month initial + 1 day/week ongoing (split across team)
- Best for: established team adopting for whole product

### Tier C — Full (10+ modules; enterprise)

All phases active. All agents (R4/R5/R6) routinely dispatched. Continuous CI drift. Per-domain overlays. Multi-jurisdiction R4. Monthly drift sweeps. Compliance officer engaged. Dashboard tracking.

- Cost: 2 engineers × 2 months initial + 1 FTE ongoing across team
- Best for: compliance-heavy enterprise; multi-jurisdiction operations

## Quick-start decision tree

```
Is your domain regulated?
├── NO → consider lighter alternatives (ADRs alone, not full ZeeSpec)
└── YES
    │
    Is your team > 5 engineers?
    ├── NO → Tier A (Lite); revisit after 6 months
    └── YES
        │
        Do you have compliance audit risk?
        ├── NO → Tier B (Standard)
        └── YES
            │
            Multi-jurisdiction?
            ├── NO → Tier B (Standard) + relevant overlay
            └── YES → Tier C (Full); plan 2-month onboarding
```

## What success looks like

Signs that adoption is working:

- 3+ modules at Tier 1 within 6 months
- CI drift scanner producing < 10 false positives/week (signal-to-noise OK)
- R5 drift findings being resolved within target SLA
- Engineers reaching for the spec when writing code (not just after)
- New team members onboarded via spec faster than via code-reading
- Audit / regulator interactions cite spec artifacts (audit trail working)
- 80%+ of material design decisions captured as ADRs

Signs adoption is failing:

- 6+ months in; still on first module
- Drift findings accumulate; nobody resolves
- ADRs written once at module start; never updated
- Specs become "the documentation we have to maintain" (chore framing)
- Engineers route around ZeeSpec (write code without spec updates; spec lies)

If you see failure signs: read `06-common-pitfalls.md` for diagnosis + interventions.

## Cross-references

- `PORTING-GUIDE.md` — adapting ZeeSpec to your tech stack
- `README.md` — package overview + when to use
- `METHODOLOGY.md` — full methodology spec
- `workflow/00-START-HERE.md` — per-module workflow entry (after adoption)
- `workflow/01-authoring-checklist.md` — first-module authoring

## Next

→ Pick your path: `01-adopting-zeespec-from-scratch.md` OR `02-onboarding-existing-project.md`
