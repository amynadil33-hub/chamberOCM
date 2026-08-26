-- 0006_rls_and_grants.sql
-- Row Level Security. Helper functions are defined in the preceding migration.

alter table public.profiles                enable row level security;
alter table public.user_roles              enable row level security;
alter table public.organizations           enable row level security;
alter table public.organization_users      enable row level security;
alter table public.membership_applications enable row level security;
alter table public.application_documents   enable row level security;
alter table public.application_councils    enable row level security;
alter table public.memberships             enable row level security;
alter table public.membership_history      enable row level security;
alter table public.invoices                enable row level security;
alter table public.payments                enable row level security;
alter table public.event_registrations     enable row level security;
alter table public.contact_inquiries       enable row level security;
alter table public.newsletter_subscribers  enable row level security;
alter table public.member_notices          enable row level security;
alter table public.audit_logs              enable row level security;
alter table public.councils                enable row level security;
alter table public.council_initiatives     enable row level security;
alter table public.council_memberships     enable row level security;
alter table public.news_posts              enable row level security;
alter table public.news_categories         enable row level security;
alter table public.events                  enable row level security;
alter table public.publications            enable row level security;
alter table public.policy_items            enable row level security;
alter table public.policy_submissions      enable row level security;
alter table public.msme_programs           enable row level security;
alter table public.partners                enable row level security;
alter table public.sectors                 enable row level security;
alter table public.membership_tiers        enable row level security;
alter table public.site_pages              enable row level security;
alter table public.site_settings           enable row level security;

-- ------------------------- PUBLIC READ (anon + authenticated) ----------------
create policy "public read published councils" on public.councils
  for select using (status = 'published');
create policy "public read published initiatives" on public.council_initiatives
  for select using (status = 'published');
create policy "public read published news" on public.news_posts
  for select using (status = 'published' and (published_at is null or published_at <= now()));
create policy "public read news categories" on public.news_categories for select using (true);
create policy "public read published events" on public.events
  for select using (status = 'published');
create policy "public read published publications" on public.publications
  for select using (status = 'published');
create policy "public read published policy" on public.policy_items
  for select using (status = 'published');
create policy "public read published submissions" on public.policy_submissions
  for select using (status = 'published');
create policy "public read published msme" on public.msme_programs
  for select using (status = 'published');
create policy "public read active partners" on public.partners
  for select using (active = true);
create policy "public read sectors" on public.sectors for select using (active = true);
create policy "public read active tiers" on public.membership_tiers for select using (active = true);
create policy "public read published pages" on public.site_pages
  for select using (status = 'published');
create policy "public read public settings" on public.site_settings
  for select using (public = true);
create policy "public read directory organizations" on public.organizations
  for select using (directory_visible = true and verification_status = 'verified');

-- Anonymous submissions
create policy "anyone can submit an inquiry" on public.contact_inquiries
  for insert with check (privacy_accepted = true);
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);

-- ------------------------------ MEMBER ACCESS -------------------------------
create policy "own profile read"   on public.profiles for select using (id = auth.uid());
create policy "own profile update" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid());

create policy "own roles read" on public.user_roles for select using (user_id = auth.uid());

create policy "member reads linked organizations" on public.organizations
  for select using (public.is_organization_user(id));
create policy "member updates own organization" on public.organizations
  for update using (public.is_organization_user(id))
  with check (public.is_organization_user(id));

create policy "member reads own org links" on public.organization_users
  for select using (user_id = auth.uid() or public.can_manage_memberships());

create policy "member reads own applications" on public.membership_applications
  for select using (applicant_user_id = auth.uid() or public.can_manage_memberships());
create policy "member creates own application" on public.membership_applications
  for insert with check (applicant_user_id = auth.uid());
create policy "member updates editable application" on public.membership_applications
  for update using (
    applicant_user_id = auth.uid()
    and status in ('draft', 'more_information_required')
  )
  with check (applicant_user_id = auth.uid());

