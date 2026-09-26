import { dsmbMeetings } from '../data/safety'
import type { DSMBMeeting } from '../types'

export const dsmbService = {
  getMeetings: (): DSMBMeeting[] => dsmbMeetings.map((meeting) => ({ ...meeting, decisions: [...meeting.decisions] })),
  getMeetingById: (meetingId: string) => dsmbMeetings.find((meeting) => meeting.id === meetingId) ?? null,
  updateMeeting: (meetingId: string, changes: Partial<DSMBMeeting>) => {
    const index = dsmbMeetings.findIndex((meeting) => meeting.id === meetingId)
    if (index === -1) return null
    dsmbMeetings[index] = { ...dsmbMeetings[index], ...changes }
    return dsmbMeetings[index]
  },
}
