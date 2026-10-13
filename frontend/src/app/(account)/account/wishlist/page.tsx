'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import toast from 'react-hot-toast';

// Local wishlist from localStorage (server wishlist in later step)
import { useState, useEffect } from 'react';
import { formatPriceEn } from '@/lib/utils';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    // Wishlist is stored locally until server wishlist is implemented (Step 8+)
    const saved = localStorage.getItem('dmr-wishlist');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  function remove(productId: string) {
    const updated = items.filter((i) => i.id !== productId);
    setItems(updated);
    localStorage.setItem('dmr-wishlist', JSON.stringify(updated));
    toast.success('উইশলিস্ট থেকে সরানো হয়েছে');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">আমার উইশলিস্ট</h2>
        {items.length > 0 && <p className="text-xs text-gray-400">{items.length} টি পণ্য</p>}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg mb-2">উইশলিস্ট খালি</p>
          <p className="text-gray-400 text-sm mb-6">
            পছন্দের পণ্যে হার্ট আইকন ক্লিক করে উইশলিস্টে যোগ করুন।
          </p>
          <Link href="/shop" className="btn-primary px-6">
            পণ্য দেখুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const effectivePrice = item.discountPrice ?? item.price;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-200 hover:shadow-sm transition-all group"
              >
                <Link href={`/product/${item.slug}`} className="block">
                  <div className="aspect-square bg-brand-50 flex items-center justify-center text-5xl">
                    {item.primaryImage ? (
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      '🌶️'
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-semibold text-sm text-gray-800 hover:text-brand-700 line-clamp-2 leading-snug block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-brand-700 font-bold mt-1.5">{formatPriceEn(effectivePrice)}</p>
                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => {
                        addItem(item, 1);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" /> কার্ট
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
