/**
 * CraftCXM — Iterable Test App Configuration
 * -------------------------------------------
 * Replace YOUR_API_KEY_HERE with your Iterable sandbox API key.
 * Find it in your Iterable account under: Settings > API Keys
 */

const ITERABLE_CONFIG = {
  apiKey:  '990cab827f744c03b740ca37a6e69730',
  baseUrl: 'https://api.iterable.com/api',
};

/**
 * Shop product catalogue.
 * Update names, prices, or images freely — these flow directly
 * into Iterable's updateCart / trackPurchase payloads.
 */
const PRODUCTS = [
  {
    id:          'prod-001',
    sku:         'WH-001',
    name:        'Wireless Headphones',
    description: 'Premium sound, 30-hour battery, all-day comfort.',
    price:       79.99,
    category:    'Electronics',
    imageUrl:    'https://picsum.photos/seed/craft-wh/400/300',
  },
  {
    id:          'prod-002',
    sku:         'LJ-002',
    name:        'Leather Journal',
    description: 'Hand-stitched genuine leather cover, 240 pages.',
    price:       24.99,
    category:    'Stationery',
    imageUrl:    'https://picsum.photos/seed/craft-lj/400/300',
  },
  {
    id:          'prod-003',
    sku:         'CM-003',
    name:        'Ceramic Coffee Mug',
    description: 'Handcrafted matte ceramic, 350 ml, dishwasher safe.',
    price:       18.99,
    category:    'Kitchen',
    imageUrl:    'https://picsum.photos/seed/craft-cm/400/300',
  },
  {
    id:          'prod-004',
    sku:         'SC-004',
    name:        'Scented Candle Set',
    description: 'Set of 3 hand-poured soy wax candles, 40-hour burn.',
    price:       34.99,
    category:    'Home',
    imageUrl:    'https://picsum.photos/seed/craft-sc/400/300',
  },
  {
    id:          'prod-005',
    sku:         'DO-005',
    name:        'Bamboo Desk Organiser',
    description: 'Sustainable bamboo, 5 compartments, natural finish.',
    price:       44.99,
    category:    'Office',
    imageUrl:    'https://picsum.photos/seed/craft-do/400/300',
  },
  {
    id:          'prod-006',
    sku:         'NB-006',
    name:        'Premium Notebook',
    description: 'Dotted grid, 200 pages, lay-flat binding, A5 format.',
    price:       19.99,
    category:    'Stationery',
    imageUrl:    'https://picsum.photos/seed/craft-nb/400/300',
  },
  {
    id:          'prod-007',
    sku:         'KT-007',
    name:        'Cable Knit Throw',
    description: 'Cosy 100% merino wool throw, 130 × 170 cm.',
    price:       59.99,
    category:    'Home',
    imageUrl:    'https://picsum.photos/seed/craft-kt/400/300',
  },
  {
    id:          'prod-008',
    sku:         'MW-008',
    name:        'Minimalist Watch',
    description: 'Stainless steel case, sapphire crystal glass, 5 ATM.',
    price:       129.99,
    category:    'Accessories',
    imageUrl:    'https://picsum.photos/seed/craft-mw/400/300',
  },
];
