import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  FileText,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  DemoNotice,
  EmptyState,
  FieldLabel,
  Markdown,
  inputClass,
} from '@/components/common/ui';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth/AuthProvider';
import { dataProvider } from '@/lib/data/provider';
import { atolls, membershipTiers, sectors } from '@/data/mockSeed';
import { formatCurrency, formatDate, formatFileSize, titleCase } from '@/lib/utils/format';

const PortalHeading: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-[26px] font-semibold text-ink">{title}</h1>
      {description && <p className="mt-1.5 max-w-2xl text-[14.5px] text-ink-soft">{description}</p>}
    </div>
    {action}
  </div>
);

const Metric: React.FC<{ label: string; value: string; tone?: string; note?: string }> = ({
  label,
  value,
  note,
}) => (
  <Card className="p-5">
    <p className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</p>
    <p className="mt-2 font-mono text-[22px] font-semibold tabular-nums text-brand-deep">{value}</p>
    {note && <p className="mt-1 text-[12px] text-ink-soft">{note}</p>}
  </Card>
);

export const PortalDashboard: React.FC = () => {
  const { user } = useAuth();
  const orgId = user?.organization_id;
  const { data: org } = useQuery({
    queryKey: ['org', orgId],
    queryFn: () => dataProvider.organizationById(orgId ?? ''),
    enabled: Boolean(orgId),
  });
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices', orgId],
    queryFn: () => dataProvider.invoices(orgId),
  });
  const { data: registrations = [] } = useQuery({
    queryKey: ['registrations', user?.id],
    queryFn: () => dataProvider.registrations(user?.id),
  });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const { data: notices = [] } = useQuery({ queryKey: ['notices'], queryFn: () => dataProvider.notices() });
  const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: () => dataProvider.applications() });

  const outstanding = invoices.find((i) => i.status === 'issued' || i.status === 'overdue');
  const tier = membershipTiers.find((t) => t.id === org?.tier_id);
  const myApplication = applications.find((a) => a.organization_id === orgId) ?? applications[0];

  return (
    <>
      <PortalHeading
        title={`Welcome, ${user?.full_name ?? 'member'}`}
        description="Your membership status, organisation profile and chamber services at a glance."
        action={<ButtonLink to="/portal/organization" variant="outline">Update organisation</ButtonLink>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Membership status" value={titleCase(org?.membership_status ?? 'pending')} note={tier ? `${tier.name} tier` : undefined} />
        <Metric label="Member number" value={org?.member_number ?? '—'} note="Issued on approval" />
        <Metric label="Renewal due" value="1 Feb 2027" note="Demo renewal date" />
        <Metric label="Profile completion" value="82%" note="Add a logo to reach 100%" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-[16px] font-semibold text-ink">Application status</h2>
          {myApplication ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] text-ink-soft">{myApplication.application_reference}</span>
                <Badge status={myApplication.status} />
              </div>
              <ol className="mt-5 space-y-4 border-l border-surface-border pl-5">
                {myApplication.timeline.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[23px] mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand" aria-hidden="true" />
                    <p className="text-[14px] font-semibold text-ink">{titleCase(entry.status)}</p>
                    <p className="text-[13px] text-ink-soft">{entry.note}</p>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {formatDate(entry.created_at)} · {entry.actor}
                    </p>
                  </li>
                ))}
              </ol>
              <ButtonLink to="/portal/application" variant="outline" className="mt-6">
                Open application
              </ButtonLink>
            </>
          ) : (
            <EmptyState
              title="No application yet"
              description="Start your membership application to join the chamber."
              action={<ButtonLink to="/portal/application">Start application</ButtonLink>}
            />
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold text-ink">Outstanding invoice</h2>
            </div>
            {outstanding ? (
              <div className="mt-3">
                <p className="font-mono text-[12px] text-ink-soft">{outstanding.invoice_number}</p>
                <p className="mt-1 font-mono text-[20px] font-semibold text-brand-deep">
                  {formatCurrency(outstanding.amount, outstanding.currency)}
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">Due {formatDate(outstanding.due_at)}</p>
                <div className="mt-3"><Badge status={outstanding.status} /></div>
                <ButtonLink to="/portal/payments" variant="outline" className="mt-4 w-full">
                  View payments
                </ButtonLink>
              </div>
            ) : (
              <p className="mt-2 text-[13.5px] text-ink-soft">No outstanding invoices.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold text-ink">Registered events</h2>
            </div>
            <ul className="mt-3 space-y-3">
              {registrations.slice(0, 3).map((registration) => {
                const event = events.find((e) => e.id === registration.event_id);
                return (
                  <li key={registration.id}>
                    <Link to={`/events/${event?.slug ?? ''}`} className="text-[14px] font-semibold text-ink hover:text-brand">
                      {event?.title ?? 'Event'}
                    </Link>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {formatDate(event?.starts_at)} · {titleCase(registration.registration_status)}
                    </p>
                  </li>
                );
              })}
              {registrations.length === 0 && <li className="text-[13.5px] text-ink-soft">No registrations yet.</li>}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-[16px] font-semibold text-ink">Latest member notices</h2>
        <ul className="mt-4 divide-y divide-surface-border">
          {notices.slice(0, 3).map((notice) => (
            <li key={notice.id} className="py-3">
              <p className="text-[14.5px] font-semibold text-ink">{notice.title}</p>
              <p className="mt-1 text-[13.5px] text-ink-soft">{notice.body_markdown}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {formatDate(notice.published_at)}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/portal/application', label: 'Membership application', icon: FileText },
          { to: '/portal/documents', label: 'Upload documents', icon: FileText },
          { to: '/events', label: 'Browse events', icon: CalendarDays },
          { to: '/portal/payments', label: 'Invoices & payments', icon: Receipt },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center justify-between rounded-lg border border-surface-border bg-white p-4 hover:border-brand hover:shadow-sm">
            <span className="flex items-center gap-2.5 text-[14px] font-semibold text-ink">
              <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
              {label}
            </span>
            <ArrowRight className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <DemoNotice className="mt-6" />
    </>
  );
};

export const PortalProfile: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.full_name ?? '', phone: '+960 000 0000', email: user?.email ?? '' });
  return (
    <>
      <PortalHeading title="My profile" description="Your personal contact details for chamber correspondence." />
      <Card className="max-w-2xl p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({ title: 'Profile updated', description: 'Your contact details have been saved.' });
          }}
          className="space-y-4"
        >
          <div>
            <FieldLabel htmlFor="p-name" required>Full name</FieldLabel>
            <input id="p-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <FieldLabel htmlFor="p-email">Email address</FieldLabel>
            <input id="p-email" className={`${inputClass} bg-surface-page`} value={form.email} readOnly aria-readonly="true" />
            <p className="mt-1 text-[12px] text-ink-muted">Email changes are handled by the chamber administrator.</p>
          </div>
          <div>
            <FieldLabel htmlFor="p-phone">Phone</FieldLabel>
            <input id="p-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <FieldLabel htmlFor="p-role">Account role</FieldLabel>
            <input id="p-role" className={`${inputClass} bg-surface-page font-mono`} value={user?.role ?? ''} readOnly aria-readonly="true" />
            <p className="mt-1 text-[12px] text-ink-muted">Roles can only be changed by a chamber super administrator.</p>
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </Card>
    </>
  );
};

