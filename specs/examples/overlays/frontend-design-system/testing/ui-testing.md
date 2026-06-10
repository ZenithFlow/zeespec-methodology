---
doc: examples/overlays/frontend-design-system/testing/ui-testing
type: testing-spec
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# UI Testing — Making Frontend Flows Executable Specs + a CI Gate

> **The problem this fixes.** A backend-shaped ZeeSpec (entities + invariants) ships a frontend with no tests, so flows are never verified, screen states silently go missing, and the page can regress to naked HTML without anyone noticing. This file turns the UI spec into runnable assertions and a hard CI gate — the **frontend analogue of ZeeSpec's BDD/executable-assertion discipline** (`METHODOLOGY.md` § 3c) and the **CI drift gate** (`scripts/ci-drift-gate.sh`, `extended/workflow/08-code-drift-management/`).
>
> **Read first:** `../principles/ui-flow-completeness.md` (the screen states this file verifies), `../principles/component-contract.md` (the per-component contract these stories assert), `../templates/crud-feature-spec.md` (the Given/When/Then source for E2E), `../principles/design-direction.md` (the token + design-system rules the visual gate protects).

## How this maps onto ZeeSpec mechanisms (do not invent new machinery)

| ZeeSpec core mechanism | Frontend analogue (this file) |
|------------------------|-------------------------------|
| BDD / executable assertion — § 3c + `extended/workflow/07-r4-regulatory-research/03-citation-conventions.md` *From citation to executable assertion* | A spec rule (a component-contract state, a CRUD Given/When/Then) becomes a **Storybook play function** or a **Playwright test**. The rule is the source; the test is the enforcement. |
| `file:line` citation as proof of a claim | A status claim (`✅ IMPL`) on a screen state or a11y rule cites the **story id / test name + path** that exercises it (e.g. `TaskTable.stories.tsx:42 — Empty`). |
| Status tags ✅ IMPL / 🟡 PARTIAL / 🚧 DESIGN (§ 4) | A screen state with a passing play function is `✅ IMPL`; storied-but-not-asserted is `🟡 PARTIAL`; documented-but-unstoried is `🚧 DESIGN`. No green test ⇒ no IMPL. |
| CI drift gate (`scripts/ci-drift-gate.sh`) — *a broken trace is a broken build* | Three CI gates: Storybook test (Vitest addon) for interaction, Playwright for flows, **axe in `error` mode** + **Chromatic** for the visual/a11y drift. A failing gate blocks the PR. |
| `gaps.md` — items needing human judgment, NOT auto-gated | The ~43% of WCAG that machines cannot judge (alt-text quality, focus order, caption accuracy) + subjective visual quality. These are tracked, never gated. |

**The status-tag rule, restated for UI:** writing `Empty state ✅ IMPL` in a spec without a story id or test name that exercises it is the same anti-pattern as a missing `file:line` (§ 4). A reviewer (`../prompts/RF-frontend-reviewer.md`) downgrades it to 🚧 DESIGN until proof is provided.

## The three layers

```
Layer 1  Storybook story + play function   → ONE component, every interaction state
Layer 2  Playwright E2E                     → the WHOLE CRUD flow, browser, real routing
Layer 3a axe (Playwright + SB a11y addon)   → machine-checkable WCAG subset, HARD gate (error mode)
Layer 3b Chromatic                          → pixel diff vs baseline = the visual DRIFT gate
```

Layer 1 proves a component renders each state from its `component-spec`. Layer 2 proves the states connect into the user journey from the `crud-feature-spec`. Layer 3 proves the result is accessible (subset) and has not visually drifted. Each is a separate CI job; all are required to merge.

> **Adopt the layers independently — you do not need all three at once.** They target different granularities and can land in phases. If you already have Playwright e2e (Layer 2) but no Storybook, add **axe (Layer 3a) to your existing suite first** — it is the cheapest, highest-ROI gate and needs no Storybook. Add Storybook (Layer 1) later for component-level regression on the UI that changes most. "All required to merge" above is the *target* end-state for a feature authored fresh; an existing project ratchets toward it (see the README section "Applying to an existing modern project").

---

## Layer 1 — Storybook stories + play functions (component interaction states)

One story per state declared in the component's `../templates/component-spec.md` (default, loading, empty, error, validation-error, success, disabled). A **play function** drives the interaction and asserts the result — this is the § 3c executable assertion at component granularity. The **Vitest addon** runs every play function in CI (it has superseded the standalone test-runner for Vite-powered Storybook; either runs the same play functions).

