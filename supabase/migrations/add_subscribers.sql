create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

drop policy if exists "public_insert_subscribers" on public.subscribers;
create policy "public_insert_subscribers"
on public.subscribers
for insert
to anon, authenticated
with check (true);

drop policy if exists "admin_read_subscribers" on public.subscribers;
create policy "admin_read_subscribers"
on public.subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
