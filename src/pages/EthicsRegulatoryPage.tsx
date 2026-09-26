import { AlertTriangle, CalendarClock, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ActivityFeed } from '../components/ActivityFeed'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { activityFeedItems, ethicsSubmissions } from '../data/phase3'

export function EthicsRegulatoryPage() {
  const kpis = [
    { label: 'Pending IEC Submissions', value: '4', subtitle: '2 due this week', accent: 'amber' as const, icon: <Clock3 className="h-4 w-4" /> },
    { label: 'Approvals This Month', value: '9', subtitle: '+2 vs plan', accent: 'teal' as const, icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: 'Approvals Expiring Soon', value: '6', subtitle: '3 critical review items', accent: 'red' as const, icon: <AlertTriangle className="h-4 w-4" /> },
    { label: 'Overdue Actions', value: '3', subtitle: '1 escalated', accent: 'red' as const, icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'Protocol Amendments', value: '11', subtitle: '2 pending closure', accent: 'blue' as const, icon: <CalendarClock className="h-4 w-4" /> },
    { label: 'Continuing Reviews Due', value: '5', subtitle: '1 urgent', accent: 'amber' as const, icon: <Clock3 className="h-4 w-4" /> },
  ]

  const expiringSoon = [
    { severity: 'Critical', title: 'IEC approval expires in 7 days', detail: 'AIIA-AYU-006 · IEC-BLR-11', action: 'Review renewal pack' },
    { severity: 'Warning', title: 'IEC approval expires in 18 days', detail: 'AIIA-AYU-001 · IEC-DEL-04', action: 'Validate annual update' },
    { severity: 'Normal', title: 'Continuing review due in 12 days', detail: 'AIIA-AYU-003 · IEC-HYD-09', action: 'Prepare continuation file' },
  ]

  return (
    <div>
      <PageHeader
        title="Ethics & Regulatory Center"
        subtitle="Monitor institutional ethics approvals, submissions, amendments, continuing review and regulatory obligations across the clinical research portfolio."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable />
        ))}
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">Regulatory Status</div>
              <div className="text-sm text-slate-500">Portfolio review tracking</div>
            </div>
            <Badge variant="info">Live oversight</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4 font-medium">Study</th>
                  <th className="py-3 pr-4 font-medium">IEC</th>
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Submission</th>
                  <th className="py-3 pr-4 font-medium">Review</th>
                  <th className="py-3 pr-4 font-medium">Approval</th>
                  <th className="py-3 pr-4 font-medium">Expiry</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Owner</th>
                  <th className="py-3 pr-4 font-medium text-right">Days</th>
                </tr>
              </thead>
              <tbody>
                {ethicsSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">
                      <Link to={`/ethics-regulatory/${submission.id}`} className="font-medium text-slate-800 hover:text-primary">{submission.studyTitle}</Link>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{submission.iec}</td>
                    <td className="py-3 pr-4 text-slate-600">{submission.submissionType}</td>
                    <td className="py-3 pr-4 text-slate-600">{submission.submissionDate}</td>
                    <td className="py-3 pr-4 text-slate-600">{submission.reviewDate}</td>
                    <td className="py-3 pr-4 text-slate-600">{submission.approvalDate}</td>
                    <td className="py-3 pr-4 text-slate-600">{submission.expiryDate}</td>
                    <td className="py-3 pr-4"><StatusBadge status={submission.status} /></td>
                    <td className="py-3 pr-4 text-slate-600">{submission.owner}</td>
                    <td className="py-3 pr-4 text-right font-medium text-slate-800">{submission.daysRemaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 text-lg font-semibold text-slate-900">Expiring Soon</div>
          <div className="space-y-3">
            {expiringSoon.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge variant={item.severity === 'Critical' ? 'critical' : item.severity === 'Warning' ? 'warning' : 'default'}>{item.severity}</Badge>
                </div>
                <div className="text-sm font-medium text-slate-800">{item.title}</div>
                <div className="mt-1 text-xs text-slate-500">{item.detail}</div>
                <div className="mt-3 text-xs font-medium text-primary">{item.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-lg font-semibold text-slate-900">Submission Types</div>
          <div className="flex flex-wrap gap-2">
            {[
              'Initial Submission',
              'Protocol Amendment',
              'ICF Amendment',
              'Continuing Review',
              'Annual Review',
              'Safety Submission',
              'Deviation Submission',
              'Closure Submission',
              'Other',
            ].map((type) => (
              <Badge key={type} variant="neutral" className="border border-slate-200 bg-white text-slate-700">{type}</Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-lg font-semibold text-slate-900">Recent Activity</div>
          <ActivityFeed items={activityFeedItems} />
        </div>
      </div>
    </div>
  )
}
