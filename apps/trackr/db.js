import { supabase } from '../shared/supabase.js';

/* ── Profiles (shared with the other apps) ─────────────────────────────────── */
export async function getOrCreateProfile(name) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('name', name)
    .maybeSingle();
  if (existing) return existing;

  const { data: created } = await supabase
    .from('profiles')
    .insert({ name })
    .select('id, name')
    .single();
  return created;
}

/* ── Goals (one row per profile) ───────────────────────────────────────────── */
export async function getGoals(profileId) {
  const { data } = await supabase
    .from('track3r_goals')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle();
  return data || null;
}

export async function upsertGoals(profileId, goals) {
  await supabase.from('track3r_goals').upsert(
    { profile_id: profileId, ...goals, updated_at: new Date().toISOString() },
    { onConflict: 'profile_id' }
  );
}

/* ── Days (one row per profile per date) ───────────────────────────────────── */
export async function getDays(profileId, fromKey, toKey) {
  let q = supabase.from('track3r_days').select('*').eq('profile_id', profileId);
  if (fromKey) q = q.gte('date', fromKey);
  if (toKey) q = q.lte('date', toKey);
  const { data } = await q.order('date', { ascending: true });
  return data || [];
}

export async function upsertDay(profileId, dateKey, day) {
  await supabase.from('track3r_days').upsert(
    {
      profile_id: profileId,
      date: dateKey,
      meals: day.meals || [],
      workouts: day.workouts || [],
      steps: day.steps,
      weight: day.weight,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'profile_id,date' }
  );
}
