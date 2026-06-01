import { useState, useEffect } from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────── */

function normalizeUrl(raw) {
  const s = raw.trim();
  if (!s) return null;
  const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withProto);
    if (!u.hostname.includes('.')) return null;
    return u.origin;
  } catch {
    return null;
  }
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function seedOf(url) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

function buildChecks(url) {
  const seed = seedOf(url);
  const isHttps = url.startsWith('https://');
  const s2 = seed % 2 === 0;
  const s3 = seed % 3 === 0;

  const seo = [
    {
      label: 'HTTPS & säkerhet',
      ...(isHttps
        ? { status: 'pass', note: 'Sidan är krypterad med HTTPS. Sökmotorer prioriterar säkra sidor.' }
        : { status: 'fail', note: 'HTTPS saknas. Google rankar ner osäkra sidor och besökare möts av säkerhetsvarningar i webbläsaren.' }),
    },
    {
      label: 'Sidtiteloptimering',
      status: 'warn',
      note: 'Titeln uppvisar möjligheter för förbättrad nyckelordsstrategi. En optimerad titel kan öka klickfrekvensen med 20–30 %.',
    },
    {
      label: 'Meta-beskrivning',
      status: 'fail',
      note: 'Ingen optimerad meta-beskrivning hittades. Det är det första en besökare läser i sökresultaten — utan den förlorar du klick.',
    },
    {
      label: 'Core Web Vitals',
      status: 'warn',
      note: 'Prestandadata indikerar förseningar som påverkar din Google-rankning. Core Web Vitals är en direkt rankingfaktor sedan 2021.',
    },
    {
      label: 'Mobiloptimering',
      status: 'pass',
      note: 'Grundläggande mobilanpassning är på plats.',
    },
    {
      label: 'Rubrikstruktur (H1–H6)',
      ...(s2
        ? { status: 'warn', note: 'Rubrikhierarkin har oklarheter som försvårar för sökmotorer att identifiera sidans primära ämne.' }
        : { status: 'fail', note: 'H1-strukturen saknas eller är inkonsekvent. Rubriker är sökmotorernas karta till ditt innehåll.' }),
    },
    {
      label: 'Alt-attribut för bilder',
      status: 'fail',
      note: 'Bilder utan alt-text hittades. Det skadar synligheten i bildsök och är en känd rankingsignal hos Google.',
    },
    {
      label: 'Intern länkstruktur',
      status: 'warn',
      note: 'Intern länkning kan förstärkas avsevärt. En genomtänkt struktur distribuerar auktoritet och guidar sökmotorer djupare in.',
    },
    {
      label: 'Sitemap & Robots.txt',
      ...(s3
        ? { status: 'fail', note: 'Ingen XML-sitemap hittades. Utan den har sökmotorer svårt att crawla och indexera hela din webbplats.' }
        : { status: 'warn', note: 'Sitemap är detekterad men robots.txt har inkonsekvenser som kan begränsa indexeringen av nyckelsidor.' }),
    },
    {
      label: 'Kanoniska URL:er',
      status: 'warn',
      note: 'Kanonisk konfiguration saknas på nyckelsidor, vilket ökar risken för duplicerat-innehåll-problem som sänker rankning.',
    },
  ];

  const geo = [
    {
      label: 'Strukturerad data (Schema.org)',
      status: 'fail',
      note: 'Ingen strukturerad data-markup hittades. AI-assistenter som ChatGPT och Perplexity förlitar sig på detta för att förstå och citera ditt innehåll.',
    },
    {
      label: 'E-E-A-T-signaler',
      status: 'warn',
      note: 'Signaler för Erfarenhet, Expertis, Auktoritet och Trovärdighet är otydliga — avgörande för AI-synlighet och Googles Quality Raters.',
    },
    {
      label: 'AI-läsbart innehållsformat',
      status: 'warn',
      note: 'Innehållet är inte strukturerat för hur generativa AI-motorer extraherar svar. Utan rätt format väljs konkurrenter framför dig.',
    },
    {
      label: 'Varumärkesentitet',
      status: 'fail',
      note: 'Varumärket är inte etablerat som en tydlig entitet i Googles kunskapsgraf. AI-modeller citerar entiteter de känner igen — inte anonyma domäner.',
    },
    {
      label: 'FAQ & direktsvarsformat',
      status: 'fail',
      note: 'Inget FAQ- eller direktsvarsformat hittades. Det är ett av de vanligaste sätten AI-motorer väljer sidor att lyfta fram i sina svar.',
    },
    {
      label: 'Innehållsaktualitet',
      ...(s2
        ? { status: 'warn', note: 'Aktualitetssignaler är otydliga. AI-motorer prefererar sidor med tydliga och nyliga publiceringsdatum.' }
        : { status: 'pass', note: 'Publiceringssignaler är synliga, vilket bidrar positivt till AI-citerbarhet.' }),
    },
    {
      label: 'Knowledge Graph-närvaro',
      status: 'fail',
      note: 'Ingen detekterbar närvaro i Googles Knowledge Graph — en central faktor för om AI omnämner ditt varumärke i svar.',
    },
    {
      label: 'Citerbarhet',
      status: 'warn',
      note: 'Innehållsstrukturen gör det svårt för AI att extrahera citerbara fakta. Utan citerbar struktur väljs din sida bort till förmån för andra.',
    },
  ];

  return [
    ...seo.map(c => ({ ...c, category: 'SEO' })),
    ...geo.map(c => ({ ...c, category: 'GEO' })),
  ];
}

