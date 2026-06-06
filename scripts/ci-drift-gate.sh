#!/usr/bin/env bash
#
# ZeeSpec CI drift gate (adopter-facing)
# --------------------------------------
# A broken trace is a broken build. Run this in CI on every PR in an ADOPTING
# project to deterministically (grep/awk/sed; NO AI) catch the cheaply-checkable
# drift types from workflow/08-code-drift-management/02-drift-categorization.md:
#   Type 1 (citation): every `file:line` cited in a spec resolves to a real file,
#                      and the cited line exists in that file.
#   Type 2 (field/enum count): spec-declared counts annotated with a machine-
#                      readable marker are re-derived from code; mismatch = drift.
# Type 3 (behavioral) + Type 4 (architectural) are SEMANTIC — out of scope here;
# they need the R5 agent (workflow/08 .../05-R5-drift-scanner-agent.md), not a gate.
#
# This is the GENERIC ADOPTER gate. The methodology's OWN repo self-check is the
# separate scripts/dogfood-drift-scan.sh (different target, different checks).
#
# Mode (env ZEESPEC_DRIFT_MODE): roll out WARN -> FAIL.
#   warn (default) — print findings, exit 0 (never blocks the build)
#   fail           — print findings, exit nonzero on any drift (blocks the build)
#
# Usage:
#   scripts/ci-drift-gate.sh [--spec-dir DIR] [--code-dir DIR]
#   ZEESPEC_DRIFT_MODE=fail scripts/ci-drift-gate.sh
# Defaults: --spec-dir docs/specs/zeespec  --code-dir .
#   exit 0 = pass / WARN mode · 1 = drift (FAIL mode) · 2 = setup error

set -uo pipefail

SPEC_DIR="docs/specs/zeespec"
CODE_DIR="."
MODE="${ZEESPEC_DRIFT_MODE:-warn}"

while [ $# -gt 0 ]; do
  case "$1" in
    --spec-dir) SPEC_DIR="$2"; shift 2 ;;
    --code-dir) CODE_DIR="$2"; shift 2 ;;
    --mode)     MODE="$2"; shift 2 ;;
    *) echo "error: unknown arg: $1" >&2; exit 2 ;;
  esac
done

[ -d "$SPEC_DIR" ] || { echo "error: spec dir not found: $SPEC_DIR (use --spec-dir)"; exit 2; }
[ -d "$CODE_DIR" ] || { echo "error: code dir not found: $CODE_DIR (use --code-dir)"; exit 2; }
case "$MODE" in warn|fail) ;; *) echo "error: ZEESPEC_DRIFT_MODE must be warn|fail (got: $MODE)"; exit 2 ;; esac

drift=0
echo "== ZeeSpec CI drift gate (mode=$MODE) =="
echo "   spec-dir=$SPEC_DIR  code-dir=$CODE_DIR"

# An allowlist marker lets specs carry illustrative pseudo-citations without drift:
#   <!-- drift-ignore --> ... <!-- /drift-ignore -->   (whole spec file is skipped
#   only when the marker wraps the cited line; here we skip files tagged file-wide)
is_ignored_file() { grep -q '<!-- *drift-ignore:all *-->' "$1" 2>/dev/null; }

# [1] Type 1 — citation drift: file:line citations must resolve to a real file+line
echo "[1] Type 1 citation resolution"
checked=0; broken=0
while IFS= read -r specfile; do
  is_ignored_file "$specfile" && continue
  # Pull `path/to/file.ext:NN` tokens (single line ref; range start is enough).
  while IFS= read -r cite; do
    [ -n "$cite" ] || continue
    file_part="${cite%%:*}"
    line_part="${cite##*:}"
    # Strip a trailing range (NN-NN -> NN) and any non-digits defensively.
    line_part="${line_part%%-*}"
    case "$line_part" in (*[!0-9]*|'') continue ;; esac
    target="$CODE_DIR/$file_part"
    checked=$((checked + 1))
    if [ ! -f "$target" ]; then
      broken=$((broken + 1))
      echo "  DRIFT — cited file missing: $file_part:$line_part  (in $specfile)"
      continue
    fi
    total=$(awk 'END{print NR}' "$target" 2>/dev/null || echo 0)
    if [ "$line_part" -gt "$total" ] 2>/dev/null; then
      broken=$((broken + 1))
      echo "  DRIFT — cited line out of range: $file_part:$line_part (file has $total lines)  (in $specfile)"
    fi
  # Strip URLs first so a host:port in a link (e.g. example.com:8080) is not mis-read
  # as a file:line citation; wrap URL-heavy specs (research notes) in <!-- drift-ignore:all -->.
  done < <(sed -E 's#[A-Za-z][A-Za-z0-9+.-]*://[^[:space:])"]*##g' "$specfile" 2>/dev/null \
            | grep -ohE '[A-Za-z_][A-Za-z0-9_/.-]+\.[A-Za-z0-9]+:[0-9]+(-[0-9]+)?' || true)
