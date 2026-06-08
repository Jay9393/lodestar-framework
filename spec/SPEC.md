# Lodestar Framework — Specification

> **Canonical source of truth.** All entrypoint files (`AGENTS.md`, `CLAUDE.md`,
> `GEMINI.md`, `.cursor/rules/lodestar.mdc`) point here. Edit the framework here,
> not in the entrypoints.

Version: 0.1.0 (draft)

---

## 1. Why Lodestar exists

Coding agents produce inconsistent quality, and as a product is developed the
work tends to **drift away from its top-level goals**. Each agent invocation
optimizes locally; nobody holds the north star.

Lodestar is a **structured, model-agnostic framework** that any agent (Claude,
Codex, Gemini, Cursor, Hermes, …) follows so that:

1. **Consistency across models** — every agent receives the same stage context,
   the same gates, and the same definition of done, regardless of which model
   is driving.
2. **No goal drift** — the top-level goal (the *lodestar*) is pinned and
   re-injected at every stage; downstream work is continuously checked for
   alignment with it.
3. **Traceability** — every line of code traces up through a task → user story →
   PRD → strategy → business goal.

## 2. Core principles

1. **The stage is the directory.** A project's lifecycle position is visible
   from its folder layout alone.
2. **Everything traces upward.** Code/Task → User Story → PRD → Product Plan →
   Product Strategy → Business Strategy. Linked by IDs.
3. **Gates ask, they don't (always) block.** Skipping a stage is allowed, but
   only with a recorded reason. Strict mode hard-blocks; lite mode warns.

---

## 3. Lifecycle & directory structure

Four lifecycle phases. Discovery contains the six planning sub-steps.

```text
<project>/
├── PROJECT.md                  # manifest: current stage, mode, traceability index
├── AGENTS.md / CLAUDE.md / ... # thin entrypoints → this SPEC
├── docs/
│   ├── README.md               # document map = source-of-truth chain
│   ├── 1-discovery/            # ── PLANNING ──
│   │   ├── 00-business-strategy/
│   │   ├── 01-product-strategy/
│   │   ├── 02-product-plan/
│   │   ├── 03-prd/
│   │   └── 04-user-stories/    # grouped by BUSINESS domain
│   │       ├── README.md       #   domain map (business domain ↔ PRD)
│   │       └── <domain>/       #   e.g. ordering/, catalog/ — US-NNN-*.md inside
│   ├── 2-design/               # ── DESIGN ──
│   │   ├── tech/               # 1:N tree: business domain → technical context(s)
│   │   │   ├── context-map.md  #   business domain ↔ tech context mapping
│   │   │   ├── <domain>/       #   <tech-context>/ nested under its owning domain
│   │   │   └── shared/         #   generic contexts (auth, notification, …)
│   │   ├── design/             # screens, flows, UX, design spec
│   │   └── adr/                # Architecture Decision Records
│   ├── 3-build/                # ── BUILD ──
│   │   └── tasks/              # implementation notes per TASK
│   ├── 4-operate/              # ── OPERATE ──
│   │   ├── runbooks/
│   │   ├── metrics/            # event schema, dashboard definitions
│   │   └── incidents/
│   └── 99-decision-research/   # cross-cutting
│       ├── superseded/         # retired docs (kept for context)
│       ├── reviews/
│       └── gate-skips/         # logged reasons for skipping a gate
└── src/ ...                    # code (project-type specific)
```

Phase → sub-step map:

| Lifecycle phase | Folder | Sub-steps |
|---|---|---|
| Planning (기획) | `1-discovery/` | 00 business → 01 strategy → 02 plan → 03 PRD → 04 user stories |
| Design (설계)   | `2-design/`   | tech / design / adr |
| Build (구현)    | `3-build/`    | tasks + code in `src/` |
| Operate (운영)  | `4-operate/`  | runbooks / metrics / incidents |

---

## 4. Conventions

### 4.1 Manifest — `PROJECT.md`

