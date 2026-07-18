-- 참여코드 오류 수정용: Supabase SQL Editor에서 전체 실행하세요.
create extension if not exists pgcrypto;

create or replace function public.join_trip(p_code text) returns uuid
language plpgsql security definer set search_path=public,extensions,pg_temp as $$
declare v_trip uuid;
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  select trip_id into v_trip from public.trip_invites
  where code_hash=encode(extensions.digest(upper(trim(p_code)),'sha256'),'hex');
  if v_trip is null then return null; end if;
  insert into public.trip_members(trip_id,user_id) values(v_trip,auth.uid()) on conflict do nothing;
  return v_trip;
end $$;

revoke all on function public.join_trip(text) from public,anon;
grant execute on function public.join_trip(text) to authenticated;

do $$ declare v_trip uuid;
begin
  select trip_id into v_trip from public.trip_invites
  where code_hash=encode(extensions.digest('KANSAI26','sha256'),'hex');
  if v_trip is null then
    insert into public.trip_rooms(name) values('우리 가족 간사이 여행') returning id into v_trip;
    insert into public.trip_invites(trip_id,code_hash)
    values(v_trip,encode(extensions.digest('KANSAI26','sha256'),'hex'));
  end if;
end $$;
