/**
 * CraftCXM — Iterable API helpers
 * ---------------------------------
 * All calls go directly to Iterable's REST API using the API key
 * defined in config.js.  Each function returns { ok, data, error }.
 */

/* ── internal fetch wrapper ── */
async function iterableFetch(method, path, body = null) {
  const email = getStoredEmail();

  const opts = {
    method,
    headers: {
      'Api-Key':      ITERABLE_CONFIG.apiKey,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${ITERABLE_CONFIG.baseUrl}${path}`, opts);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) { data = text; }

    if (!res.ok) {
      const msg = data?.msg || data?.message || `HTTP ${res.status}`;
      return { ok: false, data: null, error: msg };
    }
    return { ok: true, data, error: null };
  } catch (err) {
    // Likely a CORS or network error
    return { ok: false, data: null, error: err.message };
  }
}

/* ── email guard ── */
function getStoredEmail() {
  return localStorage.getItem('craftcxm_email') || '';
}

function requireEmail() {
  const email = getStoredEmail();
  if (!email) {
    showToast('Please enter your email address in the header first.', 'error');
    return null;
  }
  return email;
}

/* ============================================================
   EVENTS
   ============================================================ */

/**
 * Track a custom event.
 * @param {string} eventName
 * @param {object} [dataFields]
 */
async function trackEvent(eventName, dataFields = {}) {
  const email = requireEmail();
  if (!email) return { ok: false };

  const result = await iterableFetch('POST', '/events/track', {
    email,
    eventName,
    dataFields,
  });

  if (result.ok) {
    console.log(`[Iterable] Event tracked: ${eventName}`, dataFields);
  } else {
    console.warn(`[Iterable] trackEvent failed:`, result.error);
  }
  return result;
}

/* ============================================================
   COMMERCE
   ============================================================ */

/**
 * Update the cart contents in Iterable.
 * @param {Array} items  — array of cart items (see config.js PRODUCTS shape)
 */
async function updateCart(items) {
  const email = requireEmail();
  if (!email) return { ok: false };

  const payload = {
    user:  { email },
    items: items.map(cartItemToIterableItem),
  };

  const result = await iterableFetch('POST', '/commerce/updateCart', payload);

  if (result.ok) {
    console.log('[Iterable] Cart updated', payload.items);
  } else {
    console.warn('[Iterable] updateCart failed:', result.error);
  }
  return result;
}

/**
 * Track a purchase.
 * @param {Array}  items  — final cart items
 * @param {number} total  — order total
 */
async function trackPurchase(items, total) {
  const email = requireEmail();
  if (!email) return { ok: false };

  const payload = {
    user:  { email },
    items: items.map(cartItemToIterableItem),
    total,
    dataFields: {
      orderSource: 'CraftCXM Test App',
    },
  };

  const result = await iterableFetch('POST', '/commerce/trackPurchase', payload);

  if (result.ok) {
    console.log('[Iterable] Purchase tracked', payload);
  } else {
    console.warn('[Iterable] trackPurchase failed:', result.error);
  }
  return result;
}

/** Map internal cart item → Iterable commerce item */
function cartItemToIterableItem(item) {
  return {
    id:          item.id,
    sku:         item.sku,
    name:        item.name,
    description: item.description || '',
    categories:  item.category ? [item.category] : [],
    price:       item.price,
    quantity:    item.quantity,
    imageUrl:    item.imageUrl || '',
  };
}

/* ============================================================
   USER
   ============================================================ */

/**
 * Fetch a user's profile from Iterable.
 * @param {string} email
 */
async function getUser(email) {
  const result = await iterableFetch('GET', `/users/${encodeURIComponent(email)}`);
  if (result.ok) {
    console.log('[Iterable] User fetched', result.data);
  } else {
    console.warn('[Iterable] getUser failed:', result.error);
  }
  return result;
}

/**
 * Create or update a user profile.
 * @param {object} dataFields  — e.g. { firstName, lastName, country }
 * @param {string} [emailOverride]  — defaults to stored email
 */
async function updateUser(dataFields, emailOverride) {
  const email = emailOverride || requireEmail();
  if (!email) return { ok: false };

  const result = await iterableFetch('POST', '/users/update', {
    email,
    dataFields,
  });

  if (result.ok) {
    console.log('[Iterable] User updated', dataFields);
  } else {
    console.warn('[Iterable] updateUser failed:', result.error);
  }
  return result;
}

/* ============================================================
   SUBSCRIPTIONS / PREFERENCES
   ============================================================ */

/**
 * Fetch all message types defined in the Iterable account.
 */
async function getMessageTypes() {
  const result = await iterableFetch('GET', '/messageTypes');
  if (result.ok) {
    console.log('[Iterable] Message types fetched', result.data);
  } else {
    console.warn('[Iterable] getMessageTypes failed:', result.error);
  }
  return result;
}

/**
 * Fetch all channels defined in the Iterable account.
 */
async function getChannels() {
  const result = await iterableFetch('GET', '/channels');
  if (result.ok) {
    console.log('[Iterable] Channels fetched', result.data);
  } else {
    console.warn('[Iterable] getChannels failed:', result.error);
  }
  return result;
}

/**
 * Update a user's subscription preferences.
 * @param {object} params
 * @param {number[]} params.unsubscribedChannelIds
 * @param {number[]} params.unsubscribedMessageTypeIds
 * @param {number[]} params.subscribedMessageTypeIds
 */
async function updateSubscriptions({ unsubscribedChannelIds = [], unsubscribedMessageTypeIds = [], subscribedMessageTypeIds = [] }) {
  const email = requireEmail();
  if (!email) return { ok: false };

  const result = await iterableFetch('POST', '/users/updateSubscriptions', {
    email,
    unsubscribedChannelIds,
    unsubscribedMessageTypeIds,
    subscribedMessageTypeIds,
  });

  if (result.ok) {
    console.log('[Iterable] Subscriptions updated', { unsubscribedChannelIds, unsubscribedMessageTypeIds });
  } else {
    console.warn('[Iterable] updateSubscriptions failed:', result.error);
  }
  return result;
}
