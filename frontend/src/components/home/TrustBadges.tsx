import { Leaf, Shield, Truck, MessageCircle } from 'lucide-react';

const badges = [
  { icon: Leaf, title: '১০০% খাঁটি পণ্য', subtitle: 'কৃত্রিম উপাদান ছাড়া' },
  { icon: Shield, title: 'নিরাপদ পেমেন্ট', subtitle: 'SSL এনক্রিপ্টেড' },
  { icon: Truck, title: 'দ্রুত ডেলিভারি', subtitle: 'সারাদেশে ডেলিভারি' },
  { icon: MessageCircle, title: 'সার্বক্ষণিক সাপোর্ট', subtitle: 'WhatsApp সাপোর্ট' },
];

export function TrustBadges() {
  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-gray-500 text-xs">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
