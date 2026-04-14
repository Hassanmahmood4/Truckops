import Link from 'next/link'

import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    description: 'For small operators getting started with dispatch.',
    price: '$0',
    cta: 'Start Free',
    href: '/sign-up',
    featured: false,
    features: ['Up to 3 drivers', 'Basic load assignment', 'Email support'],
  },
  {
    name: 'Pro',
    description: 'For growing teams that need better visibility.',
    price: '$29/mo',
    cta: 'Get Pro',
    href: '/sign-up',
    featured: true,
    features: ['Unlimited drivers', 'Assignment tracking', 'Quote generation'],
  },
  {
    name: 'Enterprise',
    description: 'For large logistics teams with advanced needs.',
    price: 'Contact',
    cta: 'Contact Sales',
    href: 'mailto:sales@truckops.app',
    featured: false,
    features: ['Custom onboarding', 'Priority support', 'SLA & security review'],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-gray-200 bg-white px-6 py-24 dark:border-gray-800 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-black md:text-5xl dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg dark:text-gray-400">
            Choose a plan that fits your logistics needs.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={[
                'rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900',
                plan.featured ? 'border-black dark:border-white' : '',
              ].join(' ')}
            >
              <div className="space-y-3">
                <p className="text-sm font-medium tracking-tight text-gray-500 dark:text-gray-400">{plan.name}</p>
                <h3 className="text-3xl font-semibold tracking-tight text-black dark:text-white">{plan.price}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{plan.description}</p>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {plan.features.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  variant={plan.featured ? 'default' : 'outline'}
                  className={plan.featured ? 'w-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200' : 'w-full'}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
