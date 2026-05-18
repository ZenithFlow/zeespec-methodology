---
doc: workflow/11-anthropics-plugin-integration/02-dispatching-from-zeespec
type: workflow-integration
phase: anthropic-plugin-integration
version: 1.0.0
status: experimental
last_updated: 2026-05-18
---

# Pattern 2 — Dispatching Anthropic Plugins from ZeeSpec Workflow

> When ZeeSpec workflow phase (R4 research, R2 review, R5 drift) needs specialized domain expertise that an Anthropic plugin provides, dispatch the plugin as a subroutine. Plugin output feeds ZeeSpec.

## The pattern

```
ZeeSpec workflow phase
  (e.g., R4 research session for "current EU AMLD6 status")
        ↓
Methodology needs specialized capability
  (e.g., regulator-research expertise; market-data access)
        ↓
Dispatch Anthropic plugin
  (e.g., market-researcher; competitive-analysis)
        ↓
Plugin returns artifact
  (research note; comparison table; analysis)
        ↓
ZeeSpec workflow consumes
  (R4 incorporates findings into citation block;
   R2 incorporates into review questions)
        ↓
Spec updates per normal workflow
```

This is **plugin-as-subroutine** for ZeeSpec workflow.

## When to apply

| ZeeSpec phase | Plugin to consider |
|---------------|--------------------|
| R4 research (workflow/07) | market-researcher, equity-research/sector, financial-analysis/competitive-analysis |
| R2 compliance review (workflow/04) | gl-reconciler (for reconciliation invariants), pitch-agent/audit-xls (for financial-statement reviews) |
| R5 drift detection (workflow/08) | financial-analysis/audit-xls (drift in financial models) |
| R6 ADR curation (workflow/09) | (typically no plugin; R6 is methodology-internal) |
| Per-module authoring | financial-analysis/3-statement-model (for GL module) |

## Dispatch patterns

### Pattern 2a — R4 dispatches plugin for research data

R4 workflow needs market data / competitive landscape / sector overview that's hard to assemble manually.

Example:
- R4 question: "What's the competitive landscape for our payments product in EU?"
- Dispatch `market-researcher` plugin with parameters
- Plugin returns competitor table + market sizing + trend analysis
- R4 incorporates into citation block; treats as triangulation source (Tier 2-3)

Important: plugin output is **Tier 2-3 source** per `workflow/07-r4-regulatory-research/02-source-evaluation.md`, not Tier 1. Always cross-check against primary statute / regulator publication for compliance-binding facts.

### Pattern 2b — R2 dispatches plugin for compliance check

R2 compliance review uses plugin to perform standardized audit:

Example:
- R2 reviewing finance module's reconciliation logic
- Dispatch `gl-reconciler` against test data
- Plugin reports: reconciliation rules, edge cases, classification accuracy
- R2 incorporates findings; suggests INV/HW updates if plugin uncovers gaps

### Pattern 2c — R5 drift uses plugin for re-audit

R5 detected behavioral drift in financial model:

Example:
- R5 finding: "DCF computation diverged from spec"
- Dispatch `dcf-model` plugin to recompute
- Compare plugin output to actual production output
- If plugin matches spec: production code is buggy (T3-bug); spawn chip
- If plugin matches production: spec is stale (T3-design); write ADR

### Pattern 2d — Authoring uses plugin for model scaffolding

Per-module authoring (workflow/01) uses plugin for skeleton:

Example:
- Authoring `general-ledger` module's `what.md`
- Dispatch `financial-analysis/3-statement-model` to extract canonical entity list
- Use plugin output as starting point for what.md § 1 Entities
- Manually validate against actual production code

## Dispatch mechanics

### From Claude Code

Within a ZeeSpec workflow session, dispatch plugin agent:

```javascript
// Inside R4 research session for module wallet-settlement
Agent({
  subagent_type: "general-purpose",
  description: "Dispatch market-researcher for payments competitive landscape",
  prompt: `Use the market-researcher plugin to produce a competitive landscape
           analysis for European payment-service providers.

           Focus areas:
           - Top 10 EU payment providers by transaction volume
           - Regulatory positioning (e-money license vs payment institution)
           - Customer protection differentiators
           - Pricing model comparison

           Return findings in markdown with citations.`
})
```

Output integrated into R4 research log under "Triangulation source (Tier 2)".

### From CI / scheduled

For periodic plugin dispatch (e.g., quarterly market-researcher run):

```yaml
# .github/workflows/zeespec-cron.yml
on:
  schedule:
    - cron: '0 6 1 */3 *'  # Quarterly — 1st of month, 6am UTC

jobs:
  quarterly-market-research:
    runs-on: ubuntu-latest
    steps:
      - name: Dispatch market-researcher for portfolio companies
        run: |
          # Pseudo-code; adapt to your AI dispatch infrastructure
          claude-agent dispatch \
            --plugin market-researcher \
            --params "scope=portfolio-companies; depth=quarterly-update" \
            --output quarterly-research.md
          # Then dispatch R4 follow-up to integrate findings into spec
          claude-agent dispatch \
            --prompt-file docs/specs/zeespec/workflow/07-r4-regulatory-research/04-R4-agent-prompt.md \
            --params "input-file=quarterly-research.md; module=portfolio-management"
```

