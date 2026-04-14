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

const backendUrl = process.env.API_URL ?? 'http://localhost:3001'

const nextConfig: NextConfig = {
  /**
   * When NEXT_PUBLIC_API_URL is unset, browser calls use relative `/api/*` and Next proxies to the Express server.
   * Set NEXT_PUBLIC_API_URL to your API origin in production if you prefer absolute URLs.
   */
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
