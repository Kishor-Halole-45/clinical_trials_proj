import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Filter } from 'lucide-react'

import { DataTable } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { RiskBadge } from '../components/RiskBadge'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { studies } from '../data/studies'
import { SearchInput } from '../components/SearchInput'
import { FilterBar } from '../components/FilterBar'

export function ClinicalTrialsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      const matchesSearch = !search || `${study.id} ${study.title} ${study.principalInvestigator}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || study.status === statusFilter
      const matchesRisk = riskFilter === 'All' || study.risk === riskFilter
      return matchesSearch && matchesStatus && matchesRisk
    })
  }, [search, statusFilter, riskFilter])

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      { accessorKey: 'id', header: 'Study ID' },
      { accessorKey: 'title', header: 'Study', cell: (info) => <span className="font-medium text-slate-800">{info.row.original.title}</span> },
      { accessorKey: 'type', header: 'Type' },
      { accessorKey: 'principalInvestigator', header: 'PI' },
      { accessorKey: 'sites', header: 'Sites' },
      { accessorKey: 'currentEnrollment', header: 'Enrollment' },
      { accessorKey: 'progress', header: 'Progress', cell: (info) => `${info.row.original.progress}%` },
      { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.row.original.status} /> },
      { accessorKey: 'risk', header: 'Risk', cell: (info) => <RiskBadge risk={info.row.original.risk} /> },
      { accessorKey: 'nextMilestone', header: 'Next Milestone' },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Clinical Trials"
        subtitle="Portfolio oversight across active, recruiting and at-risk studies."
        actions={<Button variant="outline">Export Portfolio</Button>}
      />

      <div className="mb-4 space-y-3">
        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search study or investigator" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All statuses</option>
            <option value="Recruiting">Recruiting</option>
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
            <option value="Ethics Pending">Ethics Pending</option>
          </select>
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="All">All risk levels</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </FilterBar>
      </div>

      <DataTable
        data={filteredStudies}
        columns={columns}
        filterText={search}
        onRowClick={(row) => navigate(`/trials/${row.id}`)}
      />
    </div>
  )
}
