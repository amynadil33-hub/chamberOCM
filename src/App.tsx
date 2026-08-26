import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, RequireAuth, RequireRole } from '@/lib/auth/AuthProvider';

import PublicLayout from '@/components/layout/PublicLayout';
import Index from './pages/Index';

import {
  AboutPage,
  CorporateProfilePage,
  HistoryPage,
  LeadershipPage,
  MissionVisionPage,
} from '@/pages/public/AboutPages';
import { CouncilDetailPage, CouncilsPage } from '@/pages/public/CouncilPages';
import {
  EconomicResearchPage,
  InternationalTradePage,
  LegislativeAffairsPage,
  PolicyDetailPage,
  PolicyPage,
  PolicyPositionsPage,
  PolicySubmissionDetailPage,
  PolicySubmissionsPage,
  RegulatoryAffairsPage,
} from '@/pages/public/PolicyPages';
import {
  MembershipBenefitsPage,
  MembershipPage,
  MembershipRenewalPage,
  MembershipTiersPage,
} from '@/pages/public/MembershipPages';
import { MemberDetailPage, MemberDirectoryPage } from '@/pages/public/DirectoryPages';
import { EventDetailPage, EventsCalendarPage, EventsPage } from '@/pages/public/EventsPages';
import { NewsDetailPage, NewsPage } from '@/pages/public/NewsPages';
import {
  AnnualReportsPage,
  PublicationDetailPage,
  PublicationsPage,
} from '@/pages/public/PublicationPages';
import {
  MsmeDirectoryPage,
  MsmeEventsPage,
  MsmePage,
  MsmeProgramsPage,
} from '@/pages/public/MsmePages';
import {
  AccessibilityPage,
  ContactPage,
  NotFoundPage,
  PartnersPage,
  PrivacyPage,
  SearchPage,
  TermsPage,
  UnauthorizedPage,
} from '@/pages/public/MiscPages';
import { MembershipApplyPage } from '@/features/membership/ApplicationWizard';

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@/pages/auth/AuthPages';

import PortalLayout from '@/pages/portal/PortalLayout';
import PortalApplication from '@/pages/portal/PortalApplication';
import {
  PortalDashboard,
  PortalDocuments,
  PortalEvents,
  PortalMembership,
  PortalNotices,
  PortalOrganization,
  PortalPayments,
  PortalProfile,
  PortalSecurity,
} from '@/pages/portal/PortalPages';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import {
  AdminApplicationDetailPage,
  AdminApplicationsPage,
} from '@/pages/admin/AdminApplications';
import {
  AdminAuditPage,
  AdminCouncilsPage,
  AdminEventsPage,
  AdminInquiriesPage,
  AdminMediaPage,
  AdminMemberDetailPage,
  AdminMembersPage,
  AdminMsmePage,
  AdminNewsPage,
  AdminNewsletterPage,
  AdminNoticesPage,
  AdminOrganizationsPage,
  AdminPartnersPage,
  AdminPaymentsPage,
  AdminPoliciesPage,
  AdminPolicySubmissionsPage,
  AdminPublicationsPage,
  AdminRegistrationsPage,
  AdminSettingsPage,
  AdminUsersPage,
} from '@/pages/admin/AdminPages';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 30_000 } },
});

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* PUBLIC */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/about/mission-vision" element={<MissionVisionPage />} />
                <Route path="/about/history" element={<HistoryPage />} />
                <Route path="/about/leadership" element={<LeadershipPage />} />
                <Route path="/about/corporate-profile" element={<CorporateProfilePage />} />

                <Route path="/councils" element={<CouncilsPage />} />
                <Route path="/councils/:slug" element={<CouncilDetailPage />} />

                <Route path="/policy" element={<PolicyPage />} />
                <Route path="/policy/international-trade" element={<InternationalTradePage />} />
                <Route path="/policy/regulatory-affairs" element={<RegulatoryAffairsPage />} />
                <Route path="/policy/legislative-affairs" element={<LegislativeAffairsPage />} />
                <Route path="/policy/positions" element={<PolicyPositionsPage />} />
                <Route path="/policy/positions/:slug" element={<PolicyDetailPage />} />
                <Route path="/policy/submissions" element={<PolicySubmissionsPage />} />
                <Route path="/policy/submissions/:slug" element={<PolicySubmissionDetailPage />} />
                <Route path="/policy/research" element={<EconomicResearchPage />} />

                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/membership/benefits" element={<MembershipBenefitsPage />} />
                <Route path="/membership/tiers" element={<MembershipTiersPage />} />
                <Route path="/membership/apply" element={<MembershipApplyPage />} />
                <Route path="/membership/renewal" element={<MembershipRenewalPage />} />

                <Route path="/directory/members" element={<MemberDirectoryPage />} />
                <Route path="/directory/members/:slug" element={<MemberDetailPage />} />

                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/calendar" element={<EventsCalendarPage />} />
                <Route path="/events/:slug" element={<EventDetailPage />} />

                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />

                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/publications/:slug" element={<PublicationDetailPage />} />
                <Route path="/annual-reports" element={<AnnualReportsPage />} />
                <Route path="/annual-reports/:slug" element={<PublicationDetailPage />} />

                <Route path="/msme" element={<MsmePage />} />
                <Route path="/msme/directory" element={<MsmeDirectoryPage />} />
                <Route path="/msme/programs" element={<MsmeProgramsPage />} />
                <Route path="/msme/events" element={<MsmeEventsPage />} />

                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/auth/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* AUTH */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

              {/* MEMBER PORTAL */}
              <Route
                path="/portal"
                element={
                  <RequireAuth>
                    <PortalLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<PortalDashboard />} />
                <Route path="profile" element={<PortalProfile />} />
                <Route path="organization" element={<PortalOrganization />} />
                <Route path="application" element={<PortalApplication />} />
                <Route path="documents" element={<PortalDocuments />} />
                <Route path="membership" element={<PortalMembership />} />
                <Route path="events" element={<PortalEvents />} />
                <Route path="payments" element={<PortalPayments />} />
                <Route path="notices" element={<PortalNotices />} />
                <Route path="security" element={<PortalSecurity />} />
              </Route>

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <RequireRole roles={['editor', 'admin', 'super_admin']}>
                    <AdminLayout />
                  </RequireRole>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route
                  path="applications"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminApplicationsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="applications/:id"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminApplicationDetailPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="members"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminMembersPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="members/:id"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminMemberDetailPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="organizations"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminOrganizationsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="organizations/:id"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminMemberDetailPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="payments"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminPaymentsPage />
                    </RequireRole>
                  }
                />
                <Route path="councils" element={<AdminCouncilsPage />} />
                <Route path="news" element={<AdminNewsPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route
                  path="event-registrations"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminRegistrationsPage />
                    </RequireRole>
                  }
                />
                <Route path="publications" element={<AdminPublicationsPage />} />
                <Route path="policies" element={<AdminPoliciesPage />} />
                <Route path="policy-submissions" element={<AdminPolicySubmissionsPage />} />
                <Route path="msme" element={<AdminMsmePage />} />
                <Route path="partners" element={<AdminPartnersPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route
                  path="notices"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminNoticesPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="inquiries"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminInquiriesPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="newsletter"
                  element={
                    <RequireRole roles={['admin', 'super_admin']}>
                      <AdminNewsletterPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="users"
                  element={
                    <RequireRole roles={['super_admin']}>
                      <AdminUsersPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <RequireRole roles={['super_admin']}>
                      <AdminSettingsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="audit-log"
                  element={
                    <RequireRole roles={['super_admin']}>
                      <AdminAuditPage />
                    </RequireRole>
                  }
                />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
