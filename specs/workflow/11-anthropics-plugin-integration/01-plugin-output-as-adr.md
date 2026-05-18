---
doc: workflow/11-anthropics-plugin-integration/01-plugin-output-as-adr
type: workflow-integration
phase: anthropic-plugin-integration
version: 1.0.0
status: experimental
last_updated: 2026-05-18
---

# Pattern 1 — Plugin Output as ADR

> When an Anthropic plugin agent produces a material decision (valuation, recommendation, analysis), capture that decision as a ZeeSpec ADR. This pattern bridges plugin-action and methodology-capture.

## The pattern

```
Anthropic plugin executes
  (e.g., pitch-agent builds DCF; gl-reconciler closes month)
        ↓
Output includes material decisions
  (e.g., WACC = 8.5%; provision = 5%)
        ↓
Engineering team reviews + accepts
        ↓
Capture as retroactive ADR in relevant ZeeSpec module
  (ADR captures: what plugin recommended; why team accepted;
   alternatives considered; engineering consequences)
        ↓
Update INV-MOD-NN that depends on this decision
        ↓
Plugin re-run later → new output → diff → potentially supersede ADR
```

This is **plugin-driven retroactive ADR** — analogous to drift-driven retroactive ADR per `workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`.

## When to apply

Apply when plugin output drives engineering decisions:

| Plugin | Output → ADR for |
|--------|-------------------|
| pitch-agent (DCF) | WACC choice, growth assumptions, terminal multiple — all become assumptions code may reference |
| gl-reconciler | Reconciliation rule choices (materiality threshold, classification mapping) |
| market-researcher | Competitive landscape findings → product roadmap decisions |
| earnings-reviewer | Model update decisions → spec parameter changes |
| dcf-model | Cost-of-capital assumption → INV-INVEST-NN for portfolio valuation |
| comps-analysis | Peer-set selection → INV-VALUE-NN for benchmark comparison |
| 3-statement-model | Period-aggregation rules → HW-ACCOUNTING-NN |
| ic-memo (PE) | Investment thesis → ADR-PORTFOLIO-NNN |

Don't apply when output is ephemeral (one-time market commentary; not action-driving).

## Workflow steps

### Step 1 — Plugin executes

Plugin runs per its normal usage. Example: `pitch-agent` produces DCF model + valuation deck for Target Co.

Output: PDF deck + Excel model + analysis memo.

### Step 2 — Identify material decisions in output

Read plugin output. Extract material decisions:

- **Quantitative assumptions** (WACC, growth rate, multiples)
- **Method choices** (DCF vs comps vs LBO; weighting between)
- **Scope choices** (peer set; geographic scope; time horizon)
- **Risk factor identifications**
- **Recommendations**

For each, ask: "Does engineering code need to respect this?" If yes → ADR candidate.

### Step 3 — Identify which ZeeSpec module owns the decision

For finance plugins, typical mapping:

| Plugin output type | Owner module |
|--------------------|--------------|
| Valuation method + assumptions | investment-decision OR portfolio-valuation module |
| Reconciliation rules | general-ledger OR accounting module |
| Investment thesis | portfolio-management module |
| Competitive landscape | strategic-planning module |
| Risk assessment | risk-monitoring module |

If no obvious owner module exists → may need to create one (or document in cross-module location).

### Step 4 — Draft ADR using R6 agent (or manually)

Use R6 ADR Curator Agent (per `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md`) in Mode A (draft retroactive). Customize prompt:

```markdown
You are R6 — ADR curator. Drafting retroactive ADR from Anthropic plugin output.

**Plugin used:** pitch-agent v2.3
**Execution date:** 2026-05-18
**Execution context:** Building Series-A pitch for Target Co.

**Plugin output excerpt (decisions to capture):**
[paste relevant output sections — WACC = 8.5%, growth = 12%, terminal = 3%, etc.]

**Target module:** investment-decision
**Module prefix:** INVEST

**Task:**
1. Find next ADR number in investment-decision module
2. Draft ADR-INVEST-NNN with:
   - Status: Proposed
   - Context: plugin execution + target situation
   - Decision: each material assumption
   - Alternatives: what plugin considered + rejected (read agent's reasoning)
   - Consequences: how this assumption propagates to engineering
   - Cited source: plugin name + version + execution timestamp
3. Identify INV-INVEST-NN affected
4. Flag for team review
```

### Step 5 — Engineering review + accept/modify

Team reviews drafted ADR:

- Does engineering agree with plugin output?
- Are assumptions realistic for engineering enforcement?
- Are there constraints plugin didn't consider?

If accepted: ADR status → Accepted; cite plugin execution timestamp.

If modified: capture engineering modification in ADR Decision section; note divergence from plugin output.

### Step 6 — Update INV/HW entries

For each invariant affected by the ADR:

```markdown
### INV-INVEST-04 — Target portfolio WACC = 8.5% per ADR-INVEST-NNN
Status: ✅ IMPL (configured in portfolio-config.yaml)
Source: portfolio-config.yaml line 23
ADR: ADR-INVEST-NNN

Engineering: WACC stored as config; all DCF computations reference this value.
Re-evaluate: quarterly per portfolio-config-review schedule.
```

### Step 7 — Plugin re-run + diff

When plugin runs again (e.g., quarterly re-evaluation of investment thesis):

1. Run plugin (same inputs OR updated inputs)
2. Compare new output to previous ADR
3. If divergence > materiality threshold:
   - Draft new ADR (retroactive) capturing the change
   - Mark old ADR Superseded
   - Update INV references

This is the **plugin output drift detection** workflow — analogous to code drift detection per `workflow/08-code-drift-management/`.

## Worked example

**Scenario:** PE team using `dcf-model` plugin (anthropics/financial-services) for portfolio valuations. ZeeSpec module: `portfolio-valuation`.

### Plugin execution

Quarter 1 2026: PE associate runs `dcf-model` for Target Co.

Output excerpt:
> DCF Valuation: Target Co.
> Enterprise Value: $850M
> Equity Value: $720M
>
> Key Assumptions:
> - WACC: 8.5%
> - Terminal growth: 3.0%
> - Revenue growth: 12% Year 1-3; tapering to 5% by Year 5
> - EBITDA margin: 22% steady-state
> - Discount period: 5 years explicit + terminal

### Identifying decisions

Material decisions:
- WACC 8.5% (vs industry 7-10% range)
- Terminal growth 3% (vs GDP 2% or sector growth 4%)
- 5-year explicit discount period (vs 3-year or 10-year alternatives)

### Drafting ADR

ADR-PORTFOLIO-014 — Target Co valuation methodology (Q1 2026)