### Cost-aware dispatch

Per `workflow/10-adoption-guide/04-tooling-integration.md` § "Cost tracking":

Plugins cost more per execution than ZeeSpec methodology-internal agents. Plan dispatch frequency:

| Use case | Frequency | Cost / quarter |
|----------|-----------|----------------|
| R4 research (new topic) | 1-5 per quarter | $5-25 |
| R4 re-validation (scheduled) | 0-2 per quarter | $0-10 |
| R2 review (per module) | 1 per module per quarter | $5-15 |
| R5 drift re-audit | When triggered (rare) | $0-10 |
| Periodic plugin run (market data) | Quarterly | $5-20 |
| **Total Quarter 5-module project** | | **~$25-80** |

Annual: ~$100-320 per 5-module project. Negligible vs engineering time saved.

## Output integration

Plugin output needs structured integration. Two patterns:

### Integration pattern A — Append to R4 research log

Plugin output appended as "Triangulation source" in the research log:

```markdown
# R4 Research — Module Y, YYYY-MM-DD

## Phase 3 — Primary read
[Tier 1 source findings]

## Phase 4 — Triangulation

### Tier 2 source: market-researcher plugin output
**Plugin:** market-researcher v1.4
**Execution timestamp:** 2026-05-18T14:30Z
**Inputs:** [params used]

**Excerpt:**
[paste relevant plugin output]

**Cross-check:** Plugin findings align with Tier 1 source on [aspects];
diverge on [aspects]. For binding compliance facts, Tier 1 prevails.

[continue Phase 5+ as normal]
```

### Integration pattern B — Plugin-as-input for ADR drafting

Plugin output feeds R6 ADR drafting (per `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` Mode A):

```markdown
# R6 retroactive ADR — plugin-driven

**Plugin input:** [plugin name + version + output excerpt]
**Module:** [target module]
**Trigger:** [why we're capturing as ADR]

[R6 produces standard ADR; cites plugin as decision basis]
```

## Anti-patterns

### Anti-pattern 1: Plugin output treated as Tier 1 source

**Symptom:** R4 citation block cites plugin output for compliance-binding fact.

**Why bad:** Plugin can hallucinate; auditor wants underlying authority.

**Fix:** Plugin output is Tier 2-3 always. For compliance-binding facts, always cite the underlying regulator publication that the plugin pulled from.

### Anti-pattern 2: Dispatch plugin for tasks methodology handles

**Symptom:** Dispatching pitch-agent for ADR drafting (which R6 already does).

**Why bad:** Wrong tool; plugin doesn't understand methodology context.

**Fix:** Use methodology-internal agents (R4/R5/R6) for methodology tasks. Plugins for domain workflows.

### Anti-pattern 3: Plugin dispatched without budget tracking

**Symptom:** End-of-month cost shock; team disables plugin usage.

**Fix:** Track plugin dispatch costs per project; budget upfront; alert on overspend (per `workflow/10-adoption-guide/04-tooling-integration.md` § "Cost tracking").

### Anti-pattern 4: Plugin output not version-pinned

**Symptom:** Same plugin re-run later produces different output; no way to reproduce original.

**Fix:** Always capture plugin version + execution timestamp in citation. Pin plugin version for compliance-relevant workflows.

### Anti-pattern 5: Plugin used as substitute for primary research

**Symptom:** R4 dispatches plugin instead of reading the actual statute.

**Why bad:** Plugin summary may miss nuances; legal terms are precise.

**Fix:** Plugin is supplement, not replacement. Always do primary read for Tier 1 sources.

## Plugin selection criteria

Before dispatching a plugin:

1. **Does it match your domain?** (don't use pitch-agent for healthcare)
2. **Is its output structure consumable?** (markdown / JSON / specific format)
3. **What's the cost per execution?** (within budget?)
4. **What's its accuracy track record?** (test on known cases first)
5. **Is its source data current?** (last update; refresh cadence)
6. **Does it have any compliance certifications?** (SOC 2; data residency)

For each ZeeSpec module that integrates plugins, document in `where.md` § 5:

```markdown
### 5.X Plugin integrations

**market-researcher (anthropics/financial-services):**
- Version pinned: v1.4
- Usage: quarterly market-overview for portfolio-management module
- Dispatch: cron job (Q-start + 1 week)
- Output integration: appended to R4 research log
- Cost: ~$20 per execution; ~$80/year
- Fallback if plugin unavailable: manual research

**dcf-model (anthropics/financial-services):**
- Version pinned: v2.3
- Usage: quarterly portfolio re-valuation
- Dispatch: per portfolio-valuation cycle
- Output captured as ADR (per pattern 1)
```

## Cross-references

- `00-START-HERE.md` — integration overview
- `01-plugin-output-as-adr.md` — Pattern 1 (capture plugin output)
- `03-spec-driven-plugin-config.md` — Pattern 3 (spec governs plugin)
- `workflow/07-r4-regulatory-research/02-source-evaluation.md` — Tier hierarchy for plugin output
- `workflow/10-adoption-guide/04-tooling-integration.md` — agent dispatch infrastructure

## Next

→ `03-spec-driven-plugin-config.md` — Pattern 3
→ `04-installation-coexistence.md` — coexistence
