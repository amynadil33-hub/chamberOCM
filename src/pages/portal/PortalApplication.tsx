import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Check, CreditCard, Download, FileCheck2, LockKeyhole, Send } from 'lucide-react';
import { Badge, Button, Card, DemoNotice, EmptyState } from '@/components/common/ui';
import ApplicationWizard from '@/features/membership/ApplicationWizard';
import { useAuth } from '@/lib/auth/AuthProvider';
import { dataProvider } from '@/lib/data/provider';
import { membershipTiers, councils } from '@/data/mockSeed';
import { formatCurrency, formatDate, formatFileSize, titleCase } from '@/lib/utils/format';
import { toast } from '@/components/ui/use-toast';

const workflowSteps = [
  { title: 'Application submitted', description: 'Your form and documents are sent to the chamber.', icon: Send },
  { title: 'Chamber review', description: 'A chamber administrator checks and approves the application.', icon: FileCheck2 },
  { title: 'Membership payment', description: 'Payment becomes available only after chamber approval.', icon: CreditCard },
  { title: 'Certificate issued', description: 'Your membership activates and your digital certificate is issued.', icon: BadgeCheck },
];

const certificateWindow = (application: { legal_business_name: string; member_number?: string; certificate_number?: string; certificate_issued_at?: string }) => {
  const popup = window.open('', '_blank');
  if (!popup) return;
  popup.opener = null;
  const issued = application.certificate_issued_at ? new Date(application.certificate_issued_at).toLocaleDateString('en-GB') : '';
  popup.document.write(`<!doctype html><html><head><title>Membership Certificate</title><style>
    body{font-family:Georgia,serif;margin:0;padding:40px;background:#eef3f8;color:#17243b}.certificate{max-width:920px;margin:auto;background:white;border:14px solid #1d3974;padding:64px;text-align:center;box-shadow:inset 0 0 0 3px #d2a84a}.eyebrow{font:700 13px Arial;letter-spacing:.22em;color:#5270a8;text-transform:uppercase}.title{font-size:48px;margin:22px 0 10px;color:#152d62}.name{font-size:34px;margin:34px 0 8px;border-bottom:1px solid #d2a84a;padding-bottom:12px}.copy{font:18px/1.7 Arial;color:#49566a}.details{display:flex;justify-content:center;gap:48px;margin-top:40px;font:14px Arial}.details strong{display:block;color:#152d62;margin-top:6px}.actions{text-align:center;margin-top:24px}.actions button{background:#1d3974;color:white;border:0;border-radius:6px;padding:12px 20px;font-weight:700}@media print{body{background:white;padding:0}.certificate{box-shadow:none}.actions{display:none}}
  </style></head><body><main class="certificate"><p class="eyebrow">Maldives National Chamber of Commerce &amp; Industry</p><h1 class="title">Certificate of Membership</h1><p class="copy">This certificate confirms that</p><h2 class="name">${application.legal_business_name}</h2><p class="copy">is an active member of the Maldives National Chamber of Commerce &amp; Industry.</p><div class="details"><div>Member number<strong>${application.member_number ?? ''}</strong></div><div>Certificate number<strong>${application.certificate_number ?? ''}</strong></div><div>Issued<strong>${issued}</strong></div></div></main><div class="actions"><button onclick="window.print()">Print or save as PDF</button></div></body></html>`);
  popup.document.close();
};

const PortalApplication: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [startNew, setStartNew] = useState(false);
  const [paying, setPaying] = useState(false);
  const { data: applications = [], isLoading, refetch } = useQuery({
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
  const chamberApproved = application.status === 'approved';
  const paymentComplete = application.payment_status === 'verified';
  const certificateIssued = Boolean(application.certificate_number && application.certificate_issued_at);
  const currentWorkflowStep = certificateIssued ? 4 : paymentComplete ? 3 : chamberApproved ? 2 : 1;

  const pay = async () => {
    if (!chamberApproved) return;
    setPaying(true);
    const reference = `PAY-${Date.now().toString().slice(-8)}`;
    await dataProvider.completeMembershipPayment(application.id, reference, user?.full_name ?? application.contact_name);
    await refetch();
    await queryClient.invalidateQueries({ queryKey: ['applications'] });
    await queryClient.invalidateQueries({ queryKey: ['organizations'] });
    setPaying(false);
    toast({ title: 'Payment successful', description: 'Your membership is active and your digital certificate is ready.' });
  };

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

      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-surface-border bg-brand-deep px-6 py-5 text-white">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Your progress</p>
          <h2 className="mt-1 text-[19px] font-semibold">
            {certificateIssued ? 'Membership active' : chamberApproved ? 'Approved — payment is now available' : 'Application with the chamber'}
          </h2>
        </div>
        <ol className="grid md:grid-cols-4" aria-label="Membership application progress">
          {workflowSteps.map((item, index) => {
            const completed = index < currentWorkflowStep;
            const active = index === currentWorkflowStep;
            const Icon = item.icon;
            return (
              <li key={item.title} className={`relative border-b border-surface-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${active ? 'bg-brand-light' : ''}`}>
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${completed ? 'bg-chamber-green text-white' : active ? 'bg-brand text-white' : 'bg-surface-page text-ink-muted'}`}>
                  {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
                </div>
                <p className="text-[14px] font-semibold text-ink">{index + 1}. {item.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{item.description}</p>
                <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  {completed ? 'Complete' : active ? 'Current step' : 'Locked'}
                </p>
              </li>
            );
          })}
        </ol>
      </Card>

      {chamberApproved && !paymentComplete && (
        <Card className="mb-6 border-chamber-green/40 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-chamber-green-dark">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                <h2 className="text-[17px] font-semibold">Approved by the chamber</h2>
              </div>
              <p className="mt-2 max-w-2xl text-[14px] text-ink-soft">
                Your application has passed review. Complete the annual membership payment to activate membership and receive your certificate.
              </p>
              <p className="mt-3 font-mono text-[22px] font-semibold text-brand-deep">
                {tier ? formatCurrency(tier.annual_fee, tier.currency) : 'Membership fee'}
              </p>
            </div>
            <Button type="button" variant="secondary" loading={paying} onClick={pay} className="shrink-0">
              <CreditCard className="h-4 w-4" aria-hidden="true" /> Pay membership fee
            </Button>
          </div>
        </Card>
      )}

      {!chamberApproved && !paymentComplete && application.status !== 'rejected' && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-surface-border bg-white p-4 text-[14px] text-ink-soft">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <p><strong className="text-ink">Payment is locked.</strong> It will open automatically after a chamber administrator approves your application.</p>
        </div>
      )}

      {certificateIssued && (
        <Card className="mb-6 overflow-hidden border-chamber-green/40">
          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-chamber-green">Digital membership certificate</p>
              <h2 className="mt-2 text-[22px] font-semibold text-ink">{application.legal_business_name}</h2>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-soft">
                <span>Member no. <strong className="font-mono text-brand-deep">{application.member_number}</strong></span>
                <span>Certificate <strong className="font-mono text-brand-deep">{application.certificate_number}</strong></span>
              </div>
            </div>
            <Button type="button" variant="outline" onClick={() => certificateWindow(application)}>
              <Download className="h-4 w-4" aria-hidden="true" /> Open certificate
            </Button>
          </div>
        </Card>
      )}

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
