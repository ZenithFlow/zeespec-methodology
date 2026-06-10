---
doc: examples/overlays/frontend-design-system/research-notes
type: overlay-research-notes
overlay: frontend-design-system
version: 0.1.0
status: experimental
last_updated: 2026-06-06
---

# AI × Frontend Design Systems — Research Conclusions

> The evidence base that grounds this overlay's design decisions. Synthesized from three
> fact-checked deep-research passes (mid-2026), each adversarially verified (claims kept only
> at ≥2/3 confirmation). This note exists so the overlay's choices are *traceable to sources*,
> the same discipline core ZeeSpec applies to regulatory claims (R4). It is a reference, not a
> spec — capabilities below are **time-sensitive (mid-2026)** and should be re-checked before
> relying on them.

## 1. The central pattern — "the design system is the API for AI"

Every independent source converged on one conditional: **an AI agent reliably reuses a design
system instead of reinventing it ONLY when the system is made explicitly machine-readable.**
Without that scaffolding, AI defaults to off-system, sometimes inaccessible, components.

The machine-readable surfaces that demonstrably work (all primary-sourced):

- **Design tokens in W3C DTCG format** — first stable version (2025.10); the canonical, vendor-neutral token format agents consume. *(DTCG is a Final Community Group Report — NOT a W3C Standard.)*
- **Figma Dev Mode MCP + Code Connect** — maps a design component to its code component; without the mapping the agent "will create a new one from scratch."
- **shadcn registry + MCP** — the "open code" model turns the design system into a natural-language install API (incl. private namespaced registries).
- **Storybook manifests + MCP** — `components.json` / `docs.json` + an explicit anti-hallucination rule ("Never hallucinate props — verify via MCP").
- **Lint enforcement** — Atlassian's `ensure-design-token-usage` ESLint rule errors on hardcoded values and is **auto-fixable** (governance, not advice).
- **At scale** — Zalando migrated 15 apps with GPT-4o at >90% accuracy, but ONLY after building component interfaces + verified mappings + examples; direct migration failed.

→ **This is exactly what the overlay mandates:** DTCG tokens, file:line/Code Connect citations, Storybook+axe executable assertions, token-lint/grep detection, the CI drift gate.

## 2. Create vs. consume — AI REMIXES, it does not ORIGINATE

For *creating a new* design system (vs. consuming one), the sharp finding:

| AI can ORIGINATE | AI CANNOT reliably originate |
|------------------|------------------------------|
| Machine-readable **plumbing** — DTCG token files, registry schemas, dual-layer specs | The **accessible color / type / spacing foundation** |
| **Remix within a system you define** (theme/token layer — e.g. tweakcn) | A **brand-differentiating visual language** |

- The accessible **foundation** that actually ships is **algorithmic color science, not LLM** — Adobe Leonardo (contrast ratio as the *input*) and Radix Colors (12-step, APCA). Delegate the foundation to these; do not ask an LLM to invent the palette.
- The popular "prompt → design system" workflows are, on inspection, **clone / style-transfer** (`awesome-design-md` reverse-engineers Stripe/Apple/BMW CSS → "build a page that looks like this") or **fixed-library token-styling** (Figr Identity applies generated tokens to a fixed 80+ component set — it does not originate components). v0 / Figma AI **consume or evolve** an existing system, they don't originate one (v0 is trained on shadcn defaults and gravitates to them).
- The one genuine new capability is the **AI-consumable spec layer**: Google Labs' **DESIGN.md** — a dual-layer format (normative YAML tokens + human rationale markdown) that exports to DTCG and Tailwind v4 `@theme`. **This is almost exactly ZeeSpec's own pattern** (normative spec + rationale + proof), independently arrived at — which is why the spec-driven approach, not design-to-code, is the durable bet.

## 3. The accessibility & homogenization reality (not hype)

- **Defaults fail.** shadcn/ui's default `muted-foreground` is **4.34:1 → fails WCAG AA**; Radix's APCA scale leaves **~283 light-theme pairs below WCAG 2 AA**. "Generated/default = accessible" is **false** — verify contrast independently.
- **Automation has a ceiling.** axe catches ~57% of WCAG issues by volume (~29.5% of success criteria); a peer-reviewed study (ASSETS '24) shows AI assistants both apply a11y incompletely AND **actively introduce new defects** (e.g. low-contrast hover), some undetectable by automated checkers.
- **Homogenization is real** — "websites made with shadcn famously look the same" (tweakcn's own framing). Brand differentiation and taste remain human work.

→ **Overlay consequence:** gate the machine-checkable a11y subset (axe, error mode); route the ~43% human-judgment items to `gaps.md`; keep subjective aesthetics out of scope.

## 4. Create-new vs. adopt-existing — the decision

| Need | Do |
|------|----|
| Accessible color / type / spacing foundation | **Adopt algorithmic tooling** (Leonardo / Radix / APCA) — not an LLM |
| Brand-differentiating visual language | **Human taste** — not an LLM |
| Token / theme remix, DTCG / registry / spec plumbing | **AI is well-suited** |
| Component system | **Build on the shadcn open-code substrate**; AI remixes; verify with tests |
| Overall | **Adopt a foundation, then differentiate with a custom theme + your own registry.** "Generate a whole new system from a prompt" is not realistic in mid-2026 |

## 5. What this grounds in the overlay

1. `stack/react-shadcn.md` adopts an established substrate (shadcn) rather than generating one — correct per §4.
2. `design-direction.md` makes DTCG tokens + `@theme` the single source and gates against naked HTML — and **should delegate the color foundation to algorithmic tools (Leonardo/Radix), not an LLM** (a rule worth adding explicitly).
3. `testing/ui-testing.md` gates the machine-checkable a11y subset and routes the rest to `gaps.md` — matches the documented automation ceiling.
4. The MCP layer (Figma Dev Mode / shadcn / Storybook MCP) is the agent-handoff surface — worth naming as the "design system as API for AI" mechanism.

## Honest caveats

- **N=1 / not independently validated** — the overlay is a first cut; the evidence here describes the *field*, not the overlay's measured efficacy.
- **Time-sensitive** — this tooling moves monthly; every product capability is dated mid-2026 and should be re-verified.
- **Primary vs marketing** — vendor "automatic / production-ready" claims are consistently overstated (e.g. Builder.io ~70% mapping accuracy under the "enforces automatically" banner). The peer-reviewed accessibility study is the strongest, non-vendor source.

## Key sources

- W3C DTCG stable spec — https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- Figma Dev Mode MCP / Code Connect — https://www.figma.com/blog/design-systems-ai-mcp/
- shadcn registry + MCP — https://ui.shadcn.com/docs/registry · https://ui.shadcn.com/docs/mcp
- Storybook for agents — https://storybook.js.org/docs/ai
- Atlassian token-lint — https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage/
- Zalando LLM migration — https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html
- Adobe Leonardo (algorithmic color) — https://github.com/adobe/leonardo · Radix Colors — https://www.radix-ui.com/colors
- Google Labs DESIGN.md — https://github.com/google-labs-code/design.md
- shadcn default a11y failure — https://github.com/shadcn-ui/ui/issues/8088 · Radix AA gaps — https://github.com/radix-ui/colors/issues/41
- AI + accessibility (peer-reviewed, ASSETS '24) — https://peyajm29.github.io/assets/documents/assets24e-sub1034-cam-i26.pdf

## Next

→ `./README.md` — overlay overview · `./principles/design-direction.md` — where the foundation-delegation rule belongs
