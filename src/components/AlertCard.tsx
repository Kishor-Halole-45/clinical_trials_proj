import { AlertTriangle } from 'lucide-react'

import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'

export function AlertCard({ alert }: { alert: { severity: string; description: string; study: string; site: string; dueDate: string; owner: string; action: string } }) {
  const tone = {
    Critical: 'critical',
    High: 'warning',
    Medium: 'info',
    Low: 'neutral',
  }[alert.severity] as 'critical' | 'warning' | 'info' | 'neutral'

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <Badge variant={tone}>{alert.severity}</Badge>
        </div>
        <div className="mt-3 text-base font-semibold text-slate-900">{alert.description}</div>
        <div className="mt-2 text-sm text-slate-500">{alert.study} • {alert.site}</div>
        <div className="mt-3 text-xs text-slate-500">Due: {alert.dueDate} • Owner: {alert.owner}</div>
        <div className="mt-3 rounded-md bg-slate-50 p-2 text-xs text-slate-700">Action: {alert.action}</div>
      </CardContent>
    </Card>
  )
}
