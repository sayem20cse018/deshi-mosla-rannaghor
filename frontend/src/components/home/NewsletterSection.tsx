'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Bell } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  }

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-brand-600" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            সর্বশেষ অফার ও রেসিপি পান
          </h2>
          <p className="text-gray-500 text-sm mt-2 mb-6">
            নতুন পণ্য, বিশেষ ছাড় ও রান্নার টিপস সরাসরি আপনার ইমেইলে। কোনো স্প্যাম নেই।
          </p>

          {done ? (
            <div className="flex items-center justify-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl p-4 font-semibold">
              <CheckCircle className="w-5 h-5" />
              সাবস্ক্রিপশন সফল হয়েছে! ধন্যবাদ।
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="আপনার ইমেইল ঠিকানা..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-shrink-0 px-4 py-2.5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                সাবস্ক্রাইব
              </button>
            </form>
          )}

          {/* Perks */}
          <div className="flex items-center justify-center gap-6 mt-5">
            {[
              { icon: '🎁', text: 'এক্সক্লুসিভ অফার' },
              { icon: '🍽️', text: 'সাপ্তাহিক রেসিপি' },
              { icon: Bell, text: 'স্টক আপডেট', isIcon: true },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-gray-500 text-xs">
                {item.isIcon ? (
                  <Bell className="w-3.5 h-3.5" />
                ) : (
                  <span>{item.icon as string}</span>
                )}
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
