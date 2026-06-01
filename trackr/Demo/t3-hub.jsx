// Track3r — tracking hub · History panel (trend cards + interactive calendar)

// Sparkline from a numeric series (nulls allowed → gaps skipped)
function Spark({ data, color, width = 100, height = 26, bars = false }) {
  const vals = data.map((d) => (typeof d === 'object' ? d.v : d));
  const present = vals.filter((v) => v != null);
  if (present.length < 2) return <div style={{ height }} />;
  const min = Math.min(...present), max = Math.max(...present);
  const span = max - min || 1;
  const n = vals.length;
  const x = (i) => (n === 1 ? 0 : (i / (n - 1)) * width);
  const y = (v) => height - 2 - ((v - min) / span) * (height - 4);

  if (bars) {
    const bw = (width / n) * 0.62;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" height={height} style={{ width: '100%', display: 'block' }}>
        {vals.map((v, i) => {
          const h = v > 0 ? Math.max(1.5, ((v - 0) / (max || 1)) * (height - 3)) : 1;
          return <rect key={i} x={x(i) - bw / 2} y={height - h} width={bw} height={h} rx={1} fill={v > 0 ? color : C.track} />;
        })}
      </svg>
    );
  }
  let dpath = '';
  vals.forEach((v, i) => { if (v == null) return; dpath += `${dpath ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`; });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" height={height} style={{ width: '100%', display: 'block' }}>
      <path d={dpath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function TrendCard({ label, value, unit, delta, deltaColor, children }) {
  return (
    <div style={{ border: `0.5px solid ${C.line}`, borderRadius: 8, padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 7, background: C.surface }}>
      <Eyebrow color={C.ink3} style={{ fontSize: 9.5 }}>{label}</Eyebrow>
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1, color: C.ink }}>
        {value}{unit && <span style={{ fontSize: 11, color: C.ink3, fontWeight: 500, marginLeft: 3 }}>{unit}</span>}
        {delta && <span style={{ fontSize: 11, color: deltaColor || C.ink3, fontWeight: 700, marginLeft: 6 }}>{delta}</span>}
      </span>
      {children}
    </div>
  );
}

function HistoryPanel({ days, goals, selectedKey, onSelectDay, units, weekStart }) {
  const end = todayKey();
  const kcalS = series(days, goals, end, 30, 'kcal');
  const stepS = series(days, goals, end, 30, 'steps');
  const wS = series(days, goals, end, 30, 'weight');
  const trS = series(days, goals, end, 30, 'workouts');

  const kcalAvg = avgOf(kcalS);
  const stepAvg = avgOf(stepS);
  const wPresent = wS.filter((d) => d.v != null);
  const wLast = wPresent.length ? wPresent[wPresent.length - 1].v : null;
  const wFirst = wPresent.length ? wPresent[0].v : null;
  const wDelta = wLast != null && wFirst != null ? wLast - wFirst : null;
  const trCount = trS.reduce((a, d) => a + d.v, 0);

  // calendar month derived from selectedKey
  const [viewK, setViewK] = React.useState(selectedKey);
  React.useEffect(() => { setViewK(selectedKey); }, [selectedKey]);
  const view = parseKey(viewK);
  const year = view.getFullYear(), month = view.getMonth();
  const stepMonth = (n) => { const d = new Date(year, month + n, 1); setViewK(keyOf(d)); };

  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const sundayStart = weekStart === 'sun';
  const lead = sundayStart ? first.getDay() : (first.getDay() + 6) % 7;
  const dows = sundayStart ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <React.Fragment>
      {/* Trend cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <TrendCard label="Calories · 30d" value={grp(kcalAvg)} unit="avg">
          <Spark data={kcalS} color={C.ink2} />
        </TrendCard>
        <TrendCard label="Steps · 30d" value={grp(stepAvg)} unit="avg">
          <Spark data={stepS} color={C.tealLight} />
        </TrendCard>
        <TrendCard label="Weight · 30d" value={wLast != null ? wDisp(wLast, units) : '–'} unit={units}
          delta={wDelta != null ? `${wDelta <= 0 ? '−' : '+'}${Math.abs(wDisp(Math.abs(wDelta), units)).toFixed(1)}` : null}
          deltaColor={wDelta != null && wDelta <= 0 ? C.teal : C.amber}>
          <Spark data={wS} color={C.teal} />
        </TrendCard>
        <TrendCard label="Training · 30d" value={trCount} unit="sessions">
          <Spark data={trS} color={C.tealDeep} bars />
        </TrendCard>
      </div>

      <div style={{ height: '0.5px', background: C.line, margin: '18px 0 14px' }} />

      {/* Calendar header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: '-0.01em', color: C.ink, fontFamily: 'REM, sans-serif' }}>{MO_LONG[month]} {year}</h3>
          <div style={{ display: 'inline-flex', gap: 2 }}>
            <IconButton icon="chevron-left" label="Previous month" onClick={() => stepMonth(-1)} size={30} />
            <IconButton icon="chevron-right" label="Next month" onClick={() => stepMonth(1)} size={30} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: C.ink3, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: C.teal }} />kcal in goal</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: C.tealLight }} />steps ≥ goal</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: C.amber }} />session</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.ink4 }}>
          {dows.map((d) => <span key={d} style={{ textAlign: 'center' }}>{d}</span>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', gap: 6, flex: 1, minHeight: 0 }}>
          {cells.map((d, i) => {
            if (d == null) return <div key={i} />;
            const k = `${year}-${pad2(month + 1)}-${pad2(d)}`;
            const day = days[k];
            const isToday = k === end;
            const isSel = k === selectedKey;
            const kGoal = kcalInGoal(day, goals);
            const sGoal = stepsHit(day, goals);
            const session = day && day.workouts.length > 0;
            const sessTag = session ? day.workouts[0] : null;
            const future = parseKey(k) > parseKey(end);
            return (
              <button key={i} onClick={() => !future && onSelectDay(k)} disabled={future} style={{
                border: `1px solid ${isSel ? C.teal : C.line}`,
                background: isSel ? C.tealMist : C.surface,
                borderRadius: 7, padding: '6px 7px', cursor: future ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0, overflow: 'hidden',
                opacity: future ? 0.4 : 1, textAlign: 'left', fontFamily: 'REM, sans-serif',
                transition: 'border-color 120ms, background 120ms',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: isToday || isSel ? 700 : 600,
                    color: isToday ? C.teal : C.ink, lineHeight: 1,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: isToday ? 17 : 'auto', height: isToday ? 17 : 'auto',
                    borderRadius: 999, border: isToday ? `1.25px solid ${C.teal}` : 'none',
                  }}>{d}</span>
                  <span style={{ display: 'inline-flex', gap: 3 }}>
                    {kGoal && <span style={{ width: 5, height: 5, borderRadius: 999, background: C.teal }} />}
                    {sGoal && <span style={{ width: 5, height: 5, borderRadius: 999, background: C.tealLight }} />}
                    {session && <span style={{ width: 5, height: 5, borderRadius: 999, background: C.amber }} />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { HistoryPanel, Spark });
