import { adverseEvents } from '../data/safety'
import type { AdverseEvent } from '../types'

export const adverseEventService = {
  getEvents: (): AdverseEvent[] => adverseEvents.map((event) => ({ ...event, auditTrail: [...event.auditTrail] })),
  getEventById: (eventId: string) => adverseEvents.find((event) => event.id === eventId) ?? null,
  createEvent: (input: Omit<AdverseEvent, 'id' | 'lastUpdated' | 'auditTrail'> & { id?: string }) => {
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
          reason: 'Created from the adverse event form',
        },
      ],
    }
    adverseEvents.unshift(created)
    return created
  },
  updateEvent: (eventId: string, changes: Partial<AdverseEvent>) => {
    const index = adverseEvents.findIndex((event) => event.id === eventId)
    if (index === -1) return null
    adverseEvents[index] = { ...adverseEvents[index], ...changes }
    return adverseEvents[index]
  },
}
