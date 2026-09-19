-- Public training programme partnership details and application intake fields.
alter type registration_status add value if not exists 'rejected';

alter table public.events
  add column if not exists partner_organization text,
  add column if not exists delivery_mode text,
  add column if not exists programme_reference text;

alter table public.event_registrations
  add column if not exists application_reference text,
  add column if not exists applicant_island text,
  add column if not exists applicant_organization text,
  add column if not exists employment_status text,
  add column if not exists experience_level text,
  add column if not exists motivation text,
  add column if not exists accessibility_requirements text,
  add column if not exists privacy_accepted boolean not null default false,
  add column if not exists review_note text,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists idx_event_registrations_application_reference
  on public.event_registrations(application_reference)
  where application_reference is not null;
