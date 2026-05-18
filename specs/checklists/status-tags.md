---
doc: checklists/status-tags
type: checklist
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# Status Tag Convention

> Every claim about production state MUST carry one of these tags. Used in `what.md` invariants, `gravity.md` HW entries, `gaps.md` statuses, and `CLAUDE.md` ADR table.
>
> **Note on examples:** The code snippets below come from the pilot project (PHP/Doctrine) and use `#[ORM\Column]`, `OneToOne`, `.php` filenames as the example syntax. The **status-tag convention itself is stack-neutral**. Translate ORM annotations / file extensions / class syntax to your stack's equivalents (see `anti-patterns.md` for the per-stack translation table).

## The 5 tags

| Tag | Symbol | Meaning | AI behaviour |
|-----|:------:|---------|--------------|
| **IMPL** | ✅ | Implemented + verified in production with `file:line` citation | Cite + rely; may write code assuming this |
| **PARTIAL** | 🟡 | App-layer only; no DB constraint OR partial coverage | Cite + add defense-in-depth comment |
| **DESIGN** | 🚧 | Documented intent; NOT in production code | **DO NOT rely on it.** Treat as gap |
| **NOT-ENFORCED** | 🚧 | Production accepts inputs that violate the invariant | File as gap; spawn task chip if needed |
| **BROKEN** | 🚧 | Production attempts to enforce but fails (runtime crash, wrong result) | File as P0 production bug |

## Decision tree

```
Is there code in production that enforces it?
│
├── NO → 🚧 DESIGN
│
└── YES
    │
    Does the code actually work as intended?
    │
    ├── NO → 🚧 BROKEN (P0 production bug)
    │
    └── YES
        │
        Does production validate at multiple layers (DB + app)?
        │
        ├── DB constraint OR multiple service guards → ✅ IMPL
        │
        └── App-layer only OR partial coverage
            │
            Are there input paths that bypass enforcement?
            │
            ├── YES → 🚧 NOT-ENFORCED
            │
            └── NO → 🟡 PARTIAL
```

## Examples

### ✅ IMPL example

```markdown
| **INV-NOTIF-14** | ✅ IMPL | `CustomerNotificationSettings` is 1:1 with Customer (production uses `#[ORM\OneToOne]` + `JoinColumn(nullable: false, onDelete: CASCADE)`; R3 verified 2026-05-16) | `CustomerNotificationSettings.php:25-27` OneToOne |
```

Note:
- Has file:line citation
- Verification date specified
- AI can write code assuming this holds

### 🟡 PARTIAL example

```markdown
| **INV-NOTIF-13** | 🟡 PARTIAL | IN_APP notifications are ALWAYS dispatched (cannot opt out); `NotificationService::send` writes IN_APP first before fan-out | service-layer convention |
```

Note:
- No DB constraint enforces this
- Service layer is the only guard
- AI should add defense-in-depth (assert or extra check) when writing dependent code

### 🚧 DESIGN example

```markdown
| **INV-NOTIF-18** | 🚧 DESIGN | `CustomerNotificationSettings.security_alerts` default true; **design intent** is that user cannot disable critical alerts (LOGIN, 2FA). **R1-C3 verified 2026-05-16:** Production `NotificationSettingsProcessor::process()` accepts `securityAlerts=false` without rejection. NO service-layer guard. | **FU-NOTIF-SECURITY-NONBYPASS** filed |
```

Note:
- Spec describes intent
- Production does NOT enforce
- Has a gap ID
- AI must STOP if blocked by this

### 🚧 NOT-ENFORCED example

```markdown
| **INV-NOTIF-16** | 🚧 NOT-ENFORCED | One DeviceToken per (User, device_id) — **R3 verified 2026-05-16: NO UNIQUE constraint exists**. Production has only `idx_device_id` (NOT UNIQUE) + `idx_user_trusted`. App-layer dedup only (via service `registerOrUpdate` find-then-update pattern). Race condition possible if two concurrent mobile registrations | DeviceToken.php:17-18 indexes only; **FU-NOTIF-DEVICE-UNIQUE filed** |
```

Note:
- Production has NO enforcement
- Race condition documented
- Gap filed for resolution

### 🚧 BROKEN example

```markdown
| **HW-ACC-21** | 🚧 BROKEN (R1-P0.1 2026-05-17) | `JournalApprovalService::post()` requires APPROVED status; `AccountingService::postJournal()` only allows DRAFT — every approved journal throws `InvalidArgumentException` | AccountingService.php:468-470 + JournalApprovalService.php:172-181; spawn task chip created |
```

Note:
- Code tries to do the right thing
- Tries fails at runtime
- Spawn task chip is mandatory

## Status overview summaries

Every dimension file with status-tagged items SHOULD include a summary:

```markdown
### §6 status overview

