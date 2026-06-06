#!/usr/bin/env bash
#
# ZeeSpec dogfood drift-scan
# ---------------------------
# Runs the methodology's own mechanical checks against its OWN repo — closing the
# self-improvement loop (the methodology eats its own dog food). Catches the
# self-rot classes logged in specs/ZACHMAN-ALIGNMENT.md §4. Mechanical only;
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
vm=$(ver "$SPECS/METHODOLOGY.md"); vr=$(ver "$SPECS/README.md"); ve=$(ver "$SPECS/EXPLAINED-FOR-PRESENTATIONS.md"); vp=$(ver "$SPECS/PORTING-GUIDE.md")
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

echo
if [ "$fail" -ne 0 ]; then
  echo "RESULT: FAIL — fix the items above."
  exit 1
fi
echo "RESULT: PASS (mechanical checks). For semantic normalization (duplicate facts,"
echo "dimension leakage), dispatch R5 on this repo — see specs/workflow/08."
exit 0
