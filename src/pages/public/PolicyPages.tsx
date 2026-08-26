import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, FileSignature, Globe2, Landmark, LineChart, Scale } from 'lucide-react';
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
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { dataProvider } from '@/lib/data/provider';
import { formatDate } from '@/lib/utils/format';

const PolicyProgress: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="w-full">
    <div className="flex items-center justify-between text-[11px] font-medium text-ink-soft">
      <span>Engagement progress</span>
      <span className="font-mono tabular-nums">{percent}%</span>
    </div>
    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-page">
      <div className="h-full rounded-full bg-chamber-green" style={{ width: `${percent}%` }} />
    </div>
  </div>
);

export const PolicyPage: React.FC = () => {
  usePageMeta('Policy & Advocacy', 'The chamber policy agenda, positions and engagement progress.');
  const { data: items = [] } = useQuery({ queryKey: ['policy'], queryFn: () => dataProvider.policyItems() });
  const [category, setCategory] = useState('all');
  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = category === 'all' ? items : items.filter((i) => i.category === category);

  return (
    <>
      <PageHeader
        eyebrow="Policy & advocacy"
        title="Policy Priorities"
        description="The chamber develops evidence-based positions through member consultation and industry councils, then engages government and regulators on behalf of business."
        breadcrumbs={[{ label: 'Policy & Advocacy' }]}
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Globe2, title: 'International trade', to: '/policy/international-trade' },
            { icon: Scale, title: 'Regulatory affairs', to: '/policy/regulatory-affairs' },
            { icon: Landmark, title: 'Legislative affairs', to: '/policy/legislative-affairs' },
            { icon: LineChart, title: 'Economic research', to: '/policy/research' },
          ].map(({ icon: Icon, title, to }) => (
            <Link
              key={to}
              to={to}
              className="rounded-lg border border-surface-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 text-[15px] font-semibold text-ink">{title}</h2>
            </Link>
          ))}
        </div>

        <SectionHeading
          className="mt-14"
          eyebrow="Advocacy tracker"
          title="Current policy positions"
          action={
            <div>
              <label htmlFor="policy-category" className="sr-only">
                Filter by category
              </label>
              <select
                id="policy-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All categories' : c}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {item.reference_number}
                </span>
                <Badge status="info" label={item.position_status} />
                <Badge status="neutral" label={item.category} />
              </div>
              <h3 className="mt-2 text-[18px] font-semibold text-ink">
                <Link to={`/policy/positions/${item.slug}`} className="hover:text-brand">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-ink-soft">{item.summary}</p>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="sm:w-72">
                  <PolicyProgress percent={item.progress_percent} />
                </div>
                <Link
                  to={`/policy/positions/${item.slug}`}
                  className="text-[13.5px] font-semibold text-brand hover:text-brand-dark"
                >
                  Read the position →
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const PolicyPositionsPage: React.FC = () => {
  usePageMeta('Policy Positions', 'Register of chamber policy positions.');
  const { data: items = [] } = useQuery({ queryKey: ['policy'], queryFn: () => dataProvider.policyItems() });
  return (
    <>
      <PageHeader
        eyebrow="Policy & advocacy"
        title="Policy Positions"
        description="Every position published by the chamber, with reference number and engagement status."
        breadcrumbs={[{ label: 'Policy & Advocacy', to: '/policy' }, { label: 'Positions' }]}
      />
      <Container className="py-14">
        <div className="overflow-x-auto rounded-lg border border-surface-border bg-white">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead className="border-b border-surface-border bg-surface-page">
              <tr className="text-[12px] uppercase tracking-wider text-ink-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Reference</th>
                <th scope="col" className="px-5 py-3 font-semibold">Title</th>
                <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-page">
                  <td className="px-5 py-4 font-mono text-[12px] text-ink-soft">{item.reference_number}</td>
                  <td className="px-5 py-4">
                    <Link to={`/policy/positions/${item.slug}`} className="font-semibold text-brand hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{item.category}</td>
                  <td className="px-5 py-4"><Badge status="info" label={item.position_status} /></td>
                  <td className="px-5 py-4 font-mono tabular-nums text-ink-soft">{item.progress_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DemoNotice className="mt-8" />
      </Container>
    </>
  );
};

export const PolicyDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { data: item } = useQuery({ queryKey: ['policy', slug], queryFn: () => dataProvider.policyItem(slug) });
  usePageMeta(item?.title ?? 'Policy position', item?.summary);

  if (!item) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Policy position not found"
          action={<ButtonLink to="/policy">Back to policy</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={item.reference_number}
        title={item.title}
        description={item.summary}
        breadcrumbs={[
          { label: 'Policy & Advocacy', to: '/policy' },
          { label: 'Positions', to: '/policy/positions' },
          { label: item.title },
        ]}
      />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Markdown content={item.body_markdown} />
          </div>
          <aside className="space-y-4 lg:col-span-4">
            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Position details</h2>
              <dl className="mt-4 space-y-3 text-[14px]">
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Category</dt>
                  <dd className="text-ink">{item.category}</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Status</dt>
                  <dd><Badge status="info" label={item.position_status} /></dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Published</dt>
                  <dd className="font-mono text-ink">{formatDate(item.published_at)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <PolicyProgress percent={item.progress_percent} />
              </div>
              <button
                type="button"
                onClick={() => window.alert('Supporting document placeholder. Upload the approved file before launch.')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-surface-border px-4 py-2.5 text-[13.5px] font-semibold text-brand-deep hover:border-brand hover:bg-brand-light"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Supporting document
              </button>
            </Card>
            <DemoNotice />
          </aside>
        </div>
      </Container>
    </>
  );
};

const ThematicPolicyPage: React.FC<{
  title: string;
  eyebrow: string;
  description: string;
  categoryFilter: string;
  crumb: string;
}> = ({ title, eyebrow, description, categoryFilter, crumb }) => {
  usePageMeta(title, description);
  const { data: items = [] } = useQuery({ queryKey: ['policy'], queryFn: () => dataProvider.policyItems() });
  const filtered = items.filter((i) => i.category === categoryFilter);
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Policy & Advocacy', to: '/policy' }, { label: crumb }]}
      />
      <Container className="py-14">
        {filtered.length === 0 ? (
          <EmptyState
            title="No published positions in this area yet"
            description="Positions will appear here once published by the secretariat."
            action={<ButtonLink to="/policy" variant="outline">All policy priorities</ButtonLink>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <Card key={item.id} className="p-6">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {item.reference_number}
                </span>
                <h2 className="mt-2 text-[17px] font-semibold text-ink">
                  <Link to={`/policy/positions/${item.slug}`} className="hover:text-brand">
                    {item.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.summary}</p>
                <div className="mt-4">
                  <PolicyProgress percent={item.progress_percent} />
                </div>
              </Card>
            ))}
          </div>
        )}
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const InternationalTradePage: React.FC = () => (
  <ThematicPolicyPage
    eyebrow="Policy & advocacy"
    title="International Trade"
    crumb="International Trade"
    description="Market access, export facilitation, trade documentation and international chamber cooperation."
    categoryFilter="International Trade"
  />
);

export const RegulatoryAffairsPage: React.FC = () => (
  <ThematicPolicyPage
    eyebrow="Policy & advocacy"
    title="Regulatory Affairs"
    crumb="Regulatory Affairs"
    description="Engagement on business regulation, licensing, compliance burden and administrative simplification."
    categoryFilter="Regulatory Affairs"
  />
);

export const LegislativeAffairsPage: React.FC = () => (
  <ThematicPolicyPage
    eyebrow="Policy & advocacy"
    title="Legislative Affairs"
    crumb="Legislative Affairs"
    description="Review of draft legislation affecting business, with member consultation and formal comment."
    categoryFilter="Legislative Affairs"
  />
);

export const PolicySubmissionsPage: React.FC = () => {
  usePageMeta('Policy Submissions', 'Register of formal submissions made by the chamber.');
  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => dataProvider.policySubmissions(),
  });
  const [query, setQuery] = useState('');
  const filtered = submissions.filter((s) =>
    `${s.title} ${s.reference_number} ${s.submitted_to}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        eyebrow="Policy & advocacy"
        title="Policy Submission Register"
        description="Formal written submissions made by the chamber, with reference numbers and response status."
        breadcrumbs={[{ label: 'Policy & Advocacy', to: '/policy' }, { label: 'Submissions' }]}
      />
      <Container className="py-14">
        <div className="mb-6 max-w-md">
          <label htmlFor="submission-search" className="mb-1.5 block text-[13px] font-semibold text-ink">
            Search submissions
          </label>
          <input
            id="submission-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClass}
            placeholder="Reference, title or authority"
          />
        </div>
        <div className="space-y-3">
          {filtered.map((submission) => (
            <Card key={submission.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-brand">
                    {submission.reference_number}
                  </span>
                  <Badge status={submission.response_status.toLowerCase().replace(/\s/g, '_')} label={submission.response_status} />
                </div>
                <h2 className="mt-1.5 text-[16px] font-semibold text-ink">
                  <Link to={`/policy/submissions/${submission.slug}`} className="hover:text-brand">
                    {submission.title}
                  </Link>
                </h2>
                <p className="mt-1 text-[13px] text-ink-soft">
                  Submitted to {submission.submitted_to} · {formatDate(submission.submission_date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.alert('Submission file placeholder. Upload the approved document before launch.')}
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-surface-border px-4 py-2 text-[13px] font-semibold text-brand-deep hover:border-brand hover:bg-brand-light"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </button>
            </Card>
          ))}
          {filtered.length === 0 && <EmptyState title="No submissions match your search" />}
        </div>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const PolicySubmissionDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => dataProvider.policySubmissions(),
  });
  const submission = submissions.find((s) => s.slug === slug);
  usePageMeta(submission?.title ?? 'Policy submission', submission?.summary);

  if (!submission) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Submission not found"
          action={<ButtonLink to="/policy/submissions">Back to the register</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={submission.reference_number}
        title={submission.title}
        description={submission.summary}
        breadcrumbs={[
          { label: 'Policy & Advocacy', to: '/policy' },
          { label: 'Submissions', to: '/policy/submissions' },
          { label: submission.reference_number },
        ]}
      />
      <Container className="py-14">
        <Card className="max-w-3xl p-8">
          <FileSignature className="h-6 w-6 text-brand" aria-hidden="true" />
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Submitted to</dt>
              <dd className="mt-1 text-[15px] text-ink">{submission.submitted_to}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Submission date</dt>
              <dd className="mt-1 font-mono text-[15px] text-ink">{formatDate(submission.submission_date)}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Response status</dt>
              <dd className="mt-1"><Badge status={submission.response_status.toLowerCase()} label={submission.response_status} /></dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Reference</dt>
              <dd className="mt-1 font-mono text-[15px] text-ink">{submission.reference_number}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => window.alert('Submission file placeholder. Upload the approved document before launch.')}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download submission (placeholder)
          </button>
        </Card>
        <DemoNotice className="mt-8 max-w-3xl" />
      </Container>
    </>
  );
};

export const EconomicResearchPage: React.FC = () => {
  usePageMeta('Economic Research', 'Chamber research, surveys and economic analysis.');
  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: () => dataProvider.publications(),
  });
  const research = publications.filter((p) => p.publication_type === 'research' || p.publication_type === 'statistics');
  return (
    <>
      <PageHeader
        eyebrow="Policy & advocacy"
        title="Economic Research"
        description="Business confidence surveys, sector studies and statistical digests supporting the chamber's positions."
        breadcrumbs={[{ label: 'Policy & Advocacy', to: '/policy' }, { label: 'Economic Research' }]}
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {research.map((item) => (
            <Card key={item.id} className="flex flex-col p-6">
              <LineChart className="h-5 w-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 text-[16px] font-semibold text-ink">
                <Link to={`/publications/${item.slug}`} className="hover:text-brand">
                  {item.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{item.summary}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {formatDate(item.published_at)} · {item.page_count} pages
              </p>
            </Card>
          ))}
        </div>
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};
