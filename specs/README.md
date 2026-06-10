---
doc: README
type: package-overview
version: 4.0.0
status: stable
last_updated: 2026-06-10
---

# ZeeSpec Methodology — Standalone Package

> **A portable, AI-friendly specification methodology** based on the 6-dimension Zachman framework (1987), adapted for modern AI-assisted development. **Language-agnostic by design** — only one file (`where.md` § 5) is stack-specific. Piloted on 5 production modules of a regulated financial-services system (single pilot, N=1); pilot stack was PHP / Symfony / PostgreSQL but the methodology applies equally to Go, Java, Python, Rust, TypeScript, C#, Ruby, and other backend stacks. The pilot surfaced **177 findings, 4 real production bugs fixed + 6 queued, 22 compliance gaps filed** (see § Validation Track Record below).

---

## TL;DR

ZeeSpec is a **10-file specification format** that decomposes any software module into orthogonal dimensions (WHY/WHAT/HOW/WHO/WHEN/WHERE) plus 4 helpers (entry point, gravity, gaps, glossary). The format is **language-agnostic** — only one file (`where.md` § 5) is stack-specific. Reviewers (R3 deep + R1+R2 parallel) catch what single-pass authoring misses. The default entry is the **Lite weight (~3 files)**, not all 10 — promote to the full set deliberately (see `core/METHODOLOGY.md` § 2a).

## What problem does it solve?

AI agents hallucinate when specs are vague, contradictory, or stale relative to production code. ZeeSpec enforces:

1. **Dimensional decomposition** — each file owns one orthogonal concern
2. **Production verification mandate** — every claim cites `file:line`
3. **Status tagging** (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN)
4. **Gap blocking** — AI MUST STOP on OPEN gaps
5. **Multi-reviewer pipeline** — R3 → R1+R2 parallel reviewers

## The three tiers — read core/ first, the rest is opt-in

The package practices its own progressive-disclosure rule: it is split into three tiers, and
**only `core/` is the mandatory reading path** (≤ 5,000 lines, CI-enforced budget —
`scripts/dogfood-drift-scan.sh` check [4]).

| Tier | What lives there | When you need it |
|------|------------------|------------------|
| **`core/`** | METHODOLOGY · PORTING-GUIDE · workflow 00-06 (author → B1 → R3 → R1+R2 → apply → spawn chips) · checklists · templates | **Everyone.** This is the whole methodology for day-to-day use. Start and often stop here. |
| **`extended/`** | workflow 07 (R4 regulatory research) · 08 (drift management) · 09 (ADR lifecycle) · 10 (adoption guide) · 11 (plugin integration) · 12 (agentic roles) · ZACHMAN-ALIGNMENT | Load a chapter **when the trigger fires**: external-authority claims → 07; CI drift gates → 08; design decisions → 09; org rollout → 10. |
| **`examples/`** | overlays (finance-accounting, frontend-design-system) · EXPLAINED-FOR-PRESENTATIONS | Reference material. Overlays show the methodology applied to a domain; never required. |

Path convention: references in prose are written **relative to this package root** (e.g.
`core/workflow/02-b1-verification.md`, `extended/workflow/08-code-drift-management/`).

## Package layout

```
specs/                              ← copy this whole directory into your project
├── README.md                       — this file (the router)
├── core/                           — the mandatory tier (≤ 5,000 lines, budget-gated)
│   ├── METHODOLOGY.md              — full framework spec (~40 min read)
│   ├── PORTING-GUIDE.md            — adapt to your stack (15 min)
│   ├── workflow/                   — 00-START-HERE → 06-spawn-task-chips (the pipeline)
│   ├── checklists/                 — anti-patterns · status-tags · severity · numbering · cross-links · gaps
│   └── templates/
│       ├── _template/              — empty 10-file ZeeSpec scaffold (per-module)
│       └── _meta/                  — project-wide tracking (module-index · spawn-chips · metrics-loop · retrospective)
├── extended/
│   ├── ZACHMAN-ALIGNMENT.md        — honest mapping to Zachman + self-review log
│   └── workflow/
│       ├── 07-r4-regulatory-research/   — regulator + statute research (R4)
│       ├── 08-code-drift-management/    — continuous drift detection (R5)
│       ├── 09-adr-lifecycle/            — ADR format + lifecycle (R6)
│       ├── 10-adoption-guide/           — greenfield / brownfield / team rollout / one-man-army
│       ├── 11-anthropics-plugin-integration/ — single integration note
│       └── 12-agentic-role-replacement/ — role coverage (hypothesis bands) + limits
└── examples/
    ├── EXPLAINED-FOR-PRESENTATIONS.md
    └── overlays/
        ├── finance-accounting/     — GL · wallet-settlement · KYC/AML · lending + R4 worked examples
        └── frontend-design-system/ — React/Tailwind v4/shadcn + RF reviewer + UI testing
```

