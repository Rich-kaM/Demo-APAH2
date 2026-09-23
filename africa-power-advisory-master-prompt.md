# MASTER VIBE-CODING PROMPT: AFRICA POWER ADVISORY HOLDINGS WEBSITE

> Paste everything below into your vibe-coding AI. Items marked `[TO BE VERIFIED]` or `[TO BE SUPPLIED]` are markers for information the company must approve. They live only in content files and the checklist. The AI must never invent the information, and these markers must never appear on the public website (see Section 24).

---

## 1. ROLE AND GOAL

You are a senior full-stack engineer, UX designer, accessibility specialist and security reviewer.

Build an **original, professional, secure and accessible corporate website** for **Africa Power Advisory Holdings**, a Democratic Republic of Congo energy advisory and power-sector consulting company.

The site must be production-ready and suitable for real business use. It must never rely on fabricated information, copied competitor material, insecure shortcuts or unsupported claims.

### New requirements in this version

In addition to the original scope, the site must include:

1. **An Actuality page (company news hub)** where all company actuality is published.
2. **A Careers page** with a secure, privacy-compliant application process.
3. **A Newsletter button and subscription system** with proper consent (double opt-in).
4. **A language button (French / English)** and a fully bilingual website.
5. **Site-wide quality fixes** applied to every page: no horizontal scrolling or mobile overflow, a working mobile menu, a clickable logo, phone number and email, favicon, correct page titles and meta descriptions, working footer links and buttons, no broken links, a custom 404 page, a current copyright year, compressed images, success and error messages, and no placeholder text.

6. **A design direction** based on the two reference screenshots (Section 14) and a **single merged Services & Industries page** (Section 4).

These are specified in full in Sections 4, 8, 9, 10, 13, 14 and 24.

---

## 2. COMPANY SOURCE OF TRUTH

The company's corporate documents are the only authority for legal identity, corporate purpose and stated activities.

- Company: Africa Power Advisory Holding (brand used on the site: Africa Power Advisory Holdings). Use the exact legal name from the documents on legal pages and in the footer, and flag any discrepancy between the legal name and the brand name for the company to resolve.
- Legal form: SARL
- Registered office: Kinshasa, Democratic Republic of Congo
- Purpose: supports industrial, commercial and institutional clients in the analysis and optimization of the electricity sector. Stated activities include technical, economic, financial and environmental assistance, feasibility studies, energy audits, electricity generation and network projects, energy efficiency, smart grids, energy management, energy transition, industrial decarbonization, carbon markets, regulation, electricity procurement and PPA-related activities.

**Before deployment, the company must verify and supply** (use `[TO BE VERIFIED]` placeholders until then):

- Official telephone number, official email, physical address
- Website domain
- Company registration information and tax information where required
- Privacy contact and legal representative
- Official social-media accounts

---

## 3. POSITIONING AND TONE

**Core positioning:** "Strategic Energy Advisory and Power Solutions for Africa."

**Supporting statement:** "Helping utilities, governments, industries, investors and energy developers make better energy decisions, optimize power infrastructure and develop sustainable energy projects."

The site sits at the intersection of: Energy Advisory, Power Systems, Energy Infrastructure, Energy Projects, Power Procurement, Energy Efficiency, Data and Analytics, Smart Grid and Digital Energy, Regulation and Policy, Energy Transition.

The site must communicate: Strategic, Technical, Data-driven, African, Professional, Infrastructure-focused, Investment-aware, Sustainable, Reliable.

### Reference companies (concept only)

- **Power Advisory LLC**: inspiration for the strategic consulting side (market analysis, forecasting, economic and financial analysis, feasibility, procurement, project development, investment analysis, regulatory and policy advisory, PPA advisory, business strategy).
- **BBA Consultants**: inspiration for the technical and infrastructure side (power systems, infrastructure, asset management and analytics, predictive analysis, reliability, maintenance and investment planning, load forecasting, grid modernization, smart grids, risk management, digital transformation, renewable integration, energy transition).

**Do not copy** either company's website, text, layouts, branding, logos, employee profiles, photographs or source code. Use them only to understand the business type, service architecture, professional presentation and information structure.

---

## 4. SERVICE ARCHITECTURE

1. **Energy Advisory**: electricity market analysis, energy forecasting, economic studies, financial analysis, feasibility studies, investment advisory, energy-sector research, business strategy
2. **Power Systems and Infrastructure**: generation, transmission, distribution, power-system and infrastructure planning, smart grids, energy management systems, grid modernization, technical studies
3. **Energy Projects**: solar, hydropower, wind, biomass, thermal, project development, engineering support, project supervision
4. **Power Procurement**: procurement strategy, PPA advisory, contract analysis, negotiation support, energy supply strategy
5. **Energy Efficiency and Optimization**: energy audits, consumption analysis, energy-cost optimization, industrial efficiency, energy management, operational optimization
6. **Energy Transition and Sustainability**: energy transition, industrial decarbonization, carbon-footprint assessment, carbon markets and credits, green certificates, renewable integration, energy storage
7. **Regulation and Policy**: sector regulation, regulatory monitoring, public policy analysis, regulatory advisory, policy research, compliance support
8. **Data and Energy Intelligence**: data analysis, demand forecasting, market intelligence, dashboards, asset analytics, performance monitoring, predictive analytics, decision-support systems

**Target sectors:** utilities, government, mining, industrial companies, commercial companies, energy developers, power producers, investors, infrastructure companies, financial institutions, development partners, large electricity consumers.

### Services & Industries: one merged page and menu *(new)*

Services and Industries are **no longer separate pages or menu items**. They form one section called **Services & Industries** (French: **Services et secteurs** `[TO BE CONFIRMED]`).

- **Hub page:** `/en/services-industries` and `/fr/services-et-secteurs`. It has two clearly labelled parts on the same page, with a "By service | By industry" toggle and anchored sections (`#services` and `#industries`). Without JavaScript, both parts appear stacked.
  - **What we do:** every service line as a card with a short verified description and a link to its detail page.
  - **Who we serve:** every sector (utilities, government, mining, industrial and commercial companies, energy developers and power producers, investors and financial institutions, infrastructure companies, development partners, large electricity consumers) as a card linking to its detail page.
  - Optional: choosing an industry highlights the relevant services, and choosing a service lists the relevant industries. Show only relationships the company confirms.
