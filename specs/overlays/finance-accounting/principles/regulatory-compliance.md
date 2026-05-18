---
doc: overlays/finance-accounting/principles/regulatory-compliance
type: principles-spec
overlay: finance-accounting
version: 0.2.0
status: experimental
last_updated: 2026-05-18
---

# Financial-Services Regulatory Compliance Framework

> **Jurisdiction-neutral**. Common compliance pillars that apply to regulated financial-services entities worldwide. Concrete examples are shown across **multiple jurisdictions equally** (EU / US / UK / Singapore / India / Japan / Mongolia / Hong Kong / Australia) so any team can pick their own and adapt.
>
> For **how to research your jurisdiction's specifics** (regulator website navigation, law citation conventions, periodic re-check workflow), see core ZeeSpec `workflow/07-r4-regulatory-research/` (promoted to core in v2.7). Finance-specific worked examples in `../research-examples/`.

## 1. The regulatory landscape

Every regulated financial-services entity operates under a stack of laws + regulations issued by:

- A **prudential / market-conduct regulator** (securities, banking, insurance authority)
- A **financial intelligence unit (FIU)** for AML/CFT reporting
- **Data protection authority** for customer data
- **Tax authority** for withholding, reporting, retention

Each jurisdiction has its own names but the structural roles are universal.

### 1.1 Regulator equivalence table

| Role | EU | US | UK | Singapore | Japan | India | Hong Kong | Australia | Mongolia |
|------|-----|-----|-----|-----------|-------|-------|-----------|-----------|----------|
| **Securities / market-conduct** | ESMA + national (BaFin, AMF, CONSOB) | SEC + FINRA | FCA | MAS | JFSA | SEBI | SFC | ASIC | FRC |
| **Banking** | EBA + national (BaFin, ACPR, Bank of Italy) | Federal Reserve + OCC + FDIC | PRA (BoE) | MAS | FSA | RBI | HKMA | APRA | Mongolbank |
| **FIU (AML)** | National FIUs under AMLD | FinCEN | NCA | STRO (MAS) | JAFIC | FIU-IND | JFIU | AUSTRAC | FIU under FRC |
| **Data protection** | EDPB + national | FTC + state AGs | ICO | PDPC | PPC | DPB | PCPD | OAIC | (developing) |
| **Tax** | National | IRS | HMRC | IRAS | NTA | CBDT | IRD | ATO | GASA |

### 1.2 Core regulatory laws by jurisdiction (illustrative)

| Theme | EU | US | UK | Singapore | India | Mongolia |
|-------|-----|-----|-----|-----------|-------|----------|
| Securities | MiFID II + UCITS | Securities Act 1933 + Investment Advisers Act 1940 | FSMA 2000 | SFA 2001 | SEBI Act 1992 | Securities Markets Law 2005 |
| AML / CFT | AMLD6 (Directive 2024/1640) | BSA + Patriot Act | POCA 2002 + MLR 2017 | CDSA + AML/CFT Notice | PMLA 2002 | AML/CFT law 2013 (am. 2017+) |
| Privacy | GDPR | CCPA + GLBA | UK GDPR + DPA 2018 | PDPA | DPDPA 2023 | (developing) |
| Audit retention | Sector + GDPR Art. 17 | SOX 7y for public co's | Companies Act 6y | 5y typical | IT Act + sector | 7y AML law |

### 1.3 International standards

- **FATF Recommendations** — AML/CFT standards; jurisdictions above are FATF members or aligned
- **IOSCO Principles** — securities-market regulation
- **Basel III** — banking capital adequacy (via national banking regulator)
- **IFRS** — accounting standards (140+ countries; US uses GAAP analogue)
- **Wolfsberg AML Principles** — private-banking AML
- **ISO 27001** — infosec management
- **PCI-DSS** — card data security

## 2. The 7 universal compliance pillars

These apply regardless of jurisdiction. Specific thresholds + deadlines vary; the structure is constant.

### 2.1 Licensing + registration

Investment fund managers, broker-dealers, custodians, payment institutions MUST be licensed by their jurisdiction's relevant regulator. The license defines permitted activities, sets minimum capital requirements, establishes operating conditions.

**Engineering touchpoint:** A `LicensedEntity` record carries license number + jurisdiction; regulatory submissions reference it.

### 2.2 Client asset segregation

