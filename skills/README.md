# Lodestar Skills

Agent skills for working *with* the framework (as opposed to the per-project
`.lodestar/` files that govern work *inside* a project).

| Skill | Purpose |
|---|---|
| [`lodestar-new`](lodestar-new/SKILL.md) | Create a new project scaffolded with Lodestar. Asks where to create it (current dir / under the framework / a custom path), the name, and the gate mode, then runs `scripts/scaffold.sh`. |

## Install (Claude Code)

These are **workspace-level** skills — they create projects, so they live where you
start projects, not inside each project.

```bash
# user-level (available everywhere)
mkdir -p ~/.claude/skills
cp -R skills/lodestar-new ~/.claude/skills/

# or project/workspace-level
mkdir -p <workspace>/.claude/skills
cp -R skills/lodestar-new <workspace>/.claude/skills/
```

Optionally set `LODESTAR_HOME` to your `lodestar-framework` checkout so the skill
can find `scaffold.sh` without asking:

```bash
export LODESTAR_HOME=/path/to/lodestar-framework
```

## Other agents

A `SKILL.md` is just a prompt. Agents without Claude Code's skill system can read
these instructions directly, or simply call `scripts/scaffold.sh <target> --name … --mode …`.
