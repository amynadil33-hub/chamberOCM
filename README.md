# Maldives National Chamber of Commerce & Industry — Digital Platform

The official MCCI public website, digital membership application system, secure member
portal and role-based administration dashboard.

> **This preview runs on demonstration data.** Every name, figure, fee, document and
> organisation in the application is fictional placeholder content. Nothing in the
> preview is verified MCCI information and no person or company shown should be
> represented as an official office holder or member.

## 1. Purpose

A single institutional platform that lets the chamber:

- publish credible public information about its work, councils and policy positions;
- accept and review digital membership applications end-to-end;
- give members a secure portal for their organisation, documents, events and invoices;
- give staff a role-based administration dashboard for membership and content.

## 2. Main modules

| Module | Routes |
| --- | --- |
| Public site | `/`, `/about/*`, `/councils/*`, `/policy/*`, `/membership/*`, `/events/*`, `/news/*`, `/publications/*`, `/msme/*`, `/partners`, `/contact`, `/search` |
| Member directory | `/directory/members`, `/directory/members/:slug` |
| Authentication | `/auth/login`, `/auth/register`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/unauthorized` |
| Member portal | `/portal`, `/portal/profile`, `/portal/organization`, `/portal/application`, `/portal/documents`, `/portal/membership`, `/portal/events`, `/portal/payments`, `/portal/notices`, `/portal/security` |
| Administration | `/admin`, `/admin/applications`, `/admin/members`, `/admin/organizations`, `/admin/payments`, content managers, `/admin/users`, `/admin/settings`, `/admin/audit-log` |

## 3. Technology

React · TypeScript (strict typing) · React Router · Tailwind CSS · TanStack Query ·
Lucide React · date-fns · Recharts · Supabase JS (activated only when configured).

## 4. Running in mock mode

```bash
npm install
npm run dev
```

No environment variables, database or API key is required. Mock mode loads typed seed
data from `src/data/mockSeed.ts`, keeps edits in `localStorage` and shows an
unobtrusive “Demo data · mock mode” badge.

## 5. Demo login credentials (mock mode only)

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@mcci-demo.test` | `Demo-Admin-2026!` |
| Content editor | `editor@mcci-demo.test` | `Demo-Editor-2026!` |
| Member | `member@mcci-demo.test` | `Demo-Member-2026!` |

These are shown in a collapsible panel on the login screen **only** while mock mode is
active and must never be used in production.

## 6. How data mode works

`src/lib/config.ts` resolves the active mode:

- `VITE_DATA_MODE=mock` (default, and the fallback whenever Supabase variables are missing)
- `VITE_DATA_MODE=supabase` plus `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

`getDataProvider()` in `src/lib/data/provider.ts` returns the repository implementation.
Pages and features depend only on the typed `DataProvider` contract, so switching modes
requires no component changes.

## 7. Production build

```bash
npm run build
npm run preview
```

## 8. Security notice

- `SUPABASE_SERVICE_ROLE_KEY` is server-side only and is referenced solely by
  `scripts/create-demo-users.ts`. It must never be prefixed with `VITE_`.
- Member documents live in the private `member-documents` bucket and are only ever
  served through short-lived signed URLs.
- Role restrictions are enforced by Row Level Security as well as the interface.

## 9. Replacing the logo and content

- Logo: `LOGO_URL` in `src/lib/config.ts` (or copy the asset to `public/brand/mcci-logo.png`).
- Site copy, contact details and statistics: `siteConfig` in `src/lib/config.ts`.
- Seed content: `src/data/mockSeed.ts` (mock) and `supabase/seed.sql` (database).
- See `docs/CONTENT_REPLACEMENT_CHECKLIST.md` for the full pre-launch list.

## 10. Environment variables

Copy `.env.example` to `.env` and fill in the values you need. See
`docs/SUPABASE_SETUP.md` for the full connection procedure.
"# chamberOCM" 
