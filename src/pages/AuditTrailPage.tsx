import { ShieldCheck, TimerReset } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/badge'

const auditEntries = [
  { time: '2026-09-26 09:12', actor: 'Clinical Lead', role: 'PI', action: 'Approved safety review', entity: 'AE-2026-0042', module: 'Safety', previous: 'Under Review', newValue: 'Medically Reviewed', source: 'Safety workflow' },
  { time: '2026-09-26 08:44', actor: 'A. Raman', role: 'Coordinator', action: 'Updated enrollment target', entity: 'AIIA-AYU-003', module: 'Operations', previous: '1,240', newValue: '1,340', source: 'Study dashboard' },
  { time: '2026-09-25 18:07', actor: 'N. Patel', role: 'Data Manager', action: 'Resolved query', entity: 'DQ-2041', module: 'Data Quality', previous: 'Open', newValue: 'Resolved', source: 'Query manager' },
  { time: '2026-09-24 16:25', actor: 'M. Nair', role: 'Monitor', action: 'Closed monitoring finding', entity: 'MON-017', module: 'Monitoring', previous: 'Action required', newValue: 'Closed', source: 'Monitoring review' },
  { time: '2026-09-22 11:50', actor: 'R. Sethi', role: 'Ethics', action: 'Approved protocol amendment', entity: 'ETH-104', module: 'Regulatory', previous: 'Draft', newValue: 'Approved', source: 'Ethics submission' },
]

export function AuditTrailPage() {
  return (
    <div>
      <PageHeader
        title="Audit Trail"
        subtitle="Traceability and accountability across clinical operations, safety, and interoperability workflows."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Audit enabled</Badge>
            <Badge variant="success">Demo mode</Badge>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Compliance</div>
          <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-900">99.4%</div>
          <div className="mt-1 text-xs text-slate-500">Workflow completeness</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><TimerReset className="h-4 w-4 text-amber-600" /> Review latency</div>
          <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-900">2.3d</div>
          <div className="mt-1 text-xs text-slate-500">Median across active workflows</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><ShieldCheck className="h-4 w-4 text-blue-600" /> Record integrity</div>
          <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-900">100%</div>
          <div className="mt-1 text-xs text-slate-500">No orphaned entities</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Actor</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="px-4 py-3 font-semibold">Module</th>
                <th className="px-4 py-3 font-semibold">Previous</th>
                <th className="px-4 py-3 font-semibold">New</th>
                <th className="px-4 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {auditEntries.map((entry) => (
                <tr key={`${entry.entity}-${entry.time}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{entry.time}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{entry.actor}</td>
                  <td className="px-4 py-3"><Badge variant="neutral">{entry.role}</Badge></td>
                  <td className="px-4 py-3 text-slate-700">{entry.action}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{entry.entity}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.module}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.previous}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.newValue}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
