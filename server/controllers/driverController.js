import { body, param } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { DRIVER_STATUSES } from '../config/constants.js';

export const driverValidators = {
  create: [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('phone').optional().isString(),
    body('license_number').optional().isString(),
    body('status')
      .optional()
      .isIn(DRIVER_STATUSES)
      .withMessage(`status must be one of: ${DRIVER_STATUSES.join(', ')}`),
  ],
  update: [
    param('id').isUUID().withMessage('id must be a UUID'),
    body('name').optional().trim().notEmpty(),
    body('phone').optional().isString(),
    body('license_number').optional().isString(),
    body('status')
      .optional()
      .isIn(DRIVER_STATUSES)
      .withMessage(`status must be one of: ${DRIVER_STATUSES.join(', ')}`),
  ],
  idParam: [param('id').isUUID().withMessage('id must be a UUID')],
};

export async function createDriver(req, res, next) {
  try {
    const { name, phone, license_number, status = 'available' } = req.body;
    const { data, error } = await supabase
      .from('drivers')
      .insert({ name, phone, license_number, status })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function listDrivers(_req, res, next) {
  try {
    const { data, error } = await supabase.from('drivers').select('*').order('name');
    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function updateDriver(req, res, next) {
  try {
    const { id } = req.params;
    const patch = { ...req.body };
    delete patch.id;

    const { data, error } = await supabase.from('drivers').update(patch).eq('id', id).select().single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function deleteDriver(req, res, next) {
  try {
    const { id } = req.params;

    const { data: active, error: aErr } = await supabase
      .from('assignments')
      .select('id')
      .eq('driver_id', id)
      .eq('status', 'active')
      .limit(1);

    if (aErr) throw aErr;
    if (active?.length) {
      return res.status(409).json({ error: 'Cannot delete driver with an active assignment' });
    }

    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (error) throw error;

    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
