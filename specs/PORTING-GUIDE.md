# ZeeSpec Porting Guide — Adapt to Your Stack

> The 10-file ZeeSpec format is **language-agnostic by design**. Porting from one stack to another requires rewriting ONE file (where.md § 5). This guide explains how.

## What's stack-specific?

| File | Stack-specific? |
|------|:---------------:|
| `CLAUDE.md` | Partially — service class names + line refs |
| `why.md` | NO — domain logic only |
| `what.md` | Partially — ORM annotations in § 2; entity concepts stack-neutral |
| `how.md` | NO if pseudocode; YES if you embed actual class names |
| `who.md` | Partially — role names |
| `when.md` | NO — timing semantics |
| `where.md` § 1-4 | NO — storage roles |
| `where.md` § 5 | **YES — the only fully stack-specific section** |
| `gravity.md` | NO — cross-dim constraints are language-agnostic |
| `gaps.md` | Partially — file paths in citations |
| `glossary.md` | NO — domain terms |

**Rule of thumb:** If a paragraph names a framework (Symfony / Spring / Django / Express / Rails), it belongs in `where.md` § 5. If it names a concept (transaction / queue / cache / event), it belongs in the conceptual layer.

## Step-by-step port

### 1. Copy the methodology (5 minutes)

```bash
# From your project root
cp -r ~/zeespec-methodology/specs your-project/docs/specs/zeespec
```

### 2. Configure your AI agent (2 minutes)

Add to your project's `CLAUDE.md` / `AGENTS.md` / `GEMINI.md`:

```markdown
## Spec methodology

This project uses ZeeSpec (10-file Zachman-derived format) for module specifications.
Read `docs/specs/zeespec/workflow/00-START-HERE.md` BEFORE generating code that touches
any module with a ZeeSpec directory.

When writing or modifying production code:
- Cite invariant IDs in comments (`// INV-X-04`, `// HW-X-08`, `// ADR-X-013`)
- If an OPEN gap blocks you → STOP, ask user
- Status tags: ✅ IMPL = production-verified; 🟡 PARTIAL = app-layer only;
  🚧 DESIGN = NOT implemented (do not write code relying on it)
```

### 3. Initialize your first module (15 minutes)

```bash
# Pick your highest-risk module first
MODULE=your-critical-module-name
MOD_PREFIX=YOURMOD   # 3-7 chars ALL CAPS for ID prefixing (INV-YOURMOD-NN, HW-YOURMOD-NN)

# Scaffold from template
cp -r docs/specs/zeespec/templates/_template docs/specs/zeespec/$MODULE
cd docs/specs/zeespec/$MODULE

# Replace BOTH placeholders.
# Portable sed pattern (works on macOS BSD sed + Linux GNU sed):
grep -rl 'MODULE_NAME' . | xargs sed -i.bak "s/MODULE_NAME/$MODULE/g"
grep -rl 'MOD_PREFIX' . | xargs sed -i.bak "s/MOD_PREFIX/$MOD_PREFIX/g"
find . -name '*.bak' -delete

# macOS-only alternative if you're sure: sed -i '' "s/.../"
# Linux-only alternative: sed -i "s/.../"
```

### 4. Author the module (4-6 hours)

Follow `workflow/01-authoring-checklist.md`. Read existing docs + production code first.

### 5. Run B1 + R3 + R1+R2 reviews (3-4 hours)

Follow `workflow/02-b1-verification.md` through `workflow/04-r1-r2-parallel-review.md`.

## Stack-specific examples

### PHP / Symfony (original pilot stack)

```markdown
# where.md § 5
## 5.1 Backend runtime
- PHP 8.2 + Symfony 6.4 + API Platform 4.2 + Doctrine ORM 3.5
- Symfony Validator + Symfony Messenger 6.4

## 5.2 Relational database
- PostgreSQL 15
- Tables: notifications (18 fields), device_tokens (15 fields)

## 5.3 Async transports
- Symfony Messenger 6.4 with Redis transport
- Routing: App\Message\SendSMSMessage → sms_high_priority
```

### Go / gRPC / DynamoDB

```markdown
# where.md § 5
## 5.1 Backend runtime
- Go 1.22 + grpc-go v1.62 + protobuf v1.33
- Validator v10

## 5.2 Document database
- DynamoDB single-table design
- Partition key: PK = "NOTIF#${userId}"; sort key: SK = "${timestamp}#${channel}"

## 5.3 Async transports
- AWS SQS with FIFO queues
- Routing: SendSMSCommand → notification-sms-high.fifo
```

### Python / FastAPI / SQLAlchemy

```markdown
# where.md § 5
## 5.1 Backend runtime
- Python 3.12+ + FastAPI 0.109 + SQLAlchemy 2.0 + Alembic
- Pydantic V2 + python-jose

## 5.2 Relational database
- PostgreSQL 15
- Models: notifications (18 fields), device_tokens (15 fields)

## 5.3 Async transports
- Celery 5 with Redis broker
- Routing: send_sms_task → sms_high_priority queue
```

### TypeScript / NestJS / Prisma

```markdown
# where.md § 5
## 5.1 Backend runtime
- Node.js 20 + NestJS 10 + Prisma 5 + TypeScript 5.3

## 5.2 Relational database
- PostgreSQL 15
- Models: Notification (18 fields), DeviceToken (15 fields)

## 5.3 Async transports
- BullMQ on Redis
- Routing: SendSMSJob → sms-high-priority queue
```

### Rust / Axum / Diesel

```markdown
# where.md § 5
## 5.1 Backend runtime
- Rust 1.75 + axum 0.7 + diesel 2.1 + tokio 1.36

