-- ============================================================
-- Reset the tasks table
-- ------------------------------------------------------------
-- The `tasks` table that existed in this project belonged to a
-- different schema (it had a NOT NULL `workspace_id` column that
-- this app never sets). This DROPS that table and recreates a
-- clean one for the team board.
--
-- DESTRUCTIVE: this deletes the existing `tasks` table and its
-- rows. Run only because that table is unused. `sections` and
-- `team_members` are left untouched.
--
-- Run in the Supabase SQL editor. The "destructive operation"
-- warning is expected here — that's the point.
-- ============================================================

-- Make sure the tables our foreign keys point at exist.
create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- Seed the default sections if none exist yet.
insert into public.sections (name, sort_order)
select v.name, v.ord
from (values ('Media', 0), ('Ops', 1), ('Music', 2)) as v(name, ord)
where not exists (select 1 from public.sections);

-- Drop the old/foreign tasks table and anything depending on it.
drop table if exists public.tasks cascade;

-- Recreate clean, with every column the app expects.
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  description text,
  start_time  timestamptz not null default now(),
  end_time    timestamptz,
  completed   boolean not null default false,
  urgency     text not null default 'low'
                check (urgency in ('low', '72_hours', 'urgent')),
  section_id  uuid references public.sections (id)     on delete set null,
  assignee_id uuid references public.team_members (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index tasks_section_idx  on public.tasks (section_id);
create index tasks_assignee_idx on public.tasks (assignee_id);
create index tasks_urgency_idx  on public.tasks (urgency);

-- Shared team-wide RLS: any signed-in member, full access.
alter table public.tasks enable row level security;
create policy "tasks_team_all" on public.tasks
  for all to authenticated using (true) with check (true);

-- Refresh PostgREST's cached schema so inserts see every column.
notify pgrst, 'reload schema';
