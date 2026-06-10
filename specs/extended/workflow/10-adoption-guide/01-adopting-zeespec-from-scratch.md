---
doc: extended/workflow/10-adoption-guide/01-adopting-zeespec-from-scratch
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: greenfield projects (you control the codebase from day 1)
---

# Adopting ZeeSpec From Scratch (Greenfield)

> **For greenfield projects.** You're starting fresh; no existing code constrains your spec format. This is the easier adoption path. Time: 2-4 weeks to first Tier 1 module + ongoing rhythm established.

## Pre-conditions

Before starting:

- ✅ Decision to adopt confirmed (see `00-START-HERE.md` decision matrix)
- ✅ Tier selected (A/B/C per `00-START-HERE.md`)
- ✅ Tech stack chosen (where.md § 5 will bind to it)
- ✅ 1 engineer designated as ZeeSpec champion
- ✅ Optional: compliance officer / domain expert available for R2/R4 reviews

## Week 1 — Setup + first module scoping

### Day 1-2: Install the methodology

```bash
# In your project root
git clone https://github.com/your-org/zeespec-methodology.git tmp-zeespec
cp -r tmp-zeespec/specs docs/specs/zeespec
rm -rf tmp-zeespec

# Tell your AI agents about it
cat >> CLAUDE.md <<'EOF'

## Spec methodology

This project uses ZeeSpec (10-file Zachman-derived format).
Read `docs/specs/zeespec/core/workflow/00-START-HERE.md` BEFORE generating code that
touches any ZeeSpec-codified module.

When writing or modifying production code:
- Cite invariant IDs in comments (`// INV-X-04`, `// HW-X-08`, `// ADR-X-013`)
- If an OPEN gap blocks you → STOP, ask user
- Status tags: ✅ IMPL = production-verified; 🟡 PARTIAL = app-layer only;
  🚧 DESIGN = NOT implemented (do not write code relying on it)
EOF
```

Commit: "Adopt ZeeSpec methodology — initial package"

### Day 3: Pick your first module

**Don't pick the most important module first.** Pick the module that:
- Is small enough to spec in ~1 week (target: 5-15 entities, 5-10 algorithms)
- Has clear boundaries (low coupling to other modules)
- Has compliance / business-critical aspects (so methodology delivers value)
- Has 1-2 owners (not "shared" across many engineers)

**Anti-patterns when picking:**
- ❌ "Let's start with the biggest module" — too much spec to write; momentum dies
- ❌ "Let's start with the most experimental module" — spec drifts before written
- ❌ "Let's start with a utility module" — methodology is overkill; no value
- ✅ "Let's start with the [core domain] module" — proves methodology delivers

For finance: typically wallet or KYC are good starting modules.
For healthcare: patient-records or consent-management.
For government: identity-verification or document-vault.

### Day 4-5: Scope the first module

For chosen module:

1. List its entities (5-15)
2. List its algorithms / workflows (5-10)
3. List its external dependencies (other modules / external APIs)
4. List its compliance touchpoints (per `extended/workflow/07-r4-regulatory-research/00-START-HERE.md`)
5. Identify 1-2 critical invariants you already know about (e.g., "amount must be > 0")
6. Estimate authoring time (target: 1 week × 1 engineer = 40h)

If estimate is > 60h: scope is too big; trim or split.

## Week 2 — Author the first module

Follow `core/workflow/01-authoring-checklist.md` exactly.

### Day 1: Set up module structure

```bash
MODULE=wallet
MOD_PREFIX=WAL

cp -r docs/specs/zeespec/core/templates/_template docs/specs/zeespec/$MODULE
cd docs/specs/zeespec/$MODULE

