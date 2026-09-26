import { FileText, ShieldCheck } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { ctriRecords } from '../data/phase3'

export function CtriDetailPage() {
  const { ctriId } = useParams()
  const record = ctriRecords.find((item) => item.id === ctriId)

  if (!record) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">CTRI record not found.</div>
  }

  return (
    <div>
      <PageHeader title={record.ctriNumber} subtitle={`${record.studyTitle} · ${record.studyId}`} />

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">CTRI Record</div>
            <StatusBadge status={record.status} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Study</div><div className="mt-1 font-medium text-slate-800">{record.studyTitle}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Registration status</div><div className="mt-1 font-medium text-slate-800">{record.registrationStatus}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Registration date</div><div className="mt-1 font-medium text-slate-800">{record.initialRegistration}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Last update</div><div className="mt-1 font-medium text-slate-800">{record.lastUpdate}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Next required update</div><div className="mt-1 font-medium text-slate-800">{record.nextUpdateDue}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Responsible owner</div><div className="mt-1 font-medium text-slate-800">{record.owner}</div></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Timeline</div>
          <div className="space-y-3">
            {['Registration', 'Update', 'Amendment', 'Update', 'Results'].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{index + 1}</div>
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900"><FileText className="h-5 w-5 text-slate-600" /> Submission history</div>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">Initial registration submitted on {record.initialRegistration}</div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">Latest update reviewed on {record.lastUpdate}</div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">Revision package due by {record.nextUpdateDue}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-lg font-semibold text-slate-900">Audit and activity</div>
          <div className="space-y-2">
            {['Registration accepted', 'Sponsor notified', 'Amendment package prepared', 'Monitoring evidence uploaded'].map((event) => (
              <div key={event} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700">
                <span>{event}</span>
                <Badge variant="neutral">Logged</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
