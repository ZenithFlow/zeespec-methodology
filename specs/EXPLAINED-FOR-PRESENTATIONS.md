---
doc: EXPLAINED-FOR-PRESENTATIONS
type: presentation-aid
version: 3.0.0
status: stable
last_updated: 2026-05-29
audience: anyone explaining ZeeSpec to others (tech lead, EM, compliance, PM, new team members)
---

# ZeeSpec — ойлгомжтой тайлбар (бусдад танилцуулах баримт)

> **Бусад хүмүүст танилцуулахад зориулсан баримт.** Engineering manager, tech lead, compliance officer, product manager эсвэл шинэ team member-т ZeeSpec гэж юу болохыг, яагаад хэрэгтэйг, хэрхэн ашиглахыг 30-минутын дотор тайлбарлахад туслана. Энэхүү файл нь lunch-and-learn, all-hands танилцуулга, эсвэл онбординг-д ашиглах боломжтой.

---

## 1. 1 өгүүлбэрээр

ZeeSpec нь **AI-aided хөгжүүлэлт байгаа орчинд аль ч зохицуулалттай систем — санхүү, банк, эрүүл мэнд, төр — spec бичиж, өөрчлөлтөөс хамгаалж, аудитад бэлэн байлгах domain-agnostic methodology**.

Энгийн үгээр: AI агент (Claude, Cursor, Copilot) болон engineering team хоёрын хооронд **системийг яаж ажиллах ёстойг тогтоосон гэрээ**.

---

## 2. Яагаад үүсэв (Problem statement)

### 2026 он. Бодит зураг.

Engineering team Claude / Cursor / Copilot ашиглаж кодлоно. Гэхдээ:

**Problem 1 — AI hallucination on compliance**
```
Engineer: "Withdraw service дээр код бичээч"
Claude:   *KYC tier-ийн шаардлагыг таамаглан үлдээнэ;
           AML threshold-ыг 50K USD гэж бичнэ
           (US-д $10K, EU-д €10K, Mongolia-д 20M MNT гэдгийг
           санахгүй)*
Үр дүн:   AML зөрчил → license risk
```

**Problem 2 — Spec нь хэрэгсэхгүй болж байна**
```
Spec бичсэн:    2024-06-15
Code өөрчилөгсөн: 2024-07-01, 2024-09-12, 2025-01-30, 2025-04-15...
Spec сэрсэн:    2025-12-01 (18 сар буцаж)
Үр дүн:          Spec нь ИМ ЛЖ
                 Хэрвээ AI үүнийг уншвал buruu код бичнэ
                 Хэрвээ auditor үүнийг уншвал нот find олно
```

**Problem 3 — "Яагаад ийм код бичсэн юм бэ?"**
```
2 жилийн дараа: Шинэ engineer орлоо
                Кодыг хараад: "Яагаад UPDATE байхгүй гэж?"
                Slack хайв: 3 мессеж олов; контекст байхгүй
                Bob (анхны разраб): аль хэдийн явсан
                Шийдвэр: уг зүйлийг "fix" хийв
                Үр дүн: production bug + regulatory gap
```

### ZeeSpec эдгээрийг шийдвэрлэнэ

```
Problem 1: AI hallucination
       ↓
ZeeSpec шийдэл: Spec-д бүх invariant + threshold + deadline
               status tag-тай (✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN)
               + citation (file:line)
               AI уншиж кодын comment-д INV-WAL-04 гэж ишилнэ

Problem 2: Spec нь сэрж буй
       ↓
ZeeSpec шийдэл: CI-д drift scanner (R5) тавьна
               PR гарах бүрд spec-код хооронд зөрөл шалгана
               Шинэ field, метод, enum case → нэн даруй alert

Problem 3: WHY нь алдагдсан
       ↓
ZeeSpec шийдэл: ADR lifecycle (workflow/09)
               Шийдвэр бүр Proposed → Accepted → Superseded
               Тиймээр хэн, хэзээ, яагаад тогтоосныг хадгалдаг
```

