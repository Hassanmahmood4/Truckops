'use client'

import Link from 'next/link'

import { ThemeToggle } from '@/components/ThemeToggle'

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black transition-opacity duration-150 hover:opacity-80 dark:text-white"
        >
          TruckOps
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          <a
            href="#features"
            className="text-sm text-gray-500 transition-colors duration-150 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-gray-500 transition-colors duration-150 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-sm text-gray-500 transition-colors duration-150 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
