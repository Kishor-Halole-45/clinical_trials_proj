import { Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function ExchangeLogsPage() {
  const navigate = useNavigate()
  const logs = fhirService.getExchangeLogs()

  return (
    <div>
      <PageHeader
        title="Exchange logs"
        subtitle="History of synthetic outbound FHIR communications and ABDM dispatch events"
        actions={<Button variant="outline" onClick={() => navigate('/fhir/exchange')}>Open simulator</Button>}
      />

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><Activity className="h-4 w-4" /> Event stream</div>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{log.correlationId}</div>
                    <div className="mt-1 text-xs text-slate-500">{log.endpoint}</div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : log.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {log.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-600">{log.message}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{log.method}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
