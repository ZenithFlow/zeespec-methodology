---
module: MODULE_NAME
dimension: who
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — WHO (Actors, RBAC, Segregation of Duties)

> **Stack-agnostic:** Actor inventory + permission model. Concrete role names live in `where.md` § 5.

## 1. Actor inventory

| ID | Actor type | Description |
|----|------------|-------------|
| **A-MOD_PREFIX-01** | End user / Customer | [purpose] |
| **A-MOD_PREFIX-02** | System / Worker | [internal automation] |
| **A-MOD_PREFIX-03** | Operator / Admin | [staff role] |
| **A-MOD_PREFIX-04** | External provider | [partner / 3rd party] |
| **A-MOD_PREFIX-05** | Calling module | [sibling spec] |

### A-MOD_PREFIX-01: [Actor name]

**Capabilities:**
- [What they can do]

**Cannot:**
- [What's forbidden]

**Access:** [auth mechanism — JWT / OAuth / mTLS / cron token]

### A-MOD_PREFIX-02: System / Worker

**Capabilities:**
- [What system processes do]

**Cannot:**
- [Bounded constraints]

**Access:** [No user session — runs under cron / message handler]

## 2. RBAC matrix

| Operation | ROLE_USER | ROLE_OPERATOR | ROLE_ADMIN | System |
|-----------|:-:|:-:|:-:|:-:|
| Read own resource | ✅ | ✅ | ✅ | - |
| Read others' resource | ❌ | ✅ | ✅ | ✅ |
| Modify own resource | ✅ | ❌ | ✅ | - |
| Modify others' resource | ❌ | ❌ | ✅ | ✅ |

## 3. Segregation of Duties

### SOD-MOD_PREFIX-01: [SoD constraint name]

> [Plain-English explanation of who can do what]

### SOD-MOD_PREFIX-02: Two-eyes principle

> If applicable: actor who creates X cannot approve X

### SOD-MOD_PREFIX-03: [Other SoD]

## 4. Surface-level auth gates

### API endpoints

| Endpoint | Method | Required role | Notes |
|----------|--------|--------------|-------|
| `/api/me/resource` | GET | ROLE_USER | own only |
| `/api/admin/resource` | GET | ROLE_ADMIN | all |

### Service-layer guards

| Service method | Guard | Reason |
|----------------|-------|--------|
| `<MainService>.<action>()` | Authorization check | [reason] |

## 5. Auth flow integration

[Diagram or description of how this module's auth integrates with global auth]

## 6. Compliance + audit responsibilities

| Need | Responsible actor | Mechanism |
|------|-------------------|-----------|
| Audit trail of all actions | A-MOD_PREFIX-02 (system) | [audit log] |
| User identity capture | A-MOD_PREFIX-03 (operator) | [JWT/session] |
| FAILED action review | A-MOD_PREFIX-03 (admin) | [retry mechanism] |

## 7. What this dimension does NOT cover

- WHAT resources exist → see `what.md`
- HOW actions execute → see `how.md`
- WHY SoD required → see `why.md`

## 8. Cross-references

- Related dimensions: what (entities), how (algorithms), where (auth integration)
