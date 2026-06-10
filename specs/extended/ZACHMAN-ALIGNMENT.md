---
doc: ZACHMAN-ALIGNMENT
type: methodology-improvement-analysis
version: 0.1.0
status: baseline-agreed
last_updated: 2026-05-29
lang: mn
grounds: эх Zachman онол (1987 / 1992 / 3.0-2011) + W6H academic adaptation
applies_to: ZeeSpec методологи өөрөө (meta-level; модуль-тус-бүрийн spec биш)
---

# ZeeSpec ↔ Zachman Alignment — Судалгаанд үндэслэсэн сайжруулалтын Tier-үүд

> **Төлөв:** PARTIALLY-IMPLEMENTED (2026-06-06) — хэрэгжсэн: **Tier 1 (1A normalize + 1B lint + 1C-lean
> dogfood) + 2A (Zachman-row map) + 2B (Lite/Standard/Full weight-tier → core §2a) + 3B (positioning / N=1)**;
> §4 drift цэвэрлэгдсэн. **v3.1 alignment pass (2026-06-06):** 1C metrics-loop (input #4) + adopter CI drift-gate
> (1C-lean өргөтгөл) + reviewer-scope §3c (deep-research benchmark-аар) нэмэгдэв; core trio → **v3.1.0**,
> "NEW v3.2"→v3.1 зөрчил зассан (хэрэглэгчийн шийдвэрээр). **Зориуд хойшлуулсан:** 1C-full (self-spec
> модуль), 3A (ADR="which") — over-engineering / ornament. §11 implementation log + §7 дараалал үз.

> **Үндэс:** Энэ баримт нь ZeeSpec-ийн суурь болсон Zachman framework дээр хийсэн судалгааны үр дүн.
> Зөвлөмж бүр өөрийн үндэслэсэн Zachman / W6H finding-ийг үгчлэн (verbatim, англиар) иш татна.

---

## 1. Зорилго

ZeeSpec нь John Zachman-ийн framework дээр суурилсан боловч зориудаар хялбарчилсан (6×6 → 6 хэмжээс × 1
perspective, 10 файл). Энэ баримт нь **эх сурвалж руугаа буцаж** асууна: *эх framework юу зааж байна,
ZeeSpec үүнийг дутуу ашиглаж байна, хаана өөрчлөх ёстой вэ?* Гарц нь — **tier-чилсэн** сайжруулалтын
багц, тус бүр нь үгчилсэн судалгааны finding-тэй холбоотой, дараах эрэмбээр:

```
tier-ийн эрэмбэ = (судалгааны нотолгооны хүч)
               × (ZeeSpec-ийн гол сул талд — self-rot / sustainability — үзүүлэх нөлөө)
               × (foundational чанар: бусад сайжруулалтыг идэвхжүүлэх үү?)
```

Энэ баримт методологийг **засдаггүй**. Энэ бол tier хэрэгжүүлэхээс өмнөх review baseline.

## 2. Судалгааны үндэс (хэрхэн гаргасан бэ)

Анхдагч ба чанартай хоёрдогч эх сурвалж дээрх фокустай судалгаа. Гол үгчилсэн finding-ууд:

| Эх сурвалжийн finding (verbatim) | Аль зөвлөмжийг үндэслэж байгаа |
|---|---|
| Zachman 3.0 normalization: *"one and only one thing in any one descriptive representation"*; *"get rid of any redundancies… make it as simple as possible … LEAN"* | Tier 1 · 1A |
| Composite = *"multi-variable model for a single implementation"*, *"components from more than one Framework Cell"*; engineering vs manufacturing *"are in conflict … a paradigm problem"* | Tier 1 · 1A |
| Rule 3: *"The basic model of each column must be unique"*; Rule 5: *"Each cell is unique"* | Tier 1 · 1B |
| Rule 7: *"The logic is recursive"* | Tier 1 · 1C |
| 6 perspective, түүний дотор **Enterprise / Operations** (functioning instances) | Tier 2 · 2A |
| W6H: *"the ordering of viewpoints is not defined in the existing EA frameworks, making data capturing process difficult"*; *"iterative and agile SDLCs, e.g. Scrum"*-г дэмждэг | Tier 2 · 2B |
| W6H: *"addition of the seventh interrogative 'which' … enabling creation of holistic EA"* | Tier 3 · 3A |
| Критик: Zachman бол *"not a methodology"*, process-гүй; Zachman (2004): *"nobody … successfully implementing the whole framework … yet"*; *"handy as a checklist, but that's about all"* | Tier 0 + Tier 3 · 3B |

Бүрэн эх сурвалжийн жагсаалт §10-д.

## 3. Яагаад яг эдгээр tier вэ — self-improvement-ийн цоорхой

Tier-лэлт нь ZeeSpec-ийг *өөрийгөө сайжруулдаг* систем талаас нь шинжилсэн finding дээр тулгуурладаг.
Хаалттай self-improving loop-д 5 орц хэрэгтэй; ZeeSpec-д 2.5 нь бий:

| Self-improving системийн орц | ZeeSpec өнөөдөр |
|---|:---:|
| 1. Feedback барих (юу ажиллав/бүтэлгүйтэв) | ✅ `pilot-retrospective.md` ("Methodology improvements suggested"); anti-patterns каталог pilot-оос ургадаг; `addresses:` frontmatter |
| 2. Feedback → методологийн өөрчлөлт | ◐ Болдог, гэхдээ ad-hoc / cadence-гүй (v2.0→v3.0 version bump = "reviewer findings applied") |
| 3. Өөртөө хэрэглэх (dogfooding) | ❌ Өөрийн багажийг (B1 / R5 / normalization) **өөрийн репод ажиллуулдаггүй** |
| 4. Хэмжүүр / metrics loop | ❌ "177 findings" нь нэг удаагийн snapshot, version бүрээр хянадаггүй |
| 5. Pruning (сөрөг feedback) | ❌ Зөвхөн өсдөг (90→128 файл); юм хассан ул мөр алга |

**Дүгнэлт:** ZeeSpec нь **self-augmenting** (өөрийн finding-ээс *юу нэмэхээ* сурдаг) ч **closed-loop
self-correcting биш** (нэмсэн нь тус болсон эсэхийг хэмждэггүй, хэзээ ч хасдаггүй, өөрийн ноохойг
иддэггүй). Tier 1 нь энэ loop-ыг хаахаар; Tier 0 нь хязгааргүй өсөлтийг зогсооно.

## 4. Нотолгоо — методологийн өөрийн doc дотрох drift

#3 орц (dogfooding) дутуу гэдгийн хамгийн тод баталгаа: doc rot-аас сэргийлэх зорилготой методологи
өөрийн файлд rot хийсэн. Энэ review-ийн явцад олдсон:

1. `README.md` (top-level) — *"workflow/ ← 7 step-by-step guides"*. Бодит: **13** (00–06 файл + 07–12 фолдер). `specs/README.md` 13-ыг бүгдийг жагсаасан; top README хоцорсон.
2. `EXPLAINED-FOR-PRESENTATIONS.md` §16 — *"Local repo: `…/Workspace/zeespec-methodology`"*. Бодит байршил өөр (repo нүүсэн). Stale path.
3. `EXPLAINED-FOR-PRESENTATIONS.md` §3 & §15 — *"90 файл"*. Бодит ≈ 128 файл. Stale count.
4. Core гурвалын version skew — `METHODOLOGY.md` v2.3.0, `README.md` v2.5.0, `EXPLAINED…` v3.0.0.

Эдгээр 4 нь яг ZeeSpec-ийн өөрийн R5 scanner барих ёстой Type-1 / Type-2 drift. R5-г энэ репод хэзээ ч
чиглүүлээгүй учраас л амьд үлдсэн. **Эдгээр нь Tier 1 · 1C-ийн acceptance test.**

---

## Tier 0 — Захирах guardrail (бусад бүх tier-ийг хязгаарлана)

> **Zachman-ийн impracticality-г буцааж бүү импортол.**

**Үндэс:** Zachman нь *"handy as a checklist, but that's about all"* гэж, мөн *"unstructured"* дата гаргадаг
гэж шүүмжлэгддэг. ZeeSpec-ийн status-tag + `file:line` citation нь яг "unstructured" критикийг засдаг —
энэ дисциплин нь аль хэдийн ажиллаж буй зүйл.

**Дүрэм:** Completeness-ийн төлөө **шинэ cell / row / файл нэмэхгүй**. Өөрчлөлт бүр дараахын аль нэгийг
хийнэ: (a) давхардал **хасах**, (b) verification **нэмэх**, эсвэл (c) одоо байгаа бүтцийг **тодруулах**.
Цэвэр файлын тоо **тэгш эсвэл буурах** чиглэлтэй, өсөхгүй. Энэ нь "зөвхөн-өсдөг (90→128)" сул талыг
шууд шалгана.

---

## Tier 1 — Суурь: rot-ыг зас, loop-ыг хаа 🔴

> Хамгийн хүчтэй grounding (Zachman дүрэм шууд зөрчигдсөн) **бөгөөд** гол сул талыг (self-rot) засна.
> Дараалалтай багц: **1A → 1B → 1C** (нэг нь нөгөөгөө идэвхжүүлнэ).

### 1A — `gravity.md`-г pointer-only composite болгох ("one fact, one cell")

- **Үндэс:** Zachman 3.0 normalization — *"one and only one thing … LEAN"*; Rule 5 *"Each cell is unique."* Primitive (нэг cell) бол эх үнэн; composite (multi-cell) бол **дериватив**.
- **Одоогийн асуудал:** `gravity.md` бол зөв composite (cross-cell) боловч баримтуудыг иш татахын оронд **дахин бичдэг**. Бичигдсэн GL модульд: `HW-GL-01` нь `INV-GL-01`+`INV-GL-09`-г дахин бичсэн; `HW-GL-16` нь шууд *"(Duplicate of HW-GL-04; kept for cross-reference numbering compatibility)"*; `HW-GL-14` *"(same as HW-GL-03)."* Дахин бичигдсэн баримт тус тусдаа drift хийдэг — яг ZeeSpec тэмцдэг тэр rot.
- **Өөрчлөлт:** HW entry бүр цэвэр pointer болно: unique HW id + `Crosses:` primitive cell ID-уудын жагсаалт + composite-only агуулга (failure-mode-if-violated, аль dimension-ууд огтлолцох). Rule-ийн *substance* зөвхөн өөрийн primitive cell дотор амьдарна. `"(Duplicate of…)"` entry-үүдийг устгана — "numbering compatibility" нь үндэслэл болгосон denormalization.
- **Засах сул тал:** Self-rot.
- **Хөндөгдөх файл:** `core/templates/_template/gravity.md`; `examples/overlays/finance-accounting/modules/general-ledger/gravity.md` (worked example); `METHODOLOGY.md` §9 (Gravity).
- **Effort:** M.

### 1B — R5 + R3-д duplicate-fact / dimension-leakage lint нэмэх

- **Үндэс:** Rule 3 *"basic model of each column must be unique"* + Rule 5 *"Each cell is unique."*
- **Өөрчлөлт:** R5 drift scanner ба R3 deep-review prompt-д зарчимтай шалгуур: *"Аль нэг баримт 2+ файлд бий юу? → normalize. Dimension файл бүр өөрийн interrogative дотроо байна уу (leakage алга)?"* Энэ нь 1A-г автоматжуулж, R5-д citation/line drift-ээс гадуурх шинэ check class өгнө.
- **Засах сул тал:** Self-rot (автомат).
- **Хөндөгдөх файл:** `extended/workflow/08-code-drift-management/05-R5-drift-scanner-agent.md`; `extended/workflow/08-code-drift-management/02-drift-categorization.md` (шинэ normalization category); `core/workflow/03-r3-deep-review.md`.
- **Effort:** M.

### 1C — Self-hosting + dogfood CI (loop-ыг хаа) · **Бүтэн self-spec [шийдвэрлэгдсэн]**

- **Үндэс:** Rule 7 *"The logic is recursive"* (framework өөртөө хэрэглэгдэх ёстой) + self-improvement-ийн цоорхой (§3, орц #3).
- **Өөрчлөлт (бүтэн хувилбар):** (i) Методологийг өөрийг нь **бүтэн ZeeSpec модуль** болгон codify хий — `_meta/zeespec-self-spec/` дотор өөрийн `why/what/how/who/gaps` (методологийн зорилго, файл convention, workflow, agent, нээлттэй асуултууд). (ii) 1B-ийн lint + R5 drift-ийг **энэ репод** CI-аар ажиллуул. (iii) Metrics loop (орц #4) тарь: finding/version бүртгэ.
- **Tier 0-той эвлэрэл:** Бүтэн self-spec модуль нь олон файл нэмнэ — гэвч энэ нь completeness-padding **биш**, харин **verification infrastructure** (dogfood drift-scan-ы суурь). Tier 0-ийн "(b) verification нэмэх" заалтад нийцнэ. Болзол: self-spec нь дотроо **lean** байх ёстой (1A-ийн pointer-only зарчмыг өөртөө мөрдөнө) — өөрөөр хэлбэл self-spec нь өөрөө rot хийвэл инээдтэй.
- **Засах сул тал:** Нээлттэй loop хаагдана; **§4-ийн 4 drift автоматаар баригдана**; N=1 pilot-аас цаашхи evidence суурь тавигдана.
- **Хөндөгдөх файл:** шинэ `_meta/zeespec-self-spec/`; repo root-д шинэ CI config; `core/templates/_meta/pilot-retrospective.md` (metrics холбоно).
- **Effort:** L (бүтэн хувилбар сонгосон тул M→L).

---

## Tier 2 — Бүтцийг тодруулах 🟠

> Тодорхой grounding; бүтэц + adoption-г хурцална. Идэвхтэй гажиг засахгүй.

### 2A — Файл бүрийн Zachman row-г нэрлэх; status-tag-ийг Builder↔Operations гүүр болгож reframe

- **Үндэс:** Zachman-ийн 6 perspective. ZeeSpec "1 perspective (builder)" гэдэг ч бодит дээрээ холимог: Owner (`why.md` business rules), Designer (`what`/`how` logical), Builder (`where.md §5` physical). Гол нь **Enterprise / Operations** row (functioning runtime instances) нь яг "spec vs production reality" амьдардаг газар.
- **Өөрчлөлт:** Файл/хэсэг бүр аль Zachman row-г зорьж байгааг бич (зориуд орхисон — Executive/Scope, Technician/Components — нь тодорхой болно). **Status-tag (✅ IMPL / 🚧 DESIGN)-ийг Builder row (physical design) ба Operations row (бодитоор ажиллаж буй)-ийн хоорондын гүүр** гэж reframe — энэ нь status-tag-ийг convention-оос онолын хувьд бат механизм болгоно. Мөн: одоо байгаа two-layer architecture (Layer 1 logical / Layer 2 physical) нь үнэндээ 2-row Zachman compression — үүнийг хэл.
- **Засах сул тал:** Soundness (гүнзгийрнэ), generalizability (орхилт тодорхой).
- **Хөндөгдөх файл:** `METHODOLOGY.md` §1–2 & §4 (status tags) & §7 (two-layer); `core/workflow/00-START-HERE.md`.
- **Effort:** S–M.

### 2B — Authoring dependency DAG зарлах; Tier 0 Lite-г default болгох

- **Үндэс:** W6H — *"the ordering of viewpoints is not defined … making data capturing process difficult"*; W6H нь incremental *"iterative and agile SDLCs, e.g. Scrum"*-г дэмждэг.
- **Өөрчлөлт:** Dependency дарааллыг тод зарла: `WHY → WHAT → HOW → {WHO, WHEN} → WHERE` (why-гүйгээр invariant бичиж чадахгүй; how-гүйгээр RBAC байхгүй). **Tier 0 Lite-г default entry** болго (WHY + WHAT + gaps эхэлнэ), Tier 1 нь зориуд promotion — overhead/"rarely fully populated" сул талыг шууд хариулна.
- **Засах сул тал:** Overhead / sustainability; adoption friction.
- **Хөндөгдөх файл:** `core/workflow/01-authoring-checklist.md`; `extended/workflow/10-adoption-guide/00-START-HERE.md`; `extended/workflow/10-adoption-guide/07-zeespec-lite-tier-0-fasttrack.md`.
- **Effort:** S.

---

## Tier 3 — Өнгөлгөө: концепцийн эвлэл + positioning 🟡

> Framing, механизм биш. Үнэ цэнтэй ч хамгийн бага яаралтай.

### 3A — ADR-ыг "which" 7-р interrogative болгон нэгтгэх

- **Үндэс:** W6H — *"addition of the seventh interrogative 'which' … enabling creation of holistic EA."* "Аль хувилбарыг сонгосон бэ?" = шийдвэрийн сонголт = ADR.
- **Өөрчлөлт:** ADR lifecycle (workflow/09)-ыг bolt-on биш, ZeeSpec-ийн 7 дахь шийдвэрийн хэмжээсийн илрэл гэж framing.
- **Хөндөгдөх файл:** `extended/workflow/09-adr-lifecycle/00-START-HERE.md`; `METHODOLOGY.md` §1.
- **Effort:** S.

### 3B — Positioning + шударга confidence recalibration

- **Үндэс:** Zachman бол *"not a methodology"* (process-гүй); Zachman (2004): *"nobody … implementing the whole framework … yet"*; practical example дутагдалтай.
- **Өөрчлөлт:** Тод нэхэмжил: *"ZeeSpec = Zachman taxonomy + Zachman хэзээ ч өгөөгүй process/verification давхарга."* ZeeSpec-ийн pilot нь Zachman-ийн дутуу байсан practical example — **гэхдээ N=1**; зөвхөн metrics loop (1C) л үүнээс цааш evidence босгоно. Pilot ROI тоонуудыг "validated ROI" биш "pilot observations" гэж дахин шошголо.
- **Хөндөгдөх файл:** `README.md`; `METHODOLOGY.md` §1 & §14; `EXPLAINED-FOR-PRESENTATIONS.md`.
- **Effort:** S.

---

## 5. Нэгдсэн хүснэгт

| Tier | Item | Судалгааны grounding | Засах сул тал | Effort |
|:---:|---|---|---|:---:|
| 0 | Impracticality бүү импортол | Zachman критик ("checklist only") | Зөвхөн-өсдөг accretion | — |
| 1 | 1A normalize `gravity.md` | Zachman 3.0 normalization; Rule 5 | Self-rot | M |
| 1 | 1B duplicate-fact lint | Rule 3 + Rule 5 | Self-rot (автомат) | M |
| 1 | 1C self-hosting + dogfood CI (бүтэн) | Rule 7 (recursive) | Open loop; evidence суурь | L |
| 2 | 2A Zachman-row mapping + status-tag reframe | 6 perspectives; Operations row | Soundness; generalizability | S–M |
| 2 | 2B authoring DAG + Lite-default | W6H ordering + incremental | Overhead / sustainability | S |
| 3 | 3A ADR = "which" interrogative | W6H 7th interrogative | Концепцийн эвлэл | S |
| 3 | 3B positioning + N=1 honesty | Zachman criticisms | Confidence calibration | S |

## 6. Бие даан хэлсэн критик яаж сонгодог EA критиктэй map хийгдэх

Судалгааны өмнө бие даан тэмдэглэсэн 2 сул талыг судалгаа нь Zachman-ийн өөрийнх нь баримтжсан критиктэй
холбосон — өөрөөр хэлбэл санал биш, EA-ийн сонгодог failure mode:

| Бие даасан критик | Үүнийг илэрхийлэх сонгодог Zachman критик | Засах tier |
|---|---|---|
| Ongoing maintenance (10–20ц/сар) тогтворгүй; ship-ийн дарамтад spec rot хийдэг | *"nobody implements the whole framework"*; "rarely fully populated"; "impractical" | 2B (Lite default) + 1A (бага surface) |
| Evidence = N=1 (нэг автор, нэг төсөл, control-гүй) | *"detailed examples demonstrating successful practical application"* дутагдалтай | 1C (metrics loop) + 3B (шударга framing) |

## 7. Дараалал & dependency

```
Tier 0 guardrail ── үргэлж асаалттай ────────────────────────────┐
                                                                 │
1A normalize gravity ──► 1B lint (1A-г шалгана) ──► 1C dogfood CI (1B-г өөр дээрээ ажиллуулна)
                                                                 │
                                                  2A row-mapping  │  2B DAG + Lite default
                                                                 │
                                                  3A ADR=which    │  3B positioning
```

Tier 1-ийг эрэмбэлсэн багцаар эхэлж хий (self-reinforcing бөгөөд гол сул талыг засна), дараа нь Tier 2,
дараа нь Tier 3. Tier 0 бүгдийг захирна.

## 8. Шийдвэрлэгдсэн (2026-05-29)

- [x] **Filename / location** — `specs/extended/ZACHMAN-ALIGNMENT.md` хэвээр (`METHODOLOGY.md`-ийн peer; `_meta/` нь adopting төсөлд хуулдаг template-уудад зориулагдсан).
- [x] **Хэл** — Энэ baseline баримт **Монголоор**. Одоо байгаа англи файл (`METHODOLOGY.md`, `workflow/*` г.м.) засагдахдаа тэдгээрийн англи хэлийг хадгална → repo холимог хэлтэй болно.
- [x] **1A scope** — `_template` + GL worked example **л**. Бусад overlay модуль (wallet-settlement / kyc-aml / lending) нь зөвхөн `MODULE-OVERVIEW.md` (condensed) — full `gravity.md`-гүй тул normalize хийх зүйл алга.
- [x] **1C depth** — **Бүтэн self-spec модуль + CI** (lean script биш). Tier 0-той эвлэрэл нь "verification infrastructure" заалтаар (1C хэсгийг үз).
- [x] **Version policy** — Tier 1 дуусахад методологийг **v3.1** болгоно + core гурвалын (`METHODOLOGY`/`README`/`EXPLAINED`) version-ийг нэгтгэж §4-ийн skew-г зэрэг засна.

## 9. Non-goals

Энэ шинжилгээ дараахыг санал болгохгүй: Zachman-ийн дутуу row/cell-ийг буцааж нэмэх (Tier 0 хориглоно;
1C-ийн self-spec нь verification infra, completeness биш гэдгийг анхаар), 6-dimension core-ыг өөрчлөх,
эсвэл R1–R6 agent pipeline-ийг солих. Методологийн core дизайн нь бат — эдгээр нь alignment refinement,
redesign биш.

## 10. Эх сурвалж

- Zachman International — *Enterprise Architecture Defined: Primitives and Composites* — https://zachman-feac.com/resources/blog/enterprise-architecture-defined-primitives-and-composites-1
- *Zachman Framework* — Wikipedia (7 rules, perspectives, criticisms) — https://en.wikipedia.org/wiki/Zachman_Framework
- *The Zachman Framework Evolution* (John P. Zachman, zachman.com) — https://www.zachman.com/resource/ea-articles/54-the-zachman-framework-evolution-by-john-p-zachman
- *Ordering stakeholder viewpoint concerns … the W6H framework* (arXiv:1509.07360) — https://arxiv.org/abs/1509.07360
- *7 Common Myths about the Zachman Architecture Framework* (EWSolutions) — https://www.ewsolutions.com/7-common-myths-about-the-zachman-architecture-framework/
- *Why the Zachman Framework is not an ontology* (Nick Malik / Microsoft) — https://learn.microsoft.com/en-us/archive/blogs/nickmalik/why-the-zachman-framework-is-not-an-ontology

---

## 11. Implementation log

### 2026-05-29 — Path A landed (lean: 1A + drift-clear)

Over-engineering хэлэлцүүлгийн дагуу зөвхөн өндөр өгөөжтэй lean дэд багцыг хэрэгжүүлэв; 1B/1C/2A/2B/3A зориуд хойшлуулсан.

**Хийгдсэн:**
- **1A** — `gravity.md` → pointer-only ("one fact, one cell"): `core/templates/_template/gravity.md`, `examples/overlays/finance-accounting/modules/general-ledger/gravity.md` (20 HW → pointer; `HW-GL-14`/`HW-GL-16` → alias), `METHODOLOGY.md §9` (convention документжсэн). Баталгаажсан: GL gravity-д restated substance үлдсэнгүй.
- **§4 drift** — бүгд цэвэрлэгдсэн: top `README.md` ("7 step-by-step" → "00–12"), `EXPLAINED §16` path ерөнхийчлөв, `EXPLAINED §3/§15` "90 файл" de-hardcode, version skew → core трио **v3.0.0 / 2026-05-29**. (+5 дахь "90 файл" `one-man-army.md`-д verify-grep-ээр баригдсан.)

**Version шийдвэр:** skew одоо **v3.0.0** дээр цэвэрлэв; **v3.1 нь Tier 1 бүрэн дуусахад** (1B+1C) зориулж хадгалав. "Version ~14 файлд тархсан" нь тусдаа single-source normalization → дараагийн pass.

**Хойшлуулсан (lean, зориуд):** 1B (dup-fact lint), 1C (self-spec + CI), 2A/2B, 3A.

**Дараах:** improve-through-use — lean методологио бодит модульд (NewsApp) хэрэглэж, friction-аар цаашдын өөрчлөлтийг жолоодох.

### 2026-05-29 — "Improve a lot" session: 1B + 2B + 3B + 1C-lean landed

Lean ч substantial pass (over-engineering дисциплин хадгалсан; 2A + 1C-full + 3A алгасав).

- **1B** — normalization lint: R5 agent (check section + summary), `02-drift-categorization.md` (5-р тэнхлэг), `03-r3-deep-review.md` (task #9). 1A-г автоматаар хамгаална.
- **2B** — `01-authoring-checklist.md`-д authoring dependency DAG (WHY→WHAT→HOW→{WHO,WHEN}→WHERE) + Tier 0 Lite-г default; `extended/workflow/10-adoption-guide/00-START-HERE.md`-д Lite-default. Мөн Phase 9 gravity-г pointer-only болгож 1A-completion (хуучин формат хоцорсныг зассан).
- **3B** — METHODOLOGY §1 positioning ("Zachman taxonomy + дутуу process/verification давхарга"); §14 + specs/README N=1 honesty caveat.
- **1C-lean** — `scripts/dogfood-drift-scan.sh`: методологийн өөрийн репод механик self-check (gravity restatement / core-trio version / hardcoded path). Эхний ажиллалт **PASS (3/3)**. Семантик normalization R5-д үлдэнэ. Full self-spec модуль зориуд хийгээгүй (over-engineering).

- **2A** (нэмэв) — METHODOLOGY §1-д Zachman-row mapping (ZeeSpec нь Owner→Designer→Builder 3 мөрийг шахдаг; Executive/Scope + Technician/Components-ийг зориуд орхино) + §4/§7-д "status-tag = Builder↔Operations гүүр" framing. Танилцуулга/онолын credibility-д (deck) үнэ цэнтэй; зан төлөв өөрчлөхгүй.

**Одоо хойшлуулсан:** 1C-full (self-spec модуль + CI — over-engineering), 3A (ADR="which" — ornament). v3.1 нь эдгээр + бодит ашиглалтын дараа.

### 2026-06-05 — v3.1 alignment pass (deep-research benchmark + 5 сайжруулалт)

Гадны салбарын benchmark (Spec Kit / Kiro / BMAD / Tessl + Anthropic context-engineering + spec-drift судалгаа; deep-research 2026-06-05) нь ZeeSpec-ийн **цөм чиглэл зөв** ("spec = эх үнэн", role-specialized агент, durable-context↔per-module салгалт, `where.md §5` stack-binding тусгаарлалт) гэдгийг баталж, мөн **2B + 1C нь хамгийн өндөр өгөөжтэй дараагийн алхам** гэсэн §3-ын дотоод оношлогоог гаднаас давхар баталгаажуулав. Энэ pass нь тэдгээрийг хэрэгжүүлэв:

- **2B бүрэн** — `METHODOLOGY.md §2a "Module Weight Tiers"`: Lite/Standard/Full жингийн загвар + шийдвэрийн матриц (`08-one-man-army`-аас цөм рүү ерөнхийчилж зөөв), **Lite-default-ыг §2/§15-аас илрэхүйц** болгов. **WEIGHT ≠ MATURITY** хоёр тэнхлэгийг тусгаарлаж, "Tier" 3 утгын overload-ыг цэгцлэв (rename хийгээгүй; "Tier 0 Lite" = Lite alias). Grounding: BMAD scale-adaptive, Kiro 3-artifact, Anthropic progressive disclosure.
- **1C-lean өргөтгөл (adopter CI gate)** — `scripts/ci-drift-gate.sh`: adopting төслүүдэд зориулсан, AI-гүй, deterministic build-time gate (Type 1 citation resolution + Type 2 annotated-count; WARN/FAIL env-toggle; зөрчилтэй бол nonzero exit = "broken trace = broken build", ReqToCode). `extended/workflow/08-code-drift-management/03-auto-drift-detection.md`-д баримтжуулав. **Энэ нь өөрийн репо дээрх 1C-full self-spec модуль БИШ** (тэр хэвээр хойшлогдсон) — adopter-facing sliver; `dogfood-drift-scan.sh` (methodology өөрийн self-check)-ээс ялгаатай.
- **1C metrics loop (input #4)** — `core/templates/_meta/metrics-loop.md`: version бүрээр **олон хүчин зүйл** (authoring time, findings/severity, drift-catch vs false-positive rate, tier mix, cognitive load) — нэг тоо БИШ (ICSE-SEIP 2026). N=1 baseline-ыг directional гэж шошголов. §3-ын self-improving #4 цоорхойг хаав.
- **Reviewer re-scope** — `METHODOLOGY.md §3c` + `workflow/04` тэмдэглэл: AI review = **structural residual**; зохицуулалтын утгыг (босго/хугацаа/enum) deterministic check/BDD руу (R4 → assertion → CI gate), reviewer-ийн санах ойд найдахгүй. B1 grep + `file:line` нь аль хэдийн external ground truth гэдгийг **зээлдэв** (design эвдрээгүй, scope л хурцалсан). Defect-specifiability lens (arXiv:2603.25773) — **non-peer-reviewed, single-author, Claude-implemented, directional** гэж шударгаар иш татав.
- **§4 self-drift sweep (1C acceptance test)** — stale self-count-уудыг de-hardcode: `08-one-man-army` "90 files", `specs/README` + `EXPLAINED` + finance-overlay "13 anti-patterns" (бодит 14), top `README` "5 checklists" (бодит 6), EXPLAINED tree counts, glossary count. `dogfood-drift-scan.sh` **PASS (3/3)** хэвээр.

**Хэрэгжүүлэлт:** design (5 параллель агент, grounded edits) → программаар apply (20/20 цэвэр) → adversarial dogfood review (4 lens). **Шударга тэмдэглэл:** энэ pass-ыг Claude (Opus 4.8) боловсруулсан; бодит ашиглалтын friction хараахан хэмжигдээгүй — metrics-loop-ийн эхний бодит мөр нь дараагийн модулиас.

**v3.1 finalize (2026-06-06, хэрэглэгчийн шийдвэрээр):** (1) core trio → **v3.1.0** (+ last_updated, changelog мөр, prose "Version 3.1"); 4 файл дахь **"NEW v3.2"** inline tag → **v3.1** (core-той зөрчил арилав); (2) finance-overlay glossary count twins (~120 / ~80) de-hardcode — glossary файлын өөрийн ~100 нь single-source; (3) `07-zeespec-lite`-д weight-vocabulary pointer (§2a), `00-START-HERE`-д just-in-time loading тэмдэглэл, `specs/README` TL;DR-д Lite-default headline нэмэв. dogfood-drift-scan PASS хэвээр.

**Үлдсэн (сонголтот, дараагийн pass):** `07-zeespec-lite`-ийн багана гарчгийг бүрэн Lite/Standard/Full rename (одоо alias pointer хангалттай); broader version-sprawl (PORTING-GUIDE + workflow/checklist frontmatter) single-source normalization; 1C-full self-spec модуль (зориуд хойшилсон, over-engineering).

### 2026-06-06 — deferred batch 2 (R4→assertion + version single-source)

Зөвлөмжийн дагуу 2 өндөр өгөөжтэй deferred-ийг хийв:

- **3.1 — R4 → executable assertion** — `extended/workflow/07-r4-regulatory-research/03-citation-conventions.md`-д "From citation to executable assertion" хэсэг (CTR threshold → BDD Given/When/Then worked example + division-of-labor хүснэгт: test suite = values, `ci-drift-gate` = citations/counts, R1/R2 = architectural residual). `METHODOLOGY §3c`-д worked-pattern pointer нэмэв — §3c-ийн зааврыг бодит хэрэгсэл болгов.
- **1.2 — version single-source** — `METHODOLOGY §6`-д "Versioning convention" (package version = core-docs single-source vs per-file version = бие даасан; skew нь drift биш). `PORTING-GUIDE` → core-doc, **v3.1.0**; `dogfood-drift-scan.sh` → **quartet** (METHODOLOGY/README/EXPLAINED/PORTING-GUIDE) version check; CLAUDE template + GL дахь stale "language-agnostic v2.3" hardcode de-hardcode. dogfood PASS.

**Одоо үлдсэн (зориуд):** 07-ийн багана бүрэн rename (alias хангалттай); per-file version-ийн гүн normalization (convention-оор зарчимжуулсан — mass-bump хийхгүй); 1C-full self-spec модуль (over-engineering).

---

**Гаргасан:** 2026-05-29 · **Шинэчилсэн:** 2026-05-29 (Path A landed — §11) · **Төлөв:** PARTIALLY-IMPLEMENTED · **License:** MIT (package-тай ижил)
