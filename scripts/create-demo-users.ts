/**
 * scripts/create-demo-users.ts
 *
 * MANUAL SCRIPT — run only from a trusted machine, never from the browser and
 * never as part of the build. It requires SUPABASE_SERVICE_ROLE_KEY, which must
 * NEVER be exposed to client code or prefixed with VITE_.
 *
 *   npx tsx scripts/create-demo-users.ts
 *
 * WARNING: the demo passwords below are public knowledge. They must never be
 * used in a production environment.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_ORGANIZATION_ID = '44444444-0000-4000-8000-000000000001'; // Atoll Digital Solutions (demo)

const demoUsers = [
  { email: 'admin@mcci-demo.test', password: 'Demo-Admin-2026!', full_name: 'Demo Administrator', role: 'admin' },
  { email: 'editor@mcci-demo.test', password: 'Demo-Editor-2026!', full_name: 'Demo Content Editor', role: 'editor' },
  { email: 'member@mcci-demo.test', password: 'Demo-Member-2026!', full_name: 'Demo Member User', role: 'member' },
] as const;

async function run(): Promise<void> {
  console.warn('\n⚠  Creating DEMONSTRATION accounts. Never use these credentials in production.\n');

  for (const user of demoUsers) {
    const { data, error } = await admin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name },
    });

    let userId = data?.user?.id;

    if (error) {
      if (!error.message.toLowerCase().includes('already')) {
        console.error(`✗ ${user.email}: ${error.message}`);
        continue;
      }
      const { data: list } = await admin.auth.admin.listUsers();
      userId = list?.users.find((u) => u.email === user.email)?.id;
      console.log(`• ${user.email} already exists — updating role.`);
    }

    if (!userId) {
      console.error(`✗ ${user.email}: could not resolve a user id.`);
      continue;
    }

    await admin.from('profiles').upsert({ id: userId, full_name: user.full_name });

    const { error: roleError } = await admin
      .from('user_roles')
      .upsert({ user_id: userId, role: user.role }, { onConflict: 'user_id,role' });

    if (roleError) {
      console.error(`✗ ${user.email}: role assignment failed — ${roleError.message}`);
      continue;
    }

    if (user.role === 'member') {
      const { error: linkError } = await admin.from('organization_users').upsert(
        {
          organization_id: DEMO_ORGANIZATION_ID,
          user_id: userId,
          relationship_role: 'primary_contact',
          is_primary: true,
        },
        { onConflict: 'organization_id,user_id' },
      );
      if (linkError) console.error(`✗ organisation link failed — ${linkError.message}`);
    }

    console.log(`✓ ${user.email} ready with role "${user.role}".`);
  }

  console.warn('\n⚠  Remove these demo accounts before the platform goes live.\n');
}

run().catch((error: unknown) => {
  console.error('Unexpected failure:', error);
  process.exit(1);
});
