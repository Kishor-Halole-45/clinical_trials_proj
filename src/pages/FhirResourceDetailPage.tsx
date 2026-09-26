import { useMemo, useState } from 'react'
import { ArrowLeft, Copy, Eye, FileText } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function FhirResourceDetailPage() {
  const navigate = useNavigate()
  const { resourceId } = useParams()
  const resource = fhirService.getResourceById(resourceId ?? '')
  const [copied, setCopied] = useState(false)

  const jsonText = useMemo(() => resource ? JSON.stringify(resource.content, null, 2) : '', [resource])

  if (!resource) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        FHIR resource not found.
      </div>
    )
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div>
      <PageHeader
        title={resource.title}
        subtitle={`${resource.resourceType} · ${resource.id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/fhir/resources')}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button className="gap-2" onClick={handleCopy}><Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy JSON'}</Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</div><div className="mt-2 text-lg font-semibold text-slate-900">{resource.status}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Validation</div><div className="mt-2 text-lg font-semibold text-slate-900">{resource.validationStatus}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Exchange</div><div className="mt-2 text-lg font-semibold text-slate-900">{resource.exchangeStatus}</div></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><FileText className="h-4 w-4" /> Resource metadata</div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>Study: <span className="font-medium text-slate-900">{resource.studyId}</span></div>
                <div>Source: <span className="font-medium text-slate-900">{resource.sourceSystem}</span></div>
                <div>Profile: <span className="font-medium text-slate-900">{resource.profile}</span></div>
                <div>Version: <span className="font-medium text-slate-900">{resource.version}</span></div>
                <div>Last updated: <span className="font-medium text-slate-900">{resource.lastUpdated}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><Eye className="h-4 w-4" /> JSON payload</div>
              <pre className="max-h-[480px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">{jsonText}</pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 text-sm font-medium text-slate-800">Audit trail</div>
            <div className="space-y-3">
              {resource.auditTrail.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-800">{entry.action}</div>
                    <div className="text-[11px] text-slate-500">{entry.timestamp}</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">Actor: {entry.actor}</div>
                  {entry.summary && <div className="mt-1 text-xs text-slate-500">{entry.summary}</div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
