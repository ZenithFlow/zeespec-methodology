---
doc: workflow/12-agentic-role-replacement/06-qa-tester-agent
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
human_role_replaced: QA Engineer / Tester
coverage_estimate: 70-80%
---

# QA Engineer / Tester Agent

> QA role нь test plan + test case generation + bug reproduction + regression + exploratory testing-ийг хариуцдаг. Solo dev-д "өөрөө тест бичсэн нь өөрөө review хийдэг" дутагдалтай — fresh eyes хэрэгтэй. **QA agent нь test case generation + edge case enumeration + regression matrix-д хамгийн өндөр coverage үзүүлдэг (70-80%)**.

## Human role хийдэг

| Үүрэг | Frequency | Time |
|-------|-----------|------|
| Test plan creation | Per feature | 2-4h |
| Test case writing | Per feature | 4-12h |
| Manual exploratory testing | Per release | 4-8h |
| Bug reproduction + reporting | Daily | 2-4h |
| Regression test maintenance | Per cycle | 4-8h |
| Test automation | Ongoing | 5-15h/week |
| Performance / load testing | Per release | 4-8h |
| Accessibility testing | Per release | 2-4h |
| Test data management | Ongoing | 2-4h/week |

Total: ~20-40h/week.

## Agent coverage by sub-role

| Sub-role | Coverage | Notes |
|----------|:--------:|-------|
| Test plan creation | 75% | From ZeeSpec INV / user stories |
| Test case generation | 85% | G/W/T + edge cases — strong |
| Edge case enumeration | 90% | Agent excels here |
| Bug reproduction script | 70% | Repro steps + minimal test |
| Regression matrix | 80% | Cross-module impact map |
| Test automation code | 75% | Playwright / Vitest / PHPUnit boilerplate |
| Manual exploratory | 20% | Agent can suggest; cannot perform |
| Performance test scripts | 60% | k6 / Artillery scaffold |
| Accessibility audit | 50% | Static checks; not full a11y review |
| Test data fixtures | 70% | Generate realistic test data |

QA agent: **70-80% coverage for solo dev** — highest of the 6 roles.

## Pattern A: Test plan generation from ZeeSpec INV

When promoting feature to Tier 1 (requires test plan):

```javascript
Agent({
  description: "QA test plan generation — [module]",
  prompt: `You are QA engineer agent generating test plan for [module].

Inputs:
- ZeeSpec module: [module name]
- INV entries: [paste invariants INV-MOD-01 .. INV-MOD-NN]
- BR entries: [paste business rules]
- User flows: [paste user flows from why.md]
- Critical risks: [paste risks from gravity.md]

Generate test plan:
1. Test scope (what's in / what's out)
2. Test layers (unit / integration / E2E / manual)
3. Critical paths (top 5 must-pass flows)
4. Edge cases (boundary, empty, max, malformed)
5. Negative tests (auth fail, validation fail, rate limit)
6. Compliance test mapping (INV → test case mapping)
7. Regression coverage requirement
8. Performance criteria (if applicable)
9. Accessibility checks (if user-facing)
10. Test data needs

Output: structured test plan, ready to execute.`,
})
```

### Solo dev integration

Before Tier 1 promotion:
1. Dispatch QA agent (20-30 min)
2. Review test plan (15 min)
3. Adjust based on actual constraints
4. Save as `docs/specs/<module>/test_plan.md`
5. Use as guide for actual test writing

Saves 2-4h of test plan deliberation; produces more thorough coverage than ad-hoc.

## Pattern B: Test case generation (G/W/T format)

For each feature / user story:

```javascript
Agent({
  description: "QA test case gen — [feature]",
  prompt: `You are QA engineer agent generating test cases.

Feature: [describe]
Acceptance criteria: [paste AC]
Module INV: [paste relevant invariants]
Module BR: [paste relevant business rules]

Generate 15-30 test cases in Given/When/Then format:

