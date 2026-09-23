import http from 'node:http';
import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { access, mkdir, readFile, rename, writeFile, chmod } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { locales, services, industries, experts } from './content.js';
import { renderSite, localizedHref, slugs, getTitle, getDescription } from './render.js';
import { renderAdminPage } from './admin-page.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const privateDir = path.join(root, 'data', 'private');
const publicDir = path.join(root, 'public');
const port = Number(process.env.PORT || 4173);
const isProduction = process.env.NODE_ENV === 'production';
const recaptchaTestMode = !isProduction && process.env.RECAPTCHA_MODE !== 'google';
const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || '';
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY || '';
const emailWebhook = process.env.EMAIL_WEBHOOK_URL || '';
const emailFrom = process.env.EMAIL_FROM || '';
const hashScrypt = promisify(scryptCallback);
const mime = new Map([['.html','text/html; charset=utf-8'],['.css','text/css; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.svg','image/svg+xml'],['.webmanifest','application/manifest+json'],['.png','image/png'],['.jpg','image/jpeg'],['.jpeg','image/jpeg'],['.webp','image/webp'],['.ico','image/x-icon']]);
const sessions = new Map();
const downloadGrants = new Map();
const downloadSigningKey = process.env.ADMIN_LINK_SECRET ? Buffer.from(process.env.ADMIN_LINK_SECRET) : randomBytes(32);
let emailBudgetQueue = Promise.resolve();
let writeQueue = Promise.resolve();
let dbCache = null;

const dbPath = path.join(privateDir, 'store.json');
const defaultDb = () => ({ inquiries: [], applications: [], subscribers: [], content: [], audit: [], suppressionHashes: [] });
const randomToken = (bytes = 32) => randomBytes(bytes).toString('base64url');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const langFromPath = pathname => pathname.startsWith('/en/') || pathname === '/en' ? 'en' : 'fr';
const json = (response, status, value, headers = {}) => { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); response.end(JSON.stringify(value)); };
const cookieValue = (request, name) => (request.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1) || '';
const setCookie = (response, name, value, options = {}) => {
  const parts = [`${name}=${value}`, 'Path=/', 'SameSite=Strict'];
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.secure || isProduction) parts.push('Secure');
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  response.setHeader('Set-Cookie', parts.join('; '));
};

async function ensurePrivateDir() { await mkdir(privateDir, { recursive: true, mode: 0o700 }); try { await chmod(privateDir, 0o700); } catch {} }
async function readDb() {
  if (dbCache) return dbCache;
  await ensurePrivateDir();
  try { dbCache = { ...defaultDb(), ...JSON.parse(await readFile(dbPath, 'utf8')) }; }
  catch (error) { if (error.code !== 'ENOENT') throw error; dbCache = defaultDb(); }
  return dbCache;
}
function mutateDb(mutator) {
  const task = writeQueue.catch(() => {}).then(async () => {
    const db = await readDb();
    const result = await mutator(db);
    const tmp = `${dbPath}.${randomToken(6)}.tmp`;
    await writeFile(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
    await rename(tmp, dbPath);
    try { await chmod(dbPath, 0o600); } catch {}
    return result;
  });
  writeQueue = task;
  return task;
}

async function retentionSweep() {
  await ensurePrivateDir();
  if (!isProduction) {
    const outbox = path.join(privateDir, 'outbox.jsonl');
    try { const info = await (await import('node:fs/promises')).stat(outbox); if (Date.now() - info.mtimeMs > 86_400_000) await (await import('node:fs/promises')).unlink(outbox); } catch {}
    return;
  }
  const contactDays = Number(process.env.CONTACT_RETENTION_DAYS || 0);
  const applicationDays = Number(process.env.APPLICATION_RETENTION_DAYS || 0);
  const newsletterDays = Number(process.env.NEWSLETTER_RETENTION_DAYS || 0);
  const expiredBefore = days => Date.now() - days * 86_400_000;
  await mutateDb(async db => {
    const oldInquiries = db.inquiries.filter(item => contactDays > 0 && Date.parse(item.createdAt) < expiredBefore(contactDays));
    db.inquiries = db.inquiries.filter(item => !oldInquiries.includes(item));
    for (const item of oldInquiries) audit(db, 'system', 'retention-delete', 'inquiry', item.id);
    const oldApplications = db.applications.filter(item => applicationDays > 0 && Date.parse(item.createdAt) < expiredBefore(applicationDays));
    db.applications = db.applications.filter(item => !oldApplications.includes(item));
    for (const item of oldApplications) {
      if (item.cvName && /^[a-zA-Z0-9_-]+\.(?:pdf|docx)$/.test(item.cvName)) await (await import('node:fs/promises')).unlink(path.join(privateDir, 'applications', item.cvName)).catch(() => {});
      audit(db, 'system', 'retention-delete', 'application', item.id);
    }
    const oldSubscribers = db.subscribers.filter(item => newsletterDays > 0 && item.unsubscribedAt && Date.parse(item.unsubscribedAt) < expiredBefore(newsletterDays));
    for (const item of oldSubscribers) {
      if (item.email) db.suppressionHashes.push({ emailHash: sha256(item.email.toLowerCase()), at: new Date().toISOString() });
      audit(db, 'system', 'retention-delete', 'newsletter', item.id);
    }
    db.subscribers = db.subscribers.filter(item => !oldSubscribers.includes(item));
    db.suppressionHashes = [...new Map(db.suppressionHashes.map(item => [item.emailHash, item])).values()];
  });
}

async function bodyBuffer(request, limit = 1024 * 1024) {
  const declared = Number(request.headers['content-length'] || 0);
  if (declared > limit) throw Object.assign(new Error('too_large'), { status: 413 });
  const parts = []; let size = 0;
  for await (const part of request) {
    size += part.length;
    if (size > limit) throw Object.assign(new Error('too_large'), { status: 413 });
    parts.push(part);
  }
  return Buffer.concat(parts);
}
function parseMultipart(buffer, contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  if (!match) throw Object.assign(new Error('bad_form'), { status: 400 });
  const boundary = Buffer.from(`--${match[1] || match[2]}`);
  const fields = {};
  let cursor = 0;
  while (true) {
    const start = buffer.indexOf(boundary, cursor);
    if (start < 0) break;
    let partStart = start + boundary.length;
    if (buffer.subarray(partStart, partStart + 2).toString() === '--') break;
    if (buffer.subarray(partStart, partStart + 2).toString() === '\r\n') partStart += 2;
    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), partStart);
    if (headerEnd < 0) break;
    const headers = buffer.subarray(partStart, headerEnd).toString('utf8');
    const disposition = /content-disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]*)")?/i.exec(headers);
    const dataStart = headerEnd + 4;
    let dataEnd = buffer.indexOf(boundary, dataStart);
    if (dataEnd < 0) break;
    while (dataEnd > dataStart && buffer[dataEnd - 1] === 10) dataEnd--;
    if (dataEnd > dataStart && buffer[dataEnd - 1] === 13) dataEnd--;
    if (disposition) {
      const value = buffer.subarray(dataStart, dataEnd);
      if (disposition[2] !== undefined) fields[disposition[1]] = { filename: path.basename(disposition[2]).slice(0, 180), mime: /content-type:\s*([^\r\n]+)/i.exec(headers)?.[1]?.trim() || '', data: value };
      else fields[disposition[1]] = value.toString('utf8').slice(0, 10_000);
    }
    cursor = dataEnd + 1;
  }
  return fields;
}
async function parseForm(request, limit = 1024 * 1024) {
  const buffer = await bodyBuffer(request, limit);
  if ((request.headers['content-type'] || '').includes('multipart/form-data')) return parseMultipart(buffer, request.headers['content-type']);
  return Object.fromEntries(new URLSearchParams(buffer.toString('utf8')));
}
function formString(value) { return typeof value === 'string' ? value.trim() : ''; }
function failField(name, lang) { return json; }
function rateLimit(request, key, max = 8, windowMs = 15 * 60_000) {
  globalThis.__apahLimits ||= new Map();
  const now = Date.now();
  const id = `${request.socket.remoteAddress || 'unknown'}:${key}`;
  const record = globalThis.__apahLimits.get(id) || { start: now, count: 0 };
  if (now - record.start > windowMs) { record.start = now; record.count = 0; }
  record.count++;
  globalThis.__apahLimits.set(id, record);
  return record.count <= max;
}
function sameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return !isProduction;
  try { return new URL(origin).host === request.headers.host; } catch { return false; }
}
function csrfValid(request, fields) {
  const token = typeof fields.csrf === 'string' ? fields.csrf : '';
  return token && token.length < 200 && token === cookieValue(request, 'apah_csrf') && sameOrigin(request);
}
async function verifyCaptcha(fields, request) {
  if (recaptchaTestMode) return formString(fields.captchaSandbox) === 'verified';
  const token = formString(fields['g-recaptcha-response']);
  if (!token || !recaptchaSecretKey) return false;
  const body = new URLSearchParams({ secret: recaptchaSecretKey, response: token });
  const ip = request.socket.remoteAddress;
  if (ip && !ip.startsWith('::ffff:')) body.set('remoteip', ip);
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body, signal: AbortSignal.timeout(5000) });
  if (!response.ok) return false;
  const result = await response.json();
  if (!result.success) return false;
  if (process.env.PUBLIC_SITE_URL) {
    try { return result.hostname === new URL(process.env.PUBLIC_SITE_URL).hostname; } catch { return false; }
  }
  return !isProduction;
}
async function sendEmail(message) {
  await ensurePrivateDir();
  if (message.to) {
    const reservation = emailBudgetQueue.catch(() => {}).then(async () => {
      const budgetPath = path.join(privateDir, 'email-budget.json');
      let budget = { day: new Date().toISOString().slice(0,10), count: 0 };
      try { budget = JSON.parse(await readFile(budgetPath, 'utf8')); } catch {}
      const day = new Date().toISOString().slice(0,10); const limit = Number(process.env.OUTBOUND_EMAIL_DAILY_LIMIT || 50);
      if (budget.day !== day) budget = { day, count: 0 };
      if (budget.count >= limit) throw new Error('daily email limit reached');
      budget.count++;
      await writeFile(budgetPath, JSON.stringify(budget), { mode: 0o600 });
    });
    emailBudgetQueue = reservation;
    await reservation;
  }
  if (emailWebhook && emailFrom) {
    const url = new URL(emailWebhook);
    if (url.protocol !== 'https:') throw new Error('email provider URL must use HTTPS');
    const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...(process.env.EMAIL_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ from: emailFrom, ...message }), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('email provider unavailable');
    return;
  }
  if (isProduction) throw new Error('email delivery is not configured');
  await writeFile(path.join(privateDir, 'outbox.jsonl'), `${JSON.stringify({ sandbox: true, createdAt: new Date().toISOString(), ...message })}\n`, { flag: 'a', mode: 0o600 });
}
function audit(db, actor, action, type, id) { db.audit.push({ id: randomToken(8), actor, action, type, recordId: id, at: new Date().toISOString() }); if (db.audit.length > 5000) db.audit.shift(); }
function productionFormReady(type) {
  if (!isProduction) return true;
  let secureOrigin = false; try { secureOrigin = new URL(process.env.PUBLIC_SITE_URL).protocol === 'https:'; } catch {}
  const positiveDays = key => /^\d+$/.test(process.env[key] || '') && Number(process.env[key]) > 0;
  const common = Boolean(secureOrigin && process.env.LEGAL_NOTICE_REVIEW_APPROVED === 'true' && /^\S+@\S+\.\S+$/.test(process.env.PRIVACY_CONTACT_EMAIL || '') && positiveDays('CONTACT_RETENTION_DAYS') && emailWebhook && emailFrom && Number(process.env.OUTBOUND_EMAIL_DAILY_LIMIT) > 0);
  if (type === 'contact') return common && Boolean(recaptchaSiteKey && recaptchaSecretKey && process.env.INQUIRY_NOTIFICATION_EMAIL);
  if (type === 'newsletter') return common && process.env.NEWSLETTER_CONSENT_APPROVED === 'true' && positiveDays('NEWSLETTER_RETENTION_DAYS');
  if (type === 'application') return common && process.env.RECRUITMENT_NOTICE_APPROVED === 'true' && positiveDays('APPLICATION_RETENTION_DAYS') && Boolean(process.env.FILE_SCAN_COMMAND);
  return false;
}

