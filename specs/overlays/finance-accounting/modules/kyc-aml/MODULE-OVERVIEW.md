---
module: kyc-aml
type: module-overview
overlay: finance-accounting
version: 0.1.0
status: draft (condensed reference)
last_updated: 2026-05-18
---

# KYC & AML — Module Overview

> Condensed reference for the customer onboarding + ongoing AML/CFT module. Expand into 10 ZeeSpec files when authoring in your project.

## Module purpose

The **KYC/AML** module handles:
- Customer identification + verification (KYC tier progression)
- Ongoing AML monitoring (typology rules, sanctions, PEP)
- Regulatory filings (CTR, STR/SAR)
- Beneficial owner identification (for legal-entity customers)
- Data retention per AML law

Module prefix: `KYC` (or split: `KYC` + `AML` if your project separates them)

## CLAUDE.md — Entry point

Production code: `<your-source>/Kyc/*` + `<your-source>/Aml/*`

ADRs:
- **ADR-KYC-001** — Tiered KYC: TIER_0 → TIER_BASIC → TIER_FULL → TIER_EDD; each tier unlocks transaction ceilings
- **ADR-KYC-002** — Identity verification provider: [e.g., national digital ID — DAN in Mongolia, eIDAS in EU, Aadhaar in India]
- **ADR-KYC-003** — Sanctions data: daily refresh from multiple sources (UN, OFAC, EU, national)
- **ADR-KYC-004** — STR filed within 24h; CTR within 5 business days (per Mongolia AML)
- **ADR-KYC-005** — KYC document storage: encrypted at rest; retention 7y after customer relationship ends
- **ADR-KYC-006** — Beneficial owner: ≥25% threshold for ultimate beneficial owner (UBO) identification

Critical invariants:
- **INV-KYC-01** — Customer cannot transact above tier ceiling
- **INV-KYC-04** — CTR auto-flagged for cash transactions ≥ 20M MNT (inherits INV-FRC-05)
- **INV-KYC-06** — Sanctions screening on every customer + every counterparty (inherits INV-FRC-06)

## why.md

Goals:
- G-KYC-01 — Block illegal/sanctioned funds entering the platform
- G-KYC-02 — Detect + report suspicious patterns (AML typology)
- G-KYC-03 — Maintain regulator-grade customer due diligence files
- G-KYC-04 — Enable lawful customer transactions with appropriate friction by risk level

Business rules:
- BR-KYC-01 — TIER_BASIC requires ID + selfie verification
- BR-KYC-02 — TIER_FULL adds proof of address + source of funds
- BR-KYC-03 — TIER_EDD for PEPs, high-volume customers, foreign nationals from high-risk jurisdictions
- BR-KYC-04 — Sanctions hit = freeze account + STR within 24h
- BR-KYC-05 — Annual KYC refresh for active customers (re-verification of documents)

Compliance drivers:
- Mongolia AML/CFT law (2013, amended 2017+)
- FRC implementing regulations
- FATF Recommendations (international)

Risks:
- R-KYC-01 — Sanctions list cached too long → missed designations
- R-KYC-02 — Tier upgrade bypassed via business-logic shortcut
- R-KYC-03 — STR not filed within 24h → regulator action
- R-KYC-04 — UBO chain not traversed deeply → hidden beneficiary

## what.md

### Customer (KYC subset)
| Field | Type |
|-------|------|
| id, kyc_tier ENUM(TIER_0, TIER_BASIC, TIER_FULL, TIER_EDD, TIER_REFUSED), tier_updated_at, tier_updated_by FK, risk_score, is_pep BOOL, is_pep_associated BOOL, country_of_residence, customer_type ENUM(INDIVIDUAL, LEGAL_ENTITY) |

### KYCDocument
| Field | Type |
|-------|------|
| id, customer_id (FK), doc_type ENUM(ID_FRONT, ID_BACK, SELFIE, PROOF_OF_ADDRESS, SOURCE_OF_FUNDS_DOC, INCORPORATION, UBO_DECLARATION), url_encrypted, sha256_hash, uploaded_at, verified_at, verified_by FK, status ENUM(PENDING, VERIFIED, REJECTED, EXPIRED), expires_at, retention_until |

