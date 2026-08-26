import React from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  CalendarClock,
  FileCheck2,
  Globe2,
  GraduationCap,
  Handshake,
  Megaphone,
  Scale,
  Users,
} from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  PageHeader,
  SectionHeading,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { membershipTiers } from '@/data/mockSeed';
import { formatCurrency } from '@/lib/utils/format';

const benefits = [
  { icon: Scale, title: 'Policy representation', text: 'Your sector issues carried into national policy discussion through the councils.' },
  { icon: Users, title: 'Industry councils', text: 'A seat in the council that matches your sector and business priorities.' },
  { icon: Globe2, title: 'Trade & market access', text: 'Documentation support, trade missions and international chamber links.' },
  { icon: GraduationCap, title: 'Training & capability', text: 'Member rates on workshops, certification pathways and business clinics.' },
  { icon: Megaphone, title: 'Visibility', text: 'Public directory listing, event platforms and chamber communications.' },
  { icon: Handshake, title: 'Business networking', text: 'Structured introductions, forums and sector networking events.' },
  { icon: FileCheck2, title: 'Advisory support', text: 'Guidance on compliance, registration and business processes.' },
  { icon: CalendarClock, title: 'Early information', text: 'Advance notice of consultations, tenders and policy changes.' },
];

const processSteps = [
  { step: '01', title: 'Choose your tier', text: 'Select the membership category that matches your business size and objectives.' },
  { step: '02', title: 'Complete the application', text: 'Provide business, contact and council preference details online.' },
  { step: '03', title: 'Upload documents', text: 'Attach registration certificate, director list and signatory identification.' },
  { step: '04', title: 'Review', text: 'The membership team reviews the application and may request further information.' },
  { step: '05', title: 'Approval & invoice', text: 'On approval a member number is issued along with the subscription invoice.' },
  { step: '06', title: 'Activation', text: 'Membership becomes active and portal services are unlocked.' },
];

const faqs = [
  { q: 'Who can apply for membership?', a: 'Any business registered in the Maldives may apply. Eligibility criteria are confirmed during review.' },
  { q: 'How long does review take?', a: 'Review timelines will be confirmed by the secretariat. Applicants can track status in the member portal.' },
  { q: 'Can I join more than one council?', a: 'Council participation depends on the membership tier. Corporate and Patron members may join multiple councils.' },
  { q: 'How are fees paid?', a: 'The first version supports manual bank transfer with reference verification by the membership team.' },
  { q: 'Is my information public?', a: 'Only fields you mark as public appear in the member directory. Documents are never public.' },
  { q: 'When does membership renew?', a: 'Membership runs annually. Renewal invoices are issued ahead of the expiry date.' },
];

