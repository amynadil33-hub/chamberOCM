import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Cpu,
  Fish,
  Globe2,
  Handshake,
  HardHat,
  Newspaper,
  Palmtree,
  Scale,
  Ship,
  Sprout,
  Users,
} from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoBadge,
  Logo,
  SectionHeading,
  StatBlock,
  buttonClass,
} from '@/components/common/ui';
import { NewsletterForm } from '@/components/layout/Footer';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { dataProvider } from '@/lib/data/provider';
import { LOGO_URL, siteConfig } from '@/lib/config';
import { formatCurrency, formatDate, isUpcoming } from '@/lib/utils/format';
import { membershipTiers } from '@/data/mockSeed';

const councilIcons: Record<string, React.ElementType> = { Cpu, Palmtree, HardHat, Fish, Ship };

const HeroPattern: React.FC = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
    viewBox="0 0 1200 600"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#526FBD" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} cx={900 - i * 30} cy={300} r={90 + i * 55} stroke="url(#hero-line)" strokeWidth="1" fill="none" />
    ))}
    {[
      [760, 190],
      [880, 250],
      [1010, 200],
      [820, 360],
      [960, 400],
      [1090, 330],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="5" fill="#FFFFFF" />
        <circle cx={cx} cy={cy} r="14" stroke="#FFFFFF" strokeWidth="0.75" fill="none" opacity="0.5" />
      </g>
    ))}
    <path
      d="M760 190 L880 250 L1010 200 M880 250 L820 360 L960 400 L1090 330 M960 400 L1010 200"
      stroke="#FFFFFF"
      strokeWidth="0.9"
      opacity="0.5"
      fill="none"
    />
    <path d="M0 520 Q 300 470 600 520 T 1200 500" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.25" fill="none" />
    <path d="M0 560 Q 300 510 600 560 T 1200 540" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.15" fill="none" />
  </svg>
);

/**
 * AppLayout is the home page content for the "/" route.
 * Header, footer and the demo-mode badge are supplied by PublicLayout.
 */
