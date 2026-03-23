drop policy if exists "public_read_cars" on public.cars;
create policy "public_read_cars"
on public.cars
for select
to anon, authenticated
using (true);

drop policy if exists "admin_manage_cars" on public.cars;
create policy "admin_manage_cars"
on public.cars
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "admin_read_inquiries" on public.inquiries;
create policy "admin_read_inquiries"
on public.inquiries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "public_insert_inquiries" on public.inquiries;
create policy "public_insert_inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "admin_update_inquiries" on public.inquiries;
create policy "admin_update_inquiries"
on public.inquiries
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "admin_delete_inquiries" on public.inquiries;
create policy "admin_delete_inquiries"
on public.inquiries
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "admin_profile_read" on public.profiles;
create policy "admin_profile_read"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Subscribers policies
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
