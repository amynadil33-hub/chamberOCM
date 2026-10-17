-- Give every public long-form article a hero image and an in-body image.

alter table public.events
  add column if not exists cover_image_alt text,
  add column if not exists cover_image_position text not null default 'center',
  add column if not exists content_image_path text,
  add column if not exists content_image_alt text,
  add column if not exists content_image_position text not null default 'center';

alter table public.policy_items
  add column if not exists cover_image_path text,
  add column if not exists cover_image_alt text,
  add column if not exists cover_image_position text not null default 'center',
  add column if not exists content_image_path text,
  add column if not exists content_image_alt text,
  add column if not exists content_image_position text not null default 'center';

alter table public.councils
  add column if not exists hero_image_alt text,
  add column if not exists hero_image_position text not null default 'center',
  add column if not exists content_image_path text,
  add column if not exists content_image_alt text,
  add column if not exists content_image_position text not null default 'center';
