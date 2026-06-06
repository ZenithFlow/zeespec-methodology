---
doc: overlays/frontend-design-system/stack/react-shadcn
type: stack-binding
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# Stack Binding — React / Next.js + Tailwind CSS v4 + shadcn/ui

> ⚠️ **The ONLY stack-specific file in this overlay** — the frontend equivalent of core ZeeSpec's `where.md` § 5 "Tech Stack Binding."
> Every other file in this overlay (design-direction, component-contract, ui-flow-completeness, the templates, the testing guide, the reviewer prompt) is **framework-agnostic**. To retarget Vue/Nuxt, SvelteKit, or Angular, **rewrite this one file** and leave the rest alone. The component-library, token, form, toast, and test-runner *concepts* below all have direct equivalents in those ecosystems.
>
> Stack facts verified current **June 2026**. Use these EXACT current forms; do not emit the stale Tailwind v3 `@tailwind base/components/utilities` directives or a `tailwind.config.js`.

## 1. Stack at a glance

| Concern | Binding | Why |
|---------|---------|-----|
| Framework | React 19 + **Next.js (App Router)** or Vite + React | shadcn/ui targets both |
| Styling | **Tailwind CSS v4** | CSS-first config via `@theme`; no `tailwind.config.js` required |
| Components | **shadcn/ui** (Radix UI + Tailwind, **copied into the repo**) | team owns the code; accessible by default |
| Design tokens | CSS variables in `@theme` (DTCG-sourced) | one source of truth; see `../principles/design-direction.md` |
| Forms | **react-hook-form + Zod** via shadcn `Form` | generated `Form` wires `aria-invalid` + `aria-describedby` |
| Toasts / feedback | **Sonner** (`<Toaster />` in root layout) | success/error feedback for CRUD mutations |
| Component spec / test | **Storybook** story + play function | executable assertion (see `../testing/ui-testing.md`) |
| a11y gate | `@axe-core/playwright` + Storybook a11y addon | machine-checkable subset of WCAG |
| Visual-regression gate | **Chromatic** | drift gate (pixel diff vs baseline) |
| Design handoff | **Figma Code Connect** + **Figma Dev Mode MCP** | design-to-code; § 6 |

## 2. Tailwind CSS v4 — CSS-first setup

**Install (Next.js — PostCSS, the common case):**
```bash
npm install tailwindcss @tailwindcss/postcss
```
```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

**Install (Vite):**
```bash
npm install tailwindcss @tailwindcss/vite
```

> Both `@tailwindcss/postcss` (Next.js / generic PostCSS pipelines) and `@tailwindcss/vite` (Vite) are current (2026-06) and equivalent for the `@theme` block — pick the one matching your bundler.

**Vite plugin** — `vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Stylesheet** — `src/index.css` (or `app/globals.css` for Next.js). Tailwind v4 uses a **single import**, NOT the old three `@tailwind` directives:
```css
@import "tailwindcss";

/* Design tokens live here as CSS variables. @theme makes them Tailwind
   utilities AND plain CSS vars. Colors use OKLCH. No tailwind.config.js.
   NOTE: the values below are an ILLUSTRATIVE EXCERPT. Copy the canonical,
   complete light/dark token set from ../principles/design-direction.md
   (single source of truth) rather than these abbreviated values. */
@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-border: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --radius: 0.625rem;
}
```

> The full token contract (light/dark, spacing/radius scales, the no-raw-hex rule, sourcing from DTCG) is specified in `../principles/design-direction.md`. The point here is mechanical: **tokens are CSS variables declared in `@theme`** — this is what gives the AI a design language to apply, instead of falling back to the browser's Times New Roman serif default.

## 3. shadcn/ui — init + the CRUD dependency set

**Initialize** (writes `components.json`, sets up the `cn()` util and base styles):
```bash
npx shadcn@latest init
```

**`components.json`** — the key flag is `cssVariables: true` so tokens stay as CSS variables (matching § 2, not hard-coded Tailwind color classes):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

**Add the components a typical CRUD app needs.** Each is **copied into your repo** under `@/components/ui` — the team owns the code, built on Radix UI + Tailwind and accessible by default:
```bash
npx shadcn@latest add button card dialog form input table select sonner skeleton
```

