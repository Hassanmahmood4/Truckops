'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Driver } from '@/types/fleet'

export default function DriversPage() {
  const api = useFleetApi()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [license, setLicense] = useState('')

  const refresh = useCallback(async () => {
    const data = await api.get<Driver[]>('/api/drivers')
    setDrivers(data)
  }, [api])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        await refresh()
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load drivers')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [refresh])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    try {
      setError(null)
      await api.post('/api/drivers', { name, phone: phone || undefined, license_number: license || undefined })
      setName('')
      setPhone('')
      setLicense('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this driver?')) return
    try {
      setError(null)
      await api.delete(`/api/drivers/${id}`)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Drivers</h1>
        <p className="text-sm text-neutral-500">Manage driver records and availability.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add driver</CardTitle>
            <CardDescription>New drivers default to available.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onCreate}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License number</Label>
                <Input id="license" value={license} onChange={(e) => setLicense(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Create driver
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All drivers</CardTitle>
            <CardDescription>Status updates when loads are assigned or delivered.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.phone || '—'}</TableCell>
                    <TableCell>{d.license_number || '—'}</TableCell>
                    <TableCell className="capitalize">{d.status}</TableCell>
                    <TableCell className="text-right">
                      <Button type="button" variant="destructive" size="sm" onClick={() => void onDelete(d.id)}>
                        Delete
                      </Button>
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
