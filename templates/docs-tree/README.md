# {{PROJECT_NAME}} — Documentation Map

> When starting any work, read in this order: this file → the relevant stage
> README → the source-of-truth document. The framework spec is in
> `../.lodestar/SPEC.md`.

## Lifecycle (the stage is the directory)

```text
1-discovery/        Planning: 00 business → 01 strategy → 02 plan → 03 PRD → 04 user stories
  ↓
2-design/           Design: tech / design / adr
  ↓
3-build/            Build: tasks + code in src/
  ↓
4-operate/          Operate: runbooks / metrics / incidents
99-decision-research/   Reviews, superseded docs, gate-skip logs
```

## Source-of-truth chain

<!-- Link the current canonical document at each level as the project fills in. -->

1. **Business strategy** — `1-discovery/00-business-strategy/`
2. **Product strategy** — `1-discovery/01-product-strategy/`
3. **Product plan** — `1-discovery/02-product-plan/`
4. **PRD** — `1-discovery/03-prd/`
5. **User stories** — `1-discovery/04-user-stories/`
6. **Specs** — `2-design/`

## Operating rules

- Decide what to build by reading top-down: `00 → 01 → 02 → 03 → 04 → 2-design`.
- Consult `99-decision-research/` only to understand *why* a decision was made.
- To revive a superseded claim, first patch the current source-of-truth doc.
