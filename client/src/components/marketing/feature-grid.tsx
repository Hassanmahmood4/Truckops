import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'Driver management',
    description:
      'Centralize profiles, availability, and compliance so your fleet stays organized and audit-ready.',
  },
  {
    title: 'Load assignment',
    description:
      'Match loads to drivers with clear status from intake through delivery — no spreadsheets required.',
  },
  {
    title: 'Operations visibility',
    description:
      'See what is active, pending, and completed in one view built for fast dispatch decisions.',
  },
  {
    title: 'Quote generation',
    description:
      'Produce consistent pricing from distance and your rates. Fewer errors, faster approvals.',
  },
]

export function MarketingFeatureGrid() {
  return (
    <section id="features" className="bg-gray-50/50 py-24 dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl dark:text-white">Everything you need</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg dark:text-gray-400">
            A focused toolkit for dispatch teams who care about clarity and speed.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {features.map((item) => (
            <Card
              key={item.title}
              className={cn(
                'group border-gray-200 bg-white transition-all duration-150 dark:border-gray-800 dark:bg-black',
                'hover:border-gray-300 hover:bg-gray-100 dark:hover:border-gray-700 dark:hover:bg-gray-900',
              )}
            >
              <CardHeader className="p-8">
                <CardTitle className="text-lg font-semibold tracking-tight">{item.title}</CardTitle>
                <CardDescription className="mt-3 text-[15px] leading-relaxed">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
