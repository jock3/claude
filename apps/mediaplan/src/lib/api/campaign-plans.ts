import { getSupabaseClient } from "@/lib/supabase/client";
import type { CampaignPlan, Campaign, CampaignPlatform, FullCampaignPlan } from "@/lib/types";

const sb = () => getSupabaseClient();

export async function getCampaignPlans(): Promise<CampaignPlan[]> {
  const { data, error } = await sb().from("campaign_plans").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CampaignPlan[];
}

export async function getFullCampaignPlan(id: string): Promise<FullCampaignPlan | null> {
  const [planRes, campaignsRes, platformsRes] = await Promise.all([
    sb().from("campaign_plans").select("*").eq("id", id).single(),
    sb().from("campaigns").select("*").eq("plan_id", id).order("sort_order"),
    sb().from("campaign_platforms").select("*").order("sort_order"),
  ]);

  if (planRes.error || !planRes.data) return null;

  const campaigns = (campaignsRes.data ?? []).map((c) => ({
    ...c,
    platforms: (platformsRes.data ?? []).filter((p) => p.campaign_id === c.id),
  }));

  return { ...planRes.data, campaigns } as FullCampaignPlan;
}

export async function createCampaignPlan(name: string, periodStart: string, periodEnd: string): Promise<CampaignPlan> {
  const { data, error } = await sb()
    .from("campaign_plans")
    .insert({ name, period_start: periodStart, period_end: periodEnd })
    .select()
    .single();
  if (error) throw error;
  return data as CampaignPlan;
}

export async function updateCampaignPlan(id: string, updates: Partial<CampaignPlan>): Promise<void> {
  const { error } = await sb().from("campaign_plans").update(updates).eq("id", id);
  if (error) throw error;
}

export async function archiveCampaignPlan(id: string, archived: boolean): Promise<void> {
  await updateCampaignPlan(id, { archived });
}

export async function deleteCampaignPlan(id: string): Promise<void> {
  const { error } = await sb().from("campaign_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function createCampaign(planId: string, name: string, sortOrder: number): Promise<Campaign> {
  const { data, error } = await sb()
    .from("campaigns")
    .insert({ plan_id: planId, name, color: "#E60330", sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<void> {
  const { error } = await sb().from("campaigns").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await sb().from("campaigns").delete().eq("id", id);
  if (error) throw error;
}

export async function createPlatform(campaignId: string, name: string, start: string, end: string, sortOrder: number): Promise<CampaignPlatform> {
  const { data, error } = await sb()
    .from("campaign_platforms")
    .insert({ campaign_id: campaignId, platform_name: name, start_date: start, end_date: end, status: "inaktiv", color: "#3b82f6", sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data as CampaignPlatform;
}

export async function updatePlatform(id: string, updates: Partial<CampaignPlatform>): Promise<void> {
  const { error } = await sb().from("campaign_platforms").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deletePlatform(id: string): Promise<void> {
  const { error } = await sb().from("campaign_platforms").delete().eq("id", id);
  if (error) throw error;
}
