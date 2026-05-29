---
doc: README
type: package-overview
version: 3.0.0
status: stable
last_updated: 2026-05-29
---

# ZeeSpec Methodology — Standalone Package

> **A portable, AI-friendly specification methodology** based on the 6-dimension Zachman framework (1987), adapted for modern AI-assisted development. **Language-agnostic by design** — only one file (`where.md` § 5) is stack-specific. Piloted on 5 production modules of a regulated financial-services system (single pilot, N=1); pilot stack was PHP / Symfony / PostgreSQL but the methodology applies equally to Go, Java, Python, Rust, TypeScript, C#, Ruby, and other backend stacks. The pilot surfaced **177 findings, 4 real production bugs fixed + 6 queued, 22 compliance gaps filed** (see § Validation Track Record below).

---

## TL;DR

ZeeSpec is a **10-file specification format** that decomposes any software module into orthogonal dimensions (WHY/WHAT/HOW/WHO/WHEN/WHERE) plus 4 helpers (entry point, gravity, gaps, glossary). The format is **language-agnostic** — only one file (`where.md` § 5) is stack-specific. Reviewers (R3 deep + R1+R2 parallel) catch what single-pass authoring misses.

## What problem does it solve?

AI agents hallucinate when specs are vague, contradictory, or stale relative to production code. ZeeSpec enforces:

1. **Dimensional decomposition** — each file owns one orthogonal concern
2. **Production verification mandate** — every claim cites `file:line`
3. **Status tagging** (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN)
4. **Gap blocking** — AI MUST STOP on OPEN gaps
5. **Multi-reviewer pipeline** — R3 → R1+R2 parallel reviewers

## Package contents