---

## 3. ZeeSpec гэж яг юу вэ?

### Бүрэлдэхүүн (4 үндсэн хэсэг)

```
ZeeSpec package
├── Top-level docs (3 файл)
│   ├── README.md           — Танилцуулга
│   ├── METHODOLOGY.md      — Бүрэн methodology
│   └── PORTING-GUIDE.md    — Stack adaptation
│
├── Templates (14 файл)
│   ├── _template/          — 10-file module template
│   └── _meta/              — project-wide tracking templates
│
├── Workflow (29+ файл)
│   ├── 00-START-HERE       — AI agent entry point
│   ├── 01-authoring        — Module бичих
│   ├── 02-b1-verification  — Drift хэмжих
│   ├── 03-r3-deep-review   — Code-line review
│   ├── 04-r1+r2-parallel   — Compliance + algorithm review
│   ├── 05-apply-findings   — Findings засах
│   ├── 06-spawn-task-chips — Production fix delegate
│   ├── 07-r4-regulatory    — REGULATOR research (11 sub-files)
│   ├── 08-code-drift       — DRIFT management (6 sub-files)
│   ├── 09-adr-lifecycle    — ADR төрөл (6 sub-files)
│   ├── 10-adoption-guide   — ORGANIZATIONAL adoption (8 sub-files)
│   └── 11-anthropics-plugin — anthropics/financial-services integration
│
├── Checklists (5 файл)
│   ├── anti-patterns       — 13 зөрчил pattern
│   ├── severity-matrix     — P0/P1/P2/P3 калибрац
│   ├── status-tags         — ✅/🟡/🚧 conventions
│   ├── invariant-numbering — ID conventions
│   └── cross-link-bidirectional — модуль хоорондын link
│
└── Overlays (29 файл)
    └── finance-accounting  — Санхүүгийн домэйн жишээ
        ├── principles      — Double-entry + IFRS + AML
        ├── modules         — GL, Wallet, KYC, Lending
        ├── prompts         — R2 financial reviewer
        ├── glossary        — 120+ finance terms
        └── research-examples — 4 worked R4 sessions
```

### Гол санаа 1: 10-file Zachman framework

Module бүр **10 файлаас бүрдсэн spec**-тэй:

| Файл | Юу хариулдаг? |
|------|---------------|
| `CLAUDE.md` | AI agent-д танилцуулга; read order; ADR table |
| `why.md` | Яагаад? Strategy + risks + business rules |
| `what.md` | Юу? Entities + invariants (INV-MOD-NN) |
| `how.md` | Хэрхэн? Algorithm + state machines |
| `who.md` | Хэн? Actors + RBAC + SoD |
| `when.md` | Хэзээ? Timing + SLA + cutoffs |
| `where.md` | Хаана? Storage + tech stack |
| `gravity.md` | Cross-cutting hardwiring (HW-MOD-NN) |
| `gaps.md` | Open questions; STOP rules for AI |
| `glossary.md` | Терминологи |

Бүгд **stack-agnostic** — зөвхөн `where.md` § 5 нь tech stack-тэй холбоотой.

### Гол санаа 2: Status tagging

Spec-д invariant бичихдээ "ийм байна" гэж buruu хэлэхгүй. Жинхэнэ байдлыг тэмдэглэдэг:

```
✅ IMPL          — Production-д verify-чдсэн; AI агент дагаж болно
🟡 PARTIAL       — Зөвхөн app-layer; defense-in-depth нэмэх хэрэгтэй
🚧 DESIGN        — Зөвхөн төлөвлөгөө; production-д БАЙХГҮЙ
🚧 NOT-ENFORCED  — Spec хэлсэн боловч код хэрэгжүүлэхгүй
🚧 BROKEN        — Хэрэгжүүлэх гэсэн боловч runtime crash
```

