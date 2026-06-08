# Task-Tracking Conventions

> How work is tracked in a Lodestar project. **The repository is the single source
> of truth.** An external tracker (e.g. Linear) is allowed only as a one-way
> *projection* of the build/operate execution layer — never the master.

## The rule

- **Filesystem is master.** Every work item is a markdown file in `docs/`, tracked
  in git, traced by frontmatter ID. This is non-negotiable for the planning
  artifacts (BIZ / PS / PLAN / PRD / US / specs / ADR) — they live in the repo with
  the code and never move to a SaaS.
- **No second source of truth.** If an external tracker is used, the repo file
  stays canonical; the tracker mirrors it. When they disagree, the file wins.

## Work items and their states

| Item | Lives in | Status values (frontmatter) |
|---|---|---|
| Planning artifacts (BIZ/PS/PLAN/PRD/US) | `docs/1-discovery/…` | `draft → active → superseded` (US: `draft → ready → in-progress → done`) |
| Specs / ADRs | `docs/2-design/…` | `draft → proposed → accepted → superseded` |
| **TASK** (the unit of execution) | `docs/3-build/tasks/TASK-NNN-*.md` | `todo → in-progress → done` (+ `blocked`, `cancelled`) |

Rules:
- A TASK always has `parent: [US-NNN]` — no orphan tasks.
- Update `status` in place as work moves; bump `updated`. Don't delete a finished
  task — `done` is a state, and git keeps the history.
- Commit/PR messages carry the `TASK-NNN` id so code ↔ task ↔ US ↔ PRD all link.

## The "board" (without a SaaS)

- The current pipeline is the **Traceability Index** in `PROJECT.md`
  (`BIZ-001 → … → TASK-045`).
- "What's in progress / todo" = TASK files filtered by `status`. An agent (or a future
  `lodestar doctor` / MCP `list_tasks`) can scan `docs/3-build/tasks/` to render this.

## Choosing a tracker — `tracker` in `PROJECT.md`

```yaml
tracker: files   # files (default) | linear
```

### `tracker: files` (default)
Nothing external. The rules above are the whole system.

### `tracker: linear` (optional projection)
For teams who want a board/assignees/notifications. Constraints that keep it from
becoming a second source of truth:

1. **The repo TASK file is created first and stays canonical.** The Linear issue is
   a mirror of it.
2. **One-way sync: repo → Linear.** Status/title/body flow from the file to the issue.
   (If Linear edits flow back, treat them as a *proposal* an agent reconciles into the
   file — the file still wins.)
3. **The Lodestar ID is canonical.** Put `TASK-NNN` in the Linear issue title; store
   the back-link in the file: `tracker_ref: <linear-issue-id>`.
4. **Planning artifacts never move to Linear.** Only the TASK execution layer (and
   optionally operate-stage incidents) may be mirrored.
5. The integration is **optional and pluggable** — a project with no Linear access
   still works fully on `files`.

## Reviewer checklist

- [ ] Every TASK traces to a US (`parent`), with a current `status`.
- [ ] No planning artifact lives only in an external tracker.
- [ ] If `tracker: linear`, each mirrored task has `tracker_ref` and the file is canonical.
