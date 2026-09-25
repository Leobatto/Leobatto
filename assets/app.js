const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const analyticsId = 'G-SQ8FEMRL4V';
const consentKey = 'leobatto_cookie_consent_v1';
let analyticsLoaded = false;
let consentBanner;

function readConsent() {
  try {
    return localStorage.getItem(consentKey);
  } catch {
    return null;
  }
}

function storeConsent(value) {
  try {
    localStorage.setItem(consentKey, value);
  } catch {
    // Si el navegador bloquea el almacenamiento, la elección dura esta visita.
  }
}

function loadAnalytics() {
  if (analyticsLoaded) return;

  window[`ga-disable-${analyticsId}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', analyticsId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  script.dataset.leobattoAnalytics = 'true';
  document.head.appendChild(script);
  analyticsLoaded = true;
}

function removeAnalyticsCookies() {
  const cookieNames = ['_ga', `_ga_${analyticsId.replace('G-', '')}`];
  const domains = ['', '; domain=.leobatto.com', '; domain=leobatto.com'];

  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    });
  });
}

function closeConsentBanner() {
  if (!consentBanner) return;
  consentBanner.hidden = true;
  document.body.classList.remove('cookie-banner-open');
}

function setConsent(value) {
  storeConsent(value);

  if (value === 'accepted') {
    loadAnalytics();
    closeConsentBanner();
    return;
  }

  window[`ga-disable-${analyticsId}`] = true;
  removeAnalyticsCookies();

  if (analyticsLoaded) {
    window.location.reload();
  } else {
    closeConsentBanner();
  }
}

function createConsentBanner() {
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'false');
  banner.setAttribute('aria-labelledby', 'cookie-banner-title');
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <div>
        <p class="cookie-banner__eyebrow">Tu privacidad</p>
        <h2 id="cookie-banner-title">¿Nos permitís medir las visitas?</h2>
        <p>Usamos Google Analytics sólo si aceptás. Nos ayuda a entender qué secciones resultan útiles; no usamos publicidad personalizada. <a href="/cookies/">Ver política de cookies</a>.</p>
      </div>
      <div class="cookie-banner__actions">
        <button class="cookie-choice cookie-choice--secondary" type="button" data-consent="rejected">Rechazar</button>
        <button class="cookie-choice cookie-choice--primary" type="button" data-consent="accepted">Aceptar analíticas</button>
      </div>
    </div>`;

  banner.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-consent]');
    if (choice) setConsent(choice.dataset.consent);
  });

  document.body.appendChild(banner);
  consentBanner = banner;
  return banner;
}

function openCookiePreferences() {
  const banner = consentBanner || createConsentBanner();
  banner.hidden = false;
  document.body.classList.add('cookie-banner-open');
  banner.querySelector('[data-consent="accepted"]').focus();
}

document.querySelectorAll('[data-open-cookie-preferences]').forEach((button) => {
  button.addEventListener('click', openCookiePreferences);
});

const savedConsent = readConsent();
if (savedConsent === 'accepted') {
  loadAnalytics();
} else if (savedConsent === 'rejected') {
  window[`ga-disable-${analyticsId}`] = true;
} else {
  openCookiePreferences();
}
