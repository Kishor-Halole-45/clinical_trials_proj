import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../components/ui/button'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { adverseEventService } from '../services/adverseEventService'
import { safetyFollowUpService } from '../services/safetyFollowUpService'

const assessmentSchema = z.object({
  severity: z.enum(['Mild', 'Moderate', 'Severe']),
  seriousness: z.enum(['Non-serious', 'Serious']),
  expectedness: z.enum(['Expected', 'Unexpected', 'Unknown']),
  causality: z.enum(['Not Related', 'Unlikely', 'Possible', 'Probable', 'Definite']),
  outcome: z.enum(['Recovered', 'Recovering', 'Not Recovered', 'Recovered with Sequelae', 'Fatal', 'Unknown']),
  actionTaken: z.string().min(1),
  medicalReview: z.string().min(1),
  investigatorAssessment: z.string().min(1),
})

type AssessmentValues = z.infer<typeof assessmentSchema>

export function AdverseEventDetailPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(adverseEventService.getEventById(eventId ?? ''))
  const [tab, setTab] = useState<'Overview' | 'Assessment' | 'Follow-up' | 'Treatment' | 'Related Visits' | 'Documents' | 'Audit Trail'>('Overview')

  const form = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      severity: event?.severity ?? 'Moderate',
      seriousness: event?.seriousness ?? 'Serious',
      expectedness: 'Unknown',
      causality: event?.relatedness ?? 'Probable',
      outcome: event?.outcome ?? 'Recovering',
      actionTaken: event?.actionTaken ?? 'Dose withheld',
      medicalReview: event?.assessment?.medicalReview ?? 'Medical review pending.',
      investigatorAssessment: event?.assessment?.investigatorAssessment ?? 'Investigator assessment pending.',
    },
  })

  const followUpForm = useForm({
    defaultValues: { id: 'FU-NEW', dueDate: '2026-09-30', assignedTo: 'Site Investigator', notes: 'Follow-up requested for symptom resolution review.' },
  })

  const auditTrail = useMemo(() => event?.auditTrail ?? [], [event])

  if (!event) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Safety record unavailable. Please return to the adverse events list.</div>
  }

  const saveAssessment = (values: AssessmentValues) => {
    const updated = adverseEventService.updateEvent(event.id, {
      severity: values.severity,
      seriousness: values.seriousness,
      relatedness: values.causality,
      outcome: values.outcome,
      assignedTo: event.assignedTo,
      status: values.seriousness === 'Serious' ? 'Medically Reviewed' : 'Follow-up Required',
      assessment: {
        severity: values.severity,
        seriousness: values.seriousness,
        expectedness: values.expectedness,
        causality: values.causality,
        outcome: values.outcome,
        actionTaken: values.actionTaken,
        dechallenge: 'Yes',
        rechallenge: 'No',
        medicalReview: values.medicalReview,
        investigatorAssessment: values.investigatorAssessment,
      },
      auditTrail: [
        ...event.auditTrail,
        {
          id: `AUD-${Date.now()}`,
          actor: 'Pharmacovigilance Reviewer',
          action: 'Updated assessment',
          entity: event.id,
          previousValue: event.status,
          newValue: 'Medically Reviewed',
          timestamp: new Date().toISOString(),
          reason: values.medicalReview,
        },
      ],
    })
    setEvent(updated)
  }

  const requestFollowUp = (values: any) => {
    safetyFollowUpService.createFollowUp({
      id: values.id,
      eventId: event.id,
      requestedDate: new Date().toISOString().slice(0, 10),
      dueDate: values.dueDate,
      requestedBy: 'Pharmacovigilance',
      assignedTo: values.assignedTo,
      status: 'Pending',
      notes: values.notes,
    })
    setEvent((current) => current ? { ...current, followUpRequired: true, status: 'Follow-up Required', lastUpdated: new Date().toISOString().slice(0, 10) } : current)
  }

  const tabs = ['Overview', 'Assessment', 'Follow-up', 'Treatment', 'Related Visits', 'Documents', 'Audit Trail']

  return (
    <div>
      <PageHeader title={event.id} subtitle={event.eventTerm} actions={<>
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Assign</Button>
        <Button variant="outline">Add Follow-up</Button>
        <Button onClick={() => saveAssessment(form.getValues())}>Medical Review</Button>
      </>} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <StatusBadge status={event.status === 'Closed' ? 'Completed' : event.status === 'Under Review' ? 'Overdue' : 'Scheduled'} />
        <StatusBadge status={event.severity === 'Severe' ? 'Critical' : event.severity === 'Moderate' ? 'High' : 'Medium'} />
        <StatusBadge status={event.seriousness === 'Serious' ? 'Critical' : 'Completed'} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item as any)} className={`rounded-lg px-3 py-2 text-sm font-medium ${tab === item ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Participant</span><div className="mt-1 font-semibold text-slate-900">{event.participantId} · {event.participantName}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Study & site</span><div className="mt-1 font-semibold text-slate-900">{event.studyId} · {event.siteName}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Onset date</span><div className="mt-1 font-semibold text-slate-900">{event.onsetDate}</div></div>
              <div><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Outcome</span><div className="mt-1 font-semibold text-slate-900">{event.outcome}</div></div>
              <div className="md:col-span-2"><span className="text-xs uppercase tracking-[0.12em] text-slate-500">Description</span><div className="mt-1 text-slate-700">{event.description}</div></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Timeline</div>
            <div className="space-y-3">
              {['Event Reported', 'Initial Assessment', 'Investigator Review', 'Medical Review', 'Follow-up Requested', 'Follow-up Received', 'Final Assessment', 'Closed'].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${index <= 5 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>{index + 1}</div>
                    {index < 7 && <div className="mt-1 h-8 w-px bg-slate-200" />}
                  </div>
                  <div className="text-sm text-slate-700">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Assessment' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <form onSubmit={form.handleSubmit(saveAssessment)} className="grid gap-3 md:grid-cols-2">
            <select {...form.register('severity')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="Mild">Mild</option><option value="Moderate">Moderate</option><option value="Severe">Severe</option></select>
            <select {...form.register('seriousness')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="Non-serious">Non-serious</option><option value="Serious">Serious</option></select>
            <select {...form.register('expectedness')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="Expected">Expected</option><option value="Unexpected">Unexpected</option><option value="Unknown">Unknown</option></select>
            <select {...form.register('causality')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="Not Related">Not Related</option><option value="Unlikely">Unlikely</option><option value="Possible">Possible</option><option value="Probable">Probable</option><option value="Definite">Definite</option></select>
            <select {...form.register('outcome')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="Recovered">Recovered</option><option value="Recovering">Recovering</option><option value="Not Recovered">Not Recovered</option><option value="Recovered with Sequelae">Recovered with Sequelae</option><option value="Fatal">Fatal</option><option value="Unknown">Unknown</option></select>
            <input {...form.register('actionTaken')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Action taken" />
            <textarea {...form.register('medicalReview')} className="md:col-span-2 min-h-[80px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Medical review" />
            <textarea {...form.register('investigatorAssessment')} className="md:col-span-2 min-h-[80px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Investigator assessment" />
            <div className="md:col-span-2 flex gap-2"><Button type="submit">Save Assessment</Button><Button type="button" variant="secondary" onClick={() => navigate('/adverse-events')}>Back</Button></div>
          </form>
        </div>
      )}

      {tab === 'Follow-up' && (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Follow-up queue</div>
            <div className="space-y-3">
              {safetyFollowUpService.getFollowUps().filter((item) => item.eventId === event.id).map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-800">{item.id}</div>
                    <StatusBadge status={item.status === 'Pending' ? 'Scheduled' : item.status === 'Closed' ? 'Completed' : 'Overdue'} />
                  </div>
                  <div className="mt-2 text-sm text-slate-600">Due: {item.dueDate} · Assigned to: {item.assignedTo}</div>
                  <div className="mt-2 text-xs text-slate-500">{item.notes}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Create follow-up</div>
            <form onSubmit={followUpForm.handleSubmit(requestFollowUp)} className="space-y-3">
              <input {...followUpForm.register('id')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Follow-up ID" />
              <input type="date" {...followUpForm.register('dueDate')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
              <input {...followUpForm.register('assignedTo')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Assigned To" />
              <textarea {...followUpForm.register('notes')} className="min-h-[110px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Notes" />
              <Button type="submit">Create follow-up</Button>
            </form>
          </div>
        </div>
      )}

      {tab === 'Audit Trail' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-3">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between"> <div className="font-medium text-slate-800">{entry.action}</div> <span className="text-xs text-slate-500">{entry.timestamp}</span> </div>
                <div className="mt-2 text-sm text-slate-600">Actor: {entry.actor}</div>
                {entry.previousValue && entry.newValue && <div className="mt-1 text-xs text-slate-500">{entry.previousValue} → {entry.newValue}</div>}
                {entry.reason && <div className="mt-2 text-xs text-slate-500">Reason: {entry.reason}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
