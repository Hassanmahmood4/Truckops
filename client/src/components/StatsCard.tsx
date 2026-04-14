import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatsCardProps = {
  title: string
  value: string
  description?: string
  className?: string
}

/** Minimal stat tile for dashboard overview. */
export function StatsCard({ title, value, description, className }: StatsCardProps) {
  return (
    <Card className={cn('border-gray-200 dark:border-gray-800', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums tracking-tight text-black dark:text-white">{value}</div>
        {description ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p> : null}
      </CardContent>
    </Card>
  )
}
