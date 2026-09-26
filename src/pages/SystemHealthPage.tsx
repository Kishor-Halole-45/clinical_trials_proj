import { Activity, Database, Gauge, HeartPulse, Server, ShieldCheck } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/badge'

const services = [
  { name: 'Application', status: 'Operational', detail: 'UI and routing stable', icon: Server, tone: 'success' },
  { name: 'Data Layer', status: 'Operational', detail: 'Demonstration dataset synced', icon: Database, tone: 'success' },
  { name: 'Search Index', status: 'Warning', detail: 'Recent updates pending indexing', icon: Gauge, tone: 'warning' },
  { name: 'FHIR Exchange', status: 'Operational', detail: 'Last bundle exchanged 2 minutes ago', icon: HeartPulse, tone: 'success' },
  { name: 'Audit Engine', status: 'Operational', detail: 'Events captured successfully', icon: ShieldCheck, tone: 'success' },
  { name: 'Simulation Service', status: 'Demo Simulation', detail: 'Synthetic events flowing normally', icon: Activity, tone: 'neutral' },
]

export function SystemHealthPage() {
  return (
    <div>
      <PageHeader
        title="System Health"
        subtitle="Operational status for the demo environment, data layer, exchange services, and audit controls."
        actions={<Badge variant="success">All core services healthy</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map(({ name, status, detail, icon: Icon, tone }) => (
          <div key={name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold text-slate-800">{name}</div>
              </div>
              <Badge variant={tone === 'warning' ? 'warning' : tone === 'neutral' ? 'neutral' : 'success'}>{status}</Badge>
            </div>
            <div className="text-sm text-slate-600">{detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
