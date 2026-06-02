// Track3r — Tracking Hub
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Utensils, Dumbbell, Check, Trash2, Pencil, Plus, Minus, Activity, Move, Trophy, Flame, RotateCcw, LogOut, Download, AlertTriangle, Search, Loader, Barcode, Star, X } from 'lucide-react';
import zxingReaderWasm from 'zxing-wasm/reader/zxing_reader.wasm?url';
import * as db from './db.js';
import { searchFoods, getProductByBarcode } from './off.js';

/* ── Scoped styles ────────────────────────────────────────────────────────── */
function ScopedStyles() {
  return (
    <style>{`
      .t3-root { font-family: var(--font-body, 'Montserrat', sans-serif); min-height: 100vh; background: var(--color-bg); color: var(--color-text); -webkit-font-smoothing: antialiased; }
      .t3-stage { max-width: 1480px; margin: 0 auto; padding: 28px 28px 64px; display: flex; flex-direction: column; gap: 18px; min-height: 100vh; }

      .t3-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
      .t3-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

      .t3-datesel { display: flex; align-items: center; gap: 4px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 10px; padding: 4px 6px; }

      .t3-summary { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 14px 22px; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
      .t3-summary-eyebrow { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; white-space: nowrap; }
      .t3-vsplit { width: 1px; height: 26px; background: var(--color-border); flex: none; }
      .t3-summary-spacer { flex: 1; min-width: 12px; }
      .t3-stat { display: flex; align-items: baseline; gap: 7px; white-space: nowrap; }
      .t3-stat-lbl { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted); }
      .t3-stat-num { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; line-height: 1; }
      .t3-stat-unit { color: var(--color-text-muted); font-size: 12px; font-weight: 500; }
      .t3-stat-delta { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700; margin-left: 2px; }

      .t3-main { display: grid; grid-template-columns: 1.35fr 1fr; gap: 18px; align-items: stretch; flex: 1; min-height: 0; }
      .t3-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 14px; min-height: 560px; }
      .t3-panel-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
      .t3-panel-title { margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; }
      .t3-panel-sub { color: var(--color-text-muted); font-size: 12px; }

      .t3-input { width: 100%; box-sizing: border-box; font-family: inherit; font-size: 14px; color: var(--color-text); padding: 10px 12px; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg); outline: none; transition: border-color 140ms, box-shadow 140ms; }
      .t3-input:focus { border-color: var(--color-link); box-shadow: 0 0 0 3px rgba(58,165,156,0.14); }
      select.t3-input { appearance: none; cursor: pointer; padding-right: 30px; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%23888787' d='M0 0h10L5 6z'/></svg>"); background-repeat: no-repeat; background-position: right 12px center; background-color: var(--color-bg); }

      .t3-editnum { outline: none; border-bottom: 1px dashed transparent; border-radius: 3px; padding: 0 2px; margin: 0 -2px; transition: background 120ms, border-color 120ms; font-variant-numeric: tabular-nums; display: inline; cursor: text; }
      .t3-editnum:hover { border-bottom-color: var(--color-border); }
      .t3-editnum:focus { border-bottom-color: var(--color-link); outline: none; }

      .t3-row { transition: background 120ms; border-radius: 6px; }
      .t3-row:hover { background: var(--color-surface-2, rgba(128,128,128,0.06)); }

      .t3-scroll { scrollbar-width: thin; scrollbar-color: var(--color-border) transparent; overflow-y: auto; }
      .t3-scroll::-webkit-scrollbar { width: 6px; }
      .t3-scroll::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

      .t3-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: t3-fade 160ms ease; }
      .t3-modal { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 14px; width: 100%; max-width: 480px; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.35); animation: t3-sheet 200ms cubic-bezier(0.2,0.7,0.2,1); max-height: 92vh; overflow-y: auto; }
      .t3-modal-head { padding: 20px 22px 0; }
      .t3-modal-body { padding: 18px 22px; }
      .t3-modal-foot { padding: 14px 22px 20px; display: flex; gap: 10px; align-items: center; border-top: 1px solid var(--color-border); }

      .t3-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 8px; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: opacity 120ms, box-shadow 120ms, background 120ms; white-space: nowrap; text-decoration: none; }
      .t3-btn:active { opacity: 0.85; }
      .t3-btn-primary { background: var(--color-link); color: #fff; border-color: var(--color-link); }
      .t3-btn-primary:hover { opacity: 0.9; }
      .t3-btn-secondary { background: transparent; color: var(--color-text); border-color: var(--color-border); }
      .t3-btn-secondary:hover { background: var(--color-surface-2, rgba(128,128,128,0.06)); }
      .t3-btn-ghost { background: transparent; color: var(--color-text-muted); border-color: transparent; }
      .t3-btn-ghost:hover { color: var(--color-text); background: var(--color-surface-2, rgba(128,128,128,0.06)); }
      .t3-btn-dark { background: var(--color-text); color: var(--color-bg); border-color: var(--color-text); }
      .t3-btn-dark:hover { opacity: 0.88; }
      .t3-btn-danger { background: transparent; color: #e05c5c; border-color: rgba(224,92,92,0.35); }
      .t3-btn-danger:hover { background: rgba(224,92,92,0.08); }
      .t3-btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 7px; }

      .t3-iconbtn { display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: transparent; border: none; cursor: pointer; color: var(--color-text-muted); transition: background 120ms, color 120ms; flex-shrink: 0; padding: 4px; }
      .t3-iconbtn:hover { background: var(--color-surface-2, rgba(128,128,128,0.08)); color: var(--color-text); }

      .t3-seg { display: inline-flex; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 10px; padding: 3px; gap: 2px; }
      .t3-seg-opt { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: transparent; color: var(--color-text-muted); transition: background 140ms, color 140ms; }
      .t3-seg-opt.active { background: var(--color-surface); color: var(--color-text); box-shadow: 0 1px 3px rgba(0,0,0,0.12); }

      .t3-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; border: 1px solid transparent; white-space: nowrap; }
      .t3-chip-teal  { background: rgba(58,165,156,0.13); color: var(--color-link); border-color: rgba(58,165,156,0.25); }
      .t3-chip-amber { background: rgba(232,123,45,0.13); color: #E87B2D; border-color: rgba(232,123,45,0.25); }
      .t3-chip-outline { background: transparent; color: var(--color-text-muted); border-color: var(--color-border); }

      .t3-field { display: flex; flex-direction: column; gap: 5px; }
      .t3-field.span2 { grid-column: span 2; }
      .t3-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
      .t3-hint { font-size: 11px; color: var(--color-text-muted); }
      .t3-input-invalid { border-color: #e05c5c !important; box-shadow: 0 0 0 3px rgba(224,92,92,0.14) !important; }
      .t3-search-wrap { position: relative; }
      .t3-search-results { position: absolute; z-index: 50; top: calc(100% + 4px); left: 0; right: 0; max-height: 248px; overflow-y: auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 10px; box-shadow: 0 16px 40px rgba(0,0,0,0.28); padding: 4px; }
      .t3-search-item { display: flex; flex-direction: column; gap: 1px; width: 100%; text-align: left; padding: 8px 10px; border: none; background: transparent; border-radius: 7px; cursor: pointer; font-family: inherit; color: var(--color-text); transition: background 110ms; }
      .t3-search-item:hover, .t3-search-item:focus { background: var(--color-bg); outline: none; }
      .t3-search-name { font-size: 13.5px; font-weight: 700; line-height: 1.25; }
      .t3-search-meta { font-size: 11.5px; color: var(--color-text-muted); font-weight: 600; }
      .t3-search-empty { padding: 12px 10px; font-size: 12.5px; color: var(--color-text-muted); font-weight: 600; }
      @keyframes t3-spin { to { transform: rotate(360deg); } }
      .t3-spin { animation: t3-spin 800ms linear infinite; }

      .t3-tag { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid var(--color-border); background: transparent; color: var(--color-text-muted); transition: all 120ms; }
      .t3-tag.on { border-color: var(--color-link); background: rgba(58,165,156,0.12); color: var(--color-link); }

      .t3-toast { position: fixed; bottom: 28px; left: 50%; transform: translate(-50%, 0); background: var(--color-text); color: var(--color-bg); border-radius: 10px; padding: 11px 18px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; z-index: 9999; white-space: nowrap; animation: t3-toast 200ms ease; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }

      .t3-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-accent); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; letter-spacing: -0.02em; flex-shrink: 0; }

      .t3-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
      .t3-login-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 36px 32px; width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 22px; }

      .t3-trend-card { border: 1px solid var(--color-border); border-radius: 8px; padding: 11px 13px; display: flex; flex-direction: column; gap: 7px; background: var(--color-bg); }

      @keyframes t3-fade  { from { opacity: 0 } to { opacity: 1 } }
      @keyframes t3-sheet { from { opacity: 0; transform: translateY(10px) scale(0.99) } to { opacity: 1; transform: none } }
      @keyframes t3-toast { from { opacity: 0; transform: translate(-50%, 8px) } to { opacity: 1; transform: translate(-50%, 0) } }

      @media (max-width: 1060px) {
        .t3-main { grid-template-columns: 1fr; }
        .t3-panel { min-height: auto; }
      }
      @media (max-width: 680px) {
        .t3-stage { padding: 16px 16px 48px; gap: 14px; }
        .t3-summary { gap: 12px 16px; }
        .t3-summary .t3-vsplit { display: none; }
        .t3-summary-spacer { flex-basis: 100%; height: 0; }
        .t3-stat { flex: 1 1 42%; }
        .t3-stat-num { font-size: 19px; }
      }
    `}</style>
  );
}

