import { adverseEvents, dsmbMeetings, safetyFollowUps, safetyNotifications, safetySignals, safetySummary } from '../data/safety'
import type { AdverseEvent, DSMBMeeting, SafetyFollowUp, SafetyNotification, SafetySignal, SafetySummary } from '../types'

const clone = <T,>(items: T[]) => items.map((item) => ({ ...item }))

export const pharmacovigilanceService = {
  getSummary: (): SafetySummary => ({ ...safetySummary }),
  getAdverseEvents: (): AdverseEvent[] => clone(adverseEvents),
  getAdverseEventById: (eventId: string) => adverseEvents.find((event) => event.id === eventId) ?? null,
  updateAdverseEvent: (eventId: string, changes: Partial<AdverseEvent>) => {
    const index = adverseEvents.findIndex((event) => event.id === eventId)
    if (index === -1) return null
    adverseEvents[index] = { ...adverseEvents[index], ...changes }
    return adverseEvents[index]
  },
  createAdverseEvent: (input: Omit<AdverseEvent, 'id' | 'lastUpdated' | 'auditTrail'> & { id?: string }) => {
    const nextId = input.id ?? `AE-${String(adverseEvents.length + 1).padStart(4, '0')}`
    const created: AdverseEvent = {
      ...input,
      id: nextId,
      lastUpdated: new Date().toISOString().slice(0, 10),
      auditTrail: [
        {
          id: `AUD-${Date.now()}`,
          actor: input.reporter,
          action: 'Reported',
          entity: nextId,
          timestamp: new Date().toISOString(),
          reason: 'New event created from safety workflow',
        },
      ],
    }
    adverseEvents.unshift(created)
    return created
  },
  getFollowUps: (): SafetyFollowUp[] => clone(safetyFollowUps),
  getFollowUpById: (id: string) => safetyFollowUps.find((item) => item.id === id) ?? null,
  createFollowUp: (input: SafetyFollowUp) => {
    safetyFollowUps.unshift(input)
    return input
  },
  updateFollowUp: (followUpId: string, changes: Partial<SafetyFollowUp>) => {
    const index = safetyFollowUps.findIndex((item) => item.id === followUpId)
    if (index === -1) return null
    safetyFollowUps[index] = { ...safetyFollowUps[index], ...changes }
    return safetyFollowUps[index]
  },
  getSignals: (): SafetySignal[] => clone(safetySignals),
  getSignalById: (signalId: string) => safetySignals.find((signal) => signal.id === signalId) ?? null,
  updateSignal: (signalId: string, changes: Partial<SafetySignal>) => {
    const index = safetySignals.findIndex((signal) => signal.id === signalId)
    if (index === -1) return null
    safetySignals[index] = { ...safetySignals[index], ...changes }
    return safetySignals[index]
  },
  getDsmbMeetings: (): DSMBMeeting[] => clone(dsmbMeetings),
  getDsmbMeetingById: (meetingId: string) => dsmbMeetings.find((meeting) => meeting.id === meetingId) ?? null,
  updateDsmbMeeting: (meetingId: string, changes: Partial<DSMBMeeting>) => {
    const index = dsmbMeetings.findIndex((meeting) => meeting.id === meetingId)
    if (index === -1) return null
    dsmbMeetings[index] = { ...dsmbMeetings[index], ...changes }
    return dsmbMeetings[index]
  },
  getNotifications: (): SafetyNotification[] => clone(safetyNotifications),
  addNotification: (item: SafetyNotification) => {
    safetyNotifications.unshift(item)
    return item
  },
}
