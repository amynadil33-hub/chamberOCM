import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import {
  Button,
  ButtonLink,
  Container,
  FieldError,
  FieldLabel,
  Logo,
  inputClass,
} from '@/components/common/ui';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth/AuthProvider';
import { DEMO_ACCOUNTS, isMockMode, siteConfig } from '@/lib/config';
import { usePageMeta } from '@/components/layout/PublicLayout';

const AuthShell: React.FC<{ title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode }> = ({
  title,
  subtitle,
  children,
  footer,
}) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-deep via-brand-dark to-brand p-12 text-white lg:flex">
      <Link to="/" className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <Logo variant="light" />
      </Link>
      <div>
        <h2 className="max-w-md text-[34px] font-semibold leading-tight">{siteConfig.tagline}</h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">{siteConfig.description}</p>
        <ul className="mt-8 space-y-3 text-[14px] text-white/80">
          {[
            'Track your membership application status',
            'Manage your organisation profile and documents',
            'Register for chamber events and access notices',
            'View invoices and payment history',
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/60" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[12px] text-white/50">
        © {new Date().getFullYear()} {siteConfig.legalName}
      </p>
    </div>

    <div className="flex flex-col justify-center bg-surface-page px-5 py-12 sm:px-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <h1 className="text-[28px] font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-[14.5px] text-ink-soft">{subtitle}</p>
        <div className="mt-7 rounded-lg border border-surface-border bg-white p-6 shadow-sm">{children}</div>
        {footer && <div className="mt-5">{footer}</div>}
        <Link to="/" className="mt-8 inline-block text-[13px] text-ink-soft hover:text-brand">
          ← Back to the public website
        </Link>
      </div>
    </div>
  </div>
);

const DemoPanel: React.FC<{ onUse: (email: string, password: string) => void }> = ({ onUse }) => {
  const [open, setOpen] = useState(true);
  if (!isMockMode) return null;
  return (
    <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold text-[#7a5312]"
      >
        Demo login details (mock mode)
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="space-y-2 border-t border-amber-200 px-4 py-3">
          {DEMO_ACCOUNTS.map((account) => (
            <div key={account.email} className="flex items-center justify-between gap-3 rounded border border-amber-200 bg-white px-3 py-2">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ink">{account.role}</p>
                <p className="truncate font-mono text-[11px] text-ink-soft">{account.email}</p>
                <p className="font-mono text-[11px] text-ink-muted">{account.password}</p>
              </div>
              <button
                type="button"
                onClick={() => onUse(account.email, account.password)}
                className="shrink-0 rounded border border-brand/30 bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand-dark hover:bg-brand hover:text-white"
              >
                Use
              </button>
            </div>
          ))}
          <p className="pt-1 text-[11px] leading-relaxed text-[#7a5312]">
            These demonstration credentials exist only in mock mode and must never be used in production.
          </p>
        </div>
      )}
    </div>
  );
};

export const LoginPage: React.FC = () => {
  usePageMeta('Member Login');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError('');
    toast({ title: 'Signed in', description: 'Welcome back to the MCCI platform.' });
    const isAdminAccount = email.startsWith('admin') || email.startsWith('editor');
    navigate(from ?? (isAdminAccount ? '/admin' : '/portal'), { replace: true });
  };

  return (
    <AuthShell
      title="Member sign in"
      subtitle="Access the member portal, your organisation profile and chamber services."
      footer={
        <p className="text-center text-[13.5px] text-ink-soft">
          Not yet registered?{' '}
          <Link to="/auth/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <FieldLabel htmlFor="login-email" required>Email address</FieldLabel>
          <input id="login-email" type="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="login-password" required>Password</FieldLabel>
          <input id="login-password" type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <FieldError message={error} />
        <div className="flex items-center justify-between">
          <Link to="/auth/forgot-password" className="text-[13px] font-medium text-brand hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>
      <DemoPanel
        onUse={(e, p) => {
          setEmail(e);
          setPassword(p);
        }}
      />
    </AuthShell>
  );
};

