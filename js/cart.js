/**
 * CraftCXM — Cart State & Panel
 * --------------------------------
 * Manages cart items in localStorage, renders the cart panel,
 * and fires Iterable updateCart / trackPurchase calls.
 */

const CART_KEY = 'craftcxm_cart';

/* ── State ── */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/* ── Mutations ── */
async function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
  updateCartBadge();

  const result = await updateCart(cart);
  if (result.ok) {
    showToast(`"${product.name}" added to cart`, 'success');
  } else {
    showToast(`Cart update failed: ${result.error}`, 'error');
  }
  return result;
}

async function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(cart);
  renderCart();
  updateCartBadge();

  await updateCart(cart);
}

async function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartBadge();
  await updateCart(cart);
  showToast('Item removed', 'info');
}

/* ── Purchase ── */
async function completePurchase() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }

  const total = cartTotal(cart);
  const btn = document.getElementById('purchaseBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processing…`;
  }

  const result = await trackPurchase(cart, parseFloat(total.toFixed(2)));

  if (result.ok) {
    saveCart([]);
    renderCart();
    updateCartBadge();
    closeCart();
    showToast(`Purchase of $${total.toFixed(2)} tracked successfully!`, 'success');
  } else {
    showToast(`Purchase failed: ${result.error}`, 'error');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = 'Purchase';
    }
  }
}

/* ── Render ── */
function renderCart() {
  const container = document.getElementById('cartItems');
  const footer    = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        ${Icons ? Icons.cartEmpty : ''}
        <p>Your cart is empty.<br>Head to the shop to add items.</p>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://picsum.photos/seed/fallback/64/64'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
            ${Icons ? Icons.trash : '✕'}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const total = cartTotal(cart);
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (footer) footer.style.display = 'block';
}

/* ── Badge ── */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;

  const count = getCart().reduce((sum, i) => sum + i.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

/* ── Panel open / close ── */
function openCart() {
  document.getElementById('cartPanel')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartPanel')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Initialise cart wiring ── */
function initCart() {
  renderCart();
  updateCartBadge();

  // Cart open button
  document.getElementById('cartBtn')?.addEventListener('click', openCart);

  // Close buttons
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartCloseBtnFooter')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Purchase
  document.getElementById('purchaseBtn')?.addEventListener('click', completePurchase);
}
