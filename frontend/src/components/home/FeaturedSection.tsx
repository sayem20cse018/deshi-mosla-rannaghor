import { ProductRow } from '@/components/product/ProductRow';
import { FEATURED } from '@/data/products';

export function FeaturedSection() {
  return (
    <ProductRow
      title="ফিচার্ড পণ্য"
      subtitle="বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য"
      accent="আমাদের বাছাই"
      href="/shop?featured=true"
      products={FEATURED}
      bg="bg-white"
    />
  );
}
