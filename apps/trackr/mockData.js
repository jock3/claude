// Static fixture data for bento mockup — replace with live Supabase queries

export const today = {
  date: '2026-06-29',
  steps: 7240,
  weight: 78.4,
  water: 5,
  meals: [
    {
      slot: 'Frukost',
      items: [
        { name: 'Havregrynsgröt', kcal: 320, protein: 12, carbs: 54, fat: 7 },
        { name: 'Banan', kcal: 95, protein: 1, carbs: 24, fat: 0 },
      ],
    },
    {
      slot: 'Lunch',
      items: [
        { name: 'Kycklingfilé', kcal: 280, protein: 42, carbs: 0, fat: 11 },
        { name: 'Ris (100g)', kcal: 130, protein: 3, carbs: 28, fat: 0 },
        { name: 'Grönsaker', kcal: 45, protein: 2, carbs: 8, fat: 1 },
      ],
    },
    {
      slot: 'Mellanmål',
      items: [
        { name: 'Kvarg 2%', kcal: 160, protein: 20, carbs: 8, fat: 3 },
      ],
    },
    { slot: 'Middag', items: [] },
  ],
  workouts: [
    {
      type: 'strength',
      name: 'Push A',
      durationMin: 52,
      exercises: 6,
      sets: 18,
    },
  ],
};

export const goals = {
  kcal: 2400,
  protein: 160,
  carbs: 240,
  fat: 70,
  steps: 10000,
  water: 8,
  weight: 76,
};

export const trend30 = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
  kcal: 1900 + Math.round(Math.random() * 700),
  steps: 5000 + Math.round(Math.random() * 7000),
  weight: 79.2 - i * 0.028 + (Math.random() - 0.5) * 0.6,
  hasWorkout: Math.random() > 0.5,
  kcalHit: Math.random() > 0.35,
  stepsHit: Math.random() > 0.5,
}));

export const weekWorkouts = [1, 0, 1, 1, 0, 1, 0]; // Mon–Sun
