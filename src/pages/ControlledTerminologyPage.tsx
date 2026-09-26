import { BookOpenCheck } from 'lucide-react'

import { getTerminology } from '../services/cdiscService'

export function ControlledTerminologyPage() {
  const terms = getTerminology()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Data standards</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Controlled terminology</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="grid grid-cols-[0.7fr_1.2fr_1.2fr_1fr_1fr_0.9fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          <div>Code</div>
          <div>Term</div>
          <div>Standard</div>
          <div>Used by</div>
          <div>Version</div>
          <div>Status</div>
        </div>
        {terms.map((term) => (
          <div key={`${term.code}-${term.standard}`} className="grid grid-cols-[0.7fr_1.2fr_1.2fr_1fr_1fr_0.9fr] gap-3 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0">
            <div className="font-medium text-slate-900">{term.code}</div>
            <div>
              <div className="font-medium text-slate-900">{term.term}</div>
              <div className="text-xs text-slate-500">{term.definition}</div>
            </div>
            <div className="text-slate-600">{term.standard}</div>
            <div className="text-slate-600">{term.usedBy}</div>
            <div className="text-slate-600">{term.version}</div>
            <div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${term.status === 'Configured' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {term.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 text-slate-800">
          <BookOpenCheck className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">Terminology governance</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Controlled terminology is anchored to whichever attribute set is approved for the study. Any mismatched term is automatically flagged for data manager review before export release.
        </p>
      </div>
    </div>
  )
}
