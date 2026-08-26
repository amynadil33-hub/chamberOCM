import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link2, Linkedin, Newspaper, Search } from 'lucide-react';
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  DemoBadge,
  DemoNotice,
  EmptyState,
  Markdown,
  PageHeader,
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { toast } from '@/components/ui/use-toast';
import { dataProvider } from '@/lib/data/provider';
import { formatDate } from '@/lib/utils/format';

export const NewsPage: React.FC = () => {
  usePageMeta('News & Media', 'Chamber news, press releases and commentary.');
  const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: () => dataProvider.news() });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(news.map((n) => n.category)))];
  const filtered = useMemo(
    () =>
      news
        .filter((n) => (category === 'all' ? true : n.category === category))
        .filter((n) => `${n.title} ${n.excerpt}`.toLowerCase().includes(query.toLowerCase())),
    [news, category, query],
  );
  const featured = filtered.find((n) => n.featured) ?? filtered[0];
  const rest = filtered.filter((n) => n.id !== featured?.id);

  return (
    <>
      <PageHeader
        eyebrow="News & media"
        title="Chamber News"
        description="Updates, press releases and commentary from the chamber and its industry councils."
        breadcrumbs={[{ label: 'News' }]}
      />
      <Container className="py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  category === c
                    ? 'border-brand bg-brand text-white'
                    : 'border-surface-border bg-white text-ink-soft hover:border-brand hover:text-brand-deep'
                }`}
              >
                {c === 'all' ? 'All categories' : c}
              </button>
            ))}
          </div>
          <div className="w-full md:w-72">
            <label htmlFor="news-search" className="sr-only">
              Search news
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <input
                id="news-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No articles match your search" />
        ) : (
          <>
            {featured && (
              <Card className="mb-8 overflow-hidden lg:flex">
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-deep to-brand lg:h-auto lg:w-2/5">
                  <Newspaper className="h-12 w-12 text-white/60" aria-hidden="true" />
                </div>
                <div className="p-7 lg:w-3/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge status="published" label={featured.category} />
                    <DemoBadge />
                  </div>
                  <h2 className="mt-3 text-[24px] font-semibold leading-snug text-ink">
                    <Link to={`/news/${featured.slug}`} className="hover:text-brand">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{featured.excerpt}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {formatDate(featured.published_at)} · {featured.author_display_name}
                  </p>
                </div>
              </Card>
            )}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post) => (
                <Card key={post.id} className="flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-dark to-brand-medium">
                    <Newspaper className="h-8 w-8 text-white/60" aria-hidden="true" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <Badge status="published" label={post.category} className="self-start" />
                    <h3 className="mt-3 text-[16px] font-semibold leading-snug text-ink">
                      <Link to={`/news/${post.slug}`} className="hover:text-brand">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {formatDate(post.published_at)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const NewsDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { data: post } = useQuery({ queryKey: ['news', slug], queryFn: () => dataProvider.newsPost(slug) });
  const { data: news = [] } = useQuery({ queryKey: ['news'], queryFn: () => dataProvider.news() });
  usePageMeta(post?.title ?? 'News', post?.excerpt);

  if (!post) {
    return (
      <Container className="py-20">
        <EmptyState title="Article not found" action={<ButtonLink to="/news">Back to news</ButtonLink>} />
      </Container>
    );
  }

  const related = news.filter((n) => n.id !== post.id).slice(0, 3);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <PageHeader
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'News', to: '/news' }, { label: post.title }]}
      />
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-surface-border pb-5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              <span>·</span>
              <span>{post.author_display_name}</span>
              {post.is_demo && <DemoBadge />}
            </div>
            <Markdown content={post.body_markdown} className="mt-2" />

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-surface-border pt-6">
              <span className="text-[13px] font-semibold text-ink">Share</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-ink-soft hover:border-brand hover:text-brand-deep"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl);
                  toast({ title: 'Link copied', description: 'The article link has been copied to your clipboard.' });
                }}
                className="inline-flex items-center gap-2 rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-ink-soft hover:border-brand hover:text-brand-deep"
              >
                <Link2 className="h-4 w-4" aria-hidden="true" />
                Copy link
              </button>
            </div>
          </article>

          <aside className="space-y-4 lg:col-span-4">
            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Related stories</h2>
              <ul className="mt-4 space-y-4">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link to={`/news/${item.slug}`} className="text-[14px] font-semibold text-ink hover:text-brand">
                      {item.title}
                    </Link>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {formatDate(item.published_at)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
            <DemoNotice />
          </aside>
        </div>
      </Container>
    </>
  );
};
