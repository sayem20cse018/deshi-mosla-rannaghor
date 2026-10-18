import type { Metadata } from 'next';
import { HeroBanner }           from '@/components/home/HeroBanner';
import { TrustBadges }          from '@/components/home/TrustBadges';
import { FeaturedCategories }   from '@/components/home/FeaturedCategories';
import { TopSellingSection }    from '@/components/home/TopSellingSection';
import { CollectionSection }    from '@/components/home/CollectionSection';
import { SpecialOfferBanner }   from '@/components/home/SpecialOfferBanner';
import { RecipeSection }        from '@/components/home/RecipeSection';
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

// Future-ready: section config — can be moved to DB/CMS later
export const HOME_SECTIONS = {
  featuredCategories: { enabled: true, title: 'Featured Categories',   subtitle: 'পছন্দের ক্যাটাগরি থেকে বেছে নিন' },
  topSelling:         { enabled: true, title: 'Top Selling Products',   subtitle: 'সবচেয়ে বেশি পছন্দের পণ্যগুলো',   limit: 10 },
  atta:               { enabled: true, title: 'Natural Atta & Chatu',   subtitle: 'খাঁটি প্রাকৃতিক আটা ও ছাতু',       slug: 'ata',       limit: 8 },
  mosla:              { enabled: true, title: 'Mosla / Spices',         subtitle: 'দেশি মসলার সেরা সংগ্রহ',           slug: 'mosla',     limit: 8 },
  oil:                { enabled: true, title: 'Natural Oil',             subtitle: 'খাঁটি সরিষা ও নারিকেল তেল',      slug: 'tel',       limit: 8 },
  superFood:          { enabled: true, title: 'Super Food',              subtitle: 'প্রকৃতির সেরা সুপারফুড',          slug: 'superfood', limit: 8 },
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBadges />
      {HOME_SECTIONS.featuredCategories.enabled && (
        <FeaturedCategories
          title={HOME_SECTIONS.featuredCategories.title}
          subtitle={HOME_SECTIONS.featuredCategories.subtitle}
        />
      )}
      {HOME_SECTIONS.topSelling.enabled && (
        <TopSellingSection
          title={HOME_SECTIONS.topSelling.title}
          subtitle={HOME_SECTIONS.topSelling.subtitle}
          limit={HOME_SECTIONS.topSelling.limit}
        />
      )}
      {HOME_SECTIONS.atta.enabled && (
        <CollectionSection
          title={HOME_SECTIONS.atta.title}
          subtitle={HOME_SECTIONS.atta.subtitle}
          categorySlug={HOME_SECTIONS.atta.slug}
          limit={HOME_SECTIONS.atta.limit}
          accentColor="#92400e"
          accentBg="#fffbeb"
          emoji="🌾"
        />
      )}
      <SpecialOfferBanner />
      {HOME_SECTIONS.mosla.enabled && (
        <CollectionSection
          title={HOME_SECTIONS.mosla.title}
          subtitle={HOME_SECTIONS.mosla.subtitle}
          categorySlug={HOME_SECTIONS.mosla.slug}
          limit={HOME_SECTIONS.mosla.limit}
          accentColor="#991b1b"
          accentBg="#fff1f2"
          emoji="🌶️"
        />
      )}
      {HOME_SECTIONS.oil.enabled && (
        <CollectionSection
          title={HOME_SECTIONS.oil.title}
          subtitle={HOME_SECTIONS.oil.subtitle}
          categorySlug={HOME_SECTIONS.oil.slug}
          limit={HOME_SECTIONS.oil.limit}
          accentColor="#78350f"
          accentBg="#fef3c7"
          emoji="🫙"
        />
      )}
      {HOME_SECTIONS.superFood.enabled && (
        <CollectionSection
          title={HOME_SECTIONS.superFood.title}
          subtitle={HOME_SECTIONS.superFood.subtitle}
          categorySlug={HOME_SECTIONS.superFood.slug}
          limit={HOME_SECTIONS.superFood.limit}
          accentColor="#166534"
          accentBg="#f0fdf4"
          emoji="🍯"
        />
      )}
      <RecipeSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
