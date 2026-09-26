import { Badge } from './ui/badge'

export function RiskBadge({ risk }: { risk: string }) {
  const variantMap: Record<string, 'success' | 'warning' | 'critical' | 'neutral'> = {
    Low: 'success',
    Moderate: 'warning',
    High: 'critical',
  }

  return <Badge variant={variantMap[risk] ?? 'neutral'}>{risk}</Badge>
}
