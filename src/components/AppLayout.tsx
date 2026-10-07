import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Globe2,
  Handshake,
  Mail,
  Newspaper,
  Phone,
  Scale,
  Sprout,
  Users,
  Wrench,
} from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  Logo,
  SectionHeading,
  buttonClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { LOGO_URL, siteConfig } from '@/lib/config';
import { formatDate } from '@/lib/utils/format';
import { membershipTiers, newsPosts, partners } from '@/data/mockSeed';

const UnderDevelopmentPanel: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <Card className={`flex min-h-44 flex-col items-center justify-center p-8 text-center ${className ?? ''}`}>
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand">
      <Wrench className="h-5 w-5" aria-hidden="true" />
    </span>
    <h3 className="mt-4 text-[18px] font-semibold text-ink">Under Development</h3>
    <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">{text}</p>
  </Card>
);

const HeroPattern: React.FC = () => (
  <svg
    className="hero-network pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
    viewBox="0 0 1200 600"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="55%" stopColor="#67E8F9" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.2" />
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
      <g key={i} className="hero-pulse-node" style={{ animationDelay: `${i * 0.35}s` }}>
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
  usePageMeta('Promoting commerce and public welfare', siteConfig.defaultSeoDescription);

  const featuredNews = newsPosts[0];
  const otherNews = newsPosts.slice(1, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#101f46_0%,#334fa4_48%,#087b77_100%)] text-white">
        <div className="hero-orb hero-orb-one pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" aria-hidden="true" />
        <div className="hero-orb hero-orb-two pointer-events-none absolute right-[8%] top-[-6rem] h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" aria-hidden="true" />
        <div className="hero-orb hero-orb-three pointer-events-none absolute bottom-[-9rem] left-[42%] h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" aria-hidden="true" />
        <HeroPattern />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-deep/30 to-transparent" aria-hidden="true" />
        <Container className="relative py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="hero-rise inline-flex items-center gap-2 rounded-full border border-cyan-100/25 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-50 backdrop-blur-sm">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                Maldives National Chamber of Commerce &amp; Industry
              </span>
              <h1 className="hero-rise hero-delay-1 mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[54px] lg:text-[62px]">
                Promoting commerce
                <span className="block bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
                  and public welfare
                </span>
              </h1>
              <p className="hero-rise hero-delay-2 mt-5 max-w-xl text-[17px] leading-relaxed text-white/78 sm:text-[18px]">
                Supporting commerce, industry, trade and business connections in the Maldives.
              </p>
              <div className="hero-rise hero-delay-3 mt-8 flex flex-wrap gap-3">
                <Link to="/membership/apply" className={buttonClass('secondary', 'rounded-full px-6 py-3 text-[15px] shadow-[0_12px_30px_rgba(15,97,67,0.28)]')}>
                  View membership application
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about"
                  className={buttonClass(
                    'outline',
                    'rounded-full border-white/25 bg-white/10 px-6 py-3 text-[15px] text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/20',
                  )}
                >
                  Explore MNCCI
                </Link>
              </div>
              <div className="hero-rise hero-delay-4 mt-12 grid gap-3 sm:grid-cols-3">
                {['Business information', 'Trade connections', 'Member engagement'].map((label) => (
                  <div key={label} className="rounded-xl border border-white/15 bg-white/[0.07] p-4 text-[13px] font-medium text-white/80 backdrop-blur-sm">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-rise hero-delay-2 lg:col-span-5">
              <div className="hero-float relative mx-auto max-w-sm rounded-[1.75rem] border border-white/20 bg-white/[0.11] p-8 shadow-[0_30px_80px_rgba(8,20,58,0.30)] backdrop-blur-md">
                <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full border border-cyan-200/25" aria-hidden="true" />
                <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full border border-emerald-200/20" aria-hidden="true" />
                <div className="flex justify-center">
                  <img
                    src={LOGO_URL}
                    alt="Maldives National Chamber of Commerce & Industry official emblem"
                    className="relative h-44 w-auto rounded-lg object-contain drop-shadow-[0_16px_24px_rgba(10,28,66,0.3)]"
                    width={405}
                    height={341}
                  />
                </div>
                <p className="mt-6 text-center text-[13px] leading-relaxed text-white/75">
                  An independent, membership-driven organisation supporting commerce and industry in the Maldives.
                </p>
                <Link
                  to="/membership"
                  className="relative mt-5 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Explore membership
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
                Supporting commerce and industry
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
                The Maldives National Chamber of Commerce &amp; Industry is an independent, membership-driven organisation
                that promotes commerce and industry and supports trade, business and public welfare.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
                MNCCI provides business information, creates opportunities for commercial connections and maintains
                relationships with local and international organisations.
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
                  { icon: Scale, title: 'Representation', text: 'A platform for business views and engagement.' },
                  { icon: Users, title: 'Membership', text: 'Connections with members and business leaders.' },
                  { icon: Globe2, title: 'Trade', text: 'Links with local and international business groups.' },
                  { icon: Sprout, title: 'Enterprise', text: 'Information and opportunities supporting business activity.' },
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
            title="Industry council information"
            description="The council structure remains part of MNCCI, while current council names and details are being confirmed."
            action={<ButtonLink to="/councils" variant="outline">All councils</ButtonLink>}
          />
          <UnderDevelopmentPanel text="Council names, leadership and current programme details are being updated." />
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
            description="The current MNCCI events programme is being prepared for publication."
            action={<ButtonLink to="/events" variant="outline">Events calendar</ButtonLink>}
          />
          <UnderDevelopmentPanel text="Approved event dates, venues and registration information will appear here." />
        </Container>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section className="border-y border-surface-border bg-white py-16">
        <Container>
          <SectionHeading
            eyebrow="Membership"
            title="Proposed membership tiers"
            description="These proposed categories and prices are subject to approval through an AGM."
            action={<ButtonLink to="/membership/tiers" variant="outline">View tier details</ButtonLink>}
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
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">proposed annual price</p>
                <Link to="/membership/apply" className={buttonClass('outline', 'mt-5 w-full')}>
                  View application
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
            title="Policy & advocacy"
            description="Current policy positions and submissions are being reviewed before publication."
            action={<ButtonLink to="/policy" variant="outline">Policy priorities</ButtonLink>}
          />
          <UnderDevelopmentPanel text="Approved policy priorities, positions and submissions will be published here." />
        </Container>
      </section>

      {/* PUBLICATION + MSME */}
      <section className="border-y border-surface-border bg-white py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Publications" title="Featured publication" className="mb-6" />
              <UnderDevelopmentPanel text="Approved publications and annual reports are being prepared for this section." className="min-h-72" />
            </div>
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="MSME support"
                title="Programmes for smaller businesses"
                action={<ButtonLink to="/msme/programs" variant="outline">All programmes</ButtonLink>}
                className="mb-6"
              />
              <UnderDevelopmentPanel text="Current MNCCI programmes and application information are being updated." className="min-h-72" />
            </div>
          </div>
        </Container>
      </section>

      {/* PARTNERS */}
      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Affiliations"
            title="Affiliations & partners"
            description="Publicly identified international affiliations and technology partnership."
            action={<ButtonLink to="/partners" variant="outline">View affiliations</ButtonLink>}
          />
          <div className="grid gap-3 sm:grid-cols-3">
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
              <h2 className="mt-6 text-[30px] font-semibold leading-tight">Connect with MNCCI</h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
                Learn about membership or contact the chamber using the confirmed public details.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/membership/apply" className={buttonClass('secondary', 'px-6 py-3')}>
                  Review application steps
                </Link>
                <Link
                  to="/contact"
                  className={buttonClass('outline', 'border-white/25 bg-white/10 px-6 py-3 text-white hover:bg-white/20')}
                >
                  Contact the secretariat
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-xl bg-white p-7 text-ink shadow-xl">
                <div className="mb-1 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-brand" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                    Contact details
                  </span>
                </div>
                <h3 className="text-[20px] font-semibold text-ink">MNCCI office</h3>
                <div className="mt-5 space-y-4 text-[14px] text-ink-soft">
                  <p className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" /><a href={`tel:${siteConfig.phone}`} className="hover:underline">{siteConfig.phone}</a></p>
                  <p className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" /><a href={`mailto:${siteConfig.generalEmail}`} className="hover:underline">{siteConfig.generalEmail}</a></p>
                  <p>{siteConfig.address}</p>
                  <p>{siteConfig.officeHours}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AppLayout;
