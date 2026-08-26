import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Handshake, Mail, MapPin, Phone, Search } from 'lucide-react';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  EmptyState,
  FieldError,
  FieldLabel,
  PageHeader,
  SectionHeading,
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { toast } from '@/components/ui/use-toast';
import { dataProvider } from '@/lib/data/provider';
import { siteConfig } from '@/lib/config';
import { formatDate } from '@/lib/utils/format';

const CRM_ENDPOINT = 'https://famous.ai/api/crm/6a78b6e4f54643f61c865c39/subscribe';

export const PartnersPage: React.FC = () => {
  usePageMeta('Partners', 'Patron and strategic partners of the chamber.');
  const { data: partners = [] } = useQuery({ queryKey: ['partners'], queryFn: () => dataProvider.partners() });
  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="Partners & Supporters"
        description="The chamber works with patron members, strategic partners, development institutions and international chambers."
        breadcrumbs={[{ label: 'Partners' }]}
      />
      <Container className="py-14">
        <DemoNotice className="mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id} className="p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-brand-light text-brand">
                <Handshake className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[16px] font-semibold text-ink">{partner.name}</h2>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {partner.partner_type}
              </p>
              <p className="mt-3 text-[13px] text-ink-soft">
                Placeholder partner record. No third-party logo is displayed until written permission is confirmed.
              </p>
            </Card>
          ))}
        </div>
        <Card className="mt-10 p-8">
          <h2 className="text-xl font-semibold text-ink">Become a partner</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Partnership supports chamber programmes, research and national business development. Contact the
            secretariat to discuss partnership opportunities.
          </p>
          <ButtonLink to="/contact" className="mt-5">
            Discuss partnership
          </ButtonLink>
        </Card>
      </Container>
    </>
  );
};

const departments = [
  'General enquiry',
  'Membership',
  'Events',
  'Policy & Advocacy',
  'MSME support',
  'Media',
  'Finance & invoicing',
];

