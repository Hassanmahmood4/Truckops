'use client'

import { useUser } from '@clerk/nextjs'

export function useDashboardRole() {
  const { user, isLoaded } = useUser()
  const role = user?.publicMetadata?.role
  const isAdmin = role === 'admin'

  return { isAdmin, isLoaded, role: typeof role === 'string' ? role : undefined }
}
