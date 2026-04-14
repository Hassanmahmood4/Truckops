import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="bg-white py-20 dark:bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold tracking-tight text-black dark:text-white">FleetFlow</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Truck dispatch management.</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500 dark:text-gray-400" aria-label="Footer">
          <a href="#features" className="transition-colors hover:text-black dark:hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-black dark:hover:text-white">
            How it works
          </a>
          <Link href="/sign-in" className="transition-colors hover:text-black dark:hover:text-white">
            Sign in
          </Link>
        </nav>
        <p className="text-xs text-gray-400 md:text-right dark:text-gray-500">
          © {new Date().getFullYear()} FleetFlow. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
