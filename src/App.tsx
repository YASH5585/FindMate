import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { TrustSection } from '@/components/landing/TrustSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { RecentItems } from '@/components/landing/RecentItems';
import { Capabilities } from '@/components/landing/Capabilities';
import { ValueSection } from '@/components/landing/ValueSection';
import { FinalCTA } from '@/components/landing/FinalCTA';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustSection />
        <HowItWorks />
        <RecentItems />
        <Capabilities />
        <ValueSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}