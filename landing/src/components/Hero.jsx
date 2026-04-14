import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl">
          Smart Truck Dispatching Made Simple
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 md:text-xl">
          Manage drivers, assign loads, and track deliveries — all in one platform.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" className="min-w-[160px] shadow-sm" asChild>
            <a href="#cta">Get Started</a>
          </Button>
          <Button variant="secondary" size="lg" className="min-w-[160px] shadow-sm" asChild>
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
