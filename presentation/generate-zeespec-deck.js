// ZeeSpec v3.0 — Presentation Deck Generator
// 20-slide deck for explaining ZeeSpec to others
// Palette: Ocean Gradient (065A82 deep blue + 1C7293 teal + 21295C midnight + FFFFFF)
// Typography: Georgia (headers) + Calibri (body)

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.author = "batzaya";
pres.company = "ZeeSpec methodology";
pres.title = "ZeeSpec v3.0 — Methodology Overview";
pres.subject = "Spec methodology for regulated, AI-aided systems";
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches

// === COLORS ===
const C = {
  deepBlue: "065A82",
  teal: "1C7293",
  midnight: "21295C",
  white: "FFFFFF",
  ice: "CADCFC",
  charcoal: "2C3E50",
  lightGray: "F5F7FA",
  mediumGray: "6B7280",
  accent: "F59E0B", // amber accent
  success: "10B981", // green
  warning: "EF4444", // red
  yellow: "FBBF24",
};

// === HELPER: dark slide background ===
function darkSlide(slide) {
  slide.background = { color: C.midnight };
}
function lightSlide(slide) {
  slide.background = { color: C.lightGray };
}
function whiteSlide(slide) {
  slide.background = { color: C.white };
}

// === HELPER: section header at top of light slide ===
function addSlideHeader(slide, sectionLabel, slideTitle) {
  slide.addText(sectionLabel, {
    x: 0.5,
    y: 0.3,
    w: 12,
    h: 0.3,
    fontSize: 11,
    fontFace: "Calibri",
    color: C.teal,
    bold: true,
    charSpacing: 3,
  });
  slide.addText(slideTitle, {
    x: 0.5,
    y: 0.6,
    w: 12,
    h: 0.8,
    fontSize: 32,
    fontFace: "Georgia",
    color: C.midnight,
    bold: true,
  });
}

// === HELPER: small footer at bottom ===
function addFooter(slide, slideNum) {
  slide.addText("ZeeSpec v3.0", {
    x: 0.5,
    y: 7.0,
    w: 4,
    h: 0.3,
    fontSize: 9,
    fontFace: "Calibri",
    color: C.mediumGray,
  });
  slide.addText(String(slideNum), {
    x: 12.5,
    y: 7.0,
    w: 0.4,
    h: 0.3,
    fontSize: 9,
    fontFace: "Calibri",
    color: C.mediumGray,
    align: "right",
  });
}

// ========================================================================
// SLIDE 1 — TITLE
// ========================================================================
{
  const s = pres.addSlide();
  darkSlide(s);

  // Big "ZS" monogram visual motif
  s.addShape("roundRect", {
    x: 5.67,
    y: 1.5,
    w: 2,
    h: 2,
    fill: { color: C.teal },
    line: { color: C.ice, width: 2 },
    rectRadius: 0.2,
  });
  s.addText("ZS", {
    x: 5.67,
    y: 1.5,
    w: 2,
    h: 2,
    fontSize: 80,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
  });

  // Title
  s.addText("ZeeSpec", {
    x: 0.5,
    y: 4.0,
    w: 12.33,
    h: 1,
    fontSize: 60,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
  });

  // Subtitle
  s.addText("AI-aided хөгжүүлэлтэд зориулсан spec methodology", {
    x: 0.5,
    y: 5.0,
    w: 12.33,
    h: 0.5,
    fontSize: 20,
    fontFace: "Calibri",
    color: C.ice,
    align: "center",
    italic: true,
  });

  // Tagline
  s.addText(
    "Регуляторт чиглэсэн системийг урт хугацааны spec + AI-friendly format-аар хадгалах",
    {
      x: 0.5,
      y: 5.5,
      w: 12.33,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.ice,
      align: "center",
    },
  );

  // Version + date
  s.addText("v3.0  |  2026-05-18", {
    x: 0.5,
    y: 6.5,
    w: 12.33,
    h: 0.3,
    fontSize: 14,
    fontFace: "Calibri",
    color: C.white,
    align: "center",
    charSpacing: 4,
    bold: true,
  });
}

// ========================================================================
// SLIDE 2 — 1 ӨГҮҮЛБЭР
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "НЭГ ӨГҮҮЛБЭРЭЭР", "ZeeSpec гэж юу вэ?");

  // Big quote
  s.addShape("rect", {
    x: 0.7,
    y: 2.0,
    w: 0.15,
    h: 4.0,
    fill: { color: C.teal },
    line: { type: "none" },
  });

  s.addText(
    '"AI агент (Claude, Cursor) ашиглаж кодлох үед регуляторт чиглэсэн системийг урт хугацааны spec + AI-friendly format-аар хадгалах domain-agnostic methodology."',
    {
      x: 1.2,
      y: 2.0,
      w: 11.5,
      h: 3.0,
      fontSize: 24,
      fontFace: "Georgia",
      color: C.midnight,
      italic: true,
      valign: "top",
    },
  );

  s.addText("Энгийн үгээр:", {
    x: 1.2,
    y: 5.2,
    w: 11.5,
    h: 0.4,
    fontSize: 14,
    fontFace: "Calibri",
    color: C.teal,
    bold: true,
  });

  s.addText(
    "AI агент болон engineering team хоёрын хооронд системийг яаж ажиллах ёстойг тогтоосон гэрээ.",
    {
      x: 1.2,
      y: 5.6,
      w: 11.5,
      h: 0.8,
      fontSize: 18,
      fontFace: "Calibri",
      color: C.charcoal,
    },
  );

  addFooter(s, 2);
}

