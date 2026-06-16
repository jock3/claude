import React from 'react';
import { SPAR, KURATORER } from '../data.js';

export default function Tarning({ kasta, rullar, flimmer }) {
  return (
    <section className="vy vy--tarning">
      <span className="tagg tagg--vanster">[TÄRNINGEN]</span>
      <span className="tagg tagg--hoger">
        {SPAR.length} SPÅR / {KURATORER.length} KURATORER / 0 ALGORITMER ATT BEHAGA
      </span>
      <button className="tryck" onClick={kasta} disabled={rullar}>
        {rullar ? (
          <>
            <span className="tryck__flimmer">{flimmer || '· · ·'}</span>
            <span className="tryck__under">LETAR I FEL LÅDOR...</span>
          </>
        ) : (
          <>
            <span className="tryck__ord">TRYCK</span>
            <span className="tryck__under">du får inte veta vad som kommer</span>
          </>
        )}
      </button>
    </section>
  );
}
