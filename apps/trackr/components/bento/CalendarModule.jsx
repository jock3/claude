const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon
}

export default function CalendarModule({ trend30 }) {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const days  = getDaysInMonth(year, month);
  const start = getFirstDayOfWeek(year, month);
  const today = now.getDate();

  const dataByDay = Object.fromEntries(
    trend30.map(d => [parseInt(d.date.slice(8, 10)), d])
  );

  const cells = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const monthName = now.toLocaleString('sv-SE', { month: 'long' });

  return (
    <div className="t3-m t3-m-calendar" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div className="t3-m-label" style={{ marginBottom: 0 }}>Kalender</div>
        <span style={{ fontSize: 11, opacity: 0.45, textTransform: 'capitalize' }}>{monthName} {year}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 4px' }}>
        {WEEKDAYS.map((wd, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.35, textAlign: 'center', paddingBottom: 4 }}>
            {wd}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const data = dataByDay[day];
          const isToday = day === today;
          return (
            <div key={day} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '5px 2px', borderRadius: 8, cursor: 'pointer',
              background: isToday ? 'rgba(255,255,255,0.10)' : 'transparent',
              transition: 'background 0.15s',
            }}>
              <span style={{
                fontSize: 12, fontWeight: isToday ? 900 : 400,
                opacity: isToday ? 1 : 0.60, lineHeight: 1,
              }}>
                {day}
              </span>
              <div style={{ display: 'flex', gap: 2 }}>
                {data?.kcalHit && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
                )}
                {data?.hasWorkout && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.40)' }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, opacity: 0.45 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
          Kaloriemål uppnått
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, opacity: 0.45 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.40)' }} />
          Träningspass
        </div>
      </div>
    </div>
  );
}
