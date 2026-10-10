import { Leaf, Shield, Truck, MessageCircle } from 'lucide-react';

const BADGES = [
  { icon: Leaf,          title: '১০০% খাঁটি পণ্য',   sub: 'কৃত্রিম উপাদান ছাড়া',       color: 'bg-green-50  text-green-700'  },
  { icon: Shield,        title: 'নিরাপদ পেমেন্ট',    sub: 'SSL এনক্রিপ্টেড সুরক্ষা',   color: 'bg-blue-50   text-blue-700'   },
  { icon: Truck,         title: 'দ্রুত ডেলিভারি',     sub: 'সারাদেশে হোম ডেলিভারি',     color: 'bg-purple-50 text-purple-700' },
  { icon: MessageCircle, title: 'সার্বক্ষণিক সাপোর্ট', sub: 'WhatsApp ও ফোনে সহায়তা',   color: 'bg-orange-50 text-orange-700' },
];

export function TrustBadges() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.map(({ icon: Icon, title, sub, color }) => (
            <div key={title} className="flex items-center gap-3 py-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color.split(' ')[0]}`}>
                <Icon className={`w-4.5 h-4.5 ${color.split(' ')[1]}`} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-800 font-semibold text-xs leading-tight truncate">{title}</p>
                <p className="text-gray-400 text-[11px] leading-tight truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
