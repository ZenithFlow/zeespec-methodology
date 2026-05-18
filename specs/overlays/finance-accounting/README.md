---
doc: overlays/finance-accounting/README
type: overlay-overview
overlay_name: finance-accounting
overlay_version: 0.1.0
core_zeespec_version: ">=2.3.0"
status: experimental
last_updated: 2026-05-18
---

# ZeeSpec Overlay — Finance & Accounting

> **Domain-specialized add-on** for regulated financial-services systems (mutual funds, brokerages, payments, custodians) built on the **double-entry accounting** model. Layers IFRS-aware accounting invariants, FRC/SEC/ESMA compliance framework, AML/KYC rules, and pre-filled module templates on top of the neutral ZeeSpec core.

## When to use this overlay

| Project | Verdict |
|---------|---------|
| Mutual fund / asset management platform | ✅ STRONG fit |
| Payment processor / wallet / settlement system | ✅ STRONG fit |
| Custodian / broker-dealer | ✅ STRONG fit |
| Crypto exchange (with KYC) | ✅ STRONG fit (FRC equivalent: your local virtual-asset regulator) |
| Banking core | ⚠️ Useful but needs banking-specific overlay (Basel III, capital adequacy) — out of scope here |
| Non-financial SaaS | ❌ Use core ZeeSpec; this overlay assumes double-entry semantics |
| Pre-PMF fintech prototype | ⚠️ Overhead may exceed value; use core ZeeSpec |

## What you get

1. **Accounting principles file** (`principles/accounting-principles.md`) — codifies double-entry invariants (debit=credit, no negative balances, immutable journal, period close) as `INV-ACC-*` rules ready to copy into your `accounting/what.md`.
2. **Regulatory compliance file** (`principles/regulatory-compliance.md`) — 7 universal compliance pillars (segregation, NAV, AML/CFT, reporting, retention, data protection) with multi-jurisdiction examples (EU / US / UK / Singapore / India / Japan / HK / Australia / Mongolia). Mongolia FRC shown as one example among many.
3. **Financial invariants catalog** (`principles/financial-invariants-catalog.md`) — 25-30 canonical INV / HW entries seen across pilot modules; reuse directly OR fork.
4. **Financial anti-patterns** (`principles/financial-anti-patterns.md`) — 12-15 domain-specific traps beyond core ZeeSpec's 13 (e.g., currency-rounding drift, FX revaluation timing, fee-accrual off-by-one).
5. **Finance-calibrated severity matrix** (`principles/severity-matrix-finance.md`) — overrides core severity matrix with financial-domain calibration (compliance enforcement risk, money-loss thresholds, AML reporting deadlines). Jurisdiction-neutral; examples cover multiple regulators.
6. **Pre-filled module templates** (`modules/`):
   - `general-ledger/` — 10 ZeeSpec files pre-filled with Chart of Accounts, journal entry, double-entry invariants, period close, trial balance
   - `wallet-settlement/` — 10 files for customer balances, deposit/withdrawal, T+N settlement, reconciliation
   - `kyc-aml/` — 10 files for tiered KYC, AML screening, CTR threshold, sanctions/PEP, STR/SAR filing
7. **Specialized R2 reviewer prompt** (`prompts/R2-financial-reviewer.md`) — replaces the generic R2 prompt with finance-tuned questions ("Show me the audit trail for journal #X", "Reconcile yesterday's wallet movements against subledger", "List CTR transactions > threshold over last 30 days").
8. **Finance + accounting glossary** (`glossary/finance-glossary.md`) — ~120 terms covering double-entry, IFRS line types, AML/KYC acronyms, multi-jurisdiction regulator vocabulary.

9. **Regulatory research methodology** (`research/`) — step-by-step workflow for navigating your jurisdiction's regulator website + statute database; how to evaluate sources; how to cite regulator + law in your spec; R4-Regulatory-Research agent prompt; 3 worked examples (FRC investment-fund regulation; Mongolia AML law; cross-jurisdiction retention research); cheatsheet of regulator websites + statute databases for 9 jurisdictions.

## Read order

1. **Core ZeeSpec first** — read `/specs/README.md` + `/specs/METHODOLOGY.md` + `/specs/workflow/00-START-HERE.md` (1.5h)
2. **This overlay's README** (you are here)
3. `principles/accounting-principles.md` — understand the double-entry semantics this overlay assumes
4. `principles/regulatory-compliance.md` — regulatory framework (multi-jurisdiction)
5. `principles/financial-invariants-catalog.md` — reusable invariants
6. `principles/severity-matrix-finance.md` — calibration
7. `research/00-START-HERE.md` — how to research YOUR jurisdiction's specifics (regulator + statute + retention thresholds)
8. Pick the relevant module template under `modules/` and start authoring

