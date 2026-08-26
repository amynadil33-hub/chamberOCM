import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Receipt,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { Logo } from '@/components/common/ui';
import { DemoModeBadge } from '@/components/layout/PublicLayout';
import { portalNav } from '@/lib/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { cn } from '@/lib/utils';

const icons: Record<string, React.ElementType> = {
  LayoutDashboard,
  User,
  Building2,
  FileText,
  FolderOpen,
  BadgeCheck,
  CalendarDays,
  Receipt,
  Megaphone,
  ShieldCheck,
};

const PortalLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-1" aria-label="Member portal">
      {portalNav.map((item) => {
        const Icon = icons[item.icon] ?? LayoutDashboard;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/portal'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors',
                isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-surface-page">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-deep p-4 lg:flex">
        <Link to="/" className="mb-6 block rounded p-1">
          <Logo variant="light" />
        </Link>
        {nav}
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="text-[13px] font-semibold text-white">{user?.full_name}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">{user?.role}</p>
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="mt-3 flex w-full items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-[13px] font-semibold text-white/80 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-deep/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-brand-deep p-4" role="dialog" aria-modal="true" aria-label="Portal navigation">
            <div className="mb-6 flex items-center justify-between">
              <Logo variant="light" showText={false} />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded p-2 text-white/70 hover:bg-white/10">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-surface-border bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="rounded-md p-2 text-ink lg:hidden" aria-label="Open portal menu">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-[14px] font-semibold text-ink">Member portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[13px] font-medium text-ink-soft hover:text-brand">
              Public website
            </Link>
            <span className="hidden rounded-full border border-brand/20 bg-brand-light px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-brand-dark sm:inline">
              {user?.role ?? 'guest'}
            </span>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      <DemoModeBadge />
    </div>
  );
};

export default PortalLayout;
