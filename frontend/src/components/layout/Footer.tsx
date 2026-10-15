import Link from 'next/link';
import {
  Phone, Mail, MapPin, Facebook, Instagram, Youtube,
  ChevronRight, Shield, Truck, RotateCcw, MessageCircle,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────
const QUICK_LINKS = [
  { href: '/',             label: 'হোম',               emoji: '🏠' },
  { href: '/shop',         label: 'শপ',                emoji: '🛍️' },
  { href: '/categories',   label: 'ক্যাটাগরি',         emoji: '📦' },
  { href: '/blog',         label: 'ব্লগ',              emoji: '📖' },
  { href: '/about',        label: 'আমাদের সম্পর্কে',   emoji: 'ℹ️'  },
];

const HELP_LINKS = [
  { href: '/account',        label: 'আমার অ্যাকাউন্ট'   },
  { href: '/order-tracking', label: 'অর্ডার ট্র্যাক'     },
  { href: '/account/orders', label: 'অর্ডার হিস্ট্রি'    },
  { href: '/account/wishlist',label: 'উইশলিস্ট'          },
  { href: '/faq',            label: 'সাধারণ জিজ্ঞাসা'   },
  { href: '/return-policy',  label: 'রিটার্ন পলিসি'      },
];

const CATEGORIES = [
  { href: '/category/mosla',        label: '🌶️ মসলা'     },
  { href: '/category/tel',          label: '🫙 তেল'       },
  { href: '/category/chal',         label: '🍚 চাল'       },
  { href: '/category/dal',          label: '🫘 ডাল'       },
  { href: '/category/modhu',        label: '🍯 মধু'       },
  { href: '/category/cha',          label: '☕ চা'         },
  { href: '/category/snacks',       label: '🍿 স্ন্যাকস'  },
  { href: '/category/sauce-achar',  label: '🥫 সস'        },
];

const TRUST = [
  { icon: Shield,      text: '১০০% খাঁটি পণ্য'    },
  { icon: Truck,       text: 'দ্রুত ডেলিভারি'       },
  { icon: RotateCcw,   text: 'সহজ রিটার্ন'           },
  { icon: MessageCircle, text: '২৪/৭ সাপোর্ট'      },
];

const PAYMENT = [
  { label: 'COD',        bg: 'bg-gray-700 text-gray-200' },
  { label: 'bKash',      bg: 'bg-pink-900/60 text-pink-300' },
  { label: 'Nagad',      bg: 'bg-orange-900/60 text-orange-300' },
  { label: 'Rocket',     bg: 'bg-purple-900/60 text-purple-300' },
  { label: 'Visa',       bg: 'bg-blue-900/60 text-blue-300' },
  { label: 'Mastercard', bg: 'bg-red-900/60 text-red-300' },
];

export function Footer() {
  return (
    <footer className="bg-[#0b1d13] text-gray-400" style={{ fontFamily: 'Noto Sans Bengali, Inter, sans-serif' }}>

      {/* ── Trust strip ─────────────────────────────── */}
      <div className="border-b border-white/[0.06]">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest-700/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-forest-400" strokeWidth={1.75} />
                </div>
                <span className="text-sm font-medium text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* ── Brand column ── */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 flex-shrink-0">
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-forest-600 to-forest-900 shadow-md group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-[3px] rounded-[10px] border border-white/20 flex items-center justify-center">
                  <span className="text-white font-black text-[15px] leading-none">দম</span>
                </div>
                <div className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-white/45" />
              </div>
              <div className="leading-none">
                <p className="text-white font-black text-[15px] leading-snug">দেশি মসলার রান্নাঘর</p>
                <p className="text-forest-400 text-[10px] font-medium tracking-[0.18em] uppercase mt-1"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  Deshi Moslar Rannaghar
                </p>
              </div>
            </Link>

            {/* Description */}
            <p className="text-sm leading-[1.75] text-gray-400 max-w-sm">
              বাংলাদেশের বিশ্বস্ত অনলাইন মসলা ও গ্রোসারি শপ। ১০০% খাঁটি দেশীয় পণ্য, সরাসরি আপনার দরজায়। প্রতিটি পণ্যে রয়েছে গুণমানের নিশ্চয়তা।
            </p>

            {/* Social */}
            <div className="flex items-center gap-2.5">
              {[
                { href: 'https://facebook.com/deshimoslar', Icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-700' },
                { href: 'https://instagram.com/deshimoslar', Icon: Instagram, label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
                { href: 'https://youtube.com/deshimoslar', Icon: Youtube, label: 'YouTube', color: 'hover:bg-red-700' },
              ].map(({ href, Icon, label, color }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className={cn(
                    'w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-gray-400',
                    'hover:text-white transition-all duration-200',
                    color,
                  )}>
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="tel:+8801700000000"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-forest-700/40 transition-colors">
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif' }}>+880 1700-000000</span>
              </a>
              <a href="mailto:info@deshimoslar.com"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-forest-700/40 transition-colors">
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif' }}>info@deshimoslar.com</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                </div>
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2">
            <h5 className="text-white font-bold text-[13px] mb-4 uppercase tracking-[0.12em]" style={{ fontFamily: 'Inter, sans-serif' }}>
              দ্রুত লিংক
            </h5>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
                    <span className="text-sm leading-none opacity-70">{l.emoji}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{l.label}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Help ── */}
          <div className="lg:col-span-2">
            <h5 className="text-white font-bold text-[13px] mb-4 uppercase tracking-[0.12em]" style={{ fontFamily: 'Inter, sans-serif' }}>
              সাহায্য
            </h5>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{l.label}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories + Payment ── */}
          <div className="lg:col-span-4 space-y-7">
            {/* Categories */}
            <div>
              <h5 className="text-white font-bold text-[13px] mb-4 uppercase tracking-[0.12em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                ক্যাটাগরি
              </h5>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.href} href={c.href}
                    className="text-[12px] bg-white/[0.05] hover:bg-forest-700/50 border border-white/[0.08] hover:border-forest-600/50 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all duration-200 leading-none">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div>
              <h5 className="text-white font-bold text-[13px] mb-4 uppercase tracking-[0.12em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                পেমেন্ট পদ্ধতি
              </h5>
              <div className="flex flex-wrap gap-2">
                {PAYMENT.map(({ label, bg }) => (
                  <span key={label}
                    className={cn('text-[11px] px-3 py-1.5 rounded-lg font-bold border border-white/[0.08] leading-none', bg)}>
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-600 mt-3 leading-relaxed">
                সকল পেমেন্ট SSL এনক্রিপ্টেড ও নিরাপদ।
                আপনার কার্ড বা ব্যাংকিং তথ্য কখনো সংরক্ষণ করা হয় না।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              © ২০২৫ দেশি মসলার রান্নাঘর। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-4" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              {[
                { href: '/privacy-policy', label: 'প্রাইভেসি পলিসি' },
                { href: '/terms',          label: 'শর্তাবলী' },
                { href: '/sitemap',        label: 'সাইটম্যাপ' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="hover:text-gray-300 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── helper ────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