function createCsrf() { return randomToken(24); }
function languagePaths(key, pathName = '') { return Object.fromEntries(['fr','en'].map(lang => [lang, `/${lang}/${slugs[lang][key] ? `${slugs[lang][key]}/` : ''}${pathName}`])); }

function routeFor(pathname) {
  const lang = langFromPath(pathname);
  const prefix = `/${lang}/`;
  const raw = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.replace(/^\/(?:fr|en)\/?/, '');
  const trimmed = raw.replace(/^\/+|\/+$/g, '');
  const [first = '', ...rest] = trimmed.split('/').filter(Boolean);
  const reverse = Object.fromEntries(Object.entries(slugs[lang]).map(([key, slug]) => [slug, key]));
  if (!first) return { lang, key: 'home', path: prefix };
  if (first === 'services' || first === 'industries') {
    const legacy = rest.join('-').toLowerCase();
    const service = first === 'services' && services.find(item => item[0] === legacy);
    const industry = first === 'industries' && industries.find(item => item[0] === legacy);
    const pathTarget = service ? `${prefix}${slugs[lang].services}/services/${service[0]}/` : industry ? `${prefix}${slugs[lang].services}/${lang === 'fr' ? 'secteurs' : 'industries'}/${industry[0]}/` : `${prefix}${slugs[lang].services}/`;
    return { redirect: pathTarget, status: 301 };
  }
  if (first === slugs[lang].services) {
    if (rest[0] === 'services') return { lang, key: 'service-detail', slug: rest[1], path: `${prefix}${trimmed}/` };
    if (rest[0] === (lang === 'fr' ? 'secteurs' : 'industries')) return { lang, key: 'industry-detail', slug: rest[1], path: `${prefix}${trimmed}/` };
    return { lang, key: 'services', path: `${prefix}${trimmed}/` };
  }
  if (first === slugs[lang].experts && rest.length) return { lang, key: 'expert-detail', slug: rest[0], path: `${prefix}${trimmed}/` };
  if (first === slugs[lang].actuality && rest.length) return { lang, key: 'actuality-detail', slug: rest[0], path: `${prefix}${trimmed}/` };
  if (first === slugs[lang].careers && rest.length) return { lang, key: 'career-detail', slug: rest[0], path: `${prefix}${trimmed}/` };
  if (first === slugs[lang].projects && rest.length) return { lang, key: 'project-detail', slug: rest[0], path: `${prefix}${trimmed}/` };
  if (first === slugs[lang].insights && rest.length) return { lang, key: 'insight-detail', slug: rest[0], path: `${prefix}${trimmed}/` };
  if (first === slugs[lang].newsletter && rest[0] === 'confirm') return { lang, key: 'newsletter-confirm', token: rest[1] || '' };
  if (first === slugs[lang].newsletter && rest[0] === 'unsubscribe') return { lang, key: 'newsletter-unsubscribe', token: rest[1] || '' };
  if (first === slugs[lang].newsletter && rest[0] === 'preferences') return { lang, key: 'newsletter-preferences', token: rest[1] || '' };
  const key = reverse[first];
  if (key) return { lang, key, path: `${prefix}${trimmed}/` };
  return { lang, key: 'not-found', path: `${prefix}${trimmed}/` };
}

