'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDashboardRole } from '@/hooks/useDashboardRole'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Assignment, Driver, Load } from '@/types/fleet'

export default function AssignmentsPage() {
  const api = useFleetApi()
  const { isAdmin, isLoaded } = useDashboardRole()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loads, setLoads] = useState<Load[]>([])
  const [error, setError] = useState<string | null>(null)
  const [driverId, setDriverId] = useState('')
  const [loadId, setLoadId] = useState('')

  const refresh = useCallback(async () => {
    const [a, d, l] = await Promise.all([
      api.get<Assignment[]>('/api/assignments'),
      api.get<Driver[]>('/api/drivers'),
      api.get<Load[]>('/api/loads'),
    ])
    setAssignments(a)
    setDrivers(d)
    setLoads(l)
  }, [api])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load assignments')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [refresh])

  async function onAssign(e: FormEvent) {
    e.preventDefault()
    if (!isAdmin) return
    try {
      setError(null)
      await api.post('/api/assignments', { driver_id: driverId, load_id: loadId })
      setDriverId('')
      setLoadId('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assignment failed')
    }
  }

  const availableDrivers = drivers.filter((d) => d.status === 'available')
  const pendingLoads = loads.filter((l) => l.status === 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Assignments</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Pair available drivers with pending loads.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {isLoaded && isAdmin ? (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Assign</CardTitle>
              <CardDescription>Assigning sets the driver to busy and the load to assigned.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onAssign}>
                <div className="space-y-2">
                  <Label htmlFor="driver">Driver</Label>
                  <select
                    id="driver"
                    className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-black dark:border-gray-800 dark:bg-black dark:text-white"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    required
                    aria-label="Driver to assign"
                  >
                    <option value="">Choose an available driver…</option>
                    {availableDrivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="load">Load</Label>
                  <select
                    id="load"
                    className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-black dark:border-gray-800 dark:bg-black dark:text-white"
                    value={loadId}
                    onChange={(e) => setLoadId(e.target.value)}
                    required
                    aria-label="Pending load to assign"
                  >
                    <option value="">Choose a pending load…</option>
                    {pendingLoads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.pickup_location} → {l.dropoff_location}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Create assignment
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Assignment creation is limited to admins.</CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card className={isLoaded && isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CardHeader>
            <CardTitle>Active records</CardTitle>
            <CardDescription>Nested driver and load details from the API.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Load</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">
                      No assignments yet. When an admin pairs a driver with a pending load, rows appear here.
                    </TableCell>
                  </TableRow>
                ) : null}
                {assignments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.drivers?.name ?? a.driver_id}</TableCell>
                    <TableCell className="max-w-[320px] truncate">
                      {a.loads ? `${a.loads.pickup_location} → ${a.loads.dropoff_location}` : a.load_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
