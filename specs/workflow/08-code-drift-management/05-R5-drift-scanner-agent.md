---
doc: workflow/08-code-drift-management/05-R5-drift-scanner-agent
type: agent-prompt
phase: code-drift-management
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# R5 — Drift Scanner Agent

> Specialized agent prompt for **automated drift scanning**. Complements (does not replace) the CI / git-hook script approach (see `03-auto-drift-detection.md`). Use R5 when you want LLM-quality categorization of findings, not just mechanical greps.

## When to use R5 vs CI script

| Need | Use |
|------|-----|
| Fast PR-time feedback (< 60 sec) | CI script |
| Catch Type 1 + Type 2 drift mechanically | CI script |
| Categorize Type 3 (behavioral) drift | R5 agent |
| Distinguish bug vs intentional design change | R5 agent |
| Recommend retroactive ADR vs spawn chip | R5 agent |
| Scheduled (Layer 2) review with judgment | R5 agent |
| Triggered (Layer 3) pre-flight before refactor | R5 agent |

Combine: CI script as first pass; R5 agent for deeper review of CI findings + Type 3+4 detection.

## Tool requirements

R5 needs:
- **Read** — read spec files + production code
- **Bash** (optional) — for grep / find / git diff operations
- **Write** — produce drift report markdown

R5 typically does NOT need:
- WebFetch (drift is internal to codebase; not external authority)
- External tools

## Dispatching R5

```javascript
// Single-module deep scan:
Agent({
  subagent_type: "general-purpose",
  description: "R5 drift scan — <module>",
  prompt: [paste prompt body below, customized],
  run_in_background: false
})

// Multi-module scan (parallel):
// Dispatch N agents in single message, one per module
```

## Prompt body (paste to agent)

```markdown
You are R5 — code drift scanner for the <module> ZeeSpec.

**Mission:** Detect drift between the spec at `docs/specs/zeespec/<module>/`
and the production code at `<source-root>/<MODULE>/`. Categorize findings
per the 4-type framework. Recommend resolution path per type.

**Methodology to follow (read these first if unfamiliar):**
- `docs/specs/zeespec/workflow/08-code-drift-management/00-START-HERE.md`
- `02-drift-categorization.md` — 4-type framework + severity
- `04-drift-resolution-playbook.md` — per-type recipes

**Module:** <name>
**Spec dir:** docs/specs/zeespec/<module>/
**Code dir:** <source-root>/<module>/
**Last scan date:** [YYYY-MM-DD or "first scan"]
**Scope:** [full module / specific dimension(s) / specific INV/HW]

**Type 1 — Citation drift detection:**

For every `file:line` citation in spec files:
1. Verify the file exists at the cited path
2. Verify the cited line contains the cited symbol (method, class, etc.)
3. If line drifted: note the new line (search for the symbol)
4. If file moved: note new path
5. If symbol renamed: note new name

Report format:
| Spec citation | Spec file:line | Production location | Drift |
|---------------|----------------|---------------------|-------|

**Type 2 — Field / enum / count drift:**

For each entity / enum / table mentioned in spec:
1. Find the corresponding code file (Java entity / Python model / TS interface / etc.)
2. Count fields / cases / columns
3. Compare to spec's claimed count

Use the stack-appropriate counting recipe from
`workflow/02-b1-verification.md` § "Stack-specific grep patterns".

Report format:
| Entity/Enum | Spec count | Production count | Drift | Spec file:line |
|-------------|-----------|------------------|-------|----------------|

**Type 3 — Behavioral drift detection:**

For each ALG-MOD-NN in `how.md`:
1. Find the cited method in production
2. Read the method end-to-end
3. Compare to the algorithm pseudocode in spec
4. Identify any divergence in:
   - Validation rules
   - Branching logic
   - State transitions
   - Error handling
   - Side effects (DB writes, event emissions, etc.)

For each INV-MOD-NN in `what.md`:
1. Find the enforcement path in code
2. Verify enforcement still happens at every relevant entry point
3. Look for bypass paths (new code added since spec; doesn't go through enforcement)

Report format:
| INV/HW/ALG ID | Spec claim | Code behavior | Category | Recommended action |
|---------------|-----------|---------------|----------|---------------------|

For category, choose:
- **Bug (Recipe T3-bug):** code is wrong; spec is right; file spawn chip
- **Design change (Recipe T3-design):** code is intentional new behavior; spec is now wrong; write retroactive ADR + update spec

To distinguish:
- Read git blame for the relevant code
- Read PR description that introduced the change
- Look for ADR file referencing this code
- Search Slack history if accessible

If unclear: mark as 🟡 RES-MOD-R5-NN and recommend manual investigation.

**Type 4 — Architectural drift detection:**

Compare spec's where.md § 5 (Tech Stack Binding) + how.md flow diagrams
to current code structure:

1. Module boundaries: are the named services still the same shape?
2. Cross-module calls: do they still go through the same paths?
3. Sync vs async: any flow that was sync now async (or vice versa)?
4. Storage layers: same DB / cache / queue stack?
5. New dependencies: any added since spec?

This requires human judgment more than mechanical scanning. Use code structure
overview tools (file tree, package structure, dependency graph if available).

Report any architectural mismatch as Type 4 finding (🚨 P0 default).

**Output format:**

```markdown
# R5 Drift Scan — <module> YYYY-MM-DD

