import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'শর্তাবলী | দেশি মসলার রান্নাঘর',
  description: 'দেশি মসলার রান্নাঘরের সেবা ব্যবহারের শর্তাবলী ও নীতিমালা।',
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>শর্তাবলী</h1>
          <p className="text-gray-400 text-sm mb-8" style={{fontFamily:'Manrope,sans-serif'}}>Terms of Service — সর্বশেষ আপডেট: জানুয়ারি ২০২৫</p>

          <div className="prose prose-gray max-w-none space-y-6" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            {[
              { title: '১. সেবা ব্যবহারের শর্ত', body: 'দেশি মসলার রান্নাঘরের ওয়েবসাইট ও অ্যাপ ব্যবহার করে আপনি এই শর্তাবলীতে সম্মতি জানাচ্ছেন। আমাদের সেবা শুধুমাত্র বাংলাদেশে বৈধ বয়সের ব্যক্তিদের জন্য। আপনি সঠিক তথ্য প্রদান করতে বাধ্য।' },
              { title: '২. পণ্য ও মূল্য', body: 'সকল পণ্যের মূল্য বাংলাদেশি টাকায় (BDT)। মূল্য পরিবর্তনের অধিকার আমাদের সংরক্ষিত। স্টক সীমিত থাকায় অর্ডার কনফার্মেশনের আগ পর্যন্ত পণ্যের প্রাপ্যতা নিশ্চিত নয়।' },
              { title: '৩. অর্ডার ও ডেলিভারি', body: 'অর্ডার প্রদান করলে পেমেন্ট সম্পন্ন হওয়ার পর কনফার্মেশন পাবেন। ডেলিভারি সময় ঢাকায় ১-২ কার্যদিবস এবং অন্যত্র ২-৫ কার্যদিবস। ঠিকানা সঠিক না হলে ডেলিভারি বিলম্বিত হতে পারে।' },
              { title: '৪. পেমেন্ট', body: 'ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট এবং কার্ড পেমেন্ট গ্রহণযোগ্য। অনলাইন পেমেন্ট SSLCommerz নিরাপদ গেটওয়ের মাধ্যমে প্রক্রিয়া হয়। পেমেন্ট তথ্য আমরা সংরক্ষণ করি না।' },
              { title: '৫. রিটার্ন ও রিফান্ড', body: 'পণ্য গ্রহণের ৭ দিনের মধ্যে নষ্ট বা ভুল পণ্যের ক্ষেত্রে রিটার্ন গ্রহণ করা হয়। বিস্তারিত জানতে আমাদের রিটার্ন পলিসি দেখুন।' },
              { title: '৬. ব্যক্তিগত তথ্য', body: 'আপনার তথ্য আমাদের প্রাইভেসি পলিসি অনুযায়ী ব্যবহার করা হয়। আমরা কখনো তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি করি না।' },
              { title: '৭. যোগাযোগ', body: 'শর্তাবলী সম্পর্কিত যেকোনো প্রশ্নের জন্য info@deshimoslar.com বা WhatsApp-এ যোগাযোগ করুন।' },
            ].map(({ title, body }) => (
              <div key={title} className="border-b border-gray-50 pb-6 last:border-0">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-[#0f4c2a] font-semibold text-sm hover:underline">প্রাইভেসি পলিসি →</Link>
            <Link href="/return-policy" className="text-[#0f4c2a] font-semibold text-sm hover:underline">রিটার্ন পলিসি →</Link>
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-700 ml-auto">হোমে ফিরুন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