/* ── Color tokens (for inline SVG / computed colors) ──────────────────────── */
function mkC(dark) {
  return {
    teal:      dark ? '#3AA59C' : '#1E8077',
    tealLight: dark ? '#5AC8BF' : '#2A9B8F',
    tealDeep:  dark ? '#2B7D75' : '#195E57',
    tealMist:  dark ? 'rgba(58,165,156,0.13)' : 'rgba(30,128,119,0.09)',
    amber:     dark ? '#E87B2D' : '#C85C15',
    amberMist: dark ? 'rgba(232,123,45,0.13)' : 'rgba(200,92,21,0.09)',
    track:     dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    line:      dark ? '#4E4E50' : '#DEDEDC',
    line2:     dark ? 'rgba(78,78,80,0.35)' : 'rgba(0,0,0,0.07)',
    bgSoft:    dark ? '#1E1E1F' : '#ECECEB',
    surface:   dark ? '#2E2E30' : '#FFFFFF',
    ink:       dark ? '#F2F1EF' : '#1C1B1A',
    ink2:      dark ? '#C0BEBB' : '#3D3C3A',
    ink3:      dark ? '#888787' : '#706F6C',
    ink4:      dark ? '#5C5B59' : '#A09F9C',
  };
}
const CC = createContext(mkC(true));
function useC() { return useContext(CC); }

/* ── Icon helper ──────────────────────────────────────────────────────────── */
const ICON_MAP = {
  'chevron-left': ChevronLeft, 'chevron-right': ChevronRight,
  'sun': Sun, 'moon': Moon, 'utensils': Utensils, 'dumbbell': Dumbbell,
  'check': Check, 'trash-2': Trash2, 'pencil': Pencil, 'plus': Plus,
  'minus': Minus, 'activity': Activity, 'move': Move, 'trophy': Trophy,
  'flame': Flame, 'rotate-ccw': RotateCcw, 'log-out': LogOut, 'download': Download,
  'alert-triangle': AlertTriangle, 'search': Search, 'loader': Loader, 'barcode': Barcode,
  'star': Star, 'x': X,
};
function Icon({ name, size = 20, stroke = 1.75, color, style }) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  return <Comp size={size} strokeWidth={stroke} color={color} style={style} />;
}

/* ── Date helpers ─────────────────────────────────────────────────────────── */
function pad2(n) { return String(n).padStart(2, '0'); }
function keyOf(d) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function parseKey(k) { const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); }
function addDays(k, n) { const d = parseKey(k); d.setDate(d.getDate()+n); return keyOf(d); }
function todayKey() { return keyOf(new Date()); }

const WD_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MO_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MO_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmtRelative(k) {
  const t = todayKey();
  if (k === t) return 'Today';
  if (k === addDays(t,-1)) return 'Yesterday';
  return null;
}
function grp(n) {
  if (n == null || isNaN(n)) return '–';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function wDisp(kg, unit) {
  if (kg == null) return null;
  return unit === 'lb' ? +(kg * 2.20462).toFixed(1) : +kg.toFixed(1);
}
function wToKg(val, unit) { return unit === 'lb' ? val / 2.20462 : val; }

/* ── UID ──────────────────────────────────────────────────────────────────── */
let _uid = 1;
function uid(p) { return `${p}_${Date.now().toString(36)}_${(_uid++).toString(36)}`; }

/* ── Data model ───────────────────────────────────────────────────────────── */
function emptyDay() { return { meals: [], workouts: [], steps: null, weight: null }; }

function dayTotals(day) {
  return (day || emptyDay()).meals.reduce((a, m) => ({
    kcal: a.kcal + (m.kcal||0), protein: a.protein + (m.protein||0),
    carbs: a.carbs + (m.carbs||0), fat: a.fat + (m.fat||0),
  }), { kcal:0, protein:0, carbs:0, fat:0 });
}
function kcalInGoal(day, goals) {
  if (!day || !day.meals.length) return false;
  const t = dayTotals(day).kcal;
  return t > 0 && t <= goals.kcal * 1.05;
}
function stepsHit(day, goals) { return !!day && day.steps != null && day.steps >= goals.steps; }
function dayLogged(day) { return !!day && day.meals.length > 0; }
// Most-recently-logged distinct foods (by name) across all days, newest first,
// for one-click re-adding. Carries the logged macros as absolute values.
function recentFoodsFrom(days, limit = 8) {
  const keys = Object.keys(days).sort().reverse(); // date desc
  const seen = new Set();
  const out = [];
  for (const k of keys) {
    const meals = (days[k] && days[k].meals) || [];
    for (let i = meals.length - 1; i >= 0; i--) {
      const m = meals[i];
      const id = (m.name || '').trim().toLowerCase();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push({ name: m.name, kcal: m.kcal, protein: m.protein, carbs: m.carbs, fat: m.fat });
      if (out.length >= limit) return out;
    }
  }
  return out;
}
function calcStreak(days) {
  // Streak rewards the habit of logging consistently, not hitting an exact
  // calorie number. An honest over-goal day still counts; only a day with no
  // meals logged breaks it. Today being un-logged yet doesn't break a prior
  // streak, so we start counting from yesterday in that case.
  let n = 0, k = todayKey();
  if (!dayLogged(days[k])) k = addDays(k,-1);
  while (dayLogged(days[k])) { n++; k = addDays(k,-1); }
  return n;
}
function series(days, goals, endKey, n, metric) {
  const out = [];
  for (let i = n-1; i >= 0; i--) {
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
  const vals = arr.map(x => x.v).filter(v => v != null && v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a,b) => a+b, 0) / vals.length;
}

/* ── Defaults & session (Supabase-backed) ────────────────────────────── */
const DEFAULT_GOALS = { kcal: 2400, protein: 160, carbs: 240, fat: 70, steps: 10000, weight: 75 };

/* ── TDEE / goal estimation (Mifflin-St Jeor) ─────────────────────────────── */
const ACTIVITY_LEVELS = [
  { value: 1.2,   label: 'Stillasittande (lite/ingen träning)' },
  { value: 1.375, label: 'Lätt aktiv (1–3 pass/vecka)' },
  { value: 1.55,  label: 'Måttligt aktiv (3–5 pass/vecka)' },
  { value: 1.725, label: 'Mycket aktiv (6–7 pass/vecka)' },
  { value: 1.9,   label: 'Extremt aktiv (fysiskt jobb / 2 pass/dag)' },
];
function goalsFromProfile({ sex, age, height, weight, activity, aim }) {
  // Mifflin-St Jeor BMR, then activity factor for TDEE.
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'female' ? -161 : 5);
  const tdee = bmr * activity;
  const adj = aim === 'lose' ? -500 : aim === 'gain' ? 300 : 0;
  const kcal = Math.max(1200, Math.round((tdee + adj) / 10) * 10);
  const protein = Math.round(1.8 * weight);          // 1.8 g/kg — solid for most goals
  const fat = Math.round((kcal * 0.275) / 9);         // ~27.5% of energy from fat
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4)); // remainder
  return { kcal, protein, carbs, fat, steps: 10000, weight };
}
const ACTIVE_KEY = 'ailabb_active_user';
const PROFILE_ID_KEY = 'ailabb_profile_id';
const PROFILE_NAME_KEY = 'ailabb_profile_name';

function getActiveUserName() {
  try {
    const v = JSON.parse(localStorage.getItem(ACTIVE_KEY));
    if (!v) return null;
    // The main hub stores a plain string name; tolerate a legacy { name } object too.
    return typeof v === 'string' ? v : (v.name || null);
  } catch (_) { return null; }
}

function rowsToDays(rows) {
  const days = {};
  (rows || []).forEach(r => {
    // Supabase returns a `date` column as "YYYY-MM-DD"; slice defensively in
    // case a time/zone component ever sneaks in, so keys always match keyOf().
    const dk = String(r.date).slice(0, 10);
    days[dk] = {
      meals: r.meals || [],
      workouts: r.workouts || [],
      steps: r.steps,
      weight: r.weight,
    };
  });
  return days;
}

