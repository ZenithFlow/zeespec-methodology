---
doc: checklists/anti-patterns
type: checklist
version: 2.4.0
status: stable
last_updated: 2026-05-19
---

# ZeeSpec Anti-Patterns — 14 Common Pitfalls

> Catalogued from a 6-module pilot (5 original + investment 2026-05-18). Watch for these during authoring + review.
>
> **v2.4 (2026-05-19) — added Pattern #14** ("Spec authored from stale source") from investment module pilot R2 cross-module verification finding.
>
> **Note on examples:** The code snippets below come from the pilot project (PHP / Symfony / Doctrine) and use that stack's syntax — `$this->`, `::`, `.php` filenames, `#[ORM\...]` attributes. The **patterns themselves are stack-neutral**. Mental translation for other stacks:
>
> | PHP/pilot syntax | Java/Kotlin | Python | TypeScript | Go | Rust | C# | Ruby |
> |------------------|-------------|--------|------------|----|----|------|------|
> | `$this->method()` | `this.method()` | `self.method()` | `this.method()` | `s.Method()` | `self.method()` | `this.Method()` | `method` |
> | `Class::staticMethod()` | `Class.staticMethod()` | `Class.static_method()` | `Class.staticMethod()` | `Class.StaticMethod()` (or pkg func) | `Class::static_method()` | `Class.StaticMethod()` | `Class.static_method` |
> | `Service.php:265` | `Service.java:265` | `service.py:265` | `service.ts:265` | `service.go:265` | `service.rs:265` | `Service.cs:265` | `service.rb:265` |
> | `#[ORM\Column]` | `@Column` | `Column()` / `Field()` | `@Column` / Prisma model | `gorm:` tag | `table!` macro | `[Column]` | `db/schema.rb` |

## 1. AccountStatus pattern (false-positive enforcement)

**Symptom:** Spec says "INV-X enforced at service layer"; production accepts inputs that violate it.

**Example:**
```
Spec: "User::canWithdraw enforces kycLevel=FULL AND status=ACTIVE"
Production: function canWithdraw() { return $this->kycLevel === FULL; }
                                    ^ no accountStatus check
```

**Caught by:** R3 deep verifier reading actual code.

**Fix:** Downgrade Status tag from ✅ IMPL to 🚧 NOT-ENFORCED. File FU-MOD-X-NONBYPASS gap.

---

## 2. AccountStatus pattern (false-negative enforcement)

**Symptom:** Spec says "no UNIQUE constraint on X"; production actually HAS it.

**Example:**
```
Spec: INV-NOTIF-16 🚧 NOT-ENFORCED — no UNIQUE on (user_id, device_id)
Production: ALTER TABLE device_tokens ADD CONSTRAINT uniq_user_device UNIQUE (user_id, device_id);
```

**Caught by:** R1 reviewer reading migrations.

**Fix:** Upgrade Status tag to ✅ IMPL with migration citation.

---

## 3. Phantom method

**Symptom:** Spec cites `repository->getLatestPrice($asset)`; production has no such method.

**Example:**
```
Spec: "Use MarketDataRepository::getLatestPrice(stock, date) to fetch price"
Production: repository has findByAssetAndDate() but NOT getLatestPrice()
```

**Caught by:** R1 grep verification.

**Fix:** Update spec to cite actual method OR document as design-intent (🚧 DESIGN).

---

## 4. Phantom field

**Symptom:** Spec describes a column/field that doesn't exist in the entity.

**Example:**
```
Spec: ImportedDeposit.senderRegistrationNumber field (matcher Strategy 8 uses it)
Production: ImportedDeposit has no such column; BankStatementDTO doesn't expose it
```

**Caught by:** R3 column-by-column verification.

**Fix:** Update spec field list to match production OR file as gap.

---

## 5. Dead code in spec

**Symptom:** Spec describes feature X; production has the code but it's never invoked.

**Example:**
```
Spec: "3 SMS priority transports: high, normal, low"
Production: messenger.yaml defines all 3 transports BUT routing maps ALL SendSMSMessage to high_priority
            normal + low never receive messages
```

**Caught by:** R1 reading messenger.yaml + dispatch sites.

**Fix:** Document as FU-MOD-X-DEAD; either (a) wire up the unused code OR (b) remove from spec.

---

## 6. Stale line refs

**Symptom:** Spec cites `service.php:265` for a method now at line 397.

**Example:**
```
Spec: "AccountingService::createJournal at line 253"
Production: method is now at line 263 (+10 drift after 14 days of unrelated commits)
```

**Caught by:** B1 grep verification.

**Fix:** Update cited line refs. If drift > 200 lines, treat as significant spec staleness (Tier 0 re-author affected sections).

---

## 7. createdBy: 0 sentinel anti-pattern

**Symptom:** Service code hardcodes `createdBy: 0` instead of capturing real operator.

