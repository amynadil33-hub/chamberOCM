import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Cpu, Fish, HardHat, Mail, Palmtree, Ship, Users } from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  EmptyState,
  Markdown,
  PageHeader,
  SectionHeading,
  SkeletonList,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { dataProvider } from '@/lib/data/provider';
import { formatDate, isUpcoming } from '@/lib/utils/format';

const icons: Record<string, React.ElementType> = { Cpu, Palmtree, HardHat, Fish, Ship };

export const CouncilsPage: React.FC = () => {
  usePageMeta('Industry Councils', 'Five industry councils leading sector policy and programmes.');
  const { data: councils = [], isLoading } = useQuery({
    queryKey: ['councils'],
    queryFn: () => dataProvider.councils(),
  });

  return (
    <>
      <PageHeader
        eyebrow="Councils"
        title="Industry Councils"
        description="Councils bring members together within a sector to set priorities, develop policy positions and deliver practical programmes."
        breadcrumbs={[{ label: 'Councils' }]}
      />
      <Container className="py-14">
        {isLoading ? (
          <SkeletonList rows={4} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {councils.map((council) => {
              const Icon = icons[council.icon_name] ?? Building2;
              return (
                <Card key={council.id} className="flex flex-col p-6 hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-light text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-[18px] font-semibold text-ink">
                    <Link to={`/councils/${council.slug}`} className="hover:text-brand">
                      {council.name}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">
                    {council.short_description}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-surface-border pt-4 text-[12px]">
                    <div>
                      <dt className="text-ink-muted">Participating members</dt>
                      <dd className="font-mono text-[15px] font-semibold tabular-nums text-brand-deep">
                        {council.member_count_display}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted">Established</dt>
                      <dd className="font-mono text-[15px] font-semibold tabular-nums text-brand-deep">
                        {council.established_year}
                      </dd>
                    </div>
                  </dl>
                  <ButtonLink to={`/councils/${council.slug}`} variant="outline" className="mt-5 w-full">
                    View council
                  </ButtonLink>
                </Card>
              );
            })}
          </div>
        )}
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const CouncilDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { data: council, isLoading } = useQuery({
    queryKey: ['council', slug],
    queryFn: () => dataProvider.council(slug),
  });
  const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: () => dataProvider.news() });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => dataProvider.organizations(),
  });

  usePageMeta(council?.name ?? 'Council', council?.short_description);

  if (isLoading) {
    return (
      <Container className="py-20">
        <SkeletonList rows={3} />
      </Container>
    );
  }

  if (!council) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Council not found"
          description="This council page is not available."
          action={<ButtonLink to="/councils">Back to councils</ButtonLink>}
        />
      </Container>
    );
  }

  const relatedEvents = events.filter((e) => e.council_id === council.id && isUpcoming(e.starts_at));
  const relatedNews = news.filter((n) => n.category === 'Councils' || n.title.includes(council.name.split(' ')[0]));
  const participating = organizations.filter((o) => o.directory_visible).slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Industry council"
        title={council.name}
        description={council.short_description}
        breadcrumbs={[{ label: 'Councils', to: '/councils' }, { label: council.name }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/membership/apply"
            className="rounded-md bg-chamber-green px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-chamber-green-dark"
          >
            Join this council
          </Link>
          <a
            href={`mailto:${council.contact_email}`}
            className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/20"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact the council
          </a>
        </div>
      </PageHeader>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Markdown content={council.full_description_markdown} />

            <SectionHeading className="mt-12" title="Objectives" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {council.objectives.map((objective) => (
                <li key={objective} className="rounded-lg border border-surface-border bg-white p-4 text-[14px] leading-relaxed text-ink-soft">
                  {objective}
                </li>
              ))}
            </ul>

            <SectionHeading className="mt-12" title="Policy priorities" />
            <div className="flex flex-wrap gap-2">
              {council.policy_priorities.map((priority) => (
                <span key={priority} className="rounded-full border border-brand/20 bg-brand-light px-3.5 py-1.5 text-[13px] font-medium text-brand-dark">
                  {priority}
                </span>
              ))}
            </div>

            <SectionHeading className="mt-12" title="Current initiatives" />
            <div className="space-y-3">
              {council.initiatives.map((initiative) => (
                <Card key={initiative.title} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-[15.5px] font-semibold text-ink">{initiative.title}</h3>
                    <p className="mt-1 text-[13.5px] text-ink-soft">{initiative.summary}</p>
                  </div>
                  <Badge status={initiative.status.toLowerCase()} label={initiative.status} />
                </Card>
              ))}
            </div>

            {relatedEvents.length > 0 && (
              <>
                <SectionHeading className="mt-12" title="Upcoming council events" />
                <div className="space-y-3">
                  {relatedEvents.map((event) => (
                    <Card key={event.id} className="flex items-center justify-between gap-4 p-5">
                      <div>
                        <h3 className="text-[15.5px] font-semibold text-ink">
                          <Link to={`/events/${event.slug}`} className="hover:text-brand">
                            {event.title}
                          </Link>
                        </h3>
                        <p className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ink-muted">
                          {formatDate(event.starts_at)} · {event.island}
                        </p>
                      </div>
                      <Badge status="published" label={event.event_type} />
                    </Card>
                  ))}
                </div>
              </>
            )}

            {relatedNews.length > 0 && (
              <>
                <SectionHeading className="mt-12" title="Related news" />
                <div className="space-y-3">
                  {relatedNews.slice(0, 3).map((post) => (
                    <Card key={post.id} className="p-5">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                        {formatDate(post.published_at)}
                      </p>
                      <h3 className="mt-1 text-[15.5px] font-semibold text-ink">
                        <Link to={`/news/${post.slug}`} className="hover:text-brand">
                          {post.title}
                        </Link>
                      </h3>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-4 lg:col-span-4">
            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Council leadership</h2>
              <dl className="mt-4 space-y-3 text-[14px]">
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Chair</dt>
                  <dd className="text-ink">{council.chair_name}</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Deputy chair</dt>
                  <dd className="text-ink">Deputy chair name to be confirmed</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Council email</dt>
                  <dd>
                    <a href={`mailto:${council.contact_email}`} className="text-brand hover:underline">
                      {council.contact_email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Participating members</dt>
                  <dd className="font-mono text-lg font-semibold tabular-nums text-brand-deep">
                    {council.member_count_display}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand" aria-hidden="true" />
                <h2 className="text-[15px] font-semibold text-ink">Participating organisations</h2>
              </div>
              <ul className="mt-3 space-y-2 text-[13.5px]">
                {participating.map((org) => (
                  <li key={org.id}>
                    <Link to={`/directory/members/${org.slug}`} className="text-brand hover:underline">
                      {org.display_name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-ink-muted">Demonstration records only.</p>
            </Card>

            <DemoNotice />
          </aside>
        </div>
      </Container>
    </>
  );
};
