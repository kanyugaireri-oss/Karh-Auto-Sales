import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { SourcingBanner } from "@/components/home/SourcingBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SiteShell } from "@/components/layout/SiteShell";

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <StatsStrip />
      <FeaturedCollection />
      <SourcingBanner />
      <HowItWorks />
      <WhyChooseUs />
    </SiteShell>
  );
}
