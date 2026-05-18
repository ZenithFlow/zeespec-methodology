---
doc: overlays/finance-accounting/glossary/finance-glossary
type: glossary
overlay: finance-accounting
version: 0.1.0
status: experimental
last_updated: 2026-05-18
---

# Finance & Accounting Glossary

> ~100 terms covering double-entry accounting, IFRS framework, FRC compliance, AML/KYC, settlement, fund management. Use as overlay-wide vocabulary; module-specific terms live in each module's `glossary.md`.

## A

**Accrual basis** — Accounting method recording economic events when they occur, not when cash changes hands. Opposite of cash basis. Required by IFRS + most regulatory frameworks for fund accounting.

**Account** — Bucket in the Chart of Accounts. Has a type (asset/liability/equity/revenue/expense) determining normal balance direction.

**AML** — Anti-Money Laundering. Set of laws + practices to detect + prevent money laundering. Mongolia: AML/CFT law 2013.

**AML/CFT** — AML + Countering the Financing of Terrorism (combined regulatory regime).

**AUM** — Assets Under Management. Total market value of assets a fund manager handles. Drives management fee base.

**Audit log** — Append-only record of system mutations. Captures actor, time, before/after, reason, correlation_id.

**Audit trail** — End-to-end chain of records showing who did what, when, why. Built from audit logs.

## B

**Base currency** — Organization's reporting currency. All multi-currency journals balance in base currency.

**Beneficial owner** — Natural person who ultimately owns or controls an entity. UBO threshold typically ≥25%.

**Bid/Ask spread** — Difference between buy (ask) and sell (bid) price; market microstructure cost.

**Bond** — Debt instrument with fixed/variable coupon payments + principal at maturity.

**Book value** — Asset/liability value per accounting records; may differ from market value.

**BR** — Business Rule. ZeeSpec convention for documented business requirement.

## C

**Cash basis** — Accounting recording cash receipts/payments. Not IFRS-compliant for most regulated entities.

**CDD** — Customer Due Diligence. Standard KYC required for all customers.

**Chart of Accounts (CoA)** — Hierarchical structure of accounts; backbone of GL.

**Clearing** — Process between trade execution and settlement; counterparties confirm + reconcile.

**Closing entry** — Journal posted at period-end transferring P&L balances to Retained Earnings.

**Compliance officer** — Role responsible for AML/KYC monitoring, STR/CTR filing, regulator liaison.

**Conservatism / Prudence** — IFRS framework principle: don't overstate assets/revenue; don't understate liabilities/expenses.

**Consolidation** — Combining financials of parent + subsidiary into one set of statements.

**Control account** — GL account that summarizes a subledger (e.g., "Customer Funds — Operating" rolls up all wallet balances).

**Controller** — Role responsible for accounting accuracy, period close, regulator-facing financials sign-off.

**Correlation ID** — UUID propagated through all layers of a request for traceability.

**Coupon** — Periodic interest payment on a bond.

**Credit** — Side of journal entry. Increases liability/equity/revenue; decreases asset/expense.

**CTR** — Cash Transaction Report. Required filing for cash transactions ≥ threshold. Mongolia: 20M MNT.

**Custodian** — Third party holding securities/assets on behalf of investors. Regulated separately.

**Cutoff date** — Date determining which period a transaction belongs to.

**Cutoff time** — Daily deadline after which transactions move to next business day.

## D

**Day-count convention** — Convention for counting days in interest/fee calculation: Actual/Actual, Actual/360, Actual/365, 30/360, etc. Critical to align with counterparties.

**Debit** — Side of journal entry. Increases asset/expense; decreases liability/equity/revenue.

**Deferred revenue** — Liability: cash received before performance obligation satisfied. Recognized as revenue when earned.

**Depreciation** — Systematic allocation of fixed asset cost over useful life. Posted as expense at period-end.

**Derivative** — Financial instrument deriving value from an underlying asset (option, future, swap).

**Discount rate** — Rate used to convert future cash flows to present value.

**Diversification** — Reducing risk by spreading investments across assets/classes.

**Double-entry** — Accounting model where every transaction has at least 2 equal+opposite entries.

**DPDPA** — Digital Personal Data Protection Act (India 2023).

**Due diligence** — Investigation/verification process; in context: KYC/AML CDD/EDD.

## E

**EDD** — Enhanced Due Diligence. Extended KYC for higher-risk customers (PEPs, high-volume, high-risk jurisdictions).

**Equity** — Owner's residual claim on assets after liabilities. = Assets - Liabilities.

**EOD** — End-of-Day. Daily batch window for reconciliation, snapshots, retention.

**ESMA** — European Securities and Markets Authority. EU-wide securities regulator.

**ETF** — Exchange-Traded Fund. Investment fund traded on stock exchanges.

## F

**FATF** — Financial Action Task Force. International AML/CFT standard-setter.

**FCA** — Financial Conduct Authority (UK regulator).

**FIFO** — First-In-First-Out. Inventory/holdings cost basis method.

**FinCEN** — Financial Crimes Enforcement Network (US BSA regulator + FIU).

