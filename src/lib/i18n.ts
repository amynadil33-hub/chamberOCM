/**
 * Central translation dictionary.
 *
 * English is the first complete language. Dhivehi keys are intentionally left
 * empty — official Thaana translations must be supplied and approved by the
 * MCCI secretariat before the language switch is enabled. Nothing here is
 * machine translated.
 */

export type Locale = 'en' | 'dv';

export interface LocaleConfig {
  code: Locale;
  label: string;
  dir: 'ltr' | 'rtl';
  fontClass: string;
  enabled: boolean;
}

export const locales: LocaleConfig[] = [
  { code: 'en', label: 'English', dir: 'ltr', fontClass: 'font-sans', enabled: true },
  { code: 'dv', label: 'ދިވެހި — Coming Soon', dir: 'rtl', fontClass: 'font-thaana', enabled: false },
];

export const defaultLocale: Locale = 'en';

type Dictionary = Record<string, string>;

const en: Dictionary = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.councils': 'Councils',
  'nav.policy': 'Policy & Advocacy',
  'nav.membership': 'Membership',
  'nav.events': 'Events',
  'nav.news': 'News & Media',
  'nav.msme': 'MSME Portal',
  'nav.contact': 'Contact',
  'action.join': 'Join MCCI',
  'action.login': 'Member login',
  'action.logout': 'Sign out',
  'action.search': 'Search',
  'action.apply': 'Apply for membership',
  'action.readMore': 'Read more',
  'hero.title': 'Advancing Maldivian Enterprise',
  'hero.subtitle':
    'Representing business, strengthening industries and building a more competitive Maldives.',
  'hero.primaryCta': 'Become a Member',
  'hero.secondaryCta': 'Explore MCCI',
  'portal.title': 'Member portal',
  'admin.title': 'Chamber administration',
  'form.required': 'This field is required.',
  'form.invalidEmail': 'Enter a valid email address.',
  'form.success': 'Your submission has been received.',
  'state.loading': 'Loading…',
  'state.empty': 'Nothing to show yet.',
  'demo.badge': 'Demo data',
  'demo.notice':
    'Demonstration content. All figures, names and documents require official verification before publication.',
};

// Dhivehi placeholders — populate with approved translations only.
const dv: Dictionary = Object.keys(en).reduce<Dictionary>((acc, key) => {
  acc[key] = '';
  return acc;
}, {});

export const dictionaries: Record<Locale, Dictionary> = { en, dv };

export function translate(key: string, locale: Locale = defaultLocale): string {
  const value = dictionaries[locale]?.[key];
  if (value) return value;
  return dictionaries.en[key] ?? key;
}

export function applyDocumentLocale(locale: Locale = defaultLocale): void {
  const config = locales.find((l) => l.code === locale) ?? locales[0];
  if (typeof document === 'undefined') return;
  document.documentElement.lang = config.code;
  document.documentElement.dir = config.dir;
}
