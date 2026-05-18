---
doc: workflow/07-r4-regulatory-research/08-multi-jurisdiction-strategy
type: workflow-research-method
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain
---

# Multi-Jurisdiction Strategy — When Multiple Authorities Apply

> **Domain-agnostic.** Modern services often serve customers across multiple jurisdictions. Each jurisdiction may have its own rules on retention, consent, disclosure, reporting. This file defines the strategy for handling multi-jurisdiction compliance in a single codebase + spec.

## When does multi-jurisdiction apply?

Your service is multi-jurisdiction if ANY of these are true:

- Customers reside in multiple countries (cross-border consumer service)
- You have legal entities (subsidiaries / branches) in multiple jurisdictions
- Counterparties (banks, custodians, vendors) are in different jurisdictions than your customers
- Data is stored in cloud regions outside customer-residence jurisdiction
- Your service is "directed at" residents of multiple jurisdictions (per GDPR Art. 3 / similar extraterritorial rules)
- You process payments crossing borders
- You serve "passporting" clients (EU MiFID passport, UCITS marketing across EU)

A purely-domestic service avoids multi-jurisdiction complexity. Most modern fintechs / SaaS / healthcare platforms are NOT purely domestic.

## The four core rules

### Rule 1 — Identify ALL applicable jurisdictions per data subject / transaction

For every customer, every transaction, every record, determine the set of jurisdictions whose laws apply:

```
Applicable jurisdictions for record R = UNION OF:
  1. Customer's primary residence jurisdiction
  2. Entity-of-record's home jurisdiction (where the legal entity is licensed)
  3. Jurisdiction(s) where the transaction physically occurred
  4. Jurisdiction(s) where data is stored
  5. Jurisdiction(s) where data is accessed (for some privacy laws)
  6. Counterparty's jurisdiction (for some AML / sanctions purposes)
```

Engineering: data model should capture each jurisdiction dimension explicitly:

```sql
-- Customer
customer.legal_residence_jurisdiction CHAR(2)  -- ISO 3166-1 alpha-2
customer.nationality_jurisdiction[]            -- may differ from residence
customer.applicable_jurisdictions[]            -- computed from above + entity

-- Entity-of-record
entity.home_jurisdiction CHAR(2)
entity.licensed_in[] CHAR(2)                   -- where licensed to operate

-- Transaction
transaction.origin_jurisdiction CHAR(2)
transaction.destination_jurisdiction CHAR(2)
transaction.processed_at_jurisdiction CHAR(2)

-- Data residency
record.stored_in_region VARCHAR(20)            -- e.g., "eu-central-1"
record.replication_targets[]                   -- DR regions
```

### Rule 2 — Apply MAX rule for retention

