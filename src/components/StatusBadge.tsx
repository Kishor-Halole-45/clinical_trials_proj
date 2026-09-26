import { Badge } from './ui/badge'

export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
    Healthy: 'success',
    'On Track': 'success',
    'Site Activation': 'info',
    Recruiting: 'info',
    Active: 'success',
    Completed: 'success',
    'At Risk': 'warning',
    Delayed: 'critical',
    Scheduled: 'neutral',
    Overdue: 'critical',
    Completed2: 'success',
    'Ethics Pending': 'warning',
    'CTRI Pending': 'warning',
    'Monitoring Due': 'warning',
    'Watch': 'warning',
    'Critical': 'critical',
    'Planning': 'neutral',
    'Recruiting Sites': 'info',
    'Low': 'success',
    'Moderate': 'warning',
    'High': 'critical',
  }

  return <Badge variant={variantMap[status] ?? 'neutral'}>{status}</Badge>
}
