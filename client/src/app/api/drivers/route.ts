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
  const { data, error } = await supabase.from('drivers').select('*').order('name')
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

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const status = body.status === 'busy' ? 'busy' : 'available'
  const phone = typeof body.phone === 'string' ? body.phone : null
  const license_number = typeof body.license_number === 'string' ? body.license_number : null

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('drivers')
    .insert({ name, phone, license_number, status })
    .select()
    .single()

  if (error) {
    if (isMissingRelationError(error)) {
      return NextResponse.json(relationMissingResponse('drivers'), { status: 503 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
