-- Tasks table for the calendar / task manager.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  description text,
  start_time  timestamptz not null default now(),
  end_time    timestamptz,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_user_id_start_time_idx
  on public.tasks (user_id, start_time);

-- Row Level Security: every user can only touch their own rows.
alter table public.tasks enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own"
  on public.tasks for select
  using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own"
  on public.tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own"
  on public.tasks for delete
  using (auth.uid() = user_id);
