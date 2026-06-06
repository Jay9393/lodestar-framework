# Claude Instructions — {{PROJECT_NAME}}

This project follows the **Lodestar framework**. Claude Code reads `CLAUDE.md`,
so this file imports the shared agent instructions:

@AGENTS.md

## Claude-specific notes

- If the `lodestar-mcp` server is connected, prefer its tools (`get_stage`,
  `get_north_star`, `check_gate`, `check_alignment`, `log_decision`) over reading
  the files by hand.
- Full framework spec: `.lodestar/SPEC.md`.