```markdown
### HW-REG-01 — Client assets segregated from firm's own assets
Status: ⚠️ Critical — must be ✅ IMPL or business is non-compliant

Customer funds + securities MUST be held in segregated accounts at custodian
banks/custodians, NOT commingled with the firm's operating accounts.

Engineering:
- DB: account.account_class enum distinguishes CLIENT_ASSETS vs OPERATING
- Service: Transfer FROM client-asset account requires elevated role
- Audit: All cross-class transfers audit-logged with reason + approver

Regulatory references:
- EU: MiFID II Art. 16; UCITS Art. 22
- US: SEC Rule 15c3-3 (customer protection); IAA §206
- UK: FCA CASS sourcebook
- Singapore: SFA segregation rules
- Mongolia: FRC trust account requirements
```

```markdown
### HW-REG-02 — Client cash held in trust account at licensed institution
Status: ⚠️ Critical

Customer cash sits in designated trust accounts at licensed banks. The
account is in the firm's name but explicitly for client benefit.

Naming by jurisdiction:
- EU/UK: "client money account" (CASS)
- US: "customer reserve account" (Rule 15c3-3)
- Singapore: "trust account" (SFA)
- Mongolia: "trust account" (FRC)
```

### 2.3 NAV calculation + reporting

Investment funds compute NAV daily (typically EOD). Regulators require:

- **Daily NAV** at marketable-security closing prices
- **NAV per share** = (Total Assets - Total Liabilities) / Shares Outstanding
- **NAV reporting frequency** varies (monthly retail; quarterly institutional)
- **NAV correction process** — historical correction = investor compensation + regulator notice

```markdown
### INV-REG-03 — NAV computed and locked by required deadline
Status: project-dependent

NAV deadlines (illustrative):
- EU UCITS: NAV pricing day + 1 business day for publication
- US Investment Company Act: NAV each business day; published next day
- Singapore: T+1 publication
- Mongolia: T+2 FRC submission
```

### 2.4 AML / CFT

Most heavily harmonized area (FATF). Core obligations universal; thresholds + deadlines vary.

**Core obligations (universal):**

1. **CDD** — verify identity
2. **EDD** — higher-risk customers (PEPs, high-volume, high-risk jurisdictions)
3. **Ongoing monitoring** — typology rules
4. **CTR** — file with FIU for cash ≥ threshold
5. **STR / SAR** — file on suspicion (any amount)
6. **Sanctions screening** — UN, OFAC, EU, national
7. **Recordkeeping** — typically 5-7 years

**Threshold + deadline comparison (illustrative — verify current):**

| Theme | EU | US | UK | Singapore | India | Japan | HK | AU | Mongolia |
|-------|-----|-----|-----|-----------|-------|-------|-----|-----|----------|
| CTR (cash tx) | €10K | $10K | €10K equiv | S$20K | ₹10L | ¥2M | HK$120K | A$10K | 20M MNT |
| STR deadline | Promptly (~24h) | "promptly" (typically 30d; immediate for terrorism) | "as soon as practicable" | 15d | 7d | Promptly | "as soon as reasonable" | 3 business days | 24h |
| Record retention | 5y (extensible) | 5y | 5y | 5y | 5y | 7y | 7y | 7y | 7y |
| Sanctions sources | UN + EU + national | UN + OFAC SDN | UN + UK + OFAC | UN + national | UN + national | UN + national | UN + national | UN + national + DFAT | UN + national-designated |

```markdown
### INV-REG-04 — KYC tier verified before any customer transaction
Status: ✅ IMPL (must be)

No customer transacts (deposit, invest, withdraw) until KYC tier ≥ BASIC.
Restricted products require FULL.

4-tier model (widely used):
- TIER_0  → not started
- TIER_BASIC → ID + selfie (corresponds: EU SDD/CDD-light; US CIP-minimal)
- TIER_FULL  → + proof of address + source of funds (EU CDD; US CIP)
- TIER_EDD   → + enhanced (PEP, UBO)
```

```markdown
### INV-REG-05 — Cash transactions ≥ jurisdictional threshold auto-flagged for CTR
Status: ⚠️ MUST be ✅ IMPL

Trigger CTR filing within jurisdictional deadline. "Cash" = physical
currency + near-cash (money orders, traveler's checks) in most
jurisdictions. Bank transfers are NOT cash but pattern-based STR rules
(smurfing) still apply.
```

```markdown
### INV-REG-06 — Sanctions screening on every customer + counterparty
Status: ⚠️ MUST be ✅ IMPL — strict liability in most jurisdictions

Screening at: onboarding, KYC tier change, every tx with non-customer
counterparty, daily re-screen against new entries.

Hit handling: block + freeze + STR within jurisdictional deadline.
```

