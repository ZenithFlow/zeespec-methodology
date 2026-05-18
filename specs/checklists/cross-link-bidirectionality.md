# Cross-Link Bidirectionality Rule

> When module A inherits a constraint from module B, BOTH specs must declare the relationship. This is the single most important inter-module rule in ZeeSpec.

## The rule

If module A's code respects a constraint from module B, then:

1. **Module B's `gravity.md`** MUST list A in § "Downstream inheritance"
2. **Module A's `gravity.md`** MUST list B in § "From <module B>" (or "Upstream inheritance")

Both sides MUST declare the relationship. Unilateral declarations are an anti-pattern (caught by R2 reviewer).

## Why?

When module A's developer reads A's spec, they need to know which external constraints A depends on. When module B's developer refactors B, they need to know which consumers will break.

Unilateral declaration creates **silent breakage:**
- Module B refactors, removes HW-B-04
- Module A's code still assumes HW-B-04 holds
- Tests pass (no integration test catches it)
- Production: cross-module bug

## How to declare

### Owner side (module B's gravity.md)

```markdown
## §3. Downstream inheritance — modules that inherit FROM us

| Inheriting module | What it inherits | Sibling spec status |
|-------------------|------------------|---------------------|
| `module-A` | HW-B-04 (user-level addressing) | `module-A/gravity.md` § "From module-B" — ratified 2026-05-16 |
| `module-C` | HW-B-04 + HW-B-09 (security alerts) | `module-C/gravity.md` § "From module-B" — PROPOSED (cleanup phase) |
```

### Consumer side (module A's gravity.md)

```markdown
## From module-B (HW-B inheritance, ratified 2026-05-16)

> Module A inherits dispatch + storage contracts from `module-B` ZeeSpec. See `docs/specs/zeespec/module-B/gravity.md` § 1.

| Inherited HW | Why this module inherits | How it manifests |
|--------------|--------------------------|------------------|
| **HW-B-04** (User-level addressing) | A needs single-notification-per-user dedup | Resolved via Customer.getUser() |
| **HW-B-09** (Security alerts non-bypass) | Customer settings cannot disable A's auth-event alerts | Service-layer guard at AuthController:42 |
```

## When ratification is required

| Status | Ratification |
|--------|--------------|
| **ratified** | Both sides have declared (preferred) |
| **PROPOSED** | Only owner side has declared; consumer side is TBD |
| **TBD** | Either side may not have declared yet |

Module promotion to 🟢 Active REQUIRES all cross-links be ratified.

## Filing the gap

If you find unilateral declaration during review:

```markdown
### FU-MOD_PREFIX-CROSS-LINK — Sibling spec inheritance

**Problem:** 11+ consumer ZeeSpecs use HW-MOD_PREFIX cases owned by MODULE_NAME module but do NOT declare HW-MOD_PREFIX inheritance in their `gravity.md`. Same anti-pattern as asset_catalog's FU-ASSET-CROSS-LINK.

**Resolution plan (cleanup phase):**
1. Add `module-A/gravity.md` § "From MODULE_NAME" — HW-MOD_PREFIX-NN
2. Add `module-B/gravity.md` § "From MODULE_NAME" — HW-MOD_PREFIX-NN + HW-MOD_PREFIX-MM
3. ...

**Owner:** Tier-1 reviewer + sibling spec authors
```

## Real example

Notification module owns dispatch/storage contracts. 11 consumer modules inherit:

**notification/gravity.md § 2:**

```markdown
| Inheriting module | What it inherits | Status |
|-------------------|------------------|--------|
| customer | HW-NOTIF-02 (user-level addressing); LOGIN/LOGOUT/PASSWORD_RESET types | `customer/gravity.md` § "From Notification" — ratified 2026-05-16 |
| kyc | HW-NOTIF-01 + HW-NOTIF-02 + HW-NOTIF-05; KYC_* types (6 cases) | `kyc/gravity.md` § "From Notification" — ratified 2026-05-16 |
| contracts | HW-NOTIF-01 + HW-NOTIF-02 + HW-NOTIF-03 (sync dispatch); CONTRACT_* types | `contracts/gravity.md` § "HW-NOTIF inheritance" — ratified 2026-05-16 |
| ... (8 more) | ... | ... |
```