export const PortalOrganization: React.FC = () => {
  const { user } = useAuth();
  const orgId = user?.organization_id ?? 'org-1';
  const { data: org, refetch } = useQuery({
    queryKey: ['org', orgId],
    queryFn: () => dataProvider.organizationById(orgId),
  });
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (org) {
      setForm({
        display_name: org.display_name,
        description: org.description,
        sector_id: org.sector_id,
        registered_address: org.registered_address,
        island: org.island,
        atoll: org.atoll,
        public_phone: org.public_phone ?? '',
        public_email: org.public_email ?? '',
        website: org.website ?? '',
        directory_visible: org.directory_visible,
      });
    }
  }, [org]);

  if (!org) return <EmptyState title="No organisation linked to this account" description="An organisation is linked once your membership application is approved." />;

  return (
    <>
      <PortalHeading
        title="Organisation profile"
        description="Update the information shown on your public directory listing. Protected fields are managed by the chamber."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              await dataProvider.updateOrganization(org.id, form as never, user?.full_name ?? 'Member');
              await refetch();
              setSaving(false);
              toast({ title: 'Organisation updated', description: 'Your public directory listing has been saved.' });
            }}
            className="space-y-4"
          >
            <div>
              <FieldLabel htmlFor="o-name" required>Display name</FieldLabel>
              <input id="o-name" className={inputClass} value={String(form.display_name ?? '')} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
            </div>
            <div>
              <FieldLabel htmlFor="o-desc">Description</FieldLabel>
              <textarea id="o-desc" rows={4} className={inputClass} value={String(form.description ?? '')} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="o-sector">Sector</FieldLabel>
                <select id="o-sector" className={inputClass} value={String(form.sector_id ?? '')} onChange={(e) => setForm({ ...form, sector_id: e.target.value })}>
                  {sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="o-atoll">Atoll</FieldLabel>
                <select id="o-atoll" className={inputClass} value={String(form.atoll ?? '')} onChange={(e) => setForm({ ...form, atoll: e.target.value })}>
                  {atolls.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="o-island">Island</FieldLabel>
                <input id="o-island" className={inputClass} value={String(form.island ?? '')} onChange={(e) => setForm({ ...form, island: e.target.value })} />
              </div>
              <div>
                <FieldLabel htmlFor="o-phone">Public phone</FieldLabel>
                <input id="o-phone" type="tel" className={inputClass} value={String(form.public_phone ?? '')} onChange={(e) => setForm({ ...form, public_phone: e.target.value })} />
              </div>
              <div>
                <FieldLabel htmlFor="o-email">Public email</FieldLabel>
                <input id="o-email" type="email" className={inputClass} value={String(form.public_email ?? '')} onChange={(e) => setForm({ ...form, public_email: e.target.value })} />
              </div>
              <div>
                <FieldLabel htmlFor="o-web">Website</FieldLabel>
                <input id="o-web" className={inputClass} value={String(form.website ?? '')} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="o-address">Registered address</FieldLabel>
              <input id="o-address" className={inputClass} value={String(form.registered_address ?? '')} onChange={(e) => setForm({ ...form, registered_address: e.target.value })} />
            </div>
            <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
              <input
                type="checkbox"
                checked={Boolean(form.directory_visible)}
                onChange={(e) => setForm({ ...form, directory_visible: e.target.checked })}
                className="h-4 w-4 rounded border-surface-border text-brand focus:ring-brand"
              />
              Show this organisation in the public member directory
            </label>
            <Button type="submit" loading={saving}>Save organisation profile</Button>
          </form>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="text-[15px] font-semibold text-ink">Managed by the chamber</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">These fields cannot be edited by members.</p>
          <dl className="mt-4 space-y-3 text-[14px]">
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Legal name</dt>
              <dd className="text-ink">{org.legal_name}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Registration number</dt>
              <dd className="font-mono text-ink">{org.registration_number}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Member number</dt>
              <dd className="font-mono text-ink">{org.member_number ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Verification</dt>
              <dd><Badge status={org.verification_status} /></dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Membership status</dt>
              <dd><Badge status={org.membership_status} /></dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
};

export const PortalDocuments: React.FC = () => {
  const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: () => dataProvider.applications() });
  const documents = applications.flatMap((a) => a.documents);
  return (
    <>
      <PortalHeading title="Documents" description="Documents submitted with your membership application." />
      {documents.length === 0 ? (
        <EmptyState title="No documents uploaded" description="Upload required documents from the application screen." action={<ButtonLink to="/portal/application">Open application</ButtonLink>} />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead className="border-b border-surface-border bg-surface-page text-[12px] uppercase tracking-wider text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Document type</th>
                <th scope="col" className="px-5 py-3 font-semibold">File</th>
                <th scope="col" className="px-5 py-3 font-semibold">Size</th>
                <th scope="col" className="px-5 py-3 font-semibold">Uploaded</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-5 py-3.5 font-medium text-ink">{doc.document_type}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{doc.original_filename}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatFileSize(doc.file_size)}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(doc.uploaded_at)}</td>
                  <td className="px-5 py-3.5"><Badge status={doc.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <p className="mt-4 text-[13px] text-ink-soft">
        Member documents are stored privately. In Supabase mode they are served through short-lived signed URLs
        and are never publicly accessible.
      </p>
    </>
  );
};

export const PortalMembership: React.FC = () => {
  const { user } = useAuth();
  const orgId = user?.organization_id ?? 'org-1';
  const { data: org } = useQuery({ queryKey: ['org', orgId], queryFn: () => dataProvider.organizationById(orgId) });
  const tier = membershipTiers.find((t) => t.id === org?.tier_id);
  return (
    <>
      <PortalHeading title="Membership" description="Your current membership category, status and renewal cycle." />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-chamber-green" aria-hidden="true" />
            <h2 className="text-[17px] font-semibold text-ink">{tier?.name ?? 'Membership'} member</h2>
          </div>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Member number</dt>
              <dd className="mt-1 font-mono text-[16px] text-brand-deep">{org?.member_number ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Status</dt>
              <dd className="mt-1"><Badge status={org?.membership_status ?? 'pending'} /></dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Annual subscription</dt>
              <dd className="mt-1 font-mono text-[16px] text-ink">{tier ? formatCurrency(tier.annual_fee, tier.currency) : '—'}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Renewal due</dt>
              <dd className="mt-1 font-mono text-[16px] text-ink">1 Feb 2027</dd>
            </div>
          </dl>
          {tier && (
            <>
              <h3 className="mt-8 text-[15px] font-semibold text-ink">Included benefits</h3>
              <ul className="mt-3 space-y-2 text-[14px] text-ink-soft">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-chamber-green" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
        <Card className="h-fit p-6">
          <h2 className="text-[15px] font-semibold text-ink">Upgrade or renew</h2>
          <p className="mt-2 text-[13.5px] text-ink-soft">
            Contact the membership team to change your tier or discuss renewal.
          </p>
          <ButtonLink to="/membership/tiers" variant="outline" className="mt-4 w-full">Compare tiers</ButtonLink>
          <ButtonLink to="/contact" variant="ghost" className="mt-2 w-full">Contact membership team</ButtonLink>
        </Card>
      </div>
    </>
  );
};

export const PortalEvents: React.FC = () => {
  const { user } = useAuth();
  const { data: registrations = [] } = useQuery({
    queryKey: ['registrations', user?.id],
    queryFn: () => dataProvider.registrations(user?.id),
  });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  return (
    <>
      <PortalHeading title="My events" description="Events you have registered for and your attendance status." action={<ButtonLink to="/events" variant="outline">Browse events</ButtonLink>} />
      {registrations.length === 0 ? (
        <EmptyState title="No event registrations yet" action={<ButtonLink to="/events">Browse events</ButtonLink>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {registrations.map((registration) => {
            const event = events.find((e) => e.id === registration.event_id);
            return (
              <Card key={registration.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[16px] font-semibold text-ink">
                    <Link to={`/events/${event?.slug ?? ''}`} className="hover:text-brand">{event?.title}</Link>
                  </h2>
                  <Badge status={registration.registration_status} />
                </div>
                <p className="mt-2 font-mono text-[12px] uppercase tracking-wider text-ink-muted">
                  {formatDate(event?.starts_at)} · {event?.venue}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3">
                  <span className="text-[13px] text-ink-soft">Payment</span>
                  <Badge status={registration.payment_status} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => toast({ title: 'Cancellation requested', description: 'The events team will confirm your cancellation.' })}
                >
                  Request cancellation
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export const PortalPayments: React.FC = () => {
  const { user } = useAuth();
  const orgId = user?.organization_id ?? 'org-1';
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices', orgId], queryFn: () => dataProvider.invoices(orgId) });
  const [reference, setReference] = useState('');

  return (
    <>
      <PortalHeading title="Invoices & payments" description="Membership and event invoices with manual bank transfer verification." />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead className="border-b border-surface-border bg-surface-page text-[12px] uppercase tracking-wider text-ink-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Invoice</th>
              <th scope="col" className="px-5 py-3 font-semibold">Description</th>
              <th scope="col" className="px-5 py-3 font-semibold">Amount</th>
              <th scope="col" className="px-5 py-3 font-semibold">Issued</th>
              <th scope="col" className="px-5 py-3 font-semibold">Due</th>
              <th scope="col" className="px-5 py-3 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3 font-semibold">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-5 py-3.5 font-mono text-[12px] text-brand-deep">{invoice.invoice_number}</td>
                <td className="px-5 py-3.5 text-ink">{invoice.description}</td>
                <td className="px-5 py-3.5 font-mono tabular-nums text-ink">{formatCurrency(invoice.amount, invoice.currency)}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(invoice.issued_at)}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(invoice.due_at)}</td>
                <td className="px-5 py-3.5"><Badge status={invoice.status} /></td>
                <td className="px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => window.alert('Receipt placeholder. Receipts are generated once payment is verified.')}
                    className="text-[13px] font-semibold text-brand hover:underline"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mt-6 max-w-2xl p-6">
        <h2 className="text-[16px] font-semibold text-ink">Submit a bank transfer reference</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-soft">
          After making a transfer, submit the reference so the membership team can verify your payment.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reference.trim()) return;
            toast({ title: 'Reference submitted', description: 'Your payment is now awaiting verification.' });
            setReference('');
          }}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1">
            <label htmlFor="pay-ref" className="sr-only">Transaction reference</label>
            <input id="pay-ref" className={inputClass} placeholder="Transaction reference" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <Button type="submit">Submit reference</Button>
        </form>
        <p className="mt-3 flex gap-2 text-[12.5px] text-ink-muted">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Bank account details are configured by the chamber administrator in site settings and are not shown here.
        </p>
      </Card>
    </>
  );
};

export const PortalNotices: React.FC = () => {
  const { data: notices = [] } = useQuery({ queryKey: ['notices'], queryFn: () => dataProvider.notices() });
  return (
    <>
      <PortalHeading title="Member notices" description="Official notices published to the membership." />
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={notice.status} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {formatDate(notice.published_at)}
              </span>
            </div>
            <h2 className="mt-2 text-[17px] font-semibold text-ink">{notice.title}</h2>
            <Markdown content={notice.body_markdown} />
          </Card>
        ))}
      </div>
    </>
  );
};

export const PortalSecurity: React.FC = () => (
  <>
    <PortalHeading title="Security" description="Manage your password and account security settings." />
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-[16px] font-semibold text-ink">Change password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({ title: 'Password updated', description: 'Mock mode: the change is simulated.' });
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <FieldLabel htmlFor="s-current" required>Current password</FieldLabel>
            <input id="s-current" type="password" className={inputClass} />
          </div>
          <div>
            <FieldLabel htmlFor="s-new" required>New password</FieldLabel>
            <input id="s-new" type="password" className={inputClass} />
          </div>
          <div>
            <FieldLabel htmlFor="s-confirm" required>Confirm new password</FieldLabel>
            <input id="s-confirm" type="password" className={inputClass} />
          </div>
          <Button type="submit">Update password</Button>
        </form>
      </Card>
      <Card className="h-fit p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-chamber-green" aria-hidden="true" />
          <h2 className="text-[16px] font-semibold text-ink">Account security</h2>
        </div>
        <ul className="mt-4 space-y-3 text-[14px] text-ink-soft">
          <li className="flex justify-between border-b border-surface-border pb-2">
            <span>Email verification</span>
            <Badge status="verified" />
          </li>
          <li className="flex justify-between border-b border-surface-border pb-2">
            <span>Session</span>
            <Badge status="active" />
          </li>
          <li className="flex justify-between">
            <span>Two-factor authentication</span>
            <Badge status="pending" label="Planned" />
          </li>
        </ul>
      </Card>
    </div>
  </>
);
