import { Activity, ArrowRight, CheckCheck, Database, ShieldCheck, Workflow } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function InteroperabilityPage() {
  const navigate = useNavigate()
  const resources = fhirService.getResources()
  const bundles = fhirService.getBundles()
  const findings = fhirService.getValidationFindings()
  const readiness = fhirService.getABDMReadiness()

  const workflow = [
    { label: 'Patient mapping', description: 'Participant to FHIR Patient readiness', path: '/fhir/resources' },
    { label: 'Data transformation', description: 'Study and consent mapping', path: '/fhir/mapping' },
    { label: 'Validation', description: 'FHIR rule checks and exceptions', path: '/fhir/validation' },
    { label: 'Exchange', description: 'Bundle assembly and gateway simulation', path: '/fhir/bundles' },
  ]

  return (
    <div>
      <PageHeader
        title="FHIR R4 + ABDM interoperability"
        subtitle="Synthetic, de-identified exchange workflows for clinical operations and patient data readiness"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/fhir/resources')}>Open resource library</Button>
            <Button onClick={() => navigate('/abdm')}>ABDM readiness</Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="FHIR resources" value={String(resources.length)} subtitle="Active resource coverage" accent="blue" icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Ready bundles" value={String(bundles.filter((bundle) => bundle.status === 'Ready' || bundle.status === 'Delivered').length)} subtitle="Exchangeable payloads" accent="teal" icon={<CheckCheck className="h-4 w-4" />} />
        <KpiCard label="Validation findings" value={String(findings.length)} subtitle="Pending remediation" accent="amber" icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Patient match" value={`${readiness.patientMatchRate}%`} subtitle="Identity confidence" accent="slate" icon={<Activity className="h-4 w-4" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Operating model</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">Interop workflow</div>
                </div>
                <Workflow className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-3">
                {workflow.map((step, index) => (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => navigate(step.path)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800">{index + 1}. {step.label}</div>
                      <div className="text-xs text-slate-500">{step.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">ABDM readiness</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">Current readiness score</div>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-3xl font-semibold text-emerald-700">{readiness.consentCoverage + readiness.patientMatchRate + readiness.terminologyCoverage / 3}</div>
                  <div className="mt-1 text-sm text-emerald-800">Composite synthetic readiness index</div>
                </div>
                {readiness.steps.map((step) => (
                  <div key={step.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-slate-800">{step.label}</div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${step.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : step.status === 'In progress' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{step.detail}</p>
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
