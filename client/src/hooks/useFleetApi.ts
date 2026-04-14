'use client'

import { useAuth } from '@clerk/nextjs'
import { useMemo } from 'react'

import { createFleetApi } from '@/lib/api'

/** Authenticated client for the FleetFlow Express API (Clerk Bearer token). */
export function useFleetApi() {
  const { getToken } = useAuth()
  return useMemo(() => createFleetApi(() => getToken()), [getToken])
}
