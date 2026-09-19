import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Image as ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  DemoNotice,
  EmptyState,
  FieldLabel,
  inputClass,
} from '@/components/common/ui';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth/AuthProvider';
import { dataProvider, type ContentCollection } from '@/lib/data/provider';
import { membershipTiers, sectors } from '@/data/mockSeed';
import { siteConfig } from '@/lib/config';
import { formatCurrency, formatDate, titleCase } from '@/lib/utils/format';

const AdminHeading: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
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

const TableShell: React.FC<{ headers: string[]; children: React.ReactNode; minWidth?: string }> = ({
  headers,
  children,
  minWidth = '820px',
}) => (
  <Card className="overflow-x-auto">
    <table className="w-full text-left text-[14px]" style={{ minWidth }}>
      <thead className="border-b border-surface-border bg-surface-page text-[12px] uppercase tracking-wider text-ink-muted">
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col" className="px-5 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-border">{children}</tbody>
    </table>
  </Card>
);

/* ------------------------------ MEMBERS / ORGS ----------------------------- */

export const AdminMembersPage: React.FC = () => {
  const { data: organizations = [] } = useQuery({ queryKey: ['organizations'], queryFn: () => dataProvider.organizations() });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const members = organizations
    .filter((o) => (status === 'all' ? true : o.membership_status === status))
    .filter((o) => o.display_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <AdminHeading title="Members" description="All member organisations, their tier, status and member number." />
      <Card className="mb-5 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="m-search">Search</FieldLabel>
            <input id="m-search" className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Member name" />
          </div>
          <div>
            <FieldLabel htmlFor="m-status">Membership status</FieldLabel>
            <select id="m-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              {['all', 'active', 'pending', 'suspended', 'expired', 'cancelled'].map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All statuses' : titleCase(s)}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
      <TableShell headers={['Member', 'Member number', 'Tier', 'Sector', 'Atoll', 'Status', 'Verification', '']}>
        {members.map((org) => (
          <tr key={org.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-medium text-ink">{org.display_name}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{org.member_number ?? '—'}</td>
            <td className="px-5 py-3.5 text-ink-soft">{membershipTiers.find((t) => t.id === org.tier_id)?.name ?? '—'}</td>
            <td className="px-5 py-3.5 text-ink-soft">{sectors.find((s) => s.id === org.sector_id)?.name}</td>
            <td className="px-5 py-3.5 text-ink-soft">{org.atoll}</td>
            <td className="px-5 py-3.5"><Badge status={org.membership_status} /></td>
            <td className="px-5 py-3.5"><Badge status={org.verification_status} /></td>
            <td className="px-5 py-3.5">
              <Link to={`/admin/members/${org.id}`} className="text-[13px] font-semibold text-brand hover:underline">Open</Link>
            </td>
          </tr>
        ))}
      </TableShell>
      {members.length === 0 && <EmptyState title="No members match these filters" />}
      <DemoNotice className="mt-6" />
    </>
  );
};

export const AdminMemberDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const { data: organizations = [] } = useQuery({ queryKey: ['organizations'], queryFn: () => dataProvider.organizations() });
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: () => dataProvider.invoices() });
  const org = organizations.find((o) => o.id === id);
  if (!org) return <EmptyState title="Organisation not found" action={<ButtonLink to="/admin/members">Back to members</ButtonLink>} />;

  const orgInvoices = invoices.filter((i) => i.organization_id === org.id);

  return (
    <>
      <AdminHeading
        title={org.display_name}
        description={`${org.legal_name} · ${sectors.find((s) => s.id === org.sector_id)?.name}`}
        action={<ButtonLink to="/admin/members" variant="outline">Back to members</ButtonLink>}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-[16px] font-semibold text-ink">Organisation record</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ['Registration number', org.registration_number],
              ['Year established', String(org.year_established)],
              ['Employees', org.employee_count],
              ['Turnover', org.annual_turnover_range],
              ['Island / atoll', `${org.island}, ${org.atoll}`],
              ['Public email', org.public_email ?? '—'],
              ['Directory visible', org.directory_visible ? 'Yes' : 'No'],
              ['Member number', org.member_number ?? '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                <dd className="mt-0.5 text-[14.5px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-7 text-[15px] font-semibold text-ink">Invoices</h3>
          <ul className="mt-3 divide-y divide-surface-border">
            {orgInvoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-mono text-[13px] text-brand-deep">{invoice.invoice_number}</p>
                  <p className="text-[13px] text-ink-soft">{invoice.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[14px] text-ink">{formatCurrency(invoice.amount, invoice.currency)}</p>
                  <Badge status={invoice.status} />
                </div>
              </li>
            ))}
            {orgInvoices.length === 0 && <li className="py-3 text-[14px] text-ink-soft">No invoices recorded.</li>}
          </ul>
        </Card>
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold text-ink">Status</h2>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] text-ink-soft">Membership</span>
                <Badge status={org.membership_status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] text-ink-soft">Verification</span>
                <Badge status={org.verification_status} />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold text-ink">Internal notes</h2>
            <p className="mt-2 text-[13.5px] text-ink-soft">{org.internal_notes}</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export const AdminOrganizationsPage: React.FC = () => {
  const { data: organizations = [] } = useQuery({ queryKey: ['organizations'], queryFn: () => dataProvider.organizations() });
  const [query, setQuery] = useState('');
  const filtered = organizations.filter((o) => o.legal_name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <AdminHeading title="Organisations" description="Every organisation record, including applicants awaiting approval." />
      <Card className="mb-5 p-5">
        <FieldLabel htmlFor="o-search">Search organisations</FieldLabel>
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input id="o-search" className={`${inputClass} pl-9`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Legal name" />
        </div>
      </Card>
      <TableShell headers={['Legal name', 'Registration', 'Sector', 'Island', 'Directory', 'Verification', '']}>
        {filtered.map((org) => (
          <tr key={org.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-medium text-ink">{org.legal_name}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{org.registration_number}</td>
            <td className="px-5 py-3.5 text-ink-soft">{sectors.find((s) => s.id === org.sector_id)?.name}</td>
            <td className="px-5 py-3.5 text-ink-soft">{org.island}</td>
            <td className="px-5 py-3.5 text-ink-soft">{org.directory_visible ? 'Visible' : 'Hidden'}</td>
            <td className="px-5 py-3.5"><Badge status={org.verification_status} /></td>
            <td className="px-5 py-3.5">
              <Link to={`/admin/organizations/${org.id}`} className="text-[13px] font-semibold text-brand hover:underline">Open</Link>
            </td>
          </tr>
        ))}
      </TableShell>
      <DemoNotice className="mt-6" />
    </>
  );
};

/* --------------------------- CONTENT MANAGEMENT ---------------------------- */

interface ContentRecord {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  status?: string;
  published_at?: string;
  featured?: boolean;
  body_markdown?: string;
  description_markdown?: string;
  full_description_markdown?: string;
  seo_title?: string;
  seo_description?: string;
}

const ContentManager: React.FC<{
  collection: ContentCollection;
  title: string;
  description: string;
  queryKey: string;
  load: () => Promise<ContentRecord[]>;
}> = ({ collection, title, description, queryKey, load }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: [queryKey], queryFn: load });
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', status: 'draft', seo_title: '', seo_description: '', body: '', featured: false });

  const openNew = () => {
    setEditing({ id: crypto.randomUUID() });
    setForm({ title: '', slug: '', status: 'draft', seo_title: '', seo_description: '', body: '', featured: false });
  };

  const openEdit = (record: ContentRecord) => {
    setEditing(record);
    setForm({
      title: record.title ?? record.name ?? '',
      slug: record.slug ?? '',
      status: record.status ?? 'draft',
      seo_title: record.seo_title ?? record.title ?? '',
      seo_description: record.seo_description ?? '',
      body: record.body_markdown ?? record.description_markdown ?? record.full_description_markdown ?? '',
      featured: Boolean(record.featured),
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: 'Title and slug are required', variant: 'destructive' });
      return;
    }
    const base = items.find((i) => i.id === editing.id) ?? {};
    setSaving(true);
    try {
      await dataProvider.saveContent(
        collection,
        {
          ...(base as Record<string, unknown>),
          id: editing.id,
          title: form.title,
          name: form.title,
          slug: form.slug,
          status: form.status,
          featured: form.featured,
          seo_title: form.seo_title,
          seo_description: form.seo_description,
          body_markdown: form.body,
          published_at: (base as ContentRecord).published_at ?? new Date().toISOString(),
          is_demo: false,
        } as never,
        user?.full_name ?? 'Editor',
      );
      await queryClient.refetchQueries({ queryKey: [queryKey], exact: true });
      setEditing(null);
      toast({ title: 'Content saved', description: `${form.title} has been saved as ${form.status}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The record could not be saved.';
      toast({ title: 'Could not save content', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (record: ContentRecord) => {
    if (!window.confirm(`Delete “${record.title ?? record.name}”? This cannot be undone.`)) return;
    await dataProvider.deleteContent(collection, record.id, user?.full_name ?? 'Editor');
    await queryClient.invalidateQueries({ queryKey: [queryKey] });
    toast({ title: 'Content deleted' });
  };

  return (
    <>
      <AdminHeading
        title={title}
        description={description}
        action={
          <Button type="button" onClick={openNew}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New record
          </Button>
        }
      />
      <TableShell headers={['Title', 'Slug', 'Status', 'Published', 'Featured', 'Actions']} minWidth="760px">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-medium text-ink">{item.title ?? item.name}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{item.slug}</td>
            <td className="px-5 py-3.5"><Badge status={item.status ?? 'published'} /></td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{item.published_at ? formatDate(item.published_at) : '—'}</td>
            <td className="px-5 py-3.5 text-ink-soft">{item.featured ? 'Yes' : 'No'}</td>
            <td className="px-5 py-3.5">
              <div className="flex gap-3">
                <button type="button" onClick={() => openEdit(item)} className="text-[13px] font-semibold text-brand hover:underline">Edit</button>
                <button type="button" onClick={() => remove(item)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#C2414B] hover:underline">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </TableShell>
      {items.length === 0 && <EmptyState title="No records yet" action={<Button type="button" onClick={openNew}>Create the first record</Button>} />}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-deep/50 p-4" role="dialog" aria-modal="true" aria-label="Edit content">
          <Card className="my-8 w-full max-w-2xl p-6">
            <h2 className="text-[18px] font-semibold text-ink">Edit content record</h2>
            <div className="mt-5 space-y-4">
              <div>
                <FieldLabel htmlFor="cm-title" required>Title</FieldLabel>
                <input id="cm-title" className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="cm-slug" required>Slug</FieldLabel>
                  <input id="cm-slug" className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div>
                  <FieldLabel htmlFor="cm-status">Status</FieldLabel>
                  <select id="cm-status" className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {['draft', 'scheduled', 'published', 'archived'].map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="cm-body">Body (Markdown)</FieldLabel>
                <textarea id="cm-body" rows={7} className={`${inputClass} font-mono text-[13px]`} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="## Heading&#10;&#10;Body text…" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="cm-seotitle">SEO title</FieldLabel>
                  <input id="cm-seotitle" className={inputClass} value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
                </div>
                <div>
                  <FieldLabel htmlFor="cm-seodesc">SEO description</FieldLabel>
                  <input id="cm-seodesc" className={inputClass} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-[13.5px] text-ink">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-surface-border text-brand focus:ring-brand" />
                Feature this record
              </label>
              <div className="rounded-md border border-surface-border bg-surface-page p-4">
                <p className="text-[12px] uppercase tracking-wider text-ink-muted">Preview</p>
                <p className="mt-1 text-[16px] font-semibold text-ink">{form.title || 'Untitled record'}</p>
                <p className="mt-1 whitespace-pre-wrap text-[13px] text-ink-soft">{form.body || 'No body content yet.'}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
              <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save record'}</Button>
            </div>
          </Card>
        </div>
      )}
      <DemoNotice className="mt-6" />
    </>
  );
};

export const AdminNewsPage: React.FC = () => (
  <ContentManager collection="news" queryKey="news" title="News" description="Create, edit, publish and archive chamber news." load={() => dataProvider.news()} />
);
export const AdminEventsPage: React.FC = () => (
  <ContentManager collection="events" queryKey="events" title="Events" description="Manage the chamber events calendar." load={() => dataProvider.events()} />
);
export const AdminPublicationsPage: React.FC = () => (
  <ContentManager collection="publications" queryKey="publications" title="Publications" description="Manage reports, research and guides." load={() => dataProvider.publications()} />
);
export const AdminPoliciesPage: React.FC = () => (
  <ContentManager collection="policy" queryKey="policy" title="Policy items" description="Manage policy positions and the advocacy tracker." load={() => dataProvider.policyItems()} />
);
export const AdminPolicySubmissionsPage: React.FC = () => (
  <ContentManager collection="submissions" queryKey="submissions" title="Policy submissions" description="Maintain the submission register." load={() => dataProvider.policySubmissions()} />
);
export const AdminMsmePage: React.FC = () => (
  <ContentManager collection="msme" queryKey="msme" title="MSME programmes" description="Manage grants, training and support programmes." load={() => dataProvider.msmePrograms()} />
);
export const AdminPartnersPage: React.FC = () => (
  <ContentManager collection="partners" queryKey="partners" title="Partners" description="Manage patron and strategic partner records." load={() => dataProvider.partners()} />
);
export const AdminCouncilsPage: React.FC = () => (
  <ContentManager collection="councils" queryKey="councils" title="Councils" description="Manage industry council pages and initiatives." load={() => dataProvider.councils()} />
);
export const AdminNoticesPage: React.FC = () => (
  <ContentManager collection="notices" queryKey="notices" title="Member notices" description="Publish notices to the membership." load={() => dataProvider.notices()} />
);

/* ------------------------------ OPERATIONS -------------------------------- */

export const AdminRegistrationsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: registrations = [] } = useQuery({ queryKey: ['registrations'], queryFn: () => dataProvider.registrations() });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const trainingEventIds = new Set(events.filter((event) => event.event_type === 'training').map((event) => event.id));
  const visibleRegistrations = programmeFilter === 'training'
    ? registrations.filter((registration) => trainingEventIds.has(registration.event_id))
    : registrations;
  const selected = registrations.find((registration) => registration.id === selectedId);

  const updateStatus = async (status: 'confirmed' | 'waitlisted' | 'rejected') => {
    if (!selected) return;
    await dataProvider.updateRegistrationStatus(selected.id, status, reviewNote, user?.full_name ?? 'Administrator');
    await queryClient.invalidateQueries({ queryKey: ['registrations'] });
    toast({ title: `Application ${titleCase(status)}`, description: 'The applicant record has been updated in the admin portal.' });
    setReviewNote('');
  };

  const exportCsv = () => {
    const rows = [
      ['Application reference', 'Attendee', 'Email', 'Phone', 'Designation', 'Event', 'Registered', 'Status', 'Payment'],
      ...visibleRegistrations.map((r) => [
        r.application_reference ?? r.id,
        r.attendee_name,
        r.attendee_email,
        r.attendee_phone,
        r.designation,
        events.find((e) => e.id === r.event_id)?.title ?? '',
        formatDate(r.registered_at),
        r.registration_status,
        r.payment_status,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mcci-event-registrations.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export ready', description: 'Registrations exported as CSV.' });
  };

  return (
    <>
      <AdminHeading
        title="Event & training applications"
        description="Review public training applications and attendee records across all chamber programmes."
        action={
          <Button type="button" variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />
      <Card className="mb-5 p-4">
        <FieldLabel htmlFor="registration-type">Record type</FieldLabel>
        <select id="registration-type" className={`${inputClass} max-w-xs`} value={programmeFilter} onChange={(e) => setProgrammeFilter(e.target.value)}>
          <option value="all">All event records</option>
          <option value="training">Training applications</option>
        </select>
      </Card>
      <TableShell headers={['Reference', 'Applicant', 'Programme', 'Registered', 'Status', 'Payment', 'Action']} minWidth="980px">
        {visibleRegistrations.map((registration) => (
          <tr key={registration.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-mono text-[11px] text-brand-deep">{registration.application_reference ?? 'Event registration'}</td>
            <td className="px-5 py-3.5 font-medium text-ink">{registration.attendee_name}</td>
            <td className="px-5 py-3.5 text-ink-soft">{events.find((e) => e.id === registration.event_id)?.title}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(registration.registered_at)}</td>
            <td className="px-5 py-3.5"><Badge status={registration.registration_status} /></td>
            <td className="px-5 py-3.5"><Badge status={registration.payment_status} /></td>
            <td className="px-5 py-3.5">
              <Button type="button" variant="outline" onClick={() => setSelectedId(registration.id)}>Review</Button>
            </td>
          </tr>
        ))}
      </TableShell>
      {selected && (
        <Card className="mt-6 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand">{selected.application_reference ?? selected.id}</p>
              <h2 className="mt-1 text-[19px] font-semibold text-ink">{selected.attendee_name}</h2>
              <p className="mt-1 text-[13px] text-ink-soft">{selected.attendee_email} · {selected.attendee_phone}</p>
            </div>
            <Badge status={selected.registration_status} />
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Programme', events.find((event) => event.id === selected.event_id)?.title ?? '—'],
              ['Island', selected.applicant_island || '—'],
              ['Organisation / school', selected.applicant_organization || '—'],
              ['Current status', selected.employment_status || '—'],
              ['Experience level', selected.experience_level || '—'],
              ['Designation', selected.designation || '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</dt>
                <dd className="mt-1 text-[14px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {selected.motivation && (
            <div className="mt-6 rounded-lg bg-surface-page p-4">
              <p className="text-[11px] uppercase tracking-wider text-ink-muted">Reason for applying</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink">{selected.motivation}</p>
            </div>
          )}
          {selected.accessibility_requirements && (
            <div className="mt-4 rounded-lg border border-surface-border p-4">
              <p className="text-[11px] uppercase tracking-wider text-ink-muted">Accessibility or learning support</p>
              <p className="mt-2 text-[14px] text-ink">{selected.accessibility_requirements}</p>
            </div>
          )}
          <div className="mt-6">
            <FieldLabel htmlFor="training-review-note">Review note</FieldLabel>
            <textarea id="training-review-note" rows={3} className={inputClass} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Optional note for the application record" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => updateStatus('confirmed')}>Confirm seat</Button>
            <Button type="button" variant="outline" onClick={() => updateStatus('waitlisted')}>Add to waitlist</Button>
            <Button type="button" variant="danger" onClick={() => updateStatus('rejected')}>Decline</Button>
            <Button type="button" variant="ghost" onClick={() => setSelectedId(null)}>Close</Button>
          </div>
        </Card>
      )}
    </>
  );
};

export const AdminInquiriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: inquiries = [] } = useQuery({ queryKey: ['inquiries'], queryFn: () => dataProvider.inquiries() });
  const update = async (id: string, status: 'in_progress' | 'resolved' | 'archived') => {
    await dataProvider.updateInquiryStatus(id, status);
    await queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    toast({ title: 'Inquiry updated', description: `Marked as ${titleCase(status)}.` });
  };
  return (
    <>
      <AdminHeading title="Inquiries" description="Messages submitted through the public contact form." />
      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge status={inquiry.status} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {inquiry.department} · {formatDate(inquiry.created_at)}
              </span>
            </div>
            <h2 className="mt-2 text-[16px] font-semibold text-ink">{inquiry.subject}</h2>
            <p className="mt-1 text-[13px] text-ink-soft">
              {inquiry.name} · {inquiry.company} · {inquiry.email}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{inquiry.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => update(inquiry.id, 'in_progress')}>Mark in progress</Button>
              <Button type="button" variant="secondary" onClick={() => update(inquiry.id, 'resolved')}>Resolve</Button>
              <Button type="button" variant="ghost" onClick={() => update(inquiry.id, 'archived')}>Archive</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export const AdminNewsletterPage: React.FC = () => {
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers'], queryFn: () => dataProvider.subscribers() });
  return (
    <>
      <AdminHeading title="Newsletter subscribers" description="Business bulletin subscription list." />
      <TableShell headers={['Email', 'Name', 'Company', 'Status', 'Subscribed']} minWidth="700px">
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-mono text-[13px] text-ink">{subscriber.email}</td>
            <td className="px-5 py-3.5 text-ink-soft">{[subscriber.first_name, subscriber.last_name].filter(Boolean).join(' ') || '—'}</td>
            <td className="px-5 py-3.5 text-ink-soft">{subscriber.company ?? '—'}</td>
            <td className="px-5 py-3.5"><Badge status={subscriber.status === 'subscribed' ? 'active' : 'cancelled'} /></td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(subscriber.subscribed_at)}</td>
          </tr>
        ))}
      </TableShell>
    </>
  );
};

export const AdminPaymentsPage: React.FC = () => {
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: () => dataProvider.invoices() });
  const { data: organizations = [] } = useQuery({ queryKey: ['organizations'], queryFn: () => dataProvider.organizations() });
  return (
    <>
      <AdminHeading title="Invoices & payments" description="Manual payment verification for membership and event invoices." />
      <TableShell headers={['Invoice', 'Organisation', 'Description', 'Amount', 'Due', 'Status', 'Action']}>
        {invoices.map((invoice) => (
          <tr key={invoice.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-mono text-[12px] text-brand-deep">{invoice.invoice_number}</td>
            <td className="px-5 py-3.5 text-ink">{organizations.find((o) => o.id === invoice.organization_id)?.display_name ?? '—'}</td>
            <td className="px-5 py-3.5 text-ink-soft">{invoice.description}</td>
            <td className="px-5 py-3.5 font-mono tabular-nums text-ink">{formatCurrency(invoice.amount, invoice.currency)}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(invoice.due_at)}</td>
            <td className="px-5 py-3.5"><Badge status={invoice.status} /></td>
            <td className="px-5 py-3.5">
              <button
                type="button"
                onClick={() => toast({ title: 'Payment verified', description: `${invoice.invoice_number} marked as paid (demo action).` })}
                className="text-[13px] font-semibold text-chamber-green hover:underline"
              >
                Verify payment
              </button>
            </td>
          </tr>
        ))}
      </TableShell>
      <DemoNotice className="mt-6" />
    </>
  );
};

export const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: () => dataProvider.users() });
  return (
    <>
      <AdminHeading title="Users & roles" description="Super administrators may assign roles and deactivate accounts. Self-promotion is not permitted." />
      <TableShell headers={['Name', 'Email', 'Role', 'Organisation', 'Last sign-in', 'Actions']}>
        {users.map((record) => (
          <tr key={record.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-medium text-ink">{record.full_name}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{record.email}</td>
            <td className="px-5 py-3.5">
              <select
                aria-label={`Role for ${record.full_name}`}
                className={`${inputClass} py-1.5 text-[13px]`}
                defaultValue={record.role}
                disabled={record.id === user?.id}
                onChange={(e) => toast({ title: 'Role updated', description: `${record.full_name} is now ${titleCase(e.target.value)} (demo action).` })}
              >
                {['member', 'editor', 'admin', 'super_admin'].map((r) => <option key={r} value={r}>{titleCase(r)}</option>)}
              </select>
            </td>
            <td className="px-5 py-3.5 text-ink-soft">{record.organization_id ?? '—'}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(record.last_sign_in_at)}</td>
            <td className="px-5 py-3.5">
              <button
                type="button"
                disabled={record.id === user?.id}
                onClick={() => toast({ title: 'Account deactivated', description: `${record.full_name} can no longer sign in (demo action).` })}
                className="text-[13px] font-semibold text-[#C2414B] hover:underline disabled:opacity-40"
              >
                Deactivate
              </button>
            </td>
          </tr>
        ))}
      </TableShell>
      <p className="mt-4 text-[13px] text-ink-soft">
        Role changes are also enforced by database policies — hiding controls in the interface is never the only protection.
      </p>
    </>
  );
};

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    address: siteConfig.address,
    phone: siteConfig.phone,
    generalEmail: siteConfig.generalEmail,
    membershipEmail: siteConfig.membershipEmail,
    eventsEmail: siteConfig.eventsEmail,
    officeHours: siteConfig.officeHours,
    seo: siteConfig.defaultSeoDescription,
  });
  return (
    <>
      <AdminHeading title="Site settings" description="Public contact details, office hours and default metadata." />
      <Card className="max-w-3xl p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast({ title: 'Settings saved', description: 'Site settings updated (demo action).' });
          }}
          className="space-y-4"
        >
          {[
            ['address', 'Official address'],
            ['phone', 'Telephone'],
            ['generalEmail', 'General email'],
            ['membershipEmail', 'Membership email'],
            ['eventsEmail', 'Events email'],
            ['officeHours', 'Office hours'],
            ['seo', 'Default SEO description'],
          ].map(([key, label]) => (
            <div key={key}>
              <FieldLabel htmlFor={`set-${key}`}>{label}</FieldLabel>
              <input
                id={`set-${key}`}
                className={inputClass}
                value={settings[key as keyof typeof settings]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            </div>
          ))}
          <Button type="submit">Save settings</Button>
        </form>
      </Card>
    </>
  );
};

export const AdminMediaPage: React.FC = () => (
  <>
    <AdminHeading title="Media library" description="Upload images and documents for news, events, councils and publications." />
    <Card className="p-8 text-center">
      <ImageIcon className="mx-auto h-8 w-8 text-ink-muted" aria-hidden="true" />
      <h2 className="mt-3 text-[16px] font-semibold text-ink">Storage buckets are configured in Supabase</h2>
      <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">
        Four buckets are prepared: <span className="font-mono">public-media</span>,{' '}
        <span className="font-mono">publications</span>, <span className="font-mono">organization-logos</span> and the
        private <span className="font-mono">member-documents</span> bucket. Uploading is enabled once Supabase mode is active.
      </p>
      <label className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-surface-border px-4 py-2.5 text-[13.5px] font-semibold text-ink-muted">
        Upload disabled in mock mode
      </label>
    </Card>
  </>
);

export const AdminAuditPage: React.FC = () => {
  const { data: audit = [] } = useQuery({ queryKey: ['audit'], queryFn: () => dataProvider.auditLogs() });
  return (
    <>
      <AdminHeading title="Audit log" description="Record of administrative actions across the platform." />
      <TableShell headers={['Timestamp', 'Actor', 'Action', 'Entity', 'Summary']}>
        {audit.map((entry) => (
          <tr key={entry.id} className="hover:bg-surface-page">
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(entry.created_at, 'd MMM yyyy HH:mm')}</td>
            <td className="px-5 py-3.5 text-ink">{entry.actor_name}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-brand-deep">{entry.action}</td>
            <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{entry.entity_type}:{entry.entity_id}</td>
            <td className="px-5 py-3.5 text-ink-soft">{entry.summary}</td>
          </tr>
        ))}
      </TableShell>
    </>
  );
};
