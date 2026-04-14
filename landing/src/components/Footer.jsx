export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold tracking-tight text-black">FleetFlow</p>
          <p className="mt-2 text-sm text-gray-500">Truck dispatching management.</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500" aria-label="Footer">
          <a href="#features" className="hover:text-black">
            Features
          </a>
          <a href="mailto:hello@fleetflow.app" className="hover:text-black">
            Contact
          </a>
        </nav>
        <p className="text-sm text-gray-400 md:text-right">
          © {new Date().getFullYear()} FleetFlow. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
