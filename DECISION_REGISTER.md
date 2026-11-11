# Decision Register

Review date: 2026-11-11. Prototype scope only; local-only, ₹0 spend until the client approves hosting and budget.

| Decision / input | Owner | Status / due |
|---|---|---|
| Seller entity / business registration | Client | Pending; defer through prototype, confirm before G2/G3 |
| GST registration number/status | Client | Skipped for now per client; confirm with CA before G3 |
| Expected monthly orders / traffic | Client | Unknown; estimate before hosting capacity and G0 production-readiness decisions |
| Fulfillment volume | Client | Pending; before G2/G3 |
| Final MVP journeys | Client | Pending; before G2 |
| Data retention / residency | Client | Pending; before G0 production-readiness |
| Hosting vendor and budget | Client | Deferred; local-only until explicitly approved |
| Backup/access/security owner | Agent for this local prototype | Local development only; staging/production ownership deferred to client before provisioning |
| Sandbox credentials | Client owns accounts | Razorpay test credentials only, stored in ignored local env files; never Git. No production keys on dev machine. Not needed for current seed prototype. |
| Staging/production isolation | Agent technical constraint; client owns deployment/account | Separate environments and env files; no production credentials on development machine. Written policy required before those environments exist. |
| Stitch design approver | Client | Client says “Me”; named identity not supplied; client approval required against exported/authenticated Stitch source |
| COD | Client | Allowed for desired scope; payment/fulfillment implementation deferred to later review |
| Shipping coverage | Client | India-wide desired; provider/serviceability verification remains pending |
| Logo and photos | Client | Written use approval stated; exact assets/brands still require rights/source records before launch |
| Medusa baseline | Agent technical decision | Medusa 2.22.6 integrated starter; PostgreSQL 15 local. Official install guide reviewed 2026-11-11: https://docs.medusajs.com/learn/installation (Node 22.22+ LTS; Next.js starter requires Node 24 LTS or lower; PostgreSQL required). Starter README specifies PostgreSQL 15+. |
| Hosting / vendor terms and costs | Agent researches; client approves accounts/budget | No selection or price claim. Medusa docs reviewed: https://docs.medusajs.com/learn/deployment and https://docs.medusajs.com/learn/installation (2026-11-11). Medusa local DB docs: https://docs.medusajs.com/resources/create-medusa-app (2026-11-11). PostgreSQL pricing depends on local/self-hosted vs vendor; no vendor selected. Redis is not needed for this local configuration; Medusa reports fake Redis fallback when REDIS_URL absent. |

## Local prototype evidence and limitations

- Docker PostgreSQL 15 container `medusa-store-postgres`, persistent volume `medusa-store-pgdata`, database `medusa-store`; host Node `pg` connection verified with `select 1` at `127.0.0.1:5433` on 2026-11-11. Host psql is not installed. Port 5433 is used to avoid ambiguity with existing Windows listeners on 5432.
- Backend `.env` is local-only and ignored by the starter's root `.gitignore`. It has `DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/medusa-store`, local CORS and development-only JWT/cookie secrets. Never reuse these local values outside this machine.
- `npm exec medusa -- db:setup --db medusa-store --no-interactive --verbose` succeeded on 2026-11-11. It confirmed DB connection, ran migrations, synced links, and ran starter migration scripts. It also updated `.env` with `DB_NAME=medusa-store`.
- Root `package.json` advertises `backend:seed` but backend has no `seed` script; the current starter's `db:setup` migration script handles seed. Verified 148 public tables, 184 migration rows, four products, and one publishable API key.
- Admin user `admin@example.com` was created locally. Admin login at `/app` succeeded. Settings showed Default Store currency INR; Publishable API Keys showed one active default key (masked in UI). Local key was configured in storefront `.env.local`, ignored by root `.gitignore`.
- Backend health endpoint returned HTTP 200 at `http://127.0.0.1:9000/health`. Backend dev CLI's default port resolved to 0; actual local startup command used `npm exec medusa -- develop --port 9000` (checked installed CLI `--help`).
- Storefront production build passed with Next.js 16.3.8. Storefront dev started, but rendering `/` failed: backend returned 400 in `getRegionMap` and Next produced a React runtime error. Storefront product display is **not** verified. The starter default route is `/` and middleware needs region data; investigate separately. Dev console also notes deprecated middleware convention.
- The Store settings page had INR configured, but the visual default region field showed `-`; Medusa seed scripts did create a region but storefront reports `/store/regions` as 400. Must resolve before claiming the seeded storefront flow is working.
- Earlier backend build passed. Full monorepo build previously failed solely because storefront key was absent at that time; storefront build now passes separately.
- `npm audit --omit=dev` originally reported 18 findings including critical `next` (16.0.0–16.4.0). Applied same-major fixes: storefront `next` 16.4.6 and backend `zod` 4.6.7. Re-audit reports 0 critical, 0 high, 11 moderate, 5 low (16 total). Remaining advisories are transitive dependencies with no non-major fix; accepted for the local G0 prototype with revisit before any deployment and on the next dependency refresh.
- Git repository initialized on `main`, remote `origin` set to `https://github.com/BaariAbdul03/Project-Alpha.git`, initial commits pushed. `.github/workflows/ci.yml` adds Node 24 install/build, informational audit, and full-history gitleaks. CI has not yet been observed running on GitHub.
- Storefront catalog verified at `http://127.0.0.1:8000/in/store`: HTTP 200 with the four seeded products rendered from the Store API. The page was changed from the empty InstantSearch layer to `PaginatedProducts`; search/refinement UI remains unwired.
- No production resources, secrets, payments, hosting, or vendor accounts configured.

## Pending vendor evidence

Vendor terms, billing and deployment costs are not estimated without a selected provider and workload. Before host selection, compare official pricing/terms for Medusa-compatible Node hosting, PostgreSQL, and any required Redis; capture URLs, review date, workload assumptions, backups, region, support and exit/export terms. Current official PostgreSQL project overview (not a hosting price list): https://www.postgresql.org/; reviewed 2026-11-11.
