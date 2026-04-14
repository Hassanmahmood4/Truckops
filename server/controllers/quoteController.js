import { body } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { calculateQuotePrice } from '../services/quoteService.js';

export const quoteValidators = {
  create: [
    body('load_id').isUUID().withMessage('load_id must be a UUID'),
    body('distance').isFloat({ min: 0 }).withMessage('distance must be a non-negative number'),
  ],
};

/**
 * Persists a calculated quote for a load (price = distance * rate).
 */
export async function createQuote(req, res, next) {
  try {
    const { load_id, distance } = req.body;
    const price = calculateQuotePrice(distance);

    const { data: load, error: lErr } = await supabase
      .from('loads')
      .select('id, user_id')
      .eq('id', load_id)
      .single();

    if (lErr) throw lErr;
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }
    if (req.authUserId && load.user_id && load.user_id !== req.authUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data, error } = await supabase
      .from('quotes')
      .insert({ load_id, price, distance: Number(distance) })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function listQuotes(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, loads ( user_id )')
      .order('id', { ascending: false });

    if (error) throw error;

    const filtered = req.authUserId
      ? data.filter((row) => !row.loads?.user_id || row.loads.user_id === req.authUserId)
      : data;

    res.json(filtered.map(({ loads: _loads, ...rest }) => rest));
  } catch (e) {
    next(e);
  }
}
