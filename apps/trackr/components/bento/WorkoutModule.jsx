const DAY_LABELS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

export default function WorkoutModule({ day, weekWorkouts = [] }) {
  const session = day.workouts[0] ?? null;

  return (
    <div className="t3-m t3-m-train" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="t3-m-label">Träning</div>

      {session ? (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 10, padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{session.name}</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>
            {session.durationMin} min · {session.exercises} övn · {session.sets} set
          </div>
        </div>
      ) : (
        <button style={{
          background: 'transparent',
          border: '1px dashed rgba(255,255,255,0.16)',
          borderRadius: 10, padding: '12px',
          fontSize: 12, color: 'rgba(255,255,255,0.35)',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
        }}>
          + Starta pass
        </button>
      )}

      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: 6 }}>Den här veckan</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          {DAY_LABELS.map((label, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{
                width: '100%', height: weekWorkouts[i] ? 20 : 8,
                borderRadius: 3,
                background: weekWorkouts[i] ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.10)',
                transition: 'height 0.3s ease',
              }} />
              <span style={{ fontSize: 9, opacity: 0.35 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
