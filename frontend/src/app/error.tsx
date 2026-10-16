'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-md w-full">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>কিছু একটা ভুল হয়েছে</h1>
        <p className="text-gray-500 text-sm mb-6" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
          একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset}
            className="bg-[#0f4c2a] hover:bg-[#0a3d22] text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
            style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            আবার চেষ্টা করুন
          </button>
          <Link href="/"
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            হোমে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}
