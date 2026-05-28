-- =========================================================
-- Ruby Store — Supabase Schema
-- วิธีใช้: เปิด Supabase → SQL Editor → วาง → Run
-- =========================================================

-- Orders table
create table if not exists orders (
  id          uuid default gen_random_uuid() primary key,
  uid         text not null,
  order_no    text not null unique,
  name        text,
  phone       text,
  address     text,
  delivery    text,
  channel     text,
  note        text default '',
  items       jsonb,
  total       integer,
  status      text default 'pending',
  created_at  timestamptz default now()
);

create index if not exists orders_uid_idx     on orders (uid);
create index if not exists orders_created_idx on orders (created_at desc);

alter table orders enable row level security;
create policy "anon_insert"  on orders for insert to anon with check (true);
create policy "anon_select"  on orders for select to anon using (true);
create policy "anon_update"  on orders for update to anon using (true);

-- ─────────────────────────────────────────────────────────
-- Products table
-- ─────────────────────────────────────────────────────────
create table if not exists products (
  id          text primary key,
  name        text not null,
  price       integer not null,
  old_price   integer,
  store       text not null,
  cat         text,
  badge       text,
  bg          text default '#FFF5F5',
  emoji       text default '📦',
  img_url     text,
  description text,
  stock       integer default 0,
  variants    jsonb   default '[]'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Migration: add stock + variants to existing tables (safe to run multiple times)
alter table products add column if not exists stock    integer default 0;
alter table products add column if not exists variants jsonb   default '[]'::jsonb;

alter table products enable row level security;
create policy "anon_all_products" on products
  for all to anon using (true) with check (true);

-- ─────────────────────────────────────────────────────────
-- Settings table  (store names, logos, etc.)
-- ─────────────────────────────────────────────────────────
create table if not exists settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz default now()
);

alter table settings enable row level security;
create policy "anon_all_settings" on settings
  for all to anon using (true) with check (true);
