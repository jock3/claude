// Track3r — Tracking Hub
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Sun, Moon, Utensils, Dumbbell, Check, Trash2, Pencil, Plus, Minus, Activity, Move, Trophy, Flame, RotateCcw, LogOut, Download, AlertTriangle, Search, Loader, Barcode, Star, X, Target, Clock, Bike, Footprints, Waves, Mountain, CheckCircle2, Bookmark, MoreVertical, PersonStanding } from 'lucide-react';
import zxingReaderWasm from 'zxing-wasm/reader/zxing_reader.wasm?url';
import * as db from './db.js';
import { searchFoods, getProductByBarcode } from './off.js';
import { searchExercises } from './exercises.js';
import './trackr.css';

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
  'star': Star, 'x': X, 'target': Target, 'clock': Clock, 'bike': Bike,
  'footprints': Footprints, 'waves': Waves, 'mountain': Mountain,
  'check-circle': CheckCircle2, 'bookmark': Bookmark, 'more-vertical': MoreVertical,
  'person': PersonStanding,
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
// Most recently logged body weight (kg), for seeding the TDEE calculation.
function latestLoggedWeight(days) {
  const keys = Object.keys(days).sort().reverse();
  for (const k of keys) {
    const w = days[k] && days[k].weight;
    if (w != null) return w;
  }
  return null;
}
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
// Direction of the calorie adjustment, derived from where you are now vs where
// you want to be. A ±1 kg deadband counts as "maintain".
function aimFromWeights(currentWeight, goalWeight) {
  const diff = (goalWeight != null ? goalWeight : currentWeight) - currentWeight;
  if (diff <= -1) return 'lose';
  if (diff >= 1) return 'gain';
  return 'maintain';
}

// Energy + macro targets. TDEE is driven by CURRENT body weight (that's what
// determines expenditure); the goal weight only sets the deficit/surplus
// direction. Returns just the kcal/macro fields plus the derived aim — steps
// and the goal-weight target are handled by the caller.
function goalsFromProfile({ sex, age, height, weight, activity, goalWeight }) {
  // Mifflin-St Jeor BMR, then activity factor for TDEE.
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'female' ? -161 : 5);
  const tdee = bmr * activity;
  const aim = aimFromWeights(weight, goalWeight);
  const adj = aim === 'lose' ? -500 : aim === 'gain' ? 300 : 0;
  const kcal = Math.max(1200, Math.round((tdee + adj) / 10) * 10);
  const protein = Math.round(1.8 * weight);          // 1.8 g/kg of current weight
  const fat = Math.round((kcal * 0.275) / 9);         // ~27.5% of energy from fat
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4)); // remainder
  return { kcal, protein, carbs, fat, aim };
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

function Panel({ children, className }) {
  return <section className={`t3-panel${className ? ' ' + className : ''}`}>{children}</section>;
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

/* ── Water tracker ────────────────────────────────────────────────────────── */
const WATER_GOAL = 8;

function WaterRow({ water, onChange }) {
  return (
    <div className="t3-water-row">
      <div className="t3-water-cups">
        {Array.from({ length: WATER_GOAL }, (_, i) => (
          <button
            key={i}
            className={`t3-water-cup${i < water ? ' filled' : ''}`}
            onClick={() => onChange(i < water ? i : i + 1)}
            aria-label={`${i + 1} glas vatten`}
          >💧</button>
        ))}
      </div>
      <span className="t3-water-count">{water}/{WATER_GOAL} glas</span>
    </div>
  );
}

/* ── Food panel ───────────────────────────────────────────────────────────── */
const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

function GoalsModal({ mode = 'onboard', currentGoals, latestWeight, onSave, onClose }) {
  const C = useC();
  const isEdit = mode === 'edit';
  const base = currentGoals || DEFAULT_GOALS;
  // Seed with the user's CURRENT weight — most recent logged value first, then
  // any existing goal weight, then a neutral default. This is the weight that
  // drives the calorie calc, not the goal/target weight.
  const seedWeight = latestWeight != null ? latestWeight : (base.weight != null ? base.weight : 78);
  // Goal weight defaults to the existing target, else to current weight (= maintain).
  const seedGoal = base.weight != null ? base.weight : seedWeight;
  const [f, setF] = useState({
    sex: 'male', age: '30', height: '178',
    weight: String(Math.round(seedWeight)),
    goalWeight: String(Math.round(seedGoal)),
    activity: 1.55,
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const valid = parseFloat(f.age) > 0 && parseFloat(f.height) > 0 && parseFloat(f.weight) > 0 && parseFloat(f.goalWeight) > 0;
  const preview = valid ? goalsFromProfile({
    sex: f.sex, age: +f.age, height: +f.height, weight: +f.weight, activity: +f.activity, goalWeight: +f.goalWeight,
  }) : null;
  const aimLabel = preview && (preview.aim === 'lose' ? 'Underskott för viktnedgång (−500 kcal)'
    : preview.aim === 'gain' ? 'Överskott för viktuppgång (+300 kcal)'
    : 'Underhållsnivå');

  const handleSave = () => {
    if (!preview) return;
    const { aim, ...goalFields } = preview;
    // Save the goal-weight target (editable now) and preserve the steps goal.
    onSave({
      ...base,
      ...goalFields,
      steps: base.steps != null ? base.steps : DEFAULT_GOALS.steps,
      weight: +f.goalWeight,
    });
  };

  return (
    <Modal eyebrow={isEdit ? 'Skräddarsy dina mål' : 'Välkommen till Track3r'}
      title={isEdit ? 'Uppdatera mål' : 'Kom igång med dina mål'}
      onClose={onClose}
      footer={<>
        <Button variant="ghost" onClick={onClose} style={{ marginRight: 'auto' }}>{isEdit ? 'Avbryt' : 'Hoppa över'}</Button>
        <Button variant="primary" icon="check" disabled={!valid} onClick={handleSave}>{isEdit ? 'Uppdatera mål' : 'Sätt mina mål'}</Button>
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
        <Field label="Nuvarande vikt (kg)" hint="driver kalorierna">
          <TextInput type="number" inputMode="decimal" min="0" value={f.weight} onChange={e => set('weight', e.target.value)} />
        </Field>
        <Field label="Målvikt (kg)" hint="sätt = nuvarande för att behålla">
          <TextInput type="number" inputMode="decimal" min="0" value={f.goalWeight} onChange={e => set('goalWeight', e.target.value)} />
        </Field>
        <Field label="Aktivitetsnivå" span={2}>
          <select className="t3-input" value={f.activity} onChange={e => set('activity', e.target.value)}>
            {ACTIVITY_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
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
          <span style={{ display: 'block', marginTop: 8, fontSize: 12, fontWeight: 600, color: C.ink3 }}>{aimLabel}</span>
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

      <div style={{ height: '0.5px', background: C.line, margin: '8px 0' }} />

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

// Cardio formats modelled on Apple's Workout app. `distance` marks the ones
// where logging a distance makes sense (a treadmill run vs. a HIIT circuit).
const CARDIO_TYPES = [
  { id: 'run-out',   label: 'Löpning ute',   icon: 'activity',   distance: true  },
  { id: 'run-in',    label: 'Löpning inne',  icon: 'activity',   distance: true  },
  { id: 'walk-out',  label: 'Promenad',      icon: 'footprints', distance: true  },
  { id: 'cycle-out', label: 'Cykling ute',   icon: 'bike',       distance: true  },
  { id: 'cycle-in',  label: 'Spinning',      icon: 'bike',       distance: true  },
  { id: 'elliptical',label: 'Crosstrainer',  icon: 'activity',   distance: false },
  { id: 'rower',     label: 'Roddmaskin',    icon: 'waves',      distance: true  },
  { id: 'stairs',    label: 'Trappmaskin',   icon: 'mountain',   distance: false },
  { id: 'hiit',      label: 'HIIT',          icon: 'flame',      distance: false },
  { id: 'hike',      label: 'Vandring',      icon: 'mountain',   distance: true  },
  { id: 'swim',      label: 'Simning',       icon: 'waves',      distance: true  },
  { id: 'other',     label: 'Annat',         icon: 'person',     distance: false },
];
function cardioMeta(id) { return CARDIO_TYPES.find(c => c.id === id) || CARDIO_TYPES[CARDIO_TYPES.length - 1]; }

// Format elapsed milliseconds as H:MM:SS or M:SS.
function fmtClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0'), ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Most recent logged performance of a named exercise (for the "previous" column).
function lastExercisePerformance(days, name, beforeKey) {
  const target = (name || '').trim().toLowerCase();
  if (!target) return null;
  const keys = Object.keys(days).filter(k => !beforeKey || k < beforeKey).sort().reverse();
  for (const k of keys) {
    const ws = (days[k] && days[k].workouts) || [];
    for (let i = ws.length - 1; i >= 0; i--) {
      const ex = (ws[i].exercises || []).find(e => (e.name || '').trim().toLowerCase() === target);
      if (ex && ex.sets && ex.sets.length) return { date: k, sets: ex.sets };
    }
  }
  return null;
}

// ── Active-session persistence (survives reloads until "Avsluta pass") ───────
const ACTIVE_SESSION_KEY = 'track3r_active_session';
function loadActiveSession(profileId) {
  try {
    const v = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY));
    return v && v.profileId === profileId ? v : null;
  } catch (_) { return null; }
}
function saveActiveSession(s) { try { localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(s)); } catch (_) {} }
function clearActiveSession() { try { localStorage.removeItem(ACTIVE_SESSION_KEY); } catch (_) {} }

// ── Templates / routines (saved strength layouts, per profile) ───────────────
const ROUTINES_KEY = 'track3r_routines';
function loadRoutines(profileId) {
  try {
    const all = JSON.parse(localStorage.getItem(ROUTINES_KEY)) || {};
    return all[profileId] || [];
  } catch (_) { return []; }
}
function saveRoutines(profileId, routines) {
  try {
    const all = JSON.parse(localStorage.getItem(ROUTINES_KEY)) || {};
    all[profileId] = routines;
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(all));
  } catch (_) {}
}

// Training-volume helpers (reps × weight, summed). Used for strength sessions.
function setsVolume(sets) {
  return (sets || []).reduce((a, s) => a + (Number(s.reps) || 0) * (Number(s.weight) || 0), 0);
}
function workoutVolume(w) {
  return (w.exercises || []).reduce((a, e) => a + setsVolume(e.sets), 0);
}
function workoutSetCount(w) {
  return (w.exercises || []).reduce((a, e) => a + (e.sets ? e.sets.length : 0), 0);
}

// In-modal editor for a single strength exercise (its set list).
function ExerciseCard({ ex, onChange, onRemove }) {
  const C = useC();
  const sets = ex.sets || [];
  const setRow = (i, k, v) => onChange({ ...ex, sets: sets.map((s, j) => j === i ? { ...s, [k]: v } : s) });
  const addSet = () => {
    const last = sets[sets.length - 1] || { reps: '', weight: '' };
    onChange({ ...ex, sets: [...sets, { reps: last.reps, weight: last.weight }] });
  };
  const delSet = i => onChange({ ...ex, sets: sets.filter((_, j) => j !== i) });
  const vol = setsVolume(sets);

  return (
    <div style={{ border: `0.5px solid ${C.line}`, borderRadius: 10, padding: '11px 12px', background: C.bgSoft }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: sets.length ? 9 : 0 }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</span>
        {vol > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: C.ink3, whiteSpace: 'nowrap' }}>{grp(vol)} kg vol</span>}
        <button type="button" onClick={onRemove} title="Ta bort övning"
          style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: C.ink4, cursor: 'pointer', padding: 2 }}>
          <Icon name="x" size={15} stroke={2.25} />
        </button>
      </div>
      {sets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sets.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr 28px', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textAlign: 'center' }}>{i + 1}</span>
              <TextInput type="number" inputMode="numeric" min="0" value={s.reps} placeholder="reps" onChange={e => setRow(i, 'reps', e.target.value)} />
              <TextInput type="number" inputMode="decimal" min="0" value={s.weight} placeholder="kg" onChange={e => setRow(i, 'weight', e.target.value)} />
              <button type="button" onClick={() => delSet(i)} title="Ta bort set"
                style={{ display: 'inline-flex', justifyContent: 'center', border: 'none', background: 'transparent', color: C.ink4, cursor: 'pointer', padding: 2 }}>
                <Icon name="minus" size={15} stroke={2.25} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="t3-tag" onClick={addSet} style={{ marginTop: 9, gap: 5 }}>
        <Icon name="plus" size={13} stroke={2.5} /> Lägg till set
      </button>
    </div>
  );
}

