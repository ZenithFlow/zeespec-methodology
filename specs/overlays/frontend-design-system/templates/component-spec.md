---
doc: overlays/frontend-design-system/templates/component-spec
type: component-spec-template
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# Component Spec Template (Lite — copy one per component)

> **How to use:** copy this file next to the component (e.g. `components/ui/input.spec.md`), delete this blockquote, and fill the six contract rows. Each claim carries a **status tag + `file:line` citation** to the component source, exactly like a backend `INV-*` (`METHODOLOGY.md` § 4). A claim with no `file:line` is **not** `✅ IMPL` — a reviewer downgrades it to `🟡 PARTIAL` / `🚧 DESIGN`. Keep it LEAN: one component, six rows, links out. The *type* is defined in `../principles/component-contract.md`; the executable wiring is in `../testing/ui-testing.md`.
>
> Components are many and small — this is intentionally **Lite** (one file = the `CLAUDE.md`/`what.md`/`gaps.md` of this component). Promote to a fuller shape only if the component grows its own sub-modules.

---

## `<ComponentName>` — component contract

**Source:** `components/ui/<file>.tsx`
**Depends on:** design tokens (`../principles/design-direction.md`) · stack (`../stack/react-shadcn.md`)
**ADRs:** `<ADR-id for variant taxonomy / token palette, if any>`

### 1. Prop / variant API

| Prop | Type / values | Status | Citation |
|------|---------------|:------:|----------|
| `variant` | … | 🚧 | `components/ui/<file>.tsx:LL` |
| `size` | … | 🚧 | `components/ui/<file>.tsx:LL` |
| `<prop>` | … | 🚧 | `components/ui/<file>.tsx:LL` |

> Rule: **every variant listed must have a Storybook story** (§ 6). A variant with no story is `🟡 PARTIAL`.

### 2. Interaction states (behavior, not looks)

Tag only the **applicable** states; omit those that do not apply to this component (and say why).

| State | Required behavior (observable) | Status | Citation | Story (§ 6) |
|-------|--------------------------------|:------:|----------|-------------|
| default | accessible name + role present | 🚧 | `…:LL` | `Default` |
| hover/focus | keyboard-focusable; visible focus indicator | 🚧 | `…:LL` | `Focused` |
| disabled | not activatable; handler not called | 🚧 | `…:LL` | `Disabled` |
| loading | input blocked; busy announced | 🚧 | `…:LL` | `Loading` |
| empty | zero-data affordance renders | 🚧 | `…:LL` | `Empty` |
| error | `aria-invalid` + `aria-describedby` (not color-only) | 🚧 | `…:LL` | `Error` |
| success | confirmation announced (live region / toast) | 🚧 | `…:LL` | `Success` |

### 3. Accessibility — machine-checkable subset

- **Axe tag set required:** `["wcag2a","wcag2aa","wcag21a","wcag21aa"]` → `expect(violations).toEqual([])`.
- **Cited a11y wiring:** `<roles / labels / aria-* at file:line>` — Status 🚧.
- **Human-judgment items (→ `gaps.md`, NOT behind the gate):** alt-text/label *quality*, logical focus *order*, message *wording*. A green axe run is the **machine-checkable subset of WCAG, not conformance** (~29.5% of WCAG is automatable; addon catches ~57% by volume).

### 4. Tokens used (no hardcoded values)

| Token / utility | Maps to (`@theme`) | Status | Citation |
|-----------------|--------------------|:------:|----------|
| `bg-…` / `text-…` | `--color-…` | 🚧 | `…:LL` |
| `rounded-…` | `--radius` | 🚧 | `…:LL` |
| **Hardcoded values** | none | 🚧 | grep gate (§ 6) |

### 5. Design-to-code (Figma Code Connect)

| Map file | Figma component | Status | Auto name/prop check |
|----------|-----------------|:------:|----------------------|
| `components/ui/<file>.figma.tsx` | `<Figma name>` | 🚧 | `scripts/codeconnect-check` (CI) |

> Code Connect is **manually maintained and rots** — an unchecked map is `🟡 PARTIAL`. The auto check asserts every mapped prop still exists by name on the code component.

### 6. Stories / tests (the executable assertions) + visual baseline

- **Stories file:** `components/ui/<file>.stories.tsx` — one story per applicable state + variant.
- **Play runner / axe:** CI (`../testing/ui-testing.md`).
- **Token grep gate:** `rg -n '#[0-9a-fA-F]{3,8}|rgb\(|hsl\(' components/ui/<file>.tsx` → must be empty.
- **Chromatic baseline:** snapshot per story; pixel diff = human review (aesthetics out of scope for auto-fail).

### gaps.md (human judgment only)

| ID | Item (needs a human) | Severity | Status |
|----|----------------------|:--------:|:------:|
| `GAP-<C>-01` | e.g. focus *order* across the form is logical | 🟡 P2 | 🔴 OPEN |

---

# Worked example — `Input` (shadcn/ui)

> Concrete fill so the template is unambiguous. Line numbers are illustrative — cite your repo's real lines.

## `<Input>` — component contract

**Source:** `components/ui/input.tsx`
**Depends on:** `../principles/design-direction.md` · `../stack/react-shadcn.md`
**ADRs:** `ADR-007 token palette (OKLCH)` · `ADR-011 form error pattern (react-hook-form + Zod)`

### 1. Prop / variant API

