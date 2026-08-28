import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthLoading, AuthProvider, RequireAuth, RequireRole } from '@/lib/auth/AuthProvider';

const lazyNamed = (loader: () => Promise<unknown>, exportName: string) =>
  lazy(async () => {
    const loaded = (await loader()) as Record<string, ComponentType>;
    return { default: loaded[exportName] };
  });

const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));
const Index = lazy(() => import('./pages/Index'));
const MembershipApplyPage = lazyNamed(
  () => import('@/features/membership/ApplicationWizard'),
  'MembershipApplyPage',
);

const loadAboutPages = () => import('@/pages/public/AboutPages');
const AboutPage = lazyNamed(loadAboutPages, 'AboutPage');
const CorporateProfilePage = lazyNamed(loadAboutPages, 'CorporateProfilePage');
const HistoryPage = lazyNamed(loadAboutPages, 'HistoryPage');
const LeadershipPage = lazyNamed(loadAboutPages, 'LeadershipPage');
const MissionVisionPage = lazyNamed(loadAboutPages, 'MissionVisionPage');

const loadCouncilPages = () => import('@/pages/public/CouncilPages');
const CouncilDetailPage = lazyNamed(loadCouncilPages, 'CouncilDetailPage');
const CouncilsPage = lazyNamed(loadCouncilPages, 'CouncilsPage');

const loadPolicyPages = () => import('@/pages/public/PolicyPages');
const EconomicResearchPage = lazyNamed(loadPolicyPages, 'EconomicResearchPage');
const InternationalTradePage = lazyNamed(loadPolicyPages, 'InternationalTradePage');
const LegislativeAffairsPage = lazyNamed(loadPolicyPages, 'LegislativeAffairsPage');
const PolicyDetailPage = lazyNamed(loadPolicyPages, 'PolicyDetailPage');
const PolicyPage = lazyNamed(loadPolicyPages, 'PolicyPage');
const PolicyPositionsPage = lazyNamed(loadPolicyPages, 'PolicyPositionsPage');
const PolicySubmissionDetailPage = lazyNamed(loadPolicyPages, 'PolicySubmissionDetailPage');
const PolicySubmissionsPage = lazyNamed(loadPolicyPages, 'PolicySubmissionsPage');
const RegulatoryAffairsPage = lazyNamed(loadPolicyPages, 'RegulatoryAffairsPage');

const loadMembershipPages = () => import('@/pages/public/MembershipPages');
const MembershipBenefitsPage = lazyNamed(loadMembershipPages, 'MembershipBenefitsPage');
const MembershipPage = lazyNamed(loadMembershipPages, 'MembershipPage');
const MembershipRenewalPage = lazyNamed(loadMembershipPages, 'MembershipRenewalPage');
const MembershipTiersPage = lazyNamed(loadMembershipPages, 'MembershipTiersPage');

const loadDirectoryPages = () => import('@/pages/public/DirectoryPages');
const MemberDetailPage = lazyNamed(loadDirectoryPages, 'MemberDetailPage');
const MemberDirectoryPage = lazyNamed(loadDirectoryPages, 'MemberDirectoryPage');

const loadEventPages = () => import('@/pages/public/EventsPages');
const EventDetailPage = lazyNamed(loadEventPages, 'EventDetailPage');
const EventsCalendarPage = lazyNamed(loadEventPages, 'EventsCalendarPage');
const EventsPage = lazyNamed(loadEventPages, 'EventsPage');

const loadNewsPages = () => import('@/pages/public/NewsPages');
const NewsDetailPage = lazyNamed(loadNewsPages, 'NewsDetailPage');
const NewsPage = lazyNamed(loadNewsPages, 'NewsPage');

const loadPublicationPages = () => import('@/pages/public/PublicationPages');
const AnnualReportsPage = lazyNamed(loadPublicationPages, 'AnnualReportsPage');
const PublicationDetailPage = lazyNamed(loadPublicationPages, 'PublicationDetailPage');
const PublicationsPage = lazyNamed(loadPublicationPages, 'PublicationsPage');

const loadMsmePages = () => import('@/pages/public/MsmePages');
const MsmeDirectoryPage = lazyNamed(loadMsmePages, 'MsmeDirectoryPage');
const MsmeEventsPage = lazyNamed(loadMsmePages, 'MsmeEventsPage');
const MsmePage = lazyNamed(loadMsmePages, 'MsmePage');
const MsmeProgramsPage = lazyNamed(loadMsmePages, 'MsmeProgramsPage');

