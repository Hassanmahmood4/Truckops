'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Load, Quote } from '@/types/fleet'

export default function QuotesPage() {
  const api = useFleetApi()
  const [loads, setLoads] = useState<Load[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [error, setError] = useState<string | null>(null)
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
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load quotes')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [refresh])

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
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Quotes</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Generate pricing from distance and your server rate.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New quote</CardTitle>
            <CardDescription>Price = distance × rate (configured on the server).</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onQuote}>
              <div className="space-y-2">
                <Label htmlFor="load">Load</Label>
                <select
                  id="load"
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-black dark:border-gray-800 dark:bg-black dark:text-white"
                  value={quoteLoadId}
                  onChange={(e) => setQuoteLoadId(e.target.value)}
                  required
                  aria-label="Load to quote"
                >
                  <option value="">Choose a load to price…</option>
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
                  placeholder="Miles or your configured distance unit"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save quote
              </Button>
            </form>
            {lastQuote ? (
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                Last quote: <span className="font-semibold">${Number(lastQuote.price).toFixed(2)}</span> for distance{' '}
                {lastQuote.distance}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent quotes</CardTitle>
            <CardDescription>Stored quotes for your accessible loads.</CardDescription>
          </CardHeader>
          <CardContent>
            {quotes.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Load ID</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-xs">{q.load_id.slice(0, 8)}…</TableCell>
                      <TableCell>{q.distance}</TableCell>
                      <TableCell>${Number(q.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-neutral-500">No quotes yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
