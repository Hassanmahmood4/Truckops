import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_KEY?.trim();

if (!url || !key) {
  throw new Error(
    '[FleetFlow] Missing SUPABASE_URL or SUPABASE_KEY. Add them to your environment (see .env.example).'
  );
}

/**
 * Server-side Supabase client (service role).
 * All DB access goes through the Express API — the browser never uses this key.
 */
export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
