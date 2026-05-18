---
doc: workflow/10-adoption-guide/05-cross-domain-adaptation
type: workflow-adoption-guide
phase: adoption
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: non-finance domains (healthcare / government / privacy / e-commerce / etc.)
---

# Cross-Domain Adaptation — Beyond Finance

> **For non-finance domains.** ZeeSpec was pioneered in a Mongolian mutual fund system. The methodology is domain-agnostic but the only worked overlay is finance. This file guides adaptation to healthcare, government, privacy, energy, telecoms, education — any regulated or compliance-relevant domain.

## What carries over universally

These are domain-agnostic and don't need adaptation:

| Component | Universal? |
|-----------|------------|
| 10-file Zachman framework | ✅ YES |
| Status tagging (✅/🟡/🚧) | ✅ YES |
| Severity matrix (P0/P1/P2/P3) | ✅ YES (per-domain calibration) |
| 5-phase Tier 1 workflow | ✅ YES |
| R4 regulatory research | ✅ YES (different authorities) |
| R5 drift management | ✅ YES |
| R6 ADR lifecycle | ✅ YES |
| Spawn task chip pattern | ✅ YES |
| Cross-link bidirectionality | ✅ YES |
| ID conventions (INV/HW/ADR) | ✅ YES |

## What needs adaptation

These are finance-leaning and need re-thinking per domain:

| Component | Adaptation needed |
|-----------|-------------------|
| `principles/accounting-principles.md` | Replace with domain-specific principles (HIPAA / NIST / GDPR / etc.) |
| `principles/regulatory-compliance.md` | Replace 7 pillars with domain-relevant pillars |
| `principles/financial-invariants-catalog.md` | Re-author per-domain INV catalog |
| `principles/financial-anti-patterns.md` | Re-author per-domain anti-patterns |
| `principles/severity-matrix-finance.md` | Re-calibrate per domain (HIPAA breach = P0; FedRAMP control gap = P0; etc.) |
| Module templates (GL, wallet, KYC, lending) | Replace with domain modules (patient-records, identity-vault, etc.) |
| R2 reviewer prompt | Re-write per domain (HIPAA inspector questions; FedRAMP control questions) |
| Glossary | Domain-specific terms |
| Research-examples | Worked examples in your domain (per Reviewer C P1 — currently a gap) |

## Adaptation roadmap

### Step 1 — Choose domain + jurisdiction

For each:
- Identify primary regulator(s) — per `workflow/07-r4-regulatory-research/05-source-cheatsheet.md`
- Identify primary statute(s)
- Identify international standards (FATF / NIST / WHO / ICH / OECD)
- Identify per-jurisdiction variation (e.g., HIPAA US-only vs GDPR Art. 9 EU vs national health laws)

### Step 2 — Build overlay structure

Mirror finance overlay structure:

```bash
mkdir -p overlays/<domain>/{principles,modules,prompts,glossary,research-examples}

# E.g., healthcare:
mkdir -p overlays/healthcare/{principles,modules,prompts,glossary,research-examples}
```

### Step 3 — Author principles (3-5 files)

Per finance overlay pattern:

| Finance file | Healthcare equivalent |
|--------------|------------------------|
| `accounting-principles.md` | `phi-handling-principles.md` (PHI access, minimum-necessary, audit logging) |
| `regulatory-compliance.md` | `healthcare-compliance.md` (HIPAA + GDPR Art. 9 + sectoral) |
| `financial-invariants-catalog.md` | `healthcare-invariants-catalog.md` (PHI access, consent, retention, breach notification) |
| `financial-anti-patterns.md` | `healthcare-anti-patterns.md` (PHI leak via logs; missing audit on access; etc.) |
| `severity-matrix-finance.md` | `severity-matrix-healthcare.md` (patient safety = P0; PHI exposure = P0; etc.) |

Step 1 prep takes ~1 week per principles file. Total ~5 weeks for principles layer.

### Step 4 — Run R4 research (parallel)

For each principles file you're authoring, dispatch R4 agent per `workflow/07-r4-regulatory-research/04-R4-agent-prompt.md`. Parameterize:
- Domain: healthcare / government / privacy / etc.
- Jurisdiction: your primary
- Questions: per-domain template (in 04-R4-agent-prompt.md § "domain example questions")

Output: citation blocks ready to paste into principles + invariant catalog.

### Step 5 — Pick first module + author

Same as finance lending example. For healthcare:
- `patient-records/` module (full 10-file ZeeSpec)
- `consent-management/` module
- `audit-log-service/` module

Author one. Promote to Tier 1. Use as reference for the rest.

### Step 6 — Specialized R2 reviewer prompt

Write `prompts/R2-<domain>-reviewer.md` mirroring `prompts/R2-financial-reviewer.md`. Replace finance-specific inspector questions with domain questions:

