'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';

// Online payment gateway (bKash/SSLCommerz) success redirect
// COD orders go directly to /order/[id]/confirmation
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const orderId      = searchParams.get('order_id') || searchParams.get('tran_id');

  useEffect(() => {
    // If order ID present, redirect to confirmation page
    if (orderId) {
      router.replace(`/order/${orderId}/confirmation`);
    }
  }, [orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {orderId ? (
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          ) : (
            <CheckCircle className="w-8 h-8 text-green-600" />
          )}
        </div>
        <h1 className="text-xl font-bold text-green-700 mb-2">পেমেন্ট সফল হয়েছে!</h1>
        <p className="text-gray-500 text-sm mb-6">আপনার অর্ডার নিশ্চিত করা হয়েছে।</p>
        {orderId ? (
          <p className="text-xs text-gray-400">রিডাইরেক্ট হচ্ছে...</p>
        ) : (
          <Link href="/account/orders" className="btn-primary px-6">আমার অর্ডার দেখুন</Link>
        )}
      </div>
    </div>
  );
}
