import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Download, FileText, MoreHorizontal, ShieldCheck } from 'lucide-react'

import { ActivityFeed } from '../components/ActivityFeed'
import { ChartCard } from '../components/ChartCard'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { RiskBadge } from '../components/RiskBadge'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { studies } from '../data/studies'
import { sites } from '../data/sites'

const tabs = ['Overview', 'Sites', 'Monitoring', 'Ethics', 'CTRI', 'Audit Trail'] as const

type TabName = (typeof tabs)[number]

export function TrialDetailPage() {
  const navigate = useNavigate()
  const { trialId } = useParams()
  const study = studies.find((item) => item.id === trialId) ?? studies[0]
  const [activeTab, setActiveTab] = useState<TabName>('Overview')

  const siteRows = useMemo(() => sites.filter((site) => site.trialId === study.id).slice(0, 5), [study.id])

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Enrollment</div><div className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{study.currentEnrollment}/{study.targetEnrollment}</div><div className="mt-2"><ProgressBar value={study.progress} /></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Site performance</div><div className="mt-2 text-2xl font-semibold text-slate-900">82%</div><div className="mt-2 text-xs text-slate-500">Across 8 active sites</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Open queries</div><div className="mt-2 text-2xl font-semibold text-slate-900">{study.openQueries}</div><div className="mt-2 text-xs text-slate-500">12 due this week</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Safety events</div><div className="mt-2 text-2xl font-semibold text-slate-900">{study.safetyEvents}</div><div className="mt-2 text-xs text-slate-500">1 SAE escalated</div></CardContent></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ChartCard title="Study Health" subtitle="Core quality indicators">
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(study.statusSummary).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium capitalize text-slate-700">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <StatusBadge status={value} />
                  </div>
                  <ProgressBar value={value === 'Healthy' ? 90 : value === 'Watch' ? 60 : 30} tone={value === 'Critical' ? 'red' : value === 'Watch' ? 'amber' : 'green'} />
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-5">
          <ChartCard title="Recent activity" subtitle="Operational updates">
            <ActivityFeed items={[
              { time: '15m', title: 'Protocol deviation closed', detail: 'Site 006 • query package approved' },
              { time: '1h', title: 'Monitoring visit logged', detail: 'Routine visit completed in New Delhi' },
              { time: '4h', title: 'SAE follow-up sent', detail: 'PV team distributed report' },
              { time: '1d', title: 'CTRI amendment filed', detail: 'Regulatory update dispatched' },
            ]} />
          </ChartCard>
        </div>
      </div>
    </div>
  )

  const renderSites = () => (
    <div className="space-y-4">
      {siteRows.map((site) => (
        <div key={site.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-slate-900">{site.name}</div>
              <div className="text-sm text-slate-500">{site.location}</div>
            </div>
            <StatusBadge status={site.status} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Investigator</div><div className="mt-1 font-medium text-slate-700">{site.investigator}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Target vs Enrolled</div><div className="mt-1 font-medium text-slate-700">{site.enrolled}/{site.target}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Next monitoring</div><div className="mt-1 font-medium text-slate-700">{site.nextMonitoring}</div></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMonitoring = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4"><div className="text-xs uppercase">Upcoming</div><div className="mt-2 text-2xl font-semibold text-slate-900">4</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase">Overdue</div><div className="mt-2 text-2xl font-semibold text-slate-900">2</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs uppercase">Critical findings</div><div className="mt-2 text-2xl font-semibold text-slate-900">3</div></CardContent></Card>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">Monitoring queue and visit timeline rendered for Phase 2 implementation.</div>
    </div>
  )

  const renderEthics = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800"><ShieldCheck className="h-4 w-4" /> Ethics and regulatory status</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div><div className="text-xs uppercase text-slate-500">IEC status</div><div className="mt-1 font-medium text-slate-800">Approved, valid through 2027</div></div>
          <div><div className="text-xs uppercase text-slate-500">CTRI registration</div><div className="mt-1 font-medium text-slate-800">Active entry validated</div></div>
        </div>
      </div>
    </div>
  )

  const renderCtri = () => (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><div className="text-xs uppercase text-slate-500">CTRI number</div><div className="mt-1 font-medium text-slate-800">CTRI/2026/AYU-118</div></div>
        <div><div className="text-xs uppercase text-slate-500">Last update</div><div className="mt-1 font-medium text-slate-800">2026-09-18</div></div>
      </div>
    </div>
  )

  const renderAudit = () => (
    <div className="space-y-3">
      {[
        'Protocol version updated by PI',
        'Consent form reissued after ethics review',
        'Monitoring findings escalated to site lead',
        'Safety event coded and reported to PV team',
      ].map((item, index) => (
        <div key={item} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-800">{item}</div>
          <div className="mt-1 text-xs text-slate-500">Audit event {index + 1} · 2026-09-19 12:4{index + 1} PM</div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        title={study.id}
        subtitle={study.title}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/participants', { state: { studyId: study.id } })}><FileText className="h-4 w-4" /> View participants</Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/visits', { state: { studyId: study.id } })}><Download className="h-4 w-4" /> Visit queue</Button>
            <Button variant="ghost" className="gap-2"><MoreHorizontal className="h-4 w-4" /> More</Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="text-sm text-slate-600">PI: <span className="font-medium text-slate-900">{study.principalInvestigator}</span></div>
        <div className="text-sm text-slate-600">Type: <span className="font-medium text-slate-900">{study.type}</span></div>
        <div className="text-sm text-slate-600">Phase: <span className="font-medium text-slate-900">{study.phase}</span></div>
        <StatusBadge status={study.status} />
        <RiskBadge risk={study.risk} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && renderOverview()}
      {activeTab === 'Sites' && renderSites()}
      {activeTab === 'Monitoring' && renderMonitoring()}
      {activeTab === 'Ethics' && renderEthics()}
      {activeTab === 'CTRI' && renderCtri()}
      {activeTab === 'Audit Trail' && renderAudit()}
    </div>
  )
}
