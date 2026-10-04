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
      { label: 'About MCCI', to: '/about', description: 'Who we are and what we do' },
      { label: 'Mission & Vision', to: '/about/mission-vision', description: 'Purpose, vision and values' },
      { label: 'History & Milestones', to: '/about/history', description: 'How the chamber developed' },
      { label: 'President & Board', to: '/about/leadership', description: 'Governance and secretariat' },
      { label: 'Corporate Profile', to: '/about/corporate-profile', description: 'Downloadable overview' },
    ],
  },
  {
    label: 'Councils',
    to: '/councils',
    children: [
      { label: 'ICT Council', to: '/councils/ict', description: 'Digital economy and technology' },
      { label: 'Tourism Council', to: '/councils/tourism', description: 'Hospitality and visitor economy' },
      { label: 'Construction Council', to: '/councils/construction', description: 'Infrastructure and property' },
      { label: 'Fisheries & Agriculture', to: '/councils/fisheries-agriculture', description: 'Food and marine value chains' },
      { label: 'Transport Council', to: '/councils/transport', description: 'Shipping, ferries and logistics' },
    ],
  },
  {
    label: 'Advocacy',
    to: '/policy',
    children: [
      { label: 'Policy Priorities', to: '/policy', description: 'Current advocacy agenda' },
      { label: 'International Trade', to: '/policy/international-trade', description: 'Export and market access' },
      { label: 'Regulatory Affairs', to: '/policy/regulatory-affairs', description: 'Business regulation' },
      { label: 'Legislative Affairs', to: '/policy/legislative-affairs', description: 'Draft legislation review' },
      { label: 'Policy Submissions', to: '/policy/submissions', description: 'Submission register' },
      { label: 'Economic Research', to: '/policy/research', description: 'Data and analysis' },
    ],
  },
  {
    label: 'Membership',
    to: '/membership',
    children: [
      { label: 'Membership Overview', to: '/membership', description: 'Why businesses join' },
      { label: 'Benefits', to: '/membership/benefits', description: 'What membership delivers' },
      { label: 'Membership Tiers', to: '/membership/tiers', description: 'Categories and fees' },
      { label: 'Apply for Membership', to: '/membership/apply', description: 'Start an application' },
      { label: 'Member Directory', to: '/directory/members', description: 'Search member businesses' },
      { label: 'Renewal Information', to: '/membership/renewal', description: 'Renewal cycle and invoices' },
    ],
  },
  {
    label: 'Events',
    to: '/events',
    children: [
      { label: 'Events Calendar', to: '/events/calendar', description: 'Month view of activity' },
      { label: 'All Events', to: '/events', description: 'Browse and filter events' },
    ],
  },
  {
    label: 'Resources',
    to: '/news',
    children: [
      { label: 'News & Media', to: '/news', description: 'Latest chamber updates' },
      { label: 'Publications', to: '/publications', description: 'Reports and research' },
      { label: 'Annual Reports', to: '/annual-reports', description: 'Yearly reporting' },
      { label: 'MSME Portal', to: '/msme', description: 'Support for growing businesses' },
      { label: 'Contact MCCI', to: '/contact', description: 'Reach the chamber team' },
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
      { label: 'Policy & advocacy', to: '/policy' },
      { label: 'Events', to: '/events' },
      { label: 'News & media', to: '/news' },
    ],
  },
  {
    title: 'Member services',
    links: [
      { label: 'Membership', to: '/membership' },
      { label: 'Member directory', to: '/directory/members' },
      { label: 'Publications', to: '/publications' },
      { label: 'MSME portal', to: '/msme' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];
