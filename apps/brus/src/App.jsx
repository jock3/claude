import React, { useEffect, useRef, useState } from 'react';
import {
  SPAR, sparMedId, kastTarning, kontrastPoang, profilFranSpar, tid,
} from './data.js';
import Tarning from './vyer/Tarning.jsx';
import Spelare from './vyer/Spelare.jsx';
import Redaktion from './vyer/Redaktion.jsx';
import Kurator from './vyer/Kurator.jsx';
import BytSpar from './vyer/BytSpar.jsx';

const FART = 8; // demo: simulerad speltid går 8× fortare än klockan

const lsGet = (nyckel, fallback) => {
  try {
    const v = localStorage.getItem(nyckel);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const lsSet = (nyckel, varde) => {
  try {
    localStorage.setItem(nyckel, JSON.stringify(varde));
  } catch {
    /* localStorage avstängt — domen blir flyktig, precis som allt annat */
  }
};

const REDUCERAD =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Logo({ liten = false, onClick }) {
  return (
    <button
      className={`logo${liten ? ' logo--liten' : ''}`}
      data-text="BRUS"
      onClick={onClick}
      aria-label="BRUS — till tärningen"
    >
      BRUS
    </button>
  );
}

function Ticker({ text, variant }) {
  // Fyra identiska kopior: translateX(-50%) loopar sömlöst även när texten är kort.
  return (
    <div className={`ticker ticker--${variant}`} aria-hidden="true">
      <div className="ticker__band">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>{text}&nbsp;&nbsp;///&nbsp;&nbsp;</span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [vy, setVy] = useState('tarning');
  const [aktivt, setAktivt] = useState(null);
  const [kontrast, setKontrast] = useState(null);
  const [spelar, setSpelar] = useState(false);
  const [pos, setPos] = useState(0);
  const [rullar, setRullar] = useState(false);
  const [blixt, setBlixt] = useState(null);
  const [flimmer, setFlimmer] = useState('');
  const [historik, setHistorik] = useState(() => lsGet('brus_historik', []));
  const [lyssnade, setLyssnade] = useState(() => lsGet('brus_lyssnade', []));
  const [domar, setDomar] = useState(() => lsGet('brus_domar', {}));
  const [kuratorId, setKuratorId] = useState(null);
  const kastTimer = useRef(null);

  // Simulerad uppspelning: en timer driver progress-linjen.
  useEffect(() => {
    if (!spelar || !aktivt) return undefined;
    const iv = setInterval(() => {
      setPos((p) => Math.min(p + 0.2 * FART, aktivt.langdSek));
    }, 200);
    return () => clearInterval(iv);
  }, [spelar, aktivt]);

  // Spåret tar slut: stanna och räkna det som genomlyssnat.
  useEffect(() => {
    if (aktivt && spelar && pos >= aktivt.langdSek) {
      setSpelar(false);
      markeraLyssnad(aktivt.id);
    }
  }, [pos, aktivt, spelar]); // eslint-disable-line react-hooks/exhaustive-deps

  // Slot-flimmer under tärningskastet.
  useEffect(() => {
    if (!rullar || REDUCERAD) return undefined;
    const iv = setInterval(() => {
      setFlimmer(SPAR[Math.floor(Math.random() * SPAR.length)].titel);
    }, 45);
    return () => clearInterval(iv);
  }, [rullar]);

  useEffect(() => () => clearTimeout(kastTimer.current), []);

  function markeraLyssnad(id) {
    setLyssnade((l) => {
      if (l.includes(id)) return l;
      const ny = [...l, id];
      lsSet('brus_lyssnade', ny);
      return ny;
    });
  }

  function starta(spar, kontrastInfo, till) {
    setAktivt(spar);
    setKontrast(kontrastInfo);
    setPos(0);
    setSpelar(true);
    setHistorik((h) => {
      const ny = [spar.id, ...h].slice(0, 24);
      lsSet('brus_historik', ny);
      return ny;
    });
    if (till) setVy(till);
  }

  // Tärningen: 600 ms slot, abrupt stopp, en frame invertering, sen spelaren.
  function kasta() {
    if (rullar || blixt) return;
    const fran = aktivt;
    if (REDUCERAD) {
      const resultat = kastTarning(fran);
      starta(resultat.spar, resultat.kontrast, 'spelare');
      return;
    }
    setRullar(true);
    kastTimer.current = setTimeout(() => {
      const resultat = kastTarning(fran);
      setRullar(false);
      setBlixt(resultat.spar.titel);
      kastTimer.current = setTimeout(() => {
        setBlixt(null);
        starta(resultat.spar, resultat.kontrast, 'spelare');
      }, 110);
    }, 600);
  }

  // Spela ett valt spår (redaktion, kurator). Kontrast räknas mot det som lät senast.
  function spelaDirekt(spar) {
    const fran = aktivt ? profilFranSpar(aktivt) : null;
    const k = fran ? kontrastPoang(fran, spar) : { poang: 100, delar: null };
    starta(spar, { ...k, fran });
  }

  // BYT SPÅR levererar egen kontrast (mot det användaren skrev).
  function spelaMedKontrast(spar, kontrastInfo) {
    starta(spar, kontrastInfo);
  }

  function domSpar(id, dom) {
    setDomar((d) => {
      const ny = { ...d, [id]: { dom, ts: Date.now() } };
      lsSet('brus_domar', ny);
      return ny;
    });
    markeraLyssnad(id);
  }

  function oppnaKurator(id) {
    setKuratorId(id);
    setVy('kurator');
  }

  const tickerText = historik.length
    ? historik
        .map((id) => {
          const s = sparMedId(id);
          return s ? `${s.titel} — ${s.artist}` : null;
        })
        .filter(Boolean)
        .join('  ///  ')
    : 'INGET SPELAT ÄNNU  ///  TÄRNINGEN VÄNTAR';

  const visaMinirad = Boolean(aktivt) && vy !== 'spelare';

  const navKnapp = (id, text, { kravSpar = false } = {}) => (
    <button
      key={id}
      className={`navlank${vy === id ? ' navlank--aktiv' : ''}`}
      aria-current={vy === id ? 'page' : undefined}
      disabled={kravSpar && !aktivt}
      title={kravSpar && !aktivt ? 'KASTA FÖRST.' : undefined}
      onClick={() => setVy(id)}
    >
      {text}
    </button>
  );

  return (
    <div className={`app${visaMinirad ? ' app--minirad' : ''}`}>
      {/* Desktop: toppnav */}
      <header className="topnav">
        <Logo onClick={() => setVy('tarning')} />
        <nav className="topnav__lankar" aria-label="Huvudmeny">
          {navKnapp('tarning', 'TÄRNINGEN')}
          {navKnapp('spelare', 'SPELAREN', { kravSpar: true })}
          {navKnapp('redaktion', 'NUMMER')}
          {navKnapp('kurator', 'KURATORER')}
          {navKnapp('bytspar', 'BYT SPÅR')}
        </nav>
      </header>

      {/* Mobil: huvud + ticker under */}
      <header className="mobilhuvud">
        <Logo liten onClick={() => setVy('tarning')} />
        <span className="mobilhuvud__tagg">[UTANFÖR ALGORITMEN]</span>
      </header>
      <Ticker text={tickerText} variant="topp" />

      <main className="huvud" id="huvud">
        {vy === 'tarning' && (
          <Tarning kasta={kasta} rullar={rullar} flimmer={flimmer} />
        )}
        {vy === 'spelare' && (
          <Spelare
            spar={aktivt}
            kontrast={kontrast}
            spelar={spelar}
            pos={pos}
            rullar={rullar}
            flimmer={flimmer}
            dom={aktivt ? domar[aktivt.id]?.dom : null}
            paToggle={() => setSpelar((s) => !s)}
            paKasta={kasta}
            paDom={domSpar}
            oppnaKurator={oppnaKurator}
            tillTarning={() => setVy('tarning')}
          />
        )}
        {vy === 'redaktion' && (
          <Redaktion
            lyssnade={lyssnade}
            aktivtId={aktivt?.id}
            spelar={spelar}
            spelaDirekt={spelaDirekt}
          />
        )}
        {vy === 'kurator' && (
          <Kurator
            kuratorId={kuratorId}
            valjKurator={setKuratorId}
            spelaDirekt={spelaDirekt}
          />
        )}
        {vy === 'bytspar' && (
          <BytSpar
            spelaMedKontrast={spelaMedKontrast}
            tillSpelaren={() => setVy('spelare')}
          />
        )}
      </main>

      {/* Desktop: ticker + persistent minispelare längst ner */}
      <div className="bottenstack">
        <Ticker text={tickerText} variant="botten" />
        {visaMinirad && (
          <div className="minispelare">
            <span className="minispelare__tagg">[SPELAR]</span>
            <button
              className="minispelare__titel"
              onClick={() => setVy('spelare')}
              title="Öppna spelaren"
            >
              {aktivt.titel} — {aktivt.artist}
            </button>
            <span className="minispelare__tid">
              {tid(pos)} / {tid(aktivt.langdSek)}
            </span>
            <div
              className="progress minispelare__progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={aktivt.langdSek}
              aria-valuenow={Math.floor(pos)}
              aria-label="Uppspelning"
            >
              <i style={{ width: `${(pos / aktivt.langdSek) * 100}%` }} />
            </div>
            <button className="knapp knapp--liten" onClick={() => setSpelar((s) => !s)}>
              {spelar ? 'PAUS' : 'PLAY'}
            </button>
          </div>
        )}
      </div>

      {/* Mobil: minirad ovanför bottennav */}
      {visaMinirad && (
        <div className="minibar">
          <button className="minibar__titel" onClick={() => setVy('spelare')}>
            SPELAR: {aktivt.titel} →
          </button>
          <button className="minibar__knapp" onClick={() => setSpelar((s) => !s)}>
            {spelar ? 'PAUS' : 'PLAY'}
          </button>
        </div>
      )}

      {/* Mobil: bottennav */}
      <nav className="bottennav" aria-label="Huvudmeny">
        <button
          className={`bottennav__lank${vy === 'tarning' || vy === 'spelare' ? ' bottennav__lank--aktiv' : ''}`}
          aria-current={vy === 'tarning' ? 'page' : undefined}
          onClick={() => setVy('tarning')}
        >
          TÄRNING
        </button>
        <button
          className={`bottennav__lank${vy === 'redaktion' ? ' bottennav__lank--aktiv' : ''}`}
          aria-current={vy === 'redaktion' ? 'page' : undefined}
          onClick={() => setVy('redaktion')}
        >
          NUMMER
        </button>
        <button
          className={`bottennav__lank${vy === 'bytspar' ? ' bottennav__lank--aktiv' : ''}`}
          aria-current={vy === 'bytspar' ? 'page' : undefined}
          onClick={() => setVy('bytspar')}
        >
          BYT
        </button>
      </nav>

      {/* En frame färginversion vid tärningsstopp */}
      {blixt && (
        <div className="blixt" aria-hidden="true">
          <span className="blixt__titel">{blixt}</span>
        </div>
      )}
    </div>
  );
}
