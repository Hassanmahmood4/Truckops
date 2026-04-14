'use client'

import { SignUpButton, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const headingLines = ['Smart Truck Dispatching', 'for Modern Logistics']

export function MarketingHero() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  return (
    <section className="bg-white py-24 dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-4 text-xs uppercase tracking-wider text-gray-400"
        >
          TruckOps Platform
        </motion.p>

        <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl dark:text-white">
          {headingLines.map((line, idx) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.12, ease: 'easeOut' }}
        >
          Manage drivers, assign loads, and track operations with precision.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.2, ease: 'easeOut' }}
        >
          {!isLoaded ? (
            <Button
              size="lg"
              disabled
              className="min-w-[170px] rounded-lg bg-black px-6 py-3 text-sm font-medium text-white opacity-60 dark:bg-white dark:text-black"
            >
              Get Started
            </Button>
          ) : isSignedIn ? (
            <Button
              size="lg"
              type="button"
              onClick={() => router.push('/dashboard')}
              className="min-w-[170px] rounded-lg bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Get Started
            </Button>
          ) : (
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="min-w-[170px] rounded-lg bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Get Started
              </Button>
            </SignUpButton>
          )}

          <Button
            variant="outline"
            size="lg"
            className="min-w-[170px] rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-black transition-all hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            asChild
          >
            <Link href="/demo">Try Demo</Link>
          </Button>
        </motion.div>

        </div>
      </div>
    </section>
  )
}