**Example:**
```
Production: FundJournalService.php has 20+ instances of:
            $this->accountingService->createJournal(..., createdBy: 0);
```

**Impact:** Audit trail BROKEN — "Who posted record #X?" → "user #0" (doesn't exist). Regulator-inspector test fails on any system with a "who did this?" audit requirement.

**Caught by:** R2 compliance review.

**Fix:** Inject the security/identity context + use real user OR seed a dedicated system-actor account (e.g., `system.eod`). File spawn task chip.

---

## 8. Unilateral cross-link declaration

**Symptom:** Module A's spec says "module B inherits HW-A-04"; module B's spec doesn't acknowledge it.

**Example:**
```
notification/gravity.md § "Downstream inheritance" lists: wallet inherits HW-NOTIF-02
wallet/gravity.md has NO § "From notification" section
```

**Caught by:** R2 reading both specs.

**Fix:** Update consumer module's gravity.md with "From X" section. Both specs must declare bidirectionally.

---

## 9. Architecture-level lie (sync vs async)

**Symptom:** Spec describes async dispatch; production has no message bus injection — actually synchronous.

**Example:**
```
Spec: "NotificationService dispatches async via <your message bus>"
Production: NotificationService has NO message-bus dependency; all 4 channels execute inline
```

**Caught by:** R1 reading service constructor / dependency-injection wiring.

**Fix:** Rewrite how.md §1-2 + gravity.md HW-X-03; document opt-in async wrapper.

---

## 10. Per-channel row claim (single-row anti-pattern)

**Symptom:** Spec says "only IN_APP writes a Notification row; others are channel markers".
Production: createNotification called PER channel — N rows for N-channel dispatch.

**Caught by:** R1 reading foreach loop in service.

**Fix:** Update spec to "per-channel rows" + adjust INV/HW status tags.

---

## 11. State machine fiction (dead enum cases)

**Symptom:** Spec describes 5-state machine; production only ever transitions 2-3 of them.

**Example:**
```
Spec: NotificationStatus has 5 cases (PENDING, SENT, DELIVERED, READ, FAILED)
Production: markAsRead() only sets isRead boolean — never mutates notification_status
            No delivery-receipt webhook ingestion (e.g., from your email/SMS provider) — DELIVERED never set
Effective state machine: PENDING → SENT | FAILED only
```

**Caught by:** R3 + R1 cross-checking state mutation paths.

**Fix:** Mark DEAD enum cases; either (a) remove from enum OR (b) wire up the missing transitions.

---

## 12. Approval workflow boundary mismatch

**Symptom:** ServiceA::approve() requires status=APPROVED; ServiceB::post() only accepts status=DRAFT.
End-to-end: approve→post chain ALWAYS throws.

**Example:**
```
JournalApprovalService::post requires JournalStatus::APPROVED
AccountingService::postJournal only allows JournalStatus::DRAFT
→ Every approved journal throws InvalidArgumentException
```

**Caught by:** R1 tracing end-to-end call chain.

**Fix:** Align status acceptance in postJournal; add regression test.

---

## 13. Hard DELETE on audit tables (retention-required tables)

**Symptom:** CLI command issues raw DELETE on audit-trail tables that regulation requires to retain.

**Example:**
```
backend/src/Command/BackfillGeneralLedgerCommand.php:68 — DELETE FROM general_ledger (no WHERE)
Evidence in dev.log:31608 — actually executed 2026-04-20
```

**Caught by:** R2 compliance review.

**Fix:** Add soft-delete trait + env-guard commands + role-gate destructive operations. File spawn task chip.

---

## 14. Spec authored from stale source (NEW v3.2)

**Symptom:** Spec cites generic / framework-standard / textbook values for things that production has localized. The spec is internally consistent + plausible but **does not match production constants**.

**Example (pilot 2026-05-18 investment module Gap-INV-CHART-OF-ACCOUNTS-DRIFT):**
```
Spec (how.md + ADR-INV-010 + ADR-INV-015):
  Bond Investment = 1310
  Stock Investment = 1320
  ETF Investment = 1330
  Commission Expense = 5240
  Realized Gain = 4230
  Realized Loss = 5230
  Bank Account = 1112

Production (backend/src/Service/Fund/FundAccountService.php ACCOUNT_CODES):
  Bond Investment (MNT) = 1410        ← НББС, NOT Western 1310
  Stock Investment (MNT) = 1420
  ETF Investment = 1430
  Trading Commission (MNT) = 700701   ← НББС "Арилжааны шимтгэл"
  Realized Gains (MNT) = 510205
  Realized Losses (MNT) = 8510
  Investment Bank (MNT) = 110301
```

The spec was internally consistent (Western GAAP chart-of-accounts convention), every journal pattern + 2 ACCEPTED ADRs were "self-coherent" — but production uses Mongolian НББС standard with entirely different code blocks. **Spec author trusted a generic source rather than reading `FundAccountService::ACCOUNT_CODES`.**

**Other manifestations of the same anti-pattern:**
- Currency codes (`USD` ✅ universal; but `MNT`/`KRW`/`CNY` need verification)
- Tax rates (regulation-specific; verify per jurisdiction)
- Account-code blocks (Western GAAP `1xxx-5xxx` vs Mongolian НББС `1xxx-7xxx-8xxx` vs Russian `01-99`)
- HTTP status code conventions (`409 Conflict` vs `422 Unprocessable` choices vary per framework)
- Cron schedule format (Unix vs Windows vs Kubernetes)
- Date format conventions (`YYYY-MM-DD` ISO vs `DD.MM.YYYY` local)

**Caught by:** R2 **cross-module verification** (R2 item #4 in prompt template). 5 prior review passes (Day 1 review, Day 2 review, Day 2 meta-review, Day 3 review, R3) all missed it because they verified the spec against **its own internal consistency**, not against the production constants. R2 caught it by spot-checking whether `accounting/gravity.md` mentioned `5240` Commission Expense per ADR-INV-015 — it didn't (because production uses `700701`).

**Why prior passes missed it:**

- B1 verification: checked enum counts + line refs, not constant values
- R3 deep review: read code-vs-spec but verified what spec claimed exists, not what spec was missing
- Day-N author reviews: re-read own writing — confirmation bias

R2 is the **only** pass that systematically cross-checks claims against sibling modules' specs + production-constant files.

**Detection heuristic — apply before authoring**

```
For every "magic value" in the spec (account code, GL number, tax rate,
currency code, status code, configuration constant, regulatory cap, etc.):

  1. Find the production file that owns the canonical list (e.g.
     ACCOUNT_CODES, REGULATORY_THRESHOLDS, CHART_OF_ACCOUNTS).
  2. Verify the cited spec value MATCHES the production canonical.
  3. If no canonical file exists in production → file as spec gap
     "no canonical source for X" before authoring further.
```

**Fix:** When found:

1. File gap with severity 🚨 P0 (spec-misleads-developer is high-cost)
2. Re-author the affected sections wholesale (not a single-line fix)
3. Update cross-references in sibling modules (`accounting/`, `nav/`, etc.)
4. Add to the relevant spec's CLAUDE.md entry-point a one-line warning: *"Account codes verified against `FundAccountService::ACCOUNT_CODES` 2026-MM-DD; do not trust copy-paste from older modules."*

**Pilot cost:** ~3-4h to re-author how.md journal patterns + where.md GL table + 2 ADR titles + glossary cross-references. Plus indefinite cost of "any code generated against the spec before the fix was wrong."

---

## Anti-pattern detection heuristics

When reviewing a spec, look for these signals:

- **"Verify R3"** placeholder in spec → R3 was skipped or incomplete
- **No file:line citation** for an invariant → Status tag should be 🚧 DESIGN
- **"Should" / "must" without code** → aspirational language, not enforced
- **Frontmatter `version: 0.1.0` aged > 30 days** → likely stale
- **Sentence "spec earlier claimed X"** anywhere → indicates a recent correction; verify cascade
- **`createdBy: 0` / `userId: 0` / `'system'` strings** → sentinel anti-pattern
- **`@deprecated` without removal date** → dead code waiting to be cleaned up

## Quick reference for fixing each anti-pattern

| Anti-pattern | Effort | Action |
|--------------|:------:|--------|
| 1. False-positive enforcement | 15min | Downgrade Status + file gap |
| 2. False-negative enforcement | 15min | Upgrade Status + cite migration |
| 3. Phantom method | 15min | Update spec |
| 4. Phantom field | 15min | Update spec field list |
| 5. Dead code | 30min | File FU-DEAD + decide remove vs wire |
| 6. Stale line refs | 5min | Re-grep + update |
| 7. createdBy:0 | 3-5 days | Spawn task chip |
| 8. Unilateral cross-link | 30min | Update both specs |
| 9. Architecture lie | 1-2h | Rewrite affected sections |
| 10. Per-channel row | 30min | Update INV + HW |
| 11. Dead enum case | 30min | Mark DEAD or wire up |
| 12. Approval boundary | 3-5 days | Spawn task chip |
| 13. Hard DELETE | 1-2 weeks | Spawn task chip (multi-phase) |

## When you find an anti-pattern

1. **Don't panic.** Anti-patterns are normal — every module has some.
2. **File it** in gaps.md with severity (P0/P1/P2/P3).
3. **Decide:** spec drift (fix inline) OR production bug (spawn chip).
4. **Continue review** — don't get sidetracked into bug fixing.
5. **Track velocity** — count anti-patterns per module; module hygiene improves over time.
