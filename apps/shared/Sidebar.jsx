import { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'todo',    label: 'Todo',             href: '../todo/' },
  { key: 'kampanj', label: 'Kampanjplanerare', href: '../kampanj/' },
  { key: 'seo',     label: 'GEO och SEO',      href: '../seo-audit/' },
  { key: 'trackr',  label: 'Track3r',           href: '../trackr/' },
];

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function ThemeToggle({ theme: themeProp, onToggle }) {
  const [internal, setInternal] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );
  const theme = themeProp !== undefined ? themeProp : internal;

  const toggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      const next = internal === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ailabb_theme', next);
      setInternal(next);
    }
  };

  return (
    <button className="sb-row-btn" onClick={toggle} aria-label="Byt tema">
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      {theme === 'dark' ? 'Ljust läge' : 'Mörkt läge'}
    </button>
  );
}

export function SidebarStyles() {
  return (
    <style>{`
      .sb-shell { display: flex; min-height: 100vh; }
      .sb-sidebar {
        width: 216px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        padding: 22px 10px;
        border-right: 1px solid var(--color-border);
        background: var(--color-surface);
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        box-sizing: border-box;
        z-index: 10;
      }
      .sb-logo-link {
        display: block;
        height: 32px;
        color: var(--color-text);
        text-decoration: none;
        border: 0;
        margin: 0 8px 28px;
        opacity: 0.9;
        transition: opacity 200ms;
      }
      .sb-logo-link:hover { opacity: 0.65; }
      .sb-logo-link svg { height: 100%; width: auto; display: block; }
      .sb-nav {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
        flex: 1;
      }
      .sb-nav a {
        display: block;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 13.5px;
        font-weight: 500;
        color: var(--color-text-muted);
        text-decoration: none;
        border: 0;
        transition: background 140ms, color 140ms;
      }
      .sb-nav a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .sb-nav a.sb-active {
        background: var(--color-surface-2);
        color: var(--color-text);
        font-weight: 600;
      }
      .sb-bottom {
        margin-top: auto;
        padding-top: 10px;
        border-top: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .sb-row-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        border: 0;
        background: transparent;
        color: var(--color-text-muted);
        font-family: inherit;
        font-size: 13.5px;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
        transition: background 140ms, color 140ms;
        width: 100%;
        box-sizing: border-box;
      }
      .sb-row-btn:hover { background: var(--color-surface-2); color: var(--color-text); }
      .sb-user { position: relative; }
      .sb-user-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
      .sb-avatar {
        width: 22px; height: 22px; border-radius: 50%;
        background: var(--color-red); color: #FFF;
        font-size: 11px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .sb-user-dropdown {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 0; right: 0;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 10px;
        padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.06);
        z-index: 50;
      }
      .sb-user-dropdown button {
        display: flex; align-items: center; gap: 10px;
        width: 100%; padding: 9px 12px;
        background: transparent; border: 0; border-radius: 6px;
        color: var(--color-text-muted); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer;
        text-align: left; transition: all 180ms;
      }
      .sb-user-dropdown button:hover { background: var(--color-surface-2); color: var(--color-text); }
    `}</style>
  );
}

export function Sidebar({ activeApp, user, onSwitchUser, theme, onToggleTheme }) {
  const [userOpen, setUserOpen] = useState(false);

  const closeUser = () => setUserOpen(false);

  return (
    <aside className="sb-sidebar" onClick={userOpen ? closeUser : undefined}>
      <a href="../../" className="sb-logo-link" aria-label="Gustav Mattsson — AI Labb">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 623.04 583.35" aria-hidden="true">
          <defs>
            <style>{`.logo-cls-1{font-size:193.17px}.logo-cls-1,.logo-cls-2{font-family:Montserrat-Bold,Montserrat;font-weight:700;opacity:.91}.logo-cls-2{font-size:189.12px}`}</style>
          </defs>
          <path d="M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"/>
          <path d="M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"/>
          <path d="M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"/>
          <text className="logo-cls-1" transform="translate(144.86 300.16)"><tspan x="0" y="0">0</tspan><tspan x="130" y="0">100</tspan></text>
          <text className="logo-cls-2" transform="translate(259.2 447.19) scale(1.04 1)"><tspan x="0" y="0">0</tspan><tspan x="127.28" y="0">111</tspan></text>
        </svg>
      </a>

      <ul className="sb-nav">
        {NAV_ITEMS.map(({ key, label, href }) => (
          <li key={key}>
            <a href={href} className={activeApp === key ? 'sb-active' : ''}>{label}</a>
          </li>
        ))}
      </ul>

      <div className="sb-bottom">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {user && (
          <div className="sb-user" onClick={e => e.stopPropagation()}>
            <button className="sb-row-btn" onClick={() => setUserOpen(o => !o)}>
              <span className="sb-avatar">{user[0].toUpperCase()}</span>
              <span className="sb-user-name">{user}</span>
              <ChevronDown size={12} style={{ flexShrink: 0, transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }} />
            </button>
            {userOpen && (
              <div className="sb-user-dropdown">
                <button onClick={() => { setUserOpen(false); onSwitchUser?.(); }}>
                  <LogOut size={14} />
                  Byt användare
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
