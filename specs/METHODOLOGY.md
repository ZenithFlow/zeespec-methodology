---
doc: METHODOLOGY
type: framework-spec
version: 3.0.0
status: stable
last_updated: 2026-05-29
---

# ZeeSpec — Full Methodology Specification

> Version 3.0 (post-pilot, language-agnostic, jurisdiction-neutral). Read once; reference forever.

---

## 1. Origins

ZeeSpec is built on **John Zachman's 1987 framework** for information systems architecture. Zachman observed that architecture documentation conflates orthogonal concerns (data vs process vs people vs timing vs location vs motivation), making specifications:

- **Contradictory** (the data model says X; the workflow says Y)
- **Stale** (one dimension updated, others lag)
- **Hard to verify** (no obvious place to look for a specific claim)

Zachman proposed **6 dimensions** (WHAT/HOW/WHERE/WHO/WHEN/WHY) × **6 perspectives** (planner/owner/designer/builder/subcontractor/functioning enterprise) = 36 cells.

**ZeeSpec simplifies this to 6 dimensions × 1 perspective (the builder/AI agent),** plus 4 helper files (entry point, gravity, gaps, glossary) for a total of **10 files per module**.

**What ZeeSpec adds to raw Zachman.** Zachman's framework is a *taxonomy* — it says what to document but (by Zachman's own description) is "not a methodology" and prescribes no process, which is its most-cited criticism. ZeeSpec supplies exactly that missing layer: a **process** (author → B1 → R3 → R1+R2 → apply), a **verification discipline** (status tags + `file:line` citations + the reviewer pipeline), and **change-handling** (drift management + ADR lifecycle). In short — **ZeeSpec = the Zachman taxonomy + the process/verification layer Zachman never provided.** (See `ZACHMAN-ALIGNMENT.md` Tier 3·3B.)

## 2. The 10-File Convention

Every ZeeSpec-codified module lives in a directory:

```
docs/specs/zeespec/<module-name>/
├── CLAUDE.md       — AI agent entry point + ADR table + active issues
├── why.md          — strategic goals + business rules + risks + trade-offs
├── what.md         — entities + attributes + invariants + relationships
├── how.md          — algorithms + processes + state machines + validation tables
├── who.md          — actors + RBAC + Segregation of Duties + permission matrix
├── when.md         — triggers + schedules + SLAs + retry windows
├── where.md        — storage roles + tech stack binding (the only stack-specific file)
├── gravity.md      — cross-cutting hardwiring constraints (HW-XXX-NN)
├── gaps.md         — open questions; AI MUST stop on OPEN gaps
└── glossary.md     — disambiguate domain + technical terms
```

### Why exactly these 6 dimensions?

Each dimension answers ONE orthogonal question:

| Dimension | Question |
|-----------|----------|
| WHAT | What entities/data exist? What constraints hold? |
| HOW | How does the algorithm work? What's the state machine? |
| WHO | Who can do what? Permission boundaries? |
| WHEN | When does it run? What's the SLA? |
| WHERE | Where does it live? Storage + tech stack? |
| WHY | Why this design? What problem does it solve? |

The 4 helpers:

- **CLAUDE.md** — AI agent first-read; condensed ADR table + active issues + read order
- **gravity.md** — cross-dimension hardwiring (e.g., HW-NOTIF-01: "every dispatched channel writes a row" spans WHAT × HOW × WHO)
- **gaps.md** — explicit unresolved decisions; AI MUST STOP and ASK USER
- **glossary.md** — terms that mean different things in different contexts

## 3. The Promotion Workflow (Tier 1)

A module goes through **5-6 phases** to reach **Tier 1 (production-validated)** status. Each phase catches a different class of error. R4 is **optional** for modules without external-authority dependencies (pure internal-logic modules); **required** for modules dependent on regulators / statutes / standards.

