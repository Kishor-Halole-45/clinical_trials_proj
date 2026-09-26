import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { dsmbMeetings } from '../data/safety'

export function DsmbDetailPage() {
  const { meetingId } = useParams()
  const meeting = dsmbMeetings.find((item) => item.id === meetingId) ?? dsmbMeetings[0]
  const [tab, setTab] = useState<'Summary' | 'Agenda' | 'Decisions' | 'Members'>('Summary')

  return (
    <div>
      <PageHeader title={meeting.id} subtitle={meeting.studyTitle} actions={<><Button variant="outline">Publish minutes</Button><Button>Record decision</Button></>} />
      <div className="mb-5 flex flex-wrap gap-3">
        <StatusBadge status={meeting.status === 'Completed' ? 'Completed' : meeting.status === 'Scheduled' ? 'Scheduled' : 'Overdue'} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{meeting.meetingType}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['Summary', 'Agenda', 'Decisions', 'Members'].map((item) => (
          <button key={item} type="button" onClick={() => setTab(item as any)} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === item ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'Summary' && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Meeting date</span><div className="mt-1 text-lg font-semibold text-slate-900">{meeting.meetingDate}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Chair</span><div className="mt-1 text-lg font-semibold text-slate-900">{meeting.chair}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</span><div className="mt-1 text-lg font-semibold text-slate-900">{meeting.status}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Outcome</span><div className="mt-1 text-lg font-semibold text-slate-900">{meeting.outcome ?? 'Pending'}</div></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Committee</div>
            <ul className="space-y-2 text-sm text-slate-600">
              {meeting.members.map((member) => <li key={member}>• {member}</li>)}
            </ul>
          </div>
        </div>
      )}

      {tab === 'Agenda' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <ul className="space-y-2 text-sm text-slate-700">
            {meeting.agenda.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      )}

      {tab === 'Decisions' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-3">
            {meeting.decisions.map((decision) => (
              <div key={decision.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <div className="font-medium text-slate-800">{decision.decision}</div>
                <div className="mt-1">{decision.rationale}</div>
                <div className="mt-2 text-xs text-slate-500">{decision.date} · {decision.recordedBy}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Members' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-2 text-sm text-slate-700">
            {meeting.members.map((member) => <div key={member}>• {member}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}
