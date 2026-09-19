import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { addMonths, endOfMonth, format, isSameDay, parseISO, startOfMonth } from 'date-fns';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Container,
  DemoNotice,
  EmptyState,
  FieldError,
  FieldLabel,
  Markdown,
  PageHeader,
  inputClass,
} from '@/components/common/ui';
import { usePageMeta } from '@/components/layout/PublicLayout';
import { toast } from '@/components/ui/use-toast';
import { dataProvider } from '@/lib/data/provider';
import { councils } from '@/data/mockSeed';
import { formatCurrency, formatDate, formatDateTime, isUpcoming } from '@/lib/utils/format';
import { useAuth } from '@/lib/auth/AuthProvider';

const eventTypes = ['summit', 'forum', 'webinar', 'exhibition', 'training', 'meeting'];

export const EventsPage: React.FC = () => {
  usePageMeta('Events', 'Forums, summits, webinars, exhibitions and training from MCCI.');
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [type, setType] = useState('all');
  const [council, setCouncil] = useState('all');

  const filtered = useMemo(
    () =>
      events
        .filter((e) => (tab === 'upcoming' ? isUpcoming(e.starts_at) : !isUpcoming(e.starts_at)))
        .filter((e) => (type === 'all' ? true : e.event_type === type))
        .filter((e) => (council === 'all' ? true : e.council_id === council))
        .sort((a, b) => (tab === 'upcoming' ? a.starts_at.localeCompare(b.starts_at) : b.starts_at.localeCompare(a.starts_at))),
    [events, tab, type, council],
  );

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events & Engagement"
        description="The chamber convenes business through forums, summits, briefings, webinars and training across the year."
        breadcrumbs={[{ label: 'Events' }]}
      >
        <ButtonLink to="/events/calendar" variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Calendar view
        </ButtonLink>
      </PageHeader>

      <Container className="py-14">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div role="tablist" aria-label="Event timeframe" className="inline-flex rounded-md border border-surface-border bg-white p-1">
            {(['upcoming', 'past'] as const).map((value) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`rounded px-4 py-2 text-[13.5px] font-semibold capitalize transition-colors ${
                  tab === value ? 'bg-brand text-white' : 'text-ink-soft hover:text-brand-deep'
                }`}
              >
                {value} events
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="event-type" className="mb-1.5 block text-[13px] font-semibold text-ink">
                Event type
              </label>
              <select id="event-type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                <option value="all">All types</option>
                {eventTypes.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="event-council" className="mb-1.5 block text-[13px] font-semibold text-ink">
                Council
              </label>
              <select id="event-council" value={council} onChange={(e) => setCouncil(e.target.value)} className={inputClass}>
                <option value="all">All councils</option>
                {councils.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No events match these filters" description="Try a different event type or council." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((event) => (
              <Card key={event.id} className="flex flex-col p-5 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-md border border-surface-border bg-surface-page px-3 py-2 text-center">
                    <span className="block font-mono text-lg font-semibold leading-none text-brand-deep">
                      {formatDate(event.starts_at, 'dd')}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      {formatDate(event.starts_at, 'MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge status="published" label={event.event_type} />
                    {event.member_only && <Badge status="info" label="Members only" />}
                  </div>
                </div>
                <h2 className="mt-4 text-[16.5px] font-semibold leading-snug text-ink">
                  <Link to={`/events/${event.slug}`} className="hover:text-brand">
                    {event.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{event.summary}</p>
                {event.partner_organization && (
                  <p className="mt-3 rounded-md bg-brand-light px-3 py-2 text-[12.5px] font-medium text-brand-deep">
                    In partnership with {event.partner_organization}
                  </p>
                )}
                <dl className="mt-4 space-y-1.5 border-t border-surface-border pt-4 text-[12.5px] text-ink-soft">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                    <dd>{event.venue}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                    <dd>
                      {event.registered_count}/{event.capacity} registered
                    </dd>
                  </div>
                </dl>
                <ButtonLink to={`/events/${event.slug}`} variant="outline" className="mt-4 w-full">
                  {event.registration_open && isUpcoming(event.starts_at) ? 'View & register' : 'View details'}
                </ButtonLink>
              </Card>
            ))}
          </div>
        )}
        <DemoNotice className="mt-10" />
      </Container>
    </>
  );
};

