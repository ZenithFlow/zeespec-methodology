---
module: general-ledger
dimension: gravity
overlay: finance-accounting
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# General Ledger — GRAVITY (Hardwiring)

> Cross-cutting constraints that span dimensions. Code MUST honor these regardless of what other dimension files say.

> 🧭 **NORMALIZATION RULE (ZeeSpec v3 · Zachman 3.0 "one fact, one cell"):**
> Each HW below is a **pointer (composite)**, not a restatement. The rule's *substance, Status tag, and
> `file:line`* live in the primitive cell named under **Crosses** (`what.md` INV-GL-, `how.md` ALG-GL-,
> `who.md` SOD-GL-, …). A gravity entry holds only **composite-only** content: the cells it crosses +
> the **failure mode if those cells disagree**. (Rationale: `specs/ZACHMAN-ALIGNMENT.md` Tier 1·1A.)

## §1. Core hardwiring (HW-GL-*) — pointer entries

> Status/Source/Test are read from the primitive cells (e.g. `what.md/INV-GL-01`), not duplicated here.

### HW-GL-01 — Debit = Credit per journal (base currency)
- **Crosses:** `what.md/INV-GL-01` · `what.md/INV-GL-09` · `how.md/ALG-GL-POST-01`
- **Why it's gravity:** if WHAT (balanced lines) and HOW (posting path) disagree, an imbalanced journal can post → trial balance and every downstream report are wrong.

### HW-GL-02 — Journal immutability (no UPDATE, no DELETE)
- **Crosses:** `what.md/INV-GL-02` · `how.md/ALG-GL-REVERSE-01` (the corrective pattern)
- **Why it's gravity:** if a posted journal is mutated instead of reversed, the audit trail is falsified and the reversal pattern is bypassed.

### HW-GL-03 — Period state machine forward-only (except REOPEN)
- **Crosses:** `what.md/INV-GL-05` · `how.md/ALG-GL-PERIOD-CLOSE-01` · `who.md/SOD-GL-03`
- **Why it's gravity:** if timing (period state) and authority (who may reopen) disagree, a closed period is silently posted to → financials restated without trace.

### HW-GL-04 — Atomic posting (all-lines-or-none)
- **Crosses:** `how.md/ALG-GL-POST-01` · `where.md/F-GL-W-01`
- **Why it's gravity:** if the transaction boundary fails, a journal can persist some lines without its audit-log/outbox rows → unbalanced AND untraceable.

### HW-GL-05 — Outbox pattern for async events
- **Crosses:** `where.md/S-GL-08` · `when.md/T-GL-01`
- **Why it's gravity:** without same-TX outbox, an event is lost or double-sent → downstream modules diverge from the GL of record (no 2PC to fall back on).

### HW-GL-06 — Operator identity captured (no sentinels)
- **Crosses:** `what.md/INV-GL-07` · `who.md` §6
- **Why it's gravity:** if identity is not threaded from WHO into the WHAT row written, audit answers "user #0" → "who posted X?" is unanswerable → regulator inspection fails.
- ⚠️ **Pilot status:** HISTORICAL — was 🚧 NOT-ENFORCED (`createdBy:0` across 20+ sites). Authoritative status: see `what.md/INV-GL-07`.

### HW-GL-07 — All money math via Money/Decimal type
- **Crosses:** `what.md` (NUMERIC(18,4) columns) · `principles/accounting-principles.md/HW-ACC-20`
- **Why it's gravity:** a single `float`/`double` in any monetary path lets rounding drift accumulate across the system → reconciliation breaks far from the cause.

### HW-GL-08 — FX rate captured at posting time
- **Crosses:** `what.md/INV-GL-09` · `how.md/ALG-GL-POST-01`
- **Why it's gravity:** if the FX rate is not snapshotted at posting, base amounts become non-reproducible → restatement risk on every multi-currency journal.

### HW-GL-09 — Retention: no hard DELETE on retained tables
- **Crosses:** `why.md/R-GL-01` · `principles/regulatory-compliance.md/HW-REG-09` · `principles/financial-anti-patterns.md` #14
- **Why it's gravity:** a destructive command on a retention-required table violates statute system-wide, regardless of how correct the posting logic is.
- ⚠️ **Pilot status:** HISTORICAL — was 🚧 BROKEN (`BackfillGeneralLedgerCommand` raw DELETE in dev). Authoritative status: see the primitive.

### HW-GL-10 — Segregation of Duties enforced at service layer
- **Crosses:** `who.md/SOD-GL-01` · `who.md/SOD-GL-02` · `who.md/SOD-GL-03`
- **Why it's gravity:** if any one action path lets a single actor initiate + approve + execute, the fraud control is bypassed no matter what the data model allows.

### HW-GL-11 — Leaf-account posting only
- **Crosses:** `what.md/INV-GL-13` · `what.md/INV-GL-16`
- **Why it's gravity:** posting to an intermediate (roll-up) node double-counts balances up the hierarchy.

### HW-GL-12 — Multi-currency: base sums balance
- **Crosses:** `what.md/INV-GL-09` · `how.md/ALG-GL-POST-01`
- **Why it's gravity:** if base-currency aggregation and the balance rule disagree, a multi-currency journal looks balanced per-line but unbalances the trial balance.

