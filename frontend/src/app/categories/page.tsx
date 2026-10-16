import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'সব ক্যাটাগরি | দেশি মসলার রান্নাঘর',
  description: 'দেশি মসলার রান্নাঘরের সব পণ্য ক্যাটাগরি দেখুন।',
};

const ALL_CATEGORIES = [
  { slug: 'mosla',   name: 'মসলা',     nameEn: 'Spices',    icon: '🌶️', desc: 'হলুদ, মরিচ, জিরা, ধনে সহ সব মসলা' },
  { slug: 'tel',     name: 'তেল',      nameEn: 'Oil',       icon: '🫙',  desc: 'সরিষার তেল, নারকেল তেল, সয়াবিন' },
  { slug: 'chal',    name: 'চাল',      nameEn: 'Rice',      icon: '🍚',  desc: 'মিনিকেট, বিরিয়ানি, বাসমতি চাল' },
  { slug: 'dal',     name: 'ডাল',      nameEn: 'Dal',       icon: '🫘',  desc: 'মসুর, মুগ, বুট, অড়হর ডাল' },
  { slug: 'ata',     name: 'আটা',      nameEn: 'Flour',     icon: '🌾',  desc: 'গমের আটা, ময়দা, সুজি' },
  { slug: 'modhu',   name: 'মধু',      nameEn: 'Honey',     icon: '🍯',  desc: 'সুন্দরবন, লিচু ফুলের খাঁটি মধু' },
  { slug: 'chini',   name: 'চিনি',     nameEn: 'Sugar',     icon: '🍬',  desc: 'চিনি, গুড়, খেজুরের গুড়' },
  { slug: 'cha',     name: 'চা',       nameEn: 'Tea',       icon: '☕',  desc: 'সিলেটি চা, গ্রিন টি, আদা চা' },
  { slug: 'snacks',  name: 'স্ন্যাকস', nameEn: 'Snacks',   icon: '🍿',  desc: 'চিপস, বিস্কুট, চকোলেট' },
  { slug: 'noodles', name: 'নুডলস',   nameEn: 'Noodles',   icon: '🍜',  desc: 'ইন্সট্যান্ট নুডলস, পাস্তা' },
  { slug: 'sauce',   name: 'সস',       nameEn: 'Sauce',     icon: '🥫',  desc: 'টমেটো সস, চিলি সস, সয়া সস' },
  { slug: 'achar',   name: 'আচার',     nameEn: 'Pickle',    icon: '🥒',  desc: 'আমের আচার, মিক্সড আচার' },
];

export default function CategoriesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>সব ক্যাটাগরি</h1>
          <p className="text-gray-500 text-sm" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>যেকোনো ক্যাটাগরি থেকে পণ্য বেছে নিন</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {ALL_CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-[#ea580c]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
              <p className="font-bold text-gray-900 text-[13px] leading-tight" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{cat.name}</p>
              <p className="text-gray-400 text-[11px] mt-0.5" style={{fontFamily:'Manrope,sans-serif'}}>{cat.nameEn}</p>
              <p className="text-gray-400 text-[11px] mt-1.5 leading-snug hidden sm:block" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{cat.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#0f4c2a] hover:bg-[#0a3d22] text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            সব পণ্য দেখুন →
          </Link>
        </div>
      </div>
    </div>
  );
}
