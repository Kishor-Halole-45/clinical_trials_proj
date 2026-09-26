import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ChartCard } from '../components/ChartCard'
import { EmptyState } from '../components/EmptyState'
import { FilterBar } from '../components/FilterBar'
import { KpiCard } from '../components/KpiCard'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { SearchInput } from '../components/SearchInput'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { queryService } from '../services/queryService'
import { useAppStore } from '../store/useAppStore'
import { qualityMetrics } from '../data/phase2'
import type { DataQuery } from '../types'
import { canAccessModule } from '../lib/permissions'

const responseSchema = z.object({
  response: z.string().min(5, 'Please enter a clinical response to the query.'),
})

type ResponseFormValues = z.infer<typeof responseSchema>

export function DataQualityPage() {
  const role = useAppStore((state) => state.role)
  const [queries, setQueries] = useState<DataQuery[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedQuery, setSelectedQuery] = useState<DataQuery | null>(null)

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: { response: selectedQuery?.response ?? '' },
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setQueries(queryService.getQueries())
        setLoadState('ready')
      } catch {
        setLoadState('error')
      }
    }, 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => { if (selectedQuery) form.reset({ response: selectedQuery.response ?? '' }) }, [selectedQuery, form])

  const filteredQueries = useMemo(() => queries.filter((query) => {
    const matchesSearch = !search || `${query.id} ${query.studyId} ${query.siteId} ${query.dataPoint} ${query.participantId}`.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === 'All' || query.severity === severityFilter
    const matchesStatus = statusFilter === 'All' || query.status === statusFilter
    return matchesSearch && matchesSeverity && matchesStatus
  }), [queries, search, severityFilter, statusFilter])

  if (!canAccessModule(role, 'data-quality')) {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">Permission denied for data quality review in the current role.</div>
  }

  if (loadState === 'loading') return <LoadingState message="Loading data quality metrics..." />
  if (loadState === 'error') return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Data quality records unavailable.</div>

  const queryChartData = [
    { name: 'Jan', open: 27, resolved: 18 },
    { name: 'Feb', open: 31, resolved: 19 },
    { name: 'Mar', open: 29, resolved: 21 },
    { name: 'Apr', open: 26, resolved: 24 },
    { name: 'May', open: 23, resolved: 28 },
    { name: 'Jun', open: 24, resolved: 30 },
  ]

  const siteQueryBreakdown = [
    { name: 'SITE-001', value: 14 },
    { name: 'SITE-004', value: 19 },
    { name: 'SITE-005', value: 13 },
    { name: 'SITE-010', value: 10 },
    { name: 'SITE-012', value: 8 },
  ]

  const pieData = [
    { name: 'Open', value: queries.filter((q) => q.status === 'Open').length },
    { name: 'Resolved', value: queries.filter((q) => q.status === 'Resolved').length },
    { name: 'Assigned', value: queries.filter((q) => q.status === 'Assigned').length },
  ]

  const overallScore = 94.7

  const handleResolve = (values: ResponseFormValues) => {
    if (!selectedQuery) return
    const resolved = queryService.resolveQuery(selectedQuery.id, values.response)
    if (resolved) {
      setQueries((current) => current.map((query) => query.id === resolved.id ? resolved : query))
      setSelectedQuery(resolved)
    }
  }

  return (
    <div>
      <PageHeader
        title="Data Quality Center"
        subtitle="Monitor clinical data completeness, queries, validation issues and data integrity."
      />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <KpiCard label="Data Quality Score" value={`${overallScore}%`} subtitle="Excellent" accent="teal" />
        <KpiCard label="Open Queries" value={String(queries.filter((q) => q.status === 'Open').length)} subtitle="review required" accent="amber" />
        <KpiCard label="Critical Queries" value={String(queries.filter((q) => q.severity === 'Critical').length)} subtitle="escalated" accent="red" />
        <KpiCard label="Overdue Queries" value={String(queries.filter((q) => q.status !== 'Resolved' && q.status !== 'Closed').length)} subtitle="due soon" accent="slate" />
        <KpiCard label="Missing Data" value="5.8%" subtitle="across studies" accent="blue" />
        <KpiCard label="Validation Errors" value="23" subtitle="this month" accent="amber" />
        <KpiCard label="Resolved This Month" value="72" subtitle="strong closure" accent="teal" />
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 text-sm font-semibold text-slate-800">Overall quality score</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {qualityMetrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-slate-700">{metric.label}</span><span className="text-slate-900">{metric.value}%</span></div>
              <ProgressBar value={metric.value} tone={metric.tone} />
              <div className="mt-2 text-xs text-slate-500">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <ChartCard title="Queries over time" subtitle="Open vs resolved">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="open" fill="#0F172A" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="resolved" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-6">
          <ChartCard title="Open vs resolved queries" subtitle="Operational balance">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {pieData.map((entry, index) => <Cell key={entry.name} fill={['#0F172A', '#10B981', '#F59E0B'][index % 3]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <ChartCard title="Queries by site" subtitle="Operational burden distribution">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={siteQueryBreakdown} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0EA5E9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-4">
          <ChartCard title="Query detail" subtitle="Current selection">
            {selectedQuery ? (
              <div className="space-y-3 text-sm text-slate-600">
                <div><span className="font-medium text-slate-800">{selectedQuery.id}</span></div>
                <div>Study: {selectedQuery.studyId}</div>
                <div>Site: {selectedQuery.siteId}</div>
                <div>Participant: {selectedQuery.participantId}</div>
                <div>Status: <StatusBadge status={selectedQuery.status as any} /></div>
              </div>
            ) : (
              <EmptyState title="Select a query" description="Choose a row from the table to review details." />
            )}
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 mb-4 space-y-3">
        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search query, participant or site" />
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Responded">Responded</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </FilterBar>
      </div>

      {filteredQueries.length === 0 ? (
        <EmptyState title="No queries match the filters" description="Change the query filters to view more records." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Query ID</th>
                  <th className="px-4 py-3 font-semibold">Study</th>
                  <th className="px-4 py-3 font-semibold">Site</th>
                  <th className="px-4 py-3 font-semibold">Participant</th>
                  <th className="px-4 py-3 font-semibold">Issue</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => (
                  <tr key={query.id} className="cursor-pointer border-t border-slate-200 hover:bg-slate-50" onClick={() => setSelectedQuery(query)}>
                    <td className="px-4 py-3 text-slate-800">{query.id}</td>
                    <td className="px-4 py-3">{query.studyId}</td>
                    <td className="px-4 py-3">{query.siteId}</td>
                    <td className="px-4 py-3">{query.participantId}</td>
                    <td className="px-4 py-3">{query.dataPoint}</td>
                    <td className="px-4 py-3"><StatusBadge status={query.severity as any} /></td>
                    <td className="px-4 py-3"><StatusBadge status={query.status as any} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {selectedQuery ? (
              <div>
                <div className="mb-3 text-sm font-semibold text-slate-800">Query resolution</div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div><span className="font-medium text-slate-800">Issue:</span> {selectedQuery.issue}</div>
                  <div><span className="font-medium text-slate-800">Owner:</span> {selectedQuery.owner}</div>
                  <div><span className="font-medium text-slate-800">Due date:</span> {selectedQuery.dueDate}</div>
                </div>
                <form onSubmit={form.handleSubmit(handleResolve)} className="mt-4 space-y-3">
                  <textarea {...form.register('response')} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" placeholder="Respond to the query" />
                  {form.formState.errors.response && <div className="text-xs text-red-600">{form.formState.errors.response.message}</div>}
                  <div className="flex gap-2">
                    <Button type="submit">Resolve query</Button>
                    <Button type="button" variant="secondary" onClick={() => setSelectedQuery(null)}>Close</Button>
                  </div>
                </form>
              </div>
            ) : (
              <EmptyState title="No query selected" description="Select a row to inspect and resolve the issue." />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
