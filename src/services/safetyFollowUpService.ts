import { safetyFollowUps } from '../data/safety'
import type { SafetyFollowUp } from '../types'

export const safetyFollowUpService = {
  getFollowUps: (): SafetyFollowUp[] => safetyFollowUps.map((item) => ({ ...item })),
  getFollowUpById: (id: string) => safetyFollowUps.find((item) => item.id === id) ?? null,
  createFollowUp: (input: SafetyFollowUp) => {
    safetyFollowUps.unshift(input)
    return input
  },
  updateFollowUp: (id: string, changes: Partial<SafetyFollowUp>) => {
    const index = safetyFollowUps.findIndex((item) => item.id === id)
    if (index === -1) return null
    safetyFollowUps[index] = { ...safetyFollowUps[index], ...changes }
    return safetyFollowUps[index]
  },
}
