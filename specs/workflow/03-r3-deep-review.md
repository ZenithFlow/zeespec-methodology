# R3 Deep Review — Same-Session Line-by-Line Verifier

> Time: 1-2 hours per module. Run after B1.

## Purpose

R3 = "same-session deep verifier". An AI agent reads each ZeeSpec file end-to-end AND the corresponding production code, looking for:
- Invariant claims that don't hold in production (AccountStatus pattern)
- Method/field/enum names that exist in spec but not in code (phantom)
- State machines that don't match reality
- Cross-spec references that don't bidirectionally exist

This is **same-session** — the agent does it as part of the authoring workflow (not a separate later pass).

## Inputs

- 10-file ZeeSpec (B1 already applied)
- Read access to production source

## Method

**Dispatch a single agent** with this prompt template:

```markdown
You are an R3 deep verifier for the <module> ZeeSpec at
`docs/specs/zeespec/<module>/`. Verify EVERY production claim against actual
`backend/src/` code (or your stack's source path).

**Already-verified B1 baselines (use as ground truth):**
[paste B1 output here — entity counts, enum counts, LOC, key line refs]

**Your task — be thorough:**

1. All entity column drift — read each entity file; verify spec's column claims
2. All N ADRs — verify production state matches what each ADR claims
3. All N invariants INV-MOD-NN — verify enforcement layer per each
4. All N HW-MOD entries — check each ✅/🟡/🚧 status against production
5. Service method line refs — spot-check 5-10 most-cited methods
6. State machine transitions — verify each transition has a service method
7. Enum case coverage — verify caller code uses cases the way spec claims
8. Cross-module integration points (cite file:line in sibling spec)

**Report format:** Group findings by severity:
- 🔴 P0 CRITICAL (real production bug, false invariant, AccountStatus pattern)
- 🟠 P1 IMPORTANT (phantom method, wrong line ref, missing guard)
- 🟡 P2 MINOR (typo, off-by-1 line drift)
- ✅ VERIFIED (claims match production)

Cite file:line for each finding. Be especially alert for AccountStatus pattern —
spec claims invariant enforced; production has bypass (or vice versa).

Keep report under 2000 words.
```

## Output

R3 agent produces a report categorized by severity. Apply findings:

| Finding type | Action |
|--------------|--------|
| 🔴 P0 production bug | File as gap in `gaps.md`; spawn task chip (see 06-spawn-task-chips.md) |
| 🔴 P0 spec drift | Update the spec file; rewrite the affected section |
| 🟠 P1 phantom method | Remove from spec; add deprecation note |
| 🟠 P1 line drift | Update cited line refs |
| 🟡 P2 typo | Fix in next edit |
| ✅ VERIFIED | Keep status; consider promoting from 🟡 PARTIAL → ✅ IMPL |

## Common R3 findings (patterns)

### Pattern 1: AccountStatus false-POSITIVE
Spec: "canWithdraw enforces kycLevel=FULL AND status=ACTIVE"
Production: Only kycLevel checked
→ Downgrade INV-X status from ✅ IMPL to 🚧 NOT-ENFORCED; file gap.

### Pattern 2: AccountStatus false-NEGATIVE
Spec: "no UNIQUE constraint on (user_id, device_id)"
Production: UNIQUE constraint actually exists
→ Upgrade INV-X status from 🚧 to ✅ IMPL; cite migration.

### Pattern 3: Phantom method
Spec: "repository->getLatestPrice($asset)"
Production: No such method
→ Update how.md to cite the actual method (or document it's design-only).

### Pattern 4: Dead enum case
Spec: "NotificationStatus has 5 cases incl. DELIVERED"
Production: Enum has 5 cases but DELIVERED is never set (no Postmark webhook ingestion)
→ File as FU-X-DEAD-STATUS; mark enum case as DEAD; clarify state machine.

### Pattern 5: Phantom DTO field
Spec: "matcher Strategy 8 uses senderRegistrationNumber field"
Production: DTO doesn't have that field
→ File as FU-X-MATCHER-STRATEGY-8-DEAD.

### Pattern 6: Dead transport (similar to dead enum case)
Spec: "3 SMS priority transports route by message subclass"
Production: ALL SMS go to high_priority; 2 transports defined but unused
→ File as FU-X-SMS-PRIORITY-DEAD.

### Pattern 7: createdBy: 0 anti-pattern
Spec: "operator identity captured via createdBy field"
Production: hardcoded `createdBy: 0` in 5+ call sites
→ File as FU-X-CREATEDBY-ZERO; spawn task chip with audit-identity fix.

## Severity calibration

Don't escalate everything to P0. Calibrate:

| Severity | Examples |
|----------|----------|
| 🔴 P0 | Money loss, compliance violation, data corruption, runtime crash blocking core flow |
| 🟠 P1 | Audit gap, dead code in production, missing guard, false invariant claim |
| 🟡 P2 | Stale line ref (<200 lines), typo, off-by-1, minor enum drift |
| 🟢 P3 | Style, naming inconsistency, low-priority cleanup |

## R3 anti-patterns (don't do these)

- ❌ Just running `grep` and reporting counts (that's B1 territory)
- ❌ Verifying only happy-path code (check error handling too)
- ❌ Skipping cross-spec verification (the bidirectional cross-link rule matters)
- ❌ Marking everything ✅ after a quick skim (R3 is the deep verifier)
- ❌ Fixing production bugs inline (use spawn task chips instead)

## When R3 finds 0 issues

If R3 reports 0 findings, you've either:
- (a) Written a perfect spec (rare; possible for very small modules)
- (b) Hit a R3 agent that didn't dig deep enough → re-run with stricter prompt

In case (b), re-prompt with: "You found 0 issues — that's suspicious for a module
with N production files. Verify ALL N invariants by quoting the production code
line that enforces each."

## Next: 04-r1-r2-parallel-review.md
