---
doc: core/checklists/severity-matrix
type: checklist
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# Severity Matrix — Gap Priorities + AI Behaviour

> Use in `gaps.md` to triage OPEN gaps. Drives whether AI proceeds or STOPs.

## The 4 severities

| Severity | Symbol | Definition |
|----------|:------:|------------|
| **P0 Critical** | 🚨 / 🔴 | Real money loss, compliance violation, runtime crash blocking core flow |
| **P1 Important** | 🟠 | Audit gap, dead code, missing guard, false invariant claim |
| **P2 Medium** | 🟡 | Stale line ref (<200 lines), drift, missing test |
| **P3 Low** | 🟢 | Style, naming, low-priority cleanup |

## AI behaviour by severity + ticket presence

| Severity | Has ticket? | AI behaviour |
|----------|:-----------:|--------------|
| 🚨 P0 | No | **STOP** — ask user; do not implement |
| 🚨 P0 | Yes (MOD-IMPL-XXX) | Refer to ticket; do NOT implement (production fix is separate workstream) |
| 🟠 P1 | No | **STOP** — ask user |
| 🟠 P1 | Yes | Cite gap; proceed only if explicitly invoked by user |
| 🟡 P2 | Either | Implement if obvious + cite gap |
| 🟢 P3 | Either | Implement + cite gap |

## Severity by domain (calibration)

> The columns below are **illustrative**, not normative. Pick the column that matches your domain, or add a new one. The pilot project's domain (regulated financial services) is shown as one example among many.

| Generic baseline | Financial / regulated (example: AML / national securities regulator) | E-commerce | Healthcare (HIPAA / GDPR Article 9) |
|------------------|---------------------------------------------------------------------|------------|--------------------------------------|
| **P0** Compliance violation, money loss | Compliance violation, money loss, reportable transaction misfile | Cart abandonment ≥5% impact | Patient safety, PHI breach |
| **P1** Audit gap, dead code, missing guard | AML/regulatory gap, audit failure | Conversion drop, payment bug | PHI exposure, GDPR breach |
| **P2** Drift, stale refs | Operational friction | UX paper cut, A/B test loss | Workflow inefficiency |
| **P3** Style, cleanup | Documentation drift | Style issue | Code quality |

## What qualifies as P0

A finding is P0 if ANY of these apply:

- Money loss or potential for money loss
- Regulatory enforcement action risk (your local regulator — e.g., national securities, central bank, tax authority, GDPR/CCPA enforcement)
- Runtime crash in core flow (e.g., every approval throws 500)
- Audit trail completely broken (e.g., createdBy: 0 sentinel)
- Data corruption in a system-of-record table (e.g., balance sheet wrong signs in finance; patient-record cross-contamination in healthcare; order-line totals diverging from line items in e-commerce)
- Single-actor money exfiltration vector
- Production bug already happened (incident log evidence)

## What qualifies as P1

A finding is P1 if ANY of these apply:

- Audit gap (operator identity missing but not always)
- Dead code (feature documented but never invoked)
- Missing guard (input validation absent at one layer of 3)
- False invariant claim (spec says enforced, actually partial)
- Race condition with low frequency
- Compliance gap for less-critical regulations

## What qualifies as P2

- Stale line ref < 200 lines
- Drift in count (e.g., enum says 39 cases, actual 40)
- Documentation copy-paste error
- Pseudocode typo

## What qualifies as P3

- Style inconsistencies
- Code comment improvements
- Module reorganization

## Severity-driven gap status

| Severity | Maximum allowed status |
|----------|----------------------|
| 🚨 P0 | 🔴 OPEN (block all related work) |
| 🟠 P1 | 🔴 OPEN OR 🟡 PROPOSED |
| 🟡 P2 | Any status |
| 🟢 P3 | Any status |

## Severity-driven response time

| Severity | Expected response |
|----------|-------------------|
| 🚨 P0 | < 1 week (spawn task chip immediately) |
| 🟠 P1 | < 1 month |
| 🟡 P2 | < 1 quarter |
| 🟢 P3 | When convenient |

## Composite gap severity (multi-impact)

If a gap affects multiple severities:

| Money loss + audit gap | Take MAX severity → P0 |
| Compliance + UX | Compliance wins → severity matches the regulatory impact |
| Race condition only at high concurrency | Frequency-adjusted → if <1% incidence, downgrade to P2 |

## Real examples (pilot + analogues in other domains)

> Pilot examples come from a regulated financial-services system. The right-hand columns show what an equivalent finding would look like in healthcare, e-commerce, and SaaS to help non-finance teams calibrate.

| Finding (pilot, finance) | Sev | Healthcare analogue | E-commerce / SaaS analogue |
|--------------------------|:---:|---------------------|----------------------------|
| Regulatory retention violation (hard DELETE on audit tables) | 🚨 P0 | Hard DELETE on medical-records / consent table | Hard DELETE on subscription / order-history table |
| `createdBy:0` sentinel across 20+ sites | 🚨 P0 | `chartedBy: 0` on patient-record updates | `actorId: 0` on org-config changes |
| Approval workflow boundary mismatch (every approved record throws) | 🚨 P0 | "Release patient note" path always throws | "Publish article" path always throws |
| Stale-read at maturity-event → over-distribution | 🚨 P0 | Stale-read at appointment-booking → double-booking | Stale-read at coupon redemption → over-issue |
| Tax remittance ignores foreign-currency bucket | 🚨 P0 | Insurance-claim totaller ignores secondary-payer bucket | Invoice totaller ignores foreign-currency line items |
| Per-type toggles DEAD CODE (UI shows but production ignores) | 🟠 P1 | Patient-consent toggles UI-only, no enforcement | Notification-preference toggles UI-only |
| Stale line refs (200+ drift) | 🟡 P2 | (same) | (same) |
| Enum count drift (39 → 45) | 🟡 P2 | (same) | (same) |
| Admin filter missing 35 enum cases | 🟢 P3 | (same) | (same) |

## Severity escalation triggers

A P1 escalates to P0 if:
- Production incident occurs (caught in log)
- Compliance audit raises it
- Multiple users report affected
- Cross-impact with another P0

A P2 escalates to P1 if:
- Drift accumulates (line refs > 500 off)
- Multiple modules cross-impacted
- Audit cycle approaches and gap remains

## Severity de-escalation triggers

A P0 de-escalates to P1 if:
- Workaround documented + operator-tested
- Risk window narrowed (e.g., only affects pre-launch funds)
- Compensating control added (e.g., daily reconciliation)

## How to use this matrix

### When authoring a gap

1. Describe the gap (what / where / impact)
2. Pick severity using the calibration tables
3. Decide ticket assignment (P0/P1 usually get spawn chips)
4. Set the AI behaviour expectation explicitly

### When reading a gap as AI

1. Check severity
2. Check ticket presence
3. Look up the row in the severity × ticket matrix
4. Apply the behaviour ("STOP" / "cite" / "proceed")

### When prioritizing remediation

```
Priority order:
1. 🚨 P0 with production evidence (dev.log, incident log)
2. 🚨 P0 with compliance impact
3. 🚨 P0 with money risk
4. 🟠 P1 with audit cycle approaching
5. 🟠 P1 with cross-module impact
6. 🟡 P2 batched per spec re-author cycle
7. 🟢 P3 when convenient
```

## Common mistakes

### Mistake 1: Inflating severity

Everything marked P0 → severity loses meaning. Reserve P0 for real production impact.

### Mistake 2: Not specifying ticket presence

"Gap-X-XXX 🚨 P0 OPEN" without a ticket reference → AI doesn't know if it should STOP or refer.

### Mistake 3: Severity drift over time

A gap filed 6 months ago as P1 may now be P0 (incident happened) or P2 (workaround landed). Re-triage during spec re-author cycles.

### Mistake 4: Severity vs Status confusion

- **Status** (🔴 OPEN / 🟡 PROPOSED / 🟢 RESOLVED) = where the gap is in its lifecycle
- **Severity** (🚨 P0 / 🟠 P1 / 🟡 P2 / 🟢 P3) = how urgent

A gap can be P0 OPEN (urgent + unresolved) OR P0 RESOLVED (urgent + fixed). Both are valid.
