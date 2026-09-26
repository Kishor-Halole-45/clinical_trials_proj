import { useState } from 'react'

import { AlertCard } from '../components/AlertCard'
import { PageHeader } from '../components/PageHeader'
import { alerts } from '../data/alerts'
import { Button } from '../components/ui/button'

export function AlertsPage() {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All')

  const visibleAlerts = filter === 'All' ? alerts : alerts.filter((item) => item.severity === filter)

  return (
    <div>
      <PageHeader title="Alert Center" subtitle="Clinical, safety and regulatory risk triage across the portfolio." />

      <div className="mb-5 flex flex-wrap gap-2">
        {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((value) => (
          <Button
            key={value}
            variant={filter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {value}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  )
}
