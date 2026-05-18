---
doc: workflow/07-r4-regulatory-research/05-source-cheatsheet
type: workflow-research-reference
phase: R4-regulatory-research
version: 1.0.0
status: stable
last_updated: 2026-05-18
applies_to: any regulated domain
---

# Source Cheatsheet — URLs + Authority Map (Multi-Domain, Multi-Jurisdiction)

> **Domain-agnostic.** Starting URLs for regulator websites + statute databases + standard-setter publications. Use as Phase 2 (source mapping) starter. URLs verified 2026-05; check current before relying.
>
> Organized by domain (finance / healthcare / government / privacy / tax / labor / telecoms) and within each by jurisdiction (Mongolia / EU / US / UK / Singapore / Japan / India / HK / Australia + international standards bodies).
>
> Sections below — jump to your domain:
> - **§ FINANCE** (deepest coverage; pilot domain)
> - **§ HEALTHCARE**
> - **§ GOVERNMENT / CYBERSECURITY**
> - **§ PRIVACY / DATA PROTECTION**
> - **§ TAX**
> - **§ LABOR / EMPLOYMENT**
> - **§ TELECOMMUNICATIONS**
> - **§ INTERNATIONAL STANDARDS BODIES**
> - **§ STATUTE DATABASES (per jurisdiction)**

## How to use this cheatsheet

1. Find your domain section
2. Within domain, find your jurisdiction
3. Open the listed authority website + statute database
4. Use the search hints to find the specific law / regulation
5. Apply `01-regulatory-research-workflow.md` Phase 3+ to extract facts
6. Cite per `03-citation-conventions.md`

---

## § FINANCE

## How to use this cheatsheet

1. Find your jurisdiction below
2. Open the listed regulator website + statute database
3. Use the search hints to find the specific law / regulation you need
4. Apply `regulator-research-workflow.md` Phase 3+ to extract the facts
5. Cite per `citation-conventions.md`

## Mongolia (pilot)

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Non-banking financial regulator | Санхүүгийн зохицуулах хороо (FRC) | https://www.frc.mn |
| Banking regulator | Монголбанк (Mongolbank) | https://www.mongolbank.mn |
| Central tax authority | Татварын ерөнхий газар (GASA) | https://gasa.gov.mn |
| FIU | Санхүүгийн мэдээллийн алба (FIU under FRC) | https://www.frc.mn |
| Data protection | (developing) | n/a |

### Statute database
- **Primary:** https://legalinfo.mn — Mongolian Official Legal Information Database (Cyrillic search; "Хайх")
- **Permanent law-detail URLs:** `https://legalinfo.mn/law/details/<ID>`

### Key statutes (search terms in Cyrillic)
- AML/CFT law → "Мөнгө угаах терроризм"
- Securities law → "Үнэт цаас"
- Investment fund law → "Хөрөнгө оруулалтын сан"
- Banking law → "Банкны"
- Insurance law → "Даатгал"
- Company law → "Компанийн"
- Tax (general) → "Татварын ерөнхий"

### FRC publication categories
- `/legal-regulations/` — Hierarchical list of FRC rules
- `/resolutions/` — Numbered FRC resolutions (Тогтоол)
- `/news/` — Press releases, announcements

### Language notes
- All official Mongolian text is in Cyrillic script. Verify your editor + DB support UTF-8.
- Official translations into English are rare for sub-statutory rules; commission translation OR find FATF Mongolia evaluation report for translated excerpts.

---

## EU (general)

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities | ESMA (European Securities and Markets Authority) | https://www.esma.europa.eu |
| Banking | EBA (European Banking Authority) | https://www.eba.europa.eu |
| Insurance | EIOPA (European Insurance and Occupational Pensions Authority) | https://www.eiopa.europa.eu |
| Data protection | EDPB (European Data Protection Board) | https://edpb.europa.eu |
| AML | National FIUs under AMLD; coordinated by EU FIU Platform | https://ec.europa.eu/info/policies/justice-and-fundamental-rights/criminal-justice/anti-money-laundering-and-counter-terrorist-financing_en |

### Statute database
- **EUR-Lex:** https://eur-lex.europa.eu — official portal for EU legislation
- **Permanent CELEX IDs:** `https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A<CELEX-ID>`

