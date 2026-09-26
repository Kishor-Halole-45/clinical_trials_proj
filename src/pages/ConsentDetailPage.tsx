import { FileText, ShieldCheck } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { consentRecords } from '../data/phase3'

export function ConsentDetailPage() {
  const { participantId } = useParams()
  const record = consentRecords.find((item) => item.participantId === participantId)

  if (!record) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Consent record not found.</div>
  }

  return (
    <div>
      <PageHeader title={record.participantId} subtitle={`${record.study} · ${record.site}`} />

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">Consent Status</div>
            <StatusBadge status={record.status} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Study</div><div className="mt-1 font-medium text-slate-800">{record.study}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Consent version</div><div className="mt-1 font-medium text-slate-800">{record.consentVersion}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Consent date</div><div className="mt-1 font-medium text-slate-800">{record.consentDate}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Document version</div><div className="mt-1 font-medium text-slate-800">{record.document}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Verification</div><div className="mt-1 font-medium text-slate-800">{record.verifiedBy}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Re-consent required</div><div className="mt-1"><Badge variant={record.reConsentRequired === 'Yes' ? 'warning' : 'success'}>{record.reConsentRequired}</Badge></div></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Timeline</div>
          <div className="space-y-3">
            {['Consent Requested', 'Consent Obtained', 'Verified', 'Amendment', 'Re-consent'].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{index + 1}</div>
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900"><FileText className="h-5 w-5 text-slate-600" /> History</div>
        <div className="space-y-2">
          {record.history.map((event) => (
            <div key={`${event.label}-${event.date}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700">
              <span>{event.label}</span>
              <div className="flex items-center gap-2">
                <span>{event.date}</span>
                <Badge variant={event.complete ? 'success' : 'neutral'}>{event.complete ? 'Completed' : 'Pending'}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