**Summary (R3 re-counted YYYY-MM-DD, post-R1+R2):** ✅ **15 IMPL** · 🟡 **3 PARTIAL** · 🚧 **1 NOT-ENFORCED** · 🚧 **1 DESIGN** out of 20 invariants — **75% IMPL, 15% PARTIAL, 5% NOT-ENFORCED, 5% DESIGN**.

- ✅ IMPL (15): 01, 02, 03, 04, 05, 06, 07, 08, 10, 11, 12, 14, 15, 17, 19
- 🟡 PARTIAL (3): 09 (state machine convention), 13 (IN_APP-always service-layer convention), 20 (master switch pre-queue only — by-design)
- 🚧 NOT-ENFORCED (1): **INV-NOTIF-16**
- 🚧 DESIGN (1): **INV-NOTIF-18**
```

## When to upgrade/downgrade

### Upgrading 🟡 PARTIAL → ✅ IMPL

Requires:
- DB constraint added (UNIQUE, CHECK, FK NOT NULL)
- OR multi-layer enforcement (API + service + DB)
- OR regression test pinning the invariant

### Downgrading ✅ IMPL → 🟡 PARTIAL

Triggered by:
- R1 reviewer finds a bypass path
- New code path added that doesn't honor the invariant
- Production bug revealed enforcement gap

### Downgrading ✅ IMPL → 🚧 NOT-ENFORCED

Triggered by:
- R3 reviewer reads production code and finds the enforcement is absent
- Test added that demonstrates input violating the invariant is accepted
- AccountStatus false-positive pattern detected

### Upgrading 🚧 DESIGN → ✅ IMPL

Triggered by:
- Spawn task chip closed; production fix landed
- B1 verification of the closed fix
- Regression test added

## Common mistakes

### Mistake 1: Marking ✅ IMPL without file:line

```markdown
| INV-X-04 | ✅ IMPL | always-true invariant | (none) |
```

Reviewers will downgrade this. Always cite the enforcement code.

### Mistake 2: Marking 🟡 PARTIAL forever

If something is 🟡 PARTIAL for >6 months, ask: should we (a) promote to ✅ IMPL via DB constraint, OR (b) downgrade to 🚧 NOT-ENFORCED with a gap?

Status is a snapshot, not a destination.

### Mistake 3: Confusing 🚧 DESIGN with 🚧 NOT-ENFORCED

- **🚧 DESIGN** = spec describes intent; production has no code at all
- **🚧 NOT-ENFORCED** = production has code that LOOKS like enforcement but accepts violating inputs

Different fixes, different audit responses.

### Mistake 4: Marking everything ✅ IMPL after a quick skim

R3 will catch this. ✅ IMPL requires actual verification. Don't inflate.

## Tag color cheat sheet

```
✅ IMPL          (green check)
🟡 PARTIAL       (yellow circle)
🚧 DESIGN        (construction)
🚧 NOT-ENFORCED  (construction)
🚧 BROKEN        (construction — but with severity 🔴 P0)
```

## Cross-reference

- `severity-matrix.md` — how gaps relate to status tags
- `anti-patterns.md` — common Status tag mistakes
