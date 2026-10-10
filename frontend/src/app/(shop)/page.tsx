import { Suspense } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { CategorySection } from '@/components/home/CategorySection';
import { BestSellingSection } from '@/components/home/BestSellingSection';
import { SpecialOfferBanner } from '@/components/home/SpecialOfferBanner';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { RecipeSection } from '@/components/home/RecipeSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { TrustBadges } from '@/components/home/TrustBadges';

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <Suspense fallback={<div className="h-[500px] skeleton" />}>
        <HeroBanner />
      </Suspense>

      {/* Trust badges */}
      <TrustBadges />

      {/* Shop by Category */}
      <Suspense fallback={<div className="h-64 skeleton mx-4 my-6 rounded-xl" />}>
        <CategorySection />
      </Suspense>

      {/* Best Selling Products */}
      <Suspense fallback={<div className="h-96 skeleton mx-4 my-6 rounded-xl" />}>
        <BestSellingSection />
      </Suspense>

      {/* Special Offer Banner */}
      <SpecialOfferBanner />

      {/* Featured Products */}
      <Suspense fallback={<div className="h-96 skeleton mx-4 my-6 rounded-xl" />}>
        <FeaturedSection />
      </Suspense>

      {/* Recipe Based Shopping */}
      <Suspense fallback={<div className="h-64 skeleton mx-4 my-6 rounded-xl" />}>
        <RecipeSection />
      </Suspense>

      {/* New Arrivals */}
      <Suspense fallback={<div className="h-96 skeleton mx-4 my-6 rounded-xl" />}>
        <NewArrivalsSection />
      </Suspense>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </main>
  );
}
