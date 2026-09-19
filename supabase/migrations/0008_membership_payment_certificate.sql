-- Payment-gated membership activation and digital certificate details.
alter table public.membership_applications
  add column if not exists payment_status payment_status not null default 'pending',
  add column if not exists payment_reference text,
  add column if not exists paid_at timestamptz,
  add column if not exists member_number text,
  add column if not exists certificate_number text,
  add column if not exists certificate_issued_at timestamptz,
  add column if not exists timeline jsonb not null default '[]'::jsonb;

create unique index if not exists idx_applications_certificate_number
  on public.membership_applications(certificate_number)
  where certificate_number is not null;
