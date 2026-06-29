export default function FoodLogModule({ day }) {
  return (
    <div className="t3-m t3-m-meals" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="t3-m-label">Måltider</div>
        <button className="t3-chip t3-chip-outline" style={{ fontSize: 10, padding: '3px 9px', cursor: 'pointer' }}>
          Kopiera igår
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
        {day.meals.map((meal) => {
          const total = meal.items.reduce((s, i) => s + i.kcal, 0);
          return (
            <div key={meal.slot} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '10px 12px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5 }}>{meal.slot}</span>
                {total > 0 && <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.75 }}>{total} kcal</span>}
              </div>
              {meal.items.length === 0 ? (
                <button style={{
                  background: 'transparent', border: '1px dashed rgba(255,255,255,0.16)',
                  borderRadius: 7, padding: '6px 10px', fontSize: 11, color: 'rgba(255,255,255,0.35)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}>
                  + Lägg till
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {meal.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.75 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{item.name}</span>
                      <span style={{ opacity: 0.6, flexShrink: 0 }}>{item.kcal}</span>
                    </div>
                  ))}
                  <button style={{
                    background: 'transparent', border: 'none',
                    fontSize: 11, color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', textAlign: 'left', padding: '2px 0', fontFamily: 'inherit',
                  }}>
                    + Lägg till
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
