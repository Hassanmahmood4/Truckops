'use client'

import { useEffect, useState } from 'react'

import { Loader } from '@/components/Loader'

/**
 * Shows the loader briefly on first mount so hard refreshes
 * always present a consistent loading experience.
 */
export function InitialLoaderGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    return <Loader />
  }

  return <>{children}</>
}