export const RegisterPage: React.FC = () => {
  usePageMeta('Create an account');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', accept: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match.';
    if (!form.accept) next.accept = 'Accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const result = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (result.error) {
      setErrors({ email: result.error });
      return;
    }
    toast({ title: 'Account created', description: 'A verification email would be sent in production.' });
    navigate('/auth/verify-email');
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register to start a membership application and access the member portal."
      footer={
        <p className="text-center text-[13.5px] text-ink-soft">
          Already registered?{' '}
          <Link to="/auth/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <FieldLabel htmlFor="r-name" required>Full name</FieldLabel>
          <input id="r-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FieldError message={errors.name} />
        </div>
        <div>
          <FieldLabel htmlFor="r-email" required>Email address</FieldLabel>
          <input id="r-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FieldError message={errors.email} />
        </div>
        <div>
          <FieldLabel htmlFor="r-password" required>Password</FieldLabel>
          <input id="r-password" type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <FieldError message={errors.password} />
        </div>
        <div>
          <FieldLabel htmlFor="r-confirm" required>Confirm password</FieldLabel>
          <input id="r-confirm" type="password" className={inputClass} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          <FieldError message={errors.confirm} />
        </div>
        <div>
          <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
            <input type="checkbox" checked={form.accept} onChange={(e) => setForm({ ...form, accept: e.target.checked })} className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand" />
            <span>
              I accept the <Link to="/terms" className="text-brand underline">terms of use</Link> and{' '}
              <Link to="/privacy" className="text-brand underline">privacy policy</Link>.
            </span>
          </label>
          <FieldError message={errors.accept} />
        </div>
        <p className="rounded-md bg-surface-page p-3 text-[12px] leading-relaxed text-ink-soft">
          Public registration creates a standard member account. Editor and administrator roles are assigned
          only by the chamber.
        </p>
        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
};

export const VerifyEmailPage: React.FC = () => {
  usePageMeta('Verify your email');
  return (
    <AuthShell title="Verify your email address" subtitle="One more step before your account is fully active.">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">
          In production a verification link is emailed to your address. In mock mode no email is sent — your
          account is already usable.
        </p>
        <div className="mt-6 space-y-3">
          <Button
            type="button"
            className="w-full"
            onClick={() => toast({ title: 'Verification email resent', description: 'Mock mode: no email was actually sent.' })}
          >
            Resend verification email
          </Button>
          <ButtonLink to="/portal" variant="outline" className="w-full">
            Continue to the member portal
          </ButtonLink>
        </div>
      </div>
    </AuthShell>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  usePageMeta('Forgot password');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we will send reset instructions."
      footer={
        <p className="text-center text-[13.5px] text-ink-soft">
          Remembered it?{' '}
          <Link to="/auth/login" className="font-semibold text-brand hover:underline">Sign in</Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-md border border-chamber-green/30 bg-chamber-green-light p-5 text-[14px] text-chamber-green-dark">
          If an account exists for {email}, reset instructions have been sent. Mock mode does not send email.
          <div className="mt-4">
            <ButtonLink to="/auth/reset-password" variant="outline" className="w-full">
              Open the reset form
            </ButtonLink>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              setError('Enter a valid email address.');
              return;
            }
            setError('');
            setSent(true);
          }}
          className="space-y-4"
          noValidate
        >
          <div>
            <FieldLabel htmlFor="f-email" required>Email address</FieldLabel>
            <input id="f-email" type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldError message={error} />
          </div>
          <Button type="submit" className="w-full">Send reset instructions</Button>
        </form>
      )}
    </AuthShell>
  );
};

export const ResetPasswordPage: React.FC = () => {
  usePageMeta('Set a new password');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password of at least 8 characters.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const next: Record<string, string> = {};
          if (password.length < 8) next.password = 'Use at least 8 characters.';
          if (password !== confirm) next.confirm = 'Passwords do not match.';
          setErrors(next);
          if (Object.keys(next).length) return;
          toast({ title: 'Password updated', description: 'Mock mode: the change is simulated.' });
          navigate('/auth/login');
        }}
        className="space-y-4"
        noValidate
      >
        <div>
          <FieldLabel htmlFor="n-password" required>New password</FieldLabel>
          <input id="n-password" type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
          <FieldError message={errors.password} />
        </div>
        <div>
          <FieldLabel htmlFor="n-confirm" required>Confirm new password</FieldLabel>
          <input id="n-confirm" type="password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <FieldError message={errors.confirm} />
        </div>
        <Button type="submit" className="w-full">
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Update password
        </Button>
      </form>
    </AuthShell>
  );
};

export const UnauthorizedAuthPage: React.FC = () => {
  usePageMeta('Access denied');
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-lg rounded-lg border border-surface-border bg-white p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#C2414B]">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-ink">Access denied</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Your role does not have permission to open this area of the platform.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/portal">Member portal</ButtonLink>
          <ButtonLink to="/" variant="outline">Return home</ButtonLink>
        </div>
      </div>
    </Container>
  );
};
