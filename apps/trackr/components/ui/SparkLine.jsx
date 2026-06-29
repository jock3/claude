export default function SparkLine({ values = [], width = 80, height = 28 }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * width,
    height - ((v - min) / range) * height,
  ]);
  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const area = [
    `${pts[0][0]},${height}`,
    ...pts.map(([x, y]) => `${x},${y}`),
    `${pts[pts.length - 1][0]},${height}`,
  ].join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polygon points={area} fill="rgba(255,255,255,0.07)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="rgba(255,255,255,0.60)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
