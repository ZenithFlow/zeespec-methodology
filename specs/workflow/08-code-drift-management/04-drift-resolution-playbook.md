---
doc: workflow/08-code-drift-management/04-drift-resolution-playbook
type: workflow-method
phase: code-drift-management
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# Drift Resolution Playbook — Per-Type Recipes

> For each drift finding, follow the recipe for its type. Recipes include: who acts, what artifacts produced, where findings go, how to close the loop.

## Recipe T1 — Citation drift resolution

**Trigger:** Type 1 finding (file:line citation stale).

**Owner:** PR author OR spec author (whoever touches first).

**Recipe:**

```
1. Identify all stale citations (drift report tells you which)

2. Determine new location:
   - Method renamed? → find new name via git log / blame
   - File moved? → find new path via git log --follow
   - Method moved? → find new file via grep

3. Search-and-replace in spec:
   - Use IDE search-and-replace across .md files
   - Verify each replacement (don't blindly accept)

4. Commit spec edit:
   git add docs/specs/zeespec/<module>/*.md
   git commit -m "B1 citation drift: update refs for <module> after <refactor>"

5. Update CLAUDE.md drift items table:
   - Mark D# as 🟢 RESOLVED with commit hash

6. (Optional) Improve future durability:
   - Cite SYMBOL not LINE: "see AccountingService.createJournal()"
     instead of "see AccountingService.php:265"
   - Citing line is precise but fragile; symbol-based citation survives refactor
```

**Time:** 15-30 min for typical drift.
**Severity:** 🟡 P2.
**Artifacts:** spec edit + CLAUDE.md drift table update.
**ADR needed?** No.
**Chip needed?** No.

## Recipe T2a — Field/enum drift (no new invariant)

**Trigger:** Type 2 finding where new field is just data, no invariant implied.

**Owner:** Spec author OR PR author (engineer who added field).

**Recipe:**

```
1. Verify finding:
   - Run B1 verification quantitative grep per stack recipe
   - Confirm field count drift

2. Read git history for the new field(s):
   git log -p -- backend/src/Entity/Wallet.php | grep -A 5 "freeze_reason"
   
   - What PR added it? Read PR description
   - Why was it added? Bug fix, feature, refactor?

3. Categorize: does the new field add an INVARIANT?
   - Pure data (e.g., user's profile picture URL): NO invariant
   - Status flag (e.g., is_active): MAYBE invariant
   - Workflow data (e.g., approval_token): LIKELY invariant
   - Audit data (e.g., last_modified_by): YES invariant

   → If MAYBE / LIKELY / YES: switch to Recipe T2b

4. If NO invariant (just data):
   - Update what.md § entity table with new field
   - Update field count claim
   - Commit: "B1 drift: add 2 fields to Wallet entity (data only)"

5. Update CLAUDE.md drift items table → RESOLVED
```

**Time:** 30 min per entity.
**Severity:** 🟡 P2.
**Artifacts:** spec edit + drift table update.
**ADR needed?** No.

## Recipe T2b — Field/enum drift (new invariant)

**Trigger:** Type 2 finding where new field introduces or implies invariant.

**Owner:** Spec author (after consultation with PR author / domain expert).

**Recipe:**

```
1. Verify finding + identify new field's purpose (Recipe T2a steps 1-3)

2. Document the invariant:
   - Open what.md § 2 Invariants
   - Add INV-MOD-NN with:
     - Statement of what's invariant
     - Status tag (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN)
     - Source code citation (file:line)
     - Enforcement layers (DB / app / test)

   Example: new field `frozen_until TIMESTAMPTZ`
   
   ### INV-WAL-XX — Frozen wallets cannot transact until frozen_until
   Status: ✅ IMPL (verify via R3-style check)
   Source: WalletService.processDeposit() line NN checks frozen_until
   
   - DB: wallet.frozen_until TIMESTAMPTZ NULL
   - App: walletService rejects tx if frozen_until > NOW()
   - Test: ...

3. Update what.md § entity table with new field + reference INV

4. Update CLAUDE.md "Drift items" table

5. Commit: "B1 drift + new invariant: INV-WAL-XX for frozen_until field"

6. If new field added in PR that didn't have an ADR but the design
   decision was non-obvious → recommend retroactive ADR (see Recipe T3-design)
```

**Time:** 1-2 hours per invariant.
**Severity:** 🟠 P1 typically.
**Artifacts:** spec edit (INV + entity) + drift table.
**ADR needed?** MAYBE (if design decision was material).

## Recipe T3-bug — Behavioral drift (production bug)

**Trigger:** Type 3 finding where code behavior is wrong (does not match spec; spec is right; code is buggy).

**Owner:** Engineering team (via spawn task chip).

**Recipe:**

