-- Track3r — Supabase schema
-- Run this once in your Supabase project's SQL editor.
-- Assumes the shared `profiles` table already exists (id uuid primary key),
-- the same one the todo and kampanj apps use.

-- Per-profile goals (one row per user)
create table if not exists public.track3r_goals (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  kcal    integer not null default 2400,
  protein integer not null default 160,
  carbs   integer not null default 240,
  fat     integer not null default 70,
  steps   integer not null default 10000,
  weight  numeric not null default 75,
  updated_at timestamptz not null default now()
);

-- Per-day tracking data (one row per user per date)
create table if not exists public.track3r_days (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  meals    jsonb not null default '[]'::jsonb,
  workouts jsonb not null default '[]'::jsonb,
  steps    integer,
  weight   numeric,
  updated_at timestamptz not null default now(),
  primary key (profile_id, date)
);

create index if not exists track3r_days_profile_date_idx
  on public.track3r_days (profile_id, date);

-- Saved meals / favourites (many per user) for one-click re-logging.
create table if not exists public.track3r_favorites (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name    text not null,
  kcal    integer not null default 0,
  protein integer not null default 0,
  carbs   integer not null default 0,
  fat     integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists track3r_favorites_profile_idx
  on public.track3r_favorites (profile_id);

-- Match the access model of the existing tables (anon key, public hub).
grant all on table public.track3r_goals     to anon, authenticated;
grant all on table public.track3r_days      to anon, authenticated;
grant all on table public.track3r_favorites to anon, authenticated;

-- This Supabase project has RLS enabled on new tables by default, so the
-- anon key needs explicit policies (grants alone aren't enough — RLS
-- defaults to deny-all). Permissive policies match the profiles/projects
-- tables the other apps use: data is separated per profile, not per row.
alter table public.track3r_goals     enable row level security;
alter table public.track3r_days      enable row level security;
alter table public.track3r_favorites enable row level security;

create policy "track3r_goals public access" on public.track3r_goals
  for all to anon, authenticated using (true) with check (true);

create policy "track3r_days public access" on public.track3r_days
  for all to anon, authenticated using (true) with check (true);

create policy "track3r_favorites public access" on public.track3r_favorites
  for all to anon, authenticated using (true) with check (true);