create policy "member reads own documents" on public.application_documents
  for select using (
    public.owns_membership_application(application_id) or public.can_manage_memberships()
  );
create policy "member uploads own documents" on public.application_documents
  for insert with check (public.owns_membership_application(application_id));

create policy "member reads application councils" on public.application_councils
  for select using (
    public.owns_membership_application(application_id) or public.can_manage_memberships()
  );
create policy "member writes application councils" on public.application_councils
  for insert with check (public.owns_membership_application(application_id));

create policy "member reads own membership" on public.memberships
  for select using (public.is_organization_user(organization_id) or public.can_manage_memberships());
create policy "member reads own invoices" on public.invoices
  for select using (public.is_organization_user(organization_id) or public.can_manage_memberships());
create policy "member reads own payments" on public.payments
  for select using (
    public.can_manage_memberships()
    or exists (
      select 1 from public.invoices i
      where i.id = payments.invoice_id and public.is_organization_user(i.organization_id)
    )
  );

create policy "member reads own registrations" on public.event_registrations
  for select using (user_id = auth.uid() or public.can_manage_memberships());
create policy "anyone can register for an event" on public.event_registrations
  for insert with check (true);

create policy "members read notices" on public.member_notices
  for select using (auth.role() = 'authenticated' and status = 'published');

-- ------------------------------ EDITOR ACCESS -------------------------------
-- Editors manage public content only. They never see member documents,
-- applications, invoices or payments.
create policy "editors manage councils"      on public.councils            for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage initiatives"   on public.council_initiatives for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage news"          on public.news_posts          for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage categories"    on public.news_categories     for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage events"        on public.events              for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage publications"  on public.publications        for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage policy"        on public.policy_items        for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage submissions"   on public.policy_submissions  for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage msme"          on public.msme_programs       for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage partners"      on public.partners            for all using (public.can_manage_content()) with check (public.can_manage_content());
create policy "editors manage pages"         on public.site_pages          for all using (public.can_manage_content()) with check (public.can_manage_content());

-- ------------------------------- ADMIN ACCESS -------------------------------
create policy "admins manage organizations"  on public.organizations           for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage org users"      on public.organization_users      for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage applications"   on public.membership_applications for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage documents"      on public.application_documents   for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage memberships"    on public.memberships             for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage history"        on public.membership_history      for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage invoices"       on public.invoices                for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage payments"       on public.payments                for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage registrations"  on public.event_registrations     for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage inquiries"      on public.contact_inquiries       for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage subscribers"    on public.newsletter_subscribers  for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage notices"        on public.member_notices          for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage tiers"          on public.membership_tiers        for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins manage sectors"        on public.sectors                 for all using (public.can_manage_memberships()) with check (public.can_manage_memberships());
create policy "admins read profiles"         on public.profiles                for select using (public.can_manage_memberships());

-- ---------------------------- SUPER ADMIN ACCESS ----------------------------
create policy "super admins manage roles" on public.user_roles
  for all using (public.has_app_role('super_admin')) with check (public.has_app_role('super_admin'));
create policy "super admins manage settings" on public.site_settings
  for all using (public.has_app_role('super_admin')) with check (public.has_app_role('super_admin'));
create policy "super admins read audit" on public.audit_logs
  for select using (public.has_app_role('super_admin'));
create policy "system writes audit" on public.audit_logs
  for insert with check (auth.role() = 'authenticated');

-- --------------------------------- GRANTS -----------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

-- Members may never change these organisation columns directly.
revoke update (verification_status, internal_notes, is_demo) on public.organizations from authenticated;
grant update (
  display_name, description, sector_id, registered_address, island, atoll,
  public_email, public_phone, website, logo_path, directory_visible
) on public.organizations to authenticated;

-- Members may never change their own review outcome.
revoke update (status, reviewed_at, reviewed_by, review_notes, rejection_reason)
  on public.membership_applications from authenticated;
