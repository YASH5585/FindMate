import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { TrustSection } from '@/components/landing/TrustSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { RecentItems } from '@/components/landing/RecentItems';
import { Capabilities } from '@/components/landing/Capabilities';
import { ValueSection } from '@/components/landing/ValueSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { BrowsePage } from '@/pages/BrowsePage';
import { ReportLostPage } from '@/pages/ReportLostPage';
import { ReportFoundPage } from '@/pages/ReportFoundPage';
import { ItemDetailsPage } from '@/pages/ItemDetailsPage';
import { MyReportsPage } from '@/pages/MyReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <TrustSection />
              <HowItWorks />
              <RecentItems />
              <Capabilities />
              <ValueSection />
              <FinalCTA />
            </>
          } />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
          <Route path="/report-lost" element={<ReportLostPage />} />
          <Route path="/report-found" element={<ReportFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}