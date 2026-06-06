---
doc: overlays/frontend-design-system/principles/component-contract
type: principles-spec
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# The Component Contract — A Lean Spec Type for UI Components

> A backend ZeeSpec module is a 10-file unit (entities, invariants, services, an audit trail). A UI component is the opposite shape: there are *many* of them and each is *small* (a Button, an Input, a Card). Forcing a 10-file module onto every Button is the fast path to abandonment. So the component contract **defaults to Lite** (`CLAUDE.md` · `what.md` · `gaps.md` equivalent, collapsed into a single per-component spec file) and reuses the *exact* core ZeeSpec machinery — status tags, `file:line` citations, BDD-as-executable-assertion, `gaps.md`, the drift gate — mapped onto frontend artifacts. We invent **no new mechanism**; we point existing ones at component source.
>
> This file defines the *type*. The copy-in template is `../templates/component-spec.md`. The screen-level / multi-component shape is `./ui-flow-completeness.md`. The design-token + UI-stack direction a component depends on is `./design-direction.md` and `../stack/react-shadcn.md`. The executable side (Storybook play, axe, Chromatic) is `../testing/ui-testing.md`.

## Why a component needs a contract at all

The failure this overlay exists to fix: a spec described entities and invariants, an AI built the frontend, and the page came out as naked serif HTML with an incomplete, untested CRUD. The backend-shaped spec gave the AI **zero** instruction about *what a component is supposed to do and be*. A component contract closes that gap by pinning, per component, six things — each as a **claim with a status tag and a `file:line` citation to the component source**, exactly as an `INV-*` invariant carries its proof:

| # | The contract captures | Status-tagged claim cites | Executable proof (see `../testing/ui-testing.md`) |
|---|------------------------|---------------------------|----------------------------------------------------|
| 1 | **Prop / variant API** — the typed surface (variants, sizes, controlled/uncontrolled) | the component's prop type / `cva` variant map at `file:line` | a story per variant; render assertion |
| 2 | **Interaction states** — default, hover, focus, disabled, loading, empty, error, success — as **behavior, not looks** | the code path that produces each state at `file:line` | one Storybook story + `play` function per state |
| 3 | **Accessibility level** — which machine-checkable WCAG tags it must pass under axe | the rendered roles/labels/`aria-*` at `file:line` | axe assertion `expect(violations).toEqual([])` |
| 4 | **Design-token binding** — uses tokens, **never** hardcoded values | the token classes/vars consumed at `file:line` | a no-hardcoded-value lint/grep gate |
| 5 | **Design-to-code citation** — Figma Code Connect mapping | the `*.figma.tsx` map file at `file:line` | an automated name/prop drift check (the map rots) |
| 6 | **Visual baseline** — the approved snapshot | the Chromatic baseline for each story | pixel diff vs baseline in CI |

If a row has no `file:line`, its status is **not** `✅ IMPL`. Per core ZeeSpec, a reviewer downgrades any unproven claim to `🟡 PARTIAL` or `🚧 DESIGN`. Writing "states: all ✅ IMPL" with no story to prove the `loading` state is the UI equivalent of "INV-X-04 ✅ IMPL" with no citation.

## Status tags, mapped to a component

The core tags (`METHODOLOGY.md` § 4) carry over unchanged. For a component contract:

| Tag | Means, for a component claim | Example |
|-----|------------------------------|---------|
| ✅ **IMPL** | Behavior exists in source **and** a green executable proof cites it | `error` state ✅ IMPL — `components/ui/input.tsx:18` (`aria-invalid` wired) + story `Input.stories.tsx:64` axe-green |
| 🟡 **PARTIAL** | Exists in source but proof is missing or partial | `loading` state 🟡 PARTIAL — `button.tsx:31` renders a spinner but no `play` asserts it |
| 🚧 **DESIGN** | Named in the contract, **not** in source | `success` state 🚧 DESIGN — no code path; AI MUST NOT rely on it; route to `gaps.md` |

> The same Builder-vs-Operations bridge applies: `✅ IMPL` = the component *renders* what the contract *says*; `🚧 DESIGN` = the contract describes a state the code never produces. The `file:line` is the evidence the bridge exists.

## 1. Prop / variant API

State the typed surface and cite it. With shadcn/ui the variant map is the source of truth, so cite the `cva` call.

