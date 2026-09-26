import { FileCheck2 } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { documentLibrary } from '../data/phase3'

export function DocumentDetailPage() {
  const { documentId } = useParams()
  const document = documentLibrary.find((item) => item.id === documentId)

  if (!document) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Document not found.</div>
  }

  const handleAction = (action: string) => {
    window.confirm(`${action} for ${document.name}?`)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">{document.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{document.study} · {document.category}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => handleAction('Upload New Version')}>Upload New Version</Button>
          <Button variant="outline" onClick={() => handleAction('Submit for Approval')}>Submit for Approval</Button>
          <Button variant="outline" onClick={() => handleAction('Approve')}>Approve</Button>
          <Button variant="outline" onClick={() => handleAction('Reject')}>Reject</Button>
          <Button variant="outline" onClick={() => handleAction('Archive')}>Archive</Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 text-lg font-semibold text-slate-900">Document metadata</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Current version</div><div className="mt-1 font-medium text-slate-800">{document.version}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Owner</div><div className="mt-1 font-medium text-slate-800">{document.owner}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</div><div className="mt-1"><Badge variant={document.status === 'Approved' ? 'success' : 'warning'}>{document.status}</Badge></div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Approval</div><div className="mt-1"><Badge variant={document.approval === 'Approved' ? 'success' : 'warning'}>{document.approval}</Badge></div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Created</div><div className="mt-1 font-medium text-slate-800">{document.created}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Last modified</div><div className="mt-1 font-medium text-slate-800">{document.lastModified}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Linked study</div><div className="mt-1 font-medium text-slate-800">{document.study}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Linked regulatory submission</div><div className="mt-1 font-medium text-slate-800">N/A</div></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-lg font-semibold text-slate-900">Approval workflow</div>
          <div className="space-y-3">
            {['Draft', 'Submitted', 'Review', 'Approved', 'Archive'].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{index + 1}</div>
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><FileCheck2 className="h-5 w-5 text-emerald-600" /> Version history</div>
        <div className="space-y-3">
          {document.versions.map((version) => (
            <div key={`${document.id}-${version.version}`} className="rounded-xl border border-slate-200 p-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-900">Version {version.version}</div>
                  <div className="text-xs text-slate-500">{version.label}</div>
                </div>
                <Badge variant={version.label === 'Current' ? 'success' : 'neutral'}>{version.label}</Badge>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3 text-sm text-slate-600">
                <div><span className="text-slate-500">Version author:</span> {version.author}</div>
                <div><span className="text-slate-500">Version date:</span> {version.date}</div>
                <div><span className="text-slate-500">Approval status:</span> {document.status}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">Change summary: {version.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