For each test case:
- ID: TC-MOD-NN
- Priority (P0 critical / P1 high / P2 medium / P3 low)
- Type (functional / integration / E2E / edge / negative / regression)
- Given: precondition / state setup
- When: action taken
- Then: expected outcome (specific + observable)
- Mapping: which INV / BR / AC does this cover?

Coverage requirements:
1. Happy path (3-5 cases)
2. Alternative paths (3-5 cases)
3. Boundary cases (min / max / empty / null)
4. Error cases (validation / permission / rate limit / timeout)
5. Concurrency / race conditions (if applicable)
6. Compliance edge cases (per ZeeSpec INV)
7. Recovery / rollback paths

Output: test case catalog (TC-MOD-01 .. TC-MOD-NN).`,
})
```

### Quality check

After agent generates cases, dispatch a **second QA agent** as reviewer:

```javascript
Agent({
  description: "QA test case review — [feature]",
  prompt: `You are QA reviewer agent checking test case completeness.

Test cases generated: [paste]
Feature AC: [paste]
Module INV: [paste]

Audit:
1. Are all AC covered? (gaps)
2. Are all INV mapped to ≥1 test? (compliance gap)
3. Missing edge cases?
4. Missing negative cases?
5. Test cases that look duplicative?
6. Test cases with unclear "Then" (not observable)?
7. P0/P1 priority appropriate?

Output: gap report + recommended additional cases.`,
})
```

Two-pass QA pattern catches ~20% more issues vs single pass.

## Pattern C: Edge case enumeration deep dive

When feature has high risk / regulated:

```javascript
Agent({
  description: "QA edge case enumeration — [feature]",
  prompt: `You are QA agent specializing in edge case enumeration.

Feature: [describe in detail]
Inputs / parameters: [list]
External dependencies: [services, DB, queues, etc.]

Enumerate edge cases across:

1. INPUT BOUNDARIES
   - Empty / null / undefined
   - Min value / max value / overflow
   - Negative / zero / fractional
   - Unicode / special chars / SQL inject / XSS
   - Very long strings / huge JSON / binary
   - Wrong type (number where string expected)

2. STATE EDGE CASES
   - First-time user / no prior state
   - Concurrent action (race condition)
   - Stale state / cache inconsistency
   - Mid-transaction failure
   - Out-of-order events

3. SYSTEM EDGE CASES
   - Network: slow / disconnect / partial response
   - DB: timeout / deadlock / connection lost
   - External API: 4xx / 5xx / timeout / wrong schema
   - Queue: full / processing failure / duplicate
   - Cache: cold / stale / partial

4. TEMPORAL EDGE CASES
   - DST transition / midnight rollover
   - Year boundary / leap year
   - Timezone mismatch
   - Long-running session / token expiry

5. PERMISSION / SECURITY EDGE CASES
   - Insufficient permission
   - Expired auth
   - Permission revoked mid-action
   - Cross-tenant data leak risk

6. SCALE EDGE CASES
   - 1 item / 100 items / 10,000 items
   - Empty list / single item / max list
   - Rate limit / quota exceeded

7. RECOVERY EDGE CASES
   - User cancels mid-flow
   - Browser crash / app crash
   - Network restored after timeout
   - Idempotency: retry succeeds first call too

Output: 30-60 specific edge cases with expected behavior.`,
})
```

Edge case agent typically finds **10-20 cases solo dev would miss**. Highest ROI of any QA agent pattern.

## Pattern D: Bug reproduction + minimal test

When customer reports bug:

```javascript
Agent({
  description: "QA bug repro — [bug]",
  prompt: `You are QA agent reproducing reported bug.

Bug report: [paste customer description + logs]
Affected feature: [identify]
Environment: [staging / prod / specific browser]

Tasks:
1. Hypothesize root cause (3 hypotheses ranked by likelihood)
2. Define minimal reproduction steps
3. Identify required test data
4. Write failing test (per testing framework: PHPUnit / Vitest / Playwright)
5. Suggest where in code to look (per affected module)
6. Severity assessment (data loss / functional / cosmetic)

