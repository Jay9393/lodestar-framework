#!/usr/bin/env bash
#
# scaffold.sh — install the Lodestar framework into a target project.
#
# Usage:
#   ./scripts/scaffold.sh <target-dir> [--name <project>] [--mode strict|lite]
#
# Creates in <target-dir>:
#   docs/                  the lifecycle tree (1-discovery … 4-operate, 99-…)
#   PROJECT.md             the manifest (stage, mode, north star)
#   AGENTS.md CLAUDE.md GEMINI.md .cursor/rules/lodestar.mdc   agent entrypoints
#   .lodestar/SPEC.md      a vendored copy of the framework spec
#
set -euo pipefail

# --- locate repo + templates ---------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATES="$REPO_DIR/templates"
SPEC="$REPO_DIR/spec/SPEC.md"

# --- parse args -----------------------------------------------------------
TARGET=""
NAME=""
MODE="lite"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) NAME="$2"; shift 2 ;;
    --mode) MODE="$2"; shift 2 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) TARGET="$1"; shift ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  echo "error: target directory required" >&2
  echo "usage: $0 <target-dir> [--name <project>] [--mode strict|lite]" >&2
  exit 1
fi
if [[ "$MODE" != "strict" && "$MODE" != "lite" ]]; then
  echo "error: --mode must be 'strict' or 'lite' (got '$MODE')" >&2
  exit 1
fi
[[ -z "$NAME" ]] && NAME="$(basename "$(cd "$TARGET" 2>/dev/null && pwd || echo "$TARGET")")"

DATE="$(date +%Y-%m-%d)"

mkdir -p "$TARGET"

# --- copy docs tree -------------------------------------------------------
echo "→ docs/ lifecycle tree"
cp -R "$TEMPLATES/docs-tree/" "$TARGET/docs/"

# --- copy entrypoints + manifest + vendored spec --------------------------
echo "→ entrypoints (AGENTS.md, CLAUDE.md, GEMINI.md, .cursor/rules)"
cp "$TEMPLATES/entrypoints/AGENTS.md"  "$TARGET/AGENTS.md"
cp "$TEMPLATES/entrypoints/CLAUDE.md"  "$TARGET/CLAUDE.md"
cp "$TEMPLATES/entrypoints/GEMINI.md"  "$TARGET/GEMINI.md"
mkdir -p "$TARGET/.cursor/rules"
cp "$TEMPLATES/entrypoints/.cursor/rules/lodestar.mdc" "$TARGET/.cursor/rules/lodestar.mdc"

echo "→ PROJECT.md manifest"
cp "$TEMPLATES/PROJECT.md" "$TARGET/PROJECT.md"

echo "→ .lodestar/SPEC.md (vendored framework spec)"
mkdir -p "$TARGET/.lodestar"
cp "$SPEC" "$TARGET/.lodestar/SPEC.md"

echo "→ .lodestar/templates/ (artifact templates: BIZ/PS/PLAN/PRD/US/TASK/ADR)"
cp -R "$TEMPLATES/artifacts/" "$TARGET/.lodestar/templates/"

# --- substitute placeholders ---------------------------------------------
echo "→ filling placeholders (name=$NAME, mode=$MODE, date=$DATE)"
# Escape characters that are special in a sed replacement (\, &, and /).
escape_repl() { printf '%s' "$1" | sed -e 's/[\/&\\]/\\&/g'; }
NAME_ESC="$(escape_repl "$NAME")"
MODE_ESC="$(escape_repl "$MODE")"
DATE_ESC="$(escape_repl "$DATE")"
substitute() {
  local f="$1"
  # portable in-place sed (works on both GNU and BSD/macOS)
  sed -e "s/{{PROJECT_NAME}}/$NAME_ESC/g" \
      -e "s/{{MODE}}/$MODE_ESC/g" \
      -e "s/{{DATE}}/$DATE_ESC/g" \
      "$f" > "$f.tmp" && mv "$f.tmp" "$f"
}
substitute "$TARGET/AGENTS.md"
substitute "$TARGET/CLAUDE.md"
substitute "$TARGET/GEMINI.md"
substitute "$TARGET/.cursor/rules/lodestar.mdc"
substitute "$TARGET/PROJECT.md"
substitute "$TARGET/docs/README.md"

echo ""
echo "✔ Lodestar installed into: $TARGET"
echo "  stage: discovery   mode: $MODE"
echo ""
echo "Next: open the project with any agent and start at"
echo "  docs/1-discovery/00-business-strategy/"