**Agent:** R5 drift scanner
**Module:** <module>
**Spec version cited:** <version from frontmatter>
**Scope:** <what was scanned>
**Time spent:** ~N minutes

## Summary

- Type 1 (citation): N findings (M low-severity)
- Type 2 (field/enum): N findings (M moderate)
- Type 3 (behavioral): N findings (M high)
- Type 4 (architectural): N findings (M critical)
- 🚨 P0: N | 🟠 P1: M | 🟡 P2: K | 🟢 P3: J

## Type 1 findings

[table per format above]

## Type 2 findings

[table per format above]

## Type 3 findings

[detailed per-finding writeup; one section per finding]

### Finding T3-001 — [title]
- **Severity:** 🚨 P0 / 🟠 P1 / 🟡 P2
- **Spec INV/HW/ALG:** <ID>
- **Spec claim:** <quoted from spec>
- **Code behavior:** <observation + file:line>
- **Diagnosis:** [bug | intentional change | regression | unclear]
- **Recommended action:** [Recipe T3-bug | Recipe T3-design | RES-MOD-R5-NN]
- **Spawn chip needed:** [yes/no + rationale]
- **ADR needed:** [yes/no + rationale]
- **Files to update if accepted:** [spec files list]

## Type 4 findings

[detailed per-finding writeup]

### Finding T4-001 — [title]
- **Severity:** 🚨 P0 (architectural; default)
- **Old architecture (per spec):** <description>
- **New architecture (per code):** <description>
- **Affected modules:** <list>
- **ADR required:** YES (architectural drift always requires ADR)
- **Cross-module impact:** <list of sibling modules to coordinate>

## Recommended next steps

1. [Highest-priority finding] → [action] → [owner]
2. [Next finding] → ...

## Open research questions

[RES-MOD-R5-NN entries for findings requiring manual investigation]

## Re-scan due

Next scheduled drift scan: YYYY-MM-DD (per `01-drift-detection-strategies.md`)
```

**Important constraints:**

1. ONLY report drift you can verify (citation found vs not; count A vs B). Don't speculate.
2. For Type 3 (behavioral): be SPECIFIC about what spec says + what code does + what differs. Avoid vague "spec out of date."
3. For Type 4 (architectural): require structural change, not just renames. Renames are Type 1.
4. Recommend EITHER spawn chip OR ADR, not both, per resolution recipe.
5. If category is unclear, file as RES-MOD-R5-NN (research question) — don't force a category.
6. Don't propose spec edits for Type 3-design without writing ADR first.
7. For Type 1 (citation): auto-recommend the find-and-replace; this is mechanical.
8. Token budget: aim for 2000-4000 words output. Don't paste large code blocks (cite by file:line).

**Time budget:** Aim for 15-45 min agent runtime per module.
```

## Variations of the prompt

### Variation A — Quick scan (Type 1 + 2 only, no Type 3+4)

When you just want fast mechanical drift findings:

```markdown
[modify scope:]

**Scope:** Type 1 (citation) + Type 2 (field/enum) drift ONLY.
Skip Type 3 (behavioral) + Type 4 (architectural).

Aim for < 10 min agent runtime per module. This is a fast-screen mode.
```

### Variation B — Triggered (post-PR)

After a major PR merges:

```markdown
[add context:]

**Trigger:** PR #NNN was merged YYYY-MM-DD touching this module.
**PR title:** "<PR title>"
**PR description summary:** "<key points>"
**Files changed:** [list from `git diff --name-only`]

Focus drift scan on:
- Files changed in the PR
- Cross-impact: spec sections that reference those files
- New functionality introduced

Compare to spec; any drift introduced by this PR should be addressed
BEFORE next PR.
```

### Variation C — Scheduled (Layer 2 quarterly)

For deep quarterly review:

```markdown
[modify scope:]

**Scope:** FULL module deep scan
**Last scheduled scan:** YYYY-MM-DD (N months ago)
**Commits since last scan:** [output of `git log --oneline <range>`]

Beyond standard drift detection, also:
- Verify every INV-MOD-NN status tag is still accurate (read code; not spec)
- Verify every HW-MOD-NN constraint is still honored
- Check for "phantom methods" (cited in spec; absent in code)
- Check for "phantom invariants" (claimed in spec; no enforcement code)
- Review CLAUDE.md "Drift items" table for unresolved items > 90 days old

Output should be a comprehensive drift health report for the module.
```

### Variation D — Multi-module sweep

For periodic cross-module scan:

