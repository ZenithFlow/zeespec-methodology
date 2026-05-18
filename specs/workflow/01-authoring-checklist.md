---
doc: workflow/01-authoring-checklist
type: workflow-checklist
phase: author
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# Authoring a New ZeeSpec Module (Tier 0 → Tier 1)

> Total time: 4-6 hours for module + 3-4 hours for review = ~8 hours per module to reach Tier 1.

## Prerequisites

- [ ] Module is non-trivial (≥3 entities OR ≥500 LOC OR cross-cuts ≥2 sibling modules)
- [ ] Existing canonical docs (4-file or similar) — read them first
- [ ] Production code accessible — you'll grep + read it extensively
- [ ] Module name decided (3-7 char ALL CAPS prefix)

## Phase 1: Setup (15 min)

```bash
MODULE=your-module-name
MOD_PREFIX=YOURMOD   # 3-7 chars ALL CAPS for ID prefixing (INV-YOURMOD-NN)

# Scaffold from template
cp -r docs/specs/zeespec/templates/_template docs/specs/zeespec/$MODULE
cd docs/specs/zeespec/$MODULE

# Replace placeholders (portable sed — works on macOS BSD + Linux GNU)
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/$MOD_PREFIX/g"

# Update frontmatter dates
TODAY=$(date +%Y-%m-%d)
grep -rl 'YYYY-MM-DD' . | xargs sed -i.bak "s/YYYY-MM-DD/$TODAY/g"

# Clean up backup files
find . -name '*.bak' -delete

# (macOS-only alternative: sed -i '' "s/.../"  ;  Linux-only: sed -i "s/.../"
#  The .bak variant works on both.)
```

## Phase 2: Read existing canonical docs (30 min)

- [ ] Read existing 4-file canonical (CLAUDE/decisions/implementation/prompts) if exists
- [ ] Read `docs/features/<module>/system.md` if exists
- [ ] Read sibling modules' specs that cross-link to this one
- [ ] Make notes of contradictions, drift, unclear sections

## Phase 3: Author `why.md` (45 min)

Goal: Capture WHY this module exists. Strategic context first.

- [ ] § 1 Strategic goals (3-8 goals; G-MOD-NN)
- [ ] § 2 Business rules (BR-MOD-NN catalog)
- [ ] § 3 Compliance drivers (which regulations apply?)
- [ ] § 4 Cross-module dependencies (depends on / depended on by)
- [ ] § 5 Trade-offs (decision matrix: choice vs rejected vs reason)
- [ ] § 6 Risks (R-MOD-NN with Probability × Impact × Mitigation)
- [ ] § 7 Status overview (count Mitigated/Partial/Open risks)

## Phase 4: Author `what.md` (60 min)

Goal: Capture every entity, attribute, invariant.

- [ ] § 1 Entity inventory table (entity / table / role)
- [ ] § 2-N Per-entity attribute tables (field / type / domain / constraint)
- [ ] § N+1 Enums (each enum: case list + use)
- [ ] § N+2 Invariants (INV-MOD-NN with Status tag + Source citation)
- [ ] § N+3 Relationships (cardinality matrix)
- [ ] § N+4 Domain rules summary

**Critical: every invariant claim MUST have a Status tag AND a Source.** Without these, R3 will downgrade.

## Phase 5: Author `how.md` (60 min)

Goal: Capture every algorithm + state machine + validation rule.

- [ ] § 1 Dispatch/process overview (ASCII diagrams help)
- [ ] § 2-N Per-algorithm pseudocode (ALG-MOD-NN) — language-agnostic
- [ ] § N+1 State machines (PENDING → ACTIVE → ...)
- [ ] § N+2 Process flows (P-MOD-NN with step-by-step)
- [ ] § N+3 Validation tables (V-MOD-NN)
- [ ] § N+4 Cross-references to dimensions

**Critical: pseudocode, not source code.** Stack specifics belong in `where.md` § 5.

## Phase 6: Author `who.md` (30 min)

