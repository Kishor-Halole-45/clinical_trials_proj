import * as React from 'react'

import { cn } from '../../lib/utils'

const badgeStyles = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  critical: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export function Badge({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode
  className?: string
  variant?: keyof typeof badgeStyles
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-[11px] font-medium tracking-[0.02em]',
        badgeStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
