import { AlertTriangle, BellRing, CheckCheck, ClipboardList, FileClock } from 'lucide-react'
import { Link } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { ctriRecords } from '../data/phase3'

export function CtriManagementPage() {
  const kpis = [
    { label: 'Registered Trials', value: '14', subtitle: '82% of active portfolio', accent: 'teal' as const, icon: <CheckCheck className="h-4 w-4" /> },
    { label: 'Registration Pending', value: '2', subtitle: '1 from this month', accent: 'amber' as const, icon: <FileClock className="h-4 w-4" /> },
    { label: 'Updates Due', value: '5', subtitle: '2 within 7 days', accent: 'blue' as const, icon: <ClipboardList className="h-4 w-4" /> },
    { label: 'Overdue Updates', value: '1', subtitle: 'escalated', accent: 'red' as const, icon: <AlertTriangle className="h-4 w-4" /> },
    { label: 'Amendments', value: '3', subtitle: '1 awaiting approval', accent: 'amber' as const },
    { label: 'Recently Updated', value: '8', subtitle: '+3 this week', accent: 'teal' as const },
  ]

  return (
    <div>
      <PageHeader title="CTRI Management Center" subtitle="Track trial registration, updates, amendments and reporting obligations." />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable />
        ))}
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 text-lg font-semibold text-slate-900">CTRI Records</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4 font-medium">Study ID</th>
                  <th className="py-3 pr-4 font-medium">Study Title</th>
                  <th className="py-3 pr-4 font-medium">CTRI Number</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Initial Registration</th>
                  <th className="py-3 pr-4 font-medium">Last Update</th>
                  <th className="py-3 pr-4 font-medium">Next Update</th>
                  <th className="py-3 pr-4 font-medium">Days</th>
                  <th className="py-3 pr-4 font-medium">Owner</th>
                </tr>
              </thead>
              <tbody>
                {ctriRecords.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">
                      <Link to={`/ctri/${record.id}`} className="font-medium text-slate-800 hover:text-primary">{record.studyId}</Link>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{record.studyTitle}</td>
                    <td className="py-3 pr-4 text-slate-600">{record.ctriNumber}</td>
                    <td className="py-3 pr-4"><StatusBadge status={record.status} /></td>
                    <td className="py-3 pr-4 text-slate-600">{record.initialRegistration}</td>
                    <td className="py-3 pr-4 text-slate-600">{record.lastUpdate}</td>
                    <td className="py-3 pr-4 text-slate-600">{record.nextUpdateDue}</td>
                    <td className="py-3 pr-4 text-right font-medium text-slate-800">{record.daysRemaining}</td>
                    <td className="py-3 pr-4 text-slate-600">{record.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <BellRing className="h-5 w-5 text-amber-600" />
            CTRI Action Center
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Due Today', items: [{ title: 'AIIA-AYU-006', detail: 'Annual update due', owner: 'Regulatory Manager' }] },
              { label: 'Due This Week', items: [{ title: 'AIIA-AYU-001', detail: 'Quarterly revision window', owner: 'Regulatory Lead' }] },
              { label: 'Due This Month', items: [{ title: 'AIIA-AYU-004', detail: 'Registration pending documents', owner: 'Study Coordinator' }] },
              { label: 'Overdue', items: [{ title: 'AIIA-AYU-006', detail: 'Update passed due date', owner: 'Quality Team' }] },
            ].map((group) => (
              <div key={group.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{group.label}</div>
                {group.items.map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.detail}</div>
                    <div className="mt-1 text-[11px] text-slate-500">Owner: {item.owner}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-3 text-lg font-semibold text-slate-900">Status Summary</div>
        <div className="flex flex-wrap gap-2">
          {['Not Registered', 'Registration Pending', 'Registered', 'Update Due', 'Overdue', 'Amendment Required'].map((status) => (
            <Badge key={status} variant={status === 'Overdue' ? 'critical' : status === 'Update Due' ? 'warning' : 'neutral'}>{status}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
