import React, { useEffect, useRef, useState } from 'react';
import {
  SPAR, NUMMER, KURATORER, sparMedId, kuratorMedId,
  kastTarning, kontrastPoang, profilFranSpar, profilFranText, bytSpar,
  tid, dekadLabel,
} from './data.js';

const FART = 8; // demo: simulerad speltid går 8× fortare

const RM =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FIN =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

const lsGet = (n, fallback) => {
  try { const v = localStorage.getItem(n); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const lsSet = (n, v) => {
  try { localStorage.setItem(n, JSON.stringify(v)); } catch { /* flyktigt läge */ }
};

/* ---------- effektkomponenter ---------- */

function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__blob aurora__blob--a" />
      <div className="aurora__blob aurora__blob--b" />
      <div className="aurora__blob aurora__blob--c" />
    </div>
  );
}

function Cursor() {
  const dot = useRef(null);
  const halo = useRef(null);
  useEffect(() => {
    if (RM || !FIN) return undefined;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let hx = mx, hy = my, raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`;
    };
    const tick = () => {
      hx += (mx - hx) * 0.09;
      hy += (my - hy) * 0.09;
      if (halo.current) halo.current.style.transform = `translate(${hx}px,${hy}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
  if (RM || !FIN) return null;
  return (
    <>
      <div ref={halo} className="markor-halo" aria-hidden="true" />
      <div ref={dot} className="markor-punkt" aria-hidden="true" />
    </>
  );
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (RM) { el.classList.add('syns'); return undefined; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('syns'); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Tilt({ children, className = '', max = 7 }) {
  const ref = useRef(null);
  const move = (e) => {
    if (RM || !FIN) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(py - 0.5) * -2 * max}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return (
    <div ref={ref} className={`tilt ${className}`} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}

function Magnet({ children, kraft = 14 }) {
  const ref = useRef(null);
  const move = (e) => {
    if (RM || !FIN) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(dx / r.width) * kraft}px, ${(dy / r.height) * kraft}px)`;
  };
  const leave = () => { ref.current.style.transform = 'translate(0,0)'; };
  return (
    <div ref={ref} className="magnet" onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}

function CountUp({ till }) {
  const [v, setV] = useState(RM ? till : 0);
  useEffect(() => {
    if (RM) { setV(till); return undefined; }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min((t - t0) / 850, 1);
      setV(Math.round(till * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [till]);
  return <>{v}</>;
}

/* ---------- appen ---------- */

export default function App() {
  const [aktivt, setAktivt] = useState(null);
  const [kontrast, setKontrast] = useState(null);
  const [spelar, setSpelar] = useState(false);
  const [pos, setPos] = useState(0);
  const [snurrar, setSnurrar] = useState(false);
  const [cykel, setCykel] = useState('');
  const [historik, setHistorik] = useState(() => lsGet('brus_historik', []));
  const [lyssnade, setLyssnade] = useState(() => lsGet('brus_lyssnade', []));
  const [domar, setDomar] = useState(() => lsGet('brus_domar', {}));
  const [bytText, setBytText] = useState('');
  const [bytResultat, setBytResultat] = useState(null);
  const kastTimer = useRef(null);
  const cykelTimer = useRef(null);

  // Simulerad uppspelning
  useEffect(() => {
    if (!spelar || !aktivt) return undefined;
    const iv = setInterval(() => {
      setPos((p) => Math.min(p + 0.2 * FART, aktivt.langdSek));
    }, 200);
    return () => clearInterval(iv);
  }, [spelar, aktivt]);

  useEffect(() => {
    if (aktivt && spelar && pos >= aktivt.langdSek) {
      setSpelar(false);
      markeraLyssnad(aktivt.id);
    }
  }, [pos, aktivt, spelar]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scrollframsteg + hero-parallax via CSS-variabler
  useEffect(() => {
    if (RM) return undefined;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement;
        const p = h.scrollTop / Math.max(h.scrollHeight - h.clientHeight, 1);
        h.style.setProperty('--framsteg', p);
        h.style.setProperty('--sy', h.scrollTop);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => () => {
    clearTimeout(kastTimer.current);
    clearInterval(cykelTimer.current);
  }, []);

  function markeraLyssnad(id) {
    setLyssnade((l) => {
      if (l.includes(id)) return l;
      const ny = [...l, id];
      lsSet('brus_lyssnade', ny);
      return ny;
    });
  }

  function starta(spar, kontrastInfo) {
    setAktivt(spar);
    setKontrast(kontrastInfo);
    setPos(0);
    setSpelar(true);
    setHistorik((h) => {
      const ny = [spar.id, ...h].slice(0, 24);
      lsSet('brus_historik', ny);
      return ny;
    });
  }

  function gaTill(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: RM ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  function kasta() {
    if (snurrar) return;
    const resultat = kastTarning(aktivt);
    if (RM) {
      starta(resultat.spar, resultat.kontrast);
      gaTill('spelare');
      return;
    }
    setSnurrar(true);
    cykelTimer.current = setInterval(() => {
      setCykel(SPAR[Math.floor(Math.random() * SPAR.length)].titel);
    }, 80);
    kastTimer.current = setTimeout(() => {
      clearInterval(cykelTimer.current);
      setSnurrar(false);
      starta(resultat.spar, resultat.kontrast);
      gaTill('spelare');
    }, 950);
  }

  function spelaDirekt(spar) {
    const fran = aktivt ? profilFranSpar(aktivt) : null;
    const k = fran ? kontrastPoang(fran, spar) : { poang: 100, delar: null };
    starta(spar, { ...k, fran });
  }

  function domSpar(id, dom) {
    setDomar((d) => {
      const ny = { ...d, [id]: { dom, ts: Date.now() } };
      lsSet('brus_domar', ny);
      return ny;
    });
    markeraLyssnad(id);
  }

  function bytRiktning(e) {
    e.preventDefault();
    if (!bytText.trim()) return;
    const profil = profilFranText(bytText);
    const r = bytSpar(profil);
    setBytResultat({ profil, ...r });
    starta(r.spar, r.kontrast);
  }

  const aktuellt = NUMMER.find((n) => !n.last) ?? NUMMER[0];
  const lasta = NUMMER.filter((n) => n.last);
  const klartAntal = aktuellt.sparIds.filter((id) => lyssnade.includes(id)).length;
  const dom = aktivt ? domar[aktivt.id]?.dom : null;
  const kurator = aktivt ? kuratorMedId(aktivt.kuratorId) : null;
  const andel = aktivt ? Math.min(pos / aktivt.langdSek, 1) * 100 : 0;

  const tickerText = (historik.length
    ? historik.map((id) => sparMedId(id)).filter(Boolean).map((s) => `${s.titel} — ${s.artist}`)
    : ['inget spelat ännu', 'pulsen väntar']
  ).join('  ·  ');

  return (
    <div className="app">
      <Aurora />
      <div className="korn" aria-hidden="true" />
      <Cursor />
      <div className="framsteg" aria-hidden="true" />

      {/* Flytande glasnav */}
      <nav className="nav" aria-label="Huvudmeny">
        <a className="nav__logo" href="#hem">brus<span>°</span></a>
        <div className="nav__lankar">
          <a href="#spelare">spelaren</a>
          <a href="#nummer">nummer</a>
          <a href="#kuratorer">kuratorer</a>
          <a href="#byt">byt spår</a>
        </div>
        <span className="nav__variant">brus°</span>
      </nav>

      {/* HERO — pulsen */}
      <header className="hero" id="hem">
        <div className="hero__inre">
          <p className="hero__tagg">musik utanför algoritmen · tryck. lyssna. döm sen.</p>
          <h1 className="hero__titel">
            musik utanför<br /><em>algoritmen</em>
          </h1>
          <p className="hero__under">
            tryck. lyssna. döm sen. du kommer inte gilla allt — det är poängen.
          </p>
          <Magnet kraft={18}>
            <button
              className={`orb${snurrar ? ' orb--snurrar' : ''}`}
              onClick={kasta}
              disabled={snurrar}
              aria-label="Kasta tärningen"
            >
              <span className="orb__ring" aria-hidden="true" />
              <span className="orb__karna">
                {snurrar ? <span className="orb__cykel">{cykel}</span> : 'tryck'}
              </span>
            </button>
          </Magnet>
          <p className="hero__vink" aria-hidden="true">scrolla ↓</p>
        </div>
      </header>

      {/* SPELAREN */}
      <section className="sektion" id="spelare">
        <Reveal><p className="sektion__tagg">01 · spelaren</p></Reveal>
        {!aktivt ? (
          <Reveal delay={80}>
            <div className="glas spelare spelare--tom">
              <p className="tom__rubrik">inget spelar ännu.</p>
              <p className="tom__text">spelaren får sitt innehåll av pulsen där uppe. inte av dig.</p>
              <button className="knapp knapp--primar" onClick={() => gaTill('hem')}>
                till pulsen ↑
              </button>
            </div>
          </Reveal>
        ) : (
          <div className="spelare__grid">
            <Reveal delay={60}>
              <Tilt className="glas glas--kant spelare" max={4}>
                <p className="spelare__etikett">{spelar ? '● spelar nu' : '◦ pausad'} · demo 8×</p>
                <h2 className="spelare__titel">{aktivt.titel}</h2>
                <p className="spelare__artist">{aktivt.artist}</p>
                <div className="chips">
                  <span className="chip">{aktivt.genre.toLowerCase()}</span>
                  <span className="chip">{aktivt.ar}</span>
                  <span className="chip">{aktivt.ursprung.toLowerCase()}</span>
                  <span className="chip">{tid(aktivt.langdSek)}</span>
                </div>
                <div className="spelare__progress">
                  <div
                    className="stapel"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={aktivt.langdSek}
                    aria-valuenow={Math.floor(pos)}
                    aria-label="Uppspelning"
                  >
                    <i style={{ width: `${andel}%` }} />
                  </div>
                  <span className="spelare__tid">{tid(pos)} / {tid(aktivt.langdSek)}</span>
                </div>
                <div className="spelare__kontroller">
                  <button className="knapp knapp--primar" onClick={() => setSpelar((s) => !s)}>
                    {spelar ? 'paus' : 'spela'}
                  </button>
                  <button className="knapp" onClick={kasta} disabled={snurrar}>
                    nästa tärning
                  </button>
                  <button
                    className={`knapp${dom === 'BEHÅLL' ? ' knapp--vald' : ''}`}
                    onClick={() => domSpar(aktivt.id, 'BEHÅLL')}
                  >
                    behåll
                  </button>
                  <button
                    className={`knapp${dom === 'SLÄNG' ? ' knapp--vald' : ''}`}
                    onClick={() => domSpar(aktivt.id, 'SLÄNG')}
                  >
                    släng
                  </button>
                </div>
                {dom && (
                  <p className="spelare__not">din dom påverkar ingenting. den är bara din.</p>
                )}
                {kurator && (
                  <p className="spelare__kurator">
                    vald av <strong>{kurator.namn.toLowerCase()}</strong>, {kurator.plats.toLowerCase()}
                    <span> — »{aktivt.kommentar}«</span>
                  </p>
                )}
              </Tilt>
            </Reveal>

            <Reveal delay={160}>
              <Tilt className="glas varfor" max={5}>
                <p className="varfor__rubrik">varför detta?</p>
                <div className="varfor__rader">
                  <div>
                    <span>du lyssnade på</span>
                    <strong>{(kontrast?.fran?.label ?? 'tystnad / ingenting / ingenstans').toLowerCase()}</strong>
                  </div>
                  <div>
                    <span>detta är</span>
                    <strong>
                      {`${aktivt.genre} / ${dekadLabel(aktivt.ar)} / ${aktivt.ursprung}`.toLowerCase()}
                    </strong>
                  </div>
                </div>
                <p className="varfor__tal">
                  <CountUp till={kontrast?.poang ?? 100} /><em>%</em>
                </p>
                <p className="varfor__delar">
                  {kontrast?.delar
                    ? `genre +${kontrast.delar.genre} · decennium +${kontrast.delar.decennium} · ursprung +${kontrast.delar.ursprung}`
                    : 'första kastet. allt är långt från tystnad.'}
                </p>
              </Tilt>
            </Reveal>
          </div>
        )}
      </section>

      {/* REDAKTIONEN */}
      <section className="sektion" id="nummer">
        <Reveal><p className="sektion__tagg">02 · veckans nummer</p></Reveal>
        <Reveal delay={60}>
          <h2 className="sektion__rubrik">
            nr. {aktuellt.nr} — vecka {aktuellt.vecka}
          </h2>
          <p className="sektion__tema">{aktuellt.tema.toLowerCase()}</p>
          <p className="sektion__ledare">{aktuellt.ledare}</p>
          <p className="sektion__status">genomlyssnat {klartAntal}/{aktuellt.sparIds.length}</p>
        </Reveal>
        <div className="kortrad" role="list">
          {aktuellt.sparIds.map((id, i) => {
            const s = sparMedId(id);
            if (!s) return null;
            const spelas = aktivt?.id === s.id;
            return (
              <Reveal key={s.id} delay={i * 70} className="kortrad__cell">
                <button
                  role="listitem"
                  className={`glas glas--kant kort${spelas ? ' kort--aktiv' : ''}`}
                  onClick={() => spelaDirekt(s)}
                >
                  <span className="kort__nr">{String(i + 1).padStart(2, '0')}</span>
                  <span className="kort__titel">{s.titel.toLowerCase()}</span>
                  <span className="kort__artist">{s.artist.toLowerCase()}</span>
                  <span className="kort__meta">{s.genre.toLowerCase()} · {s.ar}</span>
                  <span className="kort__kommentar">{s.kommentar}</span>
                  <span className="kort__status">
                    {spelas ? (spelar ? '● spelas' : '◦ pausad') : lyssnade.includes(s.id) ? '✓ klar' : 'spela →'}
                  </span>
                </button>
              </Reveal>
            );
          })}
          {lasta.map((n) => (
            <Reveal key={n.nr} delay={aktuellt.sparIds.length * 70} className="kortrad__cell">
              <div className="glas kort kort--last" aria-disabled="true">
                <span className="kort__nr">nr. {n.nr}</span>
                <span className="kort__titel">{n.tema.toLowerCase()}</span>
                <span className="kort__kommentar">
                  låst. lyssna klart på nr. {aktuellt.nr} först ({klartAntal}/{aktuellt.sparIds.length}).
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* KURATORER */}
      <section className="sektion" id="kuratorer">
        <Reveal><p className="sektion__tagg">03 · kuratorer</p></Reveal>
        <Reveal delay={60}>
          <h2 className="sektion__rubrik">perspektiv, inte spellistor</h2>
        </Reveal>
        <div className="kuratorgrid">
          {KURATORER.map((k, i) => {
            const egna = SPAR.filter((s) => s.kuratorId === k.id);
            const genrer = new Set(egna.map((s) => s.genre)).size;
            const arMin = Math.min(...egna.map((s) => s.ar));
            const arMax = Math.max(...egna.map((s) => s.ar));
            return (
              <Reveal key={k.id} delay={i * 90}>
                <Tilt className="glas glas--kant kuratorkort" max={8}>
                  <h3 className="kuratorkort__namn">{k.namn.toLowerCase()}</h3>
                  <p className="kuratorkort__plats">{k.plats.toLowerCase()}</p>
                  <p className="kuratorkort__manifest">»{k.manifest}«</p>
                  <p className="kuratorkort__statistik">
                    {egna.length} spår · {genrer} genrer · {arMin}–{arMax}
                  </p>
                  <button
                    className="knapp"
                    onClick={() => spelaDirekt(egna[Math.floor(Math.random() * egna.length)])}
                  >
                    slumpa ett spår
                  </button>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* BYT SPÅR */}
      <section className="sektion" id="byt">
        <Reveal><p className="sektion__tagg">04 · byt spår</p></Reveal>
        <Reveal delay={60}>
          <h2 className="sektion__rubrik">vad har du fastnat i?</h2>
          <p className="sektion__tema">skriv. vi skickar dig åt andra hållet.</p>
        </Reveal>
        <Reveal delay={120}>
          <form className="bytform" onSubmit={bytRiktning}>
            <label className="bytform__label" htmlFor="fastnat">vad har du fastnat i?</label>
            <div className="bytform__falt">
              <input
                id="fastnat"
                type="text"
                value={bytText}
                onChange={(e) => setBytText(e.target.value)}
                placeholder="t.ex. indie-pop, 2020-tal, sverige"
                autoComplete="off"
              />
              <button className="knapp knapp--primar" type="submit">byt riktning</button>
            </div>
          </form>
        </Reveal>
        {bytResultat && (
          <div className="riktning">
            <Reveal className="riktning__cell">
              <div className="glas riktning__kol">
                <span>du är här</span>
                <strong>{bytResultat.profil.label.toLowerCase()}</strong>
              </div>
            </Reveal>
            <span className="riktning__pil" aria-hidden="true">⟶</span>
            <Reveal delay={120} className="riktning__cell">
              <div className="glas glas--kant riktning__kol riktning__kol--hit">
                <span>vi skickar dig hit</span>
                <strong>
                  {`${bytResultat.spar.genre} / ${dekadLabel(bytResultat.spar.ar)} / ${bytResultat.spar.ursprung}`.toLowerCase()}
                </strong>
                <em className="riktning__kontrast">
                  kontrast <CountUp till={bytResultat.kontrast.poang} />%
                </em>
                <button className="knapp" onClick={() => gaTill('spelare')}>
                  spelar nu — till spelaren ↑
                </button>
              </div>
            </Reveal>
          </div>
        )}
      </section>

      {/* sidfot + marquee */}
      <footer className="fot">
        <div className="fot__band" aria-hidden="true">
          <div className="fot__lopande">
            {[0, 1].map((i) => (
              <span key={i}>{tickerText}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
        <p className="fot__rad">
          brus° — musik utanför algoritmen
        </p>
      </footer>

      {/* flytande dock-spelare */}
      {aktivt && (
        <div className="dock glas glas--kant">
          <button className="dock__titel" onClick={() => gaTill('spelare')}>
            {aktivt.titel.toLowerCase()} — {aktivt.artist.toLowerCase()}
          </button>
          <div className="stapel dock__stapel" aria-hidden="true">
            <i style={{ width: `${andel}%` }} />
          </div>
          <button className="dock__knapp" onClick={() => setSpelar((s) => !s)}>
            {spelar ? '❚❚' : '►'}
          </button>
        </div>
      )}
    </div>
  );
}
