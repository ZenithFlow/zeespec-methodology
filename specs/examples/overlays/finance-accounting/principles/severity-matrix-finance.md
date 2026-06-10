---
doc: examples/overlays/finance-accounting/principles/severity-matrix-finance
type: principles-spec
overlay: finance-accounting
overrides: core/checklists/severity-matrix.md
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Severity Matrix — Finance / Accounting Calibration

> **Overrides** core `core/checklists/severity-matrix.md` with financial-services-specific calibration. Use this matrix when triaging gaps in any module under the finance-accounting overlay.

## The 4 severities (finance calibration)

| Severity | Symbol | Finance-specific definition |
|----------|:------:|------------------------------|
| **P0 Critical** | 🚨 / 🔴 | One of: money loss; regulator enforcement risk (license, fine, criminal); systemic compliance violation; data corruption in source-of-truth ledger; runtime crash in core money-movement flow |
| **P1 Important** | 🟠 | Audit gap; failed reconciliation aged > 3 days; KYC enforcement weak (bypass exists); SoD enforced in UI only; FX revaluation missed; settlement-cycle drift |
| **P2 Medium** | 🟡 | Reporting drift; stale spec refs; missing test for non-money invariant; UI inconsistency; non-critical compliance documentation drift |
| **P3 Low** | 🟢 | Style; naming; code-comment improvements |

## AI behaviour by severity + ticket presence

(Same as core matrix — re-stated here for self-containment.)

| Severity | Has ticket? | AI behaviour |
|----------|:-----------:|--------------|
| 🚨 P0 | No | **STOP** — ask user; do not implement |
| 🚨 P0 | Yes | Refer to ticket; do NOT implement (production fix is separate workstream) |
| 🟠 P1 | No | **STOP** — ask user |
| 🟠 P1 | Yes | Cite gap; proceed only if explicitly invoked by user |
| 🟡 P2 | Either | Implement if obvious + cite gap |
| 🟢 P3 | Either | Implement + cite gap |

## What qualifies as P0 in finance

A finding is P0 if ANY of these apply:

1. **Direct money loss** or imminent risk of loss — even small amounts (regulator sensitivity is high)
2. **Regulatory enforcement risk** — license suspension, fine, criminal referral. Specifically:
   - AML/CFT violation (KYC bypass, missed CTR/STR, sanctions screening failure)
   - Capital adequacy below requirement
   - Client-asset commingling
   - Material misstatement in regulatory filing
   - Retention violation (hard DELETE on retained tables)
3. **Source-of-truth corruption** — ledger balance ≠ sum of journal lines; subledger ≠ GL control account; trial balance imbalanced; cached balance diverges
4. **Audit trail BROKEN** — `createdBy: 0` sentinel; missing approver_id; modified after posting
5. **Settlement failure** — funds not moving as expected (T+N missed); customer balance "stuck"
6. **Runtime crash in core money flow** — every approved journal throws; every withdrawal request 500s
7. **Closed-period violation** — backdated posting into already-filed period
8. **NAV calculation wrong** — stale prices; missing securities; FX revaluation off
9. **Production incident already happened** — log evidence exists
10. **Data exfiltration vector** — operator can transfer client funds without approval

## What qualifies as P1 in finance

Important but not immediately catastrophic:

- Reconciliation break aged 4-7 days (becomes P0 at 8+ days)
- SoD enforced in UI only (back-end accepts initiator = approver)
- Single missing audit field (createdAt present but reason missing for high-impact action)
- KYC enforcement gap in one path of N (e.g., enforced on first deposit but not on bank-account-link)
- Fee accrual off-by-one (drift accumulates but slowly)
- Holiday calendar missing for new jurisdiction (settlement works for most days)
- Compliance dashboard missing one queue (data exists; not surfaced)
- FX revaluation missed on a minor currency (≤ 5% portfolio exposure)
- Sanctions screening on customer only, not counterparty (gap)
- PEP detection slow (correctly identifies but with delay)
- Stress-test scenario coverage incomplete

## What qualifies as P2 in finance

Important to fix but not affecting money or compliance posture:

- Stale line refs in spec (< 200 lines drift)
- Enum count drift in spec (e.g., 5 states documented; production has 6)
- Documentation copy-paste typo
- Pseudocode error in spec
- Test coverage < target for non-money paths
- Admin UI filter missing some cases
- Localization gap (e.g., MN strings only, no English equivalent)
- Performance optimization opportunity (no current SLA breach)

## What qualifies as P3 in finance

Cosmetic / cleanup:

- Code style inconsistencies
- Variable naming
- Comment improvements
- Dead code in non-money paths
- Refactoring opportunities

## Severity by category (finance-specific)

| Category | Default severity | Notes |
|----------|:----------------:|-------|
| **AML/CFT violations** | 🚨 P0 | Zero-tolerance regulatory |
| **Client asset segregation breach** | 🚨 P0 | License-level risk |
| **Source-of-truth ledger corruption** | 🚨 P0 | Foundational |
| **Backdating into closed period** | 🚨 P0 | Restatement risk |
| **Audit trail with sentinel values** | 🚨 P0 | Inspector immediate red flag |
| **Hard DELETE on retained tables** | 🚨 P0 | Retention violation |
| **Float for money** | 🚨 P0 | Silent drift |
| **NAV calculation with stale data** | 🚨 P0 | Investor harm |
| **Sanctions list stale (> 48h)** | 🚨 P0 | Compliance gap |
| **CTR/STR missed filing** | 🚨 P0 | Regulatory deadline |
| **KYC bypass via business logic** | 🚨 P0 | Zero-tolerance |
| **SoD enforced UI-only** | 🟠 P1 | Backend gap |
| **Reconciliation break 4-7 days** | 🟠 P1 | Aging trigger |
| **Reconciliation break 8+ days** | 🚨 P0 | Aged out |
| **Fee accrual drift** | 🟠 P1 | Slow accumulation |
| **Settlement w/o holiday calendar** | 🟠 P1 | Edge case |
| **Reporting drift / stale refs** | 🟡 P2 | Documentation |
| **Test coverage gap (non-money)** | 🟡 P2 | Standard |

## Real examples from finance pilot

> These are the high-severity findings from the pilot project's R3+R1+R2 reviews.

| Finding | Sev | Why |
|---------|:---:|-----|
| Hard DELETE in `BackfillGeneralLedgerCommand` (no WHERE clause) | 🚨 P0 | Retention violation; already executed in dev environment |
| `createdBy: 0` sentinel in 20+ service call sites | 🚨 P0 | Audit trail broken; FRC inspector test fails |
| `JournalApprovalService` requires APPROVED, `AccountingService::postJournal` only DRAFT — every approved journal throws | 🚨 P0 | Runtime crash in approval workflow |
| Bond maturity reads stale holdings → over-distribution to investors | 🚨 P0 | Real money loss possible |
| Tax remittance ignores USD bucket — only MNT counted | 🚨 P0 | Government under-remittance; tax penalty |
| Sanctions list cached at app start; never refreshed | 🚨 P0 | Missed new designations |
| Per-channel CTR check (deposit AND wire separate) — smurfing passes | 🚨 P0 | AML violation |
| Per-customer notification toggle is DEAD CODE — UI shows but production ignores | 🟠 P1 | False consent UX; minor privacy gap |
| Fee accrual uses calendar days but custodian uses Actual/360 | 🟠 P1 | Drift accumulating; restatement needed soon |
| Stale line refs in spec (200+ line drift) | 🟡 P2 | Confusing but not broken |
| Enum count drift (39 → 45) | 🟡 P2 | Docs only |
| Admin Sonata filter missing 35 enum cases | 🟢 P3 | UI polish |

## Severity escalation triggers (finance)

A P1 escalates to P0 if ANY:
- Aging > N days (reconciliation breaks; CTR queues; STR queues)
- Production incident exposes it (e.g., a customer complaint references it)
- Regulator inquiry references it
- Multiple customers / accounts affected
- Crosses into a money-movement path
- Audit-cycle approaches (auditor will see it)

A P2 escalates to P1 if:
- Reporting period approaches and gap remains
- Cross-impacts a P0/P1 module
- Multiple modules now affected

## Severity de-escalation triggers (finance)

