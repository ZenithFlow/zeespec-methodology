---
doc: extended/workflow/11-anthropics-plugin-integration
type: workflow-integration
phase: anthropic-plugin-integration
version: 2.0.0
status: experimental
last_updated: 2026-06-10
applies_to: teams using anthropics/financial-services plugins alongside ZeeSpec
---

# Anthropic plugins integration

> **For teams using the anthropics/financial-services plugin library alongside ZeeSpec.** The plugin library provides production-ready AI agents (pitch-agent, gl-reconciler, market-researcher, etc.); ZeeSpec provides the spec methodology. This chapter defines how they complement each other: the positioning, three integration patterns, and installation/coexistence.

⚠️ **Maintenance caveat:** this chapter couples to a fast-moving third-party plugin ecosystem. Plugin names, slash commands, versions, and marketplace ids below may drift. Verify against your installed plugins (`claude plugin list`, `claude plugin info <name>`) before relying on any example.

## What is anthropics/financial-services?

[github.com/anthropics/financial-services](https://github.com/anthropics/financial-services) is an Anthropic-maintained reference implementation of Claude agents, skills, and connectors for financial-services workflows. Two deployment modes: **Claude Cowork plugins** (install via Cowork UI) and **Claude Managed Agents API** (headless production automation). Four verticals — Investment Banking (pitch-agent, CIMs, merger models), Equity Research (market-researcher, earnings-reviewer), Private Equity (deal sourcing, IC memos), Wealth Management & Fund Admin (gl-reconciler, KYC screening). Plus 11 MCP connectors for real-time data (Daloopa, Morningstar, S&P Global, FactSet, etc. — connectors require data provider contracts).

## ZeeSpec vs Anthropic plugins — orthogonal not competing

| | **anthropics/financial-services** | **ZeeSpec** |
|---|---|---|
| What | Plugin library (agents + skills + connectors) | Methodology (spec format + workflow) |
| Output | Action (deck built / NAV reconciled / KYC screened) | Spec written + verified + maintained |
| Audience | Banker / analyst / PE / wealth manager | Engineering team building finance systems |
| Lifespan | Per task (minutes-hours) | Per module (months-years) |
| Persistence | Output artifact (PDF, model, memo) | Living spec (versioned in git) |
| Best fit | Fast-path: "use existing tool" | Slow-path: "build durable spec for own system" |

**They are complementary, not competing.** Skip this chapter entirely if you use only one of the two.

## Pattern 1 — plugin output captured as ADR

When a plugin produces a material decision (valuation, recommendation, reconciliation rule), capture it as a retroactive ADR in the owning ZeeSpec module. This is **plugin-driven retroactive ADR** — analogous to drift-driven retroactive ADR per `extended/workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`.

```
plugin executes → output contains material decisions → team reviews + accepts
→ retroactive ADR in owning module → INV/HW entries updated
→ plugin re-run later → diff vs ADR → supersede on material change
```

**Capture when:** output drives a material engineering decision; establishes an invariant code should honor; needs re-evaluation when conditions change; auditor will need the underlying analysis. **Don't capture:** one-time ephemeral output; output that doesn't constrain engineering; purely advisory output.

Workflow:

1. Plugin executes per its normal usage (e.g., `dcf-model` produces valuation + assumptions).
2. Extract material decisions — quantitative assumptions (WACC, growth), method/scope choices, risk identifications. For each, ask: "does engineering code need to respect this?"
3. Identify the owning module (valuation → investment-decision; reconciliation rules → general-ledger; thesis → portfolio-management). No obvious owner → may need a new module.
4. Draft via R6 Mode A (per `extended/workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md`) with modified prompt input: **drift type = plugin-driven**, plugin name + exact version + execution timestamp + output excerpt + target module. Rest of Mode A applies unchanged.
5. Engineering reviews: accept (status → Accepted, cite execution timestamp) or modify (note divergence from plugin output in the Decision section).
6. Update affected INV/HW entries to reference the ADR.
7. On plugin re-run: compare new output to the ADR. Divergence beyond the ADR's materiality threshold → draft superseding ADR, mark old one Superseded, update INV references. This is **plugin output drift detection** — analogous to code drift per `extended/workflow/08-code-drift-management/`.

Worked snippet (INV entry referencing a plugin-driven ADR):

```markdown
### INV-PORTFOLIO-08 — Target Co WACC = 8.5% (per ADR-PORTFOLIO-014)
Status: ✅ IMPL (configured)
Source: portfolio-config.yaml:45
ADR: ADR-PORTFOLIO-014

Engineering: WACC value referenced by DCF computation code; never hardcoded.
Re-evaluate: quarterly per ADR re-review schedule.
```

Worked example in one line: Q1 2026 `dcf-model` run for Target Co → WACC 8.5%, terminal growth 3.0% → ADR-PORTFOLIO-014 (Accepted, with alternatives + re-review triggers); Q2 re-run → WACC 9.2%, beyond the 5% EV materiality threshold → ADR-PORTFOLIO-018 supersedes 014; INV-PORTFOLIO-08 updated.

Anti-patterns:

| Anti-pattern | Fix |
|---|---|
| Capture every plugin output as ADR (500 ADRs in 6 months) | Only material decisions that constrain engineering |
| Auto-supersede on every re-run (quarterly ADR churn) | Supersede only on material change per the ADR's re-review triggers |
| ADR is verbatim plugin output, no team rationale | ADR captures the TEAM's decision to adopt; plugin reasoning is input |
| ADR not tied to any INV/HW | Every plugin-output ADR triggers an INV update; no engineering consequence → maybe no ADR needed |

## Pattern 2 — plugin-as-subroutine dispatch

When a ZeeSpec workflow phase needs domain expertise a plugin provides, dispatch the plugin as a subroutine and treat its output as input to the methodology.

```
ZeeSpec phase needs specialized capability → dispatch plugin
→ plugin returns artifact → workflow consumes (R4 citation block;
  R2 review questions; R5 re-audit) → spec updates per normal workflow
```

| ZeeSpec phase | Dispatch variant | Example |
|---|---|---|
| R4 research (workflow/07) | 2a — research data | market-researcher for EU payments competitive landscape → triangulation source |
| R2 review (workflow/04) | 2b — compliance check | gl-reconciler against test data → reconciliation gaps → INV/HW update suggestions |
| R5 drift (workflow/08) | 2c — re-audit | dcf-model recomputes; plugin matches spec → production bug (T3-bug, spawn chip); matches production → spec stale (T3-design, write ADR) |
| Module authoring (workflow/01) | 2d — scaffolding | 3-statement-model extracts entity list → starting point for what.md § 1; manually validate vs production code |
| R6 ADR curation | (none) | Methodology-internal; no plugin |

**Source-tier rule:** plugin output is always a **Tier 2-3 source** per `extended/workflow/07-r4-regulatory-research/02-source-evaluation.md` — never Tier 1. Plugins can hallucinate; auditors want the underlying authority. For compliance-binding facts, always cite the regulator publication the plugin pulled from.

Worked snippet (R4 research log integration):

```markdown
### Tier 2 source: market-researcher plugin output
**Plugin:** market-researcher v1.4
**Execution timestamp:** 2026-05-18T14:30Z
**Inputs:** [params used]

**Cross-check:** plugin findings align with Tier 1 source on [aspects];
diverge on [aspects]. For binding compliance facts, Tier 1 prevails.
```

Dispatch mechanics: from Claude Code, dispatch as a subagent within the workflow session; for periodic runs (e.g., quarterly market research), schedule via CI cron and chain an R4 follow-up dispatch to integrate findings — see `extended/workflow/10-adoption-guide/04-tooling-integration.md` for dispatch infrastructure and cost tracking. Document each module's plugin integrations in `where.md` § 5: version pinned, usage, dispatch trigger, output integration, cost, fallback if unavailable.

Selection criteria before dispatching: domain match (don't use pitch-agent for healthcare); consumable output structure; cost within budget; accuracy track record (test on known cases first); source-data currency; compliance certifications (SOC 2, data residency).

Anti-patterns:

| Anti-pattern | Fix |
|---|---|
| Plugin output cited as Tier 1 for compliance-binding fact | Tier 2-3 always; cite underlying authority |
| Plugin dispatched for methodology tasks (e.g., ADR drafting) | R4/R5/R6 own methodology work; plugins own domain workflows |
| No budget tracking → end-of-month cost shock | Per-project budgets + overspend alerts per workflow/10/04 |
| Output not version-pinned; irreproducible | Capture plugin version + timestamp in every citation; pin for compliance workflows |
| Plugin substitutes for primary research | Supplement only; always do the primary read of Tier 1 sources |

## Pattern 3 — spec governs plugin runtime config

When a module describes a system that uses a plugin as a runtime component (e.g., GL module uses gl-reconciler for monthly close), the spec parameterizes the plugin's runtime config. **Spec is the source of truth; config is derived.**

```
module's where.md § 5 names plugin + pins version
→ INV/HW define runtime constraints (schedule, thresholds, retention)
→ plugin config file derived from spec (CI regenerates; DO NOT EDIT DIRECTLY)
→ plugin executes per derived config → output captured per Pattern 1 or consumed downstream
```

**Apply when:** plugin is part of the module's runtime (not an external tool); config drives engineering behavior; version pinning matters for reproducibility. **Don't apply:** one-off/ad-hoc dispatch; trivially defaulted config.

Document in `where.md` § 5: plugin name, pinned version, dispatch trigger, inputs/outputs (mapped to S-* storage roles), failure mode + manual fallback, config source, cost. Then a hardwiring entry:

```markdown
### HW-GL-XX — gl-reconciler plugin governs monthly close reconciliation
Status: ✅ IMPL
Source: where.md § 5.X; gl-reconciler-config.yaml

Engineering MUST NOT modify gl-reconciler-config.yaml without spec
update + R6 ADR review. Plugin version pinned at v2.1.0. Upgrade requires:
re-run against last month's data → compare output → if divergence >
materiality: ADR + spec update.
```

Config derivation: the generated config file (e.g., `gl-reconciler-config.yaml`) carries a "generated from spec; do not edit directly" header, and every value cites its spec entry — schedule per HW-GL-XX, materiality threshold per INV-GL-XX, break-aging thresholds per HW-FIN-27, retention years per HW-GL-09. A CI job regenerates config from spec.

Two drift surfaces:

- **Spec ↔ config drift** — extend the R5 drift scan: `diff <(extract-config-from-spec gl-reconciler) gl-reconciler-config.yaml`. Divergence = Type 3-design drift per `extended/workflow/08-code-drift-management/` (`extended/workflow/08-code-drift-management/02-drift-categorization.md`); update spec to match or revert config.
- **Plugin version drift** — add plugin versions to the R4 amendment-style watch list (analogous to `extended/workflow/07-r4-regulatory-research/09-amendment-tracking.md`). New version → review changelog → test against same inputs → equivalent output = minor spec version bump (ADR optional); divergent = ADR mandatory + spec re-author of affected sections → pin new version or roll back.

Anti-patterns:

| Anti-pattern | Fix |
|---|---|
| Operator edits config; spec doesn't reflect | R5 spec ↔ config check; alert on divergence |
| CI auto-installs latest plugin; spec pins older | Pin version in CI/deployment; spec update before bump |
| dev/staging/prod configs with different sources of truth | Spec describes per-environment if needed; config derived per environment |

## Installation + coexistence

Install order: 1) Anthropic plugins first (more battle-tested), 2) ZeeSpec methodology, 3) configure CLAUDE.md for both, 4) test, 5) train team.

