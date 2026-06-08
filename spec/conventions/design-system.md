# Design-System Conventions (Material 3)

> Default **UX/UI design language** for a Lodestar project. The base design system
> is **Material Design 3 (M3)** — https://m3.material.io. Same DNA as the server &
> frontend conventions: **one source of truth (tokens), nothing ad-hoc, every screen
> testable against named states.** Platform-agnostic — M3 has official
> implementations across the web, Android, and Flutter; the *implementation library*
> is a per-project choice recorded in an ADR, the *design language* is not.
> Deviations from M3 need a logged decision or an ADR.

This convention governs the **design stage** (`docs/2-design/design/`). It produces
one `design-system.md` artifact (the project's M3 token set) plus per-screen UX specs
that reference it. The build stage (`frontend.md`) consumes those tokens.

## The umbrella rule — tokens are the source of truth

```text
   seed / brand input         (one or more source colors, brand intent)
            ↓ generates (M3 dynamic color · HCT tonal palettes)
   design tokens              (color roles, typescale, shape, elevation, state)
            ↓ referenced by name (never raw hex/px)
   screen / component specs   (M3 components + token names + per-state behavior)
            ↓ implemented as
   coded UI                   (an M3 component library bound to the same tokens)
```

A spec or a component **never** names a raw `#hex`, a magic `px`, or a one-off font.
It names a **token** (`primary`, `surface-container-high`, `body-large`, `corner-medium`).
This is the design-side mirror of frontend.md rule 4 ("style via the design system /
tokens — no ad-hoc magic colors/spacing").

## 1. Decide the aesthetic intent before producing tokens

Borrowed discipline (from frontend-design): before generating a single token, write
**one short paragraph** in `design-system.md` fixing the intent — product personality,
tone (calm/energetic/serious/playful), density (compact/comfortable), light/dark
strategy. M3 is a *system*, not a look: the same token machinery yields very different
products. Pin the intent so downstream choices are coherent, not arbitrary.

## 2. Color — M3 roles, generated from a seed (not hand-picked hex)

- Define **seed color(s)** (brand). Derive the full **role set** via M3 dynamic color
  (HCT tonal palettes), do not hand-pick disconnected hex values.
- The role set (light + dark each): **primary / on-primary / primary-container /
  on-primary-container**, the same four for **secondary** and **tertiary**, **error**
  (+ container + on-), and the surface family — **surface, on-surface,
  surface-variant, on-surface-variant, surface-container-{lowest,low,high,highest},
  outline, outline-variant, inverse-surface, inverse-on-surface, inverse-primary,
  scrim, shadow**.
- Specs reference **roles, never tones or hex**. "Primary button on a surface card",
  not "#6750A4 on #FFFBFE". Roles are what survive a theme/brand change.
- Provide **both light and dark** schemes. State the contrast strategy.

## 3. Typography — the M3 type scale

- Use the M3 **type scale**: `display-{large,medium,small}`, `headline-{l,m,s}`,
  `title-{l,m,s}`, `body-{l,m,s}`, `label-{l,m,s}`. Each token fixes font, weight,
  size, line-height, tracking.
- Pick **at most 1–2 typefaces** (brand display + readable body), with a system-font
  fallback chain (the brand-guidelines pattern: declare fallbacks so it degrades
  gracefully). Map each typeface to type-scale roles — don't introduce sizes outside
  the scale.

## 4. Shape, elevation, spacing, motion

- **Shape:** the M3 corner scale — `none / extra-small / small / medium / large /
  extra-large / full`. Components map to a scale step; no arbitrary radii.
- **Elevation:** M3 levels **0–5** expressed via surface tonal overlay (+ shadow where
  the platform uses it). Don't invent shadow values.
- **Spacing:** a consistent base unit (M3 commonly 4dp/8dp grid). All spacing is a
  multiple of the unit; no magic gaps.
- **Motion:** use M3 easing + duration tokens for transitions/state changes. Prefer a
  few intentional, orchestrated moments over scattered micro-animations.

## 5. Components — name M3 components, define every state

- Compose screens from **named M3 components** (TopAppBar, NavigationBar/Rail/Drawer,
  FAB, the five buttons — elevated/filled/filled-tonal/outlined/text — Card, Chip,
  Dialog, List, Menu, Snackbar, TextField filled/outlined, etc.). Don't reinvent a
  component M3 already defines; if you must, record why (ADR).
- Apply **M3 state layers** (hover ~8%, focus ~10%, pressed ~10%, dragged ~16% over the
  on-color). Every interactive element specifies its states.
- A custom component still consumes the **same tokens** (color roles, shape, type).

## 6. Layout & adaptive design

- Use M3 **window size classes** (compact / medium / expanded …) to decide layout and
  navigation pattern (NavigationBar on compact, NavigationRail/Drawer on larger).
- Specs declare behavior **per size class**, not a single fixed width.

## 7. Accessibility baseline (non-negotiable)

- **Contrast:** body text ≥ **4.5:1**, large text & UI components ≥ **3:1** (WCAG AA).
  M3 on-/container role pairs are designed to pass — verify, don't assume.
- **Touch targets** ≥ **48×48dp**; visible focus indicators; full keyboard operability.
- Semantic structure, labels/alt text, respects reduced-motion and dynamic text size.
- Don't encode meaning in color alone.

## UX checklist (design-stage definition of done)

Run this before the design→build gate (distilled from common UX guidelines &
anti-patterns; system-agnostic):

- [ ] Aesthetic intent paragraph written; light **and** dark schemes defined.
- [ ] Color expressed as **M3 roles** generated from a seed — no stray hex in any spec.
- [ ] Type uses the **M3 type scale**; ≤ 2 typefaces with declared fallbacks.
- [ ] Shape/elevation/spacing/motion use M3 token steps — no magic radii/shadows/gaps.
- [ ] Every screen built from **named M3 components**, each with its **states**.
- [ ] Every data view specifies **loading / empty / error / success / permission-denied**
      (this maps 1:1 onto frontend.md rule 4 and the UX-SPEC `States` section).
- [ ] Layout defined **per window size class** (adaptive), not one fixed width.
- [ ] Accessibility: contrast (4.5:1 / 3:1), 48dp targets, keyboard, focus, reduced-motion.
- [ ] No dark-pattern anti-patterns (forced action, disguised ads, hidden cost, confirmshaming).
- [ ] The chosen **M3 implementation library** is recorded in an ADR (see below).

## Implementation library → ADR (platform-agnostic)

The design language is fixed (M3); the **library that renders it is a per-project
decision** and gets an ADR (`docs/2-design/adr/`). Known mappings:

| Platform | Official / common M3 implementation |
|---|---|
| Web (vanilla / web components) | **Material Web** (`@material/web`) |
| Web (Angular) | **Angular Material (M3)** |
| Web (React) | **MUI** (M3 approximation) — note the gaps in the ADR |
| Android (Kotlin) | **Jetpack Compose Material 3** |
| Flutter | **Material 3** (`useMaterial3: true`) |
| iOS (SwiftUI/UIKit) | **No official M3** — adopting M3 here is an explicit ADR with a rationale and a fidelity note |

Whatever the library, bind it to the **same tokens** from `design-system.md` so the
design artifact stays the single source of truth.
