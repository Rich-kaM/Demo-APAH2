import { locales, services, industries, experts } from '../content.js';
import { renderSite } from '../render.js';

const blocked = [
  /\[TO BE (?:SUPPLIED|VERIFIED|CONFIRMED)[^\]]*\]/i,
  /\b(?:lorem ipsum|coming soon|your text here|john doe|tbd|todo)\b/i,
  /example\.com/i,
];
const routeKeys = ['home','about','services','projects','insights','actuality','sustainability','experts','careers','contact','newsletter','search','privacy','cookies','terms','legal','accessibility','consent','recruitment'];
const failures = [];
const routeTitles = new Map();
let checked = 0;

for (const lang of Object.keys(locales)) {
  for (const key of routeKeys) {
    const html = renderSite({ lang, route: { key, path: `/${lang}/${key === 'home' ? '' : `${key}/`}` }, csrf: 'check-token', recaptchaTestMode: true, origin: 'https://site.invalid' });
    checked++;
    if (!html) { failures.push(`${lang}/${key}: render returned no page`); continue; }
    if (!html.includes(`<html lang="${lang}">`)) failures.push(`${lang}/${key}: incorrect document language`);
    if (!html.includes('<main id="main">') || !html.includes('id="primary-navigation"')) failures.push(`${lang}/${key}: shared shell is incomplete`);
    if ((html.match(/<h1\b/g) || []).length !== 1) failures.push(`${lang}/${key}: expected exactly one page heading`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const description = (html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (!title || title.toLocaleLowerCase() === `${lang === 'fr' ? 'français' : 'english'} | africa power advisory holdings`) failures.push(`${lang}/${key}: unique title missing`);
    const titleKey = title.replace(/&amp;/g, '&').toLocaleLowerCase();
    if (routeTitles.has(titleKey)) failures.push(`${lang}/${key}: title duplicates ${routeTitles.get(titleKey)}`);
    else routeTitles.set(titleKey, `${lang}/${key}`);
    if (description.length < 140 || description.length > 160) failures.push(`${lang}/${key}: meta description length is ${description.length}, expected 140–160`);
    if (!html.includes('rel="canonical"') || !html.includes('hreflang="x-default"')) failures.push(`${lang}/${key}: canonical or hreflang metadata missing`);
    for (const img of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="/.test(img[0])) failures.push(`${lang}/${key}: image has no alt attribute`);
      if (!/\bwidth="\d+"/.test(img[0]) || !/\bheight="\d+"/.test(img[0])) failures.push(`${lang}/${key}: image dimensions are missing`);
    }
    for (const pattern of blocked) if (pattern.test(html)) failures.push(`${lang}/${key}: blocked public content pattern ${pattern}`);
  }
  for (const item of services) {
    const html = renderSite({ lang, route: { key: 'service-detail', slug: item[0] } }); checked++;
    if (!html) failures.push(`${lang}/service/${item[0]}: missing page`);
  }
  for (const item of industries) {
    const html = renderSite({ lang, route: { key: 'industry-detail', slug: item[0] } }); checked++;
    if (!html) failures.push(`${lang}/industry/${item[0]}: missing page`);
  }
  for (const item of experts) {
    const html = renderSite({ lang, route: { key: 'expert-detail', slug: item.slug } }); checked++;
    if (!html || !html.includes(item.name)) failures.push(`${lang}/experts/${item.slug}: missing biography page`);
  }
}

for (const lang of Object.keys(locales)) {
  for (const status of [403,500,503]) {
    const html = renderSite({ lang, origin: 'https://site.invalid', route: { key: 'home', errorStatus: status, errorTitle: `${status} · ${lang === 'fr' ? 'Erreur' : 'Error'}`, title: `${status} · ${lang === 'fr' ? 'Erreur' : 'Error'}`, path: `/${lang}/${status}/` } });
    checked++;
    if (!html || !html.includes(`>${status}</p>`) || (html.match(/<h1\b/g) || []).length !== 1 || !html.includes('id="primary-navigation"')) failures.push(`${lang}/${status}: custom error template missing or incomplete`);
  }
}

const frContact = renderSite({ lang: 'fr', route: { key: 'contact' }, csrf: 'check-token', recaptchaTestMode: true });
for (const field of ['name','email','topic','message','privacy']) if (!new RegExp(`name="${field}"[^>]*required`).test(frContact)) failures.push(`contact: required field ${field} not rendered`);
if (!frContact.includes('data-load-captcha required')) failures.push('contact: required CAPTCHA consent/load control not rendered');
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Rendered content checks passed (${checked} bilingual route and detail renders).`);
