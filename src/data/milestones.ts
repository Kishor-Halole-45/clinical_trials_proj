import type { Milestone } from '../types'

export const milestones: Milestone[] = [
  { id: 'MS-001', name: 'Protocol Finalized', plannedDate: '2026-01-12', actualDate: '2026-01-10', variance: '+2d', status: 'Completed', phase: 'Study setup' },
  { id: 'MS-002', name: 'IEC Submission', plannedDate: '2026-01-18', actualDate: '2026-01-22', variance: '-4d', status: 'Completed', phase: 'Regulatory' },
  { id: 'MS-003', name: 'IEC Approval', plannedDate: '2026-02-09', actualDate: '2026-02-11', variance: '-2d', status: 'Completed', phase: 'Ethics' },
  { id: 'MS-004', name: 'CTRI Registration', plannedDate: '2026-02-20', actualDate: '2026-02-18', variance: '+2d', status: 'Completed', phase: 'Registry' },
  { id: 'MS-005', name: 'Site Activation', plannedDate: '2026-03-15', actualDate: '2026-03-20', variance: '-5d', status: 'On Track', phase: 'Sites' },
  { id: 'MS-006', name: 'First Participant', plannedDate: '2026-04-02', actualDate: '2026-04-06', variance: '-4d', status: 'Completed', phase: 'Recruitment' },
  { id: 'MS-007', name: 'Recruitment', plannedDate: '2026-07-28', actualDate: '2026-08-05', variance: '-8d', status: 'At Risk', phase: 'Enrollment' },
  { id: 'MS-008', name: 'Last Participant', plannedDate: '2026-09-15', actualDate: undefined, variance: '10d', status: 'Delayed', phase: 'Completion' },
  { id: 'MS-009', name: 'Database Lock', plannedDate: '2026-10-03', actualDate: undefined, variance: '14d', status: 'Delayed', phase: 'Data' },
  { id: 'MS-010', name: 'Analysis', plannedDate: '2026-10-25', actualDate: undefined, variance: '7d', status: 'On Track', phase: 'Statistics' },
  { id: 'MS-011', name: 'Close-out', plannedDate: '2026-11-08', actualDate: undefined, variance: '0d', status: 'On Track', phase: 'Administration' },
]

export const milestoneOverview = [
  { label: 'Completed', value: 6 },
  { label: 'On Track', value: 3 },
  { label: 'At Risk', value: 1 },
  { label: 'Delayed', value: 2 },
]
