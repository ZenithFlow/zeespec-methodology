# Invariant + ID Numbering Convention

> Pick a 3-7 char ALL CAPS module prefix once. Use it consistently across all 10 files.

## Module prefix selection

| Module name | Suggested prefix |
|-------------|------------------|
| notification | `NOTIF` |
| accounting | `ACC` |
| wallet | `WAL` |
| settlement | `SE` (NOT `SET` — reserved) |
| asset_catalog | `ASSET` |
| customer | `CUST` |
| order_management | `ORD` |
| reporting | `REP` |
| your-module | `YOURMOD` |

**Rules:**
- 3-7 characters
- ALL CAPS
- No special characters (only A-Z)
- Distinct from other module prefixes in your project
- Stable across project lifetime (don't rename later)

## ID prefix conventions

| Prefix | Meaning | Lives in | Example |
|--------|---------|----------|---------|
| `INV-<MOD>-NN` | Invariant (data integrity) | `what.md` | `INV-NOTIF-13` |
| `HW-<MOD>-NN` | Hardwiring (cross-dimension) | `gravity.md` | `HW-NOTIF-08` |
| `ADR-<MOD>-NNN` | Architecture Decision Record | `CLAUDE.md` ADR table (+ optional `decisions.md` legacy ADR log if your project has 4-file convention) | `ADR-NOTIF-009` |
| `ALG-<MOD>-NAME` | Algorithm | `how.md` | `ALG-NOTIF-SEND-01` |
| `P-<MOD>-NN` | Process | `how.md` | `P-NOTIF-PUSH-01` |
| `V-<MOD>-NN` | Validation table | `how.md` | `V-NOTIF-01` |
| `S-<MOD>-NN` | Storage role | `where.md` | `S-NOTIF-01` |
| `F-<MOD>-W-NN` | Failure-mode write semantics | `where.md` | `F-NOTIF-W-01` |
| `A-<MOD>-NN` | Actor | `who.md` | `A-NOTIF-02` |
| `SOD-<MOD>-NN` | Segregation of Duties | `who.md` | `SOD-NOTIF-03` |
| `T-<MOD>-NN` | Trigger/timing | `when.md` | `T-NOTIF-03` |
| `SLA-<MOD>-NN` | SLA target | `when.md` | `SLA-NOTIF-OTP-30s` |
| `R-<MOD>-NN` | Risk | `why.md` | `R-NOTIF-09` |
| `G-<MOD>-NN` | Strategic goal | `why.md` | `G-NOTIF-01` |
| `BR-<MOD>-NN` | Business rule | `why.md` | `BR-NOTIF-02` |
| `FU-<MOD>-DESC` | Follow-up gap | `gaps.md` | `FU-NOTIF-FCM-STALE-CLEANUP` |
| `Gap-<MOD>-NN` | Numbered gap | `gaps.md` | `Gap-NOTIF-14` |
| `RES-<MOD>-QN` | Research question | `gaps.md` | `RES-NOTIF-Q3` |
| `NHW-<MOD>-NN` | Non-hardwiring (explicit non-rule) | `gravity.md` | `NHW-NOTIF-2` |

## Numbering rules

### 2-digit zero-padded (NN)

For INV, HW, P, V, S, A, SOD, T, R, G, BR:
- 01, 02, 03, ..., 09, 10, 11, ..., 99
- Start at 01
- Don't reuse retired numbers

### 3-digit zero-padded (NNN)

For ADR (because ADRs accumulate over module lifetime):
- 001, 002, 003, ..., 099, 100, 101, ..., 999

### Descriptive suffix (DESC)

For ALG, FU:
- ALL CAPS with hyphens
- Examples: `ALG-NOTIF-SEND-01`, `FU-NOTIF-FCM-STALE-CLEANUP`

### Question number (QN)

For RES:
- Q1, Q2, Q3, ...

## Cross-module references

When citing IDs from another module:

```markdown
- See `notification/gravity.md` HW-NOTIF-02 (user-level addressing)
- Inherits BR-WAL-127 from wallet
- ADR-ACC-016 (Customer Wallet Trust) is foundational
```

ALWAYS use the full prefix (`HW-NOTIF-02` not just `HW-02`). Cross-module references are common; ambiguity is costly.

## Renumbering protocol

If you renumber an ID (e.g., HW-X-04 → HW-X-09):

1. **Don't.** Instead, add a deprecation note: "HW-X-04 superseded by HW-X-09 on YYYY-MM-DD"
2. Mark the old entry as superseded but keep it visible
3. Update all cross-references to the new ID
4. After 1 quarter of stability, may remove the deprecation note

## ID stability rules

| Stability commitment | What it means |
|----------------------|---------------|
| **Spec authoring phase** | IDs may change freely (no consumers yet) |
| **Tier 1 promotion** | IDs FROZEN for active modules; no renumbering |
| **Cross-module references** | If module X cites HW-Y-04, module Y MUST NOT renumber it |

## Examples from pilot

### Notification module IDs

```
INV-NOTIF-01..20  (20 invariants)
HW-NOTIF-01..10   (10 hardwiring constraints)
ADR-NOTIF-001..011 (11 ADRs)
ALG-NOTIF-SEND-01, ALG-NOTIF-CHANNEL-ENABLED-01, ALG-NOTIF-SMS-ROUTING-01
P-NOTIF-PUSH-01, P-NOTIF-EMAIL-HANDLER-01, P-NOTIF-NOTIFICATION-HANDLER-01
V-NOTIF-01..03    (3 validation tables)
S-NOTIF-01..05    (5 storage roles)
A-NOTIF-01..05    (5 actors)
SOD-NOTIF-01..03  (3 SoD constraints)
T-NOTIF-01..08    (8 timing rules)
R-NOTIF-01..14    (14 risks)
FU-NOTIF-FCM-STALE-CLEANUP, FU-NOTIF-TYPE-TOGGLE-UNUSED, ...
RES-NOTIF-Q1..Q4  (4 research questions)
```

### Accounting module IDs

```
INV-ACC-01..23   (23 invariants)
HW-ACC-01..28    (28 hardwiring constraints — high due to compliance)
ADR-ACC-001..018 (18 ADRs)
Gap-ACC-R3-XXX   (R3 round prefix used for traceability)
```

## Mistakes to avoid

### Mistake 1: Inconsistent prefix length

```
HW-NOTIFICATION-04  ← bad (too long)
HW-NOTIF-04         ← good
HW-N-04             ← bad (too short, ambiguous)
```

### Mistake 2: Mixing prefix styles within a module

```
INV-NOTIF-01, INV-Notif-02, INV-notif-03  ← inconsistent
INV-NOTIF-01, INV-NOTIF-02, INV-NOTIF-03  ← consistent
```

### Mistake 3: Forgetting zero-padding

```
INV-NOTIF-1, INV-NOTIF-2, ..., INV-NOTIF-10, INV-NOTIF-11  ← sorts wrong
INV-NOTIF-01, INV-NOTIF-02, ..., INV-NOTIF-10, INV-NOTIF-11 ← sorts right
```

### Mistake 4: Renumbering after Tier 1 promotion

Breaks cross-module references silently. Don't do it.

### Mistake 5: Using descriptive suffix for INV/HW

```
INV-NOTIF-USER-ID-NOT-NULL  ← bad (changes if rule meaning changes)
INV-NOTIF-01                ← good (immutable ID; description in body)
```

Reserve descriptive suffixes for ALG, P, FU (which need readable names).
