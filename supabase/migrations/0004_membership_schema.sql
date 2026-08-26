-- 0004_membership_schema.sql
-- Membership tiers, applications, documents, memberships, invoices, payments.

create table if not exists public.membership_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  annual_fee numeric(12,2) not null default 0,
  currency text not null default 'MVR',
  description text,
  benefits jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  display_order integer not null default 0,
  is_demo boolean not null default false
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  application_reference text not null unique,
  organization_id uuid references public.organizations(id) on delete set null,
  applicant_user_id uuid not null references auth.users(id) on delete cascade,
  tier_id uuid references public.membership_tiers(id) on delete set null,
  status application_status not null default 'draft',
  legal_business_name text,
  trading_name text,
  registration_number text,
  year_established integer,
  sector_id uuid references public.sectors(id) on delete set null,
  annual_turnover_range text,
  employee_count text,
  registered_address text,
  island text,
  atoll text,
  website text,
  contact_name text,
  contact_designation text,
  contact_email text,
  contact_mobile text,
  declaration_accepted boolean not null default false,
  privacy_accepted boolean not null default false,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  review_notes text,
  rejection_reason text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_applications_status on public.membership_applications(status);
create index if not exists idx_applications_user on public.membership_applications(applicant_user_id);

create table if not exists public.application_councils (
  application_id uuid not null references public.membership_applications(id) on delete cascade,
  council_id uuid not null references public.councils(id) on delete cascade,
  primary key (application_id, council_id)
);

create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.membership_applications(id) on delete cascade,
  document_type text not null,
  original_filename text not null,
  storage_path text not null,
  mime_type text not null,
  file_size bigint not null,
  status document_status not null default 'uploaded',
  review_notes text,
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz
);
create index if not exists idx_app_docs_application on public.application_documents(application_id);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tier_id uuid references public.membership_tiers(id) on delete set null,
  member_number text not null unique,
  status membership_status not null default 'pending',
  starts_at date,
  expires_at date,
  renewal_due_at date,
  approved_from_application_id uuid references public.membership_applications(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_memberships_org on public.memberships(organization_id);
create index if not exists idx_memberships_status on public.memberships(status, expires_at);

create table if not exists public.membership_history (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete cascade,
  previous_status membership_status,
  new_status membership_status not null,
  note text,
  changed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete set null,
  event_registration_id uuid references public.event_registrations(id) on delete set null,
  invoice_number text not null unique,
  description text,
  amount numeric(12,2) not null default 0,
  currency text not null default 'MVR',
  issued_at timestamptz,
  due_at timestamptz,
  status invoice_status not null default 'draft',
  payment_method text,
  notes text
);
create index if not exists idx_invoices_org on public.invoices(organization_id);
create index if not exists idx_invoices_status on public.invoices(status, due_at);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  currency text not null default 'MVR',
  provider text not null default 'manual',
  payment_status payment_status not null default 'pending',
  transaction_reference text,
  paid_at timestamptz,
  verified_by uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_payments_invoice on public.payments(invoice_id);
