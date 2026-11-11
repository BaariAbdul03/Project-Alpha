# G0 Local Prototype Checklist

Scope: local-only, no deployment/publication, no spend. Status reviewed 2026-11-11.

## Verified
- [x] PostgreSQL 15 local container and persistent `medusa-store-pgdata` volume retained.
- [x] Host PostgreSQL connection verified at `127.0.0.1:5433` (`select 1`).
- [x] Medusa `db:setup --db medusa-store --no-interactive` completed migrations and seed scripts.
- [x] Database contains four seeded products and an India/INR region.
- [x] Local admin user created and admin login verified.
- [x] Backend serves on port 9000 (`npm run dev -- --port 9000`, because the Medusa default port resolves to 0); `/health` returns HTTP 200.
- [x] Medusa dependency tree is aligned at 2.22.6 for `@medusajs/framework`, `@medusajs/medusa`, and `@medusajs/utils`.
- [x] Publishable key fetched directly from PostgreSQL and sent as `x-publishable-api-key`: `/store/regions` returns HTTP 200 with India (`in`)/INR; `/store/products?region_id=...` returns HTTP 200 with four products.
- [x] Key-sales-channel link row exists, active, and references non-deleted Default Sales Channel.
- [x] Storefront backend/base URLs set to loopback (`127.0.0.1`) in the ignored local `.env.local`; default region `in`; backend `STORE_CORS` allows both loopback origins.
- [x] Storefront key in `.env.local` replaced from the DB value and verified equal without printing it (earlier value was mismatched, 27 chars vs 67).
- [x] Storefront catalog page `http://127.0.0.1:8000/in/store` returns HTTP 200 and server-renders the four seeded products (`Synthetic Cotton Tee`, `Synthetic Cotton Sweatshirt`, `Synthetic Cotton Sweatpants`, `Synthetic Cotton Shorts`).
- [x] Store catalog page now renders `PaginatedProducts` from the Store API; the previous InstantSearch-only layer produced an empty listing and was removed from this page.
- [x] Storefront production build passes.
- [x] Git repository on `main`, both local env files ignored, generated build info and local postgres log ignored; initial commit pushed to `https://github.com/BaariAbdul03/Project-Alpha.git`.
- [x] Production dependency audit: `npm audit --omit=dev` had 1 critical (`next` 16.0.0–16.4.0) and 1 high (`zod` < 4.6.6). Next.js is now 16.4.6 and backend `zod` is 4.6.7; re-audit reports 0 critical and 0 high.
- [x] CI workflow `.github/workflows/ci.yml`: Node 24, `npm ci`, `npm run build`, informational `npm audit --omit=dev`, full-history gitleaks (`fetch-depth: 0`). GitHub Actions run on `main` succeeded (commit `68b84c7`).

## G0 local scope: complete
All locally verifiable G0 work is done: database, seed, admin, Store API, catalog grid, build, dependency high/critical fixes, Git remote, and CI definition.

## Accepted local limitations
- 16 low/moderate production advisories remain in transitive dependencies with no non-major fix; recorded in `DECISION_REGISTER.md` with revisit trigger.
- Catalog page uses the Store API directly. Storefront search/refinement UI (InstantSearch adapter against `/store/search`) is not wired into the catalog page.
- Seed products have no images and carry zero INR prices, so the grid shows placeholder thumbnails and no meaningful price. Synthetic data only.

## Outside G0 local scope (client-owned, not blocking local prototype)
- [ ] Hosting vendor/budget, staging vs production isolation policy, backups/access owner, data retention/residency.
- [ ] Final MVP journeys, fulfillment volume, shipping serviceability, payment/COD implementation, design approval against Stitch source, logo/photo rights records.
- [ ] No deploy, production secrets, or vendor accounts were created.

## Evidence notes
- Key never printed or stored; comparisons were done in-process and reported as booleans.
- Earlier storefront 500 was caused by a corrupted Next.js install (runtime reported missing `next/dist/...` modules), not by product or region data. A clean dependency install plus the page change resolved it.
- Local dev servers: backend on 9000, storefront on 8000. Both are local-only processes started for verification.
