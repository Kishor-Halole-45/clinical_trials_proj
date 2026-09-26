import { Activity, ArrowRight, CheckCircle2, Database, FileCheck2, Gauge, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { getActivities, getCdiscSummary, getDatasets, getValidationSummary } from '../services/cdiscService'

export function CdiscPage() {
  const navigate = useNavigate()
  const summary = getCdiscSummary()
  const validationSummary = getValidationSummary()
  const datasets = getDatasets()

  const kpis = [
    { label: 'Study datasets', value: `${summary.totalDatasets}`, subtitle: '+2 this cycle', accent: 'blue', icon: <Database className="h-5 w-5" /> },
    { label: 'Mapped datasets', value: `${summary.mapped}/${summary.totalDatasets}`, subtitle: '83% complete', accent: 'teal', icon: <FileCheck2 className="h-5 w-5" /> },
    { label: 'Open findings', value: `${summary.openFindings}`, subtitle: '-3 resolved', accent: 'amber', icon: <Gauge className="h-5 w-5" /> },
    { label: 'Exports ready', value: `${summary.readyExports}`, subtitle: '2 queued', accent: 'slate', icon: <CheckCircle2 className="h-5 w-5" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Clinical Data Standards Center</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">CDISC lifecycle overview</h1>
        </div>
        <button type="button" onClick={() => navigate('/datasets')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-soft">
          Open dataset explorer
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} subtitle={item.subtitle} accent={item.accent as 'blue' | 'teal' | 'amber' | 'slate'} icon={item.icon} clickable onClick={() => navigate('/datasets')} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Standards pipeline</h2>
              <p className="text-sm text-slate-500">Source data → CDASH → mapping → SDTM → ADaM → Define-XML → validation.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <RefreshCw className="h-3.5 w-3.5" />
              Sync complete
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'CDASH', detail: '4 forms aligned', tone: 'bg-blue-50 text-blue-700', route: '/datasets' },
              { title: 'SDTM', detail: '5 domains active', tone: 'bg-violet-50 text-violet-700', route: '/datasets' },
              { title: 'ADaM', detail: '3 analysis datasets', tone: 'bg-amber-50 text-amber-700', route: '/data-mapping' },
              { title: 'Define-XML', detail: 'Ready for review', tone: 'bg-emerald-50 text-emerald-700', route: '/define-xml' },
            ].map((card) => (
              <button key={card.title} type="button" onClick={() => navigate(card.route)} className={`${card.tone} rounded-2xl border border-slate-200 p-4 text-left shadow-soft transition hover:-translate-y-[1px]`}>
                <div className="text-xs font-semibold uppercase tracking-[0.18em]">{card.title}</div>
                <div className="mt-2 text-sm font-medium">{card.detail}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Quality metrics</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: 'Critical', value: validationSummary.critical, tone: 'bg-red-100 text-red-700' },
              { label: 'High', value: validationSummary.high, tone: 'bg-amber-100 text-amber-700' },
              { label: 'Medium', value: validationSummary.medium, tone: 'bg-blue-100 text-blue-700' },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">{metric.label}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${metric.tone}`}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Dataset readiness</h2>
            <button type="button" onClick={() => navigate('/datasets')} className="text-sm font-medium text-primary">View all</button>
          </div>
          <div className="space-y-4">
            {datasets.map((dataset) => (
              <button key={dataset.id} type="button" onClick={() => navigate(`/datasets/${dataset.id}`)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-slate-300">
                <div>
                  <div className="font-medium text-slate-900">{dataset.datasetName}</div>
                  <div className="text-xs text-slate-500">{dataset.status} · {dataset.lastUpdated}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.15em] text-slate-500">records</div>
                  <div className="text-lg font-semibold text-slate-900">{dataset.records}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            {getActivities().map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-sm font-medium text-slate-800">{entry.action}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{entry.actor}</span>
                  <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
