---
doc: METHODOLOGY
type: framework-spec
version: 3.2.0
status: stable
last_updated: 2026-06-06
---

# ZeeSpec — Full Methodology Specification

> Version 3.2 (post-pilot, language-agnostic, jurisdiction-neutral). Read once; reference forever.

---

## 1. Origins

ZeeSpec is built on **John Zachman's 1987 framework** for information systems architecture. Zachman observed that architecture documentation conflates orthogonal concerns (data vs process vs people vs timing vs location vs motivation), making specifications:

- **Contradictory** (the data model says X; the workflow says Y)
- **Stale** (one dimension updated, others lag)
- **Hard to verify** (no obvious place to look for a specific claim)

Zachman proposed **6 dimensions** (WHAT/HOW/WHERE/WHO/WHEN/WHY) × **6 perspectives** (planner/owner/designer/builder/subcontractor/functioning enterprise) = 36 cells.

**ZeeSpec simplifies this to 6 dimensions × 1 perspective (the builder/AI agent),** plus 4 helper files (entry point, gravity, gaps, glossary) for a total of **10 files per module**.

**What ZeeSpec adds to raw Zachman.** Zachman's framework is a *taxonomy* — it says what to document but (by Zachman's own description) is "not a methodology" and prescribes no process, which is its most-cited criticism. ZeeSpec supplies exactly that missing layer: a **process** (author → B1 → R3 → R1+R2 → apply), a **verification discipline** (status tags + `file:line` citations + the reviewer pipeline), and **change-handling** (drift management + ADR lifecycle). In short — **ZeeSpec = the Zachman taxonomy + the process/verification layer Zachman never provided.** (See `ZACHMAN-ALIGNMENT.md` Tier 3·3B.)

**Which Zachman rows ZeeSpec actually spans (honest mapping).** "One perspective" is a simplification: ZeeSpec actually *compresses three* of Zachman's six rows into the builder's working set, and deliberately omits the rest. Naming them keeps the methodology honest about what it captures and what it skips:

| ZeeSpec file / mechanism | Zachman row (perspective) | Layer |
|--------------------------|---------------------------|-------|
| `why.md` (goals, business rules, risks) | Owner / Business Management | Conceptual |
| `what.md` `how.md` `who.md` `when.md` `where.md §§1-4` | Designer / Architect | Logical (Layer 1) |
| `where.md § 5` (Tech Stack Binding) | Builder / Engineer | Physical (Layer 2) |
| Status tags (✅ IMPL ⇄ 🚧 DESIGN) | *bridge to* Enterprise / Operations | runtime reality |
| *(deliberately omitted)* | Executive/Scope (row 1) · Technician/Components (row 5) | — |

Two consequences worth stating: (1) the **two-layer architecture** (§ 7) is exactly Zachman's Logical-row vs Physical-row split; (2) the **status tags** (§ 4) are how ZeeSpec bridges the Builder row (what the design says) to the Operations row (what actually runs) — ✅ IMPL means Builder ≡ Operations, 🚧 DESIGN means Builder ≠ Operations.

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

> **You do not start with all 10.** The 10-file convention is the *ceiling*, not the entry point. The documented default is the **Lite weight (~3 files)**; promoting a module to the full 10 is a deliberate decision for the 1-2 most critical modules — see **§ 2a Module Weight Tiers**.

## 2a. Module Weight Tiers (progressive disclosure)

Applying all 10 files to every module is the #1 over-engineering trap (see `ZACHMAN-ALIGNMENT.md` Tier 0 + 2B). A module's **weight** — how many of the 10 files it carries — should match its complexity and risk, not a one-size policy. This mirrors **progressive disclosure**: load only the cells a task needs, because context is finite and over-stuffed context rots (Anthropic, *Effective context engineering*; *Agent Skills* 3-level disclosure). It is the same scale-adaptive instinct as BMAD's tracks, Kiro's deliberately-3-artifact feature spec, and Spec Kit's intent-first phasing.

| Weight | Files (~) | File set | Use as |
|--------|:---------:|----------|--------|
| **Lite** *(default entry)* | 3 | `CLAUDE.md` · `what.md` · `gaps.md` | Every new module starts here — captures invariants + status tags + STOP-gaps in ~2h |
| **Standard** | 6-7 | Lite **+** `why.md` · `how.md` · `gravity.md` *(± `who.md`/`when.md`)* | Modules with real algorithms or cross-cutting rules, but not yet stack-bound or compliance-critical |
| **Full** | 10 | all 6 dimensions + 4 helpers (§ 2) | The 1-2 most critical modules — money/data-handling, regulated, long-lived. A deliberate **promotion**, never the reflex |

The file set grows along the authoring DAG (`WHY → WHAT → HOW → {WHO, WHEN} → WHERE`, see `workflow/01-authoring-checklist.md`): Standard adds the conceptual core (why/how/gravity) on top of Lite; Full adds actors, timing, and the stack binding (`where.md`). You promote weight **incrementally** — never author files a module hasn't earned.

