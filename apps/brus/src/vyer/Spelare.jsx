import React from 'react';
import { kuratorMedId, dekadLabel, tid } from '../data.js';

export default function Spelare({
  spar, kontrast, spelar, pos, rullar, flimmer, dom,
  paToggle, paKasta, paDom, oppnaKurator, tillTarning,
}) {
  if (!spar) {
    return (
      <section className="vy vy--spelare vy--tom">
        <span className="tagg tagg--vanster">[SPELAREN]</span>
        <p className="tomtext">INGET HÄR ÄNNU.</p>
        <p className="tomtext__under">SPELAREN FÅR SITT INNEHÅLL AV TÄRNINGEN. INTE AV DIG.</p>
        <button className="knapp" onClick={tillTarning}>KASTA TÄRNINGEN →</button>
      </section>
    );
  }

  const kurator = kuratorMedId(spar.kuratorId);
  const klar = pos >= spar.langdSek;
  const detta = `${spar.genre} / ${dekadLabel(spar.ar)} / ${spar.ursprung}`;
  const andel = Math.min(pos / spar.langdSek, 1) * 100;

  return (
    <section className="vy vy--spelare">
      <span className="tagg tagg--vanster">[SPELAREN]</span>
      <span className="tagg tagg--hoger">[DEMO — TIDEN GÅR 8×]</span>

      <div className="spelare">
        <div className="spelare__huvud">
          <h1 className="spelare__titel">{rullar ? flimmer || spar.titel : spar.titel}</h1>
          <p className="spelare__artist">{spar.artist}</p>

          <table className="metadata">
            <tbody>
              <tr><th scope="row">GENRE</th><td>{spar.genre}</td></tr>
              <tr><th scope="row">ÅR</th><td>{spar.ar}</td></tr>
              <tr><th scope="row">URSPRUNG</th><td>{spar.ursprung}</td></tr>
              <tr><th scope="row">LÄNGD</th><td>{tid(spar.langdSek)}</td></tr>
            </tbody>
          </table>

          <div className="spelare__progressrad">
            <div
              className="progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={spar.langdSek}
              aria-valuenow={Math.floor(pos)}
              aria-label="Uppspelning"
            >
              <i style={{ width: `${andel}%` }} />
            </div>
            <span className="spelare__tid">{tid(pos)} / {tid(spar.langdSek)}</span>
          </div>

          <div className="spelare__kontroller">
            <button className="knapp" onClick={paToggle}>
              {spelar ? 'PAUS' : 'PLAY'}
            </button>
            <button className="knapp" onClick={paKasta} disabled={rullar}>
              NÄSTA TÄRNING
            </button>
            <button
              className={`knapp${dom === 'BEHÅLL' ? ' knapp--vald' : ''}`}
              onClick={() => paDom(spar.id, 'BEHÅLL')}
            >
              BEHÅLL
            </button>
            <button
              className={`knapp${dom === 'SLÄNG' ? ' knapp--vald' : ''}`}
              onClick={() => paDom(spar.id, 'SLÄNG')}
            >
              SLÄNG
            </button>
          </div>

          {dom && (
            <p className="spelare__domnot">
              DIN DOM PÅVERKAR INGENTING. DEN ÄR BARA DIN.
            </p>
          )}
          {klar && !dom && (
            <p className="spelare__domnot">SLUT. DÖM. ELLER KASTA IGEN.</p>
          )}
        </div>

        <aside className="spelare__varfor">
          <h2 className="rubriktagg">[VARFÖR DETTA?]</h2>
          <dl className="varfor">
            <div className="varfor__rad">
              <dt>DU LYSSNADE PÅ:</dt>
              <dd>{kontrast?.fran?.label ?? 'TYSTNAD / INGENTING / INGENSTANS'}</dd>
            </div>
            <div className="varfor__rad">
              <dt>DETTA ÄR:</dt>
              <dd>{detta}</dd>
            </div>
            <div className="varfor__rad">
              <dt>KONTRAST:</dt>
              <dd className="varfor__tal">{kontrast?.poang ?? 100}%</dd>
            </div>
          </dl>
          {kontrast?.delar ? (
            <p className="varfor__delar">
              GENRE +{kontrast.delar.genre} / DECENNIUM +{kontrast.delar.decennium} / URSPRUNG +{kontrast.delar.ursprung}
            </p>
          ) : (
            <p className="varfor__delar">FÖRSTA KASTET. ALLT ÄR LÅNGT FRÅN TYSTNAD.</p>
          )}

          <div className="spelare__kurator">
            <span className="metaetikett">VALD AV</span>
            <button className="lank" onClick={() => oppnaKurator(spar.kuratorId)}>
              — {kurator.namn}, {kurator.plats} →
            </button>
            <p className="spelare__kommentar">»{spar.kommentar}«</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
