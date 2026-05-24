-- =========================================================
-- Ruby Store — Supabase Schema
-- วิธีใช้: เปิด Supabase → SQL Editor → วาง → Run
-- =========================================================

-- Orders table
create table if not exists orders (
  id          uuid default gen_random_uuid() primary key,
  uid         text not null,           -- anonymous browser ID
  order_no    text not null unique,    -- e.g. RB240001
  name        text,
  phone       text,
  address     text,
  delivery    text,
  channel     text,                    -- 'wa' | 'msg'
  note        text default '',
  items       jsonb,                   -- cart items array
  total       integer,                 -- in THB
  status      text default 'pending',  -- pending | confirmed | completed | cancelled
  created_at  timestamptz default now()
);

-- Index for fast customer lookups
create index if not exists orders_uid_idx on orders (uid);
create index if not exists orders_created_idx on orders (created_at desc);

-- Row Level Security
alter table orders enable row level security;

-- Policy: anyone (anon) can INSERT new orders
create policy "anon_insert" on orders
  for insert to anon with check (true);

-- Policy: anyone can SELECT (filtered by uid in app code)
-- Note: for production, tighten this with proper auth
create policy "anon_select" on orders
  for select to anon using (true);

-- Policy: anyone can UPDATE status (admin uses service key in prod)
create policy "anon_update" on orders
  for update to anon using (true);
