---
name: lodestar-run
description: Drive the current Lodestar stage — author/advance this stage's artifacts, then gate. Use after lodestar-new, when the user says "continue"/"next"/"work the project", or to resume a project. Stage-aware: it reads PROJECT.md, does the next unit of work for the current stage using the templates and conventions, and hands off to lodestar-gate at the lifecycle boundary.
---

# Lodestar stage driver

Moves a project forward **one stage at a time**: do the stage's work, then gate.
Within a stage you may proceed continuously; at the lifecycle gate you stop and
let `lodestar-gate` get the user's confirmation.

## Step 1 — Orient (always first)

- Read `PROJECT.md`: `stage`, `mode`, `tracker`, and the **North Star** (keep it in
  view; if work conflicts with it, surface that — don't proceed silently).
- Read `.lodestar/SPEC.md` §5 for the **current stage's** rules + DoD.
- Scan the relevant `docs/` folder to see what already exists and what's next.

## Step 2 — Do the next unit of work for this stage

Use the matching skeleton in `.lodestar/templates/` and write to the correct folder
with proper frontmatter + `parent`. Per stage:

- **discovery** — walk the sub-steps in order: `00-business-strategy → 01-product-
  strategy → 02-product-plan → 03-prd → 04-user-stories` (stories grouped by business
  domain). Advance a sub-step only when its DoD is met.
- **design** — start with `tech/context-map.md`, then tech specs per the build
  conventions (name use-cases, ports, contracts). One ADR per hard decision. When you
  reach the **UX/UI design** work (`design/` — screens, flows, design system),
  **invoke the `lodestar-design` skill** to produce `design/design-system.md` (M3
  tokens) then the per-screen UX specs (`.lodestar/conventions/design-system.md`);
  resume here for any remaining tech/ADR work afterward.
- **build** — create `TASK-NNN` files (`parent: [US]`), implement following
  `.lodestar/conventions/{server,frontend}.md`, write tests (mock external IO). If
  `tracker: linear`, mirror tasks per `.lodestar/conventions/task-tracking.md`.
- **operate** — metrics/runbooks/incidents; feed learnings back toward discovery.

### How to work (every stage)

- **Ask one question at a time**; offer **≥2 alternatives** (one minimal, one ideal)
  for non-trivial choices. Don't batch questions.
- **Classify each decision** (§4.4): resolve *Mechanical* silently; decide *Taste*
  and note it; **escalate *User-Challenge*** — present options, ask, and
  `log_decision` it (it blocks the gate until resolved).
- Tag claims `[assumption]` / `[validated]`; patch docs, don't rewrite; append to
  Decision Logs.
- No sycophancy — state a position and what would change it.

## Step 3 — When the stage's DoD is met

Summarize what was produced, then invoke **`lodestar-gate`** to verify the gate and
get the user's confirmation to advance. Do **not** change `stage:` yourself — that's
the gate's job.

## Step 4 — Loop

After the gate advances the stage, you may continue with `lodestar-run` for the new
stage (ask the user whether to keep going or pause). This repeats through
`discovery → design → build → operate`, and `operate` learnings re-enter at
`discovery`.

> Model-agnostic note: this skill just operationalizes `.lodestar/SPEC.md` §7. An
> agent without skills follows that protocol directly.
