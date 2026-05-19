---
doc: workflow/04-r1-r2-parallel-review
type: workflow-checklist
phase: R1-R2-parallel-review
version: 2.4.0
status: stable
last_updated: 2026-05-19
---

# R1 + R2 Parallel Independent Reviewers

> Time: 1-2 hours wall-clock per module (2x parallel agents). Run after R3.

## Purpose

R1 + R2 catch what R3 misses. R3 verifies what the spec claims; R1 + R2 look for what the spec DOESN'T claim but should:

- **R1 = algorithm + race conditions + invariant correctness** — finds dead code in service classes, double-entry violations, race windows
- **R2 = compliance + audit + cross-module + regulation** — finds audit identity gaps, regulatory violations, cross-spec drift

**Critical:** R1 and R2 run in PARALLEL (single message, multiple agent invocations) — not sequential. They have independent perspectives and shouldn't bias each other.

## Inputs

- 10-file ZeeSpec (R3 already applied)
- Production source access
- Cross-spec references (sibling ZeeSpecs)

## Method

Dispatch two agents in parallel. In one message, fire both. In Claude Code, use a single function_calls block with two Agent invocations.

## R1 Prompt Template (algorithm + race conditions)

```markdown
You are R1 — independent reviewer for the <module> ZeeSpec at
`docs/specs/zeespec/<module>/`. R3 was done [date] (found N P0 + M P1 + K P2).
Your job: catch what R3 missed, focusing on algorithm semantics, service-layer
call patterns, race conditions, and cross-module orchestration.

**R3 already verified (don't re-check):**
[List R3's key verifications + already-applied findings]

**R1 focus areas — look for issues R3's line-grep approach misses:**

1. [Algorithm correctness] — Read the main service end-to-end. Does the
   algorithm match the pseudocode in `how.md`? Any edge cases not covered?

2. [Race conditions] — Look for check-then-act patterns without locks.
   What if two requests race?

3. [Service-layer integration] — Trace 3-5 critical call chains end-to-end.
   Are there partial-failure windows?

4. [Dead code in services] — `grep` for documented methods. Are any unused
   in production?

5. [State machine consistency] — Verify state transitions actually fire.

6. [Cross-module ordering] — If module X depends on module Y running first,
   is the order enforced or assumed?

7. [Numeric precision / money math] — Decimal / BigDecimal / fixed-point scale
   consistency across boundaries (whatever your stack uses; never use float for money)

8. [Pseudocode validation] — Pick 3 ALG-X-NN entries in `how.md`. Compare
   to actual production. Any drift?

**Report format:** Group by severity (P0/P1/P2/✅). Cite file:line for each.
Keep under 2000 words. Focus on what R3's line-by-line approach would have
missed — semantic correctness, race conditions, hidden orchestration.
```

## R2 Prompt Template (compliance + audit + cross-module)

```markdown
You are R2 — independent compliance/audit reviewer for the <module> ZeeSpec.
R3 was done [date]; R1 is running in parallel. Your job: catch issues R3 + R1
might miss, focusing on regulation, audit trail, cross-module breakage,
and operator workflows.

**Domain context:** [your jurisdiction + applicable regulations]
[Pick one row that matches your context; pilot example shown last as reference detail level:
 - EU finance: ESMA / national securities regulator; GDPR; PSD2; MiFID II
 - US finance: SEC / FINRA; BSA/AML; SOX; CTR $10K threshold
 - Healthcare (US): HIPAA + state privacy laws; HITECH breach-notification
 - Healthcare (EU): GDPR Article 9 + national health-data laws
 - E-commerce / SaaS: PCI-DSS + GDPR / CCPA
 - Government: FedRAMP / FISMA / ISO 27001
 - Pilot: Mongolia FRC; 7-year AML retention; CTR 20M MNT]

**Already-known issues — don't re-report:**
[List R3's findings + R1 likely findings to dedupe]

**R2 focus areas:**

1. [Regulatory compliance] — Domain-specific (your local regulator, GDPR / HIPAA / PCI-DSS / SOX, etc.).
   What would an inspector ask first?

2. [Audit trail completeness] — Every state transition logged with
   operator identity + timestamp?

3. [Segregation of Duties] — Can a single user create + approve + execute?
   Are role gates real?

4. [Cross-module integrity] — If another spec claims this module honors
   constraint X, does production actually honor it?

5. [Retention + soft-delete] — Are audit-trail tables protected from hard
   DELETE? Soft-delete trait present?

6. [Data residency / encryption] — If the regulation requires data stay in
   a specific region, is it pinned?

7. [Operator identity capture] — Look for `createdBy: 0` or similar sentinels.

8. [Notification + escalation] — Failures dispatched? Stuck-state alarmed?

9. [Periodic reporting cycle — if applicable] — Closing entries / period-end snapshots / batch jobs run on schedule? Required reports auto-generated? *Skip this section if your domain has no periodic regulatory reporting (e.g., pure SaaS, non-regulated e-commerce).*

10. [Top 3 inspector questions] — "Show me the audit trail for X" /
    "Who posted Y?" / "Show closing entries for prior period". Which fail today?

**Report format:** Group by severity (P0/P1/P2/✅). Cite file:line for each.
Focus on what a compliance auditor would find. Keep under 2000 words.
```

## How to dedupe R1 + R2 findings

After both agents report:

