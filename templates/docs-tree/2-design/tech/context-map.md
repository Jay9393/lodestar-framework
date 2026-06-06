# Context Map

Maps **business domains** (from `../../1-discovery/04-user-stories/`) to
**technical contexts** (this folder). Default 1:1 or 1:N; contexts shared by 2+
business domains live in `shared/`.

> Business domain ≠ technical domain. They should be *aligned*, not identical.
> Record any divergence (a domain splitting into many contexts, etc.) with a reason.

## Business domain → technical context(s)

| Business domain | Technical context(s) | Notes / divergence reason |
|---|---|---|
| _ordering_ | cart, checkout, order-history | — |
| _catalog_  | product, inventory | — |

## Shared contexts (owned by no single business domain)

| Shared context | Consumed by domains | Why shared |
|---|---|---|
| _auth_ | ordering, catalog, … | cross-cutting identity |
| _notification_ | … | cross-cutting messaging |

## Drift checklist

- [ ] Every technical context is either owned by one business domain or under `shared/`.
- [ ] No non-`shared/` context is used by 2+ domains without a reason above.
- [ ] No technical context exists that serves no business domain.
