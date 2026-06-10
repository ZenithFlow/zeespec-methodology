---
doc: ROADMAP-v4
type: roadmap
version: 1.0.0
status: active
last_updated: 2026-06-10
---

# ZeeSpec v4.0 Roadmap — "Practice what it preaches"

> The methodology teaches anti-over-engineering, progressive disclosure, and Lite-first entry —
> but the package itself reached 32k lines / 132 files (85% of it non-core). v4.0 applies the
> methodology's own tiering to the methodology: shrink the entry path, make verification more
> deterministic, then earn N=2 before writing anything new.

## Standing rules (entire roadmap)

1. **Content freeze** — no new workflow chapters, no new overlays until N=2 (Phase 3) is complete.
   Plugin/tooling fixes are exempt (thin runtime layer).
2. **Honest-numbers rule** — no precise figures without measurement. Unmeasured estimates are
   labeled qualitative bands + "hypothesis (N=1)".
3. **Core budget** — `specs/core/` must stay ≤ 5,000 lines. Enforced by `dogfood-drift-scan.sh`
   (Phase 1c). New top-level workflow chapters trigger a warning.

## Phase 0 — Baseline (v3.3.0, captured 2026-06-10)

Package-size metrics (this repo's own analogue of `templates/_meta/metrics-loop.md`; adopter
metrics stay in that template):

| Metric | v3.3.0 baseline | v4.0.0 target | v4.0.0 actual (2026-06-10) |
|--------|----------------:|--------------:|--------------:|
| Total lines under `specs/` | 32,028 | ~26,500 | **27,409** (−14.4%) |
| Markdown files (repo) | 132 | ~120 | **122** |
| Core lines (`specs/core/`, incl. PORTING-GUIDE) | ~5,000 | ≤ 5,000 (hard cap) | **4,985** (gate PASS) |
| Core share of package | 15% | ≥ 18% | **18.2%** |
| Entry path (README → 00-START-HERE → 01-authoring), words | 4,670 (~19 min) | ≤ ~20 min | **4,179 (~17 min)** |
| Full-package reading time (words @ 250 wpm) | ~12.8 h (191k) | n/a (examples are opt-in) | ~11.6 h (173.6k) |
| Largest single file | 819 lines (lending "condensed" overview) | ≤ ~450 | **597** (08/03-auto-drift-detection) |

> Cut detail: workflow/12 → 824 lines (2 files, hypothesis bands), workflow/11 → 223 (1 file),
> source-cheatsheet → 211 (entry-point registry), lending overview → 247. Guardrail caught the
> first violation on day one (core was 5,038 → trimmed duplicated examples to 4,985).

## Phase 1 — Minify + restructure → v4.0.0

**1a. Three-tier layout** (breaking change; do it before N=2 adopters exist):

```
specs/
├── README.md      ← stays at root as the router (read this first)
├── core/          ← METHODOLOGY · PORTING-GUIDE · workflow 00-06 · checklists · templates
├── extended/      ← workflow 07 (R4) · 08 (drift) · 09 (ADR) · 10 (adoption) · 11 · 12 · ZACHMAN-ALIGNMENT
└── examples/      ← overlays (finance-accounting, frontend-design-system) · EXPLAINED-FOR-PRESENTATIONS
```

**1b. Cuts** (quality-neutral: removing unmeasured precision, rot-prone URLs, over-long examples):

| Target | Before | After (target) | Action |
|--------|-------:|---------------:|--------|
| workflow/12 agentic-role-replacement | 3,258 | ~800 | 9 files → 2; coverage %s → hypothesis bands |
| workflow/11 plugin-integration | 1,340 | ~250 | 5 files → 1 integration note |
| 07/05 source-cheatsheet | 599 | ~200 | URL list → entry-point registry w/ last-verified |
| lending MODULE-OVERVIEW | 819 | ~300 | make "condensed" true; pointer-only vs principles/ |

**1c. Guardrails in CI** — core line budget (FAIL > 5,000) + new-chapter warning in
`scripts/dogfood-drift-scan.sh`.

**1d. Release** — update plugin layer paths (`${CLAUDE_PLUGIN_ROOT}/specs/...`), bump everything
to 4.0.0, dogfood scan PASS, fill the "v4.0.0 actual" column above.

## Phase 2 — Deterministic verification — ✅ DONE 2026-06-10

> Shipped: test-pointer rule (`core/METHODOLOGY.md` § 3c + `Test` column in the `what.md`
> template + authoring checklist), B1 § 6 "P0/P1 INV without test pointer" count, same-named
> `metrics-loop.md` column, `ci-drift-gate.sh --json` (schema `zeespec-gate/1`, self-tested
> pass/warn/fail). Core after additions: 4,998 / 5,000.


- Generalize the R4 executable-assertion pattern to all invariants: every P0/P1 `INV-*` carries a
  test pointer or executable assertion.
- New B1 count: "P0/P1 invariants without test pointers" → becomes a metrics-loop column.
- `ci-drift-gate.sh`: JSON output so metrics capture is automatic.

Goal: R1/R2 reviewers handle only the architectural residual; behavioral correctness becomes
machine-checkable. Shrinks the AI-reviews-AI circle.

## Phase 3 — N=2 adoption — 🟡 IN PROGRESS (started 2026-06-10)

> Target: **NewsApp/news** (news domain; Python/FastAPI + Next.js + iOS — different stack AND
> domain vs pilot #1). Discovery: pilot-#2 authoring already existed (5 modules: 4 Lite + 1 Full;
> story-matching ran the full R3+R1+R2 pipeline → 1 🚨 P0 + 3 chips) on a frozen v3.0.0 snapshot.
> Done 2026-06-10: snapshot upgraded to v4.0.0 (v3 copy archived), project CLAUDE.md router
> updated, `ci-drift-gate.sh` + GitHub Actions workflow installed (warn mode, JSON artifact).
> **First real gate run caught a citation-convention violation — 202/204 bare-filename citations —
> mechanically expanded; now 149/149 module citations PASS, 0 line-range drift.** Gate also gained
> the methodology-tier exclusion from this run. Metrics row #2 seeded (57 INV · 0 test ptr · 28 gaps).
> Remaining for exit: test pointers on P0/P1 INVs, story-matching P0 resolution, R5 semantic scan,
> the "second person" axis, commits in both repos.


- Second real project: different stack + domain; ideally a second person (kills single-author bias).
- `/zeespec:init` Tier 0 Lite → author 2-3 modules → full pipeline (B1 → R3 → R1+R2 → apply) →
  drift gate in that repo's CI.
- Instrument: authoring h/module, findings, reviewer false-positive rate, drift-gate catches, and
  **which extended/ files were actually opened**.
- Exit: `metrics-loop.md` has two real rows + a delta writeup vs pilot #1.

## Phase 4 — Post-N=2 pruning (only after Phase 3)

- Extended files never opened during pilot #2 become cut candidates (usage-driven minify #2).
- New overlays/chapters only with a named real adopter.
- Only lessons that repeat across BOTH pilots get folded into core.
