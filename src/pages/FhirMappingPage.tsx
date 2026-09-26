import { useState } from 'react'
import { Database, Plus } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { fhirService } from '../services/fhirService'

const initialForm = {
  sourceField: 'participants[].status',
  targetField: 'ResearchSubject.status',
  sourceSystem: 'CTMS',
  targetSystem: 'FHIR R4',
  transformation: 'Normalize status and align with research subject lifecycle',
  mappingType: 'Derived' as const,
  owner: 'Data Manager',
}

export function FhirMappingPage() {
  const [mappings, setMappings] = useState(fhirService.getMappings())
  const [form, setForm] = useState(initialForm)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const created = fhirService.createMapping({
      sourceField: form.sourceField,
      targetField: form.targetField,
      sourceSystem: form.sourceSystem,
      targetSystem: form.targetSystem,
      transformation: form.transformation,
      mappingType: form.mappingType,
      status: 'Draft',
      owner: form.owner,
    })
    setMappings((previous) => [created, ...previous])
    setForm(initialForm)
  }

  const handleStatusUpdate = (mappingId: string, status: (typeof mappings)[number]['status']) => {
    const updated = fhirService.updateMappingStatus(mappingId, status)
    if (!updated) return
    setMappings((previous) => previous.map((mapping) => mapping.id === mappingId ? updated : mapping))
  }

  return (
    <div>
      <PageHeader
        title="FHIR mapping workspace"
        subtitle="Source-to-target transformations for participant, consent, and study era data"
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-800"><Plus className="h-4 w-4" /> Add transformation</div>
              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Source field</label>
                  <input value={form.sourceField} onChange={(e) => setForm((current) => ({ ...current, sourceField: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Target field</label>
                  <input value={form.targetField} onChange={(e) => setForm((current) => ({ ...current, targetField: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Source system</label>
                    <input value={form.sourceSystem} onChange={(e) => setForm((current) => ({ ...current, sourceSystem: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Target system</label>
                    <input value={form.targetSystem} onChange={(e) => setForm((current) => ({ ...current, targetSystem: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Transformation</label>
                  <textarea value={form.transformation} onChange={(e) => setForm((current) => ({ ...current, transformation: e.target.value }))} rows={3} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Mapping type</label>
                    <select value={form.mappingType} onChange={(e) => setForm((current) => ({ ...current, mappingType: e.target.value as typeof form.mappingType }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary">
                      <option value="Direct">Direct</option>
                      <option value="Derived">Derived</option>
                      <option value="Lookup">Lookup</option>
                      <option value="CodeMap">CodeMap</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Owner</label>
                    <input value={form.owner} onChange={(e) => setForm((current) => ({ ...current, owner: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-primary" />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2"><Plus className="h-4 w-4" /> Save mapping</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800"><Database className="h-4 w-4" /> Active mappings</div>
                <div className="text-xs text-slate-500">{mappings.length} definitions</div>
              </div>
              <div className="space-y-3">
                {mappings.map((mapping) => (
                  <div key={mapping.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{mapping.sourceField} → {mapping.targetField}</div>
                        <div className="mt-1 text-xs text-slate-500">{mapping.mappingType} · {mapping.owner}</div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${mapping.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : mapping.status === 'Needs Review' ? 'bg-amber-100 text-amber-700' : mapping.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                        {mapping.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-slate-600">{mapping.transformation}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleStatusUpdate(mapping.id, 'Validated')} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">Validate</button>
                      <button type="button" onClick={() => handleStatusUpdate(mapping.id, 'Needs Review')} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">Needs review</button>
                      <button type="button" onClick={() => handleStatusUpdate(mapping.id, 'Rejected')} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
