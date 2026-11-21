-- CAREEM Global Services — leads management schema
-- Website forms insert leads (anon). Staff (authenticated + approved) manage them.

create schema if not exists private;
grant usage on schema private to authenticated, anon;

-- ---------- profiles (staff) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  email text,
  role text not null default 'pending' check (role in ('pending', 'staff', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ---------- leads ----------
create table public.leads (
  id bigint generated always as identity primary key,
  ref_code text unique,
  type text not null check (type in ('job', 'trip', 'employer', 'contact')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  assigned_to uuid references public.profiles (id) on delete set null,
  full_name text not null check (char_length(full_name) between 1 and 120),
  phone text not null check (char_length(phone) between 3 and 40),
  email text check (email is null or char_length(email) <= 160),
  country text check (country is null or char_length(country) <= 60),
  service text check (service is null or char_length(service) <= 80),
  message text check (message is null or char_length(message) <= 3000),
  lang text not null default 'sw' check (lang in ('sw', 'en')),
  source_page text check (source_page is null or char_length(source_page) <= 80),
  data jsonb not null default '{}'::jsonb check (octet_length(data::text) <= 30000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.leads enable row level security;
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_type_status_idx on public.leads (type, status);
create index leads_assigned_to_idx on public.leads (assigned_to);

-- ---------- activity / notes ----------
create table public.lead_activity (
  id bigint generated always as identity primary key,
  lead_id bigint not null references public.leads (id) on delete cascade,
  author uuid references public.profiles (id) on delete set null,
  kind text not null check (kind in ('created', 'note', 'status', 'assign', 'priority')),
  body text check (body is null or char_length(body) <= 3000),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.lead_activity enable row level security;
create index lead_activity_lead_idx on public.lead_activity (lead_id, created_at);
create index lead_activity_author_idx on public.lead_activity (author);

-- ---------- helpers (private schema, not exposed by the Data API) ----------
create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.active and p.role in ('staff', 'admin')
  );
$$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.active and p.role = 'admin'
  );
$$;
revoke execute on function private.is_staff(), private.is_admin() from public, anon;
grant execute on function private.is_staff(), private.is_admin() to authenticated;

-- new auth user -> pending profile
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function private.handle_new_user();

-- ref code + created activity
create or replace function private.lead_after_insert()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.leads set ref_code = 'CG-' || lpad(new.id::text, 5, '0') where id = new.id;
  insert into public.lead_activity (lead_id, kind, meta)
  values (new.id, 'created', jsonb_build_object('source', new.source_page));
  return null;
end;
$$;
create trigger leads_after_insert
  after insert on public.leads for each row execute function private.lead_after_insert();

-- log status / assignment / priority changes, keep updated_at
create or replace function private.lead_before_update()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  new.updated_at := now();
  new.ref_code := coalesce(old.ref_code, new.ref_code);
  if new.status is distinct from old.status then
    insert into public.lead_activity (lead_id, author, kind, meta)
    values (new.id, (select auth.uid()), 'status', jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  if new.assigned_to is distinct from old.assigned_to then
    insert into public.lead_activity (lead_id, author, kind, meta)
    values (new.id, (select auth.uid()), 'assign', jsonb_build_object('from', old.assigned_to, 'to', new.assigned_to));
  end if;
  if new.priority is distinct from old.priority then
    insert into public.lead_activity (lead_id, author, kind, meta)
    values (new.id, (select auth.uid()), 'priority', jsonb_build_object('from', old.priority, 'to', new.priority));
  end if;
  return new;
end;
$$;
create trigger leads_before_update
  before update on public.leads for each row execute function private.lead_before_update();

-- protect profile role/active from self-escalation
create or replace function private.profile_guard()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if (new.role is distinct from old.role or new.active is distinct from old.active
      or new.email is distinct from old.email)
     and (select auth.uid()) is not null and not private.is_admin() then
    raise exception 'Only an admin can change role, status or email';
  end if;
  if old.id = (select auth.uid()) and (new.role <> 'admin' or not new.active) and old.role = 'admin' then
    raise exception 'You cannot remove your own admin access';
  end if;
  return new;
end;
$$;
create trigger profiles_guard
  before update on public.profiles for each row execute function private.profile_guard();

revoke execute on function private.handle_new_user(), private.lead_after_insert(),
  private.lead_before_update(), private.profile_guard() from public, anon, authenticated;

-- ---------- grants (Data API) ----------
revoke all on public.leads, public.lead_activity, public.profiles from anon, authenticated;
grant insert (type, full_name, phone, email, country, service, message, lang, source_page, data)
  on public.leads to anon, authenticated;
grant select, update (status, priority, assigned_to), delete on public.leads to authenticated;
grant select, insert (lead_id, kind, body, author) on public.lead_activity to authenticated;
grant select, update (full_name, role, active) on public.profiles to authenticated;

-- ---------- policies ----------
create policy "website can submit leads" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and assigned_to is null and priority = 'normal');

create policy "staff read leads" on public.leads
  for select to authenticated using ((select private.is_staff()));
create policy "staff update leads" on public.leads
  for update to authenticated
  using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "admin delete leads" on public.leads
  for delete to authenticated using ((select private.is_admin()));

create policy "staff read activity" on public.lead_activity
  for select to authenticated using ((select private.is_staff()));
create policy "staff add notes" on public.lead_activity
  for insert to authenticated
  with check ((select private.is_staff()) and kind = 'note' and author = (select auth.uid()));

create policy "read own or staff reads all profiles" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.is_staff()));
create policy "update own name or admin updates" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

-- ---------- realtime: notify the admin app of new leads ----------
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;
