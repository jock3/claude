export default function GlassCard({ className = '', children, style }) {
  return (
    <div className={`t3-m ${className}`} style={style}>
      {children}
    </div>
  );
}
