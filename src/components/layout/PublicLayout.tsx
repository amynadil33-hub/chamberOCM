import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { isMockMode, siteConfig } from '@/lib/config';

export const usePageMeta = (title: string, description?: string): void => {
  useEffect(() => {
    document.title = `${title} | ${siteConfig.shortName}`;
    const meta = document.querySelector('meta[name="description"]');
    const content = description ?? siteConfig.defaultSeoDescription;
    if (meta) meta.setAttribute('content', content);
    else {
      const el = document.createElement('meta');
      el.name = 'description';
      el.content = content;
      document.head.appendChild(el);
    }
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, [title, description]);
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

export const DemoModeBadge: React.FC = () =>
  isMockMode ? (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden rounded-full border border-amber-300 bg-white/95 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-[#B7791F] shadow-sm sm:block">
      Demo data · mock mode
    </div>
  ) : null;

const PublicLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-surface-page">
    <ScrollToTop />
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to main content
    </a>
    <Header />
    <main id="main-content" className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <DemoModeBadge />
  </div>
);

export default PublicLayout;
