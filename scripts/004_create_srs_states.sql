-- Create SRS states table
create table if not exists public.srs_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  easiness double precision default 2.5,
  interval integer default 0,
  repetitions integer default 0,
  due_date date default now(),
  last_reviewed timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, card_id)
);

-- Create index for performance
create index if not exists srs_states_user_id_idx on public.srs_states(user_id);
create index if not exists srs_states_due_date_idx on public.srs_states(due_date);

-- Enable RLS
alter table public.srs_states enable row level security;

-- RLS Policies for SRS states
create policy "srs_states_select_own"
  on public.srs_states for select
  using (auth.uid() = user_id);

create policy "srs_states_insert_own"
  on public.srs_states for insert
  with check (auth.uid() = user_id);

create policy "srs_states_update_own"
  on public.srs_states for update
  using (auth.uid() = user_id);

create policy "srs_states_delete_own"
  on public.srs_states for delete
  using (auth.uid() = user_id);
