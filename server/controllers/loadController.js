import { body, param } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { LOAD_STATUSES } from '../config/constants.js';
import { completeDeliveryForLoad } from '../services/assignmentService.js';

export const loadValidators = {
  create: [
    body('pickup_location').trim().notEmpty().withMessage('pickup_location is required'),
    body('dropoff_location').trim().notEmpty().withMessage('dropoff_location is required'),
    body('weight').optional().isNumeric().withMessage('weight must be numeric'),
    body('status')
      .optional()
      .isIn(LOAD_STATUSES)
      .withMessage(`status must be one of: ${LOAD_STATUSES.join(', ')}`),
  ],
  update: [
    param('id').isUUID().withMessage('id must be a UUID'),
    body('pickup_location').optional().trim().notEmpty(),
    body('dropoff_location').optional().trim().notEmpty(),
    body('weight').optional().isNumeric(),
    body('status')
      .optional()
      .isIn(LOAD_STATUSES)
      .withMessage(`status must be one of: ${LOAD_STATUSES.join(', ')}`),
  ],
};

export async function createLoad(req, res, next) {
  try {
    const { pickup_location, dropoff_location, weight, status = 'pending' } = req.body;
    const user_id = req.authUserId || null;

    const { data, error } = await supabase
      .from('loads')
      .insert({
        pickup_location,
        dropoff_location,
        weight: weight != null ? Number(weight) : null,
        status,
        user_id,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function listLoads(req, res, next) {
  try {
    let q = supabase.from('loads').select('*').order('id', { ascending: false });

    // Scope to authenticated user when we have a user id (Clerk)
    if (req.authUserId) {
      q = q.eq('user_id', req.authUserId);
    }

    const { data, error } = await q;
    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function updateLoad(req, res, next) {
  try {
    const { id } = req.params;
    const patch = { ...req.body };
    delete patch.id;
    if (patch.weight != null) patch.weight = Number(patch.weight);

    // Fetch current status to detect transition to delivered
    const { data: existing, error: fetchErr } = await supabase
      .from('loads')
      .select('id, status, user_id')
      .eq('id', id)
      .single();

    if (fetchErr) throw fetchErr;
    if (!existing) {
      return res.status(404).json({ error: 'Load not found' });
    }

    if (req.authUserId && existing.user_id && existing.user_id !== req.authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data, error } = await supabase.from('loads').update(patch).eq('id', id).select().single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Load not found' });
    }

    // When marked delivered, free assigned drivers (business rule)
    if (patch.status === 'delivered' && existing.status !== 'delivered') {
      await completeDeliveryForLoad(id);
    }

    res.json(data);
  } catch (e) {
    next(e);
  }
}
