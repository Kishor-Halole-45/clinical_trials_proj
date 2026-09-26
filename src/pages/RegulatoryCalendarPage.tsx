import { CalendarDays } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/badge'
import { regulatoryCalendarEvents } from '../data/phase3'

export function RegulatoryCalendarPage() {
  return (
    <div>
      <PageHeader title="Regulatory Calendar" subtitle="Unified deadline and review schedule across ethics, CTRI, consent, monitoring and document obligations." />

      <div className="mb-6 flex flex-wrap gap-2">
        {['Month', 'Week', 'Agenda'].map((view) => (
          <button key={view} type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">{view}</button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><CalendarDays className="h-5 w-5 text-primary" /> Calendar</div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-medium">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, index) => (
              <div key={index} className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                {index + 7 > 31 ? index - 24 : index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 text-lg font-semibold text-slate-900">Upcoming events</div>
          <div className="space-y-3">
            {regulatoryCalendarEvents.map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-slate-800">{event.title}</div>
                  <Badge variant={event.category === 'Regulatory' ? 'warning' : event.category === 'CTRI' ? 'info' : 'neutral'}>{event.category}</Badge>
                </div>
                <div className="mt-2 text-sm text-slate-600">{event.study}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
