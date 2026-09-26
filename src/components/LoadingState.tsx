export function LoadingState({ message = 'Loading clinical data...' }: { message?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
        {message}
      </div>
    </div>
  )
}