| Prop | Type / values | Status | Citation |
|------|---------------|:------:|----------|
| `type` | native `HTMLInputElement` type | ✅ IMPL | `components/ui/input.tsx:8` |
| `aria-invalid` | `boolean` (drives error styling via `data-[invalid]` / `aria-invalid` selectors) | ✅ IMPL | `components/ui/input.tsx:12` |
| `disabled` | `boolean` (native) | ✅ IMPL | `components/ui/input.tsx:8` |
| `className` | merged via `cn()` | ✅ IMPL | `components/ui/input.tsx:15` |

> Input has no `cva` variants in stock shadcn/ui; state is expressed via `aria-invalid` + `disabled`. If you add a `size` variant, add a story for each.

### 2. Interaction states (behavior, not looks)

| State | Required behavior | Status | Citation | Story |
|-------|-------------------|:------:|----------|-------|
| default | role `textbox`, associated `<label>`, accepts typing | ✅ IMPL | `input.tsx:8` | `Default` |
| focus | keyboard-focusable; visible focus ring (`focus-visible:ring-ring`) | ✅ IMPL | `input.tsx:11` | `Focused` |
| disabled | not focusable/typable; `disabled:opacity-50` | ✅ IMPL | `input.tsx:13` | `Disabled` |
| error | `aria-invalid=true` + `aria-describedby` → message id (via `FormControl`); not color-only | ✅ IMPL | `input.tsx:12` + `components/ui/form.tsx` (`FormControl`) | `Error` |
| loading | n/a — Input itself has no loading state (the submitting Button owns it) | 🚧 DESIGN | — | — |
| success | confirmation owned by the form (Sonner toast on submit), not by Input | 🚧 DESIGN | — | — |

### 3. Accessibility — machine-checkable subset

- **Axe tags:** `["wcag2a","wcag2aa","wcag21a","wcag21aa"]` → 0 violations (asserted in `Error` + `Default` stories).
- **Cited wiring:** label association + `aria-invalid` + `aria-describedby` are produced by shadcn's `FormControl` — `components/ui/form.tsx` (`FormControl` sets `aria-invalid` and `aria-describedby`; `FormMessage` renders the error text with the matching id). Status ✅ IMPL.
- **→ gaps.md:** is the error *wording* clear and is the label *text* meaningful (not just present)? — human judgment.

### 4. Tokens used (no hardcoded values)

| Token / utility | Maps to | Status | Citation |
|-----------------|---------|:------:|----------|
| `border-input` | `--color-input` | ✅ IMPL | `input.tsx:9` |
| `bg-background` `text-foreground` | `--color-background` / `--color-foreground` | ✅ IMPL | `input.tsx:9` |
| `ring-ring` (focus) | `--color-ring` | ✅ IMPL | `input.tsx:11` |
| `rounded-md` | `--radius` | ✅ IMPL | `input.tsx:9` |
| **Hardcoded values** | none | ✅ IMPL | grep gate green |

### 5. Design-to-code (Figma Code Connect)

| Map file | Figma component | Status | Auto check |
|----------|-----------------|:------:|------------|
| `components/ui/input.figma.tsx` | `Input / Text field` | ✅ IMPL | `scripts/codeconnect-check` asserts `aria-invalid`,`disabled`,`placeholder` still exist on the code component |

### 6. Stories / tests (executable assertions)

```tsx
// components/ui/input.stories.tsx
import { expect, userEvent, within } from "storybook/test";
import AxeBuilder from "@axe-core/playwright"; // axe runs in the Playwright a11y suite; see ../testing/ui-testing.md
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta: Meta<typeof Input> = {
  component: Input,
  // Storybook a11y addon (axe-core) runs on every story; error mode fails the build.
  parameters: { a11y: { test: "error" } },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" aria-label="Email" {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Input>;

// default: accepts typing
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.type(input, "hi@example.com");
    await expect(input).toHaveValue("hi@example.com");
  },
};

// disabled: not typable
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toBeDisabled();
    await userEvent.type(input, "x");
    await expect(input).toHaveValue("");
  },
};

// error: programmatically associated, not color-only (contract row 2 + row 3)
export const Error: Story = {
  args: { "aria-invalid": true, "aria-describedby": "email-err" },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" aria-label="Email" {...args} />
      <p id="email-err" className="text-sm text-destructive">Enter a valid email.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription("Enter a valid email.");
  },
};
```

The axe assertion against the explicit WCAG tag set (run in the Playwright a11y suite per `../testing/ui-testing.md`):

```ts
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  .analyze();
expect(results.violations).toEqual([]); // machine-checkable subset of WCAG — not conformance
```

Token grep gate (CI):

```bash
rg -n '#[0-9a-fA-F]{3,8}|rgb\(|hsl\(' components/ui/input.tsx && echo 'P1: hardcoded color in Input' && exit 1 || echo 'tokens-only OK'
```

### gaps.md (human judgment only — NOT behind the gate)

| ID | Item | Severity | Status |
|----|------|:--------:|:------:|
| `GAP-INPUT-01` | Error *wording* is clear and actionable (axe can't judge) | 🟡 P2 | 🔴 OPEN |
| `GAP-INPUT-02` | Focus *order* of the containing form is logical | 🟡 P2 | 🔴 OPEN |
| `GAP-INPUT-03` | `success` + `loading` states are 🚧 DESIGN (owned by form/Button) — confirm that ownership is right | 🟡 P2 | 🔴 OPEN |

## Next

→ `../principles/component-contract.md` — the spec type this template instantiates
→ `../templates/crud-feature-spec.md` — compose contracts into a full, tested CRUD screen
→ `../testing/ui-testing.md` — run the play / axe / Chromatic gates in CI
