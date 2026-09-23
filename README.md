# Africa Power Advisory Holdings

Bilingual French and English website built with server-rendered HTML, CSS and browser JavaScript, plus a small Node.js server using only built-in modules. Node.js 20 or newer is required. There are no production package dependencies.

## Run locally

```sh
npm start
```

Open `http://127.0.0.1:4173/` (French) or `http://127.0.0.1:4173/en/`. Contact CAPTCHA uses a local-only test checkbox in development unless `RECAPTCHA_MODE=google` is explicitly selected; email is written to the private sandbox outbox. Do not use development or test settings for a public deployment.

To run rendered page checks:

```sh
npm run check:content
```

## Deployment

Deploy the Node server behind a managed HTTPS reverse proxy. Set `NODE_ENV=production`, `HOST=127.0.0.1` (or the private interface required by the host), `PORT`, and a canonical HTTPS `PUBLIC_SITE_URL`. Configure secrets through the host's secret manager; `.env.example` only documents variable names. Production contact/newsletter/application endpoints remain fail-closed until their required keys, retention periods, provider, sender, privacy contact and upload scanner are configured. Never deploy the example configuration as-is.

The current backend stores records in a private JSON file and CVs in a private local directory. It is a single-process prototype; before multi-worker/replica production use, move to reviewed durable storage with encryption, backup, locking, access controls and a tested restore plan. Admin sessions are in memory. Use a private admin network until individual admin accounts, MFA, persistent sessions and operational review are ready.

## Main files

- `index.html`, `fr/index.html`, `en/index.html`: language entry documents; `server.js` renders routed page content.
- `styles.css`, `script.js`: responsive design system, light/dark mode, accessible navigation and progressive interactions.
- `content.js`, `render.js`: bilingual content and server-side HTML views.
- `server.js`: routes, forms, private storage, newsletter operations, admin APIs and security headers.
- `admin-page.js`, `admin.js`: role-controlled content/operations interface.
- `public/assets/brand/`: approved logo variants and favicon assets.
- `assets/team/`: supplied portraits retained in the private source tree pending documented rights/consent; not served publicly.
- `docs/`: QA findings, open company/legal items, security notes, and asset/consent/third-party registers.

## Launch gate

Complete `docs/pre-launch-checklist.md`, counsel review of legal pages, and manual keyboard/screen-reader/responsive/security checks. The site intentionally hides missing corporate identity, contact, project, job, client, news and performance details instead of inventing them.
