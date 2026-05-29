---
doc: workflow/08-code-drift-management/02-drift-categorization
type: workflow-method
phase: code-drift-management
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# Drift Categorization — 4-Type Framework

> Every drift finding falls into one of 4 categories. Categorization determines severity + resolution path. Mis-categorization is the most common drift-management error.

## The 4-type framework (summary)

| Type | Name | Description | Default severity | Resolution path |
|------|------|-------------|:----------------:|------------------|
| **Type 1** | Citation drift | Line refs / file paths / method names changed | 🟡 P2 | Spec edit |
| **Type 2** | Field/enum drift | Entity field count / enum case count changed | 🟡 P2 → 🟠 P1 | Spec edit + invariant review |
| **Type 3** | Behavioral drift | Code behavior diverges from spec claim | 🟠 P1 → 🚨 P0 | Spec edit + chip OR ADR |
| **Type 4** | Architectural drift | Module structure / boundaries changed | 🚨 P0 | ADR + module re-author |

> **A 5th axis — spec-internal normalization (NOT spec↔code).** The 4 types above are all *spec vs code*. A separate check is *spec vs itself*: no fact duplicated across files; `gravity.md` is pointer-only; no dimension leakage (Zachman Rule 3+5, "one fact, one cell"). Default 🟡 P2 — but it is the **leading indicator of future drift** (duplicated facts drift apart), so resolve promptly. Linted by R5 (its "Normalization lint" section) + R3. See `ZACHMAN-ALIGNMENT.md` Tier 1·1A.

## Type 1 — Citation drift

### Definition

A `file:line` citation in the spec no longer points to the correct location in code. The underlying CODE may be unchanged; only its LOCATION changed.

### Examples

```markdown
# what.md INV-WAL-04
**Source:** `backend/src/Service/WalletService.php:265-289`

# Reality (after refactor):
The walletService.php was renamed to WalletProcessor.php and lives at
backend/src/Services/Wallet/WalletProcessor.php:189-213
```

### Detection signal

- Git diff shows file rename / move
- Method renamed (e.g., `getWallet()` → `findWallet()`)
- Methods reordered (line numbers drift)
- Refactor splits one large file into multiple smaller ones

### Detection automation

Easy. Script that:
1. Parse spec for `file:line` citations + method/class names
2. Grep code for each cited symbol
3. Report mismatches (symbol not found, found at different line, etc.)

### Severity

Default 🟡 P2. Doesn't break compliance or invariants.

Escalate to 🟠 P1 if:
- Spec was relied upon by another team member who couldn't find the cited method
- > 50% of citations in a single dimension file are stale (spec essentially useless)
- Pattern of citation drift suggests deeper neglect

### Resolution

1. Run search-and-replace: cited path/line → new path/line
2. Commit spec edit with message: "B1 drift fix: update citations for <module> after <refactor name>"
3. Update CLAUDE.md "Drift items" table
4. No chip needed (no production bug)

### Prevention

- CI drift scanner (Layer 1)
- Refactoring checklist: include "Update ZeeSpec citations" step

## Type 2 — Field/enum drift

### Definition

The COUNT of entity fields, enum cases, table columns, or method parameters in the spec differs from production.

### Examples

```markdown
# what.md § 1.1 Wallet entity
| Field | Type | Notes |
|-------|------|-------|
| id, customer_id, balance, currency, status, ... | | (12 fields total) |

# Reality:
Production wallet table has 14 columns. New fields:
- freeze_reason TEXT NULL (added 2026-03 for compliance freeze workflow)
- frozen_until TIMESTAMPTZ NULL (added 2026-03)
```

### Detection signal

- New columns added to a table (DB migration)
- New enum cases added to an enum class
- New fields added to an entity / DTO
- Method gained new parameter(s)

### Detection automation

Moderate complexity. Per-stack:

- **Counting columns:** parse ORM entity file (count `@Column` annotations or equivalent)
- **Counting enum cases:** parse enum file (count case declarations)
- **Counting parameters:** parse method signature
- Per `workflow/02-b1-verification.md` recipes

### Severity

Default 🟡 P2 (counts wrong but spec still useful).

