import { safetySignals } from '../data/safety'
import type { SafetySignal } from '../types'

export const safetySignalService = {
  getSignals: (): SafetySignal[] => safetySignals.map((signal) => ({ ...signal, auditTrail: [...signal.auditTrail] })),
  getSignalById: (signalId: string) => safetySignals.find((signal) => signal.id === signalId) ?? null,
  updateSignal: (signalId: string, changes: Partial<SafetySignal>) => {
    const index = safetySignals.findIndex((signal) => signal.id === signalId)
    if (index === -1) return null
    safetySignals[index] = { ...safetySignals[index], ...changes }
    return safetySignals[index]
  },
}
