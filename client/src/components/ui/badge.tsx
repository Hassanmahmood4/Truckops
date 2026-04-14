import * as React from 'react'

import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize',
        variant === 'default' && 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100',
        variant === 'outline' && 'border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300',
        className,
      )}
      {...props}
    />
  )
}
