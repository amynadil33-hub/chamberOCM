import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Database client.
 *
 * The client is only created when credentials are present. When they are not,
 * `supabase` is null and the application transparently falls back to mock mode
 * — the preview must never crash because environment variables are missing.
 */

type ViteEnv = Record<string, string | undefined>;

const env: ViteEnv =
  typeof import.meta !== 'undefined' && (import.meta as { env?: ViteEnv }).env
    ? ((import.meta as { env?: ViteEnv }).env as ViteEnv)
    : {};

const read = (key: string, fallback = ''): string => {
  const value = env[key];
  return value === undefined || value === null || value === '' ? fallback : value;
};

export const SUPABASE_URL = read('VITE_SUPABASE_URL');
export const SUPABASE_KEY =
  read('VITE_SUPABASE_PUBLISHABLE_KEY') || read('VITE_SUPABASE_ANON_KEY');
export const SUPABASE_SCHEMA = read('VITE_SUPABASE_SCHEMA', 'public');

export const isDatabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase: SupabaseClient | null = isDatabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'mcci.auth.session',
      },
      db: { schema: SUPABASE_SCHEMA },
    })
  : null;

/** Private bucket holding membership application documents. */
export const MEMBER_DOCUMENTS_BUCKET = 'member-documents';

/**
 * Creates a short-lived signed URL for a private member document.
 * Private documents are NEVER exposed through a public URL.
 */
export async function createDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds = 60,
): Promise<string | null> {
  if (!supabase || !storagePath) return null;
  const { data, error } = await supabase.storage
    .from(MEMBER_DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) {
    console.error('Signed URL error:', error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

/** Uploads a membership document to `{user_id}/{application_id}/{uuid}-{filename}`. */
export async function uploadMemberDocument(
  file: File,
  userId: string,
  applicationId: string,
): Promise<{ path: string | null; error: string | null }> {
  if (!supabase) return { path: null, error: 'Database is not configured.' };
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  const path = `${userId}/${applicationId}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage
    .from(MEMBER_DOCUMENTS_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) return { path: null, error: error.message };
  return { path, error: null };
}