```
[OPTIONAL: PHASE 0 — R4 RESEARCH (1-4h per topic)]
                              → Research regulator + statute + standard for
                                external-authority claims; produce citation
                                blocks ready to paste; only for modules with
                                external dependencies
                                (see workflow/07-r4-regulatory-research/)
       ↓
PHASE 1: AUTHOR (4-6h)     → Read existing canonical docs + production code → write 10 ZeeSpec files
                              (Author phase has 12 sub-steps — one per file + final assembly;
                               see workflow/01-authoring-checklist.md)
       ↓
PHASE 2: B1 VERIFY (30min) → Grep production: field counts, enum cases, signatures, line refs
       ↓
PHASE 3: R3 DEEP (1-2h)    → Same-session deep verifier; verify every file:line; check invariants
       ↓
PHASE 4: R1+R2 PARALLEL    → Dispatch 2 parallel agents:
         (1-2h wall)         R1 = algorithm correctness + race conditions
                             R2 = compliance + audit + cross-module
                                  (R2 uses R4 baseline if R4 was run)
       ↓
PHASE 5: APPLY (1-2h)      → Fold findings back; spawn task chips for production bugs; commit
       ↓
   Tier 1 STATUS

[ANNUAL: re-run R4 to catch law amendments]
```

**Why 5-6 phases?** Each catches a different class of error:

| Phase | Catches | Examples |
|-------|---------|----------|
| **R4** (optional) | External-authority drift | "spec says CTR threshold = 10M MNT but statute was amended to 20M MNT in 2017" |
| **B1** | Quantitative drift | "spec says 39 enum cases, production has 45" |
| **R3** | Line-level errors | "method at line 525, not 553 as cited" |
| **R1** | Architecture-level | "spec describes async, production is sync" |
| **R2** | Cross-cutting + compliance | "no operator identity captured in audit trail" |

## 3a. Continuous post-Tier-1 workflows (drift + ADR)

> **Phase numbering note:** The pre-Tier-1 workflow has 5 phases (Author + B1 + R3 + R1+R2 + Apply). `workflow/06-spawn-task-chips.md` is a UTILITY used across phases (not a numbered phase). After Tier 1, two CONTINUOUS workflows take over — referenced by folder number (`workflow/08`, `workflow/09`) rather than as numbered phases, since they run perpetually rather than as discrete sequential steps.

After Tier 1 promotion, two ONGOING workflows keep the spec aligned with reality:

```
[Tier 1 status]
        ↓
[CONTINUOUS]
  workflow/08 — Code Drift Management
    - CI drift scan on every PR (Layer 1)
    - Scheduled review monthly/quarterly (Layer 2)
    - Triggered review for refactors / bug fixes (Layer 3)
    - 4-type framework: Citation / Field+enum / Behavioral / Architectural
    - Resolution: spec edit OR spawn chip OR ADR
    - Agent: R5 (drift scanner)

  workflow/09 — ADR Lifecycle
    - Format: capture context + decision + alternatives + consequences
    - Lifecycle: Proposed → Accepted → Superseded / Deprecated
    - Relationships: supersedes / extends / conflicts-with / inherits
    - Drift-driven ADR pattern: drift findings → retroactive ADRs
    - Annual ADR review for staleness
    - Agent: R6 (ADR curator)
```

**Drift vs ADR distinction:**

| Workflow | Catches | Examples |
|-------|---------|----------|
| **workflow/08 (Drift)** | Spec ≠ Code | "Spec INV-WAL-02 says TIER_FULL; code accepts TIER_BASIC" |
| **workflow/09 (ADR)** | Decision not documented | "WHY was TIER_BASIC allowed? No ADR exists; retroactive needed" |

The two work together: drift detection (workflow/08) surfaces Type 3-design + Type 4 changes → ADR (workflow/09) captures the WHY → spec realigns.

## 3b. Specialized agents per phase

| Phase | Agent | Mode |
|-------|-------|------|
| R4 | (R4 agent in workflow/07) | research / re-validation / amendment-scan |
| Drift | R5 agent (workflow/08/05) | scan / scheduled / triggered |
| ADR | R6 agent (workflow/09/05) | draft retroactive / annual review / conflict check / cross-module |

These agents are dispatch-ready prompts; engineering teams parameterize per module + domain + jurisdiction.

