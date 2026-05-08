import { supabase } from './supabase.js';

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

export async function getCampaigns(profileId) {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function upsertCampaign(campaign) {
  await supabase.from('campaigns').upsert(campaign);
}

export async function deleteCampaign(id) {
  await supabase.from('campaigns').delete().eq('id', id);
}
