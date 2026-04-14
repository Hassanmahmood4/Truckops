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
    return <span className="inline-flex h-6 w-10 rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-6 w-10 items-center rounded-full bg-gray-200 p-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:bg-gray-800 dark:focus-visible:ring-white"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition-all duration-200 dark:bg-black ${
          isDark ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
