-- NeuroLeitura Cinematográfica: biblioteca privada por usuário
create extension if not exists pgcrypto;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null default '',
  table_of_contents jsonb not null default '[]'::jsonb,
  last_accessed_chapter_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  unique(book_id, position)
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  chapter_id uuid not null unique references public.chapters(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  nlp_technique text,
  prompt_version text not null default '4.0',
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;
alter table public.chapters enable row level security;
alter table public.episodes enable row level security;

create policy "Users manage own books" on public.books for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own chapters" on public.chapters for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read own episodes" on public.episodes for select to authenticated
  using (auth.uid() = user_id);
create policy "Users insert own episodes" on public.episodes for insert to authenticated
  with check (auth.uid() = user_id);

create index if not exists books_user_updated_idx on public.books(user_id, updated_at desc);
create index if not exists chapters_book_position_idx on public.chapters(book_id, position);
create index if not exists episodes_user_idx on public.episodes(user_id);

create or replace function public.touch_book_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists books_touch_updated_at on public.books;
create trigger books_touch_updated_at before update on public.books
for each row execute function public.touch_book_updated_at();

alter table public.books
  drop constraint if exists books_last_accessed_chapter_fk;
alter table public.books
  add constraint books_last_accessed_chapter_fk
  foreign key (last_accessed_chapter_id) references public.chapters(id) on delete set null;
