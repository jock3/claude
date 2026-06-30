import CalorieRingModule from './CalorieRingModule.jsx';
import FoodLogModule     from './FoodLogModule.jsx';
import WaterModule       from './WaterModule.jsx';
import WorkoutModule     from './WorkoutModule.jsx';
import TrendsModule      from './TrendsModule.jsx';
import CalendarModule    from './CalendarModule.jsx';

export default function BentoDashboard({ day, goals, trend30, weekWorkouts }) {
  return (
    <div className="t3-bento">
      <CalorieRingModule day={day}        goals={goals} />
      <FoodLogModule     day={day} />
      <WaterModule       day={day}        goal={goals.water} />
      <WorkoutModule     day={day}        weekWorkouts={weekWorkouts} />
      <TrendsModule      trend30={trend30} />
      <CalendarModule    trend30={trend30} />
    </div>
  );
}
