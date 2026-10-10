import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const CATEGORIES = [
  { slug: 'mosla',         name: 'মসলা',          nameEn: 'Spices',           emoji: '🌶️', count: '৮০+',  color: 'from-red-50    to-orange-50',  border: 'border-red-100',    text: 'text-red-700'    },
  { slug: 'tel',           name: 'রান্নার তেল',   nameEn: 'Cooking Oil',      emoji: '🫙', count: '১২+',  color: 'from-yellow-50 to-amber-50',   border: 'border-yellow-100', text: 'text-yellow-700'  },
  { slug: 'chal',          name: 'চাল',            nameEn: 'Rice',             emoji: '🍚', count: '১৫+',  color: 'from-blue-50   to-cyan-50',    border: 'border-blue-100',   text: 'text-blue-700'    },
  { slug: 'dal',           name: 'ডাল',            nameEn: 'Lentils',          emoji: '🫘', count: '১০+',  color: 'from-green-50  to-emerald-50', border: 'border-green-100',  text: 'text-green-700'   },
  { slug: 'ata-maida',     name: 'আটা ও ময়দা',   nameEn: 'Flour',            emoji: '🌾', count: '৮+',   color: 'from-amber-50  to-yellow-50',  border: 'border-amber-100',  text: 'text-amber-700'   },
  { slug: 'lobon',         name: 'লবণ',            nameEn: 'Salt',             emoji: '🧂', count: '৫+',   color: 'from-slate-50  to-gray-50',    border: 'border-slate-100',  text: 'text-slate-700'   },
  { slug: 'chini-gur',     name: 'চিনি ও গুড়',   nameEn: 'Sugar & Molasses', emoji: '🍯', count: '৭+',   color: 'from-orange-50 to-red-50',     border: 'border-orange-100', text: 'text-orange-700'  },
  { slug: 'cha-kofi',      name: 'চা ও কফি',      nameEn: 'Tea & Coffee',     emoji: '☕', count: '১০+',  color: 'from-stone-50  to-amber-50',   border: 'border-stone-100',  text: 'text-stone-700'   },
  { slug: 'snacks',        name: 'স্ন্যাকস',       nameEn: 'Snacks',           emoji: '🍿', count: '২০+',  color: 'from-pink-50   to-rose-50',    border: 'border-pink-100',   text: 'text-pink-700'    },
  { slug: 'noodles',       name: 'নুডলস',          nameEn: 'Noodles',          emoji: '🍜', count: '৮+',   color: 'from-violet-50 to-purple-50',  border: 'border-violet-100', text: 'text-violet-700'  },
  { slug: 'sauce-achar',   name: 'সস ও আচার',     nameEn: 'Sauce & Pickle',   emoji: '🥫', count: '১৫+',  color: 'from-lime-50   to-green-50',   border: 'border-lime-100',   text: 'text-lime-700'    },
  { slug: 'modhu',         name: 'মধু',            nameEn: 'Honey',            emoji: '🍯', count: '৬+',   color: 'from-yellow-50 to-orange-50',  border: 'border-yellow-100', text: 'text-yellow-800'  },
  { slug: 'cooking-items', name: 'রান্নার পণ্য',   nameEn: 'Cooking Items',    emoji: '🥘', count: '৩০+',  color: 'from-teal-50   to-cyan-50',    border: 'border-teal-100',   text: 'text-teal-700'    },
];

export function CategorySection() {
  return (
    <section className="section-wrap bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="ক্যাটাগরির সমূহ"
          subtitle="পছন্দের ক্যাটাগরি থেকে পণ্য বেছে নিন"
          accent="শপ বাই ক্যাটাগরি"
          href="/categories"
        />

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5 md:gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`group flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} hover:shadow-md hover:scale-105 transition-all duration-200 text-center`}
            >
              <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300 leading-none">
                {cat.emoji}
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${cat.text}`}>{cat.name}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{cat.count} পণ্য</p>
              </div>
            </Link>
          ))}

          {/* View all card */}
          <Link
            href="/categories"
            className="group flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 border border-brand-600 hover:shadow-lg hover:scale-105 transition-all duration-200 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <p className="text-white text-xs font-bold leading-tight">সব ক্যাটাগরি</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
