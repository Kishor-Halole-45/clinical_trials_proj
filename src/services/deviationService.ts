import { capAs, deviations } from '../data/phase2'
import type { CAPA, ProtocolDeviation } from '../types'

export const deviationService = {
  getDeviations: (): ProtocolDeviation[] => deviations.map((deviation) => ({ ...deviation })),
  getDeviationById: (deviationId: string) => deviations.find((deviation) => deviation.id === deviationId) ?? null,
  getCAPAs: (): CAPA[] => capAs.map((capa) => ({ ...capa })),
  createDeviation: (input: Omit<ProtocolDeviation, 'id'>) => {
    const id = `DEV-${String(deviations.length + 1).padStart(4, '0')}`
    const created = { ...input, id }
    deviations.push(created)
    return created
  },
  updateDeviation: (deviationId: string, changes: Partial<ProtocolDeviation>) => {
    const index = deviations.findIndex((deviation) => deviation.id === deviationId)
    if (index === -1) return null
    deviations[index] = { ...deviations[index], ...changes }
    return deviations[index]
  },
  createCAPA: (input: Omit<CAPA, 'id'>) => {
    const id = `CAPA-${String(capAs.length + 1).padStart(4, '0')}`
    const created = { ...input, id }
    capAs.push(created)
    return created
  },
}
