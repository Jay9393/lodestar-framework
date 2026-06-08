# Lodestar Skills

Agent skills for working *with* the framework (as opposed to the per-project
`.lodestar/` files that govern work *inside* a project).

| Skill | Purpose |
|---|---|
| [`lodestar-new`](lodestar-new/SKILL.md) | Create a new project scaffolded with Lodestar. Asks where to create it (current dir / under the framework / a custom path), name, and gate mode; runs `scripts/scaffold.sh`; then offers to start discovery. |
| [`lodestar-run`](lodestar-run/SKILL.md) | Stage driver. Reads `PROJECT.md`, does the current stage's work (templates + conventions, one question at a time), and hands off to `lodestar-gate` at the lifecycle boundary. The everyday "continue the project" command. |
| [`lodestar-gate`](lodestar-gate/SKILL.md) | Stage-transition controller. Runs `check_gate`, shows what's met/missing + open User-Challenges, asks the user to confirm or skip-with-reason, files the gate report, and advances `PROJECT.md` to the next stage. |

Flow: `lodestar-new` → (start discovery?) → `lodestar-run` ⇄ `lodestar-gate` per
stage, looping `discovery → design → build → operate`.

## Install (Claude Code)

These are **workspace-level** skills — they create/drive projects, so they live
where you start projects, not inside each project.

```bash
# user-level (available everywhere)
mkdir -p ~/.claude/skills
cp -R skills/lodestar-new skills/lodestar-run skills/lodestar-gate ~/.claude/skills/

# or project/workspace-level
mkdir -p <workspace>/.claude/skills
cp -R skills/lodestar-new skills/lodestar-run skills/lodestar-gate <workspace>/.claude/skills/
```

Optionally set `LODESTAR_HOME` to your `lodestar-framework` checkout so the skill
can find `scaffold.sh` without asking:

```bash
export LODESTAR_HOME=/path/to/lodestar-framework
```

## Other agents

A `SKILL.md` is just a prompt. Agents without Claude Code's skill system can read
these instructions directly, or simply call `scripts/scaffold.sh <target> --name … --mode …`.
