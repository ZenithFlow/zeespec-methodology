---
doc: overlays/frontend-design-system/templates/crud-feature-spec
type: crud-feature-spec-template
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# Template — CRUD Feature UI-Flow Spec

> Paste-ready template for specifying a CRUD feature's **full UI flow** so an AI builds a MODERN, COMPLETE, TESTED screen set — not a naked HTML form. Fill every section; leave no state blank. The completeness rule this enforces lives in `../principles/ui-flow-completeness.md`. Component-level contracts live in `component-contract.md`; the stack you build on is `../stack/react-shadcn.md`.
>
> **How to use:** copy this file into your module as `<feature>-ui-flow.md`, replace the worked **Products** example with your resource, and keep the structure: Screen List → State Matrix per screen → Given/When/Then flows → Components → Acceptance criteria. The reviewer (`../prompts/RF-frontend-reviewer.md`) checks every cell.
>
> **"Fully working flow a human can use"** = a person can land on the feature with no data, create a record, see it in the list, open its detail, edit it, delete it with a confirmation, and at every step gets clear loading / empty / error / success feedback — and every one of those steps is proven by a test. If any of those steps is missing, the feature is NOT done.

---

# Worked example: Products CRUD

*(Replace "Product" / `/products` / fields with your resource. The shape stays.)*

## 0. Feature summary

| | |
|---|---|
| **Resource** | Product |
| **Fields** | `name` (string, required, 1–80 chars), `sku` (string, required, unique), `price` (decimal ≥ 0, required), `status` (enum: `draft` / `active` / `archived`), `description` (string, optional) |
| **Operations** | List, Create, Read (detail), Update, Delete — **all 5 present** |
| **Stack** | Next.js App Router + Tailwind v4 + shadcn/ui (`../stack/react-shadcn.md`) |
| **Out of scope** | bulk import, image upload (separate feature) — *stated explicitly so silence isn't read as a gap* |

## 1. Screen list (routes)

Every screen is a first-class spec item with its own state matrix. Naming fewer screens than operations = incomplete.

| # | Screen | Route | Operation | Shape |
|---|--------|-------|-----------|-------|
| S1 | Product list | `/products` | List | read screen |
| S2 | Product detail | `/products/[id]` | Read | read screen |
| S3 | Create product | `/products/new` | Create | mutation screen |
| S4 | Edit product | `/products/[id]/edit` | Update | mutation screen |
| S5 | Delete product | dialog on S1 + S2 | Delete | mutation screen (dialog) |

## 2. State matrix per screen

Fill every applicable state. A blank cell is a gap, not a default. `→` names the shadcn primitive; the test column names the executable assertion (see `../testing/ui-testing.md` for how each runs in CI).

### S1 — Product list (`/products`)

| State | Specified visual | Primitive | Executable assertion |
|-------|------------------|-----------|----------------------|
| loading | 5 skeleton rows matching the table column layout | `Skeleton` in `<TableRow>` | "List/Loading" story: skeleton visible while fetch pending |
| empty | Card: box icon + "No products yet" + "Create product" button → S3 | Card + Button | "List/Empty" story (`data:[]`): message visible, CTA routes to `/products/new` |
| error | Destructive Alert: "Couldn't load products." + **Retry** | Alert + Button | "List/Error" story (rejected fetch): `role=alert` visible; Retry re-calls fetch (spy) |
| populated | Table: name, sku, price (formatted), status badge, row actions (View / Edit / Delete) | Table + Badge + Button | "List/Populated" story (seeded): row "Widget A" visible, actions present |

### S2 — Product detail (`/products/[id]`)

| State | Specified visual | Primitive | Executable assertion |
|-------|------------------|-----------|----------------------|
| loading | Skeleton matching the detail field layout | `Skeleton` | "Detail/Loading" story: skeleton visible while pending |
| not-found | "Product not found" + link back to list (the detail "empty") | Card + Button | "Detail/NotFound" story (404): message + back link visible |
| error | Destructive Alert + Retry | Alert + Button | "Detail/Error" story: `role=alert` + Retry re-fetches |
| populated | Card: all fields, status badge, Edit + Delete actions | Card + Badge + Button | "Detail/Populated" story (seeded): fields show that record's values |

### S3 — Create product (`/products/new`)

| State | Specified visual | Primitive | Executable assertion |
|-------|------------------|-----------|----------------------|
| idle | Form (name, sku, price, status, description), submit enabled | Form + Input + Select + Button | "Create/Idle" story: submit enabled |
| submitting | Submit disabled + spinner; not double-submittable | Button (disabled) | play fn: slow handler → submit disabled; 2 rapid clicks → 1 request |
| validation-error | Field-level messages (e.g. name required, price ≥ 0); invalid fields marked | FormMessage (`aria-invalid`) | play fn: submit empty → "Name is required" visible; input `aria-invalid=true` |
| server-error | Error toast (e.g. "SKU already exists" on 409); **form values preserved** | Sonner | play fn: handler rejects 409 → error toast; field values still present |
| success | Success toast "Product created" + redirect to S2 (its detail) | Sonner + router | play fn: handler resolves → toast shown; route = `/products/[newId]` |

