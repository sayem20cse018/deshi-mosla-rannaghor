import { ProductRow } from '@/components/product/ProductRow';
import { BEST_SELLERS } from '@/data/products';

export function BestSellingSection() {
  return (
    <ProductRow
      title="সেরা বিক্রিত পণ্য"
      subtitle="সবচেয়ে বেশি পছন্দের পণ্যগুলো"
      accent="বেস্ট সেলার"
      href="/shop?sort=best_selling"
      products={BEST_SELLERS}
      bg="bg-gray-50"
    />
  );
}
