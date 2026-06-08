---
id: DS-001
parent: [PS-001]            # product strategy / plan that fixes the brand intent
status: draft               # draft | active | superseded
updated: YYYY-MM-DD
---

# Design System — Material 3 tokens

> One per project. Lives at `docs/2-design/design/design-system.md`. The single
> source of truth for color/type/shape/elevation/motion. Every screen spec and every
> coded component references **token names** from here — never raw hex/px.
> See `.lodestar/conventions/design-system.md`.

## Aesthetic intent
<!-- One short paragraph BEFORE any token. M3 is a system, not a look. -->
- **Personality / tone:** <calm | energetic | serious | playful | …>
- **Density:** <compact | comfortable>
- **Light/dark:** <both | light-first | dark-first>
- **One sentence:** <what makes this product's surface feel like itself>

## Color — M3 roles (generated from a seed)
- **Seed color(s):** `#______` <brand source; roles below are derived via M3 dynamic color / HCT>
- Reference **roles**, never tones/hex, in specs.

| Role | Light | Dark |
|---|---|---|
| primary / on-primary | | |
| primary-container / on-primary-container | | |
| secondary (+container, +on-) | | |
| tertiary (+container, +on-) | | |
| error (+container, +on-) | | |
| surface / on-surface | | |
| surface-variant / on-surface-variant | | |
| surface-container-{lowest,low,high,highest} | | |
| outline / outline-variant | | |
| inverse-surface / inverse-on-surface / inverse-primary | | |

## Typography — M3 type scale
- **Typeface(s):** display=`<font>`, body=`<font>` · fallback chain: `<…, system-ui, sans-serif>`

| Token | Font / weight | Size / line-height / tracking |
|---|---|---|
| display-{large,medium,small} | | |
| headline-{large,medium,small} | | |
| title-{large,medium,small} | | |
| body-{large,medium,small} | | |
| label-{large,medium,small} | | |

## Shape · elevation · spacing · motion
- **Shape (corner scale):** none / extra-small / small / medium / large / extra-large / full → `<radii>`
- **Elevation:** M3 levels 0–5 → `<surface tint + shadow per level>`
- **Spacing unit:** `<4dp | 8dp>` grid — all spacing is a multiple.
- **Motion:** easing + duration tokens → `<emphasized / standard; short/medium/long>`

## State layers
- hover ~8% · focus ~10% · pressed ~10% · dragged ~16% (opacity of the on-color overlay).

## Adaptive — window size classes
| Size class | Navigation | Layout notes |
|---|---|---|
| compact | NavigationBar | |
| medium | NavigationRail | |
| expanded | NavigationDrawer | |

## Implementation library (→ ADR)
- **Chosen library:** `<Material Web | Angular Material | MUI | Compose M3 | Flutter M3 | …>`
- **ADR:** `ADR-NNN` (rationale + any fidelity gaps, esp. non-official platforms).

## Decision Log
- YYYY-MM-DD — <decision> [class: taste | user-challenge]
