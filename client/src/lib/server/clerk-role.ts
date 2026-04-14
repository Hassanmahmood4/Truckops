import { auth, currentUser } from '@clerk/nextjs/server'

export type DashboardRole = 'admin' | 'user'

export async function requireUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId ?? null
}

export async function getDashboardRole(): Promise<DashboardRole> {
  const user = await currentUser()
  const r = user?.publicMetadata?.role
  if (r === 'admin') return 'admin'
  return 'user'
}

export async function requireAdmin(): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const role = await getDashboardRole()
  if (role !== 'admin') {
    return { ok: false, status: 403, message: 'Admin role required' }
  }
  return { ok: true }
}
