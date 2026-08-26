# Deployment Checklist

## Before deploying
- [ ] `npm run build` completes without TypeScript errors
- [ ] All routes render, including 404 and unauthorized pages
- [ ] Mobile navigation, portal drawer and admin drawer all open and close
- [ ] Forms validate, show errors and confirm success
- [ ] No console errors when environment variables are absent

## Environment
- [ ] `.env` created from `.env.example`
- [ ] `VITE_DATA_MODE` set intentionally (`mock` for preview, `supabase` for production)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` present only in secure server tooling, never with a `VITE_` prefix
- [ ] `VITE_APP_URL` set to the production domain

## Database
- [ ] All migrations applied in order (functions before RLS)
- [ ] RLS enabled on every operational table
- [ ] Storage buckets created; `member-documents` is private
- [ ] Demo seed rows removed (`is_demo = true`)
- [ ] Demo auth accounts removed

## Content
- [ ] `docs/CONTENT_REPLACEMENT_CHECKLIST.md` fully completed
- [ ] Official logo in place and unmodified
- [ ] Legal, privacy and accessibility pages approved

## SEO and accessibility
- [ ] Unique page titles and descriptions on public pages
- [ ] `robots.txt` disallows `/portal` and `/admin`
- [ ] Keyboard navigation and visible focus verified
- [ ] Colour contrast verified at WCAG AA

## Post-launch
- [ ] Membership application submits and appears in the admin queue
- [ ] Approval issues a member number and activates membership
- [ ] Contact form and newsletter signup reach the CRM
- [ ] Invoices and manual payment verification behave as expected
