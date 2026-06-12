import { supabase } from '../shared/supabase.js';

/* ── Profiler ─────────────────────────────────────────────── */

export async function getProfiles() {
  const { data } = await supabase
    .from('profiles')
    .select('id, name')
    .order('created_at');
  return data || [];
}

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

/* ── Tavlan (todo_boards: en rad per profil, allt i data-jsonb) ── */

export async function getBoard(profileId) {
  const { data, error } = await supabase
    .from('todo_boards')
    .select('data')
    .eq('profile_id', profileId)
    .maybeSingle();
  if (error) throw error;
  return data ? data.data : null;
}

export async function saveBoard(profileId, boardData) {
  const { error } = await supabase
    .from('todo_boards')
    .upsert({ profile_id: profileId, data: boardData, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/* ── Legacy (gamla projects-tabellen, läses bara vid första import) ── */

export async function getLegacyProjects(profileId) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true });
  return data || [];
}
