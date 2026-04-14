import { NextResponse } from 'next/server'

import { requireAdmin, requireUserId } from '@/lib/server/clerk-role'
import { createServerSupabase } from '@/lib/supabaseClient'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const ASSIGNMENT_STATUSES = ['active', 'completed', 'cancelled'] as const

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

  let body: { status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.status || !ASSIGNMENT_STATUSES.includes(body.status as (typeof ASSIGNMENT_STATUSES)[number])) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase.from('assignments').update({ status: body.status }).eq('id', id).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }
  return NextResponse.json(data)
}
