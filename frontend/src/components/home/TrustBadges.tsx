import { ShieldCheck, Truck, Star, Banknote } from 'lucide-react';

const CARDS = [
  {
    icon:    ShieldCheck,
    titleBn: '১০০% খাঁটি পণ্য',
    sub:     'কোনো কৃত্রিম উপাদান নেই',
    accent:  '#ea580c',
    bg:      '#fff7ed',
  },
  {
    icon:    Truck,
    titleBn: 'দ্রুত ডেলিভারি',
    sub:     'সারাদেশে হোম ডেলিভারি',
    accent:  '#0369a1',
    bg:      '#f0f9ff',
  },
  {
    icon:    Star,
    titleBn: 'বিশ্বস্ত মান',
    sub:     '১০,০০০+ সন্তুষ্ট গ্রাহক',
    accent:  '#92400e',
    bg:      '#fffbeb',
  },
  {
    icon:    Banknote,
    titleBn: 'ক্যাশ অন ডেলিভারি',
    sub:     'bKash • Nagad • COD',
    accent:  '#5b21b6',
    bg:      '#f5f3ff',
  },
];

export function TrustBadges() {
  return (
    <section className="bg-white border-b border-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CARDS.map(({ icon: Icon, titleBn, sub, accent, bg }) => (
            <div
              key={titleBn}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}
              >
                <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-gray-900 font-black text-[12px] leading-tight"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
                >
                  {titleBn}
                </p>
                <p
                  className="text-gray-400 text-[11px] leading-tight mt-0.5 truncate"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
                >
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
