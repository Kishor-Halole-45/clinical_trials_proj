import { Download, FileText, FileUp, Sparkles } from 'lucide-react'
import { jsPDF } from 'jspdf'

import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const reports = [
  { title: 'Executive Portfolio Report', type: 'PDF', status: 'Ready', summary: 'Portfolio overview with KPI, site, and safety trends.' },
  { title: 'Study Status Snapshot', type: 'CSV', status: 'Updated', summary: 'Current enrollment, milestones, and deviation status for active trials.' },
  { title: 'Safety Summary', type: 'JSON', status: 'Queued', summary: 'AE, SAE, and signal summaries for pharmacovigilance review.' },
  { title: 'Data Quality Report', type: 'PDF', status: 'Ready', summary: 'Open queries, monitoring findings, and data completeness indicators.' },
]

function drawBarChart(doc: jsPDF, x: number, y: number, width: number, height: number, values: number[]) {
  const max = Math.max(...values, 100)
  const spacing = width / values.length

  values.forEach((value, index) => {
    const barHeight = (value / max) * height
    const barX = x + index * spacing + 10
    const barY = y + height - barHeight

    doc.setFillColor(index % 2 === 0 ? 34 : 56, 211, 238)
    doc.roundedRect(barX, barY, spacing - 18, barHeight, 4, 4, 'F')
  })

  doc.setDrawColor(148, 163, 184)
  doc.setLineWidth(0.5)
  doc.line(x, y + height, x + width, y + height)
}

function buildPdfReport(report: (typeof reports)[number]) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageWidth, 120, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('AIIA Clinical Analytics Report', 40, 52)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(148, 163, 184)
  doc.text(report.title, 40, 72)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 88)

  const metrics = [
    { label: 'Enrollment', value: '1,284', color: [34, 211, 238] },
    { label: 'Sites', value: '14', color: [96, 165, 250] },
    { label: 'Safety', value: '2 alerts', color: [52, 211, 153] },
    { label: 'Data QC', value: '95%', color: [251, 191, 36] },
  ]

  metrics.forEach((metric, index) => {
    const x = 40 + index * 120
    const y = 140
    doc.setFillColor(15, 23, 42)
    doc.roundedRect(x, y, 100, 58, 10, 10, 'F')
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(0.6)
    doc.roundedRect(x, y, 100, 58, 10, 10, 'S')
    doc.setTextColor(metric.color[0], metric.color[1], metric.color[2])
    doc.setFontSize(11)
    doc.text(metric.label, x + 12, y + 18)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(metric.value, x + 12, y + 40)
  })

  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Portfolio trend overview', 40, 235)

  drawBarChart(doc, 40, 250, 240, 110, [68, 74, 82, 88, 93, 98])
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)
  doc.text('Q1', 52, 376)
  doc.text('Q2', 92, 376)
  doc.text('Q3', 132, 376)
  doc.text('Q4', 172, 376)
  doc.text('Current', 210, 376)

  doc.setFillColor(248, 250, 252)
  doc.roundedRect(305, 250, 220, 120, 12, 12, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Key insights', 325, 276)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const insights = [
    '• Enrollment is tracking above plan in 3 of 5 active cohorts.',
    '• Safety review completion remains within SLA thresholds.',
    '• Monitoring findings are stable with no critical escalation.',
    '• Data quality remains above 95% completion across study set.',
  ]

  insights.forEach((line, index) => {
    doc.text(line, 325, 300 + index * 18)
  })

  doc.setFillColor(239, 246, 255)
  doc.roundedRect(40, 410, 485, 130, 12, 12, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Executive summary', 60, 438)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  const summaryText = [
    'The current portfolio is exhibiting a stable clinical operations profile with continued enrollment momentum',
    'and strong data completeness. Operational risk remains contained, while monitoring and safety oversight continue',
    'to meet internal review expectations. The report reflects the most recent synthetic study data and the current',
    'portfolio controls within the AIIA research environment.',
  ]

  summaryText.forEach((line, index) => {
    doc.text(line, 60, 462 + index * 18)
  })

  doc.setTextColor(71, 85, 105)
  doc.setFontSize(9)
  doc.text(`Report: ${report.title}`, 40, pageHeight - 32)
  doc.text('Status: Ready for review', pageWidth - 130, pageHeight - 32)

  return doc
}

export function ReportsPage() {
  const handleDownload = (report: (typeof reports)[number]) => {
    if (report.type === 'PDF') {
      const doc = buildPdfReport(report)
      const fileName = `${report.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
      doc.save(fileName)
      return
    }

    const payload = {
      title: report.title,
      type: report.type,
      summary: report.summary,
      generatedAt: new Date().toISOString(),
    }

    const fileExtension = report.type.toLowerCase()
    const content = report.type === 'JSON' ? JSON.stringify(payload, null, 2) : `title,type,summary,generatedAt\n${report.title},${report.type},${report.summary},${payload.generatedAt}`
    const mimeType = report.type === 'JSON' ? 'application/json' : 'text/csv'
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const handlePreview = (report: (typeof reports)[number]) => {
    if (report.type === 'PDF') {
      const doc = buildPdfReport(report)
      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    window.alert(`${report.title}\n\n${report.summary}`)
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and download portfolio, study, safety, and compliance reports based on current demo data."
        actions={
          <Button variant="default" onClick={() => handleDownload(reports[0])}>
            <FileUp className="h-4 w-4" />
            Generate report
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Reports ready</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">12</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Queued</div>
          <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-900">3</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Last export</div>
          <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-900">2h ago</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Format coverage</div>
          <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-900">PDF / CSV / JSON</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <div key={report.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{report.title}</div>
                  <div className="text-xs text-slate-500">{report.type}</div>
                </div>
              </div>
              <Badge variant={report.status === 'Ready' ? 'success' : 'neutral'}>{report.status}</Badge>
            </div>
            <div className="mb-4 text-sm text-slate-600">{report.summary}</div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => handlePreview(report)}>
                <Sparkles className="h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload(report)}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
