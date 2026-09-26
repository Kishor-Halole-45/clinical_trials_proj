import type { AppUser } from '../types'

export const rolePermissions: Record<AppUser['role'], string[]> = {
  PI: ['View portfolio', 'Approve milestones', 'Review safety signals', 'Manage study oversight'],
  Coordinator: ['Manage study operations', 'Track enrollments', 'Coordinate monitoring', 'Maintain documentation'],
  Monitor: ['Review site compliance', 'Log findings', 'Track visit completion', 'Escalate deviations'],
  Ethics: ['Review ethics submissions', 'Track approvals', 'Monitor consent compliance', 'Assess safety risks'],
  Pharmacovigilance: ['Review SAE reports', 'Code adverse events', 'Escalate safety alerts', 'ICSR reporting'],
  'Data Manager': ['Map source data to FHIR', 'Validate terminologies', 'Generate exchange bundles', 'Monitor interoperability quality'],
  Admin: ['Manage users', 'Access audit trails', 'Configure system settings', 'Export reports'],
  Regulator: ['Read-only oversight', 'Review compliance indicators', 'Access approved submissions', 'Audit trail view'],
}

export const users: AppUser[] = [
  {
    id: 'u-001',
    name: 'Clinical Operations Lead',
    role: 'PI',
    permissions: rolePermissions.PI,
  },
  {
    id: 'u-002',
    name: 'Study Coordinator',
    role: 'Coordinator',
    permissions: rolePermissions.Coordinator,
  },
  {
    id: 'u-003',
    name: 'Site Monitor',
    role: 'Monitor',
    permissions: rolePermissions.Monitor,
  },
  {
    id: 'u-004',
    name: 'Ethics Reviewer',
    role: 'Ethics',
    permissions: rolePermissions.Ethics,
  },
  {
    id: 'u-005',
    name: 'Safety Reviewer',
    role: 'Pharmacovigilance',
    permissions: rolePermissions.Pharmacovigilance,
  },
  {
    id: 'u-006',
    name: 'System Admin',
    role: 'Admin',
    permissions: rolePermissions.Admin,
  },
  {
    id: 'u-007',
    name: 'Regulatory Analyst',
    role: 'Regulator',
    permissions: rolePermissions.Regulator,
  },
]

export const currentUser = users[0]
