import RingProgress from '../ui/RingProgress.jsx';

function MacroBar({ label, value, max, unit = 'g' }) {
  const pct = Math.min(value / max, 1) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.55, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <span>{label}</span>
        <span>{value}/{max}{unit}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: 'rgba(255,255,255,0.80)', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

export default function CalorieRingModule({ day, goals }) {
  const eaten   = day.meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.kcal,    0), 0);
  const protein = day.meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.protein, 0), 0);
  const carbs   = day.meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.carbs,   0), 0);
  const fat     = day.meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.fat,     0), 0);
  const left    = goals.kcal - eaten;
  const over    = left < 0;

  return (
    <div className="t3-m t3-m-summary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
      <div className="t3-m-label">Kalorier</div>

      <RingProgress value={eaten} max={goals.kcal} size={140} stroke={11}>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {Math.abs(left)}
        </div>
        <div style={{ fontSize: 10, opacity: 0.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
          {over ? 'över' : 'kvar'}
        </div>
      </RingProgress>

      <div style={{ width: '100%', fontSize: 11, opacity: 0.45, textAlign: 'center' }}>
        {eaten} / {goals.kcal} kcal
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MacroBar label="Protein"   value={protein} max={goals.protein} />
        <MacroBar label="Kolhydr."  value={carbs}   max={goals.carbs} />
        <MacroBar label="Fett"      value={fat}     max={goals.fat} />
      </div>
    </div>
  );
}
