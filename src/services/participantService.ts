import { participants } from '../data/phase2'
import type { Participant } from '../types'

const copy = () => participants.map((participant) => ({ ...participant, timeline: participant.timeline.map((item) => ({ ...item })) }))

export const participantService = {
  getParticipants: (): Participant[] => copy(),
  getParticipantById: (participantId: string) => copy().find((participant) => participant.id === participantId) ?? null,
  getParticipantsByStudy: (studyId?: string) => (studyId ? copy().filter((participant) => participant.studyId === studyId) : copy()),
  createParticipant: (input: Omit<Participant, 'id'> & { id?: string }) => {
    const id = input.id ?? `PT-${String(participants.length + 1).padStart(5, '0')}`
    const created = { ...input, id, protocolDeviations: input.protocolDeviations ?? 0, safetyEvents: input.safetyEvents ?? 0, dataCompleteness: input.dataCompleteness ?? 92 }
    participants.unshift(created)
    return created
  },
  updateParticipant: (participantId: string, update: Partial<Participant>) => {
    const index = participants.findIndex((participant) => participant.id === participantId)
    if (index === -1) return null
    const updated = { ...participants[index], ...update }
    participants[index] = updated
    return updated
  },
}
