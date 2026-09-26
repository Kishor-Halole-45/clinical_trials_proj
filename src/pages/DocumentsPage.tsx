import { Clock3, FileText, FolderArchive, ShieldCheck, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { documentLibrary } from '../data/phase3'

export function DocumentsPage() {
  const kpis = [
    { label: 'Total Documents', value: '248', subtitle: '+12 this quarter', accent: 'blue' as const, icon: <FileText className="h-4 w-4" /> },
    { label: 'Pending Approval', value: '13', subtitle: '5 high priority', accent: 'amber' as const, icon: <Clock3 className="h-4 w-4" /> },
    { label: 'Expiring', value: '9', subtitle: '2 in 7 days', accent: 'red' as const, icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'Recently Updated', value: '28', subtitle: 'week-over-week', accent: 'teal' as const, icon: <UploadCloud className="h-4 w-4" /> },
    { label: 'Drafts', value: '17', subtitle: '3 needing review', accent: 'slate' as const, icon: <FileText className="h-4 w-4" /> },
    { label: 'Archived', value: '42', subtitle: 'stable repository', accent: 'blue' as const, icon: <FolderArchive className="h-4 w-4" /> },
  ]

  return (
    <div>
      <PageHeader title="Document Management" subtitle="Clinical research document management across protocols, consent, approvals and regulatory submissions." />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} clickable />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900">Document Registry</div>
          <Badge variant="info">Version controlled</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-medium">Document ID</th>
                <th className="py-3 pr-4 font-medium">Document Name</th>
                <th className="py-3 pr-4 font-medium">Study</th>
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium">Version</th>
                <th className="py-3 pr-4 font-medium">Owner</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Created</th>
                <th className="py-3 pr-4 font-medium">Modified</th>
                <th className="py-3 pr-4 font-medium">Expiry</th>
                <th className="py-3 pr-4 font-medium">Approval</th>
              </tr>
            </thead>
            <tbody>
              {documentLibrary.map((document) => (
                <tr key={document.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 text-slate-600">{document.id}</td>
                  <td className="py-3 pr-4">
                    <Link to={`/documents/${document.id}`} className="font-medium text-slate-800 hover:text-primary">{document.name}</Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{document.study}</td>
                  <td className="py-3 pr-4 text-slate-600">{document.category}</td>
                  <td className="py-3 pr-4 text-slate-600">{document.version}</td>
                  <td className="py-3 pr-4 text-slate-600">{document.owner}</td>
                  <td className="py-3 pr-4"><StatusBadge status={document.status} /></td>
                  <td className="py-3 pr-4 text-slate-600">{document.created}</td>
                  <td className="py-3 pr-4 text-slate-600">{document.lastModified}</td>
                  <td className="py-3 pr-4 text-slate-600">{document.expiry}</td>
                  <td className="py-3 pr-4"><Badge variant={document.approval === 'Approved' ? 'success' : document.approval === 'In Review' ? 'warning' : 'neutral'}>{document.approval}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
