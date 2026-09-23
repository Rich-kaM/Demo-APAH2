# Security checklist

## Implemented in the local Node app

- Allowlist static files from `public/`; source, team photographs, private data, prompts and scripts are not served.
- Path resolution is constrained to `public/`; unknown paths return a localized 404 status.
- Escaped server-rendered content, content-security policy, `nosniff`, clickjacking, referrer and permissions headers.
- Production HSTS; HTTPS reverse proxy is required before production.
- `HttpOnly`, `SameSite=Strict`, production `Secure` cookies; double-submit CSRF checks and same-origin checks for forms.
- Body size ceilings, per-IP rate limits, honeypots, generic sign-in responses, input length/type checks, HTML and file-signature checks.
- CVs stored with private directory/file modes, randomized names, signed one-use 5 minute reviewer grants, attachment-only responses and audit events.
- Admin passwords verified using scrypt hashes; session IDs are random and rotated at sign-in, with 8-hour expiry and role checks.
- Admin routes fail closed in production unless the operator confirms a private-network reverse-proxy ACL using `ADMIN_ACCESS_MODE=private-network`; the application itself does not provide MFA or enforce an IP allowlist.
- Email sends have a daily cap; newsletter confirmation is double opt-in, tokens are hashed at rest and expire after 24 hours, and there is an emergency newsletter shutdown switch.
- Retention deletion runs daily in production using legal periods supplied via environment; sandbox outbox expires after one day.
- No secrets or credentials included in source.

## Not production-cleared

- Configure a real mail delivery provider with verified sender, suppression handling, retries, signed webhook/API credentials, and an approved processor agreement.
- Choose persistent database/backup strategy and storage encryption. The current private JSON store is a single-process prototype and must not be shared by multiple workers or hosts.
- Add MFA, individual administrator accounts, secure password reset and an external session store before a public admin deployment.
- Configure antivirus (`FILE_SCAN_COMMAND`), test failure cases, and review file retention and reviewer access.
- Confirm HSTS/HTTPS reverse proxy, TLS, backups, monitoring, security logs, incident response, dependency/SBOM process and penetration review.
- Configure reCAPTCHA site/secret keys and confirm legal basis, cookies and transfer terms. The local test mode is never valid in production.
- Legal form endpoints stay fail-closed until legal notices, newsletter consent and recruitment notices are explicitly approved in production configuration.
- External security audit and production threat modeling are outstanding.
