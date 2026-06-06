---
doc: workflow/10-adoption-guide/07-zeespec-lite-tier-0-fasttrack
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: teams wanting quick trial OR small teams without budget for full methodology
addresses_reviewer_finding: Reviewer C P0 #1 (no graduated path)
---

# ZeeSpec Lite — Tier 0 Fast-Track

> **For teams that want to TRY ZeeSpec without 8-hour commitment.** Reduces 10-file format to 3 files; defers reviews + agents to later. Gets you a useful Tier 0 module in 1-2 hours.
>
> Inspired by Reviewer C feedback that the 8-hour Tier 1 threshold blocks small teams from validating the methodology cheaply.
>
> **Vocabulary note:** the "Tier 0 Lite / Tier 1 Standard / Tier B/C Full" labels here are the **weight** axis; the canonical weight vocabulary (Lite/Standard/Full) lives in `METHODOLOGY.md` § 2a. "Tier 0 Lite" = Lite weight.

## The Tier 0 hypothesis

You don't need the full 10-file ZeeSpec to start delivering value. The MOST useful parts of ZeeSpec for early adoption:

1. **CLAUDE.md** — entry point with key invariants (gives AI agents context)
2. **what.md** (entities + invariants) — captures critical INV-MOD-NN with status tags
3. **gaps.md** — open questions; STOP-rules for blocking AI agents

These 3 files deliver:
- ✅ AI agent context for better code generation
- ✅ Status tagging discipline
- ✅ Gap blocking (AI STOPs on OPEN gaps)
- ✅ Invariant capture

What you DON'T get yet:
- ❌ Cross-cutting HW analysis (gravity.md)
- ❌ Algorithm-level pseudocode (how.md)
- ❌ Storage role analysis (where.md)
- ❌ Actor + RBAC + SoD (who.md)
- ❌ Timing + SLA (when.md)
- ❌ Strategic context (why.md)
- ❌ R3 + R1+R2 reviews
- ❌ R4/R5/R6 agent dispatch
- ❌ Drift management

But you can ADD these later as you prove value. That's the point of Tier 0.

## Tier 0 file structure

```
docs/specs/zeespec/<module>/
├── CLAUDE.md          ← entry point
├── what.md            ← entities + invariants (the core)
└── gaps.md            ← open questions
```

3 files. ~2 hours to author for a small module.

## When to use Tier 0

| Scenario | Use Tier 0? |
|----------|-------------|
| First-time ZeeSpec trial; want to evaluate | ✅ YES |
| 1-2 person team; can't afford full methodology | ✅ YES |
| Hobby project that might grow | ✅ YES |
| Greenfield module; spec NOW, expand later | ✅ YES |
| Brownfield retrofit on single module; trial run | ✅ YES |
| Module is already at Tier 1 | ❌ Don't downgrade |
| Compliance-critical from day 1 | ❌ Use full methodology |
| Team already Tier B/C; adding new module | ❌ Author at standard Tier 1 |

## Tier 0 authoring (2 hours)

### Hour 1 — Author what.md + CLAUDE.md skeleton

Set up:

```bash
MODULE=wallet
MOD_PREFIX=WAL

mkdir -p docs/specs/zeespec/$MODULE
cd docs/specs/zeespec/$MODULE
```

#### what.md (45 min)

Create `what.md` with frontmatter + minimal sections:

```markdown
---
module: <name>
dimension: what
tier: 0
version: 0.1.0
status: tier-0-lite
last_updated: YYYY-MM-DD
---

# <Module> — WHAT (Lite)

> Tier 0 Lite spec. Only entities + critical invariants captured.
> Expand to full 10-file Tier 1 when ROI clear.

## 1. Entities

[Quick list — table form]

| Entity | Key fields | Source file |
|--------|-----------|-------------|
| Wallet | id, customer_id, balance, currency, status | <path>/Wallet.<ext> |
| WalletTransaction | id, wallet_id, type, amount, status | <path>/WalletTransaction.<ext> |

## 2. Critical invariants (MVP set — 3-5 max)

### INV-MOD-01 — <statement>
Status: ✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN
Source: <file:line>

### INV-MOD-02 — <statement>
...

(Aim for 3-5 invariants. The MOST critical. Skip nice-to-haves.)

## 3. What's NOT in this Tier 0 spec

- Cross-module HW analysis — see future gravity.md
- Algorithm-level pseudocode — see future how.md
- Actor / RBAC — see future who.md
- Timing / SLA — see future when.md
- Tech stack binding — see future where.md
- Strategic context — see future why.md

## Promotion to Tier 1 trigger

When ANY of these happen, expand to full 10-file Tier 1:
- 2+ engineers working on this module
- Cross-module dependencies emerge
- Production incident traces to undocumented invariant
- Compliance / audit pressure
- 6 months in production OR major refactor planned
```

