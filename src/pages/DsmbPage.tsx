import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { dsmbMeetings } from '../data/safety'

export function DsmbPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = useMemo(() => dsmbMeetings.filter((meeting) => statusFilter === 'All' || meeting.status === statusFilter), [statusFilter])

  return (
    <div>
      <PageHeader title="DSMB Reviews" subtitle="Safety committee review cadence, decisions and ongoing monitoring oversight." actions={<Button onClick={() => navigate('/dsmb/DSMB-2026-004')}>Open next review</Button>} />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <KpiCard label="Scheduled" value={String(dsmbMeetings.filter((meeting) => meeting.status === 'Scheduled').length)} subtitle="upcoming" accent="blue" />
        <KpiCard label="Completed" value={String(dsmbMeetings.filter((meeting) => meeting.status === 'Completed').length)} subtitle="closed reviews" accent="teal" />
        <KpiCard label="Pending" value={String(dsmbMeetings.filter((meeting) => meeting.outcome === 'Pending').length)} subtitle="action required" accent="amber" />
      </div>

      <div className="mb-4 flex gap-2">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Meeting ID</th>
              <th className="px-4 py-3 font-semibold">Study</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Chair</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((meeting) => (
              <tr key={meeting.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3"><button type="button" className="font-medium text-primary" onClick={() => navigate(`/dsmb/${meeting.id}`)}>{meeting.id}</button></td>
                <td className="px-4 py-3">{meeting.studyId}</td>
                <td className="px-4 py-3">{meeting.meetingType}</td>
                <td className="px-4 py-3">{meeting.meetingDate}</td>
                <td className="px-4 py-3">{meeting.chair}</td>
                <td className="px-4 py-3"><StatusBadge status={meeting.status === 'Completed' ? 'Completed' : meeting.status === 'Scheduled' ? 'Scheduled' : 'Overdue'} /></td>
                <td className="px-4 py-3">{meeting.outcome ?? 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
