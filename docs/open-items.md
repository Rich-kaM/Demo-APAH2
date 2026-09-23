# Company input and legal review before launch

The public website currently omits facts that were not supplied. Resolve the items below before publishing the production site.

## Company input

- Provide/verify corporate records for the legal name `Africa Power Advisory Holding` and the brand `Africa Power Advisory Holdings`; the master prompt identifies the legal entity as a SARL in Kinshasa, DRC, but explicitly says corporate documents are the authority and asks the company to resolve any legal-name/brand discrepancy. Add official registration/tax identifiers, full postal address and authorized representative after review.
- Supply the approved public contact email, phone, postal address, official domain, social accounts and inquiry-notification recipient.
- Confirm the brand spelling and approved logo variants, usage rights, and company ownership/permission records.
- Before production launch, confirm photographer rights and individual release records for the three supplied co-founder photographs. The user explicitly directed that these supplied portraits be used on the site; the fourth co-founder keeps a monogram because no portrait was supplied.
- Verify each supplied expert's current title, employer/affiliation, credentials, awards/claims and biography wording. Confirm the user-provided English statements and review the French translations.
- Approve the translated service taxonomy, sector descriptions, company overview, sustainability language and all public page copy.
- Provide verified project, insight, actuality/news and open-role material if those sections should contain entries. Each post/job must be reviewed and published by the assigned content approver; role details require department, location, contract type, closing date and reference.
- Provide final favicon/app icon approval, a company-owned social preview image, font licence/source if custom fonts are desired, and image licences for any future campaign visuals.
- Approve a multi-resolution PNG/app icon set if installable PWA or native launcher icons are required; the current manifest provides the SVG favicon only.
- Confirm who can administer/edit/approve content, who can review applications, and provide separate accounts, MFA, reset and incident processes before making `/admin` public.

## Legal/privacy/security review

- Have qualified counsel in the DRC and relevant operating jurisdictions review the legal notice, privacy notice, recruitment notice, cookie/consent text, terms, reCAPTCHA use, newsletter language, accessibility statement and international data transfers.
- Decide and document contact, application, newsletter and audit-log retention periods and deletion/backup purge behavior. Approve lawful basis, rights request handling, privacy owner/contact, records, consent language and age/eligibility handling.
- Select hosting, mail, database/object storage, malware scanner and CAPTCHA providers. Record processors/sub-processors, locations/transfers, retention, DPAs, security measures, verified sending domain, suppression list, incident contacts and availability commitments.
- Confirm HTTPS/TLS reverse proxy, HSTS scope, secret management, encrypted storage/backups, restoration, monitoring, access logs and incident response.
- Replace local JSON/in-memory sessions before multi-process or high-volume deployment. Complete independent application/security review, upload scanning tests and penetration testing.
- Run manual WCAG 2.2 AA checks with keyboard, screen readers, magnification and reflow at 320 px; review focus/contrast/errors in both themes. Remediate findings before declaring conformance.

## Known instruction conflict

The requested “everything mandatory” contact form conflicts with the master prompt's data-minimization guidance and the company's lack of phone/organization requirements. The current form requires name, email, topic, message, privacy acknowledgment and CAPTCHA; phone and organization remain optional to avoid collecting unnecessary personal data. Change this only after privacy/legal review.
