import { Card, CardContent } from './ui/card'

export function MetricCard({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</div>
        <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900 tabular-nums">{value}</div>
        <div className="mt-2 text-xs text-slate-500">{meta}</div>
      </CardContent>
    </Card>
  )
}
