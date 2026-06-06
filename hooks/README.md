# Hooks (L3 enforcement)

Deterministic, harness-level enforcement for **Claude Code**. Hooks can *block* a
tool call, which pure context files (L1) cannot — but they are Claude Code
specific. For model-agnostic enforcement, use the [MCP server](../mcp-server/)
(L4) instead, or in addition.

## What's here

- `pre-tool-gate.sh` — example `PreToolUse` hook. In **strict** mode it blocks
  edits to `src/` while the project is still in `discovery` with no PRD; in
  **lite** mode it only warns.
- `settings.example.json` — how to register the hook.

## Install into a project

```bash
mkdir -p <project>/.claude/hooks
cp pre-tool-gate.sh <project>/.claude/hooks/
chmod +x <project>/.claude/hooks/pre-tool-gate.sh
# merge settings.example.json into <project>/.claude/settings.json
```

Exit code `2` from a `PreToolUse` hook blocks the call and shows stderr to the
model; exit `0` allows it. Extend the script with your own gates.
