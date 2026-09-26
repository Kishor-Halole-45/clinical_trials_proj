import { FileText, ShieldCheck } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { Badge } from '../components/ui/badge'
import { ethicsSubmissions } from '../data/phase3'

export function EthicsSubmissionDetailPage() {
  const { submissionId } = useParams()
  const submission = ethicsSubmissions.find((item) => item.id === submissionId)

  if (!submission) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Submission not found.</div>
  }

  return (
    <div>
      <PageHeader title={submission.studyTitle} subtitle={`${submission.iec} · ${submission.submissionType}`} />

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">Submission Information</div>
            <StatusBadge status={submission.status} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Study</div><div className="mt-1 font-medium text-slate-800">{submission.studyId}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">IEC</div><div className="mt-1 font-medium text-slate-800">{submission.iec}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Submission type</div><div className="mt-1 font-medium text-slate-800">{submission.submissionType}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Version</div><div className="mt-1 font-medium text-slate-800">{submission.version}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Submitted date</div><div className="mt-1 font-medium text-slate-800">{submission.submissionDate}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Review date</div><div className="mt-1 font-medium text-slate-800">{submission.reviewDate}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Decision</div><div className="mt-1 font-medium text-slate-800">{submission.decision}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Approval validity</div><div className="mt-1 font-medium text-slate-800">{submission.approvalValidity}</div></div>
            <div><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Owner</div><div className="mt-1 font-medium text-slate-800">{submission.owner}</div></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Approval Tracking</div>
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Approval date</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{submission.approvalDate}</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Expiry date</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{submission.expiryDate}</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Days remaining</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{submission.daysRemaining}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900"><FileText className="h-5 w-5 text-slate-600" /> Documents</div>
          <div className="space-y-2">
            {submission.documents.map((document) => (
              <div key={document} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700">{document}</div>
            ))}
          </div>
          <div className="mt-5">
            <div className="text-sm font-medium text-slate-800">Comments</div>
            <div className="mt-2 space-y-2">
              {submission.comments.map((comment) => (
                <div key={comment} className="rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-600">{comment}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 text-lg font-semibold text-slate-900">Timeline</div>
          <div className="space-y-4">
            {[
              'Draft',
              'Submitted',
              'Under Review',
              'Committee Decision',
              'Approved / Rejected',
              'Renewal',
            ].map((stage, index) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{index + 1}</div>
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{stage}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Activity</div>
            <div className="mt-3 space-y-2">
              {submission.activity.map((entry) => (
                <div key={`${entry.time}-${entry.event}`} className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 text-sm text-slate-700">
                  <span>{entry.event}</span>
                  <Badge variant="neutral">{entry.time}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
