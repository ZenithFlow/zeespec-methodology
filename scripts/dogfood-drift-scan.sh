#!/usr/bin/env bash
#
# ZeeSpec dogfood drift-scan
# ---------------------------
# Runs the methodology's own mechanical checks against its OWN repo — closing the
# self-improvement loop (the methodology eats its own dog food). Catches the
# self-rot classes logged in specs/extended/ZACHMAN-ALIGNMENT.md §4. Mechanical only;
# semantic normalization ("same fact in two files", dimension leakage) is R5's job.
# (ZACHMAN-ALIGNMENT Tier 1·1C, lean form.)
#
# Usage: scripts/dogfood-drift-scan.sh
#   exit 0 = pass · 1 = drift found · 2 = setup error

set -uo pipefail
cd "$(dirname "$0")/.." || exit 2
SPECS="specs"
[ -d "$SPECS" ] || { echo "error: run from repo root (no $SPECS/ dir found)"; exit 2; }
fail=0
warn=0

echo "== ZeeSpec dogfood drift-scan =="

# [1] gravity.md must be pointer-only — no restated substance / status / file:line
echo "[1] gravity restatement (Zachman 'one fact, one cell')"
hits=$(grep -rn -E '\*\*Statement:\*\*|\*\*Status:\*\*|\*\*Source:\*\*|Verified at |Reliability:' "$SPECS" --include='gravity.md' 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo "  FAIL — gravity restates substance (move it to the primitive cell, leave a pointer):"
  printf '%s\n' "$hits" | sed 's/^/    /'
  fail=1
else
  echo "  PASS — gravity files are pointer-only"
fi

# [2] core-doc frontmatter versions must agree (the single-sourced package version)
echo "[2] core-doc version consistency"
ver() { awk -F': ' '/^version:/{print $2; exit}' "$1" 2>/dev/null; }
vm=$(ver "$SPECS/core/METHODOLOGY.md"); vr=$(ver "$SPECS/README.md"); ve=$(ver "$SPECS/examples/EXPLAINED-FOR-PRESENTATIONS.md"); vp=$(ver "$SPECS/core/PORTING-GUIDE.md")
if [ -n "$vm" ] && [ "$vm" = "$vr" ] && [ "$vm" = "$ve" ] && [ "$vm" = "$vp" ]; then
  echo "  PASS — METHODOLOGY / README / EXPLAINED / PORTING-GUIDE all at $vm"
else
  echo "  FAIL — version skew: METHODOLOGY=$vm README=$vr EXPLAINED=$ve PORTING-GUIDE=$vp"
  fail=1
fi

# [3] no machine-specific absolute paths in docs (brittle; drift when the repo moves)
echo "[3] hardcoded absolute paths"
hits=$(grep -rn '/Users/' "$SPECS" --include='*.md' 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo "  FAIL — machine-specific path(s) in docs (genericize them):"
  printf '%s\n' "$hits" | sed 's/^/    /'
  fail=1
else
  echo "  PASS — no /Users/ paths in specs"
fi

# [4] core budget — the anti-accretion guardrail (ROADMAP-v4.md standing rule 3).
#     The core tier is the mandatory entry path; if it grows past the budget, the
#     methodology is failing its own progressive-disclosure rule.
echo "[4] core line budget (specs/core <= ${CORE_BUDGET:-5000} lines)"
budget="${CORE_BUDGET:-5000}"
core_lines=$(find "$SPECS/core" -name '*.md' -print0 2>/dev/null | xargs -0 cat 2>/dev/null | wc -l | tr -d ' ')
if [ -z "$core_lines" ] || [ "$core_lines" -eq 0 ]; then
  echo "  FAIL — could not count specs/core (missing dir?)"
  fail=1
elif [ "$core_lines" -gt "$budget" ]; then
  echo "  FAIL — specs/core is $core_lines lines (> $budget). Cut or demote to extended/."
  fail=1
else
  echo "  PASS — specs/core is $core_lines lines (budget $budget)"
fi

# [5] accretion watch — new top-level chapters/tiers need a deliberate decision,
#     not a quiet commit (warning only; update EXPECTED_* here when intentional).
echo "[5] accretion watch (new top-level chapters)"
EXPECTED_EXT_CHAPTERS="07-r4-regulatory-research 08-code-drift-management 09-adr-lifecycle 10-adoption-guide 11-anthropics-plugin-integration 12-agentic-role-replacement"
EXPECTED_TIERS="core extended examples"
for d in "$SPECS"/extended/workflow/*/; do
  base=$(basename "$d")
  case " $EXPECTED_EXT_CHAPTERS " in
    *" $base "*) : ;;
    *) echo "  WARN — new extended chapter '$base' (content freeze until N=2; see ROADMAP-v4.md)"; warn=1 ;;
  esac
done
for d in "$SPECS"/*/; do
  base=$(basename "$d")
  case " $EXPECTED_TIERS " in
    *" $base "*) : ;;
    *) echo "  WARN — unexpected top-level tier dir 'specs/$base'"; warn=1 ;;
  esac
done
[ "$warn" -eq 0 ] && echo "  PASS — no unplanned chapters/tiers"

echo
if [ "$fail" -ne 0 ]; then
  echo "RESULT: FAIL — fix the items above."
  exit 1
fi
if [ "$warn" -ne 0 ]; then
  echo "RESULT: PASS with warnings (accretion watch). Mechanical checks OK."
else
  echo "RESULT: PASS (mechanical checks). For semantic normalization (duplicate facts,"
  echo "dimension leakage), dispatch R5 on this repo — see specs/extended/workflow/08."
fi
exit 0
