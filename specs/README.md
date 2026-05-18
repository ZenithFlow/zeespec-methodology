---
doc: README
type: package-overview
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# ZeeSpec Methodology — Standalone Package

> **A portable, AI-friendly specification methodology** based on the 6-dimension Zachman framework (1987), adapted for modern AI-assisted development. **Language-agnostic by design** — only one file (`where.md` § 5) is stack-specific. Validated across 5 production modules of a regulated financial-services system; pilot stack was PHP / Symfony / PostgreSQL but the methodology applies equally to Go, Java, Python, Rust, TypeScript, C#, Ruby, and other backend stacks. The pilot surfaced **177 findings, 4 real production bugs fixed + 6 queued, 22 compliance gaps filed** (see § Validation Track Record below).

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
└── checklists/
    ├── anti-patterns.md            — 13 anti-patterns to avoid
    ├── status-tags.md              — IMPL/PARTIAL/DESIGN conventions
    ├── severity-matrix.md          — P0/P1/P2/P3 + AI behaviour rules
    ├── invariant-numbering.md      — ID conventions (INV/HW/ADR/...)
    └── cross-link-bidirectionality.md — bidirectional reference rules
```

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

| Project type | Verdict |
|--------------|---------|
| Compliance-heavy (finance / healthcare / government) | ✅ STRONG fit |
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
