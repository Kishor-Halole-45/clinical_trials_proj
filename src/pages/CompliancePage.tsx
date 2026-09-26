import { BadgeCheck, FileSearch, ShieldCheck, TimerReset } from 'lucide-react'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/badge'
import { complianceFrameworks } from '../data/phase3'

export function CompliancePage() {
  const kpis = [
    { label: 'Frameworks Tracked', value: '7', subtitle: 'portfolio-wide', accent: 'blue' as const, icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'Compliant', value: '3', subtitle: 'current status', accent: 'teal' as const, icon: <BadgeCheck className="h-4 w-4" /> },
    { label: 'Needs Review', value: '2', subtitle: 'within 30 days', accent: 'amber' as const, icon: <FileSearch className="h-4 w-4" /> },
    { label: 'Action Required', value: '1', subtitle: 'escalated', accent: 'red' as const, icon: <TimerReset className="h-4 w-4" /> },
  ]

  return (
    <div>
      <PageHeader title="Compliance Center" subtitle="Institutional compliance tracking across framework evidence, ownership and review cadence." />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 text-lg font-semibold text-slate-900">Framework Review Log</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">Framework</th>
                <th className="py-3 pr-4 font-medium">Requirement Area</th>
                <th className="py-3 pr-4 font-medium">Evidence</th>
                <th className="py-3 pr-4 font-medium">Owner</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Last Reviewed</th>
                <th className="py-3 pr-4 font-medium">Next Review</th>
              </tr>
            </thead>
            <tbody>
              {complianceFrameworks.map((item) => (
                <tr key={item.framework} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-800">{item.framework}</td>
                  <td className="py-3 pr-4 text-slate-600">{item.requirementArea}</td>
                  <td className="py-3 pr-4 text-slate-600">{item.evidence}</td>
                  <td className="py-3 pr-4 text-slate-600">{item.owner}</td>
                  <td className="py-3 pr-4"><Badge variant={item.status === 'Compliant' ? 'success' : item.status === 'Needs Review' ? 'warning' : item.status === 'Action Required' ? 'critical' : 'neutral'}>{item.status}</Badge></td>
                  <td className="py-3 pr-4 text-slate-600">{item.lastReviewed}</td>
                  <td className="py-3 pr-4 text-slate-600">{item.nextReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
