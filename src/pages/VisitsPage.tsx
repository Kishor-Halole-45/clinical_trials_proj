import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'
import { CalendarDays, Filter, ListChecks } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DataTable } from '../components/DataTable'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterBar } from '../components/FilterBar'
import { KpiCard } from '../components/KpiCard'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { visitService } from '../services/visitService'
import { useAppStore } from '../store/useAppStore'
import type { VisitRecord } from '../types'
import { canAccessModule } from '../lib/permissions'

const visitSchema = z.object({
  notes: z.string().min(1, 'Notes are required for a visit update.'),
  status: z.enum(['Scheduled', 'Completed', 'Overdue', 'Missed', 'Rescheduled', 'Cancelled']),
})

type VisitFormValues = z.infer<typeof visitSchema>

export function VisitsPage() {
  const role = useAppStore((state) => state.role)
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [search, setSearch] = useState('')
  const [studyFilter, setStudyFilter] = useState('All')
  const [siteFilter, setSiteFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [calendarView, setCalendarView] = useState<'Month' | 'Week' | 'Day'>('Month')
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const createForm = useForm({
    defaultValues: {
      participantId: 'PT-A001-0001',
      studyId: 'AIIA-AYU-001',
      siteId: 'SITE-001',
      visitType: 'Baseline',
      status: 'Scheduled',
      scheduledDate: '2026-09-28',
      owner: 'A. Pillai',
      notes: 'Routine observational visit scheduled.',
    },
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setVisits(visitService.getVisits())
        setLoadState('ready')
      } catch {
        setLoadState('error')
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [])

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      notes: selectedVisit?.notes ?? '',
      status: selectedVisit?.status ?? 'Scheduled',
    },
  })

  useEffect(() => {
    if (selectedVisit) {
      form.reset({ notes: selectedVisit.notes, status: selectedVisit.status })
    }
  }, [selectedVisit, form])

  const studyOptions = useMemo(() => Array.from(new Set(visits.map((visit) => visit.studyId))), [visits])
  const siteOptions = useMemo(() => Array.from(new Set(visits.map((visit) => visit.siteId))), [visits])
  const typeOptions = useMemo(() => Array.from(new Set(visits.map((visit) => visit.visitType))), [visits])

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const matchesSearch = !search || `${visit.id} ${visit.participantId} ${visit.studyId} ${visit.siteName}`.toLowerCase().includes(search.toLowerCase())
      const matchesStudy = studyFilter === 'All' || visit.studyId === studyFilter
      const matchesSite = siteFilter === 'All' || visit.siteId === siteFilter
      const matchesType = typeFilter === 'All' || visit.visitType === typeFilter
      const matchesStatus = statusFilter === 'All' || visit.status === statusFilter
      return matchesSearch && matchesStudy && matchesSite && matchesType && matchesStatus
    })
  }, [visits, search, studyFilter, siteFilter, typeFilter, statusFilter])

  const calendarDates = useMemo(() => {
    const monthStart = startOfMonth(new Date('2026-09-01'))
    const monthEnd = endOfMonth(monthStart)
    return eachDayOfInterval({ start: monthStart, end: monthEnd })
  }, [])

  if (!canAccessModule(role, 'visits')) {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">Permission denied for visit operations in the current role.</div>
  }

  if (loadState === 'loading') return <LoadingState message="Loading visits and schedule..." />
  if (loadState === 'error') return <ErrorState title="Visit data unavailable" description="The visit calendar could not be loaded." />

  const onSubmit = (values: VisitFormValues) => {
    if (!selectedVisit) return
    const updated = visitService.updateVisit(selectedVisit.id, { status: values.status, notes: values.notes })
    if (updated) {
      setVisits((current) => current.map((visit) => visit.id === updated.id ? updated : visit))
      setSelectedVisit(updated)
    }
  }

  const handleCreateVisit = (values: any) => {
    const created = visitService.createVisit({
      id: `VIS-${String(visits.length + 1).padStart(4, '0')}`,
      studyId: values.studyId,
      studyTitle: 'Ayurvedic Management in Mild to Moderate Rheumatoid Arthritis',
      participantId: values.participantId,
      participantName: values.participantId,
      siteId: values.siteId,
      siteName: 'AIIA Research Center, New Delhi',
      visitType: values.visitType,
      scheduledDate: values.scheduledDate,
      actualDate: values.status === 'Completed' ? values.scheduledDate : undefined,
      visitWindow: 'On Time',
      status: values.status,
      owner: values.owner,
      notes: values.notes,
      protocolDeviations: 0,
      dataQueries: 0,
    })

    setVisits((current) => [created, ...current])
    setShowCreate(false)
    createForm.reset()
  }

  const statusAction = (status: VisitRecord['status']) => {
    if (!selectedVisit) return
    if (status === 'Completed' || status === 'Missed') {
      const confirmed = window.confirm(`Mark visit ${selectedVisit.id} as ${status}?`)
      if (!confirmed) return
    }
    const updated = visitService.updateVisit(selectedVisit.id, { status })
    if (updated) {
      setVisits((current) => current.map((visit) => visit.id === updated.id ? updated : visit))
      setSelectedVisit(updated)
    }
  }

  return (
    <div>
      <PageHeader
        title="Visit Management"
        subtitle="Monitor scheduled, completed, missed and overdue participant visits."
        actions={
          <>
            <Button variant="outline" onClick={() => setShowCreate((prev) => !prev)}>Create visit</Button>
            <Button variant="outline">Export visit list</Button>
          </>
        }
      />

      {showCreate && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-800">Schedule a new visit</div>
          <form onSubmit={createForm.handleSubmit(handleCreateVisit)} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input {...createForm.register('participantId')} placeholder="Participant ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...createForm.register('studyId')} placeholder="Study ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...createForm.register('siteId')} placeholder="Site ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...createForm.register('visitType')} placeholder="Visit type" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input type="date" {...createForm.register('scheduledDate')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <select {...createForm.register('status')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Missed">Missed</option>
            </select>
            <input {...createForm.register('owner')} placeholder="Owner" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <textarea {...createForm.register('notes')} placeholder="Visit notes" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <div className="md:col-span-2 xl:col-span-4 flex gap-2">
              <Button type="submit">Create visit</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Scheduled Today" value="18" subtitle="across sites" accent="blue" icon={<CalendarDays className="h-4 w-4" />} />
        <KpiCard label="Completed Today" value="11" subtitle="high compliance" accent="teal" icon={<ListChecks className="h-4 w-4" />} />
        <KpiCard label="Upcoming" value="42" subtitle="within 30 days" accent="slate" />
        <KpiCard label="Overdue" value="8" subtitle="requires escalation" accent="amber" />
        <KpiCard label="Missed" value="4" subtitle="follow-up scheduled" accent="red" />
        <KpiCard label="Rescheduled" value="6" subtitle="reconciled" accent="blue" />
      </div>

      <div className="mb-4 space-y-3">
        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search participant or visit ID" />
          <select value={studyFilter} onChange={(e) => setStudyFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All studies</option>
            {studyOptions.map((study) => <option key={study} value={study}>{study}</option>)}
          </select>
          <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All sites</option>
            {siteOptions.map((site) => <option key={site} value={site}>{site}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All visit types</option>
            {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
            <option value="Missed">Missed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button variant="secondary" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
        </FilterBar>
      </div>

      <div className="mb-6 flex gap-2">
        {['Month', 'Week', 'Day'].map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setCalendarView(view as 'Month' | 'Week' | 'Day')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${calendarView === view ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {view}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-700">Visit calendar · {calendarView}</div>
          <div className="grid gap-3 md:grid-cols-7">
            {calendarDates.map((date) => {
              const dayVisits = filteredVisits.filter((visit) => visit.scheduledDate === format(date, 'yyyy-MM-dd'))
              return (
                <div key={date.toISOString()} className="min-h-24 rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <div className="mb-2 text-xs font-medium text-slate-500">{format(date, 'd')}</div>
                  <div className="space-y-1">
                    {dayVisits.slice(0, 2).map((visit) => (
                      <button key={visit.id} type="button" onClick={() => setSelectedVisit(visit)} className="block w-full rounded border border-slate-200 bg-white px-1.5 py-1 text-left text-[10px] text-slate-700 hover:bg-slate-100">
                        {visit.visitType}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {selectedVisit ? (
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-800">Visit detail drawer</div>
              <div className="space-y-3 text-sm text-slate-600">
                <div><span className="text-slate-500">Visit ID:</span> {selectedVisit.id}</div>
                <div><span className="text-slate-500">Participant:</span> {selectedVisit.participantId}</div>
                <div><span className="text-slate-500">Study:</span> {selectedVisit.studyId}</div>
                <div><span className="text-slate-500">Site:</span> {selectedVisit.siteName}</div>
                <div><span className="text-slate-500">Status:</span> <StatusBadge status={selectedVisit.status} /></div>
                <div><span className="text-slate-500">Window:</span> {selectedVisit.visitWindow}</div>
                <div><span className="text-slate-500">Owner:</span> {selectedVisit.owner}</div>
                <div><span className="text-slate-500">Notes:</span> {selectedVisit.notes}</div>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-slate-700">Update status</label>
                <select {...form.register('status')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Missed">Missed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {form.formState.errors.status && <div className="text-xs text-red-600">{form.formState.errors.status.message}</div>}
                <textarea {...form.register('notes')} rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" />
                {form.formState.errors.notes && <div className="text-xs text-red-600">{form.formState.errors.notes.message}</div>}
                <div className="flex gap-2">
                  <Button type="submit" variant="default">Mark updated</Button>
                  <Button type="button" variant="outline" onClick={() => statusAction('Completed')}>Complete</Button>
                  <Button type="button" variant="secondary" onClick={() => statusAction('Missed')}>Missed</Button>
                </div>
              </form>
            </div>
          ) : (
            <EmptyState title="Select a visit" description="Choose a visit from the calendar to view operational details." />
          )}
        </div>
      </div>

      {filteredVisits.length === 0 ? (
        <EmptyState title="No visits match the active filters" description="Try broadening the date or site range to review the visit schedule." />
      ) : (
        <DataTable
          data={filteredVisits}
          columns={[
            { accessorKey: 'id', header: 'Visit ID' },
            { accessorKey: 'participantId', header: 'Participant' },
            { accessorKey: 'studyId', header: 'Study' },
            { accessorKey: 'siteName', header: 'Site' },
            { accessorKey: 'visitType', header: 'Visit Type' },
            { accessorKey: 'scheduledDate', header: 'Scheduled Date' },
            { accessorKey: 'actualDate', header: 'Actual Date', cell: (info: any) => info.getValue() ?? 'Pending' },
            { accessorKey: 'visitWindow', header: 'Visit Window' },
            { accessorKey: 'status', header: 'Status', cell: (info: any) => <StatusBadge status={info.getValue() as any} /> },
            { accessorKey: 'owner', header: 'Owner' },
          ]}
          filterText={search}
          onRowClick={(row) => setSelectedVisit(row)}
        />
      )}
    </div>
  )
}
