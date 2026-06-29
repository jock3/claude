export default function RingProgress({
  value = 0,
  max = 1,
  size = 140,
  stroke = 10,
  children,
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;
  const cx = size / 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="rgba(255,255,255,0.12)"
        />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="rgba(255,255,255,0.88)"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}
