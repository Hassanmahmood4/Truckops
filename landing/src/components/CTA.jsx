import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section id="cta" className="border-t border-gray-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Start managing your fleet today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500">
          Join teams using FleetFlow to keep dispatch clear, fast, and under control.
        </p>
        <div className="mt-10">
          <Button size="lg" className="shadow-sm" asChild>
            <a href="/sign-up">Get Started</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
