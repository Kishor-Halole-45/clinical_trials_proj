import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Filter, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { adverseEventService } from '../services/adverseEventService'

const adverseEventSchema = z.object({
  participantId: z.string().min(1, 'Participant is required.'),
  participantName: z.string().min(1, 'Participant name is required.'),
  studyId: z.string().min(1, 'Study is required.'),
  siteId: z.string().min(1, 'Site is required.'),
  visitId: z.string().min(1, 'Visit is required.'),
  eventTerm: z.string().min(1, 'Event term is required.'),
  description: z.string().min(1, 'Description is required.'),
  onsetDate: z.string().min(1, 'Onset date is required.'),
  resolutionDate: z.string().optional(),
  severity: z.enum(['Mild', 'Moderate', 'Severe']),
  seriousness: z.enum(['Non-serious', 'Serious']),
  relatedness: z.enum(['Not Related', 'Unlikely', 'Possible', 'Probable', 'Definite']),
  outcome: z.enum(['Recovered', 'Recovering', 'Not Recovered', 'Recovered with Sequelae', 'Fatal', 'Unknown']),
  actionTaken: z.string().min(1, 'Action taken is required.'),
  treatmentProvided: z.string().min(1, 'Treatment is required.'),
  followUpRequired: z.boolean().default(false),
  followUpDueDate: z.string().optional(),
})

type EventFormValues = z.infer<typeof adverseEventSchema>

