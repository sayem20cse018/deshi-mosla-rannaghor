import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { FloatingCart } from '@/components/floating/FloatingCart';
import { FloatingWhatsApp } from '@/components/floating/FloatingWhatsApp';
import { BackToTop } from '@/components/floating/BackToTop';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />

      {/* Floating UI — SRS §5.10 */}
      <FloatingCart />
      <FloatingWhatsApp />
      <BackToTop />

      {/* Cart Drawer — slides in from right */}
      <CartDrawer />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
