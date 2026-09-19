import { envConfig } from '@/lib/config';
import { databaseDataProvider } from '@/lib/data/databaseProvider';

import {
  applications as seedApplications,
  auditLogs as seedAudit,
  councils as seedCouncils,
  demoUsers,
  eventRegistrations as seedRegistrations,
  events as seedEvents,
  inquiries as seedInquiries,
  invoices as seedInvoices,
  memberNotices as seedNotices,
  membershipTiers as seedTiers,
  msmePrograms as seedMsme,
  newsPosts as seedNews,
  newsletterSubscribers as seedSubscribers,
  organizations as seedOrganizations,
  partners as seedPartners,
  policyItems as seedPolicy,
  policySubmissions as seedSubmissions,
  publications as seedPublications,
  sectors as seedSectors,
} from '@/data/mockSeed';
import type {
  ApplicationStatus,
  AuditLog,
  AuthUser,
  ContactInquiry,
  Council,
  EventRegistration,
  Invoice,
  McciEvent,
  MemberNotice,
  MembershipApplication,
  MembershipTier,
  MsmeProgram,
  NewsPost,
  NewsletterSubscriber,
  Organization,
  Partner,
  PolicyItem,
  PolicySubmission,
  Publication,
  SearchResult,
  Sector,
} from '@/types';

const STORE_KEY = 'mcci.mock.store.v1';

interface MockStore {
  organizations: Organization[];
  applications: MembershipApplication[];
  news: NewsPost[];
  events: McciEvent[];
  publications: Publication[];
  policy: PolicyItem[];
  submissions: PolicySubmission[];
  msme: MsmeProgram[];
  partners: Partner[];
  councils: Council[];
  invoices: Invoice[];
  registrations: EventRegistration[];
  notices: MemberNotice[];
  inquiries: ContactInquiry[];
  subscribers: NewsletterSubscriber[];
  audit: AuditLog[];
}

function freshStore(): MockStore {
  return {
    organizations: [...seedOrganizations],
    applications: [...seedApplications],
    news: [...seedNews],
    events: [...seedEvents],
    publications: [...seedPublications],
    policy: [...seedPolicy],
    submissions: [...seedSubmissions],
    msme: [...seedMsme],
    partners: [...seedPartners],
    councils: [...seedCouncils],
    invoices: [...seedInvoices],
    registrations: [...seedRegistrations],
    notices: [...seedNotices],
    inquiries: [...seedInquiries],
    subscribers: [...seedSubscribers],
    audit: [...seedAudit],
  };
}

let store: MockStore = freshStore();

function loadStore(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) store = { ...freshStore(), ...(JSON.parse(raw) as Partial<MockStore>) };
  } catch {
    store = freshStore();
  }
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

loadStore();

export function resetMockStore(): void {
  store = freshStore();
  persist();
}

const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function logAudit(actor: string, action: string, entityType: string, entityId: string, summary: string): void {
  store.audit = [
    {
      id: `audit-${Date.now()}`,
      actor_user_id: 'mock',
      actor_name: actor,
      action,
      entity_type: entityType,
      entity_id: entityId,
      summary,
      metadata: {},
      created_at: new Date().toISOString(),
    },
    ...store.audit,
  ];
  persist();
}

export interface DataProvider {
  mode: 'mock' | 'database';

