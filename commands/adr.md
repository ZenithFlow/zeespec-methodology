---
description: Create or curate an Architecture Decision Record — draft a new ADR, capture the WHY behind a drift finding, or dispatch R6 for conflict / staleness / cross-module review.
---

Create or curate an ADR for `$ARGUMENTS` (a decision summary / module / drift finding). Format + lifecycle per `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/09-adr-lifecycle/01-adr-format-template.md` + `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/09-adr-lifecycle/02-adr-lifecycle.md`. This is the **explicit on-demand** run of what the `zeespec-r6-adr` agent does; the `zeespec-drift-guard` skill is what surfaces the Type 3-design / Type 4 findings that feed mode (2).

Pick the mode from `$ARGUMENTS`:

1. **DRAFT a new ADR.** Write `ADR-<MOD>-NNN` (3-digit; next in sequence, never reused) with **context + decision + alternatives considered + consequences** — never just *what*, always *why* (per `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/09-adr-lifecycle/00-START-HERE.md` "when to write an ADR"). Add a row to the module `CLAUDE.md` ADR table; spill full text to `adr/<id>.md` if > 200 words. Link relationships: supersedes / extends / conflicts-with / inherits, **bidirectionally**.

2. **RETROACTIVE ADR** — capture the WHY behind a Type-3-design or Type-4 drift finding (per `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/09-adr-lifecycle/04-drift-driven-adr-pattern.md`). Read `git blame` + the PR description to reconstruct intent honestly (don't fabricate rationale); note "Retroactive — codifies PR #XXX". Then align the spec: update the stale `INV-<MOD>-NN`, mark the drift item RESOLVED in the `CLAUDE.md` drift table.

3. **CURATE** — dispatch the `zeespec-r6-adr` agent for conflict-check against existing ADRs, annual staleness review (mark stale ADRs SUPERSEDED/DEPRECATED with links), or cross-module impact.

**Lifecycle:** Proposed → Accepted → Superseded / Deprecated. Apply a **cool-off** before Accepting a material decision — never instant-self-accept (a 24h cool-off is the recommended pattern for solo / agentic teams; see `${CLAUDE_PLUGIN_ROOT}/specs/extended/workflow/10-adoption-guide/08-one-man-army.md`). R6 produces a draft for review; a human (or the cool-off re-read) does the Accept.

`$ARGUMENTS` = decision summary / module / drift finding.