```bash
claude plugin marketplace add anthropics/financial-services
claude plugin install gl-reconciler@claude-for-financial-services   # per team needs
claude plugin list                                                  # verify

git clone https://github.com/your-org/zeespec-methodology tmp-zeespec
cp -r tmp-zeespec/specs docs/specs/zeespec && rm -rf tmp-zeespec
# CLAUDE.md: spec work → docs/specs/zeespec/core/workflow/00-START-HERE.md;
# domain workflows (deck/NAV/KYC) → installed plugins; integration → this chapter
```

Test all three: a plugin invocation, a ZeeSpec module read, and a Pattern 2 dispatch. Track executions in `_meta/plugin-execution-log.md` (date, plugin, version, module, operator, cost, output location). Store derived configs in `plugin-configs/` per Pattern 3.

| Scenario | Choice |
|---|---|
| Engineering team building a finance system; plugins accelerate specific workflows; multi-year audit trail needed | **BOTH** (the sweet spot) |
| Non-finance team; plugins distract from methodology discipline; cost/re-validation overhead too high | ZeeSpec alone |
| Non-engineering finance team; "build a deck"-style workflows; no durable code | Plugins alone |

Common coexistence issues:

| Issue | Fix |
|---|---|
| Plugin can't see ZeeSpec context; output conflicts with invariants | Paste relevant spec excerpts/invariants into the plugin invocation |
| Spec says nightly cron; team actually triggers manually | R5 drift catches; resolve per drift playbook (T3-bug or T3-design) |
| Plugin output overlaps spec content (e.g., investment thesis) | Spec = framework (durable structure); plugin output = instance (point-in-time) |
| Slash command collision | Use plugin-namespaced commands (`/financial-analysis:audit-xls`); ZeeSpec ships mostly file-based |
| Cost compounding (plugins + methodology agents) | Separate budgets; monthly review per workflow/10/04 § "Cost tracking" |

