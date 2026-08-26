# Supabase Setup

The application runs fully in mock mode with no backend. Follow these steps only when
you are ready to connect a real Supabase project.

## 1. Create a Supabase project
Create a new project in the Supabase dashboard and choose a region close to the Maldives.

## 2. Copy the project URL and publishable key
Project settings → API. Copy the **Project URL** and the **publishable (anon) key**.

## 3. Add the environment variables
Copy `.env.example` to `.env` and set:

```
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<publishable key>"
```

Leave `VITE_DATA_MODE="mock"` for now.

## 4. Apply the migrations in order
Run the files in `supabase/migrations/` through the SQL editor or the Supabase CLI:

1. `0001_extensions_and_enums.sql`
2. `0002_core_schema.sql`
3. `0003_content_schema.sql`
4. `0004_membership_schema.sql`
5. `0005_functions_and_triggers.sql`
6. `0006_rls_and_grants.sql`
7. `0007_storage_buckets_and_policies.sql`

## 5. Run the seed file
Execute `supabase/seed.sql`. Every row is flagged `is_demo = true` so it can be removed
later with a targeted delete.

## 6. Verify the storage buckets
Confirm that `public-media`, `publications`, `organization-logos` (public) and
`member-documents` (private) exist and that `member-documents` is **not** public.

## 7. Verify RLS
Every operational table must show “RLS enabled”. Spot-check that an anonymous session
can read published news but cannot read `application_documents`, `invoices` or `payments`.

## 8. Configure authentication redirect URLs
Authentication → URL configuration. Add your site URL and
`<site>/auth/reset-password` as a redirect URL. Enable email confirmations.

## 9. Create the demo users (optional)
Only if you want demonstration accounts in the database:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/create-demo-users.ts
```

Never commit the service-role key and never run this script in production.

## 10. Switch data mode
Set `VITE_DATA_MODE="supabase"` and restart the dev server. If either Supabase variable
is missing the app falls back to mock mode and reports the problem rather than crashing.

## 11. Test member and admin access
- Sign in as a member: portal loads, admin routes redirect to `/auth/unauthorized`.
- Sign in as an editor: content managers load, membership screens are blocked.
- Sign in as an admin: application review, members, invoices and inquiries all load.

## 12. Remove demo data before launch
```sql
delete from public.organizations where is_demo;
delete from public.news_posts where is_demo;
delete from public.events where is_demo;
delete from public.publications where is_demo;
delete from public.policy_items where is_demo;
delete from public.policy_submissions where is_demo;
delete from public.msme_programs where is_demo;
delete from public.partners where is_demo;
delete from public.councils where is_demo;
delete from public.membership_tiers where is_demo;
```
Then work through `docs/CONTENT_REPLACEMENT_CHECKLIST.md`.