export const ContactPage: React.FC = () => {
  usePageMeta('Contact', 'Contact the MCCI secretariat, membership, events or policy teams.');
  const [form, setForm] = useState({
    department: departments[0],
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy: false,
    smsOptIn: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.subject.trim()) next.subject = 'Enter a subject.';
    if (form.message.trim().length < 10) next.message = 'Please provide a little more detail.';
    if (!form.privacy) next.privacy = 'You must accept the privacy terms to submit this form.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await fetch(CRM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          phone: form.phone || undefined,
          sms_opt_in: form.smsOptIn === true,
          source: 'contact-form',
          tags: ['contact-form', form.department.toLowerCase().replace(/\s/g, '-')],
        }),
      });
    } catch {
      /* contact submission still recorded locally below */
    }
    await dataProvider.createInquiry({
      department: form.department,
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      privacy_accepted: true,
    });
    setLoading(false);
    setSent(true);
    toast({ title: 'Message sent', description: 'The chamber secretariat has received your enquiry.' });
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact the Chamber"
        description="Reach the secretariat, membership team, events unit or policy department."
        breadcrumbs={[{ label: 'Contact' }]}
      />
      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card className="p-7">
              <h2 className="text-xl font-semibold text-ink">Send a message</h2>
              {sent ? (
                <div className="mt-5 rounded-md border border-chamber-green/30 bg-chamber-green-light p-5">
                  <h3 className="text-[16px] font-semibold text-chamber-green-dark">Thank you — message received</h3>
                  <p className="mt-1.5 text-[14px] text-chamber-green-dark/90">
                    Your enquiry has been logged for the {form.department} team. In production a confirmation
                    email would be sent to {form.email}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-4 rounded-md border border-chamber-green/40 px-4 py-2 text-[13px] font-semibold text-chamber-green-dark hover:bg-white"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
                  <div>
                    <FieldLabel htmlFor="c-dept" required>Department</FieldLabel>
                    <select
                      id="c-dept"
                      className={inputClass}
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    >
                      {departments.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="c-name" required>Full name</FieldLabel>
                      <input id="c-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name)} />
                      <FieldError message={errors.name} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="c-company">Company</FieldLabel>
                      <input id="c-company" className={inputClass} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="c-email" required>Email address</FieldLabel>
                      <input id="c-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(errors.email)} />
                      <FieldError message={errors.email} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="c-phone">Phone number (optional)</FieldLabel>
                      <input id="c-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+960 000 0000" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel htmlFor="c-subject" required>Subject</FieldLabel>
                    <input id="c-subject" className={inputClass} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} aria-invalid={Boolean(errors.subject)} />
                    <FieldError message={errors.subject} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="c-message" required>Message</FieldLabel>
                    <textarea
                      id="c-message"
                      rows={5}
                      className={inputClass}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      aria-invalid={Boolean(errors.message)}
                    />
                    <FieldError message={errors.message} />
                  </div>
                  <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                    <input
                      type="checkbox"
                      checked={form.smsOptIn}
                      onChange={(e) => setForm({ ...form, smsOptIn: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand"
                    />
                    <span>Text me updates. Msg &amp; data rates may apply. Reply STOP to unsubscribe.</span>
                  </label>
                  <div>
                    <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                      <input
                        type="checkbox"
                        checked={form.privacy}
                        onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand"
                        aria-invalid={Boolean(errors.privacy)}
                      />
                      <span>
                        I accept the <Link to="/privacy" className="text-brand underline">privacy policy</Link> and consent to the chamber storing this enquiry.
                      </span>
                    </label>
                    <FieldError message={errors.privacy} />
                  </div>
                  <Button type="submit" loading={loading}>Send message</Button>
                </form>
              )}
            </Card>
          </div>
          <aside className="space-y-4 lg:col-span-5">
            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Chamber office</h2>
              <ul className="mt-4 space-y-3 text-[14px] text-ink-soft">
                <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />{siteConfig.address}</li>
                <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />{siteConfig.phone}</li>
                <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />{siteConfig.officeHours}</li>
              </ul>
              <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-wider text-ink-muted">Direct email</h3>
              <ul className="mt-3 space-y-2 text-[14px]">
                {[
                  ['General', siteConfig.generalEmail],
                  ['Membership', siteConfig.membershipEmail],
                  ['Events', siteConfig.eventsEmail],
                  ['Policy', siteConfig.policyEmail],
                ].map(([label, email]) => (
                  <li key={label} className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                    <span className="text-ink-muted">{label}:</span>
                    <a href={`mailto:${email}`} className="text-brand hover:underline">{email}</a>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="overflow-hidden">
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-brand-deep to-brand text-center">
                <div>
                  <MapPin className="mx-auto h-8 w-8 text-white/70" aria-hidden="true" />
                  <p className="mt-2 text-[13px] text-white/80">Map placeholder</p>
                  <p className="text-[11px] text-white/60">Office location to be confirmed</p>
                </div>
              </div>
            </Card>
            <DemoNotice />
          </aside>
        </div>
      </Container>
    </>
  );
};

export const SearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [term, setTerm] = useState(q);
  usePageMeta('Search', 'Search the MCCI website.');
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => dataProvider.search(q),
  });

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="Search the chamber website"
        description="Search across pages, councils, news, events, publications, policy items, MSME programmes and the member directory."
        breadcrumbs={[{ label: 'Search' }]}
      />
      <Container className="py-14">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParams({ q: term });
          }}
          role="search"
          className="mb-8 flex max-w-2xl gap-2"
        >
          <label htmlFor="search-input" className="sr-only">Search</label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input id="search-input" value={term} onChange={(e) => setTerm(e.target.value)} className={`${inputClass} pl-9`} placeholder="Search the site" />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {q && (
          <p className="mb-5 text-[14px] text-ink-soft" role="status" aria-live="polite">
            {isLoading ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”`}
          </p>
        )}

        {q && !isLoading && results.length === 0 ? (
          <EmptyState title="No results found" description="Try a different keyword or browse the main sections." action={<ButtonLink to="/" variant="outline">Return home</ButtonLink>} />
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <Card key={`${result.type}-${result.title}`} className="p-5 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Badge status="info" label={result.type} />
                  {result.date && (
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {formatDate(result.date)}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-[16px] font-semibold text-ink">
                  <Link to={result.route} className="hover:text-brand">{result.title}</Link>
                </h2>
                <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">{result.excerpt}</p>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

const LegalPage: React.FC<{ title: string; crumb: string; sections: { heading: string; body: string }[] }> = ({
  title,
  crumb,
  sections,
}) => {
  usePageMeta(title, `${title} for the MCCI digital platform.`);
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} breadcrumbs={[{ label: crumb }]} />
      <Container className="py-14">
        <div className="max-w-3xl">
          <DemoNotice className="mb-8" />
          {sections.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{section.body}</p>
            </section>
          ))}
          <p className="text-[13px] text-ink-muted">
            This text is placeholder content. Final legal wording must be approved by the chamber before launch.
          </p>
        </div>
      </Container>
    </>
  );
};

export const PrivacyPage: React.FC = () => (
  <LegalPage
    title="Privacy Policy"
    crumb="Privacy"
    sections={[
      { heading: 'Information we collect', body: 'The chamber collects information provided through membership applications, event registrations, enquiry forms and newsletter subscriptions.' },
      { heading: 'How information is used', body: 'Information is used to process membership, deliver services, communicate chamber activity and meet legal obligations.' },
      { heading: 'Member documents', body: 'Documents uploaded during a membership application are stored privately and are accessible only to the applicant and authorised chamber staff.' },
      { heading: 'Public directory information', body: 'Only fields marked as public by a member organisation are displayed in the public member directory.' },
      { heading: 'Your rights', body: 'Members may request access to, correction of, or deletion of their information by contacting the secretariat.' },
    ]}
  />
);

export const TermsPage: React.FC = () => (
  <LegalPage
    title="Terms of Use"
    crumb="Terms"
    sections={[
      { heading: 'Use of this website', body: 'This website is provided for information about the chamber, its members and its services.' },
      { heading: 'Membership applications', body: 'Submitting an application does not guarantee membership. All applications are subject to review and approval.' },
      { heading: 'Accuracy of content', body: 'Content on this preview is demonstration material and does not represent verified chamber information.' },
      { heading: 'Intellectual property', body: 'The chamber name, emblem and published material remain the property of the chamber.' },
    ]}
  />
);

export const AccessibilityPage: React.FC = () => (
  <LegalPage
    title="Accessibility Statement"
    crumb="Accessibility"
    sections={[
      { heading: 'Our commitment', body: 'The chamber aims to meet WCAG 2.1 AA standards across this platform, including keyboard navigation, visible focus states, semantic structure and sufficient colour contrast.' },
      { heading: 'Assistive technology', body: 'Interactive components include accessible names, roles and states. Icons are decorative and paired with text labels.' },
      { heading: 'Dhivehi language support', body: 'The platform is prepared for right-to-left Dhivehi content with Noto Sans Thaana. Translations will be published once officially approved.' },
      { heading: 'Feedback', body: 'If you encounter an accessibility barrier, contact the secretariat so it can be addressed.' },
    ]}
  />
);

export const NotFoundPage: React.FC = () => {
  usePageMeta('Page not found');
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-brand">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">This page could not be found</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          The page you requested does not exist or may have been moved. Use the links below to continue.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/">Return home</ButtonLink>
          <ButtonLink to="/search" variant="outline">Search the site</ButtonLink>
          <ButtonLink to="/contact" variant="ghost">Contact the chamber</ButtonLink>
        </div>
      </div>
    </Container>
  );
};

export const UnauthorizedPage: React.FC = () => {
  usePageMeta('Access denied');
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[#C2414B]">Access denied</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">You do not have permission to view this page</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Your account role does not include access to this area. If you believe this is an error, contact the
          chamber administrator.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/portal">Go to member portal</ButtonLink>
          <ButtonLink to="/" variant="outline">Return home</ButtonLink>
        </div>
      </div>
    </Container>
  );
};

export const MediaResourcesSection = SectionHeading;
