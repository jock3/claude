// Bundled exercise library — curated ~120 common gym exercises in Swedish.
// No network call needed; works offline and avoids CORS issues.
// Format: { id, name, category, muscles }
// id is stable — used to track per-exercise history across sessions.

export const EXERCISES = [
  // ── Bröst ────────────────────────────────────────────────────────────────
  { id: 1,  name: 'Bänkpress',                  category: 'Bröst',      muscles: 'pectoralis, triceps, deltoid' },
  { id: 2,  name: 'Lutande bänkpress',          category: 'Bröst',      muscles: 'övre pectoralis' },
  { id: 3,  name: 'Nedfallande bänkpress',      category: 'Bröst',      muscles: 'nedre pectoralis' },
  { id: 4,  name: 'Hantelpress platt',          category: 'Bröst',      muscles: 'pectoralis, triceps' },
  { id: 5,  name: 'Hantelpress lutande',        category: 'Bröst',      muscles: 'övre pectoralis' },
  { id: 6,  name: 'Kabelkorsning',              category: 'Bröst',      muscles: 'pectoralis' },
  { id: 7,  name: 'Hantelflugor',               category: 'Bröst',      muscles: 'pectoralis' },
  { id: 8,  name: 'Push-ups',                   category: 'Bröst',      muscles: 'pectoralis, triceps' },
  { id: 9,  name: 'Dips',                       category: 'Bröst',      muscles: 'pectoralis, triceps' },
  { id: 10, name: 'Maskinpress bröst',          category: 'Bröst',      muscles: 'pectoralis' },

  // ── Rygg ─────────────────────────────────────────────────────────────────
  { id: 11, name: 'Marklyft',                   category: 'Rygg',       muscles: 'erector spinae, hamstrings, glutes' },
  { id: 12, name: 'Sumomarklyft',               category: 'Rygg',       muscles: 'glutes, hamstrings, erector spinae' },
  { id: 13, name: 'Rodd med skivstång',         category: 'Rygg',       muscles: 'latissimus, rhomboids, biceps' },
  { id: 14, name: 'Sittande kabelrodd',         category: 'Rygg',       muscles: 'latissimus, rhomboids' },
  { id: 15, name: 'Enarms hanterodd',           category: 'Rygg',       muscles: 'latissimus, rhomboids' },
  { id: 16, name: 'Latsdrag bred',              category: 'Rygg',       muscles: 'latissimus' },
  { id: 17, name: 'Latsdrag smal',              category: 'Rygg',       muscles: 'latissimus, biceps' },
  { id: 18, name: 'Pull-ups (breda)',           category: 'Rygg',       muscles: 'latissimus, biceps' },
  { id: 19, name: 'Chin-ups',                   category: 'Rygg',       muscles: 'latissimus, biceps' },
  { id: 20, name: 'T-bar rodd',                 category: 'Rygg',       muscles: 'latissimus, rhomboids' },
  { id: 21, name: 'Hyperextensions',            category: 'Rygg',       muscles: 'erector spinae, glutes' },
  { id: 22, name: 'Goodmorning',                category: 'Rygg',       muscles: 'erector spinae, hamstrings' },

  // ── Ben ──────────────────────────────────────────────────────────────────
  { id: 30, name: 'Knäböj',                     category: 'Ben',        muscles: 'quadriceps, glutes, hamstrings' },
  { id: 31, name: 'Front squats',               category: 'Ben',        muscles: 'quadriceps, glutes' },
  { id: 32, name: 'Benpress',                   category: 'Ben',        muscles: 'quadriceps, glutes, hamstrings' },
  { id: 33, name: 'Bulgariska utfall',          category: 'Ben',        muscles: 'quadriceps, glutes' },
  { id: 34, name: 'Utfall med skivstång',       category: 'Ben',        muscles: 'quadriceps, glutes' },
  { id: 35, name: 'Utfall med hantlar',         category: 'Ben',        muscles: 'quadriceps, glutes' },
  { id: 36, name: 'Benextension',               category: 'Ben',        muscles: 'quadriceps' },
  { id: 37, name: 'Liggande bencurl',           category: 'Ben',        muscles: 'hamstrings' },
  { id: 38, name: 'Sittande bencurl',           category: 'Ben',        muscles: 'hamstrings' },
  { id: 39, name: 'Romanian deadlift',          category: 'Ben',        muscles: 'hamstrings, glutes' },
  { id: 40, name: 'Stiff-leg deadlift',         category: 'Ben',        muscles: 'hamstrings, glutes' },
  { id: 41, name: 'Hip thrust',                 category: 'Ben',        muscles: 'glutes' },
  { id: 42, name: 'Vadpress stående',           category: 'Ben',        muscles: 'gastrocnemius' },
  { id: 43, name: 'Vadpress sittande',          category: 'Ben',        muscles: 'soleus' },
  { id: 44, name: 'Goblet squat',               category: 'Ben',        muscles: 'quadriceps, glutes' },
  { id: 45, name: 'Hack squat',                 category: 'Ben',        muscles: 'quadriceps' },
  { id: 46, name: 'Box squats',                 category: 'Ben',        muscles: 'quadriceps, glutes' },

  // ── Axlar ─────────────────────────────────────────────────────────────────
  { id: 50, name: 'Militärpress',               category: 'Axlar',      muscles: 'deltoid, triceps' },
  { id: 51, name: 'Hantelpress axlar',          category: 'Axlar',      muscles: 'deltoid' },
  { id: 52, name: 'Arnold press',               category: 'Axlar',      muscles: 'deltoid' },
  { id: 53, name: 'Sidolyft',                   category: 'Axlar',      muscles: 'lateral deltoid' },
  { id: 54, name: 'Framlyft',                   category: 'Axlar',      muscles: 'främre deltoid' },
  { id: 55, name: 'Bakre kabellyft',            category: 'Axlar',      muscles: 'bakre deltoid' },
  { id: 56, name: 'Facepulls',                  category: 'Axlar',      muscles: 'bakre deltoid, rhomboids' },
  { id: 57, name: 'Upright row',                category: 'Axlar',      muscles: 'deltoid, trapezius' },
  { id: 58, name: 'Shrugs skivstång',           category: 'Axlar',      muscles: 'trapezius' },
  { id: 59, name: 'Shrugs hantlar',             category: 'Axlar',      muscles: 'trapezius' },
  { id: 60, name: 'Maskinpress axlar',          category: 'Axlar',      muscles: 'deltoid' },

  // ── Biceps ────────────────────────────────────────────────────────────────
  { id: 70, name: 'Bicepscurl skivstång',       category: 'Biceps',     muscles: 'biceps brachii' },
  { id: 71, name: 'Bicepscurl hantlar',         category: 'Biceps',     muscles: 'biceps brachii' },
  { id: 72, name: 'Hammarcurl',                 category: 'Biceps',     muscles: 'biceps, brachialis' },
  { id: 73, name: 'Koncentrationscurl',         category: 'Biceps',     muscles: 'biceps brachii' },
  { id: 74, name: 'Predikerstolscurl',          category: 'Biceps',     muscles: 'biceps brachii' },
  { id: 75, name: 'Kabelbicepscurl',            category: 'Biceps',     muscles: 'biceps brachii' },
  { id: 76, name: 'Spidercurl',                 category: 'Biceps',     muscles: 'biceps brachii' },

  // ── Triceps ───────────────────────────────────────────────────────────────
  { id: 80, name: 'Triceps pushdown kabel',     category: 'Triceps',    muscles: 'triceps brachii' },
  { id: 81, name: 'Skull crushers',             category: 'Triceps',    muscles: 'triceps brachii' },
  { id: 82, name: 'Tricepsdips',                category: 'Triceps',    muscles: 'triceps brachii' },
  { id: 83, name: 'Overhead tricepsextension',  category: 'Triceps',    muscles: 'triceps brachii' },
  { id: 84, name: 'Close-grip bänkpress',       category: 'Triceps',    muscles: 'triceps, pectoralis' },
  { id: 85, name: 'Kickback',                   category: 'Triceps',    muscles: 'triceps brachii' },

  // ── Core ──────────────────────────────────────────────────────────────────
  { id: 90, name: 'Plankan',                    category: 'Core',       muscles: 'transverse abdominis, core' },
  { id: 91, name: 'Crunches',                   category: 'Core',       muscles: 'rectus abdominis' },
  { id: 92, name: 'Situps',                     category: 'Core',       muscles: 'rectus abdominis, hip flexors' },
  { id: 93, name: 'Rysk twist',                 category: 'Core',       muscles: 'obliques' },
  { id: 94, name: 'Kabelmage',                  category: 'Core',       muscles: 'rectus abdominis' },
  { id: 95, name: 'Leg raises liggande',        category: 'Core',       muscles: 'lower rectus abdominis, hip flexors' },
  { id: 96, name: 'Hanging leg raises',         category: 'Core',       muscles: 'rectus abdominis, hip flexors' },
  { id: 97, name: 'Ab wheel',                   category: 'Core',       muscles: 'rectus abdominis, core' },
  { id: 98, name: 'Sideplankan',                category: 'Core',       muscles: 'obliques, transverse abdominis' },
  { id: 99, name: 'Bicycle crunches',           category: 'Core',       muscles: 'obliques, rectus abdominis' },

  // ── Kondition / Cardio ────────────────────────────────────────────────────
  { id: 110, name: 'Löpband',                   category: 'Kondition',  muscles: '' },
  { id: 111, name: 'Crosstrainer',              category: 'Kondition',  muscles: '' },
  { id: 112, name: 'Cykel',                     category: 'Kondition',  muscles: '' },
  { id: 113, name: 'Roddmaskin',                category: 'Kondition',  muscles: 'full body' },
  { id: 114, name: 'Stairmaster',               category: 'Kondition',  muscles: 'glutes, quadriceps' },
  { id: 115, name: 'Hoppreppa',                 category: 'Kondition',  muscles: 'full body' },
  { id: 116, name: 'Burpees',                   category: 'Kondition',  muscles: 'full body' },
  { id: 117, name: 'Kettlebell swing',          category: 'Kondition',  muscles: 'glutes, hamstrings, core' },
  { id: 118, name: 'Box jumps',                 category: 'Kondition',  muscles: 'quadriceps, glutes' },
  { id: 119, name: 'Battle ropes',              category: 'Kondition',  muscles: 'full body' },
  { id: 120, name: 'Sprint intervals',          category: 'Kondition',  muscles: '' },
  { id: 121, name: 'Promenad',                  category: 'Kondition',  muscles: '' },
  { id: 122, name: 'Löpning utomhus',           category: 'Kondition',  muscles: '' },
  { id: 123, name: 'Simning',                   category: 'Kondition',  muscles: 'full body' },
  { id: 124, name: 'Cykling utomhus',           category: 'Kondition',  muscles: '' },

  // ── Olympiska / Helkropp ──────────────────────────────────────────────────
  { id: 130, name: 'Clean and jerk',            category: 'Helkropp',   muscles: 'full body' },
  { id: 131, name: 'Snatch',                    category: 'Helkropp',   muscles: 'full body' },
  { id: 132, name: 'Power clean',               category: 'Helkropp',   muscles: 'full body' },
  { id: 133, name: 'Hang clean',                category: 'Helkropp',   muscles: 'full body' },
  { id: 134, name: 'Thrusters',                 category: 'Helkropp',   muscles: 'quadriceps, deltoid, core' },
  { id: 135, name: 'Turkish get-up',            category: 'Helkropp',   muscles: 'full body, core' },
];

// Fuzzy-ish search: returns exercises whose name or category matches the query.
// Ranks exact starts before partial matches.
export function searchExercises(query) {
  const q = (query || '').trim().toLowerCase();
  if (q.length < 2) return [];
  const exact = [], partial = [];
  for (const ex of EXERCISES) {
    const n = ex.name.toLowerCase();
    const c = ex.category.toLowerCase();
    if (n.startsWith(q) || c.startsWith(q)) exact.push(ex);
    else if (n.includes(q) || c.includes(q) || ex.muscles.toLowerCase().includes(q)) partial.push(ex);
  }
  return [...exact, ...partial].slice(0, 20);
}