```markdown
# ADR-PORTFOLIO-014 — Target Co valuation methodology

**Status:** Proposed (2026-04-15)
**Plugin source:** anthropics/financial-services pitch-agent + dcf-model
**Execution date:** 2026-04-15
**Plugin version:** v2.3

## Context

Quarterly portfolio re-valuation requires DCF for non-public investments.
Target Co requires methodology decision for input parameters.

## Decision

Adopt DCF parameters per dcf-model plugin output (2026-04-15 execution):

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| WACC | 8.5% | Plugin computed from peer cost-of-capital; matches sector median |
| Terminal growth | 3.0% | Plugin rationale: GDP + sector premium |
| Revenue growth (Y1-3) | 12% | Plugin: based on TAM analysis + competitive position |
| Revenue growth (Y5+) | 5% | Plugin: industry maturity assumption |
| EBITDA margin | 22% | Plugin: peer benchmark; sustainable level |
| Explicit period | 5 years | Plugin default; engineering accepted |

## Alternatives considered

### Alt 1: Manual DCF (no plugin)
Rejected: less consistent; harder to re-evaluate quarterly.

### Alt 2: Comps-only (no DCF)
Rejected: plugin output shows DCF + comps converge; DCF more defensible for committee.

### Alt 3: Plugin defaults without modification
Adopted (this ADR) for Q1.

## Consequences

### Positive
- Reproducible valuation (re-run plugin to verify)
- Plugin captures market context (peer WACC; growth assumptions)
- Engineering: portfolio-config.yaml WACC = 0.085 standardized

### Negative
- Quarterly re-run cost (~$5/execution)
- Plugin assumption review required before commit
- IC must understand plugin methodology to accept

### Engineering impact
- portfolio-config.yaml: add target-co section with assumptions
- INV-PORTFOLIO-08: WACC = 8.5% for target-co (refers to this ADR)
- DCF computation in code uses config values (no hardcoding)

## Re-review

**Next plugin execution:** 2026-07-15 (quarterly)
**Trigger conditions for early re-review:**
- Material change in target company's financials (>10% revenue shift)
- Macro change (Fed rate move >100bp)
- Sector M&A activity affecting comps

If re-execution produces > 5% divergence in EV: draft superseding ADR.
```

### INV update

```markdown
### INV-PORTFOLIO-08 — Target Co WACC = 8.5% (per ADR-PORTFOLIO-014)
Status: ✅ IMPL (configured)
Source: portfolio-config.yaml:45
ADR: ADR-PORTFOLIO-014

Engineering: WACC value referenced by DCF computation code; never hardcoded.
Re-evaluate: quarterly per ADR re-review schedule.
```

### Drift detection (Q2)

July 2026: re-run plugin.

Output: WACC = 9.2% (rate rises; sector cost-of-capital up).

> Divergence: 8.5% → 9.2% = +70bp; > 5% materiality threshold.

Draft superseder ADR: ADR-PORTFOLIO-018 — Target Co Q2 2026 valuation update.

Mark ADR-PORTFOLIO-014 Superseded. Update INV-PORTFOLIO-08 to reference 018.

## R6 agent integration

R6 Mode A (draft retroactive ADR) per `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` works for plugin outputs:

Just modify the prompt input:

```markdown
**Drift type:** plugin-driven (not code-drift)
**Plugin execution context:** [output summary]
**Plugin version:** [exact version]
**Material decisions extracted:** [list]
```

Rest of R6 Mode A applies unchanged.

## Anti-patterns

### Anti-pattern 1: Capture every plugin output as ADR

**Symptom:** 500 ADRs in 6 months; one per plugin execution.

**Fix:** Only material decisions (constrain engineering). Ephemeral outputs aren't ADRs.

### Anti-pattern 2: Auto-supersede on every plugin re-run

**Symptom:** Plugin runs quarterly; ADR superseded every quarter; ADR table churn.

**Fix:** Only supersede on material change (per ADR's defined re-review trigger conditions).

### Anti-pattern 3: ADR captures plugin output verbatim without engineering judgment

**Symptom:** ADR is copy-paste of plugin output. No team rationale; no alternatives evaluation.

**Fix:** ADR captures the TEAM'S decision to adopt plugin output (including review + acceptance). Plugin reasoning is input, not the ADR itself.

### Anti-pattern 4: Plugin output ADRs not tied to INV/HW

**Symptom:** ADR exists but no invariant/hardwiring references it; code doesn't enforce plugin assumptions.

**Fix:** Every plugin-output ADR triggers INV update. If no engineering consequence: maybe didn't need ADR.

## Cross-references

- `00-START-HERE.md` — integration overview
- `02-dispatching-from-zeespec.md` — Pattern 2 (ZeeSpec dispatches plugin)
- `workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md` — analogous pattern for code drift
- `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md` — agent for drafting

## Next

→ `02-dispatching-from-zeespec.md` — Pattern 2
→ `03-spec-driven-plugin-config.md` — Pattern 3
