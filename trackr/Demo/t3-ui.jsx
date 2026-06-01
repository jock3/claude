// Track3r — tracking hub · Training panel + workout editor

const WORKOUT_KINDS = ['Strength', 'Cardio', 'Mobility', 'Sport'];
const TAG_POOL = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Run', 'Bike', 'Swim', 'HIIT'];

function WorkoutModal({ initial, onSave, onClose, onDelete }) {
  const editing = !!(initial && initial.id);
  const [f, setF] = React.useState(() => ({
    kind: (initial && initial.kind) || 'Strength',
    name: (initial && initial.name) || '',
    durationMin: initial && initial.durationMin != null ? String(initial.durationMin) : '',
    kcal: initial && initial.kcal != null ? String(initial.kcal) : '',
    tags: (initial && initial.tags) ? initial.tags.slice() : [],
  }));
  const [tried, setTried] = React.useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const toggleTag = (t) => setF((s) => ({ ...s, tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t] }));
  const nameBad = !f.name.trim();
  const durBad = !(parseFloat(f.durationMin) > 0);

  const submit = () => {
    setTried(true);
    if (nameBad || durBad) return;
    onSave({
      id: editing ? initial.id : uid('w'),
      kind: f.kind,
      name: f.name.trim(),
      durationMin: Math.round(parseFloat(f.durationMin)),
      kcal: Math.round(parseFloat(f.kcal) || 0),
      tags: f.tags,
    });
  };

  return (
    <Modal eyebrow={editing ? 'Edit session' : 'Log session'} title={editing ? 'Edit workout' : 'Log a workout'} onClose={onClose}
      footer={
        <React.Fragment>
          {editing && <Button variant="danger" icon="trash-2" onClick={() => onDelete(initial.id)} style={{ marginRight: 'auto' }}>Delete</Button>}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="check" onClick={submit}>{editing ? 'Save' : 'Log workout'}</Button>
        </React.Fragment>
      }>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingBottom: 8 }}>
        <Field label="Type">
          <select className="t3-input" value={f.kind} onChange={(e) => set('kind', e.target.value)}>
            {WORKOUT_KINDS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Duration" hint="minutes — required">
          <TextInput type="number" inputMode="numeric" min="0" value={f.durationMin} placeholder="0" invalid={tried && durBad}
            onChange={(e) => set('durationMin', e.target.value)} />
        </Field>
        <Field label="Session name" span={2}>
          <TextInput value={f.name} placeholder="e.g. Push day · chest + shoulders" invalid={tried && nameBad}
            onChange={(e) => set('name', e.target.value)} autoFocus />
        </Field>
        <Field label="Calories burned" hint="optional" span={2}>
          <TextInput type="number" inputMode="numeric" min="0" value={f.kcal} placeholder="0" onChange={(e) => set('kcal', e.target.value)} />
        </Field>
        <Field label="Tags" span={2}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TAG_POOL.map((t) => {
              const on = f.tags.includes(t);
              return (
                <button key={t} type="button" onClick={() => toggleTag(t)} style={{
                  border: `1px solid ${on ? C.teal : C.line}`, cursor: 'pointer',
                  background: on ? C.tealMist : 'transparent', color: on ? C.tealDeep : C.ink2,
                  borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, fontFamily: 'REM, sans-serif',
                  transition: 'all 120ms cubic-bezier(0.2,0.7,0.2,1)',
                }}>{t}</button>
              );
            })}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

function kindIcon(kind) {
  return { Strength: 'dumbbell', Cardio: 'activity', Mobility: 'move', Sport: 'trophy' }[kind] || 'dumbbell';
}