```
Props:  variant: "default" | "destructive" | "outline" | "ghost"   ✅ IMPL — components/ui/button.tsx:8
        size:    "sm" | "default" | "lg" | "icon"                 ✅ IMPL — components/ui/button.tsx:18
        asChild: boolean                                          ✅ IMPL — components/ui/button.tsx:42
```

Rule: **every variant the contract lists must have a story** (`../testing/ui-testing.md`). A variant with no story is `🟡 PARTIAL` — it is undocumented and unguarded against visual drift.

## 2. Interaction states — behavior, not looks

This is the row most often missing from a backend-shaped spec, and the direct cause of "the CRUD was incomplete." Specify the **required** state set and, for each, the *observable behavior* — not the appearance (appearance is a token concern, row 4, and a visual-baseline concern, row 6).

| State | Behavior to assert (not "how it looks") |
|-------|------------------------------------------|
| default | renders with accessible name; interactive role present |
| hover / focus | focus is reachable by keyboard; a visible focus indicator exists (focus *order* quality is human-judgment → `gaps.md`) |
| disabled | not focusable / not activatable; `disabled` or `aria-disabled` set; click handler not called |
| loading | input blocked; busy state announced (`aria-busy` / live region); double-submit prevented |
| empty | the zero-data affordance renders (the empty *message quality* is human-judgment → `gaps.md`) |
| error | error is programmatically associated (`aria-invalid` + `aria-describedby`), not color-only |
| success | confirmation is announced (live region / Sonner toast), not color-only |

Not every component needs all eight (a static Badge has no `loading`). The contract lists the **applicable** set and tags each. Omitting an applicable state is a gap, not a pass.

### Each state is a Storybook story + play function (the executable assertion)

This is the *same mechanism* as METHODOLOGY § 3c and `workflow/07-r4-regulatory-research/03-citation-conventions.md` ("From citation to executable assertion"): a spec rule becomes a runnable test, and a broken assertion is a broken build. A backend rule becomes a BDD scenario; a **UI state becomes a story whose `play` function drives the interaction and asserts the behavior.**

```tsx
// Button.stories.tsx — the `disabled` contract row, made executable
import { expect, fn, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = { component: Button, args: { onClick: fn() } };
export default meta;
type Story = StoryObj<typeof Button>;

// Contract: disabled → not activatable, handler not called. Cites button.tsx:31.
export const Disabled: Story = {
  args: { disabled: true, children: "Save" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: "Save" });
    await expect(btn).toBeDisabled();
    await btn.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
```

The Storybook test-runner (or the Vitest addon) runs these `play` functions in CI — that is the drift gate for behavior. See `../testing/ui-testing.md` for the runner wiring.

## 3. Accessibility level — the machine-checkable subset, with the rest routed to gaps.md

State which axe tag set the component must pass, and cite the source lines that satisfy it (roles, labels, `aria-*`). The executable proof is an axe run that asserts **zero** violations, pinned to explicit criteria:

```ts
// pin the criteria so the gate is deterministic
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  .analyze();
expect(results.violations).toEqual([]);   // machine-checkable subset of WCAG
```

**Honesty boundary (do not overstate).** A green axe run is **the machine-checkable subset of WCAG, not WCAG conformance.** Only about **29.5%** of WCAG success criteria are fully automatable; the Storybook a11y addon (axe-core) catches roughly **57% of WCAG issues by volume** but cannot judge the rest. The roughly **43%** that needs human judgment — alt-text *quality*, logical *focus order*, caption *accuracy* — is **out of scope for the automated gate**. Route those items to `gaps.md` as human-judgment checks; **do NOT put them behind the green gate** (a passing axe must never be read as "a11y done"). See `../testing/ui-testing.md` for the split.

## 4. Design-token binding — uses tokens, never hardcoded values

The naked-serif failure was the absence of a design system. The contract forbids hardcoded color/spacing/radius/font values: the component **must** consume tokens (Tailwind v4 `@theme` CSS variables: `--color-primary`, `--radius`, `--font-sans` …, surfaced as utility classes like `bg-primary`, `text-foreground`). See `./design-direction.md` for token authoring and `../stack/react-shadcn.md` for the `@theme` setup.

```
Tokens used:  bg-primary text-primary-foreground   ✅ IMPL — components/ui/button.tsx:9
              rounded-md (→ --radius)              ✅ IMPL — components/ui/button.tsx:5
Hardcoded:    none                                 ✅ IMPL — grep gate green (see below)
```

