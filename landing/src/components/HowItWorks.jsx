const steps = [
  {
    n: '01',
    title: 'Register / Login',
    description: 'Create an account and sign in to your workspace.',
  },
  {
    n: '02',
    title: 'Add Drivers',
    description: 'Add your team and keep availability up to date.',
  },
  {
    n: '03',
    title: 'Submit Load',
    description: 'Enter pickup, dropoff, and load details in seconds.',
  },
  {
    n: '04',
    title: 'Assign & Track',
    description: 'Assign loads and follow them through delivery.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-gray-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-500">Four steps from signup to dispatch.</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{step.n}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
