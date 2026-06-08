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
- When writing code, follow `.lodestar/conventions/server.md` (server) and
  `.lodestar/conventions/frontend.md` (frontend): logic in use-cases, IO behind
  ports/adapters, repository pattern for DB/cache, schema only via migrations,
  and tests for every use-case/API with external calls mocked.
- For UX/UI design, follow `.lodestar/conventions/design-system.md` — base design
  system is **Material 3**: produce `docs/2-design/design/design-system.md` (M3
  tokens) then screen specs referencing named M3 components + tokens (no raw hex/px),
  covering loading/empty/error/success/denied states and the a11y baseline.

## Conduct

- **Classify every decision** (see `.lodestar/SPEC.md` §4.4): resolve *Mechanical*
  ones silently; decide *Taste* ones and surface them at the gate; **never
  auto-decide a *User-Challenge*** (scope/cost/north-star/hard-to-reverse) — present
  options and ask. An unresolved User-Challenge blocks the gate in any mode.
- **Ask one question at a time**, and offer **≥2 alternatives** (one minimal, one
  ideal) before locking a non-trivial choice.
- **No sycophancy.** State a position and what evidence would change it; don't open
  with "great idea". If models agree against the user, still present and ask.
- **Living docs:** patch sections, don't rewrite; append to Decision Logs; supersede,
  don't delete.

The lifecycle: `1-discovery → 2-design → 3-build → 4-operate`. The stage is the
directory. Full rules in `.lodestar/SPEC.md`.
