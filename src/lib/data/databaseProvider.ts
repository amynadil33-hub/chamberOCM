import { supabase } from '@/lib/supabase';
import type { DataProvider, ContentCollection } from '@/lib/data/provider';
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

/* -------------------------------------------------------------------------- */
/* Table names                                                                */
/* -------------------------------------------------------------------------- */

export const TABLES = {
  profiles: 'profiles',
  userRoles: 'user_roles',
  sectors: 'sectors',
  tiers: 'membership_tiers',
  councils: 'councils',
  organizations: 'organizations',
  organizationUsers: 'organization_users',
  applications: 'membership_applications',
  documents: 'application_documents',
  memberships: 'memberships',
  news: 'news_posts',
  events: 'events',
  registrations: 'event_registrations',
  publications: 'publications',
  policy: 'policy_items',
  submissions: 'policy_submissions',
  msme: 'msme_programs',
  partners: 'partners',
  invoices: 'invoices',
  notices: 'member_notices',
  inquiries: 'contact_inquiries',
  subscribers: 'newsletter_subscribers',
  audit: 'audit_logs',
} as const;

const collectionTable: Record<ContentCollection, string> = {
  news: TABLES.news,
  events: TABLES.events,
  publications: TABLES.publications,
  policy: TABLES.policy,
  submissions: TABLES.submissions,
  msme: TABLES.msme,
  partners: TABLES.partners,
  councils: TABLES.councils,
  notices: TABLES.notices,
};

const contentColumns: Record<ContentCollection, readonly string[]> = {
  news: [
    'id', 'category_id', 'title', 'slug', 'excerpt', 'body_markdown', 'cover_image_path',
    'author_user_id', 'author_display_name', 'status', 'featured', 'published_at',
    'seo_title', 'seo_description', 'is_demo',
  ],
  events: [
    'id', 'council_id', 'title', 'slug', 'event_type', 'summary', 'description_markdown',
    'cover_image_path', 'starts_at', 'ends_at', 'venue', 'island', 'atoll', 'online_url',
    'audience', 'capacity', 'fee', 'currency', 'registration_open',
    'registration_deadline', 'member_only', 'status', 'featured', 'is_demo',
  ],
  publications: [
    'id', 'title', 'slug', 'publication_type', 'summary', 'description_markdown',
    'cover_image_path', 'file_path', 'page_count', 'published_at', 'status', 'featured', 'is_demo',
  ],
  policy: [
    'id', 'title', 'slug', 'category', 'reference_number', 'summary', 'body_markdown',
    'position_status', 'progress_percent', 'supporting_file_path', 'status', 'published_at',
    'featured', 'is_demo',
  ],
  submissions: [
    'id', 'reference_number', 'title', 'slug', 'submitted_to', 'submission_date',
    'response_status', 'summary', 'file_path', 'status', 'is_demo',
  ],
  msme: [
    'id', 'title', 'slug', 'program_type', 'provider', 'summary', 'description_markdown',
    'eligibility', 'deadline', 'application_url', 'status', 'featured', 'is_demo',
  ],
  partners: ['id', 'name', 'slug', 'partner_type', 'logo_path', 'website', 'display_order', 'active', 'is_demo'],
  councils: [
    'id', 'name', 'slug', 'short_description', 'full_description_markdown', 'icon_name',
    'hero_image_path', 'chair_name', 'chair_title', 'contact_email', 'member_count_display',
    'established_year', 'objectives', 'policy_priorities', 'status', 'display_order', 'is_demo',
  ],
  notices: ['id', 'title', 'body_markdown', 'audience_type', 'published_at', 'expires_at', 'status'],
};

