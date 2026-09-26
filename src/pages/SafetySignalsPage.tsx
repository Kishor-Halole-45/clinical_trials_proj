import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { safetySignals } from '../data/safety'
import { Button } from '../components/ui/button'

export function SafetySignalsPage() {
  const navigate = useNavigate()
  const [studyFilter, setStudyFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredSignals = useMemo(() => safetySignals.filter((signal) => {
    const matchesStudy = studyFilter === 'All' || signal.studyId === studyFilter
    const matchesStatus = statusFilter === 'All' || signal.status === statusFilter
    return matchesStudy && matchesStatus
  }), [studyFilter, statusFilter])

  return (
    <div>
      <PageHeader title="Safety Signals" subtitle="Security review and configured demonstration rule-based signal monitoring." actions={<Button onClick={() => navigate('/safety-signals/SIG-2026-003')}>Open signal review</Button>} />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <KpiCard label="Detected" value={String(safetySignals.filter((signal) => signal.status === 'Detected').length)} subtitle="rule-triggered" accent="blue" />
        <KpiCard label="Under Review" value={String(safetySignals.filter((signal) => signal.status === 'Under Review').length)} subtitle="active review" accent="amber" />
        <KpiCard label="Monitoring" value={String(safetySignals.filter((signal) => signal.status === 'Monitoring').length)} subtitle="ongoing investigation" accent="teal" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select value={studyFilter} onChange={(event) => setStudyFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All studies</option>
          {Array.from(new Set(safetySignals.map((signal) => signal.studyId))).map((study) => <option key={study} value={study}>{study}</option>)}
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All statuses</option>
          <option value="Detected">Detected</option>
          <option value="Under Review">Under Review</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Refuted">Refuted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Signal ID</th>
              <th className="px-4 py-3 font-semibold">Signal Term</th>
              <th className="px-4 py-3 font-semibold">Study</th>
              <th className="px-4 py-3 font-semibold">Event Count</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Reviewer</th>
              <th className="px-4 py-3 font-semibold">Review Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.map((signal) => (
              <tr key={signal.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3"><button type="button" className="font-medium text-primary" onClick={() => navigate(`/safety-signals/${signal.id}`)}>{signal.id}</button></td>
                <td className="px-4 py-3">{signal.signalTerm}</td>
                <td className="px-4 py-3">{signal.studyId}</td>
                <td className="px-4 py-3">{signal.eventCount}</td>
                <td className="px-4 py-3"><StatusBadge status={signal.status === 'Under Review' ? 'Scheduled' : signal.status === 'Monitoring' ? 'Overdue' : 'Completed'} /></td>
                <td className="px-4 py-3">{signal.reviewer}</td>
                <td className="px-4 py-3">{signal.reviewStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
