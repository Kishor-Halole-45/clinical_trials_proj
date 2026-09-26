import { Activity, AlertTriangle, CheckCircle2, Clock3, Database, Users } from 'lucide-react'
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'

import { ActivityFeed } from '../components/ActivityFeed'
import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { SystemStatus } from '../components/SystemStatus'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { alerts } from '../data/alerts'
import { enrollmentTrendData } from '../data/enrollment'
import { studies } from '../data/studies'

const portfolioStatus = [
  { name: 'Planning', value: 2, color: '#E2E8F0' },
  { name: 'Ethics Pending', value: 1, color: '#FCD34D' },
  { name: 'CTRI Pending', value: 1, color: '#A7F3D0' },
  { name: 'Site Activation', value: 2, color: '#BEE3F8' },
  { name: 'Recruiting', value: 3, color: '#93C5FD' },
  { name: 'Active', value: 1, color: '#10B981' },
  { name: 'Completed', value: 1, color: '#6EE7B7' },
]

const activityItems = [
  { time: '12m', title: 'CTRI amendment approved', detail: 'AIIA-AYU-006 · Patna Research Hub' },
  { time: '24m', title: 'Monitoring visit updated', detail: 'AIIA-AYU-003 · Maharashtra site' },
  { time: '51m', title: 'SAE report submitted', detail: 'AIIA-AYU-004 · Karnataka site' },
  { time: '1h', title: 'Protocol deviations closed', detail: 'AIIA-AYU-007 · Chennai' },
]

