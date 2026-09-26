import { Activity, AlertTriangle, ClipboardList, Database, FileText, MapPinned, Users } from 'lucide-react'

import { ActivityFeed } from '../components/ActivityFeed'
import { KpiCard } from '../components/KpiCard'
import { Badge } from '../components/ui/badge'
import { activityFeedItems } from '../data/phase3'

export function Trial360Page() {
  const studyHealth = [
    { label: 'Recruitment', status: 'Warning', metric: '18% below target', issue: 'Site activation lag at 2 clusters', link: 'Review enrollment' },
    { label: 'Site Performance', status: 'Healthy', metric: '82% on time', issue: 'No critical site-level deviations', link: 'View sites' },
    { label: 'Monitoring', status: 'Action Required', metric: '3 visits overdue', issue: 'Two follow-ups require escalation', link: 'Review monitoring' },
    { label: 'Protocol Compliance', status: 'Warning', metric: '5 open deviations', issue: 'Informed consent follow-up pending', link: 'Review deviations' },
    { label: 'Data Quality', status: 'Healthy', metric: '95% query resolution', issue: 'No unresolved critical queries', link: 'Open data quality' },
    { label: 'Regulatory', status: 'Warning', metric: 'CTRI update due in 12 days', issue: 'Documentation under review', link: 'View CTRI' },
    { label: 'Safety', status: 'Healthy', metric: 'No serious events', issue: 'Routine monitoring active', link: 'Open safety view' },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Study 360</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-900">AIIA-AYU-001</h1>
          <p className="mt-1 text-sm text-slate-500">Rheumatoid Arthritis Trial · PI: Clinical Lead · Status: Active · Risk: Moderate</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">Moderate Risk</Badge>
          <Badge variant="info">Active</Badge>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Enrollment', value: '1,284', subtitle: 'of 2,000 target', accent: 'blue' as const, icon: <Users className="h-4 w-4" /> },
          { label: 'Sites', value: '14', subtitle: '3 at risk', accent: 'slate' as const, icon: <MapPinned className="h-4 w-4" /> },
          { label: 'Visits', value: '91', subtitle: '87% completed', accent: 'teal' as const, icon: <ClipboardList className="h-4 w-4" /> },
          { label: 'Monitoring', value: '06', subtitle: '2 overdue', accent: 'amber' as const, icon: <Activity className="h-4 w-4" /> },
        ].map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable />
        ))}
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 text-lg font-semibold text-slate-900">Study Health</div>
          <div className="space-y-3">
            {studyHealth.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                  <Badge variant={item.status === 'Healthy' ? 'success' : item.status === 'Warning' ? 'warning' : 'critical'}>{item.status}</Badge>
                </div>
                <div className="text-sm text-slate-600">Key metric: {item.metric}</div>
                <div className="mt-2 text-xs text-slate-500">Relevant issue: {item.issue}</div>
                <div className="mt-3 text-xs font-medium text-primary">{item.link}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</div>
          <ActivityFeed items={activityFeedItems.slice(0, 4)} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {[
          { title: 'Enrollment', value: '81%', tone: 'blue', icon: <Users className="h-4 w-4" /> },
          { title: 'Sites', value: '12 active', tone: 'teal', icon: <MapPinned className="h-4 w-4" /> },
          { title: 'Data Quality', value: '95%', tone: 'emerald', icon: <Database className="h-4 w-4" /> },
          { title: 'Monitoring', value: '4 due', tone: 'amber', icon: <AlertTriangle className="h-4 w-4" /> },
          { title: 'Ethics', value: 'Approved', tone: 'teal', icon: <FileText className="h-4 w-4" /> },
          { title: 'CTRI', value: 'In review', tone: 'amber', icon: <ClipboardList className="h-4 w-4" /> },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">{item.title}</div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">{item.icon}</div>
            </div>
            <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