export const MembershipPage: React.FC = () => {
  usePageMeta('Membership', 'Why businesses join MCCI and how to apply.');
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership of the Chamber"
        description="Membership connects your business to national policy, industry peers and practical support — across every atoll and every major sector."
        breadcrumbs={[{ label: 'Membership' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/membership/apply" className="rounded-md bg-chamber-green px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-chamber-green-dark">
            Apply for membership
          </Link>
          <Link to="/membership/tiers" className="rounded-md border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-white/20">
            Compare tiers
          </Link>
        </div>
      </PageHeader>

      <Container className="py-14">
        <SectionHeading eyebrow="Benefits" title="What membership delivers" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5 hover:-translate-y-0.5 hover:shadow-md">
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h3 className="mt-3 text-[15px] font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{text}</p>
            </Card>
          ))}
        </div>

        <SectionHeading className="mt-16" eyebrow="Process" title="How to apply" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step) => (
            <Card key={step.step} className="p-6">
              <span className="font-mono text-[13px] font-semibold text-brand">{step.step}</span>
              <h3 className="mt-2 text-[16px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{step.text}</p>
            </Card>
          ))}
        </div>

        <SectionHeading className="mt-16" eyebrow="Requirements" title="Eligibility and documents" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-[16px] font-semibold text-ink">Eligibility</h3>
            <ul className="mt-3 space-y-2 text-[14px] text-ink-soft">
              {[
                'A business registered in the Republic of Maldives',
                'Valid company or sole trader registration',
                'Named authorised representative for chamber correspondence',
                'Acceptance of the chamber declaration and privacy terms',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-chamber-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-[16px] font-semibold text-ink">Documents</h3>
            <p className="mt-2 text-[13px] text-ink-muted">Required</p>
            <ul className="mt-2 space-y-2 text-[14px] text-ink-soft">
              {['Business registration certificate', 'Director / shareholder list', 'Authorised signatory identification copy'].map((doc) => (
                <li key={doc} className="flex gap-2">
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {doc}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-ink-muted">Optional</p>
            <ul className="mt-2 space-y-2 text-[14px] text-ink-soft">
              {['Company profile', 'Latest audited accounts', 'GST / BPT registration'].map((doc) => (
                <li key={doc} className="flex gap-2">
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  {doc}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <SectionHeading className="mt-16" eyebrow="Questions" title="Frequently asked questions" />
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q} className="p-6">
              <h3 className="text-[15px] font-semibold text-ink">{faq.q}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{faq.a}</p>
            </Card>
          ))}
        </div>

        <DemoNotice className="mt-12" />
      </Container>
    </>
  );
};

export const MembershipBenefitsPage: React.FC = () => {
  usePageMeta('Membership Benefits', 'The full set of services and benefits available to members.');
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership Benefits"
        description="A detailed view of what the chamber delivers for member businesses."
        breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Benefits' }]}
      />
      <Container className="py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-6">
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 text-[16px] font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{text}</p>
            </Card>
          ))}
        </div>
        <SectionHeading className="mt-14" eyebrow="Benefits by tier" title="What each tier includes" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {membershipTiers.map((tier) => (
            <Card key={tier.id} className="p-6">
              <h3 className="text-[17px] font-semibold text-ink">{tier.name}</h3>
              <ul className="mt-4 space-y-2 text-[13.5px] text-ink-soft">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-chamber-green" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-12" />
      </Container>
    </>
  );
};

export const MembershipTiersPage: React.FC = () => {
  usePageMeta('Membership Tiers', 'Membership categories, annual fees and included benefits.');
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership Tiers & Fees"
        description="Four categories designed for businesses at different stages. All fees shown are demonstration values pending official confirmation."
        breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Tiers' }]}
      />
      <Container className="py-14">
        <DemoNotice className="mb-8" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {membershipTiers.map((tier) => (
            <Card key={tier.id} className="flex flex-col p-6 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-ink">{tier.name}</h2>
                {tier.slug === 'corporate' && <Badge status="success" label="Popular" />}
              </div>
              <p className="mt-4 font-mono text-[30px] font-semibold tabular-nums leading-none text-brand-deep">
                {formatCurrency(tier.annual_fee, tier.currency).replace('.00', '')}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                per year · demo value
              </p>
              <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{tier.description}</p>
              <ul className="mt-4 space-y-2 text-[13px] text-ink-soft">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chamber-green" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <ButtonLink to="/membership/apply" className="mt-6 w-full">
                Apply for {tier.name}
              </ButtonLink>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
};

export const MembershipRenewalPage: React.FC = () => {
  usePageMeta('Renewal Information', 'How membership renewal, invoicing and payment verification works.');
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Renewal Information"
        description="Membership runs on an annual cycle. Renewal invoices are issued before expiry and payments are verified manually in this version."
        breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Renewal' }]}
      />
      <Container className="py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: 'Renewal notice', text: 'A renewal notice appears in the member portal and is sent to the registered contact ahead of expiry.' },
            { title: 'Invoice issued', text: 'The subscription invoice is issued with a unique invoice number and due date.' },
            { title: 'Payment verification', text: 'Submit your bank transfer reference in the portal. The membership team verifies and marks the invoice paid.' },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <CalendarClock className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 text-[16px] font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.text}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-8 p-6">
          <h2 className="text-[16px] font-semibold text-ink">Payment details</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            Bank account details are configured in site settings by the chamber administrator and are not
            published in this preview. Members receive payment instructions with each invoice.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink to="/portal/payments" variant="outline">Go to portal payments</ButtonLink>
            <ButtonLink to="/contact" variant="ghost">Contact the membership team</ButtonLink>
          </div>
        </Card>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};