Escalate to 🟠 P1 if:
- Drift > 30% of original count (e.g., spec says 10 fields; production has 15)
- New field is in critical-path table (Wallet, Account, Customer, KYC)
- New field's purpose is unclear from name alone (suggests new invariant exists but undocumented)

Escalate to 🚨 P0 if:
- New field bypasses an existing invariant (e.g., new `is_admin_override` field bypasses approval workflow)
- New field stores compliance-relevant data without corresponding HW entry

### Resolution

1. Update spec entity tables with new fields/cases
2. **CRITICAL:** investigate each new field's purpose
   - Read the code that introduced it (git blame the migration)
   - Read the PR description
   - Talk to the engineer if needed
3. If new invariant exists: add INV-MOD-NN with status tag + citation
4. If new field is just data (no invariant): note in spec
5. If new field bypasses existing invariant: file as Gap-MOD-DRIFT-NN 🟠 P1 OR 🚨 P0

### Prevention

- CI drift scanner counts fields/enums per PR
- Migration review checklist includes "Does this field add an invariant?"
- ZeeSpec-aware migration template (auto-prompts for INV/HW review)

## Type 3 — Behavioral drift

### Definition

Code BEHAVIOR diverges from what spec claims. Method signatures, file paths, field counts may all match — but what the code DOES is different.

### Subtypes

#### 3a. Algorithm changed

```markdown
# how.md ALG-WAL-DEPOSIT-01
Pseudocode:
  ASSERT customer.kyc_tier >= TIER_BASIC
  ASSERT amount >= 100_000 MNT
  Compute fee = amount * 0.005
  ...

# Production reality:
Production code now uses tiered fee:
  if amount < 1_000_000: fee = amount * 0.005
  elif amount < 10_000_000: fee = amount * 0.0025
  else: fee = amount * 0.001
```

#### 3b. Validation removed/changed

```markdown
# what.md INV-WAL-04
Status: ✅ IMPL
"Withdrawal amount must be > 0 (rejected if zero or negative)"

# Production reality:
Validation removed in PR #1247 (hot fix for "amount = 0 in legitimate
adjustment case"); now accepts 0 (with audit reason).
```

#### 3c. State machine changed

```markdown
# how.md state diagram
PENDING → COMPLETED → REVERSED

# Production reality:
New state added: PENDING → AWAITING_APPROVAL → COMPLETED → REVERSED
```

#### 3d. Cross-module call changed

```markdown
# how.md
walletService.process() calls accountingService.postJournal() synchronously.

# Production reality:
Refactored to outbox pattern: walletService.process() emits
WalletProcessedEvent to outbox; separate worker consumes + posts journal.
```

### Detection signal

- Hard to auto-detect; requires reading code
- Signals: PR title mentions algorithm change; bug fix that changes behavior; refactor mentions invariant removal

### Detection method

Layer 2 (scheduled review) is primary detection. Layer 3 (triggered after big PR) catches the rest.

For each ALG-MOD-NN in `how.md`:
1. Open the cited code
2. Read end-to-end
3. Compare to pseudocode in spec
4. Note any divergence

For each INV-MOD-NN in `what.md`:
1. Find code path that enforces it
2. Verify enforcement still happens
3. Verify no new bypass paths

### Severity

Default 🟠 P1. Spec is actively misleading.

Escalate to 🚨 P0 if:
- Behavior change touches compliance invariant (HW-MOD-NN)
- Behavior change creates security vulnerability
- Behavior change has customer-money impact
- Behavior change creates audit gap (e.g., createdBy:0)

### Resolution — KEY DECISION

This is the critical decision point:

```
Is the behavior change INTENTIONAL or a BUG?

INTENTIONAL (deliberate design change):
  → Write ADR (per workflow/09-adr-lifecycle/)
  → Update spec to reflect new behavior
  → Bump status tags
  → Investigate: does the change preserve all existing invariants?
    If not: discuss whether invariant should also change OR be defended in new code
  → Drift is LEGITIMIZED by ADR

BUG (regression / unintended behavior):
  → File spawn task chip (per workflow/06-spawn-task-chips.md)
  → DO NOT update spec to match buggy code
  → Spec remains the source of truth for INTENT
  → Code restored to align with spec
```

