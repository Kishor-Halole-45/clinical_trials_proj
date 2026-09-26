import { GitBranch, PencilLine, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { getMappings } from '../services/cdiscService'

export function DataMappingPage() {
  const navigate = useNavigate()
  const mappings = getMappings()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Data standards</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Data mapping workspace</h1>
        </div>
        <Button onClick={() => navigate('/datasets')} variant="outline">Back to dataset list</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Approved mappings</span>
            <GitBranch className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-slate-900">12</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Pending review</span>
            <RefreshCcw className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-slate-900">3</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Draft rules</span>
            <PencilLine className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-slate-900">5</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1.1fr_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          <div>Source variable</div>
          <div>Target</div>
          <div>Type</div>
          <div>Rule</div>
          <div>Status</div>
        </div>
        {mappings.map((mapping) => (
          <div key={mapping.id} className="grid grid-cols-[1.2fr_1fr_1fr_1.1fr_1fr] gap-3 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0">
            <div>
              <div className="font-medium text-slate-900">{mapping.sourceDataset}.{mapping.sourceVariable}</div>
              <div className="text-xs text-slate-500">{mapping.description}</div>
            </div>
            <div className="text-slate-700">{mapping.targetDomain}.{mapping.targetVariable}</div>
            <div className="text-slate-700">{mapping.mappingType}</div>
            <div className="text-slate-600">{mapping.transformationRule}</div>
            <div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${mapping.status === 'Validated' ? 'bg-emerald-50 text-emerald-700' : mapping.status === 'Needs Review' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                {mapping.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
