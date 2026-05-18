# ZeeSpec Anti-Patterns — 13 Common Pitfalls

> Catalogued from 5-module pilot. Watch for these during authoring + review.

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

**Impact:** FRC audit trail BROKEN — "Who posted journal #X?" → "user #0" (doesn't exist).

**Caught by:** R2 compliance review.

**Fix:** Inject SecurityContext + use real user OR seed `system.eod` user. File spawn task chip.

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
Spec: "NotificationService dispatches async via Symfony Messenger"
Production: NotificationService has NO MessageBusInterface; all 4 channels execute inline
```

**Caught by:** R1 reading service constructor.

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
            No Postmark webhook ingestion — DELIVERED never set
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

## 13. Hard DELETE on audit tables (FRC retention)

**Symptom:** CLI command issues raw DELETE on audit-trail tables that regulation requires to retain.

**Example:**
```
backend/src/Command/BackfillGeneralLedgerCommand.php:68 — DELETE FROM general_ledger (no WHERE)
Evidence in dev.log:31608 — actually executed 2026-04-20
```

**Caught by:** R2 compliance review.

**Fix:** Add soft-delete trait + env-guard commands + role-gate destructive operations. File spawn task chip.

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
