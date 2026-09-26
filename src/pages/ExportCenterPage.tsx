import { Download, Gauge, PackageCheck } from 'lucide-react'

import { exportJobs } from '../data/cdisc'

export function ExportCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Submission readiness</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Export center</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Ready packages</span>
            <PackageCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-900">3</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">In progress</span>
            <Gauge className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-900">1</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Last submission</span>
            <Download className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-slate-900">2026-09-25</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Queue</h2>
        <div className="mt-4 space-y-3">
          {exportJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div>
                <div className="font-medium text-slate-900">{job.name}</div>
                <div className="text-xs text-slate-500">{job.owner} · {job.type}</div>
              </div>
              <div className="text-right">
                <div className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${job.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : job.status === 'Generating' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {job.status}
                </div>
                <div className="mt-1 text-xs text-slate-500">{job.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