- [ ] § 1 Actor inventory (A-MOD-NN: end-user / system / operator / admin / external — use your domain's role names, e.g., customer / fund manager / nurse / sales-rep)
- [ ] § 2 RBAC matrix (operation × role × allowed?)
- [ ] § 3 Segregation of Duties (SOD-MOD-NN — two-eyes principle, etc.)
- [ ] § 4 Surface-level auth gates (API endpoint × role × notes)
- [ ] § 5 Auth flow integration
- [ ] § 6 Compliance + audit responsibilities

## Phase 7: Author `when.md` (30 min)

- [ ] § 1 Trigger conditions (T-MOD-NN)
- [ ] § 2 Retry intervals + budgets per transport
- [ ] § 3 Scheduled jobs (cron table)
- [ ] § 4 SLA targets
- [ ] § 5 Channel-specific timing
- [ ] § 6 State machine timing (when transitions fire)

## Phase 8: Author `where.md` (60 min)

- [ ] § 1 Storage role inventory (S-MOD-NN — language-agnostic)
- [ ] § 2 Data domain map (ASCII or mermaid)
- [ ] § 3 Cross-module storage dependencies
- [ ] § 4 Failure-mode storage semantics (F-MOD-W-NN)
- [ ] **§ 5 Tech Stack Binding** — the ONLY stack-specific section
  - 5.1 Backend runtime
  - 5.2 Relational/document database
  - 5.3 Async transports
  - 5.4 Service classes (production)
  - 5.5 Message + handler classes
  - 5.6 Enums
  - 5.7 External provider integration
  - 5.8 Auth + RBAC
  - 5.9 Commands
  - 5.10 Configuration sources

## Phase 9: Author `gravity.md` (45 min)

> The crown jewel. Spend time here.

- [ ] § 0 Status overview table (every HW-MOD-NN with Status + Reliability)
- [ ] § 1-N Per-HW entries with:
  - **Dimensions** (which 2+ does it cross?)
  - **Statement** (one-line invariant)
  - **Implementation status** (✅/🟡/🚧)
  - **Reality** (what production actually does)
  - **Failure mode if violated**
  - **Codification** (which ADR / file:line)
- [ ] § N+1 Downstream inheritance (which sibling specs inherit)
- [ ] § N+2 Upstream gravity (what we inherit)
- [ ] § N+3 Anti-gravity (what is NOT hardwired — explicit non-rules)
- [ ] § N+4 Hardwiring summary table

## Phase 10: Author `gaps.md` (30 min)

- [ ] Header: severity matrix table
- [ ] Status legend (🔴 OPEN / 🟡 PROPOSED / 🟢 RESOLVED / ⚪️ DEFERRED / 📌 BY-DESIGN)
- [ ] § Summary table (ID / title / status / severity)
- [ ] § Gap details (each gap has: question / current behavior / impact / suggested resolution / owner)
- [ ] § Severity matrix application (how AI should behave for each)
- [ ] § Cross-references

## Phase 11: Author `glossary.md` (30 min)

- [ ] Domain terms (e.g., "Channel" in our context)
- [ ] Technical terms (e.g., "Async dispatch" = sync if no message bus injected)
- [ ] Stack-specific terms (third-party SDKs, vendor product names — e.g., the email/SMS providers your module integrates with)
- [ ] Cross-spec terms (acronyms shared across modules — e.g., your regulator's name, your AML/KYC acronyms)

## Phase 12: Author `CLAUDE.md` (30 min)

> Last, because it summarizes everything else.

- [ ] Frontmatter (module / type=entry-point / version / status / last_updated)
- [ ] Module description (one paragraph)
- [ ] **⚠️ ACTIVE ISSUES** section (drift items + open P0/P1)
- [ ] **Read order** (1-10 numbered list of all 10 files)
- [ ] **Key architectural decisions** (ADR table)
- [ ] **Cross-module dependencies** (downstream + upstream tables)
- [ ] **When you write code** (citation rules + status tag behavior)
- [ ] **Tech stack** (one-paragraph reference to where.md § 5)
- [ ] **Source documents** (production code + canonical docs + cross-spec)

## Final check before promotion

- [ ] All 10 files exist + non-empty
- [ ] Frontmatter version + status set
- [ ] No `TODO` or `TBD` left in body text
- [ ] No `MODULE_NAME` placeholder left
- [ ] Every invariant has a Status tag
- [ ] Every ADR has Status (ACCEPTED/DEFERRED/SUPERSEDED)
- [ ] Every OPEN gap has severity tag

## Promotion to Tier 1

After all 10 files are authored, run:
1. `02-b1-verification.md` — quantitative drift check
2. `03-r3-deep-review.md` — same-session deep verifier
3. `04-r1-r2-parallel-review.md` — parallel independent reviewers
4. `05-apply-findings.md` — fold findings back
5. `06-spawn-task-chips.md` — delegate production bugs

Commit each phase separately so you can revert if needed.