Healthcare R2 inspector questions:
1. "Show me the audit log for patient #X's record access in last 30 days"
2. "Show me the consent capture for patient #Y's data sharing with provider Z"
3. "Show breach detection: how would you notice if PHI was exfiltrated?"
4. "Show data minimization: are we collecting MORE PHI than needed for purpose A?"
5. "Show retention: when does PHI for closed patient relationships get archived/deleted?"
6. "Show encryption-at-rest: which fields are encrypted? Key rotation cadence?"
7. "Show data residency: where does PHI live? Cross-border replication mechanism?"
8. "Show user rights: how does a patient exercise GDPR right-to-erasure / HIPAA amendment?"
9. "Show breach notification: timeline + recipients per HIPAA / GDPR Art. 33-34?"
10. "Show 3rd-party access: which Business Associates have access? BAA in place?"

### Step 7 — Domain glossary

Author `glossary/<domain>-glossary.md`. Examples:
- Healthcare: PHI, ePHI, HIPAA, BAA, HITECH, MDR, IVDR, IHE, FHIR, HL7, ICD-10, CPT, NPI
- Government: FedRAMP, FISMA, NIST 800-53, CMMC, ATO, CUI, POAM, SCAP, STIG
- Privacy: DPA, DPO, DPIA, GDPR, CCPA, PDPA, DPDPA, LIA, SCC, DTA, BCR
- Energy: NERC CIP, IEC 61850, REC, demand response, capacity market

### Step 8 — Worked research example

Critical per Reviewer C P1: provide at least ONE worked R4 research example in the overlay's `research-examples/` folder. Demonstrates the methodology end-to-end for the domain.

Example for healthcare: `01-hipaa-phi-research.md` showing R4 6-phase workflow producing INV-PAT-* for a patient-records module.

## Domain-specific guidance

### Healthcare (HIPAA + GDPR Art. 9)

**Primary differences from finance:**
- PHI = single most-protected data category; severity matrix shifts (PHI exposure = P0 regardless of count)
- Consent is granular + revocable (different from KYC which is one-time)
- Audit requirement is per-access (every read logged), not just per-mutation
- Breach notification: HIPAA = 60 days; GDPR = 72 hours — STRICTER WINS
- 3rd-party access: BAA / DPA contracts required + access tracked

**Overlay folder name:** `overlays/healthcare/`

**Suggested modules:**
- patient-records
- consent-management
- audit-log-service
- breach-detection-notification
- third-party-access (BAA / DPA management)

**Authorities to research (R4):**
- US: HHS OCR (HIPAA enforcement)
- EU: National DPAs + EDPB
- UK: ICO
- Per WHO + ICH for international standards

### Government / FedRAMP

**Primary differences:**
- Control baselines are pre-defined (NIST SP 800-53 Low/Moderate/High)
- Audit logging requirements are explicit per AU controls
- POAM (Plan of Action & Milestones) tracking is formal
- ATO (Authority to Operate) lifecycle has explicit gates

**Overlay folder name:** `overlays/government-fedramp/`

**Suggested modules:**
- continuous-monitoring (CM family)
- audit-log-service (AU family)
- access-control (AC family)
- incident-response (IR family)
- configuration-management (CM family)

**Authorities to research (R4):**
- FedRAMP PMO
- NIST CSRC (controls catalog)
- CISA (incident reporting requirements)

**Special note:** FedRAMP has formal documents (System Security Plan, Security Assessment Report). ZeeSpec specs supplement, don't replace, these. Cross-link them.

### Privacy (GDPR / CCPA / PDPA / etc.)

**Primary differences:**
- Many jurisdictions; MAX rule per `workflow/07-r4-regulatory-research/08-multi-jurisdiction-strategy.md` is critical
- Data subject rights workflow (DSR) has specific deadlines (GDPR 30 days; varies)
- Cross-border transfer mechanism is a HW constraint
- DPO appointment threshold triggers process changes
- DPIA (Data Protection Impact Assessment) is a recurring artifact

**Overlay folder name:** `overlays/privacy/`

**Suggested modules:**
- dsr-handler (Data Subject Rights workflow)
- consent-management
- cross-border-transfer
- dpia-workflow
- breach-notification

**Authorities to research (R4):**
- EU: EDPB + national DPAs
- US: state DPAs (CA CPPA; CO; CT; etc.)
- Singapore: PDPC
- India: DPB
- Brazil: ANPD

### E-commerce (PCI-DSS + state privacy)

**Primary differences:**
- Cardholder data is single most-protected category
- PCI-DSS is industry standard (not law) but contractual via card networks
- Tokenization patterns standard for credit card storage
- 3DS / SCA (Strong Customer Authentication) requirements

**Overlay folder name:** `overlays/ecommerce-pci/`

**Suggested modules:**
- payment-processing
- card-data-tokenization
- 3ds-authentication
- order-management
- refund-workflow

### Energy / utilities

**Primary differences:**
- NERC CIP for North America critical infrastructure
- Real-time operational data + safety constraints
- Demand-response programs + dynamic pricing
- Grid interconnection standards

