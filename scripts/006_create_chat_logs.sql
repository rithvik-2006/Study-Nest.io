-- Create chat logs table
create table if not exists public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  deck_id uuid references public.decks(id) on delete set null,
  card_id uuid references public.cards(id) on delete set null,
  message text not null,
  response text not null,
  model_version text default 'v1-fallback',
  created_at timestamptz default now()
);

-- Create index for performance
create index if not exists chat_logs_user_id_idx on public.chat_logs(user_id);

-- Enable RLS
alter table public.chat_logs enable row level security;

-- RLS Policies for chat logs
create policy "chat_logs_select_own"
  on public.chat_logs for select
  using (auth.uid() = user_id);

create policy "chat_logs_insert_own"
  on public.chat_logs for insert
  with check (auth.uid() = user_id);
