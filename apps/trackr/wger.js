// wger Workout Manager client — open API, no key required, CORS-enabled.
// Docs: https://wger.de/api/v2/  ·  Source: https://github.com/wger-project/wger
// This is the "Open Food Facts of exercises": a free, community-maintained
// database of ~900+ strength/cardio exercises in many languages. We use the
// lightweight search endpoint, which returns name + category + thumbnail —
// enough to pick an exercise to log sets against.

const BASE = 'https://wger.de/api/v2';
const MEDIA = 'https://wger.de';

// Resolve a (possibly relative) image path from the API to an absolute URL.
function mediaUrl(path) {
  if (!path) return null;
  return /^https?:\/\//.test(path) ? path : `${MEDIA}${path}`;
}

// Search exercises by free text. Returns up to ~20 deduped results.
// `language` is a comma-separated list of 2-letter codes; English has the
// broadest coverage and most gym terminology is shared with Swedish, so we
// default to Swedish + English and let the API merge them.
export async function searchExercises(query, { signal, language = 'sv,en' } = {}) {
  const q = (query || '').trim();
  if (q.length < 2) return [];
  const url =
    `${BASE}/exercise/search/?term=${encodeURIComponent(q)}` +
    `&language=${encodeURIComponent(language)}&format=json`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`wger search failed (${res.status})`);
  const data = await res.json();
  const seen = new Set();
  const out = [];
  for (const s of data.suggestions || []) {
    const d = s.data || {};
    const name = (d.name || s.value || '').trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      // base_id identifies the exercise across translations; fall back to id.
      exId: d.base_id != null ? d.base_id : d.id,
      name,
      category: d.category || '',
      image: mediaUrl(d.image_thumbnail || d.image),
    });
    if (out.length >= 20) break;
  }
  return out;
}