1. **De-duplicate** — same finding from both = file once (cite both)
2. **Merge** — related findings = file as compound gap
3. **Conflict resolution** — if R1 + R2 disagree, R3 runs spot-check
4. **Severity adjustment** — if both flag P1 independently, often actually P0

## Output: gaps.md additions

Add a new section to `gaps.md`:

```markdown
## R1 + R2 Independent Reviewer Findings (YYYY-MM-DD)

> R1 (algorithms) + R2 (compliance) parallel review caught N findings:
> - R1: X P0 + Y P1 + Z P2
> - R2: A P0 + B P1 + C P2
> - Combined: N findings total

### R1 P0 (X)
| ID | Severity | Title | File:Line |
|----|:--------:|-------|-----------|
| Gap-MOD-R1-XXX | 🔴 P0 | [finding] | service.php:NN |

### R1 P1 (Y)
[same table]

### R2 P0 (A)
[same table]

### R2 P1 (B)
[same table]

### N spawn task chips created (cover X of Y P0s)
1. [chip title] — covers Gap-MOD-R1-X + Gap-MOD-R2-Y
2. [chip title] — ...

### Remaining OPEN P0s not yet spawn-chipped
- [list]

### Top 3 inspector questions that fail TODAY
1. [question] → [answer that exposes the gap]
```

## Common reviewer disagreements (and how to resolve)

### R1 says "phantom method"; R2 says "code exists in service B"

Production indeed has the method, just not in the file R1 grep'd. R2 wins. Update spec to cite correct location.

### R1 says "missing transaction wrapper"; R2 says "savepoint config covers it"

Both might be right. Check whether your ORM/transaction layer is configured to use savepoints for nested transactions (e.g., `use_savepoints: true` in Doctrine; `nested transactions` in SQLAlchemy; `SAVEPOINT` usage in raw SQL/sqlx). If yes, R2 wins (nested transactions safely become savepoints). If no, R1 wins (partial-rollback risk).

### R1 says "P0 production bug"; R2 says "P1 spec drift"

Verify in production. If code matches spec, R2 wins. If code violates spec, R1 wins.

## Calibrating reviewer aggressiveness

Per-module, reviewer prompts can be tuned:

- **Greenfield modules:** Lower aggressiveness — many things are intentionally TODO
- **Production-stable modules:** Higher aggressiveness — every drift is meaningful
- **Compliance-heavy modules:** Maximum R2 aggressiveness — regulator's eye

## Time-budgeting reviewers

- **R1 ideal time:** 30-90 min of agent time (3000-9000 tokens output)
- **R2 ideal time:** 30-90 min
- **Wall-clock:** Both run in parallel = max of R1 or R2 = ~90 min wall

If either agent takes >2h, something's wrong (likely the spec is huge — split the module).

## R1+R2 yield statistics (pilot data v3.2)

Observed yield from the investment-module pilot (2026-05-18), measured against a spec that had already gone through 4 author-level review passes + R3:

| Reviewer | NEW findings | Findings that prior 5 passes missed |
|----------|:-----------:|:----------------------------------:|
| Day 1-3 author review | 8+7+5 = 20 | (baseline; first pass on own writing) |
| Day 2 meta-review | 1 production bug | 1 (DUPLICATE-COMMAND) |
| R3 deep review | 15 | 15 |
| **R1 algorithm** | **19** | **19** |
| **R2 compliance + cross-module** | **10** | **10** |
| **R1 + R2 combined** | **25 unique** (4 overlap with R3) | **25** |

**Total review yield across 6 passes: 61+ findings.**

R1+R2 caught **25 issues that R3's line-by-line spot-check missed**, including:
- 3 production bugs (FundJournalService 20-site `createdBy: 0`; CHART-OF-ACCOUNTS-DRIFT — 8 wrong account codes; CREATEORDER-BAL-RACE — fund overspending under concurrency)
- Cross-module spec-drift (accounting + nav + settlement spec doesn't reference investment)

### R2 cross-module verification = highest single yield

R2 item #4 (cross-module verification — does sibling module's spec reference YOUR module's ADRs?) accounted for **1 P0 + 2 PARTIAL findings on its own** in the pilot, including the highest-impact catch (CHART-OF-ACCOUNTS-DRIFT). This pattern generalises:

| Cross-module check | Yield |
|---------------------|-------|
| Does sibling ZeeSpec mention your ADRs by ID? | High (catches spec authored from stale source) |
| Does sibling ZeeSpec consume your fields (e.g. realizedGainLoss)? | High (catches one-sided cross-link declarations) |
| Does sibling ZeeSpec describe trigger handoffs (e.g. Pattern B)? | Medium |

**Recommendation:** Always allocate explicit time for R2 item #4 — it has the highest finding-per-minute ratio of any review activity.

### When R3 reports ✅ clean, run R1+R2 anyway

Pilot observation: R3 reported "0 false positives among existing OPEN gaps" — but R1+R2 found **25 NEW issues** R3's approach was not equipped to catch:
- R3 verifies what spec claims; R1+R2 verify what spec **doesn't** claim but should
- R3 reads code top-down; R1 traces full call chains (catches partial-failure windows)
- R3 doesn't cross-link to sibling modules; R2 does

**Conclusion:** R1+R2 is **NOT optional after R3**. Both passes find disjoint issue classes. Treat R3+R1+R2 as a 3-pass sequence, all required before Tier 1 promotion.

## Next: 05-apply-findings.md