### VerificationCheck
| Field | Type |
|-------|------|
| id, customer_id, check_type ENUM(GOV_ID_VERIFY, LIVENESS, ADDRESS, AML_SCREENING, SANCTIONS, PEP), provider, request_payload, response_payload (encrypted), result ENUM(PASS, FAIL, MANUAL_REVIEW), checked_at, expires_at |

### BeneficialOwner (for legal-entity customers)
| Field | Type |
|-------|------|
| id, customer_id (FK), individual_id (FK to natural-person customer), ownership_pct NUMERIC(5,2), is_ultimate BOOL, chain_path JSONB, identified_at |

### SanctionsScreeningHit
| Field | Type |
|-------|------|
| id, customer_id (or counterparty_name), list_source ENUM(UN, OFAC, EU, NATIONAL), hit_name, hit_details JSONB, match_score, status ENUM(PENDING_REVIEW, FALSE_POSITIVE, TRUE_HIT_FROZEN), reviewed_by, reviewed_at, list_version, screened_at |

### CTRFiling
| Field | Type |
|-------|------|
| id, customer_id, wallet_tx_id, amount, currency, transaction_date, trigger_reason TEXT, status ENUM(PENDING_REVIEW, FILED, ACK, REJECTED), filed_at, filed_by FK, fiu_reference |

### STRFiling
| Field | Type |
|-------|------|
| id, customer_id, related_tx_ids JSONB, typology ENUM(SMURFING, ROUND_TRIP, HIGH_RISK_GEO, VELOCITY_ANOMALY, PEP_LARGE, MANUAL_FLAG, OTHER), suspicion_description TEXT, status ENUM(DRAFT, PENDING_REVIEW, FILED, ACK, WITHDRAWN), filed_within_24h BOOL, filed_at, fiu_reference, reviewed_by, reviewed_at |

### AMLTypologyRule (configurable)
| Field | Type |
|-------|------|
| id, name, description, rule_logic JSONB OR formula, severity, enabled BOOL, created_by, last_modified_at |

### Key INVs (~20):
- INV-KYC-01 cannot transact above tier ceiling (inherits INV-FIN-18)
- INV-KYC-02 tier upgrade requires verified docs of required types
- INV-KYC-03 tier downgrade allowed only by compliance officer (audit-logged)
- INV-KYC-04 cash tx ≥ 20M MNT auto-CTR (inherits INV-FRC-05)
- INV-KYC-05 STR filed within 24h of suspicion (per AML law Art. 13)
- INV-KYC-06 sanctions screening on customer onboarding + every tx with counterparty (inherits INV-FRC-06)
- INV-KYC-07 beneficial owner ≥25% identified for legal-entity customers (inherits INV-FRC-07)
- INV-KYC-08 annual KYC refresh for active customers
- INV-KYC-09 KYC doc retention = 7y from customer relationship end (inherits HW-FIN-22)
- INV-KYC-10 sanctions list refreshed daily; alarm on stale > 48h
- INV-KYC-11 PEP transaction above threshold → automatic STR review queue
- INV-KYC-12 high-risk-jurisdiction counterparty → mandatory EDD + STR review
- INV-KYC-13 KYC doc hash + signature stored for tamper-evidence
- INV-KYC-14 verification provider response stored (audit + dispute)
- INV-KYC-15 customer freeze cascades to wallet freeze (cross-module)
- INV-KYC-16 audit log on every tier change, freeze/unfreeze, STR/CTR filing
- INV-KYC-17 operator identity captured (no sentinels) (inherits INV-GL-07)
- INV-KYC-18 NO bypass paths — even VIP onboarding must go through full checks
- INV-KYC-19 UBO chain traversed until natural persons reached (or documented why halted)
- INV-KYC-20 STR drafted but not filed > 24h → automatic compliance officer escalation

## how.md