export function DashboardPage() {
  const navigate = useNavigate()

  const kpis = [
    { label: 'Active Trials', value: '18', subtitle: '+2 this quarter', accent: 'blue' as const, icon: <Activity className="h-4 w-4" />, onClick: () => navigate('/trials') },
    { label: 'Recruiting Trials', value: '11', subtitle: '61% of portfolio', accent: 'teal' as const, icon: <CheckCircle2 className="h-4 w-4" />, onClick: () => navigate('/trials') },
    { label: 'Participants Enrolled', value: '1,284', subtitle: 'of 2,000 target', accent: 'slate' as const, icon: <Users className="h-4 w-4" />, onClick: () => navigate('/participants') },
    { label: 'Enrollment Target', value: '64%', subtitle: 'accelerating', accent: 'amber' as const, icon: <Clock3 className="h-4 w-4" />, onClick: () => navigate('/enrollment') },
    { label: 'Active Sites', value: '32', subtitle: '4 requiring attention', accent: 'blue' as const, icon: <Database className="h-4 w-4" />, onClick: () => navigate('/sites') },
    { label: 'Critical Alerts', value: '7', subtitle: '3 due today', accent: 'red' as const, icon: <AlertTriangle className="h-4 w-4" />, onClick: () => navigate('/alerts') },
    { label: 'Overdue Visits', value: '8', subtitle: 'priority follow-up', accent: 'amber' as const, onClick: () => navigate('/visits') },
    { label: 'Open Deviations', value: '14', subtitle: 'under review', accent: 'red' as const, onClick: () => navigate('/deviations') },
    { label: 'Critical Deviations', value: '4', subtitle: 'risk flagged', accent: 'red' as const, onClick: () => navigate('/deviations') },
    { label: 'Open Queries', value: '23', subtitle: 'across sites', accent: 'slate' as const, onClick: () => navigate('/data-quality') },
    { label: 'Critical Queries', value: '6', subtitle: 'data escalations', accent: 'red' as const, onClick: () => navigate('/data-quality') },
    { label: 'Monitoring Due', value: '5', subtitle: 'next 7 days', accent: 'blue' as const, onClick: () => navigate('/monitoring') },
  ]

  const topStudies = studies.slice(0, 4)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <PageHeader
          title="Clinical Research Command Center"
          subtitle="Real-time portfolio monitoring across trials, recruitment, safety, compliance and data quality."
        />
        <Badge variant="neutral" className="border border-slate-200 bg-slate-100 text-slate-600">DEMO ENVIRONMENT</Badge>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-soft">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Requires Attention</div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { level: 'HIGH', study: 'AIIA-AYU-003', detail: 'Enrollment is 18% behind target', action: 'Review enrollment' },
            { level: 'WARNING', study: 'AIIA-AYU-001', detail: 'CTRI update due in 12 days', action: 'Review CTRI' },
            { level: 'CRITICAL', study: 'AIIA-AYU-004', detail: '2 critical protocol deviations open', action: 'Review deviations' },
          ].map((item) => (
            <div key={item.study} className="rounded-xl border border-amber-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant={item.level === 'CRITICAL' ? 'critical' : item.level === 'HIGH' ? 'warning' : 'neutral'}>{item.level}</Badge>
                <span className="text-xs font-medium text-slate-500">{item.study}</span>
              </div>
              <div className="text-sm font-medium text-slate-800">{item.detail}</div>
              <div className="mt-3 text-xs font-medium text-primary">{item.action}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable onClick={kpi.onClick} />
        ))}
      </div>

      <div className="mt-6">
        <ChartCard title="Clinical Operations Health" subtitle="Participant management, visit compliance, protocol compliance, data quality and monitoring.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {[
              { label: 'Participant Management', value: 92, tone: 'green' },
              { label: 'Visit Compliance', value: 87, tone: 'blue' },
              { label: 'Protocol Compliance', value: 78, tone: 'amber' },
              { label: 'Data Quality', value: 95, tone: 'green' },
              { label: 'Monitoring', value: 82, tone: 'blue' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-slate-700">{metric.label}</span><span className="text-slate-900">{metric.value}%</span></div>
                <ProgressBar value={metric.value} tone={metric.tone as any} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <ChartCard title="Enrollment Progress" subtitle="Target vs actual">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrendData}>
                  <defs>
                    <linearGradient id="targetGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} fill="url(#targetGradient)" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="actual" stroke="#123A6B" strokeWidth={2.5} fill="rgba(18,58,107,0.08)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Target</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" />Actual</div>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-4">
          <ChartCard title="Portfolio Status" subtitle="Status distribution">
            <div className="flex items-center gap-4">
              <div className="h-44 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={portfolioStatus} innerRadius={42} outerRadius={68} paddingAngle={2} dataKey="value">
                      {portfolioStatus.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {portfolioStatus.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{entry.value}</span>
                      <span className="text-xs text-slate-400">{Math.round((entry.value / 10) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-7">
          <ChartCard title="Trial Portfolio" subtitle="Study status overview">
            <div className="space-y-3">
              {topStudies.map((study) => (
                <div key={study.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-slate-800">{study.id}</div>
                      <StatusBadge status={study.status} />
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{study.title}</div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>{study.sites} sites</span>
                      <span>{study.currentEnrollment}/{study.targetEnrollment}</span>
                      <span>{study.progress}%</span>
                    </div>
                    <div className="mt-2"><ProgressBar value={study.progress} tone={study.risk === 'High' ? 'red' : study.risk === 'Moderate' ? 'amber' : 'green'} /></div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-5">
          <ChartCard title="Critical Alerts" subtitle="Priority safety and regulatory items">
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-800">{alert.description}</div>
                    <Badge variant={alert.severity === 'Critical' ? 'critical' : alert.severity === 'High' ? 'warning' : 'info'}>{alert.severity}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{alert.study} • {alert.site}</div>
                  <div className="mt-2 text-xs text-slate-500">Due {alert.dueDate}</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-5">
          <ChartCard title="Upcoming Milestones" subtitle="Portfolio schedule">
            <div className="space-y-3">
              {['IEC approval', 'CTRI registration', 'Site activation', 'First participant', 'Database lock'].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{item}</div>
                    <div className="text-xs text-slate-500">{['2026-10-02', '2026-10-09', '2026-11-12', '2026-11-22', '2026-12-04'][index]}</div>
                  </div>
                  <StatusBadge status={index < 3 ? 'On Track' : 'At Risk'} />
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-7">
          <ChartCard title="Site Performance" subtitle="Recruitment health by site">
            <div className="space-y-4">
              {['New Delhi', 'Jaipur', 'Bengaluru', 'Pune', 'Lucknow'].map((site, index) => (
                <div key={site}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{site}</span>
                    <span className="text-slate-500">{86 - index * 5}%</span>
                  </div>
                  <ProgressBar value={86 - index * 5} tone={index % 3 === 0 ? 'green' : index % 3 === 1 ? 'amber' : 'blue'} />
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-7">
          <ChartCard title="Recent Activity" subtitle="Operational updates">
            <ActivityFeed items={activityItems} />
          </ChartCard>
        </div>

        <div className="xl:col-span-5">
          <ChartCard title="System Health" subtitle="Service reliability">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>EDC Sync</span>
                  <StatusBadge status="Healthy" />
                </div>
                <div className="mt-2 text-xs text-slate-500">99.8% uptime · 18s lag</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Safety Routing</span>
                  <StatusBadge status="Watch" />
                </div>
                <div className="mt-2 text-xs text-slate-500">2 delayed escalations</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Audit Trail</span>
                  <StatusBadge status="Healthy" />
                </div>
                <div className="mt-2 text-xs text-slate-500">Immutable and time-stamped</div>
              </div>
              <SystemStatus />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
