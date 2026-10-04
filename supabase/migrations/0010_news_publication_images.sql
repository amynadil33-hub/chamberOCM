-- Two editor-managed images for news and publication detail pages.
-- cover_image_path is the hero image; content_image_path appears in the article body.

alter table public.news_posts
  add column if not exists cover_image_alt text,
  add column if not exists cover_image_position text not null default 'center',
  add column if not exists content_image_path text,
  add column if not exists content_image_alt text,
  add column if not exists content_image_position text not null default 'center';

alter table public.publications
  add column if not exists cover_image_alt text,
  add column if not exists cover_image_position text not null default 'center',
  add column if not exists content_image_path text,
  add column if not exists content_image_alt text,
  add column if not exists content_image_position text not null default 'center';
