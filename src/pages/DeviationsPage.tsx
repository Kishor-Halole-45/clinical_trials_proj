import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Filter, ShieldAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

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
import { deviationService } from '../services/deviationService'
import { useAppStore } from '../store/useAppStore'
import type { ProtocolDeviation } from '../types'
import { canAccessModule } from '../lib/permissions'

const deviationSchema = z.object({
  studyId: z.string().min(1),
  siteId: z.string().min(1),
  participantId: z.string().min(1),
  category: z.string().min(1),
  severity: z.enum(['Minor', 'Major', 'Critical']),
  description: z.string().min(10),
  owner: z.string().min(1),
})

type DeviationFormValues = z.infer<typeof deviationSchema>

export function DeviationsPage() {
  const navigate = useNavigate()
  const role = useAppStore((state) => state.role)
  const [deviations, setDeviations] = useState<ProtocolDeviation[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [search, setSearch] = useState('')
  const [studyFilter, setStudyFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCreate, setShowCreate] = useState(false)

  const form = useForm<DeviationFormValues>({
    resolver: zodResolver(deviationSchema),
    defaultValues: {
      studyId: 'AIIA-AYU-001',
      siteId: 'SITE-001',
      participantId: 'PT-A001-0001',
      category: 'Eligibility',
      severity: 'Major',
      description: '',
      owner: 'A. Pillai',
    },
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setDeviations(deviationService.getDeviations())
        setLoadState('ready')
      } catch {
        setLoadState('error')
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [])

  const filteredDeviations = useMemo(() => {
    return deviations.filter((deviation) => {
      const matchesSearch = !search || `${deviation.id} ${deviation.studyId} ${deviation.siteId} ${deviation.participantId}`.toLowerCase().includes(search.toLowerCase())
      const matchesStudy = studyFilter === 'All' || deviation.studyId === studyFilter
      const matchesSeverity = severityFilter === 'All' || deviation.severity === severityFilter
      const matchesStatus = statusFilter === 'All' || deviation.status === statusFilter
      return matchesSearch && matchesStudy && matchesSeverity && matchesStatus
    })
  }, [deviations, search, studyFilter, severityFilter, statusFilter])

  if (!canAccessModule(role, 'deviations')) {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">Permission denied for deviation review in the current role.</div>
  }

  if (loadState === 'loading') return <LoadingState message="Loading protocol deviations..." />
  if (loadState === 'error') return <ErrorState title="Deviation records unavailable" description="The deviation ledger could not be loaded." />

  const studyOptions = Array.from(new Set(deviations.map((deviation) => deviation.studyId)))

  const handleCreate = (values: DeviationFormValues) => {
    const created = deviationService.createDeviation({
      studyId: values.studyId,
      siteId: values.siteId,
      participantId: values.participantId,
      category: values.category as any,
      severity: values.severity,
      detectedDate: new Date().toISOString().slice(0, 10),
      description: values.description,
      capaRequired: true,
      owner: values.owner,
      status: 'Open',
      rootCause: 'Operational review identified a protocol gap requiring focused follow-up.',
      correctiveAction: 'Immediate remedial action and site review.',
      preventiveAction: 'Process reinforcement and monitoring follow-up.',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
    })
    if (created) {
      setDeviations((current) => [created, ...current])
      setShowCreate(false)
      form.reset()
    }
  }

  return (
    <div>
      <PageHeader
        title="Protocol Deviations"
        subtitle="Track, assess and resolve deviations across studies and sites."
        actions={<Button variant="outline" onClick={() => setShowCreate((prev) => !prev)}>New deviation</Button>}
      />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Open" value={String(deviations.filter((d) => d.status === 'Open').length)} subtitle="requires review" accent="blue" icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Critical" value={String(deviations.filter((d) => d.severity === 'Critical').length)} subtitle="high risk" accent="red" icon={<ShieldAlert className="h-4 w-4" />} />
        <KpiCard label="Under Review" value={String(deviations.filter((d) => d.status === 'Under Review').length)} subtitle="triage in progress" accent="amber" />
        <KpiCard label="CAPA Required" value={String(deviations.filter((d) => d.capaRequired).length)} subtitle="risk mitigation" accent="slate" />
        <KpiCard label="Resolved" value={String(deviations.filter((d) => d.status === 'Resolved').length)} subtitle="recent closure" accent="teal" />
        <KpiCard label="Closed" value={String(deviations.filter((d) => d.status === 'Closed').length)} subtitle="approved closeout" accent="blue" />
      </div>

      {showCreate && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-800">Create a new deviation record</div>
          <form onSubmit={form.handleSubmit(handleCreate)} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <input {...form.register('studyId')} placeholder="Study ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('siteId')} placeholder="Site ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('participantId')} placeholder="Participant ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <select {...form.register('category')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              {['Eligibility', 'Informed Consent', 'Visit Window', 'Investigational Product', 'Protocol Procedure', 'Safety Reporting', 'Data Entry', 'Randomization', 'Other'].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select {...form.register('severity')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
            <input {...form.register('owner')} placeholder="Owner" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <textarea {...form.register('description')} placeholder="Deviation description" className="md:col-span-2 xl:col-span-3 min-h-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <div className="md:col-span-2 xl:col-span-3 flex gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 space-y-3">
        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search deviation, study or site" />
          <select value={studyFilter} onChange={(e) => setStudyFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All studies</option>
            {studyOptions.map((study) => <option key={study} value={study}>{study}</option>)}
          </select>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All severities</option>
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
            <option value="Critical">Critical</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="CAPA Required">CAPA Required</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <Button variant="secondary" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
        </FilterBar>
      </div>

      {filteredDeviations.length === 0 ? (
        <EmptyState title="No deviations match the filters" description="Broaden the filters for a more complete review." />
      ) : (
        <DataTable
          data={filteredDeviations}
          columns={[
            { accessorKey: 'id', header: 'Deviation ID' },
            { accessorKey: 'studyId', header: 'Study' },
            { accessorKey: 'siteId', header: 'Site' },
            { accessorKey: 'participantId', header: 'Participant' },
            { accessorKey: 'category', header: 'Category' },
            { accessorKey: 'severity', header: 'Severity' },
            { accessorKey: 'detectedDate', header: 'Detected Date' },
            { accessorKey: 'description', header: 'Description', cell: (info: any) => <span className="line-clamp-2">{String(info.getValue())}</span> },
            { accessorKey: 'status', header: 'Status', cell: (info: any) => <StatusBadge status={info.getValue() as any} /> },
            { accessorKey: 'owner', header: 'Owner' },
          ]}
          filterText={search}
          onRowClick={(row) => navigate(`/deviations/${row.id}`)}
        />
      )}
    </div>
  )
}
