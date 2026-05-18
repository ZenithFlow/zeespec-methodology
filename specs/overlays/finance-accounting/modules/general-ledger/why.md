---
module: general-ledger
dimension: why
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — WHY

## 1. Strategic goals

| ID | Goal | Cross-references |
|----|------|------------------|
| G-GL-01 | Audit-grade source of truth for all financial transactions | INV-GL-01, INV-GL-02, HW-GL-19 |
| G-GL-02 | IFRS-compliant (or your standard) for regulatory reporting | accounting-principles.md § 2 |
| G-GL-03 | Reconciliable subledger-to-GL on any given date | INV-GL-18 |
| G-GL-04 | Multi-currency native (no manual FX bookkeeping) | INV-GL-09, INV-GL-13 |
| G-GL-05 | Period close enforcement (no backdating, audit-logged reopen) | INV-GL-05, ALG-GL-PERIOD-CLOSE-01 |

## 2. Business rules

| BR | Statement | Source |
|----|-----------|--------|
| BR-GL-01 | All money movements posted to GL with at least 2 sides | accounting standard |
| BR-GL-02 | Journals immutable once posted; corrections via reversal | accounting standard |
| BR-GL-03 | Customer cash held in trust accounts (account_class = CLIENT_TRUST) | FRC + AML law |
| BR-GL-04 | 7-year retention on journal_line + audit_log | Mongolia AML law (or your jurisdiction) |
| BR-GL-05 | Operator identity required on every posting; no system-string | FRC + audit standards |

## 3. Compliance drivers

| Regulation | Requirement | Affects | Coverage |
|------------|-------------|---------|----------|
| Mongolia AML/CFT law | 7-year retention | journal_line, audit_log, account_balance snapshots | ✅ (after spawn chip closure) |
| Mongolia FRC | Daily NAV submission | depends on `nav` module which reads GL | Through dependency |
| IFRS (or local standard) | Accrual basis, FX revaluation at period-end | ALG-GL-PERIOD-CLOSE checklist + downstream fee accrual | ✅ |
| Tax authority | Withholding tax visibility (per HW-ACC-23) | Multi-leg journal pattern for withholding | ✅ |

## 4. Cross-module dependencies

| Module | Direction | Reason |
|--------|-----------|--------|
| `auth` | upstream | User identity for createdBy |
| `customer` | upstream | Some journals reference customer (CLIENT_TRUST accounts) |
| `market-data` | upstream | FX rates for ALG-GL-POST-01 base currency conversion |
| `wallet` | downstream | Subledger; reconciled per INV-GL-18 |
| `settlement` | downstream | Posts via postJournal() |
| `fee-management` | downstream | Posts daily accruals |
| `nav` | downstream | Reads GL balances |
| `regulatory-reporting` | downstream | Reads GL snapshots |

## 5. Trade-offs

| Decision | Choice | Rejected alternative | Reason |
|----------|--------|----------------------|--------|
| Balance computation | Derived from journal lines (+ optional cache w/ reconciliation) | Stored as truth in account.balance | Auditability > performance; daily recon catches drift |
| Multi-currency handling | Per-line base + transaction currency | Single-currency only (force conversion at boundary) | Audit trail of original transaction preserved |
| Period close model | Soft → Hard → Reopen-with-audit | Hard close only | Real-world adjustments need controlled reopen path |
| Reversal model | New REVERSING journal with link | UPDATE original to status=REVERSED + back-dated correction | Immutability per INV-GL-02 |
| Operator identity | Required on every journal | Optional, fallback to system | Audit trail requirement |

## 6. Risks

| ID | Status | Risk | Probability | Impact | Mitigation |
|----|:------:|------|:-----------:|:------:|------------|
| R-GL-01 | 🚧 OPEN | createdBy:0 sentinel breaks audit trail (pilot finding) | High (production evidence) | High (FRC inspector test fails) | Spawn chip + DB CHECK constraint |
| R-GL-02 | 🟡 PARTIAL | Cached balance drift > materiality undetected | Medium | High (NAV impact) | Daily reconciliation + alert |
| R-GL-03 | 🟡 MITIGATED | FX rate unavailable causes posting failure | Medium | Low (retry possible) | Provider fallback + monitoring |
| R-GL-04 | ✅ MITIGATED | Concurrent posting violates INV-GL-04 | Medium | High | DB row-level lock + post-lock recheck |
| R-GL-05 | 🚧 OPEN | Reversal of CLOSED-period journal posted to current period creates audit confusion | Low | Medium | Document in reason; downstream reporting handles |

### §6 status overview

**Summary:** ✅ 1 MITIGATED · 🟡 2 PARTIAL · 🚧 2 OPEN out of 5 risks.

## 7. Compliance + Regulatory

| Regulation | Requirement | How we satisfy |
|------------|-------------|----------------|
| Mongolia AML | 7-year retention | HW-GL-09 + soft-delete; archive after 1y inactive |
| Mongolia FRC | Audit trail completeness | HW-GL-19 + INV-GL-07 |
| IFRS / IAS 21 | FX revaluation at period-end | ALG-GL-PERIOD-CLOSE checklist item |
| IAS 1 | Going concern + accrual basis | Default behaviour; no conditional accrual halt |

## 8. What this dimension does NOT cover

- WHAT entities + invariants → `what.md`
- HOW algorithms work → `how.md`
- WHO enforces → `who.md`
- WHEN events fire → `when.md`
- WHERE storage lives → `where.md`

## 9. Cross-references

- `../../principles/accounting-principles.md` — double-entry framework rationale
- `../../principles/regulatory-compliance.md` — regulatory framework
- `docs/business/business_rules.md` — BR-GL-XX (in your project)