## Available overlays

Domain-specialized add-ons that layer additional invariants, anti-patterns, severity calibration, and pre-filled module templates onto the neutral core.

| Overlay | Status | When to use |
|---------|--------|-------------|
| **finance-accounting** v0.1.0 | 🧪 reference example | Regulated financial services (mutual funds, brokerages, payments, custodians, **NBFI lending**). Double-entry + IFRS-aware + multi-jurisdiction compliance (EU/US/UK/SG/JP/IN/HK/AU/MN). Modules: GL, wallet-settlement, KYC/AML, lending. 4 worked R4 research examples. See `examples/overlays/finance-accounting/README.md`. |
| **frontend-design-system** v0.1.0 | 🧪 reference example | Modern, complete, tested frontends for **React/Next.js + Tailwind v4 + shadcn/ui**. Fixes the backend-shaped-spec failures: naked HTML / default serif, half-built CRUD flows, no UI tests. Adds design tokens (DTCG → Tailwind `@theme`), a component-contract spec type, UI-flow-completeness rules, Storybook + Playwright + axe executable tests, and the **RF** frontend reviewer. See `examples/overlays/frontend-design-system/README.md`. |

> **Note on overlays:** overlays are **reference examples** of how to apply the methodology to a specific domain. The **methodology itself** (`core/` + the extended chapters) is the primary deliverable; overlays show it working in practice.

## Quick start (5 minutes)

```bash
# 1. Copy the package into your project
cp -r path/to/zeespec-methodology/specs your-project/docs/specs/zeespec

# 2. Tell your AI agent to read the methodology
cat >> your-project/CLAUDE.md <<'EOF'

## Spec methodology
This project uses ZeeSpec (10-file Zachman-derived format).
Read `docs/specs/zeespec/core/workflow/00-START-HERE.md` BEFORE generating code that
touches any ZeeSpec-codified module.
EOF

# 3. Initialize your first module from the template
MODULE=your-first-module
MOD_PREFIX=YOURMOD   # 3-7 chars ALL CAPS for ID prefixing (INV-YOURMOD-NN, HW-YOURMOD-NN)

cp -r your-project/docs/specs/zeespec/core/templates/_template \
      your-project/docs/specs/zeespec/$MODULE

# 4. Replace placeholders (portable sed — works on macOS BSD + Linux GNU)
cd your-project/docs/specs/zeespec/$MODULE
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/$MOD_PREFIX/g"
find . -name '*.bak' -delete

# 5. Author your first module at Lite weight (~2h: CLAUDE.md + what.md + gaps.md)
#    → follow core/workflow/01-authoring-checklist.md
```

## When to use ZeeSpec

| Project type | Verdict | Recommended overlays |
|--------------|---------|---------------------|
| Regulated financial services (funds, brokers, payments) | ✅ STRONG fit | + `finance-accounting` |
| Compliance-heavy (finance / healthcare / government) | ✅ STRONG fit | + domain overlay (finance available; healthcare/government TBD) |
| Multi-team / multi-module enterprise app | ✅ STRONG fit |
| AI-assisted dev at scale (Claude Code / Copilot / Cursor) | ✅ STRONG fit |
| Brownfield with stale documentation | ✅ STRONG fit (great for dock + verify) |
| Greenfield Tier-1 modules | ✅ Use for top 3-5 critical modules |
| Single-developer hobby project | ⚠️ Overhead may exceed value |
| Pre-PMF prototype | ⚠️ Use lightweight specs |
| Trivial CRUD module | ⚠️ 10 files is overkill |
| Throwaway scripts | ❌ Skip |

