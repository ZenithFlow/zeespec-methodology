---
doc: overlays/frontend-design-system/principles/design-direction
type: principles-spec
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# Design Direction — Tokens Before Markup

> Extends the core ZeeSpec anti-patterns (`checklists/anti-patterns.md`). This is **the** file that fixes the naked-HTML failure: a ZeeSpec drove an AI to build a CRUD frontend, the spec gave **zero design direction**, and the AI shipped unstyled `<div>`s rendered in the browser-default serif (Times New Roman) with no CSS at all. This file pins the **objective** styling baseline that prevents that. It does **not** dictate taste.

## The rule

> **A ZeeSpec UI module MUST declare a design direction + a design-token set before any markup is authored.** Shipping unstyled default-browser HTML is the **#1 frontend anti-pattern**: it is the visible symptom of a spec that never declared a UI stack, a font, or a single color.

Concretely, a UI module is not authorable until its `where.md` § 5 (stack) names the UI stack — React/Next.js + Tailwind CSS v4 + shadcn/ui — and a tokens file exists with the baseline below. No tokens file, no markup. This is a Tier-0 guardrail, same weight as "no float for money" in the finance overlay.

Why a *rule* and not a suggestion: an AI agent with no design direction does not invent a tasteful one — it emits the browser default. The browser default is Times New Roman, 16px, black-on-white, no spacing scale, no focus rings. The fix is not "ask the AI to make it pretty" (subjective, unverifiable) — it is to **declare the baseline as tokens** the agent must consume.

## The modern baseline (concrete tokens, Tailwind v4 `@theme`)

This is the floor. It is deliberately neutral (a Slate-style ramp + a single primary), so it is not a taste statement — it is the difference between "designed" and "raw HTML". Drop this into `src/styles/globals.css`. It uses the **current** Tailwind v4 forms: `@import "tailwindcss"` (not the old `@tailwind base/components/utilities` directives), the `@theme` directive for tokens, OKLCH colors, and class-based dark mode via `@custom-variant`.

```css
/* src/styles/globals.css */
@import "tailwindcss";

/* Class-based dark mode: `.dark` anywhere up the tree flips the theme. */
@custom-variant dark (&:where(.dark, .dark *));

/* ── Semantic tokens (light) — the single source of truth ─────────────── */
:root {
  --radius: 0.625rem;

  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
}

/* ── Same tokens, dark values — dark mode is a token swap, not new CSS ─── */
.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
}

/* ── Map tokens → Tailwind theme so utilities exist ───────────────────── */
/* `@theme inline` references the :root/.dark vars so bg-background,        */
/* text-foreground, border-border, ring-ring, etc. resolve at runtime.     */
@theme inline {
  /* Typography — system stack first; Inter as the designed face.          */
  /* NEVER fall back to the serif default. */
  --font-sans:
    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --font-mono:
    ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;

  /* Type scale (1.250 major-third), line-heights paired. */
  --text-xs: 0.75rem;     --text-xs--line-height: 1rem;
  --text-sm: 0.875rem;    --text-sm--line-height: 1.25rem;
  --text-base: 1rem;      --text-base--line-height: 1.5rem;
  --text-lg: 1.125rem;    --text-lg--line-height: 1.75rem;
  --text-xl: 1.25rem;     --text-xl--line-height: 1.75rem;
  --text-2xl: 1.5rem;     --text-2xl--line-height: 2rem;
  --text-3xl: 1.875rem;   --text-3xl--line-height: 2.25rem;

  /* Spacing base — Tailwind multiplies this (p-4 = 4 × 0.25rem = 1rem). */
  --spacing: 0.25rem;

  /* Radius scale derived from one --radius token. */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Elevation. */
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.10), 0 2px 4px -2px oklch(0 0 0 / 0.10);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.10), 0 4px 6px -4px oklch(0 0 0 / 0.10);

  /* Bind semantic colors to utilities. */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

/* ── The base layer that kills the Times-New-Roman default ────────────── */
@layer base {
  * { @apply border-border outline-ring/50; }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
```

> **Stack note.** Tailwind v4 needs **no** `tailwind.config.js` — configuration is CSS-first via `@theme`. Wire the Vite plugin (`@tailwindcss/vite`) and the shadcn `components.json` (`cssVariables: true`) per `../stack/react-shadcn.md`. shadcn components consume exactly these semantic tokens, so a `<Button>` is on-theme with zero extra CSS.

## Tokens are the single source of truth (DTCG)

The `@theme` block above is the **code projection** of the canonical token set. The canonical set is authored in the **Design Tokens Community Group (DTCG) format, first stable version 2025.10** — note: DTCG is a community-group format, **not** a W3C Standard or Recommendation. The DTCG file feeds *both* the design tool (Figma variables) and the code (`globals.css`), so design and implementation cannot drift apart by definition: one source, two projections.

