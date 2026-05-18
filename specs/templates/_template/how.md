---
module: MODULE_NAME
dimension: how
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — HOW (Processes, Algorithms, State Machine)

> **Stack-agnostic:** Process flows + algorithms as pseudocode. Stack-specific class names live in `where.md` § 5.
>
> **Source documents:**
> - Production code (highest authority) — see `CLAUDE.md` § Source documents
> - All algorithms MUST be verified directly against production services

## 1. Process overview

[High-level diagram or ASCII flowchart]

```
┌─────────────────────────────────────┐
│ MAIN PATH                           │
│   Caller invokes <Service>.<action>()│
│         │                           │
│         ▼                           │
│   Step 1: validate                  │
│   Step 2: process                   │
│   Step 3: persist                   │
│   Step 4: emit                      │
│   Step 5: return                    │
└─────────────────────────────────────┘
```

## 2. Algorithm — ALG-MOD_PREFIX-DESCRIPTIVE-NAME

> Naming: `ALG-<MOD_PREFIX>-<DESCRIPTIVE-NAME>` (e.g., `ALG-NOTIF-SEND-01`, `ALG-WAL-MATCHER-CUSTOMER`). ALL CAPS with hyphens; suffix `-NN` only if multiple algorithms share the same descriptive name.

**Production:** `path/to/<Service>.<method>()` line NN-MM (use your stack's class/method separator: `::`, `.`, `->`, `#`, etc.).

```
method(input1: Type, input2: Type) -> ReturnType:

  # Step 1: validate
  if not input1.isValid:
    throw ValidationError

  # Step 2: process
  result = compute(input1, input2)

  # Step 3: persist
  entity = new Entity(...)
  repository.save(entity)

  # Step 4: emit
  emit Event(...)

  return result
```

## 3. Sub-algorithms

### ALG-MOD_PREFIX-PARENT-NAME-HELPER: [helper name]

```
[pseudocode]
```

## 4. Process — P-MOD_PREFIX-NN

**Source:** `path/to/Handler.ext` line NN-MM.

```
Handler.process(message):
  Step 1: ...
  Step 2: ...
  catch Exception:
    Step 3: ...
```

## 5. State machine

```
                ┌─────────────┐
                │   STATE_A   │ (initial)
                └──────┬──────┘
                       │
            ┌──────────┴──────────┐
            │                     │
        action_x              action_y
            │                     │
            ▼                     ▼
       ┌─────────┐          ┌─────────┐
       │ STATE_B │          │ STATE_C │
       └─────────┘          └─────────┘
```

**Transition rules:**

| From | To | Trigger | Service method |
|------|-----|---------|----------------|
| STATE_A | STATE_B | [event] | [method] |
| STATE_A | STATE_C | [event] | [method] |

**Forbidden transitions:**
- STATE_C → STATE_A (terminal)

## 6. Validation tables

### V-MOD_PREFIX-01: Pre-action validation

| Check | Validator | Failure response |
|-------|----------|-----------------|
| [check] | [where enforced] | [exception / HTTP code] |

### V-MOD_PREFIX-02: Post-action validation

[Same pattern]

## 7. Cross-references

### Source documents
- Production code: [list key services + line refs]

### ADR cross-refs
- [ADR-MOD_PREFIX-NNN] — [decision name]

### Related dimensions
- `who.md` — actors triggering each step
- `when.md` — timing
- `where.md` § 5 — Tech Stack Binding
- `gravity.md` — HW-MOD_PREFIX cross-dimension constraints
- `gaps.md` — open questions + drift
