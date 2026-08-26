# Authentication Setup

## Roles

| Role | Access |
| --- | --- |
| `member` | Member portal, own profile, linked organisations, own applications, documents, registrations, invoices, member notices |
| `editor` | Public content management (councils, news, events, publications, policy, MSME, partners). No member documents, no payments, no role management |
| `admin` | All operational administration: applications, organisations, memberships, documents, registrations, invoices, inquiries, content |
| `super_admin` | All admin capability plus user roles, site settings and the audit log |

Public registration always creates a `member` account. Editor, admin and super-admin
roles can only be granted by a super administrator.

## Mock mode

`src/lib/auth/AuthProvider.tsx` validates the three demonstration accounts, persists the
session in `localStorage`, exposes `useAuth()`, and provides `RequireAuth` and
`RequireRole` route guards. Demo credentials appear on the login screen only in mock mode.

## Supabase mode

1. Enable email/password sign-in and email confirmations.
2. Add the site URL and `<site>/auth/reset-password` as redirect URLs.
3. The `on_auth_user_created` trigger inserts a `profiles` row and assigns the `member`
   role using `raw_user_meta_data->>'full_name'`.
4. Organisation linkage happens on application approval or by administrator assignment.

## Route protection

- `RequireAuth` — redirects unauthenticated visitors to `/auth/login`, preserving the
  originally requested path.
- `RequireRole` — redirects users without the required role to `/auth/unauthorized`.
- Interface restrictions are never the only protection: the same rules are enforced by
  Row Level Security in `supabase/migrations/0005_rls_and_grants.sql`.