### Worked example — distinguishing bug vs design change

**Scenario:** Drift scan found that `createWallet()` no longer enforces `KYC tier ≥ FULL`; accepts TIER_BASIC.

**Investigation:**
- `git blame` reveals PR #1432 (2026-04-10)
- PR description: "Allow TIER_BASIC customers to create wallets for read-only access (cannot deposit/withdraw)"
- PR reviewer approved without ADR

**Analysis:**
- This is an INTENTIONAL design change, NOT a bug
- But change wasn't documented as ADR; spec still says TIER_FULL required → spec is misleading

**Resolution path:**
1. Write retroactive ADR-WAL-NNN: "Allow TIER_BASIC for read-only wallet creation"
2. Update INV-WAL-02 to reflect new semantics: "TIER_BASIC for wallet creation; TIER_FULL for any money movement"
3. Add NEW invariant INV-WAL-XX: "Wallet operations beyond read require TIER_FULL"
4. Verify enforcement: is INV-WAL-XX actually enforced on every deposit/withdrawal path?
5. If not enforced: that's a BUG (separate spawn chip)

### Prevention

- PR template requires "ZeeSpec impact" section: which INV/HW affected?
- Reviewers refuse merge if spec impact not addressed
- ADR required for behavioral changes to existing INV/HW

## Type 4 — Architectural drift

### Definition

Module structure / boundaries / dependencies have changed since spec was written. The spec describes one architecture; production has another.

### Examples

#### 4a. Module split

```markdown
# Spec says: PaymentService is a single class with 12 methods.

# Production reality:
Refactored to:
- PaymentInitiationService (3 methods)
- PaymentExecutionService (4 methods)
- PaymentReconciliationService (3 methods)
- PaymentReportingService (2 methods)

Each in its own file, with shared PaymentDomain entity classes.
```

#### 4b. Sync → Async

```markdown
# Spec says: synchronous flow A → B → C → D.

# Production reality:
A → emits Event1 → consumed by worker → B → emits Event2 → ...
Now eventually-consistent with outbox pattern.
```

#### 4c. Cross-module boundary change

```markdown
# Spec says: wallet calls bank-integration directly via SDK.

# Production reality:
wallet → API gateway → bank-integration (new gateway introduced for rate limiting).
```

#### 4d. New dependency introduced

```markdown
# Spec says: wallet depends only on accounting + kyc.

# Production reality:
wallet now also depends on risk-engine (added for real-time fraud scoring).
```

#### 4e. Storage layer changed

```markdown
# Spec says: PostgreSQL single instance.

# Production reality:
Split: writes go to master; reads from replica pool; cache layer
(Redis) added for hot wallets.
```

### Detection signal

- Architectural changes are HUMAN-visible (engineers know about them)
- Code review of PR title / description usually surfaces
- Sprint planning reveals upcoming changes
- Refactor announcement

### Detection method

Manual. Architectural drift is rarely caught by automation.

Quarterly architecture review:
1. List all modules
2. For each: compare spec's where.md § 5 + how.md flow diagrams to current code
3. Flag any structural mismatch

### Severity

🚨 P0 default. Spec is materially wrong about the system's architecture.

### Resolution — ALWAYS REQUIRES ADR

Architectural drift CANNOT be silently corrected by spec edit. It requires:

1. **ADR documenting the architectural change** (per `workflow/09-adr-lifecycle/`)
2. **Re-author of affected dimensions:**
   - `how.md` — new algorithm flow
   - `where.md` — new tech stack binding
   - `gravity.md` — HW constraints may have changed (sync→async = different atomicity guarantees)
3. **Re-do B1 + R3** against new structure
4. **Re-do R1+R2** for cross-cutting verification
5. **Possibly split spec into multiple modules** (if module was split)

### Worked example — module split

**Scenario:** `PaymentService` split into 4 services in Q1 refactor.

**Current state:**
- One module `payment` with 10-file ZeeSpec describing monolithic PaymentService

**Resolution:**

