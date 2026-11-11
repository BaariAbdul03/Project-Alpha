# G0 Local Prototype Checklist

Scope: local-only, no deployment/publication, no spend. Status reviewed 2026-11-11.

## Verified
- [x] PostgreSQL 15 local container and persistent `medusa-store-pgdata` volume retained.
- [x] Host PostgreSQL connection verified at `127.0.0.1:5433` (`select 1`).
- [x] Medusa `db:setup --db medusa-store --no-interactive` completed migrations and seed scripts.
- [x] Database contains four seeded products and an India/INR region.
- [x] Local admin user created and admin login verified.
- [x] Storefront production build passes.
- [x] Only one PID listens on backend port 9000. Shell `DATABASE_URL` is unset; backend `.env` target is `127.0.0.1:5433/medusa-store`.
- [x] Medusa dependency tree is aligned at 2.22.6 for `@medusajs/framework`, `@medusajs/medusa`, and `@medusajs/utils`.
- [x] DB token fetched directly through `docker exec ... psql` and sent via `x-publishable-api-key` header in Node HTTP calls: `/store/regions` returned HTTP 200 with India (`in`)/INR; `/store/products?limit=5` returned HTTP 200 with four synthetic products.
- [x] Key-sales-channel link row exists, active, and references non-deleted Default Sales Channel.
- [x] Set ignored local storefront env default country to `in` and restarted Next dev on port 8000.
- [x] Initialized Git repository on `main`; both local env files are ignored; generated TS build info and local postgres log now ignored and excluded from commit.
- [x] Created initial commit `d0c48f3` (`chore: initialize Medusa storefront`) and pushed `main` to `https://github.com/BaariAbdul03/Project-Alpha.git`.

## Blocked / not yet verified
- [ ] Storefront runtime and product grid. Direct backend API works but storefront returns HTTP 500/404. Next middleware logs `fetch failed` while calling the backend, then React invalid-child error; no product display evidence or screenshot.
- [ ] Browser panel could not connect to localhost:8000 (`ERR_CONNECTION_REFUSED`), despite Next process logging ready; not visually inspected.
- [ ] GitHub Actions/CI workflow and CI result not configured/verified; push succeeded only.
- [ ] Production dependency audit remains red: prior `npm audit --omit=dev --audit-level=high` reported 18 findings including critical Next.js advisory. No upgrade performed; choose compatible patched version and rebuild before claiming resolution.
- [ ] Hosting/provider costs, staging/production isolation, backups/access policy, final product/design/client signoff and shipping/payment configuration remain pending. No deploy or production secrets used.

## Direct API diagnosis details
- Previous request sent the token read from the storefront file and got 400. Latest request fetched the token at runtime directly from the DB and succeeded; likely earlier value/header mismatch. Token value is never logged or stored in this checklist.
- `apps/storefront/.env.local` has correct key configured by presence check; backend URL set to `http://localhost:9000`; default region now `in`.
- One PID was listening on 9000; backend health was HTTP 200. Process logs report DB setup and API live.
- Storefront requests from Next dev still fail to fetch backend even though direct local Node requests succeed. This is likely a Windows `localhost` resolution/IPv4 vs IPv6 mismatch: the storefront's backend URL is `http://localhost:9000` while backend listens on `0.0.0.0:9000`. Test changing ignored local `MEDUSA_BACKEND_URL` / `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to `http://127.0.0.1:9000` and restart both dev services before diagnosing elsewhere.