async function handlePage(request, response, url, route) {
  if (route.redirect) { response.writeHead(route.status || 302, { Location: route.redirect, 'Cache-Control': 'public, max-age=3600' }); response.end(); return; }
  if (route.key === 'newsletter-confirm') return handleNewsletterToken(response, route.token, true, route.lang);
  if (route.key === 'newsletter-unsubscribe') return handleNewsletterToken(response, route.token, false, route.lang);
  if (route.key === 'newsletter-preferences') return newsletterPreferencesPage(response, route.token, route.lang);
  if (route.key === 'not-found') return errorPage(response, 404, route.lang);
  if (['service-detail','industry-detail','expert-detail','actuality-detail','career-detail','project-detail','insight-detail'].includes(route.key)) {
    const db = await readDb();
    const types = { 'career-detail': 'job', 'actuality-detail': 'actuality', 'project-detail': 'project', 'insight-detail': 'insight' };
    const valid = route.key === 'service-detail' ? services.some(x => x[0] === route.slug) : route.key === 'industry-detail' ? industries.some(x => x[0] === route.slug) : route.key === 'expert-detail' ? experts.some(x => x.slug === route.slug) : db.content.some(item => item.slug === route.slug && item.lang === route.lang && item.status === 'published' && item.type === types[route.key]);
    if (!valid) return errorPage(response, 404, route.lang);
  }
  const db = await readDb();
  const cmsItems = db.content.filter(item => item.status === 'published');
  let alternateKey = route.key;
  let altPath = '';
  if (route.key === 'service-detail') altPath = `/${route.lang === 'fr' ? 'en/services-industries' : 'fr/services-et-secteurs'}/services/${route.slug}/`;
  else if (route.key === 'industry-detail') altPath = `/${route.lang === 'fr' ? 'en/services-industries/industries' : 'fr/services-et-secteurs/secteurs'}/${route.slug}/`;
  else if (route.key === 'expert-detail') altPath = `/${route.lang === 'fr' ? 'en' : 'fr'}/experts/${route.slug}/`;
  else if (route.key === 'actuality-detail' || route.key === 'career-detail' || route.key === 'project-detail' || route.key === 'insight-detail') {
    const matchingTranslation = cmsItems.some(item => item.slug === route.slug && item.lang !== route.lang && item.status === 'published');
    const parent = { 'career-detail':'careers','actuality-detail':'actuality','project-detail':'projects','insight-detail':'insights' }[route.key];
    if (matchingTranslation) altPath = `${localizedHref(route.lang === 'fr' ? 'en' : 'fr', parent)}${route.slug}/`;
    else altPath = localizedHref(route.lang === 'fr' ? 'en' : 'fr', parent);
  }
  const canonicalPath = route.path || localizedHref(route.lang, route.key);
  const csrf = ['contact','newsletter','careers','admin'].includes(route.key) ? createCsrf() : '';
  if (csrf) setCookie(response, 'apah_csrf', csrf, { maxAge: 3600 });
  const englishPreference = (request.headers['accept-language'] || '').split(',').map(part => part.trim()).find(part => /^en(?:-[a-z]{2})?(?:\s*;|$)/i.test(part));
  const englishWeight = Number(/;\s*q=([0-9.]+)/i.exec(englishPreference || '')?.[1] || 1);
  const acceptsEnglish = Boolean(englishPreference) && englishWeight > 0;
  const pageRoute = { ...route, altKey: alternateKey, altPath, path: canonicalPath, suggestedLanguage: url.pathname === '/' && acceptsEnglish ? 'en' : '' };
  const recaptchaKey = recaptchaSiteKey;
  if (route.key === 'service-detail') { const item = services.find(entry => entry[0] === route.slug); pageRoute.title = route.lang === 'fr' ? item?.[2] : item?.[1]; pageRoute.description = route.lang === 'fr' ? item?.[4] : item?.[3]; }
  if (route.key === 'industry-detail') { const item = industries.find(entry => entry[0] === route.slug); pageRoute.title = route.lang === 'fr' ? item?.[2] : item?.[1]; pageRoute.description = route.lang === 'fr' ? 'Services de conseil adaptés aux priorités énergétiques de ce secteur.' : 'Advisory services tailored to the energy priorities of this industry.'; }
  if (route.key === 'expert-detail') { const item = experts.find(entry => entry.slug === route.slug); pageRoute.title = item?.name; pageRoute.description = route.lang === 'fr' ? item?.focusFr : item?.focusEn; }
  if (['actuality-detail','career-detail','project-detail','insight-detail'].includes(route.key)) {
    const type = { 'actuality-detail':'actuality','career-detail':'job','project-detail':'project','insight-detail':'insight' }[route.key];
    const item = cmsItems.find(entry => entry.slug === route.slug && entry.lang === route.lang && entry.status === 'published' && entry.type === type);
    pageRoute.title = item?.title || '';
    pageRoute.description = item?.summary || '';
    pageRoute.author = item?.author || item?.department;
    pageRoute.publishedAt = item?.publishedAt || item?.updatedAt;
    pageRoute.updatedAt = item?.updatedAt;
  }
  if (route.key === 'actuality') { pageRoute.category = url.searchParams.get('category') || ''; pageRoute.year = url.searchParams.get('year') || ''; pageRoute.relatedService = url.searchParams.get('service') || ''; pageRoute.page = url.searchParams.get('page') || 1; }
  if (route.key === 'careers') { pageRoute.department = url.searchParams.get('department') || ''; pageRoute.location = url.searchParams.get('location') || ''; pageRoute.contractType = url.searchParams.get('contract') || ''; }
  const html = renderSite({ lang: route.lang, route: pageRoute, origin: process.env.PUBLIC_SITE_URL || '', csrf, recaptchaSiteKey: recaptchaKey, recaptchaTestMode, query: url.searchParams.get('q') || '', cmsItems });
  if (html === null) return errorPage(response, 404, route.lang);
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': csrf ? 'no-store' : 'public, max-age=60', ...(csrf ? { 'Set-Cookie': `apah_csrf=${csrf}; Path=/; SameSite=Strict; HttpOnly${isProduction ? '; Secure' : ''}; Max-Age=3600` } : {}) });
  response.end(html);
}

function errorPage(response, status, lang) {
  const fr = lang === 'fr';
  const title = status === 404 ? (fr ? 'Cette page est introuvable.' : 'This page could not be found.') : status === 403 ? (fr ? 'Accès refusé.' : 'Access denied.') : status === 503 ? (fr ? 'Service temporairement indisponible.' : 'Temporarily unavailable.') : (fr ? 'Une erreur est survenue.' : 'Something went wrong.');
  const html = renderSite({ lang, route: { key: 'home', errorStatus: status, errorTitle: title, title: `${status} · ${fr ? 'Erreur' : 'Error'}`, path: localizedHref(lang, 'home'), altPath: localizedHref(lang === 'fr' ? 'en' : 'fr', 'home') }, origin: process.env.PUBLIC_SITE_URL || '' });
  response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(html);
}

