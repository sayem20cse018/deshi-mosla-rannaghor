'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ShoppingBag, Home, ArrowLeft } from 'lucide-react';

export default function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
        {/* Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>

        <h1 className="text-2xl font-black text-amber-700 mb-2">পেমেন্ট বাতিল হয়েছে</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          আপনি পেমেন্ট প্রক্রিয়া বাতিল করেছেন।
          আপনার অর্ডারটি এখনো সংরক্ষিত আছে। আবার পেমেন্ট করতে পারবেন।
        </p>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-bold text-amber-700 mb-1">💡 আপনি কি জানেন?</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            কোনো টাকা কাটা হয়নি। আপনি চাইলে ক্যাশ অন ডেলিভারিতে পরিবর্তন করে অর্ডার সম্পন্ন করতে পারেন।
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Retry payment */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> আবার পেমেন্ট করুন
          </Link>

          {/* View orders */}
          {orderId && (
            <Link
              href="/account/orders"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-700 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> আমার অর্ডার দেখুন
            </Link>
          )}

          {/* Go back shopping */}
          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 border border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> কেনাকাটা চালিয়ে যান
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-brand-600 text-sm py-2 transition-colors"
          >
            <Home className="w-4 h-4" /> হোমপেজে যান
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-5">
          সাহায্য প্রয়োজন?{' '}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8801700000000'}`}
            className="text-brand-600 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            হোয়াটসঅ্যাপে যোগাযোগ করুন
          </a>
        </p>
      </div>
    </div>
  );
}
