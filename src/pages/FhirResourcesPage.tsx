import { ArrowRight, Database, FolderOpen, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

const statusClasses: Record<string, string> = {
  Validated: 'bg-emerald-100 text-emerald-700',
  Synced: 'bg-emerald-100 text-emerald-700',
  'Needs Review': 'bg-amber-100 text-amber-700',
  Ready: 'bg-blue-100 text-blue-700',
  Queued: 'bg-slate-200 text-slate-700',
  Active: 'bg-cyan-100 text-cyan-700',
}

export function FhirResourcesPage() {
  const navigate = useNavigate()
  const resources = fhirService.getResources()

  return (
    <div>
      <PageHeader
        title="FHIR resource library"
        subtitle="Patient, study, consent and clinical resources created from the CTMS source data model"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/fhir/mapping')}><Search className="h-4 w-4" /> Mapping</Button>
            <Button onClick={() => navigate('/fhir/validation')}>Validation center</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-800">{resource.resourceType}</span>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${statusClasses[resource.validationStatus] ?? statusClasses[resource.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {resource.validationStatus}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900">{resource.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{resource.id}</div>
                  </div>
                  <FolderOpen className="h-4 w-4 text-slate-400" />
                </div>

                <div className="grid gap-2 text-sm text-slate-600">
                  <div>Study: <span className="font-medium text-slate-800">{resource.studyId}</span></div>
                  <div>Source: <span className="font-medium text-slate-800">{resource.sourceSystem}</span></div>
                  <div>Last update: <span className="font-medium text-slate-800">{resource.lastUpdated}</span></div>
                </div>

                <Button variant="outline" className="w-full gap-2" onClick={() => navigate(`/fhir/resources/${resource.id}`)}>
                  Open resource <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