## Validation Track Record

> **Pilot domain:** regulated financial services (mutual-fund management). The compliance-gap descriptors below (AML / regulator audit) reflect this domain. In other domains the analogue would be — healthcare: PHI exposure / HIPAA audit; e-commerce: PCI-DSS / GDPR-Article-17; government: FedRAMP control gaps. The methodology applies equally; only the gap labels change.

| Module (pilot) | Findings | Production Bugs | Compliance Gaps (pilot-domain labels) |
|----------------|---------:|----------------:|---------------------------------------|
| notification | 45 | 2 fixed | 3 GDPR/AML filed |
| asset_catalog | 13 | 1 fixed | 1 phantom-method removed |
| wallet | 25 | 1 fixed | 5 AML filed |
| accounting | 54 | (3 spawn chips OPEN) | 7 regulator retention/audit |
| settlement | 40 | (3 spawn chips OPEN) | 6 regulator audit/tax |
| **TOTAL** | **177** | **4 + 6 queued** | **22 filed** |

## Cost & ROI

> **N=1 caveat:** the numbers below are *observations from one pilot* (single author, single project), not independently-validated ROI — directional, not proven.

- **Authoring time:** 4-8 hours per module (B1 + R3 + R1+R2 + apply)
- **Per module ROI:**
  - Production bug avoided: typically saves 8-40 hours of debugging + customer-impact recovery
  - Compliance gap avoided: priceless (one enforcement action = $XX,000+ + license risk)

## Document reading order

For first-time setup:
1. `core/METHODOLOGY.md` — full framework spec (~40 min read)
2. `core/PORTING-GUIDE.md` — adapt to your stack (15 min)
3. `core/workflow/00-START-HERE.md` — AI agent entry point
4. `core/workflow/01-authoring-checklist.md` — first module authoring

For AI agents on every code task:
1. `core/workflow/00-START-HERE.md` — AI agent entry point
2. The module's `CLAUDE.md` (in your project)
3. The relevant dimension file (what/how/who/when/where) for your task
4. `gaps.md` — STOP if blocked

For periodic review:
1. `core/workflow/02-b1-verification.md` — quick quantitative drift check
2. `core/workflow/03-r3-deep-review.md` — deep same-session verifier
3. `core/workflow/04-r1-r2-parallel-review.md` — parallel independent reviewers

Extended chapters — load on trigger, not upfront:
- External-authority claims (regulator / statute / standard) → `extended/workflow/07-r4-regulatory-research/00-START-HERE.md`
- Continuous drift detection + CI gates → `extended/workflow/08-code-drift-management/00-START-HERE.md`
- Design decisions / ADRs → `extended/workflow/09-adr-lifecycle/00-START-HERE.md`
- Organizational adoption / rollout → `extended/workflow/10-adoption-guide/00-START-HERE.md`

## Customization points

| What you might customize | Where to do it |
|--------------------------|----------------|
| Module prefix | `core/templates/_template/*.md` — replace `MOD_PREFIX` |
| Regulatory framework | `core/checklists/severity-matrix.md` — adapt jurisdiction |
| Tech stack | `core/templates/_template/where.md` § 5 — rewrite for your stack |
| Reviewer prompts | `core/workflow/04-r1-r2-parallel-review.md` — adapt for domain |
| Status tags | `core/checklists/status-tags.md` — usually keep as-is |
| Numbering | `core/checklists/invariant-numbering.md` — usually keep as-is |

## License

MIT — use, fork, adapt freely. Attribution appreciated.

## Credits

- **Framework:** John Zachman, "A Framework for Information Systems Architecture" (IBM Systems Journal, 1987)
- **AI-era adaptation:** Validated 2026-04 — 2026-05 across 5 production modules
- **Reviewer pattern:** Inspired by Claude Code agent dispatch + "trust but verify" principle
