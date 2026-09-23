(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  const themeButtons = [...document.querySelectorAll('[data-theme-toggle]')];
  const headerLogo = document.querySelector('.site-header [data-logo-light]');
  const year = document.querySelector('[data-year]');
  const header = document.querySelector('[data-header]');
  const searchToggle = document.querySelector('.search-toggle');
  const searchPanel = document.querySelector('.header-search-panel');

  if (year) year.textContent = String(new Date().getFullYear());

  const setMenu = (open, returnFocus = false) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    const french = document.documentElement.lang === 'fr';
    menuButton.setAttribute('aria-label', open ? (french ? 'Fermer le menu' : 'Close menu') : (french ? 'Ouvrir le menu' : 'Open menu'));
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) navigation.querySelector('a')?.focus();
    else if (returnFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (!navigation?.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false, true);
    } else if (event.key === 'Tab') {
      const focusable = [...navigation.querySelectorAll('a, button')].filter(item => item.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const setTheme = theme => {
    root.dataset.theme = theme;
    if (headerLogo) headerLogo.src = theme === 'dark' ? headerLogo.dataset.logoLight : headerLogo.dataset.logoFull;
    try { localStorage.setItem('apah-theme', theme); } catch { /* Storage may be disabled. */ }
    themeButtons.forEach(button => {
      const dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      const french = document.documentElement.lang === 'fr';
      button.setAttribute('aria-label', dark ? (french ? 'Activer le mode clair' : 'Switch to light mode') : (french ? 'Activer le mode sombre' : 'Switch to dark mode'));
      button.textContent = dark ? (french ? 'Mode clair' : 'Light mode') : (french ? 'Mode sombre' : 'Dark mode');
    });
  };

  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('apah-theme') === 'dark' ? 'dark' : 'light'; } catch { /* Use the light default. */ }
  setTheme(savedTheme);
  themeButtons.forEach(button => button.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  }));

  let searchCloseTimer;
  const setSearch = (open, returnFocus = false) => {
    if (!searchToggle || !searchPanel) return;
    clearTimeout(searchCloseTimer);
    const french = document.documentElement.lang === 'fr';
    searchToggle.setAttribute('aria-expanded', String(open));
    searchToggle.setAttribute('aria-label', open ? (french ? 'Fermer la recherche' : 'Close search') : (french ? 'Ouvrir la recherche' : 'Open search'));
    searchPanel.setAttribute('aria-hidden', String(!open));
    if (open) {
      searchPanel.hidden = false;
      requestAnimationFrame(() => searchPanel.classList.add('is-visible'));
      searchPanel.querySelector('input')?.focus();
    } else {
      searchPanel.classList.remove('is-visible');
      searchCloseTimer = setTimeout(() => { searchPanel.hidden = true; }, 180);
      if (returnFocus) searchToggle.focus();
    }
  };
  searchToggle?.addEventListener('click', () => setSearch(searchToggle.getAttribute('aria-expanded') !== 'true'));
  searchPanel?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); setSearch(false, true); }
  });
  document.addEventListener('pointerdown', event => {
    if (searchToggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.header-search')) setSearch(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && searchToggle?.getAttribute('aria-expanded') === 'true') setSearch(false, true);
  });

  const banner = document.querySelector('[data-cookie-banner]');
  const cookieAccepted = (() => { try { return localStorage.getItem('apah-cookie-notice') === 'seen'; } catch { return false; } })();
  if (banner && !cookieAccepted) banner.hidden = false;
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
    try { localStorage.setItem('apah-cookie-notice', 'seen'); } catch { /* Continue without storage. */ }
    banner.hidden = true;
  });
  document.querySelector('[data-clear-preferences]')?.addEventListener('click', () => {
    try { localStorage.removeItem('apah-theme'); localStorage.removeItem('apah-cookie-notice'); } catch { /* Storage may be unavailable. */ }
    setTheme('light');
    if (banner) banner.hidden = false;
  });

  document.querySelectorAll('[data-switch-target]').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.switchTarget;
    for (const item of document.querySelectorAll('[data-switch-target]')) item.setAttribute('aria-pressed', String(item === button));
    for (const id of ['services', 'industries']) {
      const section = document.getElementById(id);
      if (section) section.hidden = id !== target;
    }
  }));

  const topic = new URLSearchParams(location.search).get('topic');
  const topicSelect = document.querySelector('select[name="topic"]');
  if (topic && topicSelect) {
    const option = [...topicSelect.options].find(item => item.value === topic || item.textContent === topic);
    if (option) topicSelect.value = option.value;
  }

  document.querySelectorAll('[data-load-captcha]').forEach(input => input.addEventListener('change', async () => {
    const form = input.closest('form');
    const slot = form.querySelector('[data-recaptcha]');
    if (!input.checked || !slot || slot.dataset.loaded) return;
    slot.dataset.loaded = 'true';
    if (slot.dataset.testMode === 'true') {
      slot.innerHTML = `<label class="checkbox-label captcha-test"><input type="checkbox" name="captchaSandbox" value="verified" required><span>${slot.dataset.label}: ${document.documentElement.lang === 'fr' ? 'vérification de test locale' : 'local test verification'}</span></label>`;
      return;
    }
    if (!slot.dataset.sitekey) {
      slot.innerHTML = `<p class="field-error">${document.documentElement.lang === 'fr' ? 'Le service de vérification est actuellement indisponible.' : 'Verification is currently unavailable.'}</p>`;
      return;
    }
    window.apahCaptchaReady = () => {
      window.grecaptcha.render(slot, { sitekey: slot.dataset.sitekey });
    };
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=apahCaptchaReady&render=explicit';
    script.async = true;
    script.defer = true;
    script.onerror = () => { slot.textContent = document.documentElement.lang === 'fr' ? 'Le service de vérification n’a pas pu être chargé.' : 'The verification service could not be loaded.'; };
    document.head.append(script);
  }));

  document.querySelectorAll('[data-async-form]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const summary = form.querySelector('[data-error-summary]');
    const lang = document.documentElement.lang;
    const errors = [];
    for (const control of form.querySelectorAll('[required]')) {
      if (control.type === 'file' ? !control.files?.length : control.type === 'checkbox' ? !control.checked : !control.value.trim()) {
        const label = control.closest('label')?.textContent.replace('*', '').trim() || control.name;
        errors.push({ control, message: `${label}: ${lang === 'fr' ? 'ce champ est obligatoire.' : 'this field is required.'}` });
      } else if (control.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value)) {
        errors.push({ control, message: lang === 'fr' ? 'Saisissez une adresse courriel valide.' : 'Enter a valid email address.' });
      }
    }
    for (const error of form.querySelectorAll('.field-error')) error.textContent = '';
    form.querySelectorAll('[aria-invalid=true]').forEach(control => control.removeAttribute('aria-invalid'));
    if (errors.length) {
      summary.hidden = false;
      summary.innerHTML = `<strong>${lang === 'fr' ? 'Vérifiez les champs suivants :' : 'Please check these fields:'}</strong><ul>${errors.map(({ control, message }, i) => `<li><a href="#form-error-${i}">${message}</a></li>`).join('')}</ul>`;
      errors.forEach(({ control, message }, i) => {
        control.id ||= `form-error-${i}`;
        control.setAttribute('aria-invalid', 'true');
        const fieldError = form.querySelector(`[data-error-for="${CSS.escape(control.name)}"]`);
        if (fieldError) fieldError.textContent = message;
      });
      summary.focus();
      return;
    }
    summary.hidden = true;
    const submit = form.querySelector('[type=submit]');
    const oldText = submit.textContent;
    submit.disabled = true;
    submit.textContent = lang === 'fr' ? 'Envoi…' : 'Sending…';
    status.textContent = '';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || (lang === 'fr' ? 'Échec de l’envoi.' : 'Submission failed.'));
      status.textContent = result.message || (lang === 'fr' ? 'Votre demande a été reçue.' : 'Your request has been received.');
      status.dataset.state = 'success';
      form.reset();
      status.focus();
    } catch (error) {
      status.textContent = error.message || (lang === 'fr' ? 'Une erreur est survenue. Réessayez plus tard.' : 'Something went wrong. Please try again later.');
      status.dataset.state = 'error';
      status.focus();
    } finally {
      submit.disabled = false;
      submit.textContent = oldText;
    }
  }));

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealItems = document.querySelectorAll('.section-heading, .expert-card, .article-card, .service-card, .industry-card');
    if (revealItems.length) {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
      revealItems.forEach(item => { item.classList.add('motion-reveal'); revealObserver.observe(item); });
    }
  }
  window.matchMedia('(min-width: 1001px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
})();
