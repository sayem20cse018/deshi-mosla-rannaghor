'use client';

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

const WHATSAPP_MESSAGES = [
  { label: 'অর্ডার সম্পর্কে জিজ্ঞাসা', msg: 'আমার একটি অর্ডার সম্পর্কে জানতে চাই।' },
  { label: 'পণ্যের তথ্য', msg: 'একটি পণ্য সম্পর্কে বিস্তারিত জানতে চাই।' },
  { label: 'ডেলিভারি জিজ্ঞাসা', msg: 'ডেলিভারি সম্পর্কে জানতে চাই।' },
  { label: 'রিটার্ন / রিফান্ড', msg: 'রিটার্ন বা রিফান্ড সম্পর্কে জানতে চাই।' },
];

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+8801700000000';

  function openChat(msg: string) {
    window.open(getWhatsAppUrl(phone, msg), '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    /* Bottom-right, above BackToTop, hidden on xs (below md MobileNav would overlap) */
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2">
      {/* ── Popup card ── */}
      <div
        className={cn(
          'bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-64',
          'transition-all duration-300 origin-bottom-right',
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none',
        )}
      >
        {/* Header */}
        <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">WhatsApp সাপোর্ট</p>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <p className="text-white/80 text-[11px]">সাধারণত কয়েক মিনিটে উত্তর</p>
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="বন্ধ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 space-y-1.5">
          <p className="text-xs text-gray-500 px-1 mb-2">কীসে সাহায্য করতে পারি?</p>
          {WHATSAPP_MESSAGES.map(({ label, msg }) => (
            <button
              key={label}
              onClick={() => openChat(msg)}
              className="w-full text-left text-sm text-gray-700 hover:text-[#25D366] hover:bg-green-50 px-3 py-2 rounded-xl transition-colors font-medium"
            >
              {label}
            </button>
          ))}

          {/* Direct chat */}
          <button
            onClick={() => openChat('আমি দেশি মসলার রান্নাঘর থেকে সাহায্য চাই।')}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 rounded-xl text-sm transition-colors mt-1"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            সরাসরি চ্যাট করুন
          </button>
        </div>
      </div>

      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'relative w-13 h-13 rounded-full shadow-xl flex items-center justify-center',
          'transition-all duration-300 hover:scale-110 active:scale-95',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300',
          open ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#25D366] hover:bg-[#1ebe5d]',
        )}
        style={{ width: 52, height: 52 }}
        aria-label="WhatsApp সাপোর্ট"
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        )}

        {/* Pulse ring — only when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}
      </button>
    </div>
  );
}
