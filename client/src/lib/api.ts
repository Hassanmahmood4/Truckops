const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export type FleetApiError = {
  error: string
  details?: unknown
}

/**
 * Calls the FleetFlow Express API with Clerk session token (never talks to Supabase from the browser).
 */
export function createFleetApi(getToken: () => Promise<string | null>) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getToken()
    const headers = new Headers(init.headers)
    headers.set('Content-Type', 'application/json')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const url = `${API_BASE}${path}`
    const res = await fetch(url, { ...init, headers })

    if (res.status === 204) {
      return undefined as T
    }

    const text = await res.text()
    const body = text ? JSON.parse(text) : {}

    if (!res.ok) {
      const err = new Error((body as FleetApiError).error || res.statusText) as Error & {
        status: number
        details?: unknown
      }
      err.status = res.status
      err.details = (body as FleetApiError).details
      throw err
    }

    return body as T
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path: string) => request<void>(path, { method: 'DELETE' }),
  }
}
