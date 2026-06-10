---
doc: core/workflow/06-spawn-task-chips
type: workflow-checklist
phase: spawn-chips
version: 2.4.0
status: stable
last_updated: 2026-05-19
---

# Spawn Task Chip Pattern — Delegating Production Bugs

> Time: 10-15 min per chip. Use when reviewer finds a real production bug.

## When to spawn a task chip

| Scenario | Action |
|----------|--------|
| Spec drift (cited line is wrong) | Fix inline; no chip |
| Phantom method (spec invents what doesn't exist) | Update spec; no chip |
| Real production bug | **Spawn chip** + file gap |
| Compliance violation | **Spawn chip** + file gap with severity |
| Architectural anti-pattern | **Spawn chip** + multiple gap entries |
| Missing test coverage | **Spawn chip** with test plan |

## Why a chip and not inline fix?

1. **Session discipline** — spec authoring vs bug fixing are different cognitive modes
2. **Production fix needs a PR** — proper review, tests, deployment process
3. **Audit trail** — the chip captures full context (file:line, repro, acceptance criteria)
4. **Parallelism** — chips can be queued + worked on by different agents/humans
5. **Scope control** — spec session doesn't get blocked on debugger / migration prep

## Chip anatomy

Each spawn task chip has 3 fields:

### 1. Title (under 60 chars, imperative)

Good: "Fix unauthorized-account bypass on resource verification — verify-flag gap" *(pilot: "Fix R5 redemption AML bypass — bankAccount.isVerified gap")*
Bad: "Bug fix"

### 2. TLDR (1-2 sentences, plain English)

Good: "`<ResourceService>.<createMethod>()` picks the customer's FIRST linked account/resource with NO verified-flag check. Customer-initiated action can complete against an unverified resource → security / compliance bypass." *(pilot illustration: PHP `OrderService::createRedemptionWithdrawal` picks first bank account with no `isVerified` check, enabling an AML bypass.)*

Bad: "Bug in withdrawal flow"

### 3. Prompt (self-contained, 500-3000 words)

Must include:
- **Problem statement** with severity + production impact
- **Verified production state** (file:line citations)
- **Resolution plan** (phases, code snippets, test stubs)
- **Files to read first** (so agent has full context)
- **Cross-references** (related gaps, ZeeSpec sections)
- **Acceptance criteria** (checklist for completion)
- **Severity + estimated effort**

## Template

```markdown
**🔴 PRODUCTION BUG: [one-line title]**

**Discovered by:** [Module] ZeeSpec [R3/R1/R2] review YYYY-MM-DD ([finding ID])

**Symptom:** [Plain-English description of what's broken]

**Verified production state:**
- `path/to/file.ext:NN` — [behaviour]
- `path/to/file2.ext:NN-MM` — [behaviour]
- Evidence: [grep output, dev.log line, inline comment, etc.]

**Why this matters:** [Business/compliance impact]

**Resolution plan:**

### Phase 1: [Step]

```[language]
// Code snippet showing the fix
```

### Phase 2: [Step]

[More detail]

**Files to read first:**
- `path/to/file.ext` (entire file — focus on lines XX-YY)
- `path/to/related.ext` (sister method to mirror)
- `[third-party / framework dependency path]` (typed exception or error classes to catch — your equivalent of `vendor/`, `node_modules/`, `site-packages/`, Go module cache, `~/.cargo/registry/`, etc.)

**Regression test (must add):**

`tests/path/to/Test.ext`:
- [Test case 1]
- [Test case 2]
- [Test case 3]

**Cross-references:**
- ZeeSpec: `docs/specs/zeespec/<module>/gaps.md` [Gap ID] (filed YYYY-MM-DD)
- ZeeSpec: `docs/specs/zeespec/<module>/gravity.md` [HW ID] (filed YYYY-MM-DD)
- 4-file canonical: `docs/specs/<module>/CLAUDE.md`
- Related production incident: [link or description]

**Acceptance criteria:**

- [ ] [Specific code change in file:line]
- [ ] [Specific code change in another file]
- [ ] N regression tests added + passing
- [ ] Production smoke test: [scenario]
- [ ] Update `docs/specs/zeespec/<module>/gaps.md` — [Gap ID] marked 🟢 RESOLVED with file:line citations
- [ ] Update `docs/specs/zeespec/<module>/gravity.md` — [HW ID] status upgraded to ✅ IMPL

**Severity:** 🔴 P0 — [why critical]. Estimated [N] days backend + tests + migration coordination.
```

## Chip dispatch (Claude Code example)

```javascript
// Inside an agent session, invoke:
mcp__ccd_session__spawn_task({
  title: "Fix unauthorized-account bypass on resource verification",
  tldr: "ResourceService picks customer's first linked account with no verified-flag check...",
  prompt: "..." // 500-3000 word self-contained prompt
})
```

Other AI platforms:
- **Copilot CLI:** Use `gh issue create --title ... --body ...` with the chip body
- **Cursor:** Drop the chip body into a new chat as the initial message
- **Manual:** Create a TODO ticket in your project management tool

## After dispatching: update gaps.md

Add a note to the gap entry:

```markdown
### Gap-MOD-XXX: [title]

**Severity:** 🔴 P0
**Status:** 🔴 OPEN — spawn task chip created YYYY-MM-DD
**Files:** [list]

**Resolution path (chip):**
[brief summary; full detail in the chip itself]

**Cross-references:**
- Spawn chip created YYYY-MM-DD
- [Other related gaps]
```

This way, if the chip is closed but you re-author the spec later, you can find the closing PR.

## Scope-discovery deferral pattern (NEW v3.1)

> Observed pattern from pilot: when starting work on a spawn chip, the investigation often reveals that the actual scope is 3-4x larger than the original chip estimated. Common cause: the original gap was filed from a surface-level review; deep investigation finds a cross-module architectural root cause.

### Observed cases (pilot 2026-05-18 investment module)

| Chip | Original scope | Investigation finding | New scope |
|------|----------------|----------------------|-----------|
| INV-IMPL-010 (rename duplicate command) | 1-2h: rename one of two `app:investment:settle` declarations | Both commands work on different entities; production crontab calls neither; entire custodian-submit flow is inactive in production | Architectural decision needed; PM input required |
| INV-IMPL-014 (capture operator-id on Execute/Settle) | 4-6h: inject Security into 2 processors + widen 2 service signatures | Service-layer `executeTransaction` → `FundJournalService` → 20 hardcoded `createdBy: 0` sites across 6+ modules | Cross-module refactor (architect-level); 8-16h+ |

3 cases observed in the pilot's first 3 chip-investigations (66% scope-expansion rate). Treat this as a likely outcome, not an exception.

### Correct workflow (DO)

When investigation reveals scope expansion:

1. **STOP chip implementation immediately.** Don't expand the original chip's scope.
2. **File NEW gap** in `gaps.md` describing the architectural finding with full Problem/Reproduction/Compliance-concern/Fix-options/Spawn-chip-link.
3. **File NEW spawn chip** for the architectural decision (separate ID, e.g. INV-IMPL-023).
4. **Mark original chip DEFERRED** (not in-progress; not closed) with `Subsumed by Gap-MOD-XXX / INV-IMPL-NNN` cross-reference.
5. **Continue with next-priority chip.** Don't get stuck on the architectural one until PM/architect input arrives.

### Anti-pattern (DON'T)

```
INV-IMPL-014 original scope: 4-6h
Investigation discovers it's actually 8-16h cross-module refactor
WRONG: "I'll just fix this bigger thing too while I'm here"
       → blows time budget
       → destroys focus
       → may introduce regressions in services you weren't planning to touch
       → spec session becomes a refactor session
```

### Why this preserves discipline

- **Spec-author session ≠ refactor session.** Cognitive modes differ.
- **PM/architect time is rate-limited.** Filing a chip for them buys their input.
- **Other lower-effort chips wait.** A blocked-expanded chip blocks the queue.
- **Audit trail.** "Chip X DEFERRED, subsumed by Y" is searchable; "Chip X grew to 4x scope and finally landed 3 weeks later" is not.

### Recording deferrals in spawn-chips.md

```markdown
## Deferred (YYYY-MM-DD)

| Date | Chip | Reason | Subsumed by | Status |
|------|------|--------|-------------|--------|
| 2026-05-18 | INV-IMPL-014 (Operator-ID on Exec/Settle) | Scope discovered as cross-module FundJournalService refactor | INV-IMPL-023 + Gap-INV-FUND-JOURNAL-OPERATOR-LEAK | DEFERRED — needs architect signoff |
| 2026-05-18 | INV-IMPL-010 (Rename duplicate command) | RESOLVED for the rename; investigation surfaced custodian-flow-inactive | INV-IMPL-022 + Gap-INV-CUSTODIAN-FLOW-INACTIVE | RESOLVED (rename); ESCALATED (new chip) |
```

### Stat from pilot

Of the first 3 spawn-chip investigations:
- **1** closed cleanly with no scope expansion (INV-IMPL-013 chart-of-accounts spec rewrite — spec-only)
- **2** discovered architectural scope (INV-IMPL-010 + INV-IMPL-014)

Scope-discovery rate: **66% for spawn chips touching production code, ~0% for spec-only chips.** Plan accordingly.

---

## Compound chips (1 chip = multiple gaps)

When several P0s share root cause OR same fix surface, bundle them:

```markdown
**Title:** Fix audit identity in Settlement (createdBy:0 + 'auto-cron' strings)

**TLDR:** Settlement has same createdBy:0 anti-pattern as accounting...

**Prompt:**
This is a **compound bug** — three defects that share root cause...

## Defect 1: createdBy: 0 sentinel (5+ call sites)
[detail]

## Defect 2: 'auto-cron' string instead of user FK
[detail]

## Defect 3: DailySettlementLog missing trigger_source field
[detail]

## Combined Resolution
### Phase 1: ...
### Phase 2: ...

**This compound chip closes:**
- Gap-SE-R2-CREATEDBY-ZERO
- Gap-SE-R2-CATCHUP-AUDIT
- Gap-SE-R2-LOG-TRIGGER-SOURCE-MISSING
- Gap-SE-R1-AUTO-CRON-STRING
```

Benefits:
- Single PR (instead of 4)
- Single schema migration (instead of 4)
- Consistent test coverage (instead of overlapping)
- Operator identity model decided ONCE

Trade-offs:
- Larger PR = harder review
- One delay blocks all 4 gaps
- Use compound chips judiciously (3-5 related gaps; not 10)

## Anti-patterns when spawning chips

### Anti-pattern 1: Underspecified prompt

```markdown
**Title:** Fix the deadlock bug
**TLDR:** AccountService has a deadlock
**Prompt:** Look at AccountService::transfer and fix the deadlock.
```

The agent has no context. Will probably read the wrong file or invent context. Result: bad PR.

**Fix:** Include exact file:line, code snippet, evidence, acceptance criteria.

### Anti-pattern 2: Skipping acceptance criteria

Without acceptance criteria, the agent can't know when it's done. May over-engineer or under-deliver.

### Anti-pattern 3: Skipping regression tests

If the bug doesn't have a regression test after the fix, it'll regress in 6 months. Always require ≥1 test.

### Anti-pattern 4: Skipping cross-references

If the chip doesn't link back to the ZeeSpec, no one can trace WHY the change is needed.

### Anti-pattern 5: Spawning chips for spec drift

If the issue is "spec says line 265, production is at line 397" — that's spec drift. Fix inline. Don't burn a chip.

## Chip tracking

Maintain a list of dispatched chips in `docs/specs/zeespec/_meta/spawn-chips.md` — copy the
table format from `core/templates/_meta/spawn-chips.md` (the canonical template). This gives you
a single dashboard for "what production work is queued from spec findings."

## Done

You've reached the end of the workflow guides. The remaining files are templates + checklists.

Next: explore `core/templates/_template/` to start your first ZeeSpec.
