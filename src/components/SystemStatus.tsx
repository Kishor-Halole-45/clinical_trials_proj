import { Activity } from 'lucide-react'

export function SystemStatus({ status = 'Stable', message = 'All connected systems reporting normal' }: { status?: string; message?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
        <Activity className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">System status</div>
        <div className="text-sm font-medium text-slate-900">{status}</div>
        <div className="text-xs text-slate-500">{message}</div>
      </div>
    </div>
  )
}
