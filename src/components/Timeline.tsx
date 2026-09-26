type TimelineItem = {
  title: string
  subtitle?: string
  status: 'done' | 'active' | 'pending'
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.title} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`h-3.5 w-3.5 rounded-full border-2 ${
                item.status === 'done'
                  ? 'border-emerald-600 bg-emerald-500'
                  : item.status === 'active'
                    ? 'border-primary bg-primary/20'
                    : 'border-slate-300 bg-white'
              }`}
            />
            {items[items.length - 1].title !== item.title && <div className="mt-2 h-10 w-px bg-slate-200" />}
          </div>
          <div className="flex-1 pb-2">
            <div className="text-sm font-medium text-slate-800">{item.title}</div>
            {item.subtitle && <div className="text-xs text-slate-500">{item.subtitle}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
