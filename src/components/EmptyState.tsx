import { Inbox } from 'lucide-react'

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Inbox className="h-4 w-4" />
      </div>
      <div className="text-base font-medium text-slate-800">{title}</div>
      {description && <div className="mt-1 max-w-md text-sm text-slate-500">{description}</div>}
    </div>
  )
}
