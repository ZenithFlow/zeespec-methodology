---
doc: overlays/frontend-design-system/principles/ui-flow-completeness
type: principles-spec
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# UI Flow Completeness — Every Operation, Every Screen State

> The frontend analogue of backend invariants. A backend spec is not done until every invariant (`debit=credit`, no negative balance) is enumerated and enforced; a CRUD **UI** spec is not done until every **operation** and every **screen state** is enumerated and tested. This file is the checklist the `RF-frontend-reviewer` enforces (`../prompts/RF-frontend-reviewer.md`) so the AI cannot ship a half-built CRUD.
>
> **Why this file exists:** the original failure was a spec that enumerated entities and invariants (backend-shaped) but never the UI flow. The AI built a Create form and a List, called it "done," and shipped a CRUD with no detail view, no delete confirmation, no empty state, no error state, and no loading state. It rendered, so it looked finished. It was not usable.

## The completeness rule (one sentence)

**A CRUD feature is DONE only when every operation in {List, Create, Read/detail, Update, Delete} is specified, AND every screen in that feature covers every applicable state in the State Matrix below, AND each state has an executable assertion that fails when the state is missing or broken.**

Missing a state is not a "polish" gap. An unhandled error state is a screen that white-screens on a 500. An unhandled empty state is a new user staring at a blank table wondering if the app is broken. These are P0/P1 defects, not nice-to-haves — see the severity table at the end.

## The 5 operations (CRUD is 5, not 4)

The "R" in CRUD is two screens, and teams routinely ship only one.

| Op | Screen | Common omission |
|----|--------|-----------------|
| **List** | index / table | Ships, but with no empty/loading/error state |
| **Create** | form (new) | Ships, but with no validation-error or submitting state |
| **Read** | detail view (single record) | **Frequently omitted entirely** — list links nowhere |
| **Update** | form (edit) | Ships, but doesn't pre-populate, or reuses Create with no "dirty" guard |
| **Delete** | confirm + remove | Ships as a raw button with **no confirmation** → accidental destructive action |

> A CRUD feature spec that names fewer than 5 operations is incomplete by definition. If an operation is intentionally absent (e.g. records are immutable → no Update), the spec must say so explicitly with a one-line reason. Silence is a gap, not a decision.

## The State Matrix — mandatory states every data screen must cover

Every screen falls into one of two shapes: a **read screen** (List, Detail) that fetches and displays, or a **mutation screen** (Create, Update, Delete) that submits and changes data. Each shape has a mandatory set of states. A state is "covered" only when it has (a) a specified visual, (b) a shadcn/ui primitive bound to it, and (c) an executable test.

### Read screens (List, Detail)

| State | What the user sees | shadcn primitive | Executable assertion |
|-------|-------------------|------------------|----------------------|
| **loading** | Skeleton placeholders in the shape of the eventual content (NOT a bare spinner, NOT a blank page) | `Skeleton` | Story renders with a pending/never-resolving fetch; `expect(skeleton).toBeVisible()` |
| **empty** | Friendly empty state: icon + one-line explanation + primary call-to-action (e.g. "No products yet — Create your first") | composed empty block (Card + Button) | Story with `data: []`; `expect(getByText(/no .* yet/i)).toBeVisible()` and the CTA is clickable |
| **error** | Error message the user can act on + a **Retry** control. Never a white screen, never a raw stack trace | `Alert` (variant destructive) + `Button` | Story with a rejected fetch; `expect(getByRole('alert')).toBeVisible()`; clicking Retry re-issues the fetch (spy assertion) |
| **populated** | The actual data (table rows / detail fields) | `Table` / `Card` | Story with seeded data; `expect(getByText('Widget A')).toBeVisible()` |

### Mutation screens (Create, Update, Delete)

| State | What the user sees | shadcn primitive | Executable assertion |
|-------|-------------------|------------------|----------------------|
| **idle** | The form/dialog, ready, submit enabled | `Form` + `Dialog`/`Button` | Story renders; submit control is enabled |
| **submitting** | Submit disabled + busy indicator; the form is not double-submittable | `Button` (disabled + spinner) | play fn: click submit on a slow handler → `expect(submitBtn).toBeDisabled()`; two rapid clicks fire one request |
| **validation-error** | **Field-level** messages tied to the offending input (not one global "something went wrong"); the field is marked invalid | `FormMessage` (auto-wires `aria-invalid` + `aria-describedby`) | play fn: submit invalid → `expect(getByText(/required/i)).toBeVisible()`; input has `aria-invalid="true"` |
| **server-error** | A toast/alert for the failed submit (e.g. 409 conflict, 500); the form data is **preserved**, not wiped | `Sonner` toast or inline `Alert` | play fn: handler rejects → error toast asserted; field values still present |
| **success** | Confirmation toast + navigation/close + the list reflects the change | `Sonner` toast (`<Toaster />` in root layout) | play fn: handler resolves → `expect(toast)` shown; route/list updated |
| **optimistic / rollback** *(only if optimistic UI is used)* | UI updates immediately on submit; on failure it **rolls back** to the prior value and shows the error | local state + `Sonner` | play fn: optimistic apply asserted, then handler rejects → UI reverts to prior value (assert old value back) |

