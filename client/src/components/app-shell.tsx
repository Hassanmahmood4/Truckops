'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Truck, Waypoints } from 'lucide-react'

import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/drivers', label: 'Drivers', icon: Truck },
  { href: '/dashboard/loads', label: 'Loads', icon: Package },
  { href: '/dashboard/assignments', label: 'Assignments', icon: Waypoints },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:flex">
        <div className="flex h-14 items-center border-b border-gray-200 px-5 dark:border-gray-800">
          <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight text-black dark:text-white">
            FleetFlow
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="App">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white',
                )}
              >
                <Icon className="size-4 shrink-0 opacity-70" strokeWidth={1.75} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <Link
            href="/"
            className="text-xs font-medium text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-black md:px-8">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 md:hidden">FleetFlow</span>
          <div className="ml-auto">
            <UserButton />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
