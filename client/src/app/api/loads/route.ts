import { NextResponse } from 'next/server'

import { getDashboardRole, requireUserId } from '@/lib/server/clerk-role'
import { isMissingRelationError, relationMissingResponse } from '@/lib/server/supabase-errors'
import { createServerSupabase } from '@/lib/supabaseClient'

const LOAD_STATUSES = ['pending', 'assigned', 'in_transit', 'delivered'] as const

export async function GET() {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await getDashboardRole()
  const supabase = createServerSupabase()

  let q = supabase.from('loads').select('*').order('id', { ascending: false })
  if (role !== 'admin') {
    q = q.eq('user_id', userId)
  }

  const { data, error } = await q
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

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const pickup = typeof body.pickup_location === 'string' ? body.pickup_location.trim() : ''
  const dropoff = typeof body.dropoff_location === 'string' ? body.dropoff_location.trim() : ''
  if (!pickup || !dropoff) {
    return NextResponse.json({ error: 'pickup_location and dropoff_location are required' }, { status: 400 })
  }

  const weight = body.weight != null && body.weight !== '' ? Number(body.weight) : null
  if (weight != null && Number.isNaN(weight)) {
    return NextResponse.json({ error: 'weight must be numeric' }, { status: 400 })
  }

  let status = typeof body.status === 'string' ? body.status : 'pending'
  if (!LOAD_STATUSES.includes(status as (typeof LOAD_STATUSES)[number])) {
    status = 'pending'
  }

  const role = await getDashboardRole()
  const targetUserId = role === 'admin' && typeof body.user_id === 'string' ? body.user_id : userId

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('loads')
    .insert({
      pickup_location: pickup,
      dropoff_location: dropoff,
      weight,
      status,
      user_id: targetUserId,
    })
    .select()
    .single()

  if (error) {
    if (isMissingRelationError(error)) {
      return NextResponse.json(relationMissingResponse('loads'), { status: 503 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
