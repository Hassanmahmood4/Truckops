import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const items = [
  {
    title: 'Driver Management',
    description: 'Onboard drivers, track availability, and keep credentials organized in one place.',
  },
  {
    title: 'Load Assignment',
    description: 'Match loads to the right driver with clear status from pending to delivered.',
  },
  {
    title: 'Real-time Tracking',
    description: 'See assignment progress at a glance so nothing slips through the cracks.',
  },
  {
    title: 'Quote Generation',
    description: 'Generate consistent pricing from distance and your rates — fast and transparent.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-gray-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">Features</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-500">
            Everything you need to run dispatch without the noise.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.title} className="flex flex-col">
              <CardHeader className="flex-1 p-6">
                <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-relaxed">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