**R4 vs R2 distinction:**
- **R2** verifies the spec's compliance claims against existing-knowledge baseline. If R4 didn't run, R2 has no fresh baseline to verify against.
- **R4** verifies the underlying authority itself (laws change, agencies issue new rules, R4 catches it). R4 looks OUTWARD (regulator websites + statute databases); R2 + R3 look INWARD (production code + sibling specs).

For modules without external-authority dependencies (e.g., a pure data-pipeline module with no jurisdictional claims), skip R4. For finance, healthcare, government, privacy, tax modules — R4 should be the FIRST phase.

## 4. Status Tagging Convention

Every claim about production state MUST carry one of these tags:

| Tag | Meaning | When AI uses |
|-----|---------|--------------|
| ✅ **IMPL** | Implemented + verified with `file:line` citation | AI may write code citing this invariant |
| 🟡 **PARTIAL** | App-layer enforcement only; no DB constraint OR partial coverage | AI cites + adds defense-in-depth comment |
| 🚧 **DESIGN** | Documented intent; NOT in production code | **AI MUST NOT** rely on it; treat as gap |
| 🚧 **NOT-ENFORCED** | Production accepts inputs that violate the invariant | File as gap; spawn task chip |
| 🚧 **BROKEN** | Production attempts to enforce but fails (runtime crash) | File as P0 production bug |

**Anti-pattern to avoid:** Writing "INV-X-04 ✅ IMPL" without a file:line citation. Reviewers will downgrade to 🟡 PARTIAL or 🚧 DESIGN until proof is provided.

## 5. Severity Matrix (gaps.md)

> **Icon convention (READ THIS FIRST):**
> - **🚨** = Severity P0 (Critical) — describes IMPACT
> - **🔴** = Status OPEN — describes LIFECYCLE (unresolved)
> - These are ORTHOGONAL. A gap can be `🚨 P0` + `🔴 OPEN` (most urgent) OR `🚨 P0` + `🟢 RESOLVED` (urgent + fixed).
> - Symbols: 🚨 / 🟠 / 🟡 / 🟢 (severity) vs 🔴 / 🟡 / 🟢 / ⚪️ / 📌 (status)

OPEN gaps carry severity. AI behaviour depends on severity:

| Severity | Has ticket? | AI behaviour |
|----------|:-----------:|--------------|
| 🚨 Critical (P0) | No | **STOP** — ask user; do not implement |
| 🚨 Critical (P0) | Yes (MODULE-IMPL-XXX) | Refer to ticket; do NOT implement |
| 🟠 High (P1) | No | **STOP** — ask user |
| 🟠 High (P1) | Yes | Cite gap; proceed only if explicitly invoked |
| 🟡 Medium (P2) | Either | Implement if obvious + cite gap |
| 🟢 Low (P3) | Either | Implement + cite gap |

## 6. Numbering Conventions

Most-used prefixes (see `checklists/invariant-numbering.md` for the **full 19-prefix catalog** including `SLA`, `G`, `BR`, `F`, `Gap`, `RES`, `NHW`):

| Prefix | Meaning | Lives in | Example (pilot module: NOTIF) |
|--------|---------|----------|-------------------------------|
| `INV-<MOD>-NN` | Invariant (data integrity) | `what.md` | `INV-NOTIF-13` |
| `HW-<MOD>-NN` | Hardwiring (cross-dimension) | `gravity.md` | `HW-NOTIF-08` |
| `ADR-<MOD>-NNN` | Architecture Decision Record | `CLAUDE.md` (+ optional separate ADR log) | `ADR-NOTIF-009` |
| `ALG-<MOD>-NAME` | Algorithm (descriptive name, ALL CAPS) | `how.md` | `ALG-NOTIF-SEND-01` |
| `P-<MOD>-[DESC-]NN` | Process | `how.md` | `P-NOTIF-PUSH-01` (with DESC) or `P-NOTIF-01` (NN-only) |
| `FU-<MOD>-NAME` | Follow-Up gap | `gaps.md` | `FU-<MOD>-STALE-TOKEN-CLEANUP` |
| `R-<MOD>-NN` | Risk | `why.md` | `R-NOTIF-09` |
| `T-<MOD>-NN` | Trigger/timing | `when.md` | `T-NOTIF-03` |
| `S-<MOD>-NN` | Storage role | `where.md` | `S-NOTIF-01` |
| `V-<MOD>-NN` | Validation table | `how.md` | `V-NOTIF-01` |
| `A-<MOD>-NN` | Actor | `who.md` | `A-NOTIF-02` |
| `SOD-<MOD>-NN` | Segregation of Duties | `who.md` | `SOD-NOTIF-03` |