Output:
- Repro steps (numbered)
- Failing test code
- Suspected code location(s)
- Severity rating`,
})
```

### Solo dev workflow

1. Customer reports bug → 5 min triage
2. Dispatch bug-repro agent (10-15 min)
3. Run agent's failing test → confirm repro
4. Fix code → re-run test → green
5. Add test to regression suite
6. Update ZeeSpec if INV violated (gaps.md)

Saves 30-60 min per bug triage; produces regression test for free.

## Pattern E: Regression matrix

When making cross-module change:

```javascript
Agent({
  description: "QA regression matrix — [change]",
  prompt: `You are QA agent building regression matrix.

Change: [describe code change]
Modules touched: [list]
Modules potentially affected: [list per code analysis]

For each affected module:
1. Critical flows in that module (top 5)
2. Likelihood of breakage (high / med / low)
3. Recommended regression test (existing test OR new)
4. Manual smoke test needed?
5. Test data dependency

Build matrix:
| Module | Flow | Risk | Test | Status |

Output:
- Regression matrix
- Recommended test execution order
- Manual smoke test checklist`,
})
```

### Use case

Before merging cross-cutting refactor:
1. Dispatch regression agent (15 min)
2. Run all critical tests in matrix
3. Manual smoke test (10-20 min)
4. Document any caught regressions

## Pattern F: Test automation scaffolding

For new module that needs test infrastructure:

```javascript
Agent({
  description: "QA test scaffold — [module]",
  prompt: `You are QA agent scaffolding test infrastructure for [module].

Module: [describe]
Framework: [PHPUnit / Vitest / Playwright / Jest]
Test layers needed: [unit / integration / E2E]
Existing test patterns: [paste examples from /backend/tests OR /mobile/__tests__]

Generate:
1. Test file structure (paths + filenames)
2. Setup / teardown boilerplate
3. Test data factory / fixtures
4. Mock / stub patterns for external deps
5. 3-5 example test cases (smoke level)
6. CI integration config (if needed)

Output: ready-to-paste scaffolding.`,
})
```

Saves 1-3h of boilerplate setup per module.

## Pattern G: Accessibility static check

For UI features:

```javascript
Agent({
  description: "QA a11y static check — [page/component]",
  prompt: `You are QA agent reviewing accessibility.

Component code: [paste]
Framework: [React / Next.js / React Native]

Static a11y audit:
1. Missing alt text on images
2. Missing aria-labels on icon buttons
3. Form labels missing or detached
4. Color contrast (estimate based on style values)
5. Keyboard navigation order (tab index issues)
6. Focus management (modals / dropdowns)
7. Screen reader text (sr-only patterns)
8. Touch target size (mobile)
9. Heading hierarchy (h1 → h2 → h3)
10. ARIA roles correct usage

Output: a11y issue list + suggested fixes.

Note: this is static analysis only. Real a11y testing requires:
- Screen reader (VoiceOver / TalkBack / NVDA) manual test
- Keyboard-only navigation test
- Real user with disability feedback`,
})
```

Coverage 50% — agent catches obvious issues; real a11y requires manual + user testing.

## Pattern H: Performance test scaffold

For high-load features:

```javascript
Agent({
  description: "QA perf test scaffold — [endpoint/flow]",
  prompt: `You are QA agent scaffolding performance test.

Target: [endpoint / flow]
Expected load: [requests/sec or concurrent users]
Performance criteria: [p50 / p95 / p99 latency targets]
Framework: [k6 / Artillery / Locust]

Generate:
1. Load test script (ramp-up / steady / spike)
2. Test data setup (realistic; not all-same)
3. Assertions (latency thresholds; error rate)
4. Monitoring hooks (which metrics to capture)
5. CI integration (if needed)
6. Baseline run command

Output: ready-to-run perf test.

Note: scaffold only. Real perf testing requires:
- Production-like environment
- Realistic data volume
- Analysis of results (not just thresholds)`,
})
```

