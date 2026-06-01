// Track3r — tracking hub · state store, seed data, derived metrics, utils
// Single source of truth. Persists to localStorage. Exports on window.
//
// Data model (all weights stored in kg; UI converts for lb):
//   state = {
//     goals: { kcal, protein, carbs, fat, steps, weight },
//     days: { 'YYYY-MM-DD': { meals:[], workouts:[], steps:Number|null, weight:Number|null } }
//   }
// A day's meal:    { id, slot, name, time, kcal, protein, carbs, fat }
// A day's workout: { id, kind, name, durationMin, kcal, tags:[] }

const STORE_KEY = 'track3r.hub.v2';

// Anchor "today" to the mid-fi's reference date so seeded history + the
// demo day line up coherently. (A real build would use new Date().)
const TODAY_KEY = '2026-05-19';

// ── date helpers ────────────────────────────────────────────────────────────
function pad2(n) { return String(n).padStart(2, '0'); }
function keyOf(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function parseKey(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(k, n) { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); }
function todayKey() { return TODAY_KEY; }

const WD_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MO_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function fmtDayLabel(k) {
  const d = parseKey(k);
  return `${WD_SHORT[d.getDay()]} · ${d.getDate()} ${MO_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtRelative(k) {
  const t = todayKey();
  if (k === t) return 'Today';
  if (k === addDays(t, -1)) return 'Yesterday';
  if (k === addDays(t, 1)) return 'Tomorrow';
  return null;
}

// thousands-grouped integer: 1840 -> "1 840"
function grp(n) {
  if (n == null || isNaN(n)) return '–';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// weight display: kg stored, convert to lb when unit==='lb'
function wDisp(kg, unit) {
  if (kg == null) return null;
  return unit === 'lb' ? +(kg * 2.20462).toFixed(1) : +kg.toFixed(1);
}
function wToKg(val, unit) { return unit === 'lb' ? val / 2.20462 : val; }

// ── deterministic PRNG (mulberry32) so the demo is stable across reloads ─────
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── meal + workout pools for seeding past days ──────────────────────────────
const MEAL_POOL = {
  Breakfast: [
    { name: 'Oatmeal, banana & whey', kcal: 420, protein: 24, carbs: 60, fat: 9 },
    { name: 'Eggs, avocado & toast', kcal: 460, protein: 26, carbs: 34, fat: 24 },
    { name: 'Skyr, granola & berries', kcal: 360, protein: 28, carbs: 46, fat: 7 },
    { name: 'Protein pancakes', kcal: 480, protein: 34, carbs: 52, fat: 12 },
  ],
  Lunch: [
    { name: 'Chicken & rice bowl', kcal: 560, protein: 38, carbs: 58, fat: 14 },
    { name: 'Salmon, quinoa & greens', kcal: 600, protein: 40, carbs: 44, fat: 26 },
    { name: 'Beef burrito bowl', kcal: 680, protein: 42, carbs: 66, fat: 24 },
    { name: 'Tuna pasta salad', kcal: 520, protein: 36, carbs: 56, fat: 14 },
  ],
  Snack: [
    { name: 'Greek yoghurt & berries', kcal: 220, protein: 18, carbs: 22, fat: 6 },
    { name: 'Cottage cheese & nuts', kcal: 260, protein: 22, carbs: 10, fat: 16 },
    { name: 'Protein bar', kcal: 210, protein: 20, carbs: 22, fat: 7 },
    { name: 'Apple & peanut butter', kcal: 240, protein: 8, carbs: 28, fat: 12 },
  ],
  Dinner: [
    { name: 'Pasta bolognese', kcal: 640, protein: 12, carbs: 40, fat: 19 },
    { name: 'Stir-fry chicken & noodles', kcal: 620, protein: 44, carbs: 62, fat: 18 },
    { name: 'Steak, potatoes & salad', kcal: 720, protein: 48, carbs: 48, fat: 32 },
    { name: 'Cod, rice & vegetables', kcal: 540, protein: 42, carbs: 52, fat: 12 },
  ],
};

// PPL-ish split with rest days, indexed by day-of-cycle
const WORKOUT_CYCLE = ['Push', 'Pull', 'Legs', 'Rest', 'Run', 'Push', 'Rest'];
const WORKOUT_META = {
  Push: { name: 'Push day · chest + shoulders', kind: 'Strength', durationMin: 52, kcal: 340, tags: ['Strength', 'Chest', 'Shoulders'] },
  Pull: { name: 'Pull day · back + biceps', kind: 'Strength', durationMin: 48, kcal: 320, tags: ['Strength', 'Back', 'Biceps'] },
  Legs: { name: 'Leg day · squat focus', kind: 'Strength', durationMin: 58, kcal: 410, tags: ['Strength', 'Legs'] },
  Run: { name: 'Zone 2 run · 8 km', kind: 'Cardio', durationMin: 44, kcal: 460, tags: ['Cardio', 'Run'] },
};

let __uid = 1;
function uid(prefix) { return `${prefix}_${Date.now().toString(36)}_${(__uid++).toString(36)}`; }

// ── seed: ~70 days of plausible history ending today ────────────────────────
function seedState() {
  const goals = { kcal: 2400, protein: 160, carbs: 240, fat: 70, steps: 10000, weight: 70 };
  const days = {};
  const SPAN = 74;
  const start = addDays(TODAY_KEY, -(SPAN - 1));

  for (let i = 0; i < SPAN; i++) {
    const k = addDays(start, i);
    const d = parseKey(k);
    const r = rng(i * 2654435761 + 12345);
    const dow = d.getDay();

    // weight: gentle downward trend 74.0 -> 72.3 with daily noise
    const trend = 74.0 - (1.7 * i) / (SPAN - 1);
    const weight = +(trend + (r() - 0.5) * 0.5).toFixed(1);

    // steps: weekdays higher, weekends mixed
    const base = dow === 0 || dow === 6 ? 6500 : 9200;
    const steps = Math.round(base + (r() - 0.4) * 4200);

    // workout from cycle (skip ~1 in 8 even if not a rest day)
    const cyc = WORKOUT_CYCLE[i % WORKOUT_CYCLE.length];
    const workouts = [];
    if (cyc !== 'Rest' && r() > 0.12) {
      const m = WORKOUT_META[cyc];
      workouts.push({
        id: uid('w'), kind: m.kind, name: m.name,
        durationMin: m.durationMin + Math.round((r() - 0.5) * 10),
        kcal: m.kcal + Math.round((r() - 0.5) * 60),
        tags: m.tags.slice(),
      });
    }

    // meals: usually 3-4 a day, scaled toward a daily target
    const meals = [];
    const slots = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
    const skipSnack = r() > 0.5;
    slots.forEach((slot) => {
      if (slot === 'Snack' && skipSnack) return;
      const pool = MEAL_POOL[slot];
      const pick = pool[Math.floor(r() * pool.length) % pool.length];
      const times = { Breakfast: '07:40', Lunch: '12:30', Snack: '15:50', Dinner: '19:20' };
      meals.push({ id: uid('m'), slot, name: pick.name, time: times[slot], ...pick });
    });
    // ~1 in 6 days is a blow-out that breaks the streak (kept off the last 6
    // days so the demo lands on a believable single/low-double-digit streak).
    if (r() < 0.17 && i < SPAN - 6) {
      meals.push({ id: uid('m'), slot: 'Dinner', name: 'Pizza & beer night', time: '20:10', kcal: 980, protein: 34, carbs: 96, fat: 44 });
    }

    days[k] = { meals, workouts, steps, weight };
  }

  // Override TODAY with the exact mid-fi composition (1 840 kcal, 8 420 steps, 72.3 kg)
  days[TODAY_KEY] = {
    meals: [
      { id: uid('m'), slot: 'Breakfast', name: 'Oatmeal, banana & whey', time: '07:40', kcal: 420, protein: 24, carbs: 60, fat: 9 },
      { id: uid('m'), slot: 'Lunch', name: 'Chicken & rice bowl', time: '12:30', kcal: 560, protein: 38, carbs: 58, fat: 14 },
      { id: uid('m'), slot: 'Snack', name: 'Greek yoghurt & berries', time: '15:50', kcal: 220, protein: 18, carbs: 22, fat: 6 },
      { id: uid('m'), slot: 'Dinner', name: 'Pasta bolognese', time: '19:20', kcal: 640, protein: 12, carbs: 40, fat: 19 },
    ],
    workouts: [
      { id: uid('w'), kind: 'Strength', name: 'Push day · chest + shoulders', durationMin: 52, kcal: 340, tags: ['Strength', 'Chest', 'Shoulders'] },
    ],
    steps: 8420,
    weight: 72.3,
  };

  return { goals, days };
}

// ── persistence ─────────────────────────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.goals && parsed.days) return parsed;
    }
  } catch (e) { /* ignore */ }
  const seeded = seedState();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(seeded)); } catch (e) {}
  return seeded;
}
function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}
function resetState() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  return seedState();
}

// ── derived metrics ─────────────────────────────────────────────────────────
function emptyDay() { return { meals: [], workouts: [], steps: null, weight: null }; }

function dayTotals(day) {
  const d = day || emptyDay();
  return d.meals.reduce((a, m) => ({
    kcal: a.kcal + (m.kcal || 0),
    protein: a.protein + (m.protein || 0),
    carbs: a.carbs + (m.carbs || 0),
    fat: a.fat + (m.fat || 0),
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });
}

// a day "in goal" for streaks/calendar: kcal logged & within goal band
function kcalInGoal(day, goals) {
  if (!day || !day.meals.length) return false;
  const t = dayTotals(day).kcal;
  return t > 0 && t <= goals.kcal * 1.05;
}
function stepsHit(day, goals) { return !!day && day.steps != null && day.steps >= goals.steps; }

// streak: consecutive days ending today where kcal is in goal
function calcStreak(days, goals) {
  let n = 0; let k = todayKey();
  // don't count today unless it's already in goal; otherwise start yesterday
  if (!kcalInGoal(days[k], goals)) k = addDays(k, -1);
  while (kcalInGoal(days[k], goals)) { n++; k = addDays(k, -1); }
  return n;
}

// last N days (oldest→newest) of a metric for sparklines / averages
function series(days, goals, endKey, n, metric) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const k = addDays(endKey, -i);
    const day = days[k];
    let v = 0;
    if (metric === 'kcal') v = day ? dayTotals(day).kcal : 0;
    else if (metric === 'steps') v = day && day.steps != null ? day.steps : 0;
    else if (metric === 'weight') v = day && day.weight != null ? day.weight : null;
    else if (metric === 'workouts') v = day ? day.workouts.length : 0;
    out.push({ k, v });
  }
  return out;
}

function avgOf(arr) {
  const vals = arr.map((x) => x.v).filter((v) => v != null && v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

Object.assign(window, {
  STORE_KEY, TODAY_KEY,
  pad2, keyOf, parseKey, addDays, todayKey,
  WD_SHORT, MO_SHORT, MO_LONG, fmtDayLabel, fmtRelative, grp, wDisp, wToKg,
  uid, seedState, loadState, saveState, resetState,
  emptyDay, dayTotals, kcalInGoal, stepsHit, calcStreak, series, avgOf,
  MEAL_POOL, WORKOUT_META,
});
