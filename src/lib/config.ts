/**
 * Central environment + site configuration.
 *
 * The application MUST run without any environment variables (mock mode).
 * Supabase mode is only activated when VITE_DATA_MODE === "supabase" AND the
 * required Supabase variables are present.
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

export type DataMode = 'mock' | 'database';

export interface EnvConfig {
  appName: string;
  appShortName: string;
  appUrl: string;
  dataMode: DataMode;
  supabaseUrl: string;
  supabasePublishableKey: string;
  emailMode: 'mock' | 'production';
  emailFrom: string;
  paymentProvider: 'manual' | 'stripe';
}

const requestedMode = read('VITE_DATA_MODE', 'mock').toLowerCase();
const supabaseUrl = read('VITE_SUPABASE_URL');
const supabaseKey = read('VITE_SUPABASE_PUBLISHABLE_KEY') || read('VITE_SUPABASE_ANON_KEY');

/** "database" and the legacy alias "supabase" both select database mode. */
const wantsDatabase = requestedMode === 'database' || requestedMode === 'supabase';

export const databaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const envConfig: EnvConfig = {
  appName: read('VITE_APP_NAME', 'Maldives National Chamber of Commerce & Industry'),
  appShortName: read('VITE_APP_SHORT_NAME', 'MCCI'),
  appUrl: read('VITE_APP_URL', typeof window !== 'undefined' ? window.location.origin : ''),
  dataMode: wantsDatabase && databaseConfigured ? 'database' : 'mock',
  supabaseUrl,
  supabasePublishableKey: supabaseKey,
  emailMode: read('VITE_EMAIL_MODE', 'mock') === 'production' ? 'production' : 'mock',
  emailFrom: read('VITE_EMAIL_FROM', 'no-reply@mcci-demo.test'),
  paymentProvider: read('VITE_PAYMENT_PROVIDER', 'manual') === 'stripe' ? 'stripe' : 'manual',
};

/** Human readable configuration problems (never throws, never blocks preview). */
export function validateEnvironment(): string[] {
  const issues: string[] = [];
  if (wantsDatabase && !databaseConfigured) {
    if (!supabaseUrl) issues.push('VITE_SUPABASE_URL is missing.');
    if (!supabaseKey) issues.push('VITE_SUPABASE_PUBLISHABLE_KEY is missing.');
    issues.push('Falling back to mock mode until the database variables are supplied.');
  }
  return issues;
}

export const isMockMode = envConfig.dataMode === 'mock';
export const isDatabaseMode = envConfig.dataMode === 'database';

export const LOGO_URL =
  'https://d64gsuwffb70l.cloudfront.net/6a77b4748b67a6596efda74a_1786295874394_8dca9a57.png';


export const siteConfig = {
  legalName: 'Maldives National Chamber of Commerce & Industry',
  shortName: 'MCCI',
  tagline: 'Advancing Maldivian Enterprise',
  description:
    'Representing business, strengthening industries and building a more competitive Maldives.',
  address: 'Office address to be confirmed, Malé, Republic of Maldives',
  phone: 'Telephone to be confirmed',
  generalEmail: 'info@mcci-demo.test',
  membershipEmail: 'membership@mcci-demo.test',
  eventsEmail: 'events@mcci-demo.test',
  policyEmail: 'policy@mcci-demo.test',
  officeHours: 'Sunday – Thursday, 09:00 – 16:00 (placeholder)',
  registrationDetails: 'Registration details to be confirmed',
  defaultSeoDescription:
    'The Maldives National Chamber of Commerce & Industry represents business, strengthens industries and advocates for a more competitive Maldivian economy.',
  social: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    x: 'https://x.com',
    youtube: 'https://youtube.com',
  },
  footerText:
    'This preview runs on demonstration content. All figures, names and documents require official verification before publication.',
  stats: [
    { label: 'Member businesses', value: '420+', note: 'Demo value — pending verification' },
    { label: 'Industry councils', value: '5', note: 'Demo value — pending verification' },
    { label: 'Atolls represented', value: '26', note: 'Demo value — pending verification' },
    { label: 'Years serving business', value: '30+', note: 'Demo value — pending verification' },
  ],
} as const;

export const DEMO_ACCOUNTS = [
  { role: 'Administrator', email: 'admin@mcci-demo.test', password: 'Demo-Admin-2026!' },
  { role: 'Content editor', email: 'editor@mcci-demo.test', password: 'Demo-Editor-2026!' },
  { role: 'Member', email: 'member@mcci-demo.test', password: 'Demo-Member-2026!' },
] as const;
