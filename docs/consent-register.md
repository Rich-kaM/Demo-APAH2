# Consent register

| Data / asset | Consent or legal basis captured | Current state | Retention / action |
|---|---|---|---|
| Contact inquiry | Explicit privacy acknowledgment, required; purpose is responding to request | Implemented; no live submissions in this development build | Set positive retention period and privacy contact; counsel to approve notice and acknowledgment |
| Newsletter | Unchecked, separate consent; records wording version, source, request and confirmation timestamps; double opt-in | Implemented in the local backend; outbound messages go only to private dev sandbox | Choose cadence/content wording; set retention, provider/DPA and sender; counsel review; complete real confirmation/unsubscribe integration test |
| Job application | Required recruitment privacy acknowledgment; separate unchecked optional future-retention consent | Implemented with secure local upload and access logging; production form fails closed | Set retention/deletion period, recruiter roles, scanner and storage; counsel review |
| Google reCAPTCHA | Visitor action required before loading third-party script | Local test checkbox only; production requires keys and remains closed until configured | Complete legal/cookie/transfer review; determine accessible alternative |
| Theme / cookie notice | First-party functional browser storage; no analytics or ads | Implemented; banner is informational, not marketing consent | Counsel to classify functional storage and approve copy/retention |
| Expert photographs | User expressly instructed that the three supplied co-founder photos be used on the site; individual releases and photographer rights are not documented in this workspace | Three supplied portraits are shown; the fourth co-founder remains represented by initials because no photo was supplied | Confirm photographer rights and individual releases before production launch |
| Company logos | Supplied assets; no written licence record in this workspace | Used as supplied for site implementation; rights documentation pending | Retain authorization and approve favicon crop/variants |

No tracking, analytics, advertising cookies, newsletter pixels or click tracking are enabled.
