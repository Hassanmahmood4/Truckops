import { Pricing } from '@/components/Pricing'
import { MarketingCtaSection } from '@/components/marketing/cta-section'
import { MarketingFeatureGrid } from '@/components/marketing/feature-grid'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingHero } from '@/components/marketing/hero'
import { MarketingHowItWorks } from '@/components/marketing/how-it-works'
import { MarketingNavbar } from '@/components/marketing/navbar'

/** Public marketing landing — no auth required. */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black dark:bg-black dark:text-white">
      <MarketingNavbar />
      <main className="flex flex-1 flex-col">
        <MarketingHero />
        <MarketingFeatureGrid />
        <MarketingHowItWorks />
        <Pricing />
        <MarketingCtaSection />
      </main>
      <MarketingFooter />
    </div>
  )
}
