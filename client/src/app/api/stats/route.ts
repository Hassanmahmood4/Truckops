import { NextResponse } from 'next/server'

import { getDashboardRole, requireUserId } from '@/lib/server/clerk-role'
import { createServerSupabase } from '@/lib/supabaseClient'

function isMissingRelationError(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const code = 'code' in error ? String((error as { code?: string }).code ?? '') : ''
  const message = 'message' in error ? String((error as { message?: string }).message ?? '') : ''
  return code === '42P01' || /does not exist/i.test(message)
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim().length > 0) return message
  }
  return 'Failed to load stats'
}

export async function GET() {
  const userId = await requireUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = await getDashboardRole()
  const supabase = createServerSupabase()

  try {
    const { count: driverCount, error: dErr } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
    if (dErr && !isMissingRelationError(dErr)) throw dErr

    let loadsQuery = supabase.from('loads').select('id, status')
    if (role !== 'admin') {
      loadsQuery = loadsQuery.eq('user_id', userId)
    }
    const { data: loads, error: lErr } = await loadsQuery
    if (lErr && !isMissingRelationError(lErr)) throw lErr

    const list = lErr ? [] : (loads ?? [])
    const activeLoads = list.filter((l) =>
      ['pending', 'assigned', 'in_transit'].includes(l.status as string),
    ).length
    const completedDeliveries = list.filter((l) => l.status === 'delivered').length

    let pendingRequests = 0
    if (role === 'admin') {
      const { count, error: rErr } = await supabase
        .from('requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
      if (rErr && !isMissingRelationError(rErr)) throw rErr
      pendingRequests = count ?? 0
    } else {
      const { count, error: rErr } = await supabase
        .from('requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('user_id', userId)
      if (rErr && !isMissingRelationError(rErr)) throw rErr
      pendingRequests = count ?? 0
    }

    return NextResponse.json({
      totalDrivers: driverCount ?? 0,
      activeLoads,
      completedDeliveries,
      pendingRequests,
    })
  } catch (e) {
    const message = getErrorMessage(e)
    console.error('GET /api/stats failed:', e)

    // Keep dashboard usable even if one backend query fails.
    return NextResponse.json(
      {
        totalDrivers: 0,
        activeLoads: 0,
        completedDeliveries: 0,
        pendingRequests: 0,
        warning: message,
      },
      { status: 200 },
    )
  }
}
