import { today, goals, trend30, weekWorkouts } from './mockData.js';
import BentoDashboard from './components/bento/BentoDashboard.jsx';

export default function BentoApp() {
  return (
    <div className="t3-root" style={{ minHeight: '100vh' }}>
      <div className="t3-bento-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.03em', opacity: 0.9 }}>Track3r</span>
          <span style={{ fontSize: 12, opacity: 0.4 }}>
            {new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>

      <BentoDashboard
        day={today}
        goals={goals}
        trend30={trend30}
        weekWorkouts={weekWorkouts}
      />
    </div>
  );
}