AI агент `✅` бол итгэж кодлоно; `🚧` бол **STOP** болж асуулт асуудаг.

### Гол санаа 3: Severity matrix

Gap олдоход priority calibrate хийдэг:

```
🚨 P0  Money loss / compliance violation / runtime crash
🟠 P1  Audit gap / aged reconciliation / missing guard
🟡 P2  Reporting drift / stale refs
🟢 P3  Style / cleanup
```

AI behaviour:
- `🚨 P0` + chip байхгүй → STOP, асуулт
- `🚨 P0` + chip байх → cite, биш хэрэгжүүлэх
- `🟢 P3` → хэрэгжүүлээд cite

---

## 4. Workflow — яаж ажиллах вэ?

```
ҮЕ 1 — MODULE АНХ БИЧИХ (one-time, 1-2 неделя)
┌──────────────────────────────────────────────────────┐
│  01. Author (10 файл бичих)                          │
│  02. B1 verify (quantitative grep)                   │
│  03. R3 deep review (line-by-line)                   │
│  04. R1 + R2 parallel review (algorithm + compliance)│
│  05. Apply findings                                  │
│  06. Spawn task chips (production fix delegation)    │
│  → Tier 1 status                                     │
└──────────────────────────────────────────────────────┘
                       ↓

ҮЕ 2 — ХЭРВЭЭ REGULATED ДОМЭЙН БОЛ (one-time per module + жил тутам)
┌──────────────────────────────────────────────────────┐
│  07. R4 Regulatory Research                          │
│     - 6-phase workflow (Scope → Source → Read → ...) │
│     - Source evaluation (4-tier hierarchy)           │
│     - Citation conventions                           │
│     - Re-validation (жил тутам)                      │
│     - Conflict resolution (хууль зөрчилдөх үед)      │
│     - Multi-jurisdiction (олон оронд)                │
│     - Amendment tracking (regulator-аас monitor)     │
│     - Translation pitfalls (Mongolian → English etc) │
└──────────────────────────────────────────────────────┘
                       ↓

ҮЕ 3 — ТАСРАЛТГҮЙ (CI + monthly + quarterly)
┌──────────────────────────────────────────────────────┐
│  08. Code Drift Management                            │
│     - CI drift scan (per PR)                         │
│     - Monthly drift review                           │
│     - Triggered review (refactor өмнө/дараа)         │
│     - 4-type framework (Citation/Field/Behavioral/Arch)│
│                                                       │
│  09. ADR Lifecycle                                   │
│     - Format + lifecycle + relationships             │
│     - Drift-driven retroactive ADRs                  │
│     - Annual ADR curation                            │
└──────────────────────────────────────────────────────┘
                       ↓

ҮЕ 4 — ORGANIZATIONAL (one-time per team)
┌──────────────────────────────────────────────────────┐
│  10. Adoption Guide                                   │
│     - Greenfield / Brownfield path                   │
│     - Team rollout strategy                          │
│     - Tooling integration (CI/IDE/Slack)             │
│     - Cross-domain adaptation                        │
│     - Common pitfalls                                │
│     - Tier 0 Lite (2-hour trial path)                │
│                                                       │
│  11. Anthropic plugin integration                    │
│     - 3 patterns: output→ADR / dispatch / config     │
└──────────────────────────────────────────────────────┘
```

---

## 5. Specialized AI agents (3 төрөл)

ZeeSpec нь Claude Code-д ажиллах **3 тусгай agent prompt** агуулдаг:

| Agent | Үе | Юу хийдэг |
|-------|----|----------|
| **R4** | regulatory research | Regulator сайт + хууль уншиж, INV-д citation бичих |
| **R5** | drift scanner | Spec ↔ code хооронд drift автоматаар илрүүлэх |
| **R6** | ADR curator | Drift-аас retroactive ADR draft хийх; annual review |

Жишээ dispatch:

```javascript
// R4 — Mongolia AML law-ийн threshold-ыг шалгуул
Agent({
  description: "R4 research Mongolia AML CTR threshold",
  prompt: "Use the R4 agent prompt at workflow/07/04-R4-agent-prompt.md.
           Jurisdiction: Mongolia. Topic: AML/CFT Law Art. 11.1.1 CTR threshold.
           Compare to FATF + sibling jurisdictions. Output citation block."
})

// R5 — Wallet модулийн drift scan хий
Agent({
  description: "R5 drift scan — wallet module",
  prompt: "Use R5 agent prompt at workflow/08/05-R5-drift-scanner-agent.md.
           Module: wallet. Categorize findings per 4-type framework."
})

// R6 — wallet модулийн drift finding-аас retroactive ADR draft хий
Agent({
  description: "R6 draft retroactive ADR for TIER_BASIC change",
  prompt: "Use R6 Mode A at workflow/09/05-R6-adr-curator-agent.md.
           Drift finding: [paste R5 output]
           Draft ADR-WAL-NNN per format template."
})
```

---

## 6. anthropics/financial-services-той integration

Та хэдийн `https://github.com/anthropics/financial-services` мэдэх байх. **ZeeSpec + Anthropic plugins нь сөргөлдөгч биш, complementary.**

| | **anthropics/financial-services** | **ZeeSpec** |
|---|---|---|
| Юу | Plugin library (agent + skill) | Methodology |
| Гарц | Action (deck барина) | Spec (мэдлэгийн системээ хадгалах) |
| Хэн | Banker / analyst | Engineering team |
| Хэзээ | Per task (минут-цаг) | Per module (cap-жил) |
| Хадгалалт | Output PDF | Living spec git дотор |

**3 integration pattern** (workflow/11-аас дэлгэрэнгүй):

```
Pattern 1: Plugin output → ADR
  pitch-agent DCF тооцоо хийнэ → WACC 8.5% гэх материалын шийдвэр
  → R6 agent ADR-PORTFOLIO-014 болгож хадгалаа

Pattern 2: ZeeSpec dispatches plugin
  R4 research session — "EU competitive landscape хэрэгтэй"
  → market-researcher plugin call хийнэ
  → output-ыг R4 citation block-ийн Tier 2 source болгож ашиглана

Pattern 3: Spec governs plugin config
  where.md § 5 — "gl-reconciler v2.1 ашиглана; өдөр тутам 22:00 UTC"
  → gl-reconciler-config.yaml spec-ээс автоматаар үүснэ
  → R5 drift detection — spec ↔ config drift илрүүлнэ
```

---

## 7. Дөрвөн team-ийн жишээ

### Сценари 1 — Solo developer (1 хүн)

**ZeeSpec ашиглах уу?** Ихэнхдээ ҮГҮЙ.

Жижиг hobby project: methodology overhead >> ROI. Тиймээ ZeeSpec ашиглах юм бол **Tier 0 Lite** (3 файл, 2 цаг) ашиглах боломжтой.

### Сценари 2 — 3-5 person startup

**ZeeSpec ашиглах уу?** ХЭСЭГЛЭН.

Pattern: 1-2 critical модуль дээр Tier 1. Бусад нь Tier 0 Lite эсвэл огт ашиглахгүй.

Role fallback (workflow/10/06-common-pitfalls.md-аас):
- Compliance officer байхгүй → детал-ориентир engineer + outside counsel quarterly
- Controller байхгүй → 4-eyes принцип ("Alice+Bob хоёулаа" rule)
- Approver байхгүй → "хэн initiate хийсэнгүй" rule

### Сценари 3 — 10-20 person mid-size

**ZeeSpec ашиглах уу?** ТИЙМ.

Pattern: Champion + backup + feature team бүр өөрийн module-ыг бичнэ. CI drift detection идэвхтэй. Monthly drift review. Quarterly R4. Annual R6.

Cost: ~0.5 FTE ongoing.

