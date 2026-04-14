'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, FileText, LayoutDashboard, Package, Truck, Waypoints } from 'lucide-react'

import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/drivers', label: 'Drivers', icon: Truck },
  { href: '/dashboard/loads', label: 'Loads', icon: Package },
  { href: '/dashboard/assignments', label: 'Assignments', icon: Waypoints },
  { href: '/dashboard/quotes', label: 'Quotes', icon: FileText },
  { href: '/dashboard/requests', label: 'Requests', icon: ClipboardList },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:flex">
      <div className="flex h-14 items-center border-b border-gray-200 px-5 dark:border-gray-800">
        <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight text-black dark:text-white">
          TruckOps
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="App">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
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
    </aside>
  )
}
