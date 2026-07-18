-- Supabase Dashboard > SQL Editor > New query 에 붙여넣고 Run 하세요.
create extension if not exists pgcrypto;
create table if not exists public.trip_rooms(id uuid primary key default gen_random_uuid(),name text not null,created_at timestamptz not null default now());
create table if not exists public.trip_invites(trip_id uuid primary key references public.trip_rooms(id) on delete cascade,code_hash text unique not null);
create table if not exists public.trip_members(trip_id uuid references public.trip_rooms(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,joined_at timestamptz not null default now(),primary key(trip_id,user_id));
create table if not exists public.trip_state(trip_id uuid primary key references public.trip_rooms(id) on delete cascade,payload jsonb not null default '{}'::jsonb,updated_at timestamptz not null default now(),updated_by uuid default auth.uid());
alter table public.trip_rooms enable row level security;
alter table public.trip_invites enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_state enable row level security;
grant select on public.trip_rooms to authenticated;
grant select on public.trip_members to authenticated;
grant select,insert,update on public.trip_state to authenticated;
drop policy if exists "members read room" on public.trip_rooms;
create policy "members read room" on public.trip_rooms for select to authenticated using(exists(select 1 from public.trip_members m where m.trip_id=id and m.user_id=auth.uid()));
drop policy if exists "members read self membership" on public.trip_members;
create policy "members read self membership" on public.trip_members for select to authenticated using(user_id=auth.uid());
drop policy if exists "members read state" on public.trip_state;
create policy "members read state" on public.trip_state for select to authenticated using(exists(select 1 from public.trip_members m where m.trip_id=trip_state.trip_id and m.user_id=auth.uid()));
drop policy if exists "members insert state" on public.trip_state;
create policy "members insert state" on public.trip_state for insert to authenticated with check(exists(select 1 from public.trip_members m where m.trip_id=trip_state.trip_id and m.user_id=auth.uid()));
drop policy if exists "members update state" on public.trip_state;
create policy "members update state" on public.trip_state for update to authenticated using(exists(select 1 from public.trip_members m where m.trip_id=trip_state.trip_id and m.user_id=auth.uid())) with check(exists(select 1 from public.trip_members m where m.trip_id=trip_state.trip_id and m.user_id=auth.uid()));
create or replace function public.join_trip(p_code text) returns uuid language plpgsql security definer set search_path=public,extensions,pg_temp as $$
declare v_trip uuid;
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  select trip_id into v_trip from public.trip_invites where code_hash=encode(extensions.digest(upper(trim(p_code)),'sha256'),'hex');
  if v_trip is null then return null; end if;
  insert into public.trip_members(trip_id,user_id) values(v_trip,auth.uid()) on conflict do nothing;
  return v_trip;
end $$;
revoke all on function public.join_trip(text) from public,anon;
grant execute on function public.join_trip(text) to authenticated;
do $$ declare v_trip uuid;
begin
  select trip_id into v_trip from public.trip_invites where code_hash=encode(extensions.digest('KANSAI26','sha256'),'hex');
  if v_trip is null then
    insert into public.trip_rooms(name) values('우리 가족 간사이 여행') returning id into v_trip;
    insert into public.trip_invites(trip_id,code_hash) values(v_trip,encode(extensions.digest('KANSAI26','sha256'),'hex'));
  end if;
end $$;
do $$ begin alter publication supabase_realtime add table public.trip_state; exception when duplicate_object then null; end $$;