export function AdverseEventsPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState(adverseEventService.getEvents())
  const [search, setSearch] = useState('')
  const [studyFilter, setStudyFilter] = useState('All')
  const [siteFilter, setSiteFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [seriousnessFilter, setSeriousnessFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCreate, setShowCreate] = useState(false)

  const form = useForm<EventFormValues>({
    defaultValues: {
      participantId: 'PT-10091',
      participantName: 'Asha K.',
      studyId: 'AIIA-AYU-001',
      siteId: 'SITE-021',
      visitId: 'VIS-3041',
      eventTerm: 'Nausea and vomiting',
      description: 'Symptoms reported after dosing.',
      onsetDate: '2026-09-18',
      severity: 'Moderate',
      seriousness: 'Serious',
      relatedness: 'Probable',
      outcome: 'Recovering',
      actionTaken: 'Dose withheld',
      treatmentProvided: 'Anti-emetic',
      followUpRequired: true,
      followUpDueDate: '2026-09-27',
    },
  })

  const studyOptions = useMemo(() => Array.from(new Set(events.map((event) => event.studyId))), [events])
  const siteOptions = useMemo(() => Array.from(new Set(events.map((event) => event.siteId))), [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = !search || `${event.id} ${event.participantName} ${event.eventTerm} ${event.studyId}`.toLowerCase().includes(search.toLowerCase())
      const matchesStudy = studyFilter === 'All' || event.studyId === studyFilter
      const matchesSite = siteFilter === 'All' || event.siteId === siteFilter
      const matchesSeverity = severityFilter === 'All' || event.severity === severityFilter
      const matchesSeriousness = seriousnessFilter === 'All' || event.seriousness === seriousnessFilter
      const matchesStatus = statusFilter === 'All' || event.status === statusFilter
      return matchesSearch && matchesStudy && matchesSite && matchesSeverity && matchesSeriousness && matchesStatus
    })
  }, [events, search, studyFilter, siteFilter, severityFilter, seriousnessFilter, statusFilter])

  const handleCreate = (values: EventFormValues) => {
    const created = adverseEventService.createEvent({
      participantId: values.participantId,
      participantName: values.participantName,
      studyId: values.studyId,
      studyTitle: 'AIIA Trial',
      siteId: values.siteId,
      siteName: 'Clinical Site',
      visitId: values.visitId,
      eventTerm: values.eventTerm,
      description: values.description,
      onsetDate: values.onsetDate,
      resolutionDate: values.resolutionDate || undefined,
      severity: values.severity,
      seriousness: values.seriousness,
      relatedness: values.relatedness,
      outcome: values.outcome,
      status: values.seriousness === 'Serious' ? 'Under Review' : 'Reported',
      assignedTo: 'Dr. A. Nair',
      reporter: 'Site Team',
      actionTaken: values.actionTaken,
      treatmentProvided: values.treatmentProvided,
      followUpRequired: values.followUpRequired,
      followUpDueDate: values.followUpRequired ? values.followUpDueDate : undefined,
    })
    setEvents((current) => [created, ...current])
    setShowCreate(false)
    form.reset()
  }

  return (
    <div>
      <PageHeader title="Adverse Event Management" subtitle="Tracked adverse events, serious events and follow-up workflow across active studies." actions={<Button onClick={() => setShowCreate((value) => !value)}><Plus className="mr-2 h-4 w-4" />Create Adverse Event</Button>} />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total AEs" value={String(events.length)} subtitle="synthetic records" accent="blue" />
        <KpiCard label="Open AEs" value={String(events.filter((event) => event.status !== 'Closed').length)} subtitle="pending action" accent="teal" />
        <KpiCard label="Serious AEs" value={String(events.filter((event) => event.seriousness === 'Serious').length)} subtitle="requires review" accent="red" />
        <KpiCard label="Follow-up Required" value={String(events.filter((event) => event.followUpRequired).length)} subtitle="due soon" accent="amber" />
      </div>

      {showCreate && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-800">Create Adverse Event</div>
          <form onSubmit={form.handleSubmit(handleCreate)} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input {...form.register('participantId')} placeholder="Participant ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('participantName')} placeholder="Participant name" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('studyId')} placeholder="Study ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('siteId')} placeholder="Site ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('visitId')} placeholder="Visit ID" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('eventTerm')} placeholder="Event term" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <select {...form.register('severity')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
            <select {...form.register('seriousness')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Non-serious">Non-serious</option>
              <option value="Serious">Serious</option>
            </select>
            <select {...form.register('relatedness')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Not Related">Not Related</option>
              <option value="Unlikely">Unlikely</option>
              <option value="Possible">Possible</option>
              <option value="Probable">Probable</option>
              <option value="Definite">Definite</option>
            </select>
            <select {...form.register('outcome')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="Recovered">Recovered</option>
              <option value="Recovering">Recovering</option>
              <option value="Not Recovered">Not Recovered</option>
              <option value="Recovered with Sequelae">Recovered with Sequelae</option>
              <option value="Fatal">Fatal</option>
              <option value="Unknown">Unknown</option>
            </select>
            <input type="date" {...form.register('onsetDate')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input type="date" {...form.register('resolutionDate')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('actionTaken')} placeholder="Action taken" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input {...form.register('treatmentProvided')} placeholder="Treatment provided" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <input type="date" {...form.register('followUpDueDate')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"><input type="checkbox" {...form.register('followUpRequired')} /> Follow-up required</label>
            <textarea {...form.register('description')} className="md:col-span-2 xl:col-span-4 min-h-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Event description" />
            <div className="md:col-span-2 xl:col-span-4 flex gap-2">
              <Button type="submit">Save event</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <Search className="h-4 w-4" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search AE ID or term" className="w-44 bg-transparent outline-none" />
        </div>
        <select value={studyFilter} onChange={(event) => setStudyFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All studies</option>
          {studyOptions.map((study) => <option key={study} value={study}>{study}</option>)}
        </select>
        <select value={siteFilter} onChange={(event) => setSiteFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All sites</option>
          {siteOptions.map((site) => <option key={site} value={site}>{site}</option>)}
        </select>
        <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All severities</option>
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
        <select value={seriousnessFilter} onChange={(event) => setSeriousnessFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All seriousness</option>
          <option value="Serious">Serious</option>
          <option value="Non-serious">Non-serious</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="All">All statuses</option>
          <option value="Reported">Reported</option>
          <option value="Under Review">Under Review</option>
          <option value="Follow-up Required">Follow-up Required</option>
          <option value="Medically Reviewed">Medically Reviewed</option>
          <option value="Closed">Closed</option>
        </select>
        <Button variant="secondary" className="gap-2"><Filter className="h-4 w-4" />Filters</Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Event ID</th>
              <th className="px-4 py-3 font-semibold">Participant</th>
              <th className="px-4 py-3 font-semibold">Study</th>
              <th className="px-4 py-3 font-semibold">Site</th>
              <th className="px-4 py-3 font-semibold">Event Term</th>
              <th className="px-4 py-3 font-semibold">Severity</th>
              <th className="px-4 py-3 font-semibold">Seriousness</th>
              <th className="px-4 py-3 font-semibold">Relatedness</th>
              <th className="px-4 py-3 font-semibold">Outcome</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3"><button type="button" className="font-medium text-primary" onClick={() => navigate(`/adverse-events/${event.id}`)}>{event.id}</button></td>
                <td className="px-4 py-3">{event.participantName}</td>
                <td className="px-4 py-3">{event.studyId}</td>
                <td className="px-4 py-3">{event.siteId}</td>
                <td className="px-4 py-3">{event.eventTerm}</td>
                <td className="px-4 py-3">{event.severity}</td>
                <td className="px-4 py-3">{event.seriousness}</td>
                <td className="px-4 py-3">{event.relatedness}</td>
                <td className="px-4 py-3">{event.outcome}</td>
                <td className="px-4 py-3"><StatusBadge status={event.status === 'Closed' ? 'Completed' : event.status === 'Under Review' ? 'Overdue' : 'Scheduled'} /></td>
                <td className="px-4 py-3">{event.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
