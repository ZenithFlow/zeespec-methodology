---
doc: workflow/11-anthropics-plugin-integration/03-spec-driven-plugin-config
type: workflow-integration
phase: anthropic-plugin-integration
version: 1.0.0
status: experimental
last_updated: 2026-05-18
---

# Pattern 3 — ZeeSpec Spec Drives Plugin Configuration

> When a ZeeSpec module describes a system that uses an Anthropic plugin as a runtime component, the spec parameterizes the plugin's runtime configuration. The spec is the source of truth; plugin config is derived.

## The pattern

```
ZeeSpec module describes the system
  (e.g., general-ledger module's where.md § 5 specifies "gl-reconciler plugin v2.1 used for monthly close")
        ↓
Spec defines invariants + hardwiring
  (HW-GL-XX: gl-reconciler runs nightly at 22:00 UTC; materiality threshold 1000 MNT)
        ↓
Plugin runtime config derived from spec
  (gl-reconciler-config.yaml extracted from spec's where.md § 5)
        ↓
Plugin executes per derived config
  (operator dispatches plugin; uses derived config; produces output)
        ↓
Plugin output captured per Pattern 1 OR consumed downstream
```

This is **spec-as-configuration** for plugins.

## When to apply

Apply when:
- ✅ Plugin is part of the system the module describes (not external tool)
- ✅ Plugin runtime config drives engineering behavior
- ✅ Plugin version pinning matters for reproducibility
- ✅ Multi-plugin setup where config consistency matters

Don't apply when:
- ❌ Plugin is one-off / ad-hoc tool (not part of module's runtime)
- ❌ Plugin config is trivially defaulted (no spec value)
- ❌ Plugin is dispatched ad-hoc by operators

## Module documentation

In your module's `where.md` § 5 "Tech Stack Binding", add:

```markdown
### 5.X Anthropic plugin integrations

**Plugin:** gl-reconciler (anthropics/financial-services)
**Version pinned:** v2.1.0 (do NOT auto-update; spec must be re-reviewed first)
**Dispatch trigger:** nightly cron at 22:00 UTC (per HW-GL-XX)
**Inputs:**
- subledger snapshot (from wallet module via daily export)
- GL trial balance (from accounting module)
**Outputs:**
- reconciliation_break entries (per S-GL-07 storage role)
- reconciliation_summary.pdf (per S-GL-NN — TBD)
**Failure mode:** if plugin run fails, alert operator; manual reconciliation procedure per ALG-GL-MANUAL-RECON-01
**Config source:** gl-reconciler-config.yaml (derived from this spec; see below)
**Cost:** ~$1-3 per execution
```

And HW entry:

```markdown
### HW-GL-XX — gl-reconciler plugin governs monthly close reconciliation
Status: ✅ IMPL
Source: where.md § 5.X; gl-reconciler-config.yaml

The plugin's behavior is defined by ZeeSpec module. Engineering MUST NOT
modify gl-reconciler-config.yaml without spec update + R6 ADR review.

Plugin version pinned at v2.1.0. Upgrade requires:
1. Re-run plugin against last month's data
2. Compare output to existing
3. If divergence > materiality: ADR + spec update
```

## Configuration extraction

Derive plugin config from spec:

`gl-reconciler-config.yaml`:

```yaml
# Generated from docs/specs/zeespec/general-ledger/where.md § 5.X
# DO NOT EDIT DIRECTLY; modify spec then regenerate

plugin: gl-reconciler
version: 2.1.0

dispatch:
  schedule: "0 22 * * *"  # nightly per HW-GL-XX
  timezone: "UTC"

inputs:
  subledger_source: "wallet-export-daily"  # per S-WAL-NN
  gl_source: "accounting-trial-balance-daily"  # per S-GL-NN

reconciliation:
  materiality_threshold_mnt: 1000  # per INV-GL-XX
  classification_method: "doctrine-mapping"  # per ADR-GL-XXX
  break_aging:
    p1_threshold_days: 3  # per HW-FIN-27
    p0_threshold_days: 7  # per HW-FIN-27

output:
  break_destination: "reconciliation_break table per S-GL-07"
  summary_pdf: "compliance-share/gl-reconciliation-summary-<YYYY-MM-DD>.pdf"
  retention_years: 7  # per HW-GL-09

alerts:
  on_break_p0:
    channel: "#compliance"
    severity: "critical"
  on_plugin_failure:
    channel: "#oncall"
    escalate_to: "controller"
```

Maintenance:
- Spec is source of truth
- Config is derived (CI job regenerates from spec)
- Plugin runtime reads config

## Drift between spec + config

R5 drift detection (per `workflow/08-code-drift-management/`) extended to detect spec ↔ config drift:

```bash
# In zeespec-drift-scan.sh — additional check
diff <(extract-config-from-spec gl-reconciler) gl-reconciler-config.yaml
# Difference = drift → report
```

If config diverged from spec: Type 3-design drift (per `08/02-drift-categorization.md`); either update spec to match OR revert config.

## Plugin version drift

When Anthropic releases plugin update (e.g., gl-reconciler v2.1.0 → v2.2.0):

1. R4 amendment-tracking-style watch list includes plugin versions
2. New version detected → review changelog
3. Test new version against same inputs as previous
4. Compare outputs:
   - If equivalent: spec update minor (version bump only); ADR optional
   - If divergent: material change; ADR mandatory; spec re-author of affected sections
5. Pin new version OR rollback

This is analogous to law amendment tracking per `workflow/07-r4-regulatory-research/09-amendment-tracking.md`.

## Anti-patterns

### Anti-pattern 1: Plugin config drifts silently from spec

**Symptom:** Operator edited config; spec doesn't reflect.

**Fix:** R5 drift detection includes spec ↔ config check; alert on divergence.

### Anti-pattern 2: Plugin auto-updates without spec review

**Symptom:** CI auto-installs latest plugin; spec specifies v2.1; reality v2.3.

**Fix:** Pin plugin version in CI/deployment; require spec update before bump.

### Anti-pattern 3: Multiple plugin configs with different sources of truth

**Symptom:** dev / staging / prod have different plugin configs; spec only describes one.

**Fix:** Spec describes per-environment if needed; config derived per environment.

## Cross-references

- `00-START-HERE.md` — integration overview
- `01-plugin-output-as-adr.md` — Pattern 1
- `02-dispatching-from-zeespec.md` — Pattern 2
- `workflow/08-code-drift-management/` — drift detection (extended to spec ↔ config)

## Next

→ `04-installation-coexistence.md` — install + coexistence
