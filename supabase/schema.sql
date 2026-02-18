-- ============================================================
-- Smart Bookmark App — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the bookmarks table
create table public.bookmarks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  url        text not null,
  title      text not null,
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security
alter table public.bookmarks enable row level security;

-- 3. Policy: users can read only their own bookmarks
create policy "Users can read own bookmarks"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

-- 4. Policy: users can insert their own bookmarks
create policy "Users can insert own bookmarks"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

-- 5. Policy: users can delete their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- 6. Enable realtime for the bookmarks table
alter publication supabase_realtime add table public.bookmarks;