```
1. Write ADR-PAY-NNN: "Split PaymentService into Initiation/Execution/
                        Reconciliation/Reporting per single-responsibility"

2. Decision: 4 separate ZeeSpec modules OR 1 module with sub-services?
   - 4 modules: cleaner; each focused; more cross-module refs to maintain
   - 1 module: easier to keep coherent; risk of bloat

3. If 4 separate modules:
   a. Author 4 new ZeeSpec module dirs:
      - payment-initiation/
      - payment-execution/
      - payment-reconciliation/
      - payment-reporting/
   b. Old `payment/` archived (marked SUPERSEDED in CLAUDE.md)
   c. Cross-module refs: each module's gravity.md "Inherited HW" updated
   d. ADR cross-references at top of each new CLAUDE.md

4. If 1 unified module:
   a. Re-author how.md to show 4 sub-services + their interaction
   b. Re-author where.md § 5 with 4 service classes
   c. Re-do B1 + R3 + R1+R2 for full module

5. Engineering impact: typically minimal (this is a doc activity); but if
   sub-services have different SLAs / RBAC, those are new INV entries
```

### Prevention

- Architectural decisions BEFORE code:
  - Architect proposes change → ADR drafted → review → ADR accepted → code
  - Spec authors notified at ADR-acceptance time so spec re-author can be planned
- Architecture review cadence: quarterly
- "Architecture impact" section in PR template for refactors

## Severity matrix for drift

Cross-reference with `checklists/severity-matrix.md`:

| Drift type | Default | Escalate to P1 if | Escalate to P0 if |
|------------|---------|--------------------|--------------------|
| Type 1 | 🟡 P2 | > 50% citations stale | (almost never) |
| Type 2 | 🟡 P2 | > 30% count drift OR critical-path field | New field bypasses invariant OR adds compliance gap |
| Type 3 | 🟠 P1 | Touches HW constraint | Touches compliance / money / security |
| Type 4 | 🚨 P0 | (default) | (default) |

## How to record drift in spec

Add to module's `CLAUDE.md` under "ACTIVE ISSUES":

```markdown
### Drift items (drift scan YYYY-MM-DD)

| ID | Type | Title | Severity | Status | ADR? | Chip? |
|----|:----:|-------|:--------:|--------|:----:|:-----:|
| D1 | 1 | WalletService renamed; 12 citations stale | 🟡 P2 | 🔴 OPEN | no | no |
| D2 | 2 | Wallet entity gained 2 columns (freeze_reason, frozen_until) | 🟠 P1 | 🟡 PROPOSED | no | no |
| D3 | 3 | KYC tier check removed in createWallet; intentional? | 🚨 P0 | 🔴 OPEN | TBD | TBD |
| D4 | 4 | PaymentService split into 4 sub-services | 🚨 P0 | 🟡 PROPOSED | ADR-PAY-012 | no |
```

After resolution, mark 🟢 RESOLVED + cite resolution commit/PR/ADR.

## Avoiding mis-categorization

Common errors:

| Looks like | Actually is | Why |
|-----------|------------|-----|
| Type 1 (citation) | Type 3 (behavior) | Method renamed but ALSO behaves differently; renaming is cosmetic for the change |
| Type 2 (field) | Type 3 (behavior) | New field introduces new invariant (e.g., `frozen_until` enforces time-based unfreezing) |
| Type 2 (enum) | Type 4 (arch) | New enum case represents new state in state machine = potentially new architecture |
| Type 3 (behavior) | Type 4 (arch) | Behavioral change spans modules = architectural |
| Type 4 (arch) | Type 2 (field) | Sometimes only DB schema changed; code architecture same |

**Heuristic:** if in doubt, escalate to the higher type. Lower types are subsets of higher types in terms of detection effort but higher types require more thorough resolution.

## Cross-references

- `01-drift-detection-strategies.md` — when to look for drift
- `03-auto-drift-detection.md` — CI tools that find Type 1+2
- `04-drift-resolution-playbook.md` — per-type recipes
- `workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md` — Type 3+4 drift → ADR
- `workflow/06-spawn-task-chips.md` — Type 3+4 drift = bug → chip
- `checklists/severity-matrix.md` — severity calibration baseline

## Next

→ `03-auto-drift-detection.md` — CI / git-hook implementation
→ `04-drift-resolution-playbook.md` — per-type resolution recipes
