import { supabase } from './supabase.js';

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

export async function getProjects(profileId) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function upsertProject(project) {
  await supabase.from('projects').upsert(project);
}

export async function deleteProject(id) {
  await supabase.from('projects').delete().eq('id', id);
}
