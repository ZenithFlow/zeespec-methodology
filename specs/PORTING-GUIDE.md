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

**Rule of thumb:** If a paragraph names a framework (Spring / Django / Express / Rails / NestJS / FastAPI / axum / Symfony), it belongs in `where.md` § 5. If it names a concept (transaction / queue / cache / event), it belongs in the conceptual layer.

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

## Stack-specific examples — `where.md` § 5

> The examples below are **rotational templates**, not normative. Pick the one matching your stack OR use as a model for an unlisted stack. ZeeSpec itself is stack-neutral; only `where.md` § 5 is stack-specific.

### Go (e.g., grpc-go + DynamoDB + AWS SQS)

```markdown
# where.md § 5
## 5.1 Backend runtime
- Go <version> + <RPC framework> + <protobuf/codec>
- <validation library>

## 5.2 Persistence layer
- <document or relational DB> + schema design
- Tables/collections: <entity> (N fields), <entity> (M fields)

## 5.3 Async transports
- <queue technology>
- Routing: <message type> → <destination>
```

### Java (e.g., Spring Boot + JPA + Kafka)

```markdown
# where.md § 5
## 5.1 Backend runtime
- Java <version> + Spring Boot <version> + Hibernate/JPA <version>
- <validation library>

## 5.2 Persistence layer
- <DB engine + version>
- Entities: <entity> (N fields), <entity> (M fields)

## 5.3 Async transports
- <Kafka / RabbitMQ / SQS> with <client library>
- Routing: <message class> → <topic/queue>
```

### Python (e.g., FastAPI + SQLAlchemy + Celery)

```markdown
# where.md § 5
## 5.1 Backend runtime
- Python <version> + <web framework> + <ORM> + <migrations tool>
- <validation library>

## 5.2 Persistence layer
- <DB engine + version>
- Models: <entity> (N fields), <entity> (M fields)

## 5.3 Async transports
- <task queue + broker>
- Routing: <task function> → <queue name>
```

### Rust (e.g., axum + Diesel + RabbitMQ)

```markdown
# where.md § 5
## 5.1 Backend runtime
- Rust <version> + <web framework> + <ORM> + <async runtime>

## 5.2 Persistence layer
- <DB engine + version>
- Tables: <entity> (N fields), <entity> (M fields)

## 5.3 Async transports
- <queue client library>
- Routing: <command type> → <exchange/queue>
```

### TypeScript (e.g., NestJS + Prisma + BullMQ)

```markdown
# where.md § 5
## 5.1 Backend runtime
- Node.js <version> + <web framework> + <ORM> + TypeScript <version>

## 5.2 Persistence layer
- <DB engine + version>
- Models: <Entity> (N fields), <Entity> (M fields)

## 5.3 Async transports
- <queue technology>
- Routing: <job type> → <queue name>
```

### PHP (e.g., Symfony + Doctrine + Symfony Messenger) — the original pilot stack

```markdown
# where.md § 5
## 5.1 Backend runtime
- PHP <version> + <framework + version> + <ORM + version>
- <validation library>

## 5.2 Persistence layer
- <DB engine + version>
- Tables: <entity> (N fields), <entity> (M fields)

## 5.3 Async transports
- <message bus library + transport>
- Routing: <message class> → <transport name>
```

### Other stacks

Use any of the above as a template. The shape is the same regardless of stack:
- 5.1 Backend runtime
- 5.2 Persistence layer
- 5.3 Async transports
- 5.4 Service classes (whatever your project calls them)
- 5.5 Message + handler classes (if applicable)
- 5.6 Enums / typed constants
- 5.7 External provider integrations
- 5.8 Auth + RBAC
- 5.9 CLI commands
- 5.10 Configuration sources

If your stack doesn't have one of these (e.g., no async transports because the module is synchronous), omit the subsection.

## Adapting numbering to your domain

If your module names differ, adjust:

| Original (financial) | Your domain | Example |
|----------------------|-------------|---------|
| `INV-NOTIF-NN` | `INV-<YOUR-MOD>-NN` | `INV-INVENTORY-04` |
| `HW-ACC-NN` | `HW-<YOUR-MOD>-NN` | `HW-CHECKOUT-07` |
| `ADR-WAL-NNN` | `ADR-<YOUR-MOD>-NNN` | `ADR-ORDERS-012` |

Pick 3-7 character ALL CAPS module prefixes. Be consistent across all 10 files.

## Adapting severity matrix to your domain

The severity matrix (P0/P1/P2/P3) is jurisdiction- and domain-neutral. Per-domain calibration examples (illustrative, not normative):

| Generic baseline | Regulated finance (example) | E-commerce | Healthcare |
|------------------|------------------------------|------------|------------|
| P0 Compliance violation, money loss | Money loss, regulator-reportable misfile | Cart abandonment ≥5% impact | Patient safety, HIPAA / GDPR Art. 9 breach |
| P1 Audit gap, missing guard | AML / regulatory audit failure | Conversion drop, payment bug | PHI exposure, privacy-law breach |
| P2 Drift, stale refs | Operational friction | UX paper cut, A/B test loss | Workflow inefficiency |
| P3 Style, cleanup | Documentation drift | Style issue | Code quality |

Customize `checklists/severity-matrix.md` for your domain.

## Adapting compliance reviewers (R2)

The R2 reviewer prompt in `workflow/04-r1-r2-parallel-review.md` contains a `[your jurisdiction + applicable regulations]` placeholder followed by examples. Replace with **your** jurisdiction. Reference table for common ones:

| Theme | EU | US | India | Mongolia (pilot) |
|-------|-----|-----|-------|------------------|
| Securities regulator | ESMA / national regulator | SEC / FINRA | SEBI | FRC |
| Long-term retention | GDPR Article 17 + sector rules | Sarbanes-Oxley 7 years | DPDPA 2023 + IT Act | 7-year AML retention |
| Cash-transaction report threshold | Currency Transaction Report €10K | CTR $10K | Cash Transaction Report ₹10L | CTR 20M MNT |

For non-financial domains:
- **E-commerce:** GDPR / CCPA / state privacy laws + PCI-DSS for payments
- **Healthcare:** HIPAA (US) / Data Protection Act (UK) / GDPR Article 9
- **Government:** FedRAMP / FISMA / ISO 27001

## Reviewer agent prompts (stack-aware adaptation)

When customizing R1/R2 reviewer prompts in `workflow/04-r1-r2-parallel-review.md` for your stack, substitute these conventions:

| Concept | Java/Spring | Python | TypeScript/Node | Go | Rust | C# | Ruby | PHP/Doctrine (pilot) |
|---------|-------------|--------|------------------|-----|------|-----|------|----------------------|
| ORM column annotation grep | `@Column` | `= Column(` / `Field(` | `@Column` (TypeORM) / Prisma model body | `gorm:` tag | `table!` macro | `[Column]` | `db/schema.rb` | `#[ORM\Column]` |
| Package manager install | `mvn install` / `gradle build` | `pip install` / `poetry add` | `npm install` / `yarn add` | `go get` | `cargo add` | `dotnet add package` | `bundle add` | `composer require` |
| CLI runner | `mvn`, `gradle` | `python manage.py` / `python -m` | `npm run` | go binary | cargo binary | `dotnet run` | `rails`, `rake` | `php bin/console` |
| ORM name | Hibernate / JPA | SQLAlchemy / Django ORM | Prisma / TypeORM / Sequelize | GORM / sqlc | Diesel / SeaORM | EF Core | ActiveRecord | Doctrine |

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
