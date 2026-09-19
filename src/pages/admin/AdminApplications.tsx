import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, ShieldAlert } from 'lucide-react';
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
import { dataProvider } from '@/lib/data/provider';
import { councils, membershipTiers } from '@/data/mockSeed';
import { formatDate, formatFileSize, titleCase } from '@/lib/utils/format';
import type { ApplicationStatus } from '@/types';

export const AdminApplicationsPage: React.FC = () => {
  const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: () => dataProvider.applications() });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [tier, setTier] = useState('all');

  const filtered = useMemo(
    () =>
      applications
        .filter((a) => (status === 'all' ? true : a.status === status))
        .filter((a) => (tier === 'all' ? true : a.tier_id === tier))
        .filter((a) =>
          `${a.legal_business_name} ${a.application_reference} ${a.contact_name}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
    [applications, query, status, tier],
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold text-ink">Membership applications</h1>
        <p className="mt-1.5 text-[14.5px] text-ink-soft">Review, request information, approve or reject applications.</p>
      </div>

      <Card className="mb-5 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="app-search">Search</FieldLabel>
            <input id="app-search" className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Business, reference or contact" />
          </div>
          <div>
            <FieldLabel htmlFor="app-status">Status</FieldLabel>
            <select id="app-status" className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              {['all', 'submitted', 'under_review', 'more_information_required', 'approved', 'rejected', 'withdrawn'].map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All statuses' : titleCase(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="app-tier">Tier</FieldLabel>
            <select id="app-tier" className={inputClass} value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="all">All tiers</option>
              {membershipTiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No applications match these filters" />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[14px]">
            <thead className="border-b border-surface-border bg-surface-page text-[12px] uppercase tracking-wider text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Reference</th>
                <th scope="col" className="px-5 py-3 font-semibold">Business</th>
                <th scope="col" className="px-5 py-3 font-semibold">Tier</th>
                <th scope="col" className="px-5 py-3 font-semibold">Submitted</th>
                <th scope="col" className="px-5 py-3 font-semibold">Documents</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((application) => (
                <tr key={application.id} className="hover:bg-surface-page">
                  <td className="px-5 py-3.5 font-mono text-[12px] text-brand-deep">{application.application_reference}</td>
                  <td className="px-5 py-3.5 font-medium text-ink">{application.legal_business_name}</td>
                  <td className="px-5 py-3.5 text-ink-soft">{membershipTiers.find((t) => t.id === application.tier_id)?.name}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-ink-soft">{formatDate(application.submitted_at)}</td>
                  <td className="px-5 py-3.5 font-mono tabular-nums text-ink-soft">{application.documents.length}</td>
                  <td className="px-5 py-3.5"><Badge status={application.status} /></td>
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/applications/${application.id}`} className="text-[13px] font-semibold text-brand hover:underline">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <DemoNotice className="mt-6" />
    </>
  );
};