### S4 — Edit product (`/products/[id]/edit`)

| State | Specified visual | Primitive | Executable assertion |
|-------|------------------|-----------|----------------------|
| loading | Skeleton form while record loads | Skeleton | "Edit/Loading" story: skeleton visible |
| idle (pre-populated) | Form pre-filled with the record's current values | Form | play fn / e2e: open Edit on seeded record → fields pre-filled |
| submitting | Submit disabled + spinner | Button (disabled) | play fn: slow handler → disabled |
| validation-error | Field-level messages | FormMessage | play fn: clear name, submit → "Name is required" |
| server-error | Error toast; values preserved | Sonner | play fn: handler rejects → error toast; values intact |
| success | Toast "Product updated" + redirect to S2 | Sonner + router | play fn: resolves → toast + route to detail |
| unsaved-changes guard *(optional)* | Confirm before leaving a dirty form | AlertDialog | e2e: dirty form + navigate away → guard prompts |

### S5 — Delete product (dialog)

| State | Specified visual | Primitive | Executable assertion |
|-------|------------------|-----------|----------------------|
| confirm | AlertDialog: "Delete Widget A? This cannot be undone." Cancel / Delete | AlertDialog | play fn: click Delete action → dialog opens |
| cancel | Dialog closes; **no delete called** | AlertDialog | play fn: click Cancel → delete handler NOT called |
| submitting | Confirm button disabled + spinner | Button (disabled) | play fn: slow handler → confirm disabled |
| success | Toast "Product deleted" (optional Undo action) + row removed from S1 | Sonner | play fn: confirm resolves → toast; row gone from list |
| error | Error toast; row stays | Sonner | play fn: handler rejects → error toast; row still present |

> No optimistic/rollback rows above because this example is **pessimistic** by default (wait for server, then update). If you make the list optimistic (remove the row before the server confirms), add the optimistic/rollback row from `../principles/ui-flow-completeness.md` § State Matrix and prove the row reappears on failure.

## 3. User flows — Given / When / Then (directly testable)

Write the flow as Gherkin so each scenario maps 1:1 to a play-function or Playwright e2e test (the citation→executable-assertion mechanism, `/specs/workflow/07-r4-regulatory-research/03-citation-conventions.md`). Cover the happy path AND the error paths — error paths are where incomplete CRUDs are exposed.

```gherkin
Feature: Products CRUD

  # ---------- HAPPY PATH (end-to-end, the "a human can use it" proof) ----------
  Scenario: A new user creates, views, edits, and deletes a product
    Given I am on /products and there are no products
    Then I see "No products yet" and a "Create product" button   # S1 empty

    When I click "Create product"
    And I fill name "Widget A", sku "W-001", price "9.99"
    And I submit
    Then I see a "Product created" toast                          # S3 success
    And I am on the product's detail page showing "Widget A"      # S2 populated

    When I go to /products
    Then I see "Widget A" in the table                            # S1 populated

    When I click "Widget A"
    Then I see its detail with sku "W-001" and price "9.99"       # S2 populated

    When I click "Edit" and change price to "12.50" and submit
    Then I see a "Product updated" toast                          # S4 success
    And the detail shows price "12.50"

    When I click "Delete"
    Then I see a confirmation dialog "Delete Widget A?"           # S5 confirm
    When I confirm
    Then I see a "Product deleted" toast                          # S5 success
    And /products shows "No products yet" again                   # S1 empty

  # ---------- ERROR PATHS (the cells teams skip) ----------
  Scenario: List fails to load and the user retries
    Given the products request will fail
    When I open /products
    Then I see an error alert with a Retry button                 # S1 error
    When the request will now succeed and I click Retry
    Then I see the product list                                   # S1 populated

  Scenario: Create form rejects invalid input at field level
    Given I am on /products/new
    When I submit with an empty name and price "-5"
    Then the name field shows "Name is required"                   # S3 validation-error
    And the price field shows "Price must be 0 or more"
    And the form is not submitted

  Scenario: Create surfaces a server conflict without losing my input
    Given a product with sku "W-001" already exists
    And I am on /products/new with name "Widget B", sku "W-001"
    When I submit
    Then I see an error toast "SKU already exists"                 # S3 server-error
    And my entered name "Widget B" is still in the form

  Scenario: Cancelling a delete does nothing
    Given a product "Widget A" exists
    When I click Delete and then Cancel
    Then "Widget A" is still listed                               # S5 cancel
    And no delete request was sent
```

