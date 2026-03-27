-- Run this in Supabase SQL Editor

create table if not exists restaurants (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  name text not null,
  cuisine_type text not null default 'American',
  location text not null default '',
  description text not null default '',
  created_at timestamptz default now()
);

create table if not exists menu_items (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  category text not null default 'Main',
  cost_price numeric(10,2) not null default 0,
  selling_price numeric(10,2) not null default 0,
  description text not null default '',
  is_popular boolean default false,
  created_at timestamptz default now()
);

create table if not exists analyses (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade,
  summary text not null,
  recommendations jsonb not null default '[]',
  total_items int not null default 0,
  avg_margin numeric(5,2) not null default 0,
  high_margin_count int not null default 0,
  low_margin_count int not null default 0,
  created_at timestamptz default now()
);

-- Enable RLS on all tables (service role key bypasses RLS, anon key cannot access anything)
alter table restaurants enable row level security;
alter table menu_items enable row level security;
alter table analyses enable row level security;

-- No public policies = anon key has ZERO access to any table
-- All app access goes through Next.js API routes using SUPABASE_SERVICE_ROLE_KEY
-- which automatically bypasses RLS. The app works exactly the same.
-- This blocks anyone who grabs the public anon key from DevTools.