### Weight ≠ Maturity (two orthogonal axes)

**WEIGHT** (this section) = how *many* files a module carries. **MATURITY** (§ 13) = how *verified* those files are. They are independent: a 3-file Lite module can be fully verified (🟢 Active), and a 10-file Full module can still be unverified (🔵 Drafting).

| | 🔵 Drafting | 🟢 Active (verified) |
|---|---|---|
| **Lite (3)** | new module, just scaffolded | small module, verified + stable |
| **Full (10)** | critical module mid-authoring | the goal for a critical module |

> **Three things named "Tier" — keep them distinct.** (1) **"Tier 1 promotion"** = the § 3 verification *workflow* (Author → B1 → R3 → R1+R2 → apply) — a MATURITY event, not a file count. (2) **§ 13 Module Maturity Levels** (Drafting/Design-intent/Active/Archive) = how verified. (3) The labels **"Tier 0 Lite"** / **"Tier 1 Standard"** in `10-adoption-guide/07-zeespec-lite-tier-0-fasttrack.md` are the older names for the WEIGHT axis — **"Tier 0 Lite" remains a valid alias for Lite weight**; this section is the canonical home for the weight vocabulary.

### Choosing a weight (decision matrix)

Start Lite. Promote toward Full only when an answer is **YES** — each YES adds weight; reaching Full needs sustained capacity to maintain it.

| Question | If YES |
|----------|--------|
| **Regulated / compliance-relevant?** (KYC/AML, PHI, tax, audit trail) | → Standard min; Full if audit-critical (needs `who.md` SoD + `where.md` binding) |
| **Handles money or sensitive data?** (balances, payments, PII) | → Standard min; Full for the source-of-truth module |
| **Long-lived?** (runs > 2 years; outlives its author) | → Standard — capture WHY (`why.md`) before context is lost |
| **High-churn or hand-off?** (≥2 engineers, frequent refactors) | → Standard+ — `how.md` + `gravity.md` prevent cross-cutting regressions |
| **None of the above** | → stay **Lite** (or skip ZeeSpec entirely — § 15) |

Maintenance capacity is the governor: a solo author should cap Full-weight modules at 1-2 and keep the rest Lite (`10-adoption-guide/08-one-man-army.md`). The Tier-0-Lite fast-track (`07-zeespec-lite-tier-0-fasttrack.md`) is the operational how-to for authoring at Lite weight and the promotion path upward.


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

## 3c. Where AI review is strong, and where to use deterministic checks

> **Scope, not repair.** This sharpens *where each reviewer earns its keep*; it does not change the pipeline. The design is already partly non-circular: B1 greps **production code** and every claim carries a `file:line` citation (§ 4) — that production code IS an external ground truth, so ZeeSpec reviewers are **not** pure AI-checking-AI. The note below scopes the residual.

**The principle.** An AI reviewer is strongest on the **structural/architectural residual** — correctness, race conditions, cross-cutting coherence, dead code — because the signal is *inferable from the code itself*. It is weakest on domain/regulatory **conventions** — specific thresholds, filing deadlines, enum rules, jurisdiction definitions — because those are *not inferable from code*: they must come from an external spec, and asking a model to *recall* them invites hallucinated values (the exact failure `workflow/07-r4-regulatory-research/` exists to prevent). Anthropic's context-engineering guidance makes the same split: retrieve external facts just-in-time; don't lean on model recall for them.

**The move.** Where a behavioral or regulatory rule has a *checkable value* (a threshold, a deadline, an enum allow-list, a SoD pair), encode it as a **deterministic check / executable assertion / BDD-style example** — `Given a 21M MNT cash transaction, When booked, Then a CTR auto-flags` — rather than relying on a reviewer to remember it. The **R4 output is the natural source**: its citation blocks (`workflow/07/03-citation-conventions.md`) already pin threshold + deadline + source + date; turning each pinned value into one assertion lets a test or the **CI drift-gate** (`scripts/ci-drift-gate.sh`, alongside the `workflow/08` Layer-1 scanner) enforce it *deterministically and forever* — no model recall in the loop. This is also what makes annual R4 re-validation cheap: when a statute amends a value, you change one assertion, and the gate flips. (Worked pattern: `workflow/07-r4-regulatory-research/03-citation-conventions.md` § From citation to executable assertion.)

**Defect-specifiability lens.** Different defect classes are catchable only by different instruments, so each maps to the phase equipped for it:

| Defect class | Only catchable via | ZeeSpec phase |
|--------------|--------------------|---------------|
| Convention defect (wrong threshold / deadline / enum rule) | External spec — value isn't in the code | **R4 → deterministic check → B1/CI gate** |
| Structural defect (race, dead code, broken algorithm, cross-cutting incoherence) | Reading the code's own logic | **R1 + R2** |
| Quantitative drift (field/enum/LOC/line counts) | Mechanical count vs production | **B1** |

