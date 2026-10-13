'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RotateCcw, ShoppingBag, Home } from 'lucide-react';

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-black text-red-700 mb-2">পেমেন্ট ব্যর্থ হয়েছে!</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          আপনার পেমেন্ট প্রক্রিয়া সম্পন্ন হয়নি।
          কোনো টাকা কাটা হয়নি। আবার চেষ্টা করুন।
        </p>

        {/* Reasons */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-bold text-red-700 mb-2">সম্ভাব্য কারণ:</p>
          <ul className="text-xs text-red-600 space-y-1">
            <li>• অপর্যাপ্ত ব্যালেন্স</li>
            <li>• কার্ড/অ্যাকাউন্ট তথ্য ভুল</li>
            <li>• ব্যাংক ট্রানজেকশন লিমিট অতিক্রম</li>
            <li>• নেটওয়ার্ক সমস্যা</li>
          </ul>
        </div>

        <div className="space-y-2.5">
          {/* Retry */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> আবার চেষ্টা করুন
          </Link>

          {/* View order if we have orderId */}
          {orderId && (
            <Link
              href={`/account/orders`}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-700 font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> আমার অর্ডার দেখুন
            </Link>
          )}

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-brand-600 text-sm py-2 transition-colors"
          >
            <Home className="w-4 h-4" /> হোমপেজে যান
          </Link>
        </div>

        {/* Help */}
        <p className="text-xs text-gray-400 mt-5">
          সমস্যা হলে হোয়াটসঅ্যাপে যোগাযোগ করুন:{' '}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8801700000000'}`}
            className="text-brand-600 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            আমাদের সাপোর্ট
          </a>
        </p>
      </div>
    </div>
  );
}