### Сценари 4 — 20+ enterprise

**ZeeSpec ашиглах уу?** ТИЙМ (бүрэн).

Pattern: Dedicated ZeeSpec team (1-2 FTE). Multi-jurisdiction R4. Дашбоард + Slack notifications. ADR governance committee. Annual methodology retrospective.

Cost: ~2 FTE.

---

## 8. Real-world жишээ: Mongolia mutual fund pilot

ZeeSpec нь **нэг pilot project дээр туршсан (N=1 — бие даан validate хийгээгүй)**:

```
Mongolian Mutual Fund Management System
├── Stack: PHP 8.2 + Symfony 6.4 + PostgreSQL 15
├── 5 module ZeeSpec-тэй: notification, asset_catalog, wallet, accounting, settlement
├── Total findings: 177
├── Production bugs: 4 fixed + 6 queued
├── Compliance gaps: 22 filed (GDPR/AML/FRC retention)
└── Илрүүлсэн жинхэнэ findings:
    - CTR threshold 20M MNT олж codify
    - createdBy:0 sentinel anti-pattern 20+ газар олж
    - Hard DELETE on retention table (BackfillCommand) олж зас
    - Approval workflow boundary mismatch (every approved journal throws) олж зас
```

Эдгээр finding-уудыг R3+R1+R2 review-ийн methodology олжээ. Хэрвээ ZeeSpec байгаагүй бол эдгээр зөрчлүүд жил, эсвэл audit time хүртэл нуугдаж байх байсан.

---

## 9. ROI шинж тэмдэг

> **N=1 caveat:** доорх тоонууд нь нэг pilot-ийн **ажиглалт** — бие даан баталгаажуулсан ROI биш. Чиглэл заасан, нотлогдоогүй.

### Investment

| Tier | Initial | Ongoing |
|------|---------|---------|
| Tier 0 Lite (3 файл trial) | 2 цаг | 30 мин/quarter |
| Tier 1 Standard (10 файл) | 1-2 неделя per module | 2-4 цаг/month per module |
| Tier B Full (5+ модуль) | 4-6 неделя setup | 0.5 FTE ongoing |
| Tier C Enterprise (20+ модуль) | 2-3 сар | 1-2 FTE |

### Хариу

```
1 production bug урьдчилан илрүүлэх:    8-40h debugging + customer impact saved
1 compliance gap урьдчилан илрүүлэх:    $1K-100K+ enforcement risk avoided
New engineer onboarding via spec:        Week-1 productivity vs week-3 (without)
Audit response:                          Spec артефакт ашиглана; days→hours
AI agent code quality:                   30-50% fewer revision cycles
Cross-team knowledge transfer:           Spec нь canonical source; no Slack archeology
```

ROI breakeven: **~6 сар** (pilot ажиглалт; one bug + one gap = methodology cost — бие даан батлагдаагүй).

---

## 10. ZeeSpec ашиглахгүй байх үе

ZeeSpec **бүхний хариу биш**. Дараах нөхцөлд ашиглаж болохгүй:

| Сценари | Яагаад биш |
|---------|------------|
| Throwaway prototype | Methodology overhead >> ROI |
| Pre-PMF startup (1-2 хүн) | Шуурхай iteration хүсэн |
| Pure SaaS no regulatory | Үнэ цэн дутуу |
| Trivial CRUD module | 10-file overkill |
| Pure data pipeline | No human-facing / compliance touchpoint |

Эдгээрт хувьд: ADR alone эсвэл уламжлалт documentation хангалттай.

---

## 11. Хаанаас эхлэх вэ? (Practical next steps)

### Хэрэв та tech lead / engineering manager бол

1. README.md уншиж 30 минутын дотор адаас тогтоо: "Бидэнд хэрэгтэй юу?"
2. METHODOLOGY.md уншиж 1.5 цаг — full picture
3. `workflow/10-adoption-guide/00-START-HERE.md` уншиж — Tier шийдвэрлэх
4. 1 highly-risk модуль сонгож, champion томилох
5. 2-4 неделя дотор first Tier 1 модулийг гарга

