import { ProductRow } from '@/components/product/ProductRow';
import { NEW_ARRIVALS } from '@/data/products';

export function NewArrivalsSection() {
  return (
    <ProductRow
      title="নতুন পণ্য"
      subtitle="সদ্য যোগ হওয়া পণ্যগুলো দেখুন"
      accent="নিউ অ্যারাইভাল"
      href="/shop?sort=newest"
      products={NEW_ARRIVALS}
      bg="bg-gray-50"
    />
  );
}
