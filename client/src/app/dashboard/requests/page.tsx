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
import type { LoadRequest } from '@/types/fleet'

export default function RequestsPage() {
  const api = useFleetApi()
  const { isAdmin, isLoaded } = useDashboardRole()
  const [requests, setRequests] = useState<LoadRequest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  const refresh = useCallback(async () => {
    const data = await api.get<LoadRequest[]>('/api/requests')
    setRequests(data)
  }, [api])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load requests')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [refresh])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      await api.post('/api/requests', {
        pickup_location: pickup,
        dropoff_location: dropoff,
        weight: weight ? Number(weight) : undefined,
        notes: notes || undefined,
      })
      setPickup('')
      setDropoff('')
      setWeight('')
      setNotes('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    }
  }

  async function review(id: string, status: 'approved' | 'rejected') {
    if (!isAdmin) return
    try {
      setError(null)
      await api.put(`/api/requests/${id}`, { status })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Requests</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Submit a load request; admins approve and a pending load is created.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>New request</CardTitle>
          <CardDescription>Standard users submit requests. Admins review the queue below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="rp">Pickup</Label>
              <Input
                id="rp"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Street, city, state / full address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rd">Dropoff</Label>
              <Input
                id="rd"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Street, city, state / full address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rw">Weight (optional)</Label>
              <Input
                id="rw"
                type="number"
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 42000"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="rn">Notes (optional)</Label>
              <Input
                id="rn"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special handling, appointment window, PO number…"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Submit request</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Queue</CardTitle>
          <CardDescription>{isLoaded && isAdmin ? 'Approve to create a load.' : 'Your submitted requests.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {isLoaded && isAdmin ? <TableHead className="text-right">Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[320px]">
                    {r.pickup_location} → {r.dropoff_location}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500">{new Date(r.created_at).toLocaleString()}</TableCell>
                  {isLoaded && isAdmin ? (
                    <TableCell className="text-right">
                      {r.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button type="button" size="sm" onClick={() => void review(r.id, 'approved')}>
                            Approve
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => void review(r.id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {requests.length === 0 ? <p className="mt-4 text-sm text-neutral-500">No requests yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}