```tsx
// src/components/task-form/TaskForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { TaskForm } from './TaskForm';

const meta = {
  component: TaskForm,
  args: { onSubmit: fn() },
  // 👇 a11y runs on EVERY story in this file as a HARD failure (Layer 3a)
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof TaskForm>;
export default meta;

type Story = StoryObj<typeof meta>;

// State: default (CONTRACT TaskForm §states.default)
export const Default: Story = {};

// State: validation-error — submitting empty title shows the field error
// Asserts component-contract rule: "required title → inline error, aria-invalid set"
export const ValidationError: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /save/i }));
    // shadcn/ui Form wires FormMessage → the error is a real, reachable node
    await expect(await canvas.findByText(/title is required/i)).toBeVisible();
    // accessible name wiring is part of the contract, not just visuals
    await expect(canvas.getByLabelText(/title/i)).toHaveAttribute('aria-invalid', 'true');
    // invariant: no submit fired on invalid input
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

// State: success — valid input calls onSubmit with the typed payload
export const SubmitsValid: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/title/i), 'Buy milk');
    await userEvent.click(canvas.getByRole('button', { name: /save/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Buy milk' }),
    );
  },
};

// State: loading — the saving spinner disables the button (no double-submit)
export const Saving: Story = {
  args: { isSubmitting: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /save/i })).toBeDisabled();
  },
};
```

Wire the Vitest addon once (`npx storybook add @storybook/addon-vitest`); it generates the Vitest project that runs every story as a test in browser mode:

```ts
// vitest.config.ts (generated/extended by the Storybook Vitest addon)
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    browser: { enabled: true, provider: 'playwright', headless: true, instances: [{ browser: 'chromium' }] },
    setupFiles: ['.storybook/vitest.setup.ts'],
  },
});
```

CI job (Layer 1 + Layer 3a run together — the Vitest addon executes play functions *and* the a11y `error`-mode checks):

```yaml
# .github/workflows/ui-tests.yml — job: storybook
- run: npm ci
- run: npx playwright install --with-deps chromium
- run: npx vitest run --project=storybook   # play functions + a11y(error) as one gate
```

**Coverage rule (gate input for the reviewer):** every state listed in a component's `component-spec` § states MUST have a corresponding story. A state with no story is `🚧 DESIGN` and the reviewer (`../prompts/RF-frontend-reviewer.md`) flags it as a missing-state finding. The story id is the `file:line`-equivalent citation.

---

## Layer 2 — Playwright E2E (full CRUD user flow)

Write one E2E test **directly from the `Given / When / Then` blocks** in `../templates/crud-feature-spec.md`. This is the § 3c assertion at flow granularity: the spec scenario is the source, the test is the enforcement, and the scenario id is the citation. Keep the boundary cases (empty list → first create → edit → delete → back to empty) because *flow completeness* is exactly what the backend-shaped spec missed.

```ts
// e2e/tasks-crud.spec.ts
import { test, expect } from '@playwright/test';

// Sourced from crud-feature-spec.md §scenarios CRUD-TASK-01..05
test.describe('Tasks CRUD', () => {
  test('CRUD-TASK-01 empty → create → list → edit → delete', async ({ page }) => {
    await page.goto('/tasks');

    // Given the list is empty  →  Then the empty state is shown (ui-flow-completeness §empty)
    await expect(page.getByRole('heading', { name: /no tasks yet/i })).toBeVisible();

    // When I create a task
    await page.getByRole('button', { name: /new task/i }).click();
    await page.getByLabel(/title/i).fill('Write the spec');
    await page.getByRole('button', { name: /save/i }).click();

    // Then a success toast appears (Sonner) and the row is listed
    await expect(page.getByText(/task created/i)).toBeVisible();
    await expect(page.getByRole('row', { name: /write the spec/i })).toBeVisible();

    // When I edit it
    await page.getByRole('row', { name: /write the spec/i }).getByRole('button', { name: /edit/i }).click();
    await page.getByLabel(/title/i).fill('Write the ZeeSpec');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('row', { name: /write the zeespec/i })).toBeVisible();

    // When I delete it (confirm in dialog)  →  Then we return to the empty state
    await page.getByRole('row', { name: /write the zeespec/i }).getByRole('button', { name: /delete/i }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: /delete/i }).click();
    await expect(page.getByRole('heading', { name: /no tasks yet/i })).toBeVisible();
  });

  test('CRUD-TASK-04 server error surfaces an error state (not a blank page)', async ({ page }) => {
    // Given the create endpoint fails
    await page.route('**/api/tasks', (route) =>
      route.fulfill({ status: 500, body: 'boom' }),
    );
    await page.goto('/tasks');
    await page.getByRole('button', { name: /new task/i }).click();
    await page.getByLabel(/title/i).fill('x');
    await page.getByRole('button', { name: /save/i }).click();
    // Then the error state is shown — verifies ui-flow-completeness §error is wired
    await expect(page.getByRole('alert')).toContainText(/couldn.t save/i);
  });
});
```

