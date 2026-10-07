import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  FieldError,
  FieldLabel,
  PageHeader,
  inputClass,
} from '@/components/common/ui';
import { atolls, employeeRanges, membershipTiers, sectors, turnoverRanges } from '@/data/mockSeed';
import { formatCurrency } from '@/lib/utils/format';

const steps = [
  'Membership tier',
  'Business information',
  'Primary contact',
  'Industry councils',
  'Required documents',
  'Declaration',
  'Review & submit',
];

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
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (index === 5) {
      if (!form.declaration_accepted) next.declaration = 'You must accept the declaration.';
      if (!form.privacy_accepted) next.privacy = 'You must accept the privacy terms.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const tier = membershipTiers.find((t) => t.id === form.tier_id);

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
            <p className="mt-2 text-[14px] text-ink-soft">These proposed tiers and annual prices are intended to go through an AGM.</p>
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
                <input id="a-cmobile" type="tel" className={inputClass} value={form.contact_mobile} onChange={(e) => set('contact_mobile', e.target.value)} />
                <FieldError message={errors.contact_mobile} />
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-xl font-semibold text-ink">Industry councils</legend>
            <p className="mt-2 text-[14px] text-ink-soft">
              Council names and participation details are under development and will be confirmed with applicants.
            </p>
            <div className="mt-5 rounded-lg border border-surface-border bg-surface-page p-5 text-[14px] text-ink-soft">
              Under Development — no council selection is required at this stage.
            </div>
            <FieldError message={errors.councils} />
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-xl font-semibold text-ink">Required documents</legend>
            <div className="mt-5 rounded-lg border border-surface-border bg-surface-page p-6 text-center">
              <h3 className="text-[16px] font-semibold text-ink">Under Development</h3>
              <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">
                Document requirements and secure upload are being finalised. No documents are collected at this stage.
              </p>
            </div>
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
            <div className="mt-6 rounded-lg border border-brand/20 bg-brand-light p-5 text-[14px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-ink">Submission is not yet enabled.</strong>{' '}
              You may review the form, but it will not be sent or stored until the secure submission process is ready.
            </div>
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
            <Button type="button" variant="secondary" disabled>
              Submission not yet enabled
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
      description="Review the proposed membership application steps. Online submission is not yet enabled."
      breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Apply' }]}
    />
    <Container className="py-14">
      <ApplicationWizard />
    </Container>
  </>
);

export default ApplicationWizard;