```
zeespec-methodology/specs/
├── README.md                       — this file
├── METHODOLOGY.md                  — full framework specification (1.5h read)
├── PORTING-GUIDE.md                — adapt to your stack (PHP/Go/Python/TS/Rust)
├── workflow/
│   ├── 00-START-HERE.md            — AI agent entry point (read first)
│   ├── 01-authoring-checklist.md   — new module Tier 1 promotion
│   ├── 02-b1-verification.md       — quantitative drift check
│   ├── 03-r3-deep-review.md        — same-session deep verifier
│   ├── 04-r1-r2-parallel-review.md — independent reviewer pipeline
│   ├── 05-apply-findings.md        — fold findings back
│   └── 06-spawn-task-chips.md      — production-fix delegation
├── templates/
│   ├── _template/                  — empty 10-file ZeeSpec scaffolding (per-module)
│   │   ├── CLAUDE.md               — entry point template
│   │   ├── why.md                  — strategic goals + risks
│   │   ├── what.md                 — entities + invariants
│   │   ├── how.md                  — algorithms + state machines
│   │   ├── who.md                  — actors + RBAC
│   │   ├── when.md                 — triggers + SLAs
│   │   ├── where.md                — storage + tech stack binding
│   │   ├── gravity.md              — cross-cutting hardwiring
│   │   ├── gaps.md                 — open questions
│   │   └── glossary.md             — domain + technical terms
│   └── _meta/                      — project-wide tracking templates
│       ├── README.md                — _meta directory overview
│       ├── module-index.md         — copy to docs/specs/zeespec/README.md
│       ├── spawn-chips.md          — track all dispatched task chips
│       └── pilot-retrospective.md  — after 3+ modules, capture lessons
├── checklists/
│   ├── anti-patterns.md            — 13 anti-patterns to avoid
│   ├── status-tags.md              — IMPL/PARTIAL/DESIGN conventions
│   ├── severity-matrix.md          — P0/P1/P2/P3 + AI behaviour rules
│   ├── invariant-numbering.md      — ID conventions (INV/HW/ADR/...)
│   ├── cross-link-bidirectionality.md — bidirectional reference rules
│   └── gaps-anatomy.md             — 🆕 what gaps.md contains + 6 sources + lifecycle
├── workflow/07-r4-regulatory-research/  — domain-agnostic regulator + statute research
│   ├── 00-START-HERE.md            — entry; when to use; tier hierarchy
│   ├── 01-regulatory-research-workflow.md — 6-phase method
│   ├── 02-source-evaluation.md     — 7-question source trust eval
│   ├── 03-citation-conventions.md  — durable citation format + source registry
│   ├── 04-R4-agent-prompt.md       — domain-parametrized agent prompt
│   ├── 05-source-cheatsheet.md     — URLs for finance / healthcare / government / privacy / tax / etc.
│   ├── 06-re-validation-strategy.md  — annual re-check + trigger-based + change category handling
│   ├── 07-conflict-resolution.md     — 8 types of authority conflict + decision protocol
│   ├── 08-multi-jurisdiction-strategy.md — MAX rule + per-customer profile + cross-border transfer
│   ├── 09-amendment-tracking.md      — proactive monitoring; watch list; consultation papers
│   └── 10-translation-pitfalls.md    — modal-verb drift; false friends; terminology log
├── workflow/08-code-drift-management/  — 🆕 v1.0.0 continuous drift detection + categorization + resolution
│   ├── 00-START-HERE.md            — entry; 3-layer model (continuous / scheduled / triggered); 4-type framework
│   ├── 01-drift-detection-strategies.md — CI + monthly + per-event detection patterns
│   ├── 02-drift-categorization.md  — Type 1 (citation) / Type 2 (field+enum) / Type 3 (behavioral) / Type 4 (architectural)
│   ├── 03-auto-drift-detection.md  — CI script + GitHub Actions/GitLab/Bitbucket + git pre-commit hooks
│   ├── 04-drift-resolution-playbook.md — per-type recipes (T1/T2/T3-bug/T3-design/T4)
│   └── 05-R5-drift-scanner-agent.md — agent prompt (4 dispatch modes)
├── workflow/09-adr-lifecycle/          — 🆕 v1.0.0 ADR format + lifecycle + relationships + drift-driven pattern
│   ├── 00-START-HERE.md            — entry; ADR vs spec; when to write; storage options
│   ├── 01-adr-format-template.md   — inline + file format; required + recommended fields
│   ├── 02-adr-lifecycle.md         — Proposed → Accepted → Superseded / Deprecated transitions
│   ├── 03-adr-relationships.md     — supersedes / extends / conflicts-with / inherits links
│   ├── 04-drift-driven-adr-pattern.md — drift detection → retroactive ADR pipeline
│   └── 05-R6-adr-curator-agent.md  — agent (4 modes: draft / annual review / conflict check / cross-module)
├── workflow/10-adoption-guide/         — 🆕 v1.0.0 organizational adoption (greenfield / brownfield / team rollout)
│   ├── 00-START-HERE.md            — entry; adoption decision matrix; tier selection
│   ├── 01-adopting-zeespec-from-scratch.md — greenfield path
│   ├── 02-onboarding-existing-project.md — brownfield path
│   ├── 03-team-rollout-strategy.md — multi-developer rollout
│   ├── 04-tooling-integration.md   — CI / IDE / Slack / dashboards
│   ├── 05-cross-domain-adaptation.md — healthcare / government / privacy / etc.
│   ├── 06-common-pitfalls.md       — 15 adoption failure modes + fixes
│   ├── 07-zeespec-lite-tier-0-fasttrack.md — 3-file Lite path (2-hour trial)
│   └── 08-one-man-army.md          — solo developer playbook (1 хүн full workflow)
├── workflow/11-anthropics-plugin-integration/  — 🆕 v1.0.0 integration with anthropics/financial-services plugins
│   ├── 00-START-HERE.md            — entry; ZeeSpec vs plugins (complementary)
│   ├── 01-plugin-output-as-adr.md  — Pattern 1: capture plugin outputs as ADRs
│   ├── 02-dispatching-from-zeespec.md — Pattern 2: plugin-as-subroutine
│   ├── 03-spec-driven-plugin-config.md — Pattern 3: spec governs plugin runtime
│   └── 04-installation-coexistence.md — install + coexist
├── workflow/12-agentic-role-replacement/  — 🆕 v1.0.0 systematic agentic replacement of 6 human team roles
│   ├── 00-START-HERE.md            — entry; 6-role coverage table; gold rules
│   ├── 01-reviewer-agents.md       — Reviewer (R1/R2/R3) — 75-85% coverage
│   ├── 02-compliance-officer-agent.md — Compliance Officer — 60-70% coverage
│   ├── 03-architect-agent.md       — Architect — 65-75% coverage
│   ├── 04-tech-lead-agent.md       — Tech Lead — 50-60% coverage
│   ├── 05-domain-expert-agent.md   — Domain Expert / PM — 40-55% coverage
│   ├── 06-qa-tester-agent.md       — QA Engineer / Tester — 70-80% coverage
│   ├── 07-orchestration-matrix.md  — Multi-role handoff + panel + parallel dispatch
│   └── 08-limitations-and-escalation.md — Honest limits + when to escalate to humans
└── overlays/
    └── finance-accounting/         — domain-specialized reference example (v0.4.0)
        ├── README.md               — how to apply the overlay
        ├── principles/             — accounting + regulatory + invariants + anti-patterns + severity (5 files)
        ├── modules/                — 4 pre-filled module templates
        │   ├── general-ledger/     — full 10-file ZeeSpec for GL / journal / CoA
        │   ├── wallet-settlement/  — module overview (condensed) for payment / wallet
        │   ├── kyc-aml/            — module overview (condensed) for KYC / AML
        │   └── lending/            — module overview (condensed) for NBFI lending
        ├── research-examples/      — 4 worked R4 research examples (finance-specific)
        ├── prompts/                — specialized R2 financial reviewer agent prompt
        └── glossary/               — ~120 finance + accounting + regulator vocabulary
```

