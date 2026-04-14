'use client'

import { useCallback, useEffect, useState } from 'react'

import { StatsCard } from '@/components/StatsCard'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { DashboardStats } from '@/types/fleet'

export default function DashboardPage() {
  const api = useFleetApi()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const data = await api.get<DashboardStats>('/api/stats')
    setStats(data)
  }, [api])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        setError(null)
        await load()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [load])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Overview</h1>
        <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          Operational snapshot for your fleet.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total drivers" value={stats ? String(stats.totalDrivers) : '—'} />
        <StatsCard title="Active loads" value={stats ? String(stats.activeLoads) : '—'} description="Pending, assigned, or in transit" />
        <StatsCard title="Completed deliveries" value={stats ? String(stats.completedDeliveries) : '—'} />
        <StatsCard title="Pending requests" value={stats ? String(stats.pendingRequests) : '—'} description="Awaiting review" />
      </div>
    </div>
  )
}