```markdown
### INV-REG-07 — Beneficial owner identification (≥25% standard)
Status: project-dependent

FATF Rec 24+25: for legal-entity customers, identify natural persons
owning ≥ 25%. Some jurisdictions lower for higher-risk:
- EU AMLD: 25% baseline; lower for trusts
- US FinCEN BOI Rule (2024): 25% or "substantial control"
- Singapore + Mongolia: 25%

Traverse ownership chain to natural persons (document why halted otherwise).
```

### 2.5 Reporting + disclosure

| Report | Typical frequency | Typical deadline |
|--------|-------------------|------------------|
| Daily NAV (funds) | Daily | T+1 to T+2 |
| Monthly financial statements | Monthly | M+5 to M+30 working days |
| Quarterly portfolio composition | Quarterly | Q+15 to Q+45 working days |
| Annual audited financials | Annual | Y+90 to Y+180 calendar days |
| AML/CFT compliance report | Semi-annual to annual | Per regulator schedule |
| Material change disclosures | Event-driven | Within 5-15 working days |

```markdown
### HW-REG-08 — Regulatory submission audit trail
Status: ⚠️ MUST be ✅ IMPL

Every submission must be:
- Timestamped at submission
- Stored as immutable artifact (PDF + machine-readable source data)
- Retrievable for full retention window (5-7y)
- Re-creatable from underlying data (idempotent generation script)
- Linked to underlying journals / records that produced the figures
```

### 2.6 Retention

5-7 year retention typical for KYC, transactions, sanctions hits, CTR/STR, due-diligence files. Accounting records often longer per tax / company law.

```markdown
### HW-REG-09 — Hard DELETE prohibited on audit/compliance tables
Status: ⚠️ MUST be ✅ IMPL — pilot found hard-DELETE anti-pattern

Tables under retention MUST NOT be physically deleted during retention
window. Use:
- soft_delete column (deleted_at timestamp)
- Archive table for rows beyond hot window (still retained in cold storage)
- DB role permissions: REVOKE DELETE on retained tables FROM
  application_user

Raw DELETE on retained tables = 🚨 P0.

Retention windows (illustrative):
- EU AMLD: 5y (some extensible)
- US BSA: 5y; SOX 7y for public-co accounting
- UK MLR: 5y
- Singapore: 5y
- India PMLA: 5y
- Mongolia AML: 7y
- IFRS / company law: 7-10y typical
```

### 2.7 Data protection (overlaps with retention)

Customer data is regulated by privacy law in parallel with AML retention. Tensions:

- **GDPR right-to-erasure** vs **AML retention** — AML wins; document legal basis (Art. 6(1)(c))
- **Data minimization** vs **EDD detail collection** — collect risk-based; document why
- **Cross-border transfer restrictions** — SCC / BCR / adequacy decision needed

```markdown
### INV-REG-10 — Privacy/retention overlap documented
Status: project-dependent

Document per retained category:
- Retention period
- Legal basis (specify which law)
- Access controls post-relationship-end
- Deletion process post-retention (must actually delete; privacy law requires)
```

## 3. Engineering implications

### 3.1 RBAC for finance teams

| Role | What they can do | Cannot do |
|------|------------------|-----------|
| **Customer** | Own data; initiate own tx (KYC + AML guards apply) | Anything on others |
| **Operator** | Process ops, recon, routine journals | High-value approval, SoD override, config |
| **Approver** | Approve above-threshold tx; cannot approve own (SoD) | Process own |
| **Compliance Officer** | All audit logs, STR/CTR filing, AML rule config | Operational tx |
| **Controller / CFO** | Reopen periods, adjusting entries, financials sign-off | Day-to-day ops |
| **Admin / IT** | System config, user mgmt | Customer financial data, journals |
| **Auditor (RO)** | Read all incl. audit logs | Any write |
| **System actor** | Automated EOD jobs | User-initiated actions |

### 3.2 SoD invariants

```markdown
### HW-REG-11 — SoD: 4-eyes (Approver ≠ Initiator) minimum
Status: ⚠️ Must be ✅ IMPL — auditor red-flag if violated

Material tx (above threshold):
- 4-eyes: Approver ≠ Initiator
- 6-eyes (high-value): Initiator ≠ Approver ≠ Poster

Service rejects: approve() if approver_id = initiator_id; post() if
poster_id IN (initiator_id, approver_id) when 6-eyes required.
```

### 3.3 Compliance dashboard

