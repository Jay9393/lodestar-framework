# Frontend Conventions

> Default architecture rules for **frontend** code in a Lodestar project.
> Framework-agnostic (React/Vue/Svelte/etc) — directory names are examples, the
> principles are not. Same DNA as the server conventions: **logic and IO out of the
> view, everything testable, one source of truth per piece of state.** Deviations
> need a logged decision or an ADR.

## The umbrella rule — dependency direction

```text
   components (view)              (render only — given data, show UI)
            ↓ depends on
   view logic (hooks / view-models)   (presentation logic, testable)
            ↓ depends on
   client use-cases / domain      (client-side business rules, if any)
            ↓ depends on (typed contracts)
   data / api layer (adapter)     (network, caching, transport error mapping)
```

Components don't reach past view logic to call the network. Dependencies point
toward the core; the **api layer is the frontend's adapter** (mirrors server rule 2).

## 1. Domain/business logic out of components → hooks / use-cases (test required)

- Components **render**; they don't hold business rules or orchestration.
- Logic lives in **hooks / view-models / client use-cases**, independently testable
  without mounting the UI.
- A component should read as "given this data + these callbacks, render this".
- Logic units have **unit tests** tracing to the relevant User Story AC.

## 2. API / external calls isolated (typed data layer)

- All network calls go through a **typed api/client module** — never `fetch`/axios
  scattered in components.
- Contracts are **shared with or generated from the backend** (e.g. OpenAPI) so the
  two sides have a single source of truth; no hand-drifted types.
- Map transport errors to **view-friendly errors** at this layer.

## 3. Server-state vs client-state separation (the repository analog)

- Remote/server state goes through a **data-fetching/cache layer** (query client) —
  this is the frontend "repository". **Don't copy server state into a global store.**
- Client/UI state is **minimal and local-first**; reach for global state only for
  genuinely shared, intentional state.
- **One source of truth per piece of state.**

## 4. Component conventions

- **Presentational vs container** split; style via the **design system / tokens** —
  no ad-hoc magic colors/spacing.
- Every data view handles the **required states**: `loading / empty / error /
  success / permission-denied` (this matches the design-spec `States` section).
- **Accessibility baseline**: semantic markup, keyboard navigation, contrast.
- No business rules inline; no direct API calls from a component.

## 5. Shared code → `common/helper` + shared UI

- Pure utilities in `common/helper` (or `lib/`): no component/DOM/framework deps,
  unit-tested.
- Reusable presentational components in `components/ui` (the design-system layer).
- A "helper" that fetches or holds domain state is a hook/use-case/adapter, not a helper.

## 6. Testing (logic + behavior, api mocked)

- **Unit-test** hooks / view-models / client use-cases (the logic).
- **Component/interaction tests** for behavior (render + user events), **mocking the
  api layer** — no live network.
- **E2E** for critical user flows.
- Tests assert the User Story ACs (traceability); the data layer is mocked.

## Developed additions

- **Forms & validation.** Validate at the boundary and **mirror the server's
  validation rules**; show field-level errors. Never trust client validation alone.
- **Routing & navigation.** Routes map to the flows in the design spec; guard routes
  by permission (mirror server authorization).
- **Performance.** Code-split by route, lazy-load heavy views, avoid needless
  re-renders; budget bundle size.
- **Error boundaries.** A top-level boundary plus per-feature boundaries — a failure
  degrades locally, never blanks the screen.

## Reviewer checklist (definition of done)

- [ ] Components are presentational; logic is in tested hooks/use-cases tracing to ACs.
- [ ] No `fetch`/SDK call in a component; all network goes through the typed api layer.
- [ ] Server state lives in the data/cache layer, not duplicated into global stores.
- [ ] Every data view renders loading / empty / error / success / denied states.
- [ ] Component tests mock the api layer; critical flows have e2e coverage.
- [ ] Shared pure utils in `common/helper`; shared UI in the design-system layer.