For each retainable record (KYC document, transaction, audit log, communication), retention_until = MAX of (applicable jurisdiction's retention requirement applied to its anchor date).

**Example:** Customer is EU resident; entity is Mongolian; transaction crossed US.

| Jurisdiction | Retention | Anchor |
|--------------|-----------|--------|
| EU AMLD6 | 5 years | Business relationship end |
| Mongolia AML | 7 years | Customer relationship end |
| US BSA | 5 years | Document date |

For KYC document signed 2026-05-18, relationship ended 2027-12-31:

- EU: relationship_end + 5y = 2032-12-31
- Mongolia: relationship_end + 7y = 2034-12-31
- US: document_date + 5y = 2031-05-18

retention_until = MAX(2032-12-31, 2034-12-31, 2031-05-18) = **2034-12-31**

Engineering:

```python
def compute_retention_until(record, customer, entity, transaction):
    candidates = []
    for jurisdiction in customer.applicable_jurisdictions:
        rule = retention_rules[jurisdiction][record.type]
        anchor = resolve_anchor(record, rule.anchor_field)
        candidates.append(anchor + rule.retention_window)
    return max(candidates)
```

### Rule 3 — Apply STRICTER rule for consent / disclosure / processing

For data subject rights + consent + disclosure:

- **EU GDPR** requires opt-in consent for marketing → if customer is EU resident, opt-in applies (even if Mongolian entity)
- **CCPA** requires opt-out disclosure → if customer is California resident, CCPA disclosures apply
- **Right to erasure** scope differs (GDPR Art. 17 broad; some jurisdictions narrower) → broader scope wins

**Stricter rule applies to the data subject, not the entity.** A Mongolian entity serving an EU customer must honor EU rules for that customer.

Engineering:

```python
def get_consent_requirement(customer, processing_purpose):
    rules = []
    for jurisdiction in customer.applicable_jurisdictions:
        rules.append(consent_rules[jurisdiction][processing_purpose])
    # Stricter = opt-in > opt-out > implicit
    return strictest(rules)
```

### Rule 4 — Apply CUMULATIVE rule for reporting

When multiple regulators require independent reports of the same event:

- File separately to each
- Don't assume one filing satisfies another
- Track each filing's status independently
- Reporting deadlines may differ — track separately

**Example:** Cross-border cash transaction ≥ threshold:
- File CTR with Mongolia FIU (per Mongolia AML Art. 11)
- File CTR with EU national FIU if applicable (per EU AMLD)
- File SAR with US FinCEN if any US nexus

Engineering:

```python
def get_required_filings(transaction):
    filings = []
    for jurisdiction in transaction.applicable_jurisdictions:
        for rule in reporting_rules[jurisdiction]:
            if rule.triggers(transaction):
                filings.append(Filing(
                    type=rule.filing_type,
                    jurisdiction=jurisdiction,
                    deadline=transaction.timestamp + rule.deadline,
                    status='PENDING'
                ))
    return filings
```

## Data-residency strategy

Beyond compliance with retention + consent, data RESIDENCY (where data physically lives) introduces its own constraints:

### Data-localization laws

Some jurisdictions require certain data to stay within national borders:
- China: PIPL + CSL data localization for "critical information infrastructure"
- Russia: certain personal data must be processed first in Russia
- India: DPDPA 2023 cross-border transfer rules
- Saudi Arabia: PDPL data-localization for certain categories
- Vietnam, Indonesia, Turkey: various sectoral data-localization

If you serve customers in these jurisdictions, you may need:
- Regional data centers / cloud regions in-country
- Replication strategy that doesn't cross prohibited borders
- "Data sovereignty" controls (encryption keys in-country)

### Cross-border transfer mechanisms

For data flows that DO cross jurisdictional borders:

| Flow direction | Mechanism |
|----------------|-----------|
| **EU → adequate country** (UK, Switzerland, Japan, S. Korea, Argentina, etc.) | Adequacy decision (no extra mechanism needed) |
| **EU → US (DPF participant)** | EU-US Data Privacy Framework certification |
| **EU → other non-adequate** | EU SCCs + Transfer Impact Assessment (TIA) |
| **EU → other (corporate group)** | Binding Corporate Rules (BCR) — for intra-group |
| **UK → non-UK** | UK IDTA (International Data Transfer Agreement) + UK SCCs OR adequacy |
| **Singapore → non-SG** | PDPA Cross-Border Transfer rules; recipient binding obligations |
| **India → non-IN** | DPDPA 2023 — central-government allow-list (still emerging as of 2026) |
| **China → non-CN** | PIPL outbound transfer assessment (CAC approval for sensitive) |

Engineering implications:
- Inventory data flows (source → destination + content category + frequency)
- Match each flow to a transfer mechanism
- Document SCCs in place + last review date
- Annual TIA review for non-adequacy destinations

## Per-customer compliance computation

For a service with many customers spanning many jurisdictions, the compliance attributes are PER-CUSTOMER, not service-wide. Engineering implications:

```python
class CustomerComplianceProfile:
    """
    Computed at customer onboarding + recomputed on residence change.
    Cached on customer record; refreshed on rule changes.
    """
    customer_id: int
    applicable_jurisdictions: list[str]  # ISO 3166-1 alpha-2

    # Per-jurisdiction rules resolved
    retention_rules: dict[RecordType, RetentionRule]  # by record type
    consent_rules: dict[Purpose, ConsentRule]
    reporting_rules: list[ReportingRule]
    transfer_restrictions: list[TransferRestriction]

    # Computed defaults
    primary_jurisdiction: str  # for UX language / format
    timezone: str
    currency: str  # for display

    # Compliance posture flags
    is_eu_resident: bool
    is_us_resident: bool
    is_pep: bool
    is_high_risk_jurisdiction_associated: bool

    # Audit
    profile_computed_at: datetime
    profile_inputs_version: str  # hash of inputs that fed computation
```

Recompute when:
- Customer changes legal residence
- Customer becomes citizen of new jurisdiction
- Applicable jurisdiction's rules amend (annual R4 re-validation)
- Customer's product/service mix changes (e.g., subscribes to product available in new jurisdiction)

## Spec structure for multi-jurisdiction

In your ZeeSpec module's `where.md` § 5 (Tech Stack Binding), add a section on multi-jurisdiction:

```markdown
### 5.X Multi-jurisdiction handling

**Applicable jurisdictions:** [list customer-resident jurisdictions served]

**Per-jurisdiction config:** `[config file path]`
- Per-jurisdiction retention rules
- Per-jurisdiction consent requirements
- Per-jurisdiction reporting authority + format

**Data residency:**
- Primary storage: [region]
- Replication: [regions]
- Restrictions: [any data-localization rules honored]

**Cross-border transfer mechanisms:**
- EU → [region]: [SCC / DPF / adequacy]
- UK → [region]: [IDTA / SCC / adequacy]
- [other flows]

**Annual review:**
- SCCs reviewed: [date]
- TIAs reviewed: [date]
- Adequacy status verified: [date]
```

In `gravity.md`, add HW entries:

```markdown
### HW-MOD-XX — Customer compliance profile computed per applicable jurisdictions
Status: ⚠️ MUST be ✅ IMPL for multi-jurisdiction service

CustomerComplianceProfile recomputed at: onboarding, residence change,
annual rule re-validation. Cached on customer record. Drives all
retention/consent/reporting/transfer decisions for that customer.

Engineering enforcement:
- Customer entity has applicable_jurisdictions[] column
- Compliance profile is COMPUTED at write time; never user-editable
- Audit log captures profile change events

### HW-MOD-YY — Retention via MAX rule across applicable jurisdictions
Status: ⚠️ MUST be ✅ IMPL

retention_until column on every retainable record. Computed as
MAX(per-jurisdiction retention for applicable jurisdictions).

Engineering enforcement:
- Trigger on customer.applicable_jurisdictions change recomputes
  retention_until for all related records
- Privacy-deletion worker honors retention_until before deleting
```

## Multi-jurisdiction R4 research strategy

### Strategy A — Parallel research

For each jurisdiction, dispatch a parallel R4 agent. Outputs merged + MAX rule applied for retention; STRICTER for consent.

```javascript
// Pseudo-code: parallel R4 for 4 jurisdictions
Agent({ description: "R4 EU retention", prompt: "...EU GDPR + AMLD..." })
Agent({ description: "R4 US retention", prompt: "...US BSA + HIPAA..." })
Agent({ description: "R4 UK retention", prompt: "...UK MLR + GDPR..." })
Agent({ description: "R4 SG retention", prompt: "...SG PDPA + MAS..." })
```

Synthesize results into a per-jurisdiction comparison table.

### Strategy B — Sequential MAX walking

Less compute-efficient but easier to track. Research one jurisdiction at a time; build the MAX rule incrementally.

```
Round 1: Research EU → retention 5y from relationship end
Round 2: Research US → retention 5y from doc date
         MAX so far: 5y from MAX(relationship end, doc date)
Round 3: Research Mongolia → retention 7y from relationship end
         MAX so far: 7y from relationship end OR 5y from doc date,
                      whichever is later
Round 4: Research Singapore → retention 5y from doc date
         MAX final: 7y from relationship end OR 5y from doc date
```

### Strategy C — Reference-jurisdiction approach

Pick the strictest jurisdiction as a reference; apply it everywhere; selectively relax for less-strict jurisdictions only when business reason demands.

**Pros:** Simpler; safer.
**Cons:** May exceed budget (e.g., longer retention than needed in some jurisdictions).

## Multi-entity organizational structure

Beyond multi-jurisdiction CUSTOMERS, you may have multi-jurisdiction ENTITIES (parent + subsidiaries in different countries).

For each legal entity:
- Determine its home regulator
- Determine which customers it serves (may be subset of total customers)
- Apply that entity's home-jurisdiction compliance for those customers

Engineering: every transaction + record traces back to the legal entity that processed it. retention + reporting computed for that entity's jurisdiction PLUS customer's applicable jurisdictions.

## Worked example — fintech operating in 5 jurisdictions

**Scenario:** Mongolia-HQ payment service with subsidiaries in EU (Frankfurt), US (NYC), UK (London), Singapore. Serves customers in those 5 jurisdictions plus passporting EU.

### Per-customer compliance matrix

| Customer residence | Entity-of-record | Applicable jurisdictions for compliance |
|--------------------|------------------|------------------------------------------|
| Mongolia | Mongolia HQ | Mongolia (FRC, AML 7y) |
| Germany | EU subsidiary | EU (AMLD6 5y; GDPR) + Germany (national variation) |
| France | EU subsidiary (passporting from DE) | EU (AMLD6 5y; GDPR) + France (national) + Germany (entity home) |
| US | US subsidiary | US (BSA 5y; FinCEN reporting) |
| UK | UK subsidiary | UK (MLR 5y; UK GDPR) |
| Singapore | SG subsidiary | Singapore (PDPA + MAS 5y) |
| Australian (cross-border) | Mongolia HQ | Australia (privacy + AML AUSTRAC) + Mongolia (entity) |

### Retention rule per record type

| Record type | KYC docs | Transaction records | Audit log |
|-------------|----------|---------------------|-----------|
| Mongolia customer | 7y from rel end | 7y from tx date | 7y from event |
| EU customer | 5y from rel end (or 7y if cross-border to Mongolia entity → MAX = 7y) | 5y from tx OR 7y if MN-entity → 7y | 5y from event |
| US customer | 5y from doc date | 5y from tx date | 5y from event |
| UK customer | 5y from rel end | 5y from tx date | 5y from event |
| SG customer | 5y from doc date | 5y from tx date | 5y from event |

### Cross-border transfer mechanisms required

| Flow | Mechanism |
|------|-----------|
| EU customer data → Mongolia HQ for processing | EU SCCs + TIA (Mongolia not adequacy-listed) |
| US customer data → Mongolia HQ | No US-side restriction; Mongolia receives |
| UK customer data → Mongolia HQ | UK IDTA + UK SCCs |
| EU customer data backed up to US region | EU SCCs OR EU-US DPF if recipient is certified |
| Any customer data → Singapore backup region | Per-source jurisdiction's transfer rule |

### Reporting per jurisdiction

| Event | Mongolia | EU | US | UK | SG |
|-------|----------|-----|-----|-----|-----|
| Cash tx ≥ 20M MNT (Mongolia customer) | CTR to Mongolia FIU within 5d | n/a | n/a | n/a | n/a |
| Cash tx ≥ €10K (EU customer) | n/a | CTR to national FIU per AMLD | n/a | n/a | n/a |
| Cash tx ≥ $10K (US customer) | n/a | n/a | CTR to FinCEN within 15d | n/a | n/a |
| Suspicious tx (any) | STR to Mongolia FIU within 24h | STR to national FIU promptly | SAR to FinCEN within 30d (immediate for terror) | SAR to NCA asap | STR to STRO within 15d |

## Common multi-jurisdiction pitfalls

1. **Treating service-wide retention as one rule** — different customers need different retention; MAX rule per customer
2. **Forgetting passporting customers** — an EU subsidiary serves customers across all 27 EU member states; national variations apply
3. **Ignoring data-residency for backup region** — main region might be EU, but backup in US still triggers cross-border rules
4. **Cross-border reporting to wrong FIU** — file with each applicable jurisdiction's FIU, not just home
5. **Stale adequacy decisions** — EU adequacy list changes; check annually
6. **Not honoring customer residence change** — customer moves country; applicable jurisdictions change; recompute profile
7. **Treating GDPR opt-in as global default** — wasteful in jurisdictions where opt-out is sufficient; per-customer profile better
8. **Single-jurisdiction sanctions screening** — multi-jurisdiction operations must screen against ALL applicable sanctions lists (UN, OFAC if US-touching, EU, UK, national)

## R4 outputs for multi-jurisdiction

When you do R4 research for a multi-jurisdiction service, the output structure is different:

```markdown
# R4 Research Findings — <topic>, MULTI-JURISDICTION

**Date:** YYYY-MM-DD
**Scope:** Retention rules for <record type> across [Mongolia, EU, US, UK, SG]

## Per-jurisdiction findings

### Mongolia
[primary read + citation block]

### EU
[primary read + citation block]

### US
[primary read + citation block]

[...]

## Cross-jurisdiction comparison

[summary table]

## Resolution

### Per-customer rule
[engineering specification of how customer's profile determines applicable rules]

### MAX rule application
[for retention: MAX windows]

### Stricter rule application
[for consent/disclosure/processing: which jurisdiction wins for which subject]

### Cumulative rule application
[for reporting: which authorities receive which reports]

## Open follow-ups
- Per-jurisdiction follow-ups
- Cross-jurisdiction follow-ups (e.g., transfer mechanism review)

## Re-check schedule per jurisdiction
[per-jurisdiction dates]
```

## Cross-references

- `01-regulatory-research-workflow.md` — single-jurisdiction R4 (multi runs N times in parallel)
- `07-conflict-resolution.md` Type 4 — multi-jurisdiction conflict resolution rules
- `09-amendment-tracking.md` — monitoring N jurisdictions for amendments
- `overlays/finance-accounting/research-examples/03-retention-research-cross-jurisdiction.md` — worked example

## Next

→ `09-amendment-tracking.md` — proactive amendment monitoring
→ `10-translation-pitfalls.md` — when researching non-English sources across jurisdictions