// ========================================================================
// SLIDE 3 — PROBLEMS (3 хэсэг)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "ПРОБЛЕМ", "Яагаад ZeeSpec үүсэв?");

  const problems = [
    {
      num: "1",
      title: "AI hallucination",
      desc: "Claude/Copilot taamaglan KYC threshold, retention deadline гэх мэтийг буруу бичдэг. AML threshold US=$10K, EU=€10K, Mongolia=20M MNT гэдгийг санахгүй.",
      icon: "!",
      color: C.warning,
    },
    {
      num: "2",
      title: "Spec нь сэрж буй",
      desc: "Spec 2024-д бичсэн; код 2025-д шинэчилсэн; spec сэрсэн. AI үүнийг уншвал буруу код бичнэ. Auditor үүнийг уншвал нот find олно.",
      icon: "?",
      color: C.accent,
    },
    {
      num: "3",
      title: '"Яагаад ийм код бичсэн юм?"',
      desc: '2 жилийн дараа шинэ engineer. Slack-аас контекст хайв; гүрсэн. Bob аль хэдийн явсан. "Fix" хийгээд production bug + regulatory gap үүсгэв.',
      icon: "?",
      color: C.teal,
    },
  ];

  problems.forEach((p, i) => {
    const y = 1.8 + i * 1.65;

    // Number circle
    s.addShape("ellipse", {
      x: 0.7,
      y,
      w: 1.0,
      h: 1.0,
      fill: { color: p.color },
      line: { type: "none" },
    });
    s.addText(p.num, {
      x: 0.7,
      y,
      w: 1.0,
      h: 1.0,
      fontSize: 36,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Title
    s.addText(p.title, {
      x: 2.0,
      y: y + 0.05,
      w: 11,
      h: 0.5,
      fontSize: 22,
      fontFace: "Georgia",
      color: C.midnight,
      bold: true,
    });

    // Description
    s.addText(p.desc, {
      x: 2.0,
      y: y + 0.5,
      w: 10.8,
      h: 1.0,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.charcoal,
    });
  });

  addFooter(s, 3);
}

// ========================================================================
// SLIDE 4 — SOLUTIONS (3 хэсэг)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "ШИЙДЭЛ", "ZeeSpec хэрхэн эдгээрийг шийдэх вэ?");

  const solutions = [
    {
      num: "1",
      problem: "AI hallucination",
      solution: "Status-tagged invariants + citations",
      detail:
        "Бүх invariant ✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN tag + file:line citation. AI уншиж кодондоо `// INV-WAL-04` гэж ишилнэ.",
    },
    {
      num: "2",
      problem: "Spec нь сэрж буй",
      solution: "R5 drift scanner + CI integration",
      detail:
        "PR гарах бүрд spec ↔ code drift автоматаар илрэх. 4-type framework: Citation / Field / Behavioral / Architectural.",
    },
    {
      num: "3",
      problem: '"Яагаад ийм код?"',
      solution: "ADR lifecycle (workflow/09)",
      detail:
        "Decision бүр Proposed → Accepted → Superseded. R6 agent retroactive ADR draft. Annual review.",
    },
  ];

  solutions.forEach((sol, i) => {
    const y = 1.8 + i * 1.65;

    // Number badge
    s.addShape("roundRect", {
      x: 0.7,
      y,
      w: 1.0,
      h: 1.0,
      fill: { color: C.success },
      line: { type: "none" },
      rectRadius: 0.15,
    });
    s.addText(sol.num, {
      x: 0.7,
      y,
      w: 1.0,
      h: 1.0,
      fontSize: 36,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Solution title (problem → solution)
    s.addText(`${sol.problem}  →  ${sol.solution}`, {
      x: 2.0,
      y: y + 0.05,
      w: 11,
      h: 0.5,
      fontSize: 18,
      fontFace: "Georgia",
      color: C.midnight,
      bold: true,
    });

    // Detail
    s.addText(sol.detail, {
      x: 2.0,
      y: y + 0.55,
      w: 10.8,
      h: 1.0,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.charcoal,
    });
  });

  addFooter(s, 4);
}

// ========================================================================
// SLIDE 5 — 10-FILE FRAMEWORK
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "БҮТЭЦ", "10-file Zachman framework");

  s.addText(
    "Module бүр 10 файлаас бүрдсэн spec-тэй. Бүгд stack-agnostic; зөвхөн where.md § 5 нь tech-stack-тай.",
    {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.mediumGray,
      italic: true,
    },
  );

  const files = [
    { name: "CLAUDE.md", q: "AI agent entry", color: C.deepBlue },
    { name: "why.md", q: "Яагаад?", color: C.teal },
    { name: "what.md", q: "Юу?", color: C.teal },
    { name: "how.md", q: "Хэрхэн?", color: C.teal },
    { name: "who.md", q: "Хэн?", color: C.teal },
    { name: "when.md", q: "Хэзээ?", color: C.teal },
    { name: "where.md", q: "Хаана?", color: C.teal },
    { name: "gravity.md", q: "Cross-cutting HW", color: C.deepBlue },
    { name: "gaps.md", q: "Open questions", color: C.deepBlue },
    { name: "glossary.md", q: "Терминологи", color: C.deepBlue },
  ];

  // 5 cols x 2 rows
  files.forEach((f, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 0.5 + col * 2.55;
    const y = 2.2 + row * 2.0;

    s.addShape("roundRect", {
      x,
      y,
      w: 2.3,
      h: 1.7,
      fill: { color: C.white },
      line: { color: f.color, width: 2 },
      rectRadius: 0.1,
    });

    // Side strip
    s.addShape("rect", {
      x,
      y,
      w: 0.15,
      h: 1.7,
      fill: { color: f.color },
      line: { type: "none" },
    });

    s.addText(f.name, {
      x: x + 0.3,
      y: y + 0.3,
      w: 1.9,
      h: 0.5,
      fontSize: 16,
      fontFace: "Consolas",
      color: C.midnight,
      bold: true,
    });
    s.addText(f.q, {
      x: x + 0.3,
      y: y + 0.85,
      w: 1.9,
      h: 0.5,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.mediumGray,
    });
  });

  addFooter(s, 5);
}

