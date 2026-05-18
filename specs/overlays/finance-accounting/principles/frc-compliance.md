---
doc: overlays/finance-accounting/principles/frc-compliance
type: principles-spec
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# FRC Compliance Framework

> **Primary jurisdiction:** Mongolia FRC (Санхүүгийн зохицуулах хороо / Financial Regulatory Commission). EU (ESMA + GDPR), US (SEC + FINRA + SOX), and other jurisdictions are noted as adaptation tables — fork this file and replace FRC sections with your local regulator's analogues.

## 1. FRC overview

The **Санхүүгийн зохицуулах хороо** (FRC) is Mongolia's non-banking financial regulator established by the 2005 Law on Securities Markets and expanded under subsequent legislation. It oversees:

- Securities markets (broker-dealers, investment funds, custodians)
- Insurance
- Non-bank financial institutions (NBFIs)
- Savings and credit cooperatives
- Microfinance organizations

FRC is the equivalent of:
| Country | Equivalent regulator(s) |
|---------|------------------------|
| Mongolia | **FRC (СЗХ)** — Санхүүгийн зохицуулах хороо |
| EU | ESMA (European Securities and Markets Authority) + national regulator (e.g., BaFin, AMF, CONSOB) |
| US | SEC (Securities and Exchange Commission) + FINRA (Financial Industry Regulatory Authority) for broker-dealers |
| UK | FCA (Financial Conduct Authority) |
| Singapore | MAS (Monetary Authority of Singapore) |
| Japan | JFSA (Financial Services Agency) |
| India | SEBI (Securities and Exchange Board of India) |
| Hong Kong | SFC (Securities and Futures Commission) |

## 2. Key regulatory pillars

### 2.1 Licensing + registration

Investment fund managers, custodians, broker-dealers MUST be licensed by FRC. The license:
- Defines permitted activities (custody, asset management, advisory, etc.)
- Sets minimum capital requirements
- Establishes operating conditions (segregation of client assets, staff qualifications, etc.)

**Engineering touchpoint:** A `FundManager` entity in your system should reference its FRC license number; reports to FRC may need the license # in the header.

### 2.2 Capital adequacy + segregation of client assets

```markdown
### HW-FRC-01 — Client assets segregated from firm's own assets
Status: ⚠️ Critical — must be ✅ IMPL or business is non-compliant

Customer funds + securities MUST be held in segregated accounts at custodian
banks/custodians, NOT commingled with the fund manager's operating accounts.

Engineering enforcement:
- DB: account.account_class enum distinguishes CLIENT_ASSETS vs OPERATING
- Service: Any transfer FROM client-asset account requires elevated role
           (controller, NOT regular operator)
- Audit: All transfers between classes audit-logged with reason + approver
```

```markdown
### HW-FRC-02 — Client cash held in trust account at licensed bank
Status: ⚠️ Critical

Customer cash deposits sit in a designated trust/custody account
("trust account") at a licensed Mongolian bank. The trust account is in
the fund manager's name BUT explicitly for the benefit of clients.

Engineering: Bank account record carries `account_type = CLIENT_TRUST`;
the operating P&L cannot draw from it.
```

### 2.3 Net Asset Value (NAV) calculation + reporting

Investment funds compute NAV daily (typically EOD). FRC requires:

- **Daily NAV** calculated using marketable security closing prices
- **NAV per share** = (Total Assets - Total Liabilities) / Shares Outstanding
- **NAV reporting frequency** — FRC submission monthly (varies by fund type)

```markdown
### INV-FRC-03 — NAV computed and locked daily by EOD + 2 hours
Status: project-dependent

NAV calculation MUST complete daily (T+0 close of market). Once locked, NAV
cannot be retroactively adjusted except via formal correction process
(audit-logged, controller-approved, regulator-notifiable).
```

### 2.4 AML / CFT (Anti-Money Laundering / Counter Financing Terrorism)

Mongolia's AML/CFT law (Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль, 2013, amended 2017+) and FRC implementing regulations apply.

**Core obligations:**

