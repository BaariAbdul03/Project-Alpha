# G0 Local Prototype Checklist

Scope: local-only, no deployment/publication, no spend. Status reviewed 2026-11-11.

## Verified
- [x] PostgreSQL 15 local container and persistent `medusa-store-pgdata` volume retained.
- [x] Host PostgreSQL connection verified at `127.0.0.1:5433` (`select 1`).
- [x] Medusa `db:setup --db medusa-store --no-interactive` completed migrations and seed scripts.
- [x] Database contains four seeded products and an India/INR region.
- [x] Local admin user created and admin login verified.
- [x] Storefront production build passes.
- [x] Local backend process restarted on port 9000 for direct API diagnosis.
- [x] Database has one active, non-revoked publishable key (token begins `pk_`); it is linked to the Default Sales Channel. Key remains private and is not reproduced here.
- [x] Storefront `.env.local` has the publishable key configured and backend URL `http://localhost:9000`; ignored local env files are not added to Git.

## Blocked / not yet verified
- [ ] Direct Store API with the apparently correct key succeeds. Both `/store/regions` and `/store/products?limit=5` currently return HTTP 400 `not_allowed`: “A valid publishable key is required to proceed with the request.” Need resolve why Medusa's query graph does not resolve the persisted key before storefront testing.
- [ ] Storefront runtime and product grid. Do not treat the successful build or DB rows as proof products render.
- [ ] Confirm region country code at Store API after key issue is resolved; seed source defines India (`in`) and INR. Starter fallback is `dk`; set `NEXT_PUBLIC_DEFAULT_REGION=in` only after the Store API is fixed, then restart Next dev.
- [ ] Add a screenshot/product-grid evidence only after actual storefront display is verified.
- [ ] Git repository, commit, ignore check and CI: no repository initialized and no GitHub remote supplied. Do not push until the user provides/authorizes the destination.
- [ ] Production dependency audit remains red: prior `npm audit --omit=dev --audit-level=high` reported 18 findings including critical Next.js advisory. No upgrade performed; choose a compatible patched version and rebuild before claiming resolution.
- [ ] Hosting/provider costs, staging/production isolation, backups/access policy, final product/design/client signoff and shipping/payment configuration remain pending. No deploy or production secrets used.

## Direct API diagnosis details
- Confirmed database token has `pk_` prefix, is not revoked/deleted, and is present in `apps/storefront/.env.local` (presence checked without printing it).
- Confirmed key-sales-channel link exists and is not deleted.
- `NEXT_PUBLIC_DEFAULT_REGION` is currently unset; middleware falls back to `dk`. This may affect routing after successful regions fetch but cannot explain the current `not_allowed` response.
- Backend `/health` was previously verified HTTP 200; the process had since exited and was restarted. API requests now reach Medusa and return the above 400 body.