## Limitations + escalation

QA agent CANNOT:

- ❌ Perform real manual exploratory testing
- ❌ Use intuition from "feeling" the app
- ❌ Test with real assistive tech (screen reader, switch device)
- ❌ Test cross-device real interactions (touch, gesture nuance)
- ❌ Catch UX issues from emotional / aesthetic perspective
- ❌ Test under real-world conditions (slow network, noisy bg)

### Mandatory escalation triggers

| Trigger | Escalate to |
|---------|-------------|
| Critical user-facing flow (P0) | Real human manual test |
| Accessibility for release | A11y expert / actual user with disability |
| Performance under real load | Production-like load test environment |
| Security-critical (auth, payment) | Security agent + real pentest |
| Regulated workflow (compliance) | Real compliance officer + audit |
| Cross-device real interaction | Manual on real devices |

## Solo dev integration playbook

Daily:
- New feature → QA agent test plan (Pattern A) before coding
- Per code change → bug-repro pattern for any regression

Weekly:
- Cross-cutting refactors → regression matrix (Pattern E)
- New module → test scaffold (Pattern F)

Per release:
- Full test plan execution
- Manual smoke test (eat own dog food, 30 min minimum)
- Accessibility static check (Pattern G) + real keyboard nav (15 min manual)

Quarterly:
- Perf test (Pattern H) on top 3 critical endpoints
- Real user testing session (3-5 users)

## Cost / time summary (solo dev)

| Pattern | Cost | Time saved |
|---------|------|-----------|
| Test plan per feature | $0.50-1 | 1.5-3h |
| Test case gen per feature | $1-2 | 3-8h |
| Edge case enumeration | $0.50-1 | 2-4h |
| Bug repro | $0.30-0.50 | 30-60 min |
| Regression matrix | $0.50-1 | 1-2h |
| Test scaffold | $0.30-0.50 | 1-3h |
| A11y static | $0.30-0.50 | 30-60 min |
| Perf scaffold | $0.50-1 | 1-3h |
| **Monthly (solo dev active)** | **~$15-30** | **15-30h** |

QA agent ROI for solo dev: **highest of the 6 roles**. Real manual testing still required for UX, a11y validation, real-world perf.

## Anti-patterns

### Anti-pattern 1 — Tests generated; never run

**Symptom:** QA agent generates 50 test cases; solo dev never executes them.

**Fix:** Tests = artifact only if run. Schedule execution. Use CI to enforce.

### Anti-pattern 2 — Skip manual exploratory because "tests are thorough"

**Symptom:** 95% automated test coverage; UX is broken; nobody noticed.

**Fix:** Manual exploratory = 30 min minimum per release. Tests catch known issues; exploratory catches unknown.

### Anti-pattern 3 — Edge case overgeneration → test suite bloat

**Symptom:** Agent generates 200 edge cases; test suite takes 20 min to run; nobody waits for CI.

**Fix:** Prioritize P0/P1 only for CI; P2/P3 in nightly run. Quality > quantity.

### Anti-pattern 4 — A11y agent as substitute for real a11y testing

**Symptom:** Agent says "passes a11y check"; release ships; blind users can't use app.

**Fix:** Static check ≠ a11y compliance. Real screen reader test required for shipping.

### Anti-pattern 5 — Perf scaffold without baseline

**Symptom:** Perf test scaffolded; never run; no baseline; can't detect regression.

**Fix:** First perf test = baseline. Re-run on every release. Compare. Without comparison, perf test is decoration.

## Cross-references

- `00-START-HERE.md` — agentic overview
- `01-reviewer-agents.md` — R3 includes some test review
- `05-domain-expert-agent.md` — AC drafting feeds into test plan
- `07-orchestration-matrix.md` — multi-role coordination
- `workflow/06-claude-skills-integration/02-mode-c-test-coverage-skill.md` — TDD per ZeeSpec

## Next

→ `07-orchestration-matrix.md` — Multi-role coordination patterns
