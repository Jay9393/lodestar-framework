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
For teams who want a board/assignees/notifications. The dividing line:

> **Durable knowledge → repo. People/process state → the tracker.**

#### What lives where

| Lives in the **repo** (canonical) | Lives in **Linear** (mirror) |
|---|---|
| Planning & design: BIZ / PS / PLAN / PRD / US / specs / ADR | — (never) |
| TASK **content**: scope, **implementation design/notes**, which ACs it verifies, links | A thin issue: summary + links back to the TASK file / US / PR |
| Decision logs, traceability | Assignee, board status, cycle/sprint, estimate, comments |

**Implementation design stays in the repo TASK file** — not in the Linear issue
body. Linear body is not version-controlled, not readable by an unauthenticated
agent, and duplicating design there creates drift. The issue points *to* the repo.

#### Sync rules

1. **The repo TASK file is created first and stays canonical** for all content.
2. **Content syncs one-way: repo → Linear** (title, summary, links). **Status may
   sync back Linear → repo** — humans drive the card day-to-day; an agent reconciles
   the card's status into the file's `status` so the repo remains the record.
3. **The Lodestar ID is canonical.** Put `TASK-NNN` in the Linear issue title; store
   the back-link in the file: `tracker_ref: <linear-issue-id>`.
4. **Planning artifacts never go to Linear.** Only the TASK execution layer (and
   optionally operate-stage incidents) may be mirrored.
5. The integration is **optional and pluggable** — a project with no Linear access
   still works fully on `files`.

## Reviewer checklist

- [ ] Every TASK traces to a US (`parent`), with a current `status`.
- [ ] No planning artifact lives only in an external tracker.
- [ ] If `tracker: linear`, each mirrored task has `tracker_ref` and the file is canonical.
