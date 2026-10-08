export interface NavChild {
  label: string;
  to: string;
  description?: string;
}

export interface NavItem {
  label: string;
  to: string;
  children?: NavChild[];
}

export const publicNav: NavItem[] = [
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'About MNCCI', to: '/about', description: 'Who we are and what we do' },
      { label: 'President', to: '/about/leadership', description: 'MNCCI leadership' },
      { label: 'Mission & Vision', to: '/about/mission-vision', description: 'Under development' },
      { label: 'History', to: '/about/history', description: 'Under development' },
    ],
  },
  {
    label: 'Councils',
    to: '/councils',
    children: [{ label: 'Industry Councils', to: '/councils', description: 'Sector priorities, programmes and members' }],
  },
  {
    label: 'Membership',
    to: '/membership',
    children: [
      { label: 'Membership Overview', to: '/membership', description: 'Why businesses join' },
      { label: 'Benefits', to: '/membership/benefits', description: 'What membership delivers' },
      { label: 'Tiers & Prices', to: '/membership/tiers', description: 'Proposed membership structure' },
      { label: 'Membership Application', to: '/membership/apply', description: 'Review the application steps' },
    ],
  },
  {
    label: 'Events',
    to: '/events',
    children: [{ label: 'Events', to: '/events', description: 'Upcoming events and registration' }],
  },
  {
    label: 'Policy',
    to: '/policy',
    children: [{ label: 'Policy & Advocacy', to: '/policy', description: 'Positions, submissions and research' }],
  },
  {
    label: 'Resources',
    to: '/news',
    children: [
      { label: 'News & Media', to: '/news', description: 'Latest chamber updates' },
      { label: 'Publications', to: '/publications', description: 'Reports, research and business resources' },
      { label: 'Annual Reports', to: '/annual-reports', description: 'Published chamber annual reports' },
      { label: 'Member Directory', to: '/directory/members', description: 'Find chamber member organisations' },
      { label: 'MSME Programmes', to: '/msme', description: 'Programmes for smaller businesses' },
      { label: 'Affiliations & Partners', to: '/partners', description: 'Published MNCCI relationships' },
      { label: 'Contact MNCCI', to: '/contact', description: 'Send an enquiry' },
    ],
  },
];

export const portalNav = [
  { label: 'Dashboard', to: '/portal', icon: 'LayoutDashboard' },
  { label: 'My Profile', to: '/portal/profile', icon: 'User' },
  { label: 'Organisation', to: '/portal/organization', icon: 'Building2' },
  { label: 'Application', to: '/portal/application', icon: 'FileText' },
  { label: 'Documents', to: '/portal/documents', icon: 'FolderOpen' },
  { label: 'Membership', to: '/portal/membership', icon: 'BadgeCheck' },
  { label: 'Events', to: '/portal/events', icon: 'CalendarDays' },
  { label: 'Payments', to: '/portal/payments', icon: 'Receipt' },
  { label: 'Notices', to: '/portal/notices', icon: 'Megaphone' },
  { label: 'Security', to: '/portal/security', icon: 'ShieldCheck' },
] as const;

export interface AdminNavItem {
  label: string;
  to: string;
  icon: string;
  roles: ('editor' | 'admin' | 'super_admin')[];
  group: string;
}

export const adminNav: AdminNavItem[] = [
  { label: 'Overview', to: '/admin', icon: 'LayoutDashboard', roles: ['editor', 'admin', 'super_admin'], group: 'Dashboard' },
  { label: 'Applications', to: '/admin/applications', icon: 'ClipboardList', roles: ['admin', 'super_admin'], group: 'Membership' },
  { label: 'Members', to: '/admin/members', icon: 'Users', roles: ['admin', 'super_admin'], group: 'Membership' },
  { label: 'Organisations', to: '/admin/organizations', icon: 'Building2', roles: ['admin', 'super_admin'], group: 'Membership' },
  { label: 'Payments', to: '/admin/payments', icon: 'Receipt', roles: ['admin', 'super_admin'], group: 'Membership' },
  { label: 'Councils', to: '/admin/councils', icon: 'Network', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'News', to: '/admin/news', icon: 'Newspaper', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Events', to: '/admin/events', icon: 'CalendarDays', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Applications & registrations', to: '/admin/event-registrations', icon: 'ListChecks', roles: ['admin', 'super_admin'], group: 'Content' },
  { label: 'Publications', to: '/admin/publications', icon: 'BookOpen', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Policy items', to: '/admin/policies', icon: 'Scale', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Policy submissions', to: '/admin/policy-submissions', icon: 'FileSignature', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'MSME programmes', to: '/admin/msme', icon: 'Sprout', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Partners', to: '/admin/partners', icon: 'Handshake', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Notices', to: '/admin/notices', icon: 'Megaphone', roles: ['admin', 'super_admin'], group: 'Content' },
  { label: 'Media library', to: '/admin/media', icon: 'Image', roles: ['editor', 'admin', 'super_admin'], group: 'Content' },
  { label: 'Inquiries', to: '/admin/inquiries', icon: 'Inbox', roles: ['admin', 'super_admin'], group: 'Engagement' },
  { label: 'Newsletter', to: '/admin/newsletter', icon: 'Mail', roles: ['admin', 'super_admin'], group: 'Engagement' },
  { label: 'Users & roles', to: '/admin/users', icon: 'UserCog', roles: ['super_admin'], group: 'System' },
  { label: 'Settings', to: '/admin/settings', icon: 'Settings', roles: ['super_admin'], group: 'System' },
  { label: 'Audit log', to: '/admin/audit-log', icon: 'ScrollText', roles: ['super_admin'], group: 'System' },
];

export const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'About the chamber', to: '/about' },
      { label: 'Industry councils', to: '/councils' },
      { label: 'News & media', to: '/news' },
      { label: 'Events', to: '/events' },
      { label: 'Publications', to: '/publications' },
      { label: 'Policy & advocacy', to: '/policy' },
      { label: 'Affiliations & partners', to: '/partners' },
    ],
  },
  {
    title: 'Member services',
    links: [
      { label: 'Membership', to: '/membership' },
      { label: 'Membership tiers', to: '/membership/tiers' },
      { label: 'Member directory', to: '/directory/members' },
      { label: 'MSME programmes', to: '/msme' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];
