---
id: PRD-001
status: draft            # draft | active | shipped | superseded
parent: [PLAN-001]
children: []             # downstream US-NNN ids
supersedes:              # optional: PRD-NNN this replaces (on a split/merge)
updated: YYYY-MM-DD
---

# PRD-001 · <problem title>

> A PRD is a problem-solving unit, not a feature list. Split when the user problem,
> policy, release unit, key state, or data lifecycle differs. Keep prose ≤ ~2 pages;
> depth lives in linked user stories. No tech/architecture or pixel mockups here.

## Summary
<2–3 sentences: what & why — the first thing an agent reads>

## Problem
<the user problem, who has it, evidence/data>

## Goals & Success Metrics
<2–4 measurable outcomes, each with baseline → target>

## Scope
<what this unit delivers — the solution direction, not a build spec>

## Non-Goals / Out of Scope
<explicit boundaries; prevents scope creep and agent over-building>

## Glossary
<canonical terms — one term per concept; ban synonyms>

## Screens & Flows
<key states and transitions; text or mermaid, not pixel specs>

## Permissions & Roles
| Role | Allowed actions |
|---|---|
|  |  |

## Policy / Rules
<business rules and constraints governing behavior>

## Edge Cases
<failure / exception / empty / limit conditions>

## Acceptance Criteria
<!-- Stable IDs derived from the PRD id; Given/When/Then; observable outcomes only. -->
### AC-001-01
Given <condition>
When <action>
Then <observable result>

## Open Questions
- [ ] <unresolved decision> — owner / status   <!-- resolve → move to Decision Log -->

## Decision Log
<!-- Dated entries; note supersession on splits/merges. Append, never edit. -->
- YYYY-MM-DD — <decision> (<why>)
