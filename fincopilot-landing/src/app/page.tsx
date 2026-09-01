import { Nav } from "@/components/landing/nav";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { ScrollToTop } from "@/components/landing/scroll-to-top";
import { Hero } from "@/components/landing/hero";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BentoFeatures } from "@/components/landing/bento-features";
import { AICopilotDeepDive } from "@/components/landing/ai-copilot-deepdive";
import { ChartShowcase } from "@/components/landing/chart-showcase";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Integrations } from "@/components/landing/integrations";
import { Security } from "@/components/landing/security";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <ScrollProgress />
      <Nav />
      <main className="flex-1">
        <Hero />
        <TrustMarquee />
        <Problem />
        <HowItWorks />
        <BentoFeatures />
        <AICopilotDeepDive />
        <ChartShowcase />
        <DashboardPreview />
        <Integrations />
        <Security />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
