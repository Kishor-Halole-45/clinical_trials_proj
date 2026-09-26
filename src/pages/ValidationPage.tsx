import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import { getValidationSummary } from '../services/cdiscService'
import { validationFindings } from '../data/cdisc'

export function ValidationPage() {
  const summary = getValidationSummary()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Clinical data review</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Validation center</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Total findings</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">{summary.total}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Critical</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-red-600">{summary.critical}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">High</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-amber-600">{summary.high}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Resolved</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-emerald-600">{validationFindings.filter((item) => item.status === 'Resolved').length}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.3fr_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          <div>Dataset</div>
          <div>Rule</div>
          <div>Severity</div>
          <div>Description</div>
          <div>Status</div>
        </div>
        {validationFindings.map((finding) => (
          <div key={finding.id} className="grid grid-cols-[1fr_1fr_1fr_1.3fr_1fr] gap-3 border-b border-slate-200 px-4 py-4 text-sm last:border-b-0">
            <div>
              <div className="font-medium text-slate-900">{finding.dataset}</div>
              <div className="text-xs text-slate-500">{finding.variable}</div>
            </div>
            <div className="text-slate-700">{finding.rule}</div>
            <div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${finding.severity === 'Critical' ? 'bg-red-50 text-red-700' : finding.severity === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                {finding.severity}
              </span>
            </div>
            <div className="text-slate-600">{finding.description}</div>
            <div className="flex items-center gap-2 text-slate-700">
              {finding.status === 'Open' ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {finding.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
