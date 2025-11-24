-- Create flags table for moderation
create table if not exists public.flags (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('deck', 'card')),
  target_id uuid not null,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for performance
create index if not exists flags_target_type_id_idx on public.flags(target_type, target_id);

-- Enable RLS
alter table public.flags enable row level security;

-- RLS Policies for flags
create policy "flags_select_all"
  on public.flags for select
  using (true);

create policy "flags_insert_own"
  on public.flags for insert
  with check (auth.uid() = reporter_id);