**FINRA** — Financial Industry Regulatory Authority (US broker-dealer regulator).

**Fiscal period** — Defined time range (month/quarter/year) for accounting summarization.

**FIU** — Financial Intelligence Unit. Receives STR/CTR filings.

**FRC** — Санхүүгийн зохицуулах хороо / Financial Regulatory Commission (Mongolia non-banking regulator).

**FX (Foreign Exchange)** — Currency conversion + the market for converting currencies.

**FX gain/loss** — P&L account for currency translation differences (realized + unrealized).

**FX revaluation** — Period-end re-pricing of foreign-currency monetary items at spot rate (per IAS 21).

## G

**GAAP** — Generally Accepted Accounting Principles. US accounting standards (vs IFRS internationally).

**GDPR** — General Data Protection Regulation (EU privacy law).

**GL** — General Ledger. System of record for all financial transactions.

**Going concern** — IFRS assumption that entity continues operating into foreseeable future.

## H

**HIPAA** — Health Insurance Portability and Accountability Act (US healthcare privacy law).

**High-water mark (HWM)** — Highest historical NAV per share; performance fee charged only on excess above HWM.

**Holding** — Quantity of a security owned at a point in time.

## I

**IAS** — International Accounting Standards (older designation; replaced by IFRS for new standards).

**IFRS** — International Financial Reporting Standards. Issued by IFRS Foundation. Adopted in 140+ countries.

**Idempotency** — Property where repeating an operation yields same result. Critical for retryable API calls.

**Idempotency key** — Client-supplied identifier (often correlation_id) preventing duplicate execution on retry.

**Impairment** — Reduction in carrying value when fair value < book value (IFRS 9 / IAS 36).

**Initial Margin** — Collateral required to open a derivative position.

**Interest accrual** — Recognition of interest earned/owed over time before cash payment (accrual basis).

**Intercompany** — Transactions between entities in same corporate group; eliminate on consolidation.

**IOSCO** — International Organization of Securities Commissions.

## J

**JFSA** — Japan Financial Services Agency.

**Journal** — Record of a financial transaction in the GL. Header + lines.

**Journal line** — Single debit or credit entry within a journal.

**Journal entry** — Synonym for journal (sometimes used to mean a single line, sometimes the full journal — disambiguate per context).

## K

**KMS** — Key Management Service (cloud-provider service for encryption key management; AWS KMS, GCP KMS, Azure Key Vault).

**KYC** — Know Your Customer. Identity verification.

**KYC tier** — Verification level. Mongolia pilot: TIER_0 → TIER_BASIC → TIER_FULL → TIER_EDD; TIER_REFUSED.

## L

**Layering** — AML typology: complex web of transactions to obscure origin of illicit funds.

**Leaf account** — CoA account with no children; only leaf accounts referenced by journal lines.

**Liability** — Obligation to transfer economic benefit. Normal balance: CREDIT.

**Liquidity** — Ability to convert asset to cash quickly without significant price impact.

**Loss given default (LGD)** — Expected loss when counterparty defaults; component of credit risk.

## M

**MAS** — Monetary Authority of Singapore.

**Materiality** — Threshold determining if an item warrants attention. Below: aggregate/ignore; above: 🚨.

**MiFID II** — Markets in Financial Instruments Directive II (EU 2014/65/EU). Securities market regulation.

**Money type** — Application-level Decimal + ISO 4217 currency code pairing; never float for money.

**Money laundering** — Process of disguising illicit funds as legitimate. Stages: placement → layering → integration.

**Mutual fund** — Pooled investment vehicle managed by fund manager; investors hold shares/units representing pro-rata claim on portfolio.

## N

**NAV (Net Asset Value)** — Total Assets - Total Liabilities of a fund. Computed daily.

**NAV per share** — NAV / Shares Outstanding. Price at which investors subscribe/redeem.

**Negative balance** — Asset account balance below zero; typically blocked except with overdraft authorization.

**Normal balance** — Side (DEBIT or CREDIT) on which an account naturally increases.

## O

**OFAC** — Office of Foreign Assets Control (US sanctions enforcer; maintains SDN list).

**Opening entry** — Period-start journal carrying forward balances or recording initial capital.

**Outbox pattern** — Atomic write of event row + main DB write; async worker drains + publishes. Avoids 2PC; at-least-once delivery.

## P

**Performance fee** — Fee on returns above benchmark/HWM. Typically 20% above HWM in finance.

**Period close** — Workflow transitioning period OPEN → SOFT_CLOSED → CLOSED. Blocks new postings; takes snapshots; triggers regulatory submissions.

**PEP (Politically Exposed Person)** — Holds prominent public function or close associate. Requires EDD + STR review for large transactions.

**P&L** — Profit & Loss statement. Revenue - Expense over a period.

**Portfolio** — Collection of investments held by a fund or investor.

**Posting** — Act of committing a journal to the GL.

**Posting date** — Date assigned to a journal entry for period/reporting purposes.

**Provisions** — Liabilities of uncertain timing/amount (IAS 37). E.g., warranty provision, restructuring provision.

## Q

**Quarter-end** — Period boundary for quarterly close + reporting.

## R

