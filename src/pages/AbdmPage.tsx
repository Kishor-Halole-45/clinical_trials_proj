import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function AbdmPage() {
  const readiness = fhirService.getABDMReadiness()

  return (
    <div>
      <PageHeader
        title="ABDM readiness center"
        subtitle="Synthetic ABDM and FHIR readiness evaluation across consent, identity, terminology, and exchange"
        actions={<Button variant="outline" className="gap-2"><Sparkles className="h-4 w-4" /> Review compliance</Button>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Consent coverage" value={`${readiness.consentCoverage}%`} subtitle="Current alignment" accent="blue" icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Patient match" value={`${readiness.patientMatchRate}%`} subtitle="Identity confidence" accent="teal" icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Terminology" value={`${readiness.terminologyCoverage}%`} subtitle="FHIR code coverage" accent="amber" icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Interop" value="FHIR R4" subtitle="Local exchange model" accent="slate" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 text-sm font-medium text-slate-800">Readiness milestones</div>
          <div className="space-y-3">
            {readiness.steps.map((step) => (
              <div key={step.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">{step.label}</div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${step.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : step.status === 'In progress' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {step.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-600">{step.detail}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