```jsonc
// tokens/core.tokens.json — DTCG (first stable 2025.10), excerpt
{
  "color": {
    "$type": "color",
    "primary":     { "$value": "oklch(0.21 0.006 285.885)" },
    "background":  { "$value": "oklch(1 0 0)" },
    "foreground":  { "$value": "oklch(0.141 0.005 285.823)" },
    "destructive": { "$value": "oklch(0.577 0.245 27.325)" }
  },
  "radius":  { "$type": "dimension", "md": { "$value": "0.625rem" } },
  "font":    { "$type": "fontFamily", "sans": { "$value": ["Inter", "system-ui", "sans-serif"] } }
}
```

A build step (e.g. Style Dictionary) emits the `:root`/`.dark` CSS variables from this file. The **proof of which tokens are real** uses the same status-tag + file-and-line citation mechanism as core ZeeSpec (see `METHODOLOGY` § 3c). Status-tag token coverage:

| Token group | Status | Citation (proof) |
|-------------|--------|------------------|
| Semantic colors (background, foreground, primary, muted, destructive, border, ring) | `IMPL` | `src/styles/globals.css:8-46` (`:root` + `.dark`) |
| Font stack (`--font-sans`, `--font-mono`) | `IMPL` | `src/styles/globals.css:52-57` |
| Type scale (`--text-xs` … `--text-3xl`) | `IMPL` | `src/styles/globals.css:60-66` |
| Spacing base + radius + shadow scales | `IMPL` | `src/styles/globals.css:69-82` |
| DTCG source file feeding the above | `PARTIAL` | `tokens/core.tokens.json` exists; Style-Dictionary build not yet wired |
| Per-component density / motion tokens | `DESIGN` | not built — tracked in `gaps.md` |

> Rule: a token claimed `IMPL` must cite the exact file-and-line where its variable is declared. "We have a design system" with no citation is a `DESIGN` claim, not an `IMPL` one.

## DO / DON'T

| DO | DON'T |
|----|-------|
| Style via **tokens** (`bg-background`, `text-foreground`, `border-border`) | Use **inline `style={{...}}`** or one-off hardcoded values |
| Compose UI from **shadcn/ui components** (`<Button>`, `<Card>`, `<Input>`) | Hand-roll **raw unstyled `<div>`/`<table>`/`<input>`** with no classes |
| Set the **system / Inter** sans stack as `--font-sans` | Fall back to the **default serif** (Times New Roman) — the naked-HTML tell |
| Express dark mode as a **token swap** (`.dark { --background: … }`) | Scatter ad-hoc `dark:bg-[#1a1a1a]` **hardcoded hex** across components |
| Reference colors as **OKLCH semantic vars** | Paste **hardcoded hex** (`#3b82f6`) into JSX/CSS |
| Drive Figma + code from the **one DTCG file** | Maintain colors in **two places** (design tool vs code) that silently diverge |

> Detection (the frontend analogue of the finance overlay's `rg "float"` grep): `rg 'style=\{\{' src/` catches inline styles; `rg '#[0-9a-fA-F]{3,8}\b' src/ --glob '!**/globals.css'` catches hardcoded hex outside the token file. Both should return **zero** rows; non-zero is a review finding.

## Dark mode + theming via the same tokens

Dark mode is **not** a second design — it is the same `@theme inline` bindings reading a swapped set of `:root` variables under `.dark`. Because every shadcn component and every utility (`bg-background`, `text-muted-foreground`) resolves through the semantic vars, flipping the `.dark` class re-themes the entire app with **no per-component dark styles**.

```tsx
// Toggling is a class flip on <html>. (next-themes does this for you.)
document.documentElement.classList.toggle("dark");
```

Multi-brand / white-label theming works identically: add a `.theme-acme { --primary: …; --radius: … }` block overriding the same variables. One token contract, N themes, zero component edits. The contract a component depends on is its set of semantic tokens — see `./component-contract.md` for how that contract is specified and tested.

## Out of scope (explicit)

This file pins the **objective** baseline only. The following are **not** gated here:

- **Subjective visual aesthetics** — whether the chosen palette "looks good," whether spacing "feels right," brand personality, illustration style. A machine can flag a pixel delta against a baseline (Chromatic, see `../testing/ui-testing.md`) but **cannot judge taste**. This file guarantees "designed, not raw HTML"; it does not guarantee "beautiful."
- **Human-judgment design choices** — final color selection beyond the neutral floor, typographic personality, motion character. These need a designer; they are tracked in `gaps.md`, **not** behind the automated gate.

The automated gate enforces only the verifiable: tokens exist and are cited, no inline styles, no hardcoded hex, the base layer applies a non-serif font. Taste is a human's job; "not naked HTML" is the machine's.

## Cross-link: combine with core anti-patterns

The core ZeeSpec anti-patterns (`checklists/anti-patterns.md`) still apply. Frontend-relevant ones to watch alongside this file:

- Core "state machine fiction" → a screen state declared but never reachable (see `./ui-flow-completeness.md`).
- Core "sync/async lie" → loading/empty/error states claimed `IMPL` but never rendered.

## Next

→ `./component-contract.md` — specify each component's token + a11y contract
→ `./ui-flow-completeness.md` — enumerate every screen state so the CRUD is complete
→ `../stack/react-shadcn.md` — wire Tailwind v4 + shadcn so these tokens take effect
