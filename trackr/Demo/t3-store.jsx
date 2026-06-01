// Track3r — tracking hub · header, Today summary, root App + state store

// ── store hook ──────────────────────────────────────────────────────────────
function useStore() {
  const [state, setState] = React.useState(loadState);
  React.useEffect(() => { saveState(state); }, [state]);

  const mutateDay = (key, fn) => setState((s) => {
    const day = s.days[key] || emptyDay();
    return { ...s, days: { ...s.days, [key]: fn({ ...day, meals: day.meals.slice(), workouts: day.workouts.slice() }) } };
  });

  return {
    state, setState,
    setGoal: (k, v) => setState((s) => ({ ...s, goals: { ...s.goals, [k]: v } })),
    addMeal: (key, meal) => mutateDay(key, (d) => ({ ...d, meals: [...d.meals, meal] })),
    updateMeal: (key, meal) => mutateDay(key, (d) => ({ ...d, meals: d.meals.map((m) => (m.id === meal.id ? meal : m)) })),
    deleteMeal: (key, id) => mutateDay(key, (d) => ({ ...d, meals: d.meals.filter((m) => m.id !== id) })),
    addWorkout: (key, w) => mutateDay(key, (d) => ({ ...d, workouts: [...d.workouts, w] })),
    updateWorkout: (key, w) => mutateDay(key, (d) => ({ ...d, workouts: d.workouts.map((x) => (x.id === w.id ? w : x)) })),
    deleteWorkout: (key, id) => mutateDay(key, (d) => ({ ...d, workouts: d.workouts.filter((x) => x.id !== id) })),
    setSteps: (key, v) => mutateDay(key, (d) => ({ ...d, steps: v })),
    setWeight: (key, v) => mutateDay(key, (d) => ({ ...d, weight: v })),
    reset: () => setState(resetState()),
  };
}

