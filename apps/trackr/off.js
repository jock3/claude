// Open Food Facts client — open API, no key required, CORS-enabled.
// Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
// We query the global database (includes Swedish products) and normalise each
// product down to per-100g macros the meal modal can scale by portion size.

const BASE = 'https://world.openfoodfacts.org';

function round1(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
}

function normalizeProduct(p) {
  const n = p.nutriments || {};
  const kcal = n['energy-kcal_100g'];
  // Skip products with no usable energy value — they can't autofill anything.
  if (kcal == null || !Number.isFinite(Number(kcal))) return null;
  const name = (p.product_name || p.generic_name || '').trim();
  if (!name) return null;
  return {
    code: p.code,
    name,
    brand: (p.brands || '').split(',')[0].trim(),
    per100: {
      kcal: Math.round(Number(kcal)),
      protein: round1(n.proteins_100g),
      carbs: round1(n.carbohydrates_100g),
      fat: round1(n.fat_100g),
    },
  };
}

// Look up a single product by barcode (EAN/UPC). Returns a normalised product,
// or null if the barcode isn't in the database / has no usable energy value.
export async function getProductByBarcode(code, { signal } = {}) {
  const c = String(code || '').trim();
  if (!c) return null;
  const url =
    `${BASE}/api/v2/product/${encodeURIComponent(c)}.json` +
    `?fields=code,product_name,generic_name,brands,nutriments`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`OFF lookup failed (${res.status})`);
  const data = await res.json();
  if (!data || data.status !== 1 || !data.product) return null;
  return normalizeProduct(data.product);
}

// Search by free text. Returns up to ~20 normalised products with valid kcal.
export async function searchFoods(query, { signal } = {}) {
  const q = (query || '').trim();
  if (q.length < 2) return [];
  const url =
    `${BASE}/api/v2/search?search_terms=${encodeURIComponent(q)}` +
    `&page_size=24&sort_by=popularity_key` +
    `&fields=code,product_name,generic_name,brands,nutriments`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`OFF search failed (${res.status})`);
  const data = await res.json();
  const seen = new Set();
  const out = [];
  for (const p of data.products || []) {
    const norm = normalizeProduct(p);
    if (!norm || norm.per100.kcal <= 0) continue;
    const key = `${norm.name}|${norm.brand}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(norm);
    if (out.length >= 20) break;
  }
  return out;
}
