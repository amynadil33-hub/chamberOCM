import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, FileUp, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  FieldError,
  FieldLabel,
  PageHeader,
  inputClass,
} from '@/components/common/ui';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth/AuthProvider';
import { dataProvider } from '@/lib/data/provider';
import { atolls, councils, employeeRanges, membershipTiers, sectors, turnoverRanges } from '@/data/mockSeed';
import { formatCurrency, formatFileSize } from '@/lib/utils/format';
import type { ApplicationDocument } from '@/types';

const steps = [
  'Membership tier',
  'Business information',
  'Primary contact',
  'Industry councils',
  'Required documents',
  'Declaration',
  'Review & submit',
];

const requiredDocs = [
  'Business registration certificate',
  'Director / shareholder list',
  'Authorised signatory ID copy',
];
const optionalDocs = ['Company profile', 'Latest audited accounts', 'GST / BPT registration'];

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png'];

interface FormState {
  tier_id: string;
  legal_business_name: string;
  trading_name: string;
  registration_number: string;
  year_established: string;
  sector_id: string;
  annual_turnover_range: string;
  employee_count: string;
  registered_address: string;
  island: string;
  atoll: string;
  website: string;
  contact_name: string;
  contact_designation: string;
  contact_email: string;
  contact_mobile: string;
  selected_council_ids: string[];
  declaration_accepted: boolean;
  privacy_accepted: boolean;
}

const initialState: FormState = {
  tier_id: 'tier-standard',
  legal_business_name: '',
  trading_name: '',
  registration_number: '',
  year_established: '',
  sector_id: sectors[0].id,
  annual_turnover_range: turnoverRanges[0],
  employee_count: employeeRanges[0],
  registered_address: '',
  island: '',
  atoll: atolls[0],
  website: '',
  contact_name: '',
  contact_designation: '',
  contact_email: '',
  contact_mobile: '',
  selected_council_ids: [],
  declaration_accepted: false,
  privacy_accepted: false,
};

