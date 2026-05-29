---
doc: workflow/05-apply-findings
type: workflow-checklist
phase: apply
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# Apply Findings — Fold Reviewer Output Back into Spec

> Time: 1-2 hours per module. Run after R1+R2.

## Inputs

- Original 10-file ZeeSpec (post-R3)
- R1 reviewer report
- R2 reviewer report

## Workflow

### Step 1: Categorize each finding (15 min)

For each finding from R1 + R2, decide:

| Category | Action |
|----------|--------|
| **Spec drift** (R3-class but missed) | Update spec file; mark Status tag correctly |
| **Production bug** | File in gaps.md; spawn task chip; do NOT fix inline |
| **Phantom claim** | Remove from spec OR mark as 🚧 DESIGN |
| **Cross-spec gap** | File in gaps.md; update both specs |
| **Compliance gap** | File in gaps.md; flag severity P0/P1; assign owner |
| **Dead code** | File in gaps.md (FU-X-DEAD-Y); document existence |

### Step 2: Update gaps.md (30 min)

Append a new section:

```markdown
## R1 + R2 Independent Reviewer Findings (YYYY-MM-DD)

> N findings total: X P0 + Y P1 + Z P2 (R1: A; R2: B)

### R1 P0 (X)
[entries with file:line citations]

### R2 P0 (B)
[entries]

### N spawn task chips created
[list]

### Remaining OPEN P0s not yet spawn-chipped
[list with reasons — usually doc-fix-only or one-time-audit]

### Top 3 inspector questions that fail TODAY
[real questions an auditor / compliance officer / regulator would ask — your local equivalent of FRC/SEC/ESMA/HIPAA/etc.]
```

### Step 3: Update gravity.md (20 min)

For each architectural finding, add or update a HW entry:

```markdown
### HW-MOD-NN: [new constraint]

- **Crosses:** [primitive cells that own the rule + Status + file:line — `what.md/INV-…`, `how.md/ALG-…`, `who.md/SOD-…`]
- **Why it's gravity:** [failure mode if those cells disagree — the only content unique to gravity]
- **Codified by:** [ADR pointer, optional]
```

Pointer-only — one fact, one cell (see METHODOLOGY § 9). Do NOT restate the rule, a Status tag, or a `file:line` here; those live in the primitive cell. Add the HW to the § 0 hardwiring index (HW → crossed cells; no status column). The R5/R3 normalization lint flags violations.

### Step 4: Update what.md (15 min)

For each invariant whose Status changed:

```markdown
| **INV-MOD-NN** | 🚧 NOT-ENFORCED (R1-P0-X correction YYYY-MM-DD) | [reason] | [source] |
```

Add a Status overview line at end of § Invariants showing recount:

```markdown
**Summary (post-R1+R2 YYYY-MM-DD):** ✅ X IMPL · 🟡 Y PARTIAL · 🚧 Z NOT-ENFORCED · 🚧 W DESIGN
```

### Step 5: Update how.md (15 min)

For each algorithm finding:
- If pseudocode is wrong → rewrite the affected ALG-MOD-NN section
- If state machine is wrong → rewrite + add diagram update
- If error path is missing → add validation table row in V-MOD-NN

### Step 6: Update where.md § 5 (10 min)

For each stack-binding drift:
- Update LOC counts
- Update line refs
- Update class names if renamed

### Step 7: Update CLAUDE.md (15 min)

Add an `R1 + R2 reviewer findings (YYYY-MM-DD)` section:

```markdown
## R1 + R2 reviewer findings (Tier 1 promotion YYYY-MM-DD — N findings)

### R1 P0 (X) — algorithm + correctness
[finding table with file:line]

### R2 P0 (B) — compliance + audit
[finding table]

### N spawn task chips created (cover M of (X+B) P0s)
1. [chip] — covers Gap-MOD-XXX + Gap-MOD-YYY
2. ...

### Remaining OPEN P0s not yet spawn-chipped
[list]

### Top 3 inspector questions that fail TODAY
[list]
```

Update the frontmatter:
```yaml
version: 0.X.0  # bump minor
status: design-intent (Tier 1 promotion YYYY-MM-DD; N total findings; M P0 OPEN)
last_updated: YYYY-MM-DD
```

### Step 8: Update README (5 min)

If your project has a `docs/specs/zeespec/README.md` listing all modules:

Update the module's row to reflect the new finding count + status + spawn chips.

### Step 9: Spawn task chips (per chip = 10 min)

For each P0 production bug, follow `06-spawn-task-chips.md`.

### Step 10: Commit (5 min)

Stage all updated spec files + commit:

```bash
git add docs/specs/zeespec/<module>/ docs/specs/zeespec/README.md
git commit -m "$(cat <<'EOF'
<module> ZeeSpec Tier 1 promotion v0.X.0 — N NEW R1+R2 findings

[Detailed body: B1 drift summary, R1 findings, R2 findings,
spawn task chips created, top inspector questions]

Co-Authored-By: Claude Code agent
EOF
)"
```

## Quality gates before commit

Run these checks before committing:

- [ ] All 10 files updated (or explicitly marked unchanged)
- [ ] Frontmatter version bumped
- [ ] frontmatter status reflects new state
- [ ] gaps.md has ALL findings catalogued with severity
- [ ] gravity.md HW table reflects new constraints
- [ ] CLAUDE.md ACTIVE ISSUES section is current
- [ ] README.md row reflects new finding count
- [ ] Spawn task chips dispatched for production bugs
- [ ] No P0 finding skipped without explicit justification

## Anti-patterns when applying findings

### Anti-pattern 1: Fixing production bugs inline

When R1+R2 finds a real production bug, the temptation is to immediately fix it in the same session. DON'T. Spawn a separate task chip with proper context, regression tests, acceptance criteria. Why?

- Session focus discipline (spec authoring vs bug fixing are different cognitive modes)
- Production fix needs proper PR review
- Spec session shouldn't end blocked on debugger

### Anti-pattern 2: Marking all PARTIAL as IMPL after one verification

If the reviewer says "this enforcement claim seems to hold", don't blanket-upgrade to ✅ IMPL. Keep 🟡 PARTIAL until you have a DB constraint OR a test pinning the invariant.

### Anti-pattern 3: Skipping the "Top 3 inspector questions" section

This is the most actionable artifact of R2. Skipping it means the next regulatory inspection (FRC / SEC / ESMA / HIPAA audit / etc.) finds the same gaps you already know about. Always document.

### Anti-pattern 4: Bumping version without status change

If you promoted from 🔵 Drafting → 🟡 Design-intent, version bump is right. If status didn't change, version bump is just noise. Be precise.

## Next: 06-spawn-task-chips.md
