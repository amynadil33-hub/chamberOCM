import { createClient } from '@supabase/supabase-js';

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

export const supabase = isDatabaseConfigured
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
export const PUBLIC_MEDIA_BUCKET = 'public-media';

/** Resolve either a complete URL/data URL or a path in the public media bucket. */
export function publicMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  if (!supabase) return path.startsWith('/') ? path : `/${path}`;
  return supabase.storage.from(PUBLIC_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Upload an editor-selected image. Demo mode uses a data URL so preview remains functional. */
export async function uploadPublicImage(
  file: File,
  collection: 'news' | 'publications',
  recordId: string,
  slot: 'hero' | 'content',
): Promise<{ path: string | null; error: string | null }> {
  if (!file.type.startsWith('image/')) return { path: null, error: 'Please choose an image file.' };
  if (file.size > 8 * 1024 * 1024) return { path: null, error: 'Images must be 8 MB or smaller.' };

  if (!supabase) {
    const path = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('The image could not be read.'));
      reader.readAsDataURL(file);
    }).catch(() => null);
    return path ? { path, error: null } : { path: null, error: 'The image could not be read.' };
  }

  const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
  const path = `${collection}/${recordId}/${slot}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(PUBLIC_MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  return error ? { path: null, error: error.message } : { path, error: null };
}

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
