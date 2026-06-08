---
name: lodestar-new
description: Create a new project scaffolded with the Lodestar framework. Use when the user wants to start a new product/project under the Lodestar workflow ("new lodestar project", "scaffold a project", "start a new product"). Asks where to create it (current dir / under lodestar-framework / a custom path), the name, and the gate mode, then runs the scaffold.
---

# Create a new Lodestar project

Goal: scaffold a brand-new project that follows the Lodestar framework, **letting
the user choose where it lives**.

## Step 1 — Locate the framework

Find the Lodestar framework root (the directory containing `scripts/scaffold.sh`).
Resolve in this order, stopping at the first hit:

1. `$LODESTAR_HOME` environment variable, if set.
2. A `lodestar-framework/` directory in or above the current working directory.
3. Otherwise, **ask the user** for the path to their `lodestar-framework` checkout.

Call this `FRAMEWORK`. Confirm `FRAMEWORK/scripts/scaffold.sh` exists before continuing.

## Step 2 — Get the project name

If the user already gave a name, use it. Otherwise ask for one. Normalize to a
filesystem-safe slug for the directory (kebab-case); keep their original wording
as the display name passed to `--name`.

## Step 3 — Ask WHERE to create it

Use AskUserQuestion with these options (header: "Location"):

- **Current directory** *(recommended)* — create `./<name>` in the current working
  directory. Best when you run this from your workspace root (sibling layout).
- **Under lodestar-framework** — create `<FRAMEWORK>/<name>` (nested). Fine for
  experiments/monorepo; mixes the tool repo with output, so not preferred for shipping.
- **Custom path** — ask the user for a directory; create `<that path>/<name>`.

(The user can always pick "Other" to type an exact path.)

Resolve the final absolute target path and **show it to the user for confirmation**
before writing anything. If the target already exists and is non-empty, stop and ask.

## Step 4 — Ask the gate mode

Use AskUserQuestion (header: "Gate mode"):

- **lite** *(recommended)* — gates warn; skipping a stage needs a logged reason.
- **strict** — gates hard-block until satisfied or explicitly waived.

## Step 5 — Scaffold

Run:

```bash
"$FRAMEWORK/scripts/scaffold.sh" "<TARGET>" --name "<display name>" --mode "<mode>"
```

## Step 6 — Report, then offer to start discovery

Tell the user the project was created:

- It starts in `stage: discovery`; the framework spec is vendored at
  `.lodestar/SPEC.md`, templates at `.lodestar/templates/`, conventions at
  `.lodestar/conventions/`.
- Optionally connect the `lodestar-mcp` server (set `LODESTAR_PROJECT_ROOT` to the
  new project) for stage/gate/north-star enforcement.

Then **ask the user: "Start discovery now?"**

- **Yes** → switch to working *inside the new project* (treat it as the working
  directory) and invoke **`lodestar-run`**, which begins the first sub-step
  (`00-business-strategy`). The workflow then drives itself stage by stage, pausing
  at each lifecycle gate (`lodestar-gate`) for confirmation.
- **No** → stop; the user can run `lodestar-run` whenever they're ready.

> This skill is a thin wrapper. The underlying engine is `scripts/scaffold.sh`,
> which any agent or a human can run directly — the workflow is model-agnostic.
