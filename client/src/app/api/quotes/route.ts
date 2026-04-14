import { NextResponse } from 'next/server'

import { getDashboardRole, requireUserId } from '@/lib/server/clerk-role'
import { calculateQuotePrice } from '@/lib/server/fleet'
import { isMissingRelationError, relationMissingResponse } from '@/lib/server/supabase-errors'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET() {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await getDashboardRole()
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('quotes')
    .select('*, loads ( user_id )')
    .order('id', { ascending: false })

  if (error) {
    if (isMissingRelationError(error)) {
      return NextResponse.json([])
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = data ?? []
  const filtered =
    role === 'admin'
      ? rows
      : rows.filter((row) => {
          const loads = row.loads as { user_id: string | null } | null
          return !loads?.user_id || loads.user_id === userId
        })

  const cleaned = filtered.map((row) => {
    const copy = { ...row } as Record<string, unknown>
    delete copy.loads
    return copy
  })
  return NextResponse.json(cleaned)
}

export async function POST(req: Request) {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { load_id?: string; distance?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.load_id || body.distance == null) {
    return NextResponse.json({ error: 'load_id and distance are required' }, { status: 400 })
  }

  const distance = Number(body.distance)
  if (Number.isNaN(distance) || distance < 0) {
    return NextResponse.json({ error: 'distance must be a non-negative number' }, { status: 400 })
  }

  const role = await getDashboardRole()
  const supabase = createServerSupabase()

  const { data: load, error: lErr } = await supabase.from('loads').select('id, user_id').eq('id', body.load_id).single()
  if (lErr) {
    if (isMissingRelationError(lErr)) {
      return NextResponse.json(relationMissingResponse('quotes'), { status: 503 })
    }
    return NextResponse.json({ error: lErr.message }, { status: 500 })
  }
  if (!load) {
    return NextResponse.json({ error: 'Load not found' }, { status: 404 })
  }
  if (role !== 'admin' && load.user_id && load.user_id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const price = calculateQuotePrice(distance)

  const { data, error } = await supabase
    .from('quotes')
    .insert({ load_id: body.load_id, price, distance })
    .select()
    .single()

  if (error) {
    if (isMissingRelationError(error)) {
      return NextResponse.json(relationMissingResponse('quotes'), { status: 503 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