Upgrades: plugins via `claude plugin update <name> --version vX.Y` then re-test affected workflows (divergent output → ADR per Pattern 1); methodology via git pull from upstream after diff review.

## Cost considerations

Per-execution estimates (verify against current Claude pricing): pitch-agent full deck $2-10; gl-reconciler $1-5; market-researcher $1-3; earnings-reviewer $0.50-2. A 5-module project dispatching per Pattern 2: ~$25-80 per quarter, ~$100-320 annually — negligible vs engineering time saved. Tier B/C adoption with moderate plugin use: ~$50-300/month.

Long-term maintenance: pin plugin versions (no auto-update); re-run updated plugins on existing outputs to detect output drift; have a migration plan for plugin deprecation; budget for MCP connector data contracts.

## Disclaimer (per Anthropic)

⚠️ **anthropics/financial-services agents produce DRAFT output for professional review.** Not investment advice. Human sign-off required for material decisions. An ADR captured from plugin output is the team's decision, not the plugin's.

## Cross-references

- [anthropics/financial-services GitHub](https://github.com/anthropics/financial-services)
- `examples/overlays/finance-accounting/` — finance domain reference example
- `extended/workflow/09-adr-lifecycle/` — ADR format + R6 agent for Pattern 1
- `extended/workflow/07-r4-regulatory-research/` — source tiers + amendment tracking
- `extended/workflow/08-code-drift-management/` — drift detection (extended to spec ↔ config)
- `extended/workflow/10-adoption-guide/04-tooling-integration.md` — dispatch infrastructure + cost tracking

## Next

→ `extended/workflow/12-agentic-role-replacement/00-START-HERE.md` — agentic role replacement
→ Or back to `core/workflow/00-START-HERE.md` for per-module workflow
