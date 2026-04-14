import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client (service role). Do not import from client components.
 */
export function createServerSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY for server Supabase client')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
