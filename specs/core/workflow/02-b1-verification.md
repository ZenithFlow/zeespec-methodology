---
doc: core/workflow/02-b1-verification
type: workflow-checklist
phase: B1-quantitative-drift
version: 2.3.0
status: stable
last_updated: 2026-05-18
---

# B1 Verification — Quantitative Drift Check

> Time: 30 minutes per module. Run after initial authoring AND when re-validating an aged spec.

## Purpose

Catch quantitative drift between spec claims and production code:
- Entity field counts (spec says 18; production has 22?)
- Enum case counts (spec says 39; production has 45?)
- Service LOC growth (spec says 893; production has 978?)
- Line refs (spec cites line 265; method now at 397?)

This is **fast, mechanical, AI-friendly** — perfect for a 30-min B1 phase.

## Inputs

- The 10-file ZeeSpec for the module
- Read access to production source code

## Checklist

### 1. Entity field counts (10 min)

For each entity in `what.md` § 1:

**Generic recipe:**
1. Identify the source-of-truth file for the entity (the model/entity definition)
2. Count its declared fields/columns/properties
3. Count its declared relationships (ManyToOne, OneToOne, OneToMany, ManyToMany, FK, ref)
4. Sum: total fields = columns + relationships

Compare the production count to spec's claimed count. Document drift:

```
| Entity   | Spec claim | Production | Drift            |
|----------|------------|------------|------------------|
| ModelA   | 18         | 18         | ✅                |
| ModelB   | 17         | 15         | ⚠️ -2 (spec stale) |
```

**Stack-specific grep patterns (pick the one matching your stack):**

| Stack | Count columns | Count relationships |
|-------|---------------|---------------------|
| Java + JPA/Spring | `rg "@Column" model.java \| wc -l` | `rg "@(One\|Many)To(One\|Many)" model.java \| wc -l` |
| Python + SQLAlchemy | `rg "= Column\(" model.py \| wc -l` | `rg "= relationship\(" model.py \| wc -l` |
| Python + Pydantic/SQLModel | `rg ": .* = Field" model.py \| wc -l` | `rg "Relationship\(" model.py \| wc -l` |
| TypeScript + Prisma | count fields between `model X {` and `}` in `schema.prisma` | `@relation` blocks within the same model |
| TypeScript + TypeORM | `rg "@Column" entity.ts \| wc -l` | `rg "@(One\|Many)To(One\|Many)" entity.ts \| wc -l` |
| Go + GORM | `rg "gorm:" model.go \| wc -l` | `rg "foreignKey:\|references:" model.go \| wc -l` |
| Go + sqlc/raw | count fields in struct declaration | FKs declared in SQL schema |
| Rust + Diesel | `rg "-> " schema.rs \| wc -l` (within `table!`) | `joinable!` macros |
| C# + EF Core | `rg "public .* { get;" entity.cs \| wc -l` | navigation properties (`virtual ICollection<X>`) |
| Ruby + ActiveRecord | columns from migrations / `db/schema.rb` | `belongs_to / has_many / has_one` declarations |
| PHP + Doctrine | `rg "#\[ORM\\\\Column" entity.php \| wc -l` | `rg "#\[ORM\\\\(Many\|One)To(One\|Many)" entity.php \| wc -l` |

### 2. Enum / type case counts (5 min)

**Generic recipe:** count the declared values/variants in your enum/type.

**Stack-specific:**

| Stack | Count enum cases |
|-------|------------------|
| Java | `rg "^\s*[A-Z_]+(,\|\()" Enum.java \| wc -l` |
| Python (`Enum`) | `rg "^\s+[A-Z_]+\s*=" enum.py \| wc -l` |
| TypeScript | members of `enum X { ... }` block OR string-union literal count |
| Go | const block entries under typed `type X int` |
| Rust | variants of `enum X { ... }` |
| C# | members of `public enum X { ... }` |
| Ruby | constants in module / `enum :x, [:a, :b]` declarations |
| PHP 8.1+ | `rg "^\s*case " Enum.php \| wc -l` |

Document drift in your B1 findings.

### 3. Service LOC + public-method count (5 min)

**Generic recipe:**
- LOC: `wc -l <service-file>` (or equivalent)
- Public methods: count the public/exported function declarations

Spec usually claims something like "X service, ~Y LOC, Z public methods". Verify.

**Stack-specific public-function patterns:**

| Stack | Public-function count |
|-------|----------------------|
| Java/C# | `rg "^\s*public " ServiceFile \| wc -l` |
| Python | `rg "^\s{0,4}def [a-z]" service.py \| wc -l` (top-level, no underscore prefix) |
| TypeScript | `rg "^\s*(public \|export )(async )?[a-zA-Z]" service.ts \| wc -l` |
| Go | `rg "^func \(.*\) [A-Z]" service.go \| wc -l` (capitalized = exported) |
| Rust | `rg "^\s*pub fn " service.rs \| wc -l` |
| Ruby | `rg "^\s*def [a-z]" service.rb \| wc -l` |
| PHP | `rg "public function" service.php \| wc -l` |

### 4. Cited line refs (10 min)

For each `file:line` citation in the spec, verify the method still lives there.

**Generic recipe:** grep for the method/function declaration, compare line number to the spec citation.

```bash
# Generic example (adjust regex per language):
grep -n "<your-language-method-pattern>" <file-path>
# Compare to spec's cited line. If drift > 50 lines, file as B1 finding.
```

Run this for ~5-10 most-cited methods (focus on `CLAUDE.md` references). If drift > 50 lines, file as B1 finding.

### 5. Enum/method existence (5 min)

For each cited method/enum case in spec:

```bash
# Generic: grep for the symbol; empty result = phantom (file as R1 finding)
grep "<symbol-pattern>" <file>
```

A phantom (spec cites it but production doesn't have it) is an R1 finding — file it.

### 6. Invariant test-pointer coverage (5 min)

In `what.md` § 5, count invariants whose violation would be 🚨 P0 / 🟠 P1 (per
`core/checklists/severity-matrix.md`) but whose `Test` cell is `—` / empty — no test
`file:line`, no executable assertion. Report as **"P0/P1 INV without test pointer: N"**;
it feeds the same-named `metrics-loop.md` column. Target 0; each miss needs a tracking gap.

## Output: B1 Findings Section

Add to `CLAUDE.md` under "ACTIVE ISSUES":

```markdown
### B1 re-verification YYYY-MM-DD (production grep against original baseline)

| Claim | Baseline | Production | Drift |
|-------|----------|-----------|-------|
| ReferenceType cases | 39 | **40** | +1 |
| FundJournalService LOC | 3,965 | **4,562** | +597 (+15%) |
| AccountingService LOC | 893 | **978** | +85 |
| Journal entity fields | (not recorded) | **33** | new info |
| P0/P1 INV w/o test pointer | (not tracked) | **3** | new metric |
| (etc.) | | | |
```

## When to escalate to R3

If B1 finds:
- Any cited method missing (phantom) → ESCALATE to R3 immediately
- LOC growth > 30% since spec author date → spec is significantly stale
- Enum count drift > 5 cases → spec is significantly stale
- ≥3 line-ref drifts > 100 lines → spec is significantly stale

In these cases, treat the spec as Tier 0 rather than Tier 1 — needs full re-authoring of affected sections.

## Output: commit message

```
B1 re-verification of <module> ZeeSpec — N drift items

- Entity counts updated
- Enum cases updated (39 → 45)
- LOC growth +X% noted
- Line refs corrected for Y methods

No production code changes. Spec drift only.
```

## Next: 03-r3-deep-review.md
