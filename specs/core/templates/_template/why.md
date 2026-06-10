---
module: MODULE_NAME
dimension: why
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — WHY (Strategic Goals, Risks, Trade-offs)

> **Stack-agnostic:** Strategic context. WHY this module exists.

## 1. Strategic goals

| ID | Goal | Cross-references |
|----|------|------------------|
| G-MOD_PREFIX-01 | [Primary goal] | [BR-XX, user story] |
| G-MOD_PREFIX-02 | [Secondary goal] | [BR-YY] |

## 2. Business rules (BR catalog)

| BR | Statement | Source | Affects |
|----|-----------|--------|---------|
| BR-MOD_PREFIX-01 | [rule] | [docs/business/business_rules.md:NN] | [which dimension] |

## 3. Compliance drivers

| Regulation | Requirement | Affects | Coverage |
|-----------|-------------|---------|----------|
| [your applicable regulation — e.g., GDPR / HIPAA / PCI-DSS / SOX / your local regulator] | [requirement] | [field/process] | [✅/🟡/🚧] |

## 4. Cross-module dependencies

| Module | Direction | Reason |
|--------|-----------|--------|
| `<other-module>` | upstream / downstream | [what we need / what they need] |

## 5. Trade-offs

| Decision | Choice | Rejected alternative | Reason |
|----------|--------|---------------------|--------|
| [decision area] | [what we chose] | [what we didn't] | [trade-off rationale] |

## 6. Risks

> Status legend: ✅ MITIGATED · 🟡 PARTIAL · 🚧 OPEN

| ID | Status | Risk | Probability | Impact | Mitigation |
|----|:------:|------|:-----------:|:------:|-----------|
| R-MOD_PREFIX-01 | 🚧 OPEN | [risk] | [Low/Med/High] | [Low/Med/High] | [mitigation] |

### §6 status overview

**Summary:** ✅ X MITIGATED · 🟡 Y PARTIAL · 🚧 Z OPEN out of N risks.

## 7. Compliance + Regulatory

| Regulation | Requirement | How we satisfy |
|-----------|-------------|----------------|
| [regulation] | [requirement] | [implementation] |

## 8. What this dimension does NOT cover

- WHAT entities + invariants → see `what.md`
- HOW algorithms work → see `how.md`
- WHO enforces → see `who.md`
- WHEN events fire → see `when.md`
- WHERE storage lives → see `where.md`

## 9. Cross-references

- `docs/business/business_rules.md` — BR-MOD_PREFIX-XX
- Related dimensions: what (entities), how (algorithms), who (RBAC), when (timing), where (storage)
