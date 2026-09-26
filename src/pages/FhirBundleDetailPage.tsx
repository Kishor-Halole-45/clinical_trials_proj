import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, FileJson } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function FhirBundleDetailPage() {
  const navigate = useNavigate()
  const { bundleId } = useParams()
  const bundle = fhirService.getBundleById(bundleId ?? '')
  const resources = fhirService.getResources()
  const [lastLog, setLastLog] = useState(fhirService.getExchangeLogs()[0] ?? null)

  const bundleResources = useMemo(() => {
    if (!bundle) return []
    return bundle.resourceIds
      .map((resourceId) => resources.find((resource) => resource.id === resourceId))
      .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource))
  }, [bundle, resources])

  if (!bundle) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Bundle not found.</div>
  }

  const handleExchange = () => {
    const log = fhirService.simulateExchange(bundle.id, 'https://gateway.example.abdm.in/fhir/Bundle')
    if (log) setLastLog(log)
  }

  return (
    <div>
      <PageHeader
        title={bundle.label}
        subtitle={`${bundle.id} · ${bundle.studyId}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/fhir/bundles')}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button className="gap-2" onClick={handleExchange}><CheckCircle2 className="h-4 w-4" /> Send to gateway</Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Bundle type</div><div className="mt-2 text-lg font-semibold text-slate-900">{bundle.bundleType}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Resource count</div><div className="mt-2 text-lg font-semibold text-slate-900">{bundle.resourceCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</div><div className="mt-2 text-lg font-semibold text-slate-900">{bundle.status}</div></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><FileJson className="h-4 w-4" /> Members</div>
              <div className="space-y-3">
                {bundleResources.map((resource) => (
                  <div key={resource.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-slate-800">{resource.title}</div>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{resource.resourceType}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{resource.id}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-800">Exchange status</div>
                {lastLog && <div className="text-xs text-slate-500">{lastLog.status}</div>}
              </div>
              {lastLog ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <div className="font-medium">{lastLog.correlationId}</div>
                  <div className="mt-2">{lastLog.message}</div>
                  <div className="mt-2 text-xs text-emerald-700">{lastLog.endpoint} · {lastLog.method}</div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No exchange queued yet.</div>
              )}
              <Button className="mt-4 gap-2" onClick={() => navigate('/fhir/exchange')}>
                Open exchange simulator <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
