# Server Conventions

> Default architecture rules for **server-side** code in a Lodestar project.
> Language/framework-agnostic — the directory names are examples, the principles
> are not. Build-stage agents MUST follow these; deviations need a logged decision
> (`log_decision`) or an ADR.

## The umbrella rule — dependency direction

Layers, and dependencies **always point inward**:

```text
   handlers / API boundary        (HTTP, transport, validation, error mapping)
            ↓ depends on
   use-cases (business logic)      (the core — pure orchestration, no IO)
            ↓ depends on (interfaces only)
   ports                          (repository / external-service interfaces)
            ↑ implemented by
   adapters / infra               (DB, cache, 3rd-party clients, frameworks)
```

The core (use-cases + domain) depends only on **abstractions (ports)**, never on a
framework, ORM, or HTTP/SDK type. IO lives at the edges. This single rule is what
makes rules 1–3 and 6 hang together.

## 1. Business logic → use-cases (test required)

- Every business operation is **one use-case**: a callable unit with explicit
  typed input and output, named by intent (`CreateOrder`, `CancelSubscription`).
- A use-case **orchestrates** domain logic + ports. It contains **no** HTTP, DB,
  ORM, or SDK specifics.
- One use-case = one responsibility. If it does two things, split it.
- **Every use-case has tests** covering the happy path + key failure paths, and
  those tests assert the acceptance criteria of the originating User Story / PRD
  (traceability: test ↔ AC ↔ US).

## 2. Third-party / external API calls isolated (ports & adapters)

- All outbound calls go through an **adapter behind a port (interface)**. Use-cases
  depend on the port, never on the SDK/HTTP client.
- Adapters live at the edge (e.g. `infra/clients/<service>/`).
- At the adapter boundary: set **timeouts**, handle **retries**, and **map external
  errors to domain errors** — vendor error shapes never leak inward.
- This isolation is what enables rule 6 (mock the port, not the network).

## 3. DB & cache → repository pattern

- Data access sits behind **repository interfaces**; use-cases depend on the
  interface, not the ORM/driver/query builder.
- Repositories return **domain models**, not raw rows or ORM entities leaking upward.
- **Cache is a repository concern** (often a decorator over the repo), invisible to
  the use-case.
- **Transaction boundaries are owned by the use-case** (unit-of-work), not scattered
  across repositories.

## 4. Models, schema & migrations

- **All** schema changes go through **migration files**. Never hand-edit a database,
  and **never edit a migration that has shipped** — add a new one.
- Migrations are **forward-only and reversible where possible**; destructive changes
  (drop/rename/backfill) need a migration plan + a recorded decision (Decision Log or ADR).
- **Indexes and unique constraints are declared in BOTH the model and the migration**,
  each with a **comment stating why** — the query pattern it serves or the invariant
  it protects. No silent indexes.
- Make explicit: **nullability**, **foreign keys + on-delete behavior**, defaults, and
  standard `created_at` / `updated_at`.
- One consistent naming convention for tables / columns / indexes.

## 5. Shared code → `common/helper`

- Cross-cutting **pure** utilities go in `common/helper` (or `shared/`): no business
  logic, no IO, no framework deps.
- If a "helper" needs IO or domain knowledge, it's actually a **port/adapter or a
  use-case** — put it there instead.
- Helpers are pure and **unit-tested**.

## 6. Testing (use-cases + APIs, external mocked)

- **Every use-case and every API endpoint has tests.**
- **External API and DB interactions are mocked/stubbed via their ports** — tests are
  fast and deterministic, no live network or real DB in unit tests.
- Test use-cases through their port interfaces; test adapters separately with
  **integration tests** (a real/containerized dependency).
- Tests cover happy + failure/edge per acceptance criterion, and trace to the US/PRD AC.

## Developed additions (the gaps in the original list)

- **Error handling.** Distinguish **domain errors** (expected; mapped to API
  responses at the boundary) from **infra errors**. One error-mapping layer at the
  API edge; never leak stack traces or internal messages to clients.
- **Input validation & DTOs.** Validate/parse at the **boundary** (handler), then
  convert to a typed use-case input. Keep transport DTOs separate from domain models.
- **Config & secrets.** No secrets in code or repo; config is injected (env / secret
  manager) and **validated at startup — fail fast** on missing/invalid config.
- **Observability.** Structured logging + a correlation/request id at the boundary;
  the use-case/domain core stays log-light (or logs via a port). **Never log secrets/PII.**
- **Idempotency & concurrency.** State-changing endpoints that can be retried define
  idempotency; concurrency assumptions (locking, optimistic versions) are explicit.

## Reviewer checklist (build-stage definition of done)

- [ ] Each business operation is a use-case with tests tracing to an AC.
- [ ] No SDK/ORM/HTTP type appears inside a use-case or domain.
- [ ] External calls and data access are behind ports; tests mock the ports.
- [ ] Schema change ships as a migration; indexes/uniques are commented with a reason.
- [ ] Validation, error mapping, config, and logging live at the boundary, not the core.
- [ ] Helpers are pure and live in `common/helper`.
