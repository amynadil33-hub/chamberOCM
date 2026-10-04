import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button, Container, FieldError, FieldLabel, Logo, inputClass } from '@/components/common/ui';
import { footerColumns } from '@/lib/navigation';
import { siteConfig } from '@/lib/config';
import { dataProvider } from '@/lib/data/provider';

export const NewsletterForm: React.FC<{ source?: string; compact?: boolean }> = ({
  source = 'footer-signup',
  compact,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await dataProvider.addSubscriber(email, name || undefined);
      toast({
        title: 'Subscription confirmed',
        description: 'You have been added to the MCCI business bulletin list.',
      });
      setName('');
      setEmail('');
    } catch {
      toast({
        title: 'Subscription could not be completed',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <label htmlFor={`nl-email-${source}`} className="sr-only">Email address</label>
          <input
            id={`nl-email-${source}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} min-w-0 flex-1 border-white/15 bg-white/10 text-white placeholder:text-white/45 focus:border-cyan-300`}
            placeholder="Email address"
            autoComplete="email"
            aria-invalid={Boolean(error)}
          />
          <Button type="submit" loading={loading} className="shrink-0 bg-white text-brand-deep hover:bg-cyan-50">
            Subscribe
          </Button>
        </div>
        <FieldError message={error} />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div>
        <FieldLabel htmlFor={`nl-name-${source}`}>Name</FieldLabel>
        <input
          id={`nl-name-${source}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Your name"
          autoComplete="name"
        />
      </div>
      <div>
        <FieldLabel htmlFor={`nl-email-${source}`} required>
          Email address
        </FieldLabel>
        <input
          id={`nl-email-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="name@company.mv"
          autoComplete="email"
          aria-invalid={Boolean(error)}
        />
        <FieldError message={error} />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Subscribe to the bulletin
      </Button>
    </form>
  );
};

const Footer: React.FC = () => (
  <footer className="relative mt-auto overflow-hidden bg-[#101F46] text-white">
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-chamber-green/10 blur-3xl" aria-hidden="true" />
    <Container className="relative py-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-white/65">
            {siteConfig.description}
          </p>
          <ul className="mt-5 space-y-2.5 text-[13px] text-white/65">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
              <span>{siteConfig.phone}</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
              <a className="underline-offset-2 hover:underline" href={`mailto:${siteConfig.generalEmail}`}>
                {siteConfig.generalEmail}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook' },
              { Icon: Linkedin, href: siteConfig.social.linkedin, label: 'LinkedIn' },
              { Icon: Youtube, href: siteConfig.social.youtube, label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`MCCI on ${label}`}
                className="rounded-full border border-white/15 p-2 text-white/65 transition-all hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4">
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="rounded text-[13px] text-white/65 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
            Business bulletin
          </h3>
          <p className="mb-4 max-w-md text-[13px] leading-relaxed text-white/65">
            Policy updates, event invitations and member notices.
          </p>
          <NewsletterForm compact />
          <p className="mt-3 text-[11px] text-white/40">Useful updates only. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </Container>

    <div className="border-t border-white/10">
      <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-white/50">
          © {new Date().getFullYear()} {siteConfig.legalName}. {siteConfig.registrationDetails}.
        </p>
        <nav aria-label="Legal" className="flex flex-wrap gap-5 text-[12px] text-white/60">
          <Link to="/privacy" className="hover:text-white">Privacy policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of use</Link>
          <Link to="/accessibility" className="hover:text-white">Accessibility</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </nav>
      </Container>
    </div>
  </footer>
);

export default Footer;
