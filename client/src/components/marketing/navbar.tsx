'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'

export function MarketingNavbar() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur dark:bg-black/80">
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

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />

          {!isLoaded ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="rounded-md border border-gray-300 px-4 text-sm text-black opacity-60 dark:border-gray-700 dark:text-white"
            >
              Sign In
            </Button>
          ) : isSignedIn ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="rounded-md border border-gray-300 px-4 text-sm text-black transition-all hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              Dashboard
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border border-gray-300 px-4 text-sm text-black transition-all hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
