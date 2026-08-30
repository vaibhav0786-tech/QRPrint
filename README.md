# QRPrint

QRPrint is a two-surface print-shop workflow: a **customer web portal** for placing paid print orders, and an installable **merchant desktop console** for running stores and fulfilment.

> **Implementation decisions (confirm before production):** this starter uses Next.js 15 for Vercel, Electron + SQLite for the merchant desktop app, Stripe as the default checkout, and the `qrcode` package. PDF, DOCX, PPTX, PNG, and JPG are accepted (50 MB limit). Merchant data is offline-first; cloud sync is an optional future adapter. Collection codes are six-character, random, single-use codes with a 24-hour collection window. PayPal is shown as a checkout option but needs its own server integration before enabling production payments.

## Project structure

```
app/                       Customer Next.js interface
apps/merchant/             Electron desktop console
  src/main.cjs             SQLite, store, job and QR IPC layer
  renderer/index.html      Local merchant dashboard
.env.example               Checkout and deployed customer URL settings
```

## Technical flow

1. A merchant creates a location in the desktop console. The app makes a URL-safe store slug and QR code pointing at `CUSTOMER_URL/s/<slug>`.
2. The customer scans the QR code and sees the animated welcome screen. They upload a supported file, choose paper, colour, sides, copies and finishing, then review their order.
3. A production checkout endpoint creates a Stripe PaymentIntent/Checkout Session. Only its verified webhook should create the paid print job in SQLite or your cloud sync service.
4. The merchant queue displays paid jobs. On completion, it produces a unique collection code; production print templates must render this code in the same print job’s final page/footer.
5. At the counter, staff validates the code, hands over the print, and marks it collected so the code cannot be reused.

## Customer web installation & deployment

### Requirements

- Node.js 20.9+ and npm 10+.
- A Vercel account (free Hobby is fine for previews) and a Stripe account for real payments.
- Any modern desktop or mobile browser; customers do **not** install an app.

### Local development

1. Clone the repository and run `npm install` from the repository root.
2. Copy `.env.example` to `.env.local` and set Stripe test keys.
3. Run `npm run dev`, then open `http://localhost:3000`.
4. Upload a supported test document and walk through the preferences and confirmation screens.

### Vercel deployment

1. Create a Vercel account at vercel.com, import this Git repository, and use the repository root as the project directory.
2. Add every variable from `.env.example` in **Project → Settings → Environment Variables**. Set `CUSTOMER_URL` to the production Vercel URL.
3. Deploy. Configure Stripe’s webhook to your future `/api/stripe/webhook` endpoint, then redeploy once server-side checkout endpoints are added.
4. QR links must use a real route such as `app/s/[storeSlug]/page.tsx`; add this route before issuing live QR codes.

## Merchant desktop installation

### Supported platforms and requirements

- Windows 10/11 x64, macOS 12+, or Ubuntu 20.04+ desktop.
- Node.js 20.9+ to run from source; packaged installers are produced with Electron Builder.
- No merchant account is required for local-only operation. Create a Stripe account only if accepting payments.

### From source / CLI

1. `cd apps/merchant && npm install`
2. Export `CUSTOMER_URL=https://your-customer-app.vercel.app` (or add it to your shell profile).
3. Run `npm run dev`. Electron opens the local dashboard; its SQLite file lives in Electron’s per-user application-data folder.
4. For installers, run `npm run package`. Electron Builder emits platform-specific artifacts under `apps/merchant/dist/`.

## Merchant dashboard guide

- **Dashboard:** opens by default; shows current jobs and store context.
- **Stores:** choose **Add store location**, enter a name, and save. Copy/download the returned QR image in the production renderer and place it at that location.
- **Print queue:** paid jobs appear with file name, store and status. Choose **Complete print** to allocate a code and append it to the printed output. Use **Collected** after counter handover.
- **Settings (planned production panel):** customer URL, printer mapping, Stripe/cloud-sync connection, retention duration, staff roles and appearance. The current starter’s safe configuration is environment-based in `.env`.
- **Data backup:** close the desktop app and copy `qrprint.db` from the operating system’s Electron user-data directory. For privacy, restrict access to this backup and securely erase retired copies.
- **Help/version/developer information:** packaged apps should expose these in Electron’s **Help → About QRPrint** menu. During source development, use `npm run package` output metadata and `apps/merchant/package.json` for the version.

## Privacy, permissions & support

- The customer portal asks only for selected file access in the browser; no camera permission is needed because the phone camera handles QR scanning separately.
- Configure upload deletion after collection (24 hours by default) and disclose this in your privacy notice. Do not send documents to a printer until payment webhook verification succeeds.
- If the desktop console does not launch, verify Node/Electron requirements, delete only a backed-up corrupt SQLite database, and rerun `npm install`. If a QR opens the wrong site, correct `CUSTOMER_URL`, recreate the QR, and replace the displayed code.
- **Plans:** this repository has no built-in paid tier. Vercel Hobby is suitable for demos; Vercel, Stripe and PayPal may charge according to their own current plans and transaction fees.

## Production checklist

- Add authenticated merchant accounts, role-based access and encrypted cloud backup.
- Implement server-side uploads (malware scanning, MIME validation, signed storage URLs) and Stripe/PayPal webhook verification.
- Add `app/s/[storeSlug]`, real collection-code validation, job status polling/websocket updates, printer drivers and a tested PDF code-footer renderer.
- Obtain customer consent, publish terms/privacy policy, configure retention, and test a complete paid-to-collected workflow.
