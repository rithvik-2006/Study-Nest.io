-- Create cards table
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  front text not null,
  back text not null,
  hint text,
  media_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index for performance
create index if not exists cards_deck_id_idx on public.cards(deck_id);

-- Enable RLS
alter table public.cards enable row level security;

-- RLS Policies for cards (inherit from deck visibility)
create policy "cards_select_own"
  on public.cards for select
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and (decks.owner_id = auth.uid() or decks.visibility = 'public')
    )
  );

create policy "cards_insert_own"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and decks.owner_id = auth.uid()
    )
  );

create policy "cards_update_own"
  on public.cards for update
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and decks.owner_id = auth.uid()
    )
  );

create policy "cards_delete_own"
  on public.cards for delete
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and decks.owner_id = auth.uid()
    )
  );
