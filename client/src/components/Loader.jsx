'use client'

import { motion } from 'framer-motion'

export function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-black">
      <div className="w-full max-w-sm">
        <div className="relative h-10">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-300 dark:border-gray-700" />

          <motion.div
            className="absolute top-1/2 h-4 w-8 -translate-y-1/2 rounded-sm bg-black dark:bg-white"
            initial={{ left: '0%' }}
            animate={{ left: ['0%', 'calc(100% - 2rem)'] }}
            transition={{ duration: 2.6, ease: 'linear', repeat: Infinity }}
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Initializing dispatch system...
        </p>
      </div>
    </div>
  )
}