- **Detail pages** remain individual pages for depth and search visibility, under the same section: `/services-industries/services/[slug]` (for example energy advisory) and `/services-industries/industries/[slug]` (for example mining). Each links to related services or industries, verified related projects, related Insights and Actuality, and a contact call-to-action.
- **Navigation:** one top-level item, "Services & Industries", whose dropdown (desktop) or accordion (mobile) has two groups, "Services" and "Industries". The footer has one matching column.
- **Redirects:** old `/services` and `/industries` URLs and their child pages redirect permanently (301) to the matching new URLs. Update the sitemap, breadcrumbs, canonical URLs and `hreflang` links, and leave no broken links (Section 24.3).
- Use only verified company information on every page in this section.

---

## 5. NAVIGATION (UPDATED)

**Primary navigation:**

- Home
- About Us
- **Services & Industries** *(merged into one item, see Section 4)*, with two groups in its dropdown:
  - Services: Energy Advisory, Power Systems, Energy Projects, Power Procurement, Energy Efficiency, Smart Grid and Digital Energy, Energy Transition, Regulatory and Policy, Data and Analytics
  - Industries: Utilities, Mining, Government, Industrial, Commercial, Investors, Energy Developers
- Projects (Case Studies, Project Portfolio, Technical Experience)
- Insights (Research, Energy Market Reports, Articles, Regulatory Updates, Publications)
- **Actuality** *(new)*
- Sustainability (Energy Transition, Decarbonization, Carbon Management)
- Experts (Leadership, Energy and Power Advisory Experts)
- **Careers** *(new)*
- Contact

**Header utility area:** a visible **"Subscribe to Newsletter"** button *(new)* next to the primary call-to-action, plus a **language button (FR | EN)** *(new)* on every page, on desktop and in the mobile menu (see Section 13).

**Footer:** company legal name, registered office, quick links, Actuality, Careers, **newsletter sign-up** *(new)*, **language button (FR | EN)** *(new)*, and legal links: Terms and Conditions, Privacy Policy, Cookie Policy, Refund Policy (only if paid services exist), Consent Management, Accessibility Statement, Legal Notices.

**Navigation quality rules:** one primary navigation, one footer navigation and one mobile menu built from the same source data, with no duplicate or leftover navigation anywhere. The logo, phone number and email must be clickable. See Section 24.2 and 24.3.

---

## 6. HOMEPAGE STRUCTURE (UPDATED)

1. **Hero:** "Africa Power Advisory Holdings" with the core positioning line. Buttons: **Discuss a Project**, **Request Advisory**, **Speak With an Energy Expert**.
2. **Services & Industries** *(merged)*: one section with a "By service | By industry" toggle that shows the core expertise areas (energy advisory, power systems, energy projects, power procurement, energy efficiency, smart grid and digital energy, energy transition, regulation and policy, data and analytics) and who we serve (utilities, mining, government, industry, investors, energy developers). It links to the merged Services & Industries page (Section 4).
3. **Energy Intelligence:** visual dashboards and charts (electricity demand, generation capacity, renewable capacity, energy costs, market indicators, asset performance, project pipeline). Use real company data or **clearly labelled demonstration data**. Do not invent statistics.
4. **Project Development:** generation, transmission, distribution, renewables, infrastructure.
5. **Energy Transition:** efficiency, renewables, storage, decarbonization, carbon management.
6. **Featured Projects:** verified projects only. If none are verified, hide the section.
7. **Latest Actuality** *(new)*: the 3 most recent **published** Actuality items, with a "View all Actuality" link. If none exist, hide the section or show a neutral empty state. Never show placeholder news as if it were real.
8. **Insights:** research, market reports, regulatory updates, industry analysis, publications.
9. **Meet Our Energy and Power Advisory Experts:** see Section 7.
10. **Careers teaser** *(new)*: short "Join Our Team" block linking to the Careers page.
11. **Newsletter strip** *(new)*: compact sign-up block (see Section 10).
12. **Contact:** Discuss a Project, Request Advisory, Speak With an Energy Expert.

---

## 7. EXPERTS SECTION

**Title:** "Meet Our Energy and Power Advisory Experts"

**Supporting text:** "Our multidisciplinary team brings together expertise across energy advisory, power systems, infrastructure, asset management, analytics, project development and energy transition."

Create **four expert profile cards**. Each card: professional photograph, full name, verified job title, specialization, short biography, key expertise, **Read Bio** button (opens an accessible dialog or dedicated bio page).

- Experts 1 to 3 are the company's **three co-founders**, shown with the **three authentic photographs supplied by the company**. Follow the asset instructions in "Supplied assets" below, and keep a license and consent record for each photograph.
- Expert 4 uses a **company-branded placeholder** (branded initials, abstract profile illustration or neutral portrait placeholder) until an approved photograph is supplied. Never use an unrelated person's face.
- All names, titles, experience, qualifications and biographies must come from information **approved by Africa Power Advisory Holdings**. Store them in a content file marked `[TO BE SUPPLIED]`. Do not invent identities or credentials.
- Never use stock photographs of people or photographs of BBA or Power Advisory employees.
- Add a **"Let's Talk Together"** button leading to the Contact / Request Advisory page.
- Verify ownership or licensing of every team photograph before publication.

### Supplied assets: company logo and co-founder photographs

The company already owns the logo and the three co-founder photographs. They will be placed in the project before the build. Use them exactly as supplied.

**Company logo** (`/assets/brand/`)

- Expected files: the logo in its best available format (`logo.svg` preferred, otherwise a high-resolution transparent `logo.png`), plus any light or dark variants and a separate logo mark or icon version if one exists.
- Use the logo as supplied. Do not redraw, recolor, stretch, distort, add effects to, or replace it. Keep clear space around it and never shrink it below a readable size.
- If only a low-resolution image is available, do not upscale it. Use it at its native size and list in the checklist that a vector or higher-resolution version is needed.
- Use it in the header (clickable to the home page), footer, favicon and app icons (from the logo mark or a clean crop of it), social sharing image, email templates (newsletter confirmation and newsletters), admin login and error pages.
- Check that the logo is legible on every background it appears on. Following the design direction in Section 14, the logo appears in full color on light backgrounds and as a single-color white version on dark navy backgrounds. Use the supplied white variant. If none exists, list it in the checklist for the company to supply, and only as a temporary fallback render the same logo in plain white with the company's approval. Never change the logo's shape, proportions or spacing.
- Take the site's accent color from the logo's colors, keeping the navy, white and neutral gray base and accessible contrast (Section 18).

