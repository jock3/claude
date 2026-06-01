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

-- Match the access model of the existing tables (anon key, RLS not enabled).
grant all on table public.track3r_goals to anon, authenticated;
grant all on table public.track3r_days  to anon, authenticated;
