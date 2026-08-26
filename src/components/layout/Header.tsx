import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, Search, ShieldCheck, User, X } from 'lucide-react';
import { Container, Logo, buttonClass } from '@/components/common/ui';
import { publicNav } from '@/lib/navigation';
import { siteConfig, isMockMode } from '@/lib/config';
import { useAuth } from '@/lib/auth/AuthProvider';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setSearchOpen(false);
  }, [location.pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Slim institutional top bar */}
      <div className="hidden bg-brand-deep text-white lg:block">
        <Container className="flex h-9 items-center justify-between text-[12px]">
          <p className="text-white/70">
            {siteConfig.legalName} — {siteConfig.officeHours}
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${siteConfig.generalEmail}`} className="text-white/70 hover:text-white">
              {siteConfig.generalEmail}
            </a>
            <span className="text-white/25">|</span>
            <span
              className="cursor-not-allowed font-thaana text-white/50"
              title="Dhivehi language support is being prepared"
            >
              ދިވެހި — Coming Soon
            </span>
          </div>
        </Container>
      </div>

      <div className="border-b border-surface-border bg-white/95 backdrop-blur">
        <Container className="flex h-[68px] items-center justify-between gap-4">
          <Link to="/" className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand" aria-label="MCCI home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {publicNav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {item.children ? (
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    aria-expanded={openMenu === item.label}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-ink transition-colors hover:bg-brand-light hover:text-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                      location.pathname.startsWith(item.to) && item.to !== '/' && 'text-brand-deep',
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className={cn(
                      'block rounded-md px-2.5 py-2 text-[13.5px] font-medium text-ink transition-colors hover:bg-brand-light hover:text-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                      location.pathname === item.to && 'text-brand-deep',
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openMenu === item.label && (
                  <div className="absolute left-0 top-full w-[380px] pt-2">
                    <div className="rounded-lg border border-surface-border bg-white p-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.to + child.label}
                          to={child.to}
                          className="block rounded-md px-3 py-2.5 transition-colors hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                          <span className="block text-[13.5px] font-semibold text-ink">{child.label}</span>
                          {child.description && (
                            <span className="block text-[12px] text-ink-soft">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Open search"
              aria-expanded={searchOpen}
              className="rounded-md p-2 text-ink-soft transition-colors hover:bg-brand-light hover:text-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>

            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to={user.role === 'member' ? '/portal' : '/admin'} className={buttonClass('outline', 'px-3 py-2')}>
                  {user.role === 'member' ? (
                    <User className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  )}
                  {user.role === 'member' ? 'Member portal' : 'Admin'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className={buttonClass('ghost', 'px-3 py-2')}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/auth/login" className={buttonClass('outline', 'px-3 py-2')}>
                  Member login
                </Link>
                <Link to="/membership/apply" className={buttonClass('primary', 'px-3 py-2')}>
                  Join MCCI
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-ink transition-colors hover:bg-brand-light xl:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </Container>

        {searchOpen && (
          <div className="border-t border-surface-border bg-white">
            <Container className="py-3">
              <form onSubmit={submitSearch} role="search" className="flex gap-2">
                <label htmlFor="site-search" className="sr-only">
                  Search the MCCI website
                </label>
                <input
                  id="site-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search news, events, councils, publications, members…"
                  className="w-full rounded-md border border-surface-border px-3 py-2.5 text-[15px] focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                  autoFocus
                />
                <button type="submit" className={buttonClass('primary')}>
                  Search
                </button>
              </form>
            </Container>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-brand-deep/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
              <Logo showText={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-ink hover:bg-brand-light"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile primary">
              {publicNav.map((item) => (
                <div key={item.label} className="border-b border-surface-border/60 last:border-0">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileSection(mobileSection === item.label ? null : item.label)}
                        aria-expanded={mobileSection === item.label}
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-[15px] font-semibold text-ink"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 text-ink-muted transition-transform',
                            mobileSection === item.label && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {mobileSection === item.label && (
                        <ul className="pb-2">
                          {item.children.map((child) => (
                            <li key={child.to + child.label}>
                              <Link to={child.to} className="block rounded-md px-6 py-2.5 text-[14px] text-ink-soft hover:bg-brand-light">
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link to={item.to} className="block px-3 py-3 text-[15px] font-semibold text-ink">
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="space-y-2 border-t border-surface-border p-4">
              {user ? (
                <>
                  <Link to={user.role === 'member' ? '/portal' : '/admin'} className={buttonClass('primary', 'w-full')}>
                    {user.role === 'member' ? 'Member portal' : 'Admin dashboard'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      navigate('/');
                    }}
                    className={buttonClass('outline', 'w-full')}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/membership/apply" className={buttonClass('primary', 'w-full')}>
                    Join MCCI
                  </Link>
                  <Link to="/auth/login" className={buttonClass('outline', 'w-full')}>
                    Member login
                  </Link>
                </>
              )}
              {isMockMode && (
                <p className="pt-1 text-center text-[11px] text-ink-muted">
                  Preview running on demonstration data
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