**Realized gain/loss** — Gain/loss recognized in P&L upon disposal of asset.

**Reconciliation** — Comparing two sources of truth to confirm agreement (e.g., bank statement vs internal records; subledger vs GL).

**Reconciliation break** — Discrepancy found during reconciliation > materiality threshold.

**Redemption** — Investor's request to sell back fund shares for cash.

**Reopen** — Controller action transitioning a CLOSED period back to OPEN. Audit-logged; often triggers regulator disclosure.

**Retained earnings** — Equity account holding cumulative net income not paid out as dividends.

**Reversing entry** — New journal that exactly negates a prior journal. Used for corrections per immutability rule.

**Risk-weighted asset (RWA)** — Asset value adjusted for credit/market/operational risk (banking; Basel framework).

## S

**SAR** — Suspicious Activity Report (US synonym for STR).

**Sanctions** — Government-imposed restrictions on financial dealings with designated persons/entities.

**Sanctions list** — UN, OFAC, EU, national designated-persons list. Refresh daily.

**SDN** — Specially Designated Nationals (OFAC's primary sanctions list).

**SEC** — Securities and Exchange Commission (US securities regulator).

**SEBI** — Securities and Exchange Board of India.

**Settlement** — Final transfer of money/securities between counterparties to complete a transaction.

**Settlement cycle (T+N)** — Time from trade date (T) to settlement (T+N business days). Equities: typically T+2.

**Sharia compliance** — Adherence to Islamic finance principles (no interest, no prohibited activities); relevant where applicable.

**SoD** — Segregation of Duties. Control requiring different actors for sensitive workflow steps.

**SOX** — Sarbanes-Oxley Act (US 2002). Includes 7-year retention for public-company records.

**Smurfing** — AML typology: breaking large transaction into multiple sub-threshold ones to avoid CTR.

**Source of funds** — Documentation of where customer money originates. Required for TIER_FULL.

**Spot rate** — Current FX rate for immediate settlement.

**STR** — Suspicious Transaction Report. Filed within 24h of suspicion. Mongolia + most non-US jurisdictions.

**Subledger** — Specialized ledger summarizing into GL control account (wallet, AR, AP).

**Suitability** — Investment matching customer's risk profile + objectives (regulatory requirement in many jurisdictions).

**System actor** — Non-user account for automated jobs (e.g., `system.eod`). Satisfies audit identity without sentinels.

## T

**T+0, T+1, T+2** — Settlement cycle notation. T = trade date; T+N = settlement N business days later.

**Tax withholding** — Tax deducted at source (e.g., 10% withholding on investment income).

**Trial balance** — List of all account balances asserting sum(DR) = sum(CR). Run after every batch + at period-end.

**Trust account** — Bank account holding client funds segregated from firm's operating account.

**Typology** — Pattern of activity recognized as potential ML/TF (smurfing, round-trip, layering, etc.).

## U

**UBO** — Ultimate Beneficial Owner. Natural person ultimately owning/controlling ≥25% of legal-entity customer.

**UCITS** — Undertakings for Collective Investment in Transferable Securities (EU retail-fund regulation).

**Unrealized gain/loss** — Gain/loss in market value not yet realized (asset still held).

## V

**Valuation** — Process of determining current fair value of an asset.

**VaR (Value at Risk)** — Statistical measure of potential loss at given confidence level over given horizon.

**VAT** — Value Added Tax. Often borne by buyer; collected + remitted by seller.

**Velocity anomaly** — AML typology: sudden spike in transaction volume vs customer baseline.

## W

**Withholding tax** — See "Tax withholding."

**Working day / Business day** — Day on which the market/banks are open (excludes weekends + holidays per jurisdiction calendar).

## Y

**Yield** — Income from investment expressed as percentage (interest/dividend/return).

**Year-end** — Annual fiscal period boundary. Triggers annual close + audit.

## Mongolian-language synonyms (FRC context)

| English | Mongolian |
|---------|-----------|
| Financial Regulatory Commission | Санхүүгийн зохицуулах хороо (СЗХ) |
| Anti-Money Laundering | Мөнгө угаах эсрэг арга хэмжээ |
| Beneficial Owner | Үнэн ашиг хүртэгч |
| Cash Transaction Report | Бэлэн мөнгөний гүйлгээний мэдээлэл |
| Suspicious Transaction Report | Сэжигтэй гүйлгээний мэдээлэл |
| Know Your Customer | Үйлчлүүлэгчээ таних |
| Fund Manager | Сангийн менежер |
| Investment Fund | Хөрөнгө оруулалтын сан |
| Net Asset Value | Цэвэр хөрөнгийн үнэлгээ |
| Custodian | Хөрөнгө хадгалагч |
| General Ledger | Ерөнхий дэвтэр |
| Journal | Журнал |
| Chart of Accounts | Дансны кодын жагсаалт |
| Period Close | Тайлант үе хаах |

## Cross-references

- `principles/accounting-principles.md` — full conceptual framework for accounting terms
- `principles/regulatory-compliance.md` — FRC + AML/CFT regulatory terms in context
- Per-module `glossary.md` — module-specific extensions