/** Convert the shared admin form into columns that actually exist on each table. */
function contentPayload(collection: ContentCollection, record: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...record };

  if (collection === 'councils') normalized.full_description_markdown ??= normalized.body_markdown;
  if (collection === 'events' || collection === 'publications' || collection === 'msme') {
    normalized.description_markdown ??= normalized.body_markdown;
  }
  if (collection === 'events') normalized.starts_at ??= normalized.published_at ?? new Date().toISOString();
  if (collection === 'submissions') {
    normalized.reference_number ??= `SUB-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }
  if (collection === 'partners') normalized.active = normalized.status !== 'archived';

  return Object.fromEntries(
    contentColumns[collection]
      .filter((column) => normalized[column] !== undefined)
      .map((column) => [column, normalized[column]]),
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

type Row = Record<string, unknown>;

/** Never throw at the UI boundary — log and return a safe fallback. */
async function safeList<T>(
  run: () => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  map: (row: Row) => T,
): Promise<T[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await run();
    if (error) {
      console.error('[databaseProvider]', error.message);
      return [];
    }
    return ((data as Row[]) ?? []).map(map);
  } catch (error) {
    console.error('[databaseProvider]', error);
    return [];
  }
}

async function safeOne<T>(
  run: () => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  map: (row: Row) => T,
): Promise<T | undefined> {
  if (!supabase) return undefined;
  try {
    const { data, error } = await run();
    if (error || !data) return undefined;
    return map(data as Row);
  } catch (error) {
    console.error('[databaseProvider]', error);
    return undefined;
  }
}

const str = (value: unknown, fallback = ''): string =>
  value === null || value === undefined ? fallback : String(value);
const num = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const bool = (value: unknown): boolean => value === true;
const arr = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

async function writeAudit(
  actor: string,
  action: string,
  entityType: string,
  entityId: string,
  summary: string,
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from(TABLES.audit).insert({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      actor_user_id: 'app',
      actor_name: actor,
      action,
      entity_type: entityType,
      entity_id: entityId,
      summary,
      metadata: {},
    });
  } catch {
    /* auditing must never block a user action */
  }
}

/* -------------------------------------------------------------------------- */
/* Row mappers                                                                 */
/* -------------------------------------------------------------------------- */

const mapSector = (r: Row): Sector => ({
  id: str(r.id),
  name: str(r.name),
  slug: str(r.slug),
  description: str(r.description),
  active: bool(r.active),
  display_order: num(r.display_order),
});

const mapTier = (r: Row): MembershipTier => ({
  id: str(r.id),
  name: str(r.name),
  slug: str(r.slug),
  annual_fee: num(r.annual_fee),
  currency: str(r.currency, 'MVR'),
  description: str(r.description),
  benefits: arr<string>(r.benefits),
  active: bool(r.active),
  display_order: num(r.display_order),
  is_demo: bool(r.is_demo),
});

const mapCouncil = (r: Row): Council => ({
  id: str(r.id),
  name: str(r.name),
  slug: str(r.slug),
  short_description: str(r.short_description),
  full_description_markdown: str(r.full_description_markdown),
  icon_name: str(r.icon_name),
  chair_name: str(r.chair_name),
  chair_title: str(r.chair_title),
  contact_email: str(r.contact_email),
  member_count_display: num(r.member_count_display),
  established_year: num(r.established_year),
  objectives: arr<string>(r.objectives),
  policy_priorities: arr<string>(r.policy_priorities),
  initiatives: arr<{ title: string; summary: string; status: string }>(r.initiatives),
  status: str(r.status, 'published') as Council['status'],
  display_order: num(r.display_order),
  is_demo: bool(r.is_demo),
});

const mapOrganization = (r: Row): Organization => ({
  id: str(r.id),
  legal_name: str(r.legal_name),
  display_name: str(r.display_name),
  slug: str(r.slug),
  registration_number: str(r.registration_number),
  year_established: num(r.year_established),
  sector_id: str(r.sector_id),
  annual_turnover_range: str(r.annual_turnover_range),
  employee_count: str(r.employee_count),
  description: str(r.description),
  registered_address: str(r.registered_address),
  island: str(r.island),
  atoll: str(r.atoll),
  public_email: str(r.public_email) || undefined,
  public_phone: str(r.public_phone) || undefined,
  website: str(r.website) || undefined,
  logo_path: str(r.logo_path) || undefined,
  directory_visible: bool(r.directory_visible),
  verification_status: str(r.verification_status, 'unverified') as Organization['verification_status'],
  tier_id: str(r.tier_id) || undefined,
  membership_status: str(r.membership_status, 'pending') as Organization['membership_status'],
  member_number: str(r.member_number) || undefined,
  internal_notes: str(r.internal_notes) || undefined,
  is_demo: bool(r.is_demo),
  created_at: str(r.created_at),
  updated_at: str(r.updated_at),
});

const mapNews = (r: Row): NewsPost => ({
  id: str(r.id),
  category: str(r.category, 'Chamber News'),
  title: str(r.title),
  slug: str(r.slug),
  excerpt: str(r.excerpt),
  body_markdown: str(r.body_markdown),
  author_display_name: str(r.author_display_name),
  status: str(r.status, 'published') as NewsPost['status'],
  featured: bool(r.featured),
  published_at: str(r.published_at),
  seo_title: str(r.seo_title) || undefined,
  seo_description: str(r.seo_description) || undefined,
  is_demo: bool(r.is_demo),
});

const mapEvent = (r: Row): McciEvent => ({
  id: str(r.id),
  council_id: str(r.council_id) || undefined,
  title: str(r.title),
  slug: str(r.slug),
  event_type: str(r.event_type, 'forum') as McciEvent['event_type'],
  summary: str(r.summary),
  description_markdown: str(r.description_markdown),
  starts_at: str(r.starts_at),
  ends_at: str(r.ends_at),
  venue: str(r.venue),
  island: str(r.island),
  atoll: str(r.atoll),
  audience: str(r.audience),
  capacity: num(r.capacity),
  registered_count: num(r.registered_count),
  fee: num(r.fee),
  currency: str(r.currency, 'MVR'),
  registration_open: bool(r.registration_open),
  registration_deadline: str(r.registration_deadline),
  member_only: bool(r.member_only),
  status: str(r.status, 'published') as McciEvent['status'],
  featured: bool(r.featured),
  is_demo: bool(r.is_demo),
  partner_organization: str(r.partner_organization) || undefined,
  delivery_mode: (str(r.delivery_mode) || undefined) as McciEvent['delivery_mode'],
  programme_reference: str(r.programme_reference) || undefined,
});

const mapRegistration = (r: Row): EventRegistration => ({
  id: str(r.id),
  event_id: str(r.event_id),
  user_id: str(r.user_id) || undefined,
  organization_id: str(r.organization_id) || undefined,
  attendee_name: str(r.attendee_name),
  attendee_email: str(r.attendee_email),
  attendee_phone: str(r.attendee_phone),
  designation: str(r.designation),
  registration_status: str(r.registration_status, 'pending') as EventRegistration['registration_status'],
  payment_status: str(r.payment_status, 'pending') as EventRegistration['payment_status'],
  registered_at: str(r.registered_at),
  application_reference: str(r.application_reference) || undefined,
  applicant_island: str(r.applicant_island) || undefined,
  applicant_organization: str(r.applicant_organization) || undefined,
  employment_status: str(r.employment_status) || undefined,
  experience_level: str(r.experience_level) || undefined,
  motivation: str(r.motivation) || undefined,
  accessibility_requirements: str(r.accessibility_requirements) || undefined,
  privacy_accepted: bool(r.privacy_accepted),
  review_note: str(r.review_note) || undefined,
  updated_at: str(r.updated_at) || undefined,
});

const mapPublication = (r: Row): Publication => ({
  id: str(r.id),
  title: str(r.title),
  slug: str(r.slug),
  publication_type: str(r.publication_type, 'research') as Publication['publication_type'],
  summary: str(r.summary),
  description_markdown: str(r.description_markdown),
  file_path: str(r.file_path),
  page_count: num(r.page_count),
  published_at: str(r.published_at),
  status: str(r.status, 'published') as Publication['status'],
  featured: bool(r.featured),
  is_demo: bool(r.is_demo),
});

const mapPolicy = (r: Row): PolicyItem => ({
  id: str(r.id),
  title: str(r.title),
  slug: str(r.slug),
  category: str(r.category),
  reference_number: str(r.reference_number),
  summary: str(r.summary),
  body_markdown: str(r.body_markdown),
  position_status: str(r.position_status),
  progress_percent: num(r.progress_percent),
  status: str(r.status, 'published') as PolicyItem['status'],
  published_at: str(r.published_at),
  featured: bool(r.featured),
  is_demo: bool(r.is_demo),
});

const mapSubmission = (r: Row): PolicySubmission => ({
  id: str(r.id),
  reference_number: str(r.reference_number),
  title: str(r.title),
  slug: str(r.slug),
  submitted_to: str(r.submitted_to),
  submission_date: str(r.submission_date),
  response_status: str(r.response_status),
  summary: str(r.summary),
  file_path: str(r.file_path),
  status: str(r.status, 'published') as PolicySubmission['status'],
  is_demo: bool(r.is_demo),
});

const mapMsme = (r: Row): MsmeProgram => ({
  id: str(r.id),
  title: str(r.title),
  slug: str(r.slug),
  program_type: str(r.program_type, 'training') as MsmeProgram['program_type'],
  provider: str(r.provider),
  summary: str(r.summary),
  description_markdown: str(r.description_markdown),
  eligibility: str(r.eligibility),
  deadline: str(r.deadline),
  status: str(r.status, 'published') as MsmeProgram['status'],
  featured: bool(r.featured),
  is_demo: bool(r.is_demo),
});

const mapPartner = (r: Row): Partner => ({
  id: str(r.id),
  name: str(r.name),
  slug: str(r.slug),
  partner_type: str(r.partner_type),
  website: str(r.website),
  display_order: num(r.display_order),
  active: bool(r.active),
  is_demo: bool(r.is_demo),
});

const mapInvoice = (r: Row): Invoice => ({
  id: str(r.id),
  organization_id: str(r.organization_id),
  invoice_number: str(r.invoice_number),
  description: str(r.description),
  amount: num(r.amount),
  currency: str(r.currency, 'MVR'),
  issued_at: str(r.issued_at),
  due_at: str(r.due_at),
  status: str(r.status, 'issued') as Invoice['status'],
  payment_method: str(r.payment_method),
  transaction_reference: str(r.transaction_reference) || undefined,
});

const mapNotice = (r: Row): MemberNotice => ({
  id: str(r.id),
  title: str(r.title),
  body_markdown: str(r.body_markdown),
  audience_type: str(r.audience_type, 'all_members') as MemberNotice['audience_type'],
  published_at: str(r.published_at),
  expires_at: str(r.expires_at) || undefined,
  status: str(r.status, 'published') as MemberNotice['status'],
});

const mapInquiry = (r: Row): ContactInquiry => ({
  id: str(r.id),
  department: str(r.department),
  name: str(r.name),
  company: str(r.company),
  email: str(r.email),
  phone: str(r.phone),
  subject: str(r.subject),
  message: str(r.message),
  privacy_accepted: bool(r.privacy_accepted),
  status: str(r.status, 'new') as ContactInquiry['status'],
  assigned_to: str(r.assigned_to) || undefined,
  internal_notes: str(r.internal_notes) || undefined,
  created_at: str(r.created_at),
});

const mapSubscriber = (r: Row): NewsletterSubscriber => ({
  id: str(r.id),
  email: str(r.email),
  first_name: str(r.first_name) || undefined,
  last_name: str(r.last_name) || undefined,
  company: str(r.company) || undefined,
  interests: arr<string>(r.interests),
  status: str(r.status, 'subscribed') as NewsletterSubscriber['status'],
  subscribed_at: str(r.subscribed_at),
});

const mapAudit = (r: Row): AuditLog => ({
  id: str(r.id),
  actor_user_id: str(r.actor_user_id),
  actor_name: str(r.actor_name),
  action: str(r.action),
  entity_type: str(r.entity_type),
  entity_id: str(r.entity_id),
  summary: str(r.summary),
  metadata: (r.metadata as Record<string, string | number | boolean>) ?? {},
  created_at: str(r.created_at),
});

const mapApplication = (r: Row, documents: MembershipApplication['documents'] = []): MembershipApplication => ({
  id: str(r.id),
  application_reference: str(r.application_reference),
  organization_id: str(r.organization_id) || undefined,
  applicant_user_id: str(r.applicant_user_id),
  applicant_name: str(r.applicant_name),
  tier_id: str(r.tier_id),
  status: str(r.status, 'draft') as ApplicationStatus,
  legal_business_name: str(r.legal_business_name),
  trading_name: str(r.trading_name),
  registration_number: str(r.registration_number),
  year_established: str(r.year_established),
  sector_id: str(r.sector_id),
  annual_turnover_range: str(r.annual_turnover_range),
  employee_count: str(r.employee_count),
  registered_address: str(r.registered_address),
  island: str(r.island),
  atoll: str(r.atoll),
  website: str(r.website),
  contact_name: str(r.contact_name),
  contact_designation: str(r.contact_designation),
  contact_email: str(r.contact_email),
  contact_mobile: str(r.contact_mobile),
  selected_council_ids: arr<string>(r.selected_council_ids),
  declaration_accepted: bool(r.declaration_accepted),
  privacy_accepted: bool(r.privacy_accepted),
  documents,
  timeline: arr<MembershipApplication['timeline'][number]>(r.timeline),
  review_notes: str(r.review_notes) || undefined,
  rejection_reason: str(r.rejection_reason) || undefined,
  payment_status: (str(r.payment_status) || undefined) as MembershipApplication['payment_status'],
  payment_reference: str(r.payment_reference) || undefined,
  paid_at: str(r.paid_at) || undefined,
  member_number: str(r.member_number) || undefined,
  certificate_number: str(r.certificate_number) || undefined,
  certificate_issued_at: str(r.certificate_issued_at) || undefined,
  submitted_at: str(r.submitted_at) || undefined,
  created_at: str(r.created_at),
  updated_at: str(r.updated_at),
  is_demo: bool(r.is_demo),
});

const mapDocument = (r: Row): MembershipApplication['documents'][number] => ({
  id: str(r.id),
  application_id: str(r.application_id),
  document_type: str(r.document_type),
  original_filename: str(r.original_filename),
  storage_path: str(r.storage_path),
  mime_type: str(r.mime_type),
  file_size: num(r.file_size),
  status: str(r.status, 'uploaded') as MembershipApplication['documents'][number]['status'],
  review_notes: str(r.review_notes) || undefined,
  uploaded_at: str(r.uploaded_at),
});

/* -------------------------------------------------------------------------- */
/* Provider                                                                    */
/* -------------------------------------------------------------------------- */

async function loadApplications(filter?: { id?: string; userId?: string }): Promise<MembershipApplication[]> {
  if (!supabase) return [];
  let query = supabase.from(TABLES.applications).select('*').order('created_at', { ascending: false });
  if (filter?.id) query = query.eq('id', filter.id);
  if (filter?.userId) query = query.eq('applicant_user_id', filter.userId);

  const { data, error } = await query;
  if (error || !data) {
    if (error) console.error('[databaseProvider]', error.message);
    return [];
  }
  const rows = data as Row[];
  const ids = rows.map((r) => str(r.id));
  let docs: MembershipApplication['documents'] = [];
  if (ids.length > 0) {
    const { data: docData } = await supabase
      .from(TABLES.documents)
      .select('*')
      .in('application_id', ids);
    docs = ((docData as Row[]) ?? []).map(mapDocument);
  }
  return rows.map((row) => mapApplication(row, docs.filter((d) => d.application_id === str(row.id))));
}

export const databaseDataProvider: DataProvider = {
  mode: 'database',

  sectors: () =>
    safeList(() => supabase!.from(TABLES.sectors).select('*').order('display_order'), mapSector),
  tiers: () =>
    safeList(() => supabase!.from(TABLES.tiers).select('*').order('display_order'), mapTier),

  councils: () =>
    safeList(() => supabase!.from(TABLES.councils).select('*').order('display_order'), mapCouncil),
  council: (slug) =>
    safeOne(() => supabase!.from(TABLES.councils).select('*').eq('slug', slug).maybeSingle(), mapCouncil),

  organizations: () =>
    safeList(() => supabase!.from(TABLES.organizations).select('*').order('display_name'), mapOrganization),
  organization: (slug) =>
    safeOne(() => supabase!.from(TABLES.organizations).select('*').eq('slug', slug).maybeSingle(), mapOrganization),
  organizationById: (id) =>
    safeOne(() => supabase!.from(TABLES.organizations).select('*').eq('id', id).maybeSingle(), mapOrganization),

  updateOrganization: async (id, patch, actor) => {
    if (!supabase) return undefined;
    // Members may never change these columns; RLS blocks it too.
    const protectedKeys: (keyof Organization)[] = [
      'verification_status',
      'membership_status',
      'member_number',
      'internal_notes',
      'tier_id',
    ];
    const safePatch: Record<string, unknown> = { ...patch, updated_at: new Date().toISOString() };
    protectedKeys.forEach((key) => delete safePatch[key as string]);
    delete safePatch.id;

    const { data, error } = await supabase
      .from(TABLES.organizations)
      .update(safePatch)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) {
      console.error('[databaseProvider]', error.message);
      return undefined;
    }
    await writeAudit(actor, 'organization.updated', 'organization', id, 'Updated organisation profile');
    return data ? mapOrganization(data as Row) : undefined;
  },

  news: () =>
    safeList(
      () => supabase!.from(TABLES.news).select('*').order('published_at', { ascending: false }),
      mapNews,
    ),
  newsPost: (slug) =>
    safeOne(() => supabase!.from(TABLES.news).select('*').eq('slug', slug).maybeSingle(), mapNews),

  events: () =>
    safeList(() => supabase!.from(TABLES.events).select('*').order('starts_at'), mapEvent),
  event: (slug) =>
    safeOne(() => supabase!.from(TABLES.events).select('*').eq('slug', slug).maybeSingle(), mapEvent),

  publications: () =>
    safeList(
      () => supabase!.from(TABLES.publications).select('*').order('published_at', { ascending: false }),
      mapPublication,
    ),
  publication: (slug) =>
    safeOne(() => supabase!.from(TABLES.publications).select('*').eq('slug', slug).maybeSingle(), mapPublication),

  policyItems: () =>
    safeList(() => supabase!.from(TABLES.policy).select('*').order('reference_number'), mapPolicy),
  policyItem: (slug) =>
    safeOne(() => supabase!.from(TABLES.policy).select('*').eq('slug', slug).maybeSingle(), mapPolicy),

  policySubmissions: () =>
    safeList(() => supabase!.from(TABLES.submissions).select('*').order('reference_number'), mapSubmission),

  msmePrograms: () =>
    safeList(() => supabase!.from(TABLES.msme).select('*').order('title'), mapMsme),

  partners: () =>
    safeList(() => supabase!.from(TABLES.partners).select('*').order('display_order'), mapPartner),

  applications: () => loadApplications(),
  application: async (id) => (await loadApplications({ id }))[0],
  applicationsForUser: (userId) => loadApplications({ userId }),

  createApplication: async (input, user) => {
    const now = new Date().toISOString();
    const id = `app-${Date.now()}`;
    const reference = `MCCI-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
    const record: MembershipApplication = {
      id,
      application_reference: reference,
      organization_id: input.organization_id,
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
      documents: input.documents ?? [],
      timeline: [
        { id: `t-${Date.now()}`, status: 'draft', note: 'Application created', actor: user.full_name, created_at: now },
        { id: `t-${Date.now() + 1}`, status: 'submitted', note: 'Application submitted for review', actor: user.full_name, created_at: now },
      ],
      submitted_at: now,
      created_at: now,
      updated_at: now,
      is_demo: false,
    };

    if (!supabase) return record;

    const { documents, ...row } = record;
    const { error } = await supabase.from(TABLES.applications).insert(row);
    if (error) {
      console.error('[databaseProvider]', error.message);
      return record;
    }

    if (documents.length > 0) {
      await supabase.from(TABLES.documents).insert(
        documents.map((doc) => ({
          id: doc.id,
          application_id: id,
          document_type: doc.document_type,
          original_filename: doc.original_filename,
          storage_path: doc.storage_path,
          mime_type: doc.mime_type,
          file_size: doc.file_size,
          status: doc.status,
          uploaded_by: user.id,
          uploaded_at: doc.uploaded_at,
        })),
      );
    }

    await writeAudit(user.full_name, 'application.submitted', 'membership_application', id, `Submitted ${reference}`);
    return record;
  },

  setApplicationStatus: async (id, status, note, actor) => {
    if (!supabase) return undefined;
    const existing = (await loadApplications({ id }))[0];
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const timeline = [
      ...existing.timeline,
      { id: `t-${Date.now()}`, status, note, actor, created_at: now },
    ];

    const { data, error } = await supabase
      .from(TABLES.applications)
      .update({
        status,
        timeline,
        review_notes: status === 'more_information_required' ? note : existing.review_notes ?? null,
        rejection_reason: status === 'rejected' ? note : existing.rejection_reason ?? null,
        updated_at: now,
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('[databaseProvider]', error.message);
      return undefined;
    }

    // Chamber approval unlocks payment. Membership activation happens only after payment.
    if (status === 'approved' && existing.organization_id) {
      await supabase
        .from(TABLES.organizations)
        .update({
          membership_status: 'pending',
          verification_status: 'pending',
          tier_id: existing.tier_id,
          updated_at: now,
        })
        .eq('id', existing.organization_id);
    }

    await writeAudit(actor, `application.${status}`, 'membership_application', id, `${existing.application_reference} → ${status}`);
    return data ? mapApplication(data as Row, existing.documents) : undefined;
  },

  completeMembershipPayment: async (id, paymentReference, actor) => {
    if (!supabase) return undefined;
    const existing = (await loadApplications({ id }))[0];
    if (!existing || existing.status !== 'approved') return existing;

    const now = new Date().toISOString();
    const suffix = Math.floor(1000 + Math.random() * 8999);
    const memberNumber = existing.member_number ?? `MCCI-${new Date().getFullYear()}-${suffix}`;
    const certificateNumber = existing.certificate_number ?? `CERT-${new Date().getFullYear()}-${suffix}`;
    const timeline = [
      ...existing.timeline,
      { id: `t-${Date.now()}`, status: 'approved' as const, note: 'Payment confirmed. Membership activated and digital certificate issued.', actor, created_at: now },
    ];
    const { data, error } = await supabase
      .from(TABLES.applications)
      .update({
        payment_status: 'verified',
        payment_reference: paymentReference,
        paid_at: now,
        member_number: memberNumber,
        certificate_number: certificateNumber,
        certificate_issued_at: now,
        timeline,
        updated_at: now,
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) {
      console.error('[databaseProvider]', error.message);
      return undefined;
    }

    if (existing.organization_id) {
      await supabase.from(TABLES.organizations).update({
        membership_status: 'active', verification_status: 'verified', tier_id: existing.tier_id,
        member_number: memberNumber, updated_at: now,
      }).eq('id', existing.organization_id);
      await supabase.from(TABLES.memberships).insert({
        organization_id: existing.organization_id,
        tier_id: existing.tier_id,
        member_number: memberNumber,
        status: 'active',
        starts_at: now.slice(0, 10),
        expires_at: `${new Date().getFullYear() + 1}-${now.slice(5, 10)}`,
        renewal_due_at: `${new Date().getFullYear() + 1}-${now.slice(5, 10)}`,
        approved_from_application_id: id,
      });
    }
    await writeAudit(actor, 'membership.payment_completed', 'membership_application', id, `${existing.application_reference} payment verified; certificate ${certificateNumber} issued`);
    return data ? mapApplication(data as Row, existing.documents) : undefined;
  },

  invoices: (organizationId) =>
    safeList(() => {
      const query = supabase!.from(TABLES.invoices).select('*').order('issued_at', { ascending: false });
      return organizationId ? query.eq('organization_id', organizationId) : query;
    }, mapInvoice),

  registrations: (userId) =>
    safeList(() => {
      const query = supabase!
        .from(TABLES.registrations)
        .select('*')
        .order('registered_at', { ascending: false });
      return userId ? query.eq('user_id', userId) : query;
    }, mapRegistration),

  registerForEvent: async (input) => {
    const record: EventRegistration = {
      ...input,
      id: `reg-${Date.now()}`,
      application_reference: input.application_reference ?? `MCCI-TRN-APP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      registered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (!supabase) return record;
    const { error } = await supabase.from(TABLES.registrations).insert({
      ...record,
      user_id: record.user_id ?? null,
      organization_id: record.organization_id ?? null,
    });
    if (error) console.error('[databaseProvider]', error.message);
    return record;
  },

  updateRegistrationStatus: async (id, status, note, actor) => {
    if (!supabase) return undefined;
    const updatedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from(TABLES.registrations)
      .update({ registration_status: status, review_note: note || null, updated_at: updatedAt })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error || !data) {
      if (error) console.error('[databaseProvider]', error.message);
      return undefined;
    }
    await writeAudit(actor, `training_application.${status}`, 'event_registration', id, `Training application marked ${status}`);
    return mapRegistration(data as Row);
  },

  notices: () =>
    safeList(
      () => supabase!.from(TABLES.notices).select('*').order('published_at', { ascending: false }),
      mapNotice,
    ),

  inquiries: () =>
    safeList(
      () => supabase!.from(TABLES.inquiries).select('*').order('created_at', { ascending: false }),
      mapInquiry,
    ),

  createInquiry: async (input) => {
    const record: ContactInquiry = {
      ...input,
      id: `inq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    if (!supabase) return record;
    const { error } = await supabase.from(TABLES.inquiries).insert(record);
    if (error) console.error('[databaseProvider]', error.message);
    return record;
  },

  updateInquiryStatus: async (id, status) => {
    if (!supabase) return;
    const { error } = await supabase.from(TABLES.inquiries).update({ status }).eq('id', id);
    if (error) console.error('[databaseProvider]', error.message);
  },

  subscribers: () =>
    safeList(
      () => supabase!.from(TABLES.subscribers).select('*').order('subscribed_at', { ascending: false }),
      mapSubscriber,
    ),

  addSubscriber: async (email, firstName, company) => {
    if (!supabase) return;
    const { error } = await supabase.from(TABLES.subscribers).upsert(
      {
        id: `sub-news-${Date.now()}`,
        email,
        first_name: firstName ?? null,
        company: company ?? null,
        interests: ['newsletter'],
        status: 'subscribed',
        subscribed_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: true },
    );
    if (error) console.error('[databaseProvider]', error.message);
  },

  auditLogs: () =>
    safeList(
      () => supabase!.from(TABLES.audit).select('*').order('created_at', { ascending: false }).limit(200),
      mapAudit,
    ),

  users: async () => {
    if (!supabase) return [];
    const { data: profiles } = await supabase.from(TABLES.profiles).select('*');
    const { data: roles } = await supabase.from(TABLES.userRoles).select('*');
    const roleRows = (roles as Row[]) ?? [];
    return ((profiles as Row[]) ?? []).map<AuthUser>((profile) => ({
      id: str(profile.id),
      email: str(profile.email),
      full_name: str(profile.full_name),
      role: (roleRows.find((r) => str(r.user_id) === str(profile.id))?.role as AuthUser['role']) ?? 'member',
      last_sign_in_at: str(profile.updated_at),
    }));
  },

  search: async (query) => {
    const q = query.trim();
    if (!q || !supabase) return [];
    const like = `%${q}%`;
    const results: SearchResult[] = [];

    const [councils, news, events, publications, policy, msme, orgs] = await Promise.all([
      supabase.from(TABLES.councils).select('name,slug,short_description').ilike('name', like),
      supabase.from(TABLES.news).select('title,slug,excerpt,published_at').or(`title.ilike.${like},excerpt.ilike.${like}`),
      supabase.from(TABLES.events).select('title,slug,summary,starts_at').or(`title.ilike.${like},summary.ilike.${like}`),
      supabase.from(TABLES.publications).select('title,slug,summary,published_at').or(`title.ilike.${like},summary.ilike.${like}`),
      supabase.from(TABLES.policy).select('title,slug,summary,published_at').or(`title.ilike.${like},summary.ilike.${like}`),
      supabase.from(TABLES.msme).select('title,slug,summary').or(`title.ilike.${like},summary.ilike.${like}`),
      supabase.from(TABLES.organizations).select('display_name,slug,description').eq('directory_visible', true).ilike('display_name', like),
    ]);

    ((councils.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'Council', title: str(r.name), excerpt: str(r.short_description), route: `/councils/${str(r.slug)}` }));
    ((news.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'News', title: str(r.title), excerpt: str(r.excerpt), route: `/news/${str(r.slug)}`, date: str(r.published_at) }));
    ((events.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'Event', title: str(r.title), excerpt: str(r.summary), route: `/events/${str(r.slug)}`, date: str(r.starts_at) }));
    ((publications.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'Publication', title: str(r.title), excerpt: str(r.summary), route: `/publications/${str(r.slug)}`, date: str(r.published_at) }));
    ((policy.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'Policy', title: str(r.title), excerpt: str(r.summary), route: `/policy/positions/${str(r.slug)}`, date: str(r.published_at) }));
    ((msme.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'MSME programme', title: str(r.title), excerpt: str(r.summary), route: '/msme/programs' }));
    ((orgs.data as Row[]) ?? []).forEach((r) =>
      results.push({ type: 'Member', title: str(r.display_name), excerpt: str(r.description), route: `/directory/members/${str(r.slug)}` }));

    return results.slice(0, 40);
  },

  saveContent: async (collection, record, actor) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const table = collectionTable[collection];
    const payload = contentPayload(collection, record as unknown as Record<string, unknown>);
    const { error } = await supabase.from(table).upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('[databaseProvider]', error.message);
      throw new Error(error.message);
    }
    await writeAudit(actor, `${collection}.saved`, collection, record.id, `Saved ${collection} record`);
  },

  deleteContent: async (collection, id, actor) => {
    if (!supabase) return;
    const { error } = await supabase.from(collectionTable[collection]).delete().eq('id', id);
    if (error) {
      console.error('[databaseProvider]', error.message);
      throw new Error(error.message);
    }
    await writeAudit(actor, `${collection}.deleted`, collection, id, `Deleted ${collection} record`);
  },
};

export default databaseDataProvider;
