import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Card, DemoNotice, EmptyState } from '@/components/common/ui';
import ApplicationWizard from '@/features/membership/ApplicationWizard';
import { useAuth } from '@/lib/auth/AuthProvider';
import { dataProvider } from '@/lib/data/provider';
import { membershipTiers, councils } from '@/data/mockSeed';
import { formatDate, formatFileSize, titleCase } from '@/lib/utils/format';

const PortalApplication: React.FC = () => {
  const { user } = useAuth();
  const [startNew, setStartNew] = useState(false);
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => dataProvider.applications(),
  });

  const application =
    applications.find((a) => a.applicant_user_id === user?.id) ??
    applications.find((a) => a.organization_id === user?.organization_id) ??
    applications[0];

  if (isLoading) return <EmptyState title="Loading application…" />;

  if (startNew || !application) {
    return (
      <>
        <h1 className="mb-2 text-[26px] font-semibold text-ink">Membership application</h1>
        <p className="mb-6 max-w-2xl text-[14.5px] text-ink-soft">
          Complete each step. Your answers are validated before you can continue.
        </p>
        <ApplicationWizard embedded />
      </>
    );
  }

  const tier = membershipTiers.find((t) => t.id === application.tier_id);
  const editable = application.status === 'draft' || application.status === 'more_information_required';

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold text-ink">Membership application</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[14px] text-ink-soft">
            <span className="font-mono text-brand-deep">{application.application_reference}</span>
            <Badge status={application.status} />
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setStartNew(true)}>
          Start a new application
        </Button>
      </div>

      {application.status === 'more_information_required' && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-[14px] text-[#7a5312]">
          <strong className="font-semibold">More information required.</strong>{' '}
          {application.review_notes ?? 'The membership team has requested additional details.'}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-[16px] font-semibold text-ink">Submitted details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ['Membership tier', tier?.name ?? '—'],
              ['Legal business name', application.legal_business_name],
              ['Trading name', application.trading_name || '—'],
              ['Registration number', application.registration_number],
              ['Year established', application.year_established],
              ['Island / atoll', `${application.island}, ${application.atoll}`],
              ['Primary contact', application.contact_name],
              ['Contact email', application.contact_email],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                <dd className="mt-0.5 text-[14.5px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-7 text-[15px] font-semibold text-ink">Selected councils</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {application.selected_council_ids.map((id) => (
              <Badge key={id} status="info" label={councils.find((c) => c.id === id)?.name ?? id} />
            ))}
          </div>

          <h3 className="mt-7 text-[15px] font-semibold text-ink">Documents</h3>
          <ul className="mt-3 divide-y divide-surface-border">
            {application.documents.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">{doc.document_type}</p>
                  <p className="font-mono text-[12px] text-ink-soft">
                    {doc.original_filename} · {formatFileSize(doc.file_size)}
                  </p>
                </div>
                <Badge status={doc.status} />
              </li>
            ))}
            {application.documents.length === 0 && (
              <li className="py-3 text-[14px] text-ink-soft">No documents attached.</li>
            )}
          </ul>

          {!editable && (
            <p className="mt-6 rounded-md bg-surface-page p-4 text-[13px] text-ink-soft">
              This application is locked while under review. If the membership team requests more information you
              will be able to edit and resubmit.
            </p>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold text-ink">Application timeline</h2>
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
          <DemoNotice />
        </div>
      </div>
    </>
  );
};

export default PortalApplication;