const loadMiscPages = () => import('@/pages/public/MiscPages');
const AccessibilityPage = lazyNamed(loadMiscPages, 'AccessibilityPage');
const ContactPage = lazyNamed(loadMiscPages, 'ContactPage');
const NotFoundPage = lazyNamed(loadMiscPages, 'NotFoundPage');
const PartnersPage = lazyNamed(loadMiscPages, 'PartnersPage');
const PrivacyPage = lazyNamed(loadMiscPages, 'PrivacyPage');
const SearchPage = lazyNamed(loadMiscPages, 'SearchPage');
const TermsPage = lazyNamed(loadMiscPages, 'TermsPage');
const UnauthorizedPage = lazyNamed(loadMiscPages, 'UnauthorizedPage');

const loadAuthPages = () => import('@/pages/auth/AuthPages');
const ForgotPasswordPage = lazyNamed(loadAuthPages, 'ForgotPasswordPage');
const LoginPage = lazyNamed(loadAuthPages, 'LoginPage');
const RegisterPage = lazyNamed(loadAuthPages, 'RegisterPage');
const ResetPasswordPage = lazyNamed(loadAuthPages, 'ResetPasswordPage');
const VerifyEmailPage = lazyNamed(loadAuthPages, 'VerifyEmailPage');

const PortalLayout = lazy(() => import('@/pages/portal/PortalLayout'));
const PortalApplication = lazy(() => import('@/pages/portal/PortalApplication'));
const loadPortalPages = () => import('@/pages/portal/PortalPages');
const PortalDashboard = lazyNamed(loadPortalPages, 'PortalDashboard');
const PortalDocuments = lazyNamed(loadPortalPages, 'PortalDocuments');
const PortalEvents = lazyNamed(loadPortalPages, 'PortalEvents');
const PortalMembership = lazyNamed(loadPortalPages, 'PortalMembership');
const PortalNotices = lazyNamed(loadPortalPages, 'PortalNotices');
const PortalOrganization = lazyNamed(loadPortalPages, 'PortalOrganization');
const PortalPayments = lazyNamed(loadPortalPages, 'PortalPayments');
const PortalProfile = lazyNamed(loadPortalPages, 'PortalProfile');
const PortalSecurity = lazyNamed(loadPortalPages, 'PortalSecurity');

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const loadAdminApplications = () => import('@/pages/admin/AdminApplications');
const AdminApplicationDetailPage = lazyNamed(loadAdminApplications, 'AdminApplicationDetailPage');
const AdminApplicationsPage = lazyNamed(loadAdminApplications, 'AdminApplicationsPage');

const loadAdminPages = () => import('@/pages/admin/AdminPages');
const AdminAuditPage = lazyNamed(loadAdminPages, 'AdminAuditPage');
const AdminCouncilsPage = lazyNamed(loadAdminPages, 'AdminCouncilsPage');
const AdminEventsPage = lazyNamed(loadAdminPages, 'AdminEventsPage');
const AdminInquiriesPage = lazyNamed(loadAdminPages, 'AdminInquiriesPage');
const AdminMediaPage = lazyNamed(loadAdminPages, 'AdminMediaPage');
const AdminMemberDetailPage = lazyNamed(loadAdminPages, 'AdminMemberDetailPage');
const AdminMembersPage = lazyNamed(loadAdminPages, 'AdminMembersPage');
const AdminMsmePage = lazyNamed(loadAdminPages, 'AdminMsmePage');
const AdminNewsPage = lazyNamed(loadAdminPages, 'AdminNewsPage');
const AdminNewsletterPage = lazyNamed(loadAdminPages, 'AdminNewsletterPage');
const AdminNoticesPage = lazyNamed(loadAdminPages, 'AdminNoticesPage');
const AdminOrganizationsPage = lazyNamed(loadAdminPages, 'AdminOrganizationsPage');
const AdminPartnersPage = lazyNamed(loadAdminPages, 'AdminPartnersPage');
const AdminPaymentsPage = lazyNamed(loadAdminPages, 'AdminPaymentsPage');
const AdminPoliciesPage = lazyNamed(loadAdminPages, 'AdminPoliciesPage');
const AdminPolicySubmissionsPage = lazyNamed(loadAdminPages, 'AdminPolicySubmissionsPage');
const AdminPublicationsPage = lazyNamed(loadAdminPages, 'AdminPublicationsPage');
const AdminRegistrationsPage = lazyNamed(loadAdminPages, 'AdminRegistrationsPage');
const AdminSettingsPage = lazyNamed(loadAdminPages, 'AdminSettingsPage');
const AdminUsersPage = lazyNamed(loadAdminPages, 'AdminUsersPage');

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
            <Suspense fallback={<AuthLoading />}>
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