```
1. Confirm bug categorization:
   - Spec intent: clear + correct
   - Code: incorrect implementation OR regression
   - Test: missing OR broken (let bug through)

2. Diagnose severity:
   - Customer impact? Money loss? Compliance gap?
   - Reproducibility (always vs rare)
   - How long has this been in production?

3. File spawn task chip per workflow/06-spawn-task-chips.md:
   - Title: "Fix <bug description>"
   - TLDR: 1-2 sentences
   - Prompt: full self-contained 500-3000 words including:
     - Verified production state (file:line evidence)
     - Why this matters
     - Resolution plan
     - Files to read
     - Regression test must add
     - Acceptance criteria
     - Severity + estimated effort

4. Update gaps.md:
   - File as Gap-MOD-DRIFT-NN
   - Severity per severity-matrix.md
   - Status: 🔴 OPEN (spawn chip created YYYY-MM-DD)

5. Update CLAUDE.md drift table:
   - Type: 3 (behavioral)
   - Resolution: chip XYZ

6. DO NOT update spec to match bug. Spec is source of truth for INTENT.
   Code will be restored to align with spec.

7. After chip merged + verified:
   - Close gap entry: 🟢 RESOLVED with PR link
   - Update CLAUDE.md drift table → RESOLVED
   - B1 + R3 spot-check that the fix actually aligned with spec
```

**Time:** 1-3 hours spec work + chip; actual fix is engineering work (days to weeks).
**Severity:** 🟠 P1 → 🚨 P0 depending on impact.
**Artifacts:** gap entry + spawn chip + spec NOT changed.
**ADR needed?** No (no design change; bug fix).

## Recipe T3-design — Behavioral drift (intentional design change)

**Trigger:** Type 3 finding where code does X; spec says Y; X is the new intended behavior.

**Owner:** Spec author + engineering tech lead + (sometimes) architect.

**Recipe:**

```
1. Confirm intentional change:
   - PR description explicitly states design change
   - Engineering tech lead confirms intent
   - Customer / product confirms acceptance of new behavior

2. Write retroactive ADR per workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md
   - ADR-MOD-NNN documenting the change + rationale
   - Reference the original PR that introduced the change
   - List affected INV/HW entries
   - Note any compensating controls (if change removes prior invariant)

3. Update spec to reflect new reality:
   - INV-MOD-NN: update statement OR mark SUPERSEDED + add INV-MOD-NN+1
   - HW-MOD-NN: update if cross-cutting; may need full re-author of gravity.md section
   - how.md: update algorithm pseudocode
   - what.md: update fields/enums if changed

4. Status tags:
   - If new behavior is fully enforced: keep ✅ IMPL with updated semantics
   - If new behavior is partial: 🟡 PARTIAL
   - If new behavior creates a gap: 🚧 NOT-ENFORCED + file gap

5. Verify NO compliance / safety invariants were silently broken
   - Specifically check HW-MOD-* (cross-dimension constraints)
   - If any HW broken: this is more than a design change; escalate

6. Update CLAUDE.md ADR table with new ADR-MOD-NNN entry

7. Update CLAUDE.md drift table → RESOLVED via ADR

8. Inform downstream module spec authors (cross-link bidirectionality)
```

**Time:** 2-4 hours (ADR + spec re-author of affected sections).
**Severity:** 🟠 P1 typically; 🚨 P0 if HW broken.
**Artifacts:** ADR file + spec updates + drift table.
**ADR needed?** YES (mandatory).
**Chip needed?** Only if compensating engineering work needed.

## Recipe T4 — Architectural drift

**Trigger:** Type 4 finding (module split / merge / sync→async / cross-module boundary change).

**Owner:** Architect + spec author + tech lead (full team).

**Recipe:**

```
1. Halt spec edits until architectural state is captured:
   - Don't try to patch spec incrementally
   - Plan deliberate re-author

2. Write architectural ADR:
   - ADR-MOD-NNN: "Module split / refactor / boundary change"
   - Rationale + alternatives considered
   - Migration approach
   - Impact on cross-module HW constraints

3. Decide module shape:
   - Same module, updated where.md + how.md + gravity.md?
   - Split into multiple modules?
   - Merge into existing sibling?
   - Archive old + start new?

4. Per the shape decision:

   A. If SAME MODULE (updated dimensions):
      - Re-author how.md (new flow)
      - Re-author where.md § 5 (new tech binding)
      - Re-author gravity.md (HW may differ; sync→async = new atomicity story)
      - Re-do B1 + R3 + R1+R2 for module

   B. If SPLIT INTO MULTIPLE:
      - Create new module dirs with full 10-file scaffold
      - Cross-link via gravity.md "Inherited HW"
      - Mark old module SUPERSEDED in CLAUDE.md
      - Optionally keep old as archive for historical reference
      - Re-do B1 + R3 + R1+R2 for EACH new module

   C. If MERGED:
      - Single new spec absorbs both old specs' content
      - Old modules SUPERSEDED
      - Cross-module HW becomes intra-module (simpler)

5. Cross-module impact:
   - For each module that referenced this one:
     - Update their gravity.md "From X" sections
     - Update their CLAUDE.md "depends on" tables
     - Notify their owners

6. Engineering review:
   - Architecture diagram updated
   - Code reviewers / testers briefed on new boundary

7. CLAUDE.md ADR table + drift table updated

8. Compliance review if module touches regulated workflow
```

