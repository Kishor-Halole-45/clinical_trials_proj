import { BookOpen, Code2, Fingerprint } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

const endpoints = [
  { method: 'GET', path: '/fhir/Patient/{id}', description: 'Retrieve patient resource with local CTMS identity mapping.', status: 'Ready' },
  { method: 'POST', path: '/fhir/Bundle', description: 'Transmit validated bundle to ABDM or local gateway broker.', status: 'Ready' },
  { method: 'GET', path: '/fhir/ResearchStudy/{studyId}', description: 'View protocol-level FHIR study metadata and status.', status: 'Ready' },
  { method: 'POST', path: '/fhir/Consent', description: 'Convert consent decisions to FHIR Consent resources.', status: 'In review' },
]

export function InteroperabilityApiPage() {
  return (
    <div>
      <PageHeader
        title="FHIR API catalog"
        subtitle="Synthetic REST surface for local interoperability workflows and downstream exchange" 
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><BookOpen className="h-4 w-4" /> Resource endpoints</div>
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">{endpoint.method}</span>
                        <div className="text-sm font-medium text-slate-900">{endpoint.path}</div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${endpoint.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {endpoint.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{endpoint.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><Code2 className="h-4 w-4" /> Example payload</div>
              <pre className="overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">{`{
  "resourceType": "Patient",
  "id": "FHIR-PT-10012",
  "identifier": [{ "system": "https://ctms.local/participant-id", "value": "PT-10012" }],
  "gender": "female"
}`}</pre>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Fingerprint className="h-4 w-4" /> Local identity mapping and code normalization are active.</div>
              <Button className="mt-4 w-full">Review specification</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