// ========================================================================
// SLIDE 6 — STATUS TAGS
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "КЛЮЧ ОЙЛГОЛТ", "Status tags — реалити сэлгэх");

  s.addText(
    "Invariant бичихдээ зөвхөн зөв байж байгааг хэлэхгүй. Жинхэнэ статусыг тэмдэглэдэг.",
    {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.mediumGray,
      italic: true,
    },
  );

  const tags = [
    {
      icon: "✅",
      name: "IMPL",
      meaning: "Production-д verify-чдсэн",
      ai: "AI итгэж кодлоно",
    },
    {
      icon: "🟡",
      name: "PARTIAL",
      meaning: "Зөвхөн app-layer",
      ai: "Defense-in-depth нэмэх",
    },
    {
      icon: "🚧",
      name: "DESIGN",
      meaning: "Зөвхөн төлөвлөгөө; production-д БАЙХГҮЙ",
      ai: "STOP — асуул",
    },
    {
      icon: "🚧",
      name: "NOT-ENFORCED",
      meaning: "Spec хэлсэн ч код enforce хийхгүй",
      ai: "Gap file хийх",
    },
    {
      icon: "🚧",
      name: "BROKEN",
      meaning: "Enforce хийх гэсэн ч runtime crash",
      ai: "P0 production bug",
    },
  ];

  tags.forEach((t, i) => {
    const y = 2.1 + i * 0.85;

    s.addShape("roundRect", {
      x: 0.5,
      y,
      w: 12.33,
      h: 0.7,
      fill: { color: C.white },
      line: { color: C.ice, width: 1 },
      rectRadius: 0.05,
    });

    s.addText(t.icon, {
      x: 0.7,
      y,
      w: 0.8,
      h: 0.7,
      fontSize: 28,
      align: "center",
      valign: "middle",
    });

    s.addText(t.name, {
      x: 1.6,
      y,
      w: 2.5,
      h: 0.7,
      fontSize: 16,
      fontFace: "Consolas",
      color: C.midnight,
      bold: true,
      valign: "middle",
    });

    s.addText(t.meaning, {
      x: 4.2,
      y,
      w: 5.0,
      h: 0.7,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });

    s.addText(t.ai, {
      x: 9.3,
      y,
      w: 3.8,
      h: 0.7,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.teal,
      italic: true,
      valign: "middle",
    });
  });

  s.addText("AI behaviour", {
    x: 9.3,
    y: 1.85,
    w: 3.8,
    h: 0.25,
    fontSize: 10,
    fontFace: "Calibri",
    color: C.teal,
    bold: true,
    charSpacing: 2,
  });

  addFooter(s, 6);
}

// ========================================================================
// SLIDE 7 — SEVERITY MATRIX
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "КЛЮЧ ОЙЛГОЛТ", "Severity matrix — priority calibrate");

  s.addText("Gap-уудыг priority-аар ялгаж AI behaviour-ыг тогтоодог.", {
    x: 0.5,
    y: 1.5,
    w: 12.33,
    h: 0.4,
    fontSize: 14,
    fontFace: "Calibri",
    color: C.mediumGray,
    italic: true,
  });

  const severities = [
    {
      icon: "🚨",
      name: "P0",
      meaning: "Money loss / compliance / runtime crash",
      ai: "Chip байхгүй → STOP. Chip байх → cite + биш хэрэгжүүлэх.",
      color: C.warning,
    },
    {
      icon: "🟠",
      name: "P1",
      meaning: "Audit gap / aged reconciliation / missing guard",
      ai: "Chip байх → cite; explicit invoke хүсэх.",
      color: C.accent,
    },
    {
      icon: "🟡",
      name: "P2",
      meaning: "Reporting drift / stale refs",
      ai: "Хэрэгжүүлээд cite хийх.",
      color: C.yellow,
    },
    {
      icon: "🟢",
      name: "P3",
      meaning: "Style / cleanup",
      ai: "Хэрэгжүүлээд cite.",
      color: C.success,
    },
  ];

  severities.forEach((sev, i) => {
    const y = 2.2 + i * 1.0;

    s.addShape("roundRect", {
      x: 0.5,
      y,
      w: 12.33,
      h: 0.85,
      fill: { color: C.white },
      line: { color: sev.color, width: 2 },
      rectRadius: 0.1,
    });

    s.addShape("rect", {
      x: 0.5,
      y,
      w: 0.15,
      h: 0.85,
      fill: { color: sev.color },
      line: { type: "none" },
    });

    s.addText(sev.icon, {
      x: 0.8,
      y,
      w: 0.7,
      h: 0.85,
      fontSize: 22,
      align: "center",
      valign: "middle",
    });

    s.addText(sev.name, {
      x: 1.5,
      y,
      w: 1.2,
      h: 0.85,
      fontSize: 20,
      fontFace: "Georgia",
      color: sev.color,
      bold: true,
      valign: "middle",
    });

    s.addText(sev.meaning, {
      x: 2.8,
      y,
      w: 5.5,
      h: 0.85,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });

    s.addText(sev.ai, {
      x: 8.4,
      y,
      w: 4.4,
      h: 0.85,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.teal,
      italic: true,
      valign: "middle",
    });
  });

  addFooter(s, 7);
}