**Co-founder photographs** (`/assets/team/`)

- Three photographs, one per co-founder, mapped to people through a content data file (not through guesses from file names).
- The company must supply, for each co-founder: full name as they want it published, exact job title wording `[TO BE SUPPLIED]`, specialization, short biography in French and English, key expertise, and confirmation that the person consents to publication.
- Do not guess or invent names, titles, qualifications or biographies from the photographs or file names. Never try to identify anyone from their face.
- Use the photographs as supplied. No face-altering retouching, no AI enhancement or generation, no background swapping. Allowed: consistent cropping to one aspect ratio (for example 4:5) with the face centered, resizing, and compression (Section 24.10). Keep the uncompressed originals in a private folder outside the public web directory.
- Alt text once approved: "Portrait of [full name], [title]".
- In the license and consent register, record for each photograph who owns it (photographer or company), that the company has the right to publish it, and the written consent of the person shown. Publication of a photograph is blocked until this is recorded.
- Use one shared data source for each co-founder so that the Experts section, the Leadership page and the About page always show the same name, title and biography.
- If a file is missing or unreadable, report it. Never substitute another image.

---

## 8. ACTUALITY PAGE (NEW)

**Purpose:** the single place where all company actuality is published: what Africa Power Advisory Holdings is doing, announcing and taking part in. It is distinct from **Insights**, which holds research, analysis and technical publications.

**URL:** `/actuality` (and `/actualites` if French is enabled).

### Content types allowed

