import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">দম</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">দেশি মসলার রান্নাঘর</p>
                <p className="text-brand-300 text-xs">Deshi Moslar Rannaghar</p>
              </div>
            </div>
            <p className="text-brand-300 text-sm leading-relaxed">
              বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। ১০০% খাঁটি দেশীয় পণ্য, সরাসরি আপনার দরজায়।
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="#" className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'হোম' },
                { href: '/shop', label: 'শপ' },
                { href: '/categories', label: 'ক্যাটাগরি' },
                { href: '/offers', label: 'অফার' },
                { href: '/recipes', label: 'রেসিপি' },
                { href: '/about', label: 'আমাদের পরিচয়' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-300 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-2">
              {[
                { href: '/account', label: 'আমার অ্যাকাউন্ট' },
                { href: '/order-tracking', label: 'অর্ডার ট্র্যাক করুন' },
                { href: '/account/orders', label: 'অর্ডার হিস্ট্রি' },
                { href: '/faq', label: 'সাধারণ জিজ্ঞাসা (FAQ)' },
                { href: '/return-policy', label: 'রিটার্ন পলিসি' },
                { href: '/contact', label: 'যোগাযোগ করুন' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-300 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">যোগাযোগ করুন</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-brand-300 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2 text-brand-300 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@deshimoslar.com</span>
              </li>
              <li className="flex items-start gap-2 text-brand-300 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-brand-400 text-xs mb-2">পেমেন্ট গ্রহণযোগ্য</p>
              <div className="flex gap-2 flex-wrap">
                {['COD', 'bKash', 'Nagad', 'Rocket', 'Card'].map((m) => (
                  <span key={m} className="bg-brand-800 text-brand-300 text-xs px-2 py-0.5 rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-brand-400 text-xs text-center">
            © ২০২৫ দেশি মসলার রান্নাঘর। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-brand-400 hover:text-white text-xs transition-colors">
              প্রাইভেসি পলিসি
            </Link>
            <Link href="/terms" className="text-brand-400 hover:text-white text-xs transition-colors">
              শর্তাবলী
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