const ApplicationWizard: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validateStep = (index: number): boolean => {
    const next: Record<string, string> = {};
    if (index === 1) {
      if (!form.legal_business_name.trim()) next.legal_business_name = 'Enter the registered legal name.';
      if (!form.registration_number.trim()) next.registration_number = 'Enter the business registration number.';
      if (!/^\d{4}$/.test(form.year_established)) next.year_established = 'Enter a 4-digit year.';
      if (!form.registered_address.trim()) next.registered_address = 'Enter the registered address.';
      if (!form.island.trim()) next.island = 'Enter the island.';
    }
    if (index === 2) {
      if (!form.contact_name.trim()) next.contact_name = 'Enter the primary contact name.';
      if (!form.contact_designation.trim()) next.contact_designation = 'Enter the contact designation.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) next.contact_email = 'Enter a valid email address.';
      if (!form.contact_mobile.trim()) next.contact_mobile = 'Enter a mobile number.';
    }
    if (index === 3 && form.selected_council_ids.length === 0) {
      next.councils = 'Select at least one industry council.';
    }
    if (index === 4) {
      const missing = requiredDocs.filter((d) => !documents.some((doc) => doc.document_type === d));
      if (missing.length > 0) next.documents = `Upload the required documents: ${missing.join(', ')}.`;
    }
    if (index === 5) {
      if (!form.declaration_accepted) next.declaration = 'You must accept the declaration.';
      if (!form.privacy_accepted) next.privacy = 'You must accept the privacy terms.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleUpload = (documentType: string, file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setErrors((e) => ({ ...e, documents: `${file.name} exceeds the 5 MB limit.` }));
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      setErrors((e) => ({ ...e, documents: `${file.name} must be a PDF, JPG or PNG file.` }));
      return;
    }
    setErrors((e) => ({ ...e, documents: '' }));
    setDocuments((prev) => [
      ...prev.filter((d) => d.document_type !== documentType),
      {
        id: `doc-${Date.now()}-${documentType}`,
        application_id: 'pending',
        document_type: documentType,
        original_filename: file.name,
        storage_path: `member-documents/${user?.id ?? 'guest'}/pending/${file.name}`,
        mime_type: file.type,
        file_size: file.size,
        status: 'uploaded',
        uploaded_at: new Date().toISOString(),
      },
    ]);
    toast({ title: 'Document attached', description: `${file.name} is ready to submit.` });
  };

  const submit = async () => {
    if (!validateStep(5)) return;
    setSubmitting(true);
    const record = await dataProvider.createApplication(
      { ...form, documents },
      user ?? { id: 'guest', email: form.contact_email, full_name: form.contact_name, role: 'member' },
    );
    setSubmitting(false);
    setReference(record.application_reference);
    toast({
      title: 'Application submitted',
      description: `Reference ${record.application_reference}. A confirmation email would be sent in production.`,
    });
  };

  const tier = membershipTiers.find((t) => t.id === form.tier_id);

  if (reference) {
    return (
      <Card className="mx-auto max-w-2xl p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-chamber-green-light text-chamber-green">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold text-ink">Application submitted</h2>
        <p className="mt-2 text-[15px] text-ink-soft">
          Your application reference is{' '}
          <span className="font-mono font-semibold text-brand-deep">{reference}</span>. You can track progress in
          the member portal.
        </p>
        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          {[
            ['1', 'Chamber review', 'The membership team checks your form and documents.'],
            ['2', 'Payment', 'Payment opens only after the chamber approves your application.'],
            ['3', 'Certificate', 'Successful payment activates membership and issues your digital certificate.'],
          ].map(([number, title, copy]) => (
            <div key={number} className="rounded-lg border border-surface-border bg-surface-page p-4">
              <span className="font-mono text-[11px] font-semibold text-brand">STEP {number}</span>
              <p className="mt-1 text-[14px] font-semibold text-ink">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/portal/application">Track application</ButtonLink>
          <ButtonLink to="/" variant="outline">Return home</ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <div className={embedded ? '' : 'mx-auto max-w-4xl'}>
      <ol className="mb-8 flex flex-wrap gap-2" aria-label="Application steps">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => index < step && setStep(index)}
              aria-current={index === step ? 'step' : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                index === step
                  ? 'border-brand bg-brand text-white'
                  : index < step
                    ? 'border-chamber-green/40 bg-chamber-green-light text-chamber-green-dark'
                    : 'border-surface-border bg-white text-ink-muted'
              }`}
            >
              <span className="font-mono">{index + 1}.</span> {label}
            </button>
          </li>
        ))}
      </ol>

      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <fieldset>
            <legend className="text-xl font-semibold text-ink">Choose your membership tier</legend>
            <p className="mt-2 text-[14px] text-ink-soft">All fees are demonstration values pending confirmation.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {membershipTiers.map((t) => (
                <label
                  key={t.id}
                  className={`cursor-pointer rounded-lg border p-5 transition-all ${
                    form.tier_id === t.id ? 'border-brand bg-brand-light' : 'border-surface-border bg-white hover:border-brand/40'
                  }`}
                >
                  <span className="flex items-start justify-between">
                    <span className="text-[16px] font-semibold text-ink">{t.name}</span>
                    <input
                      type="radio"
                      name="tier"
                      value={t.id}
                      checked={form.tier_id === t.id}
                      onChange={() => set('tier_id', t.id)}
                      className="mt-1 h-4 w-4 text-brand focus:ring-brand"
                    />
                  </span>
                  <span className="mt-2 block font-mono text-[18px] font-semibold text-brand-deep">
                    {formatCurrency(t.annual_fee, t.currency).replace('.00', '')} / year
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-ink-soft">{t.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-ink">Business information</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="a-legal" required>Legal business name</FieldLabel>
                <input id="a-legal" className={inputClass} value={form.legal_business_name} onChange={(e) => set('legal_business_name', e.target.value)} />
                <FieldError message={errors.legal_business_name} />
              </div>
              <div>
                <FieldLabel htmlFor="a-trading">Trading name</FieldLabel>
                <input id="a-trading" className={inputClass} value={form.trading_name} onChange={(e) => set('trading_name', e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="a-reg" required>Registration number</FieldLabel>
                <input id="a-reg" className={inputClass} value={form.registration_number} onChange={(e) => set('registration_number', e.target.value)} />
                <FieldError message={errors.registration_number} />
              </div>
              <div>
                <FieldLabel htmlFor="a-year" required>Year established</FieldLabel>
                <input id="a-year" inputMode="numeric" placeholder="2018" className={inputClass} value={form.year_established} onChange={(e) => set('year_established', e.target.value)} />
                <FieldError message={errors.year_established} />
              </div>
              <div>
                <FieldLabel htmlFor="a-sector" required>Sector</FieldLabel>
                <select id="a-sector" className={inputClass} value={form.sector_id} onChange={(e) => set('sector_id', e.target.value)}>
                  {sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="a-turnover">Annual turnover range</FieldLabel>
                <select id="a-turnover" className={inputClass} value={form.annual_turnover_range} onChange={(e) => set('annual_turnover_range', e.target.value)}>
                  {turnoverRanges.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="a-employees">Employee count</FieldLabel>
                <select id="a-employees" className={inputClass} value={form.employee_count} onChange={(e) => set('employee_count', e.target.value)}>
                  {employeeRanges.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="a-website">Website</FieldLabel>
                <input id="a-website" className={inputClass} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
              </div>
              <div>
                <FieldLabel htmlFor="a-atoll" required>Atoll</FieldLabel>
                <select id="a-atoll" className={inputClass} value={form.atoll} onChange={(e) => set('atoll', e.target.value)}>
                  {atolls.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="a-island" required>Island</FieldLabel>
                <input id="a-island" className={inputClass} value={form.island} onChange={(e) => set('island', e.target.value)} />
                <FieldError message={errors.island} />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="a-address" required>Registered address</FieldLabel>
              <input id="a-address" className={inputClass} value={form.registered_address} onChange={(e) => set('registered_address', e.target.value)} />
              <FieldError message={errors.registered_address} />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-ink">Primary contact</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="a-cname" required>Full name</FieldLabel>
                <input id="a-cname" className={inputClass} value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
                <FieldError message={errors.contact_name} />
              </div>
              <div>
                <FieldLabel htmlFor="a-cdesig" required>Designation</FieldLabel>
                <input id="a-cdesig" className={inputClass} value={form.contact_designation} onChange={(e) => set('contact_designation', e.target.value)} />
                <FieldError message={errors.contact_designation} />
              </div>
              <div>
                <FieldLabel htmlFor="a-cemail" required>Email address</FieldLabel>
                <input id="a-cemail" type="email" className={inputClass} value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} />
                <FieldError message={errors.contact_email} />
              </div>
              <div>
                <FieldLabel htmlFor="a-cmobile" required>Mobile number</FieldLabel>
                <input id="a-cmobile" type="tel" className={inputClass} value={form.contact_mobile} onChange={(e) => set('contact_mobile', e.target.value)} placeholder="+960 000 0000" />
                <FieldError message={errors.contact_mobile} />
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-xl font-semibold text-ink">Industry councils</legend>
            <p className="mt-2 text-[14px] text-ink-soft">
              Select the councils your business would like to participate in. Council access depends on your tier.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {councils.map((council) => {
                const checked = form.selected_council_ids.includes(council.id);
                return (
                  <label
                    key={council.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      checked ? 'border-brand bg-brand-light' : 'border-surface-border bg-white hover:border-brand/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        set(
                          'selected_council_ids',
                          e.target.checked
                            ? [...form.selected_council_ids, council.id]
                            : form.selected_council_ids.filter((id) => id !== council.id),
                        )
                      }
                      className="mt-1 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand"
                    />
                    <span>
                      <span className="block text-[15px] font-semibold text-ink">{council.name}</span>
                      <span className="mt-1 block text-[13px] text-ink-soft">{council.short_description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError message={errors.councils} />
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-xl font-semibold text-ink">Required documents</legend>
            <p className="mt-2 text-[14px] text-ink-soft">
              PDF, JPG or PNG. Maximum 5 MB per file. Documents are stored privately and reviewed by the membership team.
            </p>
            <div className="mt-5 space-y-3">
              {[...requiredDocs, ...optionalDocs].map((docType) => {
                const uploaded = documents.find((d) => d.document_type === docType);
                const isRequired = requiredDocs.includes(docType);
                return (
                  <div key={docType} className="rounded-lg border border-surface-border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[14.5px] font-semibold text-ink">
                          {docType}
                          {isRequired && <span className="ml-1 text-[#C2414B]">*</span>}
                        </p>
                        {uploaded ? (
                          <p className="mt-1 font-mono text-[12px] text-ink-soft">
                            {uploaded.original_filename} · {formatFileSize(uploaded.file_size)}
                          </p>
                        ) : (
                          <p className="mt-1 text-[12.5px] text-ink-muted">
                            {isRequired ? 'Required' : 'Optional'}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {uploaded && <Badge status="uploaded" />}
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-brand-deep hover:border-brand hover:bg-brand-light">
                          <FileUp className="h-4 w-4" aria-hidden="true" />
                          {uploaded ? 'Replace' : 'Upload'}
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleUpload(docType, e.target.files?.[0])}
                          />
                        </label>
                        {uploaded && (
                          <button
                            type="button"
                            onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== uploaded.id))}
                            aria-label={`Remove ${docType}`}
                            className="rounded-md border border-surface-border p-2 text-ink-muted hover:border-[#C2414B] hover:text-[#C2414B]"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <FieldError message={errors.documents} />
          </fieldset>
        )}

        {step === 5 && (
          <fieldset className="space-y-4">
            <legend className="text-xl font-semibold text-ink">Declaration</legend>
            <div className="rounded-md bg-surface-page p-5 text-[14px] leading-relaxed text-ink-soft">
              I confirm that the information provided in this application is accurate and complete, that I am
              authorised to submit this application on behalf of the business, and that the business will comply
              with the rules and code of conduct of the chamber.
            </div>
            <div>
              <label className="flex items-start gap-2.5 text-[14px] text-ink">
                <input type="checkbox" checked={form.declaration_accepted} onChange={(e) => set('declaration_accepted', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand" />
                I accept the declaration above.
              </label>
              <FieldError message={errors.declaration} />
            </div>
            <div>
              <label className="flex items-start gap-2.5 text-[14px] text-ink">
                <input type="checkbox" checked={form.privacy_accepted} onChange={(e) => set('privacy_accepted', e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand" />
                <span>
                  I accept the <Link to="/privacy" className="text-brand underline">privacy policy</Link> and consent to the
                  chamber processing this application.
                </span>
              </label>
              <FieldError message={errors.privacy} />
            </div>
          </fieldset>
        )}

        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-ink">Review your application</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Membership tier', tier?.name ?? '—'],
                ['Legal business name', form.legal_business_name || '—'],
                ['Trading name', form.trading_name || '—'],
                ['Registration number', form.registration_number || '—'],
                ['Year established', form.year_established || '—'],
                ['Sector', sectors.find((s) => s.id === form.sector_id)?.name ?? '—'],
                ['Turnover', form.annual_turnover_range],
                ['Employees', form.employee_count],
                ['Address', form.registered_address || '—'],
                ['Island / atoll', `${form.island || '—'}, ${form.atoll}`],
                ['Primary contact', form.contact_name || '—'],
                ['Designation', form.contact_designation || '—'],
                ['Email', form.contact_email || '—'],
                ['Mobile', form.contact_mobile || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                  <dd className="mt-0.5 text-[14.5px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="text-[12px] uppercase tracking-wider text-ink-muted">Selected councils</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.selected_council_ids.map((id) => (
                  <Badge key={id} status="info" label={councils.find((c) => c.id === id)?.name ?? id} />
                ))}
                {form.selected_council_ids.length === 0 && <span className="text-[14px] text-ink-soft">None selected</span>}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[12px] uppercase tracking-wider text-ink-muted">Attached documents</p>
              <ul className="mt-2 space-y-1.5 text-[14px] text-ink-soft">
                {documents.map((d) => (
                  <li key={d.id} className="font-mono text-[12.5px]">
                    {d.document_type}: {d.original_filename} ({formatFileSize(d.file_size)})
                  </li>
                ))}
                {documents.length === 0 && <li>No documents attached</li>}
              </ul>
            </div>
            <DemoNotice className="mt-6" />
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-border pt-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => {
                if (validateStep(step)) setStep((s) => s + 1);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button type="button" variant="secondary" loading={submitting} onClick={submit}>
              Submit application
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export const MembershipApplyPage: React.FC = () => (
  <>
    <PageHeader
      eyebrow="Membership"
      title="Apply for Membership"
      description="Complete the seven-step application. You can review every answer before submitting."
      breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Apply' }]}
    />
    <Container className="py-14">
      <ApplicationWizard />
    </Container>
  </>
);

export default ApplicationWizard;