**Recommended CRUD dependency set:**

| Component | CRUD role |
|-----------|-----------|
| `button` | actions: create / save / delete / cancel |
| `card` | list items, detail panels, empty-state container |
| `dialog` | create / edit modal, delete confirmation |
| `form` | the react-hook-form + Zod wrapper (`Form` / `FormField` / `FormControl` / `FormMessage`) — wires `aria-invalid` + `aria-describedby` |
| `input` (+ `textarea`, `checkbox`) | form fields |
| `select` | enum / relationship pickers |
| `table` (or a TanStack **data-table**) | the LIST view: sortable, paginated rows |
| `sonner` | success / error toasts after a mutation |
| `skeleton` | the **loading state** of list + detail (covers a screen state `ui-flow-completeness.md` requires) |

> Add `pagination`, `dropdown-menu`, `badge`, `alert-dialog` as the feature grows. Keep the set lean (Tier 0 guardrail): add a component when a spec'd screen state needs it, not speculatively.

## 4. Forms — react-hook-form + Zod (the shadcn pattern)

Forms use **react-hook-form + Zod** through the generated `Form` primitives. The `FormField` → `FormControl` → `FormMessage` wiring is what makes the field **accessible by default** (`aria-invalid`, `aria-describedby` linking the error message to the input):

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// The Zod schema IS the form contract — reused as the executable assertion
// in the CRUD feature spec (see ../templates/crud-feature-spec.md).
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
});

export function CustomerForm({ onSubmit }: { onSubmit: (v: z.infer<typeof schema>) => void }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormMessage /> {/* renders the Zod error; linked via aria-describedby */}
          </FormItem>
        )} />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
```

## 5. Toasts — Sonner in the root layout

Place **one** `<Toaster />` in the root layout; call `toast()` from anywhere after a mutation:
```tsx
// app/layout.tsx (Next.js) — or the root of a Vite app
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
```
```tsx
import { toast } from "sonner";
toast.success("Customer saved");   // success feedback for a CRUD mutation
toast.error("Could not save customer"); // the error screen state
```

## 6. Design handoff — Figma Code Connect + Dev Mode MCP

**Figma Code Connect** maps a Figma design-system component to its code component — the frontend analogue of a file-and-line citation linking design to implementation. ⚠️ It is **MANUALLY maintained and can rot**, so treat it like any other citation: wrap it in an automated name/prop check in CI (see `../testing/ui-testing.md`) so a renamed prop fails the build rather than silently drifting.

**Figma Dev Mode** exposes an **MCP server** that feeds live design context (selected frame, variables/tokens, component metadata) to AI coding tools **including Claude Code**. Recommended AI-handoff loop:

1. Connect the Figma Dev Mode MCP server to your agent.
2. Author the design tokens in Figma variables; let the agent read them via MCP and emit the matching `@theme` block (§ 2) — so the token names in code match the design source.
3. Have the agent generate components from selected frames, but constrained to the shadcn/ui primitives in `@/components/ui` (do NOT let it invent ad-hoc markup).
4. Pin the design→code mapping with Code Connect; gate it in CI.

## 7. Stack binding summary (cite this block from CLAUDE.md)

```
Production binding (your platform, 2026-06-06):
- Framework:       React 19 + Next.js App Router (or Vite + React)
- Styling:         Tailwind CSS v4 — @import "tailwindcss"; tokens in @theme; @tailwindcss/vite
- Components:      shadcn/ui (Radix + Tailwind), copied into @/components/ui; components.json cssVariables: true
- Forms:           react-hook-form + Zod via shadcn Form/FormField/FormControl/FormMessage
- Feedback:        Sonner <Toaster /> in root layout
- Component specs: Storybook story + play function
- a11y gate:       @axe-core/playwright + Storybook a11y addon (machine-checkable subset of WCAG)
- Visual gate:     Chromatic (drift gate vs baseline)
- Design handoff:  Figma Code Connect + Figma Dev Mode MCP
```

> To port: rewrite THIS file only. Vue → swap shadcn/ui for shadcn-vue or Radix Vue; React Hook Form → VeeValidate + Zod; Storybook + axe + Chromatic carry over unchanged.

## Next

→ `../principles/design-direction.md` — the design-token contract that stops naked HTML
