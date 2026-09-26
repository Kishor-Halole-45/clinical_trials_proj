import { ShieldAlert, Sparkles, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

export function FhirValidationPage() {
  const [findings, setFindings] = useState(fhirService.getValidationFindings())

  const summary = useMemo(() => ({
    total: findings.length,
    warning: findings.filter((item) => item.status === 'Warning').length,
    needsReview: findings.filter((item) => item.status === 'Needs Review').length,
    validated: findings.filter((item) => item.status === 'Validated').length,
  }), [findings])

  const handleRunValidation = () => setFindings(fhirService.runValidation())

  const handleResolve = (findingId: string) => {
    const resolved = fhirService.resolveFinding(findingId)
    if (!resolved) return
    setFindings((current) => current.map((finding) => finding.id === findingId ? resolved : finding))
  }

  return (
    <div>
      <PageHeader
        title="FHIR validation center"
        subtitle="Local rule checks, completeness review, and consent mapping verification"
        actions={<Button className="gap-2" onClick={handleRunValidation}><Sparkles className="h-4 w-4" /> Run validation</Button>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total findings" value={String(summary.total)} subtitle="open validation record" accent="blue" icon={<ShieldAlert className="h-4 w-4" />} />
        <KpiCard label="Warning" value={String(summary.warning)} subtitle="non-blocking issues" accent="amber" icon={<TriangleAlert className="h-4 w-4" />} />
        <KpiCard label="Needs review" value={String(summary.needsReview)} subtitle="requires human sign-off" accent="red" icon={<TriangleAlert className="h-4 w-4" />} />
        <KpiCard label="Validated" value={String(summary.validated)} subtitle="passed checks" accent="teal" icon={<ShieldAlert className="h-4 w-4" />} />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 text-sm font-medium text-slate-800">Validation findings</div>
          <div className="space-y-3">
            {findings.map((finding) => (
              <div key={finding.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{finding.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{finding.resourceId} · {finding.rule}</div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${finding.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : finding.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {finding.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-600">{finding.message}</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{finding.severity}</div>
                  <Button variant="outline" size="sm" onClick={() => handleResolve(finding.id)}>Resolve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
