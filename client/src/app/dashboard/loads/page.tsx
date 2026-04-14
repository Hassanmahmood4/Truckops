'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Load, Quote } from '@/types/fleet'

export default function LoadsPage() {
  const api = useFleetApi()
  const [loads, setLoads] = useState<Load[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [weight, setWeight] = useState('')
  const [quoteLoadId, setQuoteLoadId] = useState('')
  const [distance, setDistance] = useState('')
  const [lastQuote, setLastQuote] = useState<Quote | null>(null)

  const refresh = useCallback(async () => {
    const [l, q] = await Promise.all([api.get<Load[]>('/api/loads'), api.get<Quote[]>('/api/quotes')])
    setLoads(l)
    setQuotes(q)
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

  async function markDelivered(id: string) {
    try {
      setError(null)
      await api.put(`/api/loads/${id}`, { status: 'delivered' })
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  async function onQuote(e: FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      const q = await api.post<Quote>('/api/quotes', {
        load_id: quoteLoadId,
        distance: Number(distance),
      })
      setLastQuote(q)
      setDistance('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quote failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Loads</h1>
        <p className="text-sm text-neutral-500">Create loads, request quotes, and close out deliveries.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New load</CardTitle>
            <CardDescription>Loads are scoped to your signed-in user.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onCreateLoad}>
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup</Label>
                <Input id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoff">Dropoff</Label>
                <Input id="dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (optional)</Label>
                <Input id="weight" type="number" step="any" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Create load
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active loads</CardTitle>
            <CardDescription>Mark delivered to release assigned drivers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Dropoff</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loads.map((load) => (
                  <TableRow key={load.id}>
                    <TableCell className="max-w-[180px] truncate">{load.pickup_location}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{load.dropoff_location}</TableCell>
                    <TableCell>{load.weight ?? '—'}</TableCell>
                    <TableCell className="capitalize">{load.status}</TableCell>
                    <TableCell className="text-right">
                      {load.status !== 'delivered' ? (
                        <Button type="button" size="sm" variant="secondary" onClick={() => void markDelivered(load.id)}>
                          Mark delivered
                        </Button>
                      ) : (
                        <span className="text-xs text-neutral-500">Done</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
              <div className="mb-3 font-medium">Quote calculator</div>
              <p className="mb-4 text-sm text-neutral-500">
                Price = distance × rate (rate configured on the server).
              </p>
              <form className="grid gap-3 md:grid-cols-3 md:items-end" onSubmit={onQuote}>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="load">Load</Label>
                  <select
                    id="load"
                    className="flex h-9 w-full rounded-xl border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-950 shadow-sm"
                    value={quoteLoadId}
                    onChange={(e) => setQuoteLoadId(e.target.value)}
                    required
                  >
                    <option value="">Select load…</option>
                    {loads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.pickup_location} → {l.dropoff_location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="any"
                    min={0}
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Save quote</Button>
              </form>
              {lastQuote ? (
                <p className="mt-3 text-sm">
                  Last quote: <span className="font-semibold">${lastQuote.price.toFixed(2)}</span> for distance{' '}
                  {lastQuote.distance}
                </p>
              ) : null}
            </div>

            {quotes.length ? (
              <div>
                <div className="mb-2 text-sm font-medium">Recent quotes</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Load ID</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.slice(0, 5).map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-mono text-xs">{q.load_id.slice(0, 8)}…</TableCell>
                        <TableCell>{q.distance}</TableCell>
                        <TableCell>${Number(q.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
