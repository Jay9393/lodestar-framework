# Examples

Worked examples of projects scaffolded with Lodestar.

## Try the scaffold

From the repo root:

```bash
./scripts/scaffold.sh /tmp/demo-app --name demo-app --mode lite
tree /tmp/demo-app -a -L 3   # or: find /tmp/demo-app
```

You'll get the full `docs/` lifecycle tree, a `PROJECT.md` manifest, the agent
entrypoints (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/lodestar.mdc`),
and a vendored `.lodestar/SPEC.md`.

Then open `/tmp/demo-app` with any agent and start at
`docs/1-discovery/00-business-strategy/`. The agent will read `PROJECT.md` and the
spec, and work the lifecycle top-down.

> A fully fleshed-out example project will be added here as the framework
> stabilizes.
