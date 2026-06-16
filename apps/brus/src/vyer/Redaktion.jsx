import React, { useState } from 'react';
import { NUMMER, sparMedId } from '../data.js';

export default function Redaktion({ lyssnade, aktivtId, spelar, spelaDirekt }) {
  const aktuellt = NUMMER.find((n) => !n.last) ?? NUMMER[0];
  const [valtNr, setValtNr] = useState(aktuellt.nr);

  const genomlyssnat = (n) => n.sparIds.filter((id) => lyssnade.includes(id)).length;
  const aktuelltKlart = genomlyssnat(aktuellt) === aktuellt.sparIds.length;
  const arUpplast = (n) => !n.last || aktuelltKlart;

  const visat = NUMMER.find((n) => n.nr === valtNr && arUpplast(n)) ?? aktuellt;
  const ovriga = NUMMER.filter((n) => n.nr !== visat.nr);
  const sparen = visat.sparIds.map(sparMedId).filter(Boolean);

  return (
    <section className="vy vy--redaktion">
      <span className="tagg tagg--vanster">[REDAKTIONEN]</span>
      <span className="tagg tagg--hoger">[NR. {visat.nr}]</span>

      <header className="redaktion__huvud">
        <h1 className="redaktion__nr">NR. {visat.nr} — VECKA {visat.vecka}</h1>
        <p className="redaktion__tema">{visat.tema}</p>
        <p className="redaktion__ledare">{visat.ledare}</p>
        <p className="redaktion__status">
          GENOMLYSSNAT: {genomlyssnat(visat)}/{visat.sparIds.length}
          {visat.nr === aktuellt.nr && aktuelltKlart && ' — ARKIVET ÄR UPPLÅST.'}
        </p>
      </header>

      <ol className="nummerlista">
        {sparen.map((s, i) => {
          const spelas = s.id === aktivtId;
          const klar = lyssnade.includes(s.id);
          return (
            <li key={s.id}>
              <button
                className={`nummerrad${spelas ? ' nummerrad--aktiv' : ''}`}
                onClick={() => spelaDirekt(s)}
              >
                <span className="nummerrad__nr">{String(i + 1).padStart(2, '0')}</span>
                <span className="nummerrad__titel">
                  {s.titel}
                  <em>{s.artist} — {s.genre}, {s.ar}</em>
                </span>
                <span className="nummerrad__kommentar">{s.kommentar}</span>
                <span className="nummerrad__status">
                  {spelas ? (spelar ? 'SPELAS' : 'PAUSAD') : klar ? 'KLAR' : 'SPELA'}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="arkiv">
        <h2 className="rubriktagg">[TIDIGARE NUMMER]</h2>
        {ovriga.map((n) =>
          arUpplast(n) ? (
            <button
              key={n.nr}
              className="arkivrad"
              onClick={() => setValtNr(n.nr)}
            >
              NR. {n.nr} — VECKA {n.vecka} — {n.tema} →
            </button>
          ) : (
            <p key={n.nr} className="arkivrad arkivrad--last">
              NR. {n.nr} — LÅST. LYSSNA KLART PÅ NR. {aktuellt.nr} FÖRST.
              ({genomlyssnat(aktuellt)}/{aktuellt.sparIds.length})
            </p>
          )
        )}
      </section>
    </section>
  );
}