async function handleNewsletterToken(response, token, confirm, lang) {
  if (!token || token.length > 200) return errorPage(response, 404, lang);
  if (!confirm) {
    const db = await readDb();
    if (!db.subscribers.some(item => item.unsubscribeTokenHash === sha256(token) && !item.unsubscribedAt)) return errorPage(response, 410, lang);
    const csrf = createCsrf();
    const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>${lang === 'fr' ? 'Désabonnement' : 'Unsubscribe'} | APAH</title><link rel="stylesheet" href="/styles.css"></head><body><main class="error-main"><h1>${lang === 'fr' ? 'Confirmer le désabonnement' : 'Confirm unsubscribe'}</h1><p>${lang === 'fr' ? 'Confirmez pour ne plus recevoir les actualités par courriel.' : 'Confirm to stop receiving company updates by email.'}</p><form method="post" action="/api/newsletter/unsubscribe"><input type="hidden" name="csrf" value="${csrf}"><input type="hidden" name="token" value="${escapeHtml(token)}"><button class="button button-dark" type="submit">${lang === 'fr' ? 'Me désabonner' : 'Unsubscribe'}</button></form></main></body></html>`;
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Set-Cookie': `apah_csrf=${csrf}; Path=/; SameSite=Strict; HttpOnly${isProduction ? '; Secure' : ''}; Max-Age=1800` });
    return response.end(html);
  }
  const pending = await readDb();
  if (!pending.subscribers.some(item => item.tokenHash === sha256(token) && item.tokenExpiresAt > Date.now())) return errorPage(response, 410, lang);
  const csrf = createCsrf();
  const confirmHtml = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>${lang === 'fr' ? 'Confirmation infolettre' : 'Newsletter confirmation'} | APAH</title><link rel="stylesheet" href="/styles.css"></head><body><main class="error-main"><h1>${lang === 'fr' ? 'Confirmer votre inscription' : 'Confirm your subscription'}</h1><p>${lang === 'fr' ? 'Confirmez pour recevoir les actualités par courriel.' : 'Confirm to receive company updates by email.'}</p><form method="post" action="/api/newsletter/confirm?lang=${lang}"><input type="hidden" name="csrf" value="${csrf}"><input type="hidden" name="token" value="${escapeHtml(token)}"><button class="button button-dark" type="submit">${lang === 'fr' ? 'Confirmer mon inscription' : 'Confirm subscription'}</button></form></main></body></html>`;
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Set-Cookie': `apah_csrf=${csrf}; Path=/; SameSite=Strict; HttpOnly${isProduction ? '; Secure' : ''}; Max-Age=1800` });
  return response.end(confirmHtml);
}

async function handleNewsletterConfirm(request, response) {
  const fields = await parseForm(request); const token = formString(fields.token);
  const lang = new URL(request.url, 'http://localhost').searchParams.get('lang') === 'en' ? 'en' : 'fr';
  if (!csrfValid(request, fields) || !token || token.length > 200 || !rateLimit(request, 'newsletter-confirm', 10)) return json(response, 403, { message: lang === 'fr' ? 'La demande n’a pas pu être validée.' : 'The request could not be validated.' });
  let confirmed = false;
  await mutateDb(db => {
    const subscriber = db.subscribers.find(item => item.tokenHash === sha256(token) && item.tokenExpiresAt > Date.now());
    if (!subscriber) return;
    subscriber.confirmedAt = new Date().toISOString(); subscriber.tokenHash = null; subscriber.tokenExpiresAt = null;
    confirmed = true; audit(db, 'subscriber', 'confirm', 'newsletter', subscriber.id);
  });
  const message = confirmed ? (lang === 'fr' ? 'Votre inscription est confirmée.' : 'Your subscription is confirmed.') : (lang === 'fr' ? 'Ce lien a expiré ou a déjà été utilisé.' : 'This link has expired or has already been used.');
  response.writeHead(confirmed ? 200 : 410, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>${lang === 'fr' ? 'Infolettre' : 'Newsletter'} | APAH</title><link rel="stylesheet" href="/styles.css"></head><body><main class="error-main"><h1>${escapeHtml(message)}</h1><a href="/${lang}/">${lang === 'fr' ? 'Accueil' : 'Home'}</a></main></body></html>`);
}

async function handleNewsletterUnsubscribe(request, response) {
  const fields = await parseForm(request);
  const token = formString(fields.token); const lang = new URL(request.url, 'http://localhost').searchParams.get('lang') === 'en' ? 'en' : 'fr';
  if (!csrfValid(request, fields) || !token || token.length > 200 || !rateLimit(request, 'newsletter-unsubscribe', 10)) return json(response, 403, { message: lang === 'fr' ? 'La demande n’a pas pu être validée.' : 'The request could not be validated.' });
  let updated = false;
  await mutateDb(db => {
    const subscriber = db.subscribers.find(item => item.unsubscribeTokenHash === sha256(token) && !item.unsubscribedAt);
    if (!subscriber) return;
    subscriber.unsubscribedAt = new Date().toISOString(); subscriber.tokenHash = null; subscriber.unsubscribeTokenHash = null; subscriber.preferenceTokenHash = null;
    audit(db, 'subscriber', 'unsubscribe', 'newsletter', subscriber.id); updated = true;
  });
  const message = updated ? (lang === 'fr' ? 'Votre désabonnement est confirmé.' : 'Your unsubscribe is confirmed.') : (lang === 'fr' ? 'Ce lien a expiré ou a déjà été utilisé.' : 'This link has expired or has already been used.');
  response.writeHead(updated ? 200 : 410, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>${lang === 'fr' ? 'Infolettre' : 'Newsletter'} | APAH</title><link rel="stylesheet" href="/styles.css"></head><body><main class="error-main"><h1>${escapeHtml(message)}</h1><a href="/${lang}/">${lang === 'fr' ? 'Accueil' : 'Home'}</a></main></body></html>`);
}

async function newsletterPreferencesPage(response, token, lang) {
  const db = await readDb();
  const subscriber = db.subscribers.find(item => item.preferenceTokenHash === sha256(token) && !item.unsubscribedAt);
  if (!subscriber) return errorPage(response, 410, lang);
  const fr = lang === 'fr';
  const csrf = randomToken(24); setCookie(response, 'apah_csrf', csrf, { maxAge: 1800 });
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${fr ? 'Préférences infolettre' : 'Newsletter preferences'} | APAH</title><link rel="stylesheet" href="/styles.css"><script src="/script.js" defer></script></head><body><main class="error-main"><h1>${fr ? 'Préférences de l’infolettre' : 'Newsletter preferences'}</h1><p>${fr ? 'Adresse inscrite :' : 'Subscribed address:'} ${escapeHtml(subscriber.email)}</p><form class="site-form" method="post" action="/api/newsletter/preferences" data-async-form novalidate><input type="hidden" name="csrf" value="${csrf}"><input type="hidden" name="token" value="${escapeHtml(token)}"><label>${fr ? 'Langue des courriels' : 'Email language'}<select name="lang"><option value="fr"${subscriber.lang === 'fr' ? ' selected' : ''}>Français</option><option value="en"${subscriber.lang === 'en' ? ' selected' : ''}>English</option></select></label><label class="checkbox-label"><input type="checkbox" name="unsubscribe" value="yes"><span>${fr ? 'Me désabonner' : 'Unsubscribe me'}</span></label><button class="button button-dark" type="submit">${fr ? 'Enregistrer mes préférences' : 'Save preferences'}</button><p class="form-status" data-form-status role="status" aria-live="polite"></p></form></main></body></html>`;
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Set-Cookie': `apah_csrf=${csrf}; Path=/; SameSite=Strict; HttpOnly${isProduction ? '; Secure' : ''}; Max-Age=1800` }); response.end(html);
}

async function handleNewsletterPreferences(request, response) {
  const fields = await parseForm(request); const token = formString(fields.token); const lang = ['fr','en'].includes(fields.lang) ? fields.lang : 'fr';
  if (!csrfValid(request, fields) || !token || !rateLimit(request, 'newsletter-preference', 10)) return json(response, 403, { message: 'Request rejected.' });
  let updated = false;
  await mutateDb(db => {
    const subscriber = db.subscribers.find(item => item.preferenceTokenHash === sha256(token) && !item.unsubscribedAt);
    if (!subscriber) return;
    subscriber.lang = lang;
    if (fields.unsubscribe === 'yes') { subscriber.unsubscribedAt = new Date().toISOString(); subscriber.unsubscribeTokenHash = null; subscriber.preferenceTokenHash = null; }
    updated = true; audit(db, 'subscriber', fields.unsubscribe === 'yes' ? 'unsubscribe' : 'update-preferences', 'newsletter', subscriber.id);
  });
  return json(response, updated ? 200 : 410, { message: updated ? (lang === 'fr' ? 'Vos préférences ont été enregistrées.' : 'Your preferences have been saved.') : (lang === 'fr' ? 'Ce lien a expiré.' : 'This link has expired.') });
}

async function handleContact(request, response) {
  const lang = new URL(request.url, 'http://localhost').searchParams.get('lang') === 'en' ? 'en' : 'fr';
  const t = locales[lang];
  if (!rateLimit(request, 'contact', 6)) return json(response, 429, { message: lang === 'fr' ? 'Trop de tentatives. Réessayez dans quelques minutes.' : 'Too many attempts. Try again in a few minutes.' });
  let fields;
  try { fields = await parseForm(request); } catch (err) { return json(response, err.status || 400, { message: t.form.error }); }
  if (!csrfValid(request, fields)) return json(response, 403, { message: lang === 'fr' ? 'La session du formulaire a expiré. Actualisez la page.' : 'The form session expired. Reload the page.' });
  if (formString(fields.website)) return json(response, 200, { message: t.form.success });
  const name = formString(fields.name); const email = formString(fields.email); const topic = formString(fields.topic); const message = formString(fields.message);
  const phone = formString(fields.phone); const organization = formString(fields.organization);
  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !topic || topic.length > 160 || !message || message.length > 5000 || phone.length > 40 || organization.length > 120 || fields.privacy !== 'yes' || fields.captchaConsent !== 'yes') return json(response, 422, { message: lang === 'fr' ? 'Vérifiez les champs obligatoires.' : 'Please check the required fields.' });
  if (!productionFormReady('contact')) return json(response, 503, { message: lang === 'fr' ? 'Le formulaire est en mode de pré-lancement et ne peut pas recevoir de demandes réelles.' : 'This form is in pre-launch mode and cannot accept real inquiries.' });
  let captchaOk = false;
  try { captchaOk = await verifyCaptcha(fields, request); } catch {}
  if (!captchaOk) return json(response, 422, { message: lang === 'fr' ? 'Complétez la vérification anti-robot.' : 'Complete the anti-bot verification.' });
  const record = { id: randomToken(12), name, email, phone, organization, topic, message, lang, createdAt: new Date().toISOString(), status: 'new' };
  try {
    await mutateDb(db => { db.inquiries.push(record); audit(db, 'system', 'create', 'inquiry', record.id); });
    if (process.env.INQUIRY_NOTIFICATION_EMAIL) {
      try { await sendEmail({ to: process.env.INQUIRY_NOTIFICATION_EMAIL, subject: `Website inquiry · Africa Power Advisory Holdings (${lang})`, text: `${record.name} · ${record.topic}\n${record.message}`, html: `<p>${escapeHtml(record.name)} · ${escapeHtml(record.topic)}</p><p>${escapeHtml(record.message)}</p>` }); }
      catch { await mutateDb(db => audit(db, 'system', 'notification-failed', 'inquiry', record.id)); }
    }
  } catch { return json(response, 503, { message: t.form.error }); }
  return json(response, 200, { message: t.form.success });
}

async function handleNewsletter(request, response) {
  const lang = new URL(request.url, 'http://localhost').searchParams.get('lang') === 'en' ? 'en' : 'fr'; const t = locales[lang].newsletterForm;
  if (process.env.NEWSLETTER_SIGNUP_DISABLED === 'true') return json(response, 503, { message: lang === 'fr' ? 'Les inscriptions sont temporairement suspendues.' : 'Subscriptions are temporarily paused.' });
  if (!rateLimit(request, 'newsletter', 5, 60 * 60_000)) return json(response, 429, { message: t.generic });
  let fields; try { fields = await parseForm(request); } catch { return json(response, 400, { message: t.generic }); }
  if (!csrfValid(request, fields)) return json(response, 403, { message: t.generic });
  if (formString(fields.website)) return json(response, 200, { message: t.generic });
  const email = formString(fields.email).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || fields.consent !== 'yes') return json(response, 422, { message: t.generic });
  if (!productionFormReady('newsletter')) return json(response, 503, { message: lang === 'fr' ? 'L’inscription est en mode de pré-lancement.' : 'Subscription is in pre-launch mode.' });
  const rawToken = randomToken(); const tokenHash = sha256(rawToken); const unsubscribeToken = randomToken(); const id = randomToken(12);
  try {
    const shouldSend = await mutateDb(db => {
      const existing = db.subscribers.find(item => item.email.toLowerCase() === email);
      if (existing?.confirmedAt && !existing.unsubscribedAt) return false;
      const hour = Math.floor(Date.now() / 3_600_000);
      if (existing && existing.requestHour === hour && existing.requestCount >= 3) return false;
      const preferenceToken = randomToken();
      const data = { id: existing?.id || id, email, lang, source: localizedHref(lang, 'newsletter'), consentVersion: 'newsletter-consent-1', consentAt: new Date().toISOString(), confirmedAt: null, unsubscribedAt: null, tokenHash, tokenExpiresAt: Date.now() + 24 * 60 * 60_000, unsubscribeTokenHash: sha256(unsubscribeToken), preferenceTokenHash: sha256(preferenceToken), requestHour: hour, requestCount: existing?.requestHour === hour ? (existing.requestCount || 0) + 1 : 1 };
      fields.preferenceToken = preferenceToken;
      if (existing) Object.assign(existing, data); else db.subscribers.push(data);
      audit(db, 'system', 'request-confirmation', 'newsletter', data.id);
      return true;
    });
    if (!shouldSend) return json(response, 200, { message: t.generic });
    const confirmUrl = `${(process.env.PUBLIC_SITE_URL || `http://127.0.0.1:${port}`).replace(/\/$/, '')}${localizedHref(lang, 'newsletter')}confirm/${encodeURIComponent(rawToken)}/`;
    const unsubscribeUrl = `${(process.env.PUBLIC_SITE_URL || `http://127.0.0.1:${port}`).replace(/\/$/, '')}${localizedHref(lang, 'newsletter')}unsubscribe/${encodeURIComponent(unsubscribeToken)}/`;
    const preferencesUrl = `${(process.env.PUBLIC_SITE_URL || `http://127.0.0.1:${port}`).replace(/\/$/, '')}${localizedHref(lang, 'newsletter')}preferences/${encodeURIComponent(fields.preferenceToken)}/`;
    const organization = lang === 'fr' ? 'Africa Power Advisory Holding · Kinshasa, RDC' : 'Africa Power Advisory Holding · Kinshasa, DRC';
    await sendEmail({ to: email, subject: lang === 'fr' ? 'Confirmez votre inscription · Africa Power Advisory Holdings' : 'Confirm your subscription · Africa Power Advisory Holdings', text: `${t.generic}\n${confirmUrl}\n${lang === 'fr' ? 'Gérer les préférences :' : 'Manage preferences:'} ${preferencesUrl}\n${lang === 'fr' ? 'Se désabonner :' : 'Unsubscribe:'} ${unsubscribeUrl}\n${organization}`, html: `<p>${escapeHtml(t.generic)}</p><p><a href="${escapeHtml(confirmUrl)}">${lang === 'fr' ? 'Confirmer mon inscription' : 'Confirm my subscription'}</a></p><p><a href="${escapeHtml(preferencesUrl)}">${lang === 'fr' ? 'Gérer mes préférences' : 'Manage preferences'}</a></p><p><a href="${escapeHtml(unsubscribeUrl)}">${lang === 'fr' ? 'Me désabonner' : 'Unsubscribe'}</a></p><p>${escapeHtml(organization)}</p>` });
  } catch { return json(response, 503, { message: lang === 'fr' ? 'Le courriel de confirmation ne peut pas être envoyé pour le moment.' : 'The confirmation email could not be sent at this time.' }); }
  return json(response, 200, { message: t.generic });
}

async function handleApplication(request, response) {
  const lang = new URL(request.url, 'http://localhost').searchParams.get('lang') === 'en' ? 'en' : 'fr'; const t = locales[lang].careersForm;
  if (!rateLimit(request, 'application', 3, 60 * 60_000)) return json(response, 429, { message: t.unavailable });
  let fields; try { fields = await parseForm(request, 6 * 1024 * 1024); } catch { return json(response, 413, { message: lang === 'fr' ? 'Le fichier dépasse la taille maximale de 5 Mo.' : 'The file exceeds the 5 MB size limit.' }); }
  if (!csrfValid(request, fields)) return json(response, 403, { message: t.unavailable });
  if (formString(fields.website)) return json(response, 200, { message: t.success });
  const name = formString(fields.name); const email = formString(fields.email); const role = formString(fields.role); const phone = formString(fields.phone); const file = fields.cv;
  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !role || role.length > 120 || phone.length > 40 || fields.privacy !== 'yes' || !file?.data?.length || file.data.length > 5 * 1024 * 1024) return json(response, 422, { message: t.unavailable });
  if (!productionFormReady('application')) return json(response, 503, { message: t.unavailable });
  const extension = path.extname(file.filename).toLowerCase();
  const validPdf = extension === '.pdf' && file.data.subarray(0, 5).toString() === '%PDF-' && (!file.mime || file.mime === 'application/pdf');
  const docxMimeOkay = !file.mime || file.mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mime === 'application/zip';
  const validDocx = extension === '.docx' && file.data.subarray(0, 2).toString() === 'PK' && file.data.includes(Buffer.from('[Content_Types].xml')) && file.data.includes(Buffer.from('word/document.xml')) && docxMimeOkay;
  if (!validPdf && !validDocx) return json(response, 422, { message: lang === 'fr' ? 'Téléversez un fichier PDF ou DOCX valide.' : 'Upload a valid PDF or DOCX file.' });
  const id = randomToken(14); const cvName = `${id}${extension}`;
  let savedCvPath = '';
  try {
    await ensurePrivateDir();
    const cvDir = path.join(privateDir, 'applications'); await mkdir(cvDir, { recursive: true, mode: 0o700 });
    const cvPath = path.join(cvDir, cvName); savedCvPath = cvPath;
    await writeFile(cvPath, file.data, { flag: 'wx', mode: 0o600 });
    if (isProduction && process.env.FILE_SCAN_COMMAND) {
      const scan = await new Promise(resolve => { const child = spawn(process.env.FILE_SCAN_COMMAND, [cvPath], { shell: false, stdio: 'ignore', timeout: 20_000 }); child.on('close', code => resolve(code === 0)); child.on('error', () => resolve(false)); });
      if (!scan) { await import('node:fs/promises').then(fs => fs.unlink(cvPath).catch(() => {})); return json(response, 422, { message: lang === 'fr' ? 'Le fichier n’a pas pu être vérifié.' : 'The file could not be scanned.' }); }
    }
    await mutateDb(db => { db.applications.push({ id, name, email, phone, role, cvName, cvBytes: file.data.length, lang, futureConsent: fields.futureConsent === 'yes', createdAt: new Date().toISOString(), status: 'new' }); audit(db, 'system', 'create', 'application', id); });
    try { await sendEmail({ to: email, subject: lang === 'fr' ? 'Candidature reçue · Africa Power Advisory Holdings' : 'Application received · Africa Power Advisory Holdings', text: lang === 'fr' ? 'Votre candidature a été reçue. L’équipe de recrutement pourra vous contacter si un suivi est nécessaire.' : 'Your application has been received. The recruitment team may contact you if follow-up is needed.', html: `<p>${escapeHtml(t.success)}</p><p>${lang === 'fr' ? 'Africa Power Advisory Holding · Kinshasa, RDC' : 'Africa Power Advisory Holding · Kinshasa, DRC'}</p>` }); }
    catch { await mutateDb(db => audit(db, 'system', 'confirmation-email-failed', 'application', id)); }
  } catch { if (savedCvPath) await (await import('node:fs/promises')).unlink(savedCvPath).catch(() => {}); return json(response, 503, { message: t.unavailable }); }
  return json(response, 200, { message: t.success });
}

function parseScryptHash(value) { const [salt, hash] = String(value || '').split(':'); return salt && hash ? { salt, hash: Buffer.from(hash, 'hex') } : null; }
async function validAdminPassword(password) {
  const stored = parseScryptHash(process.env.ADMIN_PASSWORD_HASH);
  if (!stored) return false;
  const derived = await hashScrypt(password, stored.salt, 64);
  return stored.hash.length === derived.length && timingSafeEqual(stored.hash, derived);
}
async function handleAdminLogin(request, response) {
  let fields; try { fields = await parseForm(request); } catch { return json(response, 400, { message: 'Unable to sign in.' }); }
  if (!csrfValid(request, fields)) return json(response, 403, { message: 'Unable to sign in.' });
  if (!rateLimit(request, 'admin-login', 5, 15 * 60_000)) return json(response, 429, { message: 'Unable to sign in.' });
  const username = formString(fields.username); const password = formString(fields.password);
  const nameOkay = username === (process.env.ADMIN_USERNAME || '');
  const passwordOkay = await validAdminPassword(password);
  if (!nameOkay || !passwordOkay) { await new Promise(r => setTimeout(r, 250)); return json(response, 401, { message: 'Unable to sign in.' }); }
  const role = ['admin','editor','approver','recruiter','viewer'].includes(process.env.ADMIN_ROLE) ? process.env.ADMIN_ROLE : 'admin';
  const sessionId = randomToken(36); sessions.set(sessionId, { username, role, expires: Date.now() + 8 * 60 * 60_000 });
  response.setHeader('Set-Cookie', `apah_session=${sessionId}; Path=/; SameSite=Strict; HttpOnly${isProduction ? '; Secure' : ''}; Max-Age=28800`);
  await mutateDb(db => audit(db, username, 'login', 'admin', 'session'));
  return json(response, 200, { message: 'Signed in.', redirect: '/admin/' });
}
function getSession(request) {
  const id = cookieValue(request, 'apah_session'); const session = sessions.get(id);
  if (!session || session.expires < Date.now()) { if (id) sessions.delete(id); return null; }
  return { ...session, id };
}
function roleCan(role, action) {
  const rights = { admin: ['view','edit','publish','recruit','audit'], editor: ['view','edit'], approver: ['view','publish'], recruiter: ['view','recruit'], viewer: ['view'] };
  return rights[role]?.includes(action) || false;
}
async function handleAdminAction(request, response, url, session) {
  if (url.pathname === '/api/admin/logout' && request.method === 'POST') {
    const fields = await parseForm(request);
    if (!csrfValid(request, fields)) return json(response, 403, { message: 'Request rejected.' });
    sessions.delete(session.id); response.setHeader('Set-Cookie', `apah_session=; Path=/; SameSite=Strict; HttpOnly; Max-Age=0${isProduction ? '; Secure' : ''}`);
    await mutateDb(db => audit(db, session.username, 'logout', 'admin', 'session'));
    return json(response, 200, { redirect: '/admin/' });
  }
  if (request.method === 'GET' && url.pathname === '/api/admin/data') {
    if (!roleCan(session.role, 'view')) return json(response, 403, { message: 'Forbidden.' });
    const db = await readDb();
    const result = { content: roleCan(session.role, 'edit') || roleCan(session.role, 'publish') ? db.content : db.content.filter(item => item.status === 'published'), canPublish: roleCan(session.role, 'publish'), canPublishJobs: roleCan(session.role, 'publish') && roleCan(session.role, 'recruit'), inquiries: [], applications: [], subscribers: [], audit: roleCan(session.role, 'audit') ? db.audit : [] };
    if (roleCan(session.role, 'recruit')) result.applications = db.applications.map(({ cvName, ...item }) => ({ ...item, cvAvailable: Boolean(cvName) }));
    if (session.role === 'admin') { result.inquiries = db.inquiries; result.subscribers = db.subscribers.map(({ email, lang, confirmedAt, unsubscribedAt, createdAt }) => ({ email, lang, confirmedAt, unsubscribedAt, createdAt })); }
    await mutateDb(store => audit(store, session.username, 'view', 'admin-data', 'dashboard'));
    return json(response, 200, result);
  }
  if (request.method === 'GET' && url.pathname === '/api/admin/application-download-token') {
    if (!roleCan(session.role, 'recruit')) return json(response, 403, { message: 'Forbidden.' });
    const applicationId = url.searchParams.get('id') || '';
    const db = await readDb();
    if (!db.applications.some(item => item.id === applicationId)) return json(response, 404, { message: 'Not found.' });
    const claims = Buffer.from(JSON.stringify({ applicationId, expiresAt: Date.now() + 5 * 60_000, nonce: randomToken(16) })).toString('base64url');
    const signature = createHmac('sha256', downloadSigningKey).update(claims).digest('base64url');
    const token = `${claims}.${signature}`;
    downloadGrants.set(token, { applicationId, username: session.username, expiresAt: Date.now() + 5 * 60_000 });
    await mutateDb(store => audit(store, session.username, 'issue-download-link', 'application', applicationId));
    return json(response, 200, { url: `/api/admin/applications/${encodeURIComponent(applicationId)}/download?token=${encodeURIComponent(token)}`, expiresIn: 300 });
  }
  if (request.method === 'POST' && url.pathname === '/api/admin/content-status') {
    if (!roleCan(session.role, 'publish')) return json(response, 403, { message: 'Approver role required.' });
    let fields; try { fields = await parseForm(request); } catch { return json(response, 400, { message: 'Invalid status.' }); }
    if (!csrfValid(request, fields) || !['approved','published','archived'].includes(formString(fields.status))) return json(response, 422, { message: 'Invalid status.' });
    let itemFound = false;
    await mutateDb(db => {
      const item = db.content.find(entry => entry.id === formString(fields.id));
      if (!item) return;
      if (item.type === 'job' && !roleCan(session.role, 'recruit')) return;
      if (item.type === 'job' && fields.status === 'published' && (!item.category || !item.location || !item.contractType || !item.closingDate || !item.reference)) return;
      item.status = formString(fields.status); item.updatedAt = new Date().toISOString();
      if (item.status === 'published') item.publishedAt ||= item.updatedAt;
      audit(db, session.username, item.status === 'published' ? 'publish' : item.status === 'archived' ? 'unpublish' : 'approve', item.type, item.id);
      itemFound = true;
    });
    return json(response, itemFound ? 200 : 404, { message: itemFound ? 'Status updated.' : 'Not found.' });
  }
  const downloadMatch = /^\/api\/admin\/applications\/([a-zA-Z0-9_-]+)\/download$/.exec(url.pathname);
  if (request.method === 'GET' && downloadMatch) {
    const grantToken = url.searchParams.get('token') || '';
    const [claims, signature] = grantToken.split('.');
    let validSignature = false;
    if (claims && signature && signature.length < 100) {
      const expected = createHmac('sha256', downloadSigningKey).update(claims).digest();
      let supplied; try { supplied = Buffer.from(signature, 'base64url'); } catch { supplied = Buffer.alloc(0); }
      validSignature = supplied.length === expected.length && timingSafeEqual(supplied, expected);
    }
    const grant = downloadGrants.get(grantToken);
    let signedClaims = null;
    try { signedClaims = validSignature ? JSON.parse(Buffer.from(claims, 'base64url').toString('utf8')) : null; } catch {}
    if (!grant || !signedClaims || signedClaims.applicationId !== downloadMatch[1] || grant.applicationId !== downloadMatch[1] || signedClaims.expiresAt < Date.now() || grant.expiresAt < Date.now() || !roleCan(session.role, 'recruit')) return json(response, 403, { message: 'Download unavailable.' });
    downloadGrants.delete(grantToken);
    const db = await readDb(); const item = db.applications.find(application => application.id === grant.applicationId);
    if (!item || !/^[a-zA-Z0-9_-]+\.(?:pdf|docx)$/.test(item.cvName)) return json(response, 404, { message: 'Not found.' });
    try {
      const filePath = path.join(privateDir, 'applications', item.cvName); const file = await readFile(filePath);
      await mutateDb(store => audit(store, session.username, 'download', 'application', item.id));
      response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="application-${item.id}.${path.extname(item.cvName).slice(1)}"`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      return response.end(file);
    } catch { return json(response, 404, { message: 'Not found.' }); }
  }
  if (request.method === 'POST' && url.pathname === '/api/admin/content') {
    if (!roleCan(session.role, 'edit')) return json(response, 403, { message: 'Forbidden.' });
    let fields; try { fields = await parseForm(request); } catch { return json(response, 400, { message: 'Invalid content.' }); }
    if (!csrfValid(request, fields)) return json(response, 403, { message: 'Request rejected.' });
    const type = formString(fields.type); const status = formString(fields.status); const lang = formString(fields.lang); const existingId = formString(fields.id);
    const title = formString(fields.title); const body = formString(fields.body); const summary = formString(fields.summary);
    const category = formString(fields.category); const author = formString(fields.author); const relatedService = formString(fields.relatedService);
    const location = formString(fields.location); const contractType = formString(fields.contractType); const closingDate = formString(fields.closingDate); const reference = formString(fields.reference);
    const country = formString(fields.country); const client = formString(fields.client); const projectType = formString(fields.projectType); const scope = formString(fields.scope); const servicesProvided = formString(fields.servicesProvided); const projectYear = formString(fields.projectYear); const outcome = formString(fields.outcome);
    const clientAuthorized = fields.clientAuthorized === 'yes'; const outcomeVerified = fields.outcomeVerified === 'yes';
    const authorRequired = ['actuality','insight'].includes(type);
    if (!['actuality','job','project','insight'].includes(type) || !['fr','en'].includes(lang) || !title || title.length > 180 || !body || body.length > 20_000 || !summary || summary.length > 1000 || (authorRequired && !author) || author.length > 150 || !['draft','review','approved','published','archived'].includes(status)) return json(response, 422, { message: 'Invalid content.' });
    if (country.length > 100 || client.length > 180 || projectType.length > 120 || scope.length > 5000 || servicesProvided.length > 2000 || outcome.length > 3000 || (projectYear && (!/^\d{4}$/.test(projectYear) || Number(projectYear) > new Date().getFullYear()))) return json(response, 422, { message: 'Invalid project details.' });
    if (['approved','published','archived'].includes(status) && !roleCan(session.role, 'publish')) return json(response, 403, { message: 'Approver role required to approve or publish.' });
    if (type === 'job' && (!roleCan(session.role, 'recruit') || (status === 'published' && (!category || !location || !contractType || !closingDate || !reference)))) return json(response, 422, { message: 'Recruitment role and complete verified job details are required.' });
    if (type === 'job' && status === 'published' && (!/^\d{4}-\d{2}-\d{2}$/.test(closingDate) || Date.parse(`${closingDate}T23:59:59Z`) < Date.now())) return json(response, 422, { message: 'A future closing date is required.' });
    if (type === 'actuality' && !category) return json(response, 422, { message: 'A verified category is required.' });
    if (type !== 'job' && !roleCan(session.role, 'edit')) return json(response, 403, { message: 'Editor role required.' });
    const id = randomToken(12); const slug = String(fields.slug || title).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
    const before = await readDb();
    const existingRecord = existingId ? before.content.find(entry => entry.id === existingId) : null;
    if (existingId && !existingRecord) return json(response, 404, { message: 'Not found.' });
    if (existingRecord?.status === 'published' && !roleCan(session.role, 'publish')) return json(response, 403, { message: 'Published content requires approver role.' });
    if (existingRecord && existingRecord.type !== type) return json(response, 422, { message: 'Content type cannot be changed.' });
    if (before.content.some(entry => entry.id !== existingId && entry.type === type && entry.lang === lang && entry.slug === slug)) return json(response, 422, { message: 'This content URL is already in use.' });
    const now = new Date().toISOString();
    const item = { id: existingId || id, type, lang, title, summary, body, status, slug, category, author, relatedService, department: type === 'job' ? category : '', location, contractType, closingDate, reference, country: type === 'project' ? country : '', client: type === 'project' && clientAuthorized ? client : '', clientAuthorized: type === 'project' && clientAuthorized, projectType: type === 'project' ? projectType : '', scope: type === 'project' ? scope : '', servicesProvided: type === 'project' ? servicesProvided : '', projectYear: type === 'project' ? projectYear : '', outcome: type === 'project' && outcomeVerified ? outcome : '', outcomeVerified: type === 'project' && outcomeVerified, updatedAt: now, publishedAt: status === 'published' ? now : null };
    let created = true;
    await mutateDb(db => {
      const existing = existingId ? db.content.find(entry => entry.id === existingId) : null;
      if (db.content.some(entry => entry.id !== existingId && entry.type === type && entry.lang === lang && entry.slug === slug)) return;
      if (existing) { item.createdAt = existing.createdAt; item.publishedAt = existing.publishedAt || item.publishedAt; Object.assign(existing, item); created = false; }
      else { item.createdAt = now; db.content.push(item); }
      audit(db, session.username, created ? 'create' : status === 'published' ? 'publish' : 'edit', type, item.id);
    });
    return json(response, created ? 201 : 200, { message: 'Saved.', id: item.id });
  }
  return json(response, 404, { message: 'Not found.' });
}

