import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Globe, Mail, MapPin, Phone, Search } from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  EmptyState,
  PageHeader,
  SkeletonList,
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { dataProvider } from '@/lib/data/provider';
import { atolls, membershipTiers, sectors } from '@/data/mockSeed';

const PAGE_SIZE = 9;

export const MemberDirectoryPage: React.FC = () => {
  usePageMeta('Member Directory', 'Search MCCI member businesses by sector, atoll and membership tier.');
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => dataProvider.organizations(),
  });

  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('all');
  const [atoll, setAtoll] = useState('all');
  const [tier, setTier] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      organizations
        .filter((o) => o.directory_visible)
        .filter((o) => (verifiedOnly ? o.verification_status === 'verified' : true))
        .filter((o) => (sector === 'all' ? true : o.sector_id === sector))
        .filter((o) => (atoll === 'all' ? true : o.atoll === atoll))
        .filter((o) => (tier === 'all' ? true : o.tier_id === tier))
        .filter((o) =>
          `${o.display_name} ${o.legal_name} ${o.description} ${o.island}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
    [organizations, query, sector, atoll, tier, verifiedOnly],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const resetFilters = () => {
    setQuery('');
    setSector('all');
    setAtoll('all');
    setTier('all');
    setVerifiedOnly(false);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Member Directory"
        description="Search member businesses by name, sector, atoll and membership tier. Only information marked public by each member is displayed."
        breadcrumbs={[{ label: 'Membership', to: '/membership' }, { label: 'Member Directory' }]}
      />
      <Container className="py-14">
        <DemoNotice className="mb-8" />
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <Card className="p-5">
              <h2 className="text-[15px] font-semibold text-ink">Filter results</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="dir-search" className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Keyword
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                    <input
                      id="dir-search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Business name"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="dir-sector" className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Sector
                  </label>
                  <select
                    id="dir-sector"
                    value={sector}
                    onChange={(e) => {
                      setSector(e.target.value);
                      setPage(1);
                    }}
                    className={inputClass}
                  >
                    <option value="all">All sectors</option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dir-atoll" className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Atoll
                  </label>
                  <select
                    id="dir-atoll"
                    value={atoll}
                    onChange={(e) => {
                      setAtoll(e.target.value);
                      setPage(1);
                    }}
                    className={inputClass}
                  >
                    <option value="all">All atolls</option>
                    {atolls.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dir-tier" className="mb-1.5 block text-[13px] font-semibold text-ink">
                    Membership tier
                  </label>
                  <select
                    id="dir-tier"
                    value={tier}
                    onChange={(e) => {
                      setTier(e.target.value);
                      setPage(1);
                    }}
                    className={inputClass}
                  >
                    <option value="all">All tiers</option>
                    {membershipTiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-[13.5px] text-ink">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => {
                      setVerifiedOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="h-4 w-4 rounded border-surface-border text-brand focus:ring-brand"
                  />
                  Verified members only
                </label>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full rounded-md border border-surface-border px-4 py-2 text-[13px] font-semibold text-ink-soft hover:border-brand hover:text-brand-deep"
                >
                  Reset filters
                </button>
              </div>
            </Card>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[14px] text-ink-soft" role="status" aria-live="polite">
                <span className="font-mono font-semibold text-ink">{filtered.length}</span> member
                {filtered.length === 1 ? '' : 's'} found
              </p>
              <p className="text-[13px] text-ink-muted">
                Page {current} of {totalPages}
              </p>
            </div>

            {isLoading ? (
              <SkeletonList rows={4} />
            ) : pageItems.length === 0 ? (
              <EmptyState
                title="No members match these filters"
                description="Try widening your search or resetting the filters."
                action={
                  <button type="button" onClick={resetFilters} className="rounded-md bg-brand px-4 py-2 text-[14px] font-semibold text-white">
                    Reset filters
                  </button>
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((org) => {
                  const sectorName = sectors.find((s) => s.id === org.sector_id)?.name ?? 'Other';
                  const tierName = membershipTiers.find((t) => t.id === org.tier_id)?.name;
                  return (
                    <Card key={org.id} className="flex flex-col p-5 hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-light text-brand">
                          <Building2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <Badge status={org.verification_status} />
                      </div>
                      <h3 className="mt-4 text-[16px] font-semibold leading-snug text-ink">
                        <Link to={`/directory/members/${org.slug}`} className="hover:text-brand">
                          {org.display_name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-[12.5px] text-ink-muted">{sectorName}</p>
                      <p className="mt-3 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-soft">
                        {org.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3 text-[12px] text-ink-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {org.island}
                        </span>
                        {tierName && <span className="font-mono uppercase tracking-wider">{tierName}</span>}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Directory pagination">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={current === 1}
                  className="rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-ink-soft disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    aria-current={current === i + 1 ? 'page' : undefined}
                    className={`h-9 w-9 rounded-md border text-[13px] font-semibold ${
                      current === i + 1
                        ? 'border-brand bg-brand text-white'
                        : 'border-surface-border text-ink-soft hover:border-brand'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={current === totalPages}
                  className="rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-ink-soft disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export const MemberDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { data: org } = useQuery({
    queryKey: ['organization', slug],
    queryFn: () => dataProvider.organization(slug),
  });
  usePageMeta(org?.display_name ?? 'Member profile', org?.description);

  if (!org) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Member profile not found"
          action={<ButtonLink to="/directory/members">Back to the directory</ButtonLink>}
        />
      </Container>
    );
  }

  const sectorName = sectors.find((s) => s.id === org.sector_id)?.name ?? 'Other';
  const tierName = membershipTiers.find((t) => t.id === org.tier_id)?.name;

  return (
    <>
      <PageHeader
        eyebrow="Member profile"
        title={org.display_name}
        description={sectorName}
        breadcrumbs={[
          { label: 'Membership', to: '/membership' },
          { label: 'Member Directory', to: '/directory/members' },
          { label: org.display_name },
        ]}
      />
      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card className="p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={org.verification_status} />
                {tierName && <Badge status="info" label={`${tierName} member`} />}
                <Badge status={org.membership_status} />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-ink">About</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{org.description}</p>

              <h2 className="mt-8 text-xl font-semibold text-ink">Business details</h2>
              <dl className="mt-4 grid gap-5 sm:grid-cols-2">
                {[
                  ['Legal name', org.legal_name],
                  ['Sector', sectorName],
                  ['Year established', String(org.year_established)],
                  ['Employees', org.employee_count],
                  ['Island', org.island],
                  ['Atoll', org.atoll],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                    <dd className="mt-1 text-[15px] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 rounded-md bg-surface-page p-4 text-[13px] text-ink-soft">
                Registration numbers, internal notes and member documents are never displayed publicly.
              </p>
            </Card>
          </div>
          <aside className="space-y-4 lg:col-span-4">
            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Public contact</h2>
              <ul className="mt-4 space-y-3 text-[14px]">
                {org.public_email && (
                  <li className="flex gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    <a href={`mailto:${org.public_email}`} className="text-brand hover:underline">
                      {org.public_email}
                    </a>
                  </li>
                )}
                {org.public_phone && (
                  <li className="flex gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    <span className="text-ink">{org.public_phone}</span>
                  </li>
                )}
                {org.website && (
                  <li className="flex gap-2.5">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                      {org.website.replace('https://', '')}
                    </a>
                  </li>
                )}
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  <span className="text-ink">{org.registered_address}</span>
                </li>
              </ul>
            </Card>
            {org.member_number && (
              <Card className="p-6">
                <h2 className="text-[15px] font-semibold text-ink">Membership</h2>
                <p className="mt-2 font-mono text-[15px] text-brand-deep">{org.member_number}</p>
                <p className="mt-1 text-[12px] text-ink-muted">Demonstration member number</p>
              </Card>
            )}
            <DemoNotice />
          </aside>
        </div>
      </Container>
    </>
  );
};