// ========================================================================
// SLIDE 8 — WORKFLOW (4 phases)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "WORKFLOW", "4 phase — Module бичих → Tier 1 → Тасралтгүй");

  const phases = [
    {
      title: "ҮЕ 1",
      label: "Module анх бичих",
      content:
        "01. Author\n02. B1 verify\n03. R3 deep review\n04. R1+R2 parallel\n05. Apply findings\n→ Tier 1",
      time: "1-2 неделя",
      color: C.deepBlue,
    },
    {
      title: "ҮЕ 2",
      label: "Regulator research",
      content:
        "07. R4 (11 sub-files)\n• 6-phase research\n• Multi-jurisdiction\n• Amendment tracking\n• Translation",
      time: "one-time + жил тутам",
      color: C.teal,
    },
    {
      title: "ҮЕ 3",
      label: "Тасралтгүй",
      content:
        "08. Code drift (R5)\n• CI per PR\n• Monthly review\n09. ADR lifecycle (R6)\n• Drift → ADR\n• Annual curation",
      time: "Continuous",
      color: C.midnight,
    },
    {
      title: "ҮЕ 4",
      label: "Organizational",
      content:
        "10. Adoption guide\n• Greenfield / Brownfield\n• Team rollout\n• Tooling\n11. Anthropic plugin",
      time: "one-time per team",
      color: C.accent,
    },
  ];

  phases.forEach((p, i) => {
    const x = 0.5 + i * 3.16;
    const y = 1.8;

    s.addShape("roundRect", {
      x,
      y,
      w: 2.9,
      h: 4.8,
      fill: { color: C.white },
      line: { color: p.color, width: 2 },
      rectRadius: 0.15,
    });

    // Top banner
    s.addShape("rect", {
      x,
      y,
      w: 2.9,
      h: 0.7,
      fill: { color: p.color },
      line: { type: "none" },
    });

    s.addText(p.title, {
      x,
      y,
      w: 2.9,
      h: 0.4,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
      charSpacing: 3,
    });

    s.addText(p.label, {
      x,
      y: y + 0.3,
      w: 2.9,
      h: 0.4,
      fontSize: 16,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(p.content, {
      x: x + 0.2,
      y: y + 0.95,
      w: 2.5,
      h: 3.3,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "top",
    });

    s.addText(p.time, {
      x: x + 0.2,
      y: y + 4.2,
      w: 2.5,
      h: 0.4,
      fontSize: 10,
      fontFace: "Calibri",
      color: p.color,
      italic: true,
      align: "center",
      charSpacing: 2,
    });
  });

  // Arrows between phases
  for (let i = 0; i < 3; i++) {
    s.addText("→", {
      x: 3.3 + i * 3.16,
      y: 4.0,
      w: 0.4,
      h: 0.5,
      fontSize: 28,
      color: C.teal,
      bold: true,
      align: "center",
      valign: "middle",
    });
  }

  addFooter(s, 8);
}

// ========================================================================
// SLIDE 9 — AI AGENTS (R4 / R5 / R6)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "AI AGENTS", "3 specialized agent prompt");

  s.addText(
    "Claude Code-д dispatch хийдэг тусгай агентууд. Та өөрөө copy-paste-аар ашиглах боломжтой.",
    {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.mediumGray,
      italic: true,
    },
  );

  const agents = [
    {
      id: "R4",
      name: "Regulatory Research",
      role: "Regulator сайт + хууль уншиж, INV-д citation бичих",
      when: "New module + жил тутам + amendment alert үед",
      time: "30-60 мин",
      cost: "$1-5",
      file: "workflow/07-r4-regulatory-research/04-R4-agent-prompt.md",
      color: C.deepBlue,
    },
    {
      id: "R5",
      name: "Drift Scanner",
      role: "Spec ↔ code хооронд drift автоматаар илрүүлэх",
      when: "PR per CI + monthly scheduled + post-refactor",
      time: "15-45 мин",
      cost: "$0.50-1.50",
      file: "workflow/08-code-drift-management/05-R5-drift-scanner-agent.md",
      color: C.teal,
    },
    {
      id: "R6",
      name: "ADR Curator",
      role: "Drift-аас retroactive ADR draft; annual ADR review",
      when: "R5 finding-аас + annual curation + new ADR conflict check",
      time: "30-60 мин",
      cost: "$1-3",
      file: "workflow/09-adr-lifecycle/05-R6-adr-curator-agent.md",
      color: C.midnight,
    },
  ];

  agents.forEach((a, i) => {
    const y = 2.1 + i * 1.65;

    // Agent badge
    s.addShape("roundRect", {
      x: 0.5,
      y,
      w: 1.5,
      h: 1.5,
      fill: { color: a.color },
      line: { type: "none" },
      rectRadius: 0.15,
    });
    s.addText(a.id, {
      x: 0.5,
      y: y + 0.1,
      w: 1.5,
      h: 0.7,
      fontSize: 44,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });
    s.addText(a.name, {
      x: 0.5,
      y: y + 0.85,
      w: 1.5,
      h: 0.55,
      fontSize: 9,
      fontFace: "Calibri",
      color: C.white,
      align: "center",
      valign: "middle",
    });

    // Details
    s.addText(a.role, {
      x: 2.2,
      y: y + 0.05,
      w: 10.6,
      h: 0.4,
      fontSize: 16,
      fontFace: "Georgia",
      color: C.midnight,
      bold: true,
    });

    s.addText(
      [
        { text: "Хэзээ: ", options: { bold: true, color: C.teal } },
        { text: a.when, options: { color: C.charcoal } },
      ],
      {
        x: 2.2,
        y: y + 0.5,
        w: 10.6,
        h: 0.3,
        fontSize: 12,
        fontFace: "Calibri",
      },
    );

    s.addText(
      [
        { text: "Token cost: ", options: { bold: true, color: C.teal } },
        {
          text: `${a.time} • ${a.cost} per dispatch (Sonnet)`,
          options: { color: C.charcoal },
        },
      ],
      {
        x: 2.2,
        y: y + 0.85,
        w: 10.6,
        h: 0.3,
        fontSize: 12,
        fontFace: "Calibri",
      },
    );

    s.addText(a.file, {
      x: 2.2,
      y: y + 1.2,
      w: 10.6,
      h: 0.3,
      fontSize: 10,
      fontFace: "Consolas",
      color: C.mediumGray,
      italic: true,
    });
  });

  addFooter(s, 9);
}

// ========================================================================
// SLIDE 10 — ANTHROPICS/FINANCIAL-SERVICES INTEGRATION
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "INTEGRATION", "anthropics/financial-services + ZeeSpec");

  s.addText(
    "Эдгээр хоёр нь сөргөлдөгч биш — complementary. Тус тусын зориулалттай.",
    {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.mediumGray,
      italic: true,
    },
  );

  // Comparison table
  const headerY = 2.1;
  const colW = 5.9;

  // anthropic column
  s.addShape("roundRect", {
    x: 0.5,
    y: headerY,
    w: colW,
    h: 4.5,
    fill: { color: C.white },
    line: { color: C.accent, width: 2 },
    rectRadius: 0.1,
  });
  s.addShape("rect", {
    x: 0.5,
    y: headerY,
    w: colW,
    h: 0.7,
    fill: { color: C.accent },
    line: { type: "none" },
  });
  s.addText("anthropics/financial-services", {
    x: 0.5,
    y: headerY,
    w: colW,
    h: 0.7,
    fontSize: 16,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
  });

  const anthRows = [
    ["Юу", "Plugin library (agent + skill + connector)"],
    ["Гарц", "Action — deck барина, NAV calc хийнэ, KYC screen"],
    ["Хэн", "Banker / analyst / PE / wealth manager"],
    ["Хэзээ", "Per task (минут-цаг)"],
    ["Хадгалалт", "Output PDF / Excel / memo"],
    ["Хариу", "Fast path — бэлэн tool ашиглах"],
  ];

  anthRows.forEach((r, i) => {
    const y = headerY + 0.9 + i * 0.55;
    s.addText(r[0], {
      x: 0.7,
      y,
      w: 1.5,
      h: 0.5,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.teal,
      bold: true,
      valign: "middle",
    });
    s.addText(r[1], {
      x: 2.2,
      y,
      w: 4.0,
      h: 0.5,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });
  });

  // ZeeSpec column
  s.addShape("roundRect", {
    x: 6.95,
    y: headerY,
    w: colW,
    h: 4.5,
    fill: { color: C.white },
    line: { color: C.deepBlue, width: 2 },
    rectRadius: 0.1,
  });
  s.addShape("rect", {
    x: 6.95,
    y: headerY,
    w: colW,
    h: 0.7,
    fill: { color: C.deepBlue },
    line: { type: "none" },
  });
  s.addText("ZeeSpec", {
    x: 6.95,
    y: headerY,
    w: colW,
    h: 0.7,
    fontSize: 16,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
  });

  const zsRows = [
    ["Юу", "Methodology (spec format + workflow)"],
    ["Гарц", "Spec — урт хугацааны мэдлэгийн систем"],
    ["Хэн", "Engineering team (regulated system бичих)"],
    ["Хэзээ", "Per module (сар-жил)"],
    ["Хадгалалт", "Living spec git дотор"],
    ["Хариу", "Slow path — өөрийн системээ build хийх"],
  ];

  zsRows.forEach((r, i) => {
    const y = headerY + 0.9 + i * 0.55;
    s.addText(r[0], {
      x: 7.15,
      y,
      w: 1.5,
      h: 0.5,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.teal,
      bold: true,
      valign: "middle",
    });
    s.addText(r[1], {
      x: 8.65,
      y,
      w: 4.0,
      h: 0.5,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });
  });

  addFooter(s, 10);
}

