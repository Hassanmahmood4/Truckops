'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-800" aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-medium text-black transition-all hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? 'L' : 'D'}
    </button>
  )
}
