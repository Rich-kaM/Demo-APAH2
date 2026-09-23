# Third-party services register

Status: no analytics, advertising, social embeds, maps, external fonts, or tracking pixels are loaded by default.

| Service | Purpose | Data the service can receive | Consent / control | Processor / transfer review |
|---|---|---|---|---|
| Google reCAPTCHA v2 | Bot verification on the contact form | CAPTCHA response and technical connection/browser signals; Google may set/read technical cookies | Not loaded until the visitor actively selects “Load Google reCAPTCHA”; this requires legal review and the visitor may abandon the form | Google terms, data processing terms, transfer locations, cookie behavior, retention, and DRC legal basis must be reviewed before production |
| Email webhook (optional, unconfigured) | Send confirmation and notification emails | Recipient email, message content, language, consent/confirmation links | No provider is selected or called in the current workspace; production forms stay disabled until configured | Provider, sub-processors, location, retention, DPA and email domain authentication must be registered before use |
| Host / reverse proxy (not selected) | Serve the Node application over HTTPS | Request IP, requested path, essential security logs | Host is not configured in source; no analytics are written by the app | Name, jurisdiction, logs, backups, retention and access roles must be supplied before deployment |

Development email is written to `data/private/outbox.jsonl` with file mode `0600`, never returned in a public response, and removed after one day on startup. The local reCAPTCHA test mode is enabled only with `RECAPTCHA_MODE=test` outside production; it is a local QA checkbox, not Google verification.