```markdown
[modify scope:]

**Scope:** ALL modules in docs/specs/zeespec/
**Per-module budget:** 5-10 minutes (quick scan per module)

For each module:
- Run Type 1 quick scan
- Run Type 2 quick scan
- Flag any module with > N Type 1 OR > M Type 2 findings for deeper R5 follow-up

Output: prioritized list of modules ranked by drift severity. Top 3
deserve deep R5 (full prompt body).
```

## Combining R5 with other agents

R5 produces drift findings. Often, those findings need follow-up by other agents:

```
R5 detects Type 3-design drift
        ↓
R5 recommends "write ADR-MOD-NNN"
        ↓
Dispatch R6 (ADR Curator Agent) to draft the ADR
        ↓
Spec author reviews + commits

R5 detects Type 3-bug drift
        ↓
R5 recommends "spawn chip for production fix"
        ↓
Dispatch spawn-chip workflow (workflow/06-spawn-task-chips.md)
        ↓
Engineer picks up chip + fixes
```

R5 is the orchestrator that decides what to dispatch next.

## R5 output → spec edits

R5 PRODUCES recommendations; HUMAN reviews + applies:

```
R5 output (drift report) → reviewer reads → triages → either:
  ├── Accept → spec edit (T1/T2) OR ADR (T3-design/T4) OR chip (T3-bug)
  ├── Reject → mark as RES-MOD-R5-NN; note rationale
  └── Defer → mark RESPONSE-PENDING; revisit in N weeks
```

Never auto-apply R5 output without human review. False positives + nuance both exist.

## Calibrating R5 reliability

Expected accuracy by type:

| Type | R5 accuracy | Human verification |
|------|-------------|---------------------|
| Type 1 | ~95% (very mechanical) | Light spot-check |
| Type 2 | ~85% (false positives from comment lines etc.) | Verify each finding |
| Type 3 | ~70% (judgment-heavy) | Full review |
| Type 4 | ~50% (very judgment-heavy) | Architect review |

If accuracy lower than these: adjust prompt; provide more context; per-stack tuning.

## Limitations

R5 cannot:
- Read git history beyond what Bash tool allows
- Access Slack / Confluence / email for design-intent context
- Talk to engineers about intent
- Read PR descriptions outside what's in git
- Know about regulatory changes (that's R4)

For limitations: file as RES-MOD-DRIFT-NN; escalate to human.

## When R5 finds suspected regulatory drift (R5 → R4 handoff)

R5 detects spec ≠ code (drift). But sometimes the drift is downstream of regulatory change R4 should have caught:

**Pattern:** spec says "CTR threshold = 20M MNT" but code uses 30M MNT. Two interpretations:
- **Type 3-bug** (R5 default): code is wrong; spec is right; spawn chip to fix code
- **Authority-driven drift** (R4 territory): regulator amended law; code reflects new law; spec is stale

R5 cannot distinguish these without checking the underlying authority. If R5 finds drift involving a value that LOOKS authority-driven (threshold, deadline, retention window, jurisdictional definition), R5 should:

1. Flag as `RES-MOD-DRIFT-NN` with category `authority-suspected`
2. Recommend: "Dispatch R4 (per `workflow/07-r4-regulatory-research/06-re-validation-strategy.md`) to re-validate the source — may be authority-driven drift, not code-bug"
3. Do NOT auto-categorize as Type 3-bug
4. Do NOT recommend spawn chip until R4 confirms

After R4 completes:
- If authority unchanged → R5 categorization stands; Type 3-bug; spawn chip
- If authority amended → drift is authority-driven; write retroactive ADR per `workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`; update spec; no spawn chip needed

This handoff prevents R5 from filing chips that mistakenly "fix" code that's actually correct relative to amended law.

## When R5 finds drift requiring ADR (R5 → R6 handoff)

For Type 3-design + Type 4 drift:

1. R5 produces finding + recommends "ADR needed"
2. Human reviewer accepts the recommendation (R5 doesn't auto-dispatch)
3. Human dispatches R6 Mode A (draft retroactive ADR) per `workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md`
4. R6 drafts ADR using R5's finding as input
5. Human reviews + accepts ADR
6. Spec updates applied; drift item marked RESOLVED

Don't auto-dispatch R6 from R5 — human review of the categorization decision (bug vs design) is mandatory.

## Cross-references

- `01-drift-detection-strategies.md` — when to dispatch R5 vs CI script vs manual
- `02-drift-categorization.md` — 4-type framework R5 uses
- `03-auto-drift-detection.md` — CI script (complementary)
- `04-drift-resolution-playbook.md` — what to do with R5 findings
- `workflow/09-adr-lifecycle/` — where R5 routes Type 3-design + T4 findings
- `workflow/06-spawn-task-chips.md` — where R5 routes Type 3-bug findings
- `workflow/02-b1-verification.md` — quantitative recipes R5 references

## Next

→ Apply R5 in your project via `04-drift-resolution-playbook.md` recipes
→ For Type 3-design + T4 findings: `workflow/09-adr-lifecycle/`
