---
project: {{PROJECT_NAME}}
stage: discovery            # discovery | design | build | operate
mode: {{MODE}}              # strict | lite
updated: {{DATE}}
---

## North Star

<!-- One paragraph: the top-level goal this project must not drift from.
     Fill this in once 00-business-strategy and 01-product-strategy exist.
     Every agent re-reads this before working. -->

_TBD — define after 00-business-strategy and 01-product-strategy._

## Traceability Index

<!-- The current source-of-truth chain, top to bottom. Update as the project
     progresses. Example:
- BIZ-001 → PS-001 → PLAN-001 → PRD-003 → US-012 → TASK-045
-->

_No artifacts yet._

## Gate Reports

<!-- Append one block when you complete a stage, BEFORE transitioning.
     check_gate verifies a matching block exists. Format:
### GATE: discovery→design
- status: passed | skipped
- date: YYYY-MM-DD
- unresolved-user-challenges: none
- checklist: biz, strategy, plan, prd, us, domain-map — all met
-->

_No gates passed yet._

## Active gate-skips

<!-- Each time a stage is entered without its upstream output, log it here and
     in docs/99-decision-research/gate-skips/. Example:
- 2026-06-04: built US-009 without a PRD
  (reason: docs/99-decision-research/gate-skips/2026-06-04-us009.md)
-->

_None._