# Replace placeholders (portable sed)
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/$MOD_PREFIX/g"
find . -name '*.bak' -delete
```

> **Default is Tier 0 Lite (3 files), not all 10.** This greenfield walk-through authors the **full** 10-file spec for ONE critical module to reach Tier 1. For most modules, start with the 3-file Tier 0 Lite (`CLAUDE.md + what.md + gaps.md`, see `07-zeespec-lite-tier-0-fasttrack.md`) and promote only those that earn it. Note: "Tier 0" below = the *Drafting* maturity tier (all 10 drafted, pre-review) — distinct from "Tier 0 **Lite**" (3-file reduced scope).

### Day 2-3: Fill in dimensions

In this order:
1. `why.md` — strategic context + business rules (1-2 hours)
2. `what.md` — entities + invariants (4-6 hours)
3. `how.md` — algorithms + state machines (4-6 hours)
4. `who.md` — actors + RBAC + SoD (1-2 hours)
5. `when.md` — timing + SLAs (1-2 hours)
6. `where.md` — storage + tech stack binding (2-3 hours)

### Day 4: Cross-dimension files

7. `gravity.md` — hardwiring constraints (1-2 hours)
8. `gaps.md` — open questions (1 hour)
9. `glossary.md` — terms (1 hour)
10. `CLAUDE.md` — entry point (2 hours; written last because it summarizes)

### Day 5: B1 verification + commit

Run `core/workflow/02-b1-verification.md` — verify spec claims match production code (or planned code if greenfield).

Commit: "WAL module — Tier 0 ZeeSpec authored"

## Week 3 — Reviews + Tier 1 promotion

### Day 1: R3 deep review

Per `core/workflow/03-r3-deep-review.md`. Dispatch agent (or have a different engineer review). Time: 1-2 hours of agent runtime; 1 hour of human triage.

### Day 2: R1+R2 parallel reviews

Per `core/workflow/04-r1-r2-parallel-review.md`. Dispatch 2 agents in parallel. Time: 1-2 hours wall-clock.

### Day 3-4: Apply findings

Per `core/workflow/05-apply-findings.md`. Resolve P0/P1 findings. File chips for production bugs (per `06-spawn-task-chips.md`).

### Day 5: Promote to Tier 1

Update CLAUDE.md frontmatter: `status: tier-1` + date. Commit.

Now the module is **production-validated**.

## Week 4 — Establish ongoing rhythm

### Continuous (per PR)

Set up CI drift detection per `extended/workflow/08-code-drift-management/03-auto-drift-detection.md` for this module. Start in WARN mode (don't block PRs).

### Monthly

Schedule monthly drift review per `extended/workflow/08-code-drift-management/01-drift-detection-strategies.md` (Layer 2). 2-4 hours per module.

### Quarterly

R4 re-validation if module has external-authority claims (per `extended/workflow/07-r4-regulatory-research/06-re-validation-strategy.md`). 1-4 hours.

### Annually

- Full B1 quantitative re-verification (per workflow/02)
- R6 ADR annual review (per workflow/09/05 Mode B)
- Compliance officer sign-off renewal

## Months 2-6 — Expand coverage

After first module at Tier 1, expand:

### Month 2: Second module (same engineer; easier due to learning)

Repeat Week 2-3 process. Should take 50-70% of first-module time.

### Month 3-4: Third module + second engineer onboards

Have your champion mentor a second engineer through their first module. Aim for the methodology to spread beyond 1 person.

### Month 5-6: 5+ modules at Tier 1; rhythm established

Now ZeeSpec is part of how the team works. Move to Tier B (Standard) tier if you started at Tier A.

## Common greenfield mistakes

### Mistake 1: Authoring all 10 modules in parallel

**Symptom:** "Let's spec everything before we write any code."

**Why bad:** Spec drifts before code lands; you waste effort on modules that change scope.

**Fix:** Spec one module at a time, in sync with implementing it. Authoring should run 1-2 weeks ahead of implementation, not 6 months.

### Mistake 2: Skipping R4 because "no external authority yet"

**Symptom:** Pre-launch product; no regulator engaged yet; skip R4.

**Why bad:** Regulator will be engaged eventually. Better to bake compliance into the spec from day 1 than retrofit.

**Fix:** Even if pre-launch, dispatch R4 with the question "what regulations will apply once we serve real customers?" Then build to that.

### Mistake 3: ADR-light culture

**Symptom:** "We'll add ADRs later when we have time."

**Why bad:** By the time you have time, you've forgotten WHY the decisions were made. Retroactive ADRs are harder than proactive.

**Fix:** Every PR description includes an "ADR impact" section. If material decision → write ADR alongside code.

### Mistake 4: Treating the spec as a one-time deliverable

**Symptom:** "We wrote the spec; we're done."

**Why bad:** Spec without ongoing drift detection becomes lying documentation within 6 months.

**Fix:** Layer 1 CI drift detection from week 1. Layer 2 monthly drift review from month 2.

### Mistake 5: Champion leaves; methodology dies

**Symptom:** ZeeSpec champion gets promoted / leaves. No one picks it up.

**Why bad:** Single-person dependency; methodology becomes "Bob's thing."

**Fix:** Always have 2 people who can mentor the methodology. From month 3 onward, no single bus factor.

## Time-to-value milestones

| Milestone | Target time | Indicator |
|-----------|-------------|-----------|
| Methodology installed | Day 1 | docs/specs/zeespec/ exists; CLAUDE.md updated |
| First Tier 0 module | Week 2 | All 10 files filled (drafts OK) |
| First Tier 1 module | Week 3-4 | Reviews done; status: tier-1 |
| CI drift detection running | Week 4 | First drift report posted on a PR |
| Second module Tier 1 | Month 2 | Methodology proves repeatable |
| Multi-engineer ZeeSpec | Month 4 | 2+ engineers fluent |
| 5+ modules at Tier 1 | Month 6 | Methodology embedded in team |

## Cost estimate (greenfield)

For Tier B adoption (5-10 modules):

| Investment | Cost |
|------------|------|
| Initial setup + first module (Weeks 1-3) | 1 engineer × 3 weeks = 120h |
| Modules 2-5 (Months 2-4) | 1 engineer × 2 days/week × 12 weeks = 96h |
| Modules 6-10 (Months 5-6) | 0.5 engineer × 1 day/week × 8 weeks = 32h |
| Ongoing maintenance (Year 1+) | 1 engineer × 1 day/week ≈ 0.2 FTE |
| **Total Year 1** | ~250h ≈ 0.15 FTE |

ROI break-even point: typically 1 prevented production bug + 1 prevented compliance gap, which methodology surfaces in first 6 months of disciplined use.

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `02-onboarding-existing-project.md` — brownfield alternative
- `03-team-rollout-strategy.md` — multi-developer rollout (after week 4)
- `04-tooling-integration.md` — CI/IDE setup
- `core/workflow/00-START-HERE.md` — per-module workflow (used during weeks 2-3)
- `core/workflow/01-authoring-checklist.md` — first-module authoring detail
- `PORTING-GUIDE.md` — tech-stack adaptation

## Next

→ `03-team-rollout-strategy.md` — expand beyond solo champion
→ `04-tooling-integration.md` — CI / IDE / Slack
