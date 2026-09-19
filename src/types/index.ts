// Core domain types for the MCCI digital platform.
// These mirror the PostgreSQL schema in /supabase/migrations.

export type AppRole = 'member' | 'editor' | 'admin' | 'super_admin';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'more_information_required'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export type MembershipStatus = 'pending' | 'active' | 'suspended' | 'expired' | 'cancelled';

export type DocumentStatus = 'uploaded' | 'under_review' | 'verified' | 'rejected';

export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export type RegistrationStatus =
  | 'pending'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled'
  | 'attended'
  | 'no_show';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_path?: string;
  account_status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  organization_id?: string;
  last_sign_in_at?: string;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  display_order: number;
}

export interface Organization {
  id: string;
  legal_name: string;
  display_name: string;
  slug: string;
  registration_number: string;
  year_established: number;
  sector_id: string;
  annual_turnover_range: string;
  employee_count: string;
  description: string;
  registered_address: string;
  island: string;
  atoll: string;
  public_email?: string;
  public_phone?: string;
  website?: string;
  logo_path?: string;
  directory_visible: boolean;
  verification_status: VerificationStatus;
  tier_id?: string;
  membership_status: MembershipStatus;
  member_number?: string;
  internal_notes?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  slug: string;
  annual_fee: number;
  currency: string;
  description: string;
  benefits: string[];
  active: boolean;
  display_order: number;
  is_demo: boolean;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: string;
  original_filename: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  status: DocumentStatus;
  review_notes?: string;
  uploaded_at: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  status: ApplicationStatus;
  note: string;
  actor: string;
  created_at: string;
}

export interface MembershipApplication {
  id: string;
  application_reference: string;
  organization_id?: string;
  applicant_user_id: string;
  applicant_name: string;
  tier_id: string;
  status: ApplicationStatus;
  legal_business_name: string;
  trading_name: string;
  registration_number: string;
  year_established: string;
  sector_id: string;
  annual_turnover_range: string;
  employee_count: string;
  registered_address: string;
  island: string;
  atoll: string;
  website: string;
  contact_name: string;
  contact_designation: string;
  contact_email: string;
  contact_mobile: string;
  selected_council_ids: string[];
  declaration_accepted: boolean;
  privacy_accepted: boolean;
  documents: ApplicationDocument[];
  timeline: ApplicationTimelineEvent[];
  review_notes?: string;
  rejection_reason?: string;
  payment_status?: PaymentStatus;
  payment_reference?: string;
  paid_at?: string;
  member_number?: string;
  certificate_number?: string;
  certificate_issued_at?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  is_demo: boolean;
}

export interface Membership {
  id: string;
  organization_id: string;
  tier_id: string;
  member_number: string;
  status: MembershipStatus;
  starts_at: string;
  expires_at: string;
  renewal_due_at: string;
}

export interface Council {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description_markdown: string;
  icon_name: string;
  chair_name: string;
  chair_title: string;
  contact_email: string;
  member_count_display: number;
  established_year: number;
  objectives: string[];
  policy_priorities: string[];
  initiatives: { title: string; summary: string; status: string }[];
  status: ContentStatus;
  display_order: number;
  is_demo: boolean;
}

export interface NewsPost {
  id: string;
  category: string;
  title: string;
  slug: string;
  excerpt: string;
  body_markdown: string;
  author_display_name: string;
  status: ContentStatus;
  featured: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  is_demo: boolean;
}

export type EventType = 'summit' | 'forum' | 'webinar' | 'exhibition' | 'training' | 'meeting';

export interface McciEvent {
  id: string;
  council_id?: string;
  title: string;
  slug: string;
  event_type: EventType;
  summary: string;
  description_markdown: string;
  starts_at: string;
  ends_at: string;
  venue: string;
  island: string;
  atoll: string;
  audience: string;
  capacity: number;
  registered_count: number;
  fee: number;
  currency: string;
  registration_open: boolean;
  registration_deadline: string;
  member_only: boolean;
  status: ContentStatus;
  featured: boolean;
  is_demo: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id?: string;
  organization_id?: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string;
  designation: string;
  registration_status: RegistrationStatus;
  payment_status: PaymentStatus;
  registered_at: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  publication_type:
    | 'annual_report'
    | 'research'
    | 'policy_paper'
    | 'guide'
    | 'newsletter'
    | 'statistics';
  summary: string;
  description_markdown: string;
  file_path: string;
  page_count: number;
  published_at: string;
  status: ContentStatus;
  featured: boolean;
  is_demo: boolean;
}

export interface PolicyItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  reference_number: string;
  summary: string;
  body_markdown: string;
  position_status: string;
  progress_percent: number;
  status: ContentStatus;
  published_at: string;
  featured: boolean;
  is_demo: boolean;
}

export interface PolicySubmission {
  id: string;
  reference_number: string;
  title: string;
  slug: string;
  submitted_to: string;
  submission_date: string;
  response_status: string;
  summary: string;
  file_path: string;
  status: ContentStatus;
  is_demo: boolean;
}

export interface MsmeProgram {
  id: string;
  title: string;
  slug: string;
  program_type: 'grant' | 'loan' | 'training' | 'mentorship' | 'export' | 'advisory';
  provider: string;
  summary: string;
  description_markdown: string;
  eligibility: string;
  deadline: string;
  status: ContentStatus;
  featured: boolean;
  is_demo: boolean;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  partner_type: string;
  website: string;
  display_order: number;
  active: boolean;
  is_demo: boolean;
}

export interface Invoice {
  id: string;
  organization_id: string;
  invoice_number: string;
  description: string;
  amount: number;
  currency: string;
  issued_at: string;
  due_at: string;
  status: InvoiceStatus;
  payment_method: string;
  transaction_reference?: string;
}

export interface MemberNotice {
  id: string;
  title: string;
  body_markdown: string;
  audience_type: 'all_members' | 'council' | 'tier';
  published_at: string;
  expires_at?: string;
  status: ContentStatus;
}

export interface ContactInquiry {
  id: string;
  department: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacy_accepted: boolean;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  assigned_to?: string;
  internal_notes?: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  interests: string[];
  status: 'subscribed' | 'unsubscribed';
  subscribed_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  summary: string;
  metadata: Record<string, string | number | boolean>;
  created_at: string;
}

export interface SearchResult {
  type: string;
  title: string;
  excerpt: string;
  route: string;
  date?: string;
}
