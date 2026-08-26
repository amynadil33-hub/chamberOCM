import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Download, FileText, Search } from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  EmptyState,
  Markdown,
  PageHeader,
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { dataProvider } from '@/lib/data/provider';
import { formatDate, titleCase } from '@/lib/utils/format';

const typeLabels: Record<string, string> = {
  annual_report: 'Annual report',
  research: 'Research',
  policy_paper: 'Policy paper',
  guide: 'Business guide',
  newsletter: 'Newsletter',
  statistics: 'Trade statistics',
};

const downloadPlaceholder = () =>
  window.alert('Document placeholder. Upload the approved publication file in the admin media library before launch.');




export const PublicationsPage: React.FC = () => {
  usePageMeta('Publications', 'Annual reports, research, policy papers, guides and statistics.');
  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: () => dataProvider.publications(),
  });
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  const filtered = useMemo(
    () =>
      publications
        .filter((p) => (type === 'all' ? true : p.publication_type === type))
        .filter((p) => `${p.title} ${p.summary}`.toLowerCase().includes(query.toLowerCase())),
    [publications, query, type],
  );

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Publications & Resources"
        description="Annual reports, economic research, policy papers, business guides, newsletters and trade statistics."
        breadcrumbs={[{ label: 'Publications' }]}
      />
      <Container className="py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by publication type">
            {['all', ...Object.keys(typeLabels)].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  type === t
                    ? 'border-brand bg-brand text-white'
                    : 'border-surface-border bg-white text-ink-soft hover:border-brand hover:text-brand-deep'
                }`}
              >
                {t === 'all' ? 'All types' : typeLabels[t]}
              </button>
            ))}
          </div>
          <div className="w-full md:w-72">
            <label htmlFor="pub-search" className="sr-only">
              Search publications
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <input
                id="pub-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search publications"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No publications match your search" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <Card key={item.id} className="flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-deep to-brand">
                  <BookOpen className="h-9 w-9 text-white/60" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <Badge status="published" label={typeLabels[item.publication_type]} className="self-start" />
                  <h2 className="mt-3 text-[16px] font-semibold leading-snug text-ink">
                    <Link to={`/publications/${item.slug}`} className="hover:text-brand">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    <span>{formatDate(item.published_at)}</span>
                    <span>{item.page_count} pages</span>
                  </div>
                  <button
                    type="button"
                    onClick={downloadPlaceholder}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-surface-border px-4 py-2.5 text-[13.5px] font-semibold text-brand-deep hover:border-brand hover:bg-brand-light"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                  </button>
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

export const AnnualReportsPage: React.FC = () => {
  usePageMeta('Annual Reports', 'Chamber annual reporting archive.');
  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: () => dataProvider.publications(),
  });
  const reports = publications.filter((p) => p.publication_type === 'annual_report');
  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Annual Reports"
        description="Annual reporting on chamber activity, governance, councils and financial position."
        breadcrumbs={[{ label: 'Publications', to: '/publications' }, { label: 'Annual Reports' }]}
      />
      <Container className="py-14">
        {reports.length === 0 ? (
          <EmptyState title="No annual reports published yet" />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="p-6">
                <FileText className="h-6 w-6 text-brand" aria-hidden="true" />
                <h2 className="mt-4 text-[17px] font-semibold text-ink">
                  <Link to={`/annual-reports/${report.slug}`} className="hover:text-brand">
                    {report.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{report.summary}</p>
                <button
                  type="button"
                  onClick={downloadPlaceholder}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-surface-border px-4 py-2.5 text-[13.5px] font-semibold text-brand-deep hover:border-brand hover:bg-brand-light"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download report
                </button>
              </Card>
            ))}
          </div>
        )}
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const PublicationDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { data: publication } = useQuery({
    queryKey: ['publication', slug],
    queryFn: () => dataProvider.publication(slug),
  });
  usePageMeta(publication?.title ?? 'Publication', publication?.summary);

  if (!publication) {
    return (
      <Container className="py-20">
        <EmptyState title="Publication not found" action={<ButtonLink to="/publications">Back to publications</ButtonLink>} />
      </Container>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={typeLabels[publication.publication_type] ?? titleCase(publication.publication_type)}
        title={publication.title}
        description={publication.summary}
        breadcrumbs={[{ label: 'Publications', to: '/publications' }, { label: publication.title }]}
      />
      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Markdown content={publication.description_markdown} />
            <DemoNotice className="mt-8" />
          </div>
          <aside className="lg:col-span-4">
            <Card className="p-6">
              <div className="mb-5 flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-brand-deep to-brand">
                <BookOpen className="h-10 w-10 text-white/60" aria-hidden="true" />
              </div>
              <dl className="space-y-3 text-[14px]">
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Type</dt>
                  <dd className="text-ink">{typeLabels[publication.publication_type]}</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Published</dt>
                  <dd className="font-mono text-ink">{formatDate(publication.published_at)}</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">Pages</dt>
                  <dd className="font-mono text-ink">{publication.page_count}</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-wider text-ink-muted">File</dt>
                  <dd className="break-all font-mono text-[12px] text-ink-soft">{publication.file_path}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={downloadPlaceholder}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download (placeholder)
              </button>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
};

