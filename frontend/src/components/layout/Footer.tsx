'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram, Youtube, Twitter,
  ChevronRight, Shield, Truck, RotateCcw, MessageCircle,
  Send,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────
const ABOUT_LINKS = [
  { href: '/about',          label: 'আমাদের সম্পর্কে'  },
  { href: '/blog',           label: 'ব্লগ'              },
  { href: '/faq',            label: 'সাধারণ জিজ্ঞাসা'  },
  { href: '/order-tracking', label: 'অর্ডার ট্র্যাক'   },
  { href: '/return-policy',  label: 'রিটার্ন পলিসি'     },
  { href: '/about#story',    label: 'ফাউন্ডার স্টোরি'  },
];

const POLICY_LINKS = [
  { href: '/terms',           label: 'শর্তাবলী'          },
  { href: '/privacy-policy',  label: 'প্রাইভেসি পলিসি'  },
  { href: '/return-policy',   label: 'রিটার্ন ও এক্সচেঞ্জ' },
  { href: '/about#shipping',  label: 'শিপিং ও ডেলিভারি' },
];

const CATEGORIES = [
  { href: '/category/mosla',       label: 'মসলা'     },
  { href: '/category/tel',         label: 'তেল'       },
  { href: '/category/chal',        label: 'চাল'       },
  { href: '/category/dal',         label: 'ডাল'       },
  { href: '/category/modhu',       label: 'মধু'       },
  { href: '/category/cha',         label: 'চা'         },
  { href: '/category/snacks',      label: 'স্ন্যাকস'  },
  { href: '/category/sauce-achar', label: 'সস ও আচার' },
];

const PAYMENT = [
  { label: 'COD',        bg: 'bg-gray-700 text-gray-200' },
  { label: 'bKash',      bg: 'bg-pink-900/60 text-pink-300' },
  { label: 'Nagad',      bg: 'bg-orange-800/60 text-orange-300' },
  { label: 'Rocket',     bg: 'bg-purple-900/60 text-purple-300' },
  { label: 'Visa',       bg: 'bg-blue-900/60 text-blue-300' },
  { label: 'Mastercard', bg: 'bg-red-900/60 text-red-300' },
  { label: 'SSL',        bg: 'bg-green-900/60 text-green-300' },
];

