# 2 · Design — tech

Technical design as a **1:N tree**: each business domain owns its technical
context(s). Start with the context map.

- **`context-map.md`** (first artifact): business domain ↔ technical context.
  Default 1:1 or 1:N. Contexts shared by 2+ domains go under `shared/`.
- **`<domain>/<context>/`**: architecture, data model, API contracts, NFRs.
- **`shared/<context>/`**: generic contexts (auth, notification, payment-gateway,
  audit) owned by no single business domain.
- **parent:** the `US-NNN` / `PRD-NNN` each spec serves.

Drift/gaps to flag: a US with no spec; a non-`shared/` context used by 2+ domains
(ownership ambiguous); a context serving no business domain (over-design).

**Definition of done (→ build):** context map exists; every active US is covered.

Full guidelines: `../../../.lodestar/SPEC.md` → §5.2 / `#design`.
