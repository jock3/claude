import React, { useState } from 'react';
import { profilFranText, bytSpar, dekadLabel } from '../data.js';

export default function BytSpar({ spelaMedKontrast, tillSpelaren }) {
  const [text, setText] = useState('');
  const [resultat, setResultat] = useState(null);

  function skicka(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const profil = profilFranText(text);
    const r = bytSpar(profil);
    setResultat({ profil, ...r });
    spelaMedKontrast(r.spar, r.kontrast);
  }

  const spar = resultat?.spar;

  return (
    <section className="vy vy--bytspar">
      <span className="tagg tagg--vanster">[BYT SPÅR]</span>
      <span className="tagg tagg--hoger">MOTSATT RIKTNING, ALLTID</span>

      <form className="bytspar__form" onSubmit={skicka}>
        <label className="bytspar__etikett" htmlFor="fastnat">
          VAD HAR DU FASTNAT I?
        </label>
        <p className="bytspar__under">SKRIV. VI SKICKAR DIG ÅT ANDRA HÅLLET.</p>
        <input
          id="fastnat"
          className="falt"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="T.EX. INDIE-POP, 2020-TAL, SVERIGE"
          autoComplete="off"
        />
        <button className="knapp knapp--bred" type="submit">
          BYT RIKTNING →
        </button>
      </form>

      {resultat && (
        <div className="riktning">
          <div className="riktning__kol">
            <span className="metaetikett">DU ÄR HÄR</span>
            <p className="riktning__varde">{resultat.profil.label}</p>
            {resultat.profil.tom && (
              <p className="riktning__not">VI FATTAR INTE VAD DU MENAR. BRA START.</p>
            )}
          </div>
          <span className="riktning__pil" aria-hidden="true">→</span>
          <div className="riktning__kol riktning__kol--hit">
            <span className="metaetikett">VI SKICKAR DIG HIT</span>
            <p className="riktning__varde">
              {spar.genre} / {dekadLabel(spar.ar)} / {spar.ursprung}
            </p>
            <p className="riktning__kontrast">KONTRAST: {resultat.kontrast.poang}%</p>
          </div>
        </div>
      )}

      {spar && (
        <div className="bytspar__resultat">
          <h2 className="bytspar__titel">{spar.titel}</h2>
          <p className="bytspar__artist">{spar.artist} — {spar.ar}</p>
          <p className="bytspar__kommentar">»{spar.kommentar}«</p>
          <button className="knapp" onClick={tillSpelaren}>
            SPELAR NU — ÖPPNA SPELAREN →
          </button>
        </div>
      )}
    </section>
  );
}
