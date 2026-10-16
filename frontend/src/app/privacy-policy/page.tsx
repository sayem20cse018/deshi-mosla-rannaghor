import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'প্রাইভেসি পলিসি | দেশি মসলার রান্নাঘর',
  description: 'দেশি মসলার রান্নাঘরের গোপনীয়তা নীতিমালা ও তথ্য সুরক্ষা।',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>প্রাইভেসি পলিসি</h1>
          <p className="text-gray-400 text-sm mb-8" style={{fontFamily:'Manrope,sans-serif'}}>Privacy Policy — সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>

          <div className="space-y-6" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            {[
              { title: '১. তথ্য সংগ্রহ', body: 'আমরা অ্যাকাউন্ট তৈরি, অর্ডার প্রক্রিয়া ও সেবা উন্নয়নের জন্য নাম, ইমেইল, ফোন নম্বর, ডেলিভারি ঠিকানা সংগ্রহ করি। পেমেন্ট তথ্য (CVV, PIN) কখনো সংরক্ষণ করা হয় না।' },
              { title: '২. তথ্য ব্যবহার', body: 'আপনার তথ্য অর্ডার পূরণ, ডেলিভারি, গ্রাহক সেবা এবং নতুন অফার জানানোর জন্য ব্যবহার করা হয়। আপনি যেকোনো সময় প্রমোশনাল ইমেইল থেকে আনসাবস্ক্রাইব করতে পারবেন।' },
              { title: '৩. তথ্য সুরক্ষা', body: 'আমরা SSL এনক্রিপশন ব্যবহার করি। তৃতীয় পক্ষের পেমেন্ট গেটওয়ে (SSLCommerz) তাদের নিজস্ব নিরাপত্তা মান অনুসরণ করে। আমরা কখনো আপনার তথ্য বিক্রি করি না।' },
              { title: '৪. কুকিজ', body: 'আমরা সাইটের কার্যকারিতা উন্নয়নের জন্য কুকিজ ব্যবহার করি। ব্রাউজার সেটিংসে কুকিজ বন্ধ করা যাবে, তবে কিছু ফিচার কাজ নাও করতে পারে।' },
              { title: '৫. তৃতীয় পক্ষ', body: 'ডেলিভারি পার্টনার ও পেমেন্ট গেটওয়ে সেবা দেওয়ার জন্য প্রয়োজনীয় তথ্য পায়। তারা তাদের নিজস্ব প্রাইভেসি পলিসি অনুসরণ করে।' },
              { title: '৬. আপনার অধিকার', body: 'আপনি যেকোনো সময় আপনার তথ্য দেখতে, সংশোধন করতে বা মুছে দিতে অনুরোধ করতে পারবেন। info@deshimoslar.com-এ যোগাযোগ করুন।' },
              { title: '৭. যোগাযোগ', body: 'প্রাইভেসি সংক্রান্ত যেকোনো প্রশ্নে info@deshimoslar.com বা +880 1700-000000 নম্বরে যোগাযোগ করুন।' },
            ].map(({ title, body }) => (
              <div key={title} className="border-b border-gray-50 pb-6 last:border-0">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <Link href="/terms" className="text-[#0f4c2a] font-semibold text-sm hover:underline">শর্তাবলী →</Link>
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-700 ml-auto">হোমে ফিরুন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