## 5.2 Relational database
- PostgreSQL 15
- Tables: notifications (18 fields), device_tokens (15 fields)

## 5.3 Async transports
- lapin (RabbitMQ client)
- Routing: SendSmsCommand → notification.sms.high_priority exchange
```

## Adapting numbering to your domain

If your module names differ, adjust:

| Original (financial) | Your domain | Example |
|----------------------|-------------|---------|
| `INV-NOTIF-NN` | `INV-<YOUR-MOD>-NN` | `INV-INVENTORY-04` |
| `HW-ACC-NN` | `HW-<YOUR-MOD>-NN` | `HW-CHECKOUT-07` |
| `ADR-WAL-NNN` | `ADR-<YOUR-MOD>-NNN` | `ADR-ORDERS-012` |

Pick 3-7 character ALL CAPS module prefixes. Be consistent across all 10 files.

## Adapting severity matrix to your domain

The default severity matrix (P0/P1/P2/P3) maps to:

| Default | Financial domain | E-commerce | Healthcare |
|---------|------------------|------------|------------|
| P0 | Compliance violation, money loss | Cart abandonment ≥5% impact | Patient safety, HIPAA breach |
| P1 | AML/FRC gap, audit failure | Conversion drop, payment bug | PHI exposure, GDPR breach |
| P2 | Operational friction | UX paper cut, A/B test loss | Workflow inefficiency |
| P3 | Documentation drift | Style issue | Code quality |

Customize `checklists/severity-matrix.md` for your domain.

## Adapting compliance reviewers (R2)

The R2 reviewer prompt in `workflow/04-r1-r2-parallel-review.md` mentions:
- Mongolia FRC (Financial Regulatory Commission)
- 7-year retention per Mongolia AML law
- CTR threshold (20M MNT)

**Adapt these to your jurisdiction:**

| Original | EU | US | India |
|----------|-----|-----|-------|
| FRC | ESMA / national regulator | SEC / FINRA | SEBI |
| 7-year retention | GDPR Article 17 + sector-specific | Sarbanes-Oxley 7 years | DPDPA 2023 + IT Act |
| CTR 20M MNT | Currency Transaction Report €10K | CTR $10K | Cash Transaction Report ₹10L |

For non-financial domains:
- **E-commerce:** GDPR / CCPA / state privacy laws + PCI-DSS for payments
- **Healthcare:** HIPAA (US) / Data Protection Act (UK) / GDPR Article 9
- **Government:** FedRAMP / FISMA / ISO 27001

## Reviewer agent prompts (stack-aware adaptation)

The R1/R2 reviewer prompts in `workflow/04-r1-r2-parallel-review.md` include hardcoded file extensions and conventions. Adapt:

| Original (PHP) | Adapt for your stack |
|----------------|---------------------|
| `grep -c "#\[ORM\\\\Column"` | `rg "@Column"` (Java/Spring) OR `rg "Field("` (Pydantic) |
| `composer require X` | `go get`, `pip install`, `npm install`, `cargo add` |
| `php bin/console` | your CLI runner |
| `Doctrine ORM` | Hibernate / SQLAlchemy / Prisma / Diesel |

## Optional: ZeeSpec linter

You can build a simple linter to catch common drift:

```bash
#!/usr/bin/env bash
# bin/zeespec-lint <module-dir>

DIR=${1:-.}

# Check all 10 files exist
for f in CLAUDE.md why.md what.md how.md who.md when.md where.md gravity.md gaps.md glossary.md; do
  [[ -f "$DIR/$f" ]] || echo "MISSING: $DIR/$f"
done

# Check frontmatter version + status
for f in "$DIR"/*.md; do
  head -10 "$f" | grep -q "version:" || echo "NO version: in $f"
  head -10 "$f" | grep -q "status:" || echo "NO status: in $f"
done

# Check at least 1 OPEN gap is severity-tagged
grep -E "🔴 OPEN|🚧" "$DIR/gaps.md" | grep -q "P0\|P1\|P2\|P3" || echo "$DIR/gaps.md has unstaged gaps"

# Check gravity.md HW entries cite production
grep -c "^### HW-" "$DIR/gravity.md" || echo "$DIR/gravity.md has no HW entries"
```

## FAQ

**Q: Do I have to use all 10 files for every module?**
A: No. Greenfield/Tier-0 modules can start with `CLAUDE.md + what.md + how.md` and grow.

**Q: Can I split a large module into sub-modules?**
A: Yes. Each becomes its own 10-file ZeeSpec directory. Use bidirectional cross-link rule.

**Q: My module has 100+ fields/methods. How do I keep what.md/how.md readable?**
A: Use tables (markdown). For very large enums, summarize groups and link to a separate `_enum_<name>.md` file.

**Q: How do I migrate existing 4-file canonical specs (CLAUDE/decisions/implementation/prompts)?**
A: Keep the 4-file canonical alongside ZeeSpec. ZeeSpec supplements; doesn't replace. Mark ZeeSpec as "exploratory" until validated.

**Q: What if my AI agent doesn't read all 10 files?**
A: Use `CLAUDE.md` § "Read order" to enforce sequence. Optionally add `read order: [...]` to frontmatter as a hint.

**Q: How do I get my team to maintain the specs?**
A: Pair authoring + ZeeSpec linting in CI + PR-checks that block merge if status tags are missing.

## Next: read `workflow/00-START-HERE.md`
