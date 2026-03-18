-- ============================================================
-- ChessMate — Local PostgreSQL Schema
-- Run: psql -h 192.168.8.23 -U postgres -d db_chessmate -f lib/supabase/schema.sql
-- ============================================================

-- ── Enable UUID extension ──
create extension if not exists "uuid-ossp";

-- ============================================================
-- AUTH SCHEMA (local only — Supabase provides this in production)
-- ============================================================
create schema if not exists auth;

create table if not exists auth.users (
  id                   uuid        primary key default uuid_generate_v4(),
  email                text        unique,
  raw_user_meta_data   jsonb       default '{}'::jsonb,
  created_at           timestamptz default now()
);

-- ============================================================
-- 1. USERS
-- Extends auth.users with public profile data
-- ============================================================
create table public.users (
  id          uuid        primary key references auth.users(id) on delete cascade,
  username    text        not null unique,
  avatar_url  text,
  elo_rating  int         not null default 1200,
  total_games int         not null default 0,
  wins        int         not null default 0,
  losses      int         not null default 0,
  draws       int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Username constraints
alter table public.users
  add constraint username_length check (char_length(username) between 3 and 20),
  add constraint username_format check (username ~ '^[a-zA-Z0-9_]+$');

-- ============================================================
-- 2. GAMES
-- ============================================================
create table public.games (
  id                    uuid        primary key default uuid_generate_v4(),
  room_code             text        not null unique,
  white_player_id       uuid        references public.users(id) on delete set null,
  black_player_id       uuid        references public.users(id) on delete set null,
  game_mode             text        not null default 'pvp'
                                    check (game_mode in ('pvp', 'pvc')),
  ai_difficulty         int         check (ai_difficulty between 1 and 20),
  status                text        not null default 'waiting'
                                    check (status in ('waiting', 'active', 'completed', 'abandoned')),
  result                text        check (result in ('white', 'black', 'draw', 'abandoned')),
  winner_id             uuid        references public.users(id) on delete set null,
  time_control          text        not null default '10+0',
  white_time_remaining  int         not null default 600000,
  black_time_remaining  int         not null default 600000,
  current_turn          text        not null default 'white'
                                    check (current_turn in ('white', 'black')),
  pgn                   text        not null default '',
  fen                   text        not null default 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  last_activity_at      timestamptz not null default now(),
  started_at            timestamptz,
  ended_at              timestamptz,
  created_at            timestamptz not null default now()
);

create index games_room_code_idx    on public.games(room_code);
create index games_white_player_idx on public.games(white_player_id);
create index games_black_player_idx on public.games(black_player_id);
create index games_status_idx       on public.games(status);

-- ============================================================
-- 3. MOVES
-- ============================================================
create table public.moves (
  id            uuid        primary key default uuid_generate_v4(),
  game_id       uuid        not null references public.games(id) on delete cascade,
  player_id     uuid        references public.users(id) on delete set null,
  move_number   int         not null,
  san           text        not null,
  fen_after     text        not null,
  time_spent_ms int         not null default 0,
  created_at    timestamptz not null default now()
);

create index moves_game_id_idx    on public.moves(game_id);
create index moves_game_order_idx on public.moves(game_id, move_number);

-- ============================================================
-- 4. CHAT MESSAGES
-- ============================================================
create table public.chat_messages (
  id          uuid        primary key default uuid_generate_v4(),
  game_id     uuid        not null references public.games(id) on delete cascade,
  sender_id   uuid        not null references public.users(id) on delete cascade,
  message     text        not null,
  created_at  timestamptz not null default now()
);

alter table public.chat_messages
  add constraint message_length check (char_length(message) between 1 and 200);

create index chat_messages_game_id_idx on public.chat_messages(game_id);

-- ============================================================
-- 5. ELO HISTORY
-- ============================================================
create table public.elo_history (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  game_id     uuid        references public.games(id) on delete set null,
  elo_before  int         not null,
  elo_after   int         not null,
  elo_change  int         not null,
  created_at  timestamptz not null default now()
);

create index elo_history_user_id_idx   on public.elo_history(user_id);
create index elo_history_user_date_idx on public.elo_history(user_id, created_at);

-- ============================================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================================

-- ── Auto-update updated_at on users ──
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- ── Auto-update last_activity_at on games ──
create or replace function public.handle_game_activity()
returns trigger as $$
begin
  new.last_activity_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_game_activity
  before update on public.games
  for each row execute procedure public.handle_game_activity();

-- ── Generate unique 6-char room code ──
create or replace function public.generate_room_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code  text := '';
  i     int;
begin
  for i in 1..6 loop
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return code;
end;
$$ language plpgsql;

-- ── Auto-create user profile on signup ──
-- NOTE: In production Supabase this trigger fires on auth.users insert
--       Locally we call this manually after creating an auth.users record
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 7. VIEWS
-- ============================================================

-- Leaderboard view
create or replace view public.leaderboard as
  select
    u.id,
    u.username,
    u.avatar_url,
    u.elo_rating,
    u.total_games,
    u.wins,
    u.losses,
    u.draws,
    case
      when u.total_games > 0
      then round((u.wins::numeric / u.total_games) * 100, 1)
      else 0
    end as win_rate,
    rank() over (order by u.elo_rating desc) as rank
  from public.users u
  where u.total_games >= 5
  order by u.elo_rating desc;

-- ============================================================
-- NOTE: Row Level Security (RLS) is skipped for local dev
-- It will be enabled when deploying to production Supabase
-- ============================================================