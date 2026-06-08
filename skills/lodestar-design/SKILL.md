---
name: lodestar-design
description: Drive the UX/UI design sub-stage of a Lodestar project using Material 3 as the base design system. Use when the user asks to design screens/flows/UI, set up a design system or tokens, or work UX/UI — and invoked automatically by lodestar-run when a project in the design stage reaches its UX/UI work. Produces design/design-system.md (M3 tokens) then per-screen UX specs that reference named M3 components + tokens, following .lodestar/conventions/design-system.md.
---

# Lodestar UX/UI design driver (Material 3)

Drives `docs/2-design/design/`: first the **M3 design system (tokens)**, then
per-screen **UX specs**. Base design system is **Material 3** (https://m3.material.io).
This is a sub-driver of the design stage — tech specs/ADRs are still `lodestar-run`'s
job; this skill owns the UX/UI surface.

## When this runs
- **Directly:** the user asks to design UI/screens/flows or set up a design system.
- **Automatically:** `lodestar-run` invokes it when a `stage: design` project reaches
  its UX/UI work (see lodestar-run Step 2 → design).

## Step 1 — Orient (always first)
- Read `PROJECT.md`: `stage`, `mode`, and the **North Star** (UI must serve it).
- Read `.lodestar/conventions/design-system.md` (the M3 rules + UX/a11y checklist) and
  `.lodestar/SPEC.md` §5.2.
- Read the **User Stories** (`docs/1-discovery/04-user-stories/`) and any PRD
  `screens/flows` — they define which screens exist and the states each needs.
- Scan `docs/2-design/design/` for what already exists.

## Step 2 — Design system first (if missing)
Produce `docs/2-design/design/design-system.md` from
`.lodestar/templates/DESIGN-SYSTEM-template.md`:
1. **Fix the aesthetic intent** (one paragraph) before any token — M3 is a system,
   not a look.
2. Take a **seed color** (ask if there's brand input; otherwise propose one as a
   *taste* decision and surface it), then derive M3 **color roles** (light + dark) —
   never hand-pick disconnected hex.
3. Fill the **type scale** (≤ 2 typefaces + fallbacks), **shape**, **elevation**,
   **spacing unit**, **motion**, **state layers**, **size classes**.
4. Record the **M3 implementation library** choice as an **ADR** under
   `docs/2-design/adr/` (platform-agnostic: Material Web / Angular Material / MUI /
   Compose / Flutter; non-official platforms like SwiftUI need an explicit rationale).

## Step 3 — Per-screen UX specs
For each active US screen, write `docs/2-design/design/UX-NNN-*.md` from
`.lodestar/templates/UX-SPEC-template.md`, with `parent: [US-NNN]`:
- Compose from **named M3 components**; style by **token name only — no raw hex/px**.
- Specify **every state**: `loading / empty / error / success / permission-denied`
  (maps 1:1 onto frontend.md rule 4).
- Define **layout per window size class** (adaptive), interaction state layers, motion.
- Complete the **accessibility** items (contrast, 48dp targets, keyboard/focus).

## How to work (every step)
- **Ask one question at a time**; offer **≥2 alternatives** (one minimal, one ideal).
- **Classify decisions** (§4.4): resolve *Mechanical* silently; decide *Taste*
  (e.g. a default seed/typeface) and note it; **escalate *User-Challenge***
  (brand identity, a non-M3 direction, dropping accessibility) — present options,
  ask, and `log_decision` it.
- No raw hex/px in any spec — reference a token. No component M3 already defines gets
  reinvented without an ADR.

## Step 4 — Done
When `design-system.md` exists and every active US has a UX spec passing the
design-system **UX/a11y checklist**, summarize what was produced and hand back to
`lodestar-run` (which continues remaining design work, then `lodestar-gate` at the
lifecycle boundary). Do **not** change `stage:` here.

> Model-agnostic note: this operationalizes `.lodestar/conventions/design-system.md`
> + SPEC §5.2. An agent without skills applies that convention directly.
