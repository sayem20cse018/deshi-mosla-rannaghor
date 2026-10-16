import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'সাধারণ জিজ্ঞাসা (FAQ) | দেশি মসলার রান্নাঘর',
  description: 'দেশি মসলার রান্নাঘর সম্পর্কে সাধারণ প্রশ্ন ও উত্তর।',
};

const FAQS = [
  { q: 'অর্ডার করতে কি অ্যাকাউন্ট লাগবে?', a: 'না, অ্যাকাউন্ট ছাড়াও অর্ডার করা যায়। তবে অ্যাকাউন্ট থাকলে অর্ডার ট্র্যাক করা, উইশলিস্ট সংরক্ষণ ও বিশেষ অফার পাওয়া সহজ হয়।' },
  { q: 'ডেলিভারি কতদিনে পাব?', a: 'ঢাকা মহানগরে ১-২ কার্যদিবস। ঢাকার বাইরে ২-৫ কার্যদিবস। সকাল ১১টার আগে অর্ডার করলে ঢাকায় একই দিনে ডেলিভারি সম্ভব।' },
  { q: 'ফ্রি ডেলিভারি কীভাবে পাব?', a: '৳১০০০ বা তার বেশি অর্ডারে সারাদেশে ফ্রি ডেলিভারি পাবেন। কুপন কোড FREEDEL ব্যবহার করেও ফ্রি ডেলিভারি পাওয়া যেতে পারে।' },
  { q: 'কোন পেমেন্ট পদ্ধতি গ্রহণযোগ্য?', a: 'ক্যাশ অন ডেলিভারি (COD), বিকাশ, নগদ, রকেট, ভিসা/মাস্টারকার্ড এবং ডেবিট কার্ড গ্রহণযোগ্য।' },
  { q: 'পণ্য নষ্ট পেলে কী করব?', a: 'ডেলিভারির ৭ দিনের মধ্যে আমাদের WhatsApp বা ইমেইলে যোগাযোগ করুন। অর্ডার নম্বর ও পণ্যের ছবি পাঠান, আমরা দ্রুত সমাধান করব।' },
  { q: 'পণ্যগুলো কি সত্যিই খাঁটি?', a: 'হ্যাঁ, আমাদের সব পণ্য ১০০% খাঁটি ও প্রাকৃতিক। আমরা সরাসরি কৃষক ও উৎপাদনকারীদের কাছ থেকে সংগ্রহ করি এবং কোনো কৃত্রিম উপাদান ব্যবহার করি না।' },
  { q: 'কুপন কোড কোথায় ব্যবহার করব?', a: 'চেকআউট পেজে কুপন কোডের ঘরে কোড লিখুন এবং "প্রয়োগ" বোতাম চাপুন। ছাড় স্বয়ংক্রিয়ভাবে প্রযোজ্য হবে।' },
  { q: 'অর্ডার বাতিল করা যাবে?', a: 'অর্ডার শিপমেন্টের আগ পর্যন্ত বাতিল করা যাবে। আপনার অ্যাকাউন্ট → অর্ডার বিস্তারিত পেজ থেকে "বাতিল করুন" বোতামে ক্লিক করুন।' },
  { q: 'রিভিউ কীভাবে দেব?', a: 'পণ্য ডেলিভারি পাওয়ার পর পণ্যের পেজে গিয়ে রিভিউ দিন। শুধুমাত্র ক্রয় করা পণ্যে রিভিউ দেওয়া যায়।' },
  { q: 'কাস্টমার সাপোর্টে কীভাবে যোগাযোগ করব?', a: 'WhatsApp: +880 1700-000000, Email: info@deshimoslar.com। সকাল ৯টা থেকে রাত ১০টা পর্যন্ত সাপোর্ট পাওয়া যায়।' },
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>সাধারণ জিজ্ঞাসা</h1>
          <p className="text-gray-500" style={{fontFamily:'Manrope,sans-serif'}}>Frequently Asked Questions</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-[15px] mb-2 flex items-start gap-2" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                <span className="text-[#ea580c] font-black flex-shrink-0">Q.</span>
                {faq.q}
              </h2>
              <p className="text-gray-600 text-[14px] leading-relaxed pl-6" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-gray-600 mb-3" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>আরো প্রশ্ন আছে?</p>
          <a href="https://wa.me/8801700000000"
            className="inline-flex items-center gap-2 bg-[#0f4c2a] hover:bg-[#0a3d22] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
            style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            WhatsApp-এ যোগাযোগ করুন
          </a>
        </div>
      </div>
    </div>
  );
}