export const AdminApplicationDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: application, refetch } = useQuery({
    queryKey: ['application', id],
    queryFn: () => dataProvider.application(id),
  });
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState<ApplicationStatus | null>(null);
  const [busy, setBusy] = useState(false);

  if (!application) {
    return <EmptyState title="Application not found" action={<ButtonLink to="/admin/applications">Back to queue</ButtonLink>} />;
  }

  const act = async (status: ApplicationStatus) => {
    if ((status === 'rejected' || status === 'more_information_required') && !note.trim()) {
      toast({ title: 'A note is required', description: 'Provide a reason before completing this action.', variant: 'destructive' });
      return;
    }
    setBusy(true);
    await dataProvider.setApplicationStatus(application.id, status, note || `Status changed to ${status}`, user?.full_name ?? 'Administrator');
    await refetch();
    await queryClient.invalidateQueries({ queryKey: ['applications'] });
    await queryClient.invalidateQueries({ queryKey: ['organizations'] });
    setBusy(false);
    setConfirm(null);
    setNote('');
    toast({
      title: `Application ${titleCase(status)}`,
      description:
        status === 'approved'
          ? 'Payment has been unlocked for the applicant. Membership activates only after payment succeeds.'
          : 'The applicant has been notified in the member portal.',
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button type="button" onClick={() => navigate('/admin/applications')} className="text-[13px] font-medium text-ink-soft hover:text-brand">
            ← Back to application queue
          </button>
          <h1 className="mt-2 text-[26px] font-semibold text-ink">{application.legal_business_name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[14px] text-ink-soft">
            <span className="font-mono text-brand-deep">{application.application_reference}</span>
            <Badge status={application.status} />
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-[16px] font-semibold text-ink">Organisation details</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['Trading name', application.trading_name || '—'],
                ['Registration number', application.registration_number],
                ['Year established', application.year_established],
                ['Turnover range', application.annual_turnover_range],
                ['Employees', application.employee_count],
                ['Registered address', application.registered_address],
                ['Island / atoll', `${application.island}, ${application.atoll}`],
                ['Website', application.website || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                  <dd className="mt-0.5 text-[14.5px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-[16px] font-semibold text-ink">Primary contact</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['Name', application.contact_name],
                ['Designation', application.contact_designation],
                ['Email', application.contact_email],
                ['Mobile', application.contact_mobile],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                  <dd className="mt-0.5 text-[14.5px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-[16px] font-semibold text-ink">Selected councils</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {application.selected_council_ids.map((cid) => (
                <Badge key={cid} status="info" label={councils.find((c) => c.id === cid)?.name ?? cid} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-[16px] font-semibold text-ink">Documents</h2>
            <ul className="mt-4 divide-y divide-surface-border">
              {application.documents.map((doc) => (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-4 w-4 text-brand" aria-hidden="true" />
                    <div>
                      <p className="text-[14px] font-medium text-ink">{doc.document_type}</p>
                      <p className="font-mono text-[12px] text-ink-soft">
                        {doc.original_filename} · {formatFileSize(doc.file_size)} · {formatDate(doc.uploaded_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={doc.status} />
                    <button
                      type="button"
                      onClick={() => window.alert('Secure document view placeholder. In Supabase mode a short-lived signed URL is generated for admin review.')}
                      className="rounded-md border border-surface-border px-3 py-1.5 text-[12.5px] font-semibold text-brand-deep hover:border-brand hover:bg-brand-light"
                    >
                      Secure view
                    </button>
                  </div>
                </li>
              ))}
              {application.documents.length === 0 && <li className="py-3 text-[14px] text-ink-soft">No documents attached.</li>}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold text-ink">Review actions</h2>
            <p className="mt-2 rounded-md bg-brand-light p-3 text-[13px] leading-relaxed text-brand-deep">
              Approval unlocks payment for the applicant. It does not activate membership or issue a certificate.
            </p>
            <div className="mt-4">
              <FieldLabel htmlFor="review-note">Internal note / reason</FieldLabel>
              <textarea id="review-note" rows={4} className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Required when requesting information or rejecting" />
            </div>
            <div className="mt-4 space-y-2">
              <Button type="button" variant="outline" className="w-full" loading={busy} onClick={() => act('under_review')}>
                Mark under review
              </Button>
              <Button type="button" variant="outline" className="w-full" loading={busy} onClick={() => act('more_information_required')}>
                Request more information
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={() => setConfirm('approved')}>
                Approve &amp; unlock payment
              </Button>
              <Button type="button" variant="danger" className="w-full" onClick={() => setConfirm('rejected')}>
                Reject application
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-[15px] font-semibold text-ink">Status timeline</h2>
            <ol className="mt-4 space-y-4 border-l border-surface-border pl-5">
              {application.timeline.map((entry) => (
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
          </Card>
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-[#B7791F]" aria-hidden="true" />
              <div>
                <h2 id="confirm-title" className="text-[17px] font-semibold text-ink">
                  {confirm === 'approved' ? 'Approve this application?' : 'Reject this application?'}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {confirm === 'approved'
                    ? 'Approval unlocks the membership payment in the applicant portal. Membership and the digital certificate are issued only after payment succeeds.'
                    : 'Rejection requires a reason. The applicant will see the reason in the member portal.'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
              <Button
                type="button"
                variant={confirm === 'approved' ? 'secondary' : 'danger'}
                loading={busy}
                onClick={() => act(confirm)}
              >
                {confirm === 'approved' ? 'Approve & unlock payment' : 'Confirm rejection'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
