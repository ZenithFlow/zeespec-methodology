---
module: MODULE_NAME
type: entry-point
version: 0.1.0
status: draft (initial author YYYY-MM-DD)
last_updated: YYYY-MM-DD
owner: TBD
purpose: experimental — ZeeSpec methodology trial, not yet canonical
---

# MODULE_NAME — AI Spec Entry Point

This module is specified using **ZeeSpec** (10-file Zachman-derived framework, language-agnostic v2.0).
Read all dimension files BEFORE generating code.

> ⚠️ **Authoring scope statement:**
>
> This ZeeSpec captures the MODULE_NAME module's **specification**. Production code is the highest authority. Where doc and code disagree, **code is canonical**; spec author should flag the drift as a Gap-MOD_PREFIX-XX entry rather than silently choosing.
>
> **Canonical sources (in priority order):**
> 1. Production code (`backend/src/<MODULE>/*`) — highest authority
> 2. Existing 4-file canonical (`docs/specs/MODULE_NAME/{CLAUDE,decisions,implementation}.md`) if exists
> 3. Feature documentation (`docs/features/MODULE_NAME/*.md`) if exists
> 4. This ZeeSpec

## ⚠️ ACTIVE ISSUES

[Fill after B1 + R3 + R1+R2 review]

### Drift items (B1 verification YYYY-MM-DD)

| ID | Title | Severity | Status |
|----|-------|:--------:|--------|
| D1 | [description] | [P0/P1/P2/P3] | 🔴 OPEN |

### R3 production-code verification YYYY-MM-DD

[fill after R3 deep review]

## Read order

1. `why.md`     — strategic goals, business rules, risks, trade-offs
2. `what.md`    — entities, attributes, invariants, relationships
3. `how.md`     — algorithms, processes, state machines, validation
4. `who.md`     — actors, RBAC, Segregation of Duties
5. `when.md`    — triggers, schedules, SLAs, retry windows
6. `where.md`   — storage roles + § 5 Tech Stack Binding (the only stack-specific section)
7. `gravity.md` — cross-cutting hardwiring constraints (HW-MOD_PREFIX-XX) — CRITICAL
8. `gaps.md`    — OPEN QUESTIONS — DO NOT GUESS, ASK USER
9. `glossary.md` — terms

## Key architectural decisions

### Foundational ADRs

ADRs are summarized here (one-line per row). If you maintain a separate ADR log (e.g., `docs/specs/MODULE_NAME/decisions.md` from a 4-file legacy convention), cite both.

| ADR | Decision | Status | Source |
|-----|----------|--------|--------|
| **ADR-MOD_PREFIX-001** | [decision] | [ACCEPTED/DEFERRED/SUPERSEDED] | [file:line citation OR full text inline below] |

### Cross-module dependencies (we depend on these)

| Module | Constraint inherited | Reason |
|--------|---------------------|--------|
| `<upstream-module>` | [HW-X-NN inheritance] | [why we need it] |

### Cross-module dependencies (we are depended on by these)

| Module | What they inherit | Status |
|--------|-------------------|--------|
| `<downstream-module>` | [HW-MOD_PREFIX-NN] | [TBD until ratified in sibling spec] |

## When you write code (language-agnostic)

- **Cite rule IDs in comments** (e.g., `// INV-MOD_PREFIX-04`, `// HW-MOD_PREFIX-08`, `// ADR-MOD_PREFIX-013`)
- If a 🔴 OPEN gap blocks you → STOP, ask user (see `gaps.md` severity matrix)
- All `gravity.md` constraints (HW-MOD_PREFIX-XX) MUST be enforced when status is ✅ IMPL
- **Status tag behavior:**
  - ✅ IMPL — verified in production; cite + rely
  - 🟡 PARTIAL — app-layer only; add defense-in-depth
  - 🚧 DESIGN / NOT-ENFORCED — DO NOT rely; treat as gap

## Critical invariants (preview — see what.md for full list)

- **INV-MOD_PREFIX-01** — [most important invariant]
- **INV-MOD_PREFIX-02** — [second most important]

## Tech stack

> ✅ **Language-agnostic v2.0:** This spec describes MODULE_NAME **regardless of programming language**. Storage / queue / cache / framework specifics live in `where.md` § 5 "Tech Stack Binding".
>
> If porting to a different stack: replace `where.md` § 5 ONLY.

**Production binding ([Platform name], YYYY-MM-DD):**
- Backend runtime: [e.g., PHP 8.2 + Symfony 6.4 + Doctrine ORM 3.5]
- Relational DB: [e.g., PostgreSQL 15]
- Async transports: [e.g., Symfony Messenger + Redis]
- Cache: [e.g., Redis (Symfony Cache adapter)]

## Source documents

### Production code (highest authority)
- `backend/src/<MODULE>/EntityName.php`
- `backend/src/Service/<MODULE>/ServiceName.php`
- `backend/src/Enum/<MODULE>/EnumName.php`

### Canonical 4-file legacy specs (if your project has them — NOT part of ZeeSpec)
- `docs/specs/MODULE_NAME/CLAUDE.md` (legacy entry point)
- `docs/specs/MODULE_NAME/decisions.md` (legacy ADR log — supplemented by ZeeSpec's CLAUDE.md ADR table)
- `docs/specs/MODULE_NAME/implementation.md` (legacy implementation tracker)

### Feature documentation (if exists)
- `docs/features/MODULE_NAME/system.md`
- `docs/features/MODULE_NAME/testing.md`

### Cross-module ZeeSpec references
- `docs/specs/zeespec/<upstream-module>/`
- `docs/specs/zeespec/<downstream-module>/`

### Business rules
- `docs/business/business_rules.md` — BR-MOD_PREFIX-XX
