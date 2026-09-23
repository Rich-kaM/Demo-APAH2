const panel = document.querySelector('[data-dashboard-data]');
const message = document.querySelector('[data-admin-message]');

document.querySelectorAll('[data-admin-form]').forEach(form => form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type=submit]');
  const previous = button.textContent;
  button.disabled = true;
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), credentials: 'same-origin', headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'The request failed.');
    if (result.redirect) { location.assign(result.redirect); return; }
    message.textContent = result.message;
    message.focus();
    form.reset();
    if (panel) await loadDashboard();
  } catch (error) {
    message.textContent = error.message || 'The request failed.';
    message.focus();
  } finally { button.disabled = false; button.textContent = previous; }
}));

async function loadDashboard() {
  if (!panel) return;
  const response = await fetch('/api/admin/data', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (!response.ok) { message.textContent = 'Could not load dashboard data.'; return; }
  const data = await response.json();
  const dashboard = document.querySelector('[data-dashboard-data]');
  const sections = [
    ['Published and draft content', data.content || [], item => `${item.type} · ${item.lang} · ${item.status} · ${item.title}`],
    ['Applications', data.applications || [], item => `${item.createdAt} · ${item.name} · ${item.role} · ${item.status}`],
    ['Inquiries', data.inquiries || [], item => `${item.createdAt} · ${item.name} · ${item.topic} · ${item.email}`],
    ['Newsletter records', data.subscribers || [], item => `${item.email} · ${item.lang} · ${item.confirmedAt ? 'confirmed' : 'pending'}`],
    ['Audit log', data.audit || [], item => `${item.at} · ${item.actor} · ${item.action} · ${item.type}`],
  ];
  dashboard.replaceChildren();
  for (const [title, items, format] of sections) {
    const section = document.createElement('section');
    const heading = document.createElement('h2'); heading.textContent = title; section.append(heading);
    if (!items.length) { const p = document.createElement('p'); p.textContent = 'No records.'; section.append(p); }
    else { const list = document.createElement('ul'); for (const item of items) { const li = document.createElement('li'); li.textContent = format(item); if (title === 'Published and draft content') { const form = document.querySelector('[data-content-editor]'); if (form && form.elements.namedItem('id')) { const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Edit'; button.addEventListener('click', () => { for (const [key, value] of Object.entries(item)) { const field = form.elements.namedItem(key); if (!field) continue; if (field.type === 'checkbox') field.checked = Boolean(value); else if (typeof value === 'string') field.value = value; } form.scrollIntoView({ behavior: 'smooth', block: 'start' }); form.elements.namedItem('title').focus(); }); li.append(document.createElement('br'), button); }
        const canAct = item.type === 'job' ? data.canPublishJobs : data.canPublish;
        if (canAct && ['draft','review','approved'].includes(item.status)) { const publish = document.createElement('button'); publish.type = 'button'; publish.textContent = item.status === 'approved' ? 'Publish' : 'Approve'; publish.addEventListener('click', async () => { const csrf = document.querySelector('[data-content-editor] input[name=csrf]')?.value || document.querySelector('input[name=csrf]')?.value || ''; const body = new URLSearchParams({ csrf, id: item.id, status: item.status === 'approved' ? 'published' : 'approved' }); const result = await fetch('/api/admin/content-status', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body }); if (!result.ok) { message.textContent = (await result.json()).message || 'Status update failed.'; return; } await loadDashboard(); }); li.append(document.createElement('br'), publish); }
      } if (title === 'Applications' && item.cvAvailable) { const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Create a five-minute download link'; button.addEventListener('click', async () => { const result = await fetch(`/api/admin/application-download-token?id=${encodeURIComponent(item.id)}`, { credentials: 'same-origin' }); if (!result.ok) { message.textContent = 'Could not create a download link.'; return; } const link = await result.json(); const anchor = document.createElement('a'); anchor.href = link.url; anchor.textContent = 'Download CV'; anchor.rel = 'nofollow'; li.append(document.createElement('br'), anchor); button.disabled = true; }); li.append(document.createElement('br'), button); } list.append(li); } section.append(list); }
    dashboard.append(section);
  }
}

if (panel) loadDashboard();
