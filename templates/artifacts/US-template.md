---
id: US-001
parent: [PRD-001]
domain: <business-domain>
role: <actor / permission>   # who; also the role/permission split axis
status: draft                # draft | ready | in-progress | done
updated: YYYY-MM-DD
---

# US-001 · <short imperative title>

## Story
<!-- Job Story spine (preferred): the "When …" clause maps 1:1 to the AC's Given,
     so the story compiles straight into a test. Use the Connextra form
     ("As a <role>, I want …, so that …") instead only when the role distinction
     is the essence of the story. -->
When <situation/trigger>, I want <motivation>, so I can <outcome>.

## Context
<1–3 lines: why now, link to the PRD problem. No solution design.>

## Acceptance Criteria
- Scenario: <name>
  - Given <precondition>
  - When <action>
  - Then <observable outcome>

## Out of Scope
<explicit non-goals to keep the unit small>

## Notes / Open Questions
- [ ] <negotiable item / open question>

<!-- INVEST split trigger: if this needs > ~3 scenarios, or spans two goals /
     roles / state transitions / success-vs-failure contexts, split into separate files. -->
