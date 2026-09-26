import { monitoringFindings } from '../data/phase2'
import type { MonitoringFinding } from '../types'

export const monitoringService = {
  getFindings: (): MonitoringFinding[] => monitoringFindings.map((finding) => ({ ...finding })),
  getFindingById: (findingId: string) => monitoringFindings.find((finding) => finding.id === findingId) ?? null,
  updateFinding: (findingId: string, changes: Partial<MonitoringFinding>) => {
    const index = monitoringFindings.findIndex((finding) => finding.id === findingId)
    if (index === -1) return null
    monitoringFindings[index] = { ...monitoringFindings[index], ...changes }
    return monitoringFindings[index]
  },
}
