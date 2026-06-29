import { useState } from 'react';

function GlassIcon({ filled }) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <path
        d="M2 1h10l-1.5 14.5a1 1 0 01-1 .5H4.5a1 1 0 01-1-.5L2 1z"
        fill={filled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)'}
        stroke={filled ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.20)'}
        strokeWidth="1"
      />
    </svg>
  );
}

export default function WaterModule({ day, goal = 8 }) {
  const [count, setCount] = useState(day.water);

  function toggle(i) {
    setCount(i < count ? i : i + 1);
  }

  return (
    <div className="t3-m t3-m-water" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="t3-m-label">Vatten</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{count}</span>
        <span style={{ fontSize: 12, opacity: 0.45 }}>/ {goal} glas</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {Array.from({ length: goal }, (_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`t3-water-cup${i < count ? ' filled' : ''}`}
            title={`${i + 1} glas`}
          >
            <GlassIcon filled={i < count} />
          </button>
        ))}
      </div>

      <div style={{ fontSize: 10, opacity: 0.35, fontWeight: 600 }}>
        {count >= goal ? '🎯 Mål uppnått!' : `${goal - count} kvar`}
      </div>
    </div>
  );
}