1. **Customer Due Diligence (CDD)** — verify customer identity before account opening
2. **Enhanced Due Diligence (EDD)** — for higher-risk customers (PEPs, high-volume, foreign)
3. **Ongoing monitoring** — transactions flagged against typology rules
4. **Cash Transaction Report (CTR)** — file with FIU for cash transactions ≥ 20,000,000 MNT (~7,000 USD as of 2024)
5. **Suspicious Transaction Report (STR / SAR)** — file with FIU for transactions raising AML/CFT suspicion (any amount)
6. **Sanctions screening** — UN, OFAC, EU sanctions lists; Mongolian designated lists
7. **Recordkeeping** — 7 years minimum (5 years for some categories)

```markdown
### INV-FRC-04 — KYC tier verified before any customer transaction
Status: ✅ IMPL (must be — non-compliance = license risk)

No customer may transact (deposit, invest, withdraw) until KYC tier is at
least BASIC. Restricted-product transactions require tier FULL.

KYC tiers:
- TIER_0  → not started
- TIER_BASIC → ID + selfie verified
- TIER_FULL  → ID + selfie + proof of address + source of funds
- TIER_EDD   → FULL + enhanced (PEP screening, beneficial owner identification)
```

```markdown
### INV-FRC-05 — Cash transactions ≥ 20,000,000 MNT auto-flagged for CTR
Status: ⚠️ MUST be ✅ IMPL

Any cash transaction (deposit OR withdrawal) ≥ 20M MNT triggers automatic
CTR report generation queued for FIU submission within 5 business days
(per AML law Art. 10).

Note on "cash": cash typically means physical cash (counter deposits).
Bank transfers ARE NOT cash; threshold differs (none for STR; pattern-based
flagging applies).
```

```markdown
### INV-FRC-06 — Sanctions screening on every customer + counterparty
Status: ⚠️ MUST be ✅ IMPL

Customer onboarding + every counterparty in a transaction (sender,
beneficiary) is screened against:
- UN Security Council sanctions list
- OFAC SDN list (if US-touching)
- EU consolidated sanctions list
- Mongolian designated persons list

Hit → block transaction + freeze account + file STR within 24 hours
(per AML law Art. 13).
```

```markdown
### INV-FRC-07 — Beneficial owner identification (25%+ threshold)
Status: project-dependent

For legal-entity customers, identify natural persons who ultimately own or
control ≥ 25% of voting rights / equity. Document the ownership chain
(direct or through intermediate entities).
```

### 2.5 Reporting + disclosure

FRC requires periodic submissions:

| Report | Frequency | Deadline |
|--------|-----------|----------|
| Daily NAV | Daily | T+2 |
| Monthly financial statements | Monthly | M+10 working days |
| Quarterly portfolio composition | Quarterly | Q+15 working days |
| Annual audited financial statements | Annual | Y+90 calendar days (with FRC-approved auditor) |
| AML/CFT compliance report | Semi-annual | Per FRC schedule |
| Material change disclosures | Event-driven | Within 5 working days |

```markdown
### HW-FRC-08 — Regulatory submission audit trail
Status: ⚠️ MUST be ✅ IMPL

Every FRC submission must be:
- Timestamped at submission
- Stored as immutable artifact (PDF + machine-readable source data)
- Retrievable for 7 years
- Re-creatable from underlying data (idempotent generation script)
```

### 2.6 Retention

Mongolia AML/CFT law mandates **7-year retention** for:
- All customer identification records
- All transaction records
- All sanction-screening hits + dispositions
- All CTR / STR filings
- All due diligence files

Audit law and accounting standards extend retention for accounting records to 7 years from end of fiscal year.

```markdown
### HW-FRC-09 — Hard DELETE prohibited on audit/compliance tables
Status: ⚠️ MUST be ✅ IMPL — pilot found hard-DELETE anti-pattern (see
                              spawn chip)

Tables under 7-year retention requirement MUST NOT be physically deleted
during the retention window. Use:
- soft_delete column (deleted_at timestamp)
- Archive table for rows older than retention window (still retained
  but in cold storage)
- DB role permissions: REVOKE DELETE on retained tables FROM
  application_user

Audit + commands that issue raw DELETE on retained tables are 🚨 P0
production bugs.
```

## 3. Adaptation tables — apply to your jurisdiction

### 3.1 Regulator equivalence

If your project is NOT under FRC jurisdiction, substitute throughout this overlay:

| FRC concept | EU | US | UK | India | Singapore |
|-------------|-----|-----|-----|-------|-----------|
| Primary regulator | ESMA / national | SEC / FINRA | FCA | SEBI | MAS |
| AML regulator | EU AMLD / national FIU | FinCEN | NCA | FIU-IND | MAS / STRO |
| Securities law | MiFID II + UCITS | Securities Act 1933 + Investment Advisers Act 1940 | FSMA 2000 | SEBI Act 1992 | SFA 2001 |
| AML law | AMLD6 (2024) | BSA + Patriot Act | POCA 2002 + MLR 2017 | PMLA 2002 | CDSA + AML/CFT Notice |
| Privacy/data | GDPR | State laws + GLBA for fin | UK GDPR + DPA 2018 | DPDPA 2023 | PDPA |

### 3.2 Currency-transaction reporting thresholds

| Jurisdiction | CTR threshold (single transaction) | Currency | Approx USD |
|--------------|------------------------------------:|---------:|-----------:|
| Mongolia | 20,000,000 | MNT | ~7,000 |
| EU | 10,000 | EUR | ~10,900 |
| US | 10,000 | USD | 10,000 |
| UK | 10,000 | EUR (equiv) | ~10,900 |
| India | 1,000,000 | INR | ~12,000 |
| Singapore | 20,000 | SGD | ~14,900 |
| Japan | 2,000,000 | JPY | ~13,400 |

> Always check current threshold + currency-equivalence calculation; this table is approximate as of 2026.

### 3.3 Retention windows

