import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-white">A</div>
            <div className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">AIIA CTMS</div>
            <div className="mt-1 text-sm text-slate-500">Clinical Research Command Center</div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Principal Investigator access</div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Role-aware portfolio dashboard</div>
            <Button className="w-full">Continue to platform</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
