'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'

const headingLines = ['Smart Truck Dispatching', 'for Modern Logistics']

export function MarketingHero() {
  return (
    <section className="border-b border-gray-200 bg-white px-6 py-32 dark:border-gray-800 dark:bg-black">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-semibold leading-tight tracking-tight text-black md:text-6xl dark:text-white">
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
          transition={{ duration: 0.4, delay: 0.14, ease: 'easeOut' }}
        >
          Manage drivers, assign loads, and track operations with precision.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <Button
            size="lg"
            className="min-w-[170px] rounded-lg bg-black px-6 py-3 text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            asChild
          >
            <Link href="/sign-in">Get Started</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[170px] rounded-lg border border-gray-200 px-6 py-3 text-black transition-all hover:bg-gray-100 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
            asChild
          >
            <Link href="#features">Learn More</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
