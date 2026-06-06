# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/); this project aims to follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
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
