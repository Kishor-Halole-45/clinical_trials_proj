import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { DataTable } from '../components/DataTable'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { RiskBadge } from '../components/RiskBadge'
import { StatusBadge } from '../components/StatusBadge'
import { SearchInput } from '../components/SearchInput'
import { FilterBar } from '../components/FilterBar'
import { Button } from '../components/ui/button'
import { sites } from '../data/sites'

export function SitesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const text = `${site.id} ${site.name} ${site.investigator} ${site.location}`.toLowerCase()
      const matchesSearch = !search || text.includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || site.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const columns = useMemo<ColumnDef<any, any>[]>(() => [
    { accessorKey: 'id', header: 'Site ID' },
    { accessorKey: 'name', header: 'Site' },
    { accessorKey: 'investigator', header: 'Investigator' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.row.original.status} /> },
    { accessorKey: 'target', header: 'Target' },
    { accessorKey: 'enrolled', header: 'Enrolled' },
    { accessorKey: 'enrollmentPercent', header: 'Enrollment %' },
    { accessorKey: 'lastMonitoring', header: 'Last Monitoring' },
    { accessorKey: 'nextMonitoring', header: 'Next Monitoring' },
    { accessorKey: 'risk', header: 'Risk', cell: (info) => <RiskBadge risk={info.row.original.risk} /> },
  ], [])

  return (
    <div>
      <PageHeader title="Sites" subtitle="Operational readiness across the clinical network." />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Sites" value="32" subtitle="22 recruiting" accent="blue" />
        <KpiCard label="Recruiting Sites" value="18" subtitle="4 sites onboarded" accent="teal" />
        <KpiCard label="Sites At Risk" value="7" subtitle="3 due this week" accent="amber" />
        <KpiCard label="Monitoring Due" value="9" subtitle="2 overdue" accent="red" />
      </div>

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search site" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Recruiting">Recruiting</option>
          <option value="At Risk">At Risk</option>
          <option value="Monitoring Due">Monitoring Due</option>
        </select>
        <Button variant="secondary">Export Sites</Button>
      </FilterBar>

      <div className="mt-5">
        <DataTable data={filteredSites} columns={columns} />
      </div>
    </div>
  )
}
