import React from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  CalendarClock,
  Globe2,
  Handshake,
  Scale,
  Users,
} from 'lucide-react';
import {
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
  { icon: Scale, title: 'Business representation', text: 'Opportunities for member views and concerns to be heard in government consultation.' },
  { icon: Users, title: 'Business connections', text: 'Access to business leaders, government officials and other members.' },
  { icon: Globe2, title: 'International links', text: 'Connections with local and international business groups and foreign chambers.' },
  { icon: Handshake, title: 'Events and delegations', text: 'Invitations to seminars, workshops, dialogue sessions and meetings with trade delegations.' },
];

export const MembershipPage: React.FC = () => {
  usePageMeta('Membership', 'Why businesses join MNCCI and how to apply.');
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership of the Chamber"
        description="Membership is open to people and organisations engaged in commerce, industry, banking, trade development and trade-related services."
        breadcrumbs={[{ label: 'Membership' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/membership/apply" className="rounded-md bg-chamber-green px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-chamber-green-dark">
            Review application steps
          </Link>
          <Link to="/membership/tiers" className="rounded-md border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-white/20">
            View proposed tiers
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

        <SectionHeading className="mt-16" eyebrow="Eligibility" title="Who can apply" />
        <div className="grid gap-6">
          <Card className="p-6">
            <h3 className="text-[16px] font-semibold text-ink">Eligibility</h3>
            <ul className="mt-3 space-y-2 text-[14px] text-ink-soft">
              {[
                'People and organisations engaged in commercial activities or operating factories',
                'Industrialists, bankers and those involved in developing trade',
                'People and organisations associated with trade or providing trade-related services',
                'Applicants who accept MNCCI’s Articles of Association and administrative procedure',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-chamber-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
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
      </Container>
    </>
  );
};

export const MembershipTiersPage: React.FC = () => {
  usePageMeta('Proposed Membership Tiers', 'Proposed membership categories and annual prices subject to approval through an AGM.');
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Proposed Membership Tiers & Prices"
        description="These proposed categories and prices are subject to approval through an AGM."
        breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Tiers' }]}
      />
      <Container className="py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {membershipTiers.map((tier) => (
            <Card key={tier.id} className="flex flex-col p-6 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-ink">{tier.name}</h2>
              </div>
              <p className="mt-4 font-mono text-[30px] font-semibold tabular-nums leading-none text-brand-deep">
                {formatCurrency(tier.annual_fee, tier.currency).replace('.00', '')}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                proposed annual price
              </p>
              <ButtonLink to="/membership/apply" className="mt-6 w-full">
                View application
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
