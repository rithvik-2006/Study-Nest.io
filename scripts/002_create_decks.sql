-- Create decks table
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  tags text[] default '{}',
  visibility text default 'private' check (visibility in ('private', 'public')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for performance
create index if not exists decks_owner_id_idx on public.decks(owner_id);

-- Enable RLS
alter table public.decks enable row level security;

-- RLS Policies for decks
create policy "decks_select_own"
  on public.decks for select
  using (auth.uid() = owner_id or visibility = 'public');

create policy "decks_insert_own"
  on public.decks for insert
  with check (auth.uid() = owner_id);

create policy "decks_update_own"
  on public.decks for update
  using (auth.uid() = owner_id);

create policy "decks_delete_own"
  on public.decks for delete
  using (auth.uid() = owner_id);
