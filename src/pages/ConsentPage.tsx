import { FileCheck2, FileClock, ShieldAlert, Users, UserX } from 'lucide-react'
import { Link } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { consentRecords } from '../data/phase3'

export function ConsentPage() {
  const kpis = [
    { label: 'Valid Consents', value: '742', subtitle: '94% coverage', accent: 'teal' as const, icon: <FileCheck2 className="h-4 w-4" /> },
    { label: 'Pending Consent', value: '18', subtitle: '4 due this week', accent: 'amber' as const, icon: <FileClock className="h-4 w-4" /> },
    { label: 'Re-consent Required', value: '11', subtitle: '2 urgent', accent: 'red' as const, icon: <ShieldAlert className="h-4 w-4" /> },
    { label: 'Expired', value: '6', subtitle: 'requires action', accent: 'red' as const, icon: <UserX className="h-4 w-4" /> },
    { label: 'Missing Documentation', value: '4', subtitle: 'site follow-up', accent: 'slate' as const, icon: <Users className="h-4 w-4" /> },
  ]

  return (
    <div>
      <PageHeader title="Informed Consent Management" subtitle="Monitor consent versions, participant consent status and re-consent requirements." />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 text-lg font-semibold text-slate-900">Consent Register</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">Participant ID</th>
                <th className="py-3 pr-4 font-medium">Study</th>
                <th className="py-3 pr-4 font-medium">Site</th>
                <th className="py-3 pr-4 font-medium">Consent Version</th>
                <th className="py-3 pr-4 font-medium">Consent Date</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Re-consent</th>
                <th className="py-3 pr-4 font-medium">Document</th>
                <th className="py-3 pr-4 font-medium">Verified By</th>
              </tr>
            </thead>
            <tbody>
              {consentRecords.map((record) => (
                <tr key={record.participantId} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4">
                    <Link to={`/consent/${record.participantId}`} className="font-medium text-slate-800 hover:text-primary">{record.participantId}</Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{record.study}</td>
                  <td className="py-3 pr-4 text-slate-600">{record.site}</td>
                  <td className="py-3 pr-4 text-slate-600">{record.consentVersion}</td>
                  <td className="py-3 pr-4 text-slate-600">{record.consentDate}</td>
                  <td className="py-3 pr-4"><StatusBadge status={record.status} /></td>
                  <td className="py-3 pr-4"><Badge variant={record.reConsentRequired === 'Yes' ? 'warning' : 'success'}>{record.reConsentRequired}</Badge></td>
                  <td className="py-3 pr-4 text-slate-600">{record.document}</td>
                  <td className="py-3 pr-4 text-slate-600">{record.verifiedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