  sectors(): Promise<Sector[]>;
  tiers(): Promise<MembershipTier[]>;
  councils(): Promise<Council[]>;
  council(slug: string): Promise<Council | undefined>;
  organizations(): Promise<Organization[]>;
  organization(slug: string): Promise<Organization | undefined>;
  organizationById(id: string): Promise<Organization | undefined>;
  updateOrganization(id: string, patch: Partial<Organization>, actor: string): Promise<Organization | undefined>;
  news(): Promise<NewsPost[]>;
  newsPost(slug: string): Promise<NewsPost | undefined>;
  events(): Promise<McciEvent[]>;
  event(slug: string): Promise<McciEvent | undefined>;
  publications(): Promise<Publication[]>;
  publication(slug: string): Promise<Publication | undefined>;
  policyItems(): Promise<PolicyItem[]>;
  policyItem(slug: string): Promise<PolicyItem | undefined>;
  policySubmissions(): Promise<PolicySubmission[]>;
  msmePrograms(): Promise<MsmeProgram[]>;
  partners(): Promise<Partner[]>;
  applications(): Promise<MembershipApplication[]>;
  application(id: string): Promise<MembershipApplication | undefined>;
  applicationsForUser(userId: string): Promise<MembershipApplication[]>;
  createApplication(input: Partial<MembershipApplication>, user: AuthUser): Promise<MembershipApplication>;
  setApplicationStatus(id: string, status: ApplicationStatus, note: string, actor: string): Promise<MembershipApplication | undefined>;
  completeMembershipPayment(id: string, paymentReference: string, actor: string): Promise<MembershipApplication | undefined>;
  invoices(organizationId?: string): Promise<Invoice[]>;
  registrations(userId?: string): Promise<EventRegistration[]>;
  registerForEvent(input: Omit<EventRegistration, 'id' | 'registered_at'>): Promise<EventRegistration>;
  updateRegistrationStatus(id: string, status: EventRegistration['registration_status'], note: string, actor: string): Promise<EventRegistration | undefined>;
  notices(): Promise<MemberNotice[]>;
  inquiries(): Promise<ContactInquiry[]>;
  createInquiry(input: Omit<ContactInquiry, 'id' | 'created_at' | 'status'>): Promise<ContactInquiry>;
  updateInquiryStatus(id: string, status: ContactInquiry['status']): Promise<void>;
  subscribers(): Promise<NewsletterSubscriber[]>;
  addSubscriber(email: string, firstName?: string, company?: string): Promise<void>;
  auditLogs(): Promise<AuditLog[]>;
  users(): Promise<AuthUser[]>;
  search(query: string): Promise<SearchResult[]>;
  saveContent<T extends { id: string }>(collection: ContentCollection, record: T, actor: string): Promise<void>;
  deleteContent(collection: ContentCollection, id: string, actor: string): Promise<void>;
}

export type ContentCollection =
  | 'news'
  | 'events'
  | 'publications'
  | 'policy'
  | 'submissions'
  | 'msme'
  | 'partners'
  | 'councils'
  | 'notices';

