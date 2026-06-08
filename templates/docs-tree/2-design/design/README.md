# 2 · Design — design (UX/UI)

**Purpose:** the project's UX/UI design — design system, screens, flows, per-state UX.
Base design system is **Material 3** (https://m3.material.io).

Produce, in order:

1. **`design-system.md`** (first artifact) — the project's **M3 token set**: color
   roles from a seed, type scale, shape, elevation, state layers, adaptive size
   classes. Skeleton: `.lodestar/templates/DESIGN-SYSTEM-template.md`.
2. **`UX-NNN-*.md`** — one screen/flow per file, referencing **named M3 components +
   tokens** (never raw hex/px) and specifying every state
   (`loading/empty/error/success/permission-denied`). Skeleton:
   `.lodestar/templates/UX-SPEC-template.md`.

- **parent:** the `US-NNN` / `PRD-NNN` each spec serves.
- **Rules:** `.lodestar/conventions/design-system.md` (M3). The M3 *implementation
  library* (Material Web / Angular Material / MUI / Compose / Flutter) is a per-project
  **ADR** under `../adr/`; the design language is fixed.
- **Definition of done (→ build):** `design-system.md` exists; every active US is
  covered by a UX spec with named M3 components + states; the UX/a11y checklist passes.

> Driven by the **`lodestar-design`** skill (invoked directly, or automatically by
> `lodestar-run` on reaching the design stage's UX/UI work).
> Full guidelines: `../../../.lodestar/SPEC.md` → §5.2 / `#design`.