**Overlay folder name:** `overlays/energy-nerc/`

**Suggested modules:**
- scada-integration
- demand-response
- billing-tariff
- outage-management
- grid-event-logging

### Education (FERPA + COPPA)

**Primary differences:**
- Student records protected; parent-consent for minors
- FERPA controls disclosure of educational records
- COPPA = under-13 specific (US)
- State-specific student data privacy laws

**Overlay folder name:** `overlays/education-ferpa/`

## Cross-domain pattern library

Patterns common across multiple domains:

### Pattern 1: Audit-log discipline

All regulated domains require per-access audit logs (not just per-mutation). Module pattern:

- Every read of regulated data → audit_log entry with (actor, timestamp, purpose, data_categories_accessed)
- Audit log append-only (REVOKE UPDATE/DELETE)
- Retention per domain rule
- Per-actor audit dashboard for compliance officer

### Pattern 2: Consent capture + revocation

GDPR / HIPAA / PDPA / education all require consent. Module pattern:

- Granular consent (per-purpose, per-recipient)
- Versioned consent (record what user agreed to + when)
- Revocation propagates to all downstream consumers
- Audit log on every consent change

### Pattern 3: Data Subject Rights (DSR) workflow

GDPR right-to-erasure / access / portability has equivalents in CCPA / PDPA / DPDPA / LGPD. Module pattern:

- DSR request intake
- Identity verification of requester
- Per-jurisdiction deadline tracking (MAX rule for multi-jurisdiction)
- Coordinated across all data stores (sometimes 50+ systems)
- Confirmation to requester

### Pattern 4: Breach notification

All privacy + healthcare laws have breach notification. Module pattern:

- Breach detection (automated + manual)
- Per-jurisdiction notification deadlines (STRICTER wins for multi-jurisdiction)
- Notification to: data subjects, regulators, sometimes media
- Forensic audit log

### Pattern 5: Cross-border data transfer

Most jurisdictions restrict cross-border transfer. Module pattern:

- Transfer mechanism registry (SCC / BCR / adequacy / DPF / IDTA)
- Per-destination jurisdiction tracking
- Transfer Impact Assessment (TIA) artifact
- Annual review

## Per-domain time estimate (build overlay from scratch)

| Domain | First-overlay effort | Per-module after |
|--------|----------------------|------------------|
| Healthcare | ~6 weeks (5 principles + 1 module + R2 prompt + glossary + 1 example) | ~2 weeks per module |
| Government (FedRAMP) | ~8 weeks (control catalog very detailed) | ~2 weeks per module |
| Privacy | ~5 weeks (multi-jurisdiction adds research time) | ~2 weeks per module |
| E-commerce | ~4 weeks | ~1-2 weeks per module |
| Energy | ~8 weeks (NERC CIP complexity) | ~2-3 weeks per module |
| Education | ~3 weeks (smaller scope typically) | ~1-2 weeks per module |

Compare to finance overlay (already exists; can reference as model): saved ~6 weeks of overlay-build effort.

## Cross-domain contribution back

If your team builds a non-finance overlay, consider:

- Open-source the overlay (apache 2.0 like core ZeeSpec)
- Contribute back as `overlays/<domain>/` to the methodology repo
- Add worked research-example so future teams have precedent
- Document lessons learned in pilot-retrospective.md

Building the second overlay validates ZeeSpec's domain-agnostic claim. The first non-finance overlay contributed back would significantly strengthen the methodology.

## Anti-patterns when adapting

### Mistake 1: Treating finance overlay as required

**Symptom:** Healthcare team installs finance overlay, tries to remove finance content.

**Fix:** Don't install finance overlay for non-finance projects. Build healthcare overlay from scratch (or fork finance as structural template + replace all content).

### Mistake 2: Copy-pasting INV without re-research

**Symptom:** Healthcare team copies INV-FIN-01..30 + does find-replace "money" → "PHI".

**Fix:** Each domain has different invariants. PHI access ≠ money movement; design from scratch via R4 research.

### Mistake 3: Skipping principles layer

**Symptom:** "Let's just author modules; we don't need a principles layer."

**Fix:** Principles layer is the foundation. Without it, every module reinvents the wheel.

### Mistake 4: One overlay covering multiple domains

**Symptom:** `overlays/finance-and-healthcare/`

**Fix:** Each domain its own overlay. Different regulators; different invariants; different severity calibration.

## Cross-references

- `overlays/finance-accounting/README.md` — structural model
- `workflow/07-r4-regulatory-research/05-source-cheatsheet.md` — multi-domain authority URLs
- `workflow/07-r4-regulatory-research/00-START-HERE.md` — research methodology
- `PORTING-GUIDE.md` — stack adaptation (orthogonal to domain adaptation)

## Next

→ `06-common-pitfalls.md` — what kills adoption
→ `07-zeespec-lite-tier-0-fasttrack.md` — quick-start option
