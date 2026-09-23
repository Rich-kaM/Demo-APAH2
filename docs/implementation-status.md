# Phase reports

## Phase 1 — HTML, CSS, JavaScript foundation

- **Built:** dependency-free Node server with server-rendered HTML, shared bilingual navigation/footer, responsive design tokens, light/dark mode, mobile menu, favicon, 403/404/500/503 views.
- **Checked:** all source files pass `node --check`; shared route and link checks cover 82 French/English page/detail renders.
- **Waiting:** browser-based 320 px and assistive-technology QA; approve logo/favicons and confirm final language copy.

## Phase 2 — Public content

- **Built:** Home, About, merged Services & Industries and detail pages, Sustainability, Experts, Insights, Projects, Actuality, Careers, Contact, newsletter entry and site-wide search. Uses the supplied biographies; hides unpublished or unverifiable projects, insights, news and jobs.
- **Checked:** all static section/detail routes render in both languages; HTTP smoke checks include Home, Contact, Services, Experts, Actuality, Careers and 404. Internal links were checked across 82 renders.
- **Waiting:** company approval of the service taxonomy, biographies/translations and current titles; verified entries for editorial/project/job sections; approved portrait rights and contact details.

## Phase 3 — Legal and consent

- **Built:** bilingual draft Terms, Privacy, Cookie, Legal Notice, Accessibility, Consent Management and Recruitment Privacy pages; minimal first-party preference storage; no analytics/advertising; explicit user action before CAPTCHA loads.
- **Checked:** rendered with route metadata and scanned for common placeholders; consent controls were exercised in local runtime tests.
- **Waiting:** qualified legal review, privacy owner/contact, full postal and registration details, lawful bases, retention periods, CAPTCHA transfer/cookie review, cookie classification and approved newsletter/recruitment wording.

## Phase 4 — Forms, newsletter and admin

- **Built:** mandatory contact fields and CAPTCHA, private contact storage, double opt-in and unsubscribe confirmation flows, preferences, rate limits, email sandbox/webhook, CV validation/private storage/scanning hook, admin roles/content workflow, approval/publishing and audit events.
- **Checked:** local synthetic workflow checks passed 25/25 across HTTP/form flows; isolated admin sign-in/draft/approve/publish/detail tests passed 6/6. QA records and uploaded file were removed by exact ID/email.
- **Waiting:** production email provider and agreements, sender/authentication, reCAPTCHA keys, AV scanner, legal approvals and periods, multiple named admin identities/MFA, durable database/session architecture and backup controls.

## Phase 5 — Security, privacy and accessibility hardening

- **Built:** CSP and response headers, HTTPS-only production origin requirement for forms, production HSTS, CSRF/same-origin checks, rate limits, limited data collection, role checks, private file handling, production admin network gate, retention sweeper and no secrets in source.
- **Checked:** production-mode local smoke confirmed HSTS, sitemap/robots, hidden admin endpoints, and a contact API fail-closed response when provider/approval settings are absent.
- **Waiting:** manual WCAG 2.2 AA/browser testing, threat model and independent security review, configured TLS/network controls, scanner and encryption/backup strategy. This prototype is single-process and not multi-host safe.

## Phase 6 — Site-wide checks and QA

- **Built:** rendered public-content scanner, internal-link checker and `/docs/qa-report.md`.
- **Checked:** `npm run check` passes; 82 bilingual route/detail renders pass content/meta/heading/asset checks and rendered internal-link checks.
- **Waiting:** Playwright/axe/Lighthouse, HTML validator, manual viewport/screen-reader/contrast checks and production-domain canonical/indexing verification.
