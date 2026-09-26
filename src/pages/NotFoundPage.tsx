import { Link } from 'react-router-dom'

import { Button } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">404</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The route you requested is not available in this CTMS portfolio.</p>
        <Link to="/dashboard" className="mt-5 inline-block">
          <Button>Return to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
