# ZeeSpec Methodology

> **A portable, AI-friendly specification methodology** based on the 6-dimension Zachman framework (1987), adapted for modern AI-assisted development. Validated across 5 production modules in a Mongolian Mutual Fund Management System — surfaced **177 findings including 4 real production bugs fixed + 6 queued + 22 compliance gaps filed**.

## Where everything lives

All methodology content is under `specs/` to keep it portable when dropped into other projects (most projects have a `docs/specs/` convention).

```
zeespec-methodology/
└── specs/                          ← copy this whole directory into your project
    ├── README.md                   ← package overview + quick start
    ├── METHODOLOGY.md              ← full framework spec (1.5h read)
    ├── PORTING-GUIDE.md            ← adapt to your stack
    ├── workflow/                   ← 7 step-by-step guides (00-START-HERE first)
    ├── templates/_template/        ← empty 10-file ZeeSpec scaffold
    └── checklists/                 ← 5 reference checklists
```

## Quick start (3 commands)

```bash
# 1. Copy the package into your project
cp -r path/to/zeespec-methodology/specs your-project/docs/specs/zeespec

# 2. Read the package README
open your-project/docs/specs/zeespec/README.md

# 3. Follow workflow/00-START-HERE.md
```

## Start here

→ **[specs/README.md](specs/README.md)** — full package documentation
→ **[specs/METHODOLOGY.md](specs/METHODOLOGY.md)** — framework specification
→ **[specs/PORTING-GUIDE.md](specs/PORTING-GUIDE.md)** — adapt to your stack
→ **[specs/workflow/00-START-HERE.md](specs/workflow/00-START-HERE.md)** — AI agent entry point

## License

MIT