## Relationship to core ZeeSpec

This overlay **does not replace** core ZeeSpec — it **specializes** it:

| Core ZeeSpec file | What this overlay adds |
|-------------------|------------------------|
| `templates/_template/CLAUDE.md` | Pre-filled module CLAUDE.md per finance module type |
| `templates/_template/what.md` | Pre-filled with accounting invariants (debit=credit, period close, etc.) |
| `templates/_template/where.md` § 5 | Still stack-specific — overlay does NOT prescribe a stack |
| `checklists/severity-matrix.md` | Overridden by `severity-matrix-finance.md` (FRC-tuned) |
| `checklists/anti-patterns.md` | Extended by `financial-anti-patterns.md` (12-15 more) |
| `workflow/04-r1-r2-parallel-review.md` R2 prompt | Replaced by `R2-financial-reviewer.md` |
| `templates/_template/glossary.md` | Pre-seeded with `finance-glossary.md` ~80 terms |

The stack-agnosticism of core ZeeSpec is **preserved**: this overlay works equally with PHP/Symfony, Java/Spring, Python/Django, Go, Rust, TS/NestJS.

## Status

🧪 **Experimental v0.1.0** — first cut after 5-module pilot in a Mongolian mutual fund system. Not yet validated by an independent fintech team. Use as a starting point; fork freely.

## How to apply this overlay to your project

```bash
# 1. Copy the core ZeeSpec methodology (per /specs/README.md instructions)
cp -r path/to/zeespec-methodology/specs your-project/docs/specs/zeespec

# 2. Copy the finance-accounting overlay
cp -r path/to/zeespec-methodology/specs/overlays/finance-accounting \
      your-project/docs/specs/zeespec-finance

# 3. Tell your AI agent both exist
cat >> your-project/CLAUDE.md <<'EOF'

## Spec methodology (finance-specialized)
This project uses ZeeSpec core + the finance-accounting overlay.
Read `docs/specs/zeespec/workflow/00-START-HERE.md` BEFORE any code that
touches a ZeeSpec module. For finance modules, ALSO read
`docs/specs/zeespec-finance/README.md` and the relevant module template.
EOF

# 4. Initialize your first finance module from an overlay template
MODULE=general-ledger   # or wallet-settlement, kyc-aml
cp -r your-project/docs/specs/zeespec-finance/modules/$MODULE \
      your-project/docs/specs/zeespec/$MODULE

# 5. Replace placeholders + author per core ZeeSpec workflow
cd your-project/docs/specs/zeespec/$MODULE
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/GL/g"   # GL for general-ledger
find . -name '*.bak' -delete
```

## Overlay file inventory

```
overlays/finance-accounting/
├── README.md                                — this file
├── principles/
│   ├── accounting-principles.md             — double-entry + IFRS invariants
│   ├── regulatory-compliance.md             — 7 universal pillars; multi-jurisdiction
│   ├── financial-invariants-catalog.md      — 25-30 reusable INV/HW
│   ├── financial-anti-patterns.md           — 15 finance-specific traps
│   └── severity-matrix-finance.md           — finance-tuned P0/P1
├── modules/
│   ├── general-ledger/                      — 10-file ZeeSpec template (CoA + journal)
│   ├── wallet-settlement/                   — module overview (condensed)
│   └── kyc-aml/                             — module overview (condensed)
├── research/                                — 🆕 v0.2.0 regulator + statute research workflow
│   ├── 00-START-HERE.md                     — research entry point
│   ├── regulator-research-workflow.md       — 6-phase research method
│   ├── source-evaluation.md                 — how to assess regulator sources
│   ├── citation-conventions.md              — how to cite regulator + law in spec
│   ├── R4-regulatory-research-agent.md      — specialized R4 agent prompt
│   ├── other-jurisdictions-cheatsheet.md    — source URLs for 9 jurisdictions
│   └── examples/
│       ├── 01-frc-investment-fund-regulation.md
│       ├── 02-mongolia-aml-law-research.md
│       └── 03-retention-research-cross-jurisdiction.md
├── prompts/
│   └── R2-financial-reviewer.md             — specialized R2 agent prompt
└── glossary/
    └── finance-glossary.md                  — ~120 finance + accounting terms
```

## License + credits

MIT (same as core ZeeSpec). Inherits Zachman framework attribution.

Accounting framework references:
- IFRS Foundation (2024)
- FASB ASC (US GAAP)
- BIS Basel framework (for risk-weighting context)

FRC references:
- Санхүүгийн зохицуулах хорооны журам (Mongolia FRC Regulations)
- Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай Монгол Улсын хууль (Mongolia AML/CFT law)

## Next

→ `principles/accounting-principles.md`
