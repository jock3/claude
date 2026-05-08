import { useState, useEffect } from 'react';
import { Plus, Trash2, X, ChevronDown, LogOut } from 'lucide-react';

/* ─── Constants ───────────────────────────────────────────── */

const PLATFORM_SUGGESTIONS = [
  'Instagram', 'Facebook', 'TikTok', 'LinkedIn',
  'Google Ads', 'YouTube', 'X', 'Snapchat'
];

const PLATFORM_STATUS = {
  inaktiv:    { key: 'inaktiv',    label: 'Inaktiv',    short: 'Inaktiv',    color: '#6A6964' },
  schemalagd: { key: 'schemalagd', label: 'Schemalagd', short: 'Schemalagd', color: '#E0A93B' },
  aktiv:      { key: 'aktiv',      label: 'Aktiv',      short: 'Aktiv',      color: '#5BAE6E' },
  klar:       { key: 'klar',       label: 'Klar',       short: 'Klar',       color: '#2E6FD4' },
};

const CAMPAIGN_STATUS = {
  upcoming:  { key: 'upcoming',  label: 'Kommande', color: '#6A6964' },
  active:    { key: 'active',    label: 'Pågår',    color: '#5BAE6E' },
  completed: { key: 'completed', label: 'Avslutad', color: '#2E6FD4' },
};

const STORAGE_KEYS = {
  users: 'ailabb_users',
  activeUser: 'ailabb_active_user',
  userCampaigns: (name) => `ailabb_user_${sanitize(name)}_campaigns`,
};

/* ─── Helpers ─────────────────────────────────────────────── */

function sanitize(name) {
  return name.replace(/[\s/\\'"]+/g, '_');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function inDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
}

function formatBudget(n) {
  if (!n || isNaN(n)) return '0 kr';
  return new Intl.NumberFormat('sv-SE').format(n) + ' kr';
}

function getCampaignStatus(start, end) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const s = new Date(start); s.setHours(0, 0, 0, 0);
  const e = new Date(end); e.setHours(0, 0, 0, 0);
  if (now < s) return CAMPAIGN_STATUS.upcoming;
  if (now > e) return CAMPAIGN_STATUS.completed;
  return CAMPAIGN_STATUS.active;
}

function getDefaultPlatformStatus(start) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const s = new Date(start); s.setHours(0, 0, 0, 0);
  return now < s ? 'schemalagd' : 'aktiv';
}

function promotePlatform(p) {
  if (p.status === 'schemalagd') {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const s = new Date(p.start); s.setHours(0, 0, 0, 0);
    if (now >= s) return { ...p, status: 'aktiv' };
  }
  return p;
}

function promoteCampaigns(campaigns) {
  let changed = false;
  const next = campaigns.map((c) => ({
    ...c,
    platforms: (c.platforms || []).map((p) => {
      const promoted = promotePlatform(p);
      if (promoted !== p) changed = true;
      return promoted;
    }),
  }));
  return { campaigns: next, changed };
}

