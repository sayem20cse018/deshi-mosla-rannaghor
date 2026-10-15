import { Leaf, Shield, Truck, MessageCircle } from 'lucide-react';

const BADGES = [
  { icon: Leaf,          title: '১০০% খাঁটি পণ্য',    sub: 'কৃত্রিম উপাদান ছাড়া',    bg: 'bg-green-50',  color: 'text-green-700'  },
  { icon: Shield,        title: 'নিরাপদ পেমেন্ট',      sub: 'bKash • Nagad • COD',    bg: 'bg-blue-50',   color: 'text-blue-700'   },
  { icon: Truck,         title: 'দ্রুত ডেলিভারি',       sub: 'সারাদেশে হোম ডেলিভারি',  bg: 'bg-purple-50', color: 'text-purple-700' },
  { icon: MessageCircle, title: '২৪/৭ সাপোর্ট',        sub: 'WhatsApp সহায়তা',        bg: 'bg-spice-50',  color: 'text-spice-700'  },
];

export function TrustBadges() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {BADGES.map(({ icon: Icon, title, sub, bg, color }) => (
            <div key={title} className="flex items-center gap-3 py-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-800 font-bold text-xs leading-tight">{title}</p>
                <p className="text-gray-400 text-[11px] leading-tight mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
