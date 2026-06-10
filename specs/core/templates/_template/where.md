---
module: MODULE_NAME
dimension: where
version: 0.1.0
status: draft
last_updated: YYYY-MM-DD
---

# MODULE_NAME — WHERE (Storage Roles, Tech Stack Binding)

> **Stack-agnostic §§ 1-4:** Storage roles, data domains, integration boundaries framework-independent.
> **Stack-specific § 5:** Concrete framework + library + class bindings — rewrite only this when porting.

## 1. Storage role inventory

### S-MOD_PREFIX-01: [storage role name]

**Tables/Collections:**
- `[entity]` ([primary entity])
- `[entity_2]` ([secondary])

**Properties:**
- [ACID guarantees, indexes, FKs]
- [Read/write pattern]
- [Estimated volume]

**SLA:** [read/write latency]

### S-MOD_PREFIX-02: [Async queue if applicable]

**Domain:** [message bus / queue]

**Properties:**
- [N transports with retry strategies]
- [Dead-letter handling]

## 2. Data domain map

```
                  ┌──────────────────────────┐
                  │ S-MOD-01: Relational DB  │
                  │  main_table (N fields)   │
                  │  related (M fields)      │
                  └──────┬──────────┬────────┘
                         │          │
                         ▼          ▼
                  ┌──────────┐  ┌──────────┐
                  │ S-MOD-02 │  │ S-MOD-03 │
                  │ Queue    │  │ External │
                  └──────────┘  └──────────┘
```

## 3. Cross-module storage dependencies

| Other module | Storage role used | Direction |
|--------------|-------------------|-----------|
| `<other-module>` | [FK from / FK to] | [Inbound/Outbound] |

## 4. Failure-mode storage semantics

### F-MOD_PREFIX-W-01: [Failure mode]

```
[scenario]:
  → [what gets persisted]
  → [what gets rolled back]
  → [user-visible effect]
```

## 5. Tech Stack Binding (production — [Platform name], YYYY-MM-DD)

> ⚠️ **The ONLY stack-specific section.** Rewrite when porting.

### 5.1 Backend runtime
- [Language + version]
- [Framework + version]
- [ORM/data layer]
- [Validation library]
- [Async messaging library]

### 5.2 Relational/document database
- [DB engine + version]
- Tables:
  - `[table_1]` (**N fields** = X Column + Y MTO)
  - `[table_2]` (**M fields** = ...)
- [N secondary indexes on table_1]

### 5.3 Async transports
**Component:** [framework + transport — e.g., Kafka, RabbitMQ, SQS, Redis Streams, Celery, Sidekiq, BullMQ, Symfony Messenger]
**Routing:**
- `[message / task / event identifier]` → `[transport_name]`

**Transport configs:**
| Transport | max_retries | initial delay | multiplier | max_delay |
|-----------|------------:|--------------:|:----------:|----------:|
| [name] | N | X ms | Y | Z ms |

> The fully-qualified names below are **placeholders** — substitute your stack's package / namespace / module conventions.
> Examples of equivalents per stack:
> - Java/Spring: `com.acme.<module>.PrimaryService`
> - Python: `acme.<module>.services.PrimaryService`
> - Go: `github.com/acme/<module>/primaryservice` or `internal/<module>/primary.go`
> - Rust: `acme::<module>::PrimaryService`
> - TypeScript/Node: `@acme/<module>/PrimaryService`
> - C#: `Acme.<Module>.PrimaryService`
> - PHP (pilot): `App\Service\<Module>\PrimaryService`

### 5.4 Service classes (production)
- `<namespace>/<Module>/PrimaryService` — [purpose] (~N public methods)
- `<namespace>/<Module>/SecondaryService` — [purpose]

### 5.5 Message + handler classes
- `<namespace>/<Module>/Message/<Action>Message` + `<namespace>/<Module>/MessageHandler/<Action>Handler`
  (or whatever your stack calls "event + handler" — Spring `ApplicationEvent` + `@EventListener`, Python Celery `@task`, Go channel + worker, Rust `tokio::spawn`, NestJS `@MessagePattern`, etc.)

### 5.6 Enums / typed constants
- `<namespace>/<Module>/<EnumName>` — N cases
  (use your language's enum mechanism: Java/C#/TS/Rust `enum`, Python `Enum`, Go const block + typed int, Ruby module constants, PHP 8.1+ `enum`)

### 5.7 External provider integration
**[Provider name]:**
- [Env var] `EXAMPLE_API_KEY`
- [SDK/library — language-specific]
- [Failure modes]

### 5.8 Auth + RBAC
- [Auth library/framework + version]
- [Role hierarchy reference]

### 5.9 CLI commands
- `<namespace>/<Module>/<Action>Command` (`<cli-runner> <command-name>`)
  (e.g., `python manage.py X`, `mvn exec:java -Dexec.mainClass=...`, `go run cmd/X`, `cargo run --bin X`, `npm run X`, `php bin/console X`, `bundle exec rake X`)

### 5.10 Configuration sources
- `[config file path — e.g., config/<file>.yaml, application.yml, settings.py, conf/<file>.toml]`
- `.env` (or your stack's environment-variable mechanism): `[ENV_VAR_NAMES]`

## 6. Cross-references

### Source documents
- Production code per `CLAUDE.md` § Source documents
- `[migrations directory — e.g., backend/migrations/, alembic/versions/, db/migrate/, prisma/migrations/]` ([entity] migrations)

### Related dimensions
- `what.md` — entity schemas
- `how.md` — algorithms per storage role
- `who.md` — actor permissions
- `when.md` — timing of writes per storage
- `gravity.md` — cross-dim hardwiring
- `gaps.md` — open questions + drift
