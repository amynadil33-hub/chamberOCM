import { format, isAfter, parseISO } from 'date-fns';

export const formatDate = (value?: string, pattern = 'd MMM yyyy'): string => {
  if (!value) return '—';
  try {
    return format(parseISO(value), pattern);
  } catch {
    return '—';
  }
};

export const formatDateTime = (value?: string): string => formatDate(value, "d MMM yyyy 'at' HH:mm");

export const isUpcoming = (value: string): boolean => {
  try {
    return isAfter(parseISO(value), new Date());
  } catch {
    return false;
  }
};

export const formatCurrency = (amount: number, currency = 'MVR'): string =>
  `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const titleCase = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export type ToneKey = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export const statusTone = (status: string): ToneKey => {
  const s = status.toLowerCase();
  if (['active', 'approved', 'verified', 'paid', 'published', 'confirmed', 'resolved', 'attended'].includes(s))
    return 'success';
  if (['pending', 'submitted', 'under_review', 'issued', 'draft', 'scheduled', 'in_progress', 'uploaded', 'waitlisted'].includes(s))
    return 'warning';
  if (['rejected', 'overdue', 'cancelled', 'expired', 'suspended', 'failed', 'no_show'].includes(s))
    return 'danger';
  if (['more_information_required', 'archived', 'withdrawn', 'unverified'].includes(s)) return 'info';
  return 'neutral';
};

export const toneClasses: Record<ToneKey, string> = {
  neutral: 'bg-slate-100 text-ink-soft border-surface-border',
  success: 'bg-chamber-green-light text-chamber-green-dark border-chamber-green/30',
  warning: 'bg-amber-50 text-[#B7791F] border-amber-200',
  danger: 'bg-red-50 text-[#C2414B] border-red-200',
  info: 'bg-brand-light text-brand-dark border-brand/20',
};

/** Minimal, safe markdown to HTML-free React-friendly block parser. */
export interface MarkdownBlock {
  type: 'h2' | 'h3' | 'p' | 'li';
  text: string;
}

export function parseMarkdown(markdown: string): MarkdownBlock[] {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): MarkdownBlock => {
      if (line.startsWith('### ')) return { type: 'h3', text: line.slice(4) };
      if (line.startsWith('## ')) return { type: 'h2', text: line.slice(3) };
      if (line.startsWith('- ')) return { type: 'li', text: line.slice(2) };
      return { type: 'p', text: line };
    });
}

export const stripEmphasis = (text: string): string => text.replace(/[*_`]/g, '');