/* ── useStore hook (async, per profile) ───────────────────────────── */
function useStore(profileId) {
  const [state, setState] = useState({ goals: DEFAULT_GOALS, days: {}, goalsSet: false, favorites: [] });
  const [loading, setLoading] = useState(true);
  const dayTimers = useRef({});
  const goalTimer = useRef(null);

  useEffect(() => {
    if (!profileId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [goals, rows, favorites] = await Promise.all([
        db.getGoals(profileId),
        db.getDays(profileId),
        db.getFavorites(profileId),
      ]);
      if (cancelled) return;
      setState({
        goals: goals
          ? { kcal: goals.kcal, protein: goals.protein, carbs: goals.carbs, fat: goals.fat, steps: goals.steps, weight: goals.weight }
          : DEFAULT_GOALS,
        days: rowsToDays(rows),
        goalsSet: !!goals,
        favorites: favorites || [],
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [profileId]);

  const persistDay = (key, day) => {
    if (!profileId) return;
    clearTimeout(dayTimers.current[key]);
    dayTimers.current[key] = setTimeout(() => { db.upsertDay(profileId, key, day); }, 500);
  };
  const persistGoals = (goals) => {
    if (!profileId) return;
    clearTimeout(goalTimer.current);
    goalTimer.current = setTimeout(() => { db.upsertGoals(profileId, goals); }, 500);
  };

  const mutateDay = (key, fn) => setState(s => {
    const day = s.days[key] || emptyDay();
    const next = fn({ ...day, meals: day.meals.slice(), workouts: day.workouts.slice() });
    persistDay(key, next);
    return { ...s, days: { ...s.days, [key]: next } };
  });

  return {
    state, loading,
    setGoal: (k, v) => setState(s => {
      const goals = { ...s.goals, [k]: v };
      persistGoals(goals);
      return { ...s, goals, goalsSet: true };
    }),
    setAllGoals: (goals) => setState(s => {
      persistGoals(goals);
      return { ...s, goals, goalsSet: true };
    }),
    addMeal: (key, m) => mutateDay(key, d => ({ ...d, meals: [...d.meals, m] })),
    updateMeal: (key, m) => mutateDay(key, d => ({ ...d, meals: d.meals.map(x => x.id === m.id ? m : x) })),
    deleteMeal: (key, id) => mutateDay(key, d => ({ ...d, meals: d.meals.filter(x => x.id !== id) })),
    addWorkout: (key, w) => mutateDay(key, d => ({ ...d, workouts: [...d.workouts, w] })),
    updateWorkout: (key, w) => mutateDay(key, d => ({ ...d, workouts: d.workouts.map(x => x.id === w.id ? w : x) })),
    deleteWorkout: (key, id) => mutateDay(key, d => ({ ...d, workouts: d.workouts.filter(x => x.id !== id) })),
    setSteps: (key, v) => mutateDay(key, d => ({ ...d, steps: v })),
    setWeight: (key, v) => mutateDay(key, d => ({ ...d, weight: v })),
    addFavorite: (food) => {
      const fav = {
        id: (crypto.randomUUID ? crypto.randomUUID() : uid('fav')),
        profile_id: profileId,
        name: food.name, kcal: food.kcal || 0, protein: food.protein || 0,
        carbs: food.carbs || 0, fat: food.fat || 0,
      };
      setState(s => ({ ...s, favorites: [...s.favorites, fav] }));
      db.addFavorite(fav);
    },
    removeFavorite: (id) => {
      setState(s => ({ ...s, favorites: s.favorites.filter(f => f.id !== id) }));
      db.deleteFavorite(id);
    },
  };
}

/* ── Base UI components ───────────────────────────────────────────────────── */
function Button({ variant = 'secondary', size: sz, icon, onClick, children, style, disabled }) {
  return (
    <button
      className={`t3-btn t3-btn-${variant}${sz === 'sm' ? ' t3-btn-sm' : ''}`}
      onClick={onClick} style={style} disabled={disabled}
    >
      {icon && <Icon name={icon} size={sz === 'sm' ? 13 : 15} stroke={2} />}
      {children}
    </button>
  );
}

function IconButton({ icon, label, onClick, size = 36, style }) {
  return (
    <button className="t3-iconbtn" onClick={onClick} aria-label={label} title={label}
      style={{ width: size, height: size, ...style }}>
      <Icon name={icon} size={Math.round(size * 0.52)} stroke={1.75} />
    </button>
  );
}

function Panel({ children }) {
  return <section className="t3-panel">{children}</section>;
}

// Tracks modal nesting so Escape only closes the topmost modal (e.g. the
// barcode scanner stacked on the meal modal), not every open one at once.
let _modalDepth = 0;
function Modal({ eyebrow, title, onClose, footer, children }) {
  useEffect(() => {
    const myDepth = ++_modalDepth;
    const onKey = e => { if (e.key === 'Escape' && myDepth === _modalDepth) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { _modalDepth--; document.removeEventListener('keydown', onKey); };
  }, [onClose]);
  return (
    <div className="t3-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="t3-modal" role="dialog" aria-modal="true">
        <div className="t3-modal-head">
          {eyebrow && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{eyebrow}</span>}
          <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>{title}</h2>
        </div>
        <div className="t3-modal-body">{children}</div>
        {footer && <div className="t3-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, hint, span, children }) {
  return (
    <div className={`t3-field${span === 2 ? ' span2' : ''}`}>
      <span className="t3-label">{label}{hint && <span className="t3-hint" style={{ marginLeft: 6 }}>{hint}</span>}</span>
      {children}
    </div>
  );
}

function TextInput({ invalid, ...props }) {
  return <input className={`t3-input${invalid ? ' t3-input-invalid' : ''}`} {...props} />;
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="t3-seg" role="group">
      {options.map(opt => (
        <button key={opt.value}
          className={`t3-seg-opt${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}>
          {opt.icon && <Icon name={opt.icon} size={14} stroke={2} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Ring({ value, max, size = 160, color, children }) {
  const C = useC();
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1.08) : 0;
  const dash = pct * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.track} strokeWidth={11} />
        {dash > 0 && (
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={11}
            strokeDasharray={`${Math.min(dash, circ)} ${circ}`}
            strokeLinecap="round" style={{ transition: 'stroke-dasharray 400ms ease' }} />
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function MacroBar({ value, max, color }) {
  const C = useC();
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div style={{ height: 4, borderRadius: 99, background: C.track, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct * 100}%`, background: color, borderRadius: 99, transition: 'width 400ms ease' }} />
    </div>
  );
}

function Chip({ variant = 'outline', icon, children }) {
  return (
    <span className={`t3-chip t3-chip-${variant}`}>
      {icon && <Icon name={icon} size={11} stroke={2.5} />}
      {children}
    </span>
  );
}

function Eyebrow({ children, style }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', ...style }}>
      {children}
    </span>
  );
}

function EditNum({ value, onCommit, format, mode = 'integer', style }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');
  const ref = useRef();
  const display = format ? format(value) : (value == null ? '–' : String(Math.round(value)));

  const start = () => {
    setRaw(value != null ? String(value) : '');
    setEditing(true);
    setTimeout(() => ref.current?.select(), 0);
  };
  const commit = () => {
    const n = mode === 'decimal' ? parseFloat(raw) : parseInt(raw, 10);
    if (!isNaN(n) && n > 0) onCommit(n);
    setEditing(false);
  };
  const onKeyDown = e => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setEditing(false);
  };

  if (editing) {
    return (
      <input ref={ref} type="number" value={raw} onChange={e => setRaw(e.target.value)}
        onBlur={commit} onKeyDown={onKeyDown}
        style={{ width: Math.max(40, raw.length * 9 + 16), fontSize: 'inherit', fontWeight: 'inherit', border: 'none', background: 'transparent', outline: 'none', padding: '0 2px', ...style }} />
    );
  }
  return (
    <span className="t3-editnum" tabIndex={0} onClick={start} onFocus={start} style={style}>
      {display}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="t3-toast">
      {toast.icon && <Icon name={toast.icon} size={15} stroke={2.5} />}
      {toast.msg}
    </div>
  );
}

/* ── Food panel ───────────────────────────────────────────────────────────── */
const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

function OnboardingModal({ onSave, onSkip }) {
  const C = useC();
  const [f, setF] = useState({ sex: 'male', age: '30', height: '178', weight: '78', activity: 1.55, aim: 'maintain' });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const valid = parseFloat(f.age) > 0 && parseFloat(f.height) > 0 && parseFloat(f.weight) > 0;
  const preview = valid ? goalsFromProfile({
    sex: f.sex, age: +f.age, height: +f.height, weight: +f.weight, activity: +f.activity, aim: f.aim,
  }) : null;

  return (
    <Modal eyebrow="Välkommen till Track3r" title="Kom igång med dina mål"
      onClose={onSkip}
      footer={<>
        <Button variant="ghost" onClick={onSkip} style={{ marginRight: 'auto' }}>Hoppa över</Button>
        <Button variant="primary" icon="check" disabled={!valid} onClick={() => preview && onSave(preview)}>Sätt mina mål</Button>
      </>}>
      <p style={{ margin: '0 0 16px', fontSize: 13.5, color: C.ink3, lineHeight: 1.5 }}>
        Vi räknar ut ett rimligt kalori- och makromål åt dig med Mifflin-St Jeor-formeln. Du kan alltid justera siffrorna direkt i appen efteråt.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Kön">
          <select className="t3-input" value={f.sex} onChange={e => set('sex', e.target.value)}>
            <option value="male">Man</option>
            <option value="female">Kvinna</option>
          </select>
        </Field>
        <Field label="Ålder">
          <TextInput type="number" inputMode="numeric" min="0" value={f.age} onChange={e => set('age', e.target.value)} />
        </Field>
        <Field label="Längd (cm)">
          <TextInput type="number" inputMode="numeric" min="0" value={f.height} onChange={e => set('height', e.target.value)} />
        </Field>
        <Field label="Vikt (kg)">
          <TextInput type="number" inputMode="decimal" min="0" value={f.weight} onChange={e => set('weight', e.target.value)} />
        </Field>
        <Field label="Aktivitetsnivå" span={2}>
          <select className="t3-input" value={f.activity} onChange={e => set('activity', e.target.value)}>
            {ACTIVITY_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </Field>
        <Field label="Mål" span={2}>
          <select className="t3-input" value={f.aim} onChange={e => set('aim', e.target.value)}>
            <option value="lose">Gå ner i vikt (−500 kcal)</option>
            <option value="maintain">Behålla vikt</option>
            <option value="gain">Gå upp i vikt (+300 kcal)</option>
          </select>
        </Field>
      </div>
      {preview && (
        <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
          <span className="t3-label" style={{ display: 'block', marginBottom: 8 }}>Föreslaget dagsmål</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', fontSize: 13.5, fontWeight: 700 }}>
            <span style={{ color: C.ink }}>{grp(preview.kcal)} kcal</span>
            <span style={{ color: C.amber }}>{preview.protein} g protein</span>
            <span style={{ color: C.tealLight }}>{preview.carbs} g kolh.</span>
            <span style={{ color: C.tealDeep }}>{preview.fat} g fett</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

function BarcodeScanner({ onDetect, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Startar kamera…');

  useEffect(() => {
    let stream = null, raf = 0, stopped = false;
    const formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'];
    (async () => {
      try {
        // Lazy-load the ~16 KB-gzip ponyfill (and its WASM) only when the user
        // actually opens the scanner, keeping the main bundle lean.
        const { BarcodeDetector, setZXingModuleOverrides } = await import('barcode-detector/pure');
        setZXingModuleOverrides({ locateFile: (path) => (path.endsWith('.wasm') ? zxingReaderWasm : path) });
        const detector = new BarcodeDetector({ formats });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return; }
        const v = videoRef.current;
        if (!v) return;
        v.srcObject = stream;
        await v.play();
        setStatus('Rikta kameran mot streckkoden');
        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await detector.detect(v);
            if (codes && codes.length && codes[0].rawValue) {
              stopped = true;
              onDetect(codes[0].rawValue);
              return;
            }
          } catch (_) { /* transient decode errors are expected between frames */ }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (e) {
        setError(e && e.name === 'NotAllowedError'
          ? 'Kameraåtkomst nekades. Tillåt kameran i webbläsaren och försök igen.'
          : 'Kunde inte starta kameran på den här enheten.');
      }
    })();
    return () => { stopped = true; if (raf) cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [onDetect]);

  return (
    <Modal eyebrow="Lägg till måltid" title="Skanna streckkod" onClose={onClose}
      footer={<Button variant="ghost" onClick={onClose}>Avbryt</Button>}>
      {error ? (
        <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(224,92,92,0.12)', border: '1px solid rgba(224,92,92,0.35)', color: '#e05c5c', fontSize: 13, fontWeight: 600 }}>{error}</div>
      ) : (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '4 / 3' }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: '22% 12%', border: '2px solid rgba(255,255,255,0.9)', borderRadius: 10, boxShadow: '0 0 0 9999px rgba(0,0,0,0.28)' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 12.5, fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{status}</div>
        </div>
      )}
    </Modal>
  );
}

function MealModal({ initial, recent = [], favorites = [], onAddFavorite, onRemoveFavorite, onSave, onClose, onDelete }) {
  const editing = !!(initial && initial.id);
  const [f, setF] = useState(() => ({
    slot: (initial && initial.slot) || 'Breakfast',
    name: (initial && initial.name) || '',
    time: (initial && initial.time) || '',
    kcal: initial && initial.kcal != null ? String(initial.kcal) : '',
    protein: initial && initial.protein != null ? String(initial.protein) : '',
    carbs: initial && initial.carbs != null ? String(initial.carbs) : '',
    fat: initial && initial.fat != null ? String(initial.fat) : '',
  }));
  const [tried, setTried] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const nameBad = !f.name.trim(), kcalBad = !(parseFloat(f.kcal) > 0);

  // ── Open Food Facts search ──────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [offError, setOffError] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [picked, setPicked] = useState(null); // per-100g base of the chosen food
  const [grams, setGrams] = useState('');     // portion size in grams when picked
  const [scanning, setScanning] = useState(false);
  const [lookupMsg, setLookupMsg] = useState(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); setSearching(false); setOffError(false); return; }
    setSearching(true); setOffError(false);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const hits = await searchFoods(q, { signal: ctrl.signal });
        setResults(hits); setShowResults(true);
      } catch (e) {
        if (e.name !== 'AbortError') { setOffError(true); setResults([]); setShowResults(true); }
      } finally {
        setSearching(false);
      }
    }, 380);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  // Scale a picked food's per-100g macros to the entered portion size.
  const fillFromGrams = (g) => {
    setGrams(g);
    if (!picked) return;
    const factor = (parseFloat(g) || 0) / 100;
    setF(s => ({ ...s,
      kcal: String(Math.round(picked.kcal * factor)),
      protein: String(Math.round(picked.protein * factor)),
      carbs: String(Math.round(picked.carbs * factor)),
      fat: String(Math.round(picked.fat * factor)),
    }));
  };

  const pickFood = (prod) => {
    const label = prod.brand ? `${prod.name} (${prod.brand})` : prod.name;
    setPicked(prod.per100);
    setGrams('100');
    setF(s => ({ ...s, name: label,
      kcal: String(prod.per100.kcal),
      protein: String(prod.per100.protein),
      carbs: String(prod.per100.carbs),
      fat: String(prod.per100.fat),
    }));
    setQuery(''); setResults([]); setShowResults(false); setLookupMsg(null);
  };

  // Re-add a previously logged food. Its macros are absolute (already-logged
  // totals), so we clear the per-100g/grams scaling state.
  const pickRecent = (food) => {
    setPicked(null); setGrams(''); setLookupMsg(null);
    setF(s => ({ ...s, name: food.name,
      kcal: String(food.kcal ?? ''),
      protein: String(food.protein ?? ''),
      carbs: String(food.carbs ?? ''),
      fat: String(food.fat ?? ''),
    }));
  };

  const trimmedName = f.name.trim();
  const alreadyFav = !!trimmedName && favorites.some(fav => fav.name.trim().toLowerCase() === trimmedName.toLowerCase());
  const saveFavorite = () => {
    if (!trimmedName || !(parseFloat(f.kcal) > 0) || alreadyFav) return;
    onAddFavorite && onAddFavorite({
      name: trimmedName,
      kcal: Math.round(parseFloat(f.kcal)),
      protein: Math.round(parseFloat(f.protein) || 0),
      carbs: Math.round(parseFloat(f.carbs) || 0),
      fat: Math.round(parseFloat(f.fat) || 0),
    });
  };

  const onBarcodeDetected = async (code) => {
    setScanning(false);
    setLookupMsg(`Slår upp streckkod ${code}…`);
    try {
      const prod = await getProductByBarcode(code);
      if (prod && prod.per100.kcal > 0) pickFood(prod);
      else setLookupMsg(`Ingen produkt hittades för streckkod ${code}. Skriv in manuellt nedan.`);
    } catch (_) {
      setLookupMsg('Kunde inte nå Open Food Facts. Skriv in manuellt nedan.');
    }
  };

  // Atwater sanity check: protein·4 + carbs·4 + fat·9 should roughly match the
  // entered kcal. Soft, non-blocking warning that catches gross typos (e.g.
  // 100 kcal + 80 g protein) while tolerating rounding, fiber and alcohol.
  const kcalNum = parseFloat(f.kcal) || 0;
  const macroKcal = (parseFloat(f.protein)||0)*4 + (parseFloat(f.carbs)||0)*4 + (parseFloat(f.fat)||0)*9;
  const macroMismatch = kcalNum > 0 && macroKcal > 0 && Math.abs(macroKcal - kcalNum) > Math.max(50, kcalNum * 0.2);

  const submit = () => {
    setTried(true);
    if (nameBad || kcalBad) return;
    onSave({ id: editing ? initial.id : uid('m'), slot: f.slot, name: f.name.trim(), time: f.time.trim(), kcal: Math.round(parseFloat(f.kcal)), protein: Math.round(parseFloat(f.protein)||0), carbs: Math.round(parseFloat(f.carbs)||0), fat: Math.round(parseFloat(f.fat)||0) });
  };

  return (
    <Modal eyebrow={editing ? 'Redigera måltid' : 'Logga måltid'}
      title={editing ? 'Redigera måltid' : 'Lägg till måltid'} onClose={onClose}
      footer={<>
        {editing && <Button variant="danger" icon="trash-2" onClick={() => onDelete(initial.id)} style={{ marginRight: 'auto' }}>Ta bort</Button>}
        <Button variant="secondary" size="sm" icon="star" onClick={saveFavorite}
          disabled={!trimmedName || !(parseFloat(f.kcal) > 0) || alreadyFav}
          style={{ marginRight: editing ? undefined : 'auto' }}
          title={alreadyFav ? 'Redan sparad som favorit' : 'Spara som favorit'}>
          {alreadyFav ? 'Sparad' : 'Favorit'}
        </Button>
        <Button variant="ghost" onClick={onClose}>Avbryt</Button>
        <Button variant="primary" icon="check" onClick={submit}>{editing ? 'Spara' : 'Lägg till'}</Button>
      </>}>
      <Field label="Sök livsmedel" hint="Open Food Facts">
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <div className="t3-search-wrap" style={{ flex: 1 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
              <Icon name={searching ? 'loader' : 'search'} size={15} stroke={2} style={searching ? { animation: 't3-spin 800ms linear infinite' } : undefined} />
            </span>
            <TextInput
              value={query}
              placeholder="ex. yoghurt, havregryn, banan…"
              style={{ paddingLeft: 34 }}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => { if (results.length || offError) setShowResults(true); }}
            />
          </div>
          {showResults && (query.trim().length >= 2) && (
            <div className="t3-search-results">
              {offError ? (
                <div className="t3-search-empty">Kunde inte nå Open Food Facts. Skriv in värdena manuellt nedan.</div>
              ) : results.length === 0 ? (
                <div className="t3-search-empty">{searching ? 'Söker…' : 'Inga träffar — skriv in manuellt nedan.'}</div>
              ) : results.map(r => (
                <button type="button" key={r.code || `${r.name}-${r.brand}`} className="t3-search-item" onClick={() => pickFood(r)}>
                  <span className="t3-search-name">{r.name}</span>
                  <span className="t3-search-meta">
                    {r.brand ? `${r.brand} · ` : ''}{r.per100.kcal} kcal · {r.per100.protein}P / {r.per100.carbs}K / {r.per100.fat}F (per 100 g)
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="t3-btn" onClick={() => { setLookupMsg(null); setScanning(true); }}
          title="Skanna streckkod"
          style={{ flexShrink: 0, padding: '0 13px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <Icon name="barcode" size={17} stroke={2} />
        </button>
        </div>
      </Field>
      {!editing && favorites.length > 0 && query.trim().length < 2 && (
        <div style={{ marginTop: 10 }}>
          <span className="t3-label" style={{ display: 'block', marginBottom: 7 }}>Favoriter</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {favorites.map(fav => (
              <span key={fav.id} className="t3-tag" style={{ paddingRight: 5, gap: 4 }} title={`${fav.kcal} kcal`}>
                <button type="button" onClick={() => pickRecent(fav)} style={{ border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                  {fav.name}
                </button>
                <button type="button" onClick={() => onRemoveFavorite && onRemoveFavorite(fav.id)} title="Ta bort favorit"
                  style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 0, opacity: 0.5 }}>
                  <Icon name="x" size={13} stroke={2.5} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      {!editing && recent.length > 0 && query.trim().length < 2 && (
        <div style={{ marginTop: 10 }}>
          <span className="t3-label" style={{ display: 'block', marginBottom: 7 }}>Senast använda</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {recent.map((food, i) => (
              <button type="button" key={`${food.name}-${i}`} className="t3-tag" onClick={() => pickRecent(food)} title={`${food.kcal} kcal`}>
                {food.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {lookupMsg && (
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 12.5, fontWeight: 600 }}>{lookupMsg}</div>
      )}
      {scanning && <BarcodeScanner onDetect={onBarcodeDetected} onClose={() => setScanning(false)} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <Field label="Mål">
          <select className="t3-input" value={f.slot} onChange={e => set('slot', e.target.value)}>
            {MEAL_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Tid">
          <TextInput type="time" value={f.time} onChange={e => set('time', e.target.value)} style={{ colorScheme: 'dark light' }} />
        </Field>
        <Field label="Vad åt du?" span={2}>
          <TextInput value={f.name} placeholder="ex. Kycklinggryta med ris" invalid={tried && nameBad} onChange={e => set('name', e.target.value)} autoFocus />
        </Field>
        {picked && (
          <Field label="Mängd (g)" hint="skalar makrona" span={2}>
            <TextInput type="number" inputMode="numeric" min="0" value={grams} placeholder="100" onChange={e => fillFromGrams(e.target.value)} />
          </Field>
        )}
        <Field label="Kalorier" hint="kcal — obligatoriskt" span={2}>
          <TextInput type="number" inputMode="numeric" min="0" value={f.kcal} placeholder="0" invalid={tried && kcalBad} onChange={e => set('kcal', e.target.value)} />
        </Field>
        <Field label="Protein (g)">
          <TextInput type="number" inputMode="numeric" min="0" value={f.protein} placeholder="0" onChange={e => set('protein', e.target.value)} />
        </Field>
        <Field label="Kolhydrater (g)">
          <TextInput type="number" inputMode="numeric" min="0" value={f.carbs} placeholder="0" onChange={e => set('carbs', e.target.value)} />
        </Field>
        <Field label="Fett (g)" span={2}>
          <TextInput type="number" inputMode="numeric" min="0" value={f.fat} placeholder="0" onChange={e => set('fat', e.target.value)} />
        </Field>
      </div>
      {macroMismatch && (
        <div style={{ marginTop: 14, padding: '9px 12px', borderRadius: 8, background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.35)', color: '#d97706', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="alert-triangle" size={15} stroke={2.25} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Makrona motsvarar ~{Math.round(macroKcal)} kcal (P·4 + K·4 + F·9), men du angav {Math.round(kcalNum)} kcal. Kontrollera siffrorna.</span>
        </div>
      )}
    </Modal>
  );
}

function MealRow({ meal, onClick }) {
  const C = useC();
  return (
    <button onClick={onClick} className="t3-row"
      style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', alignItems: 'center', gap: 14, padding: '12px 8px', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', borderTop: `0.5px solid ${C.line2}`, cursor: 'pointer', fontFamily: 'inherit' }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink3 }}>{meal.slot}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {meal.name}
        {meal.time && <small style={{ color: C.ink4, fontWeight: 400, marginLeft: 8 }}>{meal.time}</small>}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: C.ink3, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <b style={{ color: C.amber }}>{meal.protein}g</b> P
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: C.ink, whiteSpace: 'nowrap' }}>
          {grp(meal.kcal)}<small style={{ color: C.ink3, fontWeight: 500, fontSize: 11, marginLeft: 2 }}>kcal</small>
        </span>
        <Icon name="pencil" size={13} color={C.ink4} stroke={2} style={{ opacity: 0.5 }} />
      </span>
    </button>
  );
}

function Macro({ name, value, goal, color }) {
  const C = useC();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink }}>{name}</span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1, color: C.ink }}>
        {value}<span style={{ color: C.ink3, fontWeight: 500, fontSize: 11, marginLeft: 3 }}>/ {goal} g</span>
      </span>
      <MacroBar value={value} max={goal} color={color} />
    </div>
  );
}

function FoodPanel({ day, goals, onAddMeal, onEditMeal, onCopyYesterday, yesterdayCount }) {
  const C = useC();
  const totals = dayTotals(day);
  const left = Math.max(0, goals.kcal - totals.kcal);
  const over = totals.kcal > goals.kcal;
  const meals = [...day.meals].sort((a,b) => MEAL_SLOTS.indexOf(a.slot) - MEAL_SLOTS.indexOf(b.slot) || (a.time||'').localeCompare(b.time||''));

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center', padding: '4px 0 4px' }}>
        <Ring value={totals.kcal} max={goals.kcal} size={160} color={over ? C.amber : C.teal}>
          <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: C.ink }}>{grp(over ? totals.kcal - goals.kcal : left)}</span>
          <Eyebrow style={{ marginTop: 5 }}>{over ? 'kcal över' : 'kcal kvar'}</Eyebrow>
        </Ring>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Macro name="Protein" value={totals.protein} goal={goals.protein} color={C.amber} />
          <Macro name="Kolh." value={totals.carbs} goal={goals.carbs} color={C.tealLight} />
          <Macro name="Fett" value={totals.fat} goal={goals.fat} color={C.tealDeep} />
        </div>
      </div>

      <div style={{ height: '0.5px', background: C.line, margin: '2px 0' }} />

      <div className="t3-scroll" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {meals.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 0', color: C.ink3, minHeight: 120 }}>
            <Icon name="utensils" size={26} color={C.ink4} stroke={1.5} />
            <span style={{ fontSize: 13 }}>Inga måltider loggade för den här dagen.</span>
            {yesterdayCount > 0 && (
              <Button variant="secondary" size="sm" icon="rotate-ccw" onClick={onCopyYesterday} style={{ marginTop: 4 }}>
                Kopiera gårdagen ({yesterdayCount})
              </Button>
            )}
          </div>
        ) : meals.map(m => <MealRow key={m.id} meal={m} onClick={() => onEditMeal(m)} />)}
      </div>

      <div style={{ paddingTop: 12, display: 'flex', gap: 10 }}>
        <Button variant="dark" icon="plus" onClick={onAddMeal} style={{ flex: 1 }}>Lägg till måltid</Button>
        {meals.length > 0 && yesterdayCount > 0 && (
          <Button variant="secondary" icon="rotate-ccw" onClick={onCopyYesterday} title="Kopiera gårdagens måltider">Kopiera gårdagen</Button>
        )}
      </div>
    </>
  );
}

/* ── Training panel ───────────────────────────────────────────────────────── */
const WORKOUT_KINDS = ['Strength', 'Cardio', 'Mobility', 'Sport'];
const TAG_POOL = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Run', 'Bike', 'Swim', 'HIIT'];

function WorkoutModal({ initial, onSave, onClose, onDelete }) {
  const editing = !!(initial && initial.id);
  const [f, setF] = useState(() => ({
    kind: (initial && initial.kind) || 'Strength',
    name: (initial && initial.name) || '',
    durationMin: initial && initial.durationMin != null ? String(initial.durationMin) : '',
    kcal: initial && initial.kcal != null ? String(initial.kcal) : '',
    tags: (initial && initial.tags) ? initial.tags.slice() : [],
  }));
  const [tried, setTried] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const toggleTag = t => setF(s => ({ ...s, tags: s.tags.includes(t) ? s.tags.filter(x => x !== t) : [...s.tags, t] }));
  const nameBad = !f.name.trim(), durBad = !(parseFloat(f.durationMin) > 0);

  const submit = () => {
    setTried(true);
    if (nameBad || durBad) return;
    onSave({ id: editing ? initial.id : uid('w'), kind: f.kind, name: f.name.trim(), durationMin: Math.round(parseFloat(f.durationMin)), kcal: Math.round(parseFloat(f.kcal)||0), tags: f.tags });
  };

  return (
    <Modal eyebrow={editing ? 'Redigera pass' : 'Logga pass'}
      title={editing ? 'Redigera träningspass' : 'Logga ett träningspass'} onClose={onClose}
      footer={<>
        {editing && <Button variant="danger" icon="trash-2" onClick={() => onDelete(initial.id)} style={{ marginRight: 'auto' }}>Ta bort</Button>}
        <Button variant="ghost" onClick={onClose}>Avbryt</Button>
        <Button variant="primary" icon="check" onClick={submit}>{editing ? 'Spara' : 'Logga pass'}</Button>
      </>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Typ">
          <select className="t3-input" value={f.kind} onChange={e => set('kind', e.target.value)}>
            {WORKOUT_KINDS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Tid" hint="min — obligatoriskt">
          <TextInput type="number" inputMode="numeric" min="0" value={f.durationMin} placeholder="0" invalid={tried && durBad} onChange={e => set('durationMin', e.target.value)} />
        </Field>
        <Field label="Namn på passet" span={2}>
          <TextInput value={f.name} placeholder="ex. Push-dag · bröst + axlar" invalid={tried && nameBad} onChange={e => set('name', e.target.value)} autoFocus />
        </Field>
        <Field label="Förbränning" hint="kcal — valfritt" span={2}>
          <TextInput type="number" inputMode="numeric" min="0" value={f.kcal} placeholder="0" onChange={e => set('kcal', e.target.value)} />
        </Field>
        <Field label="Taggar" span={2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TAG_POOL.map(t => (
              <button key={t} type="button" className={`t3-tag${f.tags.includes(t) ? ' on' : ''}`} onClick={() => toggleTag(t)}>{t}</button>
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

function kindIcon(kind) {
  return { Strength: 'dumbbell', Cardio: 'activity', Mobility: 'move', Sport: 'trophy' }[kind] || 'dumbbell';
}

function WorkoutRow({ w, onClick }) {
  const C = useC();
  return (
    <button onClick={onClick} className="t3-row"
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', borderTop: `0.5px solid ${C.line2}`, cursor: 'pointer', fontFamily: 'inherit' }}>
      <span style={{ width: 36, height: 36, borderRadius: '50%', background: C.tealMist, color: C.tealDeep, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={kindIcon(w.kind)} size={18} stroke={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</span>
        <span style={{ display: 'block', fontSize: 12, color: C.ink3, marginTop: 1 }}>{w.kind} · {w.durationMin} min{w.kcal ? ` · ${grp(w.kcal)} kcal` : ''}</span>
      </span>
      <Icon name="pencil" size={13} color={C.ink4} stroke={2} style={{ opacity: 0.5 }} />
    </button>
  );
}

function TrainingPanel({ day, days, selectedKey, onAddWorkout, onEditWorkout }) {
  const C = useC();
  const workouts = day.workouts;
  const totalMin = workouts.reduce((a,w) => a + (w.durationMin||0), 0);
  const totalKcal = workouts.reduce((a,w) => a + (w.kcal||0), 0);
  const sel = parseKey(selectedKey);
  const dow = (sel.getDay() + 6) % 7;
  const monKey = addDays(selectedKey, -dow);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const k = addDays(monKey, i);
    const dd = days[k];
    const mins = dd ? dd.workouts.reduce((a,w) => a + (w.durationMin||0), 0) : 0;
    week.push({ k, mins, today: k === selectedKey });
  }
  const weekSessions = week.reduce((a,w) => a + (days[w.k] ? days[w.k].workouts.length : 0), 0);
  const maxMin = Math.max(...week.map(w => w.mins), 60);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '6px 0 12px' }}>
        {[
          { v: workouts.length, u: '', l: 'pass' },
          { v: grp(totalMin), u: 'min', l: 'aktiv tid' },
          { v: grp(totalKcal), u: 'kcal', l: 'förbränt' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: C.ink }}>
              {s.v}{s.u && <span style={{ fontSize: 12, color: C.ink3, fontWeight: 700, marginLeft: 3 }}>{s.u}</span>}
            </span>
            <Eyebrow>{s.l}</Eyebrow>
          </div>
        ))}
      </div>

      <div style={{ background: C.bgSoft, border: `0.5px solid ${C.line}`, borderRadius: 10, padding: '13px 15px', marginBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
          <Eyebrow>Denna vecka</Eyebrow>
          <span style={{ fontSize: 12, color: C.ink2, fontWeight: 700 }}>{weekSessions} pass</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 52 }}>
          {week.map((w, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', height: `${Math.max(4, (w.mins / maxMin) * 100)}%`, minHeight: 4, background: w.today ? C.amber : (w.mins > 0 ? C.tealLight : C.track), borderRadius: 3, transition: 'height 320ms ease' }} />
              <span style={{ fontSize: 10, fontWeight: w.today ? 700 : 400, color: w.today ? C.ink : C.ink4 }}>
                {['M','T','O','T','F','L','S'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '0.5px', background: C.line, margin: '6px 0 2px' }} />

      <div className="t3-scroll" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {workouts.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 0', color: C.ink3, minHeight: 120 }}>
            <Icon name="dumbbell" size={26} color={C.ink4} stroke={1.5} />
            <span style={{ fontSize: 13 }}>Inga pass loggade för den här dagen.</span>
          </div>
        ) : workouts.map(w => <WorkoutRow key={w.id} w={w} onClick={() => onEditWorkout(w)} />)}
      </div>

      <div style={{ paddingTop: 12 }}>
        <Button variant="dark" icon="plus" onClick={onAddWorkout}>Logga pass</Button>
      </div>
    </>
  );
}

/* ── History panel ────────────────────────────────────────────────────────── */
function Spark({ data, color, width = 100, height = 26, bars = false }) {
  const C = useC();
  const vals = data.map(d => typeof d === 'object' ? d.v : d);
  const present = vals.filter(v => v != null);
  if (present.length < 2) return <div style={{ height }} />;
  const min = Math.min(...present), max = Math.max(...present);
  const span = max - min || 1;
  const n = vals.length;
  const x = i => n === 1 ? 0 : (i / (n-1)) * width;
  const y = v => height - 2 - ((v - min) / span) * (height - 4);

  if (bars) {
    const bw = (width / n) * 0.6;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" height={height} style={{ width: '100%', display: 'block' }}>
        {vals.map((v, i) => {
          const h = v > 0 ? Math.max(1.5, ((v-0) / (max||1)) * (height-3)) : 1;
          return <rect key={i} x={x(i) - bw/2} y={height-h} width={bw} height={h} rx={1} fill={v > 0 ? color : C.track} />;
        })}
      </svg>
    );
  }
  let dpath = '';
  vals.forEach((v, i) => { if (v == null) return; dpath += `${dpath ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`; });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" height={height} style={{ width: '100%', display: 'block' }}>
      <path d={dpath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function TrendCard({ label, value, unit, delta, deltaColor, children }) {
  const C = useC();
  return (
    <div className="t3-trend-card">
      <Eyebrow style={{ fontSize: 9.5 }}>{label}</Eyebrow>
      <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1, color: C.ink }}>
        {value}
        {unit && <span style={{ fontSize: 11, color: C.ink3, fontWeight: 500, marginLeft: 3 }}>{unit}</span>}
        {delta && <span style={{ fontSize: 11, color: deltaColor || C.ink3, fontWeight: 700, marginLeft: 6 }}>{delta}</span>}
      </span>
      {children}
    </div>
  );
}

function HistoryPanel({ days, goals, selectedKey, onSelectDay, units, weekStart }) {
  const C = useC();
  const end = todayKey();
  const kcalS = series(days, goals, end, 30, 'kcal');
  const stepS = series(days, goals, end, 30, 'steps');
  const wS = series(days, goals, end, 30, 'weight');
  const trS = series(days, goals, end, 30, 'workouts');

  const kcalAvg = avgOf(kcalS);
  const stepAvg = avgOf(stepS);
  const wPresent = wS.filter(d => d.v != null);
  const wLast = wPresent.length ? wPresent[wPresent.length-1].v : null;
  const wFirst = wPresent.length ? wPresent[0].v : null;
  const wDelta = wLast != null && wFirst != null ? wLast - wFirst : null;
  const trCount = trS.reduce((a,d) => a + d.v, 0);

  const [viewK, setViewK] = useState(selectedKey);
  useEffect(() => { setViewK(selectedKey); }, [selectedKey]);
  const view = parseKey(viewK);
  const year = view.getFullYear(), month = view.getMonth();
  const stepMonth = n => { const d = new Date(year, month+n, 1); setViewK(keyOf(d)); };
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const sundayStart = weekStart === 'sun';
  const lead = sundayStart ? first.getDay() : (first.getDay() + 6) % 7;
  const dows = sundayStart ? ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'] : ['Mån','Tis','Ons','Tor','Fre','Lör','Sön'];
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <TrendCard label="Kalorier · 30d" value={grp(kcalAvg)} unit="avg">
          <Spark data={kcalS} color={C.ink2} />
        </TrendCard>
        <TrendCard label="Steg · 30d" value={grp(stepAvg)} unit="avg">
          <Spark data={stepS} color={C.tealLight} />
        </TrendCard>
        <TrendCard label="Vikt · 30d" value={wLast != null ? wDisp(wLast, units) : '–'} unit={units}
          delta={wDelta != null ? `${wDelta <= 0 ? '−' : '+'}${Math.abs(wDisp(Math.abs(wDelta), units)).toFixed(1)}` : null}
          deltaColor={wDelta != null && wDelta <= 0 ? C.teal : C.amber}>
          <Spark data={wS} color={C.teal} />
        </TrendCard>
        <TrendCard label="Träning · 30d" value={trCount} unit="pass">
          <Spark data={trS} color={C.tealDeep} bars />
        </TrendCard>
      </div>

      <div style={{ height: '0.5px', background: C.line, margin: '16px 0 12px' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, letterSpacing: '-0.01em', color: C.ink }}>{MO_LONG[month]} {year}</h3>
          <div style={{ display: 'inline-flex', gap: 1 }}>
            <IconButton icon="chevron-left" label="Föregående månad" onClick={() => stepMonth(-1)} size={28} />
            <IconButton icon="chevron-right" label="Nästa månad" onClick={() => stepMonth(1)} size={28} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: C.ink3, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: C.teal }} />kcal i mål</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: C.tealLight }} />steg ≥ mål</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: C.amber }} />träning</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.ink4 }}>
          {dows.map(d => <span key={d} style={{ textAlign: 'center' }}>{d}</span>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', gap: 4, flex: 1, minHeight: 0 }}>
          {cells.map((d, i) => {
            if (d == null) return <div key={i} />;
            const k = `${year}-${pad2(month+1)}-${pad2(d)}`;
            const day = days[k];
            const isToday = k === end;
            const isSel = k === selectedKey;
            const kGoal = kcalInGoal(day, goals);
            const sGoal = stepsHit(day, goals);
            const session = day && day.workouts.length > 0;
            const future = parseKey(k) > parseKey(end);
            return (
              <button key={i} onClick={() => !future && onSelectDay(k)} disabled={future}
                style={{ border: `1px solid ${isSel ? C.teal : C.line}`, background: isSel ? C.tealMist : C.surface, borderRadius: 6, padding: '5px 6px', cursor: future ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', gap: 3, minHeight: 0, overflow: 'hidden', opacity: future ? 0.35 : 1, textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 120ms, background 120ms' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: isToday || isSel ? 700 : 500, color: isToday ? C.teal : C.ink, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isToday ? 16 : 'auto', height: isToday ? 16 : 'auto', borderRadius: 999, border: isToday ? `1.25px solid ${C.teal}` : 'none' }}>{d}</span>
                  <span style={{ display: 'inline-flex', gap: 2 }}>
                    {kGoal && <span style={{ width: 4, height: 4, borderRadius: 999, background: C.teal }} />}
                    {sGoal && <span style={{ width: 4, height: 4, borderRadius: 999, background: C.tealLight }} />}
                    {session && <span style={{ width: 4, height: 4, borderRadius: 999, background: C.amber }} />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ── Header & Summary ─────────────────────────────────────────────────────── */
function BrandMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="var(--color-accent)" />
      <path d="M8 22 L14 10 L20 18 L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="14" r="2.5" fill="white" />
    </svg>
  );
}

function Header({ selectedKey, onStep, onToday, theme, onToggleTheme, userName, onExport, onLogout }) {
  const C = useC();
  const rel = fmtRelative(selectedKey);
  const d = parseKey(selectedKey);
  const weekday = WD_SHORT[d.getDay()];
  const dateStr = `${d.getDate()} ${MO_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  const isToday = selectedKey === todayKey();

  return (
    <header className="t3-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <BrandMark />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', color: C.ink }}>
            Track<span style={{ color: C.teal }}>3</span>r
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.ink3 }}>Tracking hub</span>
        </div>
      </div>

      <div className="t3-header-right">
        <div className="t3-datesel">
          <IconButton icon="chevron-left" label="Föregående dag" onClick={() => onStep(-1)} size={30} />
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 158, lineHeight: 1.15 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{rel || weekday}</span>
            <span style={{ fontSize: 11, color: C.ink3 }}>{dateStr}</span>
          </span>
          <IconButton icon="chevron-right" label="Nästa dag" onClick={() => onStep(1)} size={30}
            style={{ opacity: isToday ? 0.35 : 1, pointerEvents: isToday ? 'none' : 'auto' }} />
        </div>
        {!isToday && <Button variant="secondary" size="sm" onClick={onToday}>Idag</Button>}
        <Button variant="secondary" size="sm" icon="download" onClick={onExport}>Exportera</Button>
        <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label="Växla tema" onClick={onToggleTheme} size={36} />
        <IconButton icon="log-out" label="Byt användare" onClick={onLogout} size={36} />
        <span className="t3-avatar" title={userName}>{(userName || '?').slice(0,2).toUpperCase()}</span>
      </div>
    </header>
  );
}

function Summary({ day, goals, selectedKey, days, units, store }) {
  const C = useC();
  const totals = dayTotals(day);
  const left = goals.kcal - totals.kcal;
  const over = left < 0;
  const stepsPct = day.steps != null ? Math.round((day.steps / goals.steps) * 100) : null;
  const streak = calcStreak(days);
  const prevW = (days[addDays(selectedKey, -7)] || {}).weight;
  const wd = day.weight != null && prevW != null ? day.weight - prevW : null;
  const onTrack = totals.kcal > 0 && !over;

  return (
    <section className="t3-summary">
      <span className="t3-summary-eyebrow">{fmtRelative(selectedKey) || WD_SHORT[parseKey(selectedKey).getDay()]}</span>
      <span className="t3-vsplit" />

      <div className="t3-stat">
        <span className="t3-stat-lbl">Kcal</span>
        <span className="t3-stat-num">{grp(totals.kcal)}</span>
        <span className="t3-stat-unit">/ <EditNum value={goals.kcal} onCommit={v => store.setGoal('kcal', v)} style={{ fontWeight: 700, color: C.ink }} /> kcal</span>
        <span className="t3-stat-delta" style={{ color: over ? C.amber : C.ink3 }}>{over ? `${grp(-left)} över` : `${grp(left)} kvar`}</span>
      </div>
      <span className="t3-vsplit" />

      <div className="t3-stat">
        <span className="t3-stat-lbl">Steg</span>
        <span className="t3-stat-num"><EditNum value={day.steps} onCommit={v => store.setSteps(selectedKey, v)} style={{ fontWeight: 900 }} /></span>
        <span className="t3-stat-unit">/ <EditNum value={goals.steps} onCommit={v => store.setGoal('steps', v)} style={{ fontWeight: 700, color: C.ink }} /></span>
        {stepsPct != null && <span className="t3-stat-delta" style={{ color: stepsPct >= 100 ? C.teal : C.ink3 }}>{stepsPct}%</span>}
      </div>
      <span className="t3-vsplit" />

      <div className="t3-stat">
        <span className="t3-stat-lbl">Vikt</span>
        <span className="t3-stat-num">
          <EditNum value={wDisp(day.weight, units)} onCommit={v => store.setWeight(selectedKey, wToKg(v, units))} format={x => x == null ? '–' : x.toFixed(1)} mode="decimal" style={{ fontWeight: 900 }} />
        </span>
        <span className="t3-stat-unit">/ <EditNum value={wDisp(goals.weight, units)} onCommit={v => store.setGoal('weight', wToKg(v, units))} format={x => x == null ? '–' : x.toFixed(1)} mode="decimal" style={{ fontWeight: 700, color: C.ink }} /> {units}</span>
        {wd != null && <span className="t3-stat-delta" style={{ color: wd <= 0 ? C.teal : C.amber }}>{wd <= 0 ? '−' : '+'}{Math.abs(wDisp(Math.abs(wd), units)).toFixed(1)} / 7d</span>}
      </div>

      <span className="t3-summary-spacer" />
      {streak > 0 && <Chip variant="amber" icon="flame">{streak}-dagars streak</Chip>}
      <Chip variant={onTrack ? 'teal' : 'outline'} icon={onTrack ? 'check' : 'minus'}>
        {over ? 'Över mål' : onTrack ? 'I mål' : 'Inget loggat'}
      </Chip>
    </section>
  );
}

/* ── CSV export ───────────────────────────────────────────────────────────── */
function csvCell(v) {
  if (v == null) return '';
  const s = String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Build a daily-summary CSV string for every date in [fromKey, toKey].
function buildDailyCSV(days, fromKey, toKey) {
  const headers = [
    'Datum', 'Veckodag', 'Kalorier (kcal)', 'Protein (g)', 'Kolhydrater (g)', 'Fett (g)',
    'Steg', 'Vikt (kg)', 'Antal pass', 'Aktiv tid (min)', 'Förbränt (kcal)', 'Antal måltider',
  ];
  const rows = [headers.join(',')];
  for (let k = fromKey; k <= toKey; k = addDays(k, 1)) {
    const day = days[k];
    const t = day ? dayTotals(day) : { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    const workouts = day ? day.workouts : [];
    const activeMin = workouts.reduce((a, w) => a + (w.durationMin || 0), 0);
    const burned = workouts.reduce((a, w) => a + (w.kcal || 0), 0);
    const d = parseKey(k);
    rows.push([
      k,
      WD_SHORT[d.getDay()],
      Math.round(t.kcal),
      Math.round(t.protein),
      Math.round(t.carbs),
      Math.round(t.fat),
      day && day.steps != null ? day.steps : '',
      day && day.weight != null ? day.weight : '',
      workouts.length,
      activeMin,
      burned,
      day ? day.meals.length : 0,
    ].map(csvCell).join(','));
  }
  return '﻿' + rows.join('\r\n'); // BOM so Excel reads UTF-8 (åäö) correctly
}

function downloadCSV(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ── Export modal ─────────────────────────────────────────────────────────── */
function ExportModal({ profileId, onClose, onDone }) {
  const C = useC();
  const [preset, setPreset] = useState(30);
  const [from, setFrom] = useState(addDays(todayKey(), -29));
  const [to, setTo] = useState(todayKey());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const applyPreset = n => {
    setPreset(n);
    if (n !== 'custom') { setFrom(addDays(todayKey(), -(n - 1))); setTo(todayKey()); }
  };

  const fromKey = preset === 'custom' ? from : addDays(todayKey(), -(preset - 1));
  const toKey = preset === 'custom' ? to : todayKey();
  const invalidRange = fromKey > toKey;

  const run = async () => {
    if (invalidRange) { setError('Startdatum måste vara före slutdatum.'); return; }
    setBusy(true); setError('');
    try {
      const rows = await db.getDays(profileId, fromKey, toKey);
      const days = rowsToDays(rows);
      const csv = buildDailyCSV(days, fromKey, toKey);
      downloadCSV(`track3r-export_${fromKey}_till_${toKey}.csv`, csv);
      onDone();
    } catch (_) {
      setError('Kunde inte hämta data. Försök igen.');
      setBusy(false);
    }
  };

  const presets = [{ v: 30, l: '30 dagar' }, { v: 60, l: '60 dagar' }, { v: 90, l: '90 dagar' }, { v: 'custom', l: 'Anpassad' }];

  return (
    <Modal eyebrow="Exportera" title="Exportera till CSV" onClose={onClose}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Avbryt</Button>
        <Button variant="primary" icon="download" onClick={run} disabled={busy || invalidRange}>
          {busy ? 'Hämtar…' : 'Ladda ner CSV'}
        </Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Period">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {presets.map(p => (
              <button key={p.v} type="button" className={`t3-tag${preset === p.v ? ' on' : ''}`} onClick={() => applyPreset(p.v)}>{p.l}</button>
            ))}
          </div>
        </Field>
        {preset === 'custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Från">
              <TextInput type="date" max={to} value={from} onChange={e => setFrom(e.target.value)} style={{ colorScheme: 'dark light' }} />
            </Field>
            <Field label="Till">
              <TextInput type="date" max={todayKey()} value={to} onChange={e => setTo(e.target.value)} style={{ colorScheme: 'dark light' }} />
            </Field>
          </div>
        )}
        <span style={{ fontSize: 12, color: C.ink3 }}>
          {invalidRange ? 'Ogiltigt intervall.' : `Exporterar dagliga summeringar för ${fromKey} – ${toKey}.`}
        </span>
        {error && <span style={{ fontSize: 12, color: '#e05c5c', fontWeight: 600 }}>{error}</span>}
      </div>
    </Modal>
  );
}

/* ── Loading screen ───────────────────────────────────────────────────────── */
function LoadingScreen() {
  const C = useC();
  return (
    <div className="t3-login">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: C.ink3 }}>
        <BrandMark />
        <span style={{ fontSize: 13, fontWeight: 600 }}>Laddar din data…</span>
      </div>
    </div>
  );
}

/* ── Root App ─────────────────────────────────────────────────────────────── */
export default function TrackrApp() {
  const savedTheme = localStorage.getItem('ailabb_theme') || 'dark';
  const [theme, setTheme] = useState(savedTheme);
  const [userName, setUserName] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [selectedKey, setSelectedKey] = useState(todayKey());
  const [tab, setTab] = useState('food');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [units] = useState('kg');

  const C = mkC(theme === 'dark');
  const store = useStore(profileId);
  const { state, loading } = store;
  const day = state.days[selectedKey] || emptyDay();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* Restore session on mount — redirect to the hub if not logged in (like todo). */
  useEffect(() => {
    let cancelled = false;
    // Drop legacy localStorage-based data from the pre-Supabase version.
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('track3r.hub.v1.'))
        .forEach(k => localStorage.removeItem(k));
    } catch (_) {}
    (async () => {
      const name = getActiveUserName();
      if (!name) { window.location.replace('../../'); return; }
      if (cancelled) return;
      setUserName(name);

      const cachedId = localStorage.getItem(PROFILE_ID_KEY);
      const cachedName = localStorage.getItem(PROFILE_NAME_KEY);
      let pid;
      if (cachedId && cachedName === name) {
        pid = cachedId;
      } else {
        try {
          const profile = await db.getOrCreateProfile(name);
          if (!profile) { window.location.replace('../../'); return; }
          pid = profile.id;
          localStorage.setItem(PROFILE_ID_KEY, pid);
          localStorage.setItem(PROFILE_NAME_KEY, name);
        } catch (_) {
          window.location.replace('../../'); return;
        }
      }
      if (cancelled) return;
      setProfileId(pid);
      setAuthReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const logout = () => {
    localStorage.removeItem('ailabb_active_user');
    localStorage.removeItem(PROFILE_ID_KEY);
    localStorage.removeItem(PROFILE_NAME_KEY);
    window.location.replace('../../');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('ailabb_theme', next);
  };

  const flash = (msg, icon) => {
    setToast({ msg, icon });
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setToast(null), 2400);
  };

  const saveMeal = meal => {
    if (state.days[selectedKey]?.meals.some(m => m.id === meal.id)) {
      store.updateMeal(selectedKey, meal); flash('Måltid uppdaterad');
    } else { store.addMeal(selectedKey, meal); flash(`${meal.name} loggad`); }
    setModal(null);
  };
  const removeMeal = id => { store.deleteMeal(selectedKey, id); setModal(null); flash('Måltid borttagen', 'trash-2'); };

  const yesterdayMeals = (state.days[addDays(selectedKey, -1)] || {}).meals || [];
  const copyYesterday = () => {
    if (!yesterdayMeals.length) return;
    yesterdayMeals.forEach(m => store.addMeal(selectedKey, { ...m, id: uid('m') }));
    flash(`${yesterdayMeals.length} måltid${yesterdayMeals.length === 1 ? '' : 'er'} kopierade`, 'rotate-ccw');
  };
  const recentFoods = recentFoodsFrom(state.days);
  const saveWorkout = w => {
    if (state.days[selectedKey]?.workouts.some(x => x.id === w.id)) {
      store.updateWorkout(selectedKey, w); flash('Pass uppdaterat');
    } else { store.addWorkout(selectedKey, w); flash(`${w.name} loggat`); }
    setModal(null);
  };
  const removeWorkout = id => { store.deleteWorkout(selectedKey, id); setModal(null); flash('Pass borttaget', 'trash-2'); };

  const stepDay = n => {
    const next = addDays(selectedKey, n);
    if (parseKey(next) <= parseKey(todayKey())) setSelectedKey(next);
  };

  if (!authReady || loading) {
    return (
      <CC.Provider value={C}>
        <div className="t3-root">
          <ScopedStyles />
          <LoadingScreen />
        </div>
      </CC.Provider>
    );
  }

  return (
    <CC.Provider value={C}>
      <div className="t3-root">
        <ScopedStyles />
        <div className="t3-stage">
          <Header selectedKey={selectedKey} onStep={stepDay} onToday={() => setSelectedKey(todayKey())}
            theme={theme} onToggleTheme={toggleTheme} userName={userName}
            onExport={() => setModal({ type: 'export' })} onLogout={logout} />

          <Summary day={day} goals={state.goals} selectedKey={selectedKey} days={state.days} units={units} store={store} />

          <div className="t3-main">
            <Panel>
              <div className="t3-panel-head">
                <Segmented value={tab} onChange={setTab} options={[
                  { value: 'food', label: 'Mat', icon: 'utensils' },
                  { value: 'training', label: 'Träning', icon: 'dumbbell' },
                ]} />
                <span className="t3-panel-sub">
                  {tab === 'food'
                    ? `${day.meals.length} måltid${day.meals.length === 1 ? '' : 'er'} loggade`
                    : `${day.workouts.length} pass loggade`}
                </span>
              </div>
              {tab === 'food'
                ? <FoodPanel day={day} goals={state.goals} onAddMeal={() => setModal({ type: 'meal', data: null })} onEditMeal={m => setModal({ type: 'meal', data: m })} onCopyYesterday={copyYesterday} yesterdayCount={yesterdayMeals.length} />
                : <TrainingPanel day={day} days={state.days} selectedKey={selectedKey} onAddWorkout={() => setModal({ type: 'workout', data: null })} onEditWorkout={w => setModal({ type: 'workout', data: w })} />}
            </Panel>

            <Panel>
              <div className="t3-panel-head">
                <h2 className="t3-panel-title">Historik</h2>
                <span className="t3-panel-sub">Senaste 30 dagarna · klicka en dag för att ladda den</span>
              </div>
              <HistoryPanel days={state.days} goals={state.goals} selectedKey={selectedKey}
                onSelectDay={setSelectedKey} units={units} weekStart="mon" />
            </Panel>
          </div>
        </div>

        {!state.goalsSet && (
          <OnboardingModal
            onSave={g => { store.setAllGoals(g); flash('Dina mål är satta', 'check'); }}
            onSkip={() => store.setAllGoals(state.goals)}
          />
        )}

        {modal?.type === 'meal' && <MealModal initial={modal.data} recent={recentFoods} favorites={state.favorites} onAddFavorite={f => { store.addFavorite(f); flash('Sparad som favorit', 'star'); }} onRemoveFavorite={store.removeFavorite} onSave={saveMeal} onClose={() => setModal(null)} onDelete={removeMeal} />}
        {modal?.type === 'workout' && <WorkoutModal initial={modal.data} onSave={saveWorkout} onClose={() => setModal(null)} onDelete={removeWorkout} />}
        {modal?.type === 'export' && <ExportModal profileId={profileId} onClose={() => setModal(null)} onDone={() => { setModal(null); flash('Export nedladdad', 'download'); }} />}

        <Toast toast={toast} />
      </div>
    </CC.Provider>
  );
}
