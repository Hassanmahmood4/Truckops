'use client'

import Link from 'next/link'

const demoDrivers = [
  { id: 'DRV-102', name: 'Alex Carter', status: 'available' },
  { id: 'DRV-207', name: 'Morgan Lee', status: 'busy' },
  { id: 'DRV-311', name: 'Jordan Kim', status: 'available' },
]

const demoLoads = [
  { id: 'LD-9081', route: 'Dallas -> Houston', status: 'pending' },
  { id: 'LD-9082', route: 'Austin -> San Antonio', status: 'assigned' },
]

export default function DemoPage() {
  const isGuest = true

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-black md:px-8">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-black dark:text-white">
          TruckOps
        </Link>
        <Link
          href="/"
          className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          Back to site
        </Link>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8 md:py-10">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-black dark:text-gray-300">
          You are in demo mode.
        </div>

        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Dashboard Preview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Explore the interface as a guest. Data changes are disabled in this mode.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <p className="text-sm text-gray-500 dark:text-gray-400">Available drivers</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-white">12</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending loads</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-white">7</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active assignments</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-white">5</p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">Quick actions</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Mutations are disabled for guest users.
          </p>

          <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Pickup and dropoff (e.g. Dallas, TX → Houston, TX)"
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-black outline-none transition-all placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-black dark:text-white dark:placeholder:text-neutral-500"
              disabled={isGuest}
            />
            <button
              type="submit"
              disabled={isGuest}
              className="h-10 rounded-md bg-black px-4 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
            >
              Create Load
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">Drivers</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Driver</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">ID</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoDrivers.map((driver) => (
                  <tr key={driver.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-black dark:text-white">{driver.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{driver.id}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{driver.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">Loads</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Load</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Route</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoLoads.map((load) => (
                  <tr key={load.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-black dark:text-white">{load.id}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{load.route}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{load.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
