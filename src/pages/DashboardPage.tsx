import { ArrowRight, ShieldAlert, Users } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'

import { ActivityFeed } from '../components/ActivityFeed'
import { ChartCard } from '../components/ChartCard'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { alerts } from '../data/alerts'
import { enrollmentTrendData } from '../data/enrollment'
import { studies } from '../data/studies'

const activityItems = [
  { time: '12m', title: 'CTRI amendment approved', detail: 'AIIA-AYU-006 · Patna Research Hub' },
  { time: '24m', title: 'Monitoring visit updated', detail: 'AIIA-AYU-003 · Maharashtra site' },
  { time: '51m', title: 'SAE report submitted', detail: 'AIIA-AYU-004 · Karnataka site' },
  { time: '1h', title: 'Protocol deviations closed', detail: 'AIIA-AYU-007 · Chennai' },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const topStudies = studies.slice(0, 3)
  const attentionItems = [
    { level: 'HIGH', study: 'AIIA-AYU-003', detail: 'Enrollment is 18% behind target', owner: 'Site operations', action: 'Review enrollment', path: '/enrollment' },
    { level: 'WARNING', study: 'AIIA-AYU-001', detail: 'CTRI update due in 12 days', owner: 'Regulatory affairs', action: 'Review CTRI', path: '/ctri' },
    { level: 'CRITICAL', study: 'AIIA-AYU-004', detail: '2 critical protocol deviations open', owner: 'Study team', action: 'Review deviations', path: '/deviations' },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <PageHeader
          title="Trial portfolio"
          subtitle="A clear view of study progress, decisions due and emerging risks."
        />
        <Badge variant="neutral" className="mb-6 border border-[#dce3d8] bg-[#edf1e9] text-[#536b56]">PORTFOLIO BRIEF · 26 SEP 2026</Badge>
      </div>

      <div className="mb-6 grid grid-cols-2 divide-x divide-y divide-[#e2e5da] border-y border-[#e2e5da] bg-[#fbfbf6] md:grid-cols-4 md:divide-y-0">
        {[
          { label: 'Active studies', value: '18', detail: '11 currently recruiting', path: '/trials' },
          { label: 'Participants enrolled', value: '1,284', detail: 'of 2,000 target', path: '/participants' },
          { label: 'Active sites', value: '32', detail: '4 need follow-up', path: '/sites' },
          { label: 'Open safety alerts', value: '7', detail: '3 due today', path: '/alerts' },
        ].map((metric) => (
          <button key={metric.label} type="button" onClick={() => navigate(metric.path)} className="px-4 py-4 text-left transition-colors hover:bg-[#f2f3ec] md:px-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#788278]">{metric.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-[#24372f]">{metric.value}</div>
            <div className="mt-1 text-xs text-[#69766c]">{metric.detail}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_.8fr]">
        <div className="space-y-5">
          <section className="border-y border-[#e2e5da] bg-[#fbfbf6]">
            <div className="flex items-center justify-between gap-3 border-b border-[#e2e5da] px-4 py-4 md:px-5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#788278]">Portfolio attention</div>
                <h2 className="mt-1 font-display text-lg font-semibold text-[#24372f]">Items requiring a decision</h2>
              </div>
              <button type="button" onClick={() => navigate('/alerts')} className="inline-flex items-center gap-1 text-xs font-semibold text-[#315d46] hover:text-[#24372f]">View queue <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="divide-y divide-[#e8e9e1]">
              {attentionItems.map((item) => (
                <div key={item.study} className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:px-5">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.level === 'CRITICAL' ? 'bg-[#b5483a]' : item.level === 'HIGH' ? 'bg-[#a86c2c]' : 'bg-[#c69a55]'}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#24372f]">{item.detail}</span>
                        <Badge variant={item.level === 'CRITICAL' ? 'critical' : item.level === 'HIGH' ? 'warning' : 'neutral'}>{item.level}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-[#788278]">{item.study} <span className="px-1">·</span> Owner: {item.owner}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => navigate(item.path)} className="inline-flex shrink-0 items-center gap-1 self-start text-xs font-semibold text-[#315d46] hover:text-[#24372f] md:self-center">{item.action} <ArrowRight className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </section>

          <ChartCard title="Recruitment journey" subtitle="Participants enrolled against the portfolio target.">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrendData}>
                  <defs><linearGradient id="targetGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#315d46" stopOpacity={0.16} /><stop offset="95%" stopColor="#315d46" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} /><Tooltip />
                  <Area type="monotone" dataKey="target" stroke="#aeb9aa" strokeWidth={2} fill="url(#targetGradient)" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="actual" stroke="#315d46" strokeWidth={2.5} fill="rgba(49,93,70,0.08)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-[#69766c]"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#315d46]" />Actual</div><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#aeb9aa]" />Target</div></div>
          </ChartCard>

          <ChartCard title="Studies requiring attention" subtitle="Progress and recruitment status across priority studies.">
            <div className="divide-y divide-[#e8e9e1]">
              {topStudies.map((study) => (
                <button key={study.id} type="button" onClick={() => navigate(`/trials/${study.id}`)} className="block w-full py-3 text-left first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3"><div className="min-w-0"><div className="text-sm font-semibold text-[#24372f]">{study.title}</div><div className="mt-1 text-xs text-[#788278]">{study.id} · {study.sites} sites · {study.currentEnrollment}/{study.targetEnrollment} participants</div></div><StatusBadge status={study.status} /></div>
                  <div className="mt-3 flex items-center gap-3"><ProgressBar value={study.progress} tone={study.risk === 'High' ? 'red' : study.risk === 'Moderate' ? 'amber' : 'green'} /><span className="w-10 shrink-0 text-right text-xs tabular-nums text-[#69766c]">{study.progress}%</span></div>
                </button>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="space-y-5">
          <button type="button" onClick={() => navigate('/alerts')} className="w-full rounded-lg bg-[#315d46] p-5 text-left text-white transition-colors hover:bg-[#284d3a]">
            <div className="flex items-start justify-between"><div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#d0dfcf]">Safety monitoring</div><ShieldAlert className="h-5 w-5 text-[#d0dfcf]" /></div>
            <div className="mt-5 font-display text-4xl font-semibold">7 <span className="text-lg font-medium">open alerts</span></div>
            <div className="mt-2 text-sm text-[#d0dfcf]">3 require review today</div>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold">Open safety workspace <ArrowRight className="h-4 w-4" /></div>
          </button>
          <ChartCard title="Recent actions" subtitle="Latest changes across the portfolio."><ActivityFeed items={activityItems} /></ChartCard>
          <ChartCard title="Portfolio health" subtitle="Operational readiness by area.">
            <div className="space-y-4">
              {[
                { label: 'Participant management', value: 92, tone: 'green' },
                { label: 'Visit compliance', value: 87, tone: 'blue' },
                { label: 'Protocol compliance', value: 78, tone: 'amber' },
                { label: 'Data quality', value: 95, tone: 'green' },
              ].map((metric) => <div key={metric.label}><div className="mb-2 flex items-center justify-between text-sm"><span className="text-[#536258]">{metric.label}</span><span className="font-medium tabular-nums text-[#24372f]">{metric.value}%</span></div><ProgressBar value={metric.value} tone={metric.tone as 'green' | 'blue' | 'amber'} /></div>)}
            </div>
          </ChartCard>
          <ChartCard title="Priority alerts" subtitle="Items with the nearest due dates.">
            <div className="divide-y divide-[#e8e9e1]">
              {alerts.slice(0, 3).map((alert) => <button key={alert.id} type="button" onClick={() => navigate('/alerts')} className="block w-full py-3 text-left first:pt-0 last:pb-0"><div className="flex items-start justify-between gap-3"><div className="text-sm font-medium text-[#24372f]">{alert.description}</div><Badge variant={alert.severity === 'Critical' ? 'critical' : alert.severity === 'High' ? 'warning' : 'info'}>{alert.severity}</Badge></div><div className="mt-1 text-xs text-[#788278]">{alert.study} · {alert.site} · Due {alert.dueDate}</div></button>)}
            </div>
          </ChartCard>
          <div className="flex items-center gap-2 px-1 text-xs text-[#788278]"><Users className="h-4 w-4" />Portfolio-wide view · All sites</div>
        </div>
      </div>
    </div>
  )
}