Every project root has exactly one. **Agents read this first**, before any work.

```yaml
---
project: <name>
stage: discovery            # discovery | design | build | operate
mode: strict | lite         # gate strictness (chosen at scaffold time)
updated: 2026-06-06
---
## North Star
<one paragraph: the top-level goal this project must not drift from.
Derived from 00-business-strategy + 01-product-strategy.>

## Traceability Index
- BIZ-001 → PS-001 → PLAN-001 → PRD-003 → US-012 → TASK-045

## Active gate-skips
- 2026-06-04: built US-009 without a PRD
  (reason: docs/99-decision-research/gate-skips/2026-06-04-us009.md)
```

### 4.2 Traceability IDs + frontmatter

Every document starts with **lean** frontmatter linking to its parent. Keep it
to these fields — the folder already encodes the stage:

```yaml
---
id: PRD-003
status: draft | active | superseded
parent: [PLAN-001]          # upstream artifact ID(s)
updated: 2026-06-08
# optional, where they apply:
# domain: <business-domain> # User Stories (structure axis)
# role: <actor>            # User Stories (role/permission axis)
# children: [US-012]       # PRDs (downstream links)
# supersedes: PRD-001      # on a split/merge
---
```

ID prefixes: `BIZ` / `PS` / `PLAN` / `PRD` / `US` / `TASK` / `ADR`, each + a
3-digit number (e.g. `PRD-003`). Build-phase commits/PRs include the `TASK-NNN`
in the message so the chain reaches the code.

User Story docs carry a second axis: `domain: <business-domain>` (in addition to
`parent: [PRD-NNN]`). The PRD is the **traceability** axis; the domain is the
**structure** axis. They are many-to-many, so both are kept.

Ready-to-use skeletons for every artifact live in `templates/artifacts/`
(`BIZ`/`PS`/`PLAN`/`PRD`/`US`/`TASK`/`ADR`) and are vendored into each project at
`.lodestar/templates/`.

**Epistemic tags.** In strategy/discovery docs, tag every claim `[assumption]`,
`[validated: source/date]`, or `[hypothesis: testing via …]`. Prefer `[unknown]`
over an invented number. This makes "what still needs proving" machine-greppable.

**Living docs.** Update by patching sections — never wholesale-rewrite. Append to
a doc's Decision Log (PRD/ADR/strategy docs) rather than editing past entries; bump
`updated`. Supersede, don't delete: move retired docs to `99-decision-research/`.

### 4.3 Gates (advisory by default)

Before entering the next stage, run the gate checklist (see each stage's DoD
below). On an unmet item:

- **lite mode** → warn, then allow with a logged reason in
  `99-decision-research/gate-skips/` and an entry in `PROJECT.md`.
- **strict mode** → block the next-stage action until the item is satisfied or
  explicitly waived.

**Gate report (machine-checkable).** When you complete a stage, append a parseable
block to `PROJECT.md` under `## Gate Reports` *before* transitioning. `check_gate`
verifies this block exists — a gate isn't "passed" until the report is filed:

```text
### GATE: discovery→design
- status: passed | skipped
- date: 2026-06-08
- unresolved-user-challenges: none
- checklist: biz, strategy, plan, prd, us, domain-map — all met
```

### 4.4 Decision classification

Every decision an agent faces is one of three classes. This governs what the
agent may resolve on its own versus escalate:

| Class | Meaning | Agent behavior |
|---|---|---|
| **Mechanical** | One obviously-correct answer (naming, formatting, an unambiguous fix) | Resolve silently. |
| **Taste** | A defensible default exists but reasonable people differ | Decide, then surface the choice at the next gate. |
| **User-Challenge** | Changes scope, cost, the north star, or is hard to reverse | **Never auto-decide.** Present options and ask the human. |

Record Taste and User-Challenge decisions with `log_decision` (it stores the
class). **An unresolved User-Challenge blocks the gate in any mode** — user
sovereignty is not waivable by `mode`. Present and ask; never act around it.

