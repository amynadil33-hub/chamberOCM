import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Inbox, Loader2 } from 'lucide-react';
import { LOGO_URL, siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { parseMarkdown, statusTone, stripEmphasis, titleCase, toneClasses } from '@/lib/utils/format';

export const Logo: React.FC<{ className?: string; showText?: boolean; variant?: 'light' | 'dark' }> = ({
  className,
  showText = true,
  variant = 'dark',
}) => (
  <span className={cn('flex items-center gap-3', className)}>
    <img
      src={LOGO_URL}
      alt="Maldives National Chamber of Commerce & Industry logo"
      className="h-11 w-auto rounded-sm object-contain"
      width={405}
      height={341}
    />
    {showText && (
      <span className="hidden leading-tight sm:block">
        <span
          className={cn(
            'block text-[13px] font-semibold uppercase tracking-[0.08em]',
            variant === 'light' ? 'text-white' : 'text-brand-deep',
          )}
        >
          Maldives National Chamber
        </span>
        <span
          className={cn(
            'block text-[11px] uppercase tracking-[0.16em]',
            variant === 'light' ? 'text-white/70' : 'text-ink-muted',
          )}
        >
          of Commerce &amp; Industry
        </span>
      </span>
    )}
  </span>
);

export const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;

export const Badge: React.FC<{ status?: string; label?: string; className?: string }> = ({
  status,
  label,
  className,
}) => {
  const tone = statusTone(status ?? 'neutral');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        toneClasses[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label ?? titleCase(status ?? '')}
    </span>
  );
};

export const DemoBadge: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#B7791F]',
      className,
    )}
    title="Demonstration content — not verified MCCI information"
  >
    Demo data
  </span>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      'rounded-lg border border-surface-border bg-white shadow-[0_1px_2px_rgba(23,32,51,0.04)] transition-all duration-200',
      className,
    )}
  >
    {children}
  </div>
);

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ eyebrow, title, description, action, className }) => (
  <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const PageHeader: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  children?: React.ReactNode;
}> = ({ eyebrow, title, description, breadcrumbs, children }) => (
  <header className="border-b border-brand-dark/40 bg-gradient-to-br from-brand-deep via-brand-dark to-brand text-white">
    <Container className="py-10 sm:py-14">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1 text-[13px] text-white/70">
            <li>
              <Link to="/" className="rounded hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {crumb.to ? (
                  <Link to={crumb.to} className="rounded hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && (
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-[40px]">{title}</h1>
      {description && (
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-white/80">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </Container>
  </header>
);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-chamber-green text-white hover:bg-chamber-green-dark',
  outline: 'border border-surface-border bg-white text-brand-deep hover:border-brand hover:bg-brand-light',
  ghost: 'text-brand-deep hover:bg-brand-light',
  danger: 'bg-[#C2414B] text-white hover:bg-[#a5343d]',
};

export const buttonClass = (variant: ButtonVariant = 'primary', className?: string): string =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    buttonStyles[variant],
    className,
  );

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }
> = ({ variant = 'primary', loading, className, children, disabled, ...rest }) => (
  <button className={buttonClass(variant, className)} disabled={disabled || loading} {...rest}>
    {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
    {children}
  </button>
);

export const ButtonLink: React.FC<{
  to: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}> = ({ to, variant = 'primary', className, children }) => (
  <Link to={to} className={buttonClass(variant, className)}>
    {children}
  </Link>
);

export const EmptyState: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-surface-border bg-white px-6 py-14 text-center">
    <Inbox className="mb-3 h-8 w-8 text-ink-muted" aria-hidden="true" />
    <p className="text-base font-semibold text-ink">{title}</p>
    {description && <p className="mt-1 max-w-md text-sm text-ink-soft">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const SkeletonList: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-3" aria-hidden="true">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-24 animate-pulse rounded-lg border border-surface-border bg-white" />
    ))}
  </div>
);

export const Markdown: React.FC<{ content: string; className?: string }> = ({ content, className }) => {
  const blocks = parseMarkdown(content);
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      out.push(
        <ul key={key} className="my-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
          {bullets.map((b, i) => (
            <li key={i}>{stripEmphasis(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  blocks.forEach((block, index) => {
    if (block.type === 'li') {
      bullets.push(block.text);
      return;
    }
    flush(`ul-${index}`);
    if (block.type === 'h2')
      out.push(
        <h2 key={index} className="mt-8 text-xl font-semibold text-ink">
          {stripEmphasis(block.text)}
        </h2>,
      );
    else if (block.type === 'h3')
      out.push(
        <h3 key={index} className="mt-6 text-lg font-semibold text-ink">
          {stripEmphasis(block.text)}
        </h3>,
      );
    else
      out.push(
        <p key={index} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          {stripEmphasis(block.text)}
        </p>,
      );
  });
  flush('ul-final');

  return <div className={cn('max-w-3xl', className)}>{out}</div>;
};

export const StatBlock: React.FC<{ value: string; label: string; note?: string; light?: boolean }> = ({
  value,
  label,
  note,
  light,
}) => (
  <div
    className={cn(
      'rounded-lg border p-5',
      light ? 'border-white/15 bg-white/5' : 'border-surface-border bg-white',
    )}
  >
    <p className={cn('font-mono text-3xl font-semibold tabular-nums', light ? 'text-white' : 'text-brand-deep')}>
      {value}
    </p>
    <p className={cn('mt-1 text-sm font-medium', light ? 'text-white/80' : 'text-ink')}>{label}</p>
    {note && <p className={cn('mt-1 text-[11px]', light ? 'text-white/50' : 'text-ink-muted')}>{note}</p>}
  </div>
);

export const DemoNotice: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-[#7a5312]',
      className,
    )}
    role="note"
  >
    <strong className="font-semibold">Demonstration content.</strong> {siteConfig.footerText}
  </div>
);

export const FieldLabel: React.FC<{ htmlFor: string; children: React.ReactNode; required?: boolean }> = ({
  htmlFor,
  children,
  required,
}) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-ink">
    {children}
    {required && <span className="ml-1 text-[#C2414B]" aria-hidden="true">*</span>}
  </label>
);

export const inputClass =
  'w-full rounded-md border border-surface-border bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-muted transition-colors focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30';

export const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="mt-1.5 text-[12px] font-medium text-[#C2414B]" role="alert">
      {message}
    </p>
  ) : null;
