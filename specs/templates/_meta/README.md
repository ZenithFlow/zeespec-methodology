# `_meta/` — Project-Wide ZeeSpec Tracking

This directory holds **project-wide** ZeeSpec artifacts (not module-specific). Copy these templates into your project's `docs/specs/zeespec/_meta/` directory.

## Files

| File | Purpose |
|------|---------|
| `spawn-chips.md` | Dashboard of all spawn task chips (open + resolved) across all modules |
| `pilot-retrospective.md` | After authoring 3+ modules, capture lessons learned |
| `module-index.md` | One-line summary of every ZeeSpec module + status (copy to `docs/specs/zeespec/README.md`) |
| `changelog.md` | Methodology + spec changes over time |

## Usage

After running `06-spawn-task-chips.md` workflow, append each chip to `spawn-chips.md`:

```markdown
| Date | Title | Severity | Gaps closed | Status |
|------|-------|----------|-------------|--------|
| 2026-05-16 | Fix R5 AML bypass | 🔴 P0 | Gap-WAL-VERIFY-01 | OPEN |
| 2026-05-17 | Fix AccountService deadlock | 🔴 P0 | FU-WAL-TRANSFER-DEADLOCK | 🟢 LANDED |
```

After authoring 3+ modules, write a retrospective in `pilot-retrospective.md`. Topics:
- Time per module (planned vs actual)
- Findings per module (severity breakdown)
- Production bugs fixed via spec-derived chips
- Anti-patterns most frequently caught
- Methodology improvements suggested

The `module-index.md` lives at `docs/specs/zeespec/README.md` in your project — one master index of all ZeeSpec modules with status + finding count.
