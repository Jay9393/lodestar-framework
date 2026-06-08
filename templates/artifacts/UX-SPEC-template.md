---
id: UX-001
parent: [US-001]            # the user story (or PRD) this screen/flow serves
status: draft               # draft | active | superseded
updated: YYYY-MM-DD
---

# UX-001 · <screen / flow name>

> One screen or one flow per file. References `design-system.md` tokens + named M3
> components — **no raw hex/px**. See `.lodestar/conventions/design-system.md`.

## Goal
<1–2 lines: the user goal this screen serves, traced to the US above.>

## Flow
<!-- Entry → steps → exit. Link to other UX-NNN screens. -->
1. <entry point>
2. <step / interaction>
3. <success exit>

## Layout (per window size class)
| Size class | Navigation | Composition |
|---|---|---|
| compact | NavigationBar | <stacked / single column> |
| medium / expanded | NavigationRail/Drawer | <columns, panes> |

## Components (named M3 + tokens)
| Element | M3 component | Tokens (role / type / shape) |
|---|---|---|
| <e.g. primary action> | FilledButton | `primary` / `label-large` / `corner-full` |
| <e.g. content card> | Card | `surface-container-high` / `body-medium` / `corner-medium` |

## States  <!-- every data view MUST cover all five (mirrors frontend.md rule 4) -->
- **loading:** <skeleton / progress indicator>
- **empty:** <empty-state message + primary action>
- **error:** <error surface + retry; which errors map here>
- **success:** <the normal populated view>
- **permission-denied:** <what a user without the role/permission sees>

## Interaction & motion
- Interactive elements specify **state layers** (hover/focus/pressed/dragged).
- Transitions use M3 motion tokens; honor reduced-motion.

## Accessibility
- [ ] Contrast 4.5:1 (text) / 3:1 (large/UI) · [ ] 48dp targets · [ ] keyboard + focus order
- [ ] Labels/alt text · [ ] meaning not by color alone · [ ] respects dynamic text size

## Open questions
- [ ] <decision / question — classify: taste | user-challenge>