### HW-GL-13 — Account type immutable after first transaction
- **Crosses:** `what.md/INV-GL-17`
- **Why it's gravity:** changing an account's type after it has postings silently reclassifies historical statements.

### HW-GL-14 — *(alias)* Period transitions forward-only
- **Alias of `HW-GL-03`** — not a separate constraint. See HW-GL-03. *(ID retained for cross-refs in `principles/accounting-principles.md/HW-ACC-14`.)*

### HW-GL-15 — Reversing entry uniqueness
- **Crosses:** `what.md/INV-GL-08` · `what.md/INV-GL-15`
- **Why it's gravity:** without a uniqueness guard a journal can be reversed twice → contra entries duplicated, balances doubly corrected.

### HW-GL-16 — *(alias)* Atomic posting
- **Alias of `HW-GL-04`** — not a separate constraint. See HW-GL-04. *(ID retained for cross-refs in `principles/financial-invariants-catalog.md`.)*

### HW-GL-17 — Account hierarchy integrity (no cycles)
- **Crosses:** `what.md` (account.parent_id FK)
- **Why it's gravity:** a cycle in the account tree makes roll-ups loop or mis-total.

### HW-GL-18 — Subledger ↔ GL reconciliation daily
- **Crosses:** `what.md/INV-GL-18` · `when.md` (EOD schedule) · `principles/financial-invariants-catalog.md/INV-FIN-24`
- **Why it's gravity:** if a subledger diverges from its control account and nothing reconciles them on schedule, the books are misstated undetected.

### HW-GL-19 — Audit log append-only + complete
- **Crosses:** `what.md` §1.5 (AuditLog) · `principles/financial-invariants-catalog.md/HW-FIN-03`
- **Why it's gravity:** if any mutation path skips the same-TX audit append (or audit rows are mutable), the forensic trail is incomplete exactly where it matters.

### HW-GL-20 — Correlation ID end-to-end
- **Crosses:** `principles/financial-invariants-catalog.md/HW-FIN-04`
- **Why it's gravity:** without a propagated correlation_id, a single request cannot be traced across audit + outbox + logs.

## §2. Inherited hardwiring (from upstream modules)

### From `auth`
- Identity model: every actor is a real user (or a designated system actor with is_system flag)
- Session: JWT (or your project's session mechanism)
- Inheritance impact: HW-GL-06 depends on auth providing valid actor.id

### From `market-data`
- FX rate freshness: rates updated daily by 09:30 local
- Inheritance impact: ALG-GL-POST-01 relies; HW-GL-08 captures the snapshot

## §3. Downstream-inherited (modules depending on GL)

> *Illustrative:* this shows the downstream-inheritance PATTERN. Not all named consumers are authored as modules in this reference overlay (only `wallet-settlement` / `kyc-aml` / `lending` stubs exist). Per the bidirectional cross-link rule, a real consumer MUST reciprocate the inherited HW in its own `gravity.md` § "From general-ledger".

### `wallet` inherits
- HW-GL-18 (subledger reconciliation)
- HW-GL-04 (atomic posting via postJournal)

### `settlement` inherits
- HW-GL-04 (atomic posting)
- HW-GL-19 (audit log)

### `fee-management` inherits
- HW-GL-04 (atomic posting for daily accrual)
- HW-GL-06 (system.fee-accrual actor identity)
- HW-GL-09 (retention)

### `nav` inherits
- INV-GL-10 (trial balance reconciliation as input requirement)
- INV-GL-18 (subledger sync)

### `regulatory-reporting` inherits
- HW-GL-19 (audit completeness)
- INV-GL-05 (period close as snapshot anchor)

## §4. Non-rules — what is NOT hardwired (NHW-GL-*)

### NHW-GL-01: GL is NOT real-time consistent across replicas
Reads may lag writes by up to N seconds (replica lag). Use master for read-after-write; replica for reporting / dashboards.

### NHW-GL-02: GL does NOT enforce business-level approval rules
e.g., "withdrawals > 1M MNT need manager approval" is wallet-level / settlement-level business logic; GL just records the resulting journal. GL enforces SoD on the POSTING action, not the underlying business approval.

### NHW-GL-03: Currency conversion is NOT free-form
FX rates come from designated providers per ALG-GL-POST-01. Code does NOT allow operator-entered FX rates (except as ADJUSTING with controller role + reason).

## §5. Cross-cutting patterns

### Outbox pattern (HW-GL-05)
Adopted across all finance modules in this overlay for at-least-once event delivery without 2PC.

### Append-only audit (HW-GL-19)
Shared with all overlay modules: wallet-settlement, kyc-aml.

### Service-layer SoD (HW-GL-10)
Pattern reusable in wallet, settlement, KYC modules.

## §6. Status summary

**Section overview (YYYY-MM-DD):** status is **read from the primitive cells** (e.g. `what.md/INV-GL-*`),
not stored here. Generate a roll-up from the primitives after R3 if a dashboard is needed —
do not hand-maintain status in this file (it would denormalize and drift).

Note: HW-GL-06 + HW-GL-09 carry a ⚠️ pilot-HISTORICAL flag (were BROKEN / NOT-ENFORCED in the pilot).
Your project may have a clean slate. HW-GL-14 + HW-GL-16 are **alias pointers**, not separate constraints.
