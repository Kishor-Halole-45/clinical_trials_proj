import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CalendarClock, ClipboardCheck, FileWarning, ShieldAlert, Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { participantService } from '../services/participantService'
import type { Participant } from '../types'

export function ParticipantDetailPage() {
  const navigate = useNavigate()
  const { participantId } = useParams()
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setParticipant(participantService.getParticipantById(participantId ?? ''))
      setLoading(false)
    }, 120)
    return () => window.clearTimeout(timer)
  }, [participantId])

  const studySummary = useMemo(() => participant ? [
    { label: 'Enrollment', value: participant.enrollmentDate ?? 'Pending', tone: 'blue' },
    { label: 'Randomization', value: participant.randomizationDate ?? 'Pending', tone: 'teal' },
    { label: 'Current visit', value: participant.currentVisit, tone: 'amber' },
    { label: 'Data completeness', value: `${participant.dataCompleteness}%`, tone: 'slate' },
  ] : [], [participant])

  if (loading) return <LoadingState message="Loading participant record..." />
  if (!participant) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Participant record not found.</div>

  return (
    <div>
      <PageHeader
        title={participant.id}
        subtitle={`${participant.studyId} · ${participant.siteName}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/participants')}><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button variant="secondary" onClick={() => navigate('/visits', { state: { participantId: participant.id } })}>Open visits</Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-600">Study: <strong className="text-slate-900">{participant.studyId}</strong></span>
        <span className="text-sm text-slate-600">Site: <strong className="text-slate-900">{participant.siteId}</strong></span>
        <StatusBadge status={participant.status} />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Enrollment" value={participant.enrollmentDate ?? 'Pending'} subtitle="visit milestone" accent="blue" icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Randomization" value={participant.randomizationDate ?? 'Pending'} subtitle="allocation status" accent="teal" icon={<ClipboardCheck className="h-4 w-4" />} />
        <KpiCard label="Data Completeness" value={`${participant.dataCompleteness}%`} subtitle="EDC quality" accent="slate" icon={<FileWarning className="h-4 w-4" />} />
        <KpiCard label="Protocol Deviations" value={String(participant.protocolDeviations)} subtitle="operational review" accent="amber" icon={<ShieldAlert className="h-4 w-4" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ChartCard title="Participant Overview" subtitle="Enrollment information, randomization and visit tracking">
            <div className="grid gap-4 md:grid-cols-2">
              {studySummary.map((item) => (
                <Card key={item.label}><CardContent className="p-4"><div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{item.label}</div><div className="mt-2 text-xl font-semibold text-slate-900">{item.value}</div></CardContent></Card>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-5">
          <ChartCard title="Current operational status" subtitle="Risk and data quality snapshot">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600"><span>Visit completion</span><span>{participant.dataCompleteness}%</span></div>
                <ProgressBar value={participant.dataCompleteness} tone="green" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600"><span>Protocol compliance</span><span>{100 - participant.protocolDeviations * 10}%</span></div>
                <ProgressBar value={100 - participant.protocolDeviations * 10} tone={participant.protocolDeviations > 2 ? 'amber' : 'green'} />
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <ChartCard title="Participant Timeline" subtitle="Screening to follow-up sequence">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            {participant.timeline.map((step, index) => (
              <div key={`${step.label}-${index}`} className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium ${step.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {index + 1}
                </div>
                <div className="text-sm text-slate-700">
                  <div className="font-medium">{step.label}</div>
                  <div className="text-xs text-slate-500">{step.date}</div>
                </div>
                {index < participant.timeline.length - 1 && <div className="hidden h-px w-8 bg-slate-200 md:block" />}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><CardContent className="p-4"><div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-800"><CalendarClock className="h-4 w-4" /> Visit status</div><div className="space-y-3 text-sm text-slate-600"><div>Current visit: <strong className="text-slate-900">{participant.currentVisit}</strong></div><div>Visit status: <StatusBadge status={participant.visitStatus} /></div><div>Safety events: {participant.safetyEvents}</div><div>Protocol deviations: {participant.protocolDeviations}</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-800"><ClipboardCheck className="h-4 w-4" /> Demographics</div><div className="space-y-2 text-sm text-slate-600"><div>Age group: <strong className="text-slate-900">{participant.ageGroup}</strong></div><div>Gender: <strong className="text-slate-900">{participant.gender}</strong></div><div>Cohort: <strong className="text-slate-900">{participant.cohort}</strong></div><div>Screening date: <strong className="text-slate-900">{participant.screeningDate}</strong></div></div></CardContent></Card>
      </div>
    </div>
  )
}
