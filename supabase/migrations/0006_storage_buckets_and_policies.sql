-- 0006_storage_buckets_and_policies.sql
-- Storage buckets and access policies.

insert into storage.buckets (id, name, public)
values
  ('public-media',       'public-media',       true),
  ('publications',       'publications',       true),
  ('organization-logos', 'organization-logos', true),
  ('member-documents',   'member-documents',   false)
on conflict (id) do nothing;

-- ----------------------------- PUBLIC BUCKETS -------------------------------
create policy "public media readable" on storage.objects
  for select using (bucket_id in ('public-media', 'publications', 'organization-logos'));

create policy "editors write public media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('public-media', 'publications') and public.can_manage_content());

create policy "editors update public media" on storage.objects
  for update to authenticated
  using (bucket_id in ('public-media', 'publications') and public.can_manage_content());

create policy "editors delete public media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('public-media', 'publications') and public.can_manage_content());

-- Organisation logos: a member may upload into their own organisation folder
-- (path shape: {organization_id}/{filename}).
create policy "org members upload logo" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'organization-logos'
    and (
      public.can_manage_memberships()
      or public.is_organization_user(((storage.foldername(name))[1])::uuid)
    )
  );

create policy "org members replace logo" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'organization-logos'
    and (
      public.can_manage_memberships()
      or public.is_organization_user(((storage.foldername(name))[1])::uuid)
    )
  );

-- --------------------- PRIVATE MEMBER DOCUMENTS BUCKET ----------------------
-- Path shape: {user_id}/{application_id}/{uuid}-{safe_filename}
-- Anonymous users have no access at all. Editors have no access.
create policy "applicant uploads own documents" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'member-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "applicant reads own documents" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'member-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.can_manage_memberships()
    )
  );

create policy "applicant replaces own documents" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'member-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "admins delete member documents" on storage.objects
  for delete to authenticated
  using (bucket_id = 'member-documents' and public.can_manage_memberships());

-- NOTE: private documents must only ever be served through short-lived signed
-- URLs generated server-side (createSignedUrl). Never expose a public URL.
