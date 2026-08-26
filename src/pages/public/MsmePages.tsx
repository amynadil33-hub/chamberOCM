import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Banknote, Building2, GraduationCap, HandCoins, Sprout, Ship as ShipIcon, Users } from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  EmptyState,
  PageHeader,
  SectionHeading,
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { dataProvider } from '@/lib/data/provider';
import { sectors } from '@/data/mockSeed';
import { formatDate, isUpcoming } from '@/lib/utils/format';

const classifications = [
  { title: 'Micro enterprise', text: 'Up to 5 employees. Typically owner-operated island businesses.', icon: Sprout },
  { title: 'Small enterprise', text: '6 – 30 employees with established local operations.', icon: Building2 },
  { title: 'Medium enterprise', text: '31 – 100 employees, often trading across multiple atolls.', icon: Users },
];

const supportTypes = [
  { title: 'Grants', text: 'Placeholder grant windows delivered with development partners.', icon: HandCoins },
  { title: 'Loans & finance', text: 'Guidance on accessing working capital and finance products.', icon: Banknote },
  { title: 'Training', text: 'Practical business, finance and compliance training.', icon: GraduationCap },
  { title: 'Mentorship', text: 'Structured mentoring with experienced business leaders.', icon: Users },
  { title: 'Export support', text: 'Export readiness, documentation and buyer engagement.', icon: ShipIcon },
  { title: 'Advisory helpdesk', text: 'Compliance and registration guidance for small businesses.', icon: Building2 },
];