### Key directives + regulations
- MiFID II → Directive 2014/65/EU
- UCITS → Directive 2009/65/EC
- AMLD6 → Directive (EU) 2024/1640 (transposition deadline 2027-07-10)
- GDPR → Regulation (EU) 2016/679
- MiCA (crypto) → Regulation (EU) 2023/1114

### National regulators (member-state level)
| Country | Securities | Banking |
|---------|-----------|---------|
| Germany | BaFin (https://www.bafin.de) | Same |
| France | AMF (https://www.amf-france.org) | ACPR (https://acpr.banque-france.fr) |
| Italy | CONSOB (https://www.consob.it) | Bank of Italy (https://www.bancaditalia.it) |
| Spain | CNMV (https://www.cnmv.es) | Bank of Spain (https://www.bde.es) |
| Netherlands | AFM (https://www.afm.nl) | DNB (https://www.dnb.nl) |
| Ireland | Central Bank of Ireland (https://www.centralbank.ie) | Same |
| Luxembourg | CSSF (https://www.cssf.lu) | Same |

---

## US

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities | SEC (Securities and Exchange Commission) | https://www.sec.gov |
| Securities self-regulation | FINRA (Financial Industry Regulatory Authority) | https://www.finra.org |
| Banking (federal) | Federal Reserve | https://www.federalreserve.gov |
| Banking (national charter) | OCC (Office of the Comptroller of the Currency) | https://www.occ.treas.gov |
| Banking (deposit insurance) | FDIC | https://www.fdic.gov |
| FIU + AML | FinCEN (Financial Crimes Enforcement Network) | https://www.fincen.gov |
| Tax + IRS reporting | IRS | https://www.irs.gov |
| Privacy (federal commerce) | FTC + state AGs | https://www.ftc.gov |
| Privacy (California) | CPPA (California Privacy Protection Agency) | https://cppa.ca.gov |

### Statute database
- **govinfo.gov:** https://www.govinfo.gov — official US government information
- **US Code:** `https://www.govinfo.gov/app/collection/uscode/`
- **CFR (Code of Federal Regulations):** `https://www.govinfo.gov/app/collection/cfr/`
- **Federal Register:** https://www.federalregister.gov — rulemaking + comments

### Key statutes + rules
- Securities Act 1933 → 15 USC §§ 77a et seq.
- Investment Advisers Act 1940 → 15 USC §§ 80b-1 et seq.
- Investment Company Act 1940 → 15 USC §§ 80a-1 et seq.
- Bank Secrecy Act (BSA) → 31 USC §§ 5311-5332
- Patriot Act AML provisions → 31 USC §§ 5318 amendments
- Sarbanes-Oxley Act 2002 → 15 USC § 7201 et seq.
- Dodd-Frank Act 2010 → Pub. L. 111-203
- GLBA (privacy) → 15 USC §§ 6801-6809
- CCPA (California) → Cal. Civ. Code § 1798.100 et seq.

### SEC rules
- **Rules:** https://www.sec.gov/rules.shtml
- **Customer Protection Rule (15c3-3):** https://www.sec.gov/rules/15c3-3.shtml
- **Beneficial Owner Disclosure (FinCEN BOI 2024):** https://www.fincen.gov/boi

### FINRA
- **Rulebook:** https://www.finra.org/rules-guidance/rulebooks/finra-rules
- **Notices:** https://www.finra.org/rules-guidance/notices

---

## UK

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities + market conduct | FCA (Financial Conduct Authority) | https://www.fca.org.uk |
| Banking (prudential) | PRA (Prudential Regulation Authority, Bank of England) | https://www.bankofengland.co.uk/prudential-regulation |
| AML | NCA (National Crime Agency) + HMRC | https://www.nationalcrimeagency.gov.uk |
| Data protection | ICO (Information Commissioner's Office) | https://ico.org.uk |
| Tax + reporting | HMRC | https://www.gov.uk/government/organisations/hm-revenue-customs |

### Statute database
- **legislation.gov.uk:** https://www.legislation.gov.uk
- **Direct law URLs:** `https://www.legislation.gov.uk/<type>/<year>/<chapter>`

### Key statutes
- FSMA 2000 (Financial Services and Markets Act) → https://www.legislation.gov.uk/ukpga/2000/8
- POCA 2002 (Proceeds of Crime Act) → https://www.legislation.gov.uk/ukpga/2002/29
- MLR 2017 (Money Laundering Regulations 2017) → https://www.legislation.gov.uk/uksi/2017/692
- Data Protection Act 2018 → https://www.legislation.gov.uk/ukpga/2018/12
- UK GDPR → assimilated EU GDPR via DPA 2018
- Bribery Act 2010 → https://www.legislation.gov.uk/ukpga/2010/23

### FCA Handbook
- **Main:** https://www.handbook.fca.org.uk
- **CASS (Client Assets):** https://www.handbook.fca.org.uk/handbook/CASS/
- **SUP (Supervision):** https://www.handbook.fca.org.uk/handbook/SUP/

---

## Singapore

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Combined regulator (securities + banking + insurance) | MAS (Monetary Authority of Singapore) | https://www.mas.gov.sg |
| FIU | STRO (Suspicious Transaction Reporting Office under MAS) | https://www.police.gov.sg/about-us/organisational-structure/specialist-staff-departments/commercial-affairs-department |
| Data protection | PDPC (Personal Data Protection Commission) | https://www.pdpc.gov.sg |
| Tax | IRAS (Inland Revenue Authority of Singapore) | https://www.iras.gov.sg |

### Statute database
- **Singapore Statutes Online:** https://sso.agc.gov.sg
- **Direct: ** `https://sso.agc.gov.sg/Act/<ActID>`

### Key statutes
- Securities and Futures Act (SFA) 2001 → https://sso.agc.gov.sg/Act/SFA2001
- Financial Advisers Act (FAA) 2001 → https://sso.agc.gov.sg/Act/FAA2001
- Corruption, Drug Trafficking and Other Serious Crimes (Confiscation of Benefits) Act (CDSA) → https://sso.agc.gov.sg/Act/CDTOSCCBA1992
- MAS Notice on AML/CFT (for fund managers etc.) → https://www.mas.gov.sg (search "Notice SFA04-N02")
- PDPA → https://sso.agc.gov.sg/Act/PDPA2012

### MAS rulebook
- https://www.mas.gov.sg/regulation/rulebook

---

## Japan

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities + insurance + banking | JFSA (Financial Services Agency) | https://www.fsa.go.jp |
| FIU | JAFIC (Japan Financial Intelligence Center, under NPA) | https://www.npa.go.jp/sosikihanzai/jafic/ |
| Data protection | PPC (Personal Information Protection Commission) | https://www.ppc.go.jp |
| Tax | NTA (National Tax Agency) | https://www.nta.go.jp |

### Statute database
- **e-Gov:** https://elaws.e-gov.go.jp — Japanese official law database

### Key statutes
- Financial Instruments and Exchange Act (FIEA) — search "金融商品取引法" or "Act No. 25 of 1948"
- Act on Prevention of Transfer of Criminal Proceeds — search "犯罪収益移転防止法"
- Personal Information Protection Act — search "個人情報の保護に関する法律"

### Language notes
- Most JFSA publications are Japanese-only. English translations available for major statutes via Japanese Law Translation https://www.japaneselawtranslation.go.jp — note these are unofficial.

---

## India

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities | SEBI (Securities and Exchange Board of India) | https://www.sebi.gov.in |
| Banking | RBI (Reserve Bank of India) | https://www.rbi.org.in |
| Insurance | IRDAI (Insurance Regulatory and Development Authority) | https://www.irdai.gov.in |
| FIU | FIU-IND | https://fiuindia.gov.in |
| Data protection | DPB (Data Protection Board of India, under DPDPA 2023) | https://www.meity.gov.in |

### Statute database
- **India Code:** https://www.indiacode.nic.in — official statute repository

### Key statutes
- SEBI Act 1992 → search on India Code
- PMLA 2002 (Prevention of Money Laundering Act) → https://www.indiacode.nic.in
- DPDPA 2023 (Digital Personal Data Protection Act) → https://www.indiacode.nic.in
- Companies Act 2013

### SEBI regulations
- https://www.sebi.gov.in/legal/regulations.html

---

## Hong Kong

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities | SFC (Securities and Futures Commission) | https://www.sfc.hk |
| Banking | HKMA (Hong Kong Monetary Authority) | https://www.hkma.gov.hk |
| FIU | JFIU (Joint Financial Intelligence Unit) | https://www.jfiu.gov.hk |
| Data protection | PCPD (Office of the Privacy Commissioner for Personal Data) | https://www.pcpd.org.hk |

### Statute database
- **Hong Kong e-Legislation:** https://www.elegislation.gov.hk

### Key statutes
- SFO (Securities and Futures Ordinance, Cap. 571)
- AMLO (Anti-Money Laundering and Counter-Terrorist Financing Ordinance, Cap. 615)
- PDPO (Personal Data (Privacy) Ordinance, Cap. 486)

---

## Australia

### Regulators
| Role | Authority | URL |
|------|-----------|-----|
| Securities + corporate | ASIC (Australian Securities and Investments Commission) | https://asic.gov.au |
| Banking + insurance prudential | APRA (Australian Prudential Regulation Authority) | https://www.apra.gov.au |
| AML | AUSTRAC (Australian Transaction Reports and Analysis Centre) | https://www.austrac.gov.au |
| Data protection | OAIC (Office of the Australian Information Commissioner) | https://www.oaic.gov.au |
| Tax | ATO (Australian Taxation Office) | https://www.ato.gov.au |

### Statute database
- **Federal Register of Legislation:** https://www.legislation.gov.au

### Key statutes
- Corporations Act 2001
- Anti-Money Laundering and Counter-Terrorism Financing Act 2006
- Privacy Act 1988

---

## International standards bodies

| Body | Focus | URL |
|------|-------|-----|
| FATF (Financial Action Task Force) | AML/CFT standards | https://www.fatf-gafi.org |
| IOSCO (International Organization of Securities Commissions) | Securities markets | https://www.iosco.org |
| BIS (Bank for International Settlements) | Banking + Basel framework | https://www.bis.org |
| BCBS (Basel Committee on Banking Supervision) | Bank capital + liquidity | https://www.bis.org/bcbs/ |
| IFRS Foundation | IFRS accounting standards | https://www.ifrs.org |
| FASB (Financial Accounting Standards Board) | US GAAP | https://www.fasb.org |
| IFAC (International Federation of Accountants) | Auditing standards (ISAs) | https://www.ifac.org |
| Wolfsberg Group | Private banking AML | https://www.wolfsberg-principles.com |
| ISO | ISO 20022 financial messaging, ISO 27001 infosec | https://www.iso.org |

## Sanctions list sources

| List | URL |
|------|-----|
| UN Security Council Consolidated List | https://www.un.org/securitycouncil/content/un-sc-consolidated-list |
| OFAC SDN List (US) | https://sanctionslist.ofac.treas.gov |
| EU Consolidated List | https://www.sanctionsmap.eu |
| UK Sanctions List (OFSI) | https://www.gov.uk/government/publications/the-uk-sanctions-list |
| AUSTRAC / DFAT (Australia) | https://www.dfat.gov.au/international-relations/security/sanctions |
| Singapore MAS Sanctions | https://www.mas.gov.sg (under Regulations) |
| Mongolia (designated persons; under FRC + GIA) | https://www.frc.mn |

---

## § HEALTHCARE

### Authorities

| Role | EU | US | UK | Mongolia |
|------|-----|-----|-----|----------|
| Medicines regulator | EMA (European Medicines Agency) | FDA (Food and Drug Administration) | MHRA (Medicines and Healthcare products Regulatory Agency) | EMRA (Эрүүл мэндийн яам / Ministry of Health) |
| Health-data privacy | National DPA + EDPB (GDPR Art. 9) | HHS OCR (Office for Civil Rights — HIPAA enforcement) | ICO | (developing) |
| Clinical trials approval | EMA + national | FDA | MHRA + HRA | EMRA + Ethics Committee |
| Health-record electronic | National + eHealth interoperability | ONC (Office of the National Coordinator for HIT) | NHS Digital | EMRA HIS |

### Key statutes / regulations

- **US:**
  - HIPAA (Health Insurance Portability and Accountability Act) — 45 CFR Parts 160, 162, 164
  - HITECH Act (Health Information Technology for Economic and Clinical Health) — Pub. L. 111-5
  - 21 CFR Part 11 (electronic records + signatures)
- **EU:**
  - GDPR Art. 9 (special category data — health)
  - MDR (Medical Devices Regulation EU 2017/745)
  - IVDR (In Vitro Diagnostics Regulation EU 2017/746)
  - EHDS (European Health Data Space — proposal stage as of 2026)
- **UK:**
  - UK GDPR + DPA 2018
  - NHS Confidentiality Code
  - MHRA Good Practice Guides

### International standards
- WHO (World Health Organization): https://www.who.int
- ICH (International Council for Harmonisation of Technical Requirements for Pharmaceuticals for Human Use): https://www.ich.org
- ISO 13485 (medical device quality management): https://www.iso.org
- HL7 / FHIR (interoperability): https://www.hl7.org

---

## § GOVERNMENT / CYBERSECURITY

### Authorities

| Role | US | EU | UK | International |
|------|-----|-----|-----|---------------|
| Federal cybersecurity standards | NIST + CISA (Cybersecurity and Infrastructure Security Agency) | ENISA (European Union Agency for Cybersecurity) | NCSC (National Cyber Security Centre) | ISO + IEC |
| Federal cloud authorization | FedRAMP PMO (Program Management Office) — under GSA | (national cloud security programs) | UK GovTech | n/a |
| Federal IT systems | OMB + agency CIOs | National CIOs | GDS (Government Digital Service) | n/a |

### Key statutes / standards
- **US:**
  - FISMA (Federal Information Security Modernization Act) — 44 USC § 3551
  - FedRAMP — security authorization framework for federal cloud
  - NIST SP 800-53 Rev. 5 (security + privacy controls catalog)
  - NIST SP 800-171 (CUI — Controlled Unclassified Information)
  - NIST CSF (Cybersecurity Framework v2.0, 2024)
  - StateRAMP (state-government variant of FedRAMP)
  - CMMC (Cybersecurity Maturity Model Certification — DoD)
- **EU:**
  - NIS2 Directive (Network and Information Security Directive 2 — 2022)
  - CRA (Cyber Resilience Act 2024)
  - DORA (Digital Operational Resilience Act 2022)
- **UK:**
  - NIS Regulations 2018
  - UK Government Security Classifications Policy

### International standards
- ISO/IEC 27001 (Information Security Management Systems): https://www.iso.org/standard/27001
- ISO/IEC 27002 (Information Security Controls)
- ISO/IEC 27017 (Cloud Security)
- ISO/IEC 27018 (Cloud Privacy)
- SOC 2 (AICPA Trust Services Criteria)
- CSA STAR (Cloud Security Alliance)

### Key URLs
- FedRAMP: https://www.fedramp.gov
- NIST CSRC: https://csrc.nist.gov
- CISA: https://www.cisa.gov
- ENISA: https://www.enisa.europa.eu
- NCSC: https://www.ncsc.gov.uk

---

## § PRIVACY / DATA PROTECTION

### Authorities

| Role | EU | US | UK | Singapore | India | China | Brazil |
|------|-----|-----|-----|-----------|-------|-------|--------|
| Data protection regulator | EDPB + national (CNIL, BfDI, Garante, AEPD, etc.) | FTC + state AGs; CPPA (California) | ICO | PDPC | DPB (Data Protection Board) | CAC (Cyberspace Administration of China) | ANPD (Autoridade Nacional de Proteção de Dados) |
| Sectoral privacy | (sectoral per Member State) | HHS OCR (health); SEC (financial); CFPB (consumer) | (sectoral within ICO scope) | (sectoral within PDPC) | (sectoral) | CAC | ANPD |

### Key statutes
- **EU:** GDPR (Regulation 2016/679); ePrivacy Directive 2002/58/EC + pending ePrivacy Regulation
- **US:** CCPA + CPRA (California); state-by-state (VCDPA Virginia, CTDPA Connecticut, UCPA Utah, etc.); HIPAA (health); GLBA (financial); COPPA (children); CAN-SPAM
- **UK:** UK GDPR + Data Protection Act 2018; PECR (Privacy and Electronic Communications Regulations)
- **Singapore:** PDPA (Personal Data Protection Act 2012)
- **India:** DPDPA 2023 (Digital Personal Data Protection Act)
- **China:** PIPL 2021 (Personal Information Protection Law); DSL 2021 (Data Security Law)
- **Brazil:** LGPD (Lei Geral de Proteção de Dados — Law 13.709/2018)
- **Canada:** PIPEDA (Personal Information Protection and Electronic Documents Act) + provincial (Quebec Law 25, etc.)

### Key URLs
- EDPB: https://edpb.europa.eu
- CNIL: https://www.cnil.fr
- ICO: https://ico.org.uk
- CPPA (California): https://cppa.ca.gov
- PDPC (Singapore): https://www.pdpc.gov.sg
- ANPD (Brazil): https://www.gov.br/anpd

### Cross-border transfer mechanisms
- EU SCCs (Standard Contractual Clauses): https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en
- EU-US Data Privacy Framework: https://www.dataprivacyframework.gov
- UK IDTA: https://ico.org.uk (search "International data transfer agreement")

---

## § TAX

### Authorities

| Role | US | UK | EU member | Mongolia | International |
|------|-----|-----|-----------|----------|---------------|
| Income tax authority | IRS | HMRC | National (Bundeszentralamt für Steuern DE, Direction générale des Finances publiques FR, etc.) | GASA (Татварын ерөнхий газар) | OECD CTPA |
| Indirect tax (VAT/GST) | (state sales tax) | HMRC | National | GASA | OECD VAT/GST Guidelines |
| Transfer pricing | IRS (Treas. Reg. 1.482) | HMRC | National + OECD-aligned | GASA | OECD TP Guidelines |
| Tax treaty network | IRS + Treasury | HMRC + HM Treasury | National | GASA | OECD Model Tax Convention |

### Key statutes
- **US:** Internal Revenue Code (Title 26 USC); Treasury Regulations (Title 26 CFR)
- **UK:** ITA 2007, CTA 2010, TIOPA 2010
- **EU:** VAT Directive 2006/112/EC; ATAD 1 (2016/1164) + ATAD 2 (2017/952)
- **Mongolia:** Татварын ерөнхий хууль (General Tax Law); Аж ахуйн нэгжийн орлогын албан татварын тухай хууль; НӨАТ-ийн тухай хууль (VAT Law)

### International standards
- OECD Model Tax Convention on Income and on Capital
- OECD/G20 BEPS Action Plan (15 actions): https://www.oecd.org/tax/beps/
- UN Model Tax Convention: https://www.un.org/development/desa/financing/document/un-model-double-taxation-convention-between-developed-and-developing-countries
- Multilateral Instrument (MLI) for BEPS implementation

### Key URLs
- IRS: https://www.irs.gov
- HMRC: https://www.gov.uk/government/organisations/hm-revenue-customs
- OECD Tax: https://www.oecd.org/tax/
- GASA (Mongolia): https://gasa.gov.mn

---

## § LABOR / EMPLOYMENT

### Authorities

| Role | US | UK | EU | Mongolia |
|------|-----|-----|-----|----------|
| Labor standards | DOL (Department of Labor) | HSE + ACAS | National + EU Labour Authority | ХНХ (Хөдөлмөр нийгмийн хамгааллын яам) |
| Discrimination / equal opportunity | EEOC | EHRC | National + Equality Directives | ХНХ |
| Workplace safety | OSHA | HSE | EU-OSHA | МХЕГ (Мэргэжлийн хяналтын ерөнхий газар) |
| Social security | SSA | DWP | National | НДЕГ (Нийгмийн даатгалын ерөнхий газар) |

### Key statutes
- **US:** FLSA (Fair Labor Standards Act), Title VII Civil Rights Act, ADA, FMLA, ERISA
- **UK:** Employment Rights Act 1996, Equality Act 2010, Working Time Regulations
- **EU:** Working Time Directive, Posted Workers Directive, Whistleblower Protection Directive
- **Mongolia:** Хөдөлмөрийн тухай хууль (Labor Code)

### International standards
- ILO Conventions: https://www.ilo.org
- UN Guiding Principles on Business and Human Rights: https://www.ohchr.org/en/business

---

## § TELECOMMUNICATIONS

### Authorities

| Role | US | UK | EU | Mongolia |
|------|-----|-----|-----|----------|
| Telecoms regulator | FCC | Ofcom | BEREC + national (Bundesnetzagentur, ARCEP, AGCOM) | ХЗХ (Харилцаа холбооны зохицуулах хороо) |
| Spectrum allocation | FCC | Ofcom | National + EU coordination | ХЗХ |
| Privacy in telecoms | FTC + FCC | Ofcom + ICO | ePrivacy + GDPR | (developing) |

### Key statutes
- **US:** Communications Act 1934; Telecommunications Act 1996; CALEA (lawful intercept)
- **UK:** Communications Act 2003; Investigatory Powers Act 2016
- **EU:** European Electronic Communications Code (EECC Directive 2018/1972); ePrivacy

### International standards
- ITU (International Telecommunication Union): https://www.itu.int
- 3GPP (3rd Generation Partnership Project): https://www.3gpp.org

---

## § ENERGY (added briefly for completeness)

### Authorities
- US: FERC, NERC (reliability)
- UK: Ofgem
- EU: ACER (Agency for the Cooperation of Energy Regulators)
- Mongolia: ЭЗХ (Эрчим хүчний зохицуулах хороо)

### International
- IEA: https://www.iea.org
- IRENA: https://www.irena.org

---

## § INTERNATIONAL STANDARDS BODIES (cross-domain)

| Body | Domain focus | URL |
|------|--------------|-----|
| ISO | Quality, infosec, environment, many sectors | https://www.iso.org |
| IEC | Electrotechnical | https://www.iec.ch |
| ITU | Telecoms | https://www.itu.int |
| FATF | AML/CFT (finance) | https://www.fatf-gafi.org |
| IOSCO | Securities markets | https://www.iosco.org |
| BIS / BCBS | Banking (Basel) | https://www.bis.org |
| IFRS Foundation | Accounting | https://www.ifrs.org |
| WHO | Health | https://www.who.int |
| ICH | Pharma | https://www.ich.org |
| OECD | Tax, privacy, BEPS, governance | https://www.oecd.org |
| UN | Sanctions, human rights, environment | https://www.un.org |
| W3C | Web standards | https://www.w3.org |
| IETF | Internet protocols | https://www.ietf.org |
| NIST | US standards (cyber, crypto, AI) | https://www.nist.gov |

---

## § STATUTE DATABASES (per jurisdiction — universal across domains)

| Jurisdiction | Database | URL |
|--------------|----------|-----|
| Mongolia | legalinfo.mn | https://legalinfo.mn |
| EU | EUR-Lex | https://eur-lex.europa.eu |
| US | govinfo.gov + Federal Register | https://www.govinfo.gov, https://www.federalregister.gov |
| UK | legislation.gov.uk | https://www.legislation.gov.uk |
| Singapore | Singapore Statutes Online | https://sso.agc.gov.sg |
| Japan | e-Gov | https://elaws.e-gov.go.jp |
| India | India Code | https://www.indiacode.nic.in |
| Hong Kong | HK e-Legislation | https://www.elegislation.gov.hk |
| Australia | Federal Register of Legislation | https://www.legislation.gov.au |
| Canada | Justice Laws Website | https://laws-lois.justice.gc.ca |
| Germany | Gesetze im Internet | https://www.gesetze-im-internet.de |
| France | Légifrance | https://www.legifrance.gouv.fr |

(For other jurisdictions, search "<country> official statute database" or "<country> legal information system".)

---

## How to keep this cheatsheet current

- This cheatsheet is a STARTING POINT. URLs + authority names change.
- Re-verify URLs annually or when running R4 for a jurisdiction.
- If a URL breaks, search "<jurisdiction> <authority name>" + open the official current page.
- New domains: contribute back via PR / issue.

## Worked examples per domain

| Domain | Worked example location |
|--------|------------------------|
| Finance | `overlays/finance-accounting/research-examples/01-frc-investment-fund-regulation.md`, `02-mongolia-aml-law-research.md`, `03-retention-research-cross-jurisdiction.md`, `04-mongolia-lending-research.md` |
| Healthcare | (future overlay) |
| Government / FedRAMP | (future overlay) |
| Privacy / GDPR | (future overlay) |
| Tax | (future overlay) |

## Next

→ Apply the 6-phase workflow per `01-regulatory-research-workflow.md`
→ For finance worked examples, see `overlays/finance-accounting/research-examples/`
