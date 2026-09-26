import { visits } from '../data/phase2'
import type { VisitRecord } from '../types'

export const visitService = {
  getVisits: (): VisitRecord[] => visits.map((visit) => ({ ...visit })),
  getVisitById: (visitId: string) => visits.find((visit) => visit.id === visitId) ?? null,
  getVisitsByStudy: (studyId?: string) => (studyId ? visits.filter((visit) => visit.studyId === studyId) : visits),
  createVisit: (input: Omit<VisitRecord, 'id'> & { id?: string }) => {
    const id = input.id ?? `VIS-${String(visits.length + 1).padStart(4, '0')}`
    const created = { ...input, id }
    visits.unshift(created)
    return created
  },
  updateVisit: (visitId: string, changes: Partial<VisitRecord>) => {
    const index = visits.findIndex((visit) => visit.id === visitId)
    if (index === -1) return null
    visits[index] = { ...visits[index], ...changes }
    return visits[index]
  },
}
