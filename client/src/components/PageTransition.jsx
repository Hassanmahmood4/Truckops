'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * Global route transition wrapper for App Router pages.
 * Uses a subtle fade + slide animation keyed by pathname.
 */
export function PageTransition({ children }) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.24, ease: 'easeInOut' }}
        className="relative min-h-screen"
      >
        {children}

        {/* Subtle top-line overlay sweep for premium transition feel */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10 dark:bg-white/10"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
