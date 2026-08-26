-- 0003_content_schema.sql
-- Public content: councils, news, events, publications, policy, MSME, partners.

create table if not exists public.councils (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  full_description_markdown text,
  icon_name text,
  hero_image_path text,
  chair_name text,
  chair_title text,
  contact_email text,
  member_count_display integer default 0,
  established_year integer,
  objectives jsonb not null default '[]'::jsonb,
  policy_priorities jsonb not null default '[]'::jsonb,
  status content_status not null default 'draft',
  display_order integer not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.council_memberships (
  id uuid primary key default gen_random_uuid(),
  council_id uuid not null references public.councils(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  council_role text default 'participant',
  status text default 'active',
  joined_at timestamptz not null default now(),
  unique (council_id, organization_id)
);

create table if not exists public.council_initiatives (
  id uuid primary key default gen_random_uuid(),
  council_id uuid not null references public.councils(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  body_markdown text,
  status content_status not null default 'draft',
  start_date date,
  end_date date,
  is_demo boolean not null default false,
  unique (council_id, slug)
);

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  display_order integer not null default 0
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.news_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  body_markdown text,
  cover_image_path text,
  author_user_id uuid references auth.users(id),
  author_display_name text,
  status content_status not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_news_status_date on public.news_posts(status, published_at desc);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  council_id uuid references public.councils(id) on delete set null,
  title text not null,
  slug text not null unique,
  event_type text not null default 'forum',
  summary text,
  description_markdown text,
  cover_image_path text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  island text,
  atoll text,
  online_url text,
  audience text,
  capacity integer default 0,
  fee numeric(12,2) not null default 0,
  currency text not null default 'MVR',
  registration_open boolean not null default true,
  registration_deadline timestamptz,
  member_only boolean not null default false,
  status content_status not null default 'draft',
  featured boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_events_start on public.events(starts_at);
create index if not exists idx_events_status on public.events(status);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  attendee_name text not null,
  attendee_email text not null,
  attendee_phone text,
  designation text,
  registration_status registration_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  registered_at timestamptz not null default now(),
  notes text
);
create index if not exists idx_registrations_event on public.event_registrations(event_id);
create index if not exists idx_registrations_user on public.event_registrations(user_id);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  publication_type text not null default 'research',
  summary text,
  description_markdown text,
  cover_image_path text,
  file_path text,
  page_count integer,
  published_at timestamptz,
  status content_status not null default 'draft',
  featured boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policy_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  reference_number text unique,
  summary text,
  body_markdown text,
  position_status text,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  supporting_file_path text,
  status content_status not null default 'draft',
  published_at timestamptz,
  featured boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policy_submissions (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique,
  title text not null,
  slug text not null unique,
  submitted_to text,
  submission_date date,
  response_status text,
  summary text,
  file_path text,
  status content_status not null default 'draft',
  is_demo boolean not null default false
);

create table if not exists public.msme_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  program_type text not null default 'training',
  provider text,
  summary text,
  description_markdown text,
  eligibility text,
  deadline date,
  application_url text,
  status content_status not null default 'draft',
  featured boolean not null default false,
  is_demo boolean not null default false
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  partner_type text,
  logo_path text,
  website text,
  display_order integer not null default 0,
  active boolean not null default true,
  is_demo boolean not null default false
);

create table if not exists public.member_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_markdown text,
  audience_type text not null default 'all_members',
  published_at timestamptz,
  expires_at timestamptz,
  status content_status not null default 'draft'
);

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  page_key text unique,
  body_markdown text,
  status content_status not null default 'draft',
  seo_title text,
  seo_description text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  public boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  name text not null,
  company text,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  privacy_accepted boolean not null default false,
  status text not null default 'new',
  assigned_to uuid references auth.users(id),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  last_name text,
  company text,
  interests jsonb not null default '[]'::jsonb,
  status text not null default 'subscribed',
  subscribed_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);
