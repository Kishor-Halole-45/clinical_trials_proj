import { FileCheck2 } from 'lucide-react'

import { defineXmlMetadata, exportJobs } from '../data/cdisc'

export function DefineXmlPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Metadata</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Define-XML package</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Study</div>
          <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-900">{defineXmlMetadata.study}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Version</div>
          <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-900">{defineXmlMetadata.version}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Datasets</div>
          <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-900">{defineXmlMetadata.datasets.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Status</div>
          <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-900">{defineXmlMetadata.status}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Metadata inventory</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Datasets</span>
              <span className="font-medium text-slate-900">{defineXmlMetadata.datasets.join(', ')}</span>
            </div>
            <div className="flex items-start justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Code lists</span>
              <span className="font-medium text-slate-900">{defineXmlMetadata.codelists.join(', ')}</span>
            </div>
            <div className="flex items-start justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Methods</span>
              <span className="font-medium text-slate-900">{defineXmlMetadata.methods.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-slate-800">
            <FileCheck2 className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900">Export readiness</h2>
          </div>
          <div className="mt-4 space-y-3">
            {exportJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-900">{job.name}</div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${job.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : job.status === 'Generating' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {job.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">{job.type} · {job.size}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
