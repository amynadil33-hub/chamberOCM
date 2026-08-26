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

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-3'} noValidate>
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
  <footer className="mt-auto bg-brand-deep text-white">
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/70">
            {siteConfig.description}
          </p>
          <ul className="mt-6 space-y-3 text-[13px] text-white/70">
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
          <div className="mt-6 flex gap-3">
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
                className="rounded-md border border-white/15 p-2 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="rounded text-[13px] text-white/75 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="lg:col-span-3">
          <h3 className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Business bulletin
          </h3>
          <p className="mb-4 text-[13px] text-white/70">
            Policy updates, event invitations and member notices.
          </p>
          <div className="rounded-lg bg-white p-4 text-ink">
            <NewsletterForm compact />
          </div>
        </div>
      </div>
    </Container>

    <div className="border-t border-white/10">
      <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
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
