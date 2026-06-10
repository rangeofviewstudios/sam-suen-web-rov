-- ============================================================
-- Team board upgrade
-- Run this AFTER schema.sql, in the Supabase SQL editor.
-- Converts the personal task list into a shared team board:
-- sections, team members (assignees), urgency, and team-wide RLS.
-- Safe to run more than once.
-- ============================================================

-- 1. Sections (Media / Ops / Music — editable) -----------------
create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Seed the three defaults only if the table is empty.
insert into public.sections (name, sort_order)
select v.name, v.ord
from (values ('Media', 0), ('Ops', 1), ('Music', 2)) as v(name, ord)
where not exists (select 1 from public.sections);

-- 2. Team members (assignees you manage) -----------------------
create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- 3. Tasks table (create if missing, then ensure every column) -
-- Self-healing: works whether schema.sql ran fully, partially, or
-- not at all.
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete cascade,
  title       text not null,
  description text,
  start_time  timestamptz not null default now(),
  end_time    timestamptz,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Backfill anything missing from an earlier partial setup.
alter table public.tasks
  add column if not exists user_id     uuid references auth.users (id) on delete cascade,
  add column if not exists title       text,
  add column if not exists description text,
  add column if not exists start_time  timestamptz not null default now(),
  add column if not exists end_time    timestamptz,
  add column if not exists completed   boolean not null default false,
  add column if not exists created_at  timestamptz not null default now(),
  add column if not exists urgency     text not null default 'low',
  add column if not exists section_id  uuid references public.sections(id)     on delete set null,
  add column if not exists assignee_id uuid references public.team_members(id) on delete set null;

alter table public.tasks drop constraint if exists tasks_urgency_check;
alter table public.tasks add constraint tasks_urgency_check
  check (urgency in ('low', '72_hours', 'urgent'));

create index if not exists tasks_section_idx  on public.tasks (section_id);
create index if not exists tasks_assignee_idx on public.tasks (assignee_id);
create index if not exists tasks_urgency_idx  on public.tasks (urgency);

-- 4. Shared RLS — replace per-user policies with team-wide ------
-- tasks: drop the old "own rows only" policies from schema.sql
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

alter table public.tasks enable row level security;
drop policy if exists "tasks_team_all" on public.tasks;
create policy "tasks_team_all" on public.tasks
  for all to authenticated using (true) with check (true);

alter table public.sections enable row level security;
drop policy if exists "sections_team_all" on public.sections;
create policy "sections_team_all" on public.sections
  for all to authenticated using (true) with check (true);

alter table public.team_members enable row level security;
drop policy if exists "members_team_all" on public.team_members;
create policy "members_team_all" on public.team_members
  for all to authenticated using (true) with check (true);

-- 5. Refresh PostgREST's cached schema ------------------------
-- After altering tables, the API layer can keep a stale view of the
-- columns ("Could not find the 'X' column ... in the schema cache").
-- This forces an immediate reload so inserts/updates see every column.
notify pgrst, 'reload schema';
