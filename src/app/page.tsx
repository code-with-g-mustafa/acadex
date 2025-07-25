import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { StatsSection } from '@/components/StatsSection';
import { ContactSection } from '@/components/ContactSection';

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ContactSection />
      </main>
    </div>
  );
}
