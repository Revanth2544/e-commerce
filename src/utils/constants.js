export const API_BASE_URL = 'https://dummyjson.com';

export const TAX_RATE = 0.18; // 18% GST

export const COUPON_CODES = {
  SAVE10: { discount: 10, type: 'percentage', minCart: 2000, expiry: '2026-12-31', categories: [] },
  FLAT500: { discount: 500, type: 'flat', minCart: 5000, expiry: '2026-12-31', categories: [] },
  WELCOME20: { discount: 20, type: 'percentage', minCart: 0, expiry: '2026-12-31', categories: [] },
  SUPER1000: { discount: 1000, type: 'flat', minCart: 8000, expiry: '2026-12-31', categories: [] },
  TECH15: { discount: 15, type: 'percentage', minCart: 3000, expiry: '2026-12-31', categories: ['laptops', 'smartphones', 'tablets'] },
  FASHION10: { discount: 10, type: 'percentage', minCart: 2000, expiry: '2026-12-31', categories: ['tops', 'womens-dresses', 'mens-shirts'] },
  EXPIRED01: { discount: 50, type: 'percentage', minCart: 0, expiry: '2024-01-01', categories: [] },
};

// Fallback categories — real categories are fetched from DummyJSON API
export const PRODUCT_CATEGORIES = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tops',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
];