done < <(find "$SPEC_DIR" -type f -name '*.md' 2>/dev/null)
if [ "$broken" -eq 0 ]; then
  echo "  PASS — $checked citations resolve"
else
  echo "  FAIL — $broken/$checked citations broken"
  drift=$((drift + broken))
fi

# [2] Type 2 — annotated count drift: spec-declared counts re-derived from code.
# Opt-in: a count is only checked if the spec carries a machine-readable marker
# right where the number is stated, so the gate has a code-side anchor:
#   The WalletStatus enum has 4 cases.
#   <!-- zeespec:count expect=4 file=src/Domain/WalletStatus.php pattern='^\s+case [A-Z]' -->
# expect = the number the spec asserts; file/pattern = how to re-derive it from
# code (grep -cE of `pattern` in `file`). No marker => not checked here (it is
# either prose or a Type 3/4 semantic claim for R5).
echo "[2] Type 2 annotated count re-derivation"
ann=0; bad=0
while IFS= read -r specfile; do
  is_ignored_file "$specfile" && continue
  while IFS= read -r marker; do
    [ -n "$marker" ] || continue
    ann=$((ann + 1))
    expect=$(printf '%s' "$marker" | sed -nE "s/.*expect=([0-9]+).*/\\1/p")
    cfile=$(printf '%s'  "$marker" | sed -nE "s/.*file=([^ ]+).*/\\1/p")
    patt=$(printf '%s'   "$marker" | sed -nE "s/.*pattern=['\"]([^'\"]*)['\"].*/\\1/p")
    if [ -z "$expect" ] || [ -z "$cfile" ] || [ -z "$patt" ]; then
      bad=$((bad + 1)); echo "  DRIFT — malformed zeespec:count marker (need expect/file/pattern)  (in $specfile)"; continue
    fi
    ctarget="$CODE_DIR/$cfile"
    if [ ! -f "$ctarget" ]; then
      bad=$((bad + 1)); echo "  DRIFT — count anchor file missing: $cfile  (in $specfile)"; continue
    fi
    actual=$(grep -cE "$patt" "$ctarget" 2>/dev/null || echo 0)
    if [ "$actual" != "$expect" ]; then
      bad=$((bad + 1))
      echo "  DRIFT — count mismatch in $cfile: spec expect=$expect, code has $actual  (in $specfile)"
    fi
  done < <(grep -ohE '<!-- *zeespec:count [^>]*-->' "$specfile" 2>/dev/null || true)
done < <(find "$SPEC_DIR" -type f -name '*.md' 2>/dev/null)
if [ "$ann" -eq 0 ]; then
  echo "  PASS — no zeespec:count markers (Type 2 gating is opt-in; annotate counts to enable)"
elif [ "$bad" -eq 0 ]; then
  echo "  PASS — $ann annotated counts re-derive"
else
  echo "  FAIL — $bad/$ann annotated counts drifted"
  drift=$((drift + bad))
fi

echo
if [ "$drift" -eq 0 ]; then
  echo "RESULT: PASS — no Type 1/2 drift. (Type 3 behavioral + Type 4 architectural"
  echo "are semantic; dispatch the R5 agent — see workflow/08-code-drift-management.)"
  exit 0
fi
if [ "$MODE" = "fail" ]; then
  echo "RESULT: FAIL — $drift drift item(s). A broken trace is a broken build; fix the"
  echo "citations/counts above or annotate intentional cases. (ZEESPEC_DRIFT_MODE=warn"
  echo "to downgrade to non-blocking during rollout.)"
  exit 1
fi
echo "RESULT: WARN — $drift drift item(s) (mode=warn, not blocking). Move to"
echo "ZEESPEC_DRIFT_MODE=fail once the team trusts the signal."
exit 0
