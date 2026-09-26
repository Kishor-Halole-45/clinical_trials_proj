import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, AlertTriangle, ClipboardCheck, ShieldAlert, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { adverseEvents, safetySignals, safetySummary } from '../data/safety'
import { Button } from '../components/ui/button'

const alertColors = ['#0f172a', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444']

export function PharmacovigilancePage() {
  const navigate = useNavigate()

  const trendData = useMemo(() => {
    const counts = new Map<string, number>()
    adverseEvents.forEach((event) => {
      const month = event.onsetDate.slice(5, 7)
      counts.set(month, (counts.get(month) ?? 0) + 1)
    })
    return ['09', '10', '11', '12'].map((month) => ({ month, events: counts.get(month) ?? 0 }))
  }, [])

  const severityData = useMemo(() => {
    const counts = { Mild: 0, Moderate: 0, Severe: 0 }
    adverseEvents.forEach((event) => {
      counts[event.severity] += 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [])

  const signalData = useMemo(() => {
    return safetySignals.map((signal) => ({
      name: signal.signalTerm,
      count: signal.eventCount,
      status: signal.status,
    }))
  }, [])

  const requiresAttention = adverseEvents.slice(0, 4).map((event) => ({
    id: event.id,
    title: event.eventTerm,
    note: event.status === 'Under Review' ? 'Medical review pending' : event.status === 'Follow-up Required' ? 'Follow-up due' : 'Assessment requires action',
  }))

  const kpis = [
    { label: 'Total AEs', value: String(safetySummary.totalAEs), subtitle: 'current portfolio', accent: 'blue' as const, icon: <Activity className="h-4 w-4" />, onClick: () => navigate('/adverse-events') },
    { label: 'Open AEs', value: String(safetySummary.openAEs), subtitle: 'active review', accent: 'teal' as const, icon: <ClipboardCheck className="h-4 w-4" />, onClick: () => navigate('/adverse-events') },
    { label: 'Serious AEs', value: String(safetySummary.seriousAEs), subtitle: 'requires escalated review', accent: 'red' as const, icon: <AlertTriangle className="h-4 w-4" />, onClick: () => navigate('/sae') },
    { label: 'SAEs Requiring Review', value: String(safetySummary.pendingMedicalReview), subtitle: 'medical sign-off', accent: 'amber' as const, icon: <ShieldAlert className="h-4 w-4" />, onClick: () => navigate('/sae') },
    { label: 'ADRs', value: String(safetySummary.adrCount), subtitle: 'probable or definite', accent: 'slate' as const, icon: <TrendingUp className="h-4 w-4" />, onClick: () => navigate('/safety-signals') },
    { label: 'Safety Events This Month', value: String(safetySummary.eventsThisMonth), subtitle: 'reported in current cycle', accent: 'blue' as const },
    { label: 'Open Safety Follow-ups', value: String(safetySummary.openFollowUps), subtitle: 'due or in progress', accent: 'amber' as const, onClick: () => navigate('/adverse-events') },
    { label: 'Events Pending Medical Review', value: String(safetySummary.pendingMedicalReview), subtitle: 'awaiting assessment', accent: 'red' as const, onClick: () => navigate('/sae') },
  ]

  return (
    <div>
      <PageHeader title="Pharmacovigilance" subtitle="Clinical safety review, adverse event assessment, follow-up and signal oversight." actions={<Button onClick={() => navigate('/adverse-events')}>Open AE workspace</Button>} />

      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable onClick={kpi.onClick} />
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Safety status summary</div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-500">Total events</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{safetySummary.totalAEs}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-500">Open review</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{safetySummary.openReviews}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-500">Serious events</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{safetySummary.seriousAEs}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm text-slate-500">Pending follow-up</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{safetySummary.openFollowUps}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard title="Safety event trend" subtitle="Observed event counts across recent reporting periods">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="aeTrend" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="events" stroke="#2563eb" fill="url(#aeTrend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Safety alerts" subtitle="Priority queue">
          <div className="space-y-3">
            {requiresAttention.map((item) => (
              <button key={item.id} type="button" onClick={() => navigate(`/adverse-events/${item.id}`)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-slate-800">{item.id}</div>
                  <StatusBadge status={item.note.includes('Medical') ? 'Overdue' : 'Scheduled'} />
                </div>
                <div className="mt-1 text-sm text-slate-600">{item.title}</div>
                <div className="mt-2 text-xs text-slate-500">{item.note}</div>
              </button>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Severity distribution" subtitle="Current event severity mix">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={3}>
                {severityData.map((entry, index) => (
                  <Cell key={entry.name} fill={alertColors[index % alertColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Signal monitoring" subtitle="Detected patterns from configured rules">
          <div className="space-y-3">
            {signalData.map((signal) => (
              <button key={signal.name} type="button" onClick={() => navigate('/safety-signals')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
                <div>
                  <div className="text-sm font-medium text-slate-800">{signal.name}</div>
                  <div className="text-xs text-slate-500">{signal.count} related events</div>
                </div>
                <StatusBadge status={signal.status === 'Under Review' ? 'Scheduled' : 'Completed'} />
              </button>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 text-lg font-semibold text-slate-900">Action required queue</div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Follow-up</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
              </tr>
            </thead>
            <tbody>
              {adverseEvents.slice(0, 5).map((event) => (
                <tr key={event.id} className="border-t border-slate-200">
                  <td className="px-4 py-3"><button type="button" onClick={() => navigate(`/adverse-events/${event.id}`)} className="font-medium text-primary">{event.id}</button></td>
                  <td className="px-4 py-3"><StatusBadge status={event.status === 'Closed' ? 'Completed' : event.status === 'Reported' ? 'Scheduled' : 'Overdue'} /></td>
                  <td className="px-4 py-3">{event.followUpRequired ? 'Required' : 'Not required'}</td>
                  <td className="px-4 py-3">{event.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
