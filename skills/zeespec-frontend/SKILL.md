---
name: ZeeSpec Frontend
description: Build modern, complete, tested frontends with ZeeSpec's design-system overlay instead of naked HTML. Use whenever creating or modifying UI in a React/Next.js + Tailwind + shadcn/ui project — pages, screens, components, forms, tables, dashboards, CRUD features — to enforce design tokens (never the browser-default serif or unstyled HTML), every screen state (loading / empty / error / validation / success), and executable UI tests.
when_to_use: Trigger when the user asks to build, add, or change a page, screen, component, form, table, dashboard, or CRUD feature; when writing or editing .tsx/.jsx UI; or when a ZeeSpec frontend-design-system overlay exists under the project's docs/specs.
allowed-tools: Read, Grep, Glob
---

# ZeeSpec Frontend — build it modern, complete, and tested

Before writing ANY UI, apply the three rules below. They prevent the three classic failures of a backend-shaped spec driving an AI: **naked HTML in Times New Roman**, **half-built CRUD**, and **no tests**. Full detail lives under `${CLAUDE_PLUGIN_ROOT}/specs/overlays/frontend-design-system/` — load the referenced file when you need depth (progressive disclosure; do not inline it all).

## The three rules

1. **Tokens before markup.** Never emit unstyled HTML — the browser default is the serif (Times New Roman) tell. Style via **design tokens + shadcn/ui components**; never inline styles or hardcoded hex. → `principles/design-direction.md` (Tailwind v4 `@theme`, OKLCH). **Delegate the accessible color foundation to algorithmic tools (Radix / Adobe Leonardo), not LLM invention** — AI remixes a system, it does not originate an accessible one (see `research-notes.md`).

2. **Complete the flow.** A CRUD feature is not done until every operation (List / Create / Read / Update / Delete) **and** every screen state — loading skeleton · empty · error+retry · validation (field-level) · success toast — is built. → `principles/ui-flow-completeness.md` + `templates/crud-feature-spec.md`.

3. **Prove it with tests.** Each interaction state → a Storybook play function; each flow → a Playwright E2E; gate the **machine-checkable a11y subset** with axe (error mode). → `testing/ui-testing.md`.

## Stack + existing projects

Stack = React/Next + Tailwind v4 + shadcn/ui; exact current setup in `stack/react-shadcn.md`. **If the project already has Tailwind v4 + shadcn, do NOT re-scaffold** — run the gap audit in `README.md` § "Applying to an existing modern project" (the usual real gaps are axe a11y + Storybook + missing screen states, not the design baseline).

## Out of scope (do not fake)

Subjective visual aesthetics, and the ~43% of WCAG that needs human judgment (alt-text quality, focus order, captions) — track those in `gaps.md`, never behind the automated gate. The gate enforces only the verifiable: tokens exist, no naked HTML, states present, machine-checkable a11y passes.

## Author / verify

To scaffold a new component or CRUD-feature spec, copy `templates/component-spec.md` or `templates/crud-feature-spec.md`. To review a built UI against its specs, dispatch the **RF frontend reviewer** (`prompts/RF-frontend-reviewer.md`).
