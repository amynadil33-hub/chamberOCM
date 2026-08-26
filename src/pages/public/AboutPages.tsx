import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, Download, Eye, FileText, Target, UserRound } from 'lucide-react';
import {
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  PageHeader,
  SectionHeading,
  StatBlock,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { leadership, milestones } from '@/data/mockSeed';
import { siteConfig } from '@/lib/config';

export const AboutPage: React.FC = () => {
  usePageMeta('About MCCI', 'Who we are, what we do and how the chamber serves Maldivian business.');
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About the Maldives National Chamber of Commerce & Industry"
        description="The chamber is the collective voice of Maldivian business — representing enterprise in national policy, connecting members to markets and strengthening private sector capability."
        breadcrumbs={[{ label: 'About' }]}
      />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-semibold text-ink">Our role</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              MCCI represents businesses of every size across the archipelago. Members range from island
              guesthouses, fishing enterprises and family trading companies to national contractors,
              financial institutions, logistics operators and technology firms.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
              The chamber's work is organised through industry councils, a structured policy and advocacy
              programme, economic research, and services that help businesses grow — from trade
              documentation and training to market linkages and MSME support.
            </p>
            <h2 className="mt-10 text-2xl font-semibold text-ink">Organisational structure</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'General membership', text: 'All registered member businesses across the atolls.' },
                { title: 'Board of directors', text: 'Elected representatives providing governance and direction.' },
                { title: 'Industry councils', text: 'Five sector councils leading technical and policy work.' },
                { title: 'Secretariat', text: 'The permanent staff delivering services and operations.' },
              ].map((block) => (
                <Card key={block.title} className="p-5">
                  <Building2 className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-3 text-[15px] font-semibold text-ink">{block.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{block.text}</p>
                </Card>
              ))}
            </div>
            <DemoNotice className="mt-8" />
          </div>
          <aside className="space-y-4 lg:col-span-4">
            {siteConfig.stats.map((stat) => (
              <StatBlock key={stat.label} value={stat.value} label={stat.label} note={stat.note} />
            ))}
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Explore further</h3>
              <ul className="mt-3 space-y-2 text-[14px]">
                {[
                  { label: 'Mission & vision', to: '/about/mission-vision' },
                  { label: 'History & milestones', to: '/about/history' },
                  { label: 'President & board', to: '/about/leadership' },
                  { label: 'Corporate profile', to: '/about/corporate-profile' },
                  { label: 'Industry councils', to: '/councils' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-brand hover:text-brand-dark hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
};

export const MissionVisionPage: React.FC = () => {
  usePageMeta('Mission & Vision', 'The purpose, vision and values guiding the chamber.');
  const values = [
    { title: 'Integrity', text: 'We represent business honestly, transparently and without favour.' },
    { title: 'Inclusion', text: 'Every member business, from every atoll, has a place in the chamber.' },
    { title: 'Evidence', text: 'Our positions are built on data, member consultation and analysis.' },
    { title: 'Enterprise', text: 'We champion the private sector as the engine of national development.' },
    { title: 'Partnership', text: 'We work constructively with government, regulators and partners.' },
    { title: 'Sustainability', text: 'We support long-term, responsible growth for an island economy.' },
  ];
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Mission & Vision"
        description="The purpose, direction and values that guide the chamber's work."
        breadcrumbs={[{ label: 'About', to: '/about' }, { label: 'Mission & Vision' }]}
      />
      <Container className="py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-8">
            <Target className="h-6 w-6 text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-ink">Mission</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              To represent, protect and advance the interests of Maldivian business — creating the
              conditions in which enterprise can invest, employ and compete with confidence.
            </p>
          </Card>
          <Card className="p-8">
            <Eye className="h-6 w-6 text-chamber-green" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-ink">Vision</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
              A diversified, resilient and internationally competitive Maldivian economy powered by a
              confident private sector across every atoll.
            </p>
          </Card>
        </div>
        <SectionHeading className="mt-14" eyebrow="Values" title="How we work" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="p-6">
              <Compass className="h-5 w-5 text-brand" aria-hidden="true" />
              <h3 className="mt-3 text-[16px] font-semibold text-ink">{value.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{value.text}</p>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const HistoryPage: React.FC = () => {
  usePageMeta('History & Milestones', 'How the chamber developed alongside the national economy.');
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="History & Milestones"
        description="A placeholder timeline of the chamber's development. Historic dates require confirmation by the secretariat before publication."
        breadcrumbs={[{ label: 'About', to: '/about' }, { label: 'History' }]}
      />
      <Container className="py-14">
        <DemoNotice className="mb-10" />
        <ol className="relative border-l border-surface-border pl-8">
          {milestones.map((milestone) => (
            <li key={milestone.year} className="mb-10 last:mb-0">
              <span className="absolute -left-[9px] mt-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-brand" aria-hidden="true" />
              <span className="font-mono text-[12px] font-semibold uppercase tracking-wider text-brand">
                {milestone.year}
              </span>
              <h3 className="mt-1 text-[18px] font-semibold text-ink">{milestone.title}</h3>
              <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
};

const PersonCard: React.FC<{ name: string; title: string; bio: string; large?: boolean }> = ({
  name,
  title,
  bio,
  large,
}) => (
  <Card className={large ? 'flex flex-col gap-6 p-8 sm:flex-row' : 'p-6'}>
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-deep to-brand ${
        large ? 'h-40 w-40' : 'h-16 w-16'
      }`}
      aria-hidden="true"
    >
      <UserRound className={large ? 'h-14 w-14 text-white/70' : 'h-7 w-7 text-white/70'} />
    </div>
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-brand">{title}</p>
      <h3 className={`mt-1 font-semibold text-ink ${large ? 'text-2xl' : 'text-[16px]'}`}>{name}</h3>
      <p className={`mt-2 leading-relaxed text-ink-soft ${large ? 'text-[15px]' : 'text-[13.5px]'}`}>{bio}</p>
    </div>
  </Card>
);

export const LeadershipPage: React.FC = () => {
  usePageMeta('President & Board', 'Governance, board membership and the chamber secretariat.');
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="President & Board"
        description="Governance of the chamber rests with an elected board, supported by a permanent secretariat."
        breadcrumbs={[{ label: 'About', to: '/about' }, { label: 'Leadership' }]}
      />
      <Container className="py-14">
        <DemoNotice className="mb-10" />
        <SectionHeading eyebrow="Office of the President" title="President" />
        <PersonCard large {...leadership.president} />

        <SectionHeading className="mt-14" eyebrow="Governance" title="Board of directors" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.board.map((member) => (
            <PersonCard key={member.id} name={member.name} title={member.title} bio={member.bio} />
          ))}
        </div>

        <SectionHeading className="mt-14" eyebrow="Operations" title="Secretariat & executive management" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.secretariat.map((member) => (
            <PersonCard key={member.id} name={member.name} title={member.title} bio={member.bio} />
          ))}
        </div>
      </Container>
    </>
  );
};

export const CorporateProfilePage: React.FC = () => {
  usePageMeta('Corporate Profile', 'Chamber corporate profile, media resources and brand assets.');
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Corporate Profile & Media Resources"
        description="Downloadable chamber profile, factsheets and brand assets for members, media and partners."
        breadcrumbs={[{ label: 'About', to: '/about' }, { label: 'Corporate Profile' }]}
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'MCCI corporate profile', note: 'PDF placeholder · to be supplied', icon: FileText },
            { title: 'Chamber factsheet', note: 'PDF placeholder · to be supplied', icon: FileText },
            { title: 'Logo & brand guidance', note: 'Asset pack placeholder', icon: Download },
          ].map(({ title, note, icon: Icon }) => (
            <Card key={title} className="p-6">
              <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
              <h3 className="mt-4 text-[16px] font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">{note}</p>
              <button
                type="button"
                onClick={() =>
                  window.alert(
                    'Document placeholder. Upload the approved file in the admin media library before launch.',
                  )
                }
                className="mt-5 w-full rounded-md border border-surface-border px-4 py-2.5 text-[13.5px] font-semibold text-brand-deep transition-colors hover:border-brand hover:bg-brand-light"
              >
                Download placeholder
              </button>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-10" />
        <div className="mt-10">
          <ButtonLink to="/contact" variant="outline">
            Media enquiries
          </ButtonLink>
        </div>
      </Container>
    </>
  );
};
