import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Users, Shield, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে | দেশি মসলার রান্নাঘর',
  description: 'দেশি মসলার রান্নাঘর — বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। আমাদের লক্ষ্য ও মিশন জানুন।',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f4c2a] via-[#0f4c2a] to-[#072d18] text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🌶️</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            দেশি মসলার রান্নাঘর সম্পর্কে
          </h1>
          <p className="text-white/75 text-[15px] leading-relaxed" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            প্রতিটি রান্নায় আসল স্বাদ — ১০০% খাঁটি দেশীয় মসলা ও গ্রোসারি পণ্য, সরাসরি আপনার দরজায়।
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Story */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-4" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>আমাদের গল্প</h2>
          <div className="text-gray-600 text-[15px] leading-relaxed space-y-3" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            <p>দেশি মসলার রান্নাঘর প্রতিষ্ঠিত হয়েছে একটি সরল লক্ষ্য নিয়ে — বাংলাদেশের মানুষের কাছে খাঁটি, ভেজালমুক্ত দেশীয় মসলা ও খাদ্যপণ্য পৌঁছে দেওয়া।</p>
            <p>আমরা বিশ্বাস করি যে রান্নার আসল স্বাদ আসে খাঁটি উপাদান থেকে। তাই আমরা সরাসরি কৃষক ও উৎপাদনকারীদের সাথে কাজ করি এবং কোনো মধ্যস্থকারী ছাড়াই পণ্য আপনার কাছে পৌঁছে দিই।</p>
            <p>আমাদের প্রতিটি পণ্য কঠোর মান নিয়ন্ত্রণ প্রক্রিয়ার মধ্য দিয়ে যায়। কোনো কৃত্রিম রং, সুগন্ধি বা সংরক্ষক ব্যবহার করা হয় না।</p>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            { icon: Leaf, title: '১০০% খাঁটি পণ্য', body: 'কোনো কৃত্রিম উপাদান নেই। প্রকৃতির সেরা, সরাসরি আপনার কাছে।', colorBg: 'bg-green-50', colorText: 'text-green-600' },
            { icon: Users, title: 'কৃষক সহায়তা', body: 'স্থানীয় কৃষকদের সাথে সরাসরি কাজ করে ন্যায্য মূল্য নিশ্চিত করি।', colorBg: 'bg-blue-50', colorText: 'text-blue-600' },
            { icon: Shield, title: 'মান নিয়ন্ত্রণ', body: 'প্রতিটি পণ্য প্যাকেজিংয়ের আগে মান পরীক্ষা করা হয়।', colorBg: 'bg-purple-50', colorText: 'text-purple-600' },
            { icon: Truck, title: 'দ্রুত ডেলিভারি', body: 'সারাদেশে নির্ভরযোগ্য ডেলিভারি সেবা, ঢাকায় একইদিনে।', colorBg: 'bg-orange-50', colorText: 'text-orange-600' },
          ].map(({ icon: Icon, title, body, colorBg, colorText }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className={`w-10 h-10 rounded-xl ${colorBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${colorText}`} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{title}</h3>
              <p className="text-gray-500 text-sm" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{body}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#0f4c2a] to-[#0a3d22] rounded-2xl p-8 text-white text-center mb-6">
          <div className="grid grid-cols-3 gap-6">
            {[
              { v: '৫০০+', l: 'পণ্য' },
              { v: '১০ হাজার+', l: 'সন্তুষ্ট গ্রাহক' },
              { v: '৬৪ জেলা', l: 'ডেলিভারি' },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="text-2xl font-black" style={{fontFamily:'Manrope,sans-serif'}}>{v}</p>
                <p className="text-white/60 text-sm" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-8 py-3.5 rounded-xl transition-colors" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            কেনাকাটা শুরু করুন →
          </Link>
        </div>
      </div>
    </div>
  );
}
