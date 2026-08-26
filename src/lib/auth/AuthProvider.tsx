import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { demoUsers } from '@/data/mockSeed';
import { envConfig, isDatabaseMode } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { TABLES } from '@/lib/data/databaseProvider';
import type { AppRole, AuthUser } from '@/types';

const SESSION_KEY = 'mcci.mock.session.v1';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  hasRole: (roles: AppRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const ROLE_RANK: Record<AppRole, number> = {
  member: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
};

/** Loads the profile + role + organisation for an authenticated database user. */
async function loadDatabaseUser(id: string, email: string, fallbackName: string): Promise<AuthUser> {
  const base: AuthUser = { id, email, full_name: fallbackName, role: 'member' };
  if (!supabase) return base;
  try {
    const [{ data: profile }, { data: roles }, { data: links }] = await Promise.all([
      supabase.from(TABLES.profiles).select('*').eq('id', id).maybeSingle(),
      supabase.from(TABLES.userRoles).select('role').eq('user_id', id),
      supabase.from(TABLES.organizationUsers).select('organization_id').eq('user_id', id).limit(1),
    ]);

    const roleRows = (roles as { role: string }[]) ?? [];
    const best = roleRows
      .map((r) => r.role as AppRole)
      .filter((r): r is AppRole => r in ROLE_RANK)
      .sort((a, b) => ROLE_RANK[b] - ROLE_RANK[a])[0];

    return {
      id,
      email,
      full_name: (profile as { full_name?: string } | null)?.full_name || fallbackName,
      role: best ?? 'member',
      organization_id: ((links as { organization_id?: string }[]) ?? [])[0]?.organization_id,
    };
  } catch {
    return base;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------ session restore ------------------------- */
  useEffect(() => {
    let active = true;

    if (isDatabaseMode && supabase) {
      supabase.auth
        .getSession()
        .then(async ({ data }) => {
          const session = data.session;
          if (!active) return;
          if (session?.user) {
            const meta = session.user.user_metadata as { full_name?: string } | undefined;
            setUser(
              await loadDatabaseUser(session.user.id, session.user.email ?? '', meta?.full_name ?? 'Member'),
            );
          }
          setLoading(false);
        })
        .catch(() => active && setLoading(false));

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!active) return;
        if (session?.user) {
          const meta = session.user.user_metadata as { full_name?: string } | undefined;
          setUser(await loadDatabaseUser(session.user.id, session.user.email ?? '', meta?.full_name ?? 'Member'));
        } else {
          setUser(null);
        }
      });

      return () => {
        active = false;
        listener.subscription.unsubscribe();
      };
    }

    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      setUser(null);
    }
    setLoading(false);
    return () => {
      active = false;
    };
  }, []);

  /* --------------------------------- sign in ------------------------------ */
  const signIn = useCallback(async (email: string, password: string) => {
    if (isDatabaseMode && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { error: error.message };
      if (data.user) {
        const meta = data.user.user_metadata as { full_name?: string } | undefined;
        setUser(await loadDatabaseUser(data.user.id, data.user.email ?? '', meta?.full_name ?? 'Member'));
      }
      return {};
    }

    await new Promise((r) => setTimeout(r, 350));
    const match = demoUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) {
      return { error: 'Those credentials were not recognised. Check the email address and password.' };
    }
    const { password: _pw, ...session } = match;
    setUser(session);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return {};
  }, []);

  /* --------------------------------- sign up ------------------------------ */
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (isDatabaseMode && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${envConfig.appUrl}/auth/login`,
        },
      });
      if (error) return { error: error.message };

      // Public registration always creates a standard member account.
      if (data.user) {
        await supabase.from(TABLES.profiles).upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        });
        await supabase
          .from(TABLES.userRoles)
          .upsert({ user_id: data.user.id, role: 'member' }, { onConflict: 'user_id,role' });
        if (data.session) {
          setUser({ id: data.user.id, email: data.user.email ?? '', full_name: fullName, role: 'member' });
        }
      }
      return {};
    }

    await new Promise((r) => setTimeout(r, 350));
    if (demoUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { error: 'An account already exists for this email address.' };
    }
    const session: AuthUser = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      full_name: fullName,
      role: 'member',
    };
    setUser(session);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return {};
  }, []);

  /* -------------------------------- sign out ------------------------------ */
  const signOut = useCallback(() => {
    if (isDatabaseMode && supabase) {
      void supabase.auth.signOut();
    }
    setUser(null);
    window.localStorage.removeItem(SESSION_KEY);
  }, []);

  /* ----------------------------- password reset --------------------------- */
  const resetPassword = useCallback(async (email: string) => {
    if (isDatabaseMode && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${envConfig.appUrl}/auth/reset-password`,
      });
      if (error) return { error: error.message };
    }
    return {};
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (isDatabaseMode && supabase) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: error.message };
    }
    return {};
  }, []);

  const hasRole = useCallback(
    (roles: AppRole[]) => (user ? roles.includes(user.role) : false),
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, resetPassword, updatePassword, hasRole }),
    [user, loading, signIn, signUp, signOut, resetPassword, updatePassword, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export const AuthLoading: React.FC = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    <span className="sr-only">Loading session</span>
  </div>
);

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
};

export const RequireRole: React.FC<{ roles: AppRole[]; children: React.ReactNode }> = ({
  roles,
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  if (!roles.includes(user.role)) return <Navigate to="/auth/unauthorized" replace />;
  return <>{children}</>;
};

export const isMockAuth = envConfig.dataMode === 'mock';