### ALG-KYC-ONBOARD-01 — Customer onboarding (TIER_0 → TIER_BASIC)
```
onboardCustomer(input):
  customer := customerRepo.insert(... kyc_tier = TIER_0)
  
  # Identity verification (e.g., via national ID provider)
  idVerifyResult := identityProvider.verify(input.id_doc, input.selfie)
  verificationCheck.insert(check_type=GOV_ID_VERIFY, result=idVerifyResult, ...)
  
  if idVerifyResult.PASS:
    # Sanctions screening
    sanctionsResult := sanctionsService.screen(input.full_name, input.dob, input.country)
    verificationCheck.insert(check_type=SANCTIONS, result=sanctionsResult, ...)
    
    if sanctionsResult.HIT:
      sanctionsScreeningHit.insert(...)
      customer.kyc_tier = TIER_REFUSED
      str.draft(customer_id, typology=SANCTIONS_HIT, suspicion=sanctionsResult.details)
      THROW SanctionsHit
    
    # PEP check
    pepResult := pepService.screen(input.full_name)
    customer.is_pep = pepResult.is_pep
    customer.is_pep_associated = pepResult.is_associated
    if customer.is_pep:
      customer.risk_score = HIGH
      # PEP → require EDD before TIER_FULL
    
    customer.kyc_tier = TIER_BASIC
    customer.tier_updated_at = NOW()
    customer.tier_updated_by = actor.id
    customerRepo.update(customer)
    
    auditLog.append(action=TIER_UPGRADE, before={tier:TIER_0}, after={tier:TIER_BASIC}, ...)
    outbox.publish(KYCTierChangedEvent(customer.id, TIER_BASIC))
  
  return customer
```

### ALG-KYC-UPGRADE-FULL-01 — TIER_BASIC → TIER_FULL
```
upgradeFull(customer_id, docs):
  customer := customerRepo.find(customer_id)
  ASSERT customer.kyc_tier == TIER_BASIC
  
  # Verify required docs uploaded
  ASSERT docs.contains(PROOF_OF_ADDRESS, SOURCE_OF_FUNDS_DOC)
  FOR doc IN docs:
    ASSERT doc.status == VERIFIED                            # human-reviewer flow
  
  # Re-screen against latest sanctions/PEP (daily refresh)
  sanctionsResult := sanctionsService.screen(customer.full_name, ...)
  if sanctionsResult.HIT: handle as above
  
  if customer.is_pep AND NOT customer.has_edd_completed:
    customer.kyc_tier = TIER_EDD_PENDING
    # Hold for EDD workflow
  else:
    customer.kyc_tier = TIER_FULL
  
  customer.tier_updated_at = NOW()
  customer.tier_updated_by = actor.id
  customerRepo.update(customer)
  
  auditLog.append(...)
  outbox.publish(KYCTierChangedEvent(customer.id, TIER_FULL))
```

### ALG-KYC-AML-MONITOR-01 — Real-time AML monitoring (typology check)
```
monitorTransaction(tx):
  customer := tx.customer
  
  # Typology rules
  rules := amlTypologyRule.findEnabled()
  hits := []
  
  FOR rule IN rules:
    if rule.evaluate(tx, customer):
      hits.append(rule)
  
  # Specific built-in checks
  
  # Smurfing: multiple sub-threshold same day
  daily_cash := walletTransaction.sumCashForCustomerToday(customer.id)
  daily_count := walletTransaction.countCashForCustomerToday(customer.id)
  if daily_cash > 0.8 * CTR_THRESHOLD AND daily_count >= 3:
    hits.append(SMURFING)
  
  # Round-trip: deposit + immediate withdrawal of similar amount
  recent_deposit := walletTransaction.findRecentDeposit(customer.id, hours=24)
  if recent_deposit AND abs(tx.amount - recent_deposit.amount) / tx.amount < 0.05:
    hits.append(ROUND_TRIP)
  
  # High-risk jurisdiction
  if tx.counterparty.country IN HIGH_RISK_JURISDICTIONS:
    hits.append(HIGH_RISK_GEO)
  
  # PEP large
  if customer.is_pep AND tx.amount > PEP_THRESHOLD:
    hits.append(PEP_LARGE)
  
  # Velocity anomaly (volume vs baseline)
  baseline_30d := walletTransaction.avgVolumeForCustomer(customer.id, days=30)
  if tx.amount > 3 * baseline_30d:
    hits.append(VELOCITY_ANOMALY)
  
  if hits.length > 0:
    str := strFiling.draft(
      customer_id = customer.id,
      related_tx_ids = [tx.id, ...recent_deposit?.id],
      typology = hits[0],
      suspicion_description = "Auto-flagged: " + hits.join(", "),
      status = DRAFT
    )
    
    # Queue for compliance review; if not reviewed in 12h → escalate
    outbox.publish(STRDraftedEvent(str.id))
  
  return hits
```