const AppLayout: React.FC = () => {
  usePageMeta('Advancing Maldivian Enterprise', siteConfig.defaultSeoDescription);

  const { data: councils = [] } = useQuery({ queryKey: ['councils'], queryFn: () => dataProvider.councils() });
  const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: () => dataProvider.news() });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const { data: policy = [] } = useQuery({ queryKey: ['policy'], queryFn: () => dataProvider.policyItems() });
  const { data: publications = [] } = useQuery({ queryKey: ['publications'], queryFn: () => dataProvider.publications() });
  const { data: msme = [] } = useQuery({ queryKey: ['msme'], queryFn: () => dataProvider.msmePrograms() });
  const { data: partners = [] } = useQuery({ queryKey: ['partners'], queryFn: () => dataProvider.partners() });

  const upcoming = events.filter((e) => isUpcoming(e.starts_at)).slice(0, 3);
  const featuredNews = news[0];
  const otherNews = news.slice(1, 4);
  const featuredPublication = publications.find((p) => p.featured) ?? publications[0];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-deep via-brand-dark to-brand text-white">
        <HeroPattern />
        <Container className="relative py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                National business representation
              </span>
              <h1 className="mt-6 text-[38px] font-semibold leading-[1.08] sm:text-[52px] lg:text-[58px]">
                Advancing Maldivian Enterprise
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80">
                Representing business, strengthening industries and building a more competitive Maldives.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/membership/apply" className={buttonClass('secondary', 'px-6 py-3 text-[15px]')}>
                  Become a Member
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about"
                  className={buttonClass(
                    'outline',
                    'border-white/25 bg-white/10 px-6 py-3 text-[15px] text-white hover:border-white/40 hover:bg-white/20',
                  )}
                >
                  Explore MCCI
                </Link>
              </div>
              <dl className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {siteConfig.stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-white/15 bg-white/5 p-4">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-mono text-2xl font-semibold tabular-nums text-white">{stat.value}</span>
                      <span className="mt-1 block text-[12px] text-white/70">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur-sm">
                <div className="flex justify-center">
                  <img
                    src={LOGO_URL}
                    alt="Maldives National Chamber of Commerce & Industry official emblem"
                    className="h-44 w-auto rounded-lg object-contain"
                    width={405}
                    height={341}
                  />
                </div>
                <p className="mt-6 text-center text-[13px] leading-relaxed text-white/75">
                  The chamber convenes business across five industry councils, 26 atolls and every major sector of the
                  national economy.
                </p>
                <Link
                  to="/directory/members"
                  className="mt-5 flex items-center justify-center gap-2 rounded-md border border-white/20 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Browse the member directory
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INTRODUCTION */}
      <section className="border-b border-surface-border bg-white py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">The chamber</p>
              <h2 className="text-2xl font-semibold leading-tight text-ink sm:text-[34px]">
                The national voice of Maldivian business
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
                The Maldives National Chamber of Commerce &amp; Industry brings together enterprises of every size — from
                island guesthouses and family trading businesses to national contractors, financial institutions and
                technology firms. The chamber represents their interests in national policy, connects them to markets and
                partners, and builds the capability of the private sector.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
                Our work is delivered through industry councils, structured policy engagement, research and a year-round
                programme of forums, training and business services.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to="/about" variant="outline">About the chamber</ButtonLink>
                <ButtonLink to="/policy" variant="ghost">
                  Policy &amp; advocacy
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Scale, title: 'Advocacy', text: 'Evidence-based representation to government and regulators.' },
                  { icon: Users, title: 'Councils', text: 'Five industry councils driving sector-specific work.' },
                  { icon: Globe2, title: 'Trade', text: 'Market access, documentation and international linkages.' },
                  { icon: Sprout, title: 'MSME support', text: 'Programmes for micro, small and medium enterprises.' },
                ].map(({ icon: Icon, title, text }) => (
                  <Card key={title} className="p-5 hover:-translate-y-0.5 hover:shadow-md">
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    <h3 className="mt-3 text-[15px] font-semibold text-ink">{title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{text}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* COUNCILS */}
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Industry councils"
            title="Sector leadership across the economy"
            description="Councils convene members within a sector to set priorities, shape policy positions and deliver practical programmes."
            action={<ButtonLink to="/councils" variant="outline">All councils</ButtonLink>}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {councils.map((council) => {
              const Icon = councilIcons[council.icon_name] ?? Building2;
              return (
                <Link
                  key={council.id}
                  to={`/councils/${council.slug}`}
                  className="group rounded-lg border border-surface-border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-light text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[16px] font-semibold text-ink group-hover:text-brand-deep">{council.name}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">{council.short_description}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {council.member_count_display} participating members
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* NEWS */}
      <section className="border-y border-surface-border bg-white py-16">
        <Container>
          <SectionHeading
            eyebrow="News & media"
            title="Latest from the chamber"
            action={<ButtonLink to="/news" variant="outline">All news</ButtonLink>}
          />
          <div className="grid gap-6 lg:grid-cols-12">
            {featuredNews && (
              <Card className="overflow-hidden lg:col-span-7">
                <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-brand-deep to-brand">
                  <Newspaper className="h-10 w-10 text-white/70" aria-hidden="true" />
                  <span className="absolute left-4 top-4">
                    <Badge status="published" label={featuredNews.category} />
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    <time dateTime={featuredNews.published_at}>{formatDate(featuredNews.published_at)}</time>
                    <span>·</span>
                    <span>{featuredNews.author_display_name}</span>
                    {featuredNews.is_demo && <DemoBadge />}
                  </div>
                  <h3 className="mt-3 text-[22px] font-semibold leading-snug text-ink">
                    <Link to={`/news/${featuredNews.slug}`} className="hover:text-brand">{featuredNews.title}</Link>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{featuredNews.excerpt}</p>
                  <Link
                    to={`/news/${featuredNews.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-brand hover:text-brand-dark"
                  >
                    Read the update
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            )}
            <div className="space-y-4 lg:col-span-5">
              {otherNews.map((post) => (
                <Card key={post.id} className="p-5 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                    <span>·</span>
                    <span>{post.category}</span>
                  </div>
                  <h3 className="mt-2 text-[16px] font-semibold leading-snug text-ink">
                    <Link to={`/news/${post.slug}`} className="hover:text-brand">{post.title}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">{post.excerpt}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* EVENTS */}
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Events"
            title="Upcoming engagement"
            description="Forums, briefings, training and council sessions across the national business calendar."
            action={<ButtonLink to="/events" variant="outline">Events calendar</ButtonLink>}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {upcoming.map((event) => (
              <Card key={event.id} className="flex flex-col p-5 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-md border border-surface-border bg-surface-page px-3 py-2 text-center">
                    <span className="block font-mono text-lg font-semibold leading-none text-brand-deep">
                      {formatDate(event.starts_at, 'dd')}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      {formatDate(event.starts_at, 'MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge status="published" label={event.event_type} />
                    {event.member_only && <Badge status="info" label="Members only" />}
                  </div>
                </div>
                <h3 className="mt-4 text-[16px] font-semibold leading-snug text-ink">
                  <Link to={`/events/${event.slug}`} className="hover:text-brand">{event.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{event.summary}</p>
                <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4 text-[12px] text-ink-muted">
                  <span>{event.island}</span>
                  <span className="font-mono">{event.fee > 0 ? formatCurrency(event.fee) : 'No fee'}</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section className="border-y border-surface-border bg-white py-16">
        <Container>
          <SectionHeading
            eyebrow="Membership"
            title="What membership delivers"
            description="Four membership categories designed for businesses at different stages of growth."
            action={<ButtonLink to="/membership/tiers" variant="outline">Compare tiers</ButtonLink>}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {membershipTiers.map((tier) => (
              <Card key={tier.id} className="flex flex-col p-6 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-ink">{tier.name}</h3>
                  <BadgeCheck className="h-5 w-5 text-chamber-green" aria-hidden="true" />
                </div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-brand-deep">
                  {tier.currency} {tier.annual_fee.toLocaleString()}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">per year · demo value</p>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{tier.description}</p>
                <ul className="mt-4 space-y-1.5 text-[13px] text-ink-soft">
                  {tier.benefits.slice(0, 3).map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-chamber-green" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link to="/membership/apply" className={buttonClass('outline', 'mt-5 w-full')}>
                  Apply for {tier.name}
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* POLICY TRACKER */}
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Policy & advocacy"
            title="Advocacy tracker"
            description="Live view of the chamber's demonstration policy positions and their engagement progress."
            action={<ButtonLink to="/policy" variant="outline">Policy priorities</ButtonLink>}
          />
          <Card className="divide-y divide-surface-border">
            {policy.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {item.reference_number}
                    </span>
                    <Badge status="info" label={item.position_status} />
                  </div>
                  <h3 className="mt-1.5 text-[15.5px] font-semibold text-ink">
                    <Link to={`/policy/positions/${item.slug}`} className="hover:text-brand">{item.title}</Link>
                  </h3>
                  <p className="mt-1 text-[13px] text-ink-soft">{item.category}</p>
                </div>
                <div className="w-full sm:w-64">
                  <div className="flex items-center justify-between text-[11px] font-medium text-ink-soft">
                    <span>Engagement progress</span>
                    <span className="font-mono tabular-nums">{item.progress_percent}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-page">
                    <div className="h-full rounded-full bg-chamber-green transition-all" style={{ width: `${item.progress_percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Container>
      </section>

      {/* PUBLICATION + MSME */}
      <section className="border-y border-surface-border bg-white py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Publications" title="Featured publication" className="mb-6" />
              {featuredPublication && (
                <Card className="overflow-hidden">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-deep to-brand">
                    <BookOpen className="h-10 w-10 text-white/70" aria-hidden="true" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      <Badge status="published" label="Annual report" />
                      <DemoBadge />
                    </div>
                    <h3 className="mt-3 text-[19px] font-semibold text-ink">{featuredPublication.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{featuredPublication.summary}</p>
                    <div className="mt-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      <span>{formatDate(featuredPublication.published_at)}</span>
                      <span>{featuredPublication.page_count} pages</span>
                    </div>
                    <Link to={`/publications/${featuredPublication.slug}`} className={buttonClass('outline', 'mt-5 w-full')}>
                      View publication
                    </Link>
                  </div>
                </Card>
              )}
            </div>
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="MSME support"
                title="Programmes for smaller businesses"
                action={<ButtonLink to="/msme/programs" variant="outline">All programmes</ButtonLink>}
                className="mb-6"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {msme.slice(0, 4).map((program) => (
                  <Card key={program.id} className="p-5 hover:-translate-y-0.5 hover:shadow-md">
                    <Sprout className="h-5 w-5 text-chamber-green" aria-hidden="true" />
                    <h3 className="mt-3 text-[15px] font-semibold text-ink">{program.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">{program.summary}</p>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      Applications close {formatDate(program.deadline)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PARTNERS */}
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Partners"
            title="Patron and strategic partners"
            description="Placeholder partner records. No third-party logos are used until written permission is confirmed."
            action={<ButtonLink to="/partners" variant="outline">Partner programme</ButtonLink>}
          />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <Card key={partner.id} className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                <Handshake className="h-6 w-6 text-brand" aria-hidden="true" />
                <p className="text-[13px] font-semibold text-ink">{partner.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{partner.partner_type}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* NEWSLETTER + CONTACT CTA */}
      <section className="bg-gradient-to-br from-brand-deep via-brand-dark to-brand py-16 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Logo variant="light" showText={false} />
              <h2 className="mt-6 text-[30px] font-semibold leading-tight">Join the national conversation on business</h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
                Membership connects your business to policy makers, industry peers and practical support. Speak with the
                membership team or start an application online.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/membership/apply" className={buttonClass('secondary', 'px-6 py-3')}>
                  Start an application
                </Link>
                <Link
                  to="/contact"
                  className={buttonClass('outline', 'border-white/25 bg-white/10 px-6 py-3 text-white hover:bg-white/20')}
                >
                  Contact the secretariat
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <StatBlock light value="5" label="Industry councils" />
                <StatBlock light value="26" label="Atolls represented" note="Demo value" />
                <StatBlock light value="30+" label="Years of service" note="Demo value" />
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-xl bg-white p-7 text-ink shadow-xl">
                <div className="mb-1 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                    Business bulletin
                  </span>
                </div>
                <h3 className="text-[20px] font-semibold text-ink">Stay informed</h3>
                <p className="mb-5 mt-1 text-[13.5px] text-ink-soft">
                  Policy updates, event invitations and member notices delivered to your inbox.
                </p>
                <NewsletterForm source="homepage-newsletter" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AppLayout;
