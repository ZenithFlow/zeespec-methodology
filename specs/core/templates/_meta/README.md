---
doc: core/templates/_meta/README
type: meta-overview
version: 4.0.0
status: stable
last_updated: 2026-06-10
---

# `_meta/` — Project-Wide ZeeSpec Tracking

This directory holds **project-wide** ZeeSpec artifacts (not module-specific). Copy these
templates into your project's `docs/specs/zeespec/_meta/` directory. Each template documents
its own usage — this README is only the index.

| File | Purpose |
|------|---------|
| `spawn-chips.md` | Dashboard of all spawn task chips (open + resolved) across all modules |
| `pilot-retrospective.md` | After authoring 3+ modules, capture lessons learned |
| `module-index.md` | One-line summary of every ZeeSpec module + status (copy to `docs/specs/zeespec/README.md`) |
| `metrics-loop.md` | Per-methodology-version, multi-factor tracking sheet — turns one-time pilot numbers into a trend (closes the metrics loop) |
