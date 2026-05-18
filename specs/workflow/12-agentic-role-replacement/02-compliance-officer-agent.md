---
doc: workflow/12-agentic-role-replacement/02-compliance-officer-agent
type: workflow-agent-pattern
phase: agentic-role-replacement
version: 1.0.0
status: stable
last_updated: 2026-05-18
human_role_replaced: Compliance Officer
coverage_estimate: 60-70%
---

# Compliance Officer Agent

> Solo dev-д compliance officer байхгүй ердийн. Lawyer-ыг quarterly ажиллуулна гэхэд material decision-ийг үе тутамд handle хийх юм. AI agent **first-line filter** + ongoing compliance monitoring role-ыг гүйцэтгэх боломжтой.

## Human role хийдэг

| Үүрэг | Frequency | Time |
|-------|-----------|------|
| AML/CFT compliance monitoring | Daily | 1-2h |
| STR/CTR review queue triage | Daily | 30 min |
| KYC tier upgrade approval | Weekly | 1h |
| Audit response preparation | Annual + on-demand | 5-40h |
| Regulator inquiry response | Ad-hoc | 5-100h |
| Internal compliance review | Quarterly | 8-16h |
| Sanctions screening QA | Weekly | 1h |
| Material decision sign-off | Ad-hoc | 30 min - 2h |
| New jurisdiction expansion review | Per market | 20-80h |

Total: ~10-20h/week for active compliance officer.

## Agent coverage breakdown

| Sub-role | Agent coverage | Pattern |
|----------|:--------------:|---------|
| AML monitoring (alerts) | 75% | R5-style continuous scan |
| Filing queue triage | 70% | Automated category + priority |
| KYC tier upgrade review | 55% | Doc check; human approve final |
| Audit response prep | 50% | First-draft documentation; lawyer review |
| Sanctions screening QA | 80% | Match validation; false-positive filter |
| Material decision sign-off | 30% | Agent advisory; human + lawyer decide |
| Jurisdiction expansion | 65% | R4 research; lawyer for final |

## Pattern A: Daily compliance monitoring agent

### Dispatch (CI / cron)

```yaml
# .github/workflows/compliance-daily.yml
on:
  schedule:
    - cron: '0 7 * * *'  # 7am UTC daily

jobs:
  compliance-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Dispatch compliance monitoring agent
        run: |
          claude-agent dispatch \
            --prompt-file .github/agent-prompts/compliance-daily.md \
            --output compliance-daily.md
      - name: Post if critical findings
        if: contains(compliance-daily.md, '🚨')
        run: |
          # Slack notify
          curl -X POST $SLACK_WEBHOOK -d "@compliance-daily.md"
```

### Agent prompt

```markdown
# .github/agent-prompts/compliance-daily.md

You are a compliance officer agent doing daily monitoring. Project uses ZeeSpec
with finance-accounting overlay.

Today's checks:

1. **CTR filing queue:** count ctr_filing rows with status=PENDING_REVIEW
   created > 4 business days ago. List by customer + amount.

2. **STR filing queue:** count str_filing rows with status=DRAFT created
   > 12 hours ago (12h warning before 24h SLA breach). List with typology.

3. **Sanctions list freshness:** check sanctions_list_version.last_fetched
   for each source (UN, OFAC, EU, MN). Alert if > 36h stale.

4. **Aged reconciliation breaks:** count reconciliation_break rows with
   status=OPEN aged > 3 days. List by subledger + amount.

5. **Customer freeze cascade verification:** for any customer with
   sanctions_screening_hit (status=FROZEN), verify wallet.status=FROZEN.
   Alert on inconsistency.

6. **Daily CTR aggregation check:** sum cash transactions per customer per
   day; alert if any customer crossed CTR threshold (20M MNT) but no
   ctr_filing created.

Output format:

🚨 CRITICAL (action today):
- [item]: [details]

⚠️ WARNING (action this week):
- [item]: [details]

✅ NORMAL:
- [count]: [summary]

Keep under 500 words.
```

### Solo dev integration

Daily email/Slack notification → 5 min check before standup → urgent items addressed.

## Pattern B: STR/CTR drafting assistant

When typology engine flags suspicious transaction OR cash > threshold:

### Dispatch (event-driven)

```javascript
Agent({
  description: "Draft STR/CTR for compliance review",
  prompt: `You are a compliance officer agent drafting an STR for review.

Trigger: [SMURFING_PATTERN | HIGH_RISK_GEO | VELOCITY_ANOMALY | etc.]
Customer ID: ...
Related transactions: ...