function WorkoutRow({ w, onClick }) {
  return (
    <button onClick={onClick} className="t3-row" style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '13px 8px', width: '100%', textAlign: 'left',
      background: 'transparent', border: 'none', borderTop: `0.5px solid ${C.line2}`, cursor: 'pointer', fontFamily: 'REM, sans-serif',
    }}>
      <span style={{ width: 38, height: 38, borderRadius: '50%', background: C.tealMist, color: C.tealDeep, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icon name={kindIcon(w.kind)} size={19} stroke={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</span>
        <span style={{ display: 'block', fontSize: 12, color: C.ink3, marginTop: 1 }}>{w.kind} · {w.durationMin} min{w.kcal ? ` · ${grp(w.kcal)} kcal` : ''}</span>
      </span>
      <Icon name="pencil" size={14} color={C.ink4} stroke={2} style={{ opacity: 0.55 }} />
    </button>
  );
}

function TrainStat({ value, unit, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: C.ink }}>
        {value}{unit && <span style={{ fontSize: 13, color: C.ink3, fontWeight: 700, marginLeft: 3 }}>{unit}</span>}
      </span>
      <Eyebrow color={C.ink3}>{label}</Eyebrow>
    </div>
  );
}

function TrainingPanel({ day, days, selectedKey, onAddWorkout, onEditWorkout }) {
  const workouts = day.workouts;
  const totalMin = workouts.reduce((a, w) => a + (w.durationMin || 0), 0);
  const totalKcal = workouts.reduce((a, w) => a + (w.kcal || 0), 0);

  // this week's session minutes (Mon→Sun containing selectedKey)
  const sel = parseKey(selectedKey);
  const dow = (sel.getDay() + 6) % 7; // Mon=0
  const monKey = addDays(selectedKey, -dow);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const k = addDays(monKey, i);
    const dd = days[k];
    const mins = dd ? dd.workouts.reduce((a, w) => a + (w.durationMin || 0), 0) : 0;
    week.push({ k, mins, today: k === selectedKey });
  }
  const weekSessions = week.reduce((a, w) => a + (days[w.k] ? days[w.k].workouts.length : 0), 0);
  const maxMin = Math.max(...week.map((w) => w.mins), 60);

  return (
    <React.Fragment>
      {/* Day summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, padding: '8px 0 14px' }}>
        <TrainStat value={workouts.length} label="sessions" />
        <TrainStat value={grp(totalMin)} unit="min" label="active time" />
        <TrainStat value={grp(totalKcal)} unit="kcal" label="burned" />
      </div>

      {/* Weekly minutes bars */}
      <div style={{ background: C.bgSoft, border: `0.5px solid ${C.line}`, borderRadius: 10, padding: '14px 16px', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <Eyebrow color={C.ink3}>This week</Eyebrow>
          <span style={{ fontSize: 12, color: C.ink2, fontWeight: 700 }}>{weekSessions} sessions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 56 }}>
          {week.map((w, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${Math.max(4, (w.mins / maxMin) * 100)}%`, minHeight: 4,
                background: w.today ? C.amber : (w.mins > 0 ? C.tealLight : C.track), borderRadius: 4,
                transition: 'height 320ms cubic-bezier(0.2,0.7,0.2,1)',
              }} />
              <span style={{ fontSize: 10, fontWeight: w.today ? 700 : 400, color: w.today ? C.ink : C.ink4 }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '0.5px', background: C.line, margin: '8px 0 2px' }} />

      {/* Sessions */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'auto' }} className="t3-scroll">
        {workouts.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 0', color: C.ink3, minHeight: 140 }}>
            <Icon name="dumbbell" size={26} color={C.ink4} stroke={1.75} />
            <span style={{ fontSize: 13 }}>No sessions logged for this day.</span>
          </div>
        ) : workouts.map((w) => <WorkoutRow key={w.id} w={w} onClick={() => onEditWorkout(w)} />)}
      </div>

      <div style={{ paddingTop: 14 }}>
        <Button variant="dark" icon="plus" onClick={onAddWorkout}>Log workout</Button>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { WorkoutModal, TrainingPanel, WORKOUT_KINDS });
