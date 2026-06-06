# 04 · User Stories — Domain Map

User stories are grouped by **business domain**, one story per file:
`<business-domain>/US-NNN-<slug>.md`.

- **frontmatter:** `parent: [PRD-NNN]` (traceability) + `domain: <name>` (structure)
- **Split when:** user goal, action, state transition, role/permission,
  success/failure context, or testable unit differs.
- Domains here are *rough groupings* derived from the PRDs; detailed domain
  modeling happens in design (`2-design/tech/`).
- Shared/common service layers (auth, notification, …) are **not** business
  domains — they appear only in design under `2-design/tech/shared/`.

## Domain ↔ PRD map

| Business domain | PRDs served | Stories |
|---|---|---|
| _e.g. ordering_ | PRD-001, PRD-003 | US-001 … |
| _e.g. catalog_  | PRD-002 | US-010 … |

**Definition of done (→ design):** every story is testable with ACs, and this
map is filled in.

Full guidelines: `../../../.lodestar/SPEC.md` → §5.1 / `#s04`.
