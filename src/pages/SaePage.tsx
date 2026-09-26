import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { adverseEvents } from '../data/safety'

export function SaePage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const saes = useMemo(() => adverseEvents.filter((event) => event.seriousness === 'Serious'), [])
  const filtered = saes.filter((event) => filter === 'All' || event.status === filter)

  return (
    <div>
      <PageHeader title="Serious Adverse Events" subtitle="Serious event status, review flow and escalation tracking." actions={<Button onClick={() => navigate('/adverse-events')}>Open AE Workspace</Button>} />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <KpiCard label="SAEs" value={String(saes.length)} subtitle="total serious events" accent="red" />
        <KpiCard label="Open review" value={String(saes.filter((event) => event.status !== 'Closed').length)} subtitle="requires action" accent="amber" />
        <KpiCard label="Closed" value={String(saes.filter((event) => event.status === 'Closed').length)} subtitle="resolved" accent="teal" />
      </div>

      <div className="mb-4 flex gap-2">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All statuses</option>
          <option value="Under Review">Under Review</option>
          <option value="Follow-up Required">Follow-up Required</option>
          <option value="Medically Reviewed">Medically Reviewed</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">SAE ID</th>
              <th className="px-4 py-3 font-semibold">Participant</th>
              <th className="px-4 py-3 font-semibold">Event</th>
              <th className="px-4 py-3 font-semibold">Severity</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3"><button type="button" className="font-medium text-primary" onClick={() => navigate(`/adverse-events/${event.id}`)}>{event.id}</button></td>
                <td className="px-4 py-3">{event.participantName}</td>
                <td className="px-4 py-3">{event.eventTerm}</td>
                <td className="px-4 py-3">{event.severity}</td>
                <td className="px-4 py-3"><StatusBadge status={event.status === 'Closed' ? 'Completed' : event.status === 'Under Review' ? 'Overdue' : 'Scheduled'} /></td>
                <td className="px-4 py-3">{event.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
