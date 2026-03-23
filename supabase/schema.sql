create extension if not exists "pgcrypto";

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  make text not null,
  model text not null,
  year int not null,
  price bigint not null,
  offer_price bigint default 0,
  status text not null default 'available',
  mileage text not null,
  transmission text not null,
  fuel_type text not null,
  body_type text not null,
  description text not null,
  location text not null,
  is_featured boolean default false,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references public.cars(id) on delete set null,
  phone text not null,
  message text not null,
  source text not null default 'whatsapp',
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.cars enable row level security;
alter table public.inquiries enable row level security;
alter table public.profiles enable row level security;
alter table public.subscribers enable row level security;