1. CTR queue (awaiting filing)
2. STR queue (pending)
3. Sanctions hits (today + unresolved)
4. KYC pending review
5. PEP-customer transactions (last 30d)
6. Period close progress
7. Reconciliation breaks
8. Audit log access (read-only)
9. Retention status (rows due for archive/deletion)
10. Regulatory submission history

## 4. R2 inspector questions (universal)

When R2 reviews a finance module, prompt agent with these (applicable in ANY jurisdiction):

1. "Show me the audit trail for journal #X" — real human operator?
2. "List all CTR-threshold transactions in last 30d" — all filed?
3. "Show sanctions-screening evidence for customer #Y at onboarding" — timestamp captured?
4. "Reconcile yesterday's wallet balances against GL account #Z" — does it balance?
5. "Show closing entries for prior period" — posted, audit-trailed, controller-signed?
6. "Show segregation of client assets — which trust accounts hold what?"
7. "Run daily NAV for date X" — reproducible?
8. "Show retention policy in code" — hard DELETE prevented?
9. "Show CTR filing audit trail end-to-end" — trigger → review → file → ACK.
10. "Show SoD enforcement — try to approve your own transaction" — does it reject?

(See `../prompts/R2-financial-reviewer.md` for full agent prompt.)

## 5. Implementation checklist

Before claiming production-ready in any jurisdiction:

- [ ] All `HW-REG-*` + `HW-ACC-*` hardwiring status-tagged
- [ ] KYC enforcement on every customer-write path
- [ ] AML CTR threshold + STR triggers wired (YOUR jurisdiction's threshold)
- [ ] Sanctions screening + cache strategy documented
- [ ] Retention enforced (no hard DELETE; YOUR window)
- [ ] SoD enforced at service layer + test coverage
- [ ] Audit log captures operator + timestamp + reason on every mutation
- [ ] Period close workflow + reopen process documented + tested
- [ ] Reconciliation jobs + alarms
- [ ] Regulatory report generation idempotent + retainable
- [ ] System actor seeded for background jobs
- [ ] Privacy/retention overlap documented (INV-REG-10)
- [ ] Cross-border transfer mechanisms in place (if applicable)

## 6. Common compliance traps

(See `financial-anti-patterns.md` for full catalog.)

- **Per-channel CTR check** — net of multi-channel cash may not trigger; test net AND gross
- **Sanctions list cached but never refreshed** — daily refresh + alert if fails
- **KYC enforced at deposit but not first withdrawal** — verify every customer-money-movement path
- **Hard DELETE on `kyc_documents`** — retention violation regardless of jurisdiction
- **`createdBy: 0` sentinel on system-initiated journals** — breaks "who posted" trail
- **Manager-bypassed-approval logged but not blocked** — audit log ≠ control
- **Period close without privacy-deletion check** — closing accounting period ≠ GDPR Art. 17 deletion schedule

## 7. Pilot context — Mongolia FRC

> The pilot project that produced this overlay is a Mongolian mutual fund management system under FRC (Санхүүгийн зохицуулах хороо). Pilot specifics:

- **Regulator:** Санхүүгийн зохицуулах хороо (FRC); https://www.frc.mn
- **AML/CFT law:** Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль (2013, amended 2017+)
- **Securities law:** Үнэт цаасны зах зээлийн тухай хууль (2005, amended 2013+)
- **Investment Fund Law:** Хөрөнгө оруулалтын сангийн тухай хууль (2013)
- **CTR threshold:** 20,000,000 MNT (~7,000 USD)
- **STR deadline:** 24 hours from suspicion
- **Retention:** 7 years (AML + company-law records)
- **Currency:** MNT (Mongolian Tögrög, ISO MNT)

This pilot is one reference. Your jurisdiction will differ; the framework above is the same.

For step-by-step research methodology to discover YOUR jurisdiction's specifics, see `/specs/workflow/07-r4-regulatory-research/00-START-HERE.md`.

## 8. References

(See `/specs/workflow/07-r4-regulatory-research/05-source-cheatsheet.md` for full source URL list per regulator + domain.)

### International standards
- FATF Recommendations: https://www.fatf-gafi.org
- IOSCO Principles: https://www.iosco.org
- Wolfsberg AML Principles: https://www.wolfsberg-principles.com
- Basel Committee: https://www.bis.org/bcbs/

### Mongolia (pilot)
- FRC: https://www.frc.mn
- Mongolian financial-services laws per § 7

## Next

→ `financial-invariants-catalog.md` — reusable INV/HW entries
→ `/specs/workflow/07-r4-regulatory-research/00-START-HERE.md` — research methodology (in core ZeeSpec)
