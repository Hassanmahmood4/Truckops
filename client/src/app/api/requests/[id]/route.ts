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

  let body: { status?: 'approved' | 'rejected' }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.status !== 'approved' && body.status !== 'rejected') {
    return NextResponse.json({ error: 'status must be approved or rejected' }, { status: 400 })
  }

  const supabase = createServerSupabase()

  const { data: requestRow, error: fErr } = await supabase.from('requests').select('*').eq('id', id).single()
  if (fErr) {
    return NextResponse.json({ error: fErr.message }, { status: 500 })
  }
  if (!requestRow) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  if (requestRow.status !== 'pending') {
    return NextResponse.json({ error: 'Request is no longer pending' }, { status: 409 })
  }

  const reviewed_at = new Date().toISOString()

  if (body.status === 'rejected') {
    const { data, error } = await supabase
      .from('requests')
      .update({ status: 'rejected', reviewed_at, load_id: null })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }

  const { data: load, error: lErr } = await supabase
    .from('loads')
    .insert({
      pickup_location: requestRow.pickup_location,
      dropoff_location: requestRow.dropoff_location,
      weight: requestRow.weight,
      status: 'pending',
      user_id: requestRow.user_id,
    })
    .select()
    .single()

  if (lErr) {
    return NextResponse.json({ error: lErr.message }, { status: 500 })
  }

  const { data: updated, error: uErr } = await supabase
    .from('requests')
    .update({ status: 'approved', load_id: load.id, reviewed_at })
    .eq('id', id)
    .select()
    .single()

  if (uErr) {
    return NextResponse.json({ error: uErr.message }, { status: 500 })
  }
  return NextResponse.json(updated)
}
