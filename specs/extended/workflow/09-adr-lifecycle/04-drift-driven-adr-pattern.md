---
doc: extended/workflow/09-adr-lifecycle/04-drift-driven-adr-pattern
type: workflow-method
phase: adr-lifecycle
version: 1.0.0
status: stable
last_updated: 2026-05-18
---

# Drift-Driven ADR Pattern — When Drift Detection Produces ADRs

> **The link between Code Drift Management (workflow 08) and ADR Lifecycle (workflow 09).** Code that drifted from spec often embodies an UNDOCUMENTED design decision. This pattern converts that drift into a retroactive ADR — legitimizing the new reality.

## The pattern in one sentence

> Type 3-design + Type 4 drift findings (per `extended/workflow/08-code-drift-management/02-drift-categorization.md`) trigger retroactive ADR creation; the ADR documents WHY the change happened; spec updates align with the new design.

## When this pattern applies

Drift type | ADR needed?
---|---
**Type 1** (citation) | NO — mechanical fix; no decision involved
**Type 2** (field/enum, no invariant) | NO — pure data addition
**Type 2b** (field/enum, new invariant) | MAYBE — if design decision was material
**Type 3-bug** (behavioral, bug) | NO — code restored to match spec; spawn chip
**Type 3-design** (behavioral, intentional) | YES — retroactive ADR captures the change
**Type 4** (architectural) | YES (always) — major structural decision must be documented

## Why retroactive ADRs are valid

Ideal world: ADR written BEFORE code change. Reality: engineers ship features; ADRs don't always happen first.

Retroactive ADRs are NOT inferior:
- They capture the same WHY as proactive ADRs
- They document what actually happened (not aspirational)
- They prevent future re-questioning ("why did we do it this way?")
- They restore spec authority

**The discipline:** when drift detection surfaces a Type 3-design or Type 4 change, write the ADR THEN. Don't let undocumented decisions accumulate.

## The pipeline

```
[Code drift detection (workflow 08)]
    ├── R5 agent scan OR
    ├── CI/PR-time scan OR
    └── Scheduled review
        ↓
    [Findings categorized]
        ├── Type 1/2 → spec edit (workflow 08 recipe T1/T2)
        ├── Type 3-bug → spawn chip (workflow 08 recipe T3-bug)
        └── Type 3-design + T4 → THIS PATTERN
                ↓
        [Investigate the change]
            ├── Read git blame for the code change
            ├── Read PR description
            ├── Talk to PR author if available
            └── Understand intent + alternatives considered (even informally)
                ↓
        [Draft retroactive ADR]
            ├── Use R6 agent OR write manually
            ├── Format per workflow/09/01-adr-format-template.md
            ├── ID: ADR-<MOD>-NNN (next sequence)
            ├── Status: Proposed
            └── Note "Retroactive — codifying change introduced in PR #XXX on YYYY-MM-DD"
                ↓
        [Review + accept]
            ├── PR author signs off (confirms intent captured correctly)
            ├── Tech lead / architect reviews
            ├── Status → Accepted
                ↓
        [Update spec to align]
            ├── Update INV/HW that the ADR affects
            ├── Update how.md / what.md / where.md as needed
            ├── Note in CLAUDE.md ADR table
            └── Mark drift item RESOLVED in CLAUDE.md drift table
                ↓
        [Drift legitimized]
            └── Spec now reflects reality; ADR captures WHY
```

## Worked example — Type 3-design drift

### Scenario

Drift scan (R5 agent) found this in the `wallet` module:

> Spec INV-WAL-02: "Customer must have KYC tier FULL before creating wallet."
> Code reality: WalletService.createWallet() accepts TIER_BASIC and TIER_FULL.

### Step 1 — Investigate

```bash
# Find the change
git log --all --oneline -- backend/src/Wallet/WalletService.php | head -20

# Identify the PR
git blame backend/src/Wallet/WalletService.php | grep -A 5 "createWallet"
# → reveals commit abc123 from 2026-04-10

# Read PR
gh pr view 1432
# → PR description: "Allow TIER_BASIC customers to create wallets for
#   read-only access (notification preferences, transaction history view).
#   Money movement (deposit/withdraw/transfer) still requires TIER_FULL."
```

### Step 2 — Diagnose

This is INTENTIONAL design change. Engineering decided to allow lower-tier customers to have wallet records for non-financial features.

But:
- No ADR was written
- INV-WAL-02 is now stale
- Possibly a NEW invariant should exist (TIER_FULL required for money movement)

### Step 3 — Draft retroactive ADR