### ALG-KYC-STR-FILE-01 — Compliance officer files STR
```
fileSTR(str_id, actor, additional_details):
  ASSERT actor.role == compliance_officer
  str := strFiling.find(str_id)
  ASSERT str.status IN (DRAFT, PENDING_REVIEW)
  
  # Build filing payload (jurisdiction-specific format)
  payload := fiu.buildSTRPayload(str, additional_details)
  
  # Submit
  fiuResponse := fiu.submit(payload)
  
  str.status = if fiuResponse.OK then FILED else REJECTED
  str.fiu_reference = fiuResponse.reference
  str.filed_at = NOW()
  str.filed_by = actor.id
  str.filed_within_24h = (str.filed_at - str.draft_at) < 24h
  strFiling.update(str)
  
  if NOT str.filed_within_24h:
    alert.send(severity=P1, "STR filed late: " + str.id)  # regulator-visible failing
  
  auditLog.append(action=STR_FILED, actor_id=actor.id, ...)
```

### ALG-KYC-SANCTIONS-REFRESH-01 — Daily sanctions list refresh
```
refreshSanctionsLists():
  sources := [UN, OFAC, EU, MONGOLIA_NATIONAL]
  
  FOR source IN sources:
    latestVersion := source.fetchLatestVersion()
    if latestVersion > sanctionsListVersion.lastFetched(source):
      sanctionsList.bulkLoad(source, latestVersion)
      sanctionsListVersion.upsert(source, latestVersion, NOW())
      
      # Re-screen ALL existing customers against new entries
      newEntries := sanctionsList.diff(source, oldVersion, latestVersion)
      FOR entry IN newEntries:
        matches := customerRepo.findMatching(entry.name, entry.dob, ...)
        FOR match IN matches:
          sanctionsScreeningHit.insert(...)
          customerRepo.freeze(match.id, reason="Sanctions hit (new designation)")
          str.draft(customer_id=match.id, typology=SANCTIONS_HIT, ...)
          outbox.publish(CustomerFrozenEvent(match.id))
  
  # Alert if any source stale > 48h
  FOR source IN sources:
    if NOW() - sanctionsListVersion.lastFetched(source) > 48h:
      alert.send(severity=P0, "Sanctions list stale: " + source)
```

## who.md

| Actor | Can do |
|-------|--------|
| Customer | Submit docs; view own KYC status |
| KYC Reviewer (operator role) | Verify uploaded docs; mark VERIFIED/REJECTED; trigger tier upgrade |
| Compliance Officer | File STR/CTR; freeze/unfreeze customer; configure AML rules; review sanctions hits |
| Controller | Override edge-case decisions with audit-logged reason |
| Auditor | Read all KYC docs + screening + filings; zero write |
| System actors: `system.kyc-refresh`, `system.aml-monitor`, `system.sanctions-sync` | Automated checks |

SoD:
- SOD-KYC-01 — Doc verifier ≠ doc uploader (impossible by design — customer uploads, reviewer verifies)
- SOD-KYC-02 — STR filer ≠ STR drafter for high-typology cases (4-eyes)
- SOD-KYC-03 — Freeze actor + unfreeze actor must differ (4-eyes for re-enabling)
- SOD-KYC-04 — Tier downgrade requires controller + compliance jointly

## when.md

- Onboarding latency: customer-perceived < 5 min for TIER_BASIC happy path
- KYC review SLA: docs verified within 1 business day
- AML monitor: real-time (synchronous in transaction flow)
- STR filing deadline: 24 hours from suspicion (HARD; legal requirement)
- CTR filing deadline: 5 business days from trigger
- Sanctions refresh: daily (cron 06:00 local); alert if any source > 48h stale
- Annual KYC refresh: customer notified 60 days before anniversary; auto-restrict if not refreshed by 30 days post-anniversary
- PEP status re-screen: monthly
- Beneficial owner re-verification: annually OR on material ownership change

## where.md § 5 — Tech Stack

(Same shape as other modules; finance-specific additions:)