function getMonthsBetween(start, end) {
  const months = [];
  const startD = new Date(start);
  const endD = new Date(end);
  const cursor = new Date(startD.getFullYear(), startD.getMonth(), 1);
  while (cursor <= endD) {
    months.push({
      date: new Date(cursor),
      label: cursor.toLocaleDateString('sv-SE', { month: 'short' }).replace('.', ''),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function getPositionPercent(date, rangeStart, rangeEnd) {
  const d = new Date(date).getTime();
  const s = new Date(rangeStart).getTime();
  const e = new Date(rangeEnd).getTime();
  if (e === s) return 0;
  return Math.max(0, Math.min(100, ((d - s) / (e - s)) * 100));
}

function newPlatform(start, end) {
  return { name: '', budget: 0, start, end, status: getDefaultPlatformStatus(start) };
}

const storage = {
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
};

/* ─── Logo ────────────────────────────────────────────────── */

const Logo = () => (
  <a href="../../" className="kl-logo" aria-label="Gustav Mattsson — AI Labb">
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

/* ─── Welcome Screen ──────────────────────────────────────── */

function WelcomeScreen({ users, onLogin }) {
  const [name, setName] = useState('');
  const submit = (n) => {
    const v = (n || '').trim();
    if (v) onLogin(v);
  };

  return (
    <div className="kl-welcome-root">
      <header className="kl-welcome-nav"><Logo /></header>
      <div className="kl-welcome-card">
        <h1>Hej, <span className="hand">vem är du?</span></h1>
        <p>Skriv ditt namn för att börja, eller välj en befintlig profil. Dina kampanjer sparas separat per namn.</p>

        <div className="kl-welcome-input">
          <input
            type="text"
            placeholder="Ditt namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(name)}
            autoFocus
            maxLength={40}
          />
          <button className="kl-btn-primary" onClick={() => submit(name)} disabled={!name.trim()}>
            Fortsätt →
          </button>
        </div>

        {users.length > 0 && (
          <div className="kl-welcome-users">
            <span className="kl-welcome-label">Eller fortsätt som</span>
            <div className="kl-user-pills">
              {users.map((u) => (
                <button key={u} className="kl-user-pill" onClick={() => onLogin(u)}>
                  <span className="kl-avatar">{u[0].toUpperCase()}</span>
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── User Menu ───────────────────────────────────────────── */

function UserMenu({ activeUser, onSwitch }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const id = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('click', close);
    };
  }, [open]);

  return (
    <div className="kl-user-menu" onClick={(e) => e.stopPropagation()}>
      <button className="kl-user-chip" onClick={() => setOpen(!open)}>
        <span className="kl-avatar">{activeUser[0].toUpperCase()}</span>
        <span className="kl-user-name">{activeUser}</span>
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="kl-user-dropdown">
          <button onClick={() => { setOpen(false); onSwitch(); }}>
            <LogOut size={14} />
            Byt användare
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Campaign Timeline (overall progress bar) ────────────── */

function CampaignTimeline({ start, end }) {
  const startD = new Date(start);
  const endD = new Date(end);
  const now = new Date();
  const total = endD - startD;
  const elapsed = Math.max(0, Math.min(total, now - startD));
  const progress = total > 0 ? (elapsed / total) * 100 : 0;
  const status = getCampaignStatus(start, end);
  const isActive = status.key === 'active';
  const isCompleted = status.key === 'completed';
  const totalDays = Math.max(1, Math.ceil(total / 86400000));
  const fillWidth = isCompleted ? 100 : isActive ? progress : 0;

  return (
    <div className="kl-timeline">
      <div className="kl-timeline-labels">
        <span>{formatDate(start)}</span>
        <span className="duration">{totalDays} {totalDays === 1 ? 'dag' : 'dagar'}</span>
        <span>{formatDate(end)}</span>
      </div>
      <div className="kl-timeline-bar" style={{ marginBottom: isActive ? 24 : 0 }}>
        <div className="kl-timeline-fill" style={{ width: `${fillWidth}%`, background: status.color }} />
        {isActive && (
          <>
            <div className="kl-timeline-today" style={{ left: `${progress}%` }} />
            <div className="kl-timeline-today-label" style={{ left: `${progress}%` }}>Idag</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Platform Calendar (Gantt-style overview) ────────────── */

function PlatformCalendar({ campaign }) {
  const platforms = (campaign.platforms || []);
  if (platforms.length === 0) return null;

  const months = getMonthsBetween(campaign.start, campaign.end);
  const now = new Date();
  const showToday = now >= new Date(campaign.start) && now <= new Date(campaign.end);
  const todayPos = showToday ? getPositionPercent(now.toISOString(), campaign.start, campaign.end) : null;

  return (
    <div>
      <div className="kl-section-label">Kampanjöversikt</div>
      <div className="kl-cal">
        <div className="kl-cal-header">
          {months.map((m, i) => (
            <span
              key={i}
              className="kl-cal-month"
              style={{ left: `${getPositionPercent(m.date, campaign.start, campaign.end)}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {platforms.map((p, i) => {
          const left = getPositionPercent(p.start, campaign.start, campaign.end);
          const right = getPositionPercent(p.end, campaign.start, campaign.end);
          const width = Math.max(0.5, right - left);
          const status = PLATFORM_STATUS[p.status] || PLATFORM_STATUS.aktiv;
          const isInaktiv = p.status === 'inaktiv';

          return (
            <div key={i} className="kl-cal-row">
              <span className={`kl-cal-row-label ${isInaktiv ? 'inaktiv' : ''}`}>
                {p.name || 'Plattform'}
              </span>
              <div className="kl-cal-track">
                {months.map((m, idx) => idx === 0 ? null : (
                  <span
                    key={idx}
                    className="kl-cal-line"
                    style={{ left: `${getPositionPercent(m.date, campaign.start, campaign.end)}%` }}
                  />
                ))}
                {showToday && i === 0 && (
                  <span className="kl-cal-today-line" style={{ left: `${todayPos}%` }} />
                )}
                <div
                  className={`kl-cal-bar ${isInaktiv ? 'inaktiv' : ''}`}
                  style={
                    isInaktiv
                      ? { left: `${left}%`, width: `${width}%` }
                      : { left: `${left}%`, width: `${width}%`, background: status.color }
                  }
                  title={`${p.name}: ${formatDate(p.start)} – ${formatDate(p.end)} (${status.short})`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Campaign Card ───────────────────────────────────────── */

function CampaignCard({ campaign, onDelete, onUpdatePlatform, onAddPlatform }) {
  const [open, setOpen] = useState(false);
  const status = getCampaignStatus(campaign.start, campaign.end);
  const platforms = campaign.platforms || [];
  const totalBudget = platforms.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const dateRange = `${formatDate(campaign.start)} – ${formatDate(campaign.end)}`;

  return (
    <div className={`kl-campaign ${open ? 'open' : ''}`}>
      <button className="kl-campaign-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="kl-campaign-title">
          <span className="kl-campaign-client">{campaign.client}</span>
          <span className="kl-campaign-name">{campaign.name}</span>
        </div>
        <span className="kl-meta-pill">{dateRange}</span>
        <span className="kl-meta-pill budget">{formatBudget(totalBudget)}</span>
        <span className={`kl-meta-pill status ${status.key}`}>
          <span className="sdot" style={{ background: status.color }} />
          {status.label}
        </span>
        <ChevronDown size={18} className="kl-chevron" />
      </button>

      {open && (
        <div className="kl-campaign-body">
          <CampaignTimeline start={campaign.start} end={campaign.end} />

          <div>
            <div className="kl-section-label">Plattformar</div>
            <div className="kl-platform-list">
              {platforms.length === 0 ? (
                <p className="kl-pl-empty-hint">Inga plattformar tillagda än.</p>
              ) : (
                platforms.map((p, i) => {
                  const ps = PLATFORM_STATUS[p.status] || PLATFORM_STATUS.aktiv;
                  return (
                    <div key={i} className={`kl-pl-item ${p.status === 'inaktiv' ? 'inaktiv' : ''}`}>
                      <div className="kl-pl-row-top">
                        <div className="kl-pl-name">
                          <span className="pdot" style={{ background: ps.color }} />
                          <input
                            type="text"
                            className="kl-pl-inline-input kl-pl-name-input"
                            value={p.name}
                            onChange={(e) => onUpdatePlatform(i, { name: e.target.value })}
                            placeholder="Plattform"
                            aria-label="Plattformnamn"
                          />
                        </div>
                        <div className="kl-pl-budget-edit">
                          <input
                            type="number"
                            className="kl-pl-inline-input"
                            min="0"
                            step="100"
                            value={p.budget || ''}
                            onChange={(e) => onUpdatePlatform(i, { budget: Number(e.target.value) || 0 })}
                            placeholder="0"
                            aria-label="Budget"
                          />
                          <span className="suffix">kr</span>
                        </div>
                      </div>
                      <div className="kl-pl-row-bottom">
                        <div className="kl-pl-dates-edit">
                          <input
                            type="date"
                            className="kl-pl-inline-input"
                            value={p.start}
                            min={campaign.start}
                            max={p.end || campaign.end}
                            onChange={(e) => onUpdatePlatform(i, { start: e.target.value })}
                            aria-label="Startdatum"
                          />
                          <span className="dash">–</span>
                          <input
                            type="date"
                            className="kl-pl-inline-input"
                            value={p.end}
                            min={p.start || campaign.start}
                            max={campaign.end}
                            onChange={(e) => onUpdatePlatform(i, { end: e.target.value })}
                            aria-label="Slutdatum"
                          />
                        </div>
                        <div className="kl-status-seg compact" role="radiogroup" aria-label="Plattformsstatus">
                          {Object.values(PLATFORM_STATUS).map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              role="radio"
                              aria-checked={p.status === s.key}
                              className={p.status === s.key ? 'active' : ''}
                              onClick={() => onUpdatePlatform(i, { status: s.key })}
                              title={s.label}
                            >
                              <span className="sdot" style={{ background: s.color }} />
                              {s.short}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {platforms.length > 0 && (
                <div className="kl-pl-total">
                  <span className="label">Total budget</span>
                  <span className="value">{formatBudget(totalBudget)}</span>
                </div>
              )}

              <button className="kl-pl-add-btn" onClick={onAddPlatform}>
                <Plus size={14} strokeWidth={2.5} />
                Lägg till plattform
              </button>
            </div>
          </div>

          <PlatformCalendar campaign={campaign} />

          <div className="kl-body-actions">
            <button className="kl-btn-danger" onClick={onDelete}>
              <Trash2 size={14} />
              Ta bort kampanj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Platform Form Card (used in create-new form) ────────── */

function PlatformFormCard({ platform, onChange, onRemove, canRemove, campaignStart, campaignEnd, suggestionIndex }) {
  return (
    <div className="kl-platform-card">
      <div className="kl-pc-row top">
        <input
          type="text"
          placeholder={PLATFORM_SUGGESTIONS[suggestionIndex % PLATFORM_SUGGESTIONS.length]}
          value={platform.name}
          onChange={(e) => onChange({ name: e.target.value })}
          list="kl-platform-suggestions"
        />
        <div className="kl-pc-budget-wrap">
          <input
            type="number"
            min="0"
            step="100"
            placeholder="Budget"
            value={platform.budget}
            onChange={(e) => onChange({ budget: e.target.value })}
          />
          <span className="currency">kr</span>
        </div>
        <button
          type="button"
          className="kl-icon-btn danger"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Ta bort plattform"
        >
          <X size={16} />
        </button>
      </div>

      <div className="kl-pc-row dates">
        <div>
          <span className="kl-pc-mini-label">Start</span>
          <input
            type="date"
            value={platform.start}
            min={campaignStart}
            max={campaignEnd}
            onChange={(e) => onChange({ start: e.target.value })}
          />
        </div>
        <div>
          <span className="kl-pc-mini-label">Slut</span>
          <input
            type="date"
            value={platform.end}
            min={platform.start || campaignStart}
            max={campaignEnd}
            onChange={(e) => onChange({ end: e.target.value })}
          />
        </div>
      </div>

      <div className="kl-pc-row status">
        <div>
          <span className="kl-pc-mini-label">Status</span>
          <div className="kl-status-seg" role="radiogroup" aria-label="Plattformsstatus">
            {Object.values(PLATFORM_STATUS).map((s) => (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={platform.status === s.key}
                className={platform.status === s.key ? 'active' : ''}
                onClick={() => onChange({ status: s.key })}
              >
                <span className="sdot" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────── */

export default function KampanjLabb() {
  const [activeUser, setActiveUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [client, setClient] = useState('');
  const [name, setName] = useState('');
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(inDays(30));
  const [platforms, setPlatforms] = useState([newPlatform(today(), inDays(30))]);

  useEffect(() => {
    const usersList = storage.get(STORAGE_KEYS.users, []);
    setUsers(usersList);

    const current = storage.get(STORAGE_KEYS.activeUser, null);
    if (current) {
      setActiveUser(current);
      const stored = storage.get(STORAGE_KEYS.userCampaigns(current), []);
      const { campaigns: promoted, changed } = promoteCampaigns(stored);
      setCampaigns(promoted);
      if (changed) storage.set(STORAGE_KEYS.userCampaigns(current), promoted);
    }
  }, []);

  const persist = (next) => {
    setCampaigns(next);
    if (activeUser) storage.set(STORAGE_KEYS.userCampaigns(activeUser), next);
  };

  const handleLogin = (rawName) => {
    const trimmed = rawName.trim();
    if (!trimmed) return;

    const nextUsers = users.includes(trimmed) ? users : [...users, trimmed];
    setUsers(nextUsers);
    storage.set(STORAGE_KEYS.users, nextUsers);

    setActiveUser(trimmed);
    storage.set(STORAGE_KEYS.activeUser, trimmed);

    const stored = storage.get(STORAGE_KEYS.userCampaigns(trimmed), []);
    const { campaigns: promoted, changed } = promoteCampaigns(stored);
    setCampaigns(promoted);
    if (changed) storage.set(STORAGE_KEYS.userCampaigns(trimmed), promoted);
  };

  const handleSwitch = () => {
    setActiveUser(null);
    setCampaigns([]);
    setShowForm(false);
    resetForm();
    storage.remove(STORAGE_KEYS.activeUser);
  };

  const resetForm = () => {
    setClient('');
    setName('');
    const s = today();
    const e = inDays(30);
    setStart(s);
    setEnd(e);
    setPlatforms([newPlatform(s, e)]);
  };

  const updatePlatform = (i, updates) => {
    setPlatforms(platforms.map((p, idx) => {
      if (idx !== i) return p;
      const next = { ...p, ...updates };
      if ('start' in updates && (next.status === 'schemalagd' || next.status === 'aktiv')) {
        next.status = getDefaultPlatformStatus(next.start);
      }
      return next;
    }));
  };

  const addPlatform = () => setPlatforms([...platforms, newPlatform(start, end)]);
  const removePlatform = (i) => setPlatforms(platforms.filter((_, idx) => idx !== i));

  const canSubmit = client.trim() && name.trim() && start && end && new Date(end) >= new Date(start);

  const addCampaign = () => {
    if (!canSubmit) return;
    const cleanPlatforms = platforms
      .filter((p) => p.name.trim() || p.budget)
      .map((p) => ({
        name: p.name.trim() || 'Plattform',
        budget: Number(p.budget) || 0,
        start: p.start || start,
        end: p.end || end,
        status: p.status || getDefaultPlatformStatus(p.start || start),
      }));

    const campaign = {
      id: Date.now().toString(),
      client: client.trim(),
      name: name.trim(),
      start,
      end,
      platforms: cleanPlatforms,
      createdAt: new Date().toISOString(),
    };

    persist([campaign, ...campaigns]);
    resetForm();
    setShowForm(false);
  };

  const deleteCampaign = (id) => {
    if (!window.confirm('Ta bort kampanjen?')) return;
    persist(campaigns.filter((c) => c.id !== id));
  };

  const updateCampaignPlatform = (campaignId, idx, updates) => {
    const next = campaigns.map((c) => {
      if (c.id !== campaignId) return c;
      const ps = (c.platforms || []).map((p, i) => {
        if (i !== idx) return p;
        let merged = { ...p, ...updates };
        merged = promotePlatform(merged);
        return merged;
      });
      return { ...c, platforms: ps };
    });
    persist(next);
  };

  const addCampaignPlatform = (campaignId) => {
    const next = campaigns.map((c) => {
      if (c.id !== campaignId) return c;
      const np = newPlatform(c.start, c.end);
      return { ...c, platforms: [...(c.platforms || []), np] };
    });
    persist(next);
  };

  if (!activeUser) {
    return (
      <>
        <ScopedStyles />
        <WelcomeScreen users={users} onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <ScopedStyles />
      <div className="kl-app-root">

        <nav className="kl-top-nav">
          <Logo />
          <div className="kl-nav-right">
            <ul className="kl-menu">
              <li><a href="../../">Hem</a></li>
              <li className="kl-has-dropdown">
                <a href="#" aria-haspopup="true">
                  Appar <span className="kl-chev" aria-hidden="true">▾</span>
                </a>
                <ul className="kl-dropdown" role="menu">
                  <li role="none"><a href="../todo/" role="menuitem">Todo</a></li>
                  <li role="none"><a href="../kampanj/" role="menuitem" className="active">Kampanjplanerare</a></li>
                </ul>
              </li>
            </ul>
            <UserMenu activeUser={activeUser} onSwitch={handleSwitch} />
          </div>
        </nav>

        <section className="kl-hero">
          <h1>Hej {activeUser}, dags att <span className="hand">planera?</span></h1>
          <p>Bygg och håll koll på kampanjer åt dina kunder. Varje plattform kan köras under egna perioder inom kampanjen.</p>
        </section>

        {!showForm ? (
          <button className="kl-new-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} strokeWidth={2.5} />
            Ny kampanj
          </button>
        ) : (
          <div className="kl-form-card">
            <h2>Ny kampanj</h2>

            <div className="kl-field-row">
              <div className="kl-field">
                <label className="kl-field-label">Kund</label>
                <input
                  type="text"
                  placeholder="t.ex. IKEA"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="kl-field">
                <label className="kl-field-label">Kampanjnamn</label>
                <input
                  type="text"
                  placeholder="t.ex. Sommarkampanj 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="kl-field-row">
              <div className="kl-field">
                <label className="kl-field-label">Startdatum</label>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="kl-field">
                <label className="kl-field-label">Slutdatum</label>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} min={start} />
              </div>
            </div>

            <div className="kl-field">
              <label className="kl-field-label">Plattformar &amp; budget</label>
              <div className="kl-platforms">
                {platforms.map((p, i) => (
                  <PlatformFormCard
                    key={i}
                    platform={p}
                    onChange={(updates) => updatePlatform(i, updates)}
                    onRemove={() => removePlatform(i)}
                    canRemove={platforms.length > 1}
                    campaignStart={start}
                    campaignEnd={end}
                    suggestionIndex={i}
                  />
                ))}
                <datalist id="kl-platform-suggestions">
                  {PLATFORM_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                </datalist>
                <button
                  type="button"
                  className="kl-btn-secondary"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={addPlatform}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  Lägg till plattform
                </button>
              </div>
            </div>

            <div className="kl-form-actions">
              <button className="kl-btn-primary" onClick={addCampaign} disabled={!canSubmit}>
                Skapa kampanj
              </button>
              <button className="kl-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
                Avbryt
              </button>
            </div>
          </div>
        )}

        <section style={{ marginTop: 28 }}>
          {campaigns.length === 0 ? (
            <div className="kl-empty-state">
              <h3>Inga kampanjer ännu</h3>
              <p>Skapa din första kampanj för att komma igång.</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onDelete={() => deleteCampaign(campaign.id)}
                onUpdatePlatform={(idx, updates) => updateCampaignPlatform(campaign.id, idx, updates)}
                onAddPlatform={() => addCampaignPlatform(campaign.id)}
              />
            ))
          )}
        </section>

      </div>
    </>
  );
}

/* ─── Scoped Styles ───────────────────────────────────────── */

function ScopedStyles() {
  return (
    <style>{`
      .kl-app-root, .kl-welcome-root {
        min-height: 100vh;
        margin: 0 auto;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
      }
      .kl-app-root { max-width: 920px; padding: 32px 24px 96px; }
      .kl-welcome-root { max-width: 640px; padding: 32px 24px 96px; display: flex; flex-direction: column; }

      /* Top nav */
      .kl-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; gap: 16px; }
      .kl-nav-right { display: flex; align-items: center; gap: 32px; }
      .kl-logo { display: inline-flex; align-items: center; height: 36px; color: var(--color-text); text-decoration: none; transition: opacity 200ms; border: 0; }
      .kl-logo:hover { opacity: 0.85; }
      .kl-logo svg { height: 100%; width: auto; }
      .kl-menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
      .kl-menu a { font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color 200ms; position: relative; border: 0; }
      .kl-menu a:hover, .kl-menu a.active { color: var(--color-text); }
      .kl-menu a.active::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
        height: 2px; background: var(--color-red); border-radius: 2px;
      }
      .kl-has-dropdown { position: relative; }
      .kl-has-dropdown > a { display: inline-flex; align-items: center; gap: 6px; }
      .kl-chev { font-size: 9px; line-height: 1; transition: transform 200ms; }
      .kl-has-dropdown:hover .kl-chev,
      .kl-has-dropdown:focus-within .kl-chev { transform: rotate(180deg); }
      .kl-dropdown {
        position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px;
        list-style: none; margin: 0; padding: 6px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; box-shadow: 0 16px 40px rgba(0,0,0,0.55);
        opacity: 0; visibility: hidden; transform: translateY(-4px);
        transition: opacity 200ms, visibility 200ms, transform 200ms; z-index: 20;
      }
      .kl-dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
      .kl-has-dropdown:hover .kl-dropdown,
      .kl-has-dropdown:focus-within .kl-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .kl-dropdown li { display: block; }
      .kl-dropdown a {
        display: block; padding: 8px 12px; border-radius: 6px;
        font-size: 14px; font-weight: 500; color: var(--color-text-muted); border: 0;
        transition: background 150ms, color 150ms;
      }
      .kl-dropdown a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .kl-dropdown a::after { display: none; }

      /* User chip */
      .kl-user-menu { position: relative; }
      .kl-user-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 12px 5px 5px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .kl-user-chip:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
      .kl-user-chip .kl-user-name { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
      .kl-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        background: var(--color-red); color: var(--color-text);
        font-size: 12px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .kl-user-chip .kl-avatar { width: 22px; height: 22px; font-size: 11px; }
      .kl-user-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.55); z-index: 20;
      }
      .kl-user-dropdown button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 12px; background: transparent; border: 0;
        border-radius: 6px; color: var(--color-text-muted);
        font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: all 200ms;
      }
      .kl-user-dropdown button:hover { background: var(--color-surface-2); color: var(--color-text); }

      /* Welcome */
      .kl-welcome-nav { margin-bottom: 64px; }
      .kl-welcome-card { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      .kl-welcome-card h1 {
        font-size: clamp(40px, 6vw, 64px); font-weight: 700;
        line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px;
      }
      .kl-welcome-card h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg); font-size: 1.1em;
      }
      .kl-welcome-card p {
        color: var(--color-text-muted); font-size: 17px; line-height: 1.6;
        margin: 0 0 36px; max-width: 50ch;
      }
      .kl-welcome-input { display: flex; gap: 12px; margin-bottom: 36px; }
      .kl-welcome-input input { flex: 1; font-size: 17px; padding: 14px 18px; }
      .kl-welcome-input button { padding: 14px 22px; white-space: nowrap; }
      .kl-welcome-users { display: flex; flex-direction: column; gap: 14px; }
      .kl-welcome-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-faint);
      }
      .kl-user-pills { display: flex; flex-wrap: wrap; gap: 8px; }
      .kl-user-pill {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 18px 6px 6px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 14px; font-weight: 500; cursor: pointer;
        transition: all 200ms;
      }
      .kl-user-pill:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }

      /* Hero */
      .kl-hero { margin-bottom: 32px; }
      .kl-hero h1 {
        font-size: clamp(32px, 4.5vw, 48px); font-weight: 700;
        line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 12px;
      }
      .kl-hero h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg);
      }
      .kl-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0; max-width: 60ch; }

      /* Buttons */
      .kl-new-btn, .kl-btn-primary {
        background: var(--color-red); color: var(--color-text); border: 0;
        font-family: inherit; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: background 200ms, transform 100ms;
        display: inline-flex; align-items: center; gap: 8px;
      }
      .kl-new-btn { padding: 12px 20px; border-radius: 10px; }
      .kl-btn-primary { padding: 11px 22px; border-radius: 10px; }
      .kl-new-btn:hover, .kl-btn-primary:hover { background: var(--color-red-hover); }
      .kl-new-btn:active { transform: scale(0.98); }
      .kl-btn-primary:disabled {
        background: var(--color-surface-3); color: var(--color-text-faint); cursor: not-allowed;
      }
      .kl-btn-ghost {
        background: transparent; color: var(--color-text-muted); border: 0;
        padding: 11px 14px; border-radius: 10px; font-family: inherit;
        font-weight: 500; font-size: 14px; cursor: pointer; transition: color 200ms;
      }
      .kl-btn-ghost:hover { color: var(--color-text); }
      .kl-btn-secondary {
        background: var(--color-surface-3); border: 1px solid var(--color-border-strong);
        color: var(--color-text); border-radius: 10px;
        font-family: inherit; font-weight: 500; font-size: 13px;
        padding: 9px 14px; cursor: pointer; transition: all 200ms;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .kl-btn-secondary:hover:not(:disabled) { background: var(--color-border); }
      .kl-btn-danger {
        background: transparent; color: var(--color-text-muted);
        border: 1px solid var(--color-border);
        padding: 8px 14px; border-radius: 10px;
        font-family: inherit; font-weight: 500; font-size: 13px;
        cursor: pointer; transition: all 200ms;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .kl-btn-danger:hover {
        background: rgba(214,59,59,0.1); color: var(--color-red); border-color: rgba(214,59,59,0.4);
      }

      /* Form */
      .kl-form-card {
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 16px; padding: 28px; margin: 8px 0 32px;
      }
      .kl-form-card h2 { font-size: 20px; font-weight: 600; margin: 0 0 20px; }
      .kl-field { margin-bottom: 20px; }
      .kl-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
      .kl-field-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-muted);
        margin-bottom: 8px; display: block;
      }
      .kl-app-root input[type="text"], .kl-app-root input[type="number"], .kl-app-root input[type="date"],
      .kl-welcome-root input[type="text"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 15px;
        padding: 10px 14px; border-radius: 10px; width: 100%; outline: none;
        transition: border-color 200ms;
      }
      .kl-app-root input:focus, .kl-welcome-root input:focus { border-color: var(--color-blue); }
      .kl-app-root input[type="date"] { color-scheme: dark; }
      .kl-app-root ::placeholder, .kl-welcome-root ::placeholder { color: var(--color-text-faint); }
      .kl-app-root input[type="number"] { -moz-appearance: textfield; }
      .kl-app-root input[type="number"]::-webkit-outer-spin-button,
      .kl-app-root input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

      /* Platform sub-form */
      .kl-platforms { display: flex; flex-direction: column; gap: 10px; }
      .kl-platform-card {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        border-radius: 12px; padding: 14px 14px 12px;
        display: flex; flex-direction: column; gap: 10px;
        transition: border-color 200ms;
      }
      .kl-platform-card:focus-within { border-color: var(--color-border-strong); }
      .kl-pc-row { display: grid; gap: 8px; align-items: center; }
      .kl-pc-row.top { grid-template-columns: 1fr 160px auto; }
      .kl-pc-row.dates { grid-template-columns: 1fr 1fr; }
      .kl-pc-row.status { grid-template-columns: 1fr; }
      .kl-pc-budget-wrap { position: relative; display: flex; align-items: center; }
      .kl-pc-budget-wrap input { padding-right: 36px; }
      .kl-pc-budget-wrap .currency { position: absolute; right: 14px; color: var(--color-text-faint); font-size: 14px; pointer-events: none; }
      .kl-pc-mini-label {
        font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
        text-transform: uppercase; color: var(--color-text-faint);
        margin-bottom: 6px; display: block;
      }

      .kl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .kl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }
      .kl-icon-btn.danger:hover { color: var(--color-red); background: rgba(214,59,59,0.1); }
      .kl-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

      /* Status segmented control */
      .kl-status-seg {
        display: inline-flex; gap: 4px;
        background: var(--color-bg); padding: 3px;
        border: 1px solid var(--color-border); border-radius: 999px;
        flex-wrap: nowrap;
      }
      .kl-status-seg button {
        border: 0; background: transparent; color: var(--color-text-muted);
        font-family: inherit; font-size: 12px; font-weight: 500;
        padding: 6px 12px; border-radius: 999px; cursor: pointer;
        display: inline-flex; align-items: center; gap: 6px;
        transition: all 200ms; white-space: nowrap;
      }
      .kl-status-seg button:hover { color: var(--color-text); }
      .kl-status-seg button.active {
        color: var(--color-text); background: var(--color-surface-2);
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      }
      .kl-status-seg button .sdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
      .kl-status-seg.compact { padding: 2px; }
      .kl-status-seg.compact button { padding: 4px 9px; font-size: 11px; gap: 5px; }
      .kl-status-seg.compact button .sdot { width: 6px; height: 6px; }

      .kl-form-actions { display: flex; gap: 12px; align-items: center; margin-top: 8px; }

      /* Campaign card */
      .kl-campaign {
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 16px; margin-bottom: 14px; overflow: hidden;
        transition: border-color 200ms;
      }
      .kl-campaign:hover { border-color: var(--color-border-strong); }
      .kl-campaign-header {
        display: grid; grid-template-columns: 1fr auto auto auto auto;
        gap: 16px; align-items: center; padding: 18px 20px;
        cursor: pointer; user-select: none;
        background: transparent; border: 0; width: 100%;
        text-align: left; color: inherit; font-family: inherit;
        transition: background 150ms;
      }
      .kl-campaign-header:hover { background: rgba(255,255,255,0.015); }
      .kl-campaign-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
      .kl-campaign-client {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .kl-campaign-name {
        font-size: 17px; font-weight: 600; color: var(--color-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .kl-meta-pill {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500;
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text-muted); white-space: nowrap;
      }
      .kl-meta-pill.budget { color: var(--color-text); font-weight: 600; }
      .kl-meta-pill.status { color: var(--color-text); }
      .kl-meta-pill.status .sdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
      .kl-meta-pill.status.active .sdot { animation: kl-pulse 2s infinite; }
      @keyframes kl-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.85); }
      }
      .kl-chevron { color: var(--color-text-faint); transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1); }
      .kl-campaign.open .kl-chevron { transform: rotate(180deg); color: var(--color-text); }

      .kl-campaign-body {
        border-top: 1px solid var(--color-border);
        background: rgba(0,0,0,0.18);
        padding: 22px 20px 20px;
        display: flex; flex-direction: column; gap: 24px;
      }
      .kl-section-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-faint);
        margin-bottom: 10px;
      }

      /* Overall campaign timeline */
      .kl-timeline { display: flex; flex-direction: column; gap: 10px; }
      .kl-timeline-labels {
        display: flex; justify-content: space-between; align-items: center;
        font-size: 12px; color: var(--color-text-muted); font-weight: 500;
      }
      .kl-timeline-labels .duration {
        font-size: 11px; letter-spacing: 0.08em;
        text-transform: uppercase; color: var(--color-text-faint);
      }
      .kl-timeline-bar {
        position: relative; height: 8px;
        background: var(--color-surface-3); border-radius: 999px;
      }
      .kl-timeline-fill {
        position: absolute; left: 0; top: 0; bottom: 0;
        border-radius: 999px;
        transition: width 400ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .kl-timeline-today {
        position: absolute; top: 50%;
        width: 14px; height: 14px; border-radius: 50%;
        background: var(--color-text); border: 3px solid var(--color-bg);
        transform: translate(-50%, -50%);
        box-shadow: 0 0 0 2px var(--color-success), 0 0 12px rgba(91,174,110,0.4);
      }
      .kl-timeline-today-label {
        position: absolute; top: 18px;
        transform: translateX(-50%);
        font-size: 10px; font-weight: 600; color: var(--color-success);
        letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
      }

      /* Platform list (display) */
      .kl-platform-list { display: flex; flex-direction: column; gap: 8px; }
      .kl-pl-item {
        display: flex; flex-direction: column; gap: 10px;
        padding: 12px 14px;
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        border-radius: 10px;
        transition: opacity 250ms, border-color 200ms;
      }
      .kl-pl-item.inaktiv { opacity: 0.65; }
      .kl-pl-row-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-width: 0; }
      .kl-pl-row-bottom { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
      .kl-pl-name { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
      .kl-pl-name .pdot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; transition: background 300ms; }

      /* Inline editable inputs */
      .kl-pl-inline-input {
        background: var(--color-bg); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit;
        border-radius: 8px; outline: none;
        transition: border-color 200ms, background 200ms;
      }
      .kl-pl-inline-input:hover { border-color: var(--color-border-strong); background: var(--color-surface-3); }
      .kl-pl-inline-input:focus { border-color: var(--color-blue); background: var(--color-surface-3); }
      .kl-pl-name-input { font-size: 14px; font-weight: 600; padding: 4px 10px; flex: 1; min-width: 0; }

      .kl-pl-budget-edit { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; }
      .kl-pl-budget-edit input[type="number"] {
        font-size: 14px; font-weight: 600; padding: 4px 8px;
        width: 96px; text-align: right; font-variant-numeric: tabular-nums;
        -moz-appearance: textfield;
      }
      .kl-pl-budget-edit input[type="number"]::-webkit-outer-spin-button,
      .kl-pl-budget-edit input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .kl-pl-budget-edit .suffix { font-size: 13px; color: var(--color-text-muted); font-weight: 500; }

      .kl-pl-dates-edit { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .kl-pl-dates-edit input[type="date"] {
        font-size: 12px; font-weight: 500; padding: 4px 8px;
        width: auto; cursor: pointer; color-scheme: dark;
      }
      .kl-pl-dates-edit .dash { color: var(--color-text-faint); font-size: 12px; }

      /* Add platform button */
      .kl-pl-add-btn {
        margin-top: 4px; padding: 12px 14px;
        background: transparent; border: 1px dashed var(--color-border);
        border-radius: 10px; color: var(--color-text-muted);
        font-family: inherit; font-weight: 500; font-size: 13px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        transition: all 200ms; width: 100%;
      }
      .kl-pl-add-btn:hover {
        color: var(--color-text); border-color: var(--color-border-strong);
        background: var(--color-surface-2);
      }

      .kl-pl-empty-hint {
        font-size: 13px; color: var(--color-text-faint);
        margin: 0 0 4px; font-style: italic;
      }
      .kl-pl-total {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 14px; margin-top: 4px;
        border-top: 1px dashed var(--color-border); font-size: 14px;
      }
      .kl-pl-total .label { color: var(--color-text-muted); font-weight: 500; }
      .kl-pl-total .value {
        color: var(--color-text); font-weight: 700; font-size: 16px;
        font-variant-numeric: tabular-nums;
      }

      /* Platform calendar (Gantt) */
      .kl-cal {
        display: flex; flex-direction: column; gap: 6px;
        padding-top: 22px; position: relative;
      }
      .kl-cal-header { position: absolute; top: 0; left: 112px; right: 0; height: 18px; }
      .kl-cal-month {
        position: absolute; top: 0;
        font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
        text-transform: uppercase; color: var(--color-text-muted);
        transform: translateX(2px); white-space: nowrap;
      }
      .kl-cal-row {
        display: grid; grid-template-columns: 100px 1fr;
        gap: 12px; align-items: center;
      }
      .kl-cal-row-label {
        font-size: 13px; font-weight: 500; color: var(--color-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .kl-cal-row-label.inaktiv { color: var(--color-text-faint); }
      .kl-cal-track {
        position: relative; height: 14px;
        background: var(--color-surface-3); border-radius: 7px;
      }
      .kl-cal-line {
        position: absolute; top: -22px; bottom: 0;
        width: 1px; background: var(--color-border);
        pointer-events: none; opacity: 0.6;
      }
      .kl-cal-bar {
        position: absolute; top: 0; bottom: 0;
        border-radius: 7px; min-width: 4px;
        transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .kl-cal-bar.inaktiv {
        background: repeating-linear-gradient(45deg,
          var(--color-text-faint), var(--color-text-faint) 4px,
          transparent 4px, transparent 8px);
        border: 1px solid var(--color-text-faint); opacity: 0.5;
      }
      .kl-cal-today-line {
        position: absolute; top: -22px; bottom: 0;
        width: 2px; background: var(--color-text);
        pointer-events: none; z-index: 2;
        box-shadow: 0 0 8px rgba(240,239,232,0.5);
      }

      .kl-body-actions { display: flex; justify-content: flex-end; }

      .kl-empty-state {
        text-align: center; padding: 56px 24px;
        color: var(--color-text-muted);
        border: 1px dashed var(--color-border); border-radius: 16px;
      }
      .kl-empty-state h3 { color: var(--color-text); margin: 0 0 8px; font-weight: 600; }
      .kl-empty-state p { margin: 0; font-size: 14px; }

      /* Mobile */
      @media (max-width: 700px) {
        .kl-top-nav { margin-bottom: 32px; }
        .kl-nav-right { gap: 16px; }
        .kl-menu { gap: 16px; }
        .kl-user-chip .kl-user-name { max-width: 80px; }
        .kl-form-card { padding: 20px; }
        .kl-field-row { grid-template-columns: 1fr; gap: 0; }
        .kl-field-row .kl-field { margin-bottom: 20px; }
        .kl-pc-row.top { grid-template-columns: 1fr auto; }
        .kl-pc-row.top .kl-pc-budget-wrap { grid-column: 1 / -1; }
        .kl-status-seg { flex-wrap: wrap; }
        .kl-campaign-header {
          grid-template-columns: 1fr auto;
          grid-template-areas: "title chevron" "meta meta";
          gap: 10px;
        }
        .kl-campaign-title { grid-area: title; }
        .kl-chevron { grid-area: chevron; }
        .kl-campaign-header .kl-meta-pill:nth-of-type(1) { grid-area: meta; justify-self: start; }
        .kl-campaign-header .kl-meta-pill:nth-of-type(2),
        .kl-campaign-header .kl-meta-pill:nth-of-type(3) { display: none; }
        .kl-pl-row-bottom { flex-direction: column; align-items: flex-start; }
        .kl-pl-budget-edit input[type="number"] { width: 80px; }
        .kl-cal-header { left: 92px; }
        .kl-cal-row { grid-template-columns: 80px 1fr; gap: 8px; }
        .kl-cal-row-label { font-size: 12px; }
        .kl-welcome-input { flex-direction: column; }
        .kl-welcome-input button { width: 100%; }
      }
    `}</style>
  );
}
