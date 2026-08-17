import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, X, Check, Trash2, ChevronDown, ChevronRight, LogOut, Search, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, EyeOff, Zap, GripVertical, Copy,
  MoreHorizontal, Archive, ArchiveRestore, Flag, CornerDownRight, Palette,
  CalendarDays, Users, Pencil, Inbox
} from 'lucide-react';
import * as db from './db.js';

/* ═══════════════════════════════════════════════════════════
   Konstanter
   ═══════════════════════════════════════════════════════════ */

const SESSION_ID_KEY   = 'ailabb_profile_id';
const SESSION_NAME_KEY = 'ailabb_profile_name';

const STATUSES = [
  { key: 'done',    label: 'Klart',       color: '#2EA45F' },
  { key: 'working', label: 'Pågår',       color: '#D9952D' },
  { key: 'stuck',   label: 'Fastnat',     color: '#E5532B' },
  { key: 'review',  label: 'Granskas',    color: '#38948D' },
  { key: 'todo',    label: 'Ej påbörjad', color: '#707074' },
];
const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]));

const PRIORITIES = [
  { key: 'high',   label: 'Hög',   color: '#7C5CE0' },
  { key: 'medium', label: 'Medel', color: '#4E7FD9' },
  { key: 'low',    label: 'Låg',   color: '#8B96A3' },
];
const PRIORITY_MAP = Object.fromEntries(PRIORITIES.map(p => [p.key, p]));

const GROUP_COLORS = [
  '#3AA59C', '#FF582D', '#E0A93B', '#3BA55D', '#4E7FD9',
  '#7C5CE0', '#E0569E', '#D63B3B', '#3FA7C4', '#8B8B8E',
];

const COLUMNS = [
  { key: 'person',   label: 'Person',    width: 112 },
  { key: 'status',   label: 'Status',    width: 140 },
  { key: 'priority', label: 'Prioritet', width: 112 },
  { key: 'date',     label: 'Datum',     width: 118 },
  { key: 'timeline', label: 'Tidslinje', width: 172 },
  { key: 'group',    label: 'Grupp',     width: 150 },
];

const DEFAULT_AUTOMATIONS = [
  { id: 'a1', type: 'move_on_status',  enabled: false, config: { status: 'done', groupId: '' } },
  { id: 'a2', type: 'overdue_status',  enabled: true,  config: { status: 'stuck' } },
  { id: 'a3', type: 'date_on_done',    enabled: false, config: {} },
  { id: 'a4', type: 'default_status',  enabled: true,  config: { status: 'todo' } },
  { id: 'a5', type: 'collapse_done',   enabled: true,  config: {} },
];

/* ═══════════════════════════════════════════════════════════
   Hjälpare
   ═══════════════════════════════════════════════════════════ */

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const ts  = () => new Date().toISOString();
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '');
};

const fmtRange = (a, b) => {
  if (!a && !b) return '';
  if (a && !b) return fmtDate(a) + ' →';
  if (!a && b) return '→ ' + fmtDate(b);
  return `${fmtDate(a)} – ${fmtDate(b)}`;
};

const isOverdue = (item) =>
  !!item.date && item.status !== 'done' && item.date < todayISO();

const elapsedPct = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start + 'T00:00:00').getTime();
  const e = new Date(end + 'T23:59:59').getTime();
  const now = Date.now();
  if (e <= s) return now >= e ? 100 : 0;
  return Math.max(0, Math.min(100, ((now - s) / (e - s)) * 100));
};