const mockProvider: DataProvider = {
  mode: 'mock',
  sectors: () => delay(seedSectors),
  tiers: () => delay(seedTiers),
  councils: () => delay(store.councils),
  council: (slug) => delay(store.councils.find((c) => c.slug === slug)),
  organizations: () => delay(store.organizations),
  organization: (slug) => delay(store.organizations.find((o) => o.slug === slug)),
  organizationById: (id) => delay(store.organizations.find((o) => o.id === id)),
  updateOrganization: (id, patch, actor) => {
    const index = store.organizations.findIndex((o) => o.id === id);
    if (index === -1) return delay(undefined);
    const protectedKeys: (keyof Organization)[] = [
      'verification_status',
      'membership_status',
      'member_number',
      'internal_notes',
      'tier_id',
    ];
    const safePatch = { ...patch };
    protectedKeys.forEach((key) => delete safePatch[key]);
    store.organizations[index] = {
      ...store.organizations[index],
      ...safePatch,
      updated_at: new Date().toISOString(),
    };
    persist();
    logAudit(actor, 'organization.updated', 'organization', id, `Updated organisation profile`);
    return delay(store.organizations[index]);
  },
  news: () => delay(store.news),
  newsPost: (slug) => delay(store.news.find((n) => n.slug === slug)),
  events: () => delay(store.events),
  event: (slug) => delay(store.events.find((e) => e.slug === slug)),
  publications: () => delay(store.publications),
  publication: (slug) => delay(store.publications.find((p) => p.slug === slug)),
  policyItems: () => delay(store.policy),
  policyItem: (slug) => delay(store.policy.find((p) => p.slug === slug)),
  policySubmissions: () => delay(store.submissions),
  msmePrograms: () => delay(store.msme),
  partners: () => delay(store.partners),
  applications: () => delay(store.applications),
  application: (id) => delay(store.applications.find((a) => a.id === id)),
  applicationsForUser: (userId) =>
    delay(store.applications.filter((a) => a.applicant_user_id === userId)),
  createApplication: (input, user) => {
    const reference = `MCCI-APP-2026-${(store.applications.length + 1).toString().padStart(4, '0')}`;
    const now = new Date().toISOString();
    const record: MembershipApplication = {
      id: `app-${Date.now()}`,
      application_reference: reference,
      applicant_user_id: user.id,
      applicant_name: user.full_name,
      tier_id: input.tier_id ?? 'tier-standard',
      status: 'submitted',
      legal_business_name: input.legal_business_name ?? '',
      trading_name: input.trading_name ?? '',
      registration_number: input.registration_number ?? '',
      year_established: input.year_established ?? '',
      sector_id: input.sector_id ?? '',
      annual_turnover_range: input.annual_turnover_range ?? '',
      employee_count: input.employee_count ?? '',
      registered_address: input.registered_address ?? '',
      island: input.island ?? '',
      atoll: input.atoll ?? '',
      website: input.website ?? '',
      contact_name: input.contact_name ?? '',
      contact_designation: input.contact_designation ?? '',
      contact_email: input.contact_email ?? '',
      contact_mobile: input.contact_mobile ?? '',
      selected_council_ids: input.selected_council_ids ?? [],
      declaration_accepted: true,
      privacy_accepted: true,
      payment_status: 'pending',
      documents: input.documents ?? [],
      timeline: [
        { id: `t-${Date.now()}`, status: 'draft', note: 'Application created', actor: user.full_name, created_at: now },
        { id: `t-${Date.now() + 1}`, status: 'submitted', note: 'Application submitted for review', actor: user.full_name, created_at: now },
      ],
      submitted_at: now,
      created_at: now,
      updated_at: now,
      is_demo: true,
    };
    store.applications = [record, ...store.applications];
    persist();
    logAudit(user.full_name, 'application.submitted', 'membership_application', record.id, `Submitted ${reference}`);
    return delay(record);
  },
  setApplicationStatus: (id, status, note, actor) => {
    const index = store.applications.findIndex((a) => a.id === id);
    if (index === -1) return delay(undefined);
    const now = new Date().toISOString();
    const app = store.applications[index];
    const updated: MembershipApplication = {
      ...app,
      status,
      review_notes: status === 'more_information_required' ? note : app.review_notes,
      rejection_reason: status === 'rejected' ? note : app.rejection_reason,
      updated_at: now,
      timeline: [
        ...app.timeline,
        { id: `t-${Date.now()}`, status, note, actor, created_at: now },
      ],
    };
    store.applications[index] = updated;

    if (status === 'approved') {
      updated.payment_status = 'pending';
    }
    if (status === 'approved' && updated.organization_id) {
      const orgIndex = store.organizations.findIndex((o) => o.id === updated.organization_id);
      if (orgIndex > -1) {
        store.organizations[orgIndex] = {
          ...store.organizations[orgIndex],
          membership_status: 'pending',
          verification_status: 'pending',
          tier_id: updated.tier_id,
          updated_at: now,
        };
      }
    }
    persist();
    logAudit(actor, `application.${status}`, 'membership_application', id, `${updated.application_reference} → ${status}`);
    return delay(updated);
  },
  completeMembershipPayment: (id, paymentReference, actor) => {
    const index = store.applications.findIndex((a) => a.id === id);
    if (index === -1) return delay(undefined);
    const app = store.applications[index];
    if (app.status !== 'approved') return delay(app);

    const now = new Date().toISOString();
    const serial = (index + 1).toString().padStart(4, '0');
    const memberNumber = app.member_number ?? `MCCI-${new Date().getFullYear()}-${serial}`;
    const certificateNumber = app.certificate_number ?? `CERT-${new Date().getFullYear()}-${serial}`;
    const updated: MembershipApplication = {
      ...app,
      payment_status: 'verified',
      payment_reference: paymentReference,
      paid_at: now,
      member_number: memberNumber,
      certificate_number: certificateNumber,
      certificate_issued_at: now,
      updated_at: now,
      timeline: [
        ...app.timeline,
        { id: `t-${Date.now()}`, status: 'approved', note: 'Payment confirmed. Membership activated and digital certificate issued.', actor, created_at: now },
      ],
    };
    store.applications[index] = updated;

    if (updated.organization_id) {
      const orgIndex = store.organizations.findIndex((o) => o.id === updated.organization_id);
      if (orgIndex > -1) {
        store.organizations[orgIndex] = {
          ...store.organizations[orgIndex],
          membership_status: 'active',
          verification_status: 'verified',
          tier_id: updated.tier_id,
          member_number: memberNumber,
          updated_at: now,
        };
      }
    }
    persist();
    logAudit(actor, 'membership.payment_completed', 'membership_application', id, `${updated.application_reference} payment verified; certificate ${certificateNumber} issued`);
    return delay(updated);
  },
  invoices: (organizationId) =>
    delay(organizationId ? store.invoices.filter((i) => i.organization_id === organizationId) : store.invoices),
  registrations: (userId) =>
    delay(userId ? store.registrations.filter((r) => r.user_id === userId) : store.registrations),
  registerForEvent: (input) => {
    const record: EventRegistration = {
      ...input,
      id: `reg-${Date.now()}`,
      application_reference: input.application_reference ?? `MCCI-TRN-APP-${new Date().getFullYear()}-${(store.registrations.length + 1).toString().padStart(4, '0')}`,
      registered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.registrations = [record, ...store.registrations];
    persist();
    return delay(record);
  },
  updateRegistrationStatus: (id, status, note, actor) => {
    const index = store.registrations.findIndex((registration) => registration.id === id);
    if (index === -1) return delay(undefined);
    store.registrations[index] = {
      ...store.registrations[index],
      registration_status: status,
      review_note: note,
      updated_at: new Date().toISOString(),
    };
    persist();
    logAudit(actor, `training_application.${status}`, 'event_registration', id, `Training application ${store.registrations[index].application_reference ?? id} marked ${status}`);
    return delay(store.registrations[index]);
  },
  notices: () => delay(store.notices),
  inquiries: () => delay(store.inquiries),
  createInquiry: (input) => {
    const record: ContactInquiry = {
      ...input,
      id: `inq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    store.inquiries = [record, ...store.inquiries];
    persist();
    return delay(record);
  },
  updateInquiryStatus: (id, status) => {
    store.inquiries = store.inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    persist();
    return delay(undefined);
  },
  subscribers: () => delay(store.subscribers),
  addSubscriber: (email, firstName, company) => {
    if (!store.subscribers.some((s) => s.email === email)) {
      store.subscribers = [
        {
          id: `sub-news-${Date.now()}`,
          email,
          first_name: firstName,
          company,
          interests: ['newsletter'],
          status: 'subscribed',
          subscribed_at: new Date().toISOString(),
        },
        ...store.subscribers,
      ];
      persist();
    }
    return delay(undefined);
  },
  auditLogs: () => delay(store.audit),
  users: () =>
    delay(
      demoUsers.map(({ password: _password, ...user }) => user),
    ),
  search: (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return delay([]);
    const results: SearchResult[] = [];
    const push = (type: string, title: string, excerpt: string, route: string, date?: string) => {
      if (`${title} ${excerpt}`.toLowerCase().includes(q)) {
        results.push({ type, title, excerpt, route, date });
      }
    };
    store.councils.forEach((c) => push('Council', c.name, c.short_description, `/councils/${c.slug}`));
    store.news.forEach((n) => push('News', n.title, n.excerpt, `/news/${n.slug}`, n.published_at));
    store.events.forEach((e) => push('Event', e.title, e.summary, `/events/${e.slug}`, e.starts_at));
    store.publications.forEach((p) => push('Publication', p.title, p.summary, `/publications/${p.slug}`, p.published_at));
    store.policy.forEach((p) => push('Policy', p.title, p.summary, `/policy/positions`, p.published_at));
    store.msme.forEach((m) => push('MSME programme', m.title, m.summary, `/msme/programs`));
    store.organizations
      .filter((o) => o.directory_visible)
      .forEach((o) => push('Member', o.display_name, o.description, `/directory/members/${o.slug}`));
    push('Page', 'Membership overview', 'Benefits, tiers and how to apply for MCCI membership.', '/membership');
    push('Page', 'Contact MCCI', 'Reach the secretariat, membership, events or policy teams.', '/contact');
    return delay(results.slice(0, 40));
  },
  saveContent: (collection, record, actor) => {
    const list = store[collection] as { id: string }[];
    const index = list.findIndex((item) => item.id === record.id);
    if (index > -1) list[index] = record;
    else list.unshift(record);
    persist();
    logAudit(actor, `${collection}.saved`, collection, record.id, `Saved ${collection} record`);
    return delay(undefined);
  },
  deleteContent: (collection, id, actor) => {
    const list = store[collection] as { id: string }[];
    const next = list.filter((item) => item.id !== id);
    list.length = 0;
    next.forEach((item) => list.push(item));
    persist();
    logAudit(actor, `${collection}.deleted`, collection, id, `Deleted ${collection} record`);
    return delay(undefined);
  },
};


/**
 * Selects the active data provider.
 *
 * The database repositories live in src/lib/data/databaseProvider.ts and are
 * used only when VITE_DATA_MODE=database and the credentials are present.
 * In every other case the mock provider keeps the preview fully usable.
 */
export function getDataProvider(): DataProvider {
  if (envConfig.dataMode === 'database' && databaseDataProvider) {
    return databaseDataProvider;
  }
  return mockProvider;
}

export const dataProvider = getDataProvider();
export { mockProvider };
