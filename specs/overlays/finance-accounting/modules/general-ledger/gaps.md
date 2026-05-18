---
module: general-ledger
dimension: gaps
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — GAPS (Open Questions + Findings)

## Severity legend

See `../../principles/severity-matrix-finance.md` for full definitions:
- 🚨 P0 — money loss, regulator risk, source-of-truth corruption
- 🟠 P1 — audit gap, reconciliation aged, SoD partial
- 🟡 P2 — reporting drift, stale refs
- 🟢 P3 — style, cleanup

## Status legend

- 🔴 OPEN — unresolved
- 🟡 PROPOSED — solution drafted, not landed
- 🟢 RESOLVED — fix landed + verified
- ⚪️ DEFERRED — decision to postpone (with reason + revisit date)
- 📌 BY-DESIGN — intentional non-fix

## ⚠️ AI behavior

For any 🚨 P0 or 🟠 P1 OPEN gap referenced by code path under work:
- If chip exists → cite the chip; do NOT implement the fix yourself
- If no chip → STOP and ask the user

## Open gaps

> Pre-seeded from pilot project findings. Re-evaluate for your project; remove if not applicable.

### Gap-GL-01 — createdBy:0 sentinel across journal posting (pilot finding)

| Severity | 🚨 P0 |
| Status | 🔴 OPEN (spawn chip created YYYY-MM-DD if applicable) |
| Files | `<your-source>/Accounting/AccountingService.{ext}`, ~20 call sites |

**Question/finding:** Pilot project found `createdBy: 0` hardcoded in multiple service-call sites because no security context was wired up when GL service was first built. Audit trail says "user 0 posted journal X" — user 0 doesn't exist; auditor red flag.

**Current behavior (pilot):** Journals posted with created_by = 0; INV-GL-07 status was 🚧 NOT-ENFORCED.

**Impact:** FRC inspector test "show me who posted journal X" returns "user 0" → audit fail.

**Suggested resolution:**
1. Inject SecurityContext into AccountingService (constructor or method param)
2. Replace hardcoded 0 with `actor.id` from context
3. For background jobs (e.g., fee accrual posting), use `system.eod` or specialized system actors (`system.fee-accrual`)
4. Add DB CHECK(created_by > 0) constraint after backfill of historical sentinels
5. Add integration test: posting without authenticated context rejected

**Owner:** TBD

**See also:** HW-GL-06; INV-GL-07; ../../principles/financial-anti-patterns.md (entry not specifically listed but generic anti-pattern #7 in core ZeeSpec).

### Gap-GL-02 — Hard DELETE in batch command (pilot finding)

| Severity | 🚨 P0 |
| Status | 🔴 OPEN (spawn chip if applicable) |
| Files | `<your-source>/Accounting/Command/BackfillGeneralLedgerCommand.{ext}` |

**Question/finding:** Pilot's `BackfillGeneralLedgerCommand` issues `DELETE FROM general_ledger` (no WHERE clause). Executed in dev environment (dev.log:31608, 2026-04-20). If executed in production, 7-year retention requirement immediately violated.

**Current behavior (pilot):** Command exists; DB role permissions did NOT prevent the operation.

**Impact:** Compliance: retention violation = FRC inspection failure. Legal: potential criminal referral under AML law.

**Suggested resolution:**
1. REVOKE DELETE permission on journal, journal_line, audit_log from application_user
2. Refactor backfill command to use staging tables / temp DB, then atomic swap (NOT DELETE on live)
3. Add env-guard: production env requires explicit `--i-know-what-im-doing` + controller credential
4. Document the command's safe use in `where.md` § 5.9

**Owner:** TBD

**See also:** HW-GL-09; ../../principles/financial-anti-patterns.md #14.

### Gap-GL-03 — Approval workflow boundary mismatch (pilot finding)

| Severity | 🚨 P0 |
| Status | 🔴 OPEN |
| Files | `<your-source>/Accounting/JournalApprovalService.{ext}`, `AccountingService.{ext}` |

**Question/finding:** Pilot's `JournalApprovalService::post` requires journal.status == APPROVED. But `AccountingService::postJournal` only accepts journal.status == DRAFT. → Every approved journal throws InvalidArgumentException downstream.

**Current behavior (pilot):** UI shows "approved successfully" → DB has the journal in APPROVED state forever → no GL entry created → balances frozen.

**Impact:** Mass restate event; customer balance display wrong; trust impact.

**Suggested resolution:**
1. Align status acceptance: AccountingService.postJournal should accept (DRAFT, APPROVED)
2. Add regression test: approve → post chain succeeds
3. Add alarm on journals stuck in APPROVED status > 1 hour

**Owner:** TBD

**See also:** ../../principles/financial-anti-patterns.md #13; core ZeeSpec anti-pattern #12.

## Open research questions

### RES-GL-Q1 — Should we use stored balance cache or compute-on-read?

| Severity | 🟢 P3 |
| Status | 🔴 OPEN |

**Question:** Performance vs auditability trade-off. Cache = fast read but requires daily reconciliation per INV-GL-18. Compute-on-read = always accurate but slow on accounts with millions of journal lines.

**Options:**
- A) Cache + daily reconcile (current pilot choice)
- B) Compute-on-read + materialized view for hot accounts
- C) Compute-on-read with period-end snapshot anchor (compute delta since last close)

**Recommended next step:** Benchmark at your expected scale before deciding.

### RES-GL-Q2 — Materiality threshold for reconciliation breaks

| Severity | 🟢 P3 |
| Status | 🔴 OPEN |

**Question:** What MNT (or your currency) amount counts as "material" for subledger ↔ GL break?

**Pilot value:** 1,000 MNT (very low because financial regulator scrutinizes any difference).

**Recommended next step:** Discuss with controller + auditor; document in `where.md` config section.

## Proposed gaps (solutions drafted, not landed)

[fill as gaps reach this stage]

## Resolved gaps

[fill as gaps close]

## Deferred gaps

[fill if any gap is intentionally postponed; include reason + revisit date]

## By-design (intentional non-fix)

[fill if any apparent gap is actually intentional behaviour]

## Cross-references

- `../../principles/severity-matrix-finance.md` — severity calibration
- `../../principles/financial-anti-patterns.md` — patterns whose detection triggers these gap types
- `../../principles/frc-compliance.md` — regulatory context for P0 calibration
- Core ZeeSpec `checklists/severity-matrix.md` — generic matrix (overridden by finance variant)