function WorkoutModal({ initial, onSave, onClose, onDelete }) {
  const editing = !!(initial && initial.id);
  const [f, setF] = useState(() => ({
    kind: (initial && initial.kind) || 'Strength',
    name: (initial && initial.name) || '',
    durationMin: initial && initial.durationMin != null ? String(initial.durationMin) : '',
    kcal: initial && initial.kcal != null ? String(initial.kcal) : '',
    tags: (initial && initial.tags) ? initial.tags.slice() : [],
    exercises: (initial && initial.exercises) ? initial.exercises.map(e => ({ ...e, sets: (e.sets || []).slice() })) : [],
  }));
  const [tried, setTried] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const toggleTag = t => setF(s => ({ ...s, tags: s.tags.includes(t) ? s.tags.filter(x => x !== t) : [...s.tags, t] }));

  // ── Exercise search (local bundled library, instant, no network) ──────────
  const [query, setQuery] = useState('');
  const isStrength = f.kind === 'Strength';
  const results = isStrength && query.trim().length >= 2 ? searchExercises(query) : [];
  const showResults = isStrength && query.trim().length >= 2;

  const addExercise = (name, exId) => {
    setF(s => ({ ...s, exercises: [...s.exercises, { id: uid('ex'), exId: exId ?? null, name, sets: [{ reps: '', weight: '' }] }] }));
    setQuery(''); setResults([]); setShowResults(false);
  };
  const updateExercise = (id, next) => setF(s => ({ ...s, exercises: s.exercises.map(e => e.id === id ? next : e) }));
  const removeExercise = id => setF(s => ({ ...s, exercises: s.exercises.filter(e => e.id !== id) }));

  const hasExercises = f.exercises.length > 0;
  // With logged exercises a strength session can stand on its own — name and
  // duration become optional (we default the name to "Styrkepass").
  const nameBad = !f.name.trim() && !(isStrength && hasExercises);
  const durBad = !(parseFloat(f.durationMin) > 0) && !(isStrength && hasExercises);
  const totalVol = f.exercises.reduce((a, e) => a + setsVolume(e.sets), 0);
  const totalSets = f.exercises.reduce((a, e) => a + e.sets.length, 0);

  const submit = () => {
    setTried(true);
    if (nameBad || durBad) return;
    const name = f.name.trim() || (isStrength && hasExercises ? 'Styrkepass' : '');
    const exercises = isStrength
      ? f.exercises.map(e => ({
          id: e.id, exId: e.exId, name: e.name,
          sets: e.sets
            .filter(s => Number(s.reps) > 0 || Number(s.weight) > 0)
            .map(s => ({ reps: Math.round(Number(s.reps) || 0), weight: Number(s.weight) || 0 })),
        }))
      : [];
    onSave({
      id: editing ? initial.id : uid('w'), kind: f.kind, name,
      durationMin: Math.round(parseFloat(f.durationMin) || 0),
      kcal: Math.round(parseFloat(f.kcal) || 0), tags: f.tags, exercises,
    });
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
        <Field label="Tid" hint={isStrength && hasExercises ? 'min — valfritt' : 'min — obligatoriskt'}>
          <TextInput type="number" inputMode="numeric" min="0" value={f.durationMin} placeholder="0" invalid={tried && durBad} onChange={e => set('durationMin', e.target.value)} />
        </Field>
        <Field label="Namn på passet" hint={isStrength && hasExercises ? 'valfritt' : undefined} span={2}>
          <TextInput value={f.name} placeholder={isStrength ? 'ex. Push-dag · bröst + axlar' : 'ex. Löprunda i skogen'} invalid={tried && nameBad} onChange={e => set('name', e.target.value)} autoFocus />
        </Field>
      </div>

      {isStrength && (
        <div style={{ marginTop: 14 }}>
          <Field label="Lägg till övning" hint="120+ övningar — skriv namn eller muskelgrupp">
            <div className="t3-search-wrap">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
                  <Icon name="search" size={15} stroke={2} />
                </span>
                <TextInput
                  value={query}
                  placeholder="ex. bänkpress, marklyft, knäböj…"
                  style={{ paddingLeft: 34 }}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              {showResults && (
                <div className="t3-search-results">
                  {results.length === 0 ? (
                    <button type="button" className="t3-search-item" onClick={() => addExercise(query.trim(), null)}>
                      <span className="t3-search-name">Lägg till "{query.trim()}"</span>
                      <span className="t3-search-meta">Inga träffar — lägg till som egen övning</span>
                    </button>
                  ) : results.map(r => (
                    <button type="button" key={r.id} className="t3-search-item" onClick={() => addExercise(r.name, r.id)}>
                      <span className="t3-search-name">{r.name}</span>
                      <span className="t3-search-meta">{r.category}{r.muscles ? ` · ${r.muscles}` : ''}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {hasExercises && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
              {f.exercises.map(ex => (
                <ExerciseCard key={ex.id} ex={ex} onChange={next => updateExercise(ex.id, next)} onRemove={() => removeExercise(ex.id)} />
              ))}
              {totalVol > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', paddingRight: 2 }}>
                  <span>{f.exercises.length} övn · {totalSets} set</span>
                  <span>Volym {grp(totalVol)} kg</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 14 }}>
        <Field label="Förbränning" hint="kcal — valfritt">
          <TextInput type="number" inputMode="numeric" min="0" value={f.kcal} placeholder="0" onChange={e => set('kcal', e.target.value)} />
        </Field>
        <Field label="Taggar">
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
  const exCount = (w.exercises || []).length;
  const sets = workoutSetCount(w);
  const vol = workoutVolume(w);
  const label = w.kind === 'Cardio' && w.cardioType ? cardioMeta(w.cardioType).label : w.kind;
  const parts = [label];
  if (exCount > 0) parts.push(`${exCount} övn · ${sets} set`);
  else if (w.durationMin) parts.push(`${w.durationMin} min`);
  if (w.distanceKm) parts.push(`${w.distanceKm} km`);
  if (vol > 0) parts.push(`${grp(vol)} kg vol`);
  else if (w.kcal) parts.push(`${grp(w.kcal)} kcal`);
  return (
    <button onClick={onClick} className="t3-row"
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', borderTop: `0.5px solid ${C.line2}`, cursor: 'pointer', fontFamily: 'inherit' }}>
      <span style={{ width: 36, height: 36, borderRadius: '50%', background: C.tealMist, color: C.tealDeep, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={w.kind === 'Cardio' && w.cardioType ? cardioMeta(w.cardioType).icon : kindIcon(w.kind)} size={18} stroke={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</span>
        <span style={{ display: 'block', fontSize: 12, color: C.ink3, marginTop: 1 }}>{parts.join(' · ')}</span>
      </span>
      <Icon name="pencil" size={13} color={C.ink4} stroke={2} style={{ opacity: 0.5 }} />
    </button>
  );
}

/* ── Live workout ("active session") ──────────────────────────────────────────
   A full-screen experience (not a modal). Press "Starta pass" → choose Styrka,
   Cardio, or a saved mall → log live with a running timer → "Avsluta pass".
   The in-progress session is mirrored to localStorage so it survives reloads. */

// A 1-second ticker used to drive elapsed/rest timers without re-rendering the
// whole tree off a global interval.
function useTicker(active) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => force(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [active]);
}

// One exercise inside a live strength session: previous-column reference, set
// rows with kg/reps and a done checkmark, add/remove sets, a per-exercise note.
function ActiveExerciseCard({ ex, prev, onChange, onRemove, onSetDone }) {
  const C = useC();
  const sets = ex.sets || [];
  const prevSets = (prev && prev.sets) || [];
  const setRow = (i, k, v) => onChange({ ...ex, sets: sets.map((s, j) => j === i ? { ...s, [k]: v } : s) });
  const addSet = () => {
    const last = sets[sets.length - 1];
    onChange({ ...ex, sets: [...sets, { reps: last ? last.reps : '', weight: last ? last.weight : '', done: false }] });
  };
  const delSet = i => onChange({ ...ex, sets: sets.filter((_, j) => j !== i) });
  const toggleDone = i => {
    const willDo = !sets[i].done;
    // Auto-fill empty fields from the previous session when checking a set off.
    const p = prevSets[i] || {};
    const filled = { ...sets[i],
      reps: sets[i].reps === '' && p.reps != null ? String(p.reps) : sets[i].reps,
      weight: sets[i].weight === '' && p.weight != null ? String(p.weight) : sets[i].weight,
      done: willDo };
    onChange({ ...ex, sets: sets.map((s, j) => j === i ? filled : s) });
    if (willDo) onSetDone();
  };

  return (
    <div style={{ border: `0.5px solid ${C.line}`, borderRadius: 12, background: C.bgSoft, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 13px 9px' }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</span>
        <button type="button" onClick={onRemove} title="Ta bort övning"
          style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: C.ink4, cursor: 'pointer', padding: 3 }}>
          <Icon name="x" size={16} stroke={2.25} />
        </button>
      </div>
      <input className="t3-input" value={ex.note || ''} placeholder="Anteckning (valfritt)…"
        onChange={e => onChange({ ...ex, note: e.target.value })}
        style={{ margin: '0 13px 10px', width: 'calc(100% - 26px)', fontSize: 12.5, padding: '7px 10px', background: 'transparent', border: `0.5px solid ${C.line}` }} />

      <div style={{ display: 'grid', gridTemplateColumns: '26px 1fr 1fr 1fr 40px', gap: 6, alignItems: 'center', padding: '0 13px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.ink4 }}>
        <span style={{ textAlign: 'center' }}>Set</span>
        <span style={{ textAlign: 'center' }}>Tidigare</span>
        <span style={{ textAlign: 'center' }}>Kg</span>
        <span style={{ textAlign: 'center' }}>Reps</span>
        <span />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sets.map((s, i) => {
          const p = prevSets[i];
          const prevLabel = p ? `${p.weight || 0}×${p.reps || 0}` : '–';
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '26px 1fr 1fr 1fr 40px', gap: 6, alignItems: 'center', padding: '5px 13px', background: s.done ? (C.tealMist) : 'transparent' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.ink3, textAlign: 'center' }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: C.ink4, textAlign: 'center', fontWeight: 600 }}>{prevLabel}</span>
              <input className="t3-input" type="number" inputMode="decimal" min="0" value={s.weight}
                placeholder={p ? String(p.weight ?? '') : '0'}
                onChange={e => setRow(i, 'weight', e.target.value)}
                style={{ textAlign: 'center', padding: '7px 4px', fontWeight: 700 }} />
              <input className="t3-input" type="number" inputMode="numeric" min="0" value={s.reps}
                placeholder={p ? String(p.reps ?? '') : '0'}
                onChange={e => setRow(i, 'reps', e.target.value)}
                style={{ textAlign: 'center', padding: '7px 4px', fontWeight: 700 }} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <button type="button" onClick={() => toggleDone(i)} title={s.done ? 'Ångra' : 'Klar'}
                  style={{ display: 'inline-flex', border: 'none', background: s.done ? C.teal : 'transparent', borderRadius: 7, color: s.done ? '#fff' : C.ink4, cursor: 'pointer', padding: 4, transition: 'background 140ms' }}>
                  <Icon name="check" size={16} stroke={2.75} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '8px 13px 12px' }}>
        <button type="button" className="t3-tag" onClick={addSet} style={{ gap: 5 }}>
          <Icon name="plus" size={13} stroke={2.5} /> Set
        </button>
        {sets.length > 0 && (
          <button type="button" className="t3-tag" onClick={() => delSet(sets.length - 1)} style={{ gap: 5 }}>
            <Icon name="minus" size={13} stroke={2.5} /> Ta bort set
          </button>
        )}
      </div>
    </div>
  );
}

// Bottom rest-timer banner — counts down after a set is completed.
function RestBar({ remaining, total, onAdd, onSkip }) {
  const C = useC();
  const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 76, padding: '0 16px', zIndex: 5 }}>
      <div style={{ background: C.ink, color: C.bg, borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 28px rgba(0,0,0,0.28)' }}>
        <Icon name="clock" size={17} stroke={2.25} />
        <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums', minWidth: 52 }}>{fmtClock(remaining * 1000)}</span>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: C.bg, transition: 'width 1s linear' }} />
        </div>
        <button type="button" onClick={onAdd} style={{ border: 'none', background: 'transparent', color: 'inherit', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>+30s</button>
        <button type="button" onClick={onSkip} style={{ border: 'none', background: 'transparent', color: 'inherit', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', opacity: 0.8 }}>Hoppa över</button>
      </div>
    </div>
  );
}

// The full-screen chooser shown when a session is starting (mode not yet set).
function StartChooser({ routines, onPickStrength, onPickCardio, onPickRoutine, onDeleteRoutine, onClose }) {
  const C = useC();
  const [showCardio, setShowCardio] = useState(false);
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {!showCardio ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button type="button" onClick={onPickStrength} className="t3-start-card">
              <Icon name="dumbbell" size={30} stroke={1.75} />
              <span style={{ fontSize: 16, fontWeight: 800 }}>Styrka</span>
              <span style={{ fontSize: 12, color: C.ink3 }}>Övningar · set · reps · vikt</span>
            </button>
            <button type="button" onClick={() => setShowCardio(true)} className="t3-start-card">
              <Icon name="activity" size={30} stroke={1.75} />
              <span style={{ fontSize: 16, fontWeight: 800 }}>Cardio</span>
              <span style={{ fontSize: 12, color: C.ink3 }}>Löpning · cykel · rodd · m.m.</span>
            </button>
          </div>

          <div>
            <Eyebrow style={{ marginBottom: 10 }}>Mina mallar</Eyebrow>
            {routines.length === 0 ? (
              <p style={{ fontSize: 12.5, color: C.ink3, margin: 0 }}>
                Inga mallar än. Bygg ett styrkepass och tryck <b>Spara som mall</b> för att återanvända det.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {routines.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: `0.5px solid ${C.line}`, borderRadius: 10, padding: '10px 12px', background: C.bgSoft }}>
                    <button type="button" onClick={() => onPickRoutine(r)} style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', color: C.ink }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>{r.name}</span>
                      <span style={{ display: 'block', fontSize: 12, color: C.ink3, marginTop: 1 }}>
                        {(r.exercises || []).map(e => e.name).slice(0, 3).join(' · ')}{(r.exercises || []).length > 3 ? ' …' : ''}
                      </span>
                    </button>
                    <button type="button" onClick={() => onDeleteRoutine(r.id)} title="Ta bort mall"
                      style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: C.ink4, cursor: 'pointer', padding: 4 }}>
                      <Icon name="trash-2" size={15} stroke={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <button type="button" onClick={() => setShowCardio(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', color: C.ink3, cursor: 'pointer', font: 'inherit', fontSize: 13, fontWeight: 600, marginBottom: 12, padding: 0 }}>
            <Icon name="chevron-left" size={16} stroke={2} /> Tillbaka
          </button>
          <Eyebrow style={{ marginBottom: 10 }}>Välj cardioform</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {CARDIO_TYPES.map(c => (
              <button type="button" key={c.id} onClick={() => onPickCardio(c.id)} className="t3-start-card" style={{ padding: '16px 12px' }}>
                <Icon name={c.icon} size={24} stroke={1.75} />
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveWorkout({ session, days, routines, onUpdate, onFinish, onCancel, onSaveTemplate, onDeleteRoutine }) {
  const C = useC();
  const s = session;
  const started = !!s.startedAt;
  useTicker(started); // re-render every second while a session is running

  // Exercise picker (strength) — reuse the bundled library search.
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState('');
  const results = query.trim().length >= 2 ? searchExercises(query) : [];

  // Rest timer (not persisted — purely a live aid).
  const [rest, setRest] = useState(null); // { endsAt, total }
  useEffect(() => {
    if (!rest) return;
    const t = setInterval(() => {
      if (Date.now() >= rest.endsAt) setRest(null);
      else setRest(r => ({ ...r })); // tick
    }, 250);
    return () => clearInterval(t);
  }, [rest]);
  const restRemaining = rest ? Math.ceil((rest.endsAt - Date.now()) / 1000) : 0;
  const startRest = (secs = 90) => setRest({ endsAt: Date.now() + secs * 1000, total: secs });

  const elapsedMs = started ? Date.now() - s.startedAt : 0;

  // ── Mutators (each persists via onUpdate) ──────────────────────────────────
  const beginStrength = (exercises = []) =>
    onUpdate({ ...s, mode: 'strength', startedAt: Date.now(), exercises });
  const beginCardio = (cardioType) =>
    onUpdate({ ...s, mode: 'cardio', startedAt: Date.now(), cardioType, distanceKm: '', kcal: '', avgHr: '' });
  const beginFromRoutine = (r) =>
    beginStrength((r.exercises || []).map(e => ({
      id: uid('ex'), exId: e.exId ?? null, name: e.name,
      sets: (e.sets && e.sets.length ? e.sets : [{ reps: '', weight: '' }]).map(x => ({ reps: x.reps ?? '', weight: x.weight ?? '', done: false })),
    })));

  const addExercise = (name, exId) => {
    const prev = lastExercisePerformance(days, name);
    const seed = prev ? prev.sets.map(p => ({ reps: '', weight: '', done: false })) : [{ reps: '', weight: '', done: false }];
    onUpdate({ ...s, exercises: [...(s.exercises || []), { id: uid('ex'), exId: exId ?? null, name, sets: seed }] });
    setPicking(false); setQuery('');
  };
  const updateExercise = (id, next) => onUpdate({ ...s, exercises: s.exercises.map(e => e.id === id ? next : e) });
  const removeExercise = id => onUpdate({ ...s, exercises: s.exercises.filter(e => e.id !== id) });
  const setCardioField = (k, v) => onUpdate({ ...s, [k]: v });

  // ── Finish: build a workout object and hand back to the day ────────────────
  const finish = () => {
    const durationMin = Math.max(1, Math.round(elapsedMs / 60000));
    if (s.mode === 'cardio') {
      const meta = cardioMeta(s.cardioType);
      onFinish({
        id: uid('w'), kind: 'Cardio', name: meta.label, cardioType: s.cardioType,
        durationMin, kcal: Math.round(parseFloat(s.kcal) || 0),
        distanceKm: parseFloat(s.distanceKm) || 0, avgHr: Math.round(parseFloat(s.avgHr) || 0) || null,
        tags: [], exercises: [],
      });
      return;
    }
    const exercises = (s.exercises || []).map(e => ({
      id: e.id, exId: e.exId, name: e.name, note: e.note || '',
      sets: (e.sets || [])
        .filter(x => x.done || Number(x.reps) > 0 || Number(x.weight) > 0)
        .map(x => ({ reps: Math.round(Number(x.reps) || 0), weight: Number(x.weight) || 0 })),
    })).filter(e => e.sets.length > 0);
    onFinish({
      id: uid('w'), kind: 'Strength', name: s.name || 'Styrkepass',
      durationMin, kcal: Math.round(parseFloat(s.kcal) || 0), tags: [], exercises,
    });
  };

  const exTotal = (s.exercises || []).reduce((a, e) => a + setsVolume(e.sets), 0);
  const doneSets = (s.exercises || []).reduce((a, e) => a + (e.sets || []).filter(x => x.done).length, 0);
  const canFinish = s.mode === 'cardio' ? true : (s.exercises || []).some(e => (e.sets || []).some(x => x.done || Number(x.reps) > 0));

  const headerTitle = !started ? 'Starta pass'
    : s.mode === 'cardio' ? cardioMeta(s.cardioType).label
    : (s.name || 'Styrkepass');

  return (
    <div className="t3-active">
      <div className="t3-active-head">
        <button type="button" onClick={onCancel} title={started ? 'Avbryt pass' : 'Stäng'}
          style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: C.ink2, cursor: 'pointer', padding: 6 }}>
          <Icon name="x" size={20} stroke={2} />
        </button>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{headerTitle}</div>
          {started && (
            <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>
              <Icon name="clock" size={12} stroke={2.5} style={{ verticalAlign: '-1px', marginRight: 4 }} />{fmtClock(elapsedMs)}
            </div>
          )}
        </div>
        {started ? (
          <button type="button" onClick={finish} disabled={!canFinish}
            className="t3-btn t3-btn-primary t3-btn-sm" style={{ opacity: canFinish ? 1 : 0.5 }}>
            Avsluta
          </button>
        ) : <span style={{ width: 32 }} />}
      </div>

      {!started && (
        <StartChooser routines={routines}
          onPickStrength={() => beginStrength([])}
          onPickCardio={beginCardio}
          onPickRoutine={beginFromRoutine}
          onDeleteRoutine={onDeleteRoutine}
          onClose={onCancel} />
      )}

      {started && s.mode === 'cardio' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: C.tealMist, color: C.tealDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={cardioMeta(s.cardioType).icon} size={40} stroke={1.6} />
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.03em', color: C.ink, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{fmtClock(elapsedMs)}</div>
          <Eyebrow>Aktiv tid · räknar uppåt</Eyebrow>
          <div style={{ width: '100%', maxWidth: 360, display: 'grid', gridTemplateColumns: cardioMeta(s.cardioType).distance ? '1fr 1fr' : '1fr', gap: 14, marginTop: 4 }}>
            {cardioMeta(s.cardioType).distance && (
              <Field label="Distans (km)">
                <TextInput type="number" inputMode="decimal" min="0" value={s.distanceKm} placeholder="0" onChange={e => setCardioField('distanceKm', e.target.value)} />
              </Field>
            )}
            <Field label="Kalorier (valfritt)">
              <TextInput type="number" inputMode="numeric" min="0" value={s.kcal} placeholder="0" onChange={e => setCardioField('kcal', e.target.value)} />
            </Field>
            <Field label="Snittpuls (valfritt)" span={cardioMeta(s.cardioType).distance ? 2 : 1}>
              <TextInput type="number" inputMode="numeric" min="0" value={s.avgHr} placeholder="bpm" onChange={e => setCardioField('avgHr', e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      {started && s.mode === 'strength' && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 96px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="t3-input" value={s.name || ''} placeholder="Namnge passet (valfritt)…"
              onChange={e => onUpdate({ ...s, name: e.target.value })}
              style={{ fontWeight: 700, fontSize: 15 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: C.ink3, padding: '0 2px' }}>
              <span>{doneSets} set klara</span>
              {exTotal > 0 && <span>Volym {grp(exTotal)} kg</span>}
            </div>

            {(s.exercises || []).map(ex => (
              <ActiveExerciseCard key={ex.id} ex={ex}
                prev={lastExercisePerformance(days, ex.name)}
                onChange={next => updateExercise(ex.id, next)}
                onRemove={() => removeExercise(ex.id)}
                onSetDone={() => startRest(90)} />
            ))}

            {!picking ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                <Button variant="dark" icon="plus" onClick={() => { setPicking(true); setQuery(''); }} style={{ flex: 1 }}>Lägg till övning</Button>
                {(s.exercises || []).length > 0 && (
                  <Button variant="secondary" icon="bookmark" onClick={() => onSaveTemplate(s)} title="Spara som mall">Spara som mall</Button>
                )}
              </div>
            ) : (
              <div className="t3-search-wrap">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
                    <Icon name="search" size={15} stroke={2} />
                  </span>
                  <TextInput value={query} autoFocus placeholder="Sök övning…" style={{ paddingLeft: 34 }} onChange={e => setQuery(e.target.value)} />
                  <button type="button" onClick={() => { setPicking(false); setQuery(''); }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: C.ink4, cursor: 'pointer', padding: 4 }}>
                    <Icon name="x" size={16} stroke={2} />
                  </button>
                </div>
                {query.trim().length >= 2 && (
                  <div className="t3-search-results" style={{ position: 'static', marginTop: 6, maxHeight: 260 }}>
                    {results.length === 0 ? (
                      <button type="button" className="t3-search-item" onClick={() => addExercise(query.trim(), null)}>
                        <span className="t3-search-name">Lägg till "{query.trim()}"</span>
                        <span className="t3-search-meta">Egen övning</span>
                      </button>
                    ) : results.map(r => (
                      <button type="button" key={r.id} className="t3-search-item" onClick={() => addExercise(r.name, r.id)}>
                        <span className="t3-search-name">{r.name}</span>
                        <span className="t3-search-meta">{r.category}{r.muscles ? ` · ${r.muscles}` : ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {rest && restRemaining > 0 && (
            <RestBar remaining={restRemaining} total={rest.total}
              onAdd={() => setRest(r => ({ ...r, endsAt: r.endsAt + 30000, total: r.total + 30 }))}
              onSkip={() => setRest(null)} />
          )}
        </>
      )}
    </div>
  );
}

/* ── Routines / custom workouts ("Mina pass") ─────────────────────────────────
   Build a strength workout once (name + exercises + target sets), reuse it any
   day without re-entering it — the Hevy/Strong "Routines" concept. */

function RoutineEditor({ initial, onSave, onCancel }) {
  const C = useC();
  const [name, setName] = useState(initial ? initial.name : '');
  const [exercises, setExercises] = useState(() =>
    (initial && initial.exercises ? initial.exercises : []).map(e => ({
      id: uid('ex'), exId: e.exId ?? null, name: e.name,
      sets: (e.sets && e.sets.length ? e.sets : [{ reps: '', weight: '' }]).map(s => ({ reps: s.reps ?? '', weight: s.weight ?? '' })),
    })));
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState('');
  const [tried, setTried] = useState(false);
  const results = query.trim().length >= 2 ? searchExercises(query) : [];

  const addExercise = (nm, exId) => {
    setExercises(xs => [...xs, { id: uid('ex'), exId: exId ?? null, name: nm, sets: [{ reps: '', weight: '' }] }]);
    setPicking(false); setQuery('');
  };
  const updateExercise = (id, next) => setExercises(xs => xs.map(e => e.id === id ? next : e));
  const removeExercise = id => setExercises(xs => xs.filter(e => e.id !== id));

  const nameBad = !name.trim();
  const noExercises = exercises.length === 0;
  const save = () => {
    setTried(true);
    if (nameBad || noExercises) return;
    onSave({
      id: initial ? initial.id : uid('rt'),
      name: name.trim(),
      exercises: exercises.map(e => ({
        exId: e.exId, name: e.name,
        sets: e.sets.map(s => ({ reps: Number(s.reps) || 0, weight: Number(s.weight) || 0 })),
      })),
    });
  };

  return (
    <div className="t3-active">
      <div className="t3-active-head">
        <button type="button" onClick={onCancel} title="Avbryt"
          style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: C.ink2, cursor: 'pointer', padding: 6 }}>
          <Icon name="x" size={20} stroke={2} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.ink }}>
          {initial ? 'Redigera pass' : 'Nytt pass'}
        </div>
        <button type="button" onClick={save} className="t3-btn t3-btn-primary t3-btn-sm">Spara</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Passnamn">
          <TextInput value={name} placeholder="ex. Push A · bröst, axlar, triceps" invalid={tried && nameBad} onChange={e => setName(e.target.value)} autoFocus />
        </Field>

        <span className="t3-label">Övningar med målvärden</span>
        {noExercises && (
          <p style={{ fontSize: 12.5, color: C.ink3, margin: '0 0 2px' }}>
            Lägg till övningar och ange måltal för set (reps × vikt). När du sedan startar passet är allt förifyllt.
          </p>
        )}
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} ex={ex} onChange={next => updateExercise(ex.id, next)} onRemove={() => removeExercise(ex.id)} />
        ))}
        {tried && noExercises && (
          <span style={{ fontSize: 12, color: '#e05c5c', fontWeight: 600 }}>Lägg till minst en övning.</span>
        )}

        {!picking ? (
          <Button variant="dark" icon="plus" onClick={() => { setPicking(true); setQuery(''); }}>Lägg till övning</Button>
        ) : (
          <div className="t3-search-wrap">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
                <Icon name="search" size={15} stroke={2} />
              </span>
              <TextInput value={query} autoFocus placeholder="Sök övning…" style={{ paddingLeft: 34 }} onChange={e => setQuery(e.target.value)} />
              <button type="button" onClick={() => { setPicking(false); setQuery(''); }}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: C.ink4, cursor: 'pointer', padding: 4 }}>
                <Icon name="x" size={16} stroke={2} />
              </button>
            </div>
            {query.trim().length >= 2 && (
              <div className="t3-search-results" style={{ position: 'static', marginTop: 6, maxHeight: 260 }}>
                {results.length === 0 ? (
                  <button type="button" className="t3-search-item" onClick={() => addExercise(query.trim(), null)}>
                    <span className="t3-search-name">Lägg till "{query.trim()}"</span>
                    <span className="t3-search-meta">Egen övning</span>
                  </button>
                ) : results.map(r => (
                  <button type="button" key={r.id} className="t3-search-item" onClick={() => addExercise(r.name, r.id)}>
                    <span className="t3-search-name">{r.name}</span>
                    <span className="t3-search-meta">{r.category}{r.muscles ? ` · ${r.muscles}` : ''}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RoutineManager({ routines, onSave, onDelete, onStart, onClose }) {
  const C = useC();
  const [editing, setEditing] = useState(null); // null | 'new' | routine

  if (editing) {
    return (
      <RoutineEditor initial={editing === 'new' ? null : editing}
        onSave={r => { onSave(r); setEditing(null); }}
        onCancel={() => setEditing(null)} />
    );
  }

  return (
    <div className="t3-active">
      <div className="t3-active-head">
        <button type="button" onClick={onClose} title="Stäng"
          style={{ display: 'inline-flex', border: 'none', background: 'transparent', color: C.ink2, cursor: 'pointer', padding: 6 }}>
          <Icon name="x" size={20} stroke={2} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.ink }}>Mina pass</div>
        <span style={{ width: 32 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="dark" icon="plus" onClick={() => setEditing('new')}>Skapa nytt pass</Button>

        {routines.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '48px 0', color: C.ink3 }}>
            <Icon name="bookmark" size={28} color={C.ink4} stroke={1.5} />
            <span style={{ fontSize: 13, textAlign: 'center', maxWidth: 240 }}>
              Inga sparade pass än. Skapa ett så slipper du fylla i samma övningar varje gång.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {routines.map(r => {
              const exs = r.exercises || [];
              const sets = exs.reduce((a, e) => a + (e.sets ? e.sets.length : 0), 0);
              return (
                <div key={r.id} style={{ border: `0.5px solid ${C.line}`, borderRadius: 12, background: C.bgSoft, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px 10px' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{exs.length} övn · {sets} set</div>
                    {exs.length > 0 && (
                      <div style={{ fontSize: 12, color: C.ink3, marginTop: 6, lineHeight: 1.5 }}>
                        {exs.map(e => e.name).join(' · ')}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', borderTop: `0.5px solid ${C.line}` }}>
                    <button type="button" onClick={() => onStart(r)} className="t3-routine-act" style={{ color: C.teal, fontWeight: 800 }}>
                      <Icon name="flame" size={15} stroke={2.25} /> Starta
                    </button>
                    <button type="button" onClick={() => setEditing(r)} className="t3-routine-act" style={{ borderLeft: `0.5px solid ${C.line}` }}>
                      <Icon name="pencil" size={15} stroke={2} /> Redigera
                    </button>
                    <button type="button" onClick={() => { if (window.confirm(`Ta bort "${r.name}"?`)) onDelete(r.id); }} className="t3-routine-act" style={{ borderLeft: `0.5px solid ${C.line}`, color: C.ink3 }}>
                      <Icon name="trash-2" size={15} stroke={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TrainingPanel({ day, days, selectedKey, onAddWorkout, onEditWorkout, onStartSession, onManageRoutines }) {
  const C = useC();
  const workouts = day.workouts;
  const totalMin = workouts.reduce((a,w) => a + (w.durationMin||0), 0);
  const totalKcal = workouts.reduce((a,w) => a + (w.kcal||0), 0);
  const totalVol = workouts.reduce((a,w) => a + workoutVolume(w), 0);
  const sel = parseKey(selectedKey);
  const dow = (sel.getDay() + 6) % 7;
  const monKey = addDays(selectedKey, -dow);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const k = addDays(monKey, i);
    const dd = days[k];
    const sessions = dd ? dd.workouts.length : 0;
    const realMin = dd ? dd.workouts.reduce((a,w) => a + (w.durationMin||0), 0) : 0;
    // Strength sessions often carry no duration — keep their bar visible with a
    // nominal load so the week chart still reflects that a session happened.
    const mins = realMin || (sessions > 0 ? 30 : 0);
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
          totalVol > 0
            ? { v: grp(totalVol), u: 'kg', l: 'volym' }
            : { v: grp(totalKcal), u: 'kcal', l: 'förbränt' },
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

      <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="dark" icon="flame" onClick={onStartSession}>Starta pass</Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="bookmark" onClick={onManageRoutines} style={{ flex: 1 }} title="Skapa och hantera färdiga pass">Mina pass</Button>
          <Button variant="secondary" icon="plus" onClick={onAddWorkout} style={{ flex: 1 }} title="Logga ett tidigare pass manuellt">Manuellt</Button>
        </div>
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

function HistoryPanel({ days, goals, selectedKey, onSelectDay, units, weekStart, mode = 'both' }) {
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
      {(mode === 'both' || mode === 'stats') && (
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
      )}

      {mode === 'both' && <div style={{ height: '0.5px', background: C.line, margin: '16px 0 12px' }} />}

      {(mode === 'both' || mode === 'calendar') && (
        <>
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
      )}
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

function Logo() {
  return (
    <a href="../../" className="t3-logo" aria-label="Gustav Mattsson — AI Labb">
      <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true">
        <defs>
          <style>{`
            .t3-logo-cls-1 { font-size: 193.17px; }
            .t3-logo-cls-1, .t3-logo-cls-2 { font-family: Montserrat-Bold, Montserrat; font-weight: 700; opacity: .91; }
            .t3-logo-cls-2 { font-size: 189.12px; }
          `}</style>
        </defs>
        <path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/>
        <path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/>
        <path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/>
        <text className="t3-logo-cls-1" transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text>
        <text className="t3-logo-cls-2" transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text>
      </svg>
    </a>
  );
}

function TopNav({ theme, onToggleTheme, uiTheme, onToggleUiTheme, userName, onLogout }) {
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    if (!userOpen) return;
    const close = () => setUserOpen(false);
    const id = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', close); };
  }, [userOpen]);

  return (
    <nav className="t3-top-nav">
      <Logo />
      <div className="t3-nav-right">
        <ul className="t3-nav-menu">
          <li><a href="../../">Hem</a></li>
          <li className="t3-has-dd">
            <a href="#" aria-haspopup="true">
              Appar <span className="t3-nav-chev" aria-hidden="true">▾</span>
            </a>
            <ul className="t3-nav-dd" role="menu">
              <li role="none"><a href="../todo/" role="menuitem">Todo</a></li>
              <li role="none"><a href="../kampanj/" role="menuitem">Kampanjplanerare</a></li>
              <li role="none"><a href="../seo-audit/" role="menuitem">SEO & GEO-granskning</a></li>
              <li role="none"><a href="../trackr/" role="menuitem" className="active">Track3r</a></li>
            </ul>
          </li>
        </ul>
        <button className="t3-theme-btn" onClick={onToggleTheme} aria-label="Byt tema">
          {theme === 'dark'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
        <button
          className="t3-theme-btn"
          onClick={onToggleUiTheme}
          title={uiTheme === 'glass' ? 'Byt till Shadow-tema' : 'Byt till Glass-tema'}
          aria-label={uiTheme === 'glass' ? 'Byt till Shadow-tema' : 'Byt till Glass-tema'}
        >
          {uiTheme === 'glass' ? '◼' : '◻'}
        </button>
        <div className="t3-user-wrap" onClick={(e) => e.stopPropagation()}>
          <button className="t3-user-chip2" onClick={() => setUserOpen(!userOpen)}>
            <span className="t3-avatar-sm">{(userName || '?').slice(0, 2).toUpperCase()}</span>
            <span className="t3-chip-name">{userName}</span>
            <ChevronDown size={12} style={{ transform: userOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
          </button>
          {userOpen && (
            <div className="t3-user-dd2">
              <button onClick={() => { setUserOpen(false); onLogout(); }}>
                <LogOut size={14} />
                Byt användare
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DateBar({ selectedKey, onStep, onToday, onExport, onUpdateGoals }) {
  const C = useC();
  const rel = fmtRelative(selectedKey);
  const d = parseKey(selectedKey);
  const weekday = WD_SHORT[d.getDay()];
  const dateStr = `${d.getDate()} ${MO_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  const isToday = selectedKey === todayKey();

  return (
    <div className="t3-date-bar">
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
      <div className="t3-date-bar-right">
        <Button variant="secondary" size="sm" icon="target" onClick={onUpdateGoals}>Uppdatera mål</Button>
        <Button variant="secondary" size="sm" icon="download" onClick={onExport}>Exportera</Button>
      </div>
    </div>
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

/* ── Bottom nav (mobile only) ─────────────────────────────────────────────── */
const BNAV_TABS = [
  { id: 'food',     icon: 'utensils',  label: 'Mat'      },
  { id: 'training', icon: 'dumbbell',  label: 'Träning'  },
  { id: 'history',  icon: 'activity',  label: 'Historik' },
  { id: 'settings', icon: 'target',    label: 'Mål'      },
];

function BottomNav({ tab, onChange }) {
  return (
    <nav className="t3-bottom-nav" aria-label="Navigering">
      {BNAV_TABS.map(t => (
        <button
          key={t.id}
          className={`t3-bnav-tab${tab === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
          aria-label={t.label}
        >
          <Icon name={t.icon} size={22} stroke={tab === t.id ? 2.25 : 1.75} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── FAB (mobile only) ────────────────────────────────────────────────────── */
function FAB({ tab, onAddMeal, onStartTraining }) {
  if (tab !== 'food' && tab !== 'training') return null;
  return (
    <button
      className="t3-fab"
      onClick={tab === 'food' ? onAddMeal : onStartTraining}
      aria-label={tab === 'food' ? 'Lägg till måltid' : 'Starta träning'}
    >
      <Plus size={24} strokeWidth={2.25} />
    </button>
  );
}

/* ── Settings panel (mobile only) ────────────────────────────────────────── */
function SettingsPanel({ theme, onToggleTheme, onUpdateGoals, onExport, userName, onLogout }) {
  const C = useC();
  return (
    <div className="t3-settings-mobile" style={{ flexDirection: 'column', gap: 0, padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0 16px' }}>
        <div className="t3-avatar">{(userName || '?').slice(0, 2).toUpperCase()}</div>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{userName}</span>
      </div>
      <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 8 }} />
      {[
        { label: theme === 'dark' ? 'Ljust tema' : 'Mörkt tema', icon: theme === 'dark' ? 'sun' : 'moon', action: onToggleTheme },
        { label: 'Uppdatera mål', icon: 'target', action: onUpdateGoals },
        { label: 'Exportera data', icon: 'download', action: onExport },
      ].map(row => (
        <button key={row.label} onClick={row.action}
          style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 4px', background: 'transparent', border: 'none', borderBottom: `1px solid var(--color-border)`, color: 'var(--color-text)', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
          <Icon name={row.icon} size={18} stroke={1.75} color="var(--color-text-muted)" />
          {row.label}
        </button>
      ))}
      <button onClick={onLogout}
        style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 4px', background: 'transparent', border: 'none', color: '#e05c5c', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: 8 }}>
        <Icon name="log-out" size={18} stroke={1.75} />
        Byt användare
      </button>
    </div>
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
  const [uiTheme, setUiTheme] = useState(
    () => localStorage.getItem('trackr_ui_theme') || 'glass'
  );
  const [userName, setUserName] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [selectedKey, setSelectedKey] = useState(todayKey());
  const [tab, setTab] = useState('food'); // 'food' | 'training' | 'history' | 'settings'
  const [waterMap, setWaterMap] = useState({}); // water cups per date key
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [units] = useState('kg');
  const [session, setSession] = useState(null);   // live workout (full-screen)
  const [routines, setRoutines] = useState([]);    // saved strength templates
  const [routineMgr, setRoutineMgr] = useState(false); // "Mina pass" manager open

  const C = mkC(theme === 'dark');
  const store = useStore(profileId);
  const { state, loading } = store;
  const day = state.days[selectedKey] || emptyDay();
  const water = waterMap[selectedKey] ?? 0;
  const setWater = n => setWaterMap(m => ({ ...m, [selectedKey]: n }));
  const panelTab = (tab === 'food' || tab === 'training') ? tab : 'food';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-theme', uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    if (uiTheme === 'glass') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [uiTheme]);

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

  const toggleUiTheme = () => {
    const next = uiTheme === 'glass' ? 'shadow' : 'glass';
    setUiTheme(next);
    localStorage.setItem('trackr_ui_theme', next);
    document.documentElement.setAttribute('data-ui-theme', next);
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

  // ── Live workout sessions ──────────────────────────────────────────────────
  useEffect(() => {
    if (!profileId) return;
    setRoutines(loadRoutines(profileId));
    setSession(loadActiveSession(profileId));
  }, [profileId]);

  const startSession = () => { const sess = { profileId, mode: null, startedAt: null }; setSession(sess); saveActiveSession(sess); };
  const updateSession = next => { setSession(next); saveActiveSession(next); };
  const cancelSession = () => {
    if (session?.startedAt && !window.confirm('Avbryt passet? Det du loggat sparas inte.')) return;
    clearActiveSession(); setSession(null);
  };
  const finishSession = workout => {
    const key = todayKey();
    store.addWorkout(key, workout);
    clearActiveSession(); setSession(null);
    setSelectedKey(key); setTab('training');
    flash(`${workout.name} loggat`, 'check');
  };
  const saveTemplate = sess => {
    const name = (sess.name || '').trim();
    if (!name) { flash('Namnge passet först för att spara som mall', 'alert-triangle'); return; }
    const routine = {
      id: uid('rt'), name,
      exercises: (sess.exercises || []).map(e => ({
        exId: e.exId, name: e.name,
        sets: (e.sets || []).map(x => ({ reps: Number(x.reps) || 0, weight: Number(x.weight) || 0 })),
      })),
    };
    const next = [...routines.filter(r => r.name.toLowerCase() !== name.toLowerCase()), routine];
    setRoutines(next); saveRoutines(profileId, next);
    flash('Sparad som mall', 'bookmark');
  };
  const deleteRoutine = id => { const next = routines.filter(r => r.id !== id); setRoutines(next); saveRoutines(profileId, next); };
  // Create/update a routine from the "Mina pass" editor.
  const upsertRoutine = routine => {
    const next = [...routines.filter(r => r.id !== routine.id), routine];
    setRoutines(next); saveRoutines(profileId, next);
    flash('Pass sparat', 'bookmark');
  };
  // Start a live session pre-filled from a saved routine.
  const startFromRoutine = r => {
    const sess = {
      profileId, mode: 'strength', startedAt: Date.now(), name: r.name,
      exercises: (r.exercises || []).map(e => ({
        id: uid('ex'), exId: e.exId ?? null, name: e.name,
        sets: (e.sets && e.sets.length ? e.sets : [{ reps: '', weight: '' }]).map(x => ({ reps: x.reps ?? '', weight: x.weight ?? '', done: false })),
      })),
    };
    setRoutineMgr(false); setSession(sess); saveActiveSession(sess);
  };

  const stepDay = n => {
    const next = addDays(selectedKey, n);
    if (parseKey(next) <= parseKey(todayKey())) setSelectedKey(next);
  };

  if (!authReady || loading) {
    return (
      <CC.Provider value={C}>
        <div className="t3-root">
          <LoadingScreen />
        </div>
      </CC.Provider>
    );
  }

  const openGoals = () => setModal({ type: 'goals' });
  const openExport = () => setModal({ type: 'export' });

  return (
    <CC.Provider value={C}>
      <div className="t3-root">
        <div className="t3-bento-header">
          <TopNav theme={theme} onToggleTheme={toggleTheme} uiTheme={uiTheme} onToggleUiTheme={toggleUiTheme} userName={userName} onLogout={logout} />
          <DateBar selectedKey={selectedKey} onStep={stepDay} onToday={() => setSelectedKey(todayKey())}
            onExport={openExport} onUpdateGoals={openGoals} />
        </div>

        <div className="t3-bento" data-ui-theme={uiTheme}>
          <div className="t3-m t3-m-summary">
            <div className="t3-m-label">Kalorier idag</div>
            <Summary day={day} goals={state.goals} selectedKey={selectedKey} days={state.days} units={units} store={store} />
          </div>

          <div className="t3-m t3-m-meals">
            <div className="t3-m-label">Mat</div>
            <FoodPanel day={day} goals={state.goals} onAddMeal={() => setModal({ type: 'meal', data: null })} onEditMeal={m => setModal({ type: 'meal', data: m })} onCopyYesterday={copyYesterday} yesterdayCount={yesterdayMeals.length} />
          </div>

          <div className="t3-m t3-m-water">
            <div className="t3-m-label">Vatten</div>
            <WaterRow water={water} onChange={setWater} />
          </div>

          <div className="t3-m t3-m-train">
            <div className="t3-m-label">Träning</div>
            <TrainingPanel day={day} days={state.days} selectedKey={selectedKey} onStartSession={startSession} onManageRoutines={() => setRoutineMgr(true)} onAddWorkout={() => setModal({ type: 'workout', data: null })} onEditWorkout={w => setModal({ type: 'workout', data: w })} />
          </div>

          <div className="t3-m t3-m-stats">
            <div className="t3-m-label">Trender · 30 dagar</div>
            <HistoryPanel days={state.days} goals={state.goals} selectedKey={selectedKey}
              onSelectDay={setSelectedKey} units={units} weekStart="mon" mode="stats" />
          </div>

          <div className="t3-m t3-m-calendar">
            <div className="t3-m-label">Kalender</div>
            <HistoryPanel days={state.days} goals={state.goals} selectedKey={selectedKey}
              onSelectDay={setSelectedKey} units={units} weekStart="mon" mode="calendar" />
          </div>
        </div>

        <BottomNav tab={tab} onChange={t => {
          setTab(t);
          if (t === 'food' || t === 'training') { /* panelTab syncs automatically */ }
        }} />

        <FAB tab={tab}
          onAddMeal={() => setModal({ type: 'meal', data: null })}
          onStartTraining={startSession} />

        {!state.goalsSet && (
          <GoalsModal mode="onboard" currentGoals={state.goals} latestWeight={latestLoggedWeight(state.days)}
            onSave={g => { store.setAllGoals(g); flash('Dina mål är satta', 'check'); }}
            onClose={() => store.setAllGoals(state.goals)}
          />
        )}
        {state.goalsSet && modal?.type === 'goals' && (
          <GoalsModal mode="edit" currentGoals={state.goals} latestWeight={latestLoggedWeight(state.days)}
            onSave={g => { store.setAllGoals(g); setModal(null); flash('Dina mål är uppdaterade', 'check'); }}
            onClose={() => setModal(null)}
          />
        )}

        {modal?.type === 'meal' && <MealModal initial={modal.data} recent={recentFoods} favorites={state.favorites} onAddFavorite={f => { store.addFavorite(f); flash('Sparad som favorit', 'star'); }} onRemoveFavorite={store.removeFavorite} onSave={saveMeal} onClose={() => setModal(null)} onDelete={removeMeal} />}
        {modal?.type === 'workout' && <WorkoutModal initial={modal.data} onSave={saveWorkout} onClose={() => setModal(null)} onDelete={removeWorkout} />}
        {modal?.type === 'export' && <ExportModal profileId={profileId} onClose={() => setModal(null)} onDone={() => { setModal(null); flash('Export nedladdad', 'download'); }} />}

        {routineMgr && !session && (
          <RoutineManager routines={routines} onSave={upsertRoutine} onDelete={deleteRoutine}
            onStart={startFromRoutine} onClose={() => setRoutineMgr(false)} />
        )}

        {session && (
          <ActiveWorkout session={session} days={state.days} routines={routines}
            onUpdate={updateSession} onFinish={finishSession} onCancel={cancelSession}
            onSaveTemplate={saveTemplate} onDeleteRoutine={deleteRoutine} />
        )}

        <Toast toast={toast} />
      </div>
    </CC.Provider>
  );
}
