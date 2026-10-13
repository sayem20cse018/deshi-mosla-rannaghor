import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';

const QUICK_LINKS = [
  { href: '/', label: 'হোম' },
  { href: '/shop', label: 'শপ' },
  { href: '/categories', label: 'ক্যাটাগরি' },
  { href: '/offers', label: 'বিশেষ অফার' },
  { href: '/recipes', label: 'রেসিপি' },
  { href: '/about', label: 'আমাদের সম্পর্কে' },
];

const CUSTOMER_LINKS = [
  { href: '/account', label: 'আমার অ্যাকাউন্ট' },
  { href: '/order-tracking', label: 'অর্ডার ট্র্যাক করুন' },
  { href: '/account/orders', label: 'অর্ডার হিস্ট্রি' },
  { href: '/account/wishlist', label: 'উইশলিস্ট' },
  { href: '/faq', label: 'সাধারণ জিজ্ঞাসা' },
  { href: '/return-policy', label: 'রিটার্ন পলিসি' },
];

const CATEGORIES = [
  { href: '/category/mosla', label: 'মসলা' },
  { href: '/category/tel', label: 'তেল' },
  { href: '/category/chal', label: 'চাল' },
  { href: '/category/dal', label: 'ডাল' },
  { href: '/category/modhu', label: 'মধু' },
  { href: '/category/cha-kofi', label: 'চা ও কফি' },
  { href: '/category/sauce-achar', label: 'সস ও আচার' },
];

const PAYMENT_METHODS = ['COD', 'bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard'];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer */}
      <div className="container mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">দম</span>
              </div>
              <div className="leading-none">
                <p className="text-white font-bold text-sm">দেশি মসলার রান্নাঘর</p>
                <p className="text-brand-400 text-xs mt-0.5">Deshi Moslar Rannaghar</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-5">
              বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। ১০০% খাঁটি দেশীয় পণ্য, সরাসরি আপনার
              দরজায়।
            </p>

            {/* Social */}
            <div className="flex gap-2">
              {[
                { href: '#', Icon: Facebook, label: 'Facebook' },
                { href: '#', Icon: Instagram, label: 'Instagram' },
                { href: '#', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-brand-700 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">দ্রুত লিংক</h5>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">কাস্টমার সার্ভিস</h5>
            <ul className="space-y-2.5">
              {CUSTOMER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h6 className="text-white text-xs font-semibold mb-2">ক্যাটাগরি</h6>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="text-[11px] bg-gray-800 hover:bg-gray-700 px-2 py-0.5 rounded transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">যোগাযোগ করুন</h5>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  +880 1700-000000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@deshimoslar.com"
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  info@deshimoslar.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                ঢাকা, বাংলাদেশ
              </li>
            </ul>

            {/* Payment */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                পেমেন্ট পদ্ধতি
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PAYMENT_METHODS.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] bg-gray-800 border border-gray-700 text-gray-300 px-2 py-0.5 rounded font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className="text-gray-500">© ২০২৫ দেশি মসলার রান্নাঘর। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              প্রাইভেসি পলিসি
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              শর্তাবলী
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              সাইটম্যাপ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