export const EventsCalendarPage: React.FC = () => {
  usePageMeta('Events Calendar', 'Month view of chamber events.');
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const [month, setMonth] = useState(startOfMonth(new Date(2026, 1, 1)));

  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const leading = start.getDay();
    const cells: (Date | null)[] = Array.from({ length: leading }).map(() => null);
    for (let d = 1; d <= end.getDate(); d += 1) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    return cells;
  }, [month]);

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events Calendar"
        description="Month view of the chamber engagement calendar."
        breadcrumbs={[{ label: 'Events', to: '/events' }, { label: 'Calendar' }]}
      />
      <Container className="py-14">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, -1))}
              className="inline-flex items-center gap-1 rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-ink-soft hover:border-brand"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <h2 className="text-[18px] font-semibold text-ink">{format(month, 'MMMM yyyy')}</h2>
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="inline-flex items-center gap-1 rounded-md border border-surface-border px-3 py-2 text-[13px] font-semibold text-ink-soft hover:border-brand"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = day
                ? events.filter((e) => isSameDay(parseISO(e.starts_at), day))
                : [];
              return (
                <div
                  key={index}
                  className={`min-h-[92px] rounded-md border p-1.5 text-left ${
                    day ? 'border-surface-border bg-white' : 'border-transparent bg-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <span className="font-mono text-[11px] text-ink-muted">{format(day, 'd')}</span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((e) => (
                          <Link
                            key={e.id}
                            to={`/events/${e.slug}`}
                            className="block truncate rounded bg-brand-light px-1.5 py-1 text-[11px] font-medium text-brand-dark hover:bg-brand hover:text-white"
                            title={e.title}
                          >
                            {e.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        <div className="mt-6">
          <ButtonLink to="/events" variant="outline">
            List view
          </ButtonLink>
        </div>
      </Container>
    </>
  );
};

export const EventDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { user } = useAuth();
  const { data: event } = useQuery({ queryKey: ['event', slug], queryFn: () => dataProvider.event(slug) });
  usePageMeta(event?.title ?? 'Event', event?.summary);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', designation: '', island: '', organization: '',
    employment_status: '', experience_level: '', motivation: '', accessibility: '', privacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [applicationReference, setApplicationReference] = useState('');

  if (!event) {
    return (
      <Container className="py-20">
        <EmptyState title="Event not found" action={<ButtonLink to="/events">Back to events</ButtonLink>} />
      </Container>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Enter the attendee name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Enter a contact number.';
    if (event.event_type === 'training') {
      if (!form.island.trim()) next.island = 'Enter your island.';
      if (!form.employment_status) next.employment_status = 'Select your current employment status.';
      if (!form.experience_level) next.experience_level = 'Select your experience level.';
      if (form.motivation.trim().length < 20) next.motivation = 'Tell us briefly why you want to join (at least 20 characters).';
      if (!form.privacy) next.privacy = 'You must agree before submitting the application.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const record = await dataProvider.registerForEvent({
      event_id: event.id,
      user_id: user?.id,
      organization_id: user?.organization_id,
      attendee_name: form.name,
      attendee_email: form.email,
      attendee_phone: form.phone,
      designation: form.designation,
      registration_status: 'pending',
      payment_status: event.fee > 0 ? 'pending' : 'verified',
      applicant_island: form.island,
      applicant_organization: form.organization,
      employment_status: form.employment_status,
      experience_level: form.experience_level,
      motivation: form.motivation,
      accessibility_requirements: form.accessibility,
      privacy_accepted: form.privacy,
    });
    setSubmitting(false);
    setDone(true);
    setApplicationReference(record.application_reference ?? record.id);
    toast({
      title: 'Registration received',
      description: `Your registration for ${event.title} has been recorded. A confirmation email would be sent in production.`,
    });
  };

  const canRegister = event.registration_open && isUpcoming(event.starts_at);

  return (
    <>
      <PageHeader
        eyebrow={event.event_type}
        title={event.title}
        description={event.summary}
        breadcrumbs={[{ label: 'Events', to: '/events' }, { label: event.title }]}
      />
      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {event.event_type === 'training' && (
              <Card className="mb-8 overflow-hidden border-brand/20">
                <div className="bg-brand-deep px-6 py-5 text-white">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Public training programme</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">Delivered with {event.partner_organization ?? 'an MCCI member organisation'}</h2>
                    <Badge status="active" label={event.delivery_mode === 'physical' ? 'Physical classes' : event.delivery_mode} className="border-white/20 bg-white/10 text-white" />
                  </div>
                </div>
                <div className="grid gap-0 sm:grid-cols-4">
                  {[
                    ['1', 'Apply online', 'Complete the public application form.'],
                    ['2', 'Eligibility check', 'The chamber reviews every application.'],
                    ['3', 'Seat confirmation', 'The training partner confirms selected participants.'],
                    ['4', 'Attend classes', 'Approved applicants receive class instructions.'],
                  ].map(([number, title, copy]) => (
                    <div key={number} className="border-b border-surface-border p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                      <span className="font-mono text-[12px] font-semibold text-brand">STEP {number}</span>
                      <p className="mt-2 text-[14px] font-semibold text-ink">{title}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{copy}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            <Markdown content={event.description_markdown} />
            <DemoNotice className="mt-8" />
          </div>
          <aside className="space-y-4 lg:col-span-4">
            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">Event details</h2>
              <dl className="mt-4 space-y-3 text-[14px]">
                {[
                  ['Starts', formatDateTime(event.starts_at)],
                  ['Ends', formatDateTime(event.ends_at)],
                  ['Venue', event.venue],
                  ['Audience', event.audience],
                  ...(event.partner_organization ? [['Training partner', event.partner_organization]] : []),
                  ...(event.programme_reference ? [['Programme reference', event.programme_reference]] : []),
                  ['Capacity', `${event.registered_count} of ${event.capacity} registered`],
                  ['Fee', event.fee > 0 ? formatCurrency(event.fee, event.currency) : 'No fee'],
                  ['Registration closes', formatDate(event.registration_deadline)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</dt>
                    <dd className="mt-0.5 text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge status={canRegister ? 'active' : 'cancelled'} label={canRegister ? 'Registration open' : 'Registration closed'} />
                {event.member_only && <Badge status="info" label="Members only" />}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-[15px] font-semibold text-ink">{event.event_type === 'training' ? 'Apply for this programme' : 'Register'}</h2>
              {!canRegister ? (
                <p className="mt-2 text-[13.5px] text-ink-soft">
                  Registration is closed for this event. Browse other upcoming sessions in the events calendar.
                </p>
              ) : done ? (
                <div className="mt-3 rounded-md border border-chamber-green/30 bg-chamber-green-light p-4 text-[13.5px] text-chamber-green-dark">
                  <CheckCircle2 className="mb-2 h-5 w-5" aria-hidden="true" />
                  <strong className="block">Application received</strong>
                  <span className="mt-1 block">Reference <span className="font-mono font-semibold">{applicationReference}</span></span>
                  <span className="mt-2 block">The chamber will review your application. If selected, you will receive seat confirmation and payment instructions by email.</span>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="mt-3 space-y-3" noValidate>
                  <div>
                    <FieldLabel htmlFor="reg-name" required>
                      Full name
                    </FieldLabel>
                    <input
                      id="reg-name"
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      aria-invalid={Boolean(errors.name)}
                    />
                    <FieldError message={errors.name} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="reg-email" required>
                      Email
                    </FieldLabel>
                    <input
                      id="reg-email"
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={Boolean(errors.email)}
                    />
                    <FieldError message={errors.email} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="reg-phone" required>
                      Phone
                    </FieldLabel>
                    <input
                      id="reg-phone"
                      type="tel"
                      className={inputClass}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    <FieldError message={errors.phone} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="reg-designation">Designation</FieldLabel>
                    <input
                      id="reg-designation"
                      className={inputClass}
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    />
                  </div>
                  {event.event_type === 'training' && (
                    <>
                      <div>
                        <FieldLabel htmlFor="reg-island" required>Island</FieldLabel>
                        <input id="reg-island" className={inputClass} value={form.island} onChange={(e) => setForm({ ...form, island: e.target.value })} aria-invalid={Boolean(errors.island)} />
                        <FieldError message={errors.island} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="reg-organization">Organisation / school</FieldLabel>
                        <input id="reg-organization" className={inputClass} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Optional" />
                      </div>
                      <div>
                        <FieldLabel htmlFor="reg-employment" required>Current status</FieldLabel>
                        <select id="reg-employment" className={inputClass} value={form.employment_status} onChange={(e) => setForm({ ...form, employment_status: e.target.value })}>
                          <option value="">Select one</option>
                          <option value="Employed">Employed</option>
                          <option value="Self-employed">Self-employed</option>
                          <option value="Student">Student</option>
                          <option value="Seeking work">Seeking work</option>
                          <option value="Other">Other</option>
                        </select>
                        <FieldError message={errors.employment_status} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="reg-experience" required>Digital marketing experience</FieldLabel>
                        <select id="reg-experience" className={inputClass} value={form.experience_level} onChange={(e) => setForm({ ...form, experience_level: e.target.value })}>
                          <option value="">Select one</option>
                          <option value="None">No previous experience</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                        </select>
                        <FieldError message={errors.experience_level} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="reg-motivation" required>Why do you want to join?</FieldLabel>
                        <textarea id="reg-motivation" rows={4} className={inputClass} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} aria-invalid={Boolean(errors.motivation)} />
                        <FieldError message={errors.motivation} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="reg-accessibility">Accessibility or learning support</FieldLabel>
                        <textarea id="reg-accessibility" rows={2} className={inputClass} value={form.accessibility} onChange={(e) => setForm({ ...form, accessibility: e.target.value })} placeholder="Optional" />
                      </div>
                      <div>
                        <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                          <input type="checkbox" checked={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.checked })} className="mt-0.5 h-4 w-4 rounded border-surface-border text-brand focus:ring-brand" />
                          I confirm the information is accurate and agree to the chamber processing it for this training application.
                        </label>
                        <FieldError message={errors.privacy} />
                      </div>
                    </>
                  )}
                  <Button type="submit" loading={submitting} className="w-full">
                    {event.event_type === 'training' ? 'Submit application' : 'Submit registration'}
                  </Button>
                </form>
              )}
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
};
