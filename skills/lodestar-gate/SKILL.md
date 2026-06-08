---
name: lodestar-gate
description: Run a Lodestar stage-transition gate. Use when a stage looks done, when the user asks to advance/move to the next stage, or when lodestar-run finishes a stage. Checks the gate, shows the user what's met/missing, asks to confirm or skip-with-reason, files the gate report, and advances PROJECT.md to the next stage.
---

# Lodestar stage gate

Controls the transition between lifecycle stages. **Stop and ask the user before
advancing** — a transition is a present-and-ask decision, never silent.

## Step 1 — Load state

- Read `PROJECT.md` (`stage`, `mode`, `tracker`).
- Determine the current stage and its next stage:
  `discovery → design → build → operate → (done)`.

## Step 2 — Check the gate

- If the `lodestar-mcp` server is connected, call **`check_gate`** for the current
  stage. Use its `items` (pass/fail/manual), `verdict`, and `userChallengeOpen`.
- Otherwise, evaluate the current stage's DoD checklist from `.lodestar/SPEC.md`
  §5 by inspecting the `docs/` tree yourself.

## Step 3 — Report to the user

Show a concise summary: each checklist item (✅ pass / ❌ fail / ◻️ manual), any
unresolved **User-Challenge** decisions, and the verdict.

## Step 4 — Decide

- **Unresolved User-Challenge** → **do not advance** in any mode. Present the
  options and ask the user to decide; once decided, re-log it resolved
  (`log_decision … resolved=true`), then re-check.
- **Failed auto items**:
  - `mode: strict` → blocked. List what to finish; offer to do it now. Don't advance.
  - `mode: lite` → you *may* advance only with the user's explicit OK. If they
    accept the gap, record it with **`log_decision`** (a gate-skip) before advancing.
- **All clear** → confirm any `manual` items with the user.

Always **ask the user to confirm advancing** before changing the stage. Offer
≥2 paths when relevant (e.g. "finish the gap now" vs "skip with a logged reason").

## Step 5 — Advance (on confirmation)

1. Append a gate report block to `PROJECT.md` under `## Gate Reports`:
   ```
   ### GATE: <from>→<to>
   - status: passed | skipped
   - date: <YYYY-MM-DD>
   - unresolved-user-challenges: none
   - checklist: <ids> — all met | skipped: <ids> (see gate-skips)
   ```
2. Update `stage:` to the next stage and bump `updated:` in `PROJECT.md`.
3. Update the Traceability Index if new artifacts were produced.

## Step 6 — Hand off

Offer to continue into the next stage with **`lodestar-run`** (or stop here if the
user prefers). If the stage was `operate`, the project is in steady continuous-
improvement mode — new work re-enters at `discovery` per the lifecycle loop.
