import { access } from 'node:fs/promises';
import path from 'node:path';
import { locales, services, industries, experts, routePages } from '../content.js';
import { localizedHref, renderSite, serviceHref, industryHref, slugs } from '../render.js';

const root = process.cwd();
const origin = 'https://site.invalid';
const validRoutes = new Set();
validRoutes.add('/'); // Root negotiates to the French default in the application router.
const validAssets = new Map([
  ['/favicon.svg', 'public/assets/favicon.svg'], ['/site.webmanifest', 'public/site.webmanifest'],
  ['/styles.css', 'styles.css'], ['/script.js', 'script.js'], ['/admin.js', 'admin.js'],
  ['/assets/brand/apah-logo.svg', 'public/assets/brand/apah-logo.svg'], ['/assets/brand/apah-logo-light.svg', 'public/assets/brand/apah-logo-light.svg'],
]);
for (const lang of Object.keys(locales)) {
  for (const key of Object.keys(routePages)) validRoutes.add(localizedHref(lang, key));
  for (const item of services) validRoutes.add(`${localizedHref(lang, 'services')}services/${item[0]}/`);
  for (const item of industries) validRoutes.add(`${localizedHref(lang, 'services')}${lang === 'fr' ? 'secteurs' : 'industries'}/${item[0]}/`);
  for (const item of experts) validRoutes.add(`${localizedHref(lang, 'experts')}${item.slug}/`);
  validRoutes.add(`/${lang}/`);
}
const failures = [];
let checkedPages = 0;
let externalLinks = 0;
const pageList = [];
for (const lang of Object.keys(locales)) {
  for (const key of Object.keys(routePages)) pageList.push({ lang, route: { key, path: localizedHref(lang, key) } });
  for (const item of services) pageList.push({ lang, route: { key: 'service-detail', slug: item[0], path: serviceHref(lang, item[0]), title: lang === 'fr' ? item[2] : item[1], description: lang === 'fr' ? item[4] : item[3] } });
  for (const item of industries) pageList.push({ lang, route: { key: 'industry-detail', slug: item[0], path: industryHref(lang, item[0]), title: lang === 'fr' ? item[2] : item[1] } });
  for (const item of experts) pageList.push({ lang, route: { key: 'expert-detail', slug: item.slug, path: `/${lang}/experts/${item.slug}/`, title: item.name, description: lang === 'fr' ? item.focusFr : item.focusEn } });
}

for (const { lang, route } of pageList) {
  const html = renderSite({ lang, route, origin, csrf: 'qa-csrf', recaptchaTestMode: true });
  if (!html) { failures.push(`${route.path}: route did not render`); continue; }
  checkedPages++;
  for (const match of html.matchAll(/\b(?:href|action|src)="([^"]+)"/g)) {
    const value = match[1].replace(/&amp;/g, '&');
    if (/^(?:mailto:|tel:)/i.test(value)) continue;
    const url = new URL(value, origin);
    if (url.origin !== origin) { externalLinks++; continue; }
    if (url.hash && (!url.pathname || url.pathname === route.path)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !html.includes(`id="${id}"`)) failures.push(`${route.path}: missing anchor target #${id}`);
      continue;
    }
    if (validAssets.has(url.pathname)) {
      try { await access(path.join(root, validAssets.get(url.pathname))); } catch { failures.push(`${route.path}: missing asset ${url.pathname}`); }
      continue;
    }
    if (validRoutes.has(url.pathname)) continue;
    if (url.pathname.startsWith('/api/')) continue;
    failures.push(`${route.path}: unresolved internal link ${url.pathname}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Rendered-link checks passed (${checkedPages} bilingual pages; ${externalLinks} external links recorded).`);
