import SparkLine from '../ui/SparkLine.jsx';

function TrendCard({ label, value, unit, delta, values }) {
  return (
    <div style={{
      flex: 1, background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10, padding: '10px 12px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', opacity: 0.45 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 10, opacity: 0.45 }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, opacity: 0.5, fontWeight: 700 }}>
          {delta >= 0 ? '+' : ''}{delta} {unit} /30d
        </span>
        <SparkLine values={values} width={60} height={24} />
      </div>
    </div>
  );
}

export default function TrendsModule({ trend30 }) {
  const kcals   = trend30.map(d => d.kcal);
  const steps   = trend30.map(d => d.steps);
  const weights = trend30.map(d => d.weight);
  const workoutCount = trend30.filter(d => d.hasWorkout).length;
  const workoutBars  = trend30.map(d => d.hasWorkout ? 1 : 0);
  const wDelta = +(weights[weights.length - 1] - weights[0]).toFixed(1);

  return (
    <div className="t3-m t3-m-stats" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="t3-m-label">30-dagars trend</div>
      <div style={{ display: 'flex', gap: 8, flex: 1 }}>
        <TrendCard
          label="Kalorier"
          value={Math.round(kcals.reduce((a, b) => a + b) / kcals.length)}
          unit="kcal"
          delta={Math.round(kcals[kcals.length - 1] - kcals[0])}
          values={kcals}
        />
        <TrendCard
          label="Steg"
          value={Math.round(steps.reduce((a, b) => a + b) / steps.length).toLocaleString('sv-SE')}
          unit="steg"
          delta={Math.round(steps[steps.length - 1] - steps[0])}
          values={steps}
        />
        <TrendCard
          label="Vikt"
          value={weights[weights.length - 1].toFixed(1)}
          unit="kg"
          delta={wDelta}
          values={weights}
        />
        <TrendCard
          label="Pass"
          value={workoutCount}
          unit="st"
          delta={0}
          values={workoutBars}
        />
      </div>
    </div>
  );
}
