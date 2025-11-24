-- Create study sessions table
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  started_at timestamptz default now(),
  ended_at timestamptz,
  stats jsonb default '{"cards_reviewed": 0, "percent_correct": 0, "avg_response_time": 0}',
  created_at timestamptz default now()
);

-- Create index for performance
create index if not exists study_sessions_user_id_idx on public.study_sessions(user_id);
create index if not exists study_sessions_deck_id_idx on public.study_sessions(deck_id);

-- Enable RLS
alter table public.study_sessions enable row level security;

-- RLS Policies for study sessions
create policy "study_sessions_select_own"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "study_sessions_insert_own"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "study_sessions_update_own"
  on public.study_sessions for update
  using (auth.uid() = user_id);
