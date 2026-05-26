/**
 * CraftCXM — Shared App Bootstrap
 * ----------------------------------
 * Call initApp(pageName, eventName) at the bottom of each page.
 * Handles: email persistence, hamburger menu, cart init,
 * and automatic page-view event tracking.
 */

const EMAIL_KEY   = 'craftcxm_email';
const API_KEY_KEY = 'craftcxm_api_key';

/* ── API key persistence ── */
function getStoredApiKey() {
  return localStorage.getItem(API_KEY_KEY) || '';
}

/* ── Email persistence ── */
function getStoredEmail() {
  return sessionStorage.getItem(EMAIL_KEY) || '';
}

function setStoredEmail(email) {
  if (email) {
    sessionStorage.setItem(EMAIL_KEY, email);
  } else {
    sessionStorage.removeItem(EMAIL_KEY);
  }
}

function syncEmailInputs(email) {
  const headerInput = document.getElementById('headerEmailInput');
  const mobileInput = document.getElementById('mobileEmailInput');
  if (headerInput) headerInput.value = email;
  if (mobileInput) mobileInput.value = email;

  const status = document.getElementById('headerEmailStatus');
  if (status) {
    status.classList.toggle('visible', !!email);
  }
}

function handleEmailCommit(email) {
  const trimmed = email.trim().toLowerCase();
  setStoredEmail(trimmed);
  syncEmailInputs(trimmed);

  if (trimmed) {
    // Create / update user in Iterable so the profile exists
    updateUser({ signupSource: 'CraftCXM Test App' }, trimmed);
  }
}

/* ── Email from URL (e.g. links in Iterable emails: ?email={{email}}) ── */
function readEmailFromURL() {
  const param = new URLSearchParams(window.location.search).get('email');
  if (param) setStoredEmail(param.trim().toLowerCase());
}

function wireEmailInputs() {
  const saved = getStoredEmail();
  syncEmailInputs(saved);

  ['headerEmailInput', 'mobileEmailInput'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    // Commit on Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEmailCommit(input.value);
        input.blur();
        showToast(`Tracking as: ${input.value.trim()}`, 'success');
      }
    });

    // Commit on blur
    input.addEventListener('blur', () => {
      if (input.value.trim() !== getStoredEmail()) {
        handleEmailCommit(input.value);
      }
    });

    // Keep both inputs in sync while typing
    input.addEventListener('input', () => {
      const other = id === 'headerEmailInput'
        ? document.getElementById('mobileEmailInput')
        : document.getElementById('headerEmailInput');
      if (other) other.value = input.value;
    });
  });
}

/* ── Hamburger menu ── */
function wireHamburger() {
  const btn       = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close when a nav link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !mobileNav.contains(e.target)) {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });
}

/* ── Nav link tracking ── */
function wireNavTracking() {
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      const destination = link.dataset.page;
      trackEvent('linkClick', { destination, source: 'header_nav', url: link.href });
    });
  });
}

/* ── Page-view tracking ── */
async function trackPageView(pageName) {
  if (!getStoredEmail()) return; // Silently skip if no email set
  await trackEvent('pageView', { page: pageName, url: window.location.pathname });
}

/* ── No-email warning banner ── */
function renderNoEmailBanner(container) {
  if (getStoredEmail()) return;
  const banner = document.createElement('div');
  banner.className = 'no-email-banner';
  banner.innerHTML = `
    ${Icons.alert}
    <span>Enter your email address in the header to start tracking events to your Iterable profile.</span>
  `;
  container.prepend(banner);
}

/* ── Main init ── */
function initApp(trackPageAs) {
  readEmailFromURL();
  wireEmailInputs();
  wireHamburger();
  wireNavTracking();
  initCart();

  if (trackPageAs) {
    trackPageView(trackPageAs);
  }
}
