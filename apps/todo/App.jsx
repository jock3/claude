import { useState, useEffect, useRef, Fragment } from 'react';
import { Plus, Trash2, X, Check, Calendar, ChevronDown, LogOut } from 'lucide-react';
import * as db from './db.js';

/* ─── Constants ───────────────────────────────────────────── */

const CHECKPOINTS = [
  { key: 'todo',   label: 'Att göra',   color: '#6A6964' },
  { key: 'doing',  label: 'Pågår',      color: '#2E6FD4' },
  { key: 'review', label: 'Granskning', color: '#E0A93B' },
  { key: 'done',   label: 'Klar',       color: '#5BAE6E' },
];

const SESSION_ID_KEY   = 'ailabb_profile_id';
const SESSION_NAME_KEY = 'ailabb_profile_name';

/* ─── Helpers ─────────────────────────────────────────────── */

const getDefaultDeadline = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
};

const formatDate = (iso) => new Date(iso).toLocaleDateString('sv-SE');

const daysUntil = (iso) => {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const target = new Date(iso); target.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
};

const countTodos = (todos) => {
  let done = 0, total = 0;
  for (const t of (todos || [])) {
    total++;
    if (t.done) done++;
    for (const c of (t.children || [])) {
      total++;
      if (c.done) done++;
      for (const g of (c.children || [])) {
        total++;
        if (g.done) done++;
      }
    }
  }
  return { done, total };
};

/* ─── Logo ────────────────────────────────────────────────── */

const Logo = () => (
  <a href="../../" className="tl-logo" aria-label="Gustav Mattsson — AI Labb">
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true">
      <defs>
        <style>{`
          .logo-cls-1 { font-size: 193.17px; }
          .logo-cls-1, .logo-cls-2 {
            font-family: Montserrat-Bold, Montserrat;
            font-weight: 700;
            opacity: .91;
          }
          .logo-cls-2 { font-size: 189.12px; }
        `}</style>
      </defs>
      <path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/>
      <path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/>
      <path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/>
      <text className="logo-cls-1" transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text>
      <text className="logo-cls-2" transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text>
    </svg>
  </a>
);

/* ─── Hamilton FX — canvas aurora + custom cursor (green) ──── */