| Jurisdiction | Customer ID records | Transaction records | Accounting records |
|--------------|--------------------:|--------------------:|-------------------:|
| Mongolia | 7 years | 7 years | 7 years (from FY end) |
| EU AMLD | 5 years (extensible) | 5 years (extensible) | 7 years (per national tax law) |
| US BSA | 5 years | 5 years | 7 years (SOX for public co's) |
| UK MLR | 5 years | 5 years | 6 years (Companies Act) |
| Singapore | 5 years | 5 years | 5 years |

### 3.4 KYC tier mapping

The pilot project uses 4 tiers (TIER_0 / BASIC / FULL / EDD). Other jurisdictions use similar but differently named:

| Tier purpose | Mongolia FRC | EU (PSD2 / AMLD) | US (BSA / Treasury) | India (SEBI) |
|--------------|--------------|-------------------|----------------------|---------------|
| Minimal | TIER_BASIC | SDD (Simplified) | low-risk threshold | SimpKYC |
| Standard | TIER_FULL | CDD | CIP (Customer ID Program) | Full KYC |
| Enhanced | TIER_EDD | EDD | Enhanced CDD | KYC with EDD |
| Refused | TIER_REFUSED | refused / exited | terminated | refused |

## 4. Engineering implications

### 4.1 Auth + RBAC model

Finance modules need finer-grained roles than generic SaaS apps:

| Role | What they can do | Cannot do |
|------|------------------|-----------|
| **Customer** | View own data, initiate own transactions (subject to KYC + AML checks) | Anything on others' accounts; configuration |
| **Operator** | Process customer ops, run reconciliations, post routine journals | Approve, override SoD, configure system, access compliance reports |
| **Approver** | Approve transactions above operator threshold, approve KYC tier upgrades | Process own approval (SoD); destructive ops |
| **Compliance Officer** | View all audit logs, file STR/CTR, configure AML rules | Process operational transactions |
| **Controller / CFO** | Reopen closed periods, post adjusting entries, sign off financials | Day-to-day operations |
| **Admin / IT** | System config, user management | View customer financial data; post journals |
| **Auditor (read-only)** | Read all data including audit logs | Any write |
| **System actor (`system.eod`)** | Automated EOD jobs (NAV calc, fee accrual, reconciliation) | Any user-initiated action |

### 4.2 Segregation of Duties (SoD) invariants

```markdown
### HW-FRC-10 — SoD: no single user can initiate, approve, and post
Status: ⚠️ Must be ✅ IMPL — auditor red-flag if violated

For material transactions (above configured threshold):
- Initiator (who creates) ≠ Approver (who approves) ≠ Poster (who commits)

For 4-eyes principle: at minimum, Approver ≠ Initiator.

For 6-eyes principle (high-value or sensitive): Initiator ≠ Approver ≠ Poster.

Enforcement: Service rejects approve() if approver_id = initiator_id;
rejects post() if poster_id in (initiator_id, approver_id) when 6-eyes
required.
```

### 4.3 Compliance dashboard touchpoints

Your finance system should surface these to the compliance officer role:

1. CTR queue (transactions awaiting filing)
2. STR queue (pending filings)
3. Sanctions hits (today + unresolved)
4. KYC pending review (uploads awaiting verification)
5. PEP-customer transactions (last 30 days)
6. Period close progress (which steps remain)
7. Reconciliation breaks (subledger vs GL)
8. Audit log access (read-only browser)

## 5. R2 reviewer questions (inspector-style)

When R2 reviews a finance module, prompt the agent with these questions (taken from typical FRC inspection scopes):

1. "Show me the audit trail for journal #X" — does every journal have a real human operator?
2. "List all CTR-threshold transactions in the last 30 days" — are they all filed?
3. "Show me the sanctions-screening evidence for customer #Y at onboarding" — is the timestamp captured?
4. "Reconcile yesterday's wallet balances against GL account 1110-XX" — does it balance?
5. "Show closing entries for prior period" — are they posted, audit-trailed, controller-signed?
6. "Show me the segregation of client assets — which trust accounts hold what?"
7. "Run the daily NAV for date X and show me how it was computed" — is the calculation reproducible?
8. "Show me the data retention policy in code" — is hard DELETE prevented on retained tables?
9. "Show me a CTR filing audit trail end-to-end" — from trigger → review → file → ACK.
10. "Show me the SoD enforcement — try to approve your own transaction." — does it reject?

(See `prompts/R2-financial-reviewer.md` for the full agent prompt.)

## 6. Implementation checklist

Before claiming an accounting/finance module is production-ready:

- [ ] All `HW-FRC-*` and `HW-ACC-*` hardwiring constraints status-tagged
- [ ] KYC enforcement verified at every customer-write path
- [ ] AML CTR threshold + STR triggers wired + tested
- [ ] Sanctions screening integrated + cache strategy documented
- [ ] Retention policy enforced (no hard DELETE on retained tables)
- [ ] SoD enforced at service layer with test coverage
- [ ] Audit log captures operator + timestamp + reason on every mutation
- [ ] Period close workflow + reopen process documented + tested
- [ ] Reconciliation jobs + alarms in place
- [ ] FRC report generation idempotent + retainable
- [ ] System actor (`system.eod`) seeded for background jobs

## 7. Common compliance traps

(See `financial-anti-patterns.md` for full catalog.)

- **CTR filed only on the system that *initiated* the cash flow** — but a settlement net of multiple gross transactions ≥ threshold may not trigger. Test net AND gross.
- **Sanctions list cached but never refreshed** — stale list = compliance gap. Daily refresh + alert if refresh fails.
- **KYC enforced at deposit but not at first withdrawal** — verify enforcement on every customer-money-movement path.
- **Hard DELETE on `kyc_documents` table** — retention violation.
- **`createdBy: 0` sentinel on system-initiated journals** — breaks "who posted this?" trail.
- **Manager-bypassed-approval logged but not blocked** — audit trail is necessary but insufficient; SoD must hard-reject.

## 8. References

### Mongolia
- Санхүүгийн зохицуулах хороо официальный сайт: https://www.frc.mn
- Securities Markets Law (Үнэт цаасны зах зээлийн тухай хууль): 2005, amended 2013+
- AML/CFT Law (Мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх тухай хууль): 2013, amended 2017+
- Banking Law (Банкны тухай хууль): 2010
- Investment Fund Law (Хөрөнгө оруулалтын сангийн тухай хууль): 2013

### EU
- ESMA: https://www.esma.europa.eu
- MiFID II (Directive 2014/65/EU)
- UCITS (Directive 2009/65/EC)
- AMLD (Directive 2024/1640)

### US
- SEC: https://www.sec.gov
- FINRA: https://www.finra.org
- Bank Secrecy Act (BSA): 31 USC 5311 et seq.
- Investment Advisers Act of 1940

### Standards
- FATF Recommendations: https://www.fatf-gafi.org
- IOSCO Principles: https://www.iosco.org
- Wolfsberg AML Principles: https://www.wolfsberg-principles.com

## Next

→ `financial-invariants-catalog.md` — reusable INV/HW entries
