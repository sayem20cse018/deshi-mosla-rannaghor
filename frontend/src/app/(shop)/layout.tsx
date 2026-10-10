import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/floating/FloatingCart';
import { FloatingWhatsApp } from '@/components/floating/FloatingWhatsApp';
import { BackToTop } from '@/components/floating/BackToTop';
import { MobileNav } from '@/components/layout/MobileNav';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />

      {/* Floating UI — SRS §5.10 */}
      <FloatingCart />
      <FloatingWhatsApp />
      <BackToTop />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
