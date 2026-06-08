# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/); this project aims to follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Stage orchestration skills: `lodestar-run` (drives the current stage's work, one
  question at a time, then gates) and `lodestar-gate` (verifies the gate, asks the
  user to confirm/skip, files the gate report, advances `PROJECT.md`). `lodestar-new`
  now offers to start discovery immediately, so scaffold → discovery → … flows
  stage by stage, pausing at each lifecycle gate for confirmation.
- Task-tracking convention (`spec/conventions/task-tracking.md`) + `tracker` field
  in `PROJECT.md`: the repo filesystem is the single source of truth for work items;
  an external tracker (`tracker: linear`) is an optional one-way mirror of the TASK
  layer only (file always wins). Planning artifacts never move to a SaaS.
- `lodestar-new` agent skill (`skills/lodestar-new/SKILL.md`): create a new project
  via an agent, asking where to put it (current dir / under the framework / custom
  path), the name, and the gate mode, then running `scaffold.sh`. Projects are
  independent siblings; the framework is the tool.
- Build conventions: `spec/conventions/server.md` and `frontend.md` (clean/hexagonal —
  use-cases, ports/adapters, repository pattern, migration rules, testing with mocked
  IO, plus error handling / validation / config / observability). Vendored to
  `.lodestar/conventions/`; referenced from SPEC build/design stages and AGENTS.md.
- Methodology-grounded artifact templates (BIZ/PS/PLAN/PRD/US/TASK/ADR) rebuilt
  from Lean Canvas/JTDB, Cagan + North Star + Shape Up, lean-PRD, Job Story +
  INVEST + Gherkin, and Google-doc/C4/DDD/MADR research.
- User stories use a **Job Story** spine ("When … I want … so I can …") with the
  role in frontmatter; Connextra kept for role-essential stories.
- **Decision classification** (Mechanical / Taste / User-Challenge); `log_decision`
  records the class; an unresolved User-Challenge hard-blocks the gate in any mode.
- **Gate report marker**: `check_gate` requires a `### GATE: from→to` block in
  PROJECT.md before a stage is considered passed.
- Agent-conduct rules (one question at a time, ≥2 alternatives, no sycophancy)
  in the SPEC and the AGENTS.md entrypoint.

### Changed
- Lean frontmatter standard (id/status/parent/updated + domain/role/children/supersedes
  where they apply); explicit epistemic tags and living-doc/decision-log conventions.

### Added (earlier)
- Initial framework: canonical `spec/SPEC.md` (lifecycle, traceability, gates,
  per-stage agent guidelines).
- `scripts/scaffold.sh` to install the framework into any project.
- Model-agnostic entrypoints: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
  `.cursor/rules/lodestar.mdc`.
- `lodestar-mcp` server (L4 enforcement): `get_stage`, `get_north_star`,
  `check_gate`, `check_alignment`, `log_decision`.
- Claude Code hook example (L3).
- User stories grouped by **business domain**; `2-design` as a 1:N tree with a
  `shared/` basket and `context-map.md`.
- Artifact templates: `BIZ`/`PS`/`PLAN`/`PRD`/`US`/`TASK`/`ADR`.

### Fixed
- `readSection` regex used JS-invalid `\Z`; the last section is now captured.
- `scaffold.sh` placeholder substitution now escapes sed-special characters
  (`/`, `&`, `\`) in the project name.
- `check_alignment` rejects `artifact_path` values that escape the project root.
- `log_decision` validates `date` and `slug` to prevent filename injection.
- Gate checks exclude seeded folder READMEs so they aren't trivially satisfied.
