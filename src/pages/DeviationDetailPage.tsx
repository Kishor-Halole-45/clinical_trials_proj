import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { ChartCard } from '../components/ChartCard'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { deviationService } from '../services/deviationService'
import type { CAPA, ProtocolDeviation } from '../types'

export function DeviationDetailPage() {
  const navigate = useNavigate()
  const { deviationId } = useParams()
  const [deviation, setDeviation] = useState<ProtocolDeviation | null>(null)
  const [capaItems, setCapaItems] = useState<CAPA[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const found = deviationService.getDeviationById(deviationId ?? '')
      setDeviation(found)
      setCapaItems(deviationService.getCAPAs().filter((item) => item.deviationId === (deviationId ?? '')))
      setLoading(false)
    }, 120)
    return () => window.clearTimeout(timer)
  }, [deviationId])

  if (loading) return <LoadingState message="Loading deviation record..." />
  if (!deviation) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Deviation record not found.</div>

  return (
    <div>
      <PageHeader
        title={deviation.id}
        subtitle={`${deviation.studyId} · ${deviation.siteId} · ${deviation.participantId}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/deviations')}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button variant="secondary" onClick={() => navigate(`/participants/${deviation.participantId}`)}>Open participant</Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <StatusBadge status={deviation.status} />
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700">{deviation.category}</span>
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700">{deviation.severity}</span>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ChartCard title="Deviation information" subtitle="Regulatory and operational context">
            <div className="grid gap-4 md:grid-cols-2">
              <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Study</div><div className="mt-1 text-sm font-medium text-slate-900">{deviation.studyId}</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Site</div><div className="mt-1 text-sm font-medium text-slate-900">{deviation.siteId}</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Participant</div><div className="mt-1 text-sm font-medium text-slate-900">{deviation.participantId}</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Detected</div><div className="mt-1 text-sm font-medium text-slate-900">{deviation.detectedDate}</div></CardContent></Card>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{deviation.description}</div>
          </ChartCard>
        </div>

        <div className="xl:col-span-5">
          <ChartCard title="CAPA tracking" subtitle="Corrective and preventive action follow-up">
            <div className="space-y-3">
              {capaItems.length ? capaItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2"><div className="font-medium text-slate-800">{item.id}</div><StatusBadge status={item.status as any} /></div>
                  <div className="mt-2 text-sm text-slate-600">{item.action}</div>
                  <div className="mt-2 text-xs text-slate-500">Owner: {item.owner} · Due: {item.dueDate}</div>
                </div>
              )) : <div className="text-sm text-slate-500">No CAPA record yet for this deviation.</div>}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><CardContent className="p-4"><div className="mb-3 font-medium text-slate-800">Root cause</div><div className="text-sm text-slate-600">{deviation.rootCause}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="mb-3 font-medium text-slate-800">Corrective action</div><div className="text-sm text-slate-600">{deviation.correctiveAction}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="mb-3 font-medium text-slate-800">Preventive action</div><div className="text-sm text-slate-600">{deviation.preventiveAction}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="mb-3 font-medium text-slate-800">Resolution</div><div className="text-sm text-slate-600">{deviation.dueDate ? `Due: ${deviation.dueDate}` : 'No due date assigned'}</div></CardContent></Card>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-slate-800">Deviation timeline</div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
          {['Detected', 'Reviewed', 'CAPA Assigned', 'Action Taken', 'Verified', 'Closed'].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${index < 4 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>{index + 1}</div>
              <div className="text-xs text-slate-600">{step}</div>
              {index < 5 && <ArrowRight className="hidden h-4 w-4 text-slate-300 md:block" />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Review status: {deviation.status}</div>
      </div>
    </div>
  )
}