The executable proof is a grep/lint gate run in CI — the frontend analogue of the R3 "float for money" grep in the finance overlay:

```bash
# No raw hex / rgb / px-radius / px-font in component source → tokens only.
rg -n '#[0-9a-fA-F]{3,8}|rgb\(|hsl\(' components/ui/ && echo 'P1: hardcoded color' && exit 1
```

Note: token **format** is the Design Tokens Community Group (DTCG) format, first stable version 2025.10 — it is **not** a W3C Standard or Recommendation. Do not upgrade that wording in derived specs.

## 5. Design-to-code citation — Figma Code Connect (manual → must be auto-checked)

Figma Code Connect maps a Figma design-system component to its code component. This is the frontend analogue of a `file:line` citation — it pins "this design element ≙ this code element." **But the mapping is MANUALLY maintained and rots:** a renamed prop or component leaves a stale `.figma.tsx` that still claims a binding that no longer holds. So the contract treats the Code Connect file as a *claim* that must itself be guarded by an automated check.

```
Code Connect:  src/components/ui/button.figma.tsx → Figma "Button"   ✅ IMPL — button.figma.tsx:1
               name/prop drift check                                ✅ IMPL — scripts/codeconnect-check (CI)
```

The wrapper check asserts that every prop named in the `.figma.tsx` map still exists with that name on the code component; a rename flips it red. Treat an unchecked Code Connect map as `🟡 PARTIAL` — present but unguarded. (Figma Dev Mode also exposes an MCP server feeding design context to AI coding tools, including Claude Code; that is an authoring aid, not a gate.)

## 6. Visual baseline — Chromatic

Each story gets a Chromatic snapshot diffed against an approved baseline in CI — the pixel analogue of the drift gate. A diff is a **flag for human review**, not an auto-fail-and-fix: a machine can flag a pixel delta objectively but **cannot judge whether the result looks good**. Subjective visual aesthetics are explicitly **out of scope** for any automated gate (route taste calls to `gaps.md` / design review). See `../testing/ui-testing.md`.

## What goes to gaps.md (human judgment — NOT behind the gate)

Keep `gaps.md` for items that need a human and cannot be auto-gated, with severity per the core matrix (`METHODOLOGY.md` § 5):

| Goes to gaps.md (human judgment) | Stays behind the automated gate |
|----------------------------------|----------------------------------|
| Alt-text / label *quality*, caption accuracy | axe machine-checkable tags = 0 violations |
| Logical focus *order* (vs. focus *existence*) | focus indicator *exists* / element is focusable |
| Empty-state / error *message wording* | empty / error state *renders + is announced* |
| "Does it look good?" (subjective aesthetics) | Chromatic pixel delta vs baseline |
| Whether a Code Connect mapping is *semantically* right | the prop names still *exist* (auto name/prop check) |

A `🚧 DESIGN` state with no code path is **also** a gap: file it, do not let the AI build against it.

## ADRs for design-system decisions

Decisions that affect many contracts — the token palette, the variant taxonomy, choosing Sonner for toasts, the chosen axe tag set — are **ADRs** (core ZeeSpec `workflow/09-adr-lifecycle/`), not per-component notes. A component contract *cites* the ADR; it does not re-litigate it. Keep each contract file **lean** (Tier 0 guardrail): one component, the six rows, links out — no padding.

## Authoring sequence (per component)

1. Copy `../templates/component-spec.md` next to the component.
2. Fill the six rows; tag each `✅ / 🟡 / 🚧` with a `file:line` to the component source.
3. For every applicable state and variant, add a Storybook story + `play` (and an axe assertion). No story ⇒ downgrade to `🟡 PARTIAL`.
4. Add the Code Connect map + its auto name/prop check.
5. Route human-judgment a11y + aesthetic items to `gaps.md`; do not gate them.
6. Let CI (play runner + axe + token grep + Code Connect check + Chromatic) be the gate. Green = the contract is honored by Operations.

## Next

→ `../templates/component-spec.md` — copy-in per-component template (worked Input example)
→ `./ui-flow-completeness.md` — the screen-level spec type that composes contracts into full CRUD flows
→ `../testing/ui-testing.md` — Storybook play / axe / Chromatic wiring (the executable side)
