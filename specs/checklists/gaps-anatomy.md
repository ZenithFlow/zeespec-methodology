---
doc: checklists/gaps-anatomy
type: checklist
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# `gaps.md` Anatomy — What Goes In + Where It Comes From

> `gaps.md` нь ZeeSpec 10 файлын **гацаа цэг (blocking layer)** — AI энд OPEN P0/P1 байвал ЗОГСОНО. Гэхдээ маш олон хүн "хаанаас юу үүсэх вэ" гэдгийг ойлгохгүй учир либо хоосон үлддэг (false zero gaps), либо handful of items-ээр жигдрүүлдэг (false low count). Энэ файл нь **gaps-ийн анатоми (4 хэсэг)** болон **үүсэх 6 эх сурвалж**-ийг тодорхой бичнэ.
>
> See also: `severity-matrix.md` (severity calibration), `status-tags.md` (lifecycle status), `templates/_template/gaps.md` (the template itself).

## 1. What `gaps.md` IS / IS NOT

### IS

- ✅ Catalog of **unresolved questions / known problems** for a module
- ✅ AI **blocking layer** — OPEN P0/P1 → AI MUST STOP
- ✅ **Bridge** between spec authoring and production fix workstream (via spawn task chips)
- ✅ Memory across sessions — what's blocked + why + who/when
- ✅ Reviewer finding archive (R3, R1, R2 outputs land here)

### IS NOT

- ❌ Backlog (use GitHub issues / Jira)
- ❌ Roadmap (use product mgmt tool)
- ❌ Bug tracker (gaps reference spawn chips; chips track actual fix)
- ❌ Free-form notes / TODO comments
- ❌ Optional file (every Tier 1 module MUST have one; even "empty" gets the headers + "no findings yet" note)

## 2. 4 Anatomical sections (per template)

Every `gaps.md` has FOUR canonical section types:

### A. Drift items (D1, D2, ...) — from B1 verification

**Where it comes from:** `workflow/02-b1-verification.md` (quantitative drift check)

Pattern: enum count drift, line ref drift (>200 lines), citation drift (file moved/renamed).

```markdown
### Drift items (B1 verification YYYY-MM-DD)

| ID | Title | Status | Severity |
|----|-------|:------:|----------|
| **D1** | enum cases: spec says 39, actual 45 | 🔴 OPEN | 🟡 P2 |
| **D2** | service.php line ref 265 → actual 397 (+132 drift) | 🟢 RESOLVED | 🟡 P2 |
```

### B. Operational follow-ups (FU-MOD-NAME) — from production findings

**Where it comes from:** R3 deep review, R1/R2 reviewers, drift scanner (R5), code drift management (workflow/08), production incidents.

Pattern: real production bugs, missing guards, compliance gaps, dead code, false invariant claims.

```markdown
### Operational follow-ups

| ID | Title | Status | Severity | Notes |
|----|-------|:------:|----------|-------|
| **FU-NOTIF-STALE-TOKEN-CLEANUP** | FCM tokens not deleted after 90d | 🔴 OPEN | 🟠 P1 | spawn chip 2026-05-18 |
| **FU-WALLET-CREATEDBY-0** | createdBy:0 sentinel across 20+ sites | 🔴 OPEN | 🚨 P0 | audit trail broken |
```

### C. Research questions (RES-MOD-QN) — open architectural / regulatory questions

**Where it comes from:** ADR proposed (workflow/09), R4 regulatory research (workflow/07), authoring phase (something unclear and not yet decidable).

Pattern: "should we use X or Y?" — not blocking immediately but needs decision.

```markdown
### Research questions (open, not blocking)

| ID | Title | Severity | Status | Notes |
|----|-------|:--------:|:------:|-------|
| **RES-KYC-Q1** | Tier 3 threshold: 10M MNT or per-customer profile? | 🟢 P3 | 🔴 OPEN | needs R4 research |
| **RES-NAV-Q2** | T+1 vs T+0 NAV publish — operational cost? | 🟡 P2 | 🟡 PROPOSED | ADR-NAV-007 drafted |
```

### D. Gap details — per-gap deep dive

For EACH P0/P1 gap (P2/P3 can be summary-only), provide:

- **Problem** (what's broken / unclear)
- **Reproduction** (file:line + steps if applicable)
- **Compliance concern** (regulatory angle if any)
- **Proposed fix** (1-N steps OR "TBD")
- **Owner** (team / person / "unassigned")
- **Spawn chip reference** (if dispatched)
- **AI behaviour** (STOP / cite / proceed)

## 3. The 6 sources — where gaps come from

Every line in `gaps.md` traces back to ONE of these 6 sources. If you can't identify the source, the gap is suspect (likely "guessed" rather than discovered).

### Source 1 — Authoring (during 10-file initial write)

Most common. As you write `what.md` / `how.md` / etc., you encounter:
- "I don't know what happens when X" → research question (RES-MOD-QN)
- "Two valid interpretations exist" → ADR candidate + RES
- "Spec implies behavior but code unclear" → operational follow-up (FU)

When authoring phase ends, ~3-8 gaps typically exist.

### Source 2 — B1 verification (quantitative drift check)

Per `workflow/02-b1-verification.md`. Mechanical comparison:
- Count entities in spec vs DB schema → drift D1
- Count enum cases spec vs code → drift D2
- Verify line refs still point at correct symbols → drift D3
- Verify cited methods exist → drift D4 (phantom method)

B1 typically surfaces 5-15 drift items per module (most P2).

### Source 3 — R3 deep review (same-session deep verifier)

Per `workflow/03-r3-deep-review.md`. Agent reads ACTUAL code (not just spec), validates:
- Invariants claimed `✅ IMPL` actually enforced in production?
- Algorithms documented match algorithm in code?
- Hardwiring (HW-MOD-NN) actually present?

R3 typically surfaces 5-20 findings. Real production bugs become FU-MOD-NAME with spawn chip.

### Source 4 — R1 + R2 parallel review (independent reviewers)

Per `workflow/04-r1-r2-parallel-review.md`. Two fresh-context reviewers:
- R1 (algorithm focus) — finds dead code, phantom methods, line drift
- R2 (compliance focus) — finds audit gaps, regulatory drift, missing guards

Findings appended as "R1 + R2 reviewer findings (applied YYYY-MM-DD)" section.

Typically 10-30 additional findings beyond R3.

### Source 5 — Drift scanner R5 (continuous, scheduled)

Per `workflow/08-code-drift-management/05-R5-drift-scanner-agent.md`. Weekly/monthly:
- Type 1 (citation drift)
- Type 2 (field/enum drift)
- Type 3 (behavioral drift)
- Type 4 (architectural drift)

Surfaces ongoing drift that accumulates between Tier 1 promotions.

### Source 6 — Production incidents + customer reports

External signal:
- Production bug surfaced (incident log) → FU with severity escalated to P0
- Customer report → triage → gap with reproduction
- Regulator inquiry → P0 immediately + spawn chip

These are RARE but HIGHEST priority.

## 4. Gap lifecycle (status flow)

Each gap moves through statuses per `severity-matrix.md`:

```
🔴 OPEN ──► 🟡 PROPOSED ──► 🟢 RESOLVED ──► (kept in archive section)
   │            │
   ├──► ⚪️ DEFERRED (postponed; revisit date set)
   └──► 📌 BY-DESIGN (acknowledged gap; documented; no fix planned)
```

| Status | Meaning | Allowed for severity |
|--------|---------|---------------------|
| 🔴 OPEN | No decision yet | Any |
| 🟡 PROPOSED | Fix drafted, awaiting approval | Any |
| 🟢 RESOLVED | Decision recorded; fix landed (or BY-DESIGN signed off) | Any |
| ⚪️ DEFERRED | Postponed (with date) | P1/P2/P3 (NEVER P0) |
| 📌 BY-DESIGN | Intentional; documented why we won't fix | P1/P2/P3 (NEVER P0) |

**Rule:** P0 cannot be DEFERRED or BY-DESIGN. P0 RESOLVED requires either fix shipped or severity de-escalation with reason.

## 5. Source-to-section routing rules

Quick reference: which source produces which section type.

| Source | Section type | Typical ID prefix |
|--------|--------------|-------------------|
| Authoring | Research question | `RES-MOD-QN` |
| Authoring | Operational follow-up (if known bug) | `FU-MOD-NAME` |
| B1 verification | Drift item | `D1, D2, ...` |
| R3 review | Operational follow-up | `FU-MOD-NAME` |
| R1 review | Operational follow-up | `FU-MOD-NAME` (or `R1-CN` in archive section) |
| R2 review | Operational follow-up (compliance) | `FU-MOD-NAME` (or `R2-CN`) |
| R5 drift scanner | Drift item | `D-MOD-NN` |
| Production incident | Operational follow-up (severity P0) | `FU-MOD-INC-NN` |
| Customer report | Operational follow-up | `FU-MOD-CR-NN` |

## 6. "Empty gaps.md" — red flag

If `gaps.md` has zero findings, ONE of these is true:

- ⚠️ Module is brand new (Drafting tier) — expected; document "no findings yet"
- 🚨 Module is at Tier 1 with zero gaps — **highly suspect**. Possible causes:
  - B1 verification never run
  - R3 not dispatched
  - R1+R2 review skipped
  - Findings filed in wrong place (TODO comments, GitHub issues, but not here)
  - Author marked everything as `✅ IMPL` without verification

Tier 1 modules typically have **5-30 gaps** in mixed states (most RESOLVED; few OPEN).

If you see "0 gaps" on Tier 1 module → file a meta-gap: `FU-MOD-VERIFY-COVERAGE` P1 OPEN requesting full review pass.

## 7. "Gap count creep" — red flag

If `gaps.md` grows to 100+ OPEN items, ONE of these is true:

- ⚠️ Module is heavily under-resourced (real backlog)
- 🚨 Gaps filed but never triaged (process broken)
- 🚨 Gaps filed at wrong severity (P0 inflation) → all OPEN blocks AI permanently
- 🚨 Gaps filed but spawn chips never dispatched

Healthy module: **5-30 total** (mostly RESOLVED/DEFERRED/BY-DESIGN); **<5 OPEN** P0/P1 at any time.

If you see 100+ → spawn a sprint to triage: re-severity, batch close BY-DESIGN, dispatch spawn chips for unaddressed P0/P1.

## 8. AI behaviour quick reference

Before AI starts work on a module:

1. Read `gaps.md` Summary table
2. Filter: 🔴 OPEN + (🚨 P0 OR 🟠 P1)
3. If ANY exist + relevant to current task: **STOP + ask user**
4. If exist but irrelevant: cite + proceed
5. If only P2/P3 OPEN: implement + cite gap

See `severity-matrix.md` § "AI behaviour by severity + ticket presence" for the full matrix.

## 9. Gap-writing template (per entry)

When adding a new gap, use this skeleton:

```markdown
### FU-<MOD>-<DESCRIPTIVE-NAME> — [One-line title]

**Source:** [B1 / R3 / R1 / R2 / R5 / authoring / incident / customer report]
**Discovered:** YYYY-MM-DD
**Severity:** 🚨 P0 | 🟠 P1 | 🟡 P2 | 🟢 P3
**Status:** 🔴 OPEN | 🟡 PROPOSED | 🟢 RESOLVED | ⚪️ DEFERRED | 📌 BY-DESIGN

**Problem:** [What is broken / unclear / missing]

**Reproduction:**
- File: `backend/src/Service/X.php:142`
- Steps:
  1. ...
  2. ...
- Observed: ...
- Expected: ...

**Compliance concern:** [Regulatory angle if any; or "None"]

**Proposed fix:**
1. [Step 1]
2. [Step 2]

**Owner:** [name / team / "unassigned"]
**Spawn chip:** [link/reference or "not yet dispatched"]
**AI behaviour:** STOP if user asks to touch [feature X]
```

## 10. Common mistakes

### Mistake 1 — Vague gap entries

❌ "Something seems off with notifications"
✅ "FCM tokens not deleted after 90d (FCMTokenRepository.php:88 — no cleanup job exists). GDPR Art-17 risk. Spawn chip: NOTIF-IMPL-008"

### Mistake 2 — No severity assigned

❌ "FU-X-NN — fix later"
✅ "FU-X-NN — 🟠 P1 OPEN — fix this quarter"

### Mistake 3 — P0 OPEN with no spawn chip

A P0 finding with no chip means "we know it's broken but nobody is fixing it." Spawn the chip OR de-escalate with reason.

### Mistake 4 — Gap closure without RESOLVED note

When closing a gap, ALWAYS leave a one-line resolution note. Future readers (including yourself in 6 months) need to know WHY this gap is no longer OPEN.

### Mistake 5 — Filing same gap twice

R3 finds it → R1 finds same one → R2 finds it again → 3 entries. Solution: de-dupe during apply-findings (`workflow/05-apply-findings.md`). Use the EARLIEST discovery as primary; cite the others as confirmations.

### Mistake 6 — TODO comments instead of gaps

`// TODO: fix later` in code, while gap file is empty. AI won't see the TODO + won't STOP. File it as a gap.

## 11. Cross-references

- `templates/_template/gaps.md` — the template itself
- `severity-matrix.md` — severity calibration + AI behaviour
- `status-tags.md` — IMPL / PARTIAL / DESIGN tagging
- `anti-patterns.md` — common code patterns that become gaps
- `workflow/02-b1-verification.md` — B1 → drift items
- `workflow/03-r3-deep-review.md` — R3 → operational follow-ups
- `workflow/04-r1-r2-parallel-review.md` — R1/R2 → reviewer findings
- `workflow/05-apply-findings.md` — folding findings into gaps.md
- `workflow/06-spawn-task-chips.md` — gap → production fix chip
- `workflow/08-code-drift-management/` — R5 drift scanner → drift items
- `workflow/09-adr-lifecycle/` — ADR Proposed → RES research question

## 12. Quick checklist (per Tier 1 promotion)

Before promoting a module to Tier 1:

- [ ] Every authoring-phase question filed as RES or FU
- [ ] B1 verification run + drift items filed
- [ ] R3 deep review run + findings filed
- [ ] R1 + R2 parallel review run + findings applied
- [ ] All P0 findings either RESOLVED or have spawn chips
- [ ] All P1 findings either RESOLVED, PROPOSED, or have spawn chips
- [ ] No P0 in DEFERRED or BY-DESIGN status
- [ ] Each gap has Source, Severity, Status, Problem, AI behaviour
- [ ] Total gap count in healthy range (5-30)
- [ ] gaps.md summary table reflects all entries
- [ ] CLAUDE.md "ACTIVE ISSUES" section cites OPEN P0/P1 by ID
