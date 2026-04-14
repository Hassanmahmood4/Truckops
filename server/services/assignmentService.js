import { supabase } from '../config/supabase.js';

/**
 * After a load is marked delivered, mark assignment completed and free the driver.
 */
export async function completeDeliveryForLoad(loadId) {
  const { data: assignments, error: aErr } = await supabase
    .from('assignments')
    .select('id, driver_id, status')
    .eq('load_id', loadId)
    .eq('status', 'active');

  if (aErr) throw aErr;
  if (!assignments?.length) return;

  for (const row of assignments) {
    const { error: u1 } = await supabase
      .from('assignments')
      .update({ status: 'completed' })
      .eq('id', row.id);
    if (u1) throw u1;

    const { error: u2 } = await supabase
      .from('drivers')
      .update({ status: 'available' })
      .eq('id', row.driver_id);
    if (u2) throw u2;
  }
}
