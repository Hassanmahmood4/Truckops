const steps = [
  { n: '01', title: 'Create your workspace', body: 'Sign up and invite your team in minutes.' },
  { n: '02', title: 'Add drivers & loads', body: 'Enter drivers and submit loads with pickup and dropoff details.' },
  { n: '03', title: 'Assign & dispatch', body: 'Pair the right driver to each load and track status in real time.' },
  { n: '04', title: 'Close the loop', body: 'Mark deliveries complete and keep your fleet data accurate.' },
]

export function MarketingHowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-gray-200 bg-white px-6 py-24 dark:border-gray-800 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl dark:text-white">How it works</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg dark:text-gray-400">
            A linear flow from signup to delivery — no unnecessary steps.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => (
            <div key={step.n} className="relative">
              <span className="font-mono text-xs font-medium tabular-nums text-gray-400 dark:text-gray-500">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-black dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
