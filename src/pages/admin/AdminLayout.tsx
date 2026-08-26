import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  FileSignature,
  Handshake,
  Image,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Network,
  Newspaper,
  Receipt,
  Scale,
  ScrollText,
  Settings,
  Sprout,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { Logo } from '@/components/common/ui';
import { DemoModeBadge } from '@/components/layout/PublicLayout';
import { adminNav } from '@/lib/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { cn } from '@/lib/utils';

const icons: Record<string, React.ElementType> = {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Receipt,
  Network,
  Newspaper,
  CalendarDays,
  ListChecks,
  BookOpen,
  Scale,
  FileSignature,
  Sprout,
  Handshake,
  Megaphone,
  Image,
  Inbox,
  Mail,
  UserCog,
  Settings,
  ScrollText,
};

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = (user?.role ?? 'member') as 'editor' | 'admin' | 'super_admin';
  const visible = adminNav.filter((item) => item.roles.includes(role));
  const groups = Array.from(new Set(visible.map((item) => item.group)));

  const nav = (
    <nav className="space-y-5" aria-label="Administration">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            {group}
          </p>
          <div className="space-y-0.5">
            {visible
              .filter((item) => item.group === group)
              .map((item) => {
                const Icon = icons[item.icon] ?? LayoutDashboard;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors',
                        isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-surface-page">
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto bg-brand-deep p-4 lg:flex">
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
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-brand-deep p-4" role="dialog" aria-modal="true" aria-label="Admin navigation">
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
            <button type="button" onClick={() => setOpen(true)} className="rounded-md p-2 text-ink lg:hidden" aria-label="Open admin menu">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-[14px] font-semibold text-ink">Chamber administration</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[13px] font-medium text-ink-soft hover:text-brand">Public website</Link>
            <span className="hidden rounded-full border border-brand/20 bg-brand-light px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-brand-dark sm:inline">
              {user?.role}
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

export default AdminLayout;