- Company announcements
- Verified project milestones
- Events, conferences and participations
- Press releases
- Media mentions (only real, linkable coverage)
- Verified partnership announcements
- Team announcements (only with the person's approval)
- New service launches
- Recruitment announcements (linking to Careers)
- Newsletter archive

### Page features

- Featured item at the top, then a paginated grid or list of items
- **Search** and **filters** by category, year and related service
- Publication date and author or department on every item
- Individual article pages with clean URLs (`/actuality/[slug]`), semantic markup, reading-friendly layout, related items and a "Subscribe to Newsletter" call-to-action
- Sharing via plain links only (no third-party share scripts or trackers)
- RSS feed (optional)
- Downloadable attachments only when authorized by the company
- SEO: unique title, description, canonical URL, Open Graph metadata, `NewsArticle` structured data, inclusion in the sitemap
- **Empty state:** if nothing is published, display a neutral message such as "No news has been published yet. Subscribe to our newsletter to be informed of company updates." Never seed fake news.

### Data fields per item

Title, slug, category, publication date, last-updated date, summary, body, cover image (licensed or owned, with alt text and license record), author or department, tags, related service, attachments (optional), status.

### Editorial workflow

- Statuses: **Draft, In review, Approved, Published, Archived**
- Only authorized users can create or edit; a separate approver role publishes sensitive corporate content
- Audit log of create, edit, publish and unpublish actions
- Scheduled publishing (optional)

---

## 9. CAREERS PAGE (NEW)

**URL:** `/careers`

### Content

- Introduction to working at Africa Power Advisory Holdings (only statements the company approves)
- Areas where the company may recruit: energy advisory, power systems engineering, project development, data and analytics, regulatory and policy, business development, administration (**adjust to the company's real needs**)
- **Open positions list** with search and filters (department, location, contract type)
- **Spontaneous application** option
- Recruitment process overview `[TO BE VERIFIED]`
- Equal-opportunity statement `[TO BE VERIFIED]`
- Link to the recruitment privacy notice

### Rules

- **Do not invent job openings, salaries, benefits, team size, culture claims or awards.** If no position is approved, show "No open positions at the moment" together with the spontaneous application form.
- Each job posting fields: title, department, location, contract type, description, responsibilities, requirements, closing date, reference number, status (Draft, Published, Closed).
- Job posts are managed from the admin area by authorized roles only.

### Application form (minimum necessary data)

- Full name, email address, phone number (optional), position applied for
- CV upload (PDF or DOCX) and optional cover letter or message
- Optional links (professional profile, only if the company wants them)
- Do **not** request unnecessary sensitive data (no photo, national ID, marital status, religion, ethnicity, date of birth unless legally required and justified)
- A required **privacy acknowledgment** explaining what data is collected, why, who receives it, how long it is kept and how to request deletion
- Separate, **unchecked** optional consent to keep the application for future opportunities

### Security and privacy for applications

- Treat every CV upload as untrusted: allowlist file types, validate MIME type and file signature, enforce size limits, rename files safely, prevent path traversal, scan for malware, store outside the web root or in private object storage, never execute or serve uploaded files inline, use signed short-lived download links for reviewers
- Spam and bot protection and rate limiting on the form
- Applications visible only to authorized recruitment roles, with an audit log of access and downloads
- Defined **retention period** for applications `[TO BE DEFINED WITH LEGAL REVIEW]` and an automatic deletion routine
- Applicant confirmation email that does not leak other applicants' data, and no account-enumeration behavior
- Accessible, keyboard-friendly form with clear labels and descriptive errors

---

## 10. NEWSLETTER BUTTON AND SUBSCRIPTION SYSTEM (NEW)

### Placement

- **"Subscribe to Newsletter" button** in the header (desktop and mobile menu)
- Sign-up block in the footer, the homepage strip, the Actuality page and Actuality article pages
- The button opens an accessible modal dialog or navigates to `/newsletter`

### Form

- **Email address** (required). First name and organization are optional and only if the company has a reason to collect them.
- Optional topic preferences: Company Actuality, Insights and Research, Regulatory Updates, Careers Alerts `[adjust to real newsletter plan]`
- Store the subscriber's language (French or English) from the active site language. Send the confirmation email and every newsletter in that language, and let the subscriber change it on the preference page.
- **Consent checkbox, unchecked by default**, with clear text explaining what will be sent, how often `[TO BE VERIFIED]`, who sends it and how to unsubscribe. Link to the Privacy Policy.
- Never pre-check consent. Never bundle newsletter consent with a contact form, advisory request or job application. Never subscribe anyone automatically.

### Behavior and compliance

- **Double opt-in:** send a confirmation email with a single-use, expiring token. Subscribe only after confirmation.
- Store a **consent record**: email, timestamp, consent text version, source page and confirmation timestamp. Keep IP data minimal or hashed, and only if justified.
- Every email contains a working **one-click unsubscribe** link and the company's identity and address. Maintain a suppression list.
- A **preference and unsubscribe page** that requires no login.
- Generic responses that prevent email enumeration ("If this address can be subscribed, you will receive a confirmation email").
- Honeypot or privacy-friendly CAPTCHA, rate limiting per IP and per email, and disposable-email abuse controls.
- **Abuse and cost protection:** cap confirmation emails per address and per hour, cap total outbound emails per day, alert on spikes, and include an emergency shutdown switch for the sign-up endpoint.
- Document the email service provider as a third-party processor and the data it receives. Load no tracking pixels or click-tracking by default. Add tracking only with a documented legal basis and consent.
- Reflect newsletter processing in the Privacy Policy, Cookie Policy and Consent Management page.

---

## 11. INSIGHTS SECTION

Create pages for energy market analysis, research, articles, regulatory updates, energy reports and technical publications. Include search and filtering, publication dates and author information where appropriate. Offer downloadable reports only when authorized. Protect premium or paid reports if such a model is introduced.

## 12. PROJECTS AND CASE STUDIES

Professional project area with **verified information only**. Fields: project name, country, sector, client (only when authorized), project type, services provided, technical scope, status, year, outcomes (only when verified). Do not invent clients, results or case studies.

## 13. INTERNATIONAL AND LANGUAGE FOCUS

- The company is based in the DRC. Present the African regional orientation (DRC, Central Africa, Great Lakes, Sub-Saharan Africa) **only where supported by real activities and plans**.
- Do not claim presence in countries without verified presence. Do not create fake offices. Do not claim international projects without evidence.
### Language button and bilingual site (French / English) *(new, required)*

**Languages:** French (Français) and English. French is the official language of the DRC, so French is the default language `[TO BE CONFIRMED BY THE COMPANY]`.

**The language button**

- A visible language button on **every page**, in the header (desktop and mobile menu) and repeated in the footer.
- Shows the two options as text: **FR | EN**, with the full names "Français" and "English" as accessible labels. Do not use flags alone (flags represent countries, not languages).
- The active language is clearly indicated (not by color alone) and marked with `aria-current="true"`. Each option carries its own `lang` attribute (`lang="fr"`, `lang="en"`) so screen readers pronounce it correctly.
- Fully keyboard accessible, with a visible focus state and a clear accessible name (for example "Passer en français" / "Switch to English"). If a dropdown is used, it must follow accessible menu patterns.
- Switching keeps the user on the **equivalent page** (same section, article, job posting or form). If no translation exists for that page, send the user to the closest parent page with a short notice. Never show a 404.

**Routing and SEO**

- Separate URLs per language: `/fr/...` and `/en/...`, with translated slugs where practical (for example `/fr/actualites` and `/en/actuality`, `/fr/carrieres` and `/en/careers`).
- Correct `<html lang="fr">` or `<html lang="en">` on every page, `hreflang` alternates (`fr`, `en`, `x-default`), canonical URLs per language, per-language titles, meta descriptions, Open Graph locale and sitemap entries.
- On a first visit with no language in the URL, use the browser's `Accept-Language` header only as a suggestion and default to French. Never create redirect loops and never override a language the user chose manually.

**Remembering the choice**

- Store the choice only as a small first-party functional preference (cookie or local storage) that contains no personal data. The URL remains the primary source of truth; the stored preference only sets the default on return visits.
- Document this preference in the Cookie Policy and confirm with legal review whether it counts as strictly necessary.

**What must be available in both languages**

- Every page: navigation, buttons, headings, form labels, placeholders, validation and error messages, empty states, dialogs (Read Bio, newsletter), cookie banner and Consent Management, error pages, alt text, page titles and metadata.
- Content: Actuality items, Insights, projects and case studies, expert bios, Careers job postings, newsletters and transactional emails (newsletter confirmation, application receipt, password reset).
- Legal pages (Privacy Policy, Cookie Policy, Terms and Conditions, Refund Policy, Legal Notices, Accessibility Statement, Recruitment Privacy Notice), reviewed by a qualified person. The company must state which version prevails if the two differ `[TO BE VERIFIED]`.
- Dates, numbers, currency and units formatted according to the active language.

**Content management for two languages**

- Every content type has separate French and English fields and a translation status (Missing, Draft, Reviewed, Published). The approval workflow covers both versions.
- If an item exists in only one language, show it in that language with a clear notice (for example "This article is available in French only"). Hide it from listings in the other language unless an editor chooses to show it. Never show untranslated placeholder text or silently mix languages on one page.
- Do not auto-publish machine translations. Machine translation may be used only as a draft that a person from the company reviews and approves.
- Use the verified, approved translations for the company's official names, legal entity name and expert job titles. Do not invent translations of credentials.

**Implementation**

- Use a proper internationalization structure (translation files or per-language content fields, no hard-coded strings in components) and load only the active language's strings.
- Use fonts that fully support French accents and characters, and self-host them.
- Make layouts tolerate longer French text without overflow in menus, buttons, cards and forms.

---

## 14. VISUAL DESIGN

- High-end African energy consulting and infrastructure advisory feel
- Palette: light base, dark navy, neutral gray and one accent color taken from the company logo (see the design direction below)
- Imagery themes: power infrastructure, transmission lines, substations, hydropower, solar, wind, industrial energy facilities, mining infrastructure, African cities and infrastructure, energy professionals, technical visualizations (all owned or properly licensed)
- Clean, sophisticated interface with restrained animation, data visualizations and useful interactive technical components
- It must **not** look like a generic electrical contractor, a construction company, a generic NGO, a generic investment site or a copied consulting template

### Design direction supplied by the company (follow this)

The company supplied two reference screenshots. Use them as **style direction only**. Section 3 still applies: the layouts, code, photographs, wording and shapes must be original, and nothing may be copied from either reference.

**Follow reference 1 (the Power Advisory home page style) for the whole site:**

- **Header:** a light, slightly translucent (frosted) full-width bar over the top of the hero, with the logo at the far left and the navigation at the right in dark navy, light-weight sans-serif type. The hovered, focused and current item uses the accent color. When the visitor scrolls, the header becomes solid white with a subtle shadow. "Contact" is the primary button (accent-filled). The Subscribe to Newsletter button and the FR | EN language button sit in a small utility group beside it. If the top-level items do not fit on one line at 1280 px, move Sustainability and Experts into the About Us dropdown.
- **Hero:** a full-bleed photograph of real energy infrastructure (owned or properly licensed, African context preferred: hydropower, solar, transmission lines, mining sites) filling most of the first screen. It carries a very large, light-weight white headline aligned left (no more than about four lines) over a dark gradient overlay, so the text always meets contrast requirements (Section 18).
- **Band under the hero:** a solid accent-color band directly below the hero that holds the supporting statement and the three primary buttons (Discuss a Project, Request Advisory, Speak With an Energy Expert). Text on the band must meet contrast. If the accent is too light for white text, use dark navy text or darken the accent.
- **Interior pages:** the same pattern at a smaller height: a photograph with overlay and a large light-weight page title, or a plain navy gradient where no photograph exists. Do not add decorative shapes copied from any reference.
- **Rhythm and style:** large white and light-gray sections, generous spacing, clean cards, thin headings with regular-weight body text, restrained motion.
- **Typography:** a modern geometric or humanist sans-serif, self-hosted and properly licensed (Section 19). Headings are light (weight 300), large and fluid using `clamp()`. Body text is regular weight (400) at 16 to 18 px. Headlines must wrap without overflow on 320 px screens (Section 24.1).
- **Colors:** light base, dark navy text, one bright accent taken from the company logo for the band, active states and buttons. Dark navy is used for the footer and dark sections. Check every color pair. Avoid the weaknesses visible in the reference: light cyan text on white and white text over a bright sky.

**Follow reference 2 (the BBA header) for the logo presentation only:**

- Present the company's **own** logo the way reference 2 presents its logo: clean, high-contrast and single-color on dark navy. Use a white version on dark navy backgrounds (footer, dark sections, mobile menu panel, error pages, email headers, favicon tile) and the full-color version on light backgrounds.
- Place it top left, large enough to read easily, with generous clear space, aligned with the navigation row.
- Do **not** reproduce BBA's logo, its block mark or any part of its branding. The logo is always the company's own file (Section 7, Supplied assets). If the company wants its logo redesigned in a new style, that must be an original design made for the company.

**Originality guardrails:** use none of the screenshots' photographs, text, logos, shapes or code. Build the layout and code from scratch, so the finished site has its own identity beside both references.

## 15. RESPONSIVE DESIGN

Test desktop, laptop, tablet and mobile. Ensure working mobile navigation and forms, scaling images, usable tables, readable charts, accessible buttons, readable text and **no horizontal overflow**. The Actuality grid, Careers list and newsletter dialog must all work well on mobile. The mandatory overflow rules in Section 24.1 apply to every page.

## 16. PERFORMANCE

Optimize images, JavaScript, CSS, fonts, third-party scripts and API calls. Lazy-load where appropriate, compress images, avoid unnecessary dependencies and animations, test Core Web Vitals. Never sacrifice accessibility for visual effects. Image compression rules and size budgets are in Section 24.10.

## 17. SEO

Unique page titles and meta descriptions **in each language**, canonical URLs, `hreflang` alternates (`fr`, `en`, `x-default`), Open Graph metadata with locale, structured data (`Organization`, `NewsArticle`, `JobPosting`, `BreadcrumbList` where appropriate), sitemap, robots configuration and clean URLs. Use accurate company information and no misleading keywords. Include relevant pages for: energy advisory, power systems, energy infrastructure, mining energy, renewable energy, power procurement, energy transition, DRC energy sector, African energy advisory. `JobPosting` markup only for real, published positions.

---

## 18. ACCESSIBILITY (WCAG 2.2 AA TARGET)

- Semantic HTML and correct heading hierarchy
- Meaningful alt text for informative images; empty alt for decorative images
- Check color contrast; never rely on color alone
- Every interactive element keyboard accessible; visible focus states
- Accessible menus and **dialogs** (focus trap, Escape to close, focus return): this applies to the Read Bio dialog and the newsletter dialog
- Forms with meaningful labels, descriptive error messages, clear button labels and accessible validation
- Skip-to-content link, accessible navigation, mobile usability
- Correct `lang` attribute on every page and on any passage in the other language; an accessible, keyboard-operable language button
- Pause or reduce animation for `prefers-reduced-motion`
- Test with keyboard and screen readers before launch and publish an Accessibility Statement

---

## 19. LEGAL, COPYRIGHT AND CONTENT INTEGRITY

The site must be original. Do not present copied material as company content.

**Check copyright ownership for:** images, videos, icons, illustrations, fonts, documents, charts, reports, maps, third-party libraries, website components. Use owned or properly licensed assets and **keep a license register** (`/docs/asset-licenses.md`).

**Never publish:** competitor employee photos, testimonials, project images or client logos; unsupported claims; fake reviews, clients, partnerships, certifications, awards, project statistics, case studies, news items or job postings.

**Legal pages (adapted to the company's real data collection, services and jurisdictions, not generic templates):**

- Privacy Policy (must cover contact forms, advisory requests, **newsletter**, **job applications**, analytics, cookies, third-party processors, retention, user rights, privacy contact)
- Cookie Policy
- Terms and Conditions
- Refund Policy (only where paid services, reports, subscriptions or training exist)
- Consent Management (cookie preferences plus newsletter preference status)
- Accessibility Statement
- Legal Notices
- **Recruitment Privacy Notice** *(new)*, linked from the Careers page and application form

Follow applicable privacy and electronic-communications laws for the DRC and any other jurisdiction where the company deliberately offers services. Legal pages must be available in **both French and English**. **Legal review is required before public launch.**

---

## 20. PRIVACY, CONSENT, ANALYTICS AND THIRD PARTIES

- Collect only data required for a specific business function. Review every form, remove unnecessary fields and explain why each type of personal data is collected.
- Provide appropriate marketing consent and never auto-subscribe users.
- Explain cookie categories and let users manage non-essential cookies. Load optional services only after consent where required.
- Use analytics only where necessary. Audit every tracking script and remove unnecessary trackers. Load no unnecessary third-party scripts.
- Review and document what each service does and what data it receives: analytics, maps, YouTube, LinkedIn, Facebook, WhatsApp, CRM, email and newsletter provider, payment providers, chat tools, external fonts, CDNs, external APIs. Prefer self-hosted fonts and assets.
- Do not send unnecessary personal information to external platforms.

---

## 21. FORMS AND CONTACT SYSTEM

Provide: general inquiry, request advisory, discuss a project, energy expert contact. Plus **newsletter sign-up** and **job application**.

Review every form for clear purpose, minimum necessary data, correct labels, keyboard accessibility, accessible validation, useful error messages, spam protection, rate limiting, consent where necessary and a privacy explanation. Send data securely, store inquiries securely, apply retention rules and do not expose email addresses to automated harvesting. Every form must show clear success and error messages as specified in Section 24.5.

---

## 22. CONTENT MANAGEMENT

- Only authorized users may modify content; administrative access requires authentication with **role-based permissions**
- Suggested roles: Admin, Editor, Approver, Recruiter, Viewer
- Audit logs for sensitive changes, protected media library and protected downloadable documents
- Approval workflow for sensitive corporate content (Actuality, project pages, expert bios, job postings)
- Prevent unauthorized publication

---

## 23. SECURITY REQUIREMENTS

### Authentication and sessions (admin area)

- No weak login page, hidden bypasses, permanent sessions or test credentials in production
- Secure password hashing, secure password reset, session rotation after login, session invalidation on logout
- Secure cookies (`HttpOnly`, `Secure`, `SameSite`), expiration and inactivity timeout
- Brute-force and password-reset abuse protection; no account enumeration
- Never expose passwords or tokens in URLs, client-side JavaScript or logs
- Multi-factor authentication for admin users (recommended)

### Codebase, environment and Git review (authorized systems only)

Inspect source, configuration, environment files, build artifacts, logs, backups, deployment settings, Git history, branches, tags, CI/CD configuration, temporary and debug files. Search for exposed passwords, API keys, database and cloud credentials, tokens, private keys, secret URLs, test and development credentials. Remove secrets from production, rotate anything exposed, never expose environment variables to the frontend, never commit `.env` files (provide `.env.example` only), and check history and old branches.

### Database and authorization

Server-side authorization on every database-backed feature. Verify users cannot read or modify others' data. Test direct object references, manipulated IDs, URL and API parameters, hidden fields, admin endpoints, role and object-level permissions. Least-privilege database access, protected backups and credentials, logging of sensitive admin actions. Applicant data and newsletter subscriber data must be accessible only to authorized roles.

### File uploads

Identify every upload location (CV upload, media library, document downloads). Treat files as untrusted; never allow execution as server-side code; validate type, MIME and signature; enforce size limits; rename safely; prevent path traversal and malicious archives; store separately from application code; review any preview or conversion tools; ensure uploads cannot alter configuration; test every upload endpoint.

### APIs

Review authentication, authorization, rate limiting, input validation, output filtering, object-level authorization, admin endpoints, error messages, exposed documentation, API keys, CORS, request size limits, abuse controls, webhook verification, replay protection and idempotency for financial operations.

### Bot and automated abuse (defensive only)

Identify every feature where bots could cause financial loss or excessive resource use. **For this site, pay particular attention to:**

- Newsletter sign-up and confirmation emails
- Contact, advisory and job-application forms (email sending)
- Password-reset emails
- File-upload and processing endpoints
- Search endpoints on Actuality, Insights and Careers
- Any SMS, AI, payment, quote or large data-processing feature if introduced

Protect them with authentication, authorization, rate limits, transaction and spending limits, usage limits, request validation, fraud and anomaly detection, approval workflows, audit logs, monitoring, alerts, idempotency and emergency shutdown controls. Use test accounts, sandbox environments and safe limits. Do not build destructive exploits or intentionally generate financial loss.

### General security review

Test for broken authentication and authorization, XSS, CSRF, SQL and other injection, insecure direct object references, privilege escalation, session and password-reset weaknesses, API authorization problems, brute-force and rate-limit weaknesses, information disclosure, debug endpoints, exposed admin interfaces, insecure cookies, missing security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), improper CORS, dependency vulnerabilities, configuration weaknesses and secret exposure.

---

## 24. SITE-WIDE QUALITY FIXES AND POLISH (MANDATORY ON EVERY PAGE, IN BOTH LANGUAGES)

Apply everything in this section to **every page and template** (Home, About, each Service, Industries, Projects, Insights, Actuality, Careers, Experts, Sustainability, Contact, Newsletter, legal pages and error pages), in French and English. Treat each item as an acceptance criterion. The site is not finished until each one is verified.

### 24.1 No horizontal scrolling and no mobile overflow

- No page may scroll horizontally at any width from **320 px** upward, or at 200% and 400% browser zoom (content must reflow).
- Find and fix the **root cause** of every overflow. Typical causes: elements wider than the viewport, `100vw` used for widths (use `100%`), fixed pixel widths, negative margins, decorative elements positioned outside the edge, oversized images, iframes or videos, long unbroken words, URLs and email addresses, wide tables and charts, flex or grid children missing `min-width: 0`, off-canvas menus that still take up layout space, and animations that move elements outside the viewport.
- Do **not** hide the problem with `overflow-x: hidden` on `html` or `body`.
- Use `box-sizing: border-box`, `max-width: 100%` on all media, `overflow-wrap: anywhere` for long strings, and responsive images.
- The only allowed horizontal scrolling is inside a clearly labelled, keyboard-focusable container for a genuinely wide table or code block. Charts must adapt to small screens (resize, simplify or stack) instead of scrolling.
- Test at 320, 360, 375, 390, 414, 768, 1024, 1280, 1440 and 1920 px, in portrait and landscape.

### 24.2 Header, clickable logo, mobile menu and a single navigation

- **One** primary navigation, **one** footer navigation and **one** mobile menu, all built from the same source data. Remove every duplicate, leftover, hidden or legacy navigation (extra menu bars, repeated menus, duplicate or unused menu items). The mobile menu is the same navigation presented differently, not a second copy to maintain.
- **Logo:** clickable, linking to the home page in the current language (`/fr/` or `/en/`), with an accessible name such as "Africa Power Advisory Holdings, home", a visible focus state, and explicit width and height. Use the company's own logo file supplied in `/assets/brand/` (see "Supplied assets" in Section 7). Do not redraw, recolor, stretch, invent, copy or borrow a logo. Only if the file cannot be found, use a plain text wordmark and report the missing file.
- **Mobile menu** (below the desktop breakpoint, for example under 1024 px):
  - A hamburger `<button>` with an accessible name ("Menu" / "Open menu"), `aria-expanded` and `aria-controls`.
  - Opens a full-height panel. Focus moves into the panel and stays trapped while it is open. Escape closes it and returns focus to the button.
  - Page scroll is locked while open, without layout shift.
  - Submenus (Services & Industries, Projects, Insights, Sustainability, Experts) work as accessible accordions with tap targets of at least 44 by 44 px.
  - Contains the **language button (FR | EN)**, the **newsletter button** and the primary call-to-action.
  - Closes when a link is chosen or the page changes, respects reduced motion, and works as plain links even if JavaScript is slow to load.
- Desktop dropdown menus must be fully keyboard accessible.
- A sticky header must not cover anchor targets (use `scroll-padding-top`) and must respect device safe areas.

### 24.3 Links, footer, clickable phone number and email

- **Find and fix every broken link:** internal pages, external links, `#anchor` links, images, downloads, `tel:` and `mailto:` links, social links, sitemap entries, canonical and `hreflang` URLs.
- No `href="#"`, no empty `href`, no `javascript:void(0)`, no links to pages that do not exist. Unfinished pages are removed from navigation until they are ready. Use permanent (301) redirects for renamed or removed pages, with no redirect chains.
- External links use `rel="noopener noreferrer"`. Links that open a new tab must say so, visually and for screen readers.
- **Footer:** every footer link works, points to the correct page in the **current language**, and has no duplicates. It must include Actuality, Careers and the legal pages (Terms and Conditions, Privacy Policy, Cookie Policy, Refund Policy only if relevant, Consent Management, Accessibility Statement, Legal Notices). Show social icons only for official accounts verified by the company; if none are verified, show none.
- **Phone number:** wrap it in a `tel:` link using the international format (for example `tel:+243...`) while displaying a readable format `[OFFICIAL NUMBER TO BE VERIFIED]`. Give it a clear accessible label. Never link a fake or example number.
- **Email address:** a `mailto:` link showing the official address `[TO BE VERIFIED]`, keyboard accessible, using a role-based address (for example a general contact address) rather than a personal one. To respect the anti-harvesting rule in Section 21, do not print the address as plain scrapeable text in the page source. Assemble the link in a way bots cannot easily read (for example built from parts when the page renders) while it remains a normal clickable link for humans and screen readers. Provide a fallback to the contact form for visitors without JavaScript.
- Show the phone number and email in the footer and on the Contact page, and in the header or top bar if the design allows.

### 24.4 Buttons

- Audit **every** button and call-to-action: Discuss a Project, Request Advisory, Speak With an Energy Expert, Subscribe to Newsletter, Read Bio, Let's Talk Together, Apply, language button, search, filters, pagination, downloads and form submit buttons.
- Each one must do exactly what its label says, with a valid destination or handler. No dead buttons and no console errors.
- Use `<a>` for navigation and `<button>` for actions, always with an explicit `type`.
- Provide hover, `:focus-visible`, active, disabled and **loading** states (the loading state prevents double submission). Minimum target size 44 by 44 px. Icon-only buttons need accessible names. Labels are translated.
- Test with keyboard, mouse and touch.

### 24.5 Success messages and error messages

Apply to the contact, advisory, project and expert forms, newsletter sign-up, job application, search and admin login.

- **Success:** a clear message after submission, announced to screen readers (`role="status"` or `aria-live="polite"`), with focus moved to it and the form reset. Examples: "Thank you. Your message has been sent. We will reply to the email address you provided." For the newsletter: "Please check your inbox and confirm your subscription" (double opt-in, so do not say "subscribed" yet). For job applications: "Your application has been received."
- **Field errors:** shown next to the field, linked with `aria-describedby`, marked with `aria-invalid`, never conveyed by color alone, and written to explain the fix (for example "Enter a valid email address, such as name@company.com"). Also show an **error summary** at the top of the form with links to each field, and keep what the user typed (except files and passwords).
- **System errors:** friendly messages for server errors, network failure or timeout, rate limiting ("Too many attempts. Please try again in a few minutes."), file too large or wrong file type, and failed spam checks. Never expose technical details, stack traces or whether an email address is already registered.
- Never show a success message if the request failed. Provide every message in French and English. Test each state.

### 24.6 Page titles, meta descriptions and favicon

- **Titles:** unique per page and per language, in the format `Page Name | Africa Power Advisory Holdings`, about 50 to 60 characters, with the home page carrying the core positioning. No "Untitled", "Home", "React App" or template default titles. Dynamic pages (Actuality article, job posting, project, expert) use their own titles.
- **Meta descriptions:** unique, accurate, about 140 to 160 characters, per language, written for people, with no fabricated claims. Also provide Open Graph and social-card title, description and image (1200 by 630 px, owned or licensed) and canonical URLs.
- One `<h1>` per page, with headings in logical order.
- **Favicon:** company-branded, based on the approved logo mark, original or properly licensed. Provide `favicon.svg` with a 32 by 32 `favicon.ico` fallback, a 180 by 180 `apple-touch-icon.png`, 192 and 512 px PNG icons, a `site.webmanifest` and a `theme-color`. Declare them on every page including error pages, and check that the icon is legible at 16 px.

### 24.7 Custom 404 page and other error pages

- A branded **404 page** in French and English (matching the language of the requested URL, defaulting to French) with a friendly message, a search box, links to Home, Services, Actuality and Contact, the language button, and the normal header and footer.
- It must return a real **HTTP 404 status** (no soft 404), be `noindex` and stay out of the sitemap.
- Also provide custom 403, 500 and 503 (maintenance) pages in the same style. They must never reveal stack traces or sensitive information. Log errors on the server, and use 404 logs (without personal tracking) to find broken links.

### 24.8 Copyright year

- The footer shows `© [year] Africa Power Advisory Holding. All rights reserved.` / `Tous droits réservés.`, using the exact legal name from the company documents.
- The year must be **generated dynamically** at build or render time and never hard-coded (it should read 2026 at the time of writing). Use a range such as "2020–[year]" only if the company supplies the founding year `[TO BE VERIFIED]`.
- Check legal pages, metadata and structured data for outdated years.

### 24.9 Remove placeholder text

- No lorem ipsum, "Coming soon", "TBD", "TODO", "Your text here", sample names such as "John Doe", dummy phone numbers, `example.com` emails, template leftovers or bracketed markers may appear on any public page, in metadata, alt text, structured data or emails.
- The `[TO BE SUPPLIED]` and `[TO BE VERIFIED]` markers exist only in content files and the checklist. If information is not yet approved, **hide** that block, section, menu item or page. Show an empty state only where this brief specifies one (Actuality with no news, Careers with no positions, Projects with none verified).
- The one allowed visual placeholder is the company-branded image or initials for an expert whose approved photograph is missing (Section 7). An expert card is published only when the company has supplied that person's approved name, title and biography, and it must never contain invented or filler text.
- Add a **build-time scanner** that fails the build when placeholder patterns appear in the rendered output.

### 24.10 Image compression and asset optimization

- Compress **all** images. Use AVIF or WebP with a JPEG fallback for photographs, optimized SVG for logos, icons and illustrations, and PNG only where transparency requires it. Strip EXIF and location metadata (a privacy measure). Aim for visually lossless quality (about 75 to 82).
- Serve **responsive images** with `srcset` and `sizes` at several widths (for example 480, 768, 1280 and 1920 px). Never upscale. Set `width` and `height` (or `aspect-ratio`) on every image to prevent layout shift. Use `loading="lazy"` and `decoding="async"` below the fold. Load the main hero image eagerly with `fetchpriority="high"`.
- **Size targets:** hero image up to about 200 KB, content images up to about 100 KB, thumbnails up to about 30 KB, first-load page weight (excluding lazy media) up to about 1 MB, and initial JavaScript up to about 170 KB compressed per page. Report anything that exceeds these.
- Keep uncompressed originals outside the public folder, with the license register.
- Self-host WOFF2 font subsets with `font-display: swap` and no unused weights. Enable Brotli or gzip, long-term caching with hashed asset names, minified CSS and JavaScript, and remove unused code and dependencies.

### 24.11 Every page optimized (per-page checklist)

Verify on every page and template, in both languages:

- Unique title and meta description, canonical URL, `hreflang`, one `<h1>`, correct heading order
- Working header, mobile menu, footer, clickable logo, phone number and email
- No horizontal overflow at 320 px, no broken links or buttons, no placeholder text
- Favicon present, images compressed, sized and lazy-loaded, meaningful alt text
- Mobile Core Web Vitals targets: LCP up to 2.5 s, INP up to 200 ms, CLS up to 0.1
- Lighthouse mobile scores of 90 or more for Performance, Accessibility, Best Practices and SEO (targets)
- Valid structured data, keyboard and screen-reader checks passed

### 24.12 Automated checks

Add these to the build or CI pipeline and fail the build when they fail:

- Link checker (all internal links must pass; report external links) including `tel:` and `mailto:` validation
- Playwright overflow test at the widths in 24.1, confirming the page never scrolls sideways
- Placeholder scanner, duplicate or missing title and meta description check, dynamic-year check
- Image checks (over budget, missing alt, missing width and height)
- Lighthouse CI thresholds, axe-core accessibility scan, HTML validation, sitemap and robots check
- A test confirming unknown URLs return a real 404 with the custom page

Write the results to `/docs/qa-report.md`.

---

## 25. FINAL QUALITY-CONTROL AUDIT (BEFORE DEPLOYMENT)

- **Content:** verify every statement, employee, image, client, project, statistic, certification, partnership, news item and job posting
- **Copyright:** check images, fonts, icons, documents, videos, illustrations
- **Privacy:** check forms, cookies, analytics, third parties, consent (including newsletter and recruitment), data retention
- **Security:** check authentication, authorization, database access, APIs, uploads, secrets, Git history, dependency vulnerabilities, bot abuse
- **Accessibility:** check keyboard navigation, screen readers, color contrast, alt text, forms, focus states
- **Performance:** check mobile performance, image optimization, JavaScript, API performance, third-party scripts
- **Language:** check that the FR | EN button works on every page and keeps the user on the equivalent page, that no page mixes languages by accident, that `hreflang` and `lang` attributes are correct, that forms, errors and emails are translated, and that both language versions of every legal page were reviewed
- **Site quality:** run every check in Section 24 on every page in both languages: no horizontal overflow, working mobile menu, no broken links or buttons, correct footer links, clickable logo, phone number and email, unique titles and meta descriptions, favicon, custom 404, current copyright year, compressed images, success and error messages, and no visible placeholder text
- **Design and structure:** check that the site follows the design direction in Section 14 (header, hero, accent band, typography, logo presentation), that no photograph, text, logo or shape was copied from either reference, that text over images meets contrast, and that Services and Industries exist only as the single merged section, with working redirects from the old URLs

---

## 26. DELIVERABLES

1. The complete website source code with a clear README (setup, environment variables, deployment)
2. `.env.example` with no real secrets
3. A bilingual (French and English) content data structure for experts, projects, Actuality, Insights and job postings, with `[TO BE SUPPLIED]` markers, plus translation files for all interface text
4. A docs folder containing: asset license register, third-party services register (service, purpose, data received, consent category), security checklist, accessibility checklist, pre-launch verification checklist and list of every open placeholder
5. Admin area for Actuality, Careers, newsletter subscribers and inquiries with role-based access and audit logs
6. A short summary of everything that still needs company input or legal review before launch
7. A QA report (`/docs/qa-report.md`) produced by the automated checks in Section 24.12, the favicon and icon set, and the custom error pages

## 27. FINAL INSTRUCTION

Build Africa Power Advisory Holdings as an original, production-ready African energy advisory and power-sector consulting website. Use Power Advisory LLC and BBA Consultants only as conceptual references. Do not clone either site. Use the company's corporate documents as the authoritative source. Include the Actuality page, the Careers page, the Newsletter button and subscription system, and the French / English language button with a fully bilingual site, exactly as specified. Follow the design direction in Section 14 (reference 1 for the whole site, reference 2 for the logo presentation only, using the company's own logo) and build Services & Industries as one merged section (Section 4). Never invent people, credentials, clients, projects, news, jobs, statistics, certifications or partnerships. Apply every fix in Section 24 to every page in both languages: no horizontal scrolling or mobile overflow, a working mobile menu with a single navigation, a clickable logo, phone number and email, working links, footer links and buttons, a favicon, unique page titles and meta descriptions, a custom 404 page, a dynamic copyright year, compressed images, clear success and error messages, and no visible placeholder text. Never use stock people or competitor photographs. Collect only necessary data, audit every third-party integration, make the whole site accessible and secure, and run the full security, privacy, accessibility, copyright, performance, legal and content review before deployment.