CI job:

```yaml
# .github/workflows/ui-tests.yml — job: e2e
- run: npm ci
- run: npx playwright install --with-deps
- run: npm run build && npm run start &   # or playwright webServer config
- run: npx playwright test
```

**Why Layer 2 cannot be replaced by Layer 1.** Play functions mount one component in isolation; they cannot catch a broken route, an unwired mutation, a toast that never fires, or a missing return-to-empty transition. The incomplete-CRUD failure mode lives *between* components — only the E2E flow exercises it. Every scenario in `crud-feature-spec` must have a matching `test(...)`; an unmapped scenario is a missing-coverage finding for the reviewer.

---

## Layer 3a — Accessibility as an assertion (HARD gate, error mode)

A11y is checked twice, on purpose: at the **component** level (Storybook a11y addon, set `test: 'error'` so violations fail the build, shown in Layer 1 above) and at the **page** level (`@axe-core/playwright`, where component composition can introduce new violations — duplicate landmarks, heading-order breaks, contrast on real backgrounds).

Pin the WCAG criteria with `.withTags(...)` and assert **zero** violations — `expect(results.violations).toEqual([])` *is* the assertion (verified current form, `@axe-core/playwright`):

```ts
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test('tasks page has no machine-detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/tasks');
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations).toEqual([]);   // hard gate — any violation fails CI
});

test('create dialog is accessible when open', async ({ page }) => {
  await page.goto('/tasks');
  await page.getByRole('button', { name: /new task/i }).click();
  // scan the dialog state specifically — open overlays are a common a11y regression site
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations).toEqual([]);
});
```

Share config across the suite with a fixture so every a11y test is pinned identically:

```ts
// e2e/axe-fixture.ts
import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export const test = base.extend<{ makeAxe: () => AxeBuilder }>({
  makeAxe: async ({ page }, use) => {
    await use(() => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']));
  },
});
export { expect } from '@playwright/test';
```

**This is `error` mode by design.** `test: 'todo'` (warn) is allowed *only* for an item that is explicitly tracked in `gaps.md` with an owner and a date — it must never be the silent default, the same way a swallowed reconciliation break is an anti-pattern in the finance overlay. A blanket `exclude(...)` or a file-wide `todo` is itself a reviewer finding.

### What the a11y gate does NOT cover (hard scope boundary — read this)

A green axe run is **the machine-checkable subset of WCAG, not WCAG conformance.** Be precise and do not overclaim:

- axe-core catches roughly **57% of WCAG issues by volume**, which corresponds to only about **29.5% of WCAG success criteria** being *fully* automatable.
- The remaining ~**43%** needs **human judgment** and is **NOT placed behind the automated gate**. It is tracked in `gaps.md` for review:
  - **alt-text quality** — axe sees that `alt` exists, not whether it describes the image
  - **logical focus order** — axe sees focusable elements, not whether the tab sequence is sensible
  - **caption / transcript accuracy** — axe sees a `<track>`, not whether captions match the audio
  - meaningful link text, error-message helpfulness, reading order in complex layouts
- **Subjective visual quality is NEVER gated.** A machine flags pixel deltas objectively (Layer 3b); it cannot judge whether a layout *looks good*. Aesthetic verdicts stay with humans and are out of scope for every gate in this file.

Track the human-judgment items like any ZeeSpec gap (mirror `../../finance-accounting/modules/general-ledger/gaps.md`):

