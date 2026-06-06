---
doc: templates/_meta/metrics-loop
type: meta-template
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# ZeeSpec Metrics Loop — Per-Version Tracking Sheet

> Capture these factors **once per methodology version**, then compare rows across versions to
> see whether a change actually helped. This closes the self-improving loop
> (`ZACHMAN-ALIGNMENT.md` §3, input #4): the pilot's headline numbers are a one-time snapshot —
> this sheet turns them into a trend.
>
> **No single headline number.** Productivity is multi-dimensional; one metric is gameable and
> misleading (ICSE-SEIP 2026, N=2989 — no single measure captures it; same stance as SPACE/DORA).
> Always read these factors *together* — e.g. a rising drift-catch rate is only good if the
> false-positive rate is not rising with it.

## Factors per version

| Version | Modules | Avg authoring time / module | Reviewer wall-time / module | Findings / module (avg) | P0 | P1 | P2 | Drift-catch rate | False-positive rate | Modules @ Lite | @ Standard | @ Full |
|---------|--------:|----------------------------:|----------------------------:|------------------------:|---:|---:|---:|-----------------:|--------------------:|---------------:|-----------:|-------:|
| vX.Y.Z  | N       | Nh                          | Nh                          | N                       | N  | N  | N  | N% (caught / total real drift) | N% (false flags / total flags) | N | N | N |

- **Drift-catch rate** = real spec↔code drift caught by R5 ÷ total real drift later confirmed (higher is better).
- **False-positive rate** = flags that were not real defects ÷ total flags raised (lower is better — read *with* drift-catch rate so the loop does not reward over-flagging).
- **Tier columns** count modules authored at each weight (Tier 0 Lite / Standard 10-file / Full + R1+R2+R4). A shift toward Lite over versions is a signal the methodology is getting cheaper to apply.

## Qualitative factors per version

> Score 1–5 or note in prose. These are not optional — they catch costs the time/count columns miss.

| Version | Developer cognitive load | Peer-review ease | Ownership clarity | Notes |
|---------|--------------------------|------------------|-------------------|-------|
| vX.Y.Z  | 1–5 (lower = lighter)    | 1–5 (higher = easier) | 1–5 (higher = clearer) | [friction, wins, quotes] |

## Worked example — N=1 baseline (do not treat as validated ROI)

> Seeded from the v3.0.0 pilot (`METHODOLOGY.md` §14). **Single author, single project, no control
> group.** This is the directional baseline every future version is measured against — not proof.
> Per-version pilot numbers live in `METHODOLOGY.md` §14; this row is an illustrative copy.

| Version | Modules | Avg authoring time / module | Reviewer wall-time / module | Findings / module (avg) | P0 | P1 | P2 | Drift-catch rate | False-positive rate | Modules @ Lite | @ Standard | @ Full |
|---------|--------:|----------------------------:|----------------------------:|------------------------:|---:|---:|---:|-----------------:|--------------------:|---------------:|-----------:|-------:|
| v3.0.0  | 5       | ~5.2h                       | not tracked at N=1          | 35 (177 total)          | not split at N=1 | — | — | not tracked at N=1 | not tracked at N=1 | 0 | 0 | 5 |

| Version | Developer cognitive load | Peer-review ease | Ownership clarity | Notes |
|---------|--------------------------|------------------|-------------------|-------|
| v3.0.0  | not scored               | not scored       | not scored        | 5 modules (notification/asset_catalog/wallet/accounting/settlement), 177 findings total, **4 production bugs fixed** (notification 2, asset_catalog 1, wallet 1; accounting + settlement have in-progress spawn chips). All authored as full 10-file (Full weight) — the Lite/Standard/Full split predates these modules. Severity split, drift-catch, false-positive, and reviewer wall-time were not instrumented at N=1; the empty columns above are the gaps the next version closes. |

## How to use

1. **Capture per version.** When you cut a new methodology version (or finish a batch of modules under it), add one row to each table above. Pull authoring/findings from `pilot-retrospective.md` and `spawn-chips.md`; pull drift-catch / false-positive from your R5 drift-scan logs.
2. **Compare across versions.** Put the new row next to the prior one and ask: did the change we shipped this version move the factors in the intended direction *without* a hidden regression elsewhere (e.g. faster authoring but higher false-positive rate)? Read the factors together — never optimize one in isolation.
3. **Close the loop.** If a version's change did not help (or hurt a qualitative factor), that is feedback into the next version — including a candidate for **pruning** (`ZACHMAN-ALIGNMENT.md` §3, input #5). Record the verdict in the Notes column so the decision is auditable.
