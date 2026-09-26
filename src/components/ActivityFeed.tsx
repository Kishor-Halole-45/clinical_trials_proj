import { ArrowUpRight } from 'lucide-react'

export function ActivityFeed({ items }: { items: { time: string; title: string; detail: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.title}-${item.time}`} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-800">{item.title}</div>
            <div className="text-xs text-slate-500">{item.detail}</div>
          </div>
          <div className="text-[11px] text-slate-400">{item.time}</div>
        </div>
      ))}
    </div>
  )
}
