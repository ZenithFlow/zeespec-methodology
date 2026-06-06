---
doc: templates/_meta/README
type: meta-overview
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# `_meta/` — Project-Wide ZeeSpec Tracking

This directory holds **project-wide** ZeeSpec artifacts (not module-specific). Copy these templates into your project's `docs/specs/zeespec/_meta/` directory.

## Files

| File | Purpose |
|------|---------|
| `spawn-chips.md` | Dashboard of all spawn task chips (open + resolved) across all modules |
| `pilot-retrospective.md` | After authoring 3+ modules, capture lessons learned |
| `module-index.md` | One-line summary of every ZeeSpec module + status (copy to `docs/specs/zeespec/README.md`) |
| `metrics-loop.md` | Per-methodology-version, multi-factor tracking sheet — turns one-time pilot numbers into a trend (closes the metrics loop) |

## Usage

After running `06-spawn-task-chips.md` workflow, append each chip to `spawn-chips.md`:

```markdown
| Date | Title | Severity | Gaps closed | Status |
|------|-------|----------|-------------|--------|
| 2026-05-16 | Fix unauthorized bypass on resource verification | 🔴 P0 | Gap-<MOD>-VERIFY-01 | OPEN |
| 2026-05-17 | Fix transfer-handler deadlock | 🔴 P0 | FU-<MOD>-TRANSFER-DEADLOCK | 🟢 LANDED |
```

After authoring 3+ modules, write a retrospective in `pilot-retrospective.md`. Topics:
- Time per module (planned vs actual)
- Findings per module (severity breakdown)
- Production bugs fixed via spec-derived chips
- Anti-patterns most frequently caught
- Methodology improvements suggested

The `module-index.md` lives at `docs/specs/zeespec/README.md` in your project — one master index of all ZeeSpec modules with status + finding count.

Each methodology version, roll the retrospective's numbers into `metrics-loop.md` — a multi-factor sheet (authoring time, findings by severity, drift-catch vs false-positive rate, tier mix, qualitative load). Comparing rows across versions is how you tell whether a methodology change actually helped, instead of trusting a single headline number.
