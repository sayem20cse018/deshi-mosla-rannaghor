'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles, Tag, BookOpen } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail]     = useState('');
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {});
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-10 px-4 bg-white">
      <div className="container mx-auto">
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-12 md:px-16 md:py-14"
          style={{
            background: 'linear-gradient(135deg, #7c1d06 0%, #c2410c 45%, #ea580c 100%)',
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.08]"
               style={{ background: 'radial-gradient(circle, #fff7ed, transparent)' }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #fed7aa, transparent)' }} />
          {/* Decorative leaf / plant shape */}
          <div className="absolute right-8 bottom-0 opacity-10 select-none pointer-events-none text-[140px] leading-none">
            🌿
          </div>

          <div className="relative z-10 max-w-xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              নিউজলেটার সাবস্ক্রাইব করুন
            </span>

            <h2 className="text-white font-black text-2xl md:text-3xl leading-snug mb-2"
                style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              সর্বশেষ অফার ও রেসিপি পান
            </h2>
            <p className="text-white/70 text-sm mb-7 leading-relaxed"
               style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              নতুন পণ্য, বিশেষ ছাড় ও রান্নার টিপস সরাসরি আপনার ইমেইলে। কোনো স্প্যাম নেই।
            </p>

            {done ? (
              <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-2xl px-5 py-4 font-bold backdrop-blur-sm"
                   style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                সাবস্ক্রিপশন সফল হয়েছে! ধন্যবাদ।
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2.5 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="আপনার ইমেইল ঠিকানা"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white rounded-xl pl-10 pr-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 border-0 shadow-lg"
                    style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 flex items-center gap-2 bg-white text-[#c2410c] font-black px-5 py-3.5 rounded-xl shadow-lg hover:bg-white/90 active:scale-95 transition-all text-sm disabled:opacity-70"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-[#c2410c]/30 border-t-[#c2410c] rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  সাবস্ক্রাইব
                </button>
              </form>
            )}

            {/* Perks */}
            <div className="flex flex-wrap items-center gap-5 mt-6">
              {[
                { icon: Sparkles, text: 'এক্সক্লুসিভ অফার' },
                { icon: BookOpen, text: 'সাপ্তাহিক রেসিপি' },
                { icon: Tag,      text: 'বিশেষ ছাড়' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-white/70 text-xs"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  <Icon className="w-3.5 h-3.5 text-white/60" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
