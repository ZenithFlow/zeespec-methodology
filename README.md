# ZeeSpec Methodology

> **A portable, AI-friendly specification methodology** based on the 6-dimension Zachman framework (1987), adapted for modern AI-assisted development. Piloted on 5 production modules of a Mongolian Mutual Fund Management System (single pilot, N=1) — which surfaced **177 findings including 4 real production bugs fixed + 6 queued + 22 compliance gaps filed**.

## Where everything lives

All methodology content is under `specs/` to keep it portable when dropped into other projects (most projects have a `docs/specs/` convention).

```
zeespec-methodology/
└── specs/                          ← copy this whole directory into your project
    ├── README.md                   ← package overview + quick start
    ├── METHODOLOGY.md              ← full framework spec (1.5h read)
    ├── PORTING-GUIDE.md            ← adapt to your stack
    ├── workflow/                   ← workflow guides 00–12 (00-START-HERE first; full list in specs/README.md)
    ├── templates/_template/        ← empty 10-file ZeeSpec scaffold
    └── checklists/                 ← reference checklists (see specs/README.md)
```

## Quick start (3 commands)

```bash
# 1. Copy the package into your project
cp -r path/to/zeespec-methodology/specs your-project/docs/specs/zeespec

# 2. Read the package README
open your-project/docs/specs/zeespec/README.md

# 3. Follow workflow/00-START-HERE.md
```

## Install as a Claude Code plugin

This repo is also a **Claude Code plugin** (and its own marketplace) — the AI-native way to bring ZeeSpec into any project without copying files:

```bash
# add this repo as a marketplace (local path now; a GitHub shorthand once pushed)
/plugin marketplace add /absolute/path/to/zeespec-methodology   # or: ZenithFlow/zeespec-methodology
/plugin install zeespec@zeespec
```

Then, in any project:
- `/zeespec:init [module]` — add ZeeSpec + scaffold a module (Tier 0 Lite by default)
- `/zeespec:author` · `/zeespec:review` · `/zeespec:promote` — authoring / review / full Tier-1 promotion pipeline
- `/zeespec:drift` · `/zeespec:adr` · `/zeespec:gaps` · `/zeespec:metrics` · `/zeespec:check` — drift scan · ADR · gaps triage · metrics · pre-commit gate
- Reviewer agents: `zeespec-r4-regulatory`, `zeespec-r5-drift`, `zeespec-r6-adr`
- Skills (context-triggered): `zeespec-frontend`, `zeespec-aware-coding`, `zeespec-drift-guard`, `zeespec-authoring`, `zeespec-r4-citation` — Claude loads the right ZeeSpec guidance when your task matches the skill (on relevance, not a guaranteed hook)

The full methodology ships under `specs/`; commands + agents reference it at runtime via `${CLAUDE_PLUGIN_ROOT}/specs`. Updating the plugin updates the methodology everywhere — no per-project frozen copies to drift. Validate with `claude plugin validate .`.

## Start here

→ **[specs/README.md](specs/README.md)** — full package documentation
→ **[specs/METHODOLOGY.md](specs/METHODOLOGY.md)** — framework specification
→ **[specs/PORTING-GUIDE.md](specs/PORTING-GUIDE.md)** — adapt to your stack
→ **[specs/workflow/00-START-HERE.md](specs/workflow/00-START-HERE.md)** — AI agent entry point

## License

MIT
