import { AlertCircle } from 'lucide-react'

export function ErrorState({ title = 'Something went wrong', description = 'Please retry or contact system support.' }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-2 text-red-700">
        <AlertCircle className="h-5 w-5" />
        <div className="font-medium">{title}</div>
        <div className="text-sm text-red-600">{description}</div>
      </div>
    </div>
  )
}
