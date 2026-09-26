import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartCard } from '../components/ChartCard'
import { KpiCard } from '../components/KpiCard'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { enrollmentComparisonRows, enrollmentTrendData, siteEnrollmentData } from '../data/enrollment'

export function EnrollmentPage() {
  return (
    <div>
      <PageHeader title="Enrollment" subtitle="Portfolio participant intake and retention across active sites." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Enrolled" value="1,284" subtitle="of 2,000 target" accent="blue" />
        <KpiCard label="Target" value="2,000" subtitle="portfolio target" accent="slate" />
        <KpiCard label="Completion %" value="64%" subtitle="up 3.4%" accent="teal" />
        <KpiCard label="Enrollment Velocity" value="73" subtitle="participants / week" accent="amber" />
        <KpiCard label="Screened" value="1,775" subtitle="72% conversion" accent="red" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <ChartCard title="Enrollment Trend" subtitle="Actual versus target">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrendData}>
                  <defs>
                    <linearGradient id="enrollFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#123A6B" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#123A6B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="target" stroke="#94A3B8" fill="url(#enrollFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="actual" stroke="#123A6B" fill="rgba(18,58,107,0.06)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-4">
          <ChartCard title="Target vs Actual" subtitle="Site productivity overview">
            <div className="space-y-4">
              {siteEnrollmentData.slice(0, 6).map((item) => (
                <div key={item.site}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.site}</span>
                    <span className="text-slate-500">{item.actual}/{item.target}</span>
                  </div>
                  <ProgressBar value={(item.actual / item.target) * 100} tone="blue" />
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <ChartCard title="Site comparison table" subtitle="Structured comparison of site performance">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-3 font-semibold">Site</th>
                  <th className="px-3 py-3 font-semibold">Target</th>
                  <th className="px-3 py-3 font-semibold">Actual</th>
                  <th className="px-3 py-3 font-semibold">Progress</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentComparisonRows.map((row) => (
                  <tr key={row.site} className="border-t border-slate-200">
                    <td className="px-3 py-3 text-slate-800">{row.site}</td>
                    <td className="px-3 py-3 tabular-nums">{row.target}</td>
                    <td className="px-3 py-3 tabular-nums">{row.actual}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-32"><ProgressBar value={row.progress} tone="green" /></div>
                        <span className="text-xs text-slate-500">{row.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
