import Link from 'next/link';
import { Leaf, Award, Truck, HeartHandshake, ArrowRight } from 'lucide-react';

const PILLARS = [
  { icon: Leaf,          title: '১০০% খাঁটি পণ্য',       desc: 'কোনো কৃত্রিম রং বা সংযোজন ছাড়া সম্পূর্ণ প্রাকৃতিক।' },
  { icon: Award,         title: 'মানসম্পন্ন উৎস',        desc: 'বাংলাদেশের সেরা কৃষক ও উৎপাদকদের কাছ থেকে সংগ্রহ।'    },
  { icon: Truck,         title: 'দ্রুত ডেলিভারি',         desc: 'ঢাকায় একইদিনে, সারাদেশে ২-৩ কার্যদিবসে।'               },
  { icon: HeartHandshake, title: 'বিশ্বস্ত সেবা',          desc: '৫ বছরের বেশি অভিজ্ঞতা, ১০,০০০+ গ্রাহকের আস্থা।'       },
];

export function BrandStorySection() {
  return (
    <section className="section-wrap bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left — text */}
          <div>
            <span className="text-xs font-semibold tracking-widest text-spice-500 uppercase">আমাদের পরিচয়</span>
            <h2 className="section-title mt-2 mb-4">
              From Our Kitchen to Yours
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              দেশি মসলার রান্নাঘর একটি বাংলাদেশি গ্রোসারি ই-কমার্স প্ল্যাটফর্ম যেখানে আপনি পাচ্ছেন ১০০% খাঁটি দেশীয় মসলা, তেল, চাল, ডাল এবং আরও অনেক নিত্যপ্রয়োজনীয় পণ্য।
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              আমরা বিশ্বাস করি প্রতিটি রান্নায় সঠিক মসলাই পার্থক্য তৈরি করে। তাই আমরা সরাসরি কৃষক ও উৎপাদকদের কাছ থেকে পণ্য সংগ্রহ করে আপনার কাছে পৌঁছে দিই।
            </p>
            <Link href="/about" className="btn-primary w-fit">
              আরও জানুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — pillars */}
          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-brand-200 hover:bg-brand-50 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-700" />
                </div>
                <h4 className="text-gray-800 font-semibold text-sm mb-1">{title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
