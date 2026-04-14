'use client'

import { useEffect, useState } from 'react'
import { Package, Truck, Waypoints } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Assignment, Driver, Load } from '@/types/fleet'

export default function DashboardPage() {
  const api = useFleetApi()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loads, setLoads] = useState<Load[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        const [d, l, a] = await Promise.all([
          api.get<Driver[]>('/api/drivers'),
          api.get<Load[]>('/api/loads'),
          api.get<Assignment[]>('/api/assignments'),
        ])
        if (!cancelled) {
          setDrivers(d)
          setLoads(l)
          setAssignments(a)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [api])

  const availableDrivers = drivers.filter((x) => x.status === 'available').length
  const pendingLoads = loads.filter((x) => x.status === 'pending').length
  const activeAssignments = assignments.filter((x) => x.status === 'active').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Overview</h1>
        <p className="mt-1 text-sm leading-relaxed text-neutral-500">Operational snapshot for your fleet.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Available drivers</CardTitle>
            <Truck className="size-4 text-neutral-400" strokeWidth={1.75} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-neutral-950">{availableDrivers}</div>
            <CardDescription>of {drivers.length} total</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Pending loads</CardTitle>
            <Package className="size-4 text-neutral-400" strokeWidth={1.75} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-neutral-950">{pendingLoads}</div>
            <CardDescription>awaiting assignment</CardDescription>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Active assignments</CardTitle>
            <Waypoints className="size-4 text-neutral-400" strokeWidth={1.75} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-neutral-950">{activeAssignments}</div>
            <CardDescription>in progress</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