#### CLAUDE.md (15 min)

```markdown
---
module: <name>
type: entry-point
tier: 0
version: 0.1.0
status: tier-0-lite
last_updated: YYYY-MM-DD
---

# <Module> — AI Spec Entry Point (Tier 0 Lite)

> 🟡 **Tier 0 Lite.** 3-file ZeeSpec. Will expand to Tier 1 (10 files) when triggers per `what.md` § "Promotion to Tier 1" met.

## ⚠️ ACTIVE ISSUES

See `gaps.md`. STOP on any 🔴 OPEN gap.

## Read order (Tier 0)

1. `what.md` — entities + critical invariants
2. `gaps.md` — open questions; STOP rules

(Full 10-file read order will apply when promoted to Tier 1.)

## Critical invariants

- **INV-MOD-01** — [most important]
- **INV-MOD-02** — [second most important]

(See `what.md` for full list with status tags + source.)

## When you write code

- Cite invariant IDs in comments (`// INV-MOD-01`)
- If a 🔴 OPEN gap blocks you → STOP, ask user
- Status tags:
  - ✅ IMPL — production-verified; rely
  - 🟡 PARTIAL — app-layer only; add defense-in-depth
  - 🚧 DESIGN — NOT in production; do NOT rely

## Source documents

- [path/to/your/module/entity-files]
- [path/to/your/module/service-files]
```

### Hour 2 — Author gaps.md + commit

#### gaps.md (45 min)

```markdown
---
module: <name>
dimension: gaps
tier: 0
version: 0.1.0
status: tier-0-lite
last_updated: YYYY-MM-DD
---

# <Module> — GAPS (Lite)

## Severity legend

- 🚨 P0 — money loss / compliance / source-of-truth corruption
- 🟠 P1 — audit gap / aged reconciliation
- 🟡 P2 — reporting drift
- 🟢 P3 — style / cleanup

## Status legend

- 🔴 OPEN — unresolved
- 🟡 PROPOSED — solution drafted, not landed
- 🟢 RESOLVED — fix landed + verified

## AI behavior

For any 🚨 P0 or 🟠 P1 OPEN gap referenced by code path under work:
- STOP and ask the user (no chip yet for Tier 0)

## Open gaps

### Gap-MOD-01 — [title]

**Severity:** 🟠 P1
**Status:** 🔴 OPEN
**Files:** [paths]

**Question/finding:** [describe]
**Current behavior:** [describe]
**Impact:** [describe]
**Suggested resolution:** [describe]

[Add 2-5 gaps; most-critical only]

## Open research questions

[Light placeholder; expand if needed]

## Promotion to Tier 1 (when this becomes a full gaps.md)