// ── header ──────────────────────────────────────────────────────────────────
function Header({ selectedKey, onStep, onToday, theme, onToggleTheme }) {
  const rel = fmtRelative(selectedKey);
  const d = parseKey(selectedKey);
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
  const dateStr = `${d.getDate()} ${MO_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  const isToday = selectedKey === todayKey();

  return (
    <header className="t3-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <BrandMark size={32} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span style={{ fontWeight: 900, fontSize: 19, letterSpacing: '-0.02em', color: C.ink }}>Track<span style={{ color: C.teal }}>3</span>r</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.ink3 }}>Tracking hub</span>
        </div>
      </div>

      <div className="t3-header-right">
        <div className="t3-datesel">
          <IconButton icon="chevron-left" label="Previous day" onClick={() => onStep(-1)} size={32} />
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 168, lineHeight: 1.15 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{rel || weekday}</span>
            <span style={{ fontSize: 11, color: C.ink3 }}>{dateStr}</span>
          </span>
          <IconButton icon="chevron-right" label="Next day" onClick={() => onStep(1)} size={32}
            style={{ opacity: isToday ? 0.4 : 1, pointerEvents: isToday ? 'none' : 'auto' }} />
        </div>
        {!isToday && <Button variant="secondary" size="sm" onClick={onToday}>Today</Button>}
        <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label="Toggle theme" onClick={onToggleTheme} size={38} />
        <span className="t3-avatar">JA</span>
      </div>
    </header>
  );
}

// ── Today summary ───────────────────────────────────────────────────────────
function Stat({ children }) { return <div className="t3-stat">{children}</div>; }

function Summary({ day, goals, selectedKey, days, units, store }) {
  const totals = dayTotals(day);
  const left = goals.kcal - totals.kcal;
  const over = left < 0;
  const stepsPct = day.steps != null ? Math.round((day.steps / goals.steps) * 100) : null;
  const streak = calcStreak(days, goals);

  // weight delta vs 7 days earlier
  const prevW = (days[addDays(selectedKey, -7)] || {}).weight;
  const wd = day.weight != null && prevW != null ? day.weight - prevW : null;

  const onTrack = totals.kcal > 0 && !over;

  return (
    <section className="t3-summary">
      <span className="t3-summary-eyebrow">{fmtRelative(selectedKey) || WD_SHORT[parseKey(selectedKey).getDay()]}</span>
      <span className="t3-vsplit" />

      <Stat>
        <span className="t3-stat-lbl">Cal</span>
        <span className="t3-stat-num">{grp(totals.kcal)}</span>
        <span className="t3-stat-unit">/ <EditNum value={goals.kcal} onCommit={(v) => store.setGoal('kcal', v)} style={editGoalStyle} /> kcal</span>
        <span className="t3-stat-delta" style={{ color: over ? C.amber : C.ink3 }}>{over ? `${grp(-left)} over` : `${grp(left)} left`}</span>
      </Stat>
      <span className="t3-vsplit" />

      <Stat>
        <span className="t3-stat-lbl">Steps</span>
        <span className="t3-stat-num"><EditNum value={day.steps} onCommit={(v) => store.setSteps(selectedKey, v)} style={editLiveStyle} /></span>
        <span className="t3-stat-unit">/ <EditNum value={goals.steps} onCommit={(v) => store.setGoal('steps', v)} style={editGoalStyle} /></span>
        {stepsPct != null && <span className="t3-stat-delta" style={{ color: stepsPct >= 100 ? C.teal : C.ink3 }}>{stepsPct}%</span>}
      </Stat>
      <span className="t3-vsplit" />

      <Stat>
        <span className="t3-stat-lbl">Wt</span>
        <span className="t3-stat-num"><EditNum value={wDisp(day.weight, units)} onCommit={(v) => store.setWeight(selectedKey, wToKg(v, units))} format={(x) => (x == null ? '–' : x.toFixed(1))} mode="decimal" style={editLiveStyle} /></span>
        <span className="t3-stat-unit">/ <EditNum value={wDisp(goals.weight, units)} onCommit={(v) => store.setGoal('weight', wToKg(v, units))} format={(x) => (x == null ? '–' : x.toFixed(1))} mode="decimal" style={editGoalStyle} /> {units}</span>
        {wd != null && <span className="t3-stat-delta" style={{ color: wd <= 0 ? C.teal : C.amber }}>{wd <= 0 ? '−' : '+'}{Math.abs(wDisp(Math.abs(wd), units)).toFixed(1)} / 7d</span>}
      </Stat>

      <span className="t3-summary-spacer" />
      {streak > 0 && <Chip variant="amber" icon="flame">{streak}-day streak</Chip>}
      <Chip variant={onTrack ? 'teal' : 'outline'} icon={onTrack ? 'check' : 'minus'}>{over ? 'Over goal' : onTrack ? 'On track' : 'No log yet'}</Chip>
    </section>
  );
}

const editGoalStyle = { fontWeight: 700, color: C.ink, borderBottom: '1px dashed transparent', padding: '0 1px' };
const editLiveStyle = { fontWeight: 900, color: C.ink };

// ── root App ────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "units": "kg",
  "weekStart": "mon",
  "density": "comfortable"
}/*EDITMODE-END*/;

function App() {
  const store = useStore();
  const { state } = store;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [selectedKey, setSelectedKey] = React.useState(todayKey());
  const [tab, setTab] = React.useState('food');
  const [modal, setModal] = React.useState(null); // {type:'meal'|'workout', data}
  const [toast, setToast] = React.useState(null);

  const day = state.days[selectedKey] || emptyDay();

  // theme + density to <html>
  React.useEffect(() => { document.documentElement.setAttribute('data-theme', t.theme); }, [t.theme]);
  React.useEffect(() => { document.documentElement.setAttribute('data-density', t.density); }, [t.density]);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const flash = (msg, icon) => {
    setToast({ msg, icon });
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setToast(null), 2200);
  };

  // meal handlers
  const saveMeal = (meal) => {
    if (state.days[selectedKey] && state.days[selectedKey].meals.some((m) => m.id === meal.id)) {
      store.updateMeal(selectedKey, meal); flash('Meal updated');
    } else { store.addMeal(selectedKey, meal); flash(`${meal.name} · ${grp(meal.kcal)} kcal logged`); }
    setModal(null);
  };
  const removeMeal = (id) => { store.deleteMeal(selectedKey, id); setModal(null); flash('Meal deleted', 'trash-2'); };

  // workout handlers
  const saveWorkout = (w) => {
    if (state.days[selectedKey] && state.days[selectedKey].workouts.some((x) => x.id === w.id)) {
      store.updateWorkout(selectedKey, w); flash('Session updated');
    } else { store.addWorkout(selectedKey, w); flash(`${w.name} logged`); }
    setModal(null);
  };
  const removeWorkout = (id) => { store.deleteWorkout(selectedKey, id); setModal(null); flash('Session deleted', 'trash-2'); };

  const stepDay = (n) => { const next = addDays(selectedKey, n); if (parseKey(next) <= parseKey(todayKey())) setSelectedKey(next); };

  return (
    <main className="t3-stage">
      <Header selectedKey={selectedKey} onStep={stepDay} onToday={() => setSelectedKey(todayKey())}
        theme={t.theme} onToggleTheme={() => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark')} />

      <Summary day={day} goals={state.goals} selectedKey={selectedKey} days={state.days} units={t.units} store={store} />

      <div className="t3-main">
        {/* Left — Food / Training */}
        <Panel>
          <div className="t3-panel-head">
            <Segmented value={tab} onChange={setTab} options={[
              { value: 'food', label: 'Food', icon: 'utensils' },
              { value: 'training', label: 'Training', icon: 'dumbbell' },
            ]} />
            <span className="t3-panel-sub">
              {tab === 'food'
                ? `${day.meals.length} meal${day.meals.length === 1 ? '' : 's'} logged`
                : `${day.workouts.length} session${day.workouts.length === 1 ? '' : 's'} logged`}
            </span>
          </div>
          {tab === 'food'
            ? <FoodPanel day={day} goals={state.goals}
                onAddMeal={() => setModal({ type: 'meal', data: null })}
                onEditMeal={(m) => setModal({ type: 'meal', data: m })} />
            : <TrainingPanel day={day} days={state.days} selectedKey={selectedKey}
                onAddWorkout={() => setModal({ type: 'workout', data: null })}
                onEditWorkout={(w) => setModal({ type: 'workout', data: w })} />}
        </Panel>

        {/* Right — History */}
        <Panel>
          <div className="t3-panel-head">
            <h2 className="t3-panel-title">History</h2>
            <span className="t3-panel-sub">Last 30 days · tap a day to load it</span>
          </div>
          <HistoryPanel days={state.days} goals={state.goals} selectedKey={selectedKey}
            onSelectDay={setSelectedKey} units={t.units} weekStart={t.weekStart} />
        </Panel>
      </div>

      {modal && modal.type === 'meal' && (
        <MealModal initial={modal.data} onSave={saveMeal} onClose={() => setModal(null)} onDelete={removeMeal} />
      )}
      {modal && modal.type === 'workout' && (
        <WorkoutModal initial={modal.data} onSave={saveWorkout} onClose={() => setModal(null)} onDelete={removeWorkout} />
      )}

      <Toast toast={toast} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance">
          <TweakRadio label="Theme" value={t.theme}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
            onChange={(v) => setTweak('theme', v)} />
          <TweakRadio label="Density" value={t.density}
            options={[{ value: 'comfortable', label: 'Comfy' }, { value: 'compact', label: 'Compact' }]}
            onChange={(v) => setTweak('density', v)} />
        </TweakSection>
        <TweakSection label="Units">
          <TweakRadio label="Body weight" value={t.units}
            options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]}
            onChange={(v) => setTweak('units', v)} />
          <TweakRadio label="Week starts" value={t.weekStart}
            options={[{ value: 'mon', label: 'Monday' }, { value: 'sun', label: 'Sunday' }]}
            onChange={(v) => setTweak('weekStart', v)} />
        </TweakSection>
        <TweakSection label="Data">
          <TweakButton label="Reset to demo data" secondary onClick={() => { if (confirm('Reset all logged data to the demo seed?')) { store.reset(); setSelectedKey(todayKey()); flash('Data reset to demo', 'rotate-ccw'); } }} />
        </TweakSection>
      </TweaksPanel>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
