import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils'

export function KpiCard({
  label,
  value,
  subtitle,
  accent,
  clickable = false,
  icon,
  onClick,
}: {
  label: string
  value: string
  subtitle: string
  accent?: 'blue' | 'teal' | 'amber' | 'red' | 'slate'
  clickable?: boolean
  icon?: ReactNode
  onClick?: () => void
}) {
  const accentMap = {
    blue: 'bg-blue-50 text-blue-700',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-soft transition-all hover:-translate-y-[1px] hover:border-slate-300',
        clickable && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
      )}
      aria-label={label}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900 tabular-nums">{value}</div>
        </div>
        {icon && <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', accentMap[accent ?? 'slate'])}>{icon}</div>}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-emerald-600">
          {Number(subtitle.replace(/[^0-9-]/g, '')) >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {subtitle}
        </span>
      </div>
    </button>
  )
}