## 4. Components used

List the shadcn/ui components this feature requires so setup is explicit (the AI runs `npx shadcn@latest add ...` — see `../stack/react-shadcn.md`). Each must satisfy its `component-contract.md`.

| Component | Used in | Add command |
|-----------|---------|-------------|
| `table` | S1 | `npx shadcn@latest add table` |
| `card` | S1 empty, S2 | `npx shadcn@latest add card` |
| `form` `input` `select` `label` | S3, S4 | `npx shadcn@latest add form input select label` |
| `button` | all | `npx shadcn@latest add button` |
| `badge` | S1, S2 (status) | `npx shadcn@latest add badge` |
| `skeleton` | loading states | `npx shadcn@latest add skeleton` |
| `alert` | error states | `npx shadcn@latest add alert` |
| `alert-dialog` | S5 confirm | `npx shadcn@latest add alert-dialog` |
| `sonner` | toasts (`<Toaster/>` in root layout) | `npx shadcn@latest add sonner` |

## 5. Acceptance criteria (status-tagged, with file:line proof)

The feature is DONE only when every row is ✅ IMPL with a citation. The reviewer fills this in; `file:line` is the proof, exactly as core ZeeSpec requires for ✅ IMPL (`/specs/checklists/status-tags.md`). 🟡 = built but untested; 🚧 = specified, not built. Anything below ✅ IMPL is an open item.

| ID | Acceptance criterion | Status | Proof (`file:line`) |
|----|----------------------|--------|---------------------|
| AC-PROD-01 | All 5 operations have routes/screens (S1–S5) | 🚧 DESIGN | _e.g._ `app/products/page.tsx:1` … |
| AC-PROD-02 | S1 covers loading/empty/error/populated, each tested | 🚧 DESIGN | `ProductList.stories.tsx:NN` |
| AC-PROD-03 | S2 detail exists; rows on S1 link to it | 🚧 DESIGN | `app/products/[id]/page.tsx:1` |
| AC-PROD-04 | S3 covers idle/submitting/validation/server-error/success, each tested | 🚧 DESIGN | `ProductForm.stories.tsx:NN` |
| AC-PROD-05 | Validation is **field-level** (Zod + FormMessage), `aria-invalid` wired | 🚧 DESIGN | `ProductForm.tsx:NN` |
| AC-PROD-06 | S4 edit pre-populates from the record | 🚧 DESIGN | e2e `products.spec.ts:NN` |
| AC-PROD-07 | S5 delete is gated by AlertDialog; Cancel does not delete | 🚧 DESIGN | `DeleteProduct.stories.tsx:NN` |
| AC-PROD-08 | Success/error feedback uses Sonner toasts (Toaster in root layout) | 🚧 DESIGN | `app/layout.tsx:NN` |
| AC-PROD-09 | Happy-path e2e (create→view→edit→delete) passes in CI | 🚧 DESIGN | `products.spec.ts:NN` |
| AC-PROD-10 | axe (machine-checkable WCAG subset) returns 0 violations on every screen | 🚧 DESIGN | `a11y.spec.ts:NN` |
| AC-PROD-11 | Chromatic baseline approved for every state story (visual gate) | 🚧 DESIGN | Chromatic build link |

> A green AC-PROD-10 is the **machine-checkable subset of WCAG**, not WCAG conformance. Human-judgment a11y (alt-text quality, focus order, status-badge color meaning) and subjective visual quality go in `gaps.md` — NOT behind the gate. See `../testing/ui-testing.md`.

## 6. Definition of done (the human-usable bar)

The feature is done when ALL hold:

1. **5 operations present** — S1–S5 exist (or an absent op is explicitly justified in § 0).
2. **Every applicable matrix cell is ✅ IMPL** — built AND tested, with `file:line` proof in § 5.
3. **Happy-path e2e passes** — a human-equivalent script does create → list → detail → edit → delete (AC-PROD-09).
4. **Every error path has a test** — § 3 error scenarios are green.
5. **It is not naked HTML** — design tokens applied (no browser-default serif); verified by Chromatic baseline (AC-PROD-11) and owned by `../principles/design-direction.md`.
6. **axe is green** on every screen (AC-PROD-10), with human-judgment items tracked in `gaps.md`.

If any of 1–6 fails, the reviewer reports the feature as NOT done, regardless of whether it renders.

## Next

→ `../principles/ui-flow-completeness.md` — the rule behind every cell above
→ `component-spec.md` — spec a single component (e.g. ProductForm) in detail
→ `../testing/ui-testing.md` — wire the assertions in § 2/§ 3/§ 5 into CI
