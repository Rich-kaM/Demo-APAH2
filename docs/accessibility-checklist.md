# Accessibility review

## Implemented

- Semantic page shell, one main landmark, skip link, headings, labelled forms and visible keyboard focus.
- Keyboard-operable navigation, search, theme controls and Services & Industries disclosure; mobile menu supports Escape, focus entry/return and tab containment.
- Contact/newsletter/application forms include visible labels, required indicators, field limits and an error summary with focused feedback.
- Dark and light themes, scalable system fonts, responsive layouts, reduced-motion support, and no color-only error state.
- The service switch uses native buttons with `aria-pressed`; decorative marks are hidden from assistive technology.

## Verification required before claiming WCAG conformance

- Automated accessibility engine (axe or equivalent) across all route templates and both themes.
- Manual keyboard-only navigation including 320 px viewport, mobile menu, dropdown, CAPTCHA load/failure and form validation.
- Screen reader review in French and English, including form error announcements and all 404/500/503 paths.
- Browser zoom/text enlargement to 200–400%, portrait/landscape reflow and reduced-motion preference.
- Measured contrast for every text/state combination in both themes and focus visibility where overlays are present.
- Confirm a practical alternative if Google reCAPTCHA is inaccessible or unavailable.

No WCAG conformance claim is made until these checks and remediation are complete.
