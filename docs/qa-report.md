# QA report

**Run date:** 2026-09-23  
**Build:** dependency-free Node.js 20+ application; plain HTML/CSS/browser JavaScript with server rendering.

## Passed

- JavaScript syntax checks passed for the server, render/content modules, admin UI, browser scripts and check scripts.
- `npm run check` passed:
  - Content/meta/heading/asset checks: 82 bilingual route/detail renders plus six bilingual error-template renders (403, 500 and 503).
  - Rendered internal-link checks: 82 bilingual page/detail renders; 0 external links found in those render templates.
- Development-mode HTTP smoke checks: 17/17 passed for language routes, assets, contact/services/expert/news/careers pages, response security headers and localized 404s.
- Synthetic local form tests: 25/25 passed for contact submission, newsletter signup, non-mutating confirmation/unsubscribe GETs, double opt-in POST, unsubscribe POST, private CV storage, static assets, security headers and unauthenticated admin denial.
- Temporary administrator workflow: 6/6 passed for sign-in, draft creation, approval, publication, published project rendering and audit visibility.
- Production-mode local checks verified HSTS, canonical/robots/sitemap behavior, hidden admin endpoints and contact rejection (HTTP 503) while required configuration is absent.
- Explicit localized 403/500/503 render templates passed structural checks; unknown URLs returned real localized HTTP 404 responses in runtime smoke tests.
- Synthetic records, temporary CV and QA-admin publication were removed by matching their exact QA identifiers. Private storage contains no QA inquiry/application/subscriber/project after cleanup.

## Not verified / launch blockers

- No Playwright/browser, axe, Lighthouse CI, HTML validator or contrast calculator is installed in this project; no network installation was attempted.
- Horizontal overflow at 320/375/768/1024/1440 px, landscape layout, keyboard-only operation, screen readers, browser zoom, reduced motion and real CAPTCHA accessibility still need manual/browser testing.
- No actual production host/domain, legal approval, mail provider, reCAPTCHA keys, malware scanner or retention periods are configured. Production forms correctly fail closed. Production sitemap contains the configured canonical host only after `PUBLIC_SITE_URL` is set.
- The production-mode Secure-cookie form test needed the test CSRF cookie to be supplied explicitly over loopback HTTP; the normal browser flow must be verified behind HTTPS.
- There are no approved project/news/insight/job records, so CMS detail fields and content-specific filters were tested with one synthetic project only; no company content was published by that test.
- Logo/photo permissions, translated copy and biographies still require company verification. Team photographs are not served.
- This JSON/in-memory backend is a single-process prototype; multi-instance persistence, encrypted backups, MFA, named user management and operational monitoring are not production-ready.
- No custom hero photo or font is included. The hero illustration is original CSS; system fonts avoid third-party font requests. Public logos are small SVG files (845 bytes each); favicon is 353 bytes. No raster photographs are served, so there are no public raster images to compress.
- CSS and browser JS are small (27,245 bytes and 9,915 bytes respectively) but are not content-hashed or Brotli/gzip-compressed by this server.

## Overall

The local prototype and automated render checks pass. This is **not production-cleared** until the legal/company inputs in `open-items.md`, manual browser/accessibility tests, service-provider setup and infrastructure/security items are completed.
