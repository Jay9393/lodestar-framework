#!/usr/bin/env bash
#
# pre-tool-gate.sh — example Claude Code PreToolUse hook (L3 enforcement).
#
# In STRICT mode, blocks edits to src/ while the project is still in discovery
# with no PRD on disk — i.e. "no building before a PRD exists". In LITE mode it
# only warns. This is a deliberately small example; extend it with your own gates.
#
# Wire it up via .claude/settings.json (see settings.example.json).
# Claude Code passes the tool call as JSON on stdin.
#
set -euo pipefail

input="$(cat)"

# Resolve project root (override or walk up from cwd).
root="${LODESTAR_PROJECT_ROOT:-$PWD}"
while [[ "$root" != "/" && ! -f "$root/PROJECT.md" ]]; do root="$(dirname "$root")"; done
[[ -f "$root/PROJECT.md" ]] || exit 0   # not a Lodestar project; allow.

manifest="$root/PROJECT.md"
mode="$(grep -E '^mode:' "$manifest" | head -1 | sed -E 's/^mode:[[:space:]]*([a-z]+).*/\1/')"
stage="$(grep -E '^stage:' "$manifest" | head -1 | sed -E 's/^stage:[[:space:]]*([a-z]+).*/\1/')"

# Extract the file path being edited (best-effort, no jq dependency).
path="$(printf '%s' "$input" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"file_path"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')"

# Only gate edits into src/.
case "$path" in
  *"/src/"*|src/*) ;;
  *) exit 0 ;;
esac

has_prd=false
if compgen -G "$root/docs/1-discovery/03-prd/PRD-*.md" > /dev/null 2>&1; then has_prd=true; fi

if [[ "$stage" == "discovery" && "$has_prd" == false ]]; then
  msg="Lodestar gate: editing src/ but the project is in 'discovery' with no PRD. Define a PRD (docs/1-discovery/03-prd/) or log a gate-skip first."
  if [[ "$mode" == "strict" ]]; then
    # Deny the tool call (exit code 2 = block, stderr shown to the model).
    echo "$msg" >&2
    exit 2
  else
    echo "WARN — $msg" >&2
    exit 0
  fi
fi

exit 0