// ========================================================================
// SLIDE 11 — 3 INTEGRATION PATTERNS
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "INTEGRATION", "3 pattern: яаж хослуулах вэ?");

  const patterns = [
    {
      num: "1",
      title: "Plugin output → ADR",
      detail:
        "pitch-agent DCF тооцоо хийнэ → WACC 8.5% material decision гарна. R6 agent ADR-PORTFOLIO-014 болгож хадгалa. Plugin re-run хийхэд diff → potentially superseder ADR.",
      color: C.deepBlue,
    },
    {
      num: "2",
      title: "ZeeSpec dispatches plugin",
      detail:
        'R4 research session-д "EU competitive landscape хэрэгтэй" → market-researcher plugin call. Output-ыг R4 citation block-д Tier 2 source болгож ашиглана.',
      color: C.teal,
    },
    {
      num: "3",
      title: "Spec governs plugin config",
      detail:
        'where.md § 5 — "gl-reconciler v2.1 ашиглана; өдөр тутам 22:00 UTC". gl-reconciler-config.yaml spec-ээс автоматаар үүснэ. R5 drift detection spec ↔ config drift илрүүлнэ.',
      color: C.midnight,
    },
  ];

  patterns.forEach((p, i) => {
    const y = 1.9 + i * 1.65;

    // Number circle
    s.addShape("ellipse", {
      x: 0.5,
      y,
      w: 1.2,
      h: 1.2,
      fill: { color: p.color },
      line: { type: "none" },
    });
    s.addText(p.num, {
      x: 0.5,
      y,
      w: 1.2,
      h: 1.2,
      fontSize: 48,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Title
    s.addText(p.title, {
      x: 2.0,
      y: y + 0.05,
      w: 10.8,
      h: 0.45,
      fontSize: 20,
      fontFace: "Georgia",
      color: C.midnight,
      bold: true,
    });

    // Detail
    s.addText(p.detail, {
      x: 2.0,
      y: y + 0.55,
      w: 10.8,
      h: 1.0,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.charcoal,
    });
  });

  addFooter(s, 11);
}

// ========================================================================
// SLIDE 12 — TEAM SCENARIOS
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "ХЭН АШИГЛАХ ВЭ?", "4 team scenario");

  const teams = [
    {
      size: "Solo (1)",
      verdict: "⚠️ Ихэнхдээ ҮГҮЙ",
      detail:
        "Hobby project: methodology >> ROI. Хэрэв TRY хийх юм бол Tier 0 Lite (3 файл, 2 цаг).",
      color: C.mediumGray,
    },
    {
      size: "3-5 startup",
      verdict: "🟡 ХЭСЭГЛЭН",
      detail:
        "1-2 critical модуль Tier 1. Role fallback (Alice+Bob 4-eyes). CI drift active.",
      color: C.accent,
    },
    {
      size: "10-20 mid",
      verdict: "✅ ТИЙМ",
      detail:
        "Champion + backup + feature team. Quarterly R4. Annual R6. ~0.5 FTE ongoing.",
      color: C.teal,
    },
    {
      size: "20+ enterprise",
      verdict: "✅ ТИЙМ (full)",
      detail:
        "Dedicated ZeeSpec team (1-2 FTE). Multi-jurisdiction R4. Dashboard + Slack. ADR governance.",
      color: C.success,
    },
  ];

  teams.forEach((t, i) => {
    const x = 0.5 + i * 3.16;
    const y = 1.9;

    s.addShape("roundRect", {
      x,
      y,
      w: 2.9,
      h: 4.3,
      fill: { color: C.white },
      line: { color: t.color, width: 2 },
      rectRadius: 0.15,
    });

    s.addShape("rect", {
      x,
      y,
      w: 2.9,
      h: 0.7,
      fill: { color: t.color },
      line: { type: "none" },
    });

    s.addText(t.size, {
      x,
      y,
      w: 2.9,
      h: 0.7,
      fontSize: 18,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(t.verdict, {
      x: x + 0.2,
      y: y + 0.85,
      w: 2.5,
      h: 0.7,
      fontSize: 18,
      fontFace: "Calibri",
      color: t.color,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(t.detail, {
      x: x + 0.2,
      y: y + 1.75,
      w: 2.5,
      h: 2.3,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "top",
    });
  });

  addFooter(s, 12);
}

// ========================================================================
// SLIDE 13 — PILOT RESULTS (Mongolia mutual fund)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "PILOT", "Real-world validation: Mongolia mutual fund");

  // Project description
  s.addText(
    "Stack: PHP 8.2 + Symfony 6.4 + PostgreSQL 15  |  5 modules ZeeSpec-чилсэн",
    {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.mediumGray,
      italic: true,
    },
  );

  // 3 big numbers
  const stats = [
    {
      num: "177",
      label: "Total findings",
      sub: "across 5 modules",
      color: C.deepBlue,
    },
    {
      num: "4 + 6",
      label: "Production bugs",
      sub: "4 fixed; 6 queued",
      color: C.warning,
    },
    {
      num: "22",
      label: "Compliance gaps",
      sub: "GDPR/AML/FRC filed",
      color: C.success,
    },
  ];

  stats.forEach((stat, i) => {
    const x = 0.5 + i * 4.28;

    s.addShape("roundRect", {
      x,
      y: 2.1,
      w: 4.05,
      h: 2.0,
      fill: { color: C.white },
      line: { color: stat.color, width: 3 },
      rectRadius: 0.15,
    });

    s.addText(stat.num, {
      x,
      y: 2.25,
      w: 4.05,
      h: 1.0,
      fontSize: 64,
      fontFace: "Georgia",
      color: stat.color,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(stat.label, {
      x,
      y: 3.25,
      w: 4.05,
      h: 0.4,
      fontSize: 16,
      fontFace: "Calibri",
      color: C.midnight,
      bold: true,
      align: "center",
    });

    s.addText(stat.sub, {
      x,
      y: 3.65,
      w: 4.05,
      h: 0.4,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.mediumGray,
      italic: true,
      align: "center",
    });
  });

  // Key findings
  s.addText("Илрүүлсэн жинхэнэ findings:", {
    x: 0.5,
    y: 4.5,
    w: 12.33,
    h: 0.4,
    fontSize: 14,
    fontFace: "Calibri",
    color: C.teal,
    bold: true,
  });

  const findings = [
    "• CTR threshold 20M MNT олж codify (хууль үндэстэй)",
    "• createdBy:0 sentinel anti-pattern 20+ газар олж зас",
    "• Hard DELETE on retention table (BackfillCommand) олж зас",
    "• Approval workflow boundary mismatch (every approved journal throws)",
  ];

  s.addText(findings.join("\n"), {
    x: 0.7,
    y: 4.9,
    w: 12.13,
    h: 1.8,
    fontSize: 13,
    fontFace: "Calibri",
    color: C.charcoal,
    valign: "top",
    paraSpaceAfter: 4,
  });

  addFooter(s, 13);
}

// ========================================================================
// SLIDE 14 — ROI (Cost vs Return)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "ROI", "Cost vs Return");

  // Investment column
  s.addShape("roundRect", {
    x: 0.5,
    y: 1.6,
    w: 6.16,
    h: 5.0,
    fill: { color: C.white },
    line: { color: C.warning, width: 2 },
    rectRadius: 0.15,
  });
  s.addShape("rect", {
    x: 0.5,
    y: 1.6,
    w: 6.16,
    h: 0.7,
    fill: { color: C.warning },
    line: { type: "none" },
  });
  s.addText("INVESTMENT", {
    x: 0.5,
    y: 1.6,
    w: 6.16,
    h: 0.7,
    fontSize: 18,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
    charSpacing: 4,
  });

  const investments = [
    ["Tier 0 Lite (trial)", "2 цаг", "30 мин/quarter"],
    ["Tier 1 (1 module)", "1-2 неделя", "2-4h/month"],
    ["Tier B (5 module)", "4-6 неделя setup", "0.5 FTE"],
    ["Tier C (enterprise)", "2-3 сар", "1-2 FTE"],
    ["AI agent cost", "—", "~$25/quarter per 5 mod"],
  ];

  investments.forEach((row, i) => {
    const y = 2.5 + i * 0.75;
    s.addText(row[0], {
      x: 0.7,
      y,
      w: 2.8,
      h: 0.4,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.midnight,
      bold: true,
      valign: "middle",
    });
    s.addText(row[1], {
      x: 3.5,
      y,
      w: 1.3,
      h: 0.4,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });
    s.addText(row[2], {
      x: 4.8,
      y,
      w: 1.8,
      h: 0.4,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });
  });

  // Return column
  s.addShape("roundRect", {
    x: 6.95,
    y: 1.6,
    w: 5.88,
    h: 5.0,
    fill: { color: C.white },
    line: { color: C.success, width: 2 },
    rectRadius: 0.15,
  });
  s.addShape("rect", {
    x: 6.95,
    y: 1.6,
    w: 5.88,
    h: 0.7,
    fill: { color: C.success },
    line: { type: "none" },
  });
  s.addText("RETURN", {
    x: 6.95,
    y: 1.6,
    w: 5.88,
    h: 0.7,
    fontSize: 18,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
    charSpacing: 4,
  });

  const returns = [
    "1 production bug урьдчилан илрүүлэх:\n  8-40h debug + customer impact saved",
    "1 compliance gap урьдчилан илрүүлэх:\n  $1K-100K+ enforcement risk avoided",
    "New engineer onboarding via spec:\n  Week-1 productivity (vs Week-3)",
    "Audit response:\n  Days → hours (spec artifact)",
    "AI agent code quality:\n  30-50% fewer revision cycles",
  ];

  returns.forEach((r, i) => {
    const y = 2.5 + i * 0.8;
    s.addText(r, {
      x: 7.15,
      y,
      w: 5.5,
      h: 0.7,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "middle",
    });
  });

  // Breakeven banner
  s.addShape("roundRect", {
    x: 2.5,
    y: 6.8,
    w: 8.33,
    h: 0.5,
    fill: { color: C.midnight },
    line: { type: "none" },
    rectRadius: 0.1,
  });
  s.addText(
    "ROI breakeven: ~6 сар (1 bug + 1 gap = methodology cost буцаагаад тооцоо)",
    {
      x: 2.5,
      y: 6.8,
      w: 8.33,
      h: 0.5,
      fontSize: 13,
      fontFace: "Calibri",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    },
  );

  // hide footer here so 6.8 banner above doesn't collide
}

// ========================================================================
// SLIDE 15 — WHEN NOT TO USE
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "ЭСРЭГ ҮЕ", "ZeeSpec ашиглахгүй байх үе");

  s.addText("ZeeSpec бүхний хариу биш. Дараах нөхцөлд ашиглаж болохгүй:", {
    x: 0.5,
    y: 1.5,
    w: 12.33,
    h: 0.4,
    fontSize: 14,
    fontFace: "Calibri",
    color: C.mediumGray,
    italic: true,
  });

  const notUseCases = [
    {
      title: "Throwaway prototype",
      desc: "Methodology overhead >> ROI. ADR alone хангалттай.",
    },
    {
      title: "Pre-PMF startup (1-2 хүн)",
      desc: "Шуурхай iteration хүсэн. README + ADR хангалттай.",
    },
    {
      title: "Pure SaaS no regulatory",
      desc: "Compliance pressure байхгүй. Үнэ цэн дутуу.",
    },
    {
      title: "Trivial CRUD module",
      desc: "10-file overkill. Comment + tests хангалттай.",
    },
    {
      title: "Pure data pipeline",
      desc: "No human-facing / compliance touchpoint.",
    },
    {
      title: "Personal hobby project",
      desc: "Methodology fatigue. Documentation generator илүү.",
    },
  ];

  notUseCases.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 6.3;
    const y = 2.1 + row * 1.5;

    s.addShape("roundRect", {
      x,
      y,
      w: 6.0,
      h: 1.3,
      fill: { color: C.white },
      line: { color: C.warning, width: 1.5 },
      rectRadius: 0.1,
    });

    s.addText("✗", {
      x: x + 0.2,
      y,
      w: 0.7,
      h: 1.3,
      fontSize: 28,
      fontFace: "Calibri",
      color: C.warning,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(c.title, {
      x: x + 0.9,
      y: y + 0.15,
      w: 4.9,
      h: 0.4,
      fontSize: 15,
      fontFace: "Georgia",
      color: C.midnight,
      bold: true,
    });

    s.addText(c.desc, {
      x: x + 0.9,
      y: y + 0.55,
      w: 4.9,
      h: 0.7,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.charcoal,
    });
  });

  addFooter(s, 15);
}

// ========================================================================
// SLIDE 16 — НАХ ASEX (FAQ)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "FAQ", "Цөөн нийт асуулт");

  const faqs = [
    {
      q: '"ZeeSpec нь Anthropic-ийн мөн юу?"',
      a: "Үгүй. Open-source pilot-аас гарсан (MIT). anthropics/financial-services нь complementary plugin library.",
    },
    {
      q: '"Зөвхөн санхүүгийн системд?"',
      a: "Үгүй. Core domain-agnostic. Finance overlay нь жишээ. Healthcare / government / privacy / energy боломжтой.",
    },
    {
      q: '"Claude-тэй л ажиллах юм уу?"',
      a: "Claude Code хамгийн сайн (parallel agent). Cursor / Copilot CLI sequential. GitHub Copilot manual.",
    },
    {
      q: '"PHP-д л хэрэг үү?"',
      a: "Үгүй. PORTING-GUIDE.md 8 stack хувилбар (Java/Python/Go/Rust/TS/C#/Ruby/PHP).",
    },
    {
      q: '"Existing Confluence/Notion-той зөрөх үү?"',
      a: 'Үгүй. Хэвээр үлдээ; ZeeSpec нь supplement. Strategy A "run in parallel" хэрэглэх.',
    },
    {
      q: '"Solo dev-д тохиромжтой юу?"',
      a: "Tier 0 Lite (3 файл, 2 цаг) тохиромжтой. Full Tier 1 (10 файл, 1-2 неделя) тохиромжгүй.",
    },
  ];

  faqs.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 6.3;
    const y = 1.7 + row * 1.7;

    s.addText(f.q, {
      x,
      y,
      w: 6.0,
      h: 0.45,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.teal,
      bold: true,
      italic: true,
    });

    s.addText(f.a, {
      x,
      y: y + 0.5,
      w: 6.0,
      h: 1.0,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "top",
    });
  });

  addFooter(s, 16);
}