const initials = (name) =>
  (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

const hashColor = (name) => {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return GROUP_COLORS[h % GROUP_COLORS.length];
};

const countByStatus = (items) => {
  const counts = {};
  for (const s of STATUSES) counts[s.key] = 0;
  for (const it of items) counts[it.status] = (counts[it.status] || 0) + 1;
  return counts;
};

const groupTimeline = (items) => {
  let min = null, max = null;
  for (const it of items) {
    const s = it.start || it.date || null;
    const e = it.end || it.date || null;
    if (s && (!min || s < min)) min = s;
    if (e && (!max || e > max)) max = e;
  }
  return { min, max };
};

const newItem = (name, status = 'todo') => ({
  id: uid(), name, status, priority: null, person: null,
  date: null, start: null, end: null, createdAt: ts(), subitems: [],
});

const emptyBoard = () => ({
  v: 1,
  boardTitle: 'Projekttavlan',
  groups: [],
  automations: DEFAULT_AUTOMATIONS,
  hiddenCols: [],
  archived: [],
});

/* ── Konvertering av gamla projects-rader → grupper ───────── */

function legacyToGroups(projects) {
  const flattenChildren = (children) => {
    const out = [];
    for (const c of children || []) {
      out.push({ id: c.id || uid(), name: c.text || '', status: c.done ? 'done' : 'todo', person: null, date: null, createdAt: c.createdAt || ts() });
      for (const g of c.children || []) {
        out.push({ id: g.id || uid(), name: g.text || '', status: g.done ? 'done' : 'todo', person: null, date: null, createdAt: g.createdAt || ts() });
      }
    }
    return out;
  };

  return projects
    .filter(p => p && p.name)
    .map((p, idx) => {
      let items = (Array.isArray(p.todos) ? p.todos : []).map(t => ({
        ...newItem(t.text || '', t.done ? 'done' : 'todo'),
        id: t.id || uid(),
        createdAt: t.createdAt || ts(),
        subitems: flattenChildren(t.children),
      }));

      const notes = Array.isArray(p.notes) ? p.notes : [];

      if (items.length === 0) {
        const main = newItem(p.name, p.checkpoint >= 3 ? 'done' : 'todo');
        main.date = p.deadline || null;
        main.subitems = notes.map(n => ({ id: n.id || uid(), name: n.text || '', status: n.done ? 'done' : 'todo', person: null, date: null, createdAt: n.createdAt || ts() }));
        items = [main];
      } else if (notes.length > 0) {
        items.push(...notes.map(n => ({ ...newItem(n.text || '', n.done ? 'done' : 'todo'), id: n.id || uid(), createdAt: n.createdAt || ts() })));
      }

      return {
        id: 'g_' + (p.id || uid()),
        title: p.name,
        color: GROUP_COLORS[idx % GROUP_COLORS.length],
        collapsed: false,
        items,
      };
    });
}

/* ═══════════════════════════════════════════════════════════
   Primitiver
   ═══════════════════════════════════════════════════════════ */

/* Popover — fixed-positionerad, klampas mot viewport, stängs
   vid klick utanför, Esc eller scroll. */
function Popover({ anchorRef, onClose, children, width = 220, align = 'left' }) {
  const popRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const a = anchorRef.current;
    if (!a) return;
    const r = a.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = align === 'right' ? r.right - width : r.left;
    left = Math.max(8, Math.min(left, vw - width - 8));
    let top = r.bottom + 6;
    setPos({ top, left, flip: false, anchorTop: r.top });
    requestAnimationFrame(() => {
      const el = popRef.current;
      if (!el) return;
      const h = el.offsetHeight;
      if (top + h > vh - 8) {
        setPos({ top: Math.max(8, r.top - h - 6), left, flip: true, anchorTop: r.top });
      }
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onScroll = (e) => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  if (!pos) return null;
  return createPortal(
    <div ref={popRef} className="bd-pop" role="menu"
      style={{ top: pos.top, left: pos.left, width, transformOrigin: pos.flip ? 'bottom left' : 'top left' }}>
      {children}
    </div>,
    document.body
  );
}

function Avatar({ name, size = 26 }) {
  if (!name) return null;
  const c = hashColor(name);
  return (
    <span className="bd-avatar" title={name}
      style={{ width: size, height: size, fontSize: size * 0.42, background: `linear-gradient(135deg, ${c}, ${c}CC)` }}>
      {initials(name)}
    </span>
  );
}

/* Inline-redigering av text */
function EditInput({ value, onCommit, onCancel, className = '', placeholder = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(value);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  const commit = () => onCommit(val.trim());
  return (
    <input
      ref={ref} value={val} placeholder={placeholder}
      className={'bd-edit-input ' + className}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') onCancel();
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   Logotyp + sidopanel (samma skal som övriga AI Labb)
   ═══════════════════════════════════════════════════════════ */

const Logo = () => (
  <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true">
    <path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/>
    <path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/>
    <path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/>
    <text style={{ fontSize: '193.17px', fontFamily: 'Montserrat-Bold, Montserrat', fontWeight: 700, opacity: 0.91 }} transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text>
    <text style={{ fontSize: '189.12px', fontFamily: 'Montserrat-Bold, Montserrat', fontWeight: 700, opacity: 0.91 }} transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text>
  </svg>
);

function Sidebar({ activeUser, onSwitch }) {
  const [theme, setTheme]       = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const [userOpen, setUserOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ailabb_theme', next);
    setTheme(next);
  };

  useEffect(() => {
    if (!userOpen) return;
    const close = () => setUserOpen(false);
    const id = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', close); };
  }, [userOpen]);

  return (
    <aside className="tl-sidebar" aria-label="Navigering">
      <a href="../../" className="s-logo" title="AI Labb" aria-label="AI Labb"><Logo /></a>
      <div className="s-sep" />
      <a href="../../" className="s-btn" title="Hem" aria-label="Hem">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </a>
      <div className="s-sep" />
      <div className="s-apps">
        <a href="../todo/" className="s-app-item active" title="Todo" aria-current="page">
          <div className="s-bubble ib-todo" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <span className="s-icon-label">Todo</span>
        </a>
        <a href="../kampanj/" className="s-app-item" title="Kampanj">
          <div className="s-bubble ib-kampanj" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <span className="s-icon-label">Kampanj</span>
        </a>
        <a href="../seo-audit/" className="s-app-item" title="SEO">
          <div className="s-bubble ib-seo" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <span className="s-icon-label">SEO</span>
        </a>
        <a href="../brus-fx/" className="s-app-item" title="Brus">
          <div className="s-bubble ib-brus" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M12 12h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg>
          </div>
          <span className="s-icon-label">Brus</span>
        </a>
        <a href="../portfolio/" className="s-app-item" title="Portfolio">
          <div className="s-bubble ib-portfolio" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </div>
          <span className="s-icon-label">Portfolio</span>
        </a>
        <a href="../musictheory/" className="s-app-item" title="Musikteori">
          <div className="s-bubble ib-musik" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <span className="s-icon-label">Musik</span>
        </a>
      </div>
      <div className="s-spacer" />
      <div className="s-sep" />
      <div className="tl-side-user" onClick={(e) => e.stopPropagation()}>
        <button className="s-btn s-user-btn" onClick={() => setUserOpen((o) => !o)} title={activeUser} aria-label="Användare">
          <span className="s-avatar-el">{activeUser ? activeUser[0].toUpperCase() : '?'}</span>
        </button>
        {userOpen && (
          <div className="tl-side-user-pop">
            <div className="tl-side-user-name">{activeUser}</div>
            <button onClick={() => { setUserOpen(false); onSwitch(); }}>
              <LogOut size={14} />
              Byt användare
            </button>
          </div>
        )}
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Byt tema" title="Byt tema">
        {theme === 'dark'
          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        }
      </button>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════
   Celler
   ═══════════════════════════════════════════════════════════ */

function StatusCell({ value, onChange, small = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const s = STATUS_MAP[value] || STATUS_MAP.todo;
  return (
    <>
      <button ref={ref} className={'bd-status' + (small ? ' small' : '')}
        style={{ background: s.color }}
        onClick={() => setOpen(o => !o)} aria-label={'Status: ' + s.label}>
        {s.label}
      </button>
      {open && (
        <Popover anchorRef={ref} onClose={() => setOpen(false)} width={188}>
          <div className="bd-status-grid">
            {STATUSES.map(st => (
              <button key={st.key} className="bd-status-opt" style={{ background: st.color }}
                onClick={() => { onChange(st.key); setOpen(false); }}>
                {st.label}
                {st.key === value && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </Popover>
      )}
    </>
  );
}

function PriorityCell({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const p = value ? PRIORITY_MAP[value] : null;
  return (
    <>
      <button ref={ref} className={'bd-prio' + (p ? '' : ' empty')}
        style={p ? { background: p.color } : undefined}
        onClick={() => setOpen(o => !o)} aria-label={'Prioritet: ' + (p ? p.label : 'ingen')}>
        {p ? <><Flag size={11} strokeWidth={2.5} /> {p.label}</> : <span className="bd-dash">–</span>}
      </button>
      {open && (
        <Popover anchorRef={ref} onClose={() => setOpen(false)} width={172}>
          <div className="bd-status-grid">
            {PRIORITIES.map(pr => (
              <button key={pr.key} className="bd-status-opt" style={{ background: pr.color }}
                onClick={() => { onChange(pr.key); setOpen(false); }}>
                <Flag size={12} strokeWidth={2.5} /> {pr.label}
                {pr.key === value && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
            <button className="bd-pop-item" onClick={() => { onChange(null); setOpen(false); }}>
              <X size={13} /> Rensa
            </button>
          </div>
        </Popover>
      )}
    </>
  );
}

function PersonCell({ value, profiles, onChange, size = 26 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  return (
    <>
      <button ref={ref} className="bd-person" onClick={() => setOpen(o => !o)}
        aria-label={value ? 'Person: ' + value : 'Tilldela person'}>
        {value
          ? <Avatar name={value} size={size} />
          : <span className="bd-person-empty" style={{ width: size, height: size }}>
              <Users size={size * 0.5} strokeWidth={1.75} />
            </span>}
      </button>
      {open && (
        <Popover anchorRef={ref} onClose={() => setOpen(false)} width={200}>
          <div className="bd-pop-list">
            {profiles.map(p => (
              <button key={p.id} className="bd-pop-item" onClick={() => { onChange(p.name); setOpen(false); }}>
                <Avatar name={p.name} size={22} />
                <span className="bd-pop-item-grow">{p.name}</span>
                {p.name === value && <Check size={14} />}
              </button>
            ))}
            {value && (
              <button className="bd-pop-item" onClick={() => { onChange(null); setOpen(false); }}>
                <X size={13} /> Ta bort person
              </button>
            )}
          </div>
        </Popover>
      )}
    </>
  );
}

function DateCell({ value, onChange, overdue = false }) {
  const ref = useRef(null);
  return (
    <label className={'bd-date' + (value ? '' : ' empty') + (overdue ? ' overdue' : '')}>
      <CalendarDays size={13} strokeWidth={1.75} />
      <span>{value ? fmtDate(value) : 'Datum'}</span>
      {overdue && <span className="bd-overdue-dot" title="Försenad" />}
      <input
        ref={ref} type="date" value={value || ''} aria-label="Datum"
        onClick={(e) => { try { e.currentTarget.showPicker?.(); } catch (_) {} }}
        onChange={(e) => onChange(e.target.value || null)}
      />
    </label>
  );
}

function TimelineCell({ start, end, color, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const has = start || end;
  const pct = elapsedPct(start, end);
  return (
    <>
      <button ref={ref} className={'bd-timeline' + (has ? '' : ' empty')}
        style={has ? { background: color } : undefined}
        onClick={() => setOpen(o => !o)} aria-label="Tidslinje">
        {has && <span className="bd-timeline-elapsed" style={{ width: pct + '%' }} />}
        <span className="bd-timeline-label">{has ? fmtRange(start, end) : 'Ange period'}</span>
      </button>
      {open && (
        <Popover anchorRef={ref} onClose={() => setOpen(false)} width={232}>
          <div className="bd-tl-edit">
            <label>Start
              <input type="date" value={start || ''} onChange={(e) => onChange(e.target.value || null, end)} />
            </label>
            <label>Slut
              <input type="date" value={end || ''} onChange={(e) => onChange(start, e.target.value || null)} />
            </label>
            {has && (
              <button className="bd-pop-item" onClick={() => { onChange(null, null); setOpen(false); }}>
                <X size={13} /> Rensa
              </button>
            )}
          </div>
        </Popover>
      )}
    </>
  );
}

/* Gruppcell — visar objektets grupp och flyttar det vid byte */
function GroupCell({ groupId, groups, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const g = groups.find(x => x.id === groupId);
  return (
    <>
      <button ref={ref} className="bd-groupcell" onClick={() => setOpen(o => !o)}
        aria-label={'Grupp: ' + (g ? g.title : 'ingen') + ' – byt för att flytta'}>
        <span className="bd-color-dot" style={{ background: g?.color || 'var(--color-border-strong)' }} />
        <span className="bd-groupcell-label">{g ? g.title : '–'}</span>
        <ChevronDown size={12} strokeWidth={2.5} className="bd-groupcell-caret" />
      </button>
      {open && (
        <Popover anchorRef={ref} onClose={() => setOpen(false)} width={212}>
          <div className="bd-pop-list">
            <div className="bd-pop-label">Flytta till grupp</div>
            {groups.map(gr => (
              <button key={gr.id} className="bd-pop-item"
                onClick={() => { if (gr.id !== groupId) onChange(gr.id); setOpen(false); }}>
                <span className="bd-color-dot" style={{ background: gr.color }} />
                <span className="bd-pop-item-grow">{gr.title}</span>
                {gr.id === groupId && <Check size={14} />}
              </button>
            ))}
          </div>
        </Popover>
      )}
    </>
  );
}

/* Statusfördelning — gruppens "batteri" */
function DistBar({ items }) {
  const total = items.length;
  if (!total) return <div className="bd-dist empty" aria-hidden="true" />;
  const counts = countByStatus(items);
  return (
    <div className="bd-dist" role="img"
      aria-label={STATUSES.filter(s => counts[s.key]).map(s => `${counts[s.key]} ${s.label}`).join(', ')}>
      {STATUSES.filter(s => counts[s.key] > 0).map(s => (
        <span key={s.key} className="bd-dist-seg"
          title={`${s.label}: ${counts[s.key]} av ${total} (${Math.round(counts[s.key] / total * 100)}%)`}
          style={{ width: (counts[s.key] / total * 100) + '%', background: s.color }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Rader
   ═══════════════════════════════════════════════════════════ */

const gridTemplate = (cols) =>
  '34px minmax(280px, 1fr) ' + cols.map(c => c.width + 'px').join(' ') + ' 40px';

function SubitemRow({ sub, groupId, itemId, color, profiles, visibleCols, onMutateSub, onDeleteSub }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="bd-subrow" style={{ gridTemplateColumns: gridTemplate(visibleCols), '--rail': color }}>
      <span className="bd-cell check sub-elbow"><CornerDownRight size={13} strokeWidth={1.75} /></span>
      <div className="bd-cell name sub">
        {editing
          ? <EditInput value={sub.name} onCancel={() => setEditing(false)}
              onCommit={(v) => { if (v) onMutateSub(groupId, itemId, sub.id, { name: v }); setEditing(false); }} />
          : <button className="bd-name-btn sub" onClick={() => setEditing(true)} title={sub.name}>{sub.name}</button>}
      </div>
      {visibleCols.map(col => (
        <div key={col.key} className="bd-cell">
          {col.key === 'person' && (
            <PersonCell value={sub.person} profiles={profiles} size={22}
              onChange={(v) => onMutateSub(groupId, itemId, sub.id, { person: v })} />
          )}
          {col.key === 'status' && (
            <StatusCell small value={sub.status}
              onChange={(v) => onMutateSub(groupId, itemId, sub.id, { status: v })} />
          )}
          {col.key === 'date' && (
            <DateCell value={sub.date} overdue={isOverdue(sub)}
              onChange={(v) => onMutateSub(groupId, itemId, sub.id, { date: v })} />
          )}
        </div>
      ))}
      <div className="bd-cell end">
        <button className="bd-icon-btn danger" onClick={() => onDeleteSub(groupId, itemId, sub.id)}
          aria-label="Ta bort underobjekt"><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

function ItemRow({
  item, group, groups, profiles, visibleCols, sortActive,
  selected, onToggleSelect, expanded, onToggleExpand,
  editing, onStartEdit, onStopEdit,
  onMutateItem, onMutateSub, onAddSub, onDeleteSub, onDeleteItem, onDuplicateItem, onMoveItem,
  dragProps, dropIndicator,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [subInput, setSubInput] = useState('');
  const menuRef = useRef(null);
  const overdue = isOverdue(item);
  const subs = item.subitems || [];
  const doneSubs = subs.filter(s => s.status === 'done').length;

  return (
    <Fragment>
      <div
        className={
          'bd-row' + (selected ? ' selected' : '') +
          (dropIndicator ? ' drop-' + dropIndicator : '') +
          (dragProps.isDragging ? ' dragging' : '')
        }
        style={{ gridTemplateColumns: gridTemplate(visibleCols), '--rail': group.color }}
        draggable={!sortActive && !editing}
        onDragStart={dragProps.onDragStart}
        onDragEnd={dragProps.onDragEnd}
        onDragOver={dragProps.onDragOver}
        onDrop={dragProps.onDrop}
      >
        <div className="bd-cell check">
          {!sortActive && <span className="bd-grip" aria-hidden="true"><GripVertical size={13} /></span>}
          <input type="checkbox" className="bd-check" checked={selected}
            onChange={onToggleSelect} aria-label={'Markera ' + item.name} />
        </div>

        <div className="bd-cell name">
          <button
            className={'bd-expander' + (subs.length ? ' has-subs' : '') + (expanded ? ' open' : '')}
            onClick={onToggleExpand}
            aria-label={expanded ? 'Dölj underobjekt' : 'Visa underobjekt'}
            title={subs.length ? `${doneSubs}/${subs.length} underobjekt klara` : 'Underobjekt'}
          >
            <ChevronRight size={13} strokeWidth={2.25} />
            {subs.length > 0 && <span className="bd-sub-count">{subs.length}</span>}
          </button>
          {editing
            ? <EditInput value={item.name} onCancel={onStopEdit}
                onCommit={(v) => { if (v) onMutateItem(group.id, item.id, { name: v }); onStopEdit(); }} />
            : <button className={'bd-name-btn' + (item.status === 'done' ? ' done' : '')}
                onClick={onStartEdit} title={item.name}>{item.name}</button>}
        </div>

        {visibleCols.map(col => (
          <div key={col.key} className="bd-cell">
            {col.key === 'person' && (
              <PersonCell value={item.person} profiles={profiles}
                onChange={(v) => onMutateItem(group.id, item.id, { person: v })} />
            )}
            {col.key === 'status' && (
              <StatusCell value={item.status}
                onChange={(v) => onMutateItem(group.id, item.id, { status: v }, 'status')} />
            )}
            {col.key === 'priority' && (
              <PriorityCell value={item.priority}
                onChange={(v) => onMutateItem(group.id, item.id, { priority: v })} />
            )}
            {col.key === 'date' && (
              <DateCell value={item.date} overdue={overdue}
                onChange={(v) => onMutateItem(group.id, item.id, { date: v }, 'date')} />
            )}
            {col.key === 'timeline' && (
              <TimelineCell start={item.start} end={item.end} color={group.color}
                onChange={(s, e) => onMutateItem(group.id, item.id, { start: s, end: e })} />
            )}
            {col.key === 'group' && (
              <GroupCell groupId={group.id} groups={groups}
                onChange={(toGid) => onMoveItem(group.id, item.id, toGid)} />
            )}
          </div>
        ))}

        <div className="bd-cell end">
          <button ref={menuRef} className="bd-icon-btn row-menu" onClick={() => setMenuOpen(o => !o)}
            aria-label="Fler åtgärder"><MoreHorizontal size={15} /></button>
          {menuOpen && (
            <Popover anchorRef={menuRef} onClose={() => { setMenuOpen(false); setMoveOpen(false); }} width={210} align="right">
              <div className="bd-pop-list">
                <button className="bd-pop-item" onClick={() => { onToggleExpand(true); setMenuOpen(false); }}>
                  <CornerDownRight size={13} /> Lägg till underobjekt
                </button>
                <button className="bd-pop-item" onClick={() => { onDuplicateItem(group.id, item.id); setMenuOpen(false); }}>
                  <Copy size={13} /> Duplicera
                </button>
                <button className="bd-pop-item" onClick={() => setMoveOpen(o => !o)}>
                  <ArrowUpDown size={13} /> Flytta till
                  <ChevronRight size={12} className={'bd-pop-caret' + (moveOpen ? ' open' : '')} />
                </button>
                {moveOpen && groups.filter(g => g.id !== group.id).map(g => (
                  <button key={g.id} className="bd-pop-item indent"
                    onClick={() => { onMoveItem(group.id, item.id, g.id); setMenuOpen(false); }}>
                    <span className="bd-color-dot" style={{ background: g.color }} /> {g.title}
                  </button>
                ))}
                <div className="bd-pop-sep" />
                <button className="bd-pop-item danger" onClick={() => { onDeleteItem(group.id, item.id); setMenuOpen(false); }}>
                  <Trash2 size={13} /> Ta bort
                </button>
              </div>
            </Popover>
          )}
        </div>
      </div>

      {expanded && (
        <div className="bd-subwrap" style={{ '--rail': group.color }}>
          {subs.map(sub => (
            <SubitemRow key={sub.id} sub={sub} groupId={group.id} itemId={item.id} color={group.color}
              profiles={profiles} visibleCols={visibleCols} onMutateSub={onMutateSub} onDeleteSub={onDeleteSub} />
          ))}
          <div className="bd-subrow add" style={{ gridTemplateColumns: gridTemplate(visibleCols) }}>
            <span className="bd-cell check sub-elbow"><Plus size={12} strokeWidth={2} /></span>
            <div className="bd-cell name sub">
              <input
                className="bd-add-input sub" placeholder="Lägg till underobjekt"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && subInput.trim()) { onAddSub(group.id, item.id, subInput.trim()); setSubInput(''); }
                  if (e.key === 'Escape') setSubInput('');
                }}
                onBlur={() => { if (subInput.trim()) { onAddSub(group.id, item.id, subInput.trim()); setSubInput(''); } }}
              />
            </div>
            {visibleCols.map(c => <div key={c.key} className="bd-cell" />)}
            <div className="bd-cell" />
          </div>
        </div>
      )}
    </Fragment>
  );
}

function AddItemRow({ group, visibleCols, onAdd, registerFocus }) {
  const [val, setVal] = useState('');
  const ref = useRef(null);
  useEffect(() => { registerFocus?.(group.id, () => ref.current?.focus()); }, [group.id]); // eslint-disable-line
  const commit = () => { if (val.trim()) { onAdd(group.id, val.trim()); setVal(''); } };
  return (
    <div className="bd-row add" style={{ gridTemplateColumns: gridTemplate(visibleCols), '--rail': group.color }}>
      <div className="bd-cell check"><Plus size={14} className="bd-add-plus" aria-hidden="true" /></div>
      <div className="bd-cell name">
        <input
          ref={ref} className="bd-add-input" placeholder="Lägg till objekt"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setVal(''); }}
          onBlur={commit}
        />
      </div>
      {visibleCols.map(c => <div key={c.key} className="bd-cell" />)}
      <div className="bd-cell" />
    </div>
  );
}

function GroupSummaryRow({ group, visibleCols }) {
  const items = group.items;
  const persons = [...new Set(items.map(i => i.person).filter(Boolean))];
  const tl = groupTimeline(items);
  return (
    <div className="bd-row summary" style={{ gridTemplateColumns: gridTemplate(visibleCols), '--rail': group.color }}>
      <div className="bd-cell check" />
      <div className="bd-cell name muted">{items.length} {items.length === 1 ? 'objekt' : 'objekt'}</div>
      {visibleCols.map(col => (
        <div key={col.key} className="bd-cell">
          {col.key === 'person' && persons.length > 0 && (
            <span className="bd-avatar-stack">
              {persons.slice(0, 3).map(p => <Avatar key={p} name={p} size={22} />)}
              {persons.length > 3 && <span className="bd-avatar-more">+{persons.length - 3}</span>}
            </span>
          )}
          {col.key === 'status' && <DistBar items={items} />}
          {col.key === 'timeline' && (tl.min || tl.max) && (
            <span className="bd-timeline mini" style={{ background: group.color }}>
              <span className="bd-timeline-elapsed" style={{ width: elapsedPct(tl.min, tl.max) + '%' }} />
              <span className="bd-timeline-label">{fmtRange(tl.min, tl.max)}</span>
            </span>
          )}
        </div>
      ))}
      <div className="bd-cell" />
    </div>
  );
}

function ColumnHeaderRow({ group, visibleCols, sort, onSort, allSelected, onToggleAll }) {
  const sortIcon = (key) => {
    if (!sort || sort.key !== key) return <ArrowUpDown size={11} className="bd-sort-icon" />;
    return sort.dir === 'asc'
      ? <ArrowUp size={11} className="bd-sort-icon active" />
      : <ArrowDown size={11} className="bd-sort-icon active" />;
  };
  return (
    <div className="bd-row header" style={{ gridTemplateColumns: gridTemplate(visibleCols), '--rail': group.color }}>
      <div className="bd-cell check">
        <input type="checkbox" className="bd-check" checked={allSelected} onChange={onToggleAll}
          aria-label="Markera alla i gruppen" />
      </div>
      <button className="bd-cell name bd-col-btn" onClick={() => onSort('name')}>
        Objekt {sortIcon('name')}
      </button>
      {visibleCols.map(col => (
        col.key === 'group'
          ? <div key={col.key} className="bd-cell bd-col-static center">{col.label}</div>
          : <button key={col.key} className="bd-cell bd-col-btn center" onClick={() => onSort(col.key)}>
              {col.label} {sortIcon(col.key)}
            </button>
      ))}
      <div className="bd-cell" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Grupp
   ═══════════════════════════════════════════════════════════ */

function GroupHeader({ group, index, total, onMutateGroup, onMoveGroup, onArchiveGroup, onDeleteGroup, onMarkAllDone }) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const menuRef = useRef(null);
  const items = group.items;
  const done = items.filter(i => i.status === 'done').length;
  const allDone = items.length > 0 && done === items.length;

  return (
    <div className="bd-group-head" style={{ '--gcolor': group.color }}>
      <button className={'bd-collapse' + (group.collapsed ? ' closed' : '')}
        onClick={() => onMutateGroup(group.id, { collapsed: !group.collapsed })}
        aria-label={group.collapsed ? 'Fäll ut grupp' : 'Fäll ihop grupp'} aria-expanded={!group.collapsed}>
        <ChevronDown size={17} strokeWidth={2.5} />
      </button>

      {editing
        ? <EditInput value={group.title} className="group-title" onCancel={() => setEditing(false)}
            onCommit={(v) => { if (v) onMutateGroup(group.id, { title: v }); setEditing(false); }} />
        : <button className="bd-group-title" onClick={() => setEditing(true)} title="Byt namn">{group.title}</button>}

      <span className="bd-group-count">{items.length} objekt{done > 0 ? ` · ${done} klara` : ''}</span>

      {allDone && <span className="bd-stamp" aria-label="Alla objekt klara">Klart!</span>}

      {group.collapsed && items.length > 0 && (
        <div className="bd-collapsed-dist"><DistBar items={items} /></div>
      )}

      <span className="bd-group-flex" />

      <button ref={menuRef} className="bd-icon-btn group-menu" onClick={() => setMenuOpen(o => !o)}
        aria-label="Gruppmeny"><MoreHorizontal size={16} /></button>
      {menuOpen && (
        <Popover anchorRef={menuRef} onClose={() => { setMenuOpen(false); setColorOpen(false); }} width={216} align="right">
          <div className="bd-pop-list">
            <button className="bd-pop-item" onClick={() => { setEditing(true); setMenuOpen(false); }}>
              <Pencil size={13} /> Byt namn
            </button>
            <button className="bd-pop-item" onClick={() => setColorOpen(o => !o)}>
              <Palette size={13} /> Byt färg
              <ChevronRight size={12} className={'bd-pop-caret' + (colorOpen ? ' open' : '')} />
            </button>
            {colorOpen && (
              <div className="bd-color-row">
                {GROUP_COLORS.map(c => (
                  <button key={c} className={'bd-color-swatch' + (c === group.color ? ' active' : '')}
                    style={{ background: c }} aria-label={'Färg ' + c}
                    onClick={() => { onMutateGroup(group.id, { color: c }); setMenuOpen(false); setColorOpen(false); }} />
                ))}
              </div>
            )}
            <div className="bd-pop-sep" />
            <button className="bd-pop-item" disabled={index === 0}
              onClick={() => { onMoveGroup(group.id, -1); setMenuOpen(false); }}>
              <ArrowUp size={13} /> Flytta upp
            </button>
            <button className="bd-pop-item" disabled={index === total - 1}
              onClick={() => { onMoveGroup(group.id, 1); setMenuOpen(false); }}>
              <ArrowDown size={13} /> Flytta ned
            </button>
            <div className="bd-pop-sep" />
            <button className="bd-pop-item" disabled={items.length === 0 || allDone}
              onClick={() => { onMarkAllDone(group.id); setMenuOpen(false); }}>
              <Check size={13} /> Markera allt som Klart
            </button>
            <button className="bd-pop-item" onClick={() => { onArchiveGroup(group.id); setMenuOpen(false); }}>
              <Archive size={13} /> Arkivera grupp
            </button>
            <button className="bd-pop-item danger" onClick={() => { onDeleteGroup(group.id); setMenuOpen(false); }}>
              <Trash2 size={13} /> Ta bort grupp
            </button>
          </div>
        </Popover>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Verktygsrad
   ═══════════════════════════════════════════════════════════ */

function Toolbar({
  onNewItem, onNewGroup, search, setSearch, profiles,
  filters, setFilters, sort, setSort, hiddenCols, setHiddenCols, onOpenAutomations,
  automationsOn,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [hideOpen, setHideOpen] = useState(false);
  const personRef = useRef(null);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const hideRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const filterCount =
    filters.statuses.length + filters.priorities.length + filters.persons.length + (filters.overdue ? 1 : 0);

  const toggleArr = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  return (
    <div className="bd-toolbar" role="toolbar" aria-label="Tavlans verktyg">
      <button className="bd-btn primary" onClick={onNewItem}><Plus size={15} strokeWidth={2.5} /> Nytt objekt</button>
      <button className="bd-btn ghost" onClick={onNewGroup}><Plus size={14} /> Grupp</button>

      <div className="bd-tool-sep" />

      <div className={'bd-search' + (searchOpen || search ? ' open' : '')}>
        <button className="bd-btn ghost" onClick={() => setSearchOpen(o => !o)} aria-label="Sök">
          <Search size={14} /> {!searchOpen && !search && 'Sök'}
        </button>
        {(searchOpen || search) && (
          <input
            ref={searchRef} className="bd-search-input" placeholder="Sök objekt…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') { setSearch(''); setSearchOpen(false); } }}
            onBlur={() => { if (!search) setSearchOpen(false); }}
          />
        )}
      </div>

      <button ref={personRef} className={'bd-btn ghost' + (filters.persons.length ? ' on' : '')}
        onClick={() => setPersonOpen(o => !o)}>
        <Users size={14} /> Person{filters.persons.length > 0 && <span className="bd-chip">{filters.persons.length}</span>}
      </button>
      {personOpen && (
        <Popover anchorRef={personRef} onClose={() => setPersonOpen(false)} width={208}>
          <div className="bd-pop-list">
            <div className="bd-pop-label">Filtrera på person</div>
            {profiles.map(p => (
              <button key={p.id} className="bd-pop-item"
                onClick={() => setFilters(f => ({ ...f, persons: toggleArr(f.persons, p.name) }))}>
                <Avatar name={p.name} size={22} />
                <span className="bd-pop-item-grow">{p.name}</span>
                {filters.persons.includes(p.name) && <Check size={14} />}
              </button>
            ))}
            {filters.persons.length > 0 && (
              <button className="bd-pop-item" onClick={() => setFilters(f => ({ ...f, persons: [] }))}>
                <X size={13} /> Rensa
              </button>
            )}
          </div>
        </Popover>
      )}

      <button ref={filterRef} className={'bd-btn ghost' + (filterCount ? ' on' : '')}
        onClick={() => setFilterOpen(o => !o)}>
        <Filter size={14} /> Filter{filterCount > 0 && <span className="bd-chip">{filterCount}</span>}
      </button>
      {filterOpen && (
        <Popover anchorRef={filterRef} onClose={() => setFilterOpen(false)} width={250}>
          <div className="bd-pop-list">
            <div className="bd-pop-label">Status</div>
            <div className="bd-filter-pills">
              {STATUSES.map(s => (
                <button key={s.key}
                  className={'bd-filter-pill' + (filters.statuses.includes(s.key) ? ' on' : '')}
                  style={{ '--pill': s.color }}
                  onClick={() => setFilters(f => ({ ...f, statuses: toggleArr(f.statuses, s.key) }))}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="bd-pop-label">Prioritet</div>
            <div className="bd-filter-pills">
              {PRIORITIES.map(p => (
                <button key={p.key}
                  className={'bd-filter-pill' + (filters.priorities.includes(p.key) ? ' on' : '')}
                  style={{ '--pill': p.color }}
                  onClick={() => setFilters(f => ({ ...f, priorities: toggleArr(f.priorities, p.key) }))}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="bd-pop-sep" />
            <button className="bd-pop-item"
              onClick={() => setFilters(f => ({ ...f, overdue: !f.overdue }))}>
              <span className="bd-overdue-dot static" /> Endast försenade
              {filters.overdue && <Check size={14} />}
            </button>
            {filterCount > 0 && (
              <button className="bd-pop-item"
                onClick={() => setFilters({ statuses: [], priorities: [], persons: [], overdue: false })}>
                <X size={13} /> Rensa alla filter
              </button>
            )}
          </div>
        </Popover>
      )}

      <button ref={sortRef} className={'bd-btn ghost' + (sort ? ' on' : '')} onClick={() => setSortOpen(o => !o)}>
        <ArrowUpDown size={14} /> Sortera
      </button>
      {sortOpen && (
        <Popover anchorRef={sortRef} onClose={() => setSortOpen(false)} width={196}>
          <div className="bd-pop-list">
            <div className="bd-pop-label">Sortera inom grupper</div>
            {[{ key: 'name', label: 'Namn' }, { key: 'status', label: 'Status' },
              { key: 'priority', label: 'Prioritet' }, { key: 'date', label: 'Datum' }].map(opt => (
              <button key={opt.key} className="bd-pop-item"
                onClick={() => setSort(s => s && s.key === opt.key
                  ? (s.dir === 'asc' ? { key: opt.key, dir: 'desc' } : null)
                  : { key: opt.key, dir: 'asc' })}>
                {opt.label}
                {sort?.key === opt.key && (sort.dir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />)}
              </button>
            ))}
            {sort && (
              <button className="bd-pop-item" onClick={() => { setSort(null); setSortOpen(false); }}>
                <X size={13} /> Manuell ordning
              </button>
            )}
          </div>
        </Popover>
      )}

      <button ref={hideRef} className={'bd-btn ghost' + (hiddenCols.length ? ' on' : '')}
        onClick={() => setHideOpen(o => !o)}>
        <EyeOff size={14} /> Dölj{hiddenCols.length > 0 && <span className="bd-chip">{hiddenCols.length}</span>}
      </button>
      {hideOpen && (
        <Popover anchorRef={hideRef} onClose={() => setHideOpen(false)} width={196}>
          <div className="bd-pop-list">
            <div className="bd-pop-label">Visa kolumner</div>
            {COLUMNS.map(c => (
              <button key={c.key} className="bd-pop-item"
                onClick={() => setHiddenCols(h => h.includes(c.key) ? h.filter(x => x !== c.key) : [...h, c.key])}>
                {c.label}
                {!hiddenCols.includes(c.key) && <Check size={14} />}
              </button>
            ))}
          </div>
        </Popover>
      )}

      <span className="bd-tool-flex" />

      <button className={'bd-btn auto' + (automationsOn > 0 ? ' on' : '')} onClick={onOpenAutomations}>
        <Zap size={14} strokeWidth={2.25} /> Automatisera
        {automationsOn > 0 && <span className="bd-chip zap">{automationsOn}</span>}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Automationer
   ═══════════════════════════════════════════════════════════ */

function StatusSelect({ value, onChange, exclude = [] }) {
  const s = STATUS_MAP[value] || STATUS_MAP.todo;
  return (
    <span className="bd-auto-select" style={{ background: s.color }}>
      {s.label}
      <ChevronDown size={11} strokeWidth={2.5} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Välj status">
        {STATUSES.filter(st => !exclude.includes(st.key)).map(st => (
          <option key={st.key} value={st.key}>{st.label}</option>
        ))}
      </select>
    </span>
  );
}

function GroupSelect({ value, groups, onChange }) {
  const g = groups.find(x => x.id === value);
  return (
    <span className={'bd-auto-select group' + (g ? '' : ' unset')} style={g ? { background: g.color } : undefined}>
      {g ? g.title : 'välj grupp'}
      <ChevronDown size={11} strokeWidth={2.5} />
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} aria-label="Välj grupp">
        <option value="" disabled>Välj grupp…</option>
        {groups.map(gr => <option key={gr.id} value={gr.id}>{gr.title}</option>)}
      </select>
    </span>
  );
}

function AutomationsModal({ automations, groups, onChange, onClose }) {
  const update = (id, patch) =>
    onChange(automations.map(a => a.id === id ? { ...a, ...patch, config: { ...a.config, ...(patch.config || {}) } } : a));

  const recipes = {
    move_on_status: (a) => (
      <>När status ändras till <StatusSelect value={a.config.status}
          onChange={(v) => update(a.id, { config: { status: v } })} /> flytta
        objektet till <GroupSelect value={a.config.groupId} groups={groups}
          onChange={(v) => update(a.id, { config: { groupId: v }, enabled: true })} /></>
    ),
    overdue_status: (a) => (
      <>När datumet passerats och objektet inte är Klart, sätt status
        till <StatusSelect value={a.config.status} exclude={['done']}
          onChange={(v) => update(a.id, { config: { status: v } })} /></>
    ),
    date_on_done: () => <>När status ändras till <span className="bd-auto-fixed" style={{ background: STATUS_MAP.done.color }}>Klart</span>, sätt datumet till idag</>,
    default_status: (a) => (
      <>När ett objekt skapas, sätt status till <StatusSelect value={a.config.status}
          onChange={(v) => update(a.id, { config: { status: v } })} /></>
    ),
    collapse_done: () => <>När alla objekt i en grupp är <span className="bd-auto-fixed" style={{ background: STATUS_MAP.done.color }}>Klart</span>, fäll ihop gruppen</>,
  };

  return (
    <div className="bd-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bd-modal" role="dialog" aria-modal="true" aria-label="Automationer">
        <div className="bd-modal-head">
          <span className="bd-modal-zap"><Zap size={18} strokeWidth={2.25} /></span>
          <div>
            <h2>Automatisera</h2>
            <p>Reglerna körs direkt i tavlan när något ändras.</p>
          </div>
          <button className="bd-icon-btn" onClick={onClose} aria-label="Stäng"><X size={17} /></button>
        </div>
        <div className="bd-modal-body">
          {automations.map(a => (
            <div key={a.id} className={'bd-recipe' + (a.enabled ? ' on' : '')}>
              <span className="bd-recipe-icon"><Zap size={14} strokeWidth={2.25} /></span>
              <span className="bd-recipe-text">{recipes[a.type]?.(a)}</span>
              <button
                className={'bd-switch' + (a.enabled ? ' on' : '')}
                role="switch" aria-checked={a.enabled}
                aria-label={a.enabled ? 'Stäng av regel' : 'Slå på regel'}
                onClick={() => update(a.id, { enabled: !a.enabled })}
              ><span className="bd-switch-knob" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Bulkrad, arkiv, toast, skelett
   ═══════════════════════════════════════════════════════════ */

function BulkBar({ count, groups, onSetStatus, onMoveTo, onDuplicate, onDelete, onClear }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const statusRef = useRef(null);
  const moveRef = useRef(null);
  return (
    <div className="bd-bulk" role="region" aria-label="Markerade objekt">
      <span className="bd-bulk-count">{count}</span>
      <span className="bd-bulk-label">{count === 1 ? 'objekt valt' : 'objekt valda'}</span>
      <div className="bd-bulk-sep" />
      <button ref={statusRef} className="bd-bulk-btn" onClick={() => setStatusOpen(o => !o)}>Status <ChevronDown size={12} /></button>
      {statusOpen && (
        <Popover anchorRef={statusRef} onClose={() => setStatusOpen(false)} width={176}>
          <div className="bd-status-grid">
            {STATUSES.map(st => (
              <button key={st.key} className="bd-status-opt" style={{ background: st.color }}
                onClick={() => { onSetStatus(st.key); setStatusOpen(false); }}>{st.label}</button>
            ))}
          </div>
        </Popover>
      )}
      <button ref={moveRef} className="bd-bulk-btn" onClick={() => setMoveOpen(o => !o)}>Flytta till <ChevronDown size={12} /></button>
      {moveOpen && (
        <Popover anchorRef={moveRef} onClose={() => setMoveOpen(false)} width={196}>
          <div className="bd-pop-list">
            {groups.map(g => (
              <button key={g.id} className="bd-pop-item" onClick={() => { onMoveTo(g.id); setMoveOpen(false); }}>
                <span className="bd-color-dot" style={{ background: g.color }} /> {g.title}
              </button>
            ))}
          </div>
        </Popover>
      )}
      <button className="bd-bulk-btn" onClick={onDuplicate}><Copy size={13} /> Duplicera</button>
      <button className="bd-bulk-btn danger" onClick={onDelete}><Trash2 size={13} /> Ta bort</button>
      <div className="bd-bulk-sep" />
      <button className="bd-icon-btn light" onClick={onClear} aria-label="Avmarkera alla"><X size={15} /></button>
    </div>
  );
}

function ArchivePanel({ archived, onRestore, onDeleteForever, onClose }) {
  return (
    <div className="bd-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bd-modal narrow" role="dialog" aria-modal="true" aria-label="Arkiv">
        <div className="bd-modal-head">
          <span className="bd-modal-zap dim"><Archive size={17} /></span>
          <div>
            <h2>Arkiv</h2>
            <p>Arkiverade grupper med innehåll.</p>
          </div>
          <button className="bd-icon-btn" onClick={onClose} aria-label="Stäng"><X size={17} /></button>
        </div>
        <div className="bd-modal-body">
          {archived.length === 0 && <div className="bd-archive-empty"><Inbox size={20} strokeWidth={1.5} /> Arkivet är tomt</div>}
          {archived.map(g => (
            <div key={g.id} className="bd-archive-row">
              <span className="bd-color-dot lg" style={{ background: g.color }} />
              <div className="bd-archive-meta">
                <strong>{g.title}</strong>
                <span>{g.items.length} objekt · arkiverad {fmtDate((g.archivedAt || '').slice(0, 10))}</span>
              </div>
              <button className="bd-btn ghost sm" onClick={() => onRestore(g.id)}><ArchiveRestore size={13} /> Återställ</button>
              <button className="bd-icon-btn danger" onClick={() => onDeleteForever(g.id)} aria-label="Ta bort permanent"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className={'bd-toast' + (toast.kind === 'auto' ? ' auto' : '')} role="status">
      {toast.kind === 'auto' && <Zap size={14} strokeWidth={2.25} />}
      <span>{toast.msg}</span>
      {toast.undo && <button className="bd-toast-undo" onClick={() => { toast.undo(); onDismiss(); }}>Ångra</button>}
      <button className="bd-icon-btn light sm" onClick={onDismiss} aria-label="Stäng"><X size={13} /></button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bd-skeleton" aria-hidden="true">
      {[0, 1].map(g => (
        <div key={g} className="bd-skel-group">
          <div className="bd-skel-bar w40" />
          {[0, 1, 2].map(r => <div key={r} className="bd-skel-row" />)}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="bd-empty">
      <div className="bd-empty-board" aria-hidden="true">
        <span /><span /><span />
      </div>
      <h2>En tom tavla, full av möjligheter</h2>
      <p>Skapa din första grupp och börja lägga in objekt — statusar, personer och tidslinjer följer med på köpet.</p>
      <button className="bd-btn primary lg" onClick={onCreate}><Plus size={16} strokeWidth={2.5} /> Skapa grupp</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Huvudkomponent
   ═══════════════════════════════════════════════════════════ */

const AUTO_ORDER = ['date_on_done', 'move_on_status', 'collapse_done'];

export default function TodoLabb() {
  const [activeUser, setActiveUser] = useState(null);
  const [profileId, setProfileId]   = useState(null);
  const [profiles, setProfiles]     = useState([]);
  const [board, setBoard]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saveState, setSaveState]   = useState('idle');

  const [toast, setToast]           = useState(null);
  const [search, setSearch]         = useState('');
  const [filters, setFilters]       = useState({ statuses: [], priorities: [], persons: [], overdue: false });
  const [sort, setSort]             = useState(null);
  const [selection, setSelection]   = useState(() => new Set());
  const [expanded, setExpanded]     = useState(() => new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [autoOpen, setAutoOpen]     = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [drag, setDrag]             = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const boardRef     = useRef(null);
  const profileRef   = useRef(null);
  const saveTimer    = useRef(null);
  const toastTimer   = useRef(null);
  const focusFns     = useRef({});

  /* ── Toast ── */
  const showToast = useCallback((msg, kind = 'info', undo = null) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, kind, undo });
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  }, []);
  const dismissToast = () => { clearTimeout(toastTimer.current); setToast(null); };

  /* ── Persistens ── */
  const flush = useCallback(async () => {
    clearTimeout(saveTimer.current);
    const b = boardRef.current, pid = profileRef.current;
    if (!b || !pid) return;
    try {
      await db.saveBoard(pid, b);
      setSaveState('saved');
    } catch {
      setSaveState('error');
      showToast('Kunde inte spara ändringarna — kontrollera anslutningen');
    }
  }, [showToast]);

  const scheduleSave = useCallback(() => {
    setSaveState('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 700);
  }, [flush]);

  /* Alla mutationer går genom apply(): tar fram nästa tavla från
     senaste state, kör ev. automationer och köar sparning. */
  const apply = useCallback((fn) => {
    const prev = boardRef.current;
    if (!prev) return;
    const result = fn(JSON.parse(JSON.stringify(prev)));
    if (!result) return;
    const next = result.board || result;
    boardRef.current = next;
    setBoard(next);
    if (result.fired && result.fired.length) {
      showToast(result.fired[0] + (result.fired.length > 1 ? ` (+${result.fired.length - 1} till)` : ''), 'auto');
    }
    scheduleSave();
  }, [scheduleSave, showToast]);

  /* ── Automationsmotor ── */
  const runAutomations = useCallback((b, events) => {
    const fired = [];
    const enabled = (type) => b.automations.find(a => a.type === type && a.enabled);

    for (const ev of events) {
      if (ev.type === 'status') {
        for (const type of AUTO_ORDER) {
          const a = enabled(type);
          if (!a) continue;
          const g = b.groups.find(x => x.id === ev.groupId);
          const idx = g ? g.items.findIndex(i => i.id === ev.itemId) : -1;
          if (idx < 0) continue;
          const item = g.items[idx];

          if (type === 'date_on_done' && ev.status === 'done') {
            item.date = todayISO();
            fired.push(`Datumet sattes till idag på "${item.name}"`);
          }
          if (type === 'move_on_status' && ev.status === a.config.status && a.config.groupId && a.config.groupId !== g.id) {
            const target = b.groups.find(x => x.id === a.config.groupId);
            if (target) {
              g.items.splice(idx, 1);
              target.items.push(item);
              fired.push(`"${item.name}" flyttades till ${target.title}`);
              ev.groupId = target.id;
            }
          }
          if (type === 'collapse_done' && ev.status === 'done') {
            const cg = b.groups.find(x => x.items.some(i => i.id === ev.itemId));
            if (cg && !cg.collapsed && cg.items.length > 0 && cg.items.every(i => i.status === 'done')) {
              cg.collapsed = true;
              fired.push(`Gruppen "${cg.title}" är klar och fälldes ihop`);
            }
          }
        }
      }

      if (ev.type === 'date' || ev.type === 'date_check') {
        const a = enabled('overdue_status');
        if (a) {
          for (const g of b.groups) {
            for (const item of g.items) {
              if (isOverdue(item) && item.odKey !== item.date && item.status !== a.config.status) {
                item.status = a.config.status;
                item.odKey = item.date;
                fired.push(`"${item.name}" har passerat sitt datum — status sattes till ${STATUS_MAP[a.config.status].label}`);
              }
            }
          }
        }
      }
    }
    return { board: b, fired };
  }, []);

  /* ── Init ── */
  useEffect(() => {
    let cancelled = false;
    async function init() {
      let name = null;
      try { name = JSON.parse(localStorage.getItem('ailabb_active_user')); } catch {}
      if (!name) { window.location.replace('../../'); return; }

      // The database is owner-scoped now: without a real session every query
      // returns nothing. The hub establishes the session on login; if it's
      // missing or expired, send the user back there rather than rendering an
      // empty board that looks like data loss.
      const session = await db.currentSession();
      if (!session) { window.location.replace('../../'); return; }

      setActiveUser(name);

      const cachedId   = localStorage.getItem(SESSION_ID_KEY);
      const cachedName = localStorage.getItem(SESSION_NAME_KEY);
      let pid;
      if (cachedId && cachedName === name) {
        pid = cachedId;
      } else {
        const profile = await db.getOrCreateProfile(name);
        if (!profile) { window.location.replace('../../'); return; }
        pid = profile.id;
        localStorage.setItem(SESSION_ID_KEY, pid);
        localStorage.setItem(SESSION_NAME_KEY, name);
      }
      if (cancelled) return;
      profileRef.current = pid;
      setProfileId(pid);

      try {
        const [allProfiles, existing] = await Promise.all([db.getProfiles(), db.getBoard(pid)]);
        if (cancelled) return;
        setProfiles(allProfiles);

        let b = existing;
        let importedFrom = 0;
        if (!b) {
          b = emptyBoard();
          const legacy = await db.getLegacyProjects(pid);
          if (legacy.length) {
            b.groups = legacyToGroups(legacy);
            importedFrom = legacy.length;
            b.migratedFrom = 'projects';
          }
        }
        /* Komplettera med ev. nya standardregler */
        for (const def of DEFAULT_AUTOMATIONS) {
          if (!b.automations?.some(a => a.type === def.type)) {
            b.automations = [...(b.automations || []), def];
          }
        }
        b.hiddenCols = b.hiddenCols || [];
        b.archived   = b.archived || [];

        const res = runAutomations(b, [{ type: 'date_check' }]);
        b = res.board;

        boardRef.current = b;
        setBoard(b);
        setLoading(false);

        if (!existing || res.fired.length) {
          await db.saveBoard(pid, b);
          setSaveState('saved');
        }
        if (importedFrom) showToast(`${importedFrom} ${importedFrom === 1 ? 'gammalt projekt importerades' : 'gamla projekt importerades'} till tavlan`);
        else if (res.fired.length) showToast(res.fired[0], 'auto');
      } catch {
        if (!cancelled) {
          setLoading(false);
          showToast('Kunde inte hämta tavlan — kontrollera anslutningen');
        }
      }
    }
    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  /* Spara direkt när fliken göms + datumkontroll vid fokus */
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'hidden') flush(); };
    const onFocus = () => {
      if (!boardRef.current) return;
      apply(b => runAutomations(b, [{ type: 'date_check' }]));
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocus);
    };
  }, [flush, apply, runAutomations]);

  const handleSwitch = () => {
    flush();
    localStorage.removeItem('ailabb_active_user');
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NAME_KEY);
    window.location.replace('../../');
  };

  /* ── Gruppmutationer ── */
  const mutateGroup = (gid, patch) => apply(b => {
    const g = b.groups.find(x => x.id === gid); if (!g) return null;
    Object.assign(g, patch); return b;
  });

  const addGroup = () => {
    const used = new Set((boardRef.current?.groups || []).map(g => g.color));
    const color = GROUP_COLORS.find(c => !used.has(c)) || GROUP_COLORS[(boardRef.current?.groups.length || 0) % GROUP_COLORS.length];
    apply(b => { b.groups.push({ id: uid(), title: 'Ny grupp', color, collapsed: false, items: [] }); return b; });
  };

  const deleteGroup = (gid) => {
    const g = boardRef.current.groups.find(x => x.id === gid);
    if (!g) return;
    if (g.items.length && !window.confirm(`Ta bort gruppen "${g.title}" och dess ${g.items.length} objekt?`)) return;
    apply(b => { b.groups = b.groups.filter(x => x.id !== gid); return b; });
  };

  const archiveGroup = (gid) => apply(b => {
    const i = b.groups.findIndex(x => x.id === gid); if (i < 0) return null;
    const [g] = b.groups.splice(i, 1);
    g.archivedAt = ts();
    b.archived.unshift(g);
    return b;
  });

  const restoreGroup = (gid) => apply(b => {
    const i = b.archived.findIndex(x => x.id === gid); if (i < 0) return null;
    const [g] = b.archived.splice(i, 1);
    delete g.archivedAt;
    b.groups.push(g);
    return b;
  });

  const deleteForever = (gid) => {
    const g = boardRef.current.archived.find(x => x.id === gid);
    if (!g || !window.confirm(`Ta bort "${g.title}" permanent?`)) return;
    apply(b => { b.archived = b.archived.filter(x => x.id !== gid); return b; });
  };

  const moveGroup = (gid, dir) => apply(b => {
    const i = b.groups.findIndex(x => x.id === gid);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= b.groups.length) return null;
    const [g] = b.groups.splice(i, 1);
    b.groups.splice(j, 0, g);
    return b;
  });

  const markAllDone = (gid) => apply(b => {
    const g = b.groups.find(x => x.id === gid); if (!g) return null;
    for (const it of g.items) it.status = 'done';
    const collapse = b.automations.find(a => a.type === 'collapse_done' && a.enabled);
    if (collapse && g.items.length) g.collapsed = true;
    return b;
  });

  /* ── Objektmutationer ── */
  const defaultStatus = () =>
    boardRef.current?.automations.find(a => a.type === 'default_status' && a.enabled)?.config.status || 'todo';

  const addItem = (gid, name) => apply(b => {
    const g = b.groups.find(x => x.id === gid); if (!g) return null;
    g.items.push(newItem(name, defaultStatus()));
    return b;
  });

  const mutateItem = (gid, iid, patch, evType) => apply(b => {
    const g = b.groups.find(x => x.id === gid);
    const it = g?.items.find(i => i.id === iid);
    if (!it) return null;
    Object.assign(it, patch);
    if (patch.date !== undefined) it.odKey = null;
    if (evType === 'status') return runAutomations(b, [{ type: 'status', groupId: gid, itemId: iid, status: patch.status }]);
    if (evType === 'date')   return runAutomations(b, [{ type: 'date' }]);
    return b;
  });

  const deleteItem = (gid, iid) => {
    const g = boardRef.current.groups.find(x => x.id === gid);
    const idx = g?.items.findIndex(i => i.id === iid);
    if (idx == null || idx < 0) return;
    const snapshot = JSON.parse(JSON.stringify(g.items[idx]));
    apply(b => {
      const gg = b.groups.find(x => x.id === gid); if (!gg) return null;
      gg.items = gg.items.filter(i => i.id !== iid);
      return b;
    });
    setSelection(s => { const n = new Set(s); n.delete(iid); return n; });
    showToast(`"${snapshot.name}" togs bort`, 'info', () => {
      apply(b => {
        const gg = b.groups.find(x => x.id === gid);
        if (gg) gg.items.splice(Math.min(idx, gg.items.length), 0, snapshot);
        return b;
      });
    });
  };

  const duplicateItem = (gid, iid) => apply(b => {
    const g = b.groups.find(x => x.id === gid);
    const idx = g?.items.findIndex(i => i.id === iid);
    if (idx == null || idx < 0) return null;
    const copy = JSON.parse(JSON.stringify(g.items[idx]));
    copy.id = uid();
    copy.name += ' (kopia)';
    copy.createdAt = ts();
    copy.subitems = (copy.subitems || []).map(s => ({ ...s, id: uid() }));
    g.items.splice(idx + 1, 0, copy);
    return b;
  });

  const moveItemTo = (fromGid, iid, toGid, insertIndex = null) => apply(b => {
    const from = b.groups.find(x => x.id === fromGid);
    const to   = b.groups.find(x => x.id === toGid);
    const idx  = from?.items.findIndex(i => i.id === iid);
    if (!to || idx == null || idx < 0) return null;
    const [item] = from.items.splice(idx, 1);
    let at = insertIndex == null ? to.items.length : insertIndex;
    if (fromGid === toGid && idx < at) at -= 1;
    at = Math.max(0, Math.min(at, to.items.length));
    to.items.splice(at, 0, item);
    return b;
  });

  /* ── Underobjekt ── */
  const mutateSub = (gid, iid, sid, patch) => apply(b => {
    const it = b.groups.find(x => x.id === gid)?.items.find(i => i.id === iid);
    const sub = it?.subitems?.find(s => s.id === sid);
    if (!sub) return null;
    Object.assign(sub, patch);
    return b;
  });

  const addSub = (gid, iid, name) => apply(b => {
    const it = b.groups.find(x => x.id === gid)?.items.find(i => i.id === iid);
    if (!it) return null;
    it.subitems = it.subitems || [];
    it.subitems.push({ id: uid(), name, status: 'todo', person: null, date: null, createdAt: ts() });
    return b;
  });

  const deleteSub = (gid, iid, sid) => apply(b => {
    const it = b.groups.find(x => x.id === gid)?.items.find(i => i.id === iid);
    if (!it) return null;
    it.subitems = (it.subitems || []).filter(s => s.id !== sid);
    return b;
  });

  /* ── Markering & bulk ── */
  const toggleSelect = (iid) => setSelection(s => {
    const n = new Set(s); n.has(iid) ? n.delete(iid) : n.add(iid); return n;
  });
  const toggleAllInGroup = (gid) => {
    const g = boardRef.current.groups.find(x => x.id === gid); if (!g) return;
    setSelection(s => {
      const n = new Set(s);
      const all = g.items.length > 0 && g.items.every(i => n.has(i.id));
      for (const i of g.items) all ? n.delete(i.id) : n.add(i.id);
      return n;
    });
  };
  const clearSelection = () => setSelection(new Set());

  const eachSelected = (b, fn) => {
    for (const g of b.groups) {
      for (let i = g.items.length - 1; i >= 0; i--) {
        if (selection.has(g.items[i].id)) fn(g, g.items[i], i);
      }
    }
  };

  const bulkSetStatus = (status) => {
    const ids = [...selection];
    apply(b => {
      const events = [];
      for (const g of b.groups) for (const it of g.items) {
        if (selection.has(it.id) && it.status !== status) {
          it.status = status;
          events.push({ type: 'status', groupId: g.id, itemId: it.id, status });
        }
      }
      return events.length ? runAutomations(b, events) : b;
    });
    showToast(`${ids.length} objekt fick status ${STATUS_MAP[status].label}`);
  };

  const bulkMoveTo = (toGid) => apply(b => {
    const to = b.groups.find(x => x.id === toGid); if (!to) return null;
    const moved = [];
    eachSelected(b, (g, it, i) => {
      if (g.id === toGid) return;
      g.items.splice(i, 1);
      moved.unshift(it);
    });
    to.items.push(...moved);
    return b;
  });

  const bulkDuplicate = () => apply(b => {
    eachSelected(b, (g, it, i) => {
      const copy = JSON.parse(JSON.stringify(it));
      copy.id = uid(); copy.name += ' (kopia)'; copy.createdAt = ts();
      copy.subitems = (copy.subitems || []).map(s => ({ ...s, id: uid() }));
      g.items.splice(i + 1, 0, copy);
    });
    return b;
  });

  const bulkDelete = () => {
    if (!window.confirm(`Ta bort ${selection.size} objekt?`)) return;
    apply(b => { eachSelected(b, (g, it, i) => g.items.splice(i, 1)); return b; });
    clearSelection();
  };

  /* ── Dra & släpp ── */
  const dndEnabled = !sort && !search &&
    !filters.statuses.length && !filters.priorities.length && !filters.persons.length && !filters.overdue;

  const dragProps = (gid, iid, index) => ({
    isDragging: drag?.itemId === iid,
    onDragStart: (e) => {
      if (!dndEnabled || e.target.closest('button, input, label, select')) { e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', iid);
      e.dataTransfer.effectAllowed = 'move';
      setDrag({ itemId: iid, fromGroup: gid });
    },
    onDragEnd: () => { setDrag(null); setDropTarget(null); },
    onDragOver: (e) => {
      if (!drag || !dndEnabled) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const r = e.currentTarget.getBoundingClientRect();
      const pos = e.clientY < r.top + r.height / 2 ? 'before' : 'after';
      setDropTarget(t => (t && t.groupId === gid && t.index === index && t.pos === pos) ? t : { groupId: gid, index, pos });
    },
    onDrop: (e) => {
      if (!drag || !dndEnabled) return;
      e.preventDefault();
      const at = dropTarget?.pos === 'after' ? index + 1 : index;
      moveItemTo(drag.fromGroup, drag.itemId, gid, at);
      setDrag(null); setDropTarget(null);
    },
  });

  const groupDropProps = (gid) => ({
    onDragOver: (e) => {
      if (!drag || !dndEnabled) return;
      if (e.target.closest('.bd-row:not(.add):not(.summary):not(.header)')) return;
      e.preventDefault();
      setDropTarget(t => (t && t.groupId === gid && t.index === -1) ? t : { groupId: gid, index: -1, pos: 'end' });
    },
    onDrop: (e) => {
      if (!drag || !dndEnabled) return;
      if (e.target.closest('.bd-row:not(.add):not(.summary):not(.header)')) return;
      e.preventDefault();
      moveItemTo(drag.fromGroup, drag.itemId, gid, null);
      setDrag(null); setDropTarget(null);
    },
  });

  /* ── Filtrering & sortering (endast visning) ── */
  const matchItem = useCallback((it) => {
    if (search) {
      const q = search.toLowerCase();
      const inName = it.name.toLowerCase().includes(q);
      const inSubs = (it.subitems || []).some(s => s.name.toLowerCase().includes(q));
      if (!inName && !inSubs) return false;
    }
    if (filters.statuses.length && !filters.statuses.includes(it.status)) return false;
    if (filters.priorities.length && !filters.priorities.includes(it.priority)) return false;
    if (filters.persons.length && !filters.persons.includes(it.person)) return false;
    if (filters.overdue && !isOverdue(it)) return false;
    return true;
  }, [search, filters]);

  const sortItems = useCallback((items) => {
    if (!sort) return items;
    const dir = sort.dir === 'asc' ? 1 : -1;
    const statusIdx = (k) => STATUSES.findIndex(s => s.key === k);
    const prioIdx = (k) => k ? PRIORITIES.findIndex(p => p.key === k) : 99;
    return [...items].sort((a, b2) => {
      switch (sort.key) {
        case 'name':     return dir * a.name.localeCompare(b2.name, 'sv');
        case 'status':   return dir * (statusIdx(a.status) - statusIdx(b2.status));
        case 'priority': return dir * (prioIdx(a.priority) - prioIdx(b2.priority));
        case 'date': {
          const av = a.date || '9999', bv = b2.date || '9999';
          return dir * av.localeCompare(bv);
        }
        case 'person':   return dir * (a.person || 'öö').localeCompare(b2.person || 'öö', 'sv');
        case 'timeline': {
          const av = a.start || a.date || '9999', bv = b2.start || b2.date || '9999';
          return dir * av.localeCompare(bv);
        }
        default: return 0;
      }
    });
  }, [sort]);

  const onSortColumn = (key) => setSort(s =>
    s && s.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' });

  /* ── Härledda värden ── */
  const visibleCols = COLUMNS.filter(c => !board?.hiddenCols?.includes(c.key));
  const stats = useMemo(() => {
    let total = 0, done = 0, overdue = 0;
    for (const g of board?.groups || []) for (const it of g.items) {
      total++;
      if (it.status === 'done') done++;
      if (isOverdue(it)) overdue++;
    }
    return { total, done, overdue };
  }, [board]);
  const automationsOn = board?.automations.filter(a => a.enabled).length || 0;

  const newItemFromToolbar = () => {
    const first = boardRef.current?.groups[0];
    if (!first) { addGroup(); return; }
    if (first.collapsed) mutateGroup(first.id, { collapsed: false });
    requestAnimationFrame(() => focusFns.current[first.id]?.());
  };

  /* ── Render ── */
  if (loading) {
    return (
      <div className="tl-app-root board-root">
        <Sidebar activeUser={activeUser} onSwitch={handleSwitch} />
        <main className="bd-main"><Skeleton /></main>
        <BoardStyles />
      </div>
    );
  }

  return (
    <div className="tl-app-root board-root">
      <Sidebar activeUser={activeUser} onSwitch={handleSwitch} />
      <main className="bd-main">
        <header className="bd-head">
          <span className="bd-eyebrow">AI Labb · Tavla</span>
          <div className="bd-title-row">
            {editingTitle
              ? <EditInput value={board.boardTitle} className="board-title" onCancel={() => setEditingTitle(false)}
                  onCommit={(v) => { if (v) apply(b => { b.boardTitle = v; return b; }); setEditingTitle(false); }} />
              : <button className="bd-title" onClick={() => setEditingTitle(true)} title="Byt namn på tavlan">
                  <h1>{board.boardTitle}</h1><Pencil size={14} className="bd-title-pen" />
                </button>}
            <span className={'bd-save ' + saveState} role="status">
              {saveState === 'saving' ? 'Sparar…' : saveState === 'saved' ? 'Sparad' : saveState === 'error' ? 'Fel vid sparning' : ''}
            </span>
          </div>
          <p className="bd-stats">
            {stats.total} objekt · {stats.done} klara
            {stats.overdue > 0 && <span className="bd-stats-overdue"> · {stats.overdue} försenade</span>}
          </p>
        </header>

        <Toolbar
          onNewItem={newItemFromToolbar}
          onNewGroup={addGroup}
          search={search} setSearch={setSearch}
          profiles={profiles}
          filters={filters} setFilters={setFilters}
          sort={sort} setSort={setSort}
          hiddenCols={board.hiddenCols}
          setHiddenCols={(fn) => apply(b => { b.hiddenCols = typeof fn === 'function' ? fn(b.hiddenCols) : fn; return b; })}
          onOpenAutomations={() => setAutoOpen(true)}
          automationsOn={automationsOn}
        />

        {board.groups.length === 0 ? (
          <EmptyState onCreate={addGroup} />
        ) : (
          <div className="bd-board">
            {board.groups.map((group, gi) => {
              const shown = sortItems(group.items.filter(matchItem));
              const allSelected = group.items.length > 0 && group.items.every(i => selection.has(i.id));
              return (
                <section key={group.id} className={'bd-group' + (group.collapsed ? ' collapsed' : '')}
                  style={{ '--gcolor': group.color }}>
                  <GroupHeader
                    group={group} index={gi} total={board.groups.length}
                    onMutateGroup={mutateGroup} onMoveGroup={moveGroup}
                    onArchiveGroup={(gid) => { archiveGroup(gid); showToast(`"${group.title}" arkiverades`, 'info', () => restoreGroup(gid)); }}
                    onDeleteGroup={deleteGroup} onMarkAllDone={markAllDone}
                  />
                  {!group.collapsed && (
                    <div className="bd-table" {...groupDropProps(group.id)}>
                      <ColumnHeaderRow
                        group={group} visibleCols={visibleCols}
                        sort={sort} onSort={onSortColumn}
                        allSelected={allSelected} onToggleAll={() => toggleAllInGroup(group.id)}
                      />
                      {shown.map((item) => {
                        const realIndex = group.items.indexOf(item);
                        const dt = dropTarget && dropTarget.groupId === group.id && dropTarget.index === realIndex ? dropTarget.pos : null;
                        return (
                          <ItemRow
                            key={item.id}
                            item={item} group={group} groups={board.groups}
                            profiles={profiles} visibleCols={visibleCols}
                            sortActive={!dndEnabled}
                            selected={selection.has(item.id)}
                            onToggleSelect={() => toggleSelect(item.id)}
                            expanded={expanded.has(item.id)}
                            onToggleExpand={(force) => setExpanded(s => {
                              const n = new Set(s);
                              (force === true || !n.has(item.id)) ? n.add(item.id) : n.delete(item.id);
                              return n;
                            })}
                            editing={editingItem === item.id}
                            onStartEdit={() => setEditingItem(item.id)}
                            onStopEdit={() => setEditingItem(null)}
                            onMutateItem={mutateItem} onMutateSub={mutateSub}
                            onAddSub={addSub} onDeleteSub={deleteSub}
                            onDeleteItem={deleteItem} onDuplicateItem={duplicateItem}
                            onMoveItem={moveItemTo}
                            dragProps={dragProps(group.id, item.id, realIndex)}
                            dropIndicator={dt === 'end' ? null : dt}
                          />
                        );
                      })}
                      {shown.length === 0 && group.items.length > 0 && (
                        <div className="bd-row note" style={{ '--rail': group.color }}>Inga objekt matchar filtren i den här gruppen</div>
                      )}
                      <AddItemRow group={group} visibleCols={visibleCols} onAdd={addItem}
                        registerFocus={(gid, fn) => { focusFns.current[gid] = fn; }} />
                      <GroupSummaryRow group={group} visibleCols={visibleCols} />
                      {dropTarget && dropTarget.groupId === group.id && dropTarget.index === -1 && (
                        <div className="bd-drop-end" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </section>
              );
            })}
            <div className="bd-board-foot">
              <button className="bd-btn ghost" onClick={addGroup}><Plus size={14} /> Lägg till grupp</button>
              <span className="bd-tool-flex" />
              {board.archived.length > 0 && (
                <button className="bd-btn ghost dim" onClick={() => setArchiveOpen(true)}>
                  <Archive size={13} /> Arkiv ({board.archived.length})
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {selection.size > 0 && (
        <BulkBar
          count={selection.size} groups={board.groups}
          onSetStatus={bulkSetStatus} onMoveTo={bulkMoveTo}
          onDuplicate={bulkDuplicate} onDelete={bulkDelete} onClear={clearSelection}
        />
      )}
      {autoOpen && (
        <AutomationsModal
          automations={board.automations} groups={board.groups}
          onChange={(next) => apply(b => { b.automations = next; return b; })}
          onClose={() => setAutoOpen(false)}
        />
      )}
      {archiveOpen && (
        <ArchivePanel
          archived={board.archived}
          onRestore={restoreGroup} onDeleteForever={deleteForever}
          onClose={() => setArchiveOpen(false)}
        />
      )}
      <Toast toast={toast} onDismiss={dismissToast} />
      <BoardStyles />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Stilar
   ═══════════════════════════════════════════════════════════ */

function BoardStyles() {
  return (
    <style>{`
      /* ── Skal ── */
      .board-root {
        min-height: 100vh;
        background: var(--color-bg);
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
        position: relative;
        --row-h: 38px;
        --rail-w: 4px;
        /* High-tech display-typsnitt + mjuka lager-skuggor */
        --font-tech: "Space Grotesk", var(--font-display, "Montserrat"), sans-serif;
        --shadow-soft:  0 1px 2px rgba(0,0,0,0.16), 0 8px 24px -8px rgba(0,0,0,0.30);
        --shadow-float: 0 2px 6px rgba(0,0,0,0.18), 0 18px 50px -12px rgba(0,0,0,0.45);
        --shadow-glow:  0 0 0 1px rgba(255,88,45,0.30), 0 8px 36px -6px rgba(255,88,45,0.28);
        --grad-accent:  linear-gradient(135deg, #FF7A45 0%, var(--color-accent) 55%, #E8431B 100%);
      }
      /* Ambient bakgrundsglow — fast bakom hela tavlan */
      .board-root::before {
        content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
        background:
          radial-gradient(60% 50% at 82% 0%, rgba(255,88,45,0.10), transparent 70%),
          radial-gradient(55% 50% at 8% 12%, rgba(58,165,156,0.08), transparent 68%),
          radial-gradient(70% 60% at 50% 108%, rgba(124,92,224,0.07), transparent 72%);
        animation: bd-ambient 22s ease-in-out infinite alternate;
      }
      [data-theme="light"] .board-root::before {
        background:
          radial-gradient(60% 50% at 82% 0%, rgba(255,88,45,0.07), transparent 70%),
          radial-gradient(55% 50% at 8% 12%, rgba(30,128,119,0.06), transparent 68%),
          radial-gradient(70% 60% at 50% 108%, rgba(124,92,224,0.05), transparent 72%);
      }
      .board-root > * { position: relative; z-index: 1; }
      .board-root *, .board-root *::before, .board-root *::after { box-sizing: border-box; }
      .board-root button { font-family: inherit; }
      .bd-main {
        margin-left: 124px;
        padding: 34px 36px 140px;
        max-width: 1480px;
      }

      /* ── Sidopanel (AI Labb-skalet) ── */
      .tl-sidebar {
        position: fixed; left: 20px; top: 20px;
        width: 72px; border-radius: 9999px;
        background: color-mix(in oklch, var(--color-surface) 88%, transparent);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--color-border);
        box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1);
        display: flex; flex-direction: column; align-items: center;
        gap: 4px; padding: 14px 0; z-index: 100;
        animation: bd-fade 450ms var(--ease-out) both;
      }
      .s-logo {
        display: flex; align-items: center; justify-content: center;
        width: 42px; height: 38px; flex-shrink: 0; margin-bottom: 2px;
        color: var(--color-text); text-decoration: none; border: 0;
        transition: filter var(--dur-base) var(--ease-out);
      }
      .s-logo:hover { filter: drop-shadow(0 0 10px rgba(255,88,45,0.5)); }
      .s-logo svg { height: 26px; width: auto; }
      .s-btn {
        width: 40px; height: 40px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: var(--color-text-muted);
        background: transparent; border: 0; outline: none; text-decoration: none;
        flex-shrink: 0; position: relative;
        transition: background 180ms var(--ease-out), color 180ms var(--ease-out);
      }
      .s-btn:hover { background: var(--color-surface-2); color: var(--color-text); }
      .s-btn:focus-visible { box-shadow: 0 0 0 2px var(--color-accent); }
      .s-sep { width: 28px; height: 1px; background: var(--color-border); margin: 5px 0; flex-shrink: 0; }
      .s-spacer { flex: 1; min-height: 4px; }
      .s-apps { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; padding: 0 4px; }
      .s-app-item {
        display: flex; flex-direction: column; align-items: center; gap: 5px;
        text-decoration: none; color: inherit; border: 0; outline: none; cursor: pointer;
        width: 60px; border-radius: 10px; padding: 7px 0 6px; flex-shrink: 0;
        transition: background 180ms var(--ease-out);
      }
      .s-app-item:hover { background: var(--color-surface-2); }
      .s-app-item:focus-visible { box-shadow: 0 0 0 2px var(--color-accent); }
      .s-bubble {
        width: 38px; height: 38px; border-radius: 11px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: transform 220ms var(--ease-spring), box-shadow 200ms var(--ease-out);
      }
      .s-app-item:hover .s-bubble { transform: scale(1.1) translateY(-2px); box-shadow: 0 5px 14px rgba(0,0,0,0.22); }
      .ib-todo      { background: linear-gradient(135deg,rgba(34,197,94,.15),rgba(22,163,74,.25)); border: 1px solid rgba(34,197,94,.26); color: #4ADE80; }
      .ib-kampanj   { background: linear-gradient(135deg,rgba(245,158,11,.15),rgba(251,191,36,.22)); border: 1px solid rgba(245,158,11,.30); color: #FCD34D; }
      .ib-seo       { background: linear-gradient(135deg,rgba(99,102,241,.15),rgba(129,140,248,.23)); border: 1px solid rgba(99,102,241,.28); color: #A5B4FC; }
      .ib-trackr    { background: linear-gradient(135deg,rgba(236,72,153,.14),rgba(219,39,119,.23)); border: 1px solid rgba(236,72,153,.28); color: #F472B6; }
      .ib-brus      { background: linear-gradient(135deg,rgba(214,255,61,.12),rgba(184,232,50,.18)); border: 1px solid rgba(214,255,61,.28); color: #D6FF3D; }
      .ib-portfolio { background: linear-gradient(135deg,rgba(34,211,238,.14),rgba(6,182,212,.22)); border: 1px solid rgba(34,211,238,.28); color: #22D3EE; }
      .ib-musik     { background: linear-gradient(135deg,rgba(168,85,247,.16),rgba(99,102,241,.22)); border: 1px solid rgba(168,85,247,.30); color: #C084FC; }
      .s-app-item.active .s-bubble { box-shadow: 0 0 0 1.5px rgba(255,88,45,0.55), 0 0 14px rgba(255,88,45,0.28); }
      .s-app-item.active .s-icon-label { color: var(--color-accent); font-weight: 600; }
      .s-icon-label {
        font-size: 10px; font-family: var(--font-display); font-weight: 500;
        color: var(--color-text-faint); text-align: center; line-height: 1;
        transition: color 150ms var(--ease-out);
      }
      .s-app-item:hover .s-icon-label { color: var(--color-text-muted); }
      .s-user-btn { padding: 0; }
      .s-avatar-el {
        width: 34px; height: 34px; border-radius: 50%;
        background: linear-gradient(135deg, var(--color-accent-hover), var(--color-accent));
        color: #fff; font-size: 14px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        box-shadow: 0 0 0 2px rgba(255,88,45,0.25);
      }
      .tl-side-user { position: relative; }
      .tl-side-user-pop {
        position: absolute; left: calc(100% + 12px); bottom: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08); z-index: 120;
        animation: bd-fade 160ms var(--ease-out) both;
      }
      .tl-side-user-name {
        font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--color-text-faint); padding: 6px 10px 8px;
      }
      .tl-side-user-pop button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 10px; background: transparent; border: 0; border-radius: 6px;
        color: var(--color-text-muted); font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: background 150ms, color 150ms;
      }
      .tl-side-user-pop button:hover { background: rgba(255,88,45,0.12); color: var(--color-accent); }
      .theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 0; border-radius: 50%; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; flex-shrink: 0;
        transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform 300ms var(--ease-spring);
      }
      .theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); transform: rotate(18deg) scale(1.1); }
      .theme-toggle:active { transform: rotate(36deg) scale(0.9); }

      /* ── Huvud ── */
      .bd-head { margin-bottom: 18px; animation: bd-rise 420ms var(--ease-out) both; }
      .bd-eyebrow {
        font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
        color: var(--color-text-faint);
      }
      .bd-title-row { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
      .bd-title {
        display: flex; align-items: center; gap: 10px;
        background: none; border: 0; padding: 0; cursor: pointer; color: inherit;
        border-radius: 8px;
      }
      .bd-title h1 {
        margin: 0; font-family: var(--font-tech);
        font-size: clamp(26px, 3.4vw, 34px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1;
        background: linear-gradient(180deg, var(--color-text) 30%, color-mix(in srgb, var(--color-text) 62%, var(--color-accent)) 130%);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
      }
      .bd-eyebrow { font-family: var(--font-tech); }
      .bd-title-pen { color: var(--color-text-faint); opacity: 0; transition: opacity 150ms var(--ease-out); }
      .bd-title:hover .bd-title-pen { opacity: 1; }
      .bd-title:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }
      .bd-edit-input.board-title {
        font-family: var(--font-display); font-size: clamp(26px, 3.4vw, 34px); font-weight: 800;
        letter-spacing: -0.02em; padding: 0 6px; max-width: 520px;
      }
      .bd-save { font-size: 12px; font-weight: 600; color: var(--color-text-faint); transition: color 200ms; }
      .bd-save.saving { color: var(--color-warn); }
      .bd-save.saved  { color: var(--color-success); }
      .bd-save.error  { color: var(--color-accent); }
      .bd-stats { margin: 6px 0 0; font-size: 13px; color: var(--color-text-muted); }
      .bd-stats-overdue { color: var(--color-accent); font-weight: 600; }

      /* ── Knappar ── */
      .bd-btn {
        display: inline-flex; align-items: center; gap: 7px;
        border: 1px solid transparent; border-radius: 8px;
        font-size: 13px; font-weight: 600; padding: 8px 13px;
        cursor: pointer; white-space: nowrap;
        transition: background 150ms var(--ease-out), color 150ms var(--ease-out),
                    border-color 150ms var(--ease-out), transform 150ms var(--ease-out),
                    box-shadow 200ms var(--ease-out);
      }
      .bd-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      .bd-btn.primary {
        background: var(--grad-accent); color: #fff;
        box-shadow: 0 2px 10px rgba(255,88,45,0.32), inset 0 1px 0 rgba(255,255,255,0.25);
        position: relative; overflow: hidden;
      }
      /* Skimmer-svep över primärknappen */
      .bd-btn.primary::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
        transform: translateX(-120%); transition: transform 600ms var(--ease-out);
      }
      .bd-btn.primary:hover::before { transform: translateX(120%); }
      .bd-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(255,88,45,0.45), inset 0 1px 0 rgba(255,255,255,0.3); }
      .bd-btn.primary:active { transform: translateY(0); }
      .bd-btn.primary.lg { font-size: 14px; padding: 11px 18px; border-radius: 10px; }
      .bd-btn.ghost {
        background: transparent; color: var(--color-text-muted);
        border-color: transparent;
      }
      .bd-btn.ghost:hover { background: var(--color-surface-2); color: var(--color-text); }
      .bd-btn.ghost.on { color: var(--color-text); background: var(--color-surface-2); border-color: var(--color-border); }
      .bd-btn.ghost.sm { font-size: 12px; padding: 6px 10px; }
      .bd-btn.ghost.dim { color: var(--color-text-faint); }
      .bd-btn.auto {
        background: transparent; color: var(--color-text-muted); border-color: transparent;
      }
      .bd-btn.auto:hover { background: rgba(255,88,45,0.1); color: var(--color-accent); }
      .bd-btn.auto.on { color: var(--color-accent); }
      .bd-chip {
        min-width: 17px; height: 17px; padding: 0 4px; border-radius: 999px;
        background: var(--grad-accent); color: #fff;
        font-size: 10.5px; font-weight: 700; line-height: 17px; text-align: center;
        box-shadow: 0 0 0 1px rgba(255,88,45,0.4), 0 2px 8px rgba(255,88,45,0.45);
        animation: bd-pop 220ms var(--ease-spring) both;
      }
      .bd-chip.zap { background: var(--grad-accent); }
      .bd-icon-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 28px; height: 28px; border-radius: 7px;
        background: transparent; border: 0; color: var(--color-text-faint); cursor: pointer;
        transition: background 140ms var(--ease-out), color 140ms var(--ease-out);
      }
      .bd-icon-btn:hover { background: var(--color-surface-3); color: var(--color-text); }
      .bd-icon-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 1px; }
      .bd-icon-btn.danger:hover { background: rgba(255,88,45,0.14); color: var(--color-accent); }
      .bd-icon-btn.light { color: rgba(255,255,255,0.75); }
      .bd-icon-btn.light:hover { background: rgba(255,255,255,0.14); color: #fff; }
      .bd-icon-btn.sm { width: 22px; height: 22px; }

      /* ── Verktygsrad ── */
      .bd-toolbar {
        display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
        padding: 8px 0 14px; position: relative;
        animation: bd-rise 420ms 60ms var(--ease-out) both;
      }
      .bd-tool-sep { width: 1px; height: 22px; background: var(--color-border); margin: 0 6px; }
      .bd-tool-flex { flex: 1; }
      .bd-search { display: inline-flex; align-items: center; }
      .bd-search-input {
        width: 200px; padding: 7px 11px; margin-left: 2px;
        border: 1px solid var(--color-border); border-radius: 8px;
        background: var(--color-surface); color: var(--color-text);
        font-family: inherit; font-size: 13px;
        animation: bd-grow 200ms var(--ease-out) both;
      }
      .bd-search-input:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(255,88,45,0.15); }

      /* ── Popover ── */
      .bd-pop {
        position: fixed; z-index: 600;
        background: color-mix(in oklch, var(--color-surface) 85%, transparent);
        backdrop-filter: blur(24px) saturate(1.4); -webkit-backdrop-filter: blur(24px) saturate(1.4);
        border: 1px solid color-mix(in srgb, var(--color-border-strong) 60%, transparent);
        border-radius: 13px; padding: 6px;
        box-shadow: 0 24px 60px -16px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
        animation: bd-pop-in 170ms var(--ease-spring) both;
      }
      .bd-pop-list { display: flex; flex-direction: column; gap: 1px; max-height: 320px; overflow-y: auto; }
      .bd-pop-label {
        font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
        color: var(--color-text-faint); padding: 7px 9px 5px;
      }
      .bd-pop-item {
        display: flex; align-items: center; gap: 9px; width: 100%;
        padding: 8px 9px; border: 0; border-radius: 7px; background: transparent;
        color: var(--color-text-muted); font-size: 13px; font-weight: 500; text-align: left;
        cursor: pointer; transition: background 130ms, color 130ms;
      }
      .bd-pop-item:hover { background: var(--color-surface-2); color: var(--color-text); }
      .bd-pop-item:disabled { opacity: 0.4; cursor: default; }
      .bd-pop-item:disabled:hover { background: transparent; color: var(--color-text-muted); }
      .bd-pop-item.danger:hover { background: rgba(255,88,45,0.12); color: var(--color-accent); }
      .bd-pop-item.indent { padding-left: 26px; }
      .bd-pop-item-grow { flex: 1; }
      .bd-pop-item > svg:last-child { margin-left: auto; color: var(--color-success); }
      .bd-pop-item.danger > svg:last-child, .bd-pop-item.indent > svg:last-child { color: inherit; }
      .bd-pop-sep { height: 1px; background: var(--color-border); margin: 5px 4px; }
      .bd-pop-caret { margin-left: auto; transition: transform 160ms var(--ease-out); color: var(--color-text-faint); }
      .bd-pop-caret.open { transform: rotate(90deg); }
      .bd-color-row { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 9px; }
      .bd-color-swatch {
        width: 24px; height: 24px; border-radius: 7px; border: 2px solid transparent;
        cursor: pointer; transition: transform 140ms var(--ease-spring), border-color 140ms;
      }
      .bd-color-swatch:hover { transform: scale(1.15); }
      .bd-color-swatch.active { border-color: var(--color-text); }
      .bd-color-dot { width: 10px; height: 10px; border-radius: 4px; flex-shrink: 0; }
      .bd-color-dot.lg { width: 14px; height: 14px; border-radius: 5px; }
      .bd-filter-pills { display: flex; flex-wrap: wrap; gap: 5px; padding: 2px 9px 8px; }
      .bd-filter-pill {
        border: 1.5px solid var(--pill); color: var(--pill); background: transparent;
        font-size: 11.5px; font-weight: 700; padding: 4px 9px; border-radius: 999px; cursor: pointer;
        transition: background 140ms, color 140ms, transform 140ms var(--ease-spring);
      }
      .bd-filter-pill:hover { transform: translateY(-1px); }
      .bd-filter-pill.on { background: var(--pill); color: #fff; }

      /* ── Grupper ── */
      .bd-board { display: flex; flex-direction: column; gap: 22px; overflow-x: auto; padding: 2px 2px 8px; }
      .bd-group {
        min-width: 1010px;
        background: color-mix(in oklch, var(--color-surface) 82%, transparent);
        backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: var(--shadow-soft);
        animation: bd-rise 420ms var(--ease-out) both;
        transition: box-shadow 300ms var(--ease-out), border-color 300ms var(--ease-out), transform 300ms var(--ease-out);
      }
      .bd-group:hover {
        border-color: color-mix(in srgb, var(--gcolor) 40%, var(--color-border));
        box-shadow: var(--shadow-float), 0 0 0 1px color-mix(in srgb, var(--gcolor) 22%, transparent),
                    0 22px 60px -22px color-mix(in srgb, var(--gcolor) 55%, transparent);
      }
      .bd-group-head {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 14px 12px 12px;
        border-left: var(--rail-w) solid var(--gcolor);
        position: relative;
        background: linear-gradient(180deg, color-mix(in srgb, var(--gcolor) 9%, transparent), transparent 70%);
      }
      /* Lysande accentskena längst upp i gruppen */
      .bd-group-head::after {
        content: ''; position: absolute; left: 0; top: 0; height: 2px; width: 100%;
        background: linear-gradient(90deg, var(--gcolor), transparent 60%);
        opacity: 0; transition: opacity 300ms var(--ease-out);
      }
      .bd-group:hover .bd-group-head::after { opacity: 0.7; }
      .bd-collapse {
        display: inline-flex; align-items: center; justify-content: center;
        width: 26px; height: 26px; border-radius: 7px; border: 0;
        background: transparent; color: var(--gcolor); cursor: pointer;
        transition: transform 220ms var(--ease-spring), background 140ms;
      }
      .bd-collapse:hover { background: var(--color-surface-2); }
      .bd-collapse.closed { transform: rotate(-90deg); }
      .bd-group-title {
        background: none; border: 0; padding: 3px 7px; margin-left: -5px;
        font-family: var(--font-display); font-size: 16.5px; font-weight: 700;
        color: var(--gcolor); cursor: pointer; border-radius: 7px;
        max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        transition: background 140ms;
      }
      .bd-group-title:hover { background: var(--color-surface-2); }
      .bd-edit-input {
        border: 1px solid var(--color-accent); border-radius: 7px;
        background: var(--color-bg); color: var(--color-text);
        font-family: inherit; font-size: 13.5px; font-weight: 500;
        padding: 5px 8px; width: 100%; min-width: 0;
        box-shadow: 0 0 0 3px rgba(255,88,45,0.14);
      }
      .bd-edit-input:focus { outline: none; }
      .bd-edit-input.group-title {
        font-family: var(--font-display); font-size: 16px; font-weight: 700; max-width: 320px;
      }
      .bd-group-count { font-size: 12px; font-weight: 500; color: var(--color-text-faint); white-space: nowrap; }
      .bd-group-flex { flex: 1; }
      .bd-collapsed-dist { width: 220px; margin-left: 8px; }
      .group-menu { opacity: 0; }
      .bd-group-head:hover .group-menu, .group-menu:focus-visible { opacity: 1; }

      /* Klart-stämpeln */
      .bd-stamp {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        font-size: 16px; line-height: 1; color: var(--color-success);
        border: 1.5px solid var(--color-success); border-radius: 6px;
        padding: 3px 9px 2px; transform: rotate(-4deg);
        animation: bd-stamp-in 360ms var(--ease-spring) both;
        text-shadow: 0 0 12px rgba(59,165,93,0.4);
      }

      /* ── Tabellen ── */
      .bd-table { border-top: 1px solid var(--color-border); }
      .bd-row {
        display: grid; align-items: center;
        min-height: var(--row-h);
        border-left: var(--rail-w) solid var(--rail);
        border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
        position: relative;
        background: transparent;
        transition: background 130ms var(--ease-out);
      }
      .bd-row:not(.header):not(.add):not(.summary):not(.note):hover { background: var(--color-surface-2); }
      .bd-row.selected { background: color-mix(in srgb, var(--color-accent) 9%, var(--color-surface)); }
      .bd-row.dragging { opacity: 0.35; }
      .bd-row.drop-before::before, .bd-row.drop-after::after {
        content: ''; position: absolute; left: 0; right: 0; height: 2.5px;
        background: var(--color-accent); z-index: 5;
        box-shadow: 0 0 8px rgba(255,88,45,0.6);
      }
      .bd-row.drop-before::before { top: -1.5px; }
      .bd-row.drop-after::after { bottom: -1.5px; }
      .bd-drop-end { height: 2.5px; background: var(--color-accent); box-shadow: 0 0 8px rgba(255,88,45,0.6); }
      .bd-row.header {
        min-height: 34px;
        background: color-mix(in srgb, var(--color-surface-2) 55%, var(--color-surface));
        border-bottom: 1px solid var(--color-border);
      }
      .bd-row.note {
        display: flex; padding: 10px 14px; font-size: 12.5px; color: var(--color-text-faint); font-style: italic;
      }
      .bd-row.summary { min-height: 42px; border-bottom: 0; background: color-mix(in srgb, var(--color-surface-2) 35%, var(--color-surface)); }
      .bd-cell {
        display: flex; align-items: center; gap: 6px;
        padding: 0 8px; min-width: 0; height: 100%;
        border-right: 1px solid color-mix(in srgb, var(--color-border) 55%, transparent);
        position: relative;
      }
      .bd-cell:last-child, .bd-cell.end { border-right: 0; justify-content: center; }
      .bd-cell.check { justify-content: flex-start; padding-left: 6px; gap: 2px; }
      .bd-cell.name { justify-content: flex-start; padding-left: 2px; }
      .bd-cell.muted { font-size: 12px; color: var(--color-text-faint); font-weight: 500; }
      .bd-col-btn {
        background: none; border: 0; cursor: pointer;
        font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em;
        color: var(--color-text-faint); justify-content: flex-start;
        transition: color 130ms;
      }
      .bd-col-btn.center { justify-content: center; }
      .bd-col-btn:hover { color: var(--color-text); }
      .bd-col-static {
        font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em;
        color: var(--color-text-faint); justify-content: flex-start;
      }
      .bd-col-static.center { justify-content: center; }
      .bd-sort-icon { opacity: 0; transition: opacity 130ms; }
      .bd-col-btn:hover .bd-sort-icon { opacity: 0.6; }
      .bd-sort-icon.active { opacity: 1 !important; color: var(--color-accent); }
      .bd-check {
        appearance: none; width: 15px; height: 15px; border-radius: 4.5px;
        border: 1.5px solid var(--color-border-strong); background: transparent;
        cursor: pointer; display: inline-grid; place-content: center; flex-shrink: 0;
        transition: background 130ms, border-color 130ms, transform 130ms var(--ease-spring);
      }
      .bd-check:hover { border-color: var(--color-accent); }
      .bd-check:checked { background: var(--color-accent); border-color: var(--color-accent); transform: scale(1.05); }
      .bd-check:checked::before {
        content: ''; width: 8px; height: 8px;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        background: #fff;
      }
      .bd-check:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 1px; }
      .bd-grip { color: var(--color-text-faint); opacity: 0; cursor: grab; display: inline-flex; }
      .bd-row:hover .bd-grip { opacity: 0.7; }
      .bd-row.add .bd-cell, .bd-row.summary .bd-cell, .bd-row.header .bd-cell { border-right-color: transparent; }

      /* Namn + expander */
      .bd-expander {
        display: inline-flex; align-items: center; gap: 2px;
        border: 0; background: transparent; color: var(--color-text-faint);
        padding: 3px; border-radius: 5px; cursor: pointer; opacity: 0;
        transition: opacity 140ms, transform 200ms var(--ease-spring), color 140ms;
        flex-shrink: 0;
      }
      .bd-expander.has-subs { opacity: 1; color: var(--color-text-muted); }
      .bd-row:hover .bd-expander { opacity: 1; }
      .bd-expander:hover { color: var(--color-text); background: var(--color-surface-3); }
      .bd-expander.open > svg { transform: rotate(90deg); }
      .bd-expander > svg { transition: transform 200ms var(--ease-spring); }
      .bd-sub-count {
        font-size: 10px; font-weight: 700; color: var(--color-text-muted);
        background: var(--color-surface-3); border-radius: 999px; padding: 1px 5px;
      }
      .bd-name-btn {
        background: none; border: 0; padding: 4px 6px; border-radius: 6px;
        font-family: inherit; font-size: 13.5px; font-weight: 500; color: var(--color-text);
        text-align: left; cursor: text; min-width: 0; max-width: 100%;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        transition: background 130ms;
      }
      .bd-name-btn:hover { background: var(--color-surface-3); }
      .bd-name-btn.done { color: var(--color-text-muted); text-decoration: line-through; text-decoration-color: rgba(59,165,93,0.6); }
      .bd-name-btn.sub { font-size: 12.5px; }

      /* Lägg till-rad */
      .bd-row.add { border-bottom: 1px solid var(--color-border); }
      .bd-add-plus { color: var(--color-text-faint); margin-left: 20px; }
      .bd-add-input {
        width: 100%; border: 0; background: transparent; color: var(--color-text);
        font-family: inherit; font-size: 13px; padding: 9px 6px;
      }
      .bd-add-input::placeholder { color: var(--color-text-faint); }
      .bd-add-input:focus { outline: none; }
      .bd-row.add:focus-within { background: var(--color-surface-2); }
      .bd-add-input.sub { font-size: 12.5px; padding: 7px 6px; }

      /* ── Cellinnehåll ── */
      .bd-status {
        width: 100%; height: 30px; border: 0; border-radius: 7px;
        color: #fff; font-family: inherit; font-size: 12px; font-weight: 700;
        cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.22);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -8px 14px -8px rgba(0,0,0,0.35);
        transition: filter 140ms, transform 140ms var(--ease-out), box-shadow 180ms;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 6px;
      }
      .bd-status:hover { filter: brightness(1.1) saturate(1.05); box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 14px rgba(0,0,0,0.3); }
      .bd-status:active { transform: scale(0.97); }
      .bd-status:focus-visible { outline: 2px solid #fff; outline-offset: -3px; }
      .bd-status.small { height: 24px; font-size: 11px; border-radius: 5px; }
      .bd-status-grid { display: flex; flex-direction: column; gap: 5px; padding: 3px; }
      .bd-status-opt {
        display: flex; align-items: center; justify-content: center; gap: 7px;
        height: 32px; border: 0; border-radius: 6px;
        color: #fff; font-family: inherit; font-size: 12.5px; font-weight: 700;
        cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.22);
        transition: transform 140ms var(--ease-spring), filter 140ms;
      }
      .bd-status-opt:hover { transform: scale(1.03); filter: brightness(1.1); }
      .bd-prio {
        display: inline-flex; align-items: center; justify-content: center; gap: 5px;
        width: 100%; height: 26px; border: 0; border-radius: 999px;
        color: #fff; font-family: inherit; font-size: 11.5px; font-weight: 700;
        cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
        transition: filter 140ms, transform 140ms var(--ease-out), box-shadow 180ms;
      }
      .bd-prio:hover { filter: brightness(1.1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 3px 10px rgba(0,0,0,0.22); }
      .bd-prio.empty { background: transparent; border: 1.5px dashed var(--color-border-strong); color: var(--color-text-faint); text-shadow: none; }
      .bd-prio.empty:hover { border-color: var(--color-text-muted); color: var(--color-text-muted); }
      .bd-dash { font-weight: 600; }
      .bd-person { background: none; border: 0; padding: 2px; cursor: pointer; border-radius: 50%; display: inline-flex; }
      .bd-person:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 1px; }
      .bd-person-empty {
        display: inline-flex; align-items: center; justify-content: center;
        border: 1.5px dashed var(--color-border-strong); border-radius: 50%;
        color: var(--color-text-faint); transition: border-color 140ms, color 140ms;
      }
      .bd-person:hover .bd-person-empty { border-color: var(--color-text-muted); color: var(--color-text-muted); }
      .bd-avatar {
        display: inline-flex; align-items: center; justify-content: center;
        border-radius: 50%; color: #fff; font-weight: 700; flex-shrink: 0;
        box-shadow: 0 0 0 2px var(--color-surface); text-shadow: 0 1px 1px rgba(0,0,0,0.2);
      }
      .bd-avatar-stack { display: inline-flex; }
      .bd-avatar-stack .bd-avatar:not(:first-child) { margin-left: -7px; }
      .bd-avatar-more {
        margin-left: -7px; width: 22px; height: 22px; border-radius: 50%;
        background: var(--color-surface-3); color: var(--color-text-muted);
        font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 2px var(--color-surface);
      }
      .bd-date {
        display: inline-flex; align-items: center; gap: 6px; position: relative;
        width: 100%; height: 28px; padding: 0 8px; border-radius: 6px;
        font-size: 12px; font-weight: 600; color: var(--color-text-muted);
        cursor: pointer; transition: background 140ms;
      }
      .bd-date:hover { background: var(--color-surface-3); }
      .bd-date.empty { color: var(--color-text-faint); }
      .bd-date.empty span { opacity: 0; transition: opacity 140ms; }
      .bd-date.empty:hover span { opacity: 1; }
      .bd-date.overdue { color: var(--color-accent); }
      .bd-date input[type="date"] {
        position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
      }
      .bd-date input[type="date"]::-webkit-calendar-picker-indicator { position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer; }
      .bd-overdue-dot {
        width: 7px; height: 7px; border-radius: 50%; background: var(--color-accent);
        box-shadow: 0 0 0 0 rgba(255,88,45,0.5); animation: bd-pulse 1.8s ease-out infinite;
      }
      .bd-overdue-dot.static { animation: none; }
      .bd-timeline {
        position: relative; width: 100%; height: 26px; border: 0; border-radius: 999px;
        color: #fff; cursor: pointer; overflow: hidden;
        font-family: inherit;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.22);
        transition: filter 140ms, box-shadow 180ms;
      }
      .bd-timeline:hover { filter: brightness(1.1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 14px rgba(0,0,0,0.28); }
      .bd-timeline:focus-visible { outline: 2px solid #fff; outline-offset: -3px; }
      .bd-timeline.empty {
        background: transparent; border: 1.5px dashed var(--color-border-strong);
        color: var(--color-text-faint);
      }
      .bd-timeline.empty:hover { border-color: var(--color-text-muted); color: var(--color-text-muted); filter: none; box-shadow: none; }
      .bd-timeline.mini { max-width: 156px; cursor: default; }
      .bd-timeline-elapsed {
        position: absolute; left: 0; top: 0; bottom: 0;
        background: rgba(0,0,0,0.3); pointer-events: none;
        transition: width 600ms var(--ease-out);
      }
      .bd-timeline-label {
        position: relative; z-index: 1; font-size: 11px; font-weight: 700;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3); white-space: nowrap;
        display: flex; align-items: center; justify-content: center; height: 100%; padding: 0 8px;
      }
      .bd-timeline.empty .bd-timeline-label { text-shadow: none; }
      .bd-tl-edit { display: flex; flex-direction: column; gap: 8px; padding: 8px; }
      .bd-tl-edit label {
        display: flex; flex-direction: column; gap: 4px;
        font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--color-text-faint);
      }
      .bd-tl-edit input[type="date"] {
        border: 1px solid var(--color-border); border-radius: 7px;
        background: var(--color-bg); color: var(--color-text);
        font-family: inherit; font-size: 13px; padding: 7px 9px;
        color-scheme: dark;
      }
      [data-theme="light"] .bd-tl-edit input[type="date"] { color-scheme: light; }
      .bd-tl-edit input[type="date"]:focus { outline: none; border-color: var(--color-accent); }

      /* Gruppcell */
      .bd-groupcell {
        display: inline-flex; align-items: center; gap: 7px;
        width: 100%; height: 28px; padding: 0 8px; border-radius: 6px;
        background: transparent; border: 0; cursor: pointer;
        font-family: inherit; font-size: 12px; font-weight: 600; color: var(--color-text-muted);
        transition: background 140ms;
      }
      .bd-groupcell:hover { background: var(--color-surface-3); }
      .bd-groupcell:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 1px; }
      .bd-groupcell-label { flex: 1; min-width: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .bd-groupcell-caret { color: var(--color-text-faint); flex-shrink: 0; opacity: 0; transition: opacity 140ms; }
      .bd-groupcell:hover .bd-groupcell-caret { opacity: 1; }

      /* Fördelningsstapel */
      .bd-dist {
        display: flex; width: 100%; max-width: 124px; height: 22px;
        border-radius: 5px; overflow: hidden; background: var(--color-surface-3);
      }
      .bd-dist.empty { opacity: 0.4; }
      .bd-dist-seg { height: 100%; transition: width 450ms var(--ease-out); min-width: 0; }

      /* ── Underobjekt ── */
      .bd-subwrap {
        border-left: var(--rail-w) solid var(--rail);
        border-bottom: 1px solid var(--color-border);
        background: color-mix(in srgb, var(--color-bg) 45%, var(--color-surface));
        animation: bd-grow-down 220ms var(--ease-out) both;
      }
      .bd-subrow {
        display: grid; align-items: center; min-height: 32px;
        border-bottom: 1px dashed color-mix(in srgb, var(--color-border) 60%, transparent);
      }
      .bd-subrow:last-child { border-bottom: 0; }
      .bd-subrow:not(.add):hover { background: var(--color-surface-2); }
      .bd-subrow .bd-cell { border-right: 0; }
      .bd-subrow .bd-cell.check.sub-elbow {
        justify-content: flex-end; padding-right: 8px; gap: 0; color: var(--color-text-faint);
      }
      .bd-subrow .bd-cell.name.sub { padding-left: 4px; }

      /* ── Modal & automationer ── */
      .bd-overlay {
        position: fixed; inset: 0; z-index: 400;
        background: rgba(0,0,0,0.55); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
        display: flex; align-items: flex-start; justify-content: center;
        padding: 9vh 20px 40px; overflow-y: auto;
        animation: bd-fade 180ms var(--ease-out) both;
      }
      .bd-modal {
        width: 660px; max-width: 100%;
        background: color-mix(in oklch, var(--color-surface) 88%, transparent);
        backdrop-filter: blur(28px) saturate(1.4); -webkit-backdrop-filter: blur(28px) saturate(1.4);
        border: 1px solid color-mix(in srgb, var(--color-border-strong) 55%, transparent);
        border-radius: 20px;
        box-shadow: 0 40px 90px -20px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
        animation: bd-modal-in 280ms var(--ease-spring) both;
      }
      .bd-modal.narrow { width: 520px; }
      .bd-modal-head {
        display: flex; align-items: flex-start; gap: 13px;
        padding: 20px 20px 14px; border-bottom: 1px solid var(--color-border);
      }
      .bd-modal-head h2 { margin: 0; font-family: var(--font-display); font-size: 19px; font-weight: 800; letter-spacing: -0.01em; }
      .bd-modal-head p { margin: 3px 0 0; font-size: 12.5px; color: var(--color-text-muted); }
      .bd-modal-head > div { flex: 1; }
      .bd-modal-zap {
        width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, rgba(255,88,45,0.2), rgba(255,120,55,0.32));
        border: 1px solid rgba(255,88,45,0.4); color: var(--color-accent);
      }
      .bd-modal-zap.dim { background: var(--color-surface-2); border-color: var(--color-border); color: var(--color-text-muted); }
      .bd-modal-body { padding: 14px 20px 20px; display: flex; flex-direction: column; gap: 10px; }
      .bd-recipe {
        display: flex; align-items: center; gap: 12px;
        padding: 13px 14px; border: 1px solid var(--color-border); border-radius: 11px;
        background: var(--color-bg); opacity: 0.65;
        transition: opacity 200ms var(--ease-out), border-color 200ms, box-shadow 250ms;
      }
      .bd-recipe.on { opacity: 1; border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border)); box-shadow: 0 0 0 1px rgba(255,88,45,0.12), 0 4px 18px rgba(255,88,45,0.08); }
      .bd-recipe-icon {
        width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--color-surface-2); color: var(--color-text-faint);
        transition: background 200ms, color 200ms, transform 250ms var(--ease-spring);
      }
      .bd-recipe.on .bd-recipe-icon { background: rgba(255,88,45,0.16); color: var(--color-accent); transform: rotate(-8deg); }
      .bd-recipe-text { flex: 1; font-size: 13.5px; font-weight: 500; line-height: 2; color: var(--color-text); }
      .bd-auto-select, .bd-auto-fixed {
        position: relative; display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 8px; margin: 0 2px; border-radius: 6px;
        color: #fff; font-size: 12px; font-weight: 700; white-space: nowrap;
        text-shadow: 0 1px 2px rgba(0,0,0,0.22); vertical-align: middle;
        cursor: pointer; transition: filter 140ms;
      }
      .bd-auto-fixed { cursor: default; }
      .bd-auto-select:hover { filter: brightness(1.1); }
      .bd-auto-select.unset { background: transparent; border: 1.5px dashed var(--color-border-strong); color: var(--color-text-muted); text-shadow: none; }
      .bd-auto-select select { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
      .bd-auto-select.group { max-width: 200px; }
      .bd-switch {
        width: 38px; height: 22px; border-radius: 999px; flex-shrink: 0;
        border: 0; background: var(--color-surface-3); cursor: pointer; position: relative;
        transition: background 200ms var(--ease-out);
      }
      .bd-switch.on { background: var(--color-accent); }
      .bd-switch:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      .bd-switch-knob {
        position: absolute; top: 3px; left: 3px; width: 16px; height: 16px;
        border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        transition: transform 220ms var(--ease-spring);
      }
      .bd-switch.on .bd-switch-knob { transform: translateX(16px); }

      /* ── Bulkrad ── */
      .bd-bulk {
        position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%);
        display: flex; align-items: center; gap: 6px; z-index: 350;
        background: rgba(24,24,26,0.78); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 16px; padding: 9px 12px;
        box-shadow: 0 24px 60px -12px rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
        animation: bd-bulk-in 300ms var(--ease-spring) both;
      }
      .bd-bulk-count {
        min-width: 28px; height: 28px; padding: 0 7px; border-radius: 9px;
        background: var(--color-accent); color: #fff;
        font-size: 14px; font-weight: 800;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .bd-bulk-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); margin-right: 4px; }
      .bd-bulk-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.14); margin: 0 4px; }
      .bd-bulk-btn {
        display: inline-flex; align-items: center; gap: 6px;
        background: transparent; border: 0; border-radius: 8px;
        color: rgba(255,255,255,0.85); font-family: inherit; font-size: 12.5px; font-weight: 600;
        padding: 7px 10px; cursor: pointer; transition: background 140ms, color 140ms;
      }
      .bd-bulk-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
      .bd-bulk-btn.danger:hover { background: rgba(255,88,45,0.22); color: #FF8A66; }

      /* ── Arkiv ── */
      .bd-archive-row {
        display: flex; align-items: center; gap: 12px;
        padding: 12px 13px; border: 1px solid var(--color-border); border-radius: 11px;
        background: var(--color-bg);
      }
      .bd-archive-meta { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .bd-archive-meta strong { font-size: 13.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .bd-archive-meta span { font-size: 11.5px; color: var(--color-text-faint); }
      .bd-archive-empty {
        display: flex; align-items: center; justify-content: center; gap: 9px;
        padding: 28px 0; color: var(--color-text-faint); font-size: 13px;
      }

      /* ── Toast ── */
      .bd-toast {
        position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%);
        display: flex; align-items: center; gap: 9px; z-index: 500;
        max-width: min(520px, calc(100vw - 40px));
        background: rgba(24,24,26,0.8); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4);
        color: rgba(255,255,255,0.92);
        border: 1px solid rgba(255,255,255,0.14); border-radius: 14px;
        padding: 11px 14px; font-size: 13px; font-weight: 500;
        box-shadow: 0 20px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
        animation: bd-bulk-in 280ms var(--ease-spring) both;
      }
      .bd-toast.auto { border-color: rgba(255,88,45,0.5); }
      .bd-toast.auto > svg { color: var(--color-accent); flex-shrink: 0; }
      .bd-toast-undo {
        background: none; border: 0; color: #FF8A66; font-family: inherit;
        font-size: 13px; font-weight: 700; cursor: pointer; padding: 2px 4px; border-radius: 5px;
      }
      .bd-toast-undo:hover { background: rgba(255,88,45,0.16); }

      /* ── Skelett & tomtillstånd ── */
      .bd-skeleton { display: flex; flex-direction: column; gap: 24px; padding-top: 70px; }
      .bd-skel-group {
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;
      }
      .bd-skel-bar, .bd-skel-row {
        border-radius: 7px;
        background: linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-surface-3) 50%, var(--color-surface-2) 75%);
        background-size: 200% 100%; animation: bd-shimmer 1.3s linear infinite;
      }
      .bd-skel-bar { height: 18px; } .bd-skel-bar.w40 { width: 40%; }
      .bd-skel-row { height: 34px; }
      .bd-empty {
        display: flex; flex-direction: column; align-items: center; text-align: center;
        padding: 70px 20px 40px; animation: bd-rise 450ms var(--ease-out) both;
      }
      .bd-empty h2 { margin: 22px 0 8px; font-family: var(--font-display); font-size: 22px; font-weight: 800; letter-spacing: -0.01em; }
      .bd-empty p { margin: 0 0 22px; max-width: 380px; font-size: 13.5px; line-height: 1.6; color: var(--color-text-muted); }
      .bd-empty-board { display: flex; gap: 9px; }
      .bd-empty-board span {
        width: 64px; height: 88px; border-radius: 10px;
        border: 1.5px dashed var(--color-border-strong);
        animation: bd-float 3.2s ease-in-out infinite;
      }
      .bd-empty-board span:nth-child(1) { background: linear-gradient(180deg, rgba(58,165,156,0.18), transparent); animation-delay: 0s; }
      .bd-empty-board span:nth-child(2) { background: linear-gradient(180deg, rgba(255,88,45,0.18), transparent); animation-delay: 0.4s; }
      .bd-empty-board span:nth-child(3) { background: linear-gradient(180deg, rgba(224,169,59,0.18), transparent); animation-delay: 0.8s; }
      .bd-board-foot { display: flex; align-items: center; gap: 8px; min-width: 1010px; }

      /* ── Animationer ── */
      @keyframes bd-fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes bd-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      @keyframes bd-pop { from { transform: scale(0.4); } to { transform: scale(1); } }
      @keyframes bd-pop-in { from { opacity: 0; transform: scale(0.92) translateY(-4px); } to { opacity: 1; transform: none; } }
      @keyframes bd-modal-in { from { opacity: 0; transform: scale(0.95) translateY(14px); } to { opacity: 1; transform: none; } }
      @keyframes bd-bulk-in { from { opacity: 0; transform: translate(-50%, 18px); } to { opacity: 1; transform: translate(-50%, 0); } }
      @keyframes bd-stamp-in { 0% { opacity: 0; transform: rotate(-14deg) scale(1.7); } 65% { opacity: 1; transform: rotate(-2deg) scale(0.94); } 100% { transform: rotate(-4deg) scale(1); } }
      @keyframes bd-grow { from { width: 0; opacity: 0; } to { width: 200px; opacity: 1; } }
      @keyframes bd-grow-down { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
      @keyframes bd-pulse { 0% { box-shadow: 0 0 0 0 rgba(255,88,45,0.45); } 70% { box-shadow: 0 0 0 7px rgba(255,88,45,0); } 100% { box-shadow: 0 0 0 0 rgba(255,88,45,0); } }
      @keyframes bd-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
      @keyframes bd-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
      @keyframes bd-ambient {
        0%   { transform: translate3d(0,0,0) scale(1); opacity: 0.9; }
        50%  { transform: translate3d(0,-2%,0) scale(1.06); opacity: 1; }
        100% { transform: translate3d(0,1%,0) scale(1.02); opacity: 0.85; }
      }

      /* ── Ljust tema ── */
      [data-theme="light"] .bd-bulk, [data-theme="light"] .bd-toast { background: rgba(34,33,28,0.82); }
      [data-theme="light"] .bd-status, [data-theme="light"] .bd-status-opt { text-shadow: 0 1px 1px rgba(0,0,0,0.15); }
      [data-theme="light"] .bd-pop { box-shadow: 0 14px 40px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.07); }
      [data-theme="light"] .bd-group:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.07); }

      /* ── Responsivt ── */
      @media (max-width: 900px) {
        .bd-main { margin-left: 108px; padding: 26px 18px 140px; }
        .bd-collapsed-dist { display: none; }
      }
      @media (max-width: 640px) {
        .bd-main { margin-left: 0; padding: 20px 14px 170px; }
        .tl-sidebar {
          left: 50%; transform: translateX(-50%); top: auto; bottom: 12px;
          width: auto; max-width: calc(100vw - 24px);
          flex-direction: row; padding: 6px 12px; gap: 2px;
        }
        .tl-sidebar .s-sep { width: 1px; height: 24px; margin: 0 4px; }
        .tl-sidebar .s-apps { flex-direction: row; width: auto; }
        .tl-sidebar .s-icon-label { display: none; }
        .tl-sidebar .s-app-item { width: auto; padding: 4px; }
        .tl-side-user-pop { left: auto; right: 0; bottom: calc(100% + 12px); }
        .bd-bulk { bottom: 78px; flex-wrap: wrap; justify-content: center; max-width: calc(100vw - 20px); }
        .bd-toast { bottom: 78px; }
      }

      /* ── Tillgänglighet ── */
      @media (prefers-reduced-motion: reduce) {
        .board-root *, .board-root *::before, .board-root *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Rullister */
      .bd-board::-webkit-scrollbar, .bd-pop-list::-webkit-scrollbar { height: 9px; width: 9px; }
      .bd-board::-webkit-scrollbar-thumb, .bd-pop-list::-webkit-scrollbar-thumb {
        background: var(--color-surface-3); border-radius: 999px; border: 2px solid var(--color-surface);
      }
      .bd-board::-webkit-scrollbar-track, .bd-pop-list::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  );
}