### Хэрэв та engineer бол

1. `workflow/00-START-HERE.md` уншиж (AI agent entry point)
2. Pilot модулийн `CLAUDE.md` уншиж
3. Тэр модулийн dimension файл уншиж (what.md, how.md гэх мэт)
4. Кодондоо INV ID-г comment-р оруулж эхлэх
5. PR description-д "ZeeSpec impact" section нэмэх

### Хэрэв та compliance officer бол

1. `workflow/07-r4-regulatory-research/00-START-HERE.md` уншиж
2. R2 reviewer prompt (`overlays/finance-accounting/prompts/R2-financial-reviewer.md`) уншиж
3. Тэр modulийн `gaps.md` дотор P0/P1 finding-уудыг шалгаж эхлэх
4. ADR table-ыг review хийх — material decisions document хийгдсэн үү?
5. Annual R4 re-validation + R6 ADR review-ыг calendar-д тавих

### Хэрэв та AI agent (Claude/Cursor) бол

1. **ҮРГЭЛЖ** `workflow/00-START-HERE.md` уншиж сэтгэхүй бичих өмнө
2. Module-ын `CLAUDE.md` уншиж + read order дагах
3. `gaps.md` шалгаж — 🔴 OPEN gap код-д нөлөөлөх үу?
4. Кодондоо INV/HW ID-г comment-р оруулах
5. Шинэ material decision гарах юм бол ADR санал болгох

---

## 12. Цөөн асуулт-хариулт (FAQ)

### "ZeeSpec нь Anthropic-ийн мөн юу?"

**Үгүй.** ZeeSpec нь batzaya-н pilot project-аас гарсан open-source methodology (MIT license). anthropics/financial-services бол Anthropic-ийн plugin library. Хоёр нь complementary (workflow/11-д бичсэн).

### "Зөвхөн санхүүгийн системд хэрэглэх юм уу?"

**Үгүй.** Core methodology нь domain-agnostic. Finance overlay нь **жишээ**. Healthcare, government, privacy, energy зэрэгт хэрэглэх боломжтой (workflow/10/05-cross-domain-adaptation.md-д бичсэн).

### "Зөвхөн Claude-тэй ажиллах юм уу?"

**Үгүй.** Claude Code-д хамгийн сайн ажиллана (agent dispatch + WebFetch parallel). Cursor / Copilot CLI-д ажиллана но slower (sequential). GitHub Copilot-тэй: manual workflow.

### "PHP төсөлдөө л хэрэглэх юм уу?"