export const MsmePage: React.FC = () => {
  usePageMeta('MSME Portal', 'Support programmes, classifications and services for smaller businesses.');
  const { data: programs = [] } = useQuery({ queryKey: ['msme'], queryFn: () => dataProvider.msmePrograms() });
  return (
    <>
      <PageHeader
        eyebrow="MSME portal"
        title="Micro, Small & Medium Enterprise Portal"
        description="Dedicated support for the businesses that make up the majority of Maldivian enterprise — practical programmes, finance guidance and market access."
        breadcrumbs={[{ label: 'MSME Portal' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/msme/programs" className="rounded-md bg-chamber-green px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-chamber-green-dark">
            Browse programmes
          </Link>
          <Link to="/msme/directory" className="rounded-md border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-white/20">
            MSME directory
          </Link>
        </div>
      </PageHeader>

      <Container className="py-14">
        <SectionHeading eyebrow="Classification" title="Business classifications" />
        <div className="grid gap-4 md:grid-cols-3">
          {classifications.map(({ title, text, icon: Icon }) => (
            <Card key={title} className="p-6">
              <Icon className="h-5 w-5 text-chamber-green" aria-hidden="true" />
              <h2 className="mt-3 text-[16px] font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{text}</p>
            </Card>
          ))}
        </div>

        <SectionHeading className="mt-14" eyebrow="Support" title="How the chamber supports MSMEs" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportTypes.map(({ title, text, icon: Icon }) => (
            <Card key={title} className="p-6">
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 text-[16px] font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{text}</p>
            </Card>
          ))}
        </div>

        <SectionHeading
          className="mt-14"
          eyebrow="Programmes"
          title="Featured programmes"
          action={<ButtonLink to="/msme/programs" variant="outline">All programmes</ButtonLink>}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {programs.slice(0, 4).map((program) => (
            <Card key={program.id} className="p-6">
              <Badge status="published" label={program.program_type} className="self-start" />
              <h3 className="mt-3 text-[16px] font-semibold text-ink">{program.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{program.summary}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                Provider: {program.provider} · Closes {formatDate(program.deadline)}
              </p>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-12" />
      </Container>
    </>
  );
};

export const MsmeProgramsPage: React.FC = () => {
  usePageMeta('MSME Programmes', 'Grants, loans, training, mentorship and export support programmes.');
  const { data: programs = [] } = useQuery({ queryKey: ['msme'], queryFn: () => dataProvider.msmePrograms() });
  const [type, setType] = useState('all');
  const types = ['all', ...Array.from(new Set(programs.map((p) => p.program_type)))];
  const filtered = type === 'all' ? programs : programs.filter((p) => p.program_type === type);

  return (
    <>
      <PageHeader
        eyebrow="MSME portal"
        title="Support Programmes"
        description="Programmes supporting micro, small and medium enterprises across the atolls."
        breadcrumbs={[{ label: 'MSME Portal', to: '/msme' }, { label: 'Programmes' }]}
      />
      <Container className="py-14">
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter programmes">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold capitalize transition-colors ${
                type === t
                  ? 'border-brand bg-brand text-white'
                  : 'border-surface-border bg-white text-ink-soft hover:border-brand hover:text-brand-deep'
              }`}
            >
              {t === 'all' ? 'All programme types' : t}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((program) => (
            <Card key={program.id} className="flex flex-col p-6 hover:-translate-y-0.5 hover:shadow-md">
              <Badge status="published" label={program.program_type} className="self-start" />
              <h2 className="mt-3 text-[16.5px] font-semibold text-ink">{program.title}</h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{program.summary}</p>
              <dl className="mt-4 space-y-2 border-t border-surface-border pt-4 text-[12.5px]">
                <div>
                  <dt className="text-ink-muted">Provider</dt>
                  <dd className="text-ink">{program.provider}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Eligibility</dt>
                  <dd className="text-ink-soft">{program.eligibility}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Application deadline</dt>
                  <dd className="font-mono text-ink">{formatDate(program.deadline)}</dd>
                </div>
              </dl>
              <ButtonLink to="/contact" variant="outline" className="mt-5 w-full">
                Enquire about this programme
              </ButtonLink>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const MsmeDirectoryPage: React.FC = () => {
  usePageMeta('MSME Directory', 'Smaller member businesses across the atolls.');
  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => dataProvider.organizations(),
  });
  const [query, setQuery] = useState('');
  const msmeOrgs = organizations
    .filter((o) => o.directory_visible && ['1 – 5', '6 – 20', '21 – 50'].includes(o.employee_count))
    .filter((o) => o.display_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeader
        eyebrow="MSME portal"
        title="MSME Directory"
        description="Smaller member businesses listed by sector and island. Demonstration records only."
        breadcrumbs={[{ label: 'MSME Portal', to: '/msme' }, { label: 'Directory' }]}
      />
      <Container className="py-14">
        <div className="mb-6 max-w-md">
          <label htmlFor="msme-search" className="mb-1.5 block text-[13px] font-semibold text-ink">
            Search MSME businesses
          </label>
          <input
            id="msme-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClass}
            placeholder="Business name"
          />
        </div>
        {msmeOrgs.length === 0 ? (
          <EmptyState title="No businesses match your search" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {msmeOrgs.map((org) => (
              <Card key={org.id} className="p-5 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <Building2 className="h-5 w-5 text-brand" aria-hidden="true" />
                  <Badge status={org.verification_status} />
                </div>
                <h2 className="mt-3 text-[16px] font-semibold text-ink">
                  <Link to={`/directory/members/${org.slug}`} className="hover:text-brand">
                    {org.display_name}
                  </Link>
                </h2>
                <p className="mt-1 text-[12.5px] text-ink-muted">
                  {sectors.find((s) => s.id === org.sector_id)?.name} · {org.island}
                </p>
                <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">{org.description}</p>
              </Card>
            ))}
          </div>
        )}
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const MsmeEventsPage: React.FC = () => {
  usePageMeta('MSME Events', 'Training, clinics and networking sessions for smaller businesses.');
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const msmeEvents = events.filter((e) => ['training', 'webinar', 'exhibition'].includes(e.event_type));
  return (
    <>
      <PageHeader
        eyebrow="MSME portal"
        title="MSME Events & Training"
        description="Practical sessions designed for micro, small and medium enterprises."
        breadcrumbs={[{ label: 'MSME Portal', to: '/msme' }, { label: 'Events' }]}
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {msmeEvents.map((event) => (
            <Card key={event.id} className="flex flex-col p-5">
              <Badge status="published" label={event.event_type} className="self-start" />
              <h2 className="mt-3 text-[16px] font-semibold text-ink">
                <Link to={`/events/${event.slug}`} className="hover:text-brand">
                  {event.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{event.summary}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {formatDate(event.starts_at)} · {isUpcoming(event.starts_at) ? 'Upcoming' : 'Past'}
              </p>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};
