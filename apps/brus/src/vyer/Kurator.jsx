import React from 'react';
import { KURATORER, SPAR, sparMedId } from '../data.js';

export default function Kurator({ kuratorId, valjKurator, spelaDirekt }) {
  const kurator = KURATORER.find((k) => k.id === kuratorId);

  if (!kurator) {
    return (
      <section className="vy vy--kurator">
        <span className="tagg tagg--vanster">[KURATORER]</span>
        <span className="tagg tagg--hoger">PERSPEKTIV, INTE SPELLISTOR</span>
        <h1 className="vy__rubrik">KURATORER</h1>
        <div className="kuratorlista">
          {KURATORER.map((k) => {
            const antal = SPAR.filter((s) => s.kuratorId === k.id).length;
            return (
              <button key={k.id} className="kuratorrad" onClick={() => valjKurator(k.id)}>
                <span className="kuratorrad__namn">{k.namn}</span>
                <span className="kuratorrad__meta">
                  {k.plats} / {antal} SPÅR / »{k.manifest}«
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  const egna = SPAR.filter((s) => s.kuratorId === kurator.id);
  const genrer = new Set(egna.map((s) => s.genre)).size;
  const arMin = Math.min(...egna.map((s) => s.ar));
  const arMax = Math.max(...egna.map((s) => s.ar));

  const slumpaUr = (sparIds) => {
    const spar = sparMedId(sparIds[Math.floor(Math.random() * sparIds.length)]);
    if (spar) spelaDirekt(spar);
  };

  return (
    <section className="vy vy--kurator">
      <span className="tagg tagg--vanster">[KURATOR]</span>
      <span className="tagg tagg--hoger">[{kurator.plats}]</span>

      <button className="lank lank--tillbaka" onClick={() => valjKurator(null)}>
        ← ALLA KURATORER
      </button>

      <header className="kurator__huvud">
        <h1 className="kurator__namn">{kurator.namn}</h1>
        <p className="kurator__plats">{kurator.plats}</p>
        <p className="kurator__manifest">»{kurator.manifest}«</p>
        <p className="kurator__statistik">
          DELAT: {egna.length} SPÅR / GENRER: {genrer} / ÅR: {arMin}–{arMax}
        </p>
      </header>

      <div className="kurator__stacks">
        <h2 className="rubriktagg">[STACKS]</h2>
        {kurator.stacks.map((stack) => (
          <button
            key={stack.namn}
            className="stackrad"
            onClick={() => slumpaUr(stack.sparIds)}
            title="Du får inte välja låt. Klart."
          >
            <span className="stackrad__namn">{stack.namn}</span>
            <span className="stackrad__meta">
              {stack.sparIds.length} SPÅR — SLUMPA ETT →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