Per workflow/07-r4-regulatory-research/citation-conventions.md + Mongolia
AML/CFT Law Art. 13.

Draft an STR submission with:
1. Customer info (Sanitized)
2. Transaction details + amounts
3. Suspicion analysis (which typology + why)
4. Counterparty info
5. Source funds (if known)
6. Recommended action (FREEZE / CONTINUE / OTHER)

Output: STR draft + compliance officer review checklist.`,
})
```

### Solo dev review pattern

1. Agent drafts STR (5-10 min)
2. Solo dev reviews + edits (15-30 min)
3. Sign + file to FIU (15 min)
4. Audit log entry per HW-FIN-03

Saves 60-90 min per STR vs from-scratch. Agent is first-draft, not final.

## Pattern C: KYC tier upgrade reviewer

When customer requests TIER_BASIC → TIER_FULL upgrade:

```javascript
Agent({
  description: "Review KYC tier upgrade for [customer]",
  prompt: `You are a compliance officer agent reviewing TIER_BASIC → TIER_FULL
upgrade for customer [ID].

Verify per workflow/07-r4-regulatory-research/06-re-validation-strategy.md +
finance-accounting/modules/kyc-aml/MODULE-OVERVIEW.md:

1. Doc completeness:
   - ID (front + back): valid + machine-readable? Expired?
   - Selfie: liveness check passed?
   - Proof of address: < 3 months old?
   - Source of funds: documented + plausible?

2. Sanctions re-screen: most recent screen < 7 days?

3. PEP check: any new flag since onboarding?

4. UBO (if legal entity): chain traversed to natural persons?

5. Risk score: any red flags requiring EDD instead?

Output:
- ✅ APPROVE for TIER_FULL
- ⚠️ NEED INFO (specify what)
- 🚨 REJECT (specify reason)
- 🟠 ESCALATE TO HUMAN COMPLIANCE OFFICER (high risk; ambiguous)

Include 1-paragraph rationale.`,
})
```

Solo dev integration: agent recommendation + human accept/reject. 5 min vs 30-60 min full manual review.

## Pattern D: Audit response preparation

Regulator inquiry / annual audit:

```javascript
Agent({
  description: "Prepare audit response for [inquiry topic]",
  prompt: `You are a compliance officer agent preparing audit response.

Regulator: [FRC / SEC / ESMA / etc.]
Inquiry topic: [e.g., "Show audit trail for journal #X" OR "List CTR transactions last 90 days"]
Date range: [from] - [to]

Steps:
1. Query relevant database tables (provide SQL)
2. Extract supporting documents (per HW-FIN-22 retention)
3. Cross-reference ZeeSpec invariants that govern (cite INV-MOD-NN)
4. Identify any gaps (where evidence missing or weak)
5. Recommend lawyer review on gaps

