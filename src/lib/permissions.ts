import type { AppUser, RoleName } from '../types'

export type ModuleName = 'participants' | 'visits' | 'deviations' | 'data-quality' | 'monitoring'

export const moduleAccess: Record<ModuleName, RoleName[]> = {
  participants: ['PI', 'Coordinator', 'Monitor', 'Admin'],
  visits: ['PI', 'Coordinator', 'Monitor', 'Admin'],
  deviations: ['PI', 'Coordinator', 'Ethics', 'Admin', 'Monitor'],
  'data-quality': ['PI', 'Coordinator', 'Admin', 'Monitor'],
  monitoring: ['PI', 'Monitor', 'Admin'],
}

export function canAccessModule(role: AppUser['role'], module: ModuleName) {
  return moduleAccess[module].includes(role)
}
