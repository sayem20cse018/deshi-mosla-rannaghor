'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { cn } from '@/lib/utils';

// Popular categories to show in empty state
const QUICK_CATEGORIES = [
  { slug: 'mosla', label: '🌶️ মসলা' },
  { slug: 'tel', label: '🫙 তেল' },
  { slug: 'chal', label: '🍚 চাল' },
  { slug: 'dal', label: '🫘 ডাল' },
  { slug: 'modhu', label: '🍯 মধু' },
  { slug: 'cha-kofi', label: '☕ চা ও কফি' },
];

export default function CartPage() {
  const { items, clearCart, getTotals } = useCartStore();
  const totals = getTotals();

  // ── Empty state ──────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[70vh]">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-8 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">
              হোম
            </Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">কার্ট</span>
          </nav>

          <div className="max-w-lg mx-auto text-center">
            <div className="w-28 h-28 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-14 h-14 text-gray-200" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">কার্ট খালি আছে</h1>
            <p className="text-gray-500 text-sm mb-8">
              পণ্য যোগ করুন এবং আপনার পছন্দের পণ্য অর্ডার করুন।
              <br />
              দেশীয় মসলা, তেল, চাল ও আরও অনেক পণ্য পাচ্ছেন।
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-brand-700/20"
            >
              কেনাকাটা শুরু করুন
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Quick category links */}
            <div className="mt-10">
              <p className="text-sm text-gray-500 font-medium mb-3">জনপ্রিয় ক্যাটাগরি:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="chip text-sm hover:bg-brand-100 transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Cart with items ──────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-5">
          <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">
              হোম
            </Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">কার্ট</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">আমার কার্ট</h1>
              <p className="text-gray-400 text-sm mt-0.5">{totals.itemCount} টি পণ্য</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                কেনাকাটা চালিয়ে যান
              </Link>
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">সব সরান</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* ── Cart items list (left 2/3) ── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Column headers (desktop only) */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
              <span>পণ্য</span>
              <span className="text-center w-28">পরিমাণ</span>
              <span className="text-right w-24">মোট</span>
            </div>

            {/* Items */}
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} compact={false} />
            ))}

            {/* Mobile: Continue shopping */}
            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                কেনাকাটা চালিয়ে যান
              </Link>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                title="কার্ট রিফ্রেশ করুন"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                রিফ্রেশ
              </button>
            </div>

            {/* You may also like — quick add section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-2">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                💡 আপনার পছন্দ হতে পারে
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'ধনে গুঁড়া', slug: 'coriander-powder' },
                  { name: 'সরিষার তেল', slug: 'cold-press-mustard-oil' },
                  { name: 'সুন্দরবন মধু', slug: 'sundarbans-pure-honey' },
                  { name: 'বিরিয়ানি মসলা', slug: 'biryani-masala' },
                  { name: 'মিনিকেট চাল', slug: 'premium-miniket-rice' },
                ].map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    className="chip text-xs hover:bg-brand-100 transition-colors"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── CartSummary sidebar (right 1/3) ── */}
          <div className="lg:col-span-1">
            <CartSummary sticky />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">{totals.itemCount} পণ্য</p>
            <p className="text-lg font-black text-brand-700 leading-tight">
              ৳{totals.grandTotal.toLocaleString()}
            </p>
          </div>
          <Link
            href="/checkout"
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm transition-all"
          >
            অর্ডার করুন
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
