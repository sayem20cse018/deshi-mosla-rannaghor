'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles, Tag, BookOpen } from 'lucide-react';

export function NewsletterSection() {
  const [email,   setEmail]   = useState('');
  const [done,    setDone]    = useState(false);
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
        {/* Banner card */}
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-12 md:px-16 md:py-14 flex flex-col md:flex-row items-center gap-10"
          style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)', border: '1.5px solid #fed7aa' }}
        >
          {/* Decorative plant emoji */}
          <div className="absolute -right-4 -bottom-6 text-[160px] leading-none opacity-[0.12] select-none pointer-events-none rotate-12">
            🌿
          </div>
          <div className="absolute right-24 top-4 text-[60px] leading-none opacity-[0.08] select-none pointer-events-none">
            🌱
          </div>

          {/* Left: text */}
          <div className="relative z-10 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] mb-4"
                  style={{ color: '#ea580c', fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ea580c' }} />
              নিউজলেটার
            </span>

            <h2 className="font-black text-gray-900 leading-snug mb-2"
                style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              Subscribe to Deshi Moslar Rannaghar
            </h2>
            <p className="text-gray-500 text-sm mb-7 leading-relaxed"
               style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              Fresh groceries, straight to your door.
            </p>

            {done ? (
              <div className="flex items-center gap-3 bg-white border border-green-200 text-[#ea580c] rounded-2xl px-5 py-4 font-bold max-w-md"
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
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-[#ea580c] transition-all shadow-sm"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 flex items-center gap-2 text-white font-black px-5 py-3.5 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #ea580c, #ea580c)', fontFamily: 'Manrope, sans-serif', boxShadow: '0 4px 12px rgba(15,76,42,0.3)' }}
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  Subscribe
                </button>
              </form>
            )}

            {/* Perks */}
            <div className="flex flex-wrap items-center gap-5 mt-5">
              {[
                { icon: Sparkles, text: 'এক্সক্লুসিভ অফার' },
                { icon: BookOpen, text: 'সাপ্তাহিক রেসিপি' },
                { icon: Tag,      text: 'বিশেষ ছাড়' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs"
                     style={{ color: '#c2410c', fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  <Icon className="w-3.5 h-3.5" />
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
