import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { HighlightsSection } from "@/components/highlights-section"
import { AttractionsSection } from "@/components/attractions-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <HighlightsSection />
      <AttractionsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