```markdown
# ADR-WAL-018 — Allow TIER_BASIC customers to create wallets (read-only)

**Status:** Proposed (2026-05-18 — retroactive; change made 2026-04-10 in PR #1432)
**Proposer:** [drift-scanner-name] (codifying PR #1432)
**Original PR:** #1432 (2026-04-10)
**Original PR author:** [name]

## Context

ADR-WAL-001 (foundational) established that KYC tier FULL is required for
wallet operations. INV-WAL-02 codified: "Customer must have KYC tier FULL
before creating wallet."

Product requirement evolved in Q1 2026: customers in TIER_BASIC wanted to
view notifications + receive transaction history but couldn't because
wallet creation required FULL tier. Onboarding friction was high.

PR #1432 (2026-04-10) modified `WalletService.createWallet()` to accept
TIER_BASIC, with the understanding that money movement still requires
TIER_FULL.

This ADR captures that change retroactively + clarifies the new invariant
structure.

## Decision

1. WALLET CREATION: TIER_BASIC sufficient (modified semantics).
2. MONEY MOVEMENT (deposit/withdraw/transfer): TIER_FULL required (NEW
   invariant; previously implicit in old INV-WAL-02).

INV-WAL-02 to be updated: "TIER_BASIC for wallet creation."
NEW INV-WAL-23 to be added: "TIER_FULL for any money movement operation."

## Alternatives considered (retroactively reconstructed)

### Alternative 1: Keep TIER_FULL for wallet creation
**Rejected because:** UX friction; TIER_BASIC customers can't access non-financial features (notification preferences, history view).

### Alternative 2: Create separate "stub wallet" entity for TIER_BASIC
**Rejected because:** Duplication of schema + service code; one Wallet entity simpler.

### Alternative 3: Allow ALL TIER levels including TIER_0 (unverified)
**Rejected because:** TIER_0 customers shouldn't have ANY persistent records (privacy / data minimization).

## Consequences

### Positive
- TIER_BASIC customers can view notifications + history
- Reduced onboarding friction (faster time-to-value)
- Notification preferences can be saved before customer commits to FULL KYC

### Negative
- New invariant boundary (TIER_FULL for money movement) requires careful enforcement at EVERY money-movement entry point
- Wallet count includes TIER_BASIC customers (changes business metrics; communicate to analytics team)
- Increased complexity in `WalletService` (per-method tier check rather than blanket entry check)

### Compliance
- AML / KYC: no change (money movement still requires FULL; TIER_BASIC wallet is non-financial)
- Privacy / data retention: TIER_BASIC wallet records subject to same retention rules

## Related ADRs

- **Supersedes (partially):** ADR-WAL-001 wallet-creation semantics (modified)
- **Extends:** ADR-WAL-001 (KYC tier framework still in force; this changes the threshold for one operation)

## Related ZeeSpec entries

- **Updated:** INV-WAL-02 (new semantics)
- **New:** INV-WAL-23 (TIER_FULL for money movement)

## Engineering verification (R3 audit)

Verify INV-WAL-23 is enforced at:
- `WalletService.processDeposit()` ✓
- `WalletService.processWithdrawal()` ✓
- `WalletService.processTransfer()` ✓
- `WalletService.processRefund()` ⚠️ verify
- `WalletService.processFeeRebate()` ⚠️ verify

(If any path missing enforcement: that's a separate bug → spawn chip per workflow 08 recipe T3-bug)

## History

| Date | Status | Author | Note |
|------|--------|--------|------|
| 2026-04-10 | (no ADR) | [original PR author] | Implementation merged in PR #1432 |
| 2026-05-18 | Proposed | [drift-scanner-name] | Retroactive ADR drafted from drift scan |
| 2026-05-22 | Accepted | [tech lead + original PR author] | Confirms intent captured |
```

### Step 4 — Update spec

Update `wallet/what.md`:

```markdown
### INV-WAL-02 — KYC tier BASIC sufficient for wallet creation
Status: ✅ IMPL (verified 2026-05-18; ADR-WAL-018 retroactive)
Source: WalletService.createWallet() line 56

Customer can create a wallet with KYC tier BASIC or higher. The wallet is
created but operations requiring money movement are restricted (see
INV-WAL-23).

Per ADR-WAL-018 (allows TIER_BASIC for non-financial wallet features).

### INV-WAL-23 — TIER_FULL required for money movement (NEW per ADR-WAL-018)
Status: ⚠️ verify at all entry points
Source: WalletService.processDeposit/Withdrawal/Transfer/etc. (audit needed)

Any operation that moves money in/out of wallet (deposit, withdrawal,
transfer, refund, fee rebate) requires customer.kyc_tier >= TIER_FULL.

Per ADR-WAL-018.

Engineering: every money-movement method must check tier at entry. R3 audit
required to verify all paths.
```

Update `wallet/CLAUDE.md` ADR table:

```markdown
| ADR | Decision | Status | Source |
|-----|----------|--------|--------|
| ADR-WAL-001 | KYC tier FULL for wallet operations | ⚠️ AMENDED by ADR-WAL-018 | (foundational; modified) |
| ADR-WAL-018 | TIER_BASIC for wallet creation; TIER_FULL for money movement | ✅ ACCEPTED (2026-05-22; retroactive for PR #1432) | adr/ADR-WAL-018.md |
```

Update `wallet/CLAUDE.md` "Drift items" table:

```markdown
| ID | Type | Title | Severity | Status | ADR? | Chip? |
|----|:----:|-------|:--------:|--------|:----:|:-----:|
| D7 | 3-design | INV-WAL-02 stale after PR #1432 (TIER_BASIC allowed) | 🟠 P1 | 🟢 RESOLVED | ADR-WAL-018 | none (no fix needed if INV-WAL-23 audit passes) |
| D8 | 3-bug? | INV-WAL-23 enforcement verification needed | TBD | 🔴 OPEN | n/a | possible chip if any path missing check |
```

### Step 5 — Follow-up

INV-WAL-23 (new invariant) needs R3-style audit to confirm enforcement at ALL money-movement paths. If any path missing → that's a Type 3-bug → spawn chip.

## When retroactive ADR doesn't fit

Some Type 3-design drift is hard to ADR-ify:

### Edge case 1 — Engineer left; no one knows why

If you can't find anyone to confirm intent:

1. Try `git log -p` to read the commit message + diff
2. Look at PR description if it exists
3. Look at any related Slack / issue / ticket
4. If still mystery: file as `RES-MOD-DRIFT-NN` (research question) rather than ADR
5. Possibly file the drift as Type 3-bug (since you can't confirm it's intentional)

### Edge case 2 — Change is bad in retrospect

If the drift change is now considered a mistake:

1. Don't write ADR endorsing it
2. Either:
   a. Spawn chip to revert (preferred if revert is safe)
   b. Write ADR explaining why we're keeping the change despite preferring otherwise (tech debt acknowledgment)
3. Update spec to reflect current reality + add tech-debt note

### Edge case 3 — Change is too granular for ADR

A tiny behavioral change (e.g., error message wording) doesn't deserve full ADR.

1. Just update the spec; commit with detailed message
2. Note in CLAUDE.md drift table as resolved
3. No ADR needed

### Edge case 4 — Multiple drifts share same underlying ADR

If 3 drift items all stem from the same redesign:

1. Write ONE ADR covering the redesign
2. Reference it from all 3 drift items
3. Update spec for all 3 invariants

## Cadence

How often does drift produce ADRs?

| Module age | Expected retroactive ADRs per year |
|------------|------------------------------------|
| 0-6 months | 0-2 (most decisions still fresh; proactive ADRs preferred) |
| 6-12 months | 2-5 (drift starts accumulating) |
| 1-2 years | 3-8 (mature module; design evolves) |
| 2+ years | 2-5 (most decisions stable; only material changes need retroactive ADR) |

If you're writing > 15 retroactive ADRs/year for one module → drift management cadence is too slow. Increase Layer 2 scheduled review frequency.

If you're writing 0 retroactive ADRs over multiple years → either:
- Drift scanner not active (false sense of stability), OR
- Module truly stable (rare)

## Retrospective vs proactive ADRs

| Aspect | Proactive ADR | Retroactive ADR |
|--------|---------------|------------------|
| Timing | Before code change | After code change |
| Decision-makers | Architect / tech lead authority | Same (codifying after fact) |
| Alternatives discussion | Genuine; ADR shapes decision | Reconstructed; harder to recover full rationale |
| Engineering implementation | Follows ADR | Already done; ADR captures |
| Authority | Equal to retroactive | Equal to proactive |
| Risk | Bikeshedding before code | Drift compounds before ADR caught |

Neither is superior. Use proactive when you know a decision is coming; use retroactive when drift surfaces.

## R6 agent role

R6 ADR Curator Agent (per `05-R6-adr-curator-agent.md`) can:
- Draft retroactive ADRs from drift findings + git blame
- Suggest relationships to existing ADRs
- Flag if proposed ADR conflicts with existing ones
- Update CLAUDE.md ADR table

R6 + drift detection (R5) work together: R5 finds drift; R6 drafts the ADR.

## Anti-patterns

1. **Drift detected; no ADR written** → spec keeps lying; trust erodes
2. **ADR written without rationale** ("we changed X") — captures what but not why; future readers stranded
3. **ADR contradicts existing ADR; no supersedes link** — confusion about which is in force
4. **Retroactive ADR retrofits "official-sounding" rationale that wasn't real** — be honest: "PR description gave no rationale; reconstructed from product context" is better than fabricating
5. **Drift fix without retrospect** — every Type 3-design + Type 4 deserves retrospective: was this a good change?
6. **Mass retroactive ADRs in one batch** — overwhelming; per-finding ADR with focused scope
7. **R6 agent generates ADRs without human review** — agent draft is starting point, not final

## Cross-references

- `extended/workflow/08-code-drift-management/02-drift-categorization.md` — Type 3-design + Type 4 trigger this pattern
- `extended/workflow/08-code-drift-management/04-drift-resolution-playbook.md` — Recipe T3-design + T4
- `01-adr-format-template.md` — format for retroactive ADRs
- `02-adr-lifecycle.md` — Proposed → Accepted transition
- `03-adr-relationships.md` — supersedes / extends links for retroactive ADRs
- `05-R6-adr-curator-agent.md` — agent for drafting

## Next

→ `05-R6-adr-curator-agent.md` — AI agent for ADR drafting + curation
→ Back to `00-START-HERE.md` for navigation
