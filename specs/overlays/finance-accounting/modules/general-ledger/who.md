---
module: general-ledger
dimension: who
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — WHO (Actors + RBAC + SoD)

## 1. Actors

| ID | Actor | Description |
|----|-------|-------------|
| A-GL-01 | Operator | Day-to-day accounting clerk; posts routine journals, runs reconciliations |
| A-GL-02 | Approver | Reviews + approves journals above operator threshold; cannot approve own |
| A-GL-03 | Controller | Period close, reopen, adjusting entries; signs off financials |
| A-GL-04 | Compliance Officer | Reads audit logs, files regulatory submissions; cannot post operational journals |
| A-GL-05 | Auditor (read-only) | External auditor; full read access including audit logs; zero write |
| A-GL-06 | System actor `system.eod` | EOD automated jobs (reconciliation, snapshots); NO interactive use |
| A-GL-07 | System actor `system.recon` | Reconciliation job actor |
| A-GL-08 | System actor `system.fx` | FX revaluation job actor |

> System actors are NOT user accounts in the usual sense — they have:
> - is_system = TRUE flag
> - No password / no login UI
> - Used only by background jobs via service-account credentials
> - Captured as createdBy on system-initiated journals (satisfies INV-GL-07)

## 2. RBAC matrix

| Action | Operator | Approver | Controller | Compliance | Auditor | system.eod |
|--------|:--------:|:--------:|:----------:|:----------:|:-------:|:----------:|
| postJournal (REGULAR ≤ threshold) | ✓ | ✓ | ✓ | | | ✓ (limited types) |
| postJournal (REGULAR > threshold) | ✓ + approval | ✓ | ✓ | | | |
| postJournal (ADJUSTING) | | | ✓ | | | |
| postJournal (OPENING) | | | ✓ | | | |
| postJournal (CLOSING) | | | ✓ | | | ✓ (period close) |
| reverseJournal | | ✓ | ✓ | | | |
| initiateClose | | | ✓ | | | |
| completeClose | | | ✓ | | | |
| reopenPeriod | | | ✓ | | | |
| createAccount | | | ✓ | | | |
| deactivateAccount | | | ✓ | | | |
| getAccountBalance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| getTrialBalance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| read audit_log | | | ✓ | ✓ | ✓ | |
| read all journals | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (for jobs) |

## 3. Segregation of Duties (SoD)

### SOD-GL-01 — 4-eyes principle for journals above threshold

For `postJournal()` where journal.total_base_amount > sod_threshold (configurable):
- approver_id MUST NOT equal initiator_id
- Service enforces: rejects if same

### SOD-GL-02 — Controller cannot approve own reversals

For `reverseJournal()`:
- actor_id (the reverser) MUST NOT equal original.posted_by

### SOD-GL-03 — Period close requires controller; close-actor ≠ open-actor

For `reopenPeriod()`:
- actor_id (reopener) MUST NOT equal period.closed_by
- Forces independent verification of the reopen

### SOD-GL-04 — System actors cannot perform sensitive ops

System actors (A-GL-06, A-GL-07, A-GL-08):
- CAN: posting types pre-authorized in their scope (e.g., system.fx can post FX revaluation journals)
- CANNOT: approve, reverse, close period, reopen

## 4. Critical service-layer guards

| Service method | Guard | Reason |
|----------------|-------|--------|
| `AccountingService.postJournal()` | actor.id > 0 AND actor.is_active | INV-GL-07 |
| `AccountingService.postJournal()` (above threshold) | approver_id != initiator_id | SOD-GL-01 |
| `AccountingService.reverseJournal()` | actor.role IN (approver, controller) | SoD + audit |
| `AccountingService.reverseJournal()` | actor_id != original.posted_by | SOD-GL-02 |
| `PeriodCloseService.initiateClose()` | actor.role == controller | sensitive |
| `PeriodCloseService.reopenPeriod()` | actor.role == controller AND actor != closer | SOD-GL-03 |
| `AccountingService.createAccount()` | actor.role == controller | governance |

## 5. Auth flow integration

- AuthN: JWT (or your project's mechanism); session injected into service layer
- AuthZ: Decorator/middleware on service method checks actor.role against RBAC matrix
- SoD: enforced inside service body (not just middleware) because requires both initiator + approver IDs

## 6. Audit identity (per HW-GL-19 + INV-GL-07)

Every audit_log entry captures:
- actor_id (always > 0; never sentinel)
- actor_role (snapshot at time of action — roles can change later)
- correlation_id (tracing)
- ip_address + user_agent (forensic; optional)

## 7. Cross-references

- `what.md` § 1.5 — AuditLog entity
- `gravity.md` — HW-GL-* including HW-GL-10 (SoD) and HW-GL-19 (audit log append-only)
- `../../principles/frc-compliance.md` § 4 — auth + RBAC model
