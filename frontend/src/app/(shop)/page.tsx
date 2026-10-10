import type { Metadata } from 'next';
import { HeroBanner }           from '@/components/home/HeroBanner';
import { TrustBadges }          from '@/components/home/TrustBadges';
import { CategorySection }      from '@/components/home/CategorySection';
import { BestSellingSection }   from '@/components/home/BestSellingSection';
import { SpecialOfferBanner }   from '@/components/home/SpecialOfferBanner';
import { FeaturedSection }      from '@/components/home/FeaturedSection';
import { CookingCollections }   from '@/components/home/CookingCollections';
import { RecipeSection }        from '@/components/home/RecipeSection';
import { NewArrivalsSection }   from '@/components/home/NewArrivalsSection';
import { BrandStorySection }    from '@/components/home/BrandStorySection';
import { TestimonialsSection }  from '@/components/home/TestimonialsSection';
import { NewsletterSection }    from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'দেশি মসলার রান্নাঘর | অনলাইন গ্রোসারি শপ',
  description:
    'বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। দেশীয় মসলা, চাল, ডাল, তেল এবং রান্নার প্রয়োজনীয় পণ্য ঘরে বসে অর্ডার করুন। ক্যাশ অন ডেলিভারি ও ফ্রি ডেলিভারি সুবিধা।',
  keywords: ['মসলা', 'গ্রোসারি', 'অনলাইন শপ', 'সরিষার তেল', 'মধু', 'চাল', 'ডাল', 'বাংলাদেশ'],
  openGraph: {
    title: 'দেশি মসলার রান্নাঘর',
    description: 'প্রতিটি রান্নায় আসল স্বাদ — দেশীয় মসলা ও গ্রোসারি পণ্য',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Banner — 3-slide auto carousel */}
      <HeroBanner />

      {/* 2. Trust badges */}
      <TrustBadges />

      {/* 3. Shop by Category */}
      <CategorySection />

      {/* 4. Best Selling Products */}
      <BestSellingSection />

      {/* 5. Special Offer Banners */}
      <SpecialOfferBanner />

      {/* 6. Featured Products */}
      <FeaturedSection />

      {/* 7. Cooking Collections */}
      <CookingCollections />

      {/* 8. Recipe-Based Shopping */}
      <RecipeSection />

      {/* 9. New Arrivals */}
      <NewArrivalsSection />

      {/* 10. Brand Story */}
      <BrandStorySection />

      {/* 11. Testimonials */}
      <TestimonialsSection />

      {/* 12. Newsletter */}
      <NewsletterSection />
    </>
  );
}