The lens — that some defects are *specifiable* only against an external spec while others are inferable from code — is borrowed from a defect-specifiability taxonomy preprint (arXiv:2603.25773). Cite it honestly: it is **non-peer-reviewed, single-author, and Claude-implemented** — directional framing, not evidence. The mapping above is the actionable takeaway; the citation is not a claim of proof.


## 4. Status Tagging Convention

Every claim about production state MUST carry one of these tags:

> **What the tags really measure (Zachman framing):** the gap between the **Builder** row (the design the spec describes) and the **Operations** row (what actually runs in production) — see the § 1 row map. ✅ IMPL = Builder ≡ Operations · 🟡 PARTIAL = partially bridged · 🚧 DESIGN / NOT-ENFORCED / BROKEN = Builder ≠ Operations. The `file:line` citation is the evidence the bridge exists.

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

### Versioning convention (package vs per-file)

ZeeSpec carries versions at two scopes — keep them distinct so per-file skew is not mistaken for drift:

- **Package version** — the methodology release as a whole. It is the shared frontmatter `version:` of the **core docs** (`METHODOLOGY.md` · `README.md` · `EXPLAINED-FOR-PRESENTATIONS.md` · `PORTING-GUIDE.md`), which `scripts/dogfood-drift-scan.sh` enforces are equal.
- **Per-file `version:`** — each workflow / checklist / template / overlay file's *own* revision. It is **independent** and is NOT expected to match the package version; a guide unchanged since `1.0.0` correctly stays at `1.0.0`.

Bump a file's `version:` only when that file changes; never mass-bump per-file versions to match a package release. The dogfood scan enforces agreement only across the core docs — per-file skew below them is intentional, not drift.

## 7. The Two-Layer Architecture (Stack Independence)

The biggest design choice in ZeeSpec v2: **separate the language-agnostic spec from the stack-specific binding**.

> **In Zachman terms:** Layer 1 is the **Designer / Logical** row; Layer 2 (`where.md § 5`) is the **Builder / Physical** row. Porting to a new stack = re-deriving the Physical row from an unchanged Logical row. (See § 1 row map.)

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

## 8. The 5 Authoring Reflexes

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
| 🔵 Drafting | Initial authoring (Tier 0 Lite or full 10-file); not yet verified | None |
| 🟡 Design-intent | B1 + R3 done; R1+R2 may have run; gaps tracked | Author + 1 reviewer |
| 🟢 Active | All P0 gaps resolved; production-validated; periodic R3 re-run | Tier 1 promotion + ≥1 quarter stable |
| 📦 Archive | Deprecated module; kept for reference | Module sunset decision |

Most modules sit at 🟡 Design-intent for an extended period — that's healthy.

> **Maturity is orthogonal to weight.** This table answers *how verified* a module is; § 2a answers *how many files* it carries. A Lite (3-file) module can be 🟢 Active and a Full (10-file) module can be 🔵 Drafting — the two axes move independently.

## 14. Cost Per Module (observed in one 5-module pilot — N=1)

> **Honesty caveat (N=1):** these are *pilot observations* from a single author on a single project, not independently-validated ROI. Treat them as directional, not proven. Building an evidence base beyond N=1 is exactly what the metrics loop (`ZACHMAN-ALIGNMENT.md` Tier 1·1C) is for — capture these factors per version in `templates/_meta/metrics-loop.md` and compare rows so each methodology change is judged on whether it actually helped.

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

> **If you do use it, start light.** The default entry is the **Lite weight (~3 files)**, not the full 10 — promote a module to Standard or Full only when the § 2a decision matrix says so. "Lightweight specs" above means exactly this: Lite weight, not a different methodology.

## 16. Glossary of ZeeSpec Terms

**Workflow terms:**
- **Tier 1 promotion** — the 5-phase Author + B1 + R3 + R1+R2 + apply workflow
- **B1 verification** — Baseline verification, layer 1; quantitative grep against production code (entity field counts, enum cases, LOC, line refs). Runs in ~30 min before deeper review phases.
- **R3 deep verifier** — same-session line-by-line check; reads each ZeeSpec file end-to-end + production code; catches AccountStatus-pattern false positives. ~1-2 hours.
- **R1 reviewer** — independent algorithm + race condition + invariant correctness reviewer; runs in parallel with R2.
- **R2 reviewer** — independent compliance + audit + cross-module reviewer; runs in parallel with R1.
- **R1+R2 parallel** — both agents dispatched simultaneously; results merged after they finish.
- **Authoring reflexes** — 5 verification checks applied during authoring (entity, method, invariant, cross-link, logging) to prevent the most common drift classes. *(Distinct from the **R6 ADR-curator agent** — § 3b; the "R6" name there is unrelated.)*

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
**Piloted (N=1):** Across 5 production modules in a compliance-heavy financial domain (single-pilot observations — see § 14)
