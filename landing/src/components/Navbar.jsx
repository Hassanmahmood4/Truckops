import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-semibold tracking-tight text-black">
          FleetFlow
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <a href="#features" className="text-sm text-gray-500 transition-colors hover:text-black">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-gray-500 transition-colors hover:text-black">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="shadow-sm" asChild>
            <a href="/sign-in">Login</a>
          </Button>
          <Button size="sm" className="shadow-sm" asChild>
            <a href="#cta">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
