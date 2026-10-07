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
const UnderDevelopmentPage = lazy(() => import('@/pages/public/UnderDevelopmentPage'));
const MembershipApplyPage = lazyNamed(
  () => import('@/features/membership/ApplicationWizard'),
  'MembershipApplyPage',
);

const loadAboutPages = () => import('@/pages/public/AboutPages');
const AboutPage = lazyNamed(loadAboutPages, 'AboutPage');
const LeadershipPage = lazyNamed(loadAboutPages, 'LeadershipPage');

const loadMembershipPages = () => import('@/pages/public/MembershipPages');
const MembershipBenefitsPage = lazyNamed(loadMembershipPages, 'MembershipBenefitsPage');
const MembershipPage = lazyNamed(loadMembershipPages, 'MembershipPage');
const MembershipTiersPage = lazyNamed(loadMembershipPages, 'MembershipTiersPage');

const loadNewsPages = () => import('@/pages/public/NewsPages');
const NewsDetailPage = lazyNamed(loadNewsPages, 'NewsDetailPage');
const NewsPage = lazyNamed(loadNewsPages, 'NewsPage');


const loadMiscPages = () => import('@/pages/public/MiscPages');
const ContactPage = lazyNamed(loadMiscPages, 'ContactPage');
const NotFoundPage = lazyNamed(loadMiscPages, 'NotFoundPage');
const PartnersPage = lazyNamed(loadMiscPages, 'PartnersPage');
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
                <Route path="/about/mission-vision" element={<UnderDevelopmentPage title="Mission & Vision" />} />
                <Route path="/about/history" element={<UnderDevelopmentPage title="History" />} />
                <Route path="/about/leadership" element={<LeadershipPage />} />
                <Route path="/about/corporate-profile" element={<UnderDevelopmentPage title="Corporate Profile" />} />

                <Route path="/councils" element={<UnderDevelopmentPage title="Industry Councils" description="Council names and current details are being confirmed." />} />
                <Route path="/councils/:slug" element={<UnderDevelopmentPage title="Industry Council" description="Council names and current details are being confirmed." />} />

                <Route path="/policy/*" element={<UnderDevelopmentPage title="Policy & Advocacy" />} />

                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/membership/benefits" element={<MembershipBenefitsPage />} />
                <Route path="/membership/tiers" element={<MembershipTiersPage />} />
                <Route path="/membership/apply" element={<MembershipApplyPage />} />
                <Route path="/membership/renewal" element={<UnderDevelopmentPage title="Membership Renewal" />} />

                <Route path="/directory/members/*" element={<UnderDevelopmentPage title="Member Directory" />} />

                <Route path="/events/*" element={<UnderDevelopmentPage title="Events" description="The current MNCCI events programme is being updated." />} />

                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />

                <Route path="/publications/*" element={<UnderDevelopmentPage title="Publications" description="Approved publications and reports are being prepared for this section." />} />
                <Route path="/annual-reports/*" element={<UnderDevelopmentPage title="Annual Reports" description="Approved annual reports are being prepared for this section." />} />

                <Route path="/msme/*" element={<UnderDevelopmentPage title="MSME Programmes" />} />

                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/search" element={<UnderDevelopmentPage title="Site Search" />} />
                <Route path="/privacy" element={<UnderDevelopmentPage title="Privacy Policy" />} />
                <Route path="/terms" element={<UnderDevelopmentPage title="Terms of Use" />} />
                <Route path="/accessibility" element={<UnderDevelopmentPage title="Accessibility" />} />
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
