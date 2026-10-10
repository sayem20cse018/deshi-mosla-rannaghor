import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SpecialOfferBanner() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-spice-600 to-spice-500 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <div className="text-9xl leading-none select-none">🌶️</div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-2">
              বিশেষ অফার
            </div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
              দেশি মসলা ও আটা-ময়দায়
              <br />
              সর্বোচ্চ ২৫% পর্যন্ত ছাড়!
            </h3>
            <p className="text-white/80 text-sm">নির্বাচিত পণ্যে বিশেষ ছাড়। সীমিত সময়ের অফার।</p>
          </div>
          <Link href="/offers">
            <Button variant="default" size="lg" className="bg-white text-spice-600 hover:bg-gray-50 font-bold whitespace-nowrap">
              অফার দেখুন →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
