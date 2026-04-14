'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

/**
 * Minimal top bar with account actions; page title comes from main content heading.
 */
export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-black md:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
      >
        ← Back to site
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  )
}
