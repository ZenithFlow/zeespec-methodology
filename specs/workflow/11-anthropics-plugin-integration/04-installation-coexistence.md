---
doc: workflow/11-anthropics-plugin-integration/04-installation-coexistence
type: workflow-integration
phase: anthropic-plugin-integration
version: 1.0.0
status: experimental
last_updated: 2026-05-18
---

# Installation + Coexistence (anthropics/financial-services + ZeeSpec)

> **How to install + run both packages without conflict.** Practical setup instructions; common coexistence issues; team workflow integration.

## Install order

Recommended:

1. **Install Anthropic plugins FIRST** (if you'll use them) — they're more battle-tested
2. **Install ZeeSpec methodology SECOND** — methodology references plugin patterns
3. **Configure CLAUDE.md** for both
4. **Test both** with simple workflows
5. **Train team** on combined usage

## Step-by-step installation

### Step 1 — Install Anthropic plugins (Claude Code)

```bash
# Add the marketplace
claude plugin marketplace add anthropics/financial-services

# Install based on team needs:
# Investment banking team
claude plugin install pitch-agent@claude-for-financial-services
claude plugin install investment-banking@claude-for-financial-services

# Equity research team
claude plugin install equity-research@claude-for-financial-services

# Private equity team
claude plugin install private-equity@claude-for-financial-services

# Fund admin / wealth team
claude plugin install gl-reconciler@claude-for-financial-services
claude plugin install financial-analysis@claude-for-financial-services
```

Verify installation:

```bash
claude plugin list
# Should show installed plugins
```

### Step 2 — Install ZeeSpec methodology

```bash
cd your-project

# Clone the methodology
git clone https://github.com/your-org/zeespec-methodology tmp-zeespec
cp -r tmp-zeespec/specs docs/specs/zeespec
rm -rf tmp-zeespec

# Verify
ls docs/specs/zeespec/
# Should show: README.md, METHODOLOGY.md, PORTING-GUIDE.md,
#              checklists/, templates/, workflow/, overlays/
```

### Step 3 — Configure project CLAUDE.md

```bash
cat >> CLAUDE.md <<'EOF'

## Methodology + tooling stack

This project uses two complementary AI tooling packages:

### ZeeSpec (methodology)
- Location: `docs/specs/zeespec/`
- Read: `docs/specs/zeespec/workflow/00-START-HERE.md` BEFORE generating code in any ZeeSpec-codified module
- Per-module entry: `docs/specs/zeespec/<module>/CLAUDE.md`

### anthropics/financial-services plugins (workflows)
- Installed plugins: pitch-agent, gl-reconciler, financial-analysis, market-researcher (per team needs)
- Usage: invoke per slash commands (`/pitch-deck`, `/gl-recon`, etc.)
- For specifics: `claude plugin info <plugin-name>`

### Integration patterns
- See `docs/specs/zeespec/workflow/11-anthropics-plugin-integration/`
- Plugin outputs that drive material decisions → capture as ADR (Pattern 1)
- ZeeSpec phases can dispatch plugins as subroutines (Pattern 2)
- ZeeSpec specs can govern plugin runtime config (Pattern 3)

### When to use which
- Building a deck / NAV / KYC / etc. → use Anthropic plugin
- Authoring / verifying / maintaining a spec → use ZeeSpec methodology
- Both: per workflow/11 integration patterns
EOF
```

### Step 4 — Test combined workflow

Run a small test:

1. **Plugin test:** invoke a plugin (e.g., `/comps` for comparable companies)
2. **ZeeSpec test:** read a Tier 0 Lite module + cite invariants
3. **Integration test:** dispatch plugin from ZeeSpec workflow per Pattern 2

If all three work: setup complete.

## Folder layout (your project)

After installation, your project should look like:

```
your-project/
├── CLAUDE.md                    # configured per Step 3
├── docs/
│   └── specs/
│       └── zeespec/             # ZeeSpec methodology
│           ├── README.md
│           ├── METHODOLOGY.md
│           ├── PORTING-GUIDE.md
│           ├── checklists/
│           ├── templates/
│           ├── workflow/
│           │   ├── 00-START-HERE.md ... 11-anthropics-plugin-integration/
│           └── overlays/
│               └── finance-accounting/
├── docs/
│   └── modules/                 # your project's ZeeSpec modules
│       ├── wallet/
│       │   ├── CLAUDE.md
│       │   ├── what.md
│       │   ├── how.md
│       │   ├── ... (10 files)
│       │   └── adr/             # ADRs per workflow/09 Option B
│       │       ├── ADR-WAL-001.md
│       │       ├── ADR-WAL-002.md
│       │       └── ...
│       └── accounting/
│           └── ...
├── plugin-configs/              # per workflow/11/03 Pattern 3
│   ├── gl-reconciler-config.yaml
│   ├── pitch-agent-config.yaml
│   └── ...
└── _meta/                       # cross-cutting registry
    ├── regulatory-source-registry.md
    ├── amendment-watch-list.md
    ├── spawn-chips.md
    ├── adr-curation-log.md
    └── plugin-execution-log.md  # NEW per Pattern 1
```

(Adapt to your project structure conventions.)

## Coexistence checklist

After installation, verify:

- [ ] `claude plugin list` shows expected plugins
- [ ] `docs/specs/zeespec/` exists + readable
- [ ] CLAUDE.md updated with both methodology + plugin sections
- [ ] Test plugin invocation works (e.g., simple `/comps` query)
- [ ] Test ZeeSpec module read (e.g., open `overlays/finance-accounting/modules/general-ledger/CLAUDE.md`)
- [ ] AI agent (Claude Code) can navigate both (test with a question that needs both)
- [ ] CI integration doesn't conflict (drift detection runs OK; plugin dispatch separate)
- [ ] Cost tracking covers both plugin executions + ZeeSpec agent dispatches

## Team training (combined)

Add to onboarding:

| Session | Duration | Topic |
|---------|----------|-------|
| Session 1 | 30 min | When to use plugin vs methodology |
| Session 2 | 30 min | Walk through one plugin (e.g., gl-reconciler) end-to-end |
| Session 3 | 30 min | Walk through one ZeeSpec module (read + understand) |
| Session 4 | 30 min | Integration patterns 1-3 |
| Session 5 | 30 min | Combined workflow exercise (use both) |

## Common coexistence issues

### Issue 1 — Plugin can't access ZeeSpec context

**Symptom:** Plugin agent invoked; doesn't read ZeeSpec module's invariants; generates output that conflicts.

**Why:** Plugins don't auto-load project's ZeeSpec by default.

**Fix:** In plugin invocation, explicitly include relevant spec excerpts:

```
/pitch-deck Target Co

Context: Our portfolio-management module's spec is at
docs/specs/zeespec/portfolio-management/CLAUDE.md. Key invariants:
- INV-PORTFOLIO-04: WACC ≤ 12% (per ADR-PORTFOLIO-008)
- INV-PORTFOLIO-08: terminal growth must align with sector benchmarks

Use these as constraints in the DCF.
```

### Issue 2 — Spec doesn't reflect plugin reality

**Symptom:** Spec says gl-reconciler runs nightly; actually team manually triggers.

**Why:** Spec was authored optimistically; operational reality drifted.

**Fix:** R5 drift detection (per workflow/08) catches; resolve per drift playbook (Recipe T3-bug if reality wrong; T3-design if spec wrong).

### Issue 3 — Plugin output overlaps with ZeeSpec spec

**Symptom:** pitch-agent produces "investment thesis"; ZeeSpec also has investment-thesis section in module spec. Which is canonical?

**Why:** Plugin output is point-in-time analysis; spec is durable design constraint.

**Fix:**
- Spec captures the FRAMEWORK (how investment thesis should be structured)
- Plugin produces INSTANCE (specific thesis for specific company)
- Spec references plugin: "Per ADR-X, investment thesis follows pitch-agent template + reviewed quarterly"

### Issue 4 — Slash commands collide

**Symptom:** Both methodology + plugin define `/audit` (or similar).

**Why:** Both packages register similar command names.

**Fix:**
- Use plugin-namespaced slash commands when ambiguous: `/financial-analysis:audit-xls` instead of `/audit`
- ZeeSpec methodology doesn't ship slash commands (mostly file-based); rarely collides

### Issue 5 — Cost compounding

**Symptom:** Plugin executions + ZeeSpec agent dispatches add up faster than expected.

**Fix:** Per `workflow/10-adoption-guide/04-tooling-integration.md` § "Cost tracking" — separate budgets for plugin vs methodology agents; monthly review.

## When to NOT integrate

Don't integrate plugins if:

- You're a non-finance team (plugins are finance-vertical)
- Your team finds plugins distracting from methodology discipline
- Plugin costs exceed your budget significantly
- Plugin agents produce output that requires too much human re-validation

Use ZeeSpec alone; build your own domain tools as needed.

## When to use ONLY Anthropic plugins (skip ZeeSpec)

Don't adopt ZeeSpec if:

- You're a non-engineering finance team (banker, analyst, PE associate)
- Your workflow is "build a deck"-style (use plugins); not "build a system"-style (use ZeeSpec)
- Your team doesn't maintain durable code (purely workflow-driven)
- Time-to-value for ZeeSpec methodology too long for your usage

Use plugins alone; document with your normal workflow conventions.

## When to use BOTH (the sweet spot)

Use BOTH when:

- ✅ Engineering team building a finance system
- ✅ Plugins accelerate specific workflows (deck-building / NAV / KYC)
- ✅ ZeeSpec ensures durable spec + audit trail
- ✅ Multi-year project where plugin outputs need historical tracking via ADRs

This is the most common integration scenario.

## Plugin maintenance

Track in `_meta/plugin-execution-log.md`:

```markdown
# Plugin Execution Log

> Track plugin invocations for cost monitoring + audit trail.

## Entries

| Date | Plugin | Version | Module | Operator | Cost | Output location |
|------|--------|---------|--------|----------|------|------------------|
| 2026-05-18 | pitch-agent | v2.3 | portfolio-management | Alice | $5.20 | output/pitch-target-co-2026Q2.pdf |
| 2026-05-19 | gl-reconciler | v2.1 | general-ledger | system.eod | $2.10 | output/recon-2026-05-18.csv |
| 2026-05-20 | market-researcher | v1.4 | competitive-analysis | Bob | $3.40 | output/market-2026Q2-payments-EU.md |

## Monthly summary

[populated by R6 ADR Curator Agent Mode B annual review OR manual rollup]

| Month | Total cost | Top plugin | Decisions captured as ADRs |
|-------|------------|-----------|----------------------------|
| 2026-05 | $48 | pitch-agent (3 runs) | ADR-PORTFOLIO-014, ADR-PORTFOLIO-015 |
```

## Upgrading

When upgrading plugins or ZeeSpec methodology:

### Plugin upgrade

```bash
# Update plugin to specific version
claude plugin update pitch-agent@claude-for-financial-services --version v2.4

# Re-test affected workflows
# If divergent output: ADR per Pattern 1
```

### ZeeSpec upgrade

```bash
# In your project
cd docs/specs/zeespec
git fetch upstream
git diff main upstream/main  # review changes
git pull upstream main         # apply if accepted
```

For methodology updates: read changelog; update internal training; re-run any breaking-change R3/R5 reviews.

## Cross-references

- `00-START-HERE.md` — integration overview
- `01-plugin-output-as-adr.md` — Pattern 1
- `02-dispatching-from-zeespec.md` — Pattern 2
- `03-spec-driven-plugin-config.md` — Pattern 3
- `workflow/10-adoption-guide/04-tooling-integration.md` — tooling infrastructure
- `workflow/10-adoption-guide/03-team-rollout-strategy.md` — team training

## Next

→ Back to `workflow/10-adoption-guide/00-START-HERE.md` for adoption decisions
→ Or: `workflow/00-START-HERE.md` for per-module workflow
