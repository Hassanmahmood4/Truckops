import { NextResponse } from 'next/server'

import { requireAdmin, requireUserId } from '@/lib/server/clerk-role'
import { isMissingRelationError, relationMissingResponse } from '@/lib/server/supabase-errors'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET() {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('assignments')
    .select(
      `
        *,
        drivers ( id, name, phone, status ),
        loads ( id, pickup_location, dropoff_location, status, weight )
      `,
    )
    .order('id', { ascending: false })

  if (error) {
    if (isMissingRelationError(error)) {
      return NextResponse.json([])
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status })
  }

  let body: { driver_id?: string; load_id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const driver_id = body.driver_id
  const load_id = body.load_id
  if (!driver_id || !load_id) {
    return NextResponse.json({ error: 'driver_id and load_id are required' }, { status: 400 })
  }

  const supabase = createServerSupabase()

  const { data: driver, error: dErr } = await supabase.from('drivers').select('id, status').eq('id', driver_id).single()
  if (dErr) {
    if (isMissingRelationError(dErr)) {
      return NextResponse.json(relationMissingResponse('assignments'), { status: 503 })
    }
    return NextResponse.json({ error: dErr.message }, { status: 500 })
  }
  if (!driver) {
    return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
  }
  if (driver.status !== 'available') {
    return NextResponse.json({ error: 'Driver is not available' }, { status: 409 })
  }

  const { data: load, error: lErr } = await supabase.from('loads').select('id, status, user_id').eq('id', load_id).single()
  if (lErr) {
    if (isMissingRelationError(lErr)) {
      return NextResponse.json(relationMissingResponse('assignments'), { status: 503 })
    }
    return NextResponse.json({ error: lErr.message }, { status: 500 })
  }
  if (!load) {
    return NextResponse.json({ error: 'Load not found' }, { status: 404 })
  }
  if (load.status !== 'pending') {
    return NextResponse.json({ error: 'Load is not pending assignment' }, { status: 409 })
  }

  const { data: existing } = await supabase
    .from('assignments')
    .select('id')
    .eq('load_id', load_id)
    .eq('status', 'active')
    .limit(1)

  if (existing?.length) {
    return NextResponse.json({ error: 'Load already has an active assignment' }, { status: 409 })
  }

  const { data: assignment, error: aErr } = await supabase
    .from('assignments')
    .insert({ driver_id, load_id, status: 'active' })
    .select()
    .single()

  if (aErr) {
    if (isMissingRelationError(aErr)) {
      return NextResponse.json(relationMissingResponse('assignments'), { status: 503 })
    }
    return NextResponse.json({ error: aErr.message }, { status: 500 })
  }

  const { error: duErr } = await supabase.from('drivers').update({ status: 'busy' }).eq('id', driver_id)
  if (duErr) {
    if (isMissingRelationError(duErr)) {
      return NextResponse.json(relationMissingResponse('assignments'), { status: 503 })
    }
    return NextResponse.json({ error: duErr.message }, { status: 500 })
  }

  const { error: luErr } = await supabase.from('loads').update({ status: 'assigned' }).eq('id', load_id)
  if (luErr) {
    if (isMissingRelationError(luErr)) {
      return NextResponse.json(relationMissingResponse('assignments'), { status: 503 })
    }
    return NextResponse.json({ error: luErr.message }, { status: 500 })
  }

  return NextResponse.json(assignment, { status: 201 })
}