- Identity verification provider: [your country's gov ID provider — e.g., DAN (Mongolia E-government), eIDAS (EU), Aadhaar (India)]
- Sanctions data: World-Check, ComplyAdvantage, OFAC SDN feed, EU consolidated list; daily ingest pipeline
- Document storage: object storage with KMS-encrypted at rest + signed URL access
- FIU submission: jurisdiction-specific (e.g., Mongolia FIU portal API or PDF upload; US FinCEN BSA E-Filing; EU national FIU)

## gravity.md — HW-KYC-*

- HW-KYC-01 — No bypass paths; even VIP/staff customers go through full checks
- HW-KYC-02 — Sanctions screening before any account-funding (deposit, transfer-in)
- HW-KYC-03 — Doc storage encrypted at rest
- HW-KYC-04 — Audit log append-only (inherits HW-GL-19)
- HW-KYC-05 — Retention 7y (inherits HW-FIN-22)
- HW-KYC-06 — Real-time AML monitor in tx flow (synchronous, blocking)
- HW-KYC-07 — STR/CTR filing audit trail (filing artifact retained as immutable PDF + raw data)
- HW-KYC-08 — Customer freeze cascades to ALL related modules (wallet, investment, etc.) via event
- HW-KYC-09 — Operator identity (no sentinels) (inherits HW-GL-06)
- HW-KYC-10 — Idempotent verification check (re-screening same customer with same list version yields same result)

## gaps.md — Common pilot findings

- Gap-KYC-01: Sanctions list TTL too long (24h) — should be 6h max with alarm at 48h
- Gap-KYC-02: STR auto-escalation if drafted but not filed > 12h
- Gap-KYC-03: PEP detection on customer name only — should screen beneficial owners too
- Gap-KYC-04: Annual refresh notification system missing
- Gap-KYC-05: Customer freeze in KYC module but wallet doesn't honor it (event subscription gap)
- Gap-KYC-06: Doc upload size/type validation incomplete (security)

## glossary.md — Module-specific terms

**AML** — Anti-Money Laundering. Set of regulations + practices to detect + prevent money laundering. See `../../principles/regulatory-compliance.md` § 2.4.

**CTR** — Cash Transaction Report. Required filing for cash transactions ≥ threshold (Mongolia: 20M MNT; US: $10K).

**CDD** — Customer Due Diligence. The baseline identification process required for all customers. Equivalent to TIER_BASIC + TIER_FULL combined.

**EDD** — Enhanced Due Diligence. Additional verification for higher-risk customers (PEPs, high-volume, foreign nationals from high-risk jurisdictions).

**FIU** — Financial Intelligence Unit. The government body that receives STR/CTR filings (Mongolia FIU; US FinCEN; UK NCA; EU national FIUs).

**KYC** — Know Your Customer. Identity verification process.

**KYC tier** — Verification level. TIER_0 (none) → TIER_BASIC (ID + selfie) → TIER_FULL (+ proof of address + source of funds) → TIER_EDD (+ enhanced); TIER_REFUSED (sanctioned or failed).

**PEP** — Politically Exposed Person. Holds prominent public function or close associate thereof. Requires EDD + ongoing monitoring + automatic STR review for large transactions.

**Sanctions list** — Government-maintained list of designated individuals/entities subject to financial sanctions. Sources: UN Security Council, OFAC (US), EU consolidated, national lists.

**Sanctions hit** — Match between a customer/counterparty name and a sanctions-list entry. Match score determines true hit vs false positive.

**SDD** — Simplified Due Diligence. EU-specific lower-friction baseline for very low-risk customer categories.

**SDN** — Specially Designated Nationals. OFAC's primary sanctions list.

**Source of funds** — Documentation of where the customer's money originates (salary, business income, inheritance, investment gains, etc.). Required for TIER_FULL.

**STR / SAR** — Suspicious Transaction Report (Mongolia naming) / Suspicious Activity Report (US naming). Filed within 24h of suspicion.

**Typology** — A pattern of activity recognized as potential money laundering (e.g., smurfing, round-trip, layering, integration).

**UBO** — Ultimate Beneficial Owner. The natural person who ultimately owns or controls a legal-entity customer (≥25% threshold typically).

## Next when authoring this module

Same as other module overviews: copy to your project, expand into 10 files, cite production code, fill status tags, run B1+R3+R1+R2 reviews.
