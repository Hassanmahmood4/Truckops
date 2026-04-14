import type { NextConfig } from 'next'
import dotenv from 'dotenv'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * Load env so repo-root `.env` wins over stale shell vars (e.g. old Clerk keys).
 * Later files override earlier ones — delete `client/.env.local` if it has old keys.
 */
function loadEnvFiles() {
  const rootEnv = path.join(configDir, '..', '.env')
  const clientEnv = path.join(configDir, '.env')
  const clientLocal = path.join(configDir, '.env.local')

  const files = [rootEnv, clientEnv, clientLocal]
  for (const file of files) {
    if (existsSync(file)) {
      dotenv.config({ path: file, override: true })
    }
  }
}

loadEnvFiles()

const nextConfig: NextConfig = {
  /**
   * Fleet API is implemented as Next.js Route Handlers under `src/app/api/*` (Supabase + Clerk).
   * To use the legacy Express server instead, set `NEXT_PUBLIC_API_URL` to that origin and add rewrites here.
   */
}

export default nextConfig
