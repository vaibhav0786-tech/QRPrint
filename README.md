# QRPrint Platform

QRPrint is a planned micro-SaaS architecture for stationery shops: a QR-linked customer ordering page, cloud job orchestration, and a merchant-controlled local print worker. The repository is now organized for the requested Next.js customer application, Node/Express API, local merchant service, and installer package.

## Current delivery status

The customer UI and deployment configuration are scaffolded, and the database model, API contract, pricing primitive, local-service boundary, and operational documentation are included. **This is not production-ready and cannot process payments, upload documents, calculate a live database-backed price, or print jobs yet.** Those operations correctly fail closed rather than using sample data or pretending an integration exists.

| Area | Status | Blocker |
| --- | --- | --- |
| Customer order UI | Implemented scaffold | Needs a deployed API and real upload/payment integration |
| Next.js/Vercel configuration | Included | Install application dependencies in a network-enabled build environment |
| Express API | Contract scaffold | Needs PostgreSQL repository, object storage, document processor, auth, queue, and payment provider |
| Merchant worker / CLI | Safe boundary scaffold | Needs Windows printer adapter, device registration, and signed cloud connection |
| Schema and operations docs | Included | Needs reviewed migrations, secrets, infrastructure, and compliance approval |

## Repository layout

- `apps/customer`: Next.js customer web application for Vercel.
- `services/api`: Express API process; it currently exposes health and fail-closed quote behavior.
- `services/merchant`: Node local service boundary for a merchant PC.
- `packages/merchant-cli`: merchant installation command placeholder that does not alter printers until real adapter support is delivered.
- `packages/shared`: deterministic pricing logic used by trusted server-side services.
- `database/schema.sql`: PostgreSQL table definitions for merchants, guest customers, jobs, transactions, printers, and price rules.
- `docs/`: PRD, architecture, API, database, merchant/customer, deployment, and test-protocol documents.

## Local development

Requires Node.js 18+. This environment could not obtain packages from the npm registry; run the following in a network-enabled environment:

```bash
npm install
npm --workspace @qrprint/customer run dev
npm --workspace @qrprint/api run start
npm --workspace @qrprint/merchant-service run start
```

Set these server-side values before connecting components:

- `PRINT_API_URL`: HTTPS base URL of the Express API, used by the Vercel route.
- `PRINT_API_KEY`: server-only key for the Vercel-to-API request path.
- `PORT`: API port (default `3001`).
- `MERCHANT_PORT`: local merchant-service port (default `4310`).

Do not put payment keys, printer credentials, or API keys in browser-exposed `NEXT_PUBLIC_*` variables.

## Documentation

Read the [PRD](docs/prd.md), [architecture](docs/architecture.md), [API contract](docs/api.md), [database schema notes](docs/database-schema.md), [merchant setup](docs/merchant-setup.md), [customer guide](docs/customer-guide.md), [deployment guide](docs/deployment.md), and [testing protocol](docs/testing-protocol.md) before implementation or deployment.

## Validation

```bash
npm run check
npm test
```

These checks cover syntax and server-side price calculation. They do not validate payment, storage, Vercel, Windows printing, or real-time delivery because the required production integrations and credentials have not yet been supplied.
