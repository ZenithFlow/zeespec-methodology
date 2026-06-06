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

This module is specified using **ZeeSpec** (10-file Zachman-derived framework, language-agnostic).
Read all dimension files BEFORE generating code.

> ⚠️ **Authoring scope statement:**
>
> This ZeeSpec captures the MODULE_NAME module's **specification**. Production code is the highest authority. Where doc and code disagree, **code is canonical**; spec author should flag the drift as a Gap-MOD_PREFIX-XX entry rather than silently choosing.
>
> **Canonical sources (in priority order):**
> 1. Production code (`<your-source-root>/<MODULE>/*` — e.g., `backend/src/...`, `src/<package>/...`, `internal/<module>/...`, `lib/<module>/...`) — highest authority
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

### Foundational ADRs (this module's own decisions)

ADRs are summarized here (one-line per row). For full ADR text, either inline below OR in `adr/` folder per `workflow/09-adr-lifecycle/01-adr-format-template.md` (Option B).

| ADR | Decision | Status | Source |
|-----|----------|--------|--------|
| **ADR-MOD_PREFIX-001** | [decision] | [Proposed/Accepted/Superseded/Deprecated] | [file:line OR adr/ADR-MOD_PREFIX-001.md] |

### Inherited ADRs (from other modules' decisions)

When this module relies on an ADR owned by another module, list it here. Don't duplicate the ADR text — cite the owner module. Per `workflow/09-adr-lifecycle/03-adr-relationships.md` (inherits relationship).

| ADR | Source module | Decision | Status |
|-----|---------------|----------|--------|
| ADR-OTHERMOD-NNN | `<owner-module>` | [one-line summary of the inherited decision] | [as marked in owner module] |

(If you have no inherited ADRs, this table can be empty. If you have many, group by upstream module.)

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

> ✅ **Language-agnostic:** This spec describes MODULE_NAME **regardless of programming language**. Concrete stack bindings (framework, ORM, queue, cache, classes) live ONLY in `where.md` § 5 "Tech Stack Binding".
>
> If porting to a different stack: replace `where.md` § 5 ONLY.

**Production binding (your platform, YYYY-MM-DD):**
- Backend runtime: [your language + framework + version]
- Persistence layer: [your DB engine + version + ORM/query layer]
- Async transports: [your message bus / queue / scheduler]
- Cache layer: [your cache engine + adapter]
- See `where.md` § 5 for full details.

## Source documents

### Production code (highest authority)
- [path/to/your/module/entity-files] — use your project's source root
- [path/to/your/module/service-files]
- [path/to/your/module/enum-or-type-files]

### Existing canonical specs (if your project has them — supplemented, not replaced, by ZeeSpec)
- `docs/specs/MODULE_NAME/*` — older spec format (if any)
- ZeeSpec's `CLAUDE.md` ADR table supplements any legacy ADR log

### Feature documentation (if exists)
- `docs/features/MODULE_NAME/*` — product / business documentation

### Cross-module ZeeSpec references
- `docs/specs/zeespec/<upstream-module>/`
- `docs/specs/zeespec/<downstream-module>/`

### Business rules
- `docs/business/business_rules.md` — BR-MOD_PREFIX-XX (or your project's BR catalog)