> The `NOTIF` examples come from the pilot project's notification module. Substitute your own module prefix when authoring (e.g., `INV-INVENTORY-04`, `HW-CHECKOUT-07`, `ADR-ORDERS-012`).

Use ALL CAPS module prefix; zero-padded numbers (NN = 2 digit, NNN = 3 digit for ADRs). Descriptive-suffix prefixes (`ALG`, `FU`, `Gap`) use ALL CAPS with hyphens, no zero-padding.

## 7. The Two-Layer Architecture (Stack Independence)

The biggest design choice in ZeeSpec v2: **separate the language-agnostic spec from the stack-specific binding**.

### Layers

**Layer 1 (language-agnostic):** `why.md`, `what.md`, `how.md`, `who.md`, `when.md`, `gravity.md`, `gaps.md`, `glossary.md`, AND `where.md` §§ 1-4

These files describe the module **conceptually** — entities, algorithms, actors, timing, storage **roles** — without naming any framework, library, or class.

**Layer 2 (stack-specific):** `where.md` § 5 "Tech Stack Binding"

This single section names framework + library + class specifics. Porting to a different stack requires rewriting only this section.

### Example

Layer 1 (language-agnostic) — content lives in `where.md` § 1:

```
S-NOTIF-02: Async message queue
  Domain: notification dispatch transports
  Properties:
    - 4 transports with retry strategies
    - Per-transport max_retries config
    - Dead-letter transport for exhausted retries
```

Layer 2 (stack-specific) — content lives in `where.md` § 5.3:

```
Async transports
  Component: <your message bus library> with <your transport>
    - notifications: max_retries=3, delay=1000ms (class/handler name)
    - sms_high_priority: max_retries=5, delay=500ms
    - ...
```

(Layer 2 names actual frameworks, libraries, classes. Layer 1 above does not.)

## 8. The 5 R6 Reflexes (R6-aware authoring)

When authoring a new ZeeSpec, apply these 5 verification reflexes from the start:

1. **(a) Entity-field reflex** — every entity claim has field-by-field type + nullable + default
2. **(b) Service-method reflex** — every method cited has line ref + signature
3. **(c) Invariant reflex** — every INV has Status (IMPL/PARTIAL/DESIGN) + code source
4. **(d) Cross-link reflex** — every cited sibling spec exists + is acknowledged bidirectionally
5. **(e) Logging-handler reflex** — every audit-relevant log call uses level that survives buffering

## 9. Gravity (HW) Constraints — The Crown Jewel

`gravity.md` is the most distinctive ZeeSpec file. It captures **cross-cutting hardwiring** — constraints that span multiple dimensions.

**It is a *composite* (Zachman 3.0), not a second copy of the rules.** Per the normalization rule *"one fact, one cell,"* a gravity entry **points to** the primitive cells that own the rule; it never restates the rule's text, Status tag, or `file:line`. Those live in the primitive (`what.md` INV-, `how.md` ALG-, `who.md` SOD-, …). A gravity entry holds only **composite-only** content — which cells it crosses + the failure mode if they disagree:

```markdown
### HW-NOTIF-01: Per-channel Notification row ⇄ audit ⇄ multi-channel fan-out

- **Crosses:** what.md/INV-NOTIF-13 · how.md/ALG-NOTIF-SEND-01 · who.md/A-NOTIF-02
- **Why it's gravity (failure mode if the crossed cells disagree):** a channel passes eligibility but no row is written → per-channel audit trail lost.
- **Codified by:** ADR-NOTIF-009  (the rule's text, Status, and file:line live in INV-NOTIF-13, not here)
```

