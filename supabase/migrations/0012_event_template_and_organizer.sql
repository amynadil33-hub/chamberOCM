-- Structured event template fields and a third organiser image.

alter table public.events
  add column if not exists organizer_name text,
  add column if not exists organizer_details text,
  add column if not exists organizer_image_path text,
  add column if not exists organizer_image_alt text;

-- Preserve existing partner names when upgrading older event records.
update public.events
set organizer_name = partner_organization
where organizer_name is null and partner_organization is not null;