A P0 de-escalates to P1 ONLY if:
- Compensating control LANDED + tested (e.g., daily reconciliation now catches the case; risk window narrowed to N hours)
- Affected scope shrunk (e.g., only pre-launch accounts; only one rare path)
- Workaround documented + operator-trained + audit-logged

P0 does NOT de-escalate by:
- Time (waiting it out)
- Spec edits ("now documented" ≠ "now controlled")
- UI warnings ("compliance officer will see it" ≠ "system blocks it")

## Time-to-resolution targets (finance)

| Severity | Target |
|----------|--------|
| 🚨 P0 with active incident | 24 hours (war-room) |
| 🚨 P0 with discovered exposure | 5 business days |
| 🚨 P0 with controlled exposure | 1 month with weekly progress review |
| 🟠 P1 | 1 quarter |
| 🟡 P2 | 2 quarters (batched per spec re-author) |
| 🟢 P3 | When convenient |

## Composite gap severity (finance)

| Combination | Result |
|-------------|--------|
| Money loss + audit gap | 🚨 P0 |
| Compliance violation + UX issue | 🚨 P0 (compliance wins) |
| Race condition only at high concurrency (> N TPS) | If actual usage < threshold, downgrade to 🟠 P1 with monitoring |
| Multiple 🟠 P1s in the same code path | Escalate to 🚨 P0 (compounding risk) |
| 🟠 P1 in money path + 🟠 P1 in audit trail of same flow | 🚨 P0 |

## How to use this matrix

### Authoring a gap

1. Describe gap (what / where / impact)
2. Pick severity using THIS matrix (finance-tuned, not generic)
3. Decide ticket assignment (P0/P1 require spawn chips)
4. Set AI behaviour expectation
5. Add to module's `gaps.md`

### Reviewing as AI

1. Check severity per this matrix
2. Check ticket presence
3. Apply behaviour (STOP / cite / proceed)

### Prioritizing remediation

```
1. 🚨 P0 with active production incident
2. 🚨 P0 with regulatory deadline approaching
3. 🚨 P0 with money loss
4. 🚨 P0 with compliance exposure
5. 🟠 P1 with aging trigger crossing soon
6. 🟠 P1 with cross-module impact
7. 🟠 P1 in money/compliance path
8. 🟡 P2 batched
9. 🟢 P3 when convenient
```

## Common mistakes

### Mistake 1: P0-fatigue (everything looks P0)

Finance work is high-stakes. Tendency: mark everything P0. Reserve P0 for ACTUAL money/regulator/incident. Otherwise:
- Operators stop reacting (boy-who-cried-wolf)
- Real P0s get lost in noise
- Status meetings become unproductive

### Mistake 2: Under-tagging compliance gaps

The opposite: "It's just documentation drift." But a documented control that isn't actually in place is WORSE than no documentation. Regulator finds the doc and asks "show me the control" — gap revealed.

### Mistake 3: Confusing "audit log records it" with "control blocks it"

```
SoD violation: operator approves own transaction.
  Audit log captures: "operator_X approved by operator_X" ← good evidence
  Was it blocked?    No.                                  ← gap
  Severity?          🚨 P0 (the audit log alone is not the control)
```

### Mistake 4: Severity drift over time

A gap filed 6 months ago as P1 may now be P0 (incident happened, aging crossed) or P2 (workaround landed). Re-triage every quarter.

### Mistake 5: Not specifying ticket presence

"Gap-X-001 🚨 P0 OPEN" without a chip reference → AI doesn't know if it should STOP or refer. ALWAYS include "(spawn chip created YYYY-MM-DD)" or "(no chip yet)".

## Cross-reference

- `accounting-principles.md` — invariants that define what's "correct"
- `financial-anti-patterns.md` — patterns whose defaults map to this matrix
- `regulatory-compliance.md` — regulatory framework that drives P0 calibration
- Core `core/checklists/severity-matrix.md` — generic matrix (this overrides for finance)
- Core `core/checklists/anti-patterns.md` — generic anti-patterns (financial-anti-patterns extends)

## Next

→ Pick a module template from `../modules/`:
- `../modules/general-ledger/` — for GL / journal / accounting modules
- `../modules/wallet-settlement/` — for payment / wallet / settlement modules
- `../modules/kyc-aml/` — for customer onboarding / AML modules