Output:
- Response draft (audit-ready format)
- Evidence package (file list)
- Gap analysis (what's missing)
- Lawyer-review-required items`,
})
```

Solo dev pattern: agent prepares first-draft → lawyer reviews → submit.

Saves 70%+ of audit-response time vs from-scratch.

## Pattern E: Sanctions screening QA

Sanctions hit detected (low confidence):

```javascript
Agent({
  description: "Validate sanctions match for [customer]",
  prompt: `You are a compliance agent validating sanctions screen hit.

Customer: [name, DOB, nationality]
Hit: [sanctioned person name + list]
Match score: [percentage]

Validate:
1. Name match quality (transliteration; common name; etc.)
2. DOB match
3. Nationality consistency
4. Other identifying attributes
5. Negative news check (any recent legal/criminal coverage?)

Output:
- ✅ FALSE POSITIVE (common name; different person; clear)
- 🚨 TRUE HIT (genuine match; freeze + file STR)
- 🟠 AMBIGUOUS (human compliance officer must decide)`,
})
```

Saves 10-15 min per sanctions hit. Solo dev sees agent recommendation; quick approve for clear cases.

## Pattern F: New jurisdiction expansion

When expanding to new market:

```javascript
Agent({
  description: "Compliance assessment for [country] expansion",
  prompt: `You are a compliance agent assessing [country] expansion for our
[product type]. Per workflow/07-r4-regulatory-research/.

Research:
1. Primary regulator(s) for our activity
2. Licensing requirement
3. Capital requirement
4. AML/CFT framework (CTR threshold; STR deadline; retention)
5. KYC tier model
6. Sanctions list sources
7. Data residency / privacy
8. Tax/withholding for our flows
9. Material differences from current jurisdictions

Use R4 6-phase methodology. Tier 1 sources only for binding facts.

Output:
- Compliance gap assessment
- Effort estimate (months to launch readiness)
- Lawyer-review-required items
- Recommended next steps`,
})
```

Sole replaces ~80h of compliance research with ~4-6h agent + ~10-20h human follow-up + ~10h lawyer.

## Pattern G: Material decision sign-off (advisory only)

When solo dev faces material compliance decision:

```javascript
Agent({
  description: "Compliance advisory: should we [decision]?",
  prompt: `You are a compliance advisory agent (NOT decision-maker).

Decision under consideration: [describe]

Provide:
1. Regulatory citation analysis (Tier 1 sources only)
2. Risk assessment (criminal / civil / reputational)
3. Industry precedent (similar decisions by peers)
4. Alternative paths
5. RECOMMENDATION: PROCEED / PAUSE / SEEK LAWYER / REJECT

CRITICAL CONSTRAINTS:
- You DO NOT make legal decisions
- Material decisions REQUIRE lawyer review
- Provide structured analysis; recommend human action`,
})
```

Solo dev pattern:
1. Agent advisory (15 min)
2. 24h cool-off
3. If material → lawyer hour ($200-500)
4. Decision made + documented as ADR

## Limitations + escalation

Compliance agent CANNOT:

- ❌ Provide legal advice (Anthropic-disclaimer applies)
- ❌ Sign documents on your behalf
- ❌ Negotiate with regulator
- ❌ Make criminal-liability decisions alone
- ❌ Know about pending regulator inspections in your jurisdiction
- ❌ Replace bar-licensed lawyer for material compliance

### Mandatory escalation triggers

| Trigger | Escalate to |
|---------|-------------|
| Any P0 compliance finding | Lawyer (same week) |
| Suspected criminal liability | Lawyer immediately |
| Regulator written inquiry | Lawyer (24h) |
| Material monetary impact ($X+ in your jurisdiction) | Lawyer + accountant |
| Cross-jurisdiction conflict | Specialist (multi-jurisdiction lawyer) |
| New jurisdiction expansion | Local counsel |
| Aged sanction-hit unresolved > 24h | Lawyer + human compliance |

## Cost / time summary

| Pattern | Cost / dispatch | Time saved vs manual |
|---------|:----------------:|----------------------|
| Daily monitoring | $0.50-1 | 30-60 min |
| STR/CTR drafting | $1-2 | 60-90 min |
| KYC tier review | $0.50-1 | 25-55 min |
| Audit response | $2-5 | 4-30h (per inquiry) |
| Sanctions QA | $0.30-0.50 | 10-15 min per hit |
| Jurisdiction expansion | $5-15 | 60-80h (research portion) |
| Material decision advisory | $1-3 | 30-60 min first-pass |
| **Monthly (active solo)** | **~$20-50** | **15-30h equivalent saved** |

Plus quarterly lawyer ($500-1000): total compliance budget ~$2,500-4,000/year.

vs. full-time compliance officer: $80,000-150,000/year. Cost reduction = ~95%.

But coverage = ~60-70%. **For 30-40% you still need lawyer + your own judgment**.

## Anti-patterns

### Anti-pattern 1 — Agent as compliance officer (instead of advisor)

**Symptom:** "Agent said it's fine; we're compliant."

**Fix:** Agent = advisor. Final compliance position = your judgment + lawyer.

### Anti-pattern 2 — Skip lawyer "because agent did it"

**Symptom:** Material decision; agent reviewed; no lawyer.

**Fix:** Mandatory escalation triggers above. Lawyer for material.

### Anti-pattern 3 — Daily monitoring then nothing

**Symptom:** Agent finds issues; solo dev ignores.

**Fix:** Daily monitoring useless without daily action. If you can't act daily, switch to weekly.

### Anti-pattern 4 — STR/CTR rubber-stamp

**Symptom:** Agent drafts STR; solo dev files without read.

**Fix:** Even if agent perfect, read + verify per CTR/STR liability standards.

### Anti-pattern 5 — Audit response submitted without lawyer

**Symptom:** Regulator inquiry; agent drafts; solo submits.

**Fix:** ANY regulator response = lawyer review. No exceptions.

## Cross-references

- `00-START-HERE.md` — agentic replacement overview
- `01-reviewer-agents.md` — R2 sub-role
- `workflow/07-r4-regulatory-research/` — R4 + research methodology
- `overlays/finance-accounting/prompts/R2-financial-reviewer.md` — finance R2
- `08-limitations-and-escalation.md` — escalation patterns

## Next

→ `03-architect-agent.md` — Architectural decisions
→ `08-limitations-and-escalation.md` — When to escalate
