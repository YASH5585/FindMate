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
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthProvider } from '@/hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
