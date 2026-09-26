import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { safetySignals } from '../data/safety'

export function SafetySignalDetailPage() {
  const { signalId } = useParams()
  const signal = safetySignals.find((item) => item.id === signalId) ?? safetySignals[0]
  const [tab, setTab] = useState<'Summary' | 'Review' | 'Events' | 'Audit'>('Summary')

  return (
    <div>
      <PageHeader title={signal.id} subtitle={signal.signalTerm} actions={<><Button variant="outline">Assign Reviewer</Button><Button>Save Assessment</Button></>} />
      <div className="mb-5 flex flex-wrap gap-3">
        <StatusBadge status={signal.status === 'Under Review' ? 'Scheduled' : signal.status === 'Monitoring' ? 'Overdue' : 'Completed'} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Detected from: {signal.detectedFrom}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['Summary', 'Review', 'Events', 'Audit'].map((item) => (
          <button key={item} type="button" onClick={() => setTab(item as any)} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === item ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'Summary' && (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Observed term</span><div className="mt-1 text-lg font-semibold text-slate-900">{signal.signalTerm}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Study</span><div className="mt-1 text-lg font-semibold text-slate-900">{signal.studyTitle}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Event count</span><div className="mt-1 text-lg font-semibold text-slate-900">{signal.eventCount}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Reviewer</span><div className="mt-1 text-lg font-semibold text-slate-900">{signal.reviewer}</div></div>
            </div>
            <div className="mt-4 text-sm text-slate-600">Evidence: {signal.evidence}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Assessment</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div>{signal.observedPattern}</div>
              <div>Studies: {signal.affectedStudies.join(', ')}</div>
              <div>Sites: {signal.affectedSites.join(', ')}</div>
              <div>Detection: Demo rule-based detection</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Review' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-3 text-sm text-slate-700">
            <div><strong>Reviewer assessment:</strong> The observed pattern remains consistent with a limited cohort and requires continued monitoring.</div>
            <div><strong>Disposition:</strong> Monitoring</div>
            <div><strong>Notes:</strong> Observed data are distinct from final medical interpretation and are being reviewed by the safety committee.</div>
          </div>
        </div>
      )}

      {tab === 'Events' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-2 text-sm text-slate-700">
            <div>AE-2026-0042 · Nausea and vomiting</div>
            <div>AE-2026-0198 · Headache</div>
            <div>AE-2026-0214 · Elevated blood pressure</div>
            <div>AE-2026-0302 · Skin rash</div>
          </div>
        </div>
      )}

      {tab === 'Audit' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-3">
            {signal.auditTrail.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <div className="font-medium text-slate-800">{entry.action}</div>
                <div className="mt-1">{entry.actor} · {entry.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
