---
doc: workflow/11-anthropics-plugin-integration/00-START-HERE
type: workflow-entry
phase: anthropic-plugin-integration
version: 1.0.0
status: experimental
last_updated: 2026-05-18
applies_to: teams using anthropics/financial-services plugins alongside ZeeSpec
---

# Anthropic Plugins Integration — Entry Point

> **For teams using anthropics/financial-services plugin library alongside ZeeSpec.** The plugin library provides production-ready AI agents (pitch-agent, gl-reconciler, market-researcher, etc.); ZeeSpec provides the spec methodology. This phase defines how they complement each other.

## What is anthropics/financial-services?

[github.com/anthropics/financial-services](https://github.com/anthropics/financial-services) is an Anthropic-maintained reference implementation of Claude agents, skills, and connectors purpose-built for financial-services workflows.

Two deployment modes:
- **Claude Cowork plugins** — install via Cowork UI; agents available to operators
- **Claude Managed Agents API** — headless deployment for production automation

Coverage (4 verticals):
- **Investment Banking** — pitch-agent, CIMs, teasers, buyer lists, merger models, process letters
- **Equity Research** — market-researcher, earnings-reviewer, initiations, thesis tracking
- **Private Equity** — deal sourcing, diligence checklists, IC memos, portfolio monitoring
- **Wealth Management & Fund Admin** — client reviews, GL reconciliation (gl-reconciler), KYC screening, valuation review

Includes 11 MCP connectors for real-time data (Daloopa, Morningstar, S&P Global, FactSet, Moody's, MT Newswires, Aiera, LSEG, PitchBook, Chronograph, Egnyte).

## ZeeSpec vs Anthropic plugins — orthogonal not competing

| | **anthropics/financial-services** | **ZeeSpec** |
|---|---|---|
| What | Plugin library (agents + skills + connectors) | Methodology (spec format + workflow) |
| Output | Action (deck built / NAV reconciled / KYC screened) | Spec written + verified + maintained |
| Audience | Investment banker / analyst / PE / wealth manager | Engineering team building finance systems |
| When used | Per workflow execution (build a deck) | Per module authoring + lifecycle |
| Lifespan | Per task (minutes-hours) | Per module (months-years) |
| Persistence | Output artifact (PDF, model, memo) | Living spec (versioned in git) |
| Best fit | Fast-path: "use existing tool" | Slow-path: "build durable spec for own system" |

**They are complementary, not competing.**

## Integration patterns (3 main)

### Pattern 1 — Plugin produces artifact; ZeeSpec captures as ADR

When an Anthropic plugin agent produces material decisions (valuation, IC memo, etc.), capture those decisions as ADRs in the relevant ZeeSpec module.

Example:
- pitch-agent builds DCF valuation for Target Co.
- Engineering team building investment-decision module captures the DCF inputs + assumptions as ADR-INVEST-NNN
- INV-INVEST-04 references the ADR for "WACC assumed = 8.5%"

See `01-plugin-output-as-adr.md`.

### Pattern 2 — Anthropic agent dispatch from within ZeeSpec workflow

When ZeeSpec workflow (R4/R5/R6) needs domain expertise that an Anthropic plugin provides, dispatch the plugin agent and treat its output as input to ZeeSpec.

Example:
- R4 regulatory research session for "current EU AMLD6 transposition status by member state"
- Dispatch `market-researcher` or compliance-research-agent (if applicable) for primary read
- Synthesize agent output into R4 citation block

See `02-dispatching-from-zeespec.md`.

### Pattern 3 — ZeeSpec spec drives plugin parameterization

When a ZeeSpec module describes a system that an Anthropic plugin is part of (e.g., GL module uses gl-reconciler plugin), the spec parameterizes the plugin's runtime config.

Example:
- ZeeSpec `general-ledger` module's where.md § 5 specifies "Use gl-reconciler plugin v2.1.0 for monthly reconciliation"
- HW-GL-XX hardwiring constraint: "gl-reconciler plugin runs nightly at 22:00 UTC"
- Configuration repo references the spec entry

See `03-spec-driven-plugin-config.md`.

## When to use this folder

| Scenario | Use this folder? |
|----------|------------------|
| Using anthropics/financial-services plugins + ZeeSpec | ✅ YES |
| Considering anthropics/financial-services adoption | ✅ Read 04 |
| Pure ZeeSpec adoption; no Anthropic plugins | ❌ Skip |
| Pure Anthropic plugin usage; no ZeeSpec | ❌ Skip; use plugin docs |
| Building custom finance plugin | ⚠️ Read 05 for patterns |

## Read order

1. **This file** (orientation)
2. `01-plugin-output-as-adr.md` — capturing plugin outputs as ADRs
3. `02-dispatching-from-zeespec.md` — calling plugins from ZeeSpec workflow
4. `03-spec-driven-plugin-config.md` — ZeeSpec specs that govern plugin runtime
5. `04-installation-coexistence.md` — installing both packages; coexistence

## Quick install (both packages)

For Claude Code:

```bash
# Install Anthropic financial-services plugins
claude plugin marketplace add anthropics/financial-services

# Install specific plugin (per your need)
claude plugin install pitch-agent@claude-for-financial-services
claude plugin install gl-reconciler@claude-for-financial-services
claude plugin install financial-analysis@claude-for-financial-services

# Install ZeeSpec methodology into your project
cd your-project
git clone https://github.com/your-org/zeespec-methodology tmp-zeespec
cp -r tmp-zeespec/specs docs/specs/zeespec
rm -rf tmp-zeespec

# Tell Claude Code about ZeeSpec (in project CLAUDE.md)
cat >> CLAUDE.md <<'EOF'

## Spec methodology

This project uses ZeeSpec + anthropics/financial-services plugins.

For spec-related work: read docs/specs/zeespec/workflow/00-START-HERE.md
For finance domain workflows (deck, NAV, KYC, etc.): use installed plugins

For integration patterns: docs/specs/zeespec/workflow/11-anthropics-plugin-integration/
EOF
```

## When plugin output should be captured as ZeeSpec ADR

Capture plugin output when:

- ✅ Output drives a material engineering decision (architecture, framework, threshold)
- ✅ Output establishes an invariant your code should honor
- ✅ Output requires re-evaluation when conditions change (re-run plugin → update ADR)
- ✅ Auditor will need to see the underlying analysis

Don't capture when:

- ❌ Output is one-time ephemeral (e.g., monthly market report for product team)
- ❌ Output doesn't constrain engineering
- ❌ Output is purely advisory / not actioned

## When ZeeSpec should dispatch a plugin

Dispatch plugin from ZeeSpec workflow when:

- ✅ R4 research needs domain expertise plugin provides
- ✅ R2 review needs specialized inspector questions plugin enumerates
- ✅ Periodic re-validation can be automated via plugin agent
- ✅ Cross-module orchestration benefits from plugin's multi-step workflow

Don't dispatch when:

- ❌ Plugin doesn't match domain (e.g., dispatching pitch-agent for healthcare)
- ❌ Manual review is faster than plugin setup
- ❌ Plugin output is unreliable for your use case

## Pricing + cost considerations

Anthropic plugins run on Claude API. Per-execution cost varies:

| Plugin | Approximate cost per execution |
|--------|---------------------------------|
| pitch-agent (full deck) | $2-10 |
| gl-reconciler (monthly close) | $1-5 |
| market-researcher | $1-3 |
| earnings-reviewer | $0.50-2 |

(Estimates per Reviewer C P1 cost-transparency recommendation; verify against current Claude pricing.)

For Tier B/C ZeeSpec adoption integrating plugins: monthly cost typically $50-300 for moderate use.

## Plugin maintenance considerations

When using Anthropic plugins long-term:

- **Plugin version pinning** — pin to specific version; don't auto-update breaking changes
- **Plugin output changes** — if plugin updated, re-run on existing outputs to detect change (drift between plugin versions = ZeeSpec drift)
- **Plugin deprecation** — Anthropic may deprecate plugins; have migration plan
- **MCP connector availability** — connectors require data provider contracts; ensure budget

## Disclaimer (per Anthropic)

⚠️ **anthropics/financial-services agents produce DRAFT output for professional review.** Not investment advice. Don't bind risk based on agent output alone. Human sign-off required for material decisions.

This applies equally when integrating with ZeeSpec: an ADR captured from plugin output is the team's decision, not the plugin's.

## Cross-references

- [anthropics/financial-services GitHub](https://github.com/anthropics/financial-services)
- `overlays/finance-accounting/` — finance domain reference example
- `workflow/09-adr-lifecycle/` — ADR format for capturing plugin outputs
- `workflow/07-r4-regulatory-research/` — research methodology
- `workflow/10-adoption-guide/04-tooling-integration.md` — agent dispatch infrastructure

## Next

→ `01-plugin-output-as-adr.md` — capture plugin outputs as ADRs
→ `02-dispatching-from-zeespec.md` — dispatch plugins from ZeeSpec workflow
