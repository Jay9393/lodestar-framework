# lodestar-mcp

The **L4 enforcement layer** of the [Lodestar framework](../README.md): a headless
MCP server that exposes Lodestar's stage state, north star, gates, alignment
check, and decision logging as tools. Because it speaks MCP, **any MCP-capable
agent** (Claude Code, Codex, Cursor, …) gets the same strong enforcement —
model-agnostic.

## Tools

| Tool | Purpose |
|---|---|
| `get_stage` | Current lifecycle stage + mode from `PROJECT.md` |
| `get_north_star` | The pinned top-level goal (read before any work) |
| `check_gate` | Run the next-stage checklist; pass/fail/manual per item |
| `check_alignment` | Return north star + an artifact to judge for drift |
| `log_decision` | Record a gate-skip / decision under `99-decision-research/` |

## Build

```bash
npm install
npm run build
```

## Run / connect

The server finds the project by walking up from the working directory to a
`PROJECT.md`, or you can pin it with `LODESTAR_PROJECT_ROOT`.

### Claude Code (`.mcp.json` in the target project)

```json
{
  "mcpServers": {
    "lodestar": {
      "command": "node",
      "args": ["/abs/path/to/lodestar-framework/mcp-server/dist/index.js"],
      "env": { "LODESTAR_PROJECT_ROOT": "${workspaceFolder}" }
    }
  }
}
```

### Any stdio MCP client

```bash
LODESTAR_PROJECT_ROOT=/path/to/project node dist/index.js
```

## Status

`v0.1.0` skeleton. Gate auto-checks are file-existence heuristics; the alignment
check returns context for the calling agent to reason over (no LLM call inside
the server yet). Both are intentionally simple seams to harden next.
