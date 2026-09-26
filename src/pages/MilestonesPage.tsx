import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { milestones } from '../data/milestones'

export function MilestonesPage() {
  return (
    <div>
      <PageHeader title="Milestones" subtitle="Critical clinical study milestones and schedule variance." />

      <div className="space-y-4">
        {milestones.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">{item.name}</div>
                <div className="mt-1 text-sm text-slate-500">{item.phase}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Planned date</div>
                <div className="mt-1 text-sm text-slate-800">{item.plannedDate}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Actual date</div>
                <div className="mt-1 text-sm text-slate-800">{item.actualDate ?? 'Pending'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Variance</div>
                <div className="mt-1 text-sm text-slate-800">{item.variance}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
