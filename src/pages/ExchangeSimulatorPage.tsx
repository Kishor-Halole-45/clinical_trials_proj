import { ArrowRight, DatabaseZap, Send } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function ExchangeSimulatorPage() {
  const bundles = fhirService.getBundles()
  const [bundleId, setBundleId] = useState(bundles[0]?.id ?? '')
  const [method, setMethod] = useState<'POST' | 'PUT' | 'PATCH'>('POST')
  const [endpoint, setEndpoint] = useState('https://gateway.example.abdm.in/fhir/Bundle')
  const [log, setLog] = useState(fhirService.getExchangeLogs()[0] ?? null)

  const handleSubmit = () => {
    const result = fhirService.simulateExchange(bundleId, endpoint, method)
    if (result) setLog(result)
  }

  return (
    <div>
      <PageHeader
        title="Exchange simulator"
        subtitle="Synthetic gateway dispatch for local FHIR bundle transmission"
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><DatabaseZap className="h-4 w-4" /> Dispatch request</div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-500">Bundle</label>
                  <select value={bundleId} onChange={(e) => setBundleId(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary">
                    {bundles.map((bundle) => (
                      <option key={bundle.id} value={bundle.id}>{bundle.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-500">Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value as 'POST' | 'PUT' | 'PATCH')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary">
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-500">Endpoint</label>
                  <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                </div>
                <Button className="w-full gap-2" onClick={handleSubmit}><Send className="h-4 w-4" /> Dispatch bundle</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-800">Gateway response</div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
              {log ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <div className="font-medium">{log.status} · {log.correlationId}</div>
                  <div className="mt-2">{log.message}</div>
                  <div className="mt-2 text-xs text-emerald-700">{log.endpoint} · {log.method}</div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No exchange logs yet.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
