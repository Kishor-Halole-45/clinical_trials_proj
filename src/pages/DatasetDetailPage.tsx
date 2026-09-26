import { ArrowLeft, Database, Link2, RefreshCcw, ShieldCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { Button } from '../components/ui/button'
import { getCdiscVariables, getDatasetById } from '../services/cdiscService'

export function DatasetDetailPage() {
  const navigate = useNavigate()
  const { datasetId } = useParams()
  const dataset = getDatasetById(datasetId ?? 'DS-001')
  const variables = getCdiscVariables(dataset.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate('/datasets')} aria-label="Back to datasets">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Dataset detail</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-slate-900">{dataset.datasetName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/data-mapping')}>View mapping</Button>
          <Button onClick={() => navigate('/validation')}>Run validation</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Records" value={String(dataset.records)} subtitle="Live extract" accent="blue" icon={<Database className="h-5 w-5" />} />
        <KpiCard label="Mapped" value={`${dataset.mappedVariables}/${dataset.variables}`} subtitle="Aligned" accent="teal" icon={<Link2 className="h-5 w-5" />} />
        <KpiCard label="Validation" value={dataset.validationStatus} subtitle="Current status" accent="amber" icon={<ShieldCheck className="h-5 w-5" />} />
        <KpiCard label="Last sync" value={dataset.lastUpdated} subtitle="Updated" accent="slate" icon={<RefreshCcw className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Variable mapping checklist</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{dataset.mappingStatus}</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              <div>Variable</div>
              <div>Source</div>
              <div>Target</div>
              <div>Status</div>
            </div>
            {variables.map((variable) => (
              <div key={variable.id} className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-3 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0">
                <div>
                  <div className="font-medium text-slate-900">{variable.variableName}</div>
                  <div className="text-xs text-slate-500">{variable.label}</div>
                </div>
                <div className="text-slate-600">{variable.sourceField}</div>
                <div className="text-slate-600">{variable.targetVariable}</div>
                <div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${variable.mappingStatus === 'Mapped' || variable.validationStatus === 'Validated' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {variable.mappingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">Dataset metadata</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-slate-500">Study</dt><dd className="font-medium text-slate-800">{dataset.studyId}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-500">Domain</dt><dd className="font-medium text-slate-800">{dataset.domain}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-500">Owner</dt><dd className="font-medium text-slate-800">{dataset.owner}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-500">Version</dt><dd className="font-medium text-slate-800">{dataset.version}</dd></div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">Narrative</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{dataset.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