async function serveStatic(pathname, response) {
  if (!pathname.startsWith('/assets/brand/') && !pathname.startsWith('/assets/icons/') && !pathname.startsWith('/assets/team/') && !['/favicon.svg','/site.webmanifest','/styles.css','/script.js','/admin.js'].includes(pathname)) return false;
  const rootAsset = ['/styles.css','/script.js','/admin.js'].includes(pathname);
  const normalized = pathname === '/favicon.svg' ? 'assets/favicon.svg' : pathname === '/site.webmanifest' ? 'site.webmanifest' : rootAsset ? pathname.slice(1) : pathname.replace(/^\//, '');
  const base = rootAsset ? root : publicDir;
  const target = path.resolve(base, normalized);
  if (!target.startsWith(`${base}${path.sep}`)) return false;
  try {
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime.get(path.extname(target)) || 'application/octet-stream', 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }); response.end(content); return true;
  } catch { return false; }
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; frame-src https://www.google.com/recaptcha/; connect-src 'self' https://www.google.com/recaptcha/; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    ...(isProduction ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } : {}),
  };
}

async function requestHandler(request, response) {
  Object.entries(securityHeaders()).forEach(([key, value]) => response.setHeader(key, value));
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const original = url.pathname;
  if (request.method === 'OPTIONS') { response.writeHead(204, { Allow: 'GET, POST, HEAD, OPTIONS' }); return response.end(); }
  if (!['GET','POST','HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, POST, HEAD' }); return response.end(); }

  if (['/styles.css','/script.js','/admin.js','/favicon.svg','/site.webmanifest'].includes(original) || original.startsWith('/assets/brand/') || original.startsWith('/assets/icons/') || original.startsWith('/assets/team/')) {
    if (await serveStatic(original, response)) return;
    response.writeHead(404); return response.end();
  }

  const explicitError = /^\/(?:([a-z]{2})\/)?(403|500|503)$/.exec(original);
  if (explicitError) return errorPage(response, Number(explicitError[2]), explicitError[1] === 'en' ? 'en' : 'fr');
  if (process.env.MAINTENANCE_MODE === 'true' && !original.startsWith('/admin') && !original.startsWith('/api/admin')) {
    if (original.startsWith('/api/')) return json(response, 503, { message: langFromPath(original) === 'fr' ? 'Service temporairement indisponible.' : 'Temporarily unavailable.' });
    return errorPage(response, 503, langFromPath(original));
  }

  if (request.method === 'POST' && original === '/api/contact') return handleContact(request, response);
  if (request.method === 'POST' && original === '/api/newsletter') return handleNewsletter(request, response);
  if (request.method === 'POST' && original === '/api/newsletter/confirm') return handleNewsletterConfirm(request, response);
  if (request.method === 'POST' && original === '/api/newsletter/unsubscribe') return handleNewsletterUnsubscribe(request, response);
  if (request.method === 'POST' && original === '/api/newsletter/preferences') return handleNewsletterPreferences(request, response);
  if (request.method === 'POST' && original === '/api/application') return handleApplication(request, response);
  if (request.method === 'POST' && original === '/api/admin/login') {
    if (isProduction && process.env.ADMIN_ACCESS_MODE !== 'private-network') return json(response, 404, { message: 'Not found.' });
    return handleAdminLogin(request, response);
  }
  if (original.startsWith('/api/admin/')) {
    if (isProduction && process.env.ADMIN_ACCESS_MODE !== 'private-network') return json(response, 404, { message: 'Not found.' });
    const session = getSession(request);
    if (!session) return json(response, 401, { message: 'Unable to sign in.' });
    return handleAdminAction(request, response, url, session);
  }

  if (original === '/admin' || original === '/admin/') {
    if (isProduction && process.env.ADMIN_ACCESS_MODE !== 'private-network') { response.writeHead(404, { 'Cache-Control': 'no-store' }); return response.end('Not found.'); }
    const session = getSession(request);
    const csrf = createCsrf(); setCookie(response, 'apah_csrf', csrf, { maxAge: 3600 });
    const html = renderAdminPage({ session, csrf, configReady: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH), canEdit: session && roleCan(session.role, 'edit'), canRecruit: session && roleCan(session.role, 'recruit') });
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); return response.end(html);
  }

  if (request.method === 'GET' || request.method === 'HEAD') {
    if (original === '/robots.txt') { response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return response.end(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\n${process.env.PUBLIC_SITE_URL ? `Sitemap: ${process.env.PUBLIC_SITE_URL.replace(/\/$/,'')}/sitemap.xml\n` : ''}`); }
    if (original === '/sitemap.xml') {
      if (!process.env.PUBLIC_SITE_URL) { response.writeHead(503); return response.end(''); }
      const origin = process.env.PUBLIC_SITE_URL.replace(/\/$/, ''); const baseKeys = ['home','about','services','projects','insights','actuality','sustainability','experts','careers','contact','newsletter','privacy','cookies','terms','legal','accessibility','consent','recruitment'];
      const db = await readDb();
      const urls = ['fr','en'].flatMap(lang => {
        const staticUrls = baseKeys.map(key => `${origin}${localizedHref(lang,key)}`);
        const serviceUrls = services.map(item => `${origin}${localizedHref(lang,'services')}services/${encodeURIComponent(item[0])}/`);
        const industryUrls = industries.map(item => `${origin}${localizedHref(lang,'services')}${lang === 'fr' ? 'secteurs' : 'industries'}/${encodeURIComponent(item[0])}/`);
        const expertUrls = experts.map(item => `${origin}${localizedHref(lang,'experts')}${encodeURIComponent(item.slug)}/`);
        const contentUrls = db.content.filter(item => item.lang === lang && item.status === 'published').map(item => `${origin}${localizedHref(lang, item.type === 'job' ? 'careers' : item.type === 'project' ? 'projects' : item.type === 'insight' ? 'insights' : 'actuality')}${encodeURIComponent(item.slug)}/`);
        return [...staticUrls, ...serviceUrls, ...industryUrls, ...expertUrls, ...contentUrls];
      });
      response.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' }); return response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${escapeHtml(u)}</loc></url>`).join('')}</urlset>`);
    }
    const route = routeFor(original === '/' ? '/fr/' : original);
    const handled = await handlePage(request, response, url, route);
    if (handled !== false) return;
  }
  return errorPage(response, 404, langFromPath(original));
}

const server = http.createServer((request, response) => {
  requestHandler(request, response).catch(error => {
    process.stderr.write(`Request failure: ${String(error?.code || error?.message || 'internal error').slice(0,120)}\n`);
    if (response.headersSent) return response.destroy();
    if (request.url?.startsWith('/api/')) return json(response, 500, { message: 'The request could not be completed.' });
    return errorPage(response, 500, langFromPath((request.url || '/').split('?')[0]));
  });
});
server.on('clientError', (_error, socket) => { if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n'); });
retentionSweep().catch(error => process.stderr.write(`Retention sweep unavailable: ${String(error?.code || 'error')}\n`));
const retentionTimer = setInterval(() => retentionSweep().catch(error => process.stderr.write(`Retention sweep unavailable: ${String(error?.code || 'error')}\n`)), 86_400_000);
retentionTimer.unref();
server.listen(port, process.env.HOST || '127.0.0.1', () => process.stdout.write(`APAH site listening on http://${process.env.HOST || '127.0.0.1'}:${port}\n`));