## Available overlays

Domain-specialized add-ons that layer additional invariants, anti-patterns, severity calibration, and pre-filled module templates onto the neutral core.

| Overlay | Status | When to use |
|---------|--------|-------------|
| **finance-accounting** v0.4.0 | 🧪 reference example | Regulated financial services (mutual funds, brokerages, payments, custodians, **NBFI lending**). Double-entry + IFRS-aware + multi-jurisdiction compliance (EU/US/UK/SG/JP/IN/HK/AU/MN). Modules: GL, wallet-settlement, KYC/AML, lending. 4 worked R4 research examples showing the methodology in action. See `overlays/finance-accounting/README.md`. |

> **Note on overlays:** overlays are **reference examples** of how to apply the methodology to a specific domain. The **methodology itself** (core workflow + R4 research at `workflow/07-r4-regulatory-research/`) is the primary deliverable; overlays show it working in practice.

## Quick start (5 minutes)

```bash
# 1. Copy the package into your project
cp -r path/to/zeespec-methodology/specs your-project/docs/specs/zeespec

# 2. Tell your AI agent to read the methodology
cat >> your-project/CLAUDE.md <<'EOF'

## Spec methodology
This project uses ZeeSpec (10-file Zachman-derived format).
Read `docs/specs/zeespec/workflow/00-START-HERE.md` BEFORE generating code that
touches any ZeeSpec-codified module.
EOF

# 3. Initialize your first module from the template
MODULE=your-first-module
MOD_PREFIX=YOURMOD   # 3-7 chars ALL CAPS for ID prefixing (INV-YOURMOD-NN, HW-YOURMOD-NN)

cp -r your-project/docs/specs/zeespec/templates/_template \
      your-project/docs/specs/zeespec/$MODULE

# 4. Replace placeholders (portable sed — works on macOS BSD + Linux GNU)
cd your-project/docs/specs/zeespec/$MODULE
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/$MOD_PREFIX/g"
find . -name '*.bak' -delete

# 5. Author your first ZeeSpec (4-6 hours per module)
#    → follow workflow/01-authoring-checklist.md
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
1. `METHODOLOGY.md` — full framework spec (1.5h read)
2. `PORTING-GUIDE.md` — adapt to your stack (15 min)
3. `workflow/00-START-HERE.md` — AI agent entry point
4. `workflow/01-authoring-checklist.md` — first module authoring

For AI agents on every code task:
1. `workflow/00-START-HERE.md` — AI agent entry point
2. The module's `CLAUDE.md` (in your project)
3. The relevant dimension file (what/how/who/when/where) for your task
4. `gaps.md` — STOP if blocked

For periodic review:
1. `workflow/02-b1-verification.md` — quick quantitative drift check
2. `workflow/03-r3-deep-review.md` — deep same-session verifier
3. `workflow/04-r1-r2-parallel-review.md` — parallel independent reviewers

## Customization points

| What you might customize | Where to do it |
|--------------------------|----------------|
| Module prefix | `templates/_template/*.md` — replace `MOD_PREFIX` |
| Regulatory framework | `checklists/severity-matrix.md` — adapt jurisdiction |
| Tech stack | `templates/_template/where.md` § 5 — rewrite for your stack |
| Reviewer prompts | `workflow/04-r1-r2-parallel-review.md` — adapt for domain |
| Status tags | `checklists/status-tags.md` — usually keep as-is |
| Numbering | `checklists/invariant-numbering.md` — usually keep as-is |

## License

MIT — use, fork, adapt freely. Attribution appreciated.

## Credits

- **Framework:** John Zachman, "A Framework for Information Systems Architecture" (IBM Systems Journal, 1987)
- **AI-era adaptation:** Validated 2026-04 — 2026-05 across 5 production modules
- **Reviewer pattern:** Inspired by Claude Code agent dispatch + "trust but verify" principle
