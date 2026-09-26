import { ArrowRight, FileJson, PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { studies } from '../data/studies'
import { fhirService } from '../services/fhirService'

export function FhirBundlesPage() {
  const navigate = useNavigate()
  const bundles = fhirService.getBundles()
  const resources = fhirService.getResources()
  const [selectedStudy, setSelectedStudy] = useState(studies[0].id)
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>(['FHIR-PT-10012', 'FHIR-OBS-10012', 'FHIR-CONSENT-10012'])

  const studyResources = useMemo(
    () => resources.filter((resource) => resource.studyId === selectedStudy).slice(0, 5),
    [resources, selectedStudy],
  )

  const handleToggleResource = (resourceId: string) => {
    setSelectedResourceIds((current) => current.includes(resourceId) ? current.filter((id) => id !== resourceId) : [...current, resourceId])
  }

  const handleCreateBundle = () => {
    const bundle = fhirService.createBundle(selectedStudy, `Bundle ${selectedStudy}`, selectedResourceIds)
    navigate(`/fhir/bundles/${bundle.id}`)
  }

  return (
    <div>
      <PageHeader
        title="FHIR bundle builder"
        subtitle="Create exchangeable collections from participant, study, and consent resources"
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><PlusCircle className="h-4 w-4" /> Generate bundle</div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Study</label>
                  <select value={selectedStudy} onChange={(e) => setSelectedStudy(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary">
                    {studies.map((study) => (
                      <option key={study.id} value={study.id}>{study.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Resource selection</div>
                  <div className="space-y-2">
                    {studyResources.map((resource) => (
                      <label key={resource.id} className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <span>{resource.title}</span>
                        <input type="checkbox" checked={selectedResourceIds.includes(resource.id)} onChange={() => handleToggleResource(resource.id)} className="h-4 w-4" />
                      </label>
                    ))}
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={handleCreateBundle}><FileJson className="h-4 w-4" /> Create bundle</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 text-sm font-medium text-slate-800">Bundle queue</div>
              <div className="space-y-3">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{bundle.label}</div>
                        <div className="mt-1 text-xs text-slate-500">{bundle.id} · {bundle.studyId}</div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${bundle.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : bundle.status === 'Ready' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {bundle.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                      <span>{bundle.resourceCount} resources</span>
                      <button type="button" onClick={() => navigate(`/fhir/bundles/${bundle.id}`)} className="inline-flex items-center gap-2 font-medium text-primary">
                        Open bundle <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
