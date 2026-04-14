import { NextResponse } from 'next/server'

import { getDashboardRole, requireAdmin, requireUserId } from '@/lib/server/clerk-role'
import { completeDeliveryForLoad } from '@/lib/server/fleet'
import { createServerSupabase } from '@/lib/supabaseClient'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const LOAD_STATUSES = ['pending', 'assigned', 'in_transit', 'delivered'] as const

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const role = await getDashboardRole()
  const supabase = createServerSupabase()

  const { data: existing, error: fetchErr } = await supabase.from('loads').select('id, status, user_id').eq('id', id).single()
  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: 'Load not found' }, { status: 404 })
  }

  if (role !== 'admin' && existing.user_id && existing.user_id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const patch: Record<string, unknown> = {}
  if (typeof body.pickup_location === 'string') patch.pickup_location = body.pickup_location.trim()
  if (typeof body.dropoff_location === 'string') patch.dropoff_location = body.dropoff_location.trim()
  if (body.weight != null && body.weight !== '') {
    const w = Number(body.weight)
    if (Number.isNaN(w)) {
      return NextResponse.json({ error: 'weight must be numeric' }, { status: 400 })
    }
    patch.weight = w
  }
  if (typeof body.status === 'string' && LOAD_STATUSES.includes(body.status as (typeof LOAD_STATUSES)[number])) {
    patch.status = body.status
  }

  const { data, error } = await supabase.from('loads').update(patch).eq('id', id).select().single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Load not found' }, { status: 404 })
  }

  if (patch.status === 'delivered' && existing.status !== 'delivered') {
    await completeDeliveryForLoad(supabase, id)
  }

  return NextResponse.json(data)
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status })
  }

  const { id } = await ctx.params
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { error } = await supabase.from('loads').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