**Time:** Days to weeks (large refactor; full re-author).
**Severity:** 🚨 P0 by default.
**Artifacts:** Architectural ADR + re-authored modules + cross-module updates.
**ADR needed?** YES (mandatory; architectural).

## Edge cases

### Drift spanning multiple types

A single PR may introduce drift in multiple categories:
- New field (Type 2) that adds a new invariant (Type 2b)
- That invariant is enforced via new algorithm (Type 3-design)
- That algorithm splits behavior into a new sub-service (Type 4)

Resolve in order: write ADR first (Type 4 needs ADR before everything else); then per-type recipes.

### Drift in dependency module

Spec for module A relies on module B's HW-B-04. Module B's spec drifted; HW-B-04 changed.

Recipe:
1. Coordinate with module B owner
2. Module B owner runs Recipe T3-design (write ADR for the change)
3. Module A owner updates inherited HW section in gravity.md
4. Bidirectional cross-link updated per `checklists/cross-link-bidirectionality.md`

### Drift you can't explain (mystery field)

You find a field in production with no obvious purpose. Git blame is unhelpful. No one remembers.

Recipe:
1. Don't speculate. File as 🟡 RES-MOD-DRIFT-NN research question
2. Search Slack history, PR comments, design docs
3. If still mystery: ask in team channel
4. If still mystery after 1 week: mark as 🚧 DESIGN with note "purpose unclear; flagged for tech lead review"
5. Eventually purposed becomes clear OR field deprecated

### Drift in a fragment owned by external team

Code change in shared library / SDK used by your module.

Recipe:
1. Confirm change in shared library (read its changelog)
2. Update spec to note new behavior
3. If behavior change touches your invariants: per Recipe T3 (bug or design)
4. May need cross-team ADR

## Bulk drift cleanup

Once a year, schedule a focused "drift cleanup" sprint:

```
Week 1: Run drift scan across ALL modules (1 day)
        Triage findings into buckets (1 day)
        Plan resolution (1 day)
        
Week 2: Type 1 fixes (mass find-and-replace; 2 days)
        Type 2 fixes (per-entity; 2 days)
        
Week 3: Type 3-design fixes (write ADRs + spec re-author; 5 days)

Week 4: Type 4 escalations (architect review; 5 days)
```

After bulk cleanup: re-baseline + restart continuous monitoring.

## Drift resolution KPIs

Track these to know if drift management is working:

- **Drift detection rate** — how many drift items detected per quarter
- **Drift resolution time (T1):** target < 7 days
- **Drift resolution time (T2):** target < 30 days
- **Drift resolution time (T3):** target < 90 days (depending on chip turnaround)
- **Drift resolution time (T4):** target < 1 quarter
- **Open-drift age (P0):** target 0 days > 30 days old
- **Open-drift age (P1):** target 0 items > 90 days old
- **ADRs written per quarter** — should correlate with Type 3-design + Type 4 findings

If KPIs slip: increase Layer 2 cadence; add ownership clarity; revisit severity calibration.

## Anti-patterns in resolution

1. **Spec edit without understanding the change** — silent acceptance of behavioral drift = lose source of truth
2. **Spawn chip for every drift** — many drift items are NOT bugs; chips create noise
3. **ADR for every drift** — only Type 3-design + Type 4 need ADR; not Type 1 or 2
4. **Resolving Type 3 silently as Type 2** — if behavior changed, that's Type 3 not "just a new field"
5. **Drift report sits unread** — auto-detection without manual triage is useless
6. **Owner = "team"** — no single accountable person; nothing gets done
7. **Resolving drift in production code** when spec was right ("just change the spec to match code") — gives up source of truth

## Cross-references

- `01-drift-detection-strategies.md` — how drift is found
- `02-drift-categorization.md` — 4-type framework (where each type comes from)
- `03-auto-drift-detection.md` — automation (Layer 1)
- `05-R5-drift-scanner-agent.md` — agent for detection
- `workflow/06-spawn-task-chips.md` — chip format (Recipe T3-bug)
- `workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md` — Recipe T3-design + T4
- `checklists/severity-matrix.md` — severity calibration
- `checklists/cross-link-bidirectionality.md` — multi-module drift

## Next

→ `05-R5-drift-scanner-agent.md` — AI agent for drift scanning
→ `workflow/09-adr-lifecycle/` — ADR workflow that complements drift resolution