Each HW entry:
- Has a unique ID (`HW-MODULE-NN`)
- **Points to** the primitive cells it crosses (the rule's substance + Status + `file:line` live there)
- Describes the **failure mode** if those cells disagree — the only content unique to gravity
- Optionally names the ADR that codified the decision

> **Normalization (v3):** Do NOT put a `**Statement:**` that restates the invariant, a `Status:` tag, or a `service.ext:NN` citation in a gravity entry — all three belong to the primitive cell, and a second copy drifts independently. An entry that merely duplicates another HW becomes an explicit **alias pointer**, not a restatement. (See `ZACHMAN-ALIGNMENT.md` Tier 1·1A.)

**Why this matters:** AI agents read each dimension file independently. Without `gravity.md`, an agent writing code that satisfies WHAT might violate HOW × WHO. The HW index is the single place where cross-cutting relationships are pointed to — and because it only points, it cannot drift out of sync with the rules it references.

## 10. The Bidirectional Cross-Link Rule

When module A inherits a constraint from module B, BOTH specs must declare the relationship.

**Module B (the owner)** — section in `gravity.md`:

```
Section: Downstream inheritance
| Inheriting module | What it inherits |
| module-A          | HW-B-02 (user-level addressing) |
```

**Module A (the consumer)** — section in `gravity.md`:

```
Section: From module B (HW-B inheritance)
| Inherited HW | Why | How it manifests |
| HW-B-02 | Module A needs user-level dispatch | Resolved via b.getUser() |
```

**Anti-pattern caught by R2:** Unilateral declaration (B says "A inherits" but A's spec doesn't acknowledge it) → cross-spec drift; AI writes code violating the inherited contract.

## 11. Common Anti-Patterns (Top 5)

Full list in `checklists/anti-patterns.md`. Top 5:

1. **AccountStatus pattern (false-positive enforcement)** — Spec says "INV-X enforced at service layer"; production accepts inputs that violate it. Caught by R3 deep verifier reading actual code.
2. **Phantom method** — Spec cites `repository->getLatestPrice($asset)`; production has no such method. Caught by R1 grep verification.
3. **DEAD code in spec** — Spec describes 3 SMS priority transports; production routes ALL SMS to `high_priority`. Caught by R1 messenger.yaml reading.
4. **Stale line refs** — Spec cites `service.php:265` for a method now at line 397 (+200 drift after 14 days). Caught by B1 grep.
5. **createdBy: 0 sentinel** — Service code hardcodes `createdBy: 0` instead of capturing real operator. Audit trail BROKEN. Caught by R2 compliance review.

## 12. The Spawn Task Chip Pattern

When a reviewer (R3/R1/R2) finds a real production bug (not spec drift), the response is **NOT** to fix it inline. Instead:

1. **Document the finding** in `gaps.md` with file:line + severity + reproduction steps
2. **Spawn a task chip** with self-contained prompt (file paths, line numbers, acceptance criteria)
3. **Cite the spawned chip** in the gap entry: "spawn task chip created YYYY-MM-DD"
4. **Continue the review** — don't get distracted

This separates **spec authoring** from **production bug fixing** — keeps each session focused.

## 13. Module Maturity Levels

| Tier | Definition | Promotion requirements |
|------|------------|------------------------|
| 🔵 Drafting | Initial 10-file authoring; not yet verified | None |
| 🟡 Design-intent | B1 + R3 done; R1+R2 may have run; gaps tracked | Author + 1 reviewer |
| 🟢 Active | All P0 gaps resolved; production-validated; periodic R3 re-run | Tier 1 promotion + ≥1 quarter stable |
| 📦 Archive | Deprecated module; kept for reference | Module sunset decision |

Most modules sit at 🟡 Design-intent for an extended period — that's healthy.

## 14. Cost Per Module (observed in one 5-module pilot — N=1)

> **Honesty caveat (N=1):** these are *pilot observations* from a single author on a single project, not independently-validated ROI. Treat them as directional, not proven. Building an evidence base beyond N=1 is exactly what the metrics loop (`ZACHMAN-ALIGNMENT.md` Tier 1·1C) is for.

| Module | Authoring time | Findings caught | Production bugs fixed |
|--------|----------------|-----------------|------------------------|
| notification | 4h | 45 | 2 |
| asset_catalog | 6h | 13 | 1 |
| wallet | 5h | 25 | 1 |
| accounting | 6h | 54 | (3 spawn chips, in-progress) |
| settlement | 5h | 40 | (3 spawn chips, in-progress) |
| **AVERAGE** | **5.2h** | **35** | **1-3** |

**Cost-benefit:**
- Authoring: ~$500 of AI tokens + ~$50 of reviewer time per module
- Production bug avoided: typically saves 8-40 hours of debugging + customer-impact recovery
- Compliance gap avoided: priceless (one enforcement action = $XX,000+ + license risk)

## 15. When NOT to use ZeeSpec

- ✗ Single-developer hobby projects (overhead exceeds value)
- ✗ Pre-PMF prototypes (use lightweight specs)
- ✗ Trivial CRUD modules (10 files is overkill)
- ✗ Throwaway scripts
- ✓ Use sparingly: 1-2 most critical modules first, expand as ROI proves out

## 16. Glossary of ZeeSpec Terms

**Workflow terms:**
- **Tier 1 promotion** — the 5-phase Author + B1 + R3 + R1+R2 + apply workflow
- **B1 verification** — Baseline verification, layer 1; quantitative grep against production code (entity field counts, enum cases, LOC, line refs). Runs in ~30 min before deeper review phases.
- **R3 deep verifier** — same-session line-by-line check; reads each ZeeSpec file end-to-end + production code; catches AccountStatus-pattern false positives. ~1-2 hours.
- **R1 reviewer** — independent algorithm + race condition + invariant correctness reviewer; runs in parallel with R2.
- **R2 reviewer** — independent compliance + audit + cross-module reviewer; runs in parallel with R1.
- **R1+R2 parallel** — both agents dispatched simultaneously; results merged after they finish.
- **R6 reflexes** — 5 verification checks applied during authoring (entity, method, invariant, cross-link, logging) to prevent the most common drift classes.

**Artifacts + concepts:**
- **Spawn task chip** — production bug delegated to separate session (self-contained prompt with file paths + acceptance criteria)
- **Gap** — unresolved decision; AI must stop on OPEN with severity 🚨 P0 or 🟠 P1 (without ticket)
- **Hardwiring (HW)** — cross-dimension invariant codified in `gravity.md`
- **Bidirectional cross-link** — both consumer + provider modules declare the relationship (anti-pattern: unilateral declaration)

**Status values** (lifecycle):
- **🔴 OPEN** — blocking; no decision yet
- **🟡 PROPOSED** — solution drafted, awaiting approval
- **🟢 RESOLVED** — decision recorded; production fix landed
- **⚪️ DEFERRED** — postponed; not currently blocking; revisit after [date or trigger]
- **📌 BY-DESIGN** — documented intentional gap (we acknowledge but won't fix; e.g., "polymorphic ref has no FK by design — soft-delete on consumer modules compensates")

**Severity values** (impact):
- **🚨 P0 Critical** — money loss, compliance violation, runtime crash
- **🟠 P1 Important** — audit gap, dead code, missing guard
- **🟡 P2 Medium** — drift, missing test
- **🟢 P3 Low** — style, naming

(Severity is ORTHOGONAL to status — see § 5 icon convention.)

**Anti-patterns:**
- **AccountStatus pattern** — false-positive enforcement claim (spec says enforced; production has bypass)
- **createdBy:0 anti-pattern** — sentinel value instead of real operator capture; breaks audit trail (regulatory inspection blocker)

---

**License:** MIT
**Validated:** Across 5 production modules in compliance-heavy financial domain
