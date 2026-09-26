import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Activity, Filter, UserRoundCog } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { participantService } from '../services/participantService'
import { useAppStore } from '../store/useAppStore'
import type { Participant } from '../types'
import { canAccessModule } from '../lib/permissions'

const participantSchema = z.object({
  id: z.string().min(1, 'Participant ID is required.'),
  studyId: z.string().min(1, 'Study is required.'),
  siteId: z.string().min(1, 'Site is required.'),
  siteName: z.string().min(1, 'Site name is required.'),
  status: z.enum(['Screened', 'Enrolled', 'Randomized', 'Active', 'Completed', 'Withdrawn']),
  currentVisit: z.string().min(1, 'Current visit is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  ageGroup: z.string().min(1, 'Age group is required.'),
  screeningDate: z.string().min(1, 'Screening date is required.'),
  enrollmentDate: z.string().optional(),
  cohort: z.string().min(1, 'Cohort is required.'),
})

type ParticipantFormValues = z.infer<typeof participantSchema>

export function ParticipantsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = useAppStore((state) => state.role)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [search, setSearch] = useState('')
  const [studyFilter, setStudyFilter] = useState<string>(location.state?.studyId ?? 'All')
  const [siteFilter, setSiteFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [visitFilter, setVisitFilter] = useState('All')
  const [showCreate, setShowCreate] = useState(false)

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      id: 'PT-NEW-0001',
      studyId: 'AIIA-AYU-001',
      siteId: 'SITE-001',
      siteName: 'AIIA Research Center, New Delhi',
      status: 'Enrolled',
      currentVisit: 'Baseline',
      gender: 'Female',
      ageGroup: '18-35',
      screeningDate: '2026-09-18',
      enrollmentDate: '2026-09-24',
      cohort: 'Cohort A',
    },
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setParticipants(participantService.getParticipants())
        setLoadState('ready')
      } catch {
        setLoadState('error')
      }
    }, 150)

    return () => window.clearTimeout(timer)
  }, [])

  const studyOptions = useMemo(() => Array.from(new Set(participants.map((participant) => participant.studyId))), [participants])
  const siteOptions = useMemo(() => Array.from(new Set(participants.map((participant) => participant.siteId))), [participants])

  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const matchesSearch = !search || `${participant.id} ${participant.studyId} ${participant.siteName}`.toLowerCase().includes(search.toLowerCase())
      const matchesStudy = studyFilter === 'All' || participant.studyId === studyFilter
      const matchesSite = siteFilter === 'All' || participant.siteId === siteFilter
      const matchesStatus = statusFilter === 'All' || participant.status === statusFilter
      const matchesVisit = visitFilter === 'All' || participant.visitStatus === visitFilter
      return matchesSearch && matchesStudy && matchesSite && matchesStatus && matchesVisit
    })
  }, [participants, search, studyFilter, siteFilter, statusFilter, visitFilter])

  const handleCreate = (values: ParticipantFormValues) => {
    const created = participantService.createParticipant({
      id: values.id,
      studyId: values.studyId,
      siteId: values.siteId,
      siteName: values.siteName,
      screeningDate: values.screeningDate,
      enrollmentDate: values.enrollmentDate,
      randomizationDate: values.status === 'Randomized' || values.status === 'Active' || values.status === 'Completed' ? values.enrollmentDate : undefined,
      currentVisit: values.currentVisit,
      visitStatus: 'Scheduled',
      protocolDeviations: 0,
      safetyEvents: 0,
      status: values.status,
      ageGroup: values.ageGroup,
      gender: values.gender,
      cohort: values.cohort,
      dataCompleteness: 94,
      timeline: [
        { label: 'Screening', date: values.screeningDate, complete: true },
        { label: 'Eligible', date: values.screeningDate, complete: true },
        { label: 'Enrolled', date: values.enrollmentDate ?? values.screeningDate, complete: true },
      ],
    })

    setParticipants((current) => [created, ...current])
    setShowCreate(false)
    form.reset()
  }

  const columns = useMemo<any[]>(
    () => [
      { accessorKey: 'id', header: 'Participant ID' },
      { accessorKey: 'studyId', header: 'Study' },
      { accessorKey: 'siteName', header: 'Site' },
      { accessorKey: 'screeningDate', header: 'Screening Date' },
      { accessorKey: 'enrollmentDate', header: 'Enrollment Date', cell: (info: any) => info.getValue() ?? '—' },
      { accessorKey: 'randomizationDate', header: 'Randomization', cell: (info: any) => info.getValue() ?? 'Pending' },
      { accessorKey: 'currentVisit', header: 'Current Visit' },
      { accessorKey: 'visitStatus', header: 'Visit Status', cell: (info: any) => <StatusBadge status={info.getValue() as any} /> },
      { accessorKey: 'protocolDeviations', header: 'Protocol Deviations' },
      { accessorKey: 'safetyEvents', header: 'Safety Events' },
      { accessorKey: 'status', header: 'Participant Status', cell: (info: any) => <StatusBadge status={info.getValue() as any} /> },
    ],
    [],
  )

  if (!canAccessModule(role, 'participants')) {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">Permission denied for participant operations in the current role.</div>
  }

  if (loadState === 'loading') return <LoadingState message="Loading participant roster..." />
  if (loadState === 'error') return <ErrorState title="Participant data unavailable" description="The operational roster could not be loaded." />

  return (
    <div>
      <PageHeader
        title="Participant Management"
        subtitle="Track participant screening, enrollment, randomization, visits and operational status across clinical studies."
        actions={<>
          <Button variant="outline" onClick={() => setShowCreate((prev) => !prev)}>Create participant</Button>
          <Button variant="outline" onClick={() => navigate('/participants')}>Refresh roster</Button>
        </>} 
      />

      {showCreate && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-800">Create a new participant</div>
          <form onSubmit={form.handleSubmit(handleCreate)} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <input {...form.register('id')} placeholder="Participant ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('studyId')} placeholder="Study ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('siteId')} placeholder="Site ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('siteName')} placeholder="Site name" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <select {...form.register('status')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Screened">Screened</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Randomized">Randomized</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
            <input {...form.register('currentVisit')} placeholder="Current visit" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('gender')} placeholder="Gender" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('ageGroup')} placeholder="Age group" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input type="date" {...form.register('screeningDate')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input type="date" {...form.register('enrollmentDate')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('cohort')} placeholder="Cohort" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <div className="md:col-span-2 xl:col-span-3 flex gap-2">
              <Button type="submit">Create participant</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Total Participants" value={String(participants.length)} subtitle="Synthetic roster" accent="blue" icon={<UserRoundCog className="h-4 w-4" />} />
        <KpiCard label="Screened" value={String(participants.filter((p) => p.status !== 'Withdrawn').length)} subtitle="released for review" accent="teal" icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Enrolled" value={String(participants.filter((p) => p.status === 'Enrolled' || p.status === 'Randomized' || p.status === 'Active' || p.status === 'Completed').length)} subtitle="operationally active" accent="slate" />
        <KpiCard label="Randomized" value={String(participants.filter((p) => p.status === 'Randomized' || p.status === 'Active' || p.status === 'Completed').length)} subtitle="treatment assigned" accent="amber" />
        <KpiCard label="Screening Failures" value={String(participants.filter((p) => p.status === 'Withdrawn').length)} subtitle="resolved exits" accent="red" />
        <KpiCard label="Active Participants" value={String(participants.filter((p) => p.status === 'Active').length)} subtitle="in active follow-up" accent="blue" />
      </div>

      <div className="mb-4 space-y-3">
        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search participant ID, study or site" />
          <select value={studyFilter} onChange={(e) => setStudyFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All studies</option>
            {studyOptions.map((study) => (
              <option key={study} value={study}>{study}</option>
            ))}
          </select>
          <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All sites</option>
            {siteOptions.map((site) => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All statuses</option>
            <option value="Screened">Screened</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Randomized">Randomized</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
          <select value={visitFilter} onChange={(e) => setVisitFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All visits</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
          </select>
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </FilterBar>
      </div>

      {studyFilter !== 'All' && (
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-600">Study: {studyFilter}</span>
          <button type="button" onClick={() => setStudyFilter('All')} className="text-xs text-primary">Clear</button>
        </div>
      )}

      {filteredParticipants.length === 0 ? (
        <EmptyState title="No participants match the current criteria" description="Adjust the filters or search to review the roster." />
      ) : (
        <DataTable
          data={filteredParticipants}
          columns={columns}
          filterText={search}
          onRowClick={(row) => navigate(`/participants/${row.id}`)}
        />
      )}
    </div>
  )
}
