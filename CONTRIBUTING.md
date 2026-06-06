# Contributing to Lodestar

Thanks for your interest! Lodestar is early (`v0.1.0`) and feedback is especially
valuable.

## Ways to help

- **Use it and report friction** — open an issue describing what was confusing or
  what broke.
- **Improve the spec** — `spec/SPEC.md` is the canonical source. Entrypoint files
  only point to it; don't duplicate rules into them.
- **Harden the MCP server** — see `mcp-server/` and its README for current
  limitations (file-existence heuristics, agent-side alignment).

## Dev setup

```bash
# MCP server
cd mcp-server && npm install && npm run build

# Scaffold smoke test
./scripts/scaffold.sh /tmp/demo --name demo --mode lite
```

## Conventions

- Keep `spec/SPEC.md` the single source of truth.
- Shell scripts target both GNU and BSD/macOS.
- Validate and sanitize any user-supplied input that reaches the filesystem.

## PRs

Small, focused PRs with a clear description. Update `CHANGELOG.md` under
`Unreleased`.
