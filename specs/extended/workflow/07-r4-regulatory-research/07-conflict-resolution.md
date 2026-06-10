---
doc: extended/workflow/07-r4-regulatory-research/07-conflict-resolution
type: workflow-research-method
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain
---

# Conflict Resolution — When Authorities Disagree

> **Domain-agnostic.** During R4 research you'll discover sources that **disagree with each other**: statute vs implementing regulation; old vs new amendment; FAQ vs binding rule; one jurisdiction vs another; international standard vs national transposition; regulator A vs regulator B. This file gives you the **hierarchy + decision protocol** for resolving conflicts.

## Types of conflict

### Type 1 — Hierarchical conflict (within one jurisdiction)

Higher-authority source contradicts lower-authority source.

**Resolution:** Higher authority wins.

**Hierarchy (descending):**

```
Constitution / fundamental law
    ↓
Primary statute (passed by legislature)
    ↓
Subordinate regulation (issued by executive / regulator under statute)
    ↓
Implementing rule / circular / resolution
    ↓
Agency guidance note / Q&A / FAQ
    ↓
Industry interpretation (Tier 3)
```

**Example:**
- Statute says "CTR threshold = 20M MNT"
- Regulator FAQ says "CTR threshold = 25M MNT" (typo / outdated)
- **Statute wins. Cite statute. Note FAQ discrepancy in research log for regulator clarification.**

### Type 2 — Temporal conflict (within one jurisdiction)

Old version vs new version of the same authority.

**Resolution:** Most-recent version in force wins.

**Exceptions:**
- Transition periods: old + new both apply during the transition (cite both with effective-date markers)
- Grandfathering: pre-existing contracts may continue under old rules (rare but exists)
- Retroactive provisions: rare, usually constitutionally suspect; check carefully

**Example:**
- Statute originally (2013) set threshold at 10M MNT
- Amendment (2017) raised to 20M MNT, effective 2018-01-01
- 2026 spec: cite 20M MNT (current); note in source registry "Original 10M MNT raised to 20M per 2017 amendment effective 2018-01-01"

### Type 3 — Cross-source conflict (within one jurisdiction)

Two different sources at the SAME hierarchy level disagree. E.g., two different regulator resolutions, or two statute provisions that seem to overlap.

**Resolution:** Apply legal interpretation principles in this order:

1. **Specific over general** (`lex specialis derogat legi generali`) — the more specific provision wins over the general one
   - Example: General company law says "directors are liable for X"; specific banking law says "bank directors are liable for Y"; for bank directors → banking law applies
2. **Later over earlier** (`lex posterior derogat priori`) — within the same hierarchy + same scope, newer wins
3. **Mandatory over discretionary** — if one provision says "shall" and another says "may," the "shall" is binding
4. **Cumulative interpretation** — sometimes both apply (must satisfy both; not either/or)

**Example:**
- General Privacy Law: "data may be retained for as long as necessary"
- Sectoral AML Law: "AML records SHALL be retained for 7 years"
- For AML records: AML Law applies (specific over general; mandatory over discretionary). Retain 7 years.

**Document the resolution:**

```markdown
> **Conflict resolution note (research log YYYY-MM-DD):**
>
> General Privacy Law Art. X.Y (retention "as long as necessary") and
> AML Law Art. 14.1 (retention "at least 7 years") appear to conflict.
>
> Resolution: AML Law applies for AML-related records (specific over
> general; mandatory "SHALL" vs discretionary "may"). For non-AML
> personal data, Privacy Law applies.
>
> Engineering: retention_until on records carries both:
> - aml_retention_until = MAX(applicable AML rules)
> - privacy_minimum_retention = MIN required for privacy compliance
> - actual_retention_until = MAX of all applicable rules
```

### Type 4 — Multi-jurisdiction conflict

Two jurisdictions both apply (e.g., EU customer of a Mongolian entity; US customer of an EU service provider). They disagree.

**Resolution:** Apply **MAX rule** for retention; **stricter** for consent / disclosure / processing; both for reporting.

(See `08-multi-jurisdiction-strategy.md` for full treatment.)

**Quick rules:**

| Conflict | Resolution principle |
|----------|---------------------|
| Retention windows differ | MAX (longest wins; satisfies all) |
| Consent requirements differ | Stricter wins (e.g., EU GDPR opt-in vs US opt-out → opt-in wins for EU residents) |
| Disclosure requirements differ | Cumulative (provide all required disclosures) |
| Reporting obligations differ | Cumulative (file separately to each authority) |
| Transfer mechanism | The mechanism required by the originating jurisdiction governs (SCC for EU→non-EU exports) |
| Encryption requirements | Stricter wins |
| Right-to-erasure scope | Stricter wins (broadest definition) |