- Add severity matrix calibration
- Add ADR-driven gap entries
- Add R5 drift findings table
- Add cross-module gap dependencies
```

#### Commit + done

```bash
git add docs/specs/zeespec/<module>/
git commit -m "Tier 0 ZeeSpec Lite — <module> (CLAUDE + what + gaps)"
```

### Total time: ~2 hours

Done. You have a useful Tier 0 module.

## What you get with Tier 0

After 2 hours:

- ✅ AI agents have context (CLAUDE.md tells them invariants + gaps)
- ✅ 3-5 critical invariants captured with status tags
- ✅ Gap-blocking discipline (AI STOPs on 🔴 OPEN)
- ✅ Foundation for future Tier 1 promotion
- ✅ Team validation: "is this methodology worth more investment?"

## What you don't get with Tier 0

- ❌ Cross-cutting HW guarantees (gravity.md needed)
- ❌ Algorithm-level pseudocode for handoff (how.md needed)
- ❌ Reviews catching errors you didn't notice (R3 + R1+R2 needed)
- ❌ Automated drift detection (CI integration needed)
- ❌ Regulatory grounding (R4 research needed)
- ❌ Architectural decision capture (ADRs needed)
- ❌ Full audit-trail compliance

## Promotion path (Tier 0 → Tier 1)

When triggers per `what.md` § "Promotion to Tier 1" are met, expand:

### Step 1 — Add the other 7 dimension files (1 week)

Per `workflow/01-authoring-checklist.md`:

1. `why.md` — strategic context
2. `how.md` — algorithms (expand from invariants)
3. `who.md` — actors + RBAC
4. `when.md` — timing
5. `where.md` — storage + tech stack
6. `gravity.md` — cross-cutting HW
7. `glossary.md` — terms

### Step 2 — Update CLAUDE.md (1 hour)

Update read order to include 7 new files. Update Critical invariants section.

### Step 3 — Update gaps.md (1 hour)

Add severity matrix reference + AI behavior table + ADR-driven gaps.

### Step 4 — Update frontmatter

Change `tier: 0` → `tier: 0` (still authoring) THEN after reviews → `tier: 1`.

### Step 5 — B1 + R3 + R1+R2 reviews

Per `workflow/02-b1-verification.md` through `04-r1-r2-parallel-review.md`. Time: 1 week.

### Step 6 — Tier 1 promotion

Update frontmatter `tier: 1` + commit. Set up CI drift detection.

Total Tier 0 → Tier 1: ~2 weeks of investment.

## Tier 0 vs Tier 1 vs Tier B/C (full)

| Aspect | Tier 0 Lite | Tier 1 Standard | Tier B/C Full |
|--------|:-----------:|:---------------:|:-------------:|
| Files per module | 3 | 10 | 10 + cross-module |
| Authoring time | 2 hours | 1-2 weeks | 1-2 weeks per module |
| Reviews | Self-only | R3 + R1+R2 agents | Full + R4 + R5 + R6 |
| Drift detection | Manual | Layer 1 CI optional | Layer 1 + 2 + 3 all active |
| ADR lifecycle | Inline notes | adr/ folder | adr/ folder + R6 review |
| Maintenance | When you remember | Quarterly review | Continuous |
| Best for | Trial / 1-2 person team | Single module Tier 1 | 5+ modules at Tier 1 |

## Comparison to alternatives

Tier 0 occupies the middle ground between:

| Alternative | When |
|-------------|------|
| ADR alone (1 file) | Single decision; no INV capture; no AI agent context |
| `decisions.md` 4-file convention | Existing convention; trying to stay light |
| README.md only | Minimal; no methodology benefit |
| **ZeeSpec Tier 0 Lite (3 file)** | **Try methodology; preserve upgrade path** |
| ZeeSpec Tier 1 (10 file) | Validated module; standard adoption |
| ZeeSpec Tier B/C Full | Mature multi-module adoption |

## Anti-patterns at Tier 0

### Anti-pattern 1: Tier 0 forever

**Symptom:** Module reaches conditions for promotion; team never promotes. Spec stays Tier 0 for 2 years.

**Fix:** Tier 0 is a TRIAL phase. If you're using ZeeSpec successfully, promote within 6 months.

### Anti-pattern 2: Tier 0 hides drift

**Symptom:** Tier 0 has no drift detection. Code drifts; spec lies; no warning.

**Fix:** Schedule manual review of Tier 0 modules quarterly. Don't let them rot.

### Anti-pattern 3: Tier 0 used to dodge methodology rigor

**Symptom:** Team uses Tier 0 to avoid R4 / R3 reviews. Module is production-critical but never reviewed.

**Fix:** If module is production-critical, it needs Tier 1. Tier 0 is for trial / small modules only.

### Anti-pattern 4: 7-file scope creep

**Symptom:** Tier 0 module's what.md grows to 1000 lines. Trying to capture everything in 3 files.

**Fix:** If what.md > 300 lines, time to promote to Tier 1 (split into proper dimensions).

## Per-team tier recommendations

| Team type | Recommendation |
|-----------|----------------|
| Solo dev / hobby | Tier 0 always; promote rarely |
| 2-3 person startup | Tier 0 for trial; Tier 1 for 1-2 critical modules |
| 5-10 person team | Tier 1 standard; Tier 0 only for experiments |
| Mid-size (10-20) | Tier 1 + Tier B selectively |
| Enterprise (20+) | Tier B/C; Tier 0 banned (use real methodology) |

## Cost comparison

| Tier | Initial cost | Ongoing cost |
|------|--------------|--------------|
| Tier 0 Lite | 2 hours | 30 min/quarter |
| Tier 1 Standard | 1-2 weeks | 2-4 hours/month |
| Tier B Full | 4-6 weeks per module | 8-16 hours/month per 5 modules |

Tier 0 is ~50x cheaper to start than Tier 1.

## When Tier 0 fails

Tier 0 is insufficient when:
- Production incidents trace to undocumented invariants (need Tier 1 reviews)
- Cross-module bugs (need gravity.md + cross-link bidirectionality)
- Compliance audit requires audit-trail spec (need full methodology)
- New engineer can't onboard from 3-file spec (need full 10-file context)

If any of these happen, promote immediately.

## Cross-references

- `00-START-HERE.md` — adoption decision matrix
- `01-adopting-zeespec-from-scratch.md` — greenfield Tier 1 path
- `06-common-pitfalls.md` — adoption issues + fixes
- `workflow/01-authoring-checklist.md` — full Tier 1 authoring

## Next

→ Back to `00-START-HERE.md` for navigation
→ Or: `workflow/00-START-HERE.md` for per-module workflow
