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

```bash
# Example (PHP/Doctrine)
ENTITY=Notification
COLS=$(grep -c "#\[ORM\\\\Column" backend/src/Entity/$ENTITY.php)
MTO=$(grep -c "#\[ORM\\\\ManyToOne" backend/src/Entity/$ENTITY.php)
OTO=$(grep -c "#\[ORM\\\\OneToOne" backend/src/Entity/$ENTITY.php)
echo "$ENTITY: Column=$COLS, ManyToOne=$MTO, OneToOne=$OTO, Total=$((COLS + MTO + OTO))"
```

Adapt for your stack:
- **Java/Spring:** `rg "@Column" Entity.java | wc -l`
- **Python/SQLAlchemy:** `rg "Column\(" model.py | wc -l`
- **TypeScript/Prisma:** count fields in `schema.prisma` model block
- **Go/GORM:** `rg "gorm:" model.go | wc -l`

Compare to spec's claimed count. Document drift:

```markdown
| Entity | Spec claim | Production | Drift |
|--------|------------|------------|-------|
| Notification | 18 | 18 | ✅ |
| DeviceToken | 17 | 15 | ⚠️ -2 (spec stale) |
```

### 2. Enum case counts (5 min)

```bash
# PHP
ENUM=NotificationType
grep -c "case " backend/src/Enum/Notification/$ENUM.php

# Adapt:
# Java:  grep -c "^\s*[A-Z_]*," Enum.java
# Python: rg "^\s+[A-Z_]+\s*=" enum.py
# Go: count const block lines
```

Document drift in your B1 findings.

### 3. Service LOC + public method count (5 min)

```bash
SERVICE=NotificationService
wc -l backend/src/Service/Notification/$SERVICE.php
grep -c "public function" backend/src/Service/Notification/$SERVICE.php
```

Spec usually claims something like "X service, ~Y LOC, Z public methods". Verify.

### 4. Cited line refs (10 min)

For each `file:line` citation in the spec, verify the method still lives there:

```bash
# Spec says: AccountingService::createJournal at line 253
grep -n "public function createJournal\|private function createJournal" \
  backend/src/Service/Accounting/AccountingService.php
# Production output: 263 — drift of +10 lines
```

Run this for ~5-10 most-cited methods (focus on `CLAUDE.md` references). If drift > 50 lines, file as B1 finding.

### 5. Enum/method existence (5 min)

For each cited method/enum case in spec:

```bash
# Spec says: ReferenceType::DIVIDEND_ACCRUAL
grep "case DIVIDEND_ACCRUAL" backend/src/Enum/Accounting/ReferenceType.php
# Empty result = phantom enum case → R1 finding
```

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
