# CraftCXM — Iterable Test App

A lightweight, static web app for testing [Iterable](https://iterable.com) features against a shared sandbox. Colleagues visit a single URL, enter their email, and interact with a simulated e-commerce store — every action fires real Iterable API calls, feeding journeys, updating user profiles, and managing subscription preferences.

**No build step. No framework. No install required.**

---

## Features

| Page | What it does |
|---|---|
| **Home** | Navigation hub, fires `nav_link_clicked` events |
| **Shop** | Browse 8 products, add to cart — fires `updateCart` on every change |
| **Cart** | Adjust quantities, remove items, complete purchase — fires `trackPurchase` |
| **Profile** | Fetch and update Iterable user data fields (first name, last name, country) |
| **Preferences** | Manage channel and message type subscriptions live from the sandbox |

Every page view fires a `pageView` event. Entering an email in the header creates or updates the user in Iterable via `users/update`.

---

## Quick Start (local)

```bash
npx serve .
```

Then open `http://localhost:3000` in your browser. Enter your email in the header to start tracking.

> **Ad blockers** can silently block requests to `api.iterable.com`. If calls are failing locally, test in an incognito/private window with extensions disabled.

---

## Deploying (free, private repo)

> **Note:** GitHub Pages requires a paid plan for private repositories. The options below are all free forever and support private GitHub repos.

### Option A — Netlify (recommended)

1. Sign up free at [netlify.com](https://netlify.com)
2. **New site → Import from Git** → connect your private GitHub repo
3. Leave the build command blank; set **Publish directory** to `.`
4. Click **Deploy** — live at `https://<name>.netlify.app`
5. Pushes to `main` redeploy automatically

To rename the URL: **Site settings → Domain management → Change site name**.

### Option B — Vercel

1. Sign up free at [vercel.com](https://vercel.com) (Hobby plan, no expiry)
2. **New Project → Import Git Repository** → connect your private GitHub repo
3. Framework preset: **Other**; leave all build settings blank
4. Click **Deploy** — live at `https://<repo>.vercel.app`
5. Pushes to `main` redeploy automatically

### Option C — Cloudflare Pages

1. Sign up free at [cloudflare.com](https://cloudflare.com)
2. **Workers & Pages → Create → Pages → Connect to Git**
3. Select your private repo; leave build settings blank
4. Deploy — live at `https://<name>.pages.dev`

---

## Configuration

### API Key

Find your API key in Iterable under **Integrations → API Keys**.

Add your API key on the Home Page and click connect. A successful connection will result in the Connect button turning green and the text updates to connected. The connection will persist until the browser is closed as it is held in the browser's local storgage.

### Product Catalogue

**File:** `js/config.js` — the `PRODUCTS` array below `ITERABLE_CONFIG`

Each product has the following shape:

```js
{
  id:          'prod-001',          // unique identifier (used in cart state)
  sku:         'WH-001',           // SKU sent to Iterable commerce endpoints
  name:        'Wireless Headphones',
  description: 'Premium sound, 30-hour battery, all-day comfort.',
  price:       79.99,              // numeric, in dollars
  category:    'Electronics',
  imageUrl:    'https://...',      // any publicly accessible image URL
}
```

Add, remove, or edit products freely — they flow directly into `updateCart` and `trackPurchase` payloads with no other changes needed.

### Logo

Place logo files in the `assets/` folder:

| File | Used on |
|---|---|
| `assets/logo-dark.png` | Home page hero (light background) |
| `assets/logo-light.png` | Header (dark background) |

If either file is missing the slot is simply empty — no broken image icons.

---

## API Endpoints

All Iterable calls are in **`js/iterable.js`**. This is the only file to edit if you need to change request payloads, add new endpoints, or swap the API region.

| Function | Endpoint | Triggered by |
|---|---|---|
| `trackEvent(name, fields)` | `POST /events/track` | Page views, nav clicks |
| `updateCart(items)` | `POST /commerce/updateCart` | Add/remove/qty change in cart |
| `trackPurchase(items, total)` | `POST /commerce/trackPurchase` | Purchase button |
| `getUser(email)` | `GET /users/{email}` | Profile page load, Refresh button |
| `updateUser(dataFields)` | `POST /users/update` | Header email input, Profile save |
| `getMessageTypes()` | `GET /messageTypes` | Preferences page load |
| `getChannels()` | `GET /channels` | Preferences page load |
| `updateSubscriptions(params)` | `POST /users/updateSubscriptions` | Preferences save |

### Changing the API region

If your Iterable account uses the **EU region**, update `baseUrl` in `js/config.js`:

```js
baseUrl: 'https://api.eu.iterable.com/api',
```

---

## File Structure

```
├── index.html               # Home page
├── shop.html                # Product catalogue
├── profile.html             # User profile form
├── preferences.html         # Subscription preference centre
├── assets/
│   ├── logo-dark.png        # Logo for light backgrounds
│   └── logo-light.png       # Logo for dark backgrounds (header)
├── css/
│   └── styles.css           # Full design system (tokens, layout, components)
└── js/
    ├── config.js            # ⚙️  API key + product catalogue — edit this first
    ├── iterable.js          # All Iterable API calls
    ├── components.js        # Shared header, footer, cart panel, toast system
    ├── cart.js              # Cart state, rendering, and purchase logic
    └── app.js               # Email persistence, page tracking, nav wiring
```

Each HTML page loads scripts in this order: `config.js → iterable.js → components.js → cart.js → app.js → inline page script`.

---

## Forking / Customising

1. **Fork the repository** on GitHub
2. Make any desired changes to the code
2. Connect your fork to Netlify, Vercel, or Cloudflare Pages (see Deploying section above)
3. Push to `main`

To add a new Iterable API call, add a function to `js/iterable.js` following the existing pattern — each function uses the internal `iterableFetch(method, path, body)` wrapper which handles auth headers, JSON parsing, and error formatting automatically.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ERR_BLOCKED_BY_CLIENT` in console | Ad blocker blocking `api.iterable.com` | Test in incognito, or whitelist the site |
| `CORS` error in console | Browser blocking cross-origin request | Iterable allows browser `fetch()` — check the API key is valid |
| `401 Unauthorized` | Invalid or missing API key | Check `js/config.js` → `ITERABLE_CONFIG.apiKey` |
| `404` on user fetch | User doesn't exist in Iterable yet | Save a profile first to create the user |
| Preferences page shows no channels | Sandbox has no channels/message types configured | Set up channels and message types in your Iterable account |
| Calls succeed locally but fail after deploy | API key not committed to the repo | Ensure `js/config.js` is not in `.gitignore` |

---

*Internal use only — CraftCXM Iterable Test App*