> **Optimistic is opt-in.** If the spec does not say "optimistic," the default is pessimistic (wait for server, then update) and the optimistic/rollback row does not apply. But if optimistic IS used, rollback is mandatory — an optimistic update with no rollback path is a lie to the user (the screen says it worked when it did not). See trap #6 below.

## The traps this rule catches

These are the concrete ways an AI (or a human in a hurry) ships an incomplete CRUD. Each maps to a missing cell in the matrix above.

### 1. Blank screen during fetch (no loading state)

**Symptom:** Component fetches in `useEffect`/server component; while pending it renders nothing (or a bare `<p>Loading...</p>` in Times New Roman).

**Impact:** On a slow network the user sees a blank/janky page and assumes the app is broken. Layout shifts violently when data arrives.

**Fix:** Render a `Skeleton` shaped like the content. For Next.js App Router, a `loading.tsx` per route segment gives this for free via Suspense.

**Caught by:** Storybook "Loading" story + play-function assertion that the skeleton is visible while the fetch is pending.

---

### 2. Blank table for the first-ever user (no empty state)

**Symptom:** `data.map(...)` over an empty array renders nothing. New user sees an empty table with headers and no guidance.

**Impact:** Highest-stakes moment (first run) looks like a bug. No path to the primary action.

**Fix:** Branch on `data.length === 0` → render an empty block: icon + "No products yet" + a **Create** CTA. The empty state is where you onboard.

**Caught by:** "Empty" story with `data: []` asserting the message + a clickable CTA.

---

### 3. White screen on error (no error/retry state)

**Symptom:** Fetch rejects → unhandled promise / thrown error → React error boundary shows a blank page, or worse, a raw stack trace in production.

**Impact:** A transient 500 makes the whole feature unusable with no recovery. User must hard-refresh and pray.

**Fix:** Catch the error → render an `Alert` (destructive) with a human message + a **Retry** button that re-issues the fetch. In Next.js App Router, `error.tsx` per segment provides the boundary + a `reset()` you wire to Retry.

**Caught by:** "Error" story with a rejected fetch; assert `role="alert"` visible and that clicking Retry calls the fetch again.

---

### 4. Destructive action with no confirmation (Delete)

**Symptom:** A trash icon calls `deleteRecord(id)` directly on click. One misclick = gone.

**Impact:** Irreversible data loss from a single click. No undo, no "are you sure."

**Fix:** Delete goes through `AlertDialog` ("Delete Widget A? This cannot be undone.") with explicit Cancel/Delete actions. Optionally pair with an undo toast (`Sonner` action button) for a grace window.

**Caught by:** play fn: click delete → assert dialog opens; clicking Cancel does NOT call the delete handler; clicking confirm DOES.

---

### 5. One global error instead of field-level validation

**Symptom:** Form posts, server returns 422, UI shows a single toast "Validation failed." User has no idea which field.

**Impact:** User can't fix the form. Rage-clicks submit. Field-level errors are also an accessibility requirement, not just UX.

**Fix:** Use the shadcn `Form` + `FormField` + `FormMessage` pattern (react-hook-form + Zod). `FormMessage` renders per-field and auto-wires `aria-invalid` + `aria-describedby` so screen readers announce the error on the right field. Map server validation errors back onto the matching fields (`form.setError`).

**Caught by:** play fn submitting invalid input asserts the per-field message text AND `aria-invalid="true"` on the input.

---

### 6. Optimistic update with no rollback (the screen lies)

**Symptom:** Toggle/edit updates local state instantly; the server call fails; the UI keeps showing the new value as if it saved.

**Impact:** User believes the change persisted. They navigate away. On reload, their change is gone — silent data loss, the UI equivalent of finance trap #13 ("approved but never executed").

**Fix:** If you go optimistic, capture the prior value, apply optimistically, and on the rejected promise **revert to the prior value** and surface an error toast. React's `useOptimistic` (or the equivalent in your data layer) makes the rollback explicit.

**Caught by:** play fn that asserts the optimistic value appears, forces the handler to reject, then asserts the OLD value is back and an error toast showed.

---

### 7. Edit form that doesn't pre-populate (Update is fake)

**Symptom:** "Edit" opens the same component as "Create" with empty fields; saving creates a duplicate or wipes existing values.

**Impact:** Update silently destroys data. The "U" in CRUD is non-functional.

**Fix:** Edit must load the record and set `defaultValues`. Distinguish create vs edit explicitly (route param / prop). Guard against navigating away with unsaved changes (dirty check) if the form is long.

**Caught by:** play fn / e2e: open Edit on a seeded record → assert fields are pre-filled with that record's values.

---

