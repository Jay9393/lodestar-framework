# Agent Instructions — {{PROJECT_NAME}}

This project follows the **Lodestar framework**. Before doing anything:

1. Read **`PROJECT.md`** at the repo root — it tells you the current lifecycle
   stage, the mode (strict/lite), and the **north star** (the top-level goal you
   must not drift from).
2. Read **`.lodestar/SPEC.md`** — the full framework (lifecycle, directory
   rules, per-stage guidelines, traceability, gates).

## Non-negotiables

- Keep the **north star** in view. If a request conflicts with it, surface the
  conflict instead of silently proceeding.
- Write outputs to the correct stage folder under `docs/` with frontmatter and a
  `parent:` link to the upstream artifact.
- **Don't skip stages silently.** Moving ahead (e.g. building without a PRD) is
  allowed only with a logged reason in `docs/99-decision-research/gate-skips/`
  and an entry in `PROJECT.md`.
- Every implementation task traces to a User Story; commit/PR messages include
  the `TASK-NNN` id.

The lifecycle: `1-discovery → 2-design → 3-build → 4-operate`. The stage is the
directory. Full rules in `.lodestar/SPEC.md`.