**Үгүй.** Stack-agnostic. PORTING-GUIDE.md нь 8 stack (Java, Python, Go, Rust, TS, C#, Ruby, PHP) хувилбар үзүүлсэн.

### "Бид Confluence/Notion ашиглаж байна. ZeeSpec шилжих хэрэгтэй юу?"

**Хэрэглэхгүй.** Тэр docs-уудыг хэвээр үлдээ. ZeeSpec нь supplement (workflow/10/02-onboarding-existing-project.md-д Strategy A "run in parallel" pattern байна).

### "Cost хэдэн вэ?"

Agent dispatch: ~$25 quarterly per 5 modules (Sonnet 4.5). Engineering time: ~0.5 FTE Tier B adoption.

ROI breakeven: ~6 сар.

### "Solo dev-д тохиромжтой юу?"

Tier 0 Lite (3 файл, 2 цаг trial) **тохиромжтой**. Full Tier 1 (10 файл, 1-2 неделя) **тохиромжгүй**.

### "Existing 4-file convention-той хэрхэн зөрөх вэ?"

3 strategy байна (workflow/10/02-д):
- A. Parallel run (хадгал; ZeeSpec supplement)
- B. Hybrid migration (4-file content-ыг 10-file-руу шилжүүл)
- C. New modules ZeeSpec; legacy 4-file

### "AI агент гэдэг чинь яг яаж ажиллах юм бэ?"

R4/R5/R6 agent-уудыг Claude Code-д dispatch хийнэ:
```javascript
Agent({
  subagent_type: "general-purpose",
  description: "R5 drift scan",
  prompt: "<copy from workflow/08/05-R5-drift-scanner-agent.md>"
})
```
Agent өөрөө code уншиж, drift findings produce хийж, recommendations өгнө. Хүн нь review хийж apply хийнэ.

### "ZeeSpec нь quick win хэлбэрээр хэрэглэгдэх юу?"

**Тийм.** Tier 0 Lite (3 файл, 2 цаг) шуурхай хэрэгжүүлэх боломжтой. Demo project дээр одоо хэдэн модулийг ZeeSpec-чилж AI кодлох ажиллах байдалаа хараарай.

---

## 13. Гол хэллэг (3 өгүүлбэрээр)

> **ZeeSpec нь регуляторт чиглэсэн системээ урт хугацааны spec + AI-friendly format-аар хадгалах methodology.**
>
> Гол үнэ цэн нь: AI агент зөв код бичнэ + drift автоматаар илрэнэ + WHY нь жилийн дараа ч мэдэгдэхээр баримтжсан байна.
>
> Санхүүд нэг pilot дээр туршсан (N=1; 177 findings, 4 production bugs — ажиглалт, validate биш); healthcare / government / privacy зэрэгт adoption guide-д тайлбарласан.

---

## 14. Танилцуулга формат (30 минут)

Live presentation хүсэх бол ийм бүтэцтэй явуулж болно:

| Минут | Сэдэв | Энд хэлэх |
|-------|------|------------|
| 0-5 | Юу + яагаад | § 1-2 |
| 5-10 | Components + workflow | § 3-4 |
| 10-15 | AI agents (R4/R5/R6) | § 5 |
| 15-20 | Team scenarios | § 7 |
| 20-25 | Pilot example + ROI | § 8-9 |
| 25-30 | Q&A | § 12 |

Live demo хүсэх бол: Tier 0 Lite модуль 2 цагийн дотор хамт ажиллуулж үзэх боломжтой.

---

## 15. Цаг хугацааны хувийн мэдээ

| Версион | Огноо | Юу нэмэгдсэн |
|---------|-------|---------------|
| v2.0 | 2026-04 | Initial 10-file Zachman framework |
| v2.1-v2.3 | 2026-04 | Reviewer findings applied |
| v2.4-v2.6 | 2026-05 | Finance overlay + lending module via R4 |
| v2.7-v2.8 | 2026-05 | R4 promoted to core; advanced strategy |
| v2.9 | 2026-05 | Code Drift + ADR Lifecycle |
| **v3.0** | **2026-05** | **3-reviewer findings + Adoption Guide + Anthropic integration** |

~100+ файл (өсөн нэмэгддэг тул яг тоог энд хатуугаар бичээгүй — drift-аас сэргийлэв).

---

## 16. Resources

- **Local repo:** энэ package-ийн checkout (`.../zeespec-methodology`)
- **Core README:** `specs/README.md`
- **Full methodology:** `specs/METHODOLOGY.md`
- **AI agent entry:** `specs/workflow/00-START-HERE.md`
- **Adoption decision:** `specs/workflow/10-adoption-guide/00-START-HERE.md`
- **Anthropic integration:** `specs/workflow/11-anthropics-plugin-integration/00-START-HERE.md`
- **Pilot data:** `specs/README.md` § Validation Track Record
- **anthropics/financial-services:** https://github.com/anthropics/financial-services

---

**Бичсэн огноо:** 2026-05-18 (v3.0)
**ZeeSpec version:** 3.0.0
**License:** MIT
**Maintainer:** batzaya (initial pilot author)