export function Footer() {
  return (
    <footer style={{ background: '#0b1d13', fontFamily: 'Noto Sans Bengali, Inter, sans-serif' }}>

      {/* ── Trust strip ──────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield,        text: '১০০% খাঁটি পণ্য'  },
              { icon: Truck,         text: 'দ্রুত ডেলিভারি'    },
              { icon: RotateCcw,     text: 'সহজ রিটার্ন'       },
              { icon: MessageCircle, text: '২৪/৭ সাপোর্ট'     },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(234,88,12,0.15)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#ea580c' }} strokeWidth={1.75} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#d1d5db' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 flex-shrink-0">
                <div className="absolute inset-0 rounded-[14px] shadow-md group-hover:scale-105 transition-transform duration-200"
                     style={{ background: 'linear-gradient(135deg, #c2410c, #ea580c)' }} />
                <div className="absolute inset-[3px] rounded-[10px] border border-white/20 flex items-center justify-center">
                  <span className="text-white font-black text-[15px] leading-none">দম</span>
                </div>
                <div className="absolute top-[5px] right-[5px] w-[5px] h-[5px] rounded-full bg-white/45" />
              </div>
              <div className="leading-none">
                <p className="text-white font-black text-[15px] leading-snug">দেশি মসলার রান্নাঘর</p>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-1"
                   style={{ color: '#ea580c', fontFamily: 'Inter, sans-serif' }}>
                  Deshi Moslar Rannaghar
                </p>
              </div>
            </Link>

            <p className="text-sm leading-[1.8]" style={{ color: '#9ca3af', maxWidth: '320px' }}>
              বাংলাদেশের বিশ্বস্ত অনলাইন মসলা ও গ্রোসারি শপ। ১০০% খাঁটি দেশীয় পণ্য, সরাসরি আপনার দরজায়।
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              {[
                { icon: Phone, text: '+880 1700-000000', href: 'tel:+8801700000000' },
                { icon: Mail,  text: 'info@deshimoslar.com', href: 'mailto:info@deshimoslar.com' },
                { icon: MapPin, text: 'ঢাকা, বাংলাদেশ', href: null },
                { icon: Clock,  text: 'সকাল ১০টা – রাত ১০টা', href: null },
              ].map(({ icon: Icon, text, href }) => {
                const inner = (
                  <div className="flex items-center gap-2.5 text-sm group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                         style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} strokeWidth={1.75} />
                    </div>
                    <span style={{ color: '#9ca3af', fontFamily: 'Inter, Noto Sans Bengali, sans-serif' }}
                          className="group-hover:text-white transition-colors">{text}</span>
                  </div>
                );
                return href
                  ? <a key={text} href={href}>{inner}</a>
                  : <div key={text}>{inner}</div>;
              })}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { href: 'https://facebook.com', Icon: Facebook,  label: 'Facebook',  hoverBg: '#1877f2' },
                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram', hoverBg: '#e1306c' },
                { href: 'https://youtube.com',   Icon: Youtube,   label: 'YouTube',   hoverBg: '#ff0000' },
                { href: 'https://twitter.com',   Icon: Twitter,   label: 'Twitter',   hoverBg: '#1da1f2' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200"
                   style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#9ca3af' }} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* About column */}
          <div className="lg:col-span-2">
            <h5 className="text-white font-bold text-[12px] uppercase tracking-[0.14em] mb-4"
                style={{ fontFamily: 'Inter, sans-serif' }}>
              আমাদের সম্পর্কে
            </h5>
            <ul className="space-y-2.5">
              {ABOUT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="flex items-center gap-1.5 text-sm transition-colors hover:text-white group"
                        style={{ color: '#9ca3af' }}>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 -ml-1 transition-all flex-shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy column */}
          <div className="lg:col-span-2">
            <h5 className="text-white font-bold text-[12px] uppercase tracking-[0.14em] mb-4"
                style={{ fontFamily: 'Inter, sans-serif' }}>
              পলিসি
            </h5>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                        className="flex items-center gap-1.5 text-sm transition-colors hover:text-white group"
                        style={{ color: '#9ca3af' }}>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 -ml-1 transition-all flex-shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories + Payment column */}
          <div className="lg:col-span-4 space-y-7">
            <div>
              <h5 className="text-white font-bold text-[12px] uppercase tracking-[0.14em] mb-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                পণ্য ক্যাটাগরি
              </h5>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {CATEGORIES.map((c) => (
                  <Link key={c.href} href={c.href}
                        className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group"
                        style={{ color: '#9ca3af' }}>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 -ml-1 flex-shrink-0 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <h5 className="text-white font-bold text-[12px] uppercase tracking-[0.14em] mb-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                পেমেন্ট পদ্ধতি
              </h5>
              <div className="flex flex-wrap gap-2">
                {PAYMENT.map(({ label, bg }) => (
                  <span key={label}
                        className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold leading-none ${bg}`}
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-[11px] mt-3 leading-relaxed" style={{ color: '#6b7280' }}>
                সকল পেমেন্ট SSL এনক্রিপ্টেড ও নিরাপদ।
              </p>
            </div>

            {/* App download */}
            <div>
              <h5 className="text-white font-bold text-[12px] uppercase tracking-[0.14em] mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                অ্যাপ ডাউনলোড করুন
              </h5>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🤖 Google Play', href: '#' },
                  { label: '🍎 App Store',  href: '#' },
                ].map(({ label, href }) => (
                  <a key={label} href={href}
                     className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                     style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Inter, sans-serif' }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
               style={{ color: '#6b7280' }}>
            <p style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              © ২০২৫ দেশি মসলার রান্নাঘর। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-4" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              {[
                { href: '/privacy-policy', label: 'প্রাইভেসি পলিসি' },
                { href: '/terms',          label: 'শর্তাবলী' },
                { href: '/sitemap',        label: 'সাইটম্যাপ' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="hover:text-gray-300 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
