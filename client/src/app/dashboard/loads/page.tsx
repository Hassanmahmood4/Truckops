'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDashboardRole } from '@/hooks/useDashboardRole'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Load } from '@/types/fleet'

function statusLabel(s: string) {
  return s.replace(/_/g, ' ')
}

export default function LoadsPage() {
  const api = useFleetApi()
  const { isAdmin, isLoaded } = useDashboardRole()
  const [loads, setLoads] = useState<Load[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [weight, setWeight] = useState('')

  const refresh = useCallback(async () => {
    const l = await api.get<Load[]>('/api/loads')
    setLoads(l)
  }, [api])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load loads')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [refresh])

  async function onCreateLoad(e: FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      await api.post('/api/loads', {
        pickup_location: pickup,
        dropoff_location: dropoff,
        weight: weight ? Number(weight) : undefined,
      })
      setPickup('')
      setDropoff('')
      setWeight('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    }
  }

  async function setLoadStatus(id: string, status: Load['status']) {
    try {
      setError(null)
      await api.put(`/api/loads/${id}`, { status })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  async function onDelete(id: string) {
    if (!isAdmin) return
    if (!confirm('Delete this load?')) return
    try {
      setError(null)
      await api.delete(`/api/loads/${id}`)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Loads</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Create loads and track status through delivery.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New load</CardTitle>
            <CardDescription>Loads are associated with your signed-in account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onCreateLoad}>
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup</Label>
                <Input
                  id="pickup"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. 123 Industrial Blvd, Dallas, TX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoff">Dropoff</Label>
                <Input
                  id="dropoff"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="e.g. 900 Warehouse Rd, Houston, TX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (optional)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="any"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 42000 (lbs or your unit)"
                />
              </div>
              <Button type="submit" className="w-full">
                Create load
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Loads</CardTitle>
            <CardDescription>Use Quotes to price a load. Mark in transit, then delivered to complete.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Dropoff</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">
                      No loads yet. Create one with the form on the left.
                    </TableCell>
                  </TableRow>
                ) : null}
                {loads.map((load) => (
                  <TableRow key={load.id}>
                    <TableCell className="max-w-[180px] truncate">{load.pickup_location}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{load.dropoff_location}</TableCell>
                    <TableCell>{load.weight ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{statusLabel(load.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {load.status === 'assigned' ? (
                          <Button type="button" size="sm" variant="secondary" onClick={() => void setLoadStatus(load.id, 'in_transit')}>
                            In transit
                          </Button>
                        ) : null}
                        {load.status === 'in_transit' ? (
                          <Button type="button" size="sm" onClick={() => void setLoadStatus(load.id, 'delivered')}>
                            Delivered
                          </Button>
                        ) : null}
                        {load.status === 'assigned' || load.status === 'pending' ? (
                          <Button type="button" size="sm" variant="outline" onClick={() => void setLoadStatus(load.id, 'delivered')}>
                            Mark delivered
                          </Button>
                        ) : null}
                        {isLoaded && isAdmin ? (
                          <Button type="button" size="sm" variant="destructive" onClick={() => void onDelete(load.id)}>
                            Delete
                          </Button>
                        ) : null}
                      </div>
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
