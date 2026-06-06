---
doc: overlays/frontend-design-system/README
type: overlay-overview
overlay_name: frontend-design-system
overlay_version: 0.1.0
core_zeespec_version: ">=2.3.0"
status: experimental
last_updated: 2026-06-06
---

# ZeeSpec Overlay — Frontend Design System (Reference Example)

> **Domain-specialized REFERENCE EXAMPLE** demonstrating how to make a ZeeSpec drive a **modern, complete, tested frontend** instead of a backend-shaped spec that an AI turns into naked HTML. It layers concrete UI content (design direction, component contracts, UI-flow completeness, executable UI tests) on top of neutral ZeeSpec core, bound to **React / Next.js + Tailwind CSS v4 + shadcn/ui**.
>
> **This overlay is a reference, not a prescription.** Treat it as:
> - **Example of how to structure a UI overlay** — the same shape ports to Vue/Nuxt, SvelteKit, Angular (swap one file: `stack/react-shadcn.md`).
> - **Reusable starting point for CRUD frontends** — copy + adapt to your codebase.
> - **Worked executable-spec examples** — see how a UI rule becomes a Storybook play function + axe assertion (the frontend form of ZeeSpec's BDD / executable-assertion mechanism).
>
> The **methodology** (core ZeeSpec workflow + the status-tag / executable-assertion / drift-gate mechanisms it reuses) is the primary deliverable. This overlay shows those mechanisms applied to one domain: the browser.

## The three failures this overlay fixes

Real incident: a user wrote a ZeeSpec for a simple CRUD app and had an AI build the frontend from it. Three things went wrong, all because a backend-shaped spec gives an AI **zero UI direction**:

| # | Failure | Root cause | Fixed by |
|---|---------|-----------|----------|
| 1 | **Naked HTML in Times New Roman** — no CSS, no design system, the browser default serif. | Spec named no UI stack and no design tokens, so the agent applied none. | `stack/react-shadcn.md` (binds the stack) + `principles/design-direction.md` (mandates design tokens) |
| 2 | **Incomplete CRUD** — flows half-built, screen states missing. | Backend-shaped spec enumerated entities + invariants but never the full UI flow + every screen state (empty / loading / error / success). | `principles/ui-flow-completeness.md` + `templates/crud-feature-spec.md` |
| 3 | **No UI tests** — flows never verified, regressions invisible. | Spec had no executable UI assertions and no CI gate for the browser. | `principles/component-contract.md` + `testing/ui-testing.md` (Storybook play + axe + Chromatic in CI) |

## When to use this overlay

| Project | Verdict |
|---------|---------|
| CRUD admin / dashboard / internal tool (React/Next.js) | ✅ STRONG fit |
| Customer-facing web app with forms + tables | ✅ STRONG fit |
| Design-system / component-library build-out | ✅ STRONG fit |
| Marketing site (mostly static content, bespoke art direction) | ⚠️ Tokens + a11y gate help; component-contract machinery is overkill |
| Native mobile (iOS/Android/Flutter/React Native) | ❌ Stack file assumes the web DOM; fork `stack/` for your platform |
| Backend-only service (no UI) | ❌ Use core ZeeSpec; nothing here applies |
| Throwaway prototype you will not ship | ⚠️ Overhead may exceed value; use core ZeeSpec |

## What you get

1. **Stack binding** (`stack/react-shadcn.md`) — the ONE stack-specific file: exact, current setup for Tailwind CSS v4 (`@import "tailwindcss"`, `@theme` tokens, `@tailwindcss/vite`) + shadcn/ui (`npx shadcn@latest init`/`add`, `components.json` with `cssVariables: true`, Radix-based accessible components, react-hook-form + Zod forms, Sonner toasts) + the recommended CRUD dependency set + the Figma Dev Mode MCP handoff note. **Swap this one file to retarget Vue/etc.**
2. **Design direction** (`principles/design-direction.md`) — turns "make it look designed" into checkable rules: a design-token contract (DTCG-format tokens surfaced as CSS variables in `@theme`), the no-raw-hex / no-default-serif rule, light/dark + spacing/radius scales. Stops failure #1.
3. **Component contract** (`principles/component-contract.md`) — what a UI component spec MUST pin (props, variants, every visual state, a11y attributes, the matching Storybook story + play function). The frontend form of ZeeSpec's executable-assertion mechanism.
4. **UI-flow completeness** (`principles/ui-flow-completeness.md`) — the rule that every CRUD flow enumerate all screen states (empty, loading, partial, error, success, permission-denied) and every navigation path, so the AI cannot ship a half-built flow. Stops failure #2.
5. **Component spec template** (`templates/component-spec.md`) — paste-ready per-component spec (props table, states table, a11y contract, story + play-function stub) carrying status tags + file-and-line citations.
6. **CRUD feature spec template** (`templates/crud-feature-spec.md`) — paste-ready per-feature spec: screen inventory, state matrix, form schema (Zod), navigation map, and the executable assertions that gate it.
7. **UI testing guide** (`testing/ui-testing.md`) — how the frontend reuses ZeeSpec's drift-gate: Storybook play functions + `@axe-core/playwright` (`expect(results.violations).toEqual([])`, tagged `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa`) + Chromatic visual-regression as CI gates; what goes in `gaps.md` instead of the gate.
8. **Specialized frontend reviewer prompt** (`prompts/RF-frontend-reviewer.md`) — replaces the generic reviewer with UI-tuned questions ("Show me the empty + error state of this screen", "Which token does this color come from?", "Where is the play function that proves this flow?").

## Read order

1. **Core ZeeSpec first** — `/specs/README.md` + `/specs/METHODOLOGY.md` (esp. § 3c executable assertions) + `/specs/workflow/00-START-HERE.md`.
2. **This overlay's README** (you are here).
3. `stack/react-shadcn.md` — the concrete stack the rest of the overlay assumes.
4. `principles/design-direction.md` — the token contract that stops naked HTML.
5. `principles/ui-flow-completeness.md` — the rule that stops half-built CRUD.
6. `principles/component-contract.md` — what each component spec must pin.
7. `testing/ui-testing.md` — how those rules become CI gates.
8. Pick `templates/crud-feature-spec.md` (or `templates/component-spec.md`) and start authoring.

## How to apply this overlay to your project

```bash
# 1. Copy the core ZeeSpec methodology (per /specs/README.md instructions)
cp -r path/to/zeespec-methodology/specs your-project/docs/specs/zeespec

# 2. Copy the frontend-design-system overlay
cp -r path/to/zeespec-methodology/specs/overlays/frontend-design-system \
      your-project/docs/specs/zeespec-frontend

# 3. Tell your AI agent BOTH exist — and that it must read the UI overlay
#    BEFORE generating any UI. This single instruction is what prevents
#    the naked-HTML / incomplete-CRUD / no-tests failure.
cat >> your-project/CLAUDE.md <<'EOF'

## Spec methodology (frontend-specialized)
This project uses ZeeSpec core + the frontend-design-system overlay.
BEFORE writing ANY UI code, READ:
  docs/specs/zeespec-frontend/README.md
  docs/specs/zeespec-frontend/stack/react-shadcn.md
  docs/specs/zeespec-frontend/principles/design-direction.md
  docs/specs/zeespec-frontend/principles/ui-flow-completeness.md
Do NOT emit raw HTML without the design tokens + component library named in
stack/react-shadcn.md. Every CRUD flow MUST enumerate all screen states
(empty / loading / error / success) per ui-flow-completeness.md, and ship
the Storybook play function + axe assertion that proves it.
EOF

# 4. Initialize the stack named in the overlay (Tailwind v4 + shadcn/ui)
#    Exact, current commands live in stack/react-shadcn.md — follow them there.
```

## Applying to an existing modern project

Most real projects already have Tailwind v4 + shadcn/ui installed (that is the common case — the naked-HTML failure is the exception, not the rule). When the stack is already present, **skip the stack init** and treat this overlay as a **gap-audit + hardening** pass.

**Skip stack setup if** `src/app/globals.css` already has `@import "tailwindcss"` + an `@theme` token block, and `components.json` has `cssVariables: true`. If so, the design baseline is fine — do not re-scaffold it.

**Gap-audit checklist (the gaps even good projects usually have):**

| Check | Common finding | Highest-ROI fix |
|-------|----------------|-----------------|
| `@axe-core/playwright` installed? | ❌ missing even when e2e exists | Add axe to the existing Playwright suite (`testing/ui-testing.md` Layer 3a) — **start here** |
| Storybook present? | ❌ often absent | Add stories for high-traffic components first (`testing/ui-testing.md` Layer 1); defer full adoption |
| CRUD screens cover every state? | ⚠️ loading/empty/error often partial | Inventory with `principles/ui-flow-completeness.md`; fill gaps per `templates/crud-feature-spec.md` |
| Components use tokens (no hardcoded hex / inline style)? | ⚠️ stragglers | Run the detection greps in `principles/design-direction.md` |
| Design→code mapping pinned? | ❌ usually none | Optional — add Figma Code Connect only if you use Figma |

**Recommended order for an existing project:** (1) add axe to your current Playwright e2e (cheapest, closes the biggest real gap), (2) inventory missing CRUD states with `ui-flow-completeness.md`, (3) add Storybook stories for the components that change most, (4) wire the CI gate. You do **not** need Storybook before you can benefit — Layer 2 (E2E) + Layer 3a (axe) work on your existing test infra (see `testing/ui-testing.md`).

## Relationship to core ZeeSpec

This overlay **does not replace** core ZeeSpec — it **specializes** it by mapping existing ZeeSpec machinery onto frontend artifacts. **No new mechanism is invented.**

| Core ZeeSpec mechanism | Frontend mapping in this overlay |
|------------------------|----------------------------------|
| Status tags ✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN + file-and-line citation | Same tags on UI claims; citation points at the component / story / token file:line |
| Executable assertions / BDD (`METHODOLOGY.md` § 3c; `workflow/07/03-citation-conventions.md`) | **Storybook play functions** + **axe assertions** ARE the runnable form of a UI rule |
| CI drift gate (`scripts/ci-drift-gate.sh`) + drift detection | **Chromatic** visual-regression (pixel diff vs baseline) + **axe in error mode** in CI |
| `gaps.md` (items needing human judgment) | Subjective aesthetics + the ~43% of WCAG that needs human judgment (alt-text quality, focus order, captions) |
| ADRs (`workflow/09-adr-lifecycle/`) | Design-system decisions (token scale, theming strategy, component-library choice) |
| `where.md` § 5 Tech Stack Binding (the only stack-specific file) | `stack/react-shadcn.md` (the only stack-specific file in this overlay) |

The stack-swappability of core ZeeSpec is **preserved**: every principle here is framework-agnostic; only `stack/react-shadcn.md` names React/Tailwind/shadcn. Re-point it at Vue/Nuxt or SvelteKit and the rest still holds.

## Out of scope (explicit)

Two classes of judgment are **deliberately NOT placed behind the automated gate** — they go in `gaps.md` for a human, per the core ZeeSpec convention:

1. **Subjective visual aesthetics.** A machine flags pixel deltas objectively (Chromatic) but **cannot judge whether something looks good**. "Is this layout tasteful / on-brand / balanced?" is a human call. The gate enforces *consistency with a baseline*, not *quality of the baseline*.
2. **The ~43% of WCAG that needs human judgment.** Only about **29.5% of WCAG success criteria are fully automatable**; the Storybook a11y addon (axe-core) catches roughly **57% of WCAG issues by volume** but the rest — alt-text *quality*, logical focus order, caption accuracy, meaningful sequence — requires a person. A green axe test is **"the machine-checkable subset of WCAG"**, NOT "WCAG conformance." Do not overclaim. Track the human-judgment items in `gaps.md`; do NOT put them behind the automated gate.

Also out of scope: backend/data semantics (use core ZeeSpec + the finance overlay where relevant); native mobile UI (fork `stack/`).

## Status

🧪 **Experimental v0.1.0** — first cut, motivated by a single real incident (naked-HTML CRUD). Stack facts verified current as of June 2026 (Tailwind v4 CSS-first config, shadcn/ui copy-in components). Not yet validated by an independent frontend team. Use as a starting point; fork freely. **Calibration:** the form a11y wiring (shadcn's `FormMessage` auto-linking `aria-invalid` + `aria-describedby`) reflects shadcn/ui's current `form.tsx` generation; since shadcn regenerates components on `init`, verify your local `form.tsx` matches before treating forms as accessible-by-default — or add an a11y test that checks the wiring rather than assuming it.

## Overlay file inventory

```
overlays/frontend-design-system/
├── README.md                                — this file
├── stack/
│   └── react-shadcn.md                      — THE stack binding (Tailwind v4 + shadcn/ui); swap to retarget
├── principles/
│   ├── design-direction.md                  — design-token contract; stops naked HTML
│   ├── component-contract.md                — what a component spec must pin (props/states/a11y/story)
│   └── ui-flow-completeness.md              — enumerate every screen state + nav path; stops half CRUD
├── templates/
│   ├── component-spec.md                     — paste-ready per-component spec
│   └── crud-feature-spec.md                  — paste-ready per-feature CRUD spec
├── testing/
│   └── ui-testing.md                         — Storybook play + axe + Chromatic as CI gates
└── prompts/
    └── RF-frontend-reviewer.md               — specialized frontend reviewer prompt
```

## License + credits

MIT (same as core ZeeSpec). Inherits Zachman framework attribution.

Stack references (verified current, June 2026):
- Tailwind CSS v4 — CSS-first config via `@theme`; `@tailwindcss/vite`
- shadcn/ui — Radix UI + Tailwind, copy-in components, react-hook-form + Zod, Sonner
- Design Tokens Community Group (DTCG) format, first stable version 2025.10 (a community format, **not** a W3C Standard or Recommendation)
- axe-core / Playwright / Storybook test-runner / Chromatic — UI executable assertions + drift gate
- Figma Code Connect + Figma Dev Mode MCP — design-to-code handoff

## Next

→ `stack/react-shadcn.md` — the concrete stack this overlay binds to
