'use client';

import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram, Youtube, Twitter,
  ChevronRight,
} from 'lucide-react';

const ABOUT_LINKS = [
  { href: '/about',          label: 'আমাদের সম্পর্কে'  },
  { href: '/blog',           label: 'ব্লগ'              },
  { href: '/faq',            label: 'সাধারণ জিজ্ঞাসা'  },
  { href: '/order-tracking', label: 'অর্ডার ট্র্যাক'   },
  { href: '/return-policy',  label: 'রিটার্ন পলিসি'     },
  { href: '/about#story',    label: 'ফাউন্ডার স্টোরি'  },
];

const POLICY_LINKS = [
  { href: '/terms',           label: 'শর্তাবলী'              },
  { href: '/privacy-policy',  label: 'প্রাইভেসি পলিসি'      },
  { href: '/return-policy',   label: 'রিটার্ন ও এক্সচেঞ্জ'  },
  { href: '/about#shipping',  label: 'শিপিং ও ডেলিভারি'     },
];

const CATEGORIES = [
  { href: '/category/mosla',       label: 'মসলা'      },
  { href: '/category/tel',         label: 'তেল'        },
  { href: '/category/chal',        label: 'চাল'        },
  { href: '/category/dal',         label: 'ডাল'        },
  { href: '/category/modhu',       label: 'মধু'        },
  { href: '/category/cha',         label: 'চা'          },
  { href: '/category/snacks',      label: 'স্ন্যাকস'   },
  { href: '/category/sauce-achar', label: 'সস ও আচার'  },
];

const PAYMENT = [
  { label: 'COD',        bg: '#1f2937', color: '#d1fae5' },
  { label: 'bKash',      bg: '#9d174d', color: '#fce7f3' },
  { label: 'Nagad',      bg: '#b45309', color: '#fef3c7' },
  { label: 'Rocket',     bg: '#5b21b6', color: '#ede9fe' },
  { label: 'Visa',       bg: '#1d4ed8', color: '#dbeafe' },
  { label: 'MC',         bg: '#991b1b', color: '#fee2e2' },
  { label: 'SSL',        bg: '#065f46', color: '#d1fae5' },
];

const FONT_BN = 'Noto Sans Bengali, sans-serif';
const FONT_EN = 'Inter, Manrope, sans-serif';

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="font-black text-white text-[11px] uppercase tracking-[0.14em] mb-4 pb-2"
        style={{ fontFamily: FONT_EN, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {children}
    </h5>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href}
            className="flex items-center gap-1.5 text-[13px] transition-colors group"
            style={{ color: '#9ca3af' }}>
        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 -ml-1 flex-shrink-0 transition-all" />
        <span className="group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150"
              style={{ fontFamily: FONT_BN }}>{children}</span>
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer style={{ background: '#0b1d13', fontFamily: FONT_BN }}>

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* ── Brand col ── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 flex-shrink-0">
                <div className="absolute inset-0 rounded-[14px] group-hover:scale-105 transition-transform duration-200"
                     style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)', boxShadow: '0 4px 12px rgba(15,76,42,0.4)' }} />
                <div className="absolute inset-[3px] rounded-[10px] border border-white/20 flex items-center justify-center">
                  <span className="text-white font-black text-[15px] leading-none" style={{ fontFamily: FONT_BN }}>দম</span>
                </div>
                <div className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-white/45" />
              </div>
              <div>
                <p className="text-white font-black text-[15px] leading-snug" style={{ fontFamily: FONT_BN }}>দেশি মসলার রান্নাঘর</p>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-0.5"
                   style={{ color: '#fed7aa', fontFamily: FONT_EN }}>Deshi Moslar Rannaghar</p>
              </div>
            </Link>

            {/* Description */}
            <p className="text-[13px] leading-[1.85]" style={{ color: '#9ca3af', maxWidth: '300px', fontFamily: FONT_BN }}>
              বাংলাদেশের বিশ্বস্ত অনলাইন মসলা ও গ্রোসারি শপ। ১০০% খাঁটি দেশীয় পণ্য, সরাসরি আপনার দরজায়।
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              {[
                { Icon: MapPin, text: 'ঢাকা, বাংলাদেশ',          href: null },
                { Icon: Phone,  text: '+880 1700-000000',          href: 'tel:+8801700000000' },
                { Icon: Mail,   text: 'info@deshimoslar.com',       href: 'mailto:info@deshimoslar.com' },
                { Icon: Clock,  text: 'সকাল ১০টা – রাত ১০টা',     href: null },
              ].map(({ Icon, text, href }) => {
                const el = (
                  <div className="flex items-center gap-2.5 text-[13px] group" key={text}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Icon className="w-3.5 h-3.5 group-hover:text-white transition-colors" style={{ color: '#6b7280' }} strokeWidth={1.75} />
                    </div>
                    <span className="group-hover:text-white transition-colors" style={{ color: '#9ca3af', fontFamily: 'Inter, Noto Sans Bengali, sans-serif' }}>
                      {text}
                    </span>
                  </div>
                );
                return href ? <a key={text} href={href}>{el}</a> : el;
              })}
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { href: 'https://facebook.com',  Icon: Facebook,  label: 'Facebook'  },
                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                { href: 'https://youtube.com',   Icon: Youtube,   label: 'YouTube'   },
                { href: 'https://twitter.com',   Icon: Twitter,   label: 'Twitter'   },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-200"
                   style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#9ca3af' }} strokeWidth={1.75} />
                </a>
              ))}
            </div>

            {/* App download */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: '🤖 Google Play', href: '#' },
                { label: '🍎 App Store',   href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                   className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white hover:bg-white/10 transition-all"
                   style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: FONT_EN }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── About col ── */}
          <div className="lg:col-span-2">
            <ColTitle>About Us</ColTitle>
            <ul className="space-y-2.5">
              {ABOUT_LINKS.map(l => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
            </ul>
          </div>

          {/* ── Policy col ── */}
          <div className="lg:col-span-2">
            <ColTitle>Policy</ColTitle>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map(l => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
            </ul>
          </div>

          {/* ── Categories + Payment col ── */}
          <div className="lg:col-span-4 space-y-7">
            <div>
              <ColTitle>Product Categories</ColTitle>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
                {CATEGORIES.map(c => (
                  <Link key={c.href} href={c.href}
                        className="text-[13px] transition-colors hover:text-white group flex items-center gap-1"
                        style={{ color: '#9ca3af', fontFamily: FONT_BN }}>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 flex-shrink-0 -ml-1 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <ColTitle>Pay With</ColTitle>
              <div className="flex flex-wrap gap-1.5">
                {PAYMENT.map(({ label, bg, color }) => (
                  <span key={label}
                        className="text-[10px] px-2.5 py-1.5 rounded-lg font-black leading-none"
                        style={{ background: bg, color, border: '1px solid rgba(255,255,255,0.08)' }}>
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-[11px] mt-3" style={{ color: '#4b5563' }}>
                সকল পেমেন্ট SSL এনক্রিপ্টেড ও নিরাপদ।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#4b5563' }}>
            <p style={{ fontFamily: FONT_BN }}>© ২০২৫ দেশি মসলার রান্নাঘর। সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-4">
              {[
                { href: '/privacy-policy', label: 'প্রাইভেসি পলিসি' },
                { href: '/terms',          label: 'শর্তাবলী' },
                { href: '/sitemap',        label: 'সাইটম্যাপ' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                      className="hover:text-gray-300 transition-colors"
                      style={{ fontFamily: FONT_BN }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
