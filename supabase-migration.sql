-- ============================================
-- Supabase SQL Migration for Game Scoreboard
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Create the players table
create table if not exists players (
  id bigint generated always as identity primary key,
  location_id text not null check (location_id in ('A', 'B', 'C')),
  player_number int not null check (player_number between 1 and 50),
  name text not null,
  contact text not null,
  age int not null check (age between 5 and 99),
  score int check (score >= 0 and score <= 99999),
  created_at timestamptz default now(),
  score_updated_at timestamptz,
  deleted_at timestamptz,
  game_date date default current_date not null
);

-- Uniqueness only for active (non-deleted) rows
create unique index if not exists idx_players_unique_active
  on players (location_id, player_number, game_date)
  where deleted_at is null;

-- Create indexes for fast lookups
create index if not exists idx_players_location_date
  on players (location_id, game_date);

-- Enable Row Level Security
alter table players enable row level security;

-- Allow all operations for anonymous users (suitable for this non-sensitive game app)
create policy "Allow anonymous read"
  on players for select
  using (true);

create policy "Allow anonymous insert"
  on players for insert
  with check (true);

create policy "Allow anonymous update"
  on players for update
  using (true)
  with check (true);

create policy "Allow anonymous delete"
  on players for delete
  using (true);

-- Index for soft-delete filter
create index if not exists idx_players_active
  on players (location_id, game_date) where deleted_at is null;

-- Enable Realtime for this table
alter publication supabase_realtime add table players;

-- ============================================
-- If you already have the table and need to add
-- the deleted_at column + fix the constraint:
-- ============================================
-- alter table players add column if not exists deleted_at timestamptz;
-- alter table players drop constraint if exists players_location_id_player_number_game_date_key;
-- create unique index if not exists idx_players_unique_active on players (location_id, player_number, game_date) where deleted_at is null;
-- create index if not exists idx_players_active on players (location_id, game_date) where deleted_at is null;