### 4.5 Agent conduct

- **Ask one question at a time.** Do not batch decision questions; resolve, then ask the next.
- **Offer ≥2 alternatives** (at least one minimal, one ideal) before locking a non-trivial choice.
- **No sycophancy.** State a position and the evidence that would change it; don't
  open with "great idea". When models agree against the user, still present and ask.

---

## 5. Per-stage agent guidelines

Each stage defines **[output location · agent rules · definition of done (DoD)]**.

### 5.1 Discovery → `1-discovery/`

#### 00 · Business Strategy {#s00}
- **Output:** `docs/1-discovery/00-business-strategy/`
- **Rules:** define market, customer, problem, opportunity, business goal. Tag
  every claim `[assumption]` or `[validated]`. Numeric goals must be measurable.
- **DoD → 01:** market, customer, problem, goal all defined in one document.

#### 01 · Product Strategy {#s01}
- **Output:** `docs/1-discovery/01-product-strategy/`
- **Rules:** fix the core problem in one sentence; define target segment,
  positioning, success metrics. If it contradicts 00, stop and report.
- **DoD → 02:** core problem, target, positioning, success metrics fixed.

#### 02 · Product Plan {#s02}
> Also called a **Product Brief** in lightweight projects — same artifact, same folder.
- **Output:** `docs/1-discovery/02-product-plan/`
- **Rules:** document direction, scope, feature candidates, priority (P0/P1/P2),
  launch hypotheses. **Do not jump to implementation tasks here.**
- **DoD → 03:** scope, priority, launch hypotheses fixed.

#### 03 · PRD {#s03}
- **Output:** `docs/1-discovery/03-prd/PRD-NNN-*.md` (one problem per file)
- **Rules:** a PRD is a **problem-solving unit**, not a feature list. Split when
  the user problem, policy, release unit, key state, or data lifecycle differs.
  Required sections (8): user problem · scope · policy · glossary · screens/flows
  · edge cases · permissions · **acceptance criteria**. ACs must be verifiable
  (subject + condition + expected result).
- **DoD → 04:** all 8 sections present, ACs verifiable.

#### 04 · User Stories {#s04}
- **Output:** `docs/1-discovery/04-user-stories/<business-domain>/US-NNN-*.md` —
  one story per file, grouped into **business-domain** folders. Frontmatter:
  `parent: [PRD-NNN]` + `domain: <business-domain>`. A rough domain map lives in
  `04-user-stories/README.md` (domain ↔ PRD).
  Shared/common service layers (auth, notification, …) are **not** business
  domains and get no US folder; they surface only in design (`tech/shared/`).
- **Rules:** split when user goal, action, state transition, role/permission,
  success/failure context, or testable unit differs (the INVEST "Small" rule: if a
  story needs > ~3 Given/When/Then scenarios or spans two of the above, split it).
  Write the story as a **Job Story** — "When `<situation>`, I want `<motivation>`,
  so I can `<outcome>`" — because the *When* clause maps 1:1 onto an acceptance
  criterion's `Given`, so the story compiles straight into a test. Keep the role
  in frontmatter (`role:`). Use the Connextra form ("As a `<role>`…") only when the
  role distinction is the essence of the story. Domains here are *rough groupings* —
  detailed domain modeling is a design-stage task.
- **DoD → Design:** every story is a testable unit with ACs; a rough domain map exists.

### 5.2 Design → `2-design/` {#design}
- **First artifact:** `tech/context-map.md` — map each **business domain** (from
  04-user-stories) to its **technical context(s)**. Default is 1:1 or 1:N: a
  business domain *owns* its tech contexts. Contexts shared by 2+ business domains
  go under `tech/shared/` (generic: auth, notification, payment-gateway, audit, …).
  Business domain ≠ technical domain — record any divergence with a reason here.
- **Output:** `tech/<domain>/<context>/` (architecture, data model, API, NFRs),
  `tech/shared/<context>/`, `design/` (screens, flows, UX), `adr/ADR-NNN-*.md`.
