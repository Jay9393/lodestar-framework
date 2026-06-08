<div align="center">

# ⭐ Lodestar

**Repo-native planning & enforcement framework for AI coding agents.**

*Keep Claude, Codex, Cursor, Gemini, and other agents aligned with your product strategy — from idea to implementation — with no drift and consistent quality across models.*

</div>

---

## The problem

Coding agents are powerful but inconsistent. Two things go wrong as a project
grows:

1. **Quality varies by model and by session.** Swap the model, or just let the
   context get long, and the rigor changes.
2. **The product drifts from its top-level goal.** Each agent step optimizes
   locally. Nobody holds the north star. Six weeks later you've built something
   coherent — and wrong.

## The idea

Lodestar is a framework — files in your repo, plus an optional MCP server — that
**any** agent (Claude, Codex, Gemini, Cursor, Hermes, …) follows. It does three
things:

- 📐 **Structures the lifecycle** into `discovery → design → build → operate`,
  where the stage *is* the directory.
- 🧭 **Pins the north star** and re-injects it at every stage, then continuously
  checks new work for alignment — this is the anti-drift core.
- 🔗 **Traces everything upward**: code → task → user story → PRD → strategy →
  business goal.

## How it stays model-agnostic

A single canonical spec ([`spec/SPEC.md`](spec/SPEC.md)) is referenced by thin
entrypoint files, one per agent convention:

| Agent | Reads |
|---|---|
| Claude Code | `CLAUDE.md` (imports `AGENTS.md`) |
| Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules/lodestar.mdc` |

One source of truth, N entrypoints. Any agent you open the repo with gets the
same rules.

## Enforcement is a ladder

| Layer | Mechanism | Strength | Portability |
|---|---|---|---|
| **L1** | Context files | advisory | all agents |
| **L2** | Scaffold script / skills | medium | per-agent |
| **L3** | Hooks (block on unmet gate) | strong | per-agent |
| **L4** | **`lodestar-mcp` server** | strong | all MCP agents |

Pure files give you portability but only *advisory* strength. The
[`lodestar-mcp`](mcp-server/) server makes gates and north-star checks
**enforceable across any MCP-capable agent** — strong *and* portable.

## Quickstart

Scaffold the framework into a project:

```bash
./scripts/scaffold.sh /path/to/your/project --name myproject --mode lite
```

This creates the `docs/` lifecycle tree, a `PROJECT.md` manifest, and the agent
entrypoint files. Then just start working — any agent that opens the repo reads
the framework.

(Optional) wire up enforcement:

```bash
# MCP server (model-agnostic, strong)
cd mcp-server && npm install && npm run build

# or Claude Code hooks (see hooks/README.md)
```

## Repository layout

```text
lodestar-framework/
├── spec/SPEC.md          # canonical framework definition (read this)
│   └── conventions/      # server.md + frontend.md — design/impl rules for build
├── # (conventions are vendored into each project at .lodestar/conventions/)
├── templates/            # entrypoints + docs-tree + PROJECT.md + artifacts/, copied by scaffold
│   └── artifacts/        # BIZ/PS/PLAN/PRD/US/TASK/ADR doc templates
├── scripts/scaffold.sh   # creates the framework in a target project
├── skills/               # agent skills (e.g. lodestar-new) to create projects
├── mcp-server/           # lodestar-mcp: enforcement as MCP tools (L4)
├── hooks/                # Claude Code hook examples (L3)
└── examples/             # worked example projects
```

## What makes it different

1. **Repo-native** — no SaaS. Files and folders are the source of truth; it lives in git.
2. **Model-agnostic** — one spec, N entrypoints (`AGENTS`/`CLAUDE`/`GEMINI`/Cursor) + an MCP server.
3. **Anti-drift** — north star + traceability IDs + stage gates.

## Current limitations (v0.1.0)

Being honest about the early state:

- **Gate auto-checks are file-existence heuristics** — they confirm an artifact
  exists, not that its content is complete. Manual checklist items cover the rest.
- **Alignment judgment is done by the calling agent, not a server-side LLM.**
  `check_alignment` returns the north star + artifact for the agent to reason over.
- **Hooks are Claude Code-specific examples** (L3). For model-agnostic enforcement
  use the MCP server (L4).

## Status

`v0.1.0` — early draft. Spec, scaffold, and artifact templates are usable today;
the MCP server builds and runs as a working skeleton. Feedback and contributions
welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