### 8. Detail view (Read) doesn't exist — the list links nowhere

**Symptom:** Rows are not clickable, or click does nothing / 404s. The spec only ever mentioned "a list and a form."

**Impact:** Users can't inspect a single record. Half of "R" is missing.

**Fix:** Specify the detail route (`/products/[id]`) as a first-class screen with its own full read-screen state matrix (loading/empty-or-404/error/populated). A row links to it.

**Caught by:** e2e: click a row → URL is the detail route → that record's fields are shown.

## What this rule deliberately does NOT cover

- **Whether it looks good.** State *presence and behavior* are gated here (and visually pinned by Chromatic — see `../testing/ui-testing.md`). Subjective aesthetic quality is explicitly out of scope: a machine flags pixel deltas objectively but cannot judge taste. Track aesthetic judgment in `gaps.md`, not behind the automated gate. Design *direction* (so it isn't naked Times New Roman in the first place) is owned by `design-direction.md`.
- **The ~43% of accessibility that needs human judgment.** A green axe run is the machine-checkable subset of WCAG (only ~29.5% of success criteria are fully automatable). `FormMessage`'s `aria-invalid` wiring is checkable; whether your error *wording* is helpful is not. Human-judgment a11y items (alt-text quality, logical focus order, caption accuracy) go in `gaps.md` per `../testing/ui-testing.md`, NOT behind the gate.

## How the reviewer enforces this (status tags)

The `RF-frontend-reviewer` walks the feature spec and tags each operation × state cell with a ZeeSpec status tag + a file-and-line citation as proof:

| Tag | Meaning for a UI state | Proof required |
|-----|------------------------|----------------|
| **IMPL** ✅ | State is built AND has a passing executable test | component `file:line` + the story/test `file:line` that asserts it |
| **PARTIAL** 🟡 | State is built but NOT tested (renders, but nothing proves it stays working) | component `file:line`; test gap noted |
| **DESIGN** 🚧 | State is specified but not in the code at all | spec line; filed as a gap |

An operation/state that is neither built nor specified is a **completeness failure** — the reviewer reports the feature as NOT done. "It renders" is not IMPL; IMPL requires the test that proves the state, mirroring core ZeeSpec's rule that ✅ IMPL needs a real `file:line` and verification (`/specs/checklists/status-tags.md`).

## Detection commands

Grep heuristics that surface missing states (tune paths/extensions to your repo). These find *likely* gaps fast; the authoritative gate is the test suite + reviewer.

```bash
# Components that fetch but have no loading branch (heuristic)
rg -l "useQuery|fetch\(|await .*\.(get|list)\(" src/features --type=tsx \
  | xargs rg -L "Skeleton|isLoading|isPending|loading\.tsx"

# List/table components with no empty-state branch
rg -l "\.map\(" src/features --type=tsx \
  | xargs rg -L "length === 0|isEmpty|No .* yet|empty"

# Mutations with no error handling (no catch / no error toast)
rg -l "onSubmit|mutate\(|action=" src/features --type=tsx \
  | xargs rg -L "catch|onError|toast\.error|setError"

# Delete buttons NOT wrapped in a confirm dialog  → manual review each hit
rg -n "delete|remove|destroy" src/features --type=tsx \
  | rg -v "AlertDialog"

# Features missing a detail route (Read) — expect one [id] segment per resource
fd "\[id\]" src/app/products || echo "WARN: no detail (Read) route for products"

# Every feature should have a co-located *.stories.tsx covering its states
fd -e tsx . src/features | rg -v stories | sed 's/\.tsx$//' \
  | while read f; do [ -f "$f.stories.tsx" ] || echo "NO STORIES: $f"; done
```

## Severity defaults (calibrated to user-facing impact)

| Missing state / trap | Default severity |
|----------------------|------------------|
| 3. No error/retry state (white screen on 500) | 🚨 P0 (feature unusable on transient failure) |
| 4. Destructive action, no confirmation | 🚨 P0 (irreversible data loss on misclick) |
| 6. Optimistic update, no rollback | 🚨 P0 (silent data loss; UI lies) |
| 7. Edit form doesn't pre-populate | 🚨 P0 (Update destroys/duplicates data) |
| 8. No detail (Read) screen at all | 🟠 P1 (CRUD incomplete; "R" half-missing) |
| 2. No empty state | 🟠 P1 (first-run looks broken; no path to CTA) |
| 1. No loading state | 🟠 P1 (jank + perceived breakage) |
| 5. Global error instead of field-level | 🟠 P1 (form unfixable; a11y miss) |
| Any state built but UNTESTED (🟡 PARTIAL) | 🟠 P1 (will silently regress) |

## Next

→ `../templates/crud-feature-spec.md` — paste-ready CRUD UI-flow template with a worked "Products" example
→ `../testing/ui-testing.md` — how each assertion above runs in CI (Storybook play, axe, Chromatic)
→ `component-contract.md` — the per-component contract these screens are assembled from
