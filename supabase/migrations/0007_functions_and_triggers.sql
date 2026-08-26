-- 0007_functions_and_triggers.sql
-- Helper functions, reference generators and triggers.
-- Apply BEFORE 0005_rls_and_grants.sql if you re-order migrations, because the
-- RLS policies reference these functions.

-- ------------------------------ ROLE HELPERS --------------------------------
create or replace function public.has_app_role(required_role app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role = required_role
  );
$$;

create or replace function public.has_any_app_role(required_roles app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role = any(required_roles)
  );
$$;

create or replace function public.can_manage_content()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_any_app_role(array['editor','admin','super_admin']::app_role[]);
$$;

create or replace function public.can_manage_memberships()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_any_app_role(array['admin','super_admin']::app_role[]);
$$;

create or replace function public.is_organization_user(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_users ou
    where ou.organization_id = target_organization_id
      and ou.user_id = auth.uid()
  );
$$;

create or replace function public.owns_membership_application(target_application_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.membership_applications ma
    where ma.id = target_application_id
      and ma.applicant_user_id = auth.uid()
  );
$$;

-- --------------------------- REFERENCE GENERATORS ---------------------------
create or replace function public.generate_application_reference()
returns text
language sql
volatile
as $$
  select 'MCCI-APP-' || to_char(now(), 'YYYY') || '-' ||
         lpad(((floor(random() * 9000) + 1000))::int::text, 4, '0');
$$;

create or replace function public.generate_member_number()
returns text
language sql
volatile
as $$
  select 'MCCI-' || to_char(now(), 'YYYY') || '-' ||
         lpad(((floor(random() * 9000) + 1000))::int::text, 4, '0');
$$;

create or replace function public.generate_invoice_number()
returns text
language sql
volatile
as $$
  select 'MCCI-INV-' || to_char(now(), 'YYYY') || '-' ||
         lpad(((floor(random() * 9000) + 1000))::int::text, 4, '0');
$$;

-- -------------------------------- TRIGGERS ----------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','organizations','councils','news_posts','events','publications',
    'policy_items','membership_applications','memberships','contact_inquiries'
  ] loop
    execute format(
      'drop trigger if exists trg_%1$s_updated_at on public.%1$s;
       create trigger trg_%1$s_updated_at before update on public.%1$s
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- New auth users receive a profile and the default member role.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'member')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