- **Rules:** every spec sets `parent` to the US/PRD it serves. Design toward the
  build conventions (`.lodestar/conventions/{server,frontend}.md`) — e.g. name the
  use-cases, the ports (repositories/external clients), and the boundary contracts.
  Flag drift/gaps: (a) a US with no spec, (b) a non-`shared/` context used by 2+
  domains (ownership ambiguous), (c) a context serving no business domain
  (over-design). Framework/library choices get an ADR.
- **DoD → Build:** context map exists; every active US is covered by tech + design specs.

### 5.3 Build → `3-build/` {#build}
- **Output:** code in `src/` + `docs/3-build/tasks/TASK-NNN-*.md`, `parent: [US-NNN]`
- **Conventions (mandatory):** server code follows `.lodestar/conventions/server.md`
  and frontend code follows `.lodestar/conventions/frontend.md` — dependencies point
  inward, IO (DB/cache/external APIs) sits behind ports/adapters, business logic is
  use-cases, and use-cases + APIs have tests with external calls mocked. Deviations
  need a logged decision or an ADR.
- **Rules:** every task traces to a US via `parent`. Commit/PR messages include
  `TASK-NNN`. If implementation must diverge from spec, **stop and update the
  spec first** — code never runs ahead of spec. Tests verify the US's ACs.
- **DoD → Operate:** ACs met, tests pass (per the conventions' checklist), deployable.

### 5.4 Operate → `4-operate/` {#operate}
- **Output:** `runbooks/`, `metrics/` (event schema + dashboards), `incidents/`.
- **Rules:** implement the success metrics from 02/PRD as real event
  schema/dashboards. Postmortems go in `incidents/`. When a feature is retired,
  move its docs to `99-decision-research/superseded/` and update the manifest.
- **DoD:** metrics collecting, runbooks exist, incident process defined.

### 5.5 Cross-cutting → `99-decision-research/` {#research}
Superseded docs, reviews, gate-skip logs. Consulted only to answer *"why was this
decided?"*. To revive a superseded claim, first patch the current source-of-truth.

---

## 6. Enforcement layers

Lodestar is delivered as a ladder; pick how strong you want enforcement to be.

| Layer | Mechanism | Strength | Portability |
|---|---|---|---|
| L1 | Context files (entrypoints → this SPEC) | advisory | all agents |
| L2 | Skills / scaffold scripts | medium | per-agent |
| L3 | Hooks (block tool calls on unmet gate) | strong | per-agent (e.g. Claude Code) |
| L4 | **MCP server** (`lodestar-mcp`) | strong | all MCP-capable agents |

The MCP server exposes the framework as callable tools so enforcement is both
**model-agnostic and strong**:

- `get_stage` — current lifecycle stage + mode from `PROJECT.md`
- `get_north_star` — the pinned top-level goal (anti-drift injection)
- `check_gate` — run the next-stage checklist; also verifies the gate report block
  exists and that no unresolved **User-Challenge** decision remains (which hard-blocks)
- `check_alignment` — return north star + an artifact for the agent to judge drift
- `log_decision` — record a decision (with its class: mechanical/taste/user-challenge)
  under `99-decision-research/`

## 7. How an agent should use Lodestar

1. Read `PROJECT.md` (stage, mode, north star) **before doing anything**.
2. Read this SPEC's section for the current stage.
3. Keep the north star in view; if the requested work conflicts with it, surface
   the conflict instead of silently proceeding.
4. Write outputs to the correct stage folder with proper frontmatter + `parent`,
   starting from the matching `templates/artifacts/` skeleton.
5. Classify each decision (§4.4): resolve Mechanical silently, decide Taste and
   surface it, escalate User-Challenge to the human. Ask one question at a time.
6. Before moving to the next stage, run the gate (or `check_gate`), file the gate
   report block in `PROJECT.md`, and log any skip or notable decision.
7. Update `PROJECT.md` (stage, traceability index) when a stage completes.
