import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { monitoringRecords } from '../data/monitoring'
import { monitoringService } from '../services/monitoringService'

export function MonitoringPage() {
  const findings = monitoringService.getFindings().slice(0, 6)

  return (
    <div>
      <PageHeader title="Monitoring" subtitle="Visit tracking, data verification and compliance follow-up." />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Upcoming Visits" value="12" subtitle="within 30 days" accent="blue" />
        <KpiCard label="Overdue Visits" value="3" subtitle="requires escalation" accent="red" />
        <KpiCard label="Completed" value="18" subtitle="92% completion" accent="teal" />
        <KpiCard label="Critical Findings" value="6" subtitle="2 pending closure" accent="amber" />
        <KpiCard label="Open Findings" value="9" subtitle="review required" accent="slate" />
        <KpiCard label="CAPA Due" value="5" subtitle="this week" accent="blue" />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <ChartCard title="Monitoring calendar" subtitle="Planned and completed visits">
            <div className="grid gap-3 md:grid-cols-2">
              {monitoringRecords.slice(0, 8).map((record) => (
                <div key={record.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-800">{record.study}</div>
                    <StatusBadge status={record.status} />
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{record.site}</div>
                  <div className="mt-2 text-xs text-slate-500">{record.visitType} • {record.monitor}</div>
                  <div className="mt-2 text-xs text-slate-500">Planned: {record.plannedDate} • Findings: {record.findings}</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-4">
          <ChartCard title="Site risk" subtitle="Current risk statements">
            <div className="space-y-3">
              {findings.map((finding) => (
                <div key={finding.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-800">{finding.siteId}</div>
                    <StatusBadge status={finding.siteRisk} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{finding.summary}</div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Visit ID</th>
              <th className="px-4 py-3 font-semibold">Study</th>
              <th className="px-4 py-3 font-semibold">Site</th>
              <th className="px-4 py-3 font-semibold">Monitor</th>
              <th className="px-4 py-3 font-semibold">Visit Type</th>
              <th className="px-4 py-3 font-semibold">Planned Date</th>
              <th className="px-4 py-3 font-semibold">Actual Date</th>
              <th className="px-4 py-3 font-semibold">Findings</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {monitoringRecords.map((record) => (
              <tr key={record.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{record.id}</td>
                <td className="px-4 py-3">{record.study}</td>
                <td className="px-4 py-3">{record.site}</td>
                <td className="px-4 py-3">{record.monitor}</td>
                <td className="px-4 py-3">{record.visitType}</td>
                <td className="px-4 py-3">{record.plannedDate}</td>
                <td className="px-4 py-3">{record.actualDate ?? 'Pending'}</td>
                <td className="px-4 py-3">{record.findings}</td>
                <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
