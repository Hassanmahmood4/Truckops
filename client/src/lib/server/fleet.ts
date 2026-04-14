import type { SupabaseClient } from '@supabase/supabase-js'

export const QUOTE_RATE_PER_UNIT = Number(process.env.QUOTE_RATE_PER_UNIT) || 2.5

export function calculateQuotePrice(distance: number) {
  return Math.round(distance * QUOTE_RATE_PER_UNIT * 100) / 100
}

export async function completeDeliveryForLoad(supabase: SupabaseClient, loadId: string) {
  const { data: assignments, error: aErr } = await supabase
    .from('assignments')
    .select('id, driver_id, status')
    .eq('load_id', loadId)
    .eq('status', 'active')

  if (aErr) throw aErr
  if (!assignments?.length) return

  for (const row of assignments) {
    const { error: u1 } = await supabase.from('assignments').update({ status: 'completed' }).eq('id', row.id)
    if (u1) throw u1

    const { error: u2 } = await supabase.from('drivers').update({ status: 'available' }).eq('id', row.driver_id)
    if (u2) throw u2
  }
}
