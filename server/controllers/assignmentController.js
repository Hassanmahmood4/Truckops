import { body } from 'express-validator';
import { supabase } from '../config/supabase.js';

export const assignmentValidators = {
  create: [
    body('driver_id').isUUID().withMessage('driver_id must be a UUID'),
    body('load_id').isUUID().withMessage('load_id must be a UUID'),
  ],
};

/**
 * Assign a driver to a load: driver becomes busy, load becomes assigned.
 */
export async function createAssignment(req, res, next) {
  try {
    const { driver_id, load_id } = req.body;

    const { data: driver, error: dErr } = await supabase
      .from('drivers')
      .select('id, status')
      .eq('id', driver_id)
      .single();

    if (dErr) throw dErr;
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    if (driver.status !== 'available') {
      return res.status(409).json({ error: 'Driver is not available' });
    }

    const { data: load, error: lErr } = await supabase
      .from('loads')
      .select('id, status, user_id')
      .eq('id', load_id)
      .single();

    if (lErr) throw lErr;
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }
    if (req.authUserId && load.user_id && load.user_id !== req.authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (load.status !== 'pending') {
      return res.status(409).json({ error: 'Load is not pending assignment' });
    }

    const { data: existing } = await supabase
      .from('assignments')
      .select('id')
      .eq('load_id', load_id)
      .eq('status', 'active')
      .limit(1);

    if (existing?.length) {
      return res.status(409).json({ error: 'Load already has an active assignment' });
    }

    const { data: assignment, error: aErr } = await supabase
      .from('assignments')
      .insert({ driver_id, load_id, status: 'active' })
      .select()
      .single();

    if (aErr) throw aErr;

    const { error: duErr } = await supabase.from('drivers').update({ status: 'busy' }).eq('id', driver_id);
    if (duErr) throw duErr;

    const { error: luErr } = await supabase.from('loads').update({ status: 'assigned' }).eq('id', load_id);
    if (luErr) throw luErr;

    res.status(201).json(assignment);
  } catch (e) {
    next(e);
  }
}

export async function listAssignments(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select(
        `
        *,
        drivers ( id, name, phone, status ),
        loads ( id, pickup_location, dropoff_location, status, weight )
      `
      )
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
}