**customer/gravity.md** (one of the consumers):

```markdown
## From Notification (HW-NOTIF inheritance, ratified 2026-05-16)

> Customer module inherits dispatch + storage contracts from `notification` ZeeSpec.

| Inherited HW | Why this module inherits | How it manifests |
|-------------|--------------------------|------------------|
| **HW-NOTIF-02** (User-level addressing) | Notification.user_id resolves via Customer.getUser() → multi-customer User receives ONE notification per event | Multi-customer dedup at notification dispatch is automatic |
| **HW-NOTIF-09** (Security alerts non-bypass — DESIGN-ONLY) | Customer settings updates should reject `securityAlerts=false` | ⚠️ **NOT enforced** (FU-NOTIF-SECURITY-NONBYPASS); per-type toggles are DEAD CODE |
| Notification types consumed | LOGIN, LOGOUT, PASSWORD_RESET, TWO_FA_ENABLED, ACCOUNT_* (10 cases) | Note: auth-events bypass NotificationService (FU-NOTIF-AUTH-NO-INAPP) |
```

Note:
- ✅ Both sides declare
- ✅ Cite specific HW IDs
- ✅ Explain WHY each is inherited
- ✅ Document any caveats (DESIGN-ONLY, dead code)
- ✅ Reference back to owner module's file

## Inheritance vs dependency vs reference

| Term | Meaning |
|------|---------|
| **Inherits** | A's code MUST respect B's HW constraint |
| **Depends on** | A's code uses B's API but doesn't enforce B's HW |
| **References** | A's spec mentions B for context but no functional dependency |

Only **inheritance** requires the bidirectional cross-link rule. Dependency + reference are looser.

## Common mistakes

### Mistake 1: Owner declares, consumer doesn't

Owner:
```markdown
| module-A | HW-B-04 | TBD |
```

Consumer: (no mention)

→ Filed as gap; cleanup required.

### Mistake 2: Consumer declares, owner doesn't

```markdown
# module-A/gravity.md
## From module-B
| HW-B-04 | ... |
```

Owner: (no mention)

→ Owner module unaware. Refactor may break consumer.

Fix: Update owner module's gravity.md § Downstream inheritance.

### Mistake 3: Stale inheritance after constraint removed

Module B removes HW-B-04 (deprecated). Module A's spec still claims to inherit it.

→ During spec re-author cycle, re-verify all cross-links.

### Mistake 4: Wrong direction

Confusing "what we inherit" vs "what they inherit from us":

```markdown
# module-A/gravity.md (WRONG)
## Downstream inheritance ← this is for OWNER modules
| module-B | HW-B-04 | ... |
```

Should be:

```markdown
# module-A/gravity.md (RIGHT)
## From module-B  ← consumer perspective
| HW-B-04 | ... |
```

## Verification command

When reviewing module A, check each constraint A inherits:

```bash
# Look for cross-link references in A's gravity.md
grep -E "From <other-mod>|inherits" docs/specs/zeespec/A/gravity.md

# Then verify owner module declares A as consumer
grep "module-A" docs/specs/zeespec/<other-mod>/gravity.md
```

If owner side doesn't list A, file as cross-link gap.

## Special case: NIL dependency

Some sibling modules have NO inheritance relationship. Document this explicitly:

```markdown
## From notification (NO inheritance, verified 2026-05-16)

> fee_management is the **one consumer module that does NOT inherit from notification**.

**Verification:** `grep "NotificationService" backend/src/Service/Fee/` → 0 matches.

**By-design rationale:** Fee accrual + crystallize + pay are EOD-internal flows. They affect NAV (which indirectly notifies customers) but Fee module doesn't dispatch notifications directly.

**Conclusion:** No HW-NOTIF inheritance for fee_management. Documented to close the bidirectional cross-link gap.
```

This prevents future reviewers from filing the same "missing cross-link" finding.