function HamiltonFX() {
  useEffect(() => {
    const fine    = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups = [];

    /* ── Custom cursor ── */
    if (fine) {
      const dot  = document.getElementById('tl-cursor-dot');
      const ring = document.getElementById('tl-cursor-ring');
      let mx = 0, my = 0, rx = 0, ry = 0, shown = false, raf;
      const onMove = (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        if (!shown) { dot.classList.add('visible'); ring.classList.add('visible'); shown = true; }
      };
      const lerp = (a, b, t) => a + (b - a) * t;
      let last = 0;
      const tick = (now) => {
        const dt = Math.min(now - last || 16, 50); last = now;
        const t = 1 - Math.pow(0.78, dt / 16.67);
        rx = lerp(rx, mx, t); ry = lerp(ry, my, t);
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      const md  = () => { dot.classList.add('clicking');  ring.classList.add('clicking'); };
      const mu  = () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); };
      const sel = 'a, button, input, textarea, [role="button"], .s-app-item';
      const ov  = (e) => { if (e.target.closest(sel)) { dot.classList.add('hovering');  ring.classList.add('hovering'); } };
      const out = (e) => { if (e.target.closest(sel)) { dot.classList.remove('hovering'); ring.classList.remove('hovering'); } };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mousedown', md);
      document.addEventListener('mouseup',   mu);
      document.addEventListener('mouseover', ov);
      document.addEventListener('mouseout',  out);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mousedown', md);
        document.removeEventListener('mouseup',   mu);
        document.removeEventListener('mouseover', ov);
        document.removeEventListener('mouseout',  out);
      });
    }

    /* ── Spotlight ── */
    {
      const s = document.getElementById('tl-spotlight'); let shown = false;
      const onMove = (e) => {
        s.style.setProperty('--mx', e.clientX + 'px');
        s.style.setProperty('--my', e.clientY + 'px');
        if (!shown) { s.classList.add('visible'); shown = true; }
      };
      document.addEventListener('mousemove', onMove);
      cleanups.push(() => document.removeEventListener('mousemove', onMove));
    }

    /* ── Background canvas: green plasma orbs + warped grid + particle net ── */
    {
      const cvs = document.getElementById('tl-bg-canvas');
      const ctx = cvs.getContext('2d', { alpha: true });
      let W, H, dpr, pts, raf;
      /* ox, oy, radius, speed, phase, r, g, b, alpha — all green family */
      const ORBS = [
        [0.14, 0.22, 0.42, 0.00014, 0.0,  34, 197,  94, 0.090],
        [0.78, 0.63, 0.36, 0.00010, 2.1,  22, 163,  74, 0.070],
        [0.48, 0.85, 0.31, 0.00017, 4.0,  74, 222, 128, 0.055],
        [0.86, 0.13, 0.27, 0.00012, 1.3,  16, 185, 129, 0.050],
        [0.24, 0.76, 0.24, 0.00019, 3.4,  52, 211, 153, 0.045],
      ];
      function Pt() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.38; this.vy = (Math.random() - 0.5) * 0.38;
        this.sz = Math.random() * 1.1 + 0.4; this.al = Math.random() * 0.28 + 0.10;
      }
      function setup() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        cvs.width = W * dpr; cvs.height = H * dpr;
        cvs.style.width = W + 'px'; cvs.style.height = H + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
        pts = []; const n = W < 768 ? 42 : 74;
        for (let i = 0; i < n; i++) pts.push(new Pt());
      }
      function drawOrbs(t) {
        ORBS.forEach((o) => {
          const x = (o[0] + Math.sin(t * o[3] + o[4]) * 0.22) * W;
          const y = (o[1] + Math.cos(t * o[3] * 0.73 + o[4] * 1.1) * 0.18) * H;
          const r = o[2] * Math.max(W, H);
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0,    `rgba(${o[5]},${o[6]},${o[7]},${o[8] * 2.4})`);
          g.addColorStop(0.38, `rgba(${o[5]},${o[6]},${o[7]},${o[8]})`);
          g.addColorStop(1,    `rgba(${o[5]},${o[6]},${o[7]},0)`);
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        });
      }
      function drawGrid(t) {
        const cols = 14, rows = 9, amp = 20, cw = W / cols, ch = H / rows;
        ctx.lineWidth = 0.85; ctx.strokeStyle = 'rgba(34,197,94,0.045)';
        let r, c, bx, by, dx, dy;
        for (r = 0; r <= rows; r++) { ctx.beginPath();
          for (c = 0; c <= cols; c++) { bx = c * cw; by = r * ch;
            dx = Math.sin(bx * 0.009 + t * 0.00046 + r * 0.28) * amp;
            dy = Math.cos(by * 0.007 + t * 0.00035 + c * 0.19) * (amp * 0.62);
            c === 0 ? ctx.moveTo(bx + dx, by + dy) : ctx.lineTo(bx + dx, by + dy);
          } ctx.stroke(); }
        for (c = 0; c <= cols; c++) { ctx.beginPath();
          for (r = 0; r <= rows; r++) { bx = c * cw; by = r * ch;
            dx = Math.sin(bx * 0.009 + t * 0.00046 + r * 0.28) * amp;
            dy = Math.cos(by * 0.007 + t * 0.00035 + c * 0.19) * (amp * 0.62);
            r === 0 ? ctx.moveTo(bx + dx, by + dy) : ctx.lineTo(bx + dx, by + dy);
          } ctx.stroke(); }
      }
      const MD = 128, MD2 = MD * MD;
      function drawNet() {
        const n = pts.length; let i, j, p, q, dx, dy, d2, a;
        for (i = 0; i < n; i++) { p = pts[i];
          for (j = i + 1; j < n; j++) { q = pts[j];
            dx = p.x - q.x; dy = p.y - q.y; d2 = dx * dx + dy * dy;
            if (d2 < MD2) { a = (1 - Math.sqrt(d2) / MD) * 0.09;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(74,222,128,${a})`; ctx.lineWidth = 0.55; ctx.stroke();
            }
          }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, 6.2832);
          ctx.fillStyle = `rgba(167,243,208,${p.al})`; ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < -6) p.x = W + 6; else if (p.x > W + 6) p.x = -6;
          if (p.y < -6) p.y = H + 6; else if (p.y > H + 6) p.y = -6;
        }
      }
      function frame(t) { ctx.clearRect(0, 0, W, H); drawOrbs(t); drawGrid(t); drawNet(); raf = requestAnimationFrame(frame); }
      function staticFallback() {
        ctx.clearRect(0, 0, W, H);
        ORBS.forEach((o) => {
          const r = o[2] * Math.max(W, H);
          const g = ctx.createRadialGradient(o[0] * W, o[1] * H, 0, o[0] * W, o[1] * H, r);
          g.addColorStop(0, `rgba(${o[5]},${o[6]},${o[7]},${o[8] * 1.6})`);
          g.addColorStop(1, `rgba(${o[5]},${o[6]},${o[7]},0)`);
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        });
      }
      const onResize = () => { if (raf) cancelAnimationFrame(raf); setup(); if (reduced) { staticFallback(); return; } raf = requestAnimationFrame(frame); };
      setup();
      window.addEventListener('resize', onResize);
      if (reduced) staticFallback(); else raf = requestAnimationFrame(frame);
      cleanups.push(() => { window.removeEventListener('resize', onResize); if (raf) cancelAnimationFrame(raf); });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="tl-cursor-dot"  id="tl-cursor-dot"  aria-hidden="true" />
      <div className="tl-cursor-ring" id="tl-cursor-ring" aria-hidden="true" />
      <canvas id="tl-bg-canvas" aria-hidden="true" />
      <div className="tl-noise"    aria-hidden="true" />
      <div className="tl-spotlight" id="tl-spotlight" aria-hidden="true" />
    </>
  );
}

/* ─── Sidebar — fixed vertical pill (hamilton, green) ──────── */

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
      <a href="../../" className="s-logo" title="AI Labb" aria-label="AI Labb">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true">
          <path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/>
          <path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/>
          <path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/>
          <text className="logo-cls-1" style={{ fontSize: '193.17px', fontFamily: 'Montserrat-Bold, Montserrat', fontWeight: 700, opacity: 0.91 }} transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text>
          <text className="logo-cls-2" style={{ fontSize: '189.12px', fontFamily: 'Montserrat-Bold, Montserrat', fontWeight: 700, opacity: 0.91 }} transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text>
        </svg>
      </a>

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
        <a href="../trackr/" className="s-app-item" title="Track3r">
          <div className="s-bubble ib-trackr" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <span className="s-icon-label">Track3r</span>
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

/* ─── Theme Toggle ────────────────────────────────────────── */

function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'dark'
  );

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ailabb_theme', next);
    setTheme(next);
  };

  return (
    <button className="tl-theme-toggle" onClick={toggle} aria-label="Byt tema">
      {theme === 'dark'
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      }
    </button>
  );
}

/* ─── User Menu ───────────────────────────────────────────── */

function UserMenu({ activeUser, onSwitch }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const id = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', close); };
  }, [open]);

  return (
    <div className="tl-user-menu" onClick={(e) => e.stopPropagation()}>
      <button className="tl-user-chip" onClick={() => setOpen(!open)}>
        <span className="tl-avatar">{activeUser[0].toUpperCase()}</span>
        <span className="tl-user-name">{activeUser}</span>
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="tl-user-dropdown">
          <button onClick={() => { setOpen(false); onSwitch(); }}>
            <LogOut size={14} />
            Byt användare
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── EditInput ───────────────────────────────────────────── */

function EditInput({ value, onChange, onBlur, onKeyDown, fontSize, fontWeight }) {
  return (
    <input
      autoFocus
      className="tl-edit-input"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      style={fontSize ? { fontSize, fontWeight } : {}}
    />
  );
}

/* ─── Project Card ────────────────────────────────────────── */

function ProjectCard({ project, onUpdate, onDelete, onArchive, isArchived = false, showToast }) {
  const [newTodo,      setNewTodo]      = useState('');
  const [subInputs,    setSubInputs]    = useState({});
  const [subSubInputs, setSubSubInputs] = useState({});
  const [openSub,      setOpenSub]      = useState(new Set());
  const [openSubSub,   setOpenSubSub]   = useState(new Set());
  const [editingId,    setEditingId]    = useState(null);
  const [editText,     setEditText]     = useState('');
  const [collapsed,    setCollapsed]    = useState(isArchived);
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [editingDesc,  setEditingDesc]  = useState(false);
  const [descText,     setDescText]     = useState(project.description || '');

  const lastDeletedTodos = useRef(null);

  const todos  = project.todos || [];
  const days   = daysUntil(project.deadline);
  const isDone = project.checkpoint === CHECKPOINTS.length - 1;

  const { done: todoDone, total: todoTotal } = countTodos(todos);

  const uid = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const ts  = () => new Date().toISOString();

  /* ── Inline edit ── */
  const startEdit = (key, text) => { setEditingId(key); setEditText(text); };
  const commitEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (!trimmed) { setEditingId(null); return; }
    if (editingId === '__name__') {
      onUpdate({ name: trimmed });
      setEditingId(null);
      return;
    }
    const parts = editingId.split('/');
    if (parts.length === 1) {
      onUpdate({ todos: todos.map(t => t.id === parts[0] ? { ...t, text: trimmed } : t) });
    } else if (parts.length === 2) {
      const [pid, cid] = parts;
      onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
        ...t, children: (t.children || []).map(c => c.id === cid ? { ...c, text: trimmed } : c)
      })});
    } else {
      const [pid, cid, gid] = parts;
      onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
        ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
          ...c, children: (c.children || []).map(g => g.id === gid ? { ...g, text: trimmed } : g)
        })
      })});
    }
    setEditingId(null);
  };

  /* ── Deadline edit ── */
  const commitDeadline = (val) => {
    setEditingDeadline(false);
    if (val) onUpdate({ deadline: val });
  };

  /* ── Description edit ── */
  const commitDesc = () => {
    setEditingDesc(false);
    onUpdate({ description: descText.trim() });
  };

  /* ── Level 0 ── */
  const addTodo = () => {
    if (!newTodo.trim()) return;
    onUpdate({ todos: [...todos, { id: uid(), text: newTodo.trim(), done: false, createdAt: ts(), children: [] }] });
    setNewTodo('');
  };
  const toggleTodo = (id) =>
    onUpdate({ todos: todos.map(t => t.id === id ? { ...t, done: !t.done } : t) });
  const deleteTodo = (id) => {
    lastDeletedTodos.current = todos;
    const newTodos = todos.filter(t => t.id !== id);
    onUpdate({ todos: newTodos });
    setOpenSub(s => { const n = new Set(s); n.delete(id); return n; });
    if (showToast) showToast('Todo raderad', () => onUpdate({ todos: lastDeletedTodos.current }));
  };
  const toggleSubOpen = (id) =>
    setOpenSub(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* ── Level 1 ── */
  const addSub = (pid) => {
    const text = (subInputs[pid] || '').trim();
    if (!text) return;
    onUpdate({
      todos: todos.map(t => t.id !== pid ? t : {
        ...t, children: [...(t.children || []), { id: uid(), text, done: false, createdAt: ts(), children: [] }]
      })
    });
    setSubInputs(p => ({ ...p, [pid]: '' }));
  };
  const toggleSub = (pid, cid) =>
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id === cid ? { ...c, done: !c.done } : c)
    })});
  const deleteSub = (pid, cid) => {
    lastDeletedTodos.current = todos;
    const newTodos = todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).filter(c => c.id !== cid)
    });
    onUpdate({ todos: newTodos });
    setOpenSubSub(s => { const n = new Set(s); n.delete(`${pid}/${cid}`); return n; });
    if (showToast) showToast('Todo raderad', () => onUpdate({ todos: lastDeletedTodos.current }));
  };
  const toggleSubSubOpen = (pid, cid) => {
    const key = `${pid}/${cid}`;
    setOpenSubSub(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  /* ── Level 2 ── */
  const addSubSub = (pid, cid) => {
    const key  = `${pid}/${cid}`;
    const text = (subSubInputs[key] || '').trim();
    if (!text) return;
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: [...(c.children || []), { id: uid(), text, done: false, createdAt: ts() }]
      })
    })});
    setSubSubInputs(p => ({ ...p, [key]: '' }));
  };
  const toggleSubSub = (pid, cid, gid) =>
    onUpdate({ todos: todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: (c.children || []).map(g => g.id === gid ? { ...g, done: !g.done } : g)
      })
    })});
  const deleteSubSub = (pid, cid, gid) => {
    lastDeletedTodos.current = todos;
    const newTodos = todos.map(t => t.id !== pid ? t : {
      ...t, children: (t.children || []).map(c => c.id !== cid ? c : {
        ...c, children: (c.children || []).filter(g => g.id !== gid)
      })
    });
    onUpdate({ todos: newTodos });
    if (showToast) showToast('Todo raderad', () => onUpdate({ todos: lastDeletedTodos.current }));
  };

  let dlClass = '', dlText = '';
  if (days < 0)        { dlClass = 'overdue'; dlText = `${Math.abs(days)} d försenad`; }
  else if (days === 0) { dlClass = 'urgent';  dlText = 'Idag'; }
  else if (days <= 7)  { dlClass = 'urgent';  dlText = `${days} d kvar`; }
  else                 { dlText = `${days} d kvar`; }

  const progressPct = todoTotal > 0 ? Math.round((todoDone / todoTotal) * 100) : 0;

  return (
    <div className={`tl-project ${isArchived ? 'archived' : ''}`}>
      <div className="tl-project-header">
        <button className="tl-collapse-btn" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Expandera' : 'Minimera'}>
          <ChevronDown size={18} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
        </button>
        {editingId === '__name__'
          ? <input autoFocus className="tl-project-name-input" value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
            />
          : <h3 className="tl-project-name" onClick={() => startEdit('__name__', project.name)}>{project.name}</h3>
        }
        {todoTotal > 0 && (
          <span className="tl-todo-counter">{todoDone}/{todoTotal} klara</span>
        )}
        {isArchived && project.archived_at && (
          <span className="tl-archived-date">Arkiverad {formatDate(project.archived_at)}</span>
        )}
        {!isArchived && (
          editingDeadline
            ? <input
                autoFocus
                type="date"
                className="tl-deadline-input"
                defaultValue={project.deadline}
                onBlur={(e) => commitDeadline(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDeadline(e.target.value); if (e.key === 'Escape') setEditingDeadline(false); }}
              />
            : <div className={`tl-deadline-badge ${dlClass}`} style={{ cursor: 'pointer' }} onClick={() => setEditingDeadline(true)}>
                <Calendar size={12} />
                {dlText}
              </div>
        )}
        {isDone && !isArchived && (
          <button className="tl-archive-btn" onClick={onArchive}>Arkivera</button>
        )}
        <button className="tl-icon-btn" onClick={onDelete} aria-label="Ta bort projekt">
          <Trash2 size={16} />
        </button>
      </div>

      {!collapsed && !isArchived && (
        <div className="tl-project-desc-row">
          {editingDesc
            ? <input
                autoFocus
                className="tl-desc-input"
                value={descText}
                placeholder="Lägg till beskrivning…"
                onChange={(e) => setDescText(e.target.value)}
                onBlur={commitDesc}
                onKeyDown={(e) => { if (e.key === 'Enter') commitDesc(); if (e.key === 'Escape') { setEditingDesc(false); setDescText(project.description || ''); } }}
              />
            : <span
                className={`tl-project-desc ${!(project.description) ? 'empty' : ''}`}
                onClick={() => { setDescText(project.description || ''); setEditingDesc(true); }}
              >
                {project.description || 'Lägg till beskrivning…'}
              </span>
          }
        </div>
      )}

      {todoTotal > 0 && (
        <div className="tl-project-progress-bar">
          <div className="tl-project-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {!collapsed && (<>
      <div className="tl-progress">
        {CHECKPOINTS.map((c, i) => {
          const passed = i <= project.checkpoint;
          return (
            <Fragment key={c.key}>
              <button
                className={`tl-progress-step ${i === project.checkpoint ? 'active' : ''}`}
                onClick={() => onUpdate({ checkpoint: i })}
                aria-label={`Sätt status till ${c.label}`}
              >
                <span className="tl-pdot" style={passed ? { background: c.color, borderColor: c.color } : {}} />
                <span className="tl-plabel">{c.label}</span>
              </button>
              {i < CHECKPOINTS.length - 1 && (
                <span className="tl-progress-line" style={i < project.checkpoint ? { background: c.color } : {}} />
              )}
            </Fragment>
          );
        })}
      </div>

      <div className="tl-todos">
        {todos.length === 0 && <p className="tl-empty-hint">Inga todos ännu.</p>}

        {todos.map((todo) => (
          <div key={todo.id} className="tl-todo-block">
            {/* Level 0 */}
            <div className={`tl-row l0 ${todo.done ? 'done' : ''}`}>
              <button className={`tl-circle-btn ${todo.done ? 'checked' : ''}`} onClick={() => toggleTodo(todo.id)} aria-label="Markera klar">
                {todo.done && <Check size={10} strokeWidth={3} />}
              </button>
              {editingId === todo.id
                ? <EditInput
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                  />
                : <span className="tl-row-text" onClick={() => startEdit(todo.id, todo.text)}>{todo.text}</span>
              }
              <button className={`tl-add-child-btn ${openSub.has(todo.id) ? 'open' : ''}`} onClick={() => toggleSubOpen(todo.id)} title="Lägg till sub-todo">
                <Plus size={11} strokeWidth={2.5} />
              </button>
              <button className="tl-icon-btn" onClick={() => deleteTodo(todo.id)} aria-label="Ta bort"><X size={14} /></button>
            </div>

            {/* Level 1 */}
            {((todo.children || []).length > 0 || openSub.has(todo.id)) && (
              <div className="tl-children">
                {(todo.children || []).map((child) => {
                  const childKey = `${todo.id}/${child.id}`;
                  return (
                    <div key={child.id} className="tl-todo-block">
                      <div className={`tl-row l1 ${child.done ? 'done' : ''}`}>
                        <button className={`tl-circle-btn sm ${child.done ? 'checked' : ''}`} onClick={() => toggleSub(todo.id, child.id)} aria-label="Markera klar">
                          {child.done && <Check size={8} strokeWidth={3} />}
                        </button>
                        {editingId === childKey
                          ? <EditInput
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                            />
                          : <span className="tl-row-text" onClick={() => startEdit(childKey, child.text)}>{child.text}</span>
                        }
                        <button className={`tl-add-child-btn sm ${openSubSub.has(childKey) ? 'open' : ''}`} onClick={() => toggleSubSubOpen(todo.id, child.id)} title="Lägg till sub-sub-todo">
                          <Plus size={10} strokeWidth={2.5} />
                        </button>
                        <button className="tl-icon-btn" onClick={() => deleteSub(todo.id, child.id)} aria-label="Ta bort"><X size={13} /></button>
                      </div>

                      {/* Level 2 */}
                      {((child.children || []).length > 0 || openSubSub.has(childKey)) && (
                        <div className="tl-children sub">
                          {(child.children || []).map((grand) => {
                            const grandKey = `${todo.id}/${child.id}/${grand.id}`;
                            return (
                              <div key={grand.id} className={`tl-row l2 ${grand.done ? 'done' : ''}`}>
                                <button className={`tl-circle-btn sm ${grand.done ? 'checked' : ''}`} onClick={() => toggleSubSub(todo.id, child.id, grand.id)} aria-label="Markera klar">
                                  {grand.done && <Check size={8} strokeWidth={3} />}
                                </button>
                                {editingId === grandKey
                                  ? <EditInput
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      onBlur={commitEdit}
                                      onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingId(null); }}
                                    />
                                  : <span className="tl-row-text" onClick={() => startEdit(grandKey, grand.text)}>{grand.text}</span>
                                }
                                <button className="tl-icon-btn" onClick={() => deleteSubSub(todo.id, child.id, grand.id)} aria-label="Ta bort"><X size={12} /></button>
                              </div>
                            );
                          })}
                          {openSubSub.has(childKey) && (
                            <div className="tl-inline-add">
                              <input
                                autoFocus
                                type="text"
                                placeholder="Sub-sub-todo…"
                                value={subSubInputs[childKey] || ''}
                                onChange={(e) => setSubSubInputs(p => ({ ...p, [childKey]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter')  addSubSub(todo.id, child.id);
                                  if (e.key === 'Escape') toggleSubSubOpen(todo.id, child.id);
                                }}
                              />
                              <button onClick={() => addSubSub(todo.id, child.id)} disabled={!(subSubInputs[childKey] || '').trim()}>
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {openSub.has(todo.id) && (
                  <div className="tl-inline-add">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Sub-todo…"
                      value={subInputs[todo.id] || ''}
                      onChange={(e) => setSubInputs(p => ({ ...p, [todo.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')  addSub(todo.id);
                        if (e.key === 'Escape') toggleSubOpen(todo.id);
                      }}
                    />
                    <button onClick={() => addSub(todo.id)} disabled={!(subInputs[todo.id] || '').trim()}>
                      <Plus size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="tl-add-note">
          <input
            type="text"
            placeholder="Lägg till todo…"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo} disabled={!newTodo.trim()}>
            <Plus size={14} strokeWidth={2.5} />
            Lägg till
          </button>
        </div>
      </div>
      </>)}
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────── */

export default function TodoLabb() {
  const [activeUser, setActiveUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);
  const toastTimerRef             = useRef(null);
  const debounceTimers            = useRef({});

  const [showForm,   setShowForm]   = useState(false);
  const [name,       setName]       = useState('');
  const [checkpoint, setCheckpoint] = useState(0);
  const [deadline,   setDeadline]   = useState(getDefaultDeadline());

  const showToast = (msg, undoFn) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, undoFn: undoFn || null });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  /* Restore session on mount — redirect home if not logged in */
  useEffect(() => {
    async function init() {
      let name = null;
      try { name = JSON.parse(localStorage.getItem('ailabb_active_user')); } catch {}

      if (!name) { window.location.replace('../../'); return; }

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

      setProfileId(pid);
      const projs = await db.getProjects(pid);
      setProjects(projs);
      setLoading(false);
    }
    init();
  }, []);

  /* Switch user — log out globally and go home */
  const handleSwitch = () => {
    localStorage.removeItem('ailabb_active_user');
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NAME_KEY);
    window.location.replace('../../');
  };

  const resetForm = () => {
    setName('');
    setCheckpoint(0);
    setDeadline(getDefaultDeadline());
  };

  /* Add project */
  const addProject = async () => {
    if (!name.trim()) return;
    const project = {
      id: Date.now().toString(),
      profile_id: profileId,
      name: name.trim(),
      checkpoint,
      deadline,
      description: '',
      todos: [],
      created_at: new Date().toISOString(),
    };
    setProjects((prev) => [project, ...prev]);
    resetForm();
    setShowForm(false);
    try {
      await db.upsertProject(project);
    } catch (err) {
      showToast('Kunde inte spara ändringarna');
    }
  };

  /* Update project — immediate state, debounced DB write */
  const updateProject = (id, updates) => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;
    let merged = { ...current, ...updates };
    /* Un-archive if status drops below "Klar" */
    if (updates.checkpoint !== undefined && updates.checkpoint < CHECKPOINTS.length - 1 && merged.archived) {
      merged = { ...merged, archived: false, archived_at: null };
    }
    setProjects((prev) => prev.map((p) => (p.id === id ? merged : p)));

    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
    debounceTimers.current[id] = setTimeout(async () => {
      try {
        await db.upsertProject({ ...merged, profile_id: profileId });
      } catch (err) {
        showToast('Kunde inte spara ändringarna');
      }
    }, 800);
  };

  /* Archive project */
  const archiveProject = (id) =>
    updateProject(id, { archived: true, archived_at: new Date().toISOString() });

  /* Delete project */
  const deleteProject = async (id) => {
    if (!window.confirm('Ta bort projektet?')) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await db.deleteProject(id);
  };

  /* ─── Derived lists ─── */

  const allActive = projects.filter((p) => !p.archived);

  // Sort: overdue first, then ≤7 days, then rest
  const overdueProjects  = allActive.filter(p => daysUntil(p.deadline) < 0);
  const urgentProjects   = allActive.filter(p => { const d = daysUntil(p.deadline); return d >= 0 && d <= 7; });
  const normalProjects   = allActive.filter(p => daysUntil(p.deadline) > 7);
  const activeProjects   = [...overdueProjects, ...urgentProjects, ...normalProjects];

  const archivedProjects = projects
    .filter((p) => p.archived)
    .sort((a, b) => new Date(b.archived_at || 0) - new Date(a.archived_at || 0));

  // Summary bar counts
  const overdueCount = overdueProjects.length;
  const todayCount   = urgentProjects.filter(p => daysUntil(p.deadline) === 0).length;
  const ongoingCount = urgentProjects.filter(p => daysUntil(p.deadline) > 0).length + normalProjects.length;

  /* ─── Render ─── */

  if (loading) {
    return (
      <>
        <ScopedStyles />
        <HamiltonFX />
        <div className="tl-fullscreen-loader">Laddar…</div>
      </>
    );
  }

  return (
    <>
      <ScopedStyles />
      <HamiltonFX />
      <Sidebar activeUser={activeUser} onSwitch={handleSwitch} />
      <div className="tl-app-root">

        <section className="tl-hero">
          <h1>Hej {activeUser}, redo att <span className="hand">labba?</span></h1>
          <p>Liten plats för att hålla koll på pågående experiment. Skapa ett projekt, sätt en deadline och samla anteckningar längs vägen.</p>
        </section>

        {!showForm ? (
          <button className="tl-new-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} strokeWidth={2.5} />
            Nytt projekt
          </button>
        ) : (
          <div className="tl-form-card">
            <h2>Nytt projekt</h2>
            <div className="tl-field">
              <label className="tl-field-label">Projektnamn</label>
              <input
                type="text"
                placeholder="t.ex. Bygg AI-labbet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addProject()}
                autoFocus
              />
            </div>
            <div className="tl-field">
              <label className="tl-field-label">Status</label>
              <div className="tl-checkpoints">
                {CHECKPOINTS.map((cp, i) => (
                  <button
                    key={cp.key}
                    type="button"
                    className={`tl-cp-pill ${checkpoint === i ? 'active' : ''}`}
                    onClick={() => setCheckpoint(i)}
                    style={checkpoint === i ? { borderColor: cp.color, background: `${cp.color}20` } : {}}
                  >
                    <span className="tl-dot" style={{ background: cp.color }} />
                    {cp.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="tl-field">
              <label className="tl-field-label">Deadline</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="tl-form-actions">
              <button className="tl-btn-primary" onClick={addProject} disabled={!name.trim()}>
                Skapa projekt
              </button>
              <button className="tl-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
                Avbryt
              </button>
            </div>
          </div>
        )}

        <section style={{ marginTop: 28 }}>
          {activeProjects.length > 0 && (
            <div className="tl-summary-bar">
              {overdueCount > 0 && <span>{overdueCount} försenade</span>}
              {todayCount > 0 && <span>{todayCount} idag</span>}
              {ongoingCount > 0 && <span>{ongoingCount} pågående</span>}
            </div>
          )}
          {activeProjects.length === 0 && archivedProjects.length === 0 ? (
            <div className="tl-empty-state">
              <h3>Inga projekt ännu</h3>
              <p>Skapa ditt första projekt för att komma igång.</p>
            </div>
          ) : activeProjects.length === 0 ? (
            <div className="tl-empty-state">
              <h3>Inga aktiva projekt</h3>
              <p>Alla projekt är arkiverade. Skapa ett nytt eller återställ ett nedan.</p>
            </div>
          ) : (
            activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={(u) => updateProject(project.id, u)}
                onDelete={() => deleteProject(project.id)}
                onArchive={() => archiveProject(project.id)}
                showToast={showToast}
              />
            ))
          )}
        </section>

        {archivedProjects.length > 0 && (
          <section className="tl-archive-section">
            <h2 className="tl-archive-heading">Arkiverade projekt</h2>
            {archivedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isArchived
                onUpdate={(u) => updateProject(project.id, u)}
                onDelete={() => deleteProject(project.id)}
                onArchive={() => archiveProject(project.id)}
                showToast={showToast}
              />
            ))}
          </section>
        )}

      </div>

      {toast && (
        <div className="tl-toast">
          <span>{toast.msg}</span>
          {toast.undoFn && (
            <button className="tl-toast-undo" onClick={() => { toast.undoFn(); dismissToast(); }}>
              Ångra
            </button>
          )}
        </div>
      )}
    </>
  );
}

/* ─── Scoped Styles ───────────────────────────────────────── */

function ScopedStyles() {
  return (
    <style>{`
      /* ── Green theme tokens ── */
      :root {
        --tl-green:        #4ADE80;
        --tl-green-hover:  #86EFAC;
        --tl-green-dim:    #22c55e;
        --tl-green-bg:     rgba(34,197,94,0.12);
        --tl-green-bg2:    rgba(34,197,94,0.06);
        --tl-green-border: rgba(74,222,128,0.26);
        --tl-green-glow:   0 0 0 1px rgba(74,222,128,0.22), 0 8px 32px rgba(34,197,94,0.12);
        --tl-green-text:   #16a34a;
      }
      [data-theme="light"] {
        --tl-green:        #16a34a;
        --tl-green-hover:  #15803d;
        --tl-green-dim:    #22c55e;
        --tl-green-bg:     rgba(22,163,74,0.10);
        --tl-green-bg2:    rgba(22,163,74,0.05);
        --tl-green-border: rgba(22,163,74,0.28);
        --tl-green-glow:   0 0 0 1px rgba(22,163,74,0.20), 0 8px 32px rgba(22,163,74,0.10);
        --tl-green-text:   #15803d;
      }

      /* ── Subtle green ambient on the page bg ── */
      body {
        background-image: radial-gradient(ellipse 80% 50% at 20% -10%, rgba(34,197,94,0.07) 0%, transparent 60%);
      }

      /* ───────────────────────────────────────────────
         Hamilton FX — custom cursor, canvas, sidebar (green)
         ─────────────────────────────────────────────── */

      /* Custom cursor */
      @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }
      .tl-cursor-dot {
        position: fixed; width: 8px; height: 8px; left: 0; top: 0;
        background: #fff;
        box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 0 12px rgba(74,222,128,0.7);
        border-radius: 50%; pointer-events: none; z-index: 9999;
        transform: translate(-50%,-50%); opacity: 0;
        transition: width 200ms var(--ease-spring), height 200ms var(--ease-spring),
                    box-shadow 200ms var(--ease-out), opacity 350ms var(--ease-out);
      }
      .tl-cursor-ring {
        position: fixed; width: 32px; height: 32px; left: 0; top: 0;
        border: 1.5px solid rgba(74,222,128,0.45); border-radius: 50%;
        pointer-events: none; z-index: 9998; transform: translate(-50%,-50%); opacity: 0;
        transition: width 300ms var(--ease-out), height 300ms var(--ease-out),
                    border-color 300ms var(--ease-out), opacity 350ms var(--ease-out);
      }
      .tl-cursor-dot.visible,  .tl-cursor-ring.visible { opacity: 1; }
      .tl-cursor-dot.hovering  { width: 11px; height: 11px; box-shadow: 0 0 0 1px rgba(34,197,94,0.85), 0 0 18px rgba(74,222,128,0.8); }
      .tl-cursor-ring.hovering { width: 46px; height: 46px; border-color: rgba(74,222,128,0.7); }
      .tl-cursor-dot.clicking  { width: 5px; height: 5px; }
      .tl-cursor-ring.clicking { width: 20px; height: 20px; }
      @media (pointer: coarse) { .tl-cursor-dot, .tl-cursor-ring { display: none; } }

      /* Background canvas + texture */
      #tl-bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; display: block; }
      .tl-noise {
        position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.028;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        background-repeat: repeat; background-size: 200px 200px;
      }
      .tl-spotlight {
        pointer-events: none; position: fixed; inset: 0; z-index: 2; opacity: 0;
        background: radial-gradient(700px circle at var(--mx,50%) var(--my,50%), rgba(34,197,94,0.05) 0%, transparent 65%);
        transition: opacity 600ms var(--ease-out);
      }
      .tl-spotlight.visible { opacity: 1; }

      /* Sidebar pill */
      .tl-sidebar {
        position: fixed; left: 20px; top: 50%; transform: translateY(-50%);
        width: 72px; border-radius: 9999px;
        background: color-mix(in oklch, var(--color-surface) 88%, transparent);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--color-border);
        box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1);
        display: flex; flex-direction: column; align-items: center;
        gap: 4px; padding: 14px 0; z-index: 100;
        animation: tl-side-in 450ms var(--ease-out) both;
      }
      @keyframes tl-side-in { from { opacity: 0; } to { opacity: 1; } }

      .s-logo {
        display: flex; align-items: center; justify-content: center;
        width: 42px; height: 38px; flex-shrink: 0; margin-bottom: 2px;
        color: var(--color-text); text-decoration: none; border: 0;
        transition: filter var(--dur-base) var(--ease-out);
      }
      .s-logo:hover { filter: drop-shadow(0 0 10px rgba(74,222,128,0.55)); }
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
      .s-btn:focus-visible { box-shadow: 0 0 0 2px var(--tl-green); }

      .s-sep { width: 28px; height: 1px; background: var(--color-border); margin: 5px 0; flex-shrink: 0; }
      .s-spacer { flex: 1; min-height: 4px; }

      .s-apps { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; padding: 0 4px; box-sizing: border-box; }
      .s-app-item {
        display: flex; flex-direction: column; align-items: center; gap: 5px;
        text-decoration: none; color: inherit; border: 0; outline: none; cursor: pointer;
        width: 60px; border-radius: 10px; padding: 7px 0 6px; flex-shrink: 0;
        transition: background 180ms var(--ease-out);
      }
      .s-app-item:hover { background: var(--color-surface-2); }
      .s-app-item:focus-visible { box-shadow: 0 0 0 2px var(--tl-green); }
      .s-bubble {
        width: 38px; height: 38px; border-radius: 11px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: transform 220ms var(--ease-spring), box-shadow 200ms var(--ease-out);
      }
      .s-app-item:hover .s-bubble { transform: scale(1.1) translateY(-2px); box-shadow: 0 5px 14px rgba(0,0,0,0.22); }
      .ib-home    { background: linear-gradient(135deg,rgba(255,88,45,.22),rgba(255,120,55,.32));   border: 1px solid rgba(255,88,45,.42);   color: #FF7040; }
      .ib-todo    { background: linear-gradient(135deg,rgba(34,197,94,.15),rgba(22,163,74,.25));    border: 1px solid rgba(34,197,94,.26);   color: #4ADE80; }
      .ib-kampanj { background: linear-gradient(135deg,rgba(245,158,11,.15),rgba(251,191,36,.22));  border: 1px solid rgba(245,158,11,.30);  color: #FCD34D; }
      .ib-seo     { background: linear-gradient(135deg,rgba(99,102,241,.15),rgba(129,140,248,.23)); border: 1px solid rgba(99,102,241,.28);  color: #A5B4FC; }
      .ib-trackr  { background: linear-gradient(135deg,rgba(236,72,153,.14),rgba(219,39,119,.23));  border: 1px solid rgba(236,72,153,.28);  color: #F472B6; }
      .s-app-item.active .s-bubble { box-shadow: 0 0 0 1.5px rgba(74,222,128,0.6), 0 0 14px rgba(74,222,128,0.3); }
      .s-app-item.active .s-icon-label { color: var(--tl-green); font-weight: 600; }
      .s-icon-label {
        font-size: 10px; font-family: var(--font-display); font-weight: 500;
        color: var(--color-text-faint); text-align: center; line-height: 1;
        transition: color 150ms var(--ease-out);
      }
      .s-app-item:hover .s-icon-label { color: var(--color-text-muted); }

      .s-user-btn { padding: 0; }
      .s-avatar-el {
        width: 34px; height: 34px; border-radius: 50%;
        background: linear-gradient(135deg, var(--tl-green-dim), var(--tl-green));
        color: #0f172a; font-size: 14px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        box-shadow: 0 0 0 2px rgba(74,222,128,0.25);
      }
      .tl-side-user { position: relative; }
      .tl-side-user-pop {
        position: absolute; left: calc(100% + 12px); bottom: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08); z-index: 120;
        animation: tl-side-in 160ms var(--ease-out) both;
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
      .tl-side-user-pop button:hover { background: var(--tl-green-bg2); color: var(--tl-green); }

      .theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 0; border-radius: 50%; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; flex-shrink: 0;
        transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform 300ms var(--ease-spring);
      }
      .theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); transform: rotate(18deg) scale(1.1); }
      .theme-toggle:active { transform: rotate(36deg) scale(0.9); }

      .tl-app-root, .tl-welcome-root {
        min-height: 100vh;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
        position: relative; z-index: 10;
      }
      .tl-app-root { max-width: 960px; margin: 0 auto; padding: 48px 32px 110px; }
      .tl-welcome-root { max-width: 640px; margin: 0 auto; padding: 32px 24px 96px; display: flex; flex-direction: column; }
      /* Clear the fixed sidebar when the centered margin is too narrow for it */
      @media (max-width: 1184px) { .tl-app-root { margin-left: 116px; margin-right: auto; } }
      .tl-welcome-root { max-width: 640px; padding: 32px 24px 96px; display: flex; flex-direction: column; }

      .tl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }
      .tl-loading { color: var(--color-text-faint); font-size: 13px; margin: 0; }

      /* ── Nav ── */
      .tl-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; gap: 16px; }
      .tl-nav-right { display: flex; align-items: center; gap: 32px; }
      .tl-logo { display: inline-flex; align-items: center; height: 36px; color: var(--color-text); text-decoration: none; transition: opacity 200ms; border: 0; }
      .tl-logo:hover { opacity: 0.85; }
      .tl-logo svg { height: 100%; width: auto; }
      .tl-menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
      .tl-menu a { font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color 200ms; position: relative; border: 0; }
      .tl-menu a:hover, .tl-menu a.active { color: var(--color-text); }
      .tl-menu a.active::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
        height: 2px; background: var(--tl-green); border-radius: 2px;
      }
      .tl-has-dropdown { position: relative; }
      .tl-has-dropdown > a { display: inline-flex; align-items: center; gap: 6px; }
      .tl-chev { font-size: 9px; line-height: 1; transition: transform 200ms; }
      .tl-has-dropdown:hover .tl-chev,
      .tl-has-dropdown:focus-within .tl-chev { transform: rotate(180deg); }
      .tl-dropdown {
        position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px;
        list-style: none; margin: 0; padding: 6px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
        opacity: 0; visibility: hidden; transform: translateY(-4px);
        transition: opacity 200ms, visibility 200ms, transform 200ms; z-index: 20;
      }
      .tl-dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
      .tl-has-dropdown:hover .tl-dropdown,
      .tl-has-dropdown:focus-within .tl-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .tl-dropdown li { display: block; }
      .tl-dropdown a {
        display: block; padding: 8px 12px; border-radius: 6px;
        font-size: 14px; font-weight: 500; color: var(--color-text-muted); border: 0;
        transition: background 150ms, color 150ms;
      }
      .tl-dropdown a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .tl-dropdown a.active { color: var(--tl-green); }
      .tl-dropdown a::after { display: none; }

      /* ── User chip ── */
      .tl-user-menu { position: relative; }
      .tl-user-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 12px 5px 5px; border-radius: 999px;
        border: 1px solid var(--tl-green-border); background: var(--tl-green-bg2);
        color: var(--color-text); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-chip:hover { border-color: var(--tl-green); background: var(--tl-green-bg); }
      .tl-user-chip .tl-user-name { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
      .tl-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        background: linear-gradient(135deg, rgba(34,197,94,.22), rgba(22,163,74,.36));
        border: 1px solid var(--tl-green-border);
        color: var(--tl-green);
        font-size: 12px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .tl-user-chip .tl-avatar { width: 22px; height: 22px; font-size: 11px; }
      .tl-user-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06); z-index: 20;
      }
      .tl-user-dropdown button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 12px; background: transparent; border: 0;
        border-radius: 6px; color: var(--color-text-muted);
        font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: all 200ms;
      }
      .tl-user-dropdown button:hover { background: var(--color-surface-2); color: var(--color-text); }

      /* ── Hero ── */
      .tl-hero { margin-bottom: 36px; }
      .tl-hero h1 { font-size: clamp(32px, 4.5vw, 52px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 14px; }
      .tl-hero h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--tl-green); font-weight: 400;
        display: inline-block; transform: rotate(-2deg);
        text-shadow: 0 0 32px rgba(74,222,128,0.35);
      }
      .tl-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0; max-width: 60ch; }

      /* ── Primary buttons ── */
      .tl-new-btn, .tl-btn-primary {
        background: var(--tl-green-bg); color: var(--tl-green);
        border: 1px solid var(--tl-green-border);
        font-family: inherit; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 200ms;
        display: inline-flex; align-items: center; gap: 8px;
        box-shadow: var(--tl-green-glow);
      }
      .tl-new-btn { padding: 12px 20px; border-radius: 10px; }
      .tl-btn-primary { padding: 11px 22px; border-radius: 10px; }
      .tl-new-btn:hover, .tl-btn-primary:hover {
        background: var(--tl-green-bg); border-color: var(--tl-green);
        box-shadow: 0 0 0 1px rgba(74,222,128,0.45), 0 12px 40px rgba(34,197,94,0.18);
        transform: translateY(-1px);
      }
      .tl-new-btn:active { transform: scale(0.98); }
      .tl-btn-primary:disabled { background: var(--color-surface-3); color: var(--color-text-faint); border-color: transparent; box-shadow: none; cursor: not-allowed; transform: none; }
      .tl-btn-ghost {
        background: transparent; color: var(--color-text-muted); border: 0;
        padding: 11px 14px; border-radius: 10px; font-family: inherit;
        font-weight: 500; font-size: 14px; cursor: pointer; transition: color 200ms;
      }
      .tl-btn-ghost:hover { color: var(--color-text); }

      /* ── Form card ── */
      .tl-form-card {
        background: var(--color-surface);
        border: 1px solid var(--tl-green-border);
        border-radius: 16px; padding: 28px; margin: 8px 0 32px;
        box-shadow: var(--tl-green-glow);
      }
      .tl-form-card h2 { font-size: 20px; font-weight: 700; margin: 0 0 20px; }
      .tl-field { margin-bottom: 20px; }
      .tl-field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block; }

      .tl-app-root input[type="text"],
      .tl-app-root input[type="date"],
      .tl-welcome-root input[type="text"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 16px;
        padding: 11px 14px; border-radius: 10px; width: 100%;
        outline: none; transition: border-color 200ms, box-shadow 200ms; box-sizing: border-box;
      }
      .tl-app-root input[type="text"]:focus,
      .tl-app-root input[type="date"]:focus,
      .tl-welcome-root input[type="text"]:focus {
        border-color: var(--tl-green);
        box-shadow: 0 0 0 3px rgba(74,222,128,0.12);
      }
      .tl-app-root input[type="date"] { color-scheme: light dark; }
      .tl-app-root ::placeholder, .tl-welcome-root ::placeholder { color: var(--color-text-faint); }

      .tl-checkpoints { display: flex; gap: 8px; flex-wrap: wrap; }
      .tl-cp-pill {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 14px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface-2);
        font-family: inherit; font-size: 13px; font-weight: 500;
        color: var(--color-text-muted); cursor: pointer; transition: all 200ms;
      }
      .tl-cp-pill .tl-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
      .tl-cp-pill:hover { color: var(--color-text); border-color: var(--color-border-strong); }
      .tl-cp-pill.active { color: var(--color-text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .tl-form-actions { display: flex; gap: 12px; align-items: center; margin-top: 8px; }

      /* ── Summary bar ── */
      .tl-summary-bar {
        font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px;
        display: flex; gap: 12px; flex-wrap: wrap;
      }
      .tl-summary-bar span::after { content: ' ·'; }
      .tl-summary-bar span:last-child::after { content: ''; }

      /* ── Project cards — glass morphism style ── */
      .tl-project {
        background: color-mix(in srgb, var(--color-surface) 90%, transparent);
        border: 1px solid var(--color-border);
        border-radius: 16px; margin-bottom: 16px; overflow: hidden;
        transition: border-color 200ms, box-shadow 200ms;
        backdrop-filter: blur(8px);
      }
      .tl-project:hover {
        border-color: var(--tl-green-border);
        box-shadow: var(--tl-green-glow);
      }
      .tl-project.archived { background: var(--color-surface-2); border-color: var(--color-border); }
      .tl-project.archived:hover { border-color: var(--color-border-strong); box-shadow: none; }
      .tl-project.archived .tl-project-name { opacity: 0.85; }
      .tl-project-header { padding: 20px 24px 12px; display: flex; align-items: center; gap: 12px; }
      .tl-collapse-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 2px; margin-left: -4px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: color 200ms, background 200ms;
      }
      .tl-collapse-btn:hover { color: var(--tl-green); background: var(--tl-green-bg2); }
      .tl-archive-btn {
        background: transparent; border: 1px solid var(--color-border-strong);
        color: var(--color-text-muted); padding: 6px 14px; border-radius: 999px;
        font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
        white-space: nowrap; transition: all 200ms;
      }
      .tl-archive-btn:hover { background: var(--tl-green-bg); border-color: var(--tl-green-border); color: var(--tl-green); }
      .tl-archived-date { font-size: 12px; font-weight: 500; color: var(--color-text-faint); white-space: nowrap; }
      .tl-archive-section { margin-top: 48px; }
      .tl-archive-heading {
        font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--color-text-faint); margin: 0 0 16px; padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border);
      }
      .tl-project-name { font-size: 22px; font-weight: 700; margin: 0; flex: 1; word-break: break-word; cursor: text; border-radius: 6px; padding: 2px 4px; margin-left: -4px; transition: background 150ms; }
      .tl-project-name:hover { background: var(--tl-green-bg2); }
      .tl-project-name-input { flex: 1; font-size: 22px; font-weight: 700; background: var(--color-surface); border: 1px solid var(--tl-green); border-radius: 8px; padding: 2px 8px; outline: none; margin-left: -4px; color: var(--color-text); font-family: inherit; width: 0; box-shadow: 0 0 0 3px rgba(74,222,128,0.12); }
      .tl-deadline-badge {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500; color: var(--color-text-muted);
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border); white-space: nowrap;
        transition: all 200ms; cursor: pointer;
      }
      .tl-deadline-badge:hover { border-color: var(--tl-green-border); color: var(--tl-green); }
      .tl-deadline-badge.urgent { color: var(--color-warn); border-color: rgba(224,169,59,0.3); }
      .tl-deadline-badge.overdue { background: rgba(214,59,59,0.10); color: #f87171; border-color: rgba(248,113,113,0.35); }
      .tl-deadline-input {
        font-size: 12px; font-weight: 500; color: var(--color-text);
        padding: 4px 8px; border-radius: 999px; border: 1px solid var(--tl-green);
        background: var(--color-surface); font-family: inherit; outline: none;
        width: auto; white-space: nowrap; box-sizing: border-box;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.12);
      }
      .tl-todo-counter {
        font-size: 12px; font-weight: 500; color: var(--color-text-faint);
        white-space: nowrap; flex-shrink: 0;
      }

      .tl-project-desc-row { padding: 0 24px 8px 52px; }
      .tl-project-desc {
        font-size: 13px; color: var(--color-text-muted); cursor: text;
        border-radius: 4px; padding: 2px 4px; display: inline-block;
        transition: background 150ms;
      }
      .tl-project-desc.empty { color: var(--color-text-faint); opacity: 0; transition: opacity 150ms; }
      .tl-project-desc-row:hover .tl-project-desc.empty { opacity: 1; }
      .tl-desc-input {
        font-size: 13px; color: var(--color-text); font-family: inherit;
        background: var(--color-surface); border: 1px solid var(--tl-green);
        border-radius: 6px; padding: 3px 8px; outline: none;
        width: 100%; box-sizing: border-box;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.10);
      }

      /* ── Progress bar — green tint ── */
      .tl-project-progress-bar { height: 3px; background: var(--color-border); width: 100%; }
      .tl-project-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--tl-green-dim), var(--tl-green));
        box-shadow: 0 0 8px rgba(74,222,128,0.4);
        transition: width 300ms ease;
      }

      .tl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }

      .tl-theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 6px; border-radius: 8px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); }

      /* ── Progress steps ── */
      .tl-progress { padding: 4px 24px 20px; display: flex; align-items: center; overflow-x: auto; }
      .tl-progress::-webkit-scrollbar { display: none; }
      .tl-progress-step {
        display: flex; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0;
        background: transparent; border: 0; padding: 4px 2px; color: inherit; font-family: inherit;
      }
      .tl-pdot {
        width: 12px; height: 12px; border-radius: 50%;
        background: var(--color-surface-3); border: 2px solid var(--color-border-strong);
        transition: all 200ms; flex-shrink: 0;
      }
      .tl-progress-step.active .tl-pdot { transform: scale(1.2); }
      .tl-plabel { font-size: 12px; font-weight: 500; color: var(--color-text-faint); transition: color 200ms; white-space: nowrap; }
      .tl-progress-step.active .tl-plabel { color: var(--color-text); font-weight: 600; }
      .tl-progress-step:hover .tl-plabel { color: var(--color-text); }
      .tl-progress-line { flex: 1; height: 2px; background: var(--color-border); margin: 0 10px; min-width: 16px; transition: background 200ms; }

      /* ── Todos ── */
      .tl-todos { border-top: 1px solid var(--color-border); padding: 14px 24px 18px; background: var(--tl-green-bg2); }
      .tl-empty-hint { font-size: 13px; color: var(--color-text-faint); margin: 4px 0 12px; font-style: italic; }

      .tl-todo-block { margin-bottom: 1px; }

      .tl-row { display: flex; align-items: flex-start; gap: 8px; padding: 5px 0; }
      .tl-row.done .tl-row-text { text-decoration: line-through; color: var(--color-text-faint); }
      .tl-row-text { flex: 1; word-break: break-word; padding-top: 1px; transition: color 200ms; cursor: text; border-radius: 4px; }
      .tl-row-text:hover { background: var(--color-surface-2); }
      .tl-row.l0 .tl-row-text { font-size: 16px; font-weight: 500; color: var(--color-text); }
      .tl-row.l1 .tl-row-text { font-size: 14px; font-weight: 400; color: var(--color-text); }
      .tl-row.l2 .tl-row-text { font-size: 13px; font-weight: 400; color: var(--color-text-muted); }
      .tl-row.l0 { padding: 6px 0; }
      .tl-row.l1 { padding: 4px 0; }
      .tl-row.l2 { padding: 3px 0; }

      /* ── Checkboxes — green ── */
      .tl-circle-btn {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid var(--color-border-strong);
        background: var(--color-surface); cursor: pointer;
        flex-shrink: 0; margin-top: 2px; padding: 0;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 150ms; color: transparent;
      }
      .tl-circle-btn.sm { width: 15px; height: 15px; margin-top: 3px; }
      .tl-circle-btn:hover { border-color: var(--tl-green); background: var(--tl-green-bg2); color: var(--tl-green); }
      .tl-circle-btn.checked {
        background: linear-gradient(135deg, var(--tl-green-dim), var(--tl-green));
        border-color: var(--tl-green); color: #0f172a;
        box-shadow: 0 0 8px rgba(74,222,128,0.35);
      }

      .tl-edit-input {
        flex: 1; background: var(--color-surface);
        border: 1px solid var(--tl-green); border-radius: 6px;
        color: var(--color-text); font-family: inherit; font-size: inherit;
        padding: 1px 8px; outline: none; min-width: 0;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.10);
      }

      .tl-children {
        margin-left: 7px; padding-left: 16px;
        border-left: 2px solid var(--tl-green-border);
        margin-top: 2px; margin-bottom: 4px;
      }
      .tl-children.sub { padding-left: 14px; }

      .tl-add-child-btn {
        background: transparent; border: 0;
        color: var(--color-text-faint); padding: 3px 4px; border-radius: 4px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: color 150ms, background 150ms; flex-shrink: 0; margin-top: 2px;
      }
      .tl-add-child-btn:hover { color: var(--tl-green); background: var(--tl-green-bg2); }
      .tl-add-child-btn.open { color: var(--tl-green); background: var(--tl-green-bg); }

      .tl-inline-add { display: flex; gap: 6px; padding: 6px 0 4px; }
      .tl-inline-add input { flex: 1; padding: 6px 10px; font-size: 13px; border-radius: 8px; }
      .tl-inline-add button {
        padding: 6px 10px; background: var(--tl-green-bg);
        border: 1px solid var(--tl-green-border); color: var(--tl-green);
        border-radius: 8px; font-family: inherit; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: all 200ms;
      }
      .tl-inline-add button:hover:not(:disabled) { background: var(--tl-green-bg); border-color: var(--tl-green); }
      .tl-inline-add button:disabled { opacity: 0.35; cursor: not-allowed; }

      .tl-add-note { display: flex; gap: 8px; margin-top: 12px; }
      .tl-add-note input { flex: 1; padding: 9px 12px; font-size: 14px; }
      .tl-add-note button {
        padding: 9px 14px; background: var(--tl-green-bg);
        border: 1px solid var(--tl-green-border); color: var(--tl-green);
        border-radius: 10px; font-family: inherit; font-weight: 600; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        transition: all 200ms; white-space: nowrap;
      }
      .tl-add-note button:hover:not(:disabled) { border-color: var(--tl-green); box-shadow: var(--tl-green-glow); }
      .tl-add-note button:disabled { opacity: 0.5; cursor: not-allowed; }

      /* ── Empty state ── */
      .tl-empty-state {
        text-align: center; padding: 56px 24px; color: var(--color-text-muted);
        border: 1px dashed var(--tl-green-border); border-radius: 16px;
        background: var(--tl-green-bg2);
      }
      .tl-empty-state h3 { color: var(--color-text); margin: 0 0 8px; font-weight: 700; }
      .tl-empty-state p { margin: 0; font-size: 14px; }

      /* ── Toast ── */
      .tl-toast {
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
        background: var(--color-surface);
        border: 1px solid var(--tl-green-border);
        color: var(--color-text);
        padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500;
        box-shadow: var(--tl-green-glow); z-index: 100; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 12px;
        animation: tl-toast-in 200ms ease;
      }
      .tl-toast-undo {
        background: transparent; border: 0; color: var(--tl-green);
        font-family: inherit; font-size: 14px; font-weight: 700;
        cursor: pointer; padding: 0; text-decoration: underline; opacity: 0.9;
        transition: opacity 150ms;
      }
      .tl-toast-undo:hover { opacity: 1; }
      @keyframes tl-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(8px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      /* ── Welcome screen ── */
      .tl-welcome-nav { margin-bottom: 64px; }
      .tl-welcome-card { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      .tl-welcome-card h1 { font-size: clamp(40px, 6vw, 64px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 20px; }
      .tl-welcome-card h1 .hand { font-family: var(--font-hand, "Patrick Hand", cursive); color: var(--tl-green); font-weight: 400; display: inline-block; transform: rotate(-2deg); font-size: 1.1em; }
      .tl-welcome-card p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0 0 36px; max-width: 50ch; }
      .tl-welcome-input { display: flex; gap: 12px; margin-bottom: 36px; }
      .tl-welcome-input input { flex: 1; font-size: 17px; padding: 14px 18px; }
      .tl-welcome-input button { padding: 14px 22px; white-space: nowrap; }
      .tl-welcome-users { display: flex; flex-direction: column; gap: 14px; }
      .tl-welcome-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-faint); }
      .tl-user-pills { display: flex; flex-wrap: wrap; gap: 8px; }
      .tl-user-pill {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 18px 6px 6px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 14px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-pill:hover { border-color: var(--tl-green-border); background: var(--tl-green-bg2); }
      .tl-user-pill:disabled { opacity: 0.5; cursor: not-allowed; }

      /* ── Responsive ── */
      @media (max-width: 768px) { .tl-app-root { max-width: 100%; } }

      /* Sidebar → bottom horizontal pill on mobile */
      @media (max-width: 680px) {
        .tl-sidebar {
          left: 12px; right: 12px; top: auto; bottom: 12px; transform: none;
          width: auto; flex-direction: row; align-items: center;
          padding: 0 14px; height: 60px; gap: 4px;
          justify-content: space-between;
        }
        .tl-sidebar .s-sep, .tl-sidebar .s-spacer { display: none; }
        .s-apps { flex-direction: row; gap: 4px; padding: 0; }
        .s-app-item { flex-direction: row; gap: 8px; width: auto; padding: 8px 10px; border-radius: 8px; }
        .s-bubble { width: 28px; height: 28px; border-radius: 8px; }
        .s-icon-label { font-size: 11px; }
        .tl-side-user-pop { left: auto; right: 0; bottom: calc(100% + 10px); }
        .tl-app-root { margin-left: auto; margin-right: auto; padding: 28px 18px 110px; }
      }
      @media (max-width: 460px) {
        .s-app-item .s-icon-label { display: none; }
        .s-logo { display: none; }
      }

      @media (max-width: 540px) {
        .tl-user-chip .tl-user-name { max-width: 80px; }
        .tl-form-card { padding: 20px; }
        .tl-project-header { padding: 16px 18px 10px; flex-wrap: wrap; }
        .tl-progress { padding: 4px 18px 18px; }
        .tl-plabel { font-size: 11px; }
        .tl-welcome-input { flex-direction: column; }
        .tl-welcome-input button { width: 100%; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
      }
    `}</style>
  );
}
