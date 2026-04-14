import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function MarketingCtaSection() {
  return (
    <section id="cta" className="bg-gray-50/50 py-24 dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl lg:text-[2.5rem] dark:text-white">
          Ready to run dispatch with confidence?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-500 md:text-lg dark:text-gray-400">
          Start free and scale as your operations grow.
        </p>
        <div className="mt-10">
          <Button size="lg" className="min-w-[200px] shadow-sm" asChild>
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
