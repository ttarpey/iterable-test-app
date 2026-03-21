/**
 * CraftCXM — Shared UI Components
 * ---------------------------------
 * Injects header, footer, and cart panel into every page.
 * Call initComponents() once per page before any other setup.
 */

/* ── SVG icon helpers ── */
const Icons = {
  home:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  shop:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  profile:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  prefs:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  cart:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  close:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  trash:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  check:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  cartEmpty:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
};

/* ── Header HTML ── */
function headerHTML() {
  return `
<header class="header">
  <div class="header-inner">
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>

    <a href="index.html" class="header-logo">
      <img src="assets/logo-light.png" alt="CraftCXM" id="headerLogoImg" onerror="this.style.display='none'">
    </a>

    <nav class="header-nav" aria-label="Main navigation">
      <a href="index.html" data-page="home">${Icons.home} Home</a>
      <a href="shop.html" data-page="shop">${Icons.shop} Shop</a>
      <a href="profile.html" data-page="profile">${Icons.profile} Profile</a>
      <a href="preferences.html" data-page="prefs">${Icons.prefs} Preferences</a>
    </nav>

    <div class="header-spacer"></div>

    <div class="header-email-wrapper">
      <input
        type="email"
        class="header-email-input"
        id="headerEmailInput"
        placeholder="your@email.com"
        aria-label="Tracking email address"
      >
      <span class="header-email-status" id="headerEmailStatus">✓ Tracking</span>
    </div>

    <button class="cart-btn" id="cartBtn" aria-label="Open cart">
      ${Icons.cart}
      <span class="badge" id="cartBadge" style="display:none">0</span>
    </button>
  </div>
</header>

<!-- Mobile nav -->
<nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
  <a href="index.html" data-page="home">${Icons.home} Home</a>
  <a href="shop.html" data-page="shop">${Icons.shop} Shop</a>
  <a href="profile.html" data-page="profile">${Icons.profile} Profile</a>
  <a href="preferences.html" data-page="prefs">${Icons.prefs} Preferences</a>
  <div class="mobile-nav-email">
    <label for="mobileEmailInput">Tracking email</label>
    <input
      type="email"
      id="mobileEmailInput"
      placeholder="your@email.com"
    >
  </div>
</nav>
`;
}

/* ── Footer HTML ── */
function footerHTML() {
  return `
<footer class="footer">
  <p>CraftCXM Iterable Test App &mdash; Internal use only &mdash;
    <a href="https://iterable.com" target="_blank" rel="noopener">Iterable</a>
  </p>
</footer>
`;
}

/* ── Cart Panel HTML ── */
function cartPanelHTML() {
  return `
<div class="cart-overlay" id="cartOverlay"></div>
<aside class="cart-panel" id="cartPanel" aria-label="Shopping cart">
  <div class="cart-header">
    <h3>Your Cart</h3>
    <button class="cart-close-btn" id="cartCloseBtn" aria-label="Close cart">
      ${Icons.close}
    </button>
  </div>
  <div class="cart-items" id="cartItems"></div>
  <div class="cart-footer" id="cartFooter" style="display:none">
    <div class="cart-total">
      <span class="cart-total-label">Total</span>
      <span class="cart-total-amount" id="cartTotal">$0.00</span>
    </div>
    <div class="cart-actions">
      <button class="btn btn-secondary" style="flex:1" id="cartCloseBtnFooter">Close</button>
      <button class="btn btn-primary" style="flex:1" id="purchaseBtn">Purchase</button>
    </div>
  </div>
</aside>

<!-- Toast container -->
<div class="toast-container" id="toastContainer"></div>
`;
}

/* ── Toast system ── */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const iconMap = {
    success: Icons.check,
    error:   Icons.alert,
    info:    Icons.info,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${iconMap[type] || Icons.info} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3500);
}

/* ── Inject everything and return Icons for page use ── */
function initComponents(currentPage) {
  // Header
  const headerRoot = document.getElementById('header-root');
  if (headerRoot) headerRoot.innerHTML = headerHTML();

  // Footer
  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) footerRoot.innerHTML = footerHTML();

  // Cart panel
  const cartRoot = document.getElementById('cart-panel-root');
  if (cartRoot) cartRoot.innerHTML = cartPanelHTML();

  // Mark active nav link
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  return Icons;
}
