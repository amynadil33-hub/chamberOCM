-- 0002_core_schema.sql
-- Identity, roles, sectors and organisations.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_path text,
  account_status account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'member',
  assigned_by uuid references auth.users(id),
  assigned_at timestamptz not null default now(),
  unique (user_id, role)
);
create index if not exists idx_user_roles_user on public.user_roles(user_id);

create table if not exists public.sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  active boolean not null default true,
  display_order integer not null default 0
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  display_name text not null,
  slug text not null unique,
  registration_number text,
  year_established integer,
  sector_id uuid references public.sectors(id) on delete set null,
  annual_turnover_range text,
  employee_count text,
  description text,
  registered_address text,
  island text,
  atoll text,
  public_email text,
  public_phone text,
  website text,
  logo_path text,
  directory_visible boolean not null default false,
  verification_status verification_status not null default 'unverified',
  internal_notes text,
  is_demo boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_org_sector on public.organizations(sector_id);
create index if not exists idx_org_directory on public.organizations(directory_visible, verification_status);
create index if not exists idx_org_name_trgm on public.organizations using gin (display_name gin_trgm_ops);

create table if not exists public.organization_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  relationship_role text not null default 'member',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index if not exists idx_org_users_user on public.organization_users(user_id);