```markdown
### Gap-UI-07 — alt-text quality on the task attachment thumbnails
| Severity | 🟠 P1 |
| Status | 🔴 OPEN — needs human review (NOT auto-gatable) |
| Files | src/components/task-row/Attachment.tsx |
**Finding:** axe confirms `alt` is present; a human must confirm it describes the file, not "image".
**Why not gated:** alt-text *quality* is in the ~43% of WCAG machines cannot judge.
```

---

## Layer 3b — Chromatic visual-regression (the drift gate)

Chromatic captures a snapshot of every Storybook story and diffs it pixel-by-pixel against an approved baseline. This is the direct frontend analogue of `scripts/ci-drift-gate.sh`: it deterministically catches **visual drift** the same way the core gate catches citation/count drift — *a visual diff vs baseline is a broken trace until a human approves it*.

```yaml
# .github/workflows/ui-tests.yml — job: chromatic
- run: npm ci
- uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    exitZeroOnChanges: false   # any unapproved visual change fails the build
```

This is precisely the gate that catches the **naked-HTML / default-serif regression**: if the design system stops applying (tokens dropped, `@import "tailwindcss"` missing, a component reverting to unstyled markup), the rendered story snaps to Times New Roman serif and Chromatic shows a full-page diff — the build fails before the regression ships. See `../principles/design-direction.md` for the token contract this protects and `../stack/react-shadcn.md` for the `@theme` / `@import "tailwindcss"` setup whose absence Chromatic surfaces.

**Boundary:** Chromatic answers *"did it change vs the approved baseline?"* — an objective question. It does **not** answer *"is it good?"* The diff approval step is a **human** judgment, kept deliberately out of the automated pass/fail: the machine flags the delta; a person decides if the new look is intended. Do not script auto-approval.

---

## The combined CI gate (what blocks a merge)

| Job | Tool | Asserts | Failure = |
|-----|------|---------|-----------|
| `storybook` | Vitest addon (or test-runner) | every component-spec state has a passing play function | interaction/state regression or missing state |
| `e2e` | Playwright | every crud-feature-spec scenario passes end-to-end | broken flow / incomplete CRUD |
| `a11y` | `@axe-core/playwright` + SB a11y addon (`error`) | zero machine-detectable WCAG A/AA violations | a11y regression (the automatable subset) |
| `chromatic` | Chromatic | no unapproved pixel diff vs baseline | visual drift (incl. lost design system) |

All four are required status checks. This makes the frontend spec *enforced forever* with no model recall in the loop — exactly the § 3c promise. Roll out WARN → FAIL like the core drift gate: start a11y/Chromatic non-blocking on a legacy UI, fix the backlog, then flip to blocking.

## Authoring checklist (per CRUD feature)

- [ ] Each component-spec state (`../templates/component-spec.md`) → one Storybook story
- [ ] Interaction states (validation/loading/success) → play function with `expect`
- [ ] `parameters.a11y.test: 'error'` set at meta or `.storybook/preview` level
- [ ] Each crud-feature-spec `Given/When/Then` scenario → one Playwright `test`
- [ ] One Playwright a11y scan per route + per open overlay state, pinned to WCAG tags
- [ ] Chromatic baseline approved; `exitZeroOnChanges: false`
- [ ] Human-judgment WCAG items + any aesthetic concerns logged in `gaps.md` (NOT gated)
- [ ] Status tags in the spec cite story ids / test names as proof (§ 4 discipline)

## Cross-references

- `../principles/ui-flow-completeness.md` — the screen states Layer 1/2 verify
- `../principles/component-contract.md` — the per-component contract play functions assert
- `../principles/design-direction.md` — the token/design-system contract Chromatic protects
- `../templates/component-spec.md` — story-per-state source
- `../templates/crud-feature-spec.md` — Given/When/Then source for Playwright
- `../stack/react-shadcn.md` — the React / Tailwind v4 / shadcn-ui stack under test
- `../prompts/RF-frontend-reviewer.md` — the reviewer that flags missing stories/tests/states
- Core ZeeSpec `METHODOLOGY.md` § 3c — the BDD/executable-assertion mechanism
- Core ZeeSpec `extended/workflow/07-r4-regulatory-research/03-citation-conventions.md` — *From citation to executable assertion*
- Core ZeeSpec `scripts/ci-drift-gate.sh` + `extended/workflow/08-code-drift-management/` — the drift-gate pattern Chromatic/axe mirror

## Next

→ `../prompts/RF-frontend-reviewer.md` — dispatch the frontend reviewer against a built UI
