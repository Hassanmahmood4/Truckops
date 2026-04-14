'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/DataTable'
import { useDashboardRole } from '@/hooks/useDashboardRole'
import { useFleetApi } from '@/hooks/useFleetApi'
import type { Driver } from '@/types/fleet'

export default function DriversPage() {
  const api = useFleetApi()
  const { isAdmin, isLoaded } = useDashboardRole()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [license, setLicense] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editLicense, setEditLicense] = useState('')
  const [editStatus, setEditStatus] = useState<'available' | 'busy'>('available')

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
    if (!isAdmin) return
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
    if (!isAdmin) return
    if (!confirm('Delete this driver?')) return
    try {
      setError(null)
      await api.delete(`/api/drivers/${id}`)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  function openEdit(d: Driver) {
    setEditing(d)
    setEditName(d.name)
    setEditPhone(d.phone ?? '')
    setEditLicense(d.license_number ?? '')
    setEditStatus(d.status === 'busy' ? 'busy' : 'available')
    setEditOpen(true)
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault()
    if (!isAdmin || !editing) return
    try {
      setError(null)
      await api.put(`/api/drivers/${editing.id}`, {
        name: editName,
        phone: editPhone || undefined,
        license_number: editLicense || undefined,
        status: editStatus,
      })
      setEditOpen(false)
      setEditing(null)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Drivers</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage driver records and availability.</p>
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
              <CardTitle>Add driver</CardTitle>
              <CardDescription>New drivers default to available.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onCreate}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full legal name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License number</Label>
                  <Input
                    id="license"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="CDL or state license ID"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!isAdmin}>
                  Create driver
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Drivers</CardTitle>
              <CardDescription>View-only for standard users. Admins can add and edit drivers.</CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card className={isLoaded && isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CardHeader>
            <CardTitle>All drivers</CardTitle>
            <CardDescription>Status updates when loads are assigned or delivered.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={drivers}
              searchKeys={['name', 'phone', 'license_number', 'status']}
              searchPlaceholder="Search drivers…"
              emptyMessage={
                isLoaded && isAdmin
                  ? 'No drivers yet. Add your first driver using the form on the left.'
                  : 'No drivers yet. When admins add drivers, they will appear here.'
              }
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'phone', label: 'Phone', cell: (r: Driver) => r.phone || '—' },
                { key: 'license_number', label: 'License', cell: (r: Driver) => r.license_number || '—' },
                {
                  key: 'status',
                  label: 'Status',
                  cell: (r: Driver) => <Badge variant="outline">{r.status}</Badge>,
                },
                {
                  key: 'id',
                  label: 'Actions',
                  cell: (r: Driver) =>
                    isAdmin ? (
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(r)}>
                          Edit
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => void onDelete(r.id)}>
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    ),
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={onSaveEdit}>
            <DialogHeader>
              <DialogTitle>Edit driver</DialogTitle>
              <DialogDescription>Update profile fields and availability.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full legal name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-license">License number</Label>
                <Input
                  id="edit-license"
                  value={editLicense}
                  onChange={(e) => setEditLicense(e.target.value)}
                  placeholder="CDL or state license ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-black dark:border-gray-800 dark:bg-black dark:text-white"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'available' | 'busy')}
                >
                  <option value="available">available</option>
                  <option value="busy">busy</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