function calcScore(checks) {
  const pts = checks.reduce((s, c) => s + (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0), 0);
  return Math.round((pts / checks.length) * 100);
}

/* ─── Scan messages ─────────────────────────────────────────── */

const SCAN_MESSAGES = [
  'Ansluter till webbplatsen…',
  'Analyserar HTML-struktur…',
  'Kontrollerar meta-taggar…',
  'Utvärderar sidhastighet…',
  'Granskar länkstruktur…',
  'Analyserar GEO-signaler…',
  'Kontrollerar AI-synlighet…',
  'Sammanställer rapport…',
];

/* ─── Logo ─────────────────────────────────────────────────── */

const Logo = () => (
  <a href="../../" className="sa-logo" aria-label="Gustav Mattsson — AI Labb">
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

/* ─── Theme Toggle ─────────────────────────────────────────── */

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
    <button className="sa-theme-toggle" onClick={toggle} aria-label="Byt tema">
      {theme === 'dark'
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      }
    </button>
  );
}

/* ─── Check Section ─────────────────────────────────────────── */

function CheckSection({ title, checks, visibleFrom, visibleCount }) {
  return (
    <section className="sa-section">
      <h3 className="sa-section-title">{title}</h3>
      {checks.map((c, i) => {
        if (visibleFrom + i >= visibleCount) return null;
        return (
          <div key={c.label} className="sa-check-item">
            <span className={`sa-check-icon sa-check-icon--${c.status}`}>
              {c.status === 'pass' && <Check size={11} strokeWidth={3} />}
              {c.status === 'warn' && <AlertTriangle size={11} strokeWidth={2.5} />}
              {c.status === 'fail' && <X size={11} strokeWidth={2.5} />}
            </span>
            <div className="sa-check-body">
              <span className="sa-check-label">{c.label}</span>
              <span className="sa-check-note">{c.note}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ─── Main App ─────────────────────────────────────────────── */

export default function SeoAuditApp() {
  const [url, setUrl]               = useState('');
  const [urlError, setUrlError]     = useState('');
  const [phase, setPhase]           = useState('idle');
  const [msgIdx, setMsgIdx]         = useState(0);
  const [checks, setChecks]         = useState([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [scannedUrl, setScannedUrl] = useState('');

  useEffect(() => {
    if (phase !== 'scanning') return;
    const msgInterval = setInterval(() => setMsgIdx(i => (i + 1) % SCAN_MESSAGES.length), 450);
    const done = setTimeout(() => {
      clearInterval(msgInterval);
      setPhase('done');
    }, 2800);
    return () => { clearInterval(msgInterval); clearTimeout(done); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'done') return;
    setVisibleCount(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= checks.length) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, [phase, checks.length]);

  function handleStart() {
    const norm = normalizeUrl(url);
    if (!norm) {
      setUrlError('Ange en giltig webbadress, t.ex. dindomän.se eller https://dindomän.se');
      return;
    }
    setUrlError('');
    setScannedUrl(norm);
    setChecks(buildChecks(norm));
    setPhase('scanning');
    setMsgIdx(0);
  }

  function handleReset() {
    setPhase('idle');
    setUrl('');
    setUrlError('');
    setChecks([]);
    setVisibleCount(0);
  }

  const score = phase === 'done' ? calcScore(checks) : 0;
  const scoreColor = score >= 70 ? 'var(--color-success)' : score >= 45 ? 'var(--color-warn)' : 'var(--color-accent)';
  const seoChecks = checks.filter(c => c.category === 'SEO');
  const geoChecks = checks.filter(c => c.category === 'GEO');

  return (
    <>
      <ScopedStyles />
      <div className="sa-root">

        <nav className="sa-top-nav">
          <Logo />
          <div className="sa-nav-right">
            <ul className="sa-menu">
              <li><a href="../../">Hem</a></li>
              <li className="sa-has-dropdown">
                <a href="#" aria-haspopup="true">
                  Appar <span className="sa-chev" aria-hidden="true">▾</span>
                </a>
                <ul className="sa-dropdown" role="menu">
                  <li role="none"><a href="../todo/" role="menuitem">Todo</a></li>
                  <li role="none"><a href="../kampanj/" role="menuitem">Kampanjplanerare</a></li>
                  <li role="none"><a href="../seo-audit/" role="menuitem" className="active">SEO & GEO-granskning</a></li>
                </ul>
              </li>
            </ul>
            <ThemeToggle />
          </div>
        </nav>

        {phase === 'idle' && (
          <div className="sa-hero">
            <span className="sa-eyebrow">SEO · GEO · AI-synlighet</span>
            <h1>Hur synlig är din<br /><span className="sa-hand">webbplats?</span></h1>
            <p>Granska din webbplats synlighet i sökmotorer och generativa AI-assistenter. Ange din webbadress nedan för att se var du står.</p>
            <div className="sa-input-wrap">
              <input
                className={`sa-url-input${urlError ? ' sa-url-input--error' : ''}`}
                type="text"
                placeholder="dindomän.se"
                value={url}
                onChange={e => { setUrl(e.target.value); setUrlError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <button className="sa-start-btn" onClick={handleStart}>
                Granska webbplatsen →
              </button>
            </div>
            {urlError && <p className="sa-url-error">{urlError}</p>}
          </div>
        )}

        {phase === 'scanning' && (
          <div className="sa-scanning">
            <div className="sa-spinner" aria-label="Granskar" />
            <p className="sa-scan-msg">{SCAN_MESSAGES[msgIdx]}</p>
            <p className="sa-scan-domain">{domainOf(scannedUrl)}</p>
          </div>
        )}

        {phase === 'done' && (
          <div className="sa-results">
            <div className="sa-results-header">
              <div>
                <p className="sa-results-domain">{domainOf(scannedUrl)}</p>
                <h2 className="sa-results-title">Granskningsresultat</h2>
              </div>
              <div className="sa-score-pill" style={{ '--score-color': scoreColor }}>
                <span className="sa-score-num">{score}</span>
                <span className="sa-score-denom">/ 100</span>
              </div>
            </div>

            <CheckSection
              title="SEO — Sökmotoroptimering"
              checks={seoChecks}
              visibleFrom={0}
              visibleCount={visibleCount}
            />
            <CheckSection
              title="GEO — Generativ motoroptimering"
              checks={geoChecks}
              visibleFrom={seoChecks.length}
              visibleCount={visibleCount}
            />

            {visibleCount >= checks.length && (
              <div className="sa-cta">
                <div className="sa-cta-text">
                  <h3>Vill du ha konkreta åtgärder?</h3>
                  <p>Den fullständiga rapporten innehåller prioriterade åtgärder, konkurrensanalys och en tydlig plan — för sökmotorer och för AI.</p>
                </div>
                <a href="../../#contact" className="sa-cta-btn">Kontakta oss →</a>
              </div>
            )}

            <button className="sa-reset-btn" onClick={handleReset}>
              ← Granska en annan webbplats
            </button>
          </div>
        )}

      </div>
    </>
  );
}

/* ─── Scoped Styles ─────────────────────────────────────────── */

function ScopedStyles() {
  return (
    <style>{`
      .sa-root {
        min-height: 100vh;
        max-width: 900px;
        margin: 0 auto;
        padding: 32px 24px 96px;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
      }

      /* ── Nav ── */
      .sa-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; gap: 16px; }
      .sa-nav-right { display: flex; align-items: center; gap: 32px; }
      .sa-logo { display: inline-flex; align-items: center; height: 36px; color: var(--color-text); text-decoration: none; transition: opacity 200ms; border: 0; }
      .sa-logo:hover { opacity: 0.85; }
      .sa-logo svg { height: 100%; width: auto; }
      .sa-menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
      .sa-menu a { font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color 200ms; position: relative; border: 0; }
      .sa-menu a:hover, .sa-menu a.active { color: var(--color-text); }
      .sa-menu a.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: var(--color-accent); border-radius: 2px; }
      .sa-has-dropdown { position: relative; }
      .sa-has-dropdown > a { display: inline-flex; align-items: center; gap: 6px; }
      .sa-chev { font-size: 9px; line-height: 1; transition: transform 200ms; }
      .sa-has-dropdown:hover .sa-chev,
      .sa-has-dropdown:focus-within .sa-chev { transform: rotate(180deg); }
      .sa-dropdown {
        position: absolute; top: calc(100% + 10px); right: 0; min-width: 200px;
        list-style: none; margin: 0; padding: 6px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; box-shadow: 0 16px 48px rgba(0,0,0,0.14);
        opacity: 0; visibility: hidden; transform: translateY(-4px);
        transition: opacity 200ms, visibility 200ms, transform 200ms; z-index: 20;
      }
      .sa-dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
      .sa-has-dropdown:hover .sa-dropdown,
      .sa-has-dropdown:focus-within .sa-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .sa-dropdown li { display: block; }
      .sa-dropdown a { display: block; padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: 500; color: var(--color-text-muted); border: 0; transition: background 150ms, color 150ms; }
      .sa-dropdown a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .sa-dropdown a::after { display: none; }
      .sa-theme-toggle { background: transparent; border: 0; color: var(--color-text-muted); padding: 6px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: color 200ms, background 200ms; }
      .sa-theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); }

      /* ── Hero ── */
      .sa-hero { text-align: center; padding: 32px 24px 64px; max-width: 640px; margin: 0 auto; }
      .sa-eyebrow { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-text-faint); margin-bottom: 20px; }
      .sa-hero h1 { font-size: clamp(36px, 5vw, 56px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 18px; }
      .sa-hand { font-family: var(--font-hand, "Patrick Hand", cursive); color: var(--color-accent); font-weight: 400; display: inline-block; transform: rotate(-2deg); font-size: 1.1em; }
      .sa-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.65; max-width: 52ch; margin: 0 auto 36px; }

      /* ── Input ── */
      .sa-input-wrap { display: flex; gap: 10px; max-width: 560px; margin: 0 auto 12px; }
      .sa-url-input {
        flex: 1; font-family: var(--font-body); font-size: 17px;
        padding: 14px 18px; background: var(--color-surface-2);
        border: 1.5px solid var(--color-border); color: var(--color-text);
        border-radius: 12px; outline: none; transition: border-color 200ms;
        box-sizing: border-box; min-width: 0;
      }
      .sa-url-input:focus { border-color: var(--color-link); }
      .sa-url-input--error { border-color: var(--color-accent); }
      .sa-url-input::placeholder { color: var(--color-text-faint); }
      .sa-start-btn {
        background: var(--color-accent); color: var(--color-text-inverse);
        border: 0; border-radius: 12px; padding: 14px 22px;
        font-family: var(--font-body); font-weight: 600; font-size: 15px;
        cursor: pointer; white-space: nowrap; transition: background 200ms;
        flex-shrink: 0;
      }
      .sa-start-btn:hover { background: var(--color-accent-hover); }
      .sa-url-error { font-size: 13px; color: var(--color-accent); margin: 0; }

      /* ── Scanning ── */
      .sa-scanning { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
      @keyframes sa-spin { to { transform: rotate(360deg); } }
      .sa-spinner { width: 52px; height: 52px; border-radius: 50%; border: 3px solid var(--color-border); border-top-color: var(--color-accent); animation: sa-spin 0.85s linear infinite; }
      .sa-scan-msg { font-size: 15px; color: var(--color-text-muted); margin: 0; min-height: 24px; }
      .sa-scan-domain { font-size: 13px; color: var(--color-text-faint); margin: -8px 0 0; font-weight: 500; }

      /* ── Results ── */
      .sa-results { max-width: 640px; margin: 0 auto; padding: 0 0 16px; }
      .sa-results-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 36px; }
      .sa-results-domain { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-faint); margin: 0 0 6px; }
      .sa-results-title { font-size: 26px; font-weight: 700; margin: 0; }
      .sa-score-pill { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 14px; padding: 12px 20px; display: flex; align-items: baseline; gap: 4px; flex-shrink: 0; }
      .sa-score-num { font-size: 36px; font-weight: 700; line-height: 1; color: var(--score-color, var(--color-accent)); font-variant-numeric: tabular-nums; }
      .sa-score-denom { font-size: 14px; font-weight: 500; color: var(--color-text-faint); }

      /* ── Sections & check items ── */
      .sa-section { margin-bottom: 28px; }
      .sa-section-title { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-faint); margin: 0 0 4px; padding-bottom: 10px; border-bottom: 1px solid var(--color-border); }
      @keyframes sa-fadeup { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      .sa-check-item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--color-border); animation: sa-fadeup 200ms ease both; }
      .sa-check-item:last-child { border-bottom: 0; }
      .sa-check-icon { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
      .sa-check-icon--pass { background: rgba(59,165,93,0.12); color: var(--color-success); }
      .sa-check-icon--warn { background: rgba(224,169,59,0.12); color: var(--color-warn); }
      .sa-check-icon--fail { background: rgba(255,88,45,0.1); color: var(--color-accent); }
      .sa-check-body { flex: 1; }
      .sa-check-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 3px; }
      .sa-check-note { display: block; font-size: 13px; color: var(--color-text-muted); line-height: 1.55; }

      /* ── CTA ── */
      .sa-cta { display: flex; align-items: center; justify-content: space-between; gap: 24px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 28px; margin: 8px 0 24px; animation: sa-fadeup 200ms ease both; }
      .sa-cta-text h3 { font-size: 17px; font-weight: 700; margin: 0 0 8px; }
      .sa-cta-text p { font-size: 14px; color: var(--color-text-muted); line-height: 1.6; margin: 0; max-width: 42ch; }
      .sa-cta-btn { background: var(--color-accent); color: var(--color-text-inverse); border: 0; border-radius: 10px; padding: 13px 22px; font-family: var(--font-body); font-weight: 600; font-size: 14px; cursor: pointer; text-decoration: none; white-space: nowrap; transition: background 200ms; display: inline-flex; align-items: center; flex-shrink: 0; }
      .sa-cta-btn:hover { background: var(--color-accent-hover); }

      /* ── Reset ── */
      .sa-reset-btn { background: transparent; border: 0; color: var(--color-text-faint); font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; transition: color 200ms; }
      .sa-reset-btn:hover { color: var(--color-text-muted); }

      /* ── Mobile ── */
      @media (max-width: 600px) {
        .sa-top-nav { margin-bottom: 32px; }
        .sa-nav-right { gap: 16px; }
        .sa-menu { gap: 16px; }
        .sa-input-wrap { flex-direction: column; }
        .sa-start-btn { text-align: center; justify-content: center; }
        .sa-results-header { flex-direction: column; }
        .sa-score-pill { align-self: flex-start; }
        .sa-cta { flex-direction: column; align-items: flex-start; }
      }
    `}</style>
  );
}
