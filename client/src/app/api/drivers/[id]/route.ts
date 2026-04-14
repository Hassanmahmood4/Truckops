import { NextResponse } from 'next/server'

import { requireAdmin, requireUserId } from '@/lib/server/clerk-role'
import { createServerSupabase } from '@/lib/supabaseClient'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
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

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}
  if (typeof body.name === 'string') patch.name = body.name.trim()
  if (typeof body.phone === 'string') patch.phone = body.phone
  if (typeof body.license_number === 'string') patch.license_number = body.license_number
  if (body.status === 'available' || body.status === 'busy') patch.status = body.status

  const supabase = createServerSupabase()
  const { data, error } = await supabase.from('drivers').update(patch).eq('id', id).select().single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
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

  const { data: active, error: aErr } = await supabase
    .from('assignments')
    .select('id')
    .eq('driver_id', id)
    .eq('status', 'active')
    .limit(1)

  if (aErr) {
    return NextResponse.json({ error: aErr.message }, { status: 500 })
  }
  if (active?.length) {
    return NextResponse.json({ error: 'Cannot delete driver with an active assignment' }, { status: 409 })
  }

  const { error } = await supabase.from('drivers').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
