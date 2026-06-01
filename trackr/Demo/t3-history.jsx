// Track3r — tracking hub · Food panel + meal editor

const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

function MealModal({ initial, onSave, onClose, onDelete }) {
  const editing = !!(initial && initial.id);
  const [f, setF] = React.useState(() => ({
    slot: (initial && initial.slot) || 'Breakfast',
    name: (initial && initial.name) || '',
    time: (initial && initial.time) || '',
    kcal: initial && initial.kcal != null ? String(initial.kcal) : '',
    protein: initial && initial.protein != null ? String(initial.protein) : '',
    carbs: initial && initial.carbs != null ? String(initial.carbs) : '',
    fat: initial && initial.fat != null ? String(initial.fat) : '',
  }));
  const [tried, setTried] = React.useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const nameBad = !f.name.trim();
  const kcalBad = !(parseFloat(f.kcal) > 0);

  const submit = () => {
    setTried(true);
    if (nameBad || kcalBad) return;
    onSave({
      id: editing ? initial.id : uid('m'),
      slot: f.slot,
      name: f.name.trim(),
      time: f.time.trim(),
      kcal: Math.round(parseFloat(f.kcal)),
      protein: Math.round(parseFloat(f.protein) || 0),
      carbs: Math.round(parseFloat(f.carbs) || 0),
      fat: Math.round(parseFloat(f.fat) || 0),
    });
  };

  return (
    <Modal eyebrow={editing ? 'Edit meal' : 'Log meal'} title={editing ? 'Edit meal' : 'Add a meal'} onClose={onClose}
      footer={
        <React.Fragment>
          {editing && <Button variant="danger" icon="trash-2" onClick={() => onDelete(initial.id)} style={{ marginRight: 'auto' }}>Delete</Button>}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="check" onClick={submit}>{editing ? 'Save' : 'Add meal'}</Button>
        </React.Fragment>
      }>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, paddingBottom: 8 }}>
        <Field label="Slot">
          <select className="t3-input" value={f.slot} onChange={(e) => set('slot', e.target.value)}>
            {MEAL_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Time">
          <TextInput type="time" value={f.time} onChange={(e) => set('time', e.target.value)} />
        </Field>
        <Field label="What did you eat?" span={2}>
          <TextInput value={f.name} placeholder="e.g. Chicken & rice bowl" invalid={tried && nameBad}
            onChange={(e) => set('name', e.target.value)} autoFocus />
        </Field>
        <Field label="Calories" hint="kcal — required" span={2}>
          <TextInput type="number" inputMode="numeric" min="0" value={f.kcal} placeholder="0" invalid={tried && kcalBad}
            onChange={(e) => set('kcal', e.target.value)} />
        </Field>
        <Field label="Protein (g)">
          <TextInput type="number" inputMode="numeric" min="0" value={f.protein} placeholder="0" onChange={(e) => set('protein', e.target.value)} />
        </Field>
        <Field label="Carbs (g)">
          <TextInput type="number" inputMode="numeric" min="0" value={f.carbs} placeholder="0" onChange={(e) => set('carbs', e.target.value)} />
        </Field>
        <Field label="Fat (g)">
          <TextInput type="number" inputMode="numeric" min="0" value={f.fat} placeholder="0" onChange={(e) => set('fat', e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

function MealRow({ meal, onClick }) {
  return (
    <button onClick={onClick} className="t3-row" style={{
      display: 'grid', gridTemplateColumns: '92px 1fr auto', alignItems: 'center', gap: 16,
      padding: '13px 8px', width: '100%', textAlign: 'left', background: 'transparent',
      border: 'none', borderTop: `0.5px solid ${C.line2}`, cursor: 'pointer', fontFamily: 'REM, sans-serif',
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink3 }}>{meal.slot}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {meal.name}{meal.time && <small style={{ color: C.ink4, fontWeight: 400, marginLeft: 8 }}>{meal.time}</small>}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, color: C.ink3, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <b style={{ color: C.amber }}>{meal.protein}g</b> P
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: C.ink, whiteSpace: 'nowrap' }}>
          {grp(meal.kcal)}<small style={{ color: C.ink3, fontWeight: 500, fontSize: 12, marginLeft: 2 }}>kcal</small>
        </span>
        <Icon name="pencil" size={14} color={C.ink4} stroke={2} style={{ opacity: 0.55 }} />
      </span>
    </button>
  );
}

function Macro({ name, value, goal, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink }}>{name}</span>
      <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1, color: C.ink }}>
        {value}<span style={{ color: C.ink3, fontWeight: 500, fontSize: 12, marginLeft: 4 }}>/ {goal} g</span>
      </span>
      <MacroBar value={value} max={goal} color={color} />
    </div>
  );
}

function FoodPanel({ day, goals, onAddMeal, onEditMeal, sub }) {
  const totals = dayTotals(day);
  const left = Math.max(0, goals.kcal - totals.kcal);
  const over = totals.kcal > goals.kcal;
  const meals = [...day.meals].sort((a, b) => MEAL_SLOTS.indexOf(a.slot) - MEAL_SLOTS.indexOf(b.slot) || (a.time || '').localeCompare(b.time || ''));

  return (
    <React.Fragment>
      {/* Ring + macros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'center', padding: '4px 0 6px' }}>
        <Ring value={totals.kcal} max={goals.kcal} size={168} color={over ? C.amber : C.teal}>
          <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: C.ink }}>{grp(over ? totals.kcal - goals.kcal : left)}</span>
          <Eyebrow color={C.ink3} style={{ marginTop: 6 }}>{over ? 'kcal over' : 'kcal left'}</Eyebrow>
        </Ring>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <Macro name="Protein" value={totals.protein} goal={goals.protein} color={C.amber} />
          <Macro name="Carbs" value={totals.carbs} goal={goals.carbs} color={C.tealLight} />
          <Macro name="Fat" value={totals.fat} goal={goals.fat} color={C.tealDeep} />
        </div>
      </div>

      <div style={{ height: '0.5px', background: C.line, margin: '4px 0 2px' }} />

      {/* Meals */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'auto' }} className="t3-scroll">
        {meals.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 0', color: C.ink3, minHeight: 140 }}>
            <Icon name="utensils" size={26} color={C.ink4} stroke={1.75} />
            <span style={{ fontSize: 13 }}>No meals logged for this day.</span>
          </div>
        ) : meals.map((m) => <MealRow key={m.id} meal={m} onClick={() => onEditMeal(m)} />)}
      </div>

      <div style={{ paddingTop: 14 }}>
        <Button variant="dark" icon="plus" onClick={onAddMeal}>Add meal</Button>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { MealModal, FoodPanel, MEAL_SLOTS });
