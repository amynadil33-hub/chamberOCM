import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, Card, DemoNotice } from '@/components/common/ui';
import { dataProvider } from '@/lib/data/provider';
import { membershipTiers, sectors } from '@/data/mockSeed';
import { formatDate, isUpcoming, titleCase } from '@/lib/utils/format';

const COLORS = ['#3B58A5', '#16845B', '#526FBD', '#0F6143', '#182B5B', '#B7791F'];

const Metric: React.FC<{ label: string; value: number | string; note?: string; to?: string }> = ({
  label,
  value,
  note,
  to,
}) => {
  const body = (
    <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-[12px] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-2 font-mono text-[26px] font-semibold tabular-nums text-brand-deep">{value}</p>
      {note && <p className="mt-1 text-[12px] text-ink-soft">{note}</p>}
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
};

const AdminDashboard: React.FC = () => {
  const { data: organizations = [] } = useQuery({ queryKey: ['organizations'], queryFn: () => dataProvider.organizations() });
  const { data: applications = [] } = useQuery({ queryKey: ['applications'], queryFn: () => dataProvider.applications() });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => dataProvider.events() });
  const { data: inquiries = [] } = useQuery({ queryKey: ['inquiries'], queryFn: () => dataProvider.inquiries() });
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: () => dataProvider.invoices() });
  const { data: subscribers = [] } = useQuery({ queryKey: ['subscribers'], queryFn: () => dataProvider.subscribers() });
  const { data: audit = [] } = useQuery({ queryKey: ['audit'], queryFn: () => dataProvider.auditLogs() });

  const activeMembers = organizations.filter((o) => o.membership_status === 'active').length;
  const pending = applications.filter((a) => ['submitted', 'under_review', 'more_information_required'].includes(a.status)).length;
  const upcomingEvents = events.filter((e) => isUpcoming(e.starts_at)).length;
  const openInquiries = inquiries.filter((i) => i.status !== 'resolved' && i.status !== 'archived').length;
  const unpaid = invoices.filter((i) => i.status === 'issued' || i.status === 'overdue').length;

  const tierData = membershipTiers.map((tier) => ({
    name: tier.name,
    value: organizations.filter((o) => o.tier_id === tier.id).length,
  }));
  const statusData = Array.from(new Set(applications.map((a) => a.status))).map((status) => ({
    name: titleCase(status),
    value: applications.filter((a) => a.status === status).length,
  }));
  const sectorData = sectors
    .map((sector) => ({ name: sector.name.split(' ')[0], value: organizations.filter((o) => o.sector_id === sector.id).length }))
    .filter((d) => d.value > 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold text-ink">Administration overview</h1>
        <p className="mt-1.5 text-[14.5px] text-ink-soft">
          Operational summary of membership, content and engagement across the chamber.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total organisations" value={organizations.length} to="/admin/organizations" />
        <Metric label="Active members" value={activeMembers} to="/admin/members" />
        <Metric label="Pending applications" value={pending} to="/admin/applications" />
        <Metric label="Expiring memberships" value={2} note="Within 60 days (demo)" to="/admin/members" />
        <Metric label="Upcoming events" value={upcomingEvents} to="/admin/events" />
        <Metric label="Open inquiries" value={openInquiries} to="/admin/inquiries" />
        <Metric label="Unpaid invoices" value={unpaid} to="/admin/payments" />
        <Metric label="Newsletter subscribers" value={subscribers.length} to="/admin/newsletter" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">Membership by tier</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tierData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {tierData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-[12.5px] text-ink-soft">
            {tierData.map((entry, index) => (
              <li key={entry.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }} aria-hidden="true" />
                  {entry.name}
                </span>
                <span className="font-mono tabular-nums">{entry.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">Applications by status</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EE" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5F6B7A' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5F6B7A' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B58A5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">Organisations by sector</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EE" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#5F6B7A' }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#5F6B7A' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#16845B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">Applications requiring attention</h2>
            <Link to="/admin/applications" className="text-[13px] font-semibold text-brand hover:underline">View queue</Link>
          </div>
          <ul className="mt-4 divide-y divide-surface-border">
            {applications.slice(0, 5).map((application) => (
              <li key={application.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link to={`/admin/applications/${application.id}`} className="text-[14px] font-semibold text-ink hover:text-brand">
                    {application.legal_business_name}
                  </Link>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {application.application_reference} · {formatDate(application.submitted_at)}
                  </p>
                </div>
                <Badge status={application.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink">Recent activity</h2>
            <Link to="/admin/audit-log" className="text-[13px] font-semibold text-brand hover:underline">Audit log</Link>
          </div>
          <ul className="mt-4 divide-y divide-surface-border">
            {audit.slice(0, 5).map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="text-[14px] text-ink">{entry.summary}</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {formatDate(entry.created_at)} · {entry.actor_name}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <DemoNotice className="mt-6" />
    </>
  );
};

export default AdminDashboard;