### Type 5 — International standard vs national transposition

Common when researching FATF / IOSCO / ICH / NIST / IFRS.

**Resolution:** Local-jurisdiction transposition is binding; international standard is interpretive aid.

**Important nuance:** if your jurisdiction's transposition is INCOMPLETE (transposes most but not all), you may STILL be expected to follow the international standard for the un-transposed parts because:
- Auditors expect international-standard alignment
- Future amendments may transpose
- Best-practice posture protects against enforcement risk

**Example:**
- FATF Recommendation 24 (beneficial owner) requires 25% threshold
- Country X transposed beneficial-owner identification but didn't specify a percentage
- Engineering: implement 25% threshold per FATF; document the transposition gap as Gap-MOD-R4-NN

### Type 6 — Authority interpretation vs court decision

Regulator's interpretation (in guidance, Q&A, enforcement action) may be later overturned by court.

**Resolution:** Court decision wins; update spec immediately on adverse court ruling.

**Edge case:** if a court ruling is being appealed, follow current regulator interpretation but flag the pending appeal as research risk.

### Type 7 — Two regulators in the same jurisdiction conflict

E.g., banking regulator (Mongolbank) vs securities regulator (FRC) on overlapping topic (e.g., investment-fund custodian rules).

**Resolution:** Determine which regulator has primary jurisdiction over the entity type:
- Banks → banking regulator
- Securities firms → securities regulator
- Insurance companies → insurance regulator
- For overlapping entities (e.g., bank's securities subsidiary): the higher-prudential regulator typically wins; verify via the law that designates competent authority

If unclear, formal request for clarification from BOTH regulators (in writing).

### Type 8 — Authority guidance contradicts your engineering interpretation

You read the law, designed code accordingly; later regulator publishes guidance interpreting the law differently than your reading.

**Resolution:** Regulator's interpretation prevails (within their authority). Update spec + engineering to align.

**Process:**
1. Note your prior interpretation in research log
2. Document the regulator interpretation + cite
3. Update INV/HW
4. Spawn task chip for engineering change
5. If material customer impact: legal review on need to remediate past transactions

## The decision protocol

When you discover any conflict, follow this protocol:

```
1. DOCUMENT the conflict in research log
   - What sources disagree?
   - On what specific point?
   - What's the practical impact?

2. CLASSIFY the conflict type (1-8 above)

3. APPLY the resolution principle

4. IF unresolved → ESCALATE:
   - Legal counsel for material compliance items
   - Compliance officer for operational impact
   - Industry peers / regulator informal queries
   - Formal regulator request as last resort

5. RECORD the resolution decision:
   - Which source ruled
   - Why (cite resolution principle)
   - Who signed off (date + name)
   - Confidence level (high / medium / requires re-check)

6. UPDATE spec with the resolved interpretation
   - INV/HW with chosen source
   - Note the conflict + resolution in research log
   - Schedule re-check (esp. if low confidence)
```

## When NOT to resolve (file as ambiguity)

If after Phase 3+4 of R4 research you STILL can't resolve a conflict:

1. **Don't guess.** File as `Gap-MOD-R4-NN` 🟠 P1 (ambiguity outstanding)
2. **Set spec INV status to 🚧 DESIGN** (don't rely)
3. **Escalate to lawyer / compliance officer** for written opinion
4. **Pending resolution: implement the safer/stricter interpretation** as a default
5. **Document in research log:** "Q12 ambiguity → pending lawyer opinion; using stricter interpretation as default → re-visit upon receipt"

The cost of waiting for legal opinion (days to weeks) is much lower than the cost of getting it wrong.

## Common conflict patterns by domain

### Finance
- Statute threshold vs implementing-regulation aggregation rule (e.g., CTR per-transaction vs per-day)
- Old AML standard vs current FATF mutual evaluation expectations
- IFRS 9 ECL (accounting) vs regulator provisioning rules (regulatory reporting) — both apply; book MAX

### Healthcare
- HIPAA federal floor vs stricter state law (state wins where stricter)
- Pre-MDR clinical evidence vs MDR requirements during EU transition
- GDPR Art. 9 (health data) vs national health-records laws

### Privacy
- GDPR retention vs sectoral retention (sectoral usually wins on its scope)
- CCPA vs other state privacy laws (multi-state operators apply strictest)
- EU adequacy vs national supplementary measures (national may add)

### Tax
- Domestic tax law vs tax treaty (treaty usually wins for cross-border)
- BEPS Pillar 1 vs traditional permanent-establishment rules
- VAT place-of-supply rules vs digital-services tax (jurisdiction-specific)

### Government / cybersecurity
- NIST 800-53 Rev 5 controls vs older Rev 4 (Rev 5 in force post-2023)
- FedRAMP Moderate baseline vs CMMC Level X (different scopes; apply both if both relevant)
- CISA emergency directive vs scheduled compliance milestones (emergency wins)

## Worked example — multi-source conflict

**Scenario:** Researching transaction-record retention for a Mongolian payment service that also processes EU customers.

**Sources consulted:**
1. Mongolia AML Law Art. 14.2: "7 years from transaction date"
2. EU GDPR Art. 17: "right to erasure" — customer can request deletion
3. EU AMLD6 Art. 26.1: "5 years after end of business relationship"
4. Mongolia Tax Law (general accounting): "5 years from fiscal year end"
5. PCI-DSS Req. 3.1: "minimize cardholder data retention; retain only as long as business need + legal/regulatory mandate"

**Apparent conflicts:**
- Mongolia AML 7y vs EU AMLD 5y (different jurisdictions; both apply for EU customers of Mongolian entity)
- GDPR right-to-erasure vs AML retention (apparent customer-rights conflict)
- Tax Law 5y vs AML 7y (different scopes within one jurisdiction)
- PCI-DSS minimize vs AML retain (apparent conflict)

**Resolution:**

```markdown
> **Conflict resolution (research log 2026-05-18):**
>
> For EU-resident customers of the Mongolian payment service:
>
> 1. Mongolia AML 7y vs EU AMLD 5y: MAX rule → 7 years (Mongolia
>    satisfies both because EU minimum is 5y; 7y > 5y).
>
> 2. GDPR right-to-erasure vs AML retention: GDPR Art. 17(3)(b)
>    explicitly carves out retention required by EU/Member-State law
>    AND foreign-law equivalents that the controller is subject to.
>    AML retention prevails during the 7-year window. After 7 years:
>    deletion obligation kicks in (per EU GDPR Art. 5(1)(e) storage
>    limitation).
>
> 3. Tax Law 5y vs AML 7y: AML is the longer + more specific;
>    retain 7y (satisfies both).
>
> 4. PCI-DSS minimize vs AML retain: PCI-DSS allows retention "as
>    long as business need + legal/regulatory mandate." AML is the
>    legal mandate. Retain 7y; do NOT delete card numbers earlier
>    even though business operation may not need them.
>
> Resulting engineering rule:
> - retention_until = MAX(jurisdictional retention windows applicable
>                          to this record's customers)
> - For Mongolia entity with EU customers: 7y minimum, anchored to
>   transaction date for AML records OR relationship end for KYC
>   records
> - After retention_until: actively delete (privacy obligation)
>
> Status: ✅ Resolved 2026-05-18 by [compliance officer name].
> Re-check: 2027-05-18 (AMLD6 transposition may change EU minimum).
```

## Documenting conflicts in citation blocks

When a conflict was resolved during research, include a conflict-resolution note in the citation block:

```markdown
### INV-FIN-22 — Transaction-record retention 7 years
Status: ⚠️ MUST be ✅ IMPL
Source: SRC-AML-MN-2017 Art. 14.2

[INV body...]

**Conflict resolution note:** Mongolia AML (7y) and EU AMLD (5y) both
apply for EU-resident customers. MAX rule per `07-conflict-resolution.md`
§ "Type 4 multi-jurisdiction" → 7 years used (satisfies both). Resolution
recorded in research log 2026-05-18.
```

This lets future reviewers understand WHY the 7-year value was chosen + verify the reasoning is still valid.

## Anti-patterns

1. **Picking the more lenient interpretation without analysis** — risky; if regulator audits + finds the stricter interpretation applies, you're caught.
2. **Picking the strictest interpretation by default without rationale** — may waste compliance budget + slow operations unnecessarily. Conscious choice better.
3. **Asking the regulator informally** — answers are not citable; if material, request formal written opinion.
4. **Treating regulator FAQ as authoritative when it contradicts the underlying rule** — FAQ is interpretive aid; rule is binding.
5. **Skipping conflict documentation** — the next reviewer can't follow your reasoning; spec drifts.
6. **Resolving conflicts solo when material** — for criminal-liability provisions or material money risk, get a lawyer.

## Cross-references

- `02-source-evaluation.md` — source-trust hierarchy that drives Type 1 resolution
- `03-citation-conventions.md` — citation format including conflict-resolution notes
- `06-re-validation-strategy.md` — re-validation catches new conflicts that emerge over time
- `08-multi-jurisdiction-strategy.md` — Type 4 conflicts in depth

## Next

→ `08-multi-jurisdiction-strategy.md` — MAX rule + per-customer applicable laws
→ `09-amendment-tracking.md` — catching amendments before they cause conflicts
