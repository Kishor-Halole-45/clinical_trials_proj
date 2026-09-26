import { Database, Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { getDatasets } from '../services/cdiscService'

export function DatasetsPage() {
  const navigate = useNavigate()
  const [standardFilter, setStandardFilter] = useState<'All' | 'CDASH' | 'SDTM' | 'ADaM'>('All')
  const [search, setSearch] = useState('')

  const datasets = useMemo(() => {
    const filtered = standardFilter === 'All' ? getDatasets() : getDatasets(standardFilter)
    return filtered.filter((dataset) => dataset.datasetName.toLowerCase().includes(search.toLowerCase()) || dataset.domain.toLowerCase().includes(search.toLowerCase()))
  }, [search, standardFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Data standards</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Dataset explorer</h1>
        </div>
        <Button onClick={() => navigate('/data-mapping')} variant="outline">Open mapping workspace</Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search datasets or domains" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-primary/40 focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            {(['All', 'CDASH', 'SDTM', 'ADaM'] as const).map((filter) => (
              <button key={filter} type="button" onClick={() => setStandardFilter(filter)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${standardFilter === filter ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          <div>Dataset</div>
          <div>Standard</div>
          <div>Records</div>
          <div>Mapped</div>
          <div>Status</div>
        </div>
        {datasets.map((dataset) => (
          <button key={dataset.id} type="button" onClick={() => navigate(`/datasets/${dataset.id}`)} className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-slate-200 px-4 py-4 text-left hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-slate-900">{dataset.datasetName}</div>
                <div className="text-xs text-slate-500">{dataset.domain}</div>
              </div>
            </div>
            <div className="text-sm text-slate-600">{dataset.standard}</div>
            <div className="text-sm font-medium text-slate-900">{dataset.records}</div>
            <div className="text-sm text-slate-700">{dataset.mappedVariables}/{dataset.variables}</div>
            <div>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${dataset.status === 'Ready for Export' || dataset.status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : dataset.status === 'Under Review' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                {dataset.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