// ========================================================================
// SLIDE 17 — NEXT STEPS (per role)
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "ДАРААГИЙН АЛХАМ", "Per role — хаанаас эхлэх вэ?");

  const roles = [
    {
      role: "Tech Lead / EM",
      steps: [
        "1. README.md уншиж (30 мин)",
        "2. METHODOLOGY.md уншиж (1.5h)",
        "3. workflow/10/00-START-HERE.md — Tier шийдэх",
        "4. 1 high-risk module + champion",
        "5. 2-4 неделя дотор first Tier 1",
      ],
      color: C.deepBlue,
    },
    {
      role: "Engineer",
      steps: [
        "1. workflow/00-START-HERE.md уншиж",
        "2. Pilot module-ын CLAUDE.md",
        "3. Dimension файл (what/how)",
        "4. INV ID-г code comment-д ишилж",
        '5. PR-д "ZeeSpec impact" section',
      ],
      color: C.teal,
    },
    {
      role: "Compliance",
      steps: [
        "1. workflow/07-r4 (research method)",
        "2. R2 financial reviewer prompt",
        "3. gaps.md P0/P1 шалгаж",
        "4. ADR table review",
        "5. Annual R4 + R6 calendar",
      ],
      color: C.midnight,
    },
  ];

  roles.forEach((r, i) => {
    const x = 0.5 + i * 4.28;

    s.addShape("roundRect", {
      x,
      y: 1.8,
      w: 4.05,
      h: 5.0,
      fill: { color: C.white },
      line: { color: r.color, width: 2 },
      rectRadius: 0.15,
    });

    s.addShape("rect", {
      x,
      y: 1.8,
      w: 4.05,
      h: 0.7,
      fill: { color: r.color },
      line: { type: "none" },
    });

    s.addText(r.role, {
      x,
      y: 1.8,
      w: 4.05,
      h: 0.7,
      fontSize: 18,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(r.steps.join("\n\n"), {
      x: x + 0.3,
      y: 2.7,
      w: 3.45,
      h: 4.0,
      fontSize: 12,
      fontFace: "Calibri",
      color: C.charcoal,
      valign: "top",
    });
  });

  addFooter(s, 17);
}

// ========================================================================
// SLIDE 18 — KEY TAKEAWAYS (3-sentence elevator pitch)
// ========================================================================
{
  const s = pres.addSlide();
  darkSlide(s);

  s.addText("ГОЛ ХЭЛЛЭГ", {
    x: 0.5,
    y: 0.5,
    w: 12.33,
    h: 0.5,
    fontSize: 14,
    fontFace: "Calibri",
    color: C.teal,
    bold: true,
    align: "center",
    charSpacing: 5,
  });

  s.addText("3 өгүүлбэрээр", {
    x: 0.5,
    y: 1.0,
    w: 12.33,
    h: 0.6,
    fontSize: 32,
    fontFace: "Georgia",
    color: C.white,
    bold: true,
    align: "center",
  });

  // Three quote sentences with numbers
  const sentences = [
    "ZeeSpec нь регуляторт чиглэсэн системээ урт хугацааны spec + AI-friendly format-аар хадгалах methodology.",
    "Гол үнэ цэн: AI агент зөв код бичнэ + drift автоматаар илрэнэ + WHY нь жилийн дараа ч мэдэгдэхээр баримтжсан байна.",
    "Финансад validate хийсэн (177 findings, 4 production bugs); healthcare / government / privacy domain-уудад adoption boломжтой.",
  ];

  sentences.forEach((sent, i) => {
    const y = 2.2 + i * 1.55;

    // Number
    s.addShape("ellipse", {
      x: 1.0,
      y,
      w: 0.8,
      h: 0.8,
      fill: { color: C.teal },
      line: { color: C.ice, width: 1 },
    });
    s.addText(String(i + 1), {
      x: 1.0,
      y,
      w: 0.8,
      h: 0.8,
      fontSize: 28,
      fontFace: "Georgia",
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Sentence
    s.addText(sent, {
      x: 2.1,
      y: y - 0.1,
      w: 10.5,
      h: 1.4,
      fontSize: 17,
      fontFace: "Georgia",
      color: C.white,
      italic: true,
      valign: "middle",
    });
  });
}

// ========================================================================
// SLIDE 19 — RESOURCES
// ========================================================================
{
  const s = pres.addSlide();
  lightSlide(s);
  addSlideHeader(s, "RESOURCES", "Хаанаас илүү уншиж эхлэх вэ");

  const resources = [
    {
      cat: "CORE DOCS",
      sub: "3 файл",
      items: [
        "specs/README.md — Танилцуулга",
        "specs/METHODOLOGY.md — Full methodology (1.5h)",
        "specs/EXPLAINED-FOR-PRESENTATIONS.md — Энэ танилцуулга",
      ],
      color: C.deepBlue,
      h: 1.4,
    },
    {
      cat: "WORKFLOW",
      sub: "per-phase",
      items: [
        "00-START-HERE — AI agent entry",
        "01-06 — Module authoring + review pipeline",
        "07 — R4 regulatory research (11 sub-files)",
        "08 — Code drift management (R5 agent)",
        "09 — ADR lifecycle (R6 agent)",
        "10 — Adoption guide (8 sub-files)",
        "11 — Anthropic plugin integration",
      ],
      color: C.teal,
      h: 2.4,
    },
    {
      cat: "EXTERNAL",
      sub: "links",
      items: [
        "github.com/anthropics/financial-services — Plugin library",
        "overlays/finance-accounting/ — Reference example",
        "overlays/finance-accounting/research-examples/ — 4 R4",
      ],
      color: C.accent,
      h: 1.4,
    },
  ];

  let y = 1.7;
  resources.forEach((res) => {
    // Category badge with sub-label
    s.addShape("roundRect", {
      x: 0.5,
      y,
      w: 2.5,
      h: res.h,
      fill: { color: res.color },
      line: { type: "none" },
      rectRadius: 0.05,
    });
    s.addText(res.cat, {
      x: 0.5,
      y: y + 0.15,
      w: 2.5,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.white,
      bold: true,
      align: "center",
      charSpacing: 3,
    });
    s.addText(res.sub, {
      x: 0.5,
      y: y + 0.55,
      w: 2.5,
      h: 0.3,
      fontSize: 10,
      fontFace: "Calibri",
      color: C.white,
      italic: true,
      align: "center",
    });

    // Items
    s.addText(res.items.map((item) => "• " + item).join("\n"), {
      x: 3.2,
      y: y + 0.1,
      w: 9.6,
      h: res.h - 0.2,
      fontSize: 12,
      fontFace: "Consolas",
      color: C.charcoal,
      valign: "top",
      paraSpaceAfter: 2,
    });

    y += res.h + 0.25;
  });

  addFooter(s, 19);
}

// ========================================================================
// SLIDE 20 — THANK YOU / CALL TO ACTION
// ========================================================================
{
  const s = pres.addSlide();
  darkSlide(s);

  // Top accent — higher contrast (white instead of low-contrast teal)
  s.addText("БАЯРЛАЛАА", {
    x: 0.5,
    y: 1.0,
    w: 12.33,
    h: 0.5,
    fontSize: 16,
    fontFace: "Calibri",
    color: C.white,
    bold: true,
    align: "center",
    charSpacing: 8,
  });

  // Big call to action — use Arial Black for clearer "0" digit (Georgia's "0" looks like "o")
  s.addText("Try ZeeSpec Lite", {
    x: 0.5,
    y: 2.0,
    w: 12.33,
    h: 1.0,
    fontSize: 60,
    fontFace: "Arial Black",
    color: C.white,
    bold: true,
    align: "center",
  });

  // Subtitle
  s.addText("3 файл • 2 цаг • Эхний модулийг өнөөдөр ажиллуулж үзэх", {
    x: 0.5,
    y: 3.2,
    w: 12.33,
    h: 0.5,
    fontSize: 20,
    fontFace: "Calibri",
    color: C.ice,
    align: "center",
    italic: true,
  });

  // Step boxes
  const steps = [
    { num: "1", label: "cp -r specs", desc: "into your project" },
    { num: "2", label: "Pick 1 module", desc: "high-risk; well-bounded" },
    { num: "3", label: "Author 3 files", desc: "CLAUDE + what + gaps" },
    { num: "4", label: "Get value", desc: "AI better; gap-blocking active" },
  ];

  steps.forEach((step, i) => {
    const x = 0.5 + i * 3.16;
    const y = 4.3;

    s.addShape("roundRect", {
      x,
      y,
      w: 2.9,
      h: 1.6,
      fill: { color: C.midnight, transparency: 30 },
      line: { color: C.teal, width: 2 },
      rectRadius: 0.15,
    });

    s.addText(step.num, {
      x: x + 0.1,
      y: y + 0.1,
      w: 0.8,
      h: 0.8,
      fontSize: 32,
      fontFace: "Georgia",
      color: C.teal,
      bold: true,
      align: "center",
      valign: "middle",
    });

    s.addText(step.label, {
      x: x + 0.9,
      y: y + 0.1,
      w: 1.9,
      h: 0.5,
      fontSize: 14,
      fontFace: "Calibri",
      color: C.white,
      bold: true,
      valign: "middle",
    });

    s.addText(step.desc, {
      x: x + 0.9,
      y: y + 0.6,
      w: 1.9,
      h: 0.5,
      fontSize: 11,
      fontFace: "Calibri",
      color: C.ice,
      italic: true,
      valign: "middle",
    });
  });

  // Bottom info
  s.addText("ZeeSpec v3.0 • MIT License • 90 files • Production-validated", {
    x: 0.5,
    y: 6.5,
    w: 12.33,
    h: 0.3,
    fontSize: 11,
    fontFace: "Calibri",
    color: C.teal,
    align: "center",
    charSpacing: 3,
  });

  s.addText("docs/specs/zeespec/  •  90 .md files  •  10 git commits", {
    x: 0.5,
    y: 6.85,
    w: 12.33,
    h: 0.3,
    fontSize: 11,
    fontFace: "Consolas",
    color: C.ice,
    align: "center",
  });
}

// ============================================================================
// SAVE
// ============================================================================

pres
  .writeFile({ fileName: "zeespec-v3-presentation.pptx" })
  .then((fileName) => {
    console.log(`✓ Created: ${fileName}`);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